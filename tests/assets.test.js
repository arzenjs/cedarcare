import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { doctors } from "../src/data/doctors.js";
import { images } from "../src/config/images.js";

const publicFile = (src) => new URL(`../public${src}`, import.meta.url);

test("every image referenced in the code exists and is an SVG document", () => {
  const sources = [...doctors.map((d) => d.image), ...Object.values(images).map((i) => i.src), "/favicon.svg", "/logo.svg", "/logo-light.svg"];
  for (const src of sources) {
    assert.ok(existsSync(publicFile(src)), `${src} is missing`);
    assert.match(readFileSync(publicFile(src), "utf8"), /^<svg[\s>]/, `${src} is not an SVG`);
  }
  assert.ok(existsSync(publicFile("/apple-touch-icon.png")));
});

test("every doctor has a distinct portrait and alt text", () => {
  assert.equal(new Set(doctors.map((d) => d.image)).size, doctors.length);
  for (const d of doctors) assert.ok(d.imageAlt.includes(d.name));
});
