<div align="center">

# GEO Learning Map

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

## Toolkit (language-agnostic)

- [`toolkit/geo-audit.sh`](toolkit/geo-audit.sh): one-command check for status/redirects, robots.txt rules per AI crawler, noindex, canonical, and whether your copy is in the raw HTML.
- [`toolkit/robots-ai-bots.txt`](toolkit/robots-ai-bots.txt): robots template grouped by *search / training / user-triggered* crawlers.
- [`toolkit/prompts.md`](toolkit/prompts.md): 10 prompts (Chinese) for question mining, fact cards, rewriting, fact-checking AI citations, and diagnosing wrong answers.

```bash
curl -O https://raw.githubusercontent.com/Fangx-AI/geo-learning-map/master/toolkit/geo-audit.sh
bash geo-audit.sh https://your-site.com/important-page "a unique sentence from the page"
```

All sources verified on 2026-10-14. Contributions (especially cases with disclosed denominators) are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

If this helps you, a ⭐ star helps others find it.

<sub>Text, templates and diagrams: [CC BY 4.0](LICENSE). Scripts: [MIT](scripts/LICENSE).</sub>
