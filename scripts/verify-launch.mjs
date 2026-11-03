import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { gzipSync } from "node:zlib";
import { JSDOM } from "jsdom";
import app from "../.vercel/output/functions/__server.func/index.mjs";
import { securityHeaders } from "./security-headers.mjs";
const origin = "https://preview.example";
const staticRoot = resolve(".vercel/output/static");
const configuration = JSON.parse(await readFile(".vercel/output/config.json", "utf8"));
const functionConfig = JSON.parse(
  await readFile(".vercel/output/functions/__server.func/.vc-config.json", "utf8"),
);
assert.equal(functionConfig.runtime, "nodejs22.x");
assert.equal(functionConfig.supportsResponseStreaming, true);
assert.deepEqual(configuration.routes[0], {
  src: "/(.*)",
  headers: securityHeaders,
  continue: true,
});
assert.equal(configuration.routes.filter((route) => route.headers?.["X-Frame-Options"]).length, 1);
const sitemap = await readFile(join(staticRoot, "sitemap.xml"), "utf8");
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
const documents = new Map();
for (const path of [...paths, "/design-system"]) {
  const response = await app.fetch(new Request(origin + path));
  assert.equal(response.status, 200, path);
  const doc = new JSDOM(await response.text(), { url: origin + path }).window.document;
  documents.set(path, doc);
  const ids = [...doc.querySelectorAll("[id]")].map((element) => element.id);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${path}`);
  assert.equal(doc.querySelectorAll("h1").length, 1, `Heading: ${path}`);
  if (path !== "/design-system")
    assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1, `Canonical: ${path}`);
  const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((element) =>
    JSON.parse(element.textContent),
  );
  assert.ok(
    schemas.some((value) => value["@type"] === "Person" && value.name === "Swayam Singh"),
    path,
  );
  for (const schema of schemas) {
    assert.ok(!schema.review && !schema.aggregateRating);
  }
}
let checked = 0;
for (const [path, doc] of documents) {
  for (const anchor of doc.querySelectorAll("a[href]")) {
    const url = new URL(anchor.getAttribute("href"), origin + path);
    if (url.origin !== origin) continue;
    assert.ok(documents.has(url.pathname), `Unknown internal page: ${path} -> ${url.pathname}`);
    if (url.hash) {
      const target = decodeURIComponent(url.hash.slice(1));
      assert.ok(
        documents.get(url.pathname).getElementById(target),
        `Missing anchor: ${path} -> ${url.pathname}#${target}`,
      );
    }
    checked++;
  }
  for (const element of doc.querySelectorAll("[aria-controls]"))
    for (const id of element.getAttribute("aria-controls").split(/\s+/))
      assert.ok(doc.getElementById(id), `Missing aria-controls ${path}: ${id}`);
  for (const img of doc.querySelectorAll("img")) {
    assert.ok(img.hasAttribute("alt"), `Missing alt: ${path}`);
    assert.ok(img.width && img.height, `Missing dimensions: ${path}`);
  }
  for (const video of doc.querySelectorAll("video")) {
    assert.ok(!video.autoplay);
    assert.equal(video.preload, "none");
    assert.ok(video.hasAttribute("controls") || video.closest("[inert]"));
  }
}
const secretMarkers = [
  "RESEND_API_KEY",
  "OPENAI_API_KEY",
  "INQUIRY_RATE_SECRET",
  "UPSTASH_REDIS_REST_TOKEN",
  "api.resend.com",
  "api.openai.com",
  "redis.call",
];
const files = [];
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) await collect(file);
    else files.push(file);
  }
}
await collect(staticRoot);
for (const file of files) {
  assert.ok(!/\.(?:pem|key|p12|map)$|\/.env(?:\.|$)/.test(file), `Unexpected public file: ${file}`);
  if (/\.(?:js|json|html|css)$/.test(file)) {
    const text = await readFile(file, "utf8");
    for (const marker of secretMarkers)
      assert.ok(!text.includes(marker), `Server marker in static output: ${marker}`);
  }
}
const main = files.find((file) => /\/assets\/index-[^/]+\.js$/.test(file));
assert.ok(main);
const code = await readFile(main);
assert.ok(gzipSync(code).length < 150000, "Main JS exceeds the 150KB gzip review budget");
console.log(
  `${documents.size} pages; ${checked} internal links/anchors; IDs, semantics, metadata, media and public boundary passed.`,
);
console.log(
  `Main JS: ${code.length} bytes raw / ${gzipSync(code).length} bytes gzip. Baseline security headers precede file/server routes.`,
);
