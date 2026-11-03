// Applied before filesystem/server routing in the Vercel Build Output API.
// This baseline intentionally does not claim a nonce-based script CSP.
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy":
    "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'",
};
