import test from "node:test";
import assert from "node:assert/strict";
import { newToken, hashToken, newReference, rateLimit, escapeHtml, escapeRegex } from "../src/lib/security.js";

test("tokens are long, unique and hashed deterministically", () => {
  const a = newToken();
  assert.ok(a.length >= 40);
  assert.notEqual(a, newToken());
  assert.equal(hashToken(a), hashToken(a));
  assert.notEqual(hashToken(a), a);
});

test("references look right and do not collide in a small sample", () => {
  const refs = new Set(Array.from({ length: 2000 }, newReference));
  assert.equal(refs.size, 2000);
  for (const r of refs) assert.match(r, /^CC-[A-HJ-NP-Z2-9]{8}$/);
});

test("rate limiter blocks after the limit and is per key", () => {
  const key = `t-${Math.random()}`;
  for (let i = 0; i < 3; i++) assert.ok(rateLimit(key, { limit: 3, windowMs: 1000 }).ok);
  assert.equal(rateLimit(key, { limit: 3, windowMs: 1000 }).ok, false);
  assert.ok(rateLimit(`${key}-other`, { limit: 3, windowMs: 1000 }).ok);
});

test("escaping helpers", () => {
  assert.equal(escapeHtml(`<img src=x onerror="a">`), "&lt;img src=x onerror=&quot;a&quot;&gt;");
  assert.equal(new RegExp(escapeRegex("a.b(c)")).test("a.b(c)"), true);
  assert.equal(new RegExp(escapeRegex(".*")).test("anything"), false);
});
