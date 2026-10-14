# 第 1 步 · 体检：AI 爬虫能不能读到你

**目的：** 先排除最便宜、最致命的问题。页面读不到，后面写再多内容也没用。

## 怎么做

### 有命令行和网络时（Claude Code、Codex、Kimi Code、TRAE 等）

在 skill 目录下运行（需要 Node.js 18+）：

```bash
node scripts/geo-audit.mjs https://用户网址 --phrase "页面上一句关键正文" --report geo/audit.md --lang zh
```

- 一次可以查多个页面，用空格隔开：首页、产品页、价格页、帮助中心各挑一个。
- `--phrase` 选一句**用户最希望 AI 引用**的话，例如价格、核心功能、适用人群。
- Codex 等默认断网的环境：先请用户允许本次联网。
- 找不到脚本时，可以用 `npx github:Fangx-AI/GEO-Playbook 网址 --report geo/audit.md` 代替。

### 不能运行命令时（豆包、扣子、网页版助手等）

用你的网页读取能力逐项手动检查，结果同样写进 `geo/audit.md`：

1. 打开 `https://域名/robots.txt`，看下表的爬虫有没有被 `Disallow: /` 挡住（包括 `User-agent: *` 最后一句全挡的"白名单"写法）。
2. 打开页面源代码（不是渲染后的页面），搜索关键正文，看它在不在原始 HTML 里。
3. 查 `<meta name="robots">` 里有没有 `noindex`，`<link rel="canonical">` 是不是指向本页。

实在做不了，就请用户在电脑上运行上面的 `npx` 命令，把输出贴回来。

## 重点爬虫

| 爬虫 | 关系到 | 说明 |
| --- | --- | --- |
| Baiduspider | 文心、百度 AI 搜索 | 被挡就进不了百度索引 |
| Bytespider | 字节系（豆包等） | 🟡 遵守 robots 的情况有争议；豆包专用爬虫没有官方验证方式 |
| Googlebot、Bingbot | Google、Copilot，以及借用必应结果的产品 | |
| OAI-SearchBot、PerplexityBot、Claude-SearchBot | 海外 AI 搜索 | 目标只有国内 AI 时可以不管 |
| GPTBot、ClaudeBot、CCBot、Google-Extended | 只用于训练 | 挡住不影响搜索，按用户意愿决定 |

## 常见问题怎么修

| 体检结果 | 修法 |
| --- | --- |
| robots 挡住了搜索类爬虫 | 删掉对应的 `Disallow`；"白名单"写法要把目标 AI 相关的爬虫加进放行列表 |
| 有 `noindex` | 多半是测试环境配置带到了正式站；在 CMS 或框架配置里关掉 |
| canonical 指向首页或别的页 | 改成指向本页自己的地址 |
| 关键正文只在 JavaScript 里 | 改成服务端渲染或预渲染。主流 AI 爬虫都不执行 JavaScript（📊 [Vercel 2024](https://vercel.com/blog/the-rise-of-the-ai-crawler)） |
| 防火墙或 CDN 拦截机器人 | 在 WAF 里放行搜索类爬虫，并以官方公布的 IP 段核验，不要只看 UA |
| 没有 sitemap | 生成 `sitemap.xml`，并在 robots.txt 里声明 |
| 没有提交到搜索引擎 | 文心：提交百度搜索资源平台（ziyuan.baidu.com）；Copilot 等：提交 Bing Webmaster Tools |

## 小程序

- 🟢 小程序页面能否被微信搜索收录，由 `sitemap.json` 控制（[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html)），这只影响微信自己的搜索。
- ❓ 没有证据表明豆包、DeepSeek、千问等能读取小程序内的内容。
- 所以小程序一定要有**能公开访问的网页**（官网或介绍页）和**公众号文章**，把关键事实写在那里，再对这些网页做体检。

## 完成标准

- `geo/audit.md` 列出每个页面的得分、致命问题和修法
- 告诉用户：哪些必须先修（致命问题），哪些可以之后再修
