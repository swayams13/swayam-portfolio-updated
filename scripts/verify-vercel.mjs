// Verify the generated server artifact without sending a real inquiry.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import app from "../.vercel/output/functions/__server.func/index.mjs";

const source = await readFile(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const slugs = [...source.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
assert.ok(slugs.length > 0);
for (const path of [
  "/",
  "/advisor",
  "/privacy",
  "/samples",
  "/projects",
  "/design-system",
  ...slugs.map((slug) => `/work/${slug}`),
]) {
  const response = await app.fetch(new Request(`https://preview.example${path}`));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /name="description"/);
  if (path !== "/design-system") {
    assert.ok(html.includes(`href="https://swayam-singh.vercel.app${path}"`), path);
    assert.match(html, /property="og:url"/);
  }
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, path);
  if (path.startsWith("/work/")) {
    assert.match(html, /rel="canonical"/);
    assert.ok(html.includes(`href="https://swayam-singh.vercel.app${path}"`), path);
    const structured = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
    assert.ok(structured, path);
    const data = JSON.parse(structured[1]);
    assert.equal(data["@type"], "CreativeWork");
    assert.equal(data.url, `https://swayam-singh.vercel.app${path}`);
    assert.ok(!("aggregateRating" in data));
  }
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

// Gallery search state must render server-side and survive the case-study return link.
const galleryPage = await app.fetch(
  new Request("https://preview.example/?industry=epc&project=tender-to-quotation"),
);
assert.equal(galleryPage.status, 200);
assert.match(
  await galleryPage.text(),
  /aria-label="2 of 3: Tender-to-Quotation Intelligence" aria-hidden="false"/,
);
const galleryCase = await app.fetch(
  new Request("https://preview.example/work/tender-to-quotation?galleryIndustry=epc"),
);
assert.equal(galleryCase.status, 200);
assert.match(await galleryCase.text(), /industry=epc(?:&amp;|&)project=tender-to-quotation/);
console.log("Gallery SSR selection and case return URL: passed");

// Advisor smoke checks never enable a paid provider request or transfer a lead.
const advisorStatus = await app.fetch(new Request("https://preview.example/api/advisor"));
assert.equal(advisorStatus.status, 200);
assert.deepEqual(Object.keys(await advisorStatus.json()), ["aiAvailable"]);
const advisorAnswer = await app.fetch(
  new Request("https://preview.example/api/advisor", {
    method: "POST",
    headers: { Origin: "https://preview.example", "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "Is CAD integration implemented in Engineering Automation Suite?",
      allowAI: false,
    }),
  }),
);
assert.equal(advisorAnswer.status, 200);
const answer = await advisorAnswer.json();
assert.equal(answer.mode, "lookup");
assert.match(answer.message, /I don't have verified information about that/);
assert.ok(answer.facts.some((fact) => fact.state === "planned" && fact.text.includes("CAD")));
const invalidAdvisor = await app.fetch(
  new Request("https://preview.example/api/advisor", {
    method: "POST",
    headers: { Origin: "https://preview.example", "Content-Type": "application/json" },
    body: JSON.stringify({ question: "Track jobs", privateFile: "no" }),
  }),
);
assert.equal(invalidAdvisor.status, 400);
console.log(
  "Advisor readiness + grounded lookup + strict input: passed; no paid provider request or lead sent",
);

// Static SEO assets are served by Vercel, separately from the server function.
const sitemap = await readFile(
  new URL("../.vercel/output/static/sitemap.xml", import.meta.url),
  "utf8",
);
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(locations.length, slugs.length + 5);
assert.equal(new Set(locations).size, locations.length);
for (const slug of slugs)
  assert.ok(locations.includes(`https://swayam-singh.vercel.app/work/${slug}`));
assert.ok(!sitemap.includes("design-system") && !sitemap.includes("/api/"));
const robots = await readFile(
  new URL("../.vercel/output/static/robots.txt", import.meta.url),
  "utf8",
);
assert.match(robots, /Sitemap: https:\/\/swayam-singh.vercel.app\/sitemap.xml/);
const analyticsInvalid = await app.fetch(
  new Request("https://preview.example/api/analytics", {
    method: "POST",
    headers: { Origin: "https://preview.example", "Content-Type": "application/json" },
    body: JSON.stringify({ event: "inquiry_submitted", email: "fixture@example.com" }),
  }),
);
assert.equal(analyticsInvalid.status, 400);
console.log("Sitemap coverage + robots + rejection of personal analytics fields: passed");
