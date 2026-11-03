# Phase 6 initial contact audit

2026-11-02. Before implementation, GET https://swayam-singh.vercel.app/api/inquiry returned {"deliveryAvailable":false,"bookingUrl":null}. No live inquiry was sent. The readiness endpoint is public configuration validation, not an inbox-delivery health check.

The existing server requires a Resend key, valid CONTACT_FROM and CONTACT_TO. Empty example key/from values are intentional templates. Invalid/missing hosted configuration or an older deployed revision can explain fallback; hosting secrets, sender-domain verification and deployment SHA are not visible through this endpoint, so the exact missing setting cannot be asserted.

Existing strengths: strict schema, body cap, Origin/content-type checks, honeypot, provider timeout, idempotency key, per-instance email limits, unsent-draft fallback, retry identity, honest provider-acceptance wording and optional HTTPS booking validation. Gaps: no phone/explicit privacy consent, no global abuse gate across server instances, no explicit local delivery-test mode, no privacy-controlled conversion attribution or complete funnel events, no sitemap, incomplete static-page canonical/social metadata. Native form POST without JavaScript cannot satisfy the JSON endpoint; direct email remains essential.

A successful Resend API response means provider acceptance, not inbox placement. Real recipient receipt, SPF/DKIM/DMARC authentication and sender-domain state require configured credentials/domain access and a controlled recipient test. No credentials will be invented, read into public output or committed.
