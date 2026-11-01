// Verify the generated server artifact without sending a real inquiry.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import app from "../.vercel/output/functions/__server.func/index.mjs";

const source = await readFile(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const slugs = [...source.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
assert.ok(slugs.length > 0);
for (const path of ["/", ...slugs.map((slug) => `/work/${slug}`)]) {
  const response = await app.fetch(new Request(`https://preview.example${path}`));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /name="description"/);
  console.log(`200 + metadata: ${path}`);
}
for (const path of ["/not-a-page", "/work/not-a-project"]) {
  const response = await app.fetch(new Request(`https://preview.example${path}`));
  assert.equal(response.status, 404, path);
  console.log(`404: ${path}`);
}
const readiness = await app.fetch(new Request("https://preview.example/api/inquiry"));
assert.equal(readiness.status, 200);
assert.match(readiness.headers.get("cache-control"), /no-store/);
const config = await readiness.json();
assert.deepEqual(Object.keys(config).sort(), ["bookingUrl", "deliveryAvailable"]);
// Deliberately invalid input: validation must reject before any provider call.
const invalid = await app.fetch(
  new Request("https://preview.example/api/inquiry", {
    method: "POST",
    headers: { Origin: "https://preview.example", "Content-Type": "application/json" },
    body: "{}",
  }),
);
assert.equal(invalid.status, 400);
console.log(
  `Inquiry readiness: ${config.deliveryAvailable}; invalid POST: 400; no live email sent`,
);
console.log(
  "Vercel artifact checks passed. Hosted edge behavior and inbox delivery require separate checks.",
);
