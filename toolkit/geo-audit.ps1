# GEO 一键体检（Windows PowerShell 版）：AI 能不能读到你的页面？
# 用法：powershell -ExecutionPolicy Bypass -File geo-audit.ps1 <URL> ["页面里一句独特的正文"]
# 例子：powershell -ExecutionPolicy Bypass -File geo-audit.ps1 https://example.com/pricing "团队版每月 299 元"
#
# 与 geo-audit.sh 检查项相同。需要 Windows 10 1803+ 自带的 curl.exe。
# 只读取公开页面，不提交任何数据。结果保存到 .\geo-audit-时间戳\ 目录。
# 这是初筛，不是 HTML 解析器；可疑项请打开保存的文件人工确认。
# SPDX-License-Identifier: MIT
param(
  [Parameter(Position = 0)][string]$Url,
  [Parameter(Position = 1)][string]$Phrase = ""
)

[Console]::OutputEncoding = [Text.Encoding]::UTF8
$Utf8 = New-Object Text.UTF8Encoding($false)

if (-not $Url) {
  Write-Output '用法：powershell -ExecutionPolicy Bypass -File geo-audit.ps1 <URL> ["页面里一句独特的正文"]'
  exit 1
}
if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
  Write-Output "  ❌ 找不到 curl.exe：需要 Windows 10 1803 或更新版本"; exit 1
}

$Dir = "geo-audit-" + (Get-Date -Format "yyyyMMdd-HHmmss")
New-Item -ItemType Directory -Path $Dir -Force | Out-Null
$Dir = (Resolve-Path $Dir).Path
$HeadersFile = Join-Path $Dir "headers.txt"
$PageFile = Join-Path $Dir "page.html"
$RobotsFile = Join-Path $Dir "robots.txt"
$CleanFile = Join-Path $Dir "page.clean.html"
$UA = "Mozilla/5.0 (geo-doctor audit)"
$script:Pass = 0; $script:Warn = 0
function Ok($m)   { Write-Output "  ✅ $m"; $script:Pass++ }
function Warn($m) { Write-Output "  ⚠️  $m"; $script:Warn++ }
function ReadUtf8($p) { if (Test-Path $p) { [IO.File]::ReadAllText($p, $Utf8) } else { "" } }

Write-Output "🩺 GEO 体检：$Url"
Write-Output ""

# 1. 状态码与跳转
Write-Output "① 访问与跳转"
$info = & curl.exe -sS -L --max-redirs 5 --connect-timeout 10 --max-time 30 -A $UA `
  -D $HeadersFile -o $PageFile `
  -w "%{http_code} %{num_redirects} %{url_effective}" $Url
if ($LASTEXITCODE -ne 0) { Write-Output "  ❌ 请求失败：检查网络、证书或域名"; exit 1 }
$code, $redirects, $final = ($info -join "") -split " ", 3
if ($code -like "2*") { Ok "最终状态码 $code" } else { Warn "最终状态码 $code（4xx/5xx 时 AI 读不到正文）" }
if ([int]$redirects -gt 0) {
  Warn "经过 $redirects 次跳转，最终地址：$final（站内链接和 sitemap 尽量直接用最终地址）"
} else { Ok "无跳转" }
$origin = ([regex]::Match($final, '^(https?://[^/]+)')).Groups[1].Value

# 2. robots.txt
Write-Output ""
Write-Output "② robots.txt（$origin/robots.txt）"
$rcode = & curl.exe -sS -L --max-time 20 -A $UA -o $RobotsFile -w "%{http_code}" "$origin/robots.txt"
if ($LASTEXITCODE -ne 0) { $rcode = "000" }
if ($rcode -eq "404") {
  Ok "没有 robots.txt（404 表示不限制抓取）"
} elseif ($rcode -notlike "2*") {
  Warn "robots.txt 返回 $rcode，请人工确认实际规则"
} else {
  $lines = (ReadUtf8 $RobotsFile).ToLower() -split "\r?\n"
  # 粗略检查：某个 UA 所在分组里是否有 "disallow: /" 整站封禁（连续的 user-agent 行视为同一分组）
  function Blocked($bot) {
    $grp = $false; $lastUa = $false; $hit = $false; $allow = $false
    foreach ($l in $lines) {
      if ($l -match '^\s*user-agent\s*:\s*(.*)$') {
        $ua = $Matches[1] -replace '\s', ''
        if (-not $lastUa) { $grp = $false }
        if ($ua -eq $bot) { $grp = $true }
        $lastUa = $true; continue
      }
      $lastUa = $false
      if ($grp -and $l -match '^\s*disallow\s*:\s*/\s*$') { $hit = $true }
      if ($grp -and $l -match '^\s*allow\s*:\s*/.') { $allow = $true }
    }
    if ($hit -and $allow) { return "partial" } elseif ($hit) { return "full" } else { return "" }
  }
  foreach ($bot in "Googlebot","bingbot","OAI-SearchBot","PerplexityBot","Claude-SearchBot","GPTBot","ClaudeBot","Google-Extended") {
    $r = Blocked $bot.ToLower()
    if ($r -eq "partial") { Warn "$bot 分组有 Disallow: / 但也有 Allow 例外，请人工确认目标页是否被放行" }
    elseif ($r -eq "full") { Warn "$bot 被整站 Disallow（如果是有意屏蔽训练用途可忽略）" }
  }
  $r = Blocked "*"
  if ($r -eq "partial") { Warn "通用分组有 Disallow: / 但也有 Allow 例外，请人工确认目标页是否被放行" }
  elseif ($r -eq "full") { Warn "通用分组 User-agent: * 整站 Disallow: /（常见于测试站配置误上生产）" }
  else { Ok "通用分组 User-agent: * 没有整站封禁" }
}

# 去掉 script / style / 注释，供下面的检查使用（标签跨行也能匹配）
$raw = ReadUtf8 $PageFile
$clean = [regex]::Replace($raw, '(?is)<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->', '')
$clean = $clean -replace '[\r\n\t]', ' '
[IO.File]::WriteAllText($CleanFile, $clean, $Utf8)
$headers = ReadUtf8 $HeadersFile

# 3. noindex
Write-Output ""
Write-Output "③ 索引控制（noindex）"
if ($headers -match '(?im)^x-robots-tag:.*noindex') { Warn "响应头 X-Robots-Tag 含 noindex" } else { Ok "响应头无 noindex" }
$metaNoindex = [regex]::Matches($clean, '(?i)<meta[^>]+name=["'']?(robots|googlebot)["'']?[^>]*>') | Where-Object { $_.Value -match '(?i)noindex' }
if ($metaNoindex) { Warn "HTML 的 robots meta 含 noindex（检查 CMS 的「阻止搜索引擎」开关）" } else { Ok "HTML 无 noindex meta" }

# 4. canonical
Write-Output ""
Write-Output "④ 规范地址（canonical）"
$canonTag = [regex]::Match($clean, '(?i)<link[^>]+rel=["'']?canonical["'']?[^>]*>').Value
$canon = ([regex]::Match($canonTag, '(?i)href=["'']([^"'']+)')).Groups[1].Value
# 相对地址（/pricing、pricing、//host/x）先补全成绝对地址再比较
if ($canon) { try { $canon = ([Uri]::new([Uri]$final, $canon)).AbsoluteUri } catch { } }
if (-not $canon) {
  Warn "原始 HTML 没有 canonical（不是错误，但重要页面建议加上）"
} elseif ($canon.TrimEnd('/') -eq $final.TrimEnd('/')) {
  Ok "canonical 指向本页：$canon"
} else {
  Warn "canonical 指向别处：$canon（产品页误指首页很常见）"
}

# 5. 正文是否在原始 HTML
Write-Output ""
Write-Output "⑤ 正文是否在原始 HTML 里（不依赖 JavaScript）"
$text = ($clean -replace '<[^>]+>', '') -replace '\s+', ' '
$textBytes = $Utf8.GetByteCount($text)
if ($textBytes -lt 500) {
  Warn "可见文字很少（约 $textBytes 字节），可能是 JS 渲染的空壳页，部分 AI 爬虫读不到"
} else { Ok "原始 HTML 有约 $textBytes 字节文字" }
if ($Phrase) {
  if ($raw.Contains($Phrase)) { Ok "找到指定正文：「$Phrase」" }
  else { Warn "原始 HTML 里找不到「$Phrase」：可能依赖 JS 渲染，或文字被拆进了多个标签" }
}
$title = ([regex]::Match($clean, '(?i)<title[^>]*>([^<]*)')).Groups[1].Value.Trim()
if ($title) { Ok "标题：$title" } else { Warn "没有 <title>" }

Write-Output ""
Write-Output "—— 结果：$($script:Pass) 项通过，$($script:Warn) 项需要关注。原始文件在 $Dir"
Write-Output "—— 下一步：按 docs/playbooks/website.md 的「第三步」逐项确认。"
Write-Output "—— 提醒：能下载成功 ≠ 已被任何 AI 收录或引用，后者要用固定题集观察。"
