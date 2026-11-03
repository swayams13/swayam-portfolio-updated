> Historical phase report. For current delivery activation, shared limits, analytics and SEO, follow [Phase 6](PHASE6_CONVERSION.md).

# Step 4 — Inquiry delivery integration

1 November 2026. Integration implemented locally; **live Resend sending and inbox receipt are not yet verified**. No Resend credentials or verified sender were supplied. No account was created, no live email was sent, and nothing was deployed.

## Configured public contact

- Public email and intended recipient: sswayam506@gmail.com (provided by Swayam).
- Provider selected: Resend.
- No calendar URL supplied. The current call action requests a complimentary 20-minute discovery call by email. It is not an automated booking.

## Implemented behavior

- Native TanStack Start `/api/inquiry` server route: GET exposes only readiness and a validated optional HTTPS booking URL; POST validates the inquiry and submits plain-text email to Resend.
- Sender and recipient come from server configuration, never visitor input. The visitor's validated address is used only for Reply-To. Secret configuration and provider request code are absent from inspected client build files.
- Shared Zod validation, field limits, bounded JSON request body, strict same-origin POST check and a honeypot field.
- Per-instance email/global request limits, bounded pending work, concurrent duplicate coalescing and short-lived accepted-request cache. These are basic safeguards, not distributed abuse protection. Configure host-level rate limiting before public launch.
- Provider idempotency key binds the request identifier to the exact message payload. Retrying unchanged input reuses the key; edited input gets a new client identifier. Provider failure never becomes apparent success.
- Ten-second provider timeout and fifteen-second browser timeout. Ambiguous results retain input and allow retry with the same identifier; no automatic endless retry loop.
- Pending/disabled form state, accessible field/error/status feedback and input preservation. Success means provider acceptance, explicitly distinguished from inbox receipt.
- If delivery is unavailable or readiness lookup fails: direct email, discovery-call email request and a local draft/copy/email-app option remain available. Drafting does not send anything.
- Optional budget, current workflow and preferred contact method remain supported. No contact data is written to browser storage, analytics or application logs by this code. Recipient inbox/provider retention is a separate operational policy to agree before launch.

## Files

`src/lib/inquiry.ts` (shared schema/text); `src/server/inquiry.server.ts` (server boundary/provider adapter); `src/routes/api.inquiry.ts` (native server route); `src/components/site/Contact.tsx` (contact workflow); `AboutContact.tsx` (re-export); `src/lib/content.ts` (public contact); stylesheet; `.env.example`; `.gitignore`; generated route tree; server/UI tests and a Node-safe test setup.

## Activate Resend

1. Create/sign in to your Resend account and verify a sender domain you control. The Gmail address can receive messages, but do not configure it as a domain-verified sender.
2. Create a sending API key. Enter it only in local server environment or hosting secrets; do not paste it into chat, source code or a `VITE_` variable.
3. Configure the values listed in `.env.example`:
   - `RESEND_API_KEY`: your sending key.
   - `CONTACT_FROM`: verified sender, e.g. `Swayam Portfolio <inquiries@your-domain>` using your actual domain.
   - `CONTACT_TO`: `sswayam506@gmail.com`.
   - `BOOKING_URL`: optional public HTTPS link for your 20-minute appointment.
4. Restart the server after environment changes. For Node/Vite local development, ensure these variables are exported into the process environment; do not assume arbitrary values in a copied `.env` file are automatically populated. Hosting variables must be configured at runtime, not only during build. `.env`/`.env.*` are ignored except the empty example file.
5. Confirm GET `/api/inquiry` returns `deliveryAvailable: true` without returning secret/sender/recipient configuration. Readiness checks configured values, not account validity or verified-domain status.
6. Send one controlled inquiry from the hosted preview. Confirm provider acceptance, actual inbox receipt and Reply-To behavior. Check spam/bounce status in the provider dashboard. Record the test; never declare inbox delivery based only on an HTTP 200 response.
7. Add host-level rate limits and finalized privacy/retention wording. The current Cloudflare-targeted build still needs the separately planned Vercel deployment verification.

Provider setup may require an owned sender domain before the portfolio gets its final domain. Do not use invented sender details to make the form appear enabled.

## Actual validation

- Production build and TypeScript passed; lint has zero errors and six existing UI Fast Refresh warnings.
- 46 tests passed across five files after correcting a concurrency race caught by the new server tests.
- Provider calls in tests are mocked. Tested invalid fields, blank budget, cross-origin rejection, malformed/oversized bodies, unconfigured delivery, fixed recipient and Reply-To, accepted retries, edited messages, concurrent duplicates, provider HTTP/network/invalid-acknowledgment failures, limits and expiry.
- UI tests cover unavailable delivery/email draft, provider failure then success, preserved fields, stable retry identifier, pending duplicate prevention and safe booking links.
- Real local HTTP GET returned 200 with `deliveryAvailable: false`; a synthetic POST returned 503 and explicitly stated the inquiry was not sent. This validates the actual route's unconfigured path, not live delivery.
- Browser fallback form prepared a local draft without sending; public contact/discovery mailto links were rendered. Mobile document width matched the 390px viewport; no console warnings/errors captured in inspected states.
- Client-output scan found no `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` or provider endpoint code in `.output/public` after the build.
- No real provider delivery, inbox receipt, calendar availability, distributed rate limit, production-host origin behavior or comprehensive screen-reader testing has been performed.

Screenshot: `screenshots/step4-contact.jpg`.

## References

Implementation follows the native [TanStack server route interface](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes) and Resend's [Send Email API](https://resend.com/docs/api-reference/emails/send-email) / [idempotency support](https://resend.com/changelog/idempotency-keys). No provider SDK or framework migration was added.
