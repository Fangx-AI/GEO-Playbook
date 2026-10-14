# 🛠 工具：先确定问题，再选软件

> [GEO 实战手册](../README.md) › 工具

**刚开始只需要浏览器、表格和本仓库的工具箱。付费监测软件放到你有了稳定题集之后再考虑。**

## 先按问题选工具

| 你要回答的问题 | 需要的证据 | 用什么 |
| --- | --- | --- |
| AI 能不能读到我的页面？ | 原始 HTML、响应头、robots、渲染后正文 | [`geo-audit.sh`](../toolkit/geo-audit.sh) / [`geo-audit.ps1`](../toolkit/geo-audit.ps1)、浏览器开发者工具、Search Console |
| 页面性能和可访问性有没有大问题？ | 技术审计报告 | [Lighthouse](https://github.com/GoogleChrome/lighthouse)（分数不是 AI 引用概率） |
| AI 到底引用了谁？ | 真实回答全文 + 每条引用 URL | 手工记录 + [观察记录空表](../examples/observation-template.csv) |
| 改完有没有变好？ | 同题同条件的前后记录 | [汇总脚本](../scripts/summarize_observations.py) · [测量课](measurement.md) |
| 想批量跑固定题集 | 固定输入、批量运行、并排比较 | [Promptfoo](https://github.com/promptfoo/promptfoo)（注意：API 结果 ≠ App 结果，单独成组） |
| 想自动评估引用是否忠实 | 逐条“断言—证据”判断 | [Ragas](https://docs.ragas.io/en/stable/)（自动评分要用人工样本校准） |
| 带来了多少咨询？ | 来源规则 + 业务事件 | GA4 等分析工具，见 [测量课第六步](measurement.md) |

## 本仓库自带的工具

| 工具 | 用途 |
| --- | --- |
| [🧰 提示词库](../toolkit/prompts.md) | 10 个可直接复制的 GEO 工作提示词 |
| [✅ 检查清单](../toolkit/checklists.md) | 15 分钟体检、发布前审核、每周观察 |
| [🤖 robots 模板](../toolkit/robots-ai-bots.txt) | 按用途分组的 AI 爬虫配置 |
| 🩺 一键体检脚本：[macOS / Linux](../toolkit/geo-audit.sh) · [Windows](../toolkit/geo-audit.ps1) | 检查状态码、跳转、robots、noindex、canonical、正文是否在原始 HTML |
| [📋 模板](https://github.com/Fangx-AI/GEO-Playbook/tree/master/toolkit/templates) | 事实卡、问题集 |
| [📊 观察表与模拟数据](https://github.com/Fangx-AI/GEO-Playbook/tree/master/examples) | 记录 AI 回答与引用，练习计算 |

## 跟踪官方更新

- [Google Search Central Blog](https://developers.google.com/search/blog) · 🟢 官方。规则变化先看这里，记录具体文章而不是只存主页。
- [Search Off the Record](https://developers.google.com/search/podcasts/search-off-the-record) · 🟢 官方播客。引用某次说法时记下具体节目和日期。
- [Search Console 入门](https://developers.google.com/search/docs/monitor-debug/search-console-start) · 🟢 官方。站点权限、索引问题与 URL 检查。

**选工具前做一件事**：写下你要回答的问题和需要的证据，再列出这个工具**解决不了**的部分。买之前先问清它的 visibility 分数用什么题集、怎么去重、分母是什么。

---

<div align="center">

← [论文与开源代码](research.md) · [🏠 目录](../README.md) · [毕业项目](capstone.md) →

<sub>有帮助的话，回 [首页](../README.md) 点个 ⭐ Star；发现错误或过时信息，欢迎 [提 Issue](https://github.com/Fangx-AI/GEO-Playbook/issues/new/choose)。</sub>

</div>
