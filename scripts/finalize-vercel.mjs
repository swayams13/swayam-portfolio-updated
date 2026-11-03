import { readFile, writeFile } from "node:fs/promises";
import { securityHeaders } from "./security-headers.mjs";
const file = new URL("../.vercel/output/config.json", import.meta.url);
const config = JSON.parse(await readFile(file, "utf8"));
if (config.version !== 3 || !Array.isArray(config.routes))
  throw new Error("Unexpected Vercel output; headers were not installed.");
const route = { src: "/(.*)", headers: securityHeaders, continue: true };
config.routes = config.routes.filter(
  (item) =>
    !(item.src === route.src && item.continue && item.headers?.["X-Frame-Options"]) &&
    item.src !== "/fonts/(.*)\\.woff2",
);
config.routes.unshift(route);
// Fonts retain stable source filenames; use revalidation rather than immutable caching.
config.routes.splice(1, 0, {
  src: "/fonts/(.*)\\.woff2",
  headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" },
  continue: true,
});
await writeFile(file, JSON.stringify(config, null, 2) + "\n");
console.log("Vercel baseline security headers installed before static/server routes.");
