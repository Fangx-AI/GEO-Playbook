#!/usr/bin/env node
// 中文网站 AI 爬虫封锁榜：读取每个网站公开的 robots.txt，判断各 AI / 搜索爬虫能否抓取首页。
// Usage:
//   node scripts/ai-crawler-scan.mjs [data/sites-cn.txt]        scan, write data/ai-crawler-scan.json
//   node scripts/ai-crawler-scan.mjs --render data/ai-crawler-scan.json   render docs/ai-crawler-leaderboard.md
import { readFileSync, writeFileSync } from 'node:fs';
import { parseRobots, isAllowed } from '../cli/geo-audit.mjs';

const UA = 'Mozilla/5.0 (compatible; GEO-Playbook-scan/1.0; +https://github.com/Fangx-AI/GEO-Playbook)';

// Columns shown in the leaderboard, in order. kind: search = affects AI / web search answers; train = training only.
export const BOTS = [
  { token: 'Baiduspider', label: '百度', kind: 'search' },
  { token: 'Googlebot', label: 'Google', kind: 'search' },
  { token: 'Bingbot', label: 'Bing / Copilot', kind: 'search' },
  { token: 'OAI-SearchBot', label: 'ChatGPT 搜索', kind: 'search' },
  { token: 'ChatGPT-User', label: 'ChatGPT 用户访问', kind: 'search' },
  { token: 'PerplexityBot', label: 'Perplexity', kind: 'search' },
  { token: 'Claude-SearchBot', label: 'Claude 搜索', kind: 'search' },
  { token: 'GPTBot', label: 'GPTBot（训练）', kind: 'train' },
  { token: 'ClaudeBot', label: 'ClaudeBot（训练）', kind: 'train' },
  { token: 'Google-Extended', label: 'Google-Extended（训练）', kind: 'train' },
  { token: 'Bytespider', label: 'Bytespider（字节）', kind: 'train' },
  { token: 'CCBot', label: 'CCBot（训练）', kind: 'train' },
];
const AI_SEARCH = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot'];

export function readSites(file) {
  return readFileSync(file, 'utf8').split('\n')
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => { const [domain, name, category] = l.split('|').map((x) => x.trim()); return { domain, name, category }; });
}

async function fetchRobots(domain) {
  let url = `https://${domain}/robots.txt`;
  for (let i = 0; i <= 5; i++) {
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'user-agent': UA } });
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) { await res.body?.cancel(); url = new URL(loc, url).href; continue; }
    return { status: res.status, body: await res.text(), url };
  }
  throw new Error('too many redirects');
}

// Classify one site. state: ok (robots parsed) | none (4xx: no robots, everything allowed) | error (5xx / network: unknown).
export function classify(status, body) {
  if (status >= 200 && status < 300) {
    // Some sites answer robots.txt with an HTML page; treat that as "no rules".
    if (/^\s*</.test(body)) return { state: 'none', allowed: Object.fromEntries(BOTS.map((b) => [b.token, true])) };
    const robots = parseRobots(body);
    return { state: 'ok', allowed: Object.fromEntries(BOTS.map((b) => [b.token, isAllowed(robots, b.token, '/')])) };
  }
  if (status >= 400 && status < 500) return { state: 'none', allowed: Object.fromEntries(BOTS.map((b) => [b.token, true])) };
  return { state: 'error', allowed: null };
}

async function scan(file) {
  const sites = readSites(file);
  const results = [];
  const queue = [...sites];
  async function worker() {
    for (let s = queue.shift(); s; s = queue.shift()) {
      try {
        const r = await fetchRobots(s.domain);
        results.push({ ...s, status: r.status, robotsUrl: r.url, ...classify(r.status, r.body), robots: r.body.slice(0, 20000) });
      } catch (e) {
        results.push({ ...s, status: null, error: String(e.cause?.code || e.message), state: 'error', allowed: null });
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  results.sort((a, b) => sites.findIndex((x) => x.domain === a.domain) - sites.findIndex((x) => x.domain === b.domain));
  return { scannedAt: new Date().toISOString(), from: process.env.SCAN_FROM || 'local', bots: BOTS, results };
}

const mark = (v) => (v ? '✅' : '🚫');

export function render(data) {
  const ok = data.results.filter((r) => r.state !== 'error');
  const n = ok.length;
  const count = (fn) => ok.filter(fn).length;
  const pct = (k) => (n ? Math.round((k / n) * 100) : 0);
  const blocks = (tok) => count((r) => !r.allowed[tok]);
  const allAiSearchBlocked = count((r) => AI_SEARCH.every((t) => !r.allowed[t]));
  const baiduOnly = count((r) => r.allowed.Baiduspider && AI_SEARCH.every((t) => !r.allowed[t]));
  const openAll = count((r) => BOTS.every((b) => r.allowed[b.token]));
  const date = data.scannedAt.slice(0, 10);

  const L = [];
  L.push('# 🚧 中文网站 AI 爬虫封锁榜');
  L.push('');
  L.push(`> [GEO 实战手册](../README.md) › AI 爬虫封锁榜 · 扫描日期 ${date} · 可复现：\`node scripts/ai-crawler-scan.mjs\``);
  L.push('');
  L.push(`**我们读取了 ${data.results.length} 个知名中文网站公开的 robots.txt，看它们的首页允许哪些 AI 和搜索爬虫抓取。成功读取 ${n} 个。**`);
  L.push('');
  L.push('| 发现 | 网站数 | 占比 |');
  L.push('| --- | ---: | ---: |');
  L.push(`| 🚫 ChatGPT 搜索（OAI-SearchBot）抓不了首页 | ${blocks('OAI-SearchBot')} | ${pct(blocks('OAI-SearchBot'))}% |`);
  L.push(`| 🚫 4 个 AI 搜索爬虫（ChatGPT 搜索、ChatGPT 用户访问、Perplexity、Claude 搜索）全部挡住 | ${allAiSearchBlocked} | ${pct(allAiSearchBlocked)}% |`);
  L.push(`| 🎯 只放行百度，AI 搜索爬虫全部挡住 | ${baiduOnly} | ${pct(baiduOnly)}% |`);
  L.push(`| 🚫 屏蔽 GPTBot（OpenAI 训练） | ${blocks('GPTBot')} | ${pct(blocks('GPTBot'))}% |`);
  L.push(`| 🚫 屏蔽 Bytespider（字节跳动） | ${blocks('Bytespider')} | ${pct(blocks('Bytespider'))}% |`);
  L.push(`| ✅ 对表中所有爬虫都不设限 | ${openAll} | ${pct(openAll)}% |`);
  L.push('');
  L.push('**怎么读这张表**：很多中文网站的 robots.txt 是"白名单"写法，只列出百度、谷歌等老牌爬虫，最后一句 `User-agent: *` + `Disallow: /` 把其他所有爬虫挡在门外。这样写的时候，AI 搜索爬虫往往不是被"故意屏蔽"，而是**根本没被想到**。结果是：用户在 ChatGPT、Perplexity、Claude 里问到相关问题时，这些网站的页面很难被抓取和引用。');
  L.push('');
  L.push('屏蔽训练爬虫（GPTBot、ClaudeBot、Google-Extended、CCBot）是网站的正当选择，不影响搜索可见度；表里单独列出，只作参考。');
  L.push('');
  L.push('> 想查自己的网站？一行命令：`npx github:Fangx-AI/GEO-Playbook https://你的网址`');
  L.push('');

  const cats = [...new Set(data.results.map((r) => r.category))];
  const head = ['网站', ...BOTS.map((b) => b.label)];
  for (const c of cats) {
    L.push(`## ${c}`);
    L.push('');
    L.push(`| ${head.join(' | ')} |`);
    L.push(`| ${head.map((_, i) => (i ? ':-:' : '---')).join(' | ')} |`);
    for (const r of data.results.filter((x) => x.category === c)) {
      const name = `[${r.name}](https://${r.domain}/robots.txt)`;
      if (r.state === 'error') { L.push(`| ${name} | ${BOTS.map(() => '—').join(' | ')} |`); continue; }
      const note = r.state === 'none' ? ' ¹' : '';
      L.push(`| ${name}${note} | ${BOTS.map((b) => mark(r.allowed[b.token])).join(' | ')} |`);
    }
    L.push('');
  }
  const errs = data.results.filter((r) => r.state === 'error');
  L.push('## 方法与局限');
  L.push('');
  L.push(`- **扫描什么**：每个网站请求 1 次 \`https://域名/robots.txt\`（跟随最多 5 次跳转），按 [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309) 的最长匹配规则判断各爬虫能否抓取首页 \`/\`。判断逻辑与 [geo-audit](../cli/geo-audit.mjs) 相同，有单元测试。`);
  L.push(`- **扫描地点**：${data.from}。部分网站对境外请求有不同响应，结果以网站当时返回的内容为准。`);
  L.push('- **只看 robots.txt**：防火墙 / CDN 按 UA 或 IP 拦截、页面 `noindex`、正文靠 JavaScript 渲染等问题不在这张表里，这些要用 geo-audit 逐页检查。真实爬虫是否来访，要以网站日志为准。');
  L.push('- **只看首页**：有的网站首页放行、内页屏蔽，或反过来。');
  L.push('- ¹ 没有 robots.txt（返回 4xx 或 HTML 页面），按规范视为不限制。');
  L.push(`- — 扫描时读取失败（超时、5xx 或连接被拒，共 ${errs.length} 个），不计入占比的分母。`);
  L.push('- **名单**：[data/sites-cn.txt](../data/sites-cn.txt)，原始数据：[data/ai-crawler-scan.json](../data/ai-crawler-scan.json)。漏了谁、判断错了，欢迎提 [issue](https://github.com/Fangx-AI/GEO-Playbook/issues/new/choose) 或 PR。');
  L.push('- robots.txt 随时会改，本表只代表扫描当天的状态。');
  L.push('');
  return L.join('\n');
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const args = process.argv.slice(2);
  if (args[0] === '--render') {
    const data = JSON.parse(readFileSync(args[1] || 'data/ai-crawler-scan.json', 'utf8'));
    writeFileSync('docs/ai-crawler-leaderboard.md', render(data));
    console.log('wrote docs/ai-crawler-leaderboard.md');
  } else {
    const data = await scan(args[0] || 'data/sites-cn.txt');
    writeFileSync('data/ai-crawler-scan.json', JSON.stringify(data, null, 1) + '\n');
    writeFileSync('docs/ai-crawler-leaderboard.md', render(data));
    const errs = data.results.filter((r) => r.state === 'error').length;
    console.log(`scanned ${data.results.length} sites, ${errs} errors`);
  }
}
