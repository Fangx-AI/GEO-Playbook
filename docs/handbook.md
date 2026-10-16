> [GEO 医生](../README.md) › GEO 实战手册

# 📚 GEO 实战手册

GEO 医生背后的方法都写成了公开手册：每条结论附官方原文或研究出处，不装 skill 也能照着做。

<a id="routes"></a>

## 🗺 按你的项目选一条路线

不用从头读完。找到你的项目，点进去照着做。每条路线都写明了用时、交付物和验收标准。

| 我是… | 路线 | 做完你手里有 | 用时 |
| --- | --- | --- | --- |
| 🌐 官网、博客、公司网站 | [网站实战](playbooks/website.md) | 访问诊断 · 一个改好的页面 · 基线表 | 7 天 |
| 💬 微信小程序 | [小程序实战](playbooks/mini-program.md) | 公开服务说明 · 路径映射 · 四环境入口实测 | 7 天 |
| 🧩 SaaS / App / 桌面软件 / 插件 | [独立产品实战](playbooks/product.md) | 产品事实表 · 关键页面 · 三类题验收 | 7 天 |
| 📍 餐饮、美业、健身、民宿、家政 | [本地商家实战](playbooks/local-business.md) | 门店事实卡 · 地图纠错 · 到店追踪 | 1–2 周 |
| 🛒 电商、品牌商品 | [电商实战](playbooks/ecommerce.md) | SKU 事实台账 · 四处一致性核对 | 半天起 |
| 🤝 咨询、代理、实施等 B2B 服务 | [B2B 服务实战](playbooks/b2b.md) | 服务交付卡 · 过程案例 | 1 天起 |
| 🎙 视频、播客、媒体创作者 | [创作者实战](playbooks/creator.md) | 校订字幕 · 章节 · 证据表 | 半天 |
| 🌏 出海、多语言站点 | [多语言实战](playbooks/multilingual.md) | 分市场事实卡 · hreflang 检查 | 1 天起 |

路线可以组合，比如咖啡店先走本地商家，再补小程序预约。

## 🔍 从问题找答案：24 个最常见的 GEO 问题

| 我遇到的问题 | 去哪看 |
| --- | --- |
| 已有几十页官网，先改哪一页？ | [网站：按当前状态选入口](playbooks/website.md) |
| 网页能搜到，AI 却从不引用，先查什么？ | [网站：诊断与故障排查](playbooks/website.md) |
| 正文依赖 JavaScript 或登录，怎么办？ | [网站：原始 HTML 与渲染](playbooks/website.md) |
| 产品页、FAQ、帮助文档分别该回答什么？ | [改稿课：16 道采购问题如何分组](content-rewrite.md) |
| robots、sitemap、结构化数据、llms.txt，怎么选？ | [误区辟谣](myths.md) · [robots 模板](../toolkit/robots-ai-bots.txt) |
| 只有小程序，没有官网，从哪里开始？ | [小程序：按现有入口选方案](playbooks/mini-program.md) |
| 二维码和小程序路径能让 AI 读到内容吗？ | [小程序：四层对象与证据](playbooks/mini-program.md) |
| 价格、预约规则和介绍放哪里？ | [小程序：公开页面与路径映射](playbooks/mini-program.md) |
| 小程序、公众号和商家资料互相冲突怎么办？ | [门店事实卡](playbooks/local-business.md) · [提示词 P10](../toolkit/prompts.md#p10) |
| AI 推荐后，怎样让用户完成小程序预约？ | [小程序：四环境入口测试](playbooks/mini-program.md) |
| 新产品没案例没媒体报道，先写什么？ | [独立产品：事实表与首批页面](playbooks/product.md) |
| 用户不知道我的名字，怎样研究提问？ | [提示词 P1](../toolkit/prompts.md#p1) · [改稿课](content-rewrite.md) |
| 定价经常变，AI 一直说旧价怎么办？ | [提示词 P10](../toolkit/prompts.md#p10) · [网站故障表](playbooks/website.md) |
| 要不要写替代品或竞品比较页？ | [独立产品：七类信息](playbooks/product.md) · [提示词 P8](../toolkit/prompts.md#p8) |
| 官网、文档、更新日志、商店如何分工？ | [独立产品：页面任务清单](playbooks/product.md) |
| 门店的地址、营业时间、服务区域怎样维护？ | [本地商家实战](playbooks/local-business.md) |
| 几百个 SKU，价格库存从哪里整理？ | [电商：先完成一个变体的事实台账](playbooks/ecommerce.md) |
| B2B 软件怎样写清部署、权限与迁移？ | [改稿实战课](content-rewrite.md) |
| 服务公司没有增长数据，怎样写真实案例？ | [B2B：过程与交付证据](playbooks/b2b.md) |
| 面向不同国家，哪些能翻译、哪些要重写？ | [多语言实战](playbooks/multilingual.md) |
| 第一次测量选哪些题、怎么保留原始记录？ | [测量课](measurement.md) · [提示词 P9](../toolkit/prompts.md#p9) |
| 改完仍零引用，下一步检查什么？ | [网站排错](playbooks/website.md) · [测量条件](measurement.md) |
| 偶尔一次被推荐，能说有效吗？ | [Webflow 案例与对照读法](cases.md#webflow) |
| 提及、引用、访问和有效咨询怎么分开？ | [测量：五层漏斗](measurement.md) |


## 🧰 工具箱：提示词、检查清单、模板、CI 自动体检

<a id="toolkit"></a>

| 工具 | 解决什么问题 |
| --- | --- |
| [🩺 geo-audit 命令行工具](../cli/geo-audit.mjs) | AI 爬虫能不能读到你的页面？`npx` 一行运行，7 类检查 + 0–100 分 + Markdown 报告。也有 [bash](../toolkit/geo-audit.sh) / [PowerShell](../toolkit/geo-audit.ps1) 版 |
| [⚙️ GitHub Action](#ci) | 每次发布自动体检，分数掉了就让 CI 变红 |
| [🤖 AI 爬虫 robots 模板](../toolkit/robots-ai-bots.txt) | 按“搜索 / 训练 / 用户触发”分组，放行哪个、屏蔽哪个一目了然 |
| [💬 10 个 GEO 提示词](../toolkit/prompts.md) | 挖用户问题 → 整理事实卡 → 改稿 → 审稿 → 写 FAQ → 核查引用 → 诊断错误 |
| [✅ 3 张检查清单](../toolkit/checklists.md) | 15 分钟体检 · 发布前审核 · 每周观察 |
| [📋 事实卡模板](../toolkit/templates/fact-card.yaml) · [题集模板](../toolkit/templates/question-set.csv) | 所有渠道的唯一数据源；可重复测量的固定问题 |
| [📊 观察记录表 + 汇总脚本](measurement.md) | 记录 AI 回答与引用，自动算出提及率、引用率、准确率 |

<a id="ci"></a>

### ⚙️ 给开发者：在 CI 里自动体检

上线前最常见的事故是测试站的 `noindex` 或 `Disallow: /` 被带到生产环境。把下面这段放进 `.github/workflows/geo.yml`，每次部署后自动检查，分数低于阈值就报错，报告会显示在 Actions 的运行摘要里：

```yaml
name: geo-audit
on:
  deployment_status:
  workflow_dispatch:
jobs:
  geo:
    if: github.event_name == 'workflow_dispatch' || github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: Fangx-AI/geo-doctor@master
        with:
          urls: |
            https://example.com/
            https://example.com/pricing
          fail-under: 80
          lang: zh
```

也可以直接调用：`npx github:Fangx-AI/geo-doctor 网址 --json` 输出 JSON，`--fail-under 80` 低于 80 分时退出码为 1。Action 加上 `badge: .github/geo-badge.svg` 会同时生成分数徽章，用法见[体检徽章](badge.md)。

`--fail-under` 只接受 0–100 的数值；参数缺值、阈值无效或 `--lang` 不是 `zh` / `en` 时，退出码为 2，并在开始请求网页前报错，避免 CI 因配置拼写错误而静默放行。


## 🧠 GEO 核心原则速记

1. **先定位卡在哪一关**：抓取 → 索引 → 检索 → 生成 → 引用 → 行动。不知道卡在哪，写再多内容也没用。（[5 分钟入门](basics.md)）
2. **技术三件套先排查**：robots 误封、遗留 noindex、canonical 指错，外加 JS 渲染的空壳页。
3. **搜索、训练、用户访问三类爬虫分开管**：屏蔽训练不会让你从 AI 搜索里消失。
4. **一张事实卡管所有渠道**：官网、商店、地图、公众号说法不一致，AI 就会说错。
5. **写事实，不写形容词**：人数、价格算式、系统要求、营业时间，比“领先、强大”有用一百倍。
6. **把“不适合谁”写出来**：帮 AI 正确排除你，和被推荐一样重要。
7. **从用户原话出发，不从关键词出发**：特别是不带品牌名的真实问题。
8. **提及 ≠ 引用 ≠ 准确 ≠ 访问 ≠ 成交**：五层分开记，哪层变好报哪层。
9. **百分点和百分比别混写**：8.48% → 56.35% 是 +47.87 个百分点，不是 +47.87%。
10. **没有公开的“排名公式”**：承诺保证上推荐的，先要分母和原始记录。


## 📈 案例与研究：关键数字一览

<a id="cases"></a>

| 来源 | 关键数字 | 一眼要看穿的地方 | 详细 |
| --- | --- | --- | --- |
| Pew 研究中心（2025） | 有 AI 摘要时传统结果点击 8%（无摘要 15%）；摘要内链接约 1% | 被引用 ≠ 有流量 | [研究速读](studies.md) |
| Tow Center（2025） | 8 个 AI 搜索产品找新闻原文，超过 60% 的回答有错 | 有出处 ≠ 出处正确 | [研究速读](studies.md) |
| Ahrefs（2025） | 网页 / YouTube 品牌提及与 AI 可见度强相关，页面数量弱相关 | 相关 ≠ 因果 | [研究速读](studies.md) |
| Webflow × Graphite | 加目录后报告 +60% | 原始均值只是 119 → 127 | [案例精读](cases.md#webflow) |
| Omnius | 自报 AI 点击 +138%、SQL +414% | 标题 106% 和正文 138% 是两个数 | [案例精读](cases.md#omnius) |
| AirOps | 自报点击 +15%、AI 引用 +20% | 组合改动，无法归因到单项 | [案例精读](cases.md#airops) |


## 📚 完整课程目录

![GEO 三阶段学习地图：看懂回答、按项目动手、用数据复盘](../assets/learning-map.png)

**🟢 入门**
- [GEO 5 分钟入门：AI 是怎么决定提谁、引谁的](basics.md)
- [12 个流行的 GEO 误区](myths.md)

**🔵 核心技能**
- [改稿实战课：把广告文案改成 AI 会引用的页面](content-rewrite.md)
- 8 条项目路线：[网站](playbooks/website.md) · [小程序](playbooks/mini-program.md) · [独立产品](playbooks/product.md) · [本地商家](playbooks/local-business.md) · [电商](playbooks/ecommerce.md) · [B2B](playbooks/b2b.md) · [创作者](playbooks/creator.md) · [多语言](playbooks/multilingual.md)

**🟣 平台规则**
- [国际平台：Google、Bing/Copilot、ChatGPT、Perplexity、Claude](platforms/international.md)
- [中文平台：豆包、DeepSeek、百度、元宝、Kimi、千问](platforms/china.md)

**🟠 测量与研究**
- [测量：怎样知道做完有没有用](measurement.md)
- [真实案例精读](cases.md) · [行业研究速读](studies.md) · [论文与开源代码](research.md)
- [工具选择](tools.md) · [🎓 毕业项目](capstone.md)


## 🏷 证据标签：怎样区分官方、研究、自报和教学数据

<a id="evidence"></a>

每条资料都标明证据等级，避免把广告当事实：

| 标签 | 含义 |
| --- | --- |
| 🟢 官方 | 平台官方文档明确写出，附原文链接 |
| 📊 研究 | 独立机构或学术研究，附样本与局限 |
| 🟡 自报 | 实施方或服务商自己报告的案例结果，未经独立核实 |
| 🧪 教学 | 本项目为练习设计的虚构产品或模拟数据，不是真实成绩 |

全部资料核验于 **2026-10-14**。平台规则变化快，以链接原文的当前版本为准；发现过时信息欢迎提 Issue。


---

[🏠 回首页](../README.md) · [安装 GEO 医生](../README.md#install)

<sub>有帮助的话，回 [首页](../README.md) 点个 ⭐ Star；发现错误或过时信息，欢迎 [提 Issue](https://github.com/Fangx-AI/geo-doctor/issues/new/choose)。</sub>
