import crypto from "node:crypto";

// ---------- Rate limiting ----------
// IMPORTANT: this limiter lives in server memory. It slows down abuse on a single
// server (local, a VPS), but it is NOT shared between serverless instances (e.g. Vercel).
// For real production protection use a shared store such as Upstash Redis:
// replace the body of rateLimit() and keep the same signature.
const buckets = new Map();

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear(); // crude memory guard
  return { ok: true };
}

export function clientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : request.headers.get("x-real-ip")) || "unknown";
}

// ---------- Tokens ----------
/** Random token to give to the user; store only its hash. */
export const newToken = () => crypto.randomBytes(32).toString("base64url");
export const hashToken = (token) => crypto.createHash("sha256").update(String(token)).digest("hex");

// Readable booking reference without look-alike characters (no 0/O, 1/I).
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newReference() {
  let out = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) out += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  return `CC-${out}`;
}

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
