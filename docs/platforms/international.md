# 🌍 国际平台规则：Google、Bing/Copilot、ChatGPT、Perplexity、Claude

> [GEO 实战手册](../../README.md) › 平台规则 › 国际

**每家平台的爬虫、控制开关和数据报表都不一样。这里只收官方原文，并告诉你每份文档能证明什么、不能证明什么。**

| ⏱ 用时 | 👤 适合谁 | 📦 做完你手里有 |
| --- | --- | --- |
| 1–2 小时 | 需要被海外 AI 搜索引用的网站 | 一张“平台 × 机器人 × 控制方式”对照表 · 自己站点的配置检查结果 |

**先记住这 3 条**

1. **搜索、训练、用户触发**三类机器人分开控制。例如 ChatGPT 搜索看 `OAI-SearchBot`，训练是 `GPTBot`，用户点链接是 `ChatGPT-User`。
2. Google 官方指南明示：Google Search **不使用 llms.txt**，也没有必需的特殊 schema 或“最佳切块长度”。
3. Bing Webmaster Tools 的 AI Performance 和 Search Console 的生成式 AI 报表，已经能看到部分 AI 展示与引用数据。

> 速查：五大平台的爬虫与控制对照表见本页末尾“[平台对照](#compare)”；可直接改用的 robots 模板见 [`toolkit/robots-ai-bots.txt`](../../toolkit/robots-ai-bots.txt)。全部资料核验于 2026-10-14，规则以链接原文为准。

---

## 学习目标与先修

- 能区分“可抓取、可入索引、可作为答案来源、实际被引用、产生访问”五种状态。
- 能为目标平台单独检查入口、机器人权限、内容要求与可观测指标。
- 能说明一次答案观测的产品、日期、地区、语言及联网状态，避免拿 API 实验代替消费端结论。
- 先修：知道 URL、HTTP 状态码和 robots.txt 的基本含义。不熟悉时，先完成[网站实战](../playbooks/website.md)的前三步。

## 必读 3 项

### 1. Google：生成式搜索优化官方指南

[Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

`🟢 官方` `入门` `英文` · 官方技术指南

- **📌 要点：** Google 如何把已有搜索索引、检索增强生成和查询扩展用于 AI 搜索；为何有独特经验的内容、站点可访问性和清晰的信息结构仍是基础。该指南还分别讨论本地商家、电商、图片、视频和浏览器代理。
- **🟢 官方原文：** 页面需要被索引、可显示摘要，且站点未被 Search Console 的生成式 AI 控制排除。Google Search 不使用 llms.txt；没有必需的特殊 schema，也没有统一的“最佳切块长度”。
- **🛠 动手：** 选一篇现有文章，写出它独有的证据、读者问题、缺失的技术条件；把一个宽泛问题拆成三个研究子问题，再决定是补充原页还是确有必要新增页面。
- **⚠️ 不能推出：** 查询扩展不是让你批量生成每种问法的页面。本文适用于 Google Search，不直接证明 Gemini App、其他搜索引擎或 API 的行为。

### 2. OpenAI：搜索、训练与用户请求机器人

[Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)

`🟢 官方` `入门至进阶` `英文` · 官方机器人说明

- **📌 要点：** `OAI-SearchBot` 用于 ChatGPT 搜索；`GPTBot` 涉及可能用于模型训练的抓取；`ChatGPT-User` 支持用户触发的访问。说明虽位于开发者文档站，正文明确涉及 ChatGPT 搜索。
- **🟢 官方原文：** 搜索与训练的 robots.txt 设置独立；允许搜索机器人不等于必须允许训练机器人。`ChatGPT-User` 不是自动网页爬虫，也不负责决定是否出现在搜索中；其用户请求可能不适用 robots.txt 规则。
- **🛠 动手：** 为自有站点做三列表：目标用途、对应机器人、当前 robots / CDN / WAF 状态。用页面列出的官方 IP 范围复核日志身份，别只看 User-Agent 字符串。
- **⚠️ 不能推出：** 放行只解决访问条件，不能保证引用。禁用搜索机器人后仍可能出现导航链接；“完全没出现在任何答案中”不能由一条 robots 规则推出。

### 3. Bing / Copilot：AI Performance 能测到什么

[Introducing AI Performance in Bing Webmaster Tools Public Preview](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)

`🟢 官方` `入门` `英文` · 官方产品公告与指标说明

- **📌 要点：** Bing Webmaster Tools 的 AI Performance 如何呈现 Microsoft Copilot、Bing AI 摘要及部分合作集成中的引用。
- **🟢 官方原文：** 总引用数、每日平均被引用页面数、页面引用活动与 grounding queries 是不同指标；其中 grounding queries 仅为样本。聚合引用不表示答案中的位置、排名或权威程度。
- **🛠 动手：** 有站点权限时导出一个固定时间窗，选择三页，将“引用次数、实际站点访问、转化”分别记录；没有权限时先根据文档建立空表并写好指标定义。
- **⚠️ 不能推出：** 这是 2026-02-10 的公开预览公告，不能单凭公告推断每个账号当前拥有相同功能；覆盖部分 AI 产品，不能当成全网 AI 可见度。

## 延伸：按你要解决的问题选择

### 4. Google：生成式 AI 的独立站点控制

[Search generative AI control](https://support.google.com/webmasters/answer/16908024)

`🟢 官方` `进阶` `英文` · 官方产品帮助

- **📌 要点：** Search Console 的包含、排除、从父属性继承三种设置；域名属性、子域和 URL 前缀属性的范围。
- **🟢 官方原文：** 文档注明该控制于 2026-08-31 全球推出，适用于 AI Overviews、AI Mode 和 Discover 的生成式 AI 功能；顶层默认包含，子属性可能继承。此控制与训练控制分开，也不作为其他搜索部分的排名或收录信号。
- **🛠 动手：** 画出自己的域名与属性继承图，记录当前设置与设置来源。学习时先检查，不要为了试验直接排除业务站点。
- **⚠️ 不能推出：** 这不是全站搜索移除功能，也不是禁止第三方转述的机制；设置变更存在处理和缓存延迟。

### 5. Google：生成式 AI 展示量报表

[Introducing Search Generative AI performance reports in Search Console](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)

`🟢 官方` `入门` `英文` · 官方产品公告

- **📌 要点：** AI 搜索表现需要明确口径，不能直接把所有 Google 流量都称为 GEO 流量。
- **🟢 官方原文：** 公告于 2026-06-03 发布，页首更新注明 2026-08-31 已全球推出。专用视图包含展示量、页面、国家、日期和搜索中的设备维度；这些数据仍计入总体表现报表。
- **🛠 动手：** 用同一站点、同一时间窗保存 AI 专用视图与总体视图，标清分母。将展示量变化与访问、转化放在不同列，不作直接替换。
- **⚠️ 不能推出：** 此处不把公告未列出的点击、查询词或 API 导出能力写成已支持。旧教程中“只能看总体 Web、完全没有 AI 专用视图”的说法需要按日期重审。

### 6. Google：Googlebot 与 Google-Extended 的用途边界

[List of Google's common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended)

`🟢 官方` `进阶` `英文` · 官方机器人参考

- **📌 要点：** `Googlebot` 抓取偏好影响搜索功能；`Google-Extended` 是用途控制 token，不是具有独立 HTTP User-Agent 的机器人。
- **🟢 官方原文：** 文档将 Google-Extended 用于未来 Gemini 模型训练及所列 Gemini / Vertex AI grounding 用途，并明确它不影响网站被 Google Search 收录，也不是搜索排名信号。
- **🛠 动手：** 把“Google Search 展示、生成式 Search 包含控制、Gemini 相关用途控制”列成三行，为每行写出实际控制位置。
- **⚠️ 不能推出：** 不应在日志中找不到 `Google-Extended` 字符串就认定控制失效；具体产品范围应同时查看第 4 项。不要把某一份文档中的产品清单扩展成所有 Google AI 产品。

### 7. Bing 生态：IndexNow 的提交与回执

[IndexNow Documentation](https://www.indexnow.org/documentation)

`🟢 官方` `进阶` `英文` · 协议官方文档

- **📌 要点：** 如何证明 URL 所属主机的控制权，在页面新增、修改、删除后通知参与协议的搜索引擎；单条与批量提交的区别。
- **🟢 官方原文：** HTTP `200` 表示已收到提交；`202` 表示收到 URL、密钥验证待完成。提交的 URL 会在参与协议的搜索引擎之间共享。
- **🛠 动手：** 在自有测试站部署密钥文件，新增一页、更新一页、删除一页；记录通知时间、回执、真实抓取和实际索引状态四个独立字段。
- **⚠️ 不能推出：** 接收回执不是已抓取、已索引或已被 Copilot 引用；不能推断所有搜索引擎和所有 AI 产品参与协议。只提交自己管理的站点。

### 8. ChatGPT：消费端的搜索、来源与个性化

[Searching the web with ChatGPT](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)

`🟢 官方` `入门` `英文` · 官方消费端帮助

- **📌 要点：** 自动或手动搜索、来源列表与引用如何呈现；查询可能被改写并交给搜索合作方，地区与记忆设置可能影响搜索。
- **🟢 官方原文：** 搜索排名使用多个因素，位置没有保证；站点可用性检查包括 OAI-SearchBot 与主机 / CDN 对官方 IP 的放行。引用也可能错误或过时，仍需读来源正文。
- **🛠 动手：** 固定语言和地区，对同一问题分别做不指定品牌与指定品牌的搜索；保存实际引用 URL，逐条核对来源是否支持答案中的主张。
- **⚠️ 不能推出：** “给定 URL 后可读”与“开放问题中主动检索到”是不同测试。本页不是 Responses API 排序文档，API 结果也不能替代这里的消费端观测。

### 9. Perplexity：搜索机器人、用户请求与 WAF

[Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

`🟢 官方` `进阶` `英文` · 官方机器人与基础设施文档

- **📌 要点：** `PerplexityBot` 用于搜索展示和链接；`Perplexity-User` 用于用户请求；官方 IP 列表与 WAF 配置如何配合。
- **🟢 官方原文：** 该页说明这两种代理不用于基础模型训练抓取；用户触发的 fetch 通常忽略 robots.txt。WAF 示例将 User-Agent 与 IP 条件结合，IP 清单应使用当前版本。
- **🛠 动手：** 对一篇公开测试文章核对 robots、HTTP 回应、WAF 挑战和来源 IP 四层证据；另做一次不提供 URL 的搜索任务，比较两种访问路径。
- **⚠️ 不能推出：** 不要把“通常忽略 robots.txt”推广给全部机器人，更不能将其视为身份验证或访问授权机制。该页不能证明 Sonar API 与消费端使用完全相同的检索和排序流程。

### 10. Anthropic：三类机器人与退出方式

[Does Anthropic crawl data from the web, and how can site owners block the crawler?](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

`🟢 官方` `进阶` `英文` · 官方机器人说明

- **📌 要点：** `ClaudeBot` 的训练用途、`Claude-SearchBot` 的搜索用途、`Claude-User` 的用户请求用途及子域控制。
- **🟢 官方原文：** 文档声明 Anthropic 机器人遵循 robots.txt，支持 `Crawl-delay`；搜索与用户请求机器人的限制可能影响对应可见性。正文提供来源 IP 清单入口。
- **🛠 动手：** 对比第 2、9 项：不要复制其他公司的用户请求机器人规则到 Claude。列出主域和每个子域的配置，说明每项配置的业务目的。
- **⚠️ 不能推出：** 这里记录平台声明，不代表本项目完成了所有机器人行为的独立审计。限制训练不等于让已经发布的模型遗忘历史内容。

### 11. Claude：消费端 Web search 与直接抓取

[Enable and use web search](https://support.claude.com/en/articles/10684626-enable-and-use-web-search)

`🟢 官方` `入门` `英文` · 官方消费端帮助

- **📌 要点：** 搜索与直接提供链接的 web fetch 如何分别工作；来源核对、工作区权限和位置因素如何影响测试。
- **🟢 官方原文：** 消费端可以使用网络来源和引用；提供特定 URL 时可直接取回页面内容。页面也说明不同体验的开关方式可能不同，联网能力仍受产品和账户条件约束。
- **🛠 动手：** 分别测试“搜索并比较三种方案”和“阅读此指定 URL”，记录是否发生搜索、是否引用目标文章、引用内容是否吻合。
- **⚠️ 不能推出：** 一次成功 fetch 不能证明该网页在开放搜索中的覆盖率；Claude API 的工具版本、域名过滤和调用额度不自动适用于 Claude 消费端。

<a id="compare"></a>

## 平台对照：先确定你在控制哪件事

下表是上述官方原文的归纳；不是通用的全放行配置模板。

| 产品 / 用途 | 已明确的入口或控制 | 学习时要分开的事 |
| --- | --- | --- |
| Google Search 的 AI 功能 | Googlebot、索引 / 摘要条件、Search Console 生成式 AI 控制 | 搜索索引、AI 包含状态、Google-Extended 用途控制 |
| Bing / Copilot 可见度 | Bing Webmaster Tools AI Performance；IndexNow 更新通知 | 已收到通知、已索引、已引用、真正带来访问 |
| ChatGPT 搜索 | OAI-SearchBot、CDN / 主机允许访问 | GPTBot 训练用途、ChatGPT-User 用户访问 |
| Perplexity | PerplexityBot、官方 IP / WAF 配置 | Perplexity-User 与自动搜索抓取 |
| Claude 搜索 | Claude-SearchBot、Claude-User 的各自访问规则 | ClaudeBot 训练用途、消费端与 API |

## 本轮未纳入精选的访问与版本记录

以下是核验透明度记录，不是额外必读资源：

| 页面 | 本次状态 | 处理 |
| --- | --- | --- |
| [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) | 正文访问受限：读取结果仅有需要 JavaScript 的壳页 | 不把搜索摘要冒充已读正文；本页 Bing 精选使用可读官方公告与 IndexNow 协议 |
| [旧 OpenAI Publishers and Developers FAQ 入口](https://help.openai.com/en/articles/12627856) | 内容变更：打开后重定向到其他产品的退役帮助页 | 不沿用搜索缓存中的旧 publisher 指引；改读第 2、8 项当前页面 |
| [Google 较早的 AI features 页面](https://developers.google.com/search/docs/appearance/ai-features) | 已读，但仍显示 2025-12-10 更新版本，部分说明落后于 2026 新指南和公告 | 涉及控制与报表，以本页第 1、4、5 项的新资料为准 |

---

<div align="center">

← [多语言实战](../playbooks/multilingual.md) · [🏠 目录](../../README.md) · [中文平台](china.md) →

<sub>有帮助的话，回 [首页](../../README.md) 点个 ⭐ Star；发现错误或过时信息，欢迎 [提 Issue](https://github.com/Fangx-AI/geo-doctor/issues/new/choose)。</sub>

</div>
