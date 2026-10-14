import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, render } from '../scripts/ai-crawler-scan.mjs';

const WHITELIST = 'User-agent: Baiduspider\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: *\nDisallow: /\n';

test('whitelist robots.txt lets Baidu in and keeps AI search bots out', () => {
  const r = classify(200, WHITELIST);
  assert.equal(r.state, 'ok');
  assert.equal(r.allowed.Baiduspider, true);
  assert.equal(r.allowed['OAI-SearchBot'], false);
  assert.equal(r.allowed.PerplexityBot, false);
});

test('4xx and HTML bodies mean no rules; 5xx is unknown', () => {
  assert.equal(classify(404, '').allowed.GPTBot, true);
  assert.equal(classify(200, '<html>home</html>').state, 'none');
  assert.equal(classify(503, '').state, 'error');
});

test('render counts only readable sites in the denominator', () => {
  const results = [
    { domain: 'a.cn', name: 'A', category: 'X', ...classify(200, WHITELIST) },
    { domain: 'b.cn', name: 'B', category: 'X', ...classify(404, '') },
    { domain: 'c.cn', name: 'C', category: 'X', state: 'error', allowed: null },
  ];
  const md = render({ scannedAt: '2026-10-14T00:00:00Z', from: 'test', results });
  assert.match(md, /成功读取 2 个/);
  assert.match(md, /百度能抓.*\| 1 \| 50% \|/);
  assert.match(md, /共 1 个/);
});
