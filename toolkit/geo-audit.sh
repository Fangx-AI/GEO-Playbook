#!/usr/bin/env bash
# GEO 一键体检：AI 能不能读到你的页面？
# 用法：bash geo-audit.sh <URL> ["页面里一句独特的正文"]
# 例子：bash geo-audit.sh https://example.com/pricing "团队版每月 299 元"
#
# 只读取公开页面，不提交任何数据。结果保存到 ./geo-audit-时间戳/ 目录。
# 这是初筛，不是 HTML 解析器；可疑项请打开保存的文件人工确认。
# SPDX-License-Identifier: MIT
set -uo pipefail

URL="${1:-}"
PHRASE="${2:-}"
if [[ -z "$URL" ]]; then
  echo "用法：bash geo-audit.sh <URL> [\"页面里一句独特的正文\"]"; exit 1
fi

DIR="geo-audit-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DIR"
UA="Mozilla/5.0 (GEO-Playbook audit)"
PASS=0; WARN=0
ok()   { echo "  ✅ $*"; PASS=$((PASS+1)); }
warn() { echo "  ⚠️  $*"; WARN=$((WARN+1)); }

echo "🩺 GEO 体检：$URL"
echo

# 1. 状态码与跳转
echo "① 访问与跳转"
INFO=$(curl -sS -L --max-redirs 5 --connect-timeout 10 --max-time 30 -A "$UA" \
  -D "$DIR/headers.txt" -o "$DIR/page.html" \
  -w '%{http_code} %{num_redirects} %{url_effective}' "$URL") || { echo "  ❌ 请求失败：检查网络、证书或域名"; exit 1; }
read -r CODE REDIRECTS FINAL <<<"$INFO"
[[ "$CODE" == 2* ]] && ok "最终状态码 $CODE" || warn "最终状态码 $CODE（4xx/5xx 时 AI 读不到正文）"
if [[ "$REDIRECTS" -gt 0 ]]; then
  warn "经过 $REDIRECTS 次跳转，最终地址：$FINAL（站内链接和 sitemap 尽量直接用最终地址）"
else
  ok "无跳转"
fi
ORIGIN=$(echo "$FINAL" | sed -E 's#^(https?://[^/]+).*#\1#')

# 2. robots.txt
echo
echo "② robots.txt（$ORIGIN/robots.txt）"
RCODE=$(curl -sS -L --max-time 20 -A "$UA" -o "$DIR/robots.txt" -w '%{http_code}' "$ORIGIN/robots.txt" || echo "000")
if [[ "$RCODE" == "404" ]]; then
  ok "没有 robots.txt（404 表示不限制抓取）"
elif [[ "$RCODE" != 2* ]]; then
  warn "robots.txt 返回 $RCODE，请人工确认实际规则"
else
  tr -d '\r' < "$DIR/robots.txt" | tr '[:upper:]' '[:lower:]' > "$DIR/robots.lower.txt"
  # 粗略检查：某个 UA 所在分组里是否有 "disallow: /" 整站封禁（连续的 user-agent 行视为同一分组）
  blocked() {
    awk -v bot="$1" '
      /^[[:space:]]*user-agent[[:space:]]*:/ {
        ua=$0; sub(/^[^:]*:[[:space:]]*/,"",ua); gsub(/[[:space:]]/,"",ua)
        if (!last_ua) grp=0
        if (ua==bot) grp=1
        last_ua=1; next }
      { last_ua=0 }
      grp && /^[[:space:]]*disallow[[:space:]]*:[[:space:]]*\/[[:space:]]*$/ { hit=1 }
      grp && /^[[:space:]]*allow[[:space:]]*:[[:space:]]*\/./ { allow=1 }
      END { if (hit && allow) print "partial"; exit !hit }' "$DIR/robots.lower.txt"
  }
  for BOT in Googlebot bingbot OAI-SearchBot PerplexityBot Claude-SearchBot GPTBot ClaudeBot Google-Extended; do
    if R=$(blocked "$(echo "$BOT" | tr '[:upper:]' '[:lower:]')"); then
      if [[ "$R" == "partial" ]]; then
        warn "$BOT 分组有 Disallow: / 但也有 Allow 例外，请人工确认目标页是否被放行"
      else
        warn "$BOT 被整站 Disallow（如果是有意屏蔽训练用途可忽略）"
      fi
    fi
  done
  if R=$(blocked "*"); then
    if [[ "$R" == "partial" ]]; then
      warn "通用分组有 Disallow: / 但也有 Allow 例外，请人工确认目标页是否被放行"
    else
      warn "通用分组 User-agent: * 整站 Disallow: /（常见于测试站配置误上生产）"
    fi
  else
    ok "通用分组 User-agent: * 没有整站封禁"
  fi
fi

# 把 HTML 压成一行（标签可能跨行书写），并去掉 script / style 内容，供下面的检查使用
tr '\r\n\t' '   ' < "$DIR/page.html" > "$DIR/page.oneline.html"
perl -pe 's/<script\b.*?<\/script>//gis; s/<style\b.*?<\/style>//gis; s/<!--.*?-->//gs' \
  "$DIR/page.oneline.html" > "$DIR/page.clean.html"

# 3. noindex
echo
echo "③ 索引控制（noindex）"
if grep -iqE '^x-robots-tag:.*noindex' "$DIR/headers.txt"; then
  warn "响应头 X-Robots-Tag 含 noindex"
else
  ok "响应头无 noindex"
fi
if grep -ioE '<meta[^>]+name=["'"'"']?(robots|googlebot)["'"'"']?[^>]*>' "$DIR/page.clean.html" | grep -iq noindex; then
  warn "HTML 的 robots meta 含 noindex（检查 CMS 的“阻止搜索引擎”开关）"
else
  ok "HTML 无 noindex meta"
fi

# 4. canonical
echo
echo "④ 规范地址（canonical）"
CANON=$(grep -ioE '<link[^>]+rel=["'"'"']?canonical["'"'"']?[^>]*>' "$DIR/page.clean.html" | head -1 | grep -ioE 'href=["'"'"'][^"'"'"']+' | sed -E 's/^href=.//')
if [[ -z "$CANON" ]]; then
  warn "原始 HTML 没有 canonical（不是错误，但重要页面建议加上）"
elif [[ "${CANON%/}" == "${FINAL%/}" ]]; then
  ok "canonical 指向本页：$CANON"
else
  warn "canonical 指向别处：$CANON（产品页误指首页很常见）"
fi

# 5. 正文是否在原始 HTML
echo
echo "⑤ 正文是否在原始 HTML 里（不依赖 JavaScript）"
TEXT_BYTES=$(sed -E 's/<[^>]+>//g' "$DIR/page.clean.html" | tr -s '[:space:]' | wc -c | tr -d ' ')
if [[ "$TEXT_BYTES" -lt 500 ]]; then
  warn "可见文字很少（约 $TEXT_BYTES 字节），可能是 JS 渲染的空壳页，部分 AI 爬虫读不到"
else
  ok "原始 HTML 有约 $TEXT_BYTES 字节文字"
fi
if [[ -n "$PHRASE" ]]; then
  if grep -qF "$PHRASE" "$DIR/page.html"; then ok "找到指定正文：「$PHRASE」"
  else warn "原始 HTML 里找不到「$PHRASE」：可能依赖 JS 渲染，或文字被拆进了多个标签"; fi
fi
TITLE=$(grep -ioE '<title[^>]*>[^<]*' "$DIR/page.clean.html" | head -1 | sed -E 's/<title[^>]*>//')
[[ -n "$TITLE" ]] && ok "标题：$TITLE" || warn "没有 <title>"

echo
echo "—— 结果：$PASS 项通过，$WARN 项需要关注。原始文件在 ./$DIR/"
echo "—— 下一步：按 docs/playbooks/website.md 的“第三步”逐项确认。"
echo "—— 提醒：能下载成功 ≠ 已被任何 AI 收录或引用，后者要用固定题集观察。"
