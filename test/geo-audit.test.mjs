// Tests for cli/geo-audit.mjs. Run: npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { audit, parseRobots, isAllowed, parseArgs, formatMarkdown } from '../cli/geo-audit.mjs';

const BODY = '<p>' + '团队版每月 299 元，含 20 个席位，超出部分每席 20 元。'.repeat(12) + '</p>';
const page = (head, body = BODY, lang = ' lang="zh-CN"') =>
  `<!doctype html><html${lang}><head><title>价格</title><meta name="description" content="d">${head}</head><body><h1>价格</h1>${body}</body></html>`;

let server; let base;
let robots = 'User-agent: *\nAllow: /\nSitemap: http://example.invalid/sitemap.xml\n';
const routes = {
  '/good': () => [200, {}, page('<link rel="canonical" href="/good">')],
  '/href-first': () => [200, {}, page('<link href="/href-first" rel="canonical">')],
  '/canon-home': () => [200, {}, page('<link rel="canonical" href="/">')],
  '/noindex': () => [200, {}, page('<meta\n  name="robots"\n  content="noindex, follow">')],
  '/header-noindex': () => [200, { 'x-robots-tag': 'googlebot: noindex' }, page('')],
  '/shell': () => [200, {}, page('', '<div id="app"></div><script>render("团队版每月 299 元")</script>')],
  '/split': () => [200, {}, page('', BODY + '<p>高级版<b>每月 599 元</b></p>')],
  '/redirect': () => [301, { location: '/good' }, ''],
  '/missing': () => [404, {}, 'not found'],
  '/waf': (req) => (/bot/i.test(req.headers['user-agent']) && !/GEO-Playbook/.test(req.headers['user-agent'])
    ? [403, {}, 'blocked'] : [200, {}, page('')]),
  '/bad-canon': () => [200, {}, page('<link rel="canonical" href="http://[">')],
  '/meta-only': () => [200, {}, page('<meta property="og:description" content="旗舰版每月 999 元">')],
  '/jsonld': () => [200, {}, page('<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Product"},{"@type":"Offer"}]}</script>')],
};

before(async () => {
  server = createServer((req, res) => {
    const path = req.url.split('?')[0];
    if (path === '/robots.txt') {
      const [st, txt] = typeof robots === 'number' ? [robots, ''] : [200, robots];
      res.writeHead(st, { 'content-type': 'text/plain' }); return res.end(txt);
    }
    const r = routes[path];
    if (!r) { res.writeHead(404); return res.end(); }
    const [status, headers, body] = r(req);
    res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', ...headers });
    res.end(body);
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const find = (r, section, status) => r.checks.filter((c) => c.section === section && c.status === status);

test('robots: longest match wins, Allow wins ties, named group overrides *', () => {
  const r = parseRobots(`User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nUser-agent: OAI-SearchBot\nDisallow: /private/\nAllow: /private/public\n\nSitemap: https://x/s.xml`);
  assert.equal(isAllowed(r, 'Googlebot', '/a'), false);
  assert.equal(isAllowed(r, 'OAI-SearchBot', '/a'), true);
  assert.equal(isAllowed(r, 'GPTBot', '/private/x'), false);
  assert.equal(isAllowed(r, 'GPTBot', '/private/public/y'), true);
  assert.deepEqual(r.sitemaps, ['https://x/s.xml']);
});

test('robots: wildcards and $', () => {
  const r = parseRobots('User-agent: *\nDisallow: /*.pdf$\nDisallow: /search?\n');
  assert.equal(isAllowed(r, 'Bingbot', '/a.pdf'), false);
  assert.equal(isAllowed(r, 'Bingbot', '/a.pdf?x=1'), true);
  assert.equal(isAllowed(r, 'Bingbot', '/search?q=1'), false);
  assert.equal(isAllowed(r, 'Bingbot', '/searching'), true);
});

test('robots: non-ASCII and percent-encoded paths compare in one encoding (RFC 9309)', () => {
  const r = parseRobots('User-agent: *\nDisallow: /私有/\nDisallow: /%7Euser/\n');
  assert.equal(isAllowed(r, 'Googlebot', new URL('https://x/私有/a').pathname), false);
  assert.equal(isAllowed(r, 'Googlebot', '/~user/page'), false);
  assert.equal(isAllowed(r, 'Googlebot', '/公开/a'), true);
});

test('healthy page scores 100', async () => {
  const r = await audit(base + '/good', { lang: 'en', phrase: '团队版每月 299 元' });
  assert.equal(r.problems, 0, JSON.stringify(r.checks, null, 1));
  assert.equal(r.score, 100);
});

test('canonical: attribute order and relative URLs', async () => {
  for (const p of ['/good', '/href-first']) {
    const r = await audit(base + p, { lang: 'en', probe: false });
    assert.equal(find(r, 'canonical', 'pass').length, 1, p);
  }
  const r = await audit(base + '/canon-home', { lang: 'en', probe: false });
  assert.match(find(r, 'canonical', 'warn')[0].msg, /points elsewhere/);
});

test('noindex in multi-line meta and in header', async () => {
  const a = await audit(base + '/noindex', { lang: 'en', probe: false });
  assert.match(find(a, 'index', 'fail')[0].msg, /robots meta/);
  assert.ok(a.score <= 60, 'a critical failure caps the score');
  const b = await audit(base + '/header-noindex', { lang: 'en', probe: false });
  assert.match(find(b, 'index', 'fail')[0].msg, /X-Robots-Tag/);
});

test('JS shell: thin text and phrase only inside a script', async () => {
  const r = await audit(base + '/shell', { lang: 'en', probe: false, phrase: '团队版每月 299 元' });
  const fails = find(r, 'content', 'fail').map((c) => c.msg).join('\n');
  assert.match(fails, /JS-rendered shell/);
  assert.match(fails, /only appears inside <script>/);
});

test('phrase split across tags is a warning', async () => {
  const r = await audit(base + '/split', { lang: 'en', probe: false, phrase: '高级版每月 599 元' });
  assert.match(find(r, 'content', 'warn').map((c) => c.msg).join(), /split across tags/);
});

test('redirects are counted and followed', async () => {
  const r = await audit(base + '/redirect', { lang: 'en', probe: false });
  assert.equal(r.finalUrl, base + '/good');
  assert.match(find(r, 'access', 'warn')[0].msg, /1 redirect/);
});

test('404 page fails', async () => {
  const r = await audit(base + '/missing', { lang: 'en', probe: false });
  assert.match(find(r, 'access', 'fail')[0].msg, /404/);
  assert.ok(r.score < 70);
});

test('robots blocking a search bot fails, training bot is info only', async () => {
  robots = 'User-agent: OAI-SearchBot\nDisallow: /\n\nUser-agent: GPTBot\nDisallow: /\n';
  try {
    const r = await audit(base + '/good', { lang: 'en', probe: false });
    assert.match(find(r, 'robots', 'fail')[0].msg, /OAI-SearchBot/);
    assert.match(find(r, 'robots', 'info')[0].msg, /GPTBot/);
    assert.equal(find(r, 'robots', 'fail').length, 1);
  } finally {
    robots = 'User-agent: *\nAllow: /\n';
  }
});

test('unreachable robots.txt (5xx) is a critical failure, not a pass', async () => {
  robots = 503;
  try {
    const r = await audit(base + '/good', { lang: 'en', probe: false });
    assert.match(find(r, 'robots', 'fail')[0].msg, /503/);
    assert.equal(find(r, 'robots', 'pass').length, 0);
    assert.ok(r.score <= 60);
  } finally {
    robots = 'User-agent: *\nAllow: /\n';
  }
});

test('malformed canonical is a warning, not a crash', async () => {
  const r = await audit(base + '/bad-canon', { lang: 'en', probe: false });
  assert.match(find(r, 'canonical', 'warn')[0].msg, /can't be parsed/);
});

test('phrase only in a head attribute does not count as visible', async () => {
  const r = await audit(base + '/meta-only', { lang: 'en', probe: false, phrase: '旗舰版每月 999 元' });
  assert.match(find(r, 'content', 'fail')[0].msg, /attributes or <head>/);
});

test('firewall probe detects UA-based blocking', async () => {
  const r = await audit(base + '/waf', { lang: 'en' });
  assert.match(find(r, 'firewall', 'fail')[0].msg, /403/);
});

test('JSON-LD types are listed', async () => {
  const r = await audit(base + '/jsonld', { lang: 'en', probe: false });
  assert.match(find(r, 'discovery', 'pass').map((c) => c.msg).join(), /Product, Offer/);
});

test('Chinese output and Markdown report', async () => {
  const r = await audit(base + '/good', { lang: 'zh', probe: false });
  assert.match(r.checks[0].msg, /最终状态码 200/);
  const md = formatMarkdown([r], 'zh');
  assert.match(md, /\| \*\*\d+\*\* \|/);
});

test('argument parsing', () => {
  const o = parseArgs(['a.com', 'https://b.com,c.com', '--phrase', 'x y', '--fail-under', '80', '--no-probe']);
  assert.deepEqual(o.urls, ['a.com', 'https://b.com', 'c.com']);
  assert.equal(o.phrase, 'x y');
  assert.equal(o.failUnder, 80);
  assert.equal(o.probe, false);
});

test('--report creates missing folders', async () => {
  const { mkdtempSync, readFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const dir = mkdtempSync(join(tmpdir(), 'geo-'));
  try {
    // Async so this process can keep serving the fixture page while the CLI fetches it.
    await promisify(execFile)(process.execPath, [new URL('../cli/geo-audit.mjs', import.meta.url).pathname, base + '/good', '--no-probe', '--lang', 'zh', '--report', 'geo/audit.md'], { cwd: dir });
    assert.match(readFileSync(join(dir, 'geo/audit.md'), 'utf8'), /最终状态码 200/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
