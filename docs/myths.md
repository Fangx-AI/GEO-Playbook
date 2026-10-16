# ❌ 12 个流行的 GEO 误区，官方文档和研究怎么说

> [GEO 实战手册](handbook.md) › 误区辟谣

**花钱之前先读这一页。每条都附上官方原文或研究出处，你可以自己点开核对。** 核验日期 2026-10-14。

| # | 流行说法 | 实际情况 |
| --- | --- | --- |
| 1 | [做个 llms.txt，AI 就能收录你](#m1) | Google Search 明确不使用 llms.txt |
| 2 | [必须加特殊 schema / 把内容切成固定长度](#m2) | Google：没有必需的特殊 schema，也没有“最佳切块长度” |
| 3 | [屏蔽 GPTBot，就会从 ChatGPT 搜索里消失](#m3) | 搜索和训练是两个不同的机器人，分开控制 |
| 4 | [屏蔽 Google-Extended 会掉 Google 排名](#m4) | 官方明确：不影响收录，也不是排名信号 |
| 5 | [被 AI 引用了，就会有流量](#m5) | Pew：AI 摘要里的链接只有约 1% 被点击 |
| 6 | [AI 给了出处，内容就是对的](#m6) | Tow Center：超过 60% 的找源回答有错 |
| 7 | [提交了 sitemap / IndexNow 就会被收录](#m7) | 提交回执 ≠ 已抓取 ≠ 已索引 ≠ 被引用 |
| 8 | [把每种问法都写成一篇文章](#m8) | 查询扩展不是批量造页的理由 |
| 9 | [某案例可见度涨了 500%，照做就行](#m9) | 先问分母、对照组和口径 |
| 10 | [页面能打开（200），AI 就能读](#m10) | 可能是空壳、验证码或“软 404” |
| 11 | [robots.txt 能保护隐私内容](#m11) | 它只管抓取，不是访问控制 |
| 12 | [国产 AI 有一个可以“买”到的推荐排名公式](#m12) | 截至核验日，没有公开的站长推荐规则 |

---

<a id="m1"></a>

## 1. ❌ “做个 llms.txt，AI 就能收录你”

✅ **Google 的生成式搜索官方指南明确写着：Google Search 不使用 llms.txt。** 其他平台也没有把它列为收录条件。

👉 **该做的**：确保页面能被正常抓取和索引，正文在原始 HTML 里。见 [网站实战](playbooks/website.md)。

📎 [Google：Optimizing your website for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · 🟢 官方

<a id="m2"></a>

## 2. ❌ “必须加特殊 schema / 把内容切成 200 字一段”

✅ 同一份 Google 指南说明：AI 功能**没有必需的特殊 schema**，也**没有统一的最佳切块长度**。结构化数据仍然有用，但它的作用是准确描述实体（组织、商品、价格），不是“AI 专用开关”。

👉 **该做的**：把事实写清楚、写完整，再用标准结构化数据如实描述。见 [电商](playbooks/ecommerce.md)、[B2B](playbooks/b2b.md)。

📎 [Google 官方指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · 🟢 官方

<a id="m3"></a>

## 3. ❌ “屏蔽 GPTBot，就会从 ChatGPT 搜索里消失”

✅ OpenAI 的三个机器人用途不同：`OAI-SearchBot` 负责 ChatGPT 搜索，`GPTBot` 涉及训练，`ChatGPT-User` 是用户触发的访问。**搜索和训练的 robots 设置是独立的。** Anthropic（`Claude-SearchBot` / `ClaudeBot` / `Claude-User`）和 Perplexity（`PerplexityBot` / `Perplexity-User`）也是同样的分法。

👉 **该做的**：想被 AI 搜索引用，就放行搜索机器人；训练要不要放行，是单独的商业决定。直接用 [robots 模板](../toolkit/robots-ai-bots.txt)。

📎 [OpenAI 爬虫说明](https://developers.openai.com/api/docs/bots) · [Anthropic 爬虫说明](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) · [Perplexity 爬虫说明](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) · 🟢 官方

<a id="m4"></a>

## 4. ❌ “屏蔽 Google-Extended 会掉 Google 排名”

✅ `Google-Extended` 是一个用途控制标记，不是独立爬虫。官方明确：它**不影响网站被 Google Search 收录，也不是搜索排名信号**。Google Search 里 AI 功能的包含与排除，另有 Search Console 的独立控制（2026-08-31 全球推出）。

👉 **该做的**：分清三件事：搜索展示（Googlebot）、搜索里的生成式 AI 功能（Search Console 控制）、Gemini 相关用途（Google-Extended）。

📎 [Google 常见爬虫列表](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended) · [Search 生成式 AI 控制](https://support.google.com/webmasters/answer/16908024) · 🟢 官方

<a id="m5"></a>

## 5. ❌ “被 AI 引用了，就会有流量”

✅ Pew 研究中心分析了 900 名美国成年人的 68,879 次真实 Google 搜索：出现 AI 摘要时，用户点击传统结果的比例是 **8%**，没有摘要时是 **15%**；摘要里的链接只有约 **1%** 被点击。（观察性研究，不是随机实验。）

👉 **该做的**：把“被提及、被引用、带来访问、带来成交”分成四层分别记录，不拿引用截图冒充营收。见 [测量课](measurement.md)。

📎 [Pew Research Center, 2025-07-22](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/) · 📊 独立研究

<a id="m6"></a>

## 6. ❌ “AI 给了出处，内容就是对的”

✅ 哥伦比亚大学 Tow Center 测试 8 个 AI 搜索产品，用 1,600 次查询让它们给新闻摘录找原文。按研究定义，**合计超过 60% 的回答包含错误**，包括虚构链接、把转载当原文。

👉 **该做的**：打开每条引用，核对它是否真的支持旁边那句话。用 [提示词 P7](../toolkit/prompts.md#p7) 辅助，再人工抽查。

📎 [Tow Center / CJR, 2025-03-06](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) · 📊 独立研究

<a id="m7"></a>

## 7. ❌ “提交了 sitemap / IndexNow 就会被收录”

✅ Google 说明 sitemap 只是帮助发现 URL 的提示，不规定何时处理。IndexNow 文档写明：HTTP `200` 只表示**收到了提交**。收到、抓取、索引、被 AI 引用，是四个不同状态。

👉 **该做的**：记录“提交成功 / 已抓取 / 已索引 / 被引用”四个独立字段，不要一天提交几十次。

📎 [Google sitemap 说明](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [IndexNow 文档](https://www.indexnow.org/documentation) · 🟢 官方

<a id="m8"></a>

## 8. ❌ “AI 会把问题拆成很多子问题，所以每种问法都写一篇”

✅ Google 的指南确实介绍了查询扩展（query fan-out），但它强调的是**有独特经验的内容、清晰的信息结构**，不是为每种问法批量造页面。同义问题各写一篇，只会让站内页面互相重复。

👉 **该做的**：按用户“要做的决定”分组，一个决定一页，写完整。见 [改稿实战课](content-rewrite.md)。

📎 [Google 官方指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · 🟢 官方

<a id="m9"></a>

## 9. ❌ “某案例可见度涨了 500%，照着做就行”

✅ 一家服务商自报某品牌可见率从 8.48% 涨到 56.35%。这是 **+47.87 个百分点**，相对增长约 564.5%。但它没有公开问题集、分母、对照组和改了哪些页面，读者无法复算。另一个案例原始均值只是 119→127（+6.7%），对照校正后被报告为 +60%。

👉 **该做的**：看到任何涨幅，先问四个问题：分母多少？有没有对照？同期还改了什么？没变好的样本去哪了？见 [案例精读](cases.md)。

📎 [案例精读](cases.md) · 🟡 实施方自报

<a id="m10"></a>

## 10. ❌ “页面能在浏览器打开、返回 200，AI 就能读到”

✅ Google 明确区分正常页面和“返回 200 的错误页”（软 404）。另外，正文依赖 JavaScript 渲染时，原始 HTML 可能只是一个空的 `<div id="root">`。Google 能执行 JS，不代表所有 AI 爬虫都有同样能力。

👉 **该做的**：保存原始 HTML，搜一句页面里独特的正文。用 [`geo-audit.sh`](../toolkit/geo-audit.sh)（Windows 用 [`geo-audit.ps1`](../toolkit/geo-audit.ps1)）一条命令检查。

📎 [Google：HTTP 状态与软 404](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes) · [JavaScript SEO 基础](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) · 🟢 官方

<a id="m11"></a>

## 11. ❌ “不想被 AI 看到的内容，写进 robots.txt 就安全了”

✅ robots.txt 管的是抓取，**不是访问控制**，也不能单独保证 URL 从搜索结果中消失。部分平台的“用户触发访问”（如 `Perplexity-User`）通常不遵循 robots.txt。

👉 **该做的**：私密内容放在登录或权限控制之后。

📎 [Google robots 说明](https://developers.google.com/search/docs/crawling-indexing/robots/intro) · [Perplexity 爬虫说明](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) · 🟢 官方

<a id="m12"></a>

## 12. ❌ “国产 AI 有一个推荐排名公式，交钱就能上”

✅ 截至 2026-10-14，豆包、DeepSeek、百度、元宝、Kimi、千问都**没有公开**站长推荐规则或排名公式。百度搜索 API 返回的 `authority_score` 字段，不等于公开了评分算法；开发者 API 的检索参数也不能直接代表 App 的推荐逻辑。

👉 **该做的**：把自己能控制的公开资料做准、做一致，然后用固定题集持续观察。见 [中文平台](platforms/china.md)。遇到承诺“保证上推荐”的服务，先要他们的分母和原始记录。

📎 [中文平台一手资料汇总](platforms/china.md) · 🟢 官方 + 本项目整理


---

<div align="center">

← [GEO 5 分钟入门](basics.md) · [🏠 目录](handbook.md) · [改稿实战课](content-rewrite.md) →

<sub>有帮助的话，回 [首页](../README.md) 点个 ⭐ Star；发现错误或过时信息，欢迎 [提 Issue](https://github.com/Fangx-AI/geo-doctor/issues/new/choose)。</sub>

</div>
