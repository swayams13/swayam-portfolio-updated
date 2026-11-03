// Local inspection of the generated Vercel artifact, not an emulator of Vercel's edge.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";

const root = resolve(".vercel/output/static");
const entry = resolve(".vercel/output/functions/__server.func/index.mjs");
const { default: app } = await import(pathToFileURL(entry).href);
const configuration = JSON.parse(await readFile(resolve(".vercel/output/config.json"), "utf8"));
const headerRoutes = configuration.routes.filter(
  (route) => route.headers && route.src && route.continue,
);
const port = Number(process.env.PORT || 4175);
const origin = `http://127.0.0.1:${port}`;
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".vtt": "text/vtt",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, origin);
    for (const route of headerRoutes) {
      if (new RegExp(`^${route.src}$`).test(url.pathname)) {
        for (const [key, value] of Object.entries(route.headers)) res.setHeader(key, value);
      }
    }
    if (url.pathname.startsWith("/assets/"))
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    const file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(400).end("Invalid path");
      return;
    }
    if (req.method === "GET" || req.method === "HEAD") {
      const info = await stat(file).catch(() => null);
      if (info?.isFile()) {
        res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
        res.end(req.method === "HEAD" ? undefined : await readFile(file));
        return;
      }
    }
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const request = new Request(url, {
      method: req.method,
      headers,
      ...(hasBody ? { body: Readable.toWeb(req), duplex: "half" } : {}),
    });
    const response = await app.fetch(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body && req.method !== "HEAD")
      await pipeline(Readable.fromWeb(response.body), res);
    else res.end();
  } catch (error) {
    console.error("Local artifact preview failed:", error);
    if (!res.headersSent) res.writeHead(500);
    res.end("Local preview failed");
  }
}).listen(port, "127.0.0.1", () => console.log(`Vercel artifact preview: ${origin}`));
