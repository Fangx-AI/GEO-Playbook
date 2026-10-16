> [GEO 医生](../README.md) › 15 分钟上手

# 🧰 15 分钟上手：问 AI、跑体检、改一段文案

不装 skill 也能做。三步走完，你会知道 AI 现在怎么说你、能不能读到你的网站，以及怎样把一段广告文案改成 AI 愿意引用的样子。


**① 看看 AI 现在怎么说你（5 分钟）**

打开你的用户常用的 AI（豆包、DeepSeek、元宝、ChatGPT 都可以），问 3 个**不带你品牌名**的真实问题，比如“杭州西湖区周末能带电脑的安静咖啡店”。保存回答，打开它引用的来源，看看有没有你、说得对不对。

**② 检查 AI 能不能读到你的网站（2 分钟）**

装了 [Node.js](https://nodejs.org/zh-cn)（18 以上）就能直接跑，Windows / macOS / Linux 通用，不用下载任何东西：

```bash
npx github:Fangx-AI/geo-doctor https://你的网站/重要页面 --phrase "页面里的一句关键正文"
```

它会检查 7 类问题并打分：状态码与跳转、robots.txt 对 9 个 AI / 搜索爬虫的规则、防火墙是否在拦 AI 爬虫、noindex、canonical、正文是否真的在原始 HTML 里、sitemap 与结构化数据。只读取公开页面。

分数是这些技术检查的汇总，不是 AI 推荐概率。原始 HTML 里正文不到 50 字，或 `#app`、`#root` 这类挂载点是空的、只有"加载中"（典型的 JS 空壳页，导航和页脚文字不算正文），算致命问题；50 到 200 字只提醒，不扣分；用 `--phrase` 找到了关键句的短页面也不算空壳。提取到文字不代表关键内容齐全，建议用 `--phrase` 核对价格、功能等重要事实。

<details>
<summary markdown="span"><b>👀 看看输出长什么样</b>（模拟页面，查出一个致命问题和几个小问题）</summary>

```text
🩺 GEO 体检：https://example.com/p/pricing.html

① 访问与跳转
  ✅ 最终状态码 200
  ✅ 无跳转

② robots.txt 与 AI 爬虫
  ✅ 9 个搜索类爬虫都可以抓取这个页面
  ℹ️  训练用途的 GPTBot 被禁止：不影响搜索可见性，如果是有意为之可忽略

③ 防火墙 / CDN
  ✅ 用 AI 爬虫的 UA 访问，与浏览器结果一致
  ℹ️  注：这里只模拟 UA，真实爬虫还要按官方 IP 核对服务器日志

④ 索引控制
  ✅ 响应头无 noindex
  ❌ robots meta 含 noindex：检查 CMS 的“阻止搜索引擎”开关

⑤ 规范地址
  ⚠️  canonical 指向别处：https://example.com/（产品页误指首页很常见）

⑥ 正文与页面信息
  ✅ 原始 HTML 里有约 399 字正文
  ✅ 原始 HTML 里找到指定正文「团队版每月 299 元」
  ✅ 标题：价格 - 示例文档工具
  ⚠️  没有 meta description：搜索结果和部分 AI 摘要会自己截一段
  ✅ H1：价格
  ⚠️  <html> 没有 lang 属性：多语言站点尤其要加

⑦ 发现与结构化数据
  ⚠️  没找到 sitemap（robots.txt 未声明，/sitemap.xml 也不存在）
  ℹ️  没有 JSON-LD：不是必需项，官方没有“AI 专用 schema”，只在符合页面类型时添加

得分：60/100  ·  9 项通过 · 4 项注意 · 1 项问题
```

这个页面在浏览器里看一切正常，但 noindex 会让它不进搜索索引，canonical 又把它指向了首页。这类问题肉眼看不出来，所以先跑一遍。

</details>

<details>
<summary markdown="span"><b>没装 Node.js？</b>用 bash / PowerShell 脚本（检查项少一些）</summary>

macOS / Linux：

```bash
curl -O https://raw.githubusercontent.com/Fangx-AI/geo-doctor/master/toolkit/geo-audit.sh
bash geo-audit.sh https://你的网站/重要页面 "页面里的一句关键正文"
```

Windows（PowerShell）：

```powershell
curl.exe -O https://raw.githubusercontent.com/Fangx-AI/geo-doctor/master/toolkit/geo-audit.ps1
powershell -ExecutionPolicy Bypass -File geo-audit.ps1 https://你的网站/重要页面 "页面里的一句关键正文"
```

</details>

**③ 把一段广告文案改成 AI 会引用的样子（5 分钟）**

复制 [提示词 P3](../toolkit/prompts.md#p3)，填入你的产品事实和原文案。对比一下：

> ❌ **改前**：新一代企业级智能知识管理平台，全面兼容各种文件，快速无损迁移，超高性价比。
>
> ✅ **改后**：云端团队文档工具，**不支持内网部署**。团队版 299 元/月含 20 席，25 人为 299 + 5 × 20 = 399 元。支持 Markdown、HTML、文本型 PDF；**扫描版 PDF 不能搜索正文**。导出包含正文和附件，**不含评论和历史版本**。

改后的每一句都是能被引用、能被核对的事实，**连“不支持什么”都写清楚**。这正是 AI 回答“适不适合我”时最需要的信息。（示例产品为虚构，完整课程见 [改稿实战课](content-rewrite.md)。）

---

[🏠 回首页](../README.md) · [安装 GEO 医生](../README.md#install) · [GEO 实战手册](handbook.md)
