<div align="center">

# Geo-Doctor (GEO 医生)

### Get found, described correctly, and cited by AI search (ChatGPT, Perplexity, Google AI, Doubao, DeepSeek, Yuanbao…)

**A hands-on Generative Engine Optimization field guide, written in Chinese, with a focus on Chinese AI platforms, WeChat Mini Programs, and local businesses.**<br>
No courses to sell, no hype. Every claim links to an official doc or a published study.

[中文版](README.md)

</div>

## What's inside

| Part | What you get |
| --- | --- |
| [GEO in 5 minutes](docs/basics.md) | The 6 stages behind an AI answer (crawl → index → retrieve → generate → cite → act) and how to tell where you're stuck |
| [12 GEO myths](docs/myths.md) | e.g. *Google Search does not use llms.txt*; *blocking GPTBot does not remove you from ChatGPT search*. Each one cites the source |
| 8 playbooks | [Website](docs/playbooks/website.md) · [WeChat Mini Program](docs/playbooks/mini-program.md) · [SaaS/App](docs/playbooks/product.md) · [Local business](docs/playbooks/local-business.md) · [E-commerce](docs/playbooks/ecommerce.md) · [B2B services](docs/playbooks/b2b.md) · [Creators](docs/playbooks/creator.md) · [Multilingual](docs/playbooks/multilingual.md) |
| Platform rules | [Google, Bing/Copilot, ChatGPT, Perplexity, Claude](docs/platforms/international.md) · [Doubao, DeepSeek, Baidu, Yuanbao, Kimi, Qwen](docs/platforms/china.md) |
| [Measurement](docs/measurement.md) | Mention → citation → supported citation → visit → conversion, with a 16-row worked example and a local script |
| [Case teardowns](docs/cases.md) · [Studies](docs/studies.md) · [Papers](docs/research.md) | What the numbers actually mean: denominators, controls, percentage points vs percent |

## 🩺 geo-audit: can AI crawlers read your page?

No install, works on Windows / macOS / Linux with Node.js 18+:

```bash
npx github:Fangx-AI/Geo-Doctor https://your-site.com/pricing --phrase "a key sentence from the page"
```

Seven groups of checks and a 0–100 score: status and redirects, robots.txt rules for 9 AI and search crawlers (RFC 9309 longest-match, wildcards), whether a firewall/CDN blocks AI crawler user-agents, `noindex` in headers and meta, canonical, whether your copy is in the raw HTML (not only rendered by JavaScript), sitemap and JSON-LD. Add `--json` for machine output, `--report report.md` for a Markdown report, `--fail-under 80` to fail CI.

**GitHub Action**: catch a staging `noindex` or `Disallow: /` before it reaches production.

```yaml
- uses: Fangx-AI/Geo-Doctor@master
  with:
    urls: |
      https://example.com/
      https://example.com/pricing
    fail-under: 80
```

No Node? Use [`toolkit/geo-audit.sh`](toolkit/geo-audit.sh) (macOS / Linux) or [`toolkit/geo-audit.ps1`](toolkit/geo-audit.ps1) (Windows) with fewer checks.

## Other tools

- [`toolkit/robots-ai-bots.txt`](toolkit/robots-ai-bots.txt): robots template grouped by *search / training / user-triggered* crawlers.
- [`toolkit/prompts.md`](toolkit/prompts.md): 10 prompts (Chinese) for question mining, fact cards, rewriting, fact-checking AI citations, and diagnosing wrong answers.

All sources verified on 2026-10-14. Contributions (especially cases with disclosed denominators) are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

If this helps you, a ⭐ star helps others find it.

<sub>Geo-Doctor (GEO 医生, formerly GEO-Playbook) · Generative Engine Optimization playbook. Text, templates and diagrams: [CC BY 4.0](LICENSE). Scripts: [MIT](scripts/LICENSE).</sub>
