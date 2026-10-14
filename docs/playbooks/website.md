# 🌐 网站 GEO 实战：7 天跑通一轮

> [GEO 实战手册](../../README.md) › 按项目实战 › 网站

**官网上线了，AI 却搜不到、引用旧内容、把产品说错？照这一页做 7 天。**

| ⏱ 用时 | 👤 适合谁 | 📦 做完你手里有 |
| --- | --- | --- |
| 7 天 × 每天约 1 小时 | 官网 / 博客 / WordPress / Webflow / React·Vue 站 | 一份访问诊断 · 一个改好的页面 · 一张发布前基线表 |

**先记住这 3 条**

1. 先拿到**原始 HTML**，确认正文真的在里面。状态码 200 不代表 AI 能读到内容（可能是登录框、验证码或空壳）。
2. 最常见的“自毁三件套”：`robots.txt` 误封、遗留的 `noindex`、`canonical` 指错页面。先查这三处。
3. 把“高端、齐全、优惠”改成人数、设备、时段、价格口径和限制。AI 和用户能引用的只有具体事实。

> 💡 只想先快速体检？用 [`toolkit/geo-audit.sh`](../../toolkit/geo-audit.sh) 一条命令跑完第二、三步（macOS / Linux）。下文命令是 Windows PowerShell 版。

---

## 第一步：按网站当前状态选入口

| 当前情况 | 第一件事 | 先不要做什么 |
| --- | --- | --- |
| 新站，只有首页 | 做出一页能回答真实选购问题的产品 / 服务说明，从首页直接链接过去 | 不必先批量生成几百篇博客 |
| 老站，有收录和搜索访问 | 从已有访问、销售常发的页面里选一个重要但回答不完整的页面 | 不要一上来全站换 URL、重写全部内容，失去对照 |
| React / Vue 等 JS 站 | 对照原始 HTML、浏览器渲染后正文和目标平台的实际表现 | 不把“用了 React”直接判为无法抓取 |
| 只有登录后应用 | 把可公开的产品说明、帮助、价格、限制放到无需登录的地址 | 不公开用户文件、账户页和私人工作区 |
| 能搜到但 AI 回答错误 | 找到错误句对应的引用来源，核对旧价格、旧版本和同名产品 | 不只在首页增加一句“我们是最好的” |

> 🧪 **贯穿示例**：虚构的会议室预订网站。把命令里的 URL 换成你自己的公开页面。下面命令是 Windows PowerShell 版（用 `curl.exe` 避开别名歧义）；macOS / Linux 直接用 [`geo-audit.sh`](../../toolkit/geo-audit.sh)。

## 第二步：取得真实响应，留下修复前证据

在项目目录执行；脚本只下载公开页面，输出文件放在新建的时间戳文件夹中：

```powershell
$geoUrl = 'https://example.com/meeting-rooms/small-team'
$geoOrigin = ([uri]$geoUrl).GetLeftPart([System.UriPartial]::Authority)
$geoAuditDir = Join-Path (Get-Location) ('geo-audit-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $geoAuditDir | Out-Null
$geoHeaders = Join-Path $geoAuditDir 'headers.txt'
$geoHtml = Join-Path $geoAuditDir 'page.html'
$geoRobots = Join-Path $geoAuditDir 'robots.txt'

# GET 并跟随跳转；保留各跳转响应头和最终正文
curl.exe -sS -L --max-redirs 5 --connect-timeout 10 --max-time 30 `
  -D $geoHeaders -o $geoHtml `
  -w "status=%{http_code} final=%{url_effective} type=%{content_type}\n" $geoUrl
if ($LASTEXITCODE -ne 0) { throw '请求失败；先检查网络、证书或跳转，不分析残缺结果。' }

curl.exe -sS --connect-timeout 10 --max-time 30 `
  -o $geoRobots -w "robots_status=%{http_code}\n" ($geoOrigin + '/robots.txt')
if ($LASTEXITCODE -ne 0) { throw 'robots 请求失败；记录错误后单独排查。' }
Get-Content -LiteralPath $geoHeaders
Get-Content -LiteralPath $geoRobots

# 初筛标签；这不是 HTML 解析器，仍需人工检查完整标签和所属页面
$geoSource = Get-Content -LiteralPath $geoHtml -Raw -Encoding UTF8
[regex]::Matches($geoSource, '(?is)<(?:meta|link)\b[^>]*(?:robots|googlebot|canonical)[^>]*>') |
  ForEach-Object { $_.Value }
# 换成页面里一段独特的真实正文，检查原始响应是否包含它
$geoSource.Contains('适合 4 至 6 人的独立会议室')
```

**怎样读结果：** `status=200` 只表示最终响应成功，还要打开保存的 `page.html` 看它是业务正文、登录框、验证码还是“页面不存在”。Google 明确区分正常页面与返回 200 的错误页；2xx 不保证索引。[HTTP 状态与 soft 404](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)

若输出的 `final` 换了主机名，例如从裸域跳到 `www`，把 `$geoUrl` 改为该最终地址再检查，确保读的是正确主机的 robots。robots 返回 404 不等于全站禁止抓取；若它跳转或请求出错，应继续核对实际规则，不能把错误页当作 robots 正文。

| 观察结果 | 通常要查哪里 | 修复完成后怎样验收 |
| --- | --- | --- |
| 最终 301 / 302、循环或超过 5 次跳转 | 域名、HTTPS、尾斜杠、语言跳转规则 | 用最终公开 URL 再测；重要链接直接指向规范地址 |
| 401 / 403 或正文是验证码 | 登录中间件、CDN / WAF 规则、地区限制 | 匿名请求能取得公开正文；再查真实机器人请求日志 |
| 404 / 410 | 页面删除、路径大小写、CMS 发布状态 | 该保留的页恢复；确实删除的页保留合适状态，不全部跳首页 |
| 429 / 5xx | 限流、服务故障、上游超时 | 先修稳定性，再谈内容实验 |
| 200 但只有空的 `root` / `app` 容器 | 正文是否依赖 JS / 登录 API / 浏览器本地状态 | 对比渲染后正文；重要公开内容考虑服务端渲染或预渲染 |
| 200 且正文完整 | 继续查索引控制、内容覆盖与实际引用 | 不把成功下载当成已被某个 AI 收录 |

普通请求不能证明某家爬虫能访问。若 CDN 日志显示真实机器人被拦，再按该平台当前官方身份验证方法核对 IP 或其他验证信息；手动把 User-Agent 改成爬虫名字，只能测试字符串规则，不能证明真实爬虫已来访。

## 第三步：检查三个最容易误配的位置

**1. `robots.txt`。** 找目标机器人或通用组里是否禁用了这个路径。`Disallow: /` 可能是测试站配置误上生产；改之前确认是公开页面。robots 管抓取，不负责替你保护私人数据，也不能单独保证 URL 从搜索结果消失。[robots 官方说明](https://developers.google.com/search/docs/crawling-indexing/robots/intro)

**2. `noindex`。** 同时检查 HTML 的 robots meta 和响应头 `X-Robots-Tag`。下例常来自 CMS 的“阻止搜索引擎”开关或部署环境继承：

```html
<!-- 对打算公开索引的产品页：先确认用途，再移除误加的 noindex -->
<meta name="robots" content="noindex, nofollow">
```

不要把网站所有 `noindex` 都删掉；登录、结账、内部搜索等页面可能本来就不该收录。Google 必须能抓到页面，才有机会读到其中的 `noindex`。[noindex 的实施条件](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

**3. `canonical`。** 独立产品页误指向首页，会发出不一致信号；同一页面的跟踪参数版本通常应指向选定的干净地址。canonical 是规范化信号，不是强制命令。[规范 URL 官方说明](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

```html
<!-- 本教学页面选择的规范地址；应与站内链接及 sitemap 一致 -->
<link rel="canonical" href="https://example.com/meeting-rooms/small-team">
```

对于 JS 页面，在浏览器检查最终 DOM，核对 `title`、canonical、robots 和正文有无被脚本改写；有 Search Console 权限时，再检查 Google 实时测试呈现的 HTML。原始正文缺失、浏览器正文存在，只能证明渲染依赖；Google 能执行 JS，不等于所有 AI 抓取器都有相同能力。[JavaScript 抓取、渲染与索引](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

## 第四步：把一句卖点改成用户能拿来做决定的内容

**改前：** “高端会议室，配置齐全，价格优惠，满足多样化商务需求。”

**改后：**

> 这间独立会议室适合 4 至 6 人面试或讨论。房间有可连接 HDMI 的显示屏、白板和独立电源；不提供视频会议摄像头。工作日 9:00—18:00 可预约，按小时计费，至少预订 1 小时。需要远程会议时，请自带摄像头并提前测试设备。实时价格和可预约时段在预订页确认。

再补三块证据：**一张本人拍摄的实际房间图、一次真实接屏步骤、公开的取消规则**。照片下方写地点和拍摄日期；关键价格、人数和限制用正文表达，不能只藏在海报里。图片展示事实，不用图库照片冒充该房间。

给页面补上从分类页进入的普通链接，例如 `<a href="/meeting-rooms/small-team">4 至 6 人会议室与设备说明</a>`。不要让发现路径只剩“点击 JS 按钮后才出现的地址”。[可抓取链接与锚文本](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

## 第五步：照着这份 7 天清单执行

| 天 | 具体任务 | 当天交付 / 通过标准 |
| --- | --- | --- |
| 1 | 从客户咨询选 10 个问题；品牌题、非品牌题分开；在目标 AI 的联网入口保存当前回答 | 10 题原文、入口、时间、联网状态、引用 URL、业务事实是否正确 |
| 2 | 对目标页及首页运行上述检查；核对 robots、noindex、canonical、渲染 | 响应头和 HTML 文件；每个障碍有负责人与修复位置 |
| 3 | 从合同 / 后台 / 实际产品确认关键事实，补一份内容清单 | 人数、设备、时间、价格口径、限制各有事实来源 |
| 4 | 改一页正文，拍一张真实配图，写清楚如何到达或使用 | 不了解业务的人能回答“适不适合我、下一步怎么做” |
| 5 | 发布；从相关页加链接；更新真实修改过的 sitemap 项 | 公共 URL 可访问；源码、链接、规范地址一致；保留发布差异 |
| 6 | 在已验证的站长工具内检查 URL；有适用功能才提交重新抓取 | 记录“提交成功 / 已抓取 / 已索引”各自状态，不合并 |
| 7 | 复跑题集，检视咨询与预订入口；安排后续每周同条件复测 | 一份技术验收与一份效果观察；仍为零的结果也保留 |

sitemap 提交是帮助发现 URL 的提示，不能规定搜索引擎何时处理。只有内容真的更新才更新相应 `lastmod`。[sitemap 生成与提交](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## 怎样知道这周做对了；没有效果时先查什么

本周先验收可控结果：公开正文可读取、关键事实准确、目标页有入口、CTA 能用。索引、AI 引用和询盘需要继续观察；7 天是执行计划，不是收录或增长时限。

测量表至少分开：**目标页索引状态、题集中的正确品牌提及、官网引用、可识别 AI 引荐会话、完成业务事件**。前后使用相同题集与入口；品牌题容易命中，不能混入非品牌题把平均值抬高。

| 症状 | 下一步 |
| --- | --- |
| 技术正常，始终没被搜到 | 检查发现路径、站长工具状态、内容是否与其他页重复；不要一天提交几十次 |
| AI 引用旧页 | 保存实际旧来源，检查旧页面、重定向与外部资料；先更新源事实，再等待各平台处理 |
| 引用了但说错 | 看错误事实来自哪一页；把条件写进对应句子附近，消除表格与正文冲突 |
| 被提到但没访问 | 检查回答有没有给链接、是否已经满足需求；提及与访问分开报告 |
| 有访问但没有预订 | 检查移动端、目标门店是否匹配、价格是否跳变、登录是否过早；这可能是转化问题 |

---

<div align="center">

← [改稿实战课](../content-rewrite.md) · [🏠 目录](../../README.md) · [小程序实战](mini-program.md) →

<sub>有帮助的话，回 [首页](../../README.md) 点个 ⭐ Star；发现错误或过时信息，欢迎 [提 Issue](https://github.com/Fangx-AI/GEO-Playbook/issues/new/choose)。</sub>

</div>
