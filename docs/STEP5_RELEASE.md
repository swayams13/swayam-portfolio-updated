# Step 5 — Vercel build and release verification

1 November 2026. Local deployment preparation and artifact QA completed. **No hosted Vercel deployment, production publication or live inbox delivery is claimed.** Swayam has a Vercel account and will connect it. There is no local CLI authentication or linked Vercel project available in this workspace.

## Changes

- `vercel.json`: frozen Bun installation and the explicit `build:vercel` command.
- `package.json`: `build:vercel`, `preview:vercel`, `verify:vercel` scripts. The existing default build and Vite configuration remain intact for Lovable.
- `scripts/preview-vercel.mjs`: localhost-only adapter serving generated static files and the generated Web Request handler. This is a local inspection aid, not a Vercel edge/routing/cache emulator. Do not deploy this adapter as the application server.
- `scripts/verify-vercel.mjs`: repeatable generated-artifact checks for every case study, page metadata, unknown-route statuses, inquiry readiness and invalid input. No live email sent.
- Git, ESLint and Prettier exclude generated `.vercel` files. README updated.

The existing Lovable wrapper already supports Nitro provider selection through `NITRO_PRESET`. No additional Nitro plugin, framework migration, SPA catch-all rewrite or duplicated server entry was introduced. Vercel output contains a Node 22 function with streaming support, static assets and generated routing. Keep that routing; do not redirect every path to an HTML file, which would break the inquiry API and true 404 responses.

## Local commands

Use Node 22.23.2 and the declared Bun 1.4.4 package manager:

```sh
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run lint
bun run build:vercel
bun run verify:vercel
bun run preview:vercel
```

Local production-artifact preview: http://127.0.0.1:4175. The preview adapter expects to run from the repository root after the Vercel build. Restart it after rebuilding. Do not rely on the original `vite preview` for this target: it attempted to import the absent `dist/server/server.js` in the installed plugin combination. The purpose-built adapter serves `.vercel/output` instead.

## Create the hosted preview

1. Authenticate your Vercel account locally; credentials stay in the account/CLI, never in chat. If using the CLI: `bunx vercel login`, then `bunx vercel link` from the repository root. Select the intended account/project.
2. Use Node 22.x, root directory `./`, install `bun install --frozen-lockfile`, build `bun run build:vercel`. Leave Output Directory unset; Nitro supplies the Build Output API directory `.vercel/output`. Keep `vercel.json` checked in. No extra rewrites or static-only preset.
3. For a preview without production promotion, run `bunx vercel` (without `--prod`) after linking. This uploads the local source. Prefer a normal source deployment after configuring secrets; do not assume an artifact built before linking has the intended project's environment.
4. Alternatively connect GitHub and deploy a review branch as a Preview deployment. The original remote contained only the ZIP. This source handoff includes the extracted application, implementation work and deployment configuration at the repository root. Use the updated `main` branch for Git-based deployment after confirming the source commit is visible on GitHub. Do not rewrite Lovable history. An initial repository import may create a production deployment; use the CLI preview path when production publication is not intended.
5. Confirm the hosted URL, runtime logs and exact source revision. Test direct HTTP requests and navigation on the hosted origin; local checks below do not prove CDN/runtime behavior.
6. Retain Preview protection where appropriate and verify indexing headers. No public production launch is part of this handoff.

## Preview environment

Configure Preview scope first, then redeploy:

| Variable         | Value / purpose                              |
| ---------------- | -------------------------------------------- |
| `RESEND_API_KEY` | Sending key, server secret                   |
| `CONTACT_FROM`   | Actual sender on your verified Resend domain |
| `CONTACT_TO`     | `sswayam506@gmail.com`                       |
| `BOOKING_URL`    | Optional HTTPS 20-minute appointment link    |

Do not prefix secrets with `VITE_`. No sender domain, key or calendar URL has been supplied. With missing delivery settings, readiness is false and the page offers an explicitly unsent email draft. This is useful during preview; a live verified inquiry channel remains a launch gate. See [Step 4](STEP4_INQUIRY.md).

## Actual results

| Check                          | Result                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Vercel production build        | Passed; `.vercel/output/config.json` version 3, generated Node 22 server function                            |
| Default Lovable build          | Passed separately; Cloudflare-module output retained                                                         |
| TypeScript                     | Passed                                                                                                       |
| Vitest                         | 46 tests passed across 5 files                                                                               |
| ESLint                         | Zero errors; 6 existing Fast Refresh warnings in UI primitives                                               |
| Generated server page requests | Homepage and all 10 case studies: 200, English document, title/description present                           |
| Unknown requests               | `/not-a-page` and `/work/not-a-project`: 404                                                                 |
| Inquiry artifact checks        | GET 200, no-store, only public readiness fields; invalid JSON-object payload POST 400; no provider request   |
| Inquiry configuration          | `deliveryAvailable: false`, no booking URL; live sending not tested                                          |
| Static/client boundary         | No `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` or Resend endpoint strings found in generated static files |
| Browser render                 | Generated artifact rendered successfully through the local adapter                                           |
| Responsive DOM                 | Document width matched 1440, 768, 390 and 320px viewports in inspected states                                |
| Desktop content checks         | One h1, English language, zero broken loaded images, no missing local hash targets                           |
| Keyboard/dialog                | Mobile menu opens with close focused; Escape closes it and returns focus to Menu                             |
| Demo navigation                | MOS direct demo hash opens its disclosure                                                                    |
| Browser console                | No warning/error entries captured in inspected production-preview states                                     |
| Screenshots                    | Desktop 1440×1000, tablet 768×1024, mobile 390×844 in `screenshots/step5-*.jpg`                              |

These are focused local checks. No hosted-origin test, Lighthouse score, field performance measurement, full screen-reader audit, automated axe audit, real-device/cross-browser certification or operating-system reduced-motion emulation was performed. Existing CSS reduced-motion handling is retained; these checks do not certify accessibility compliance.

## Remaining release gates

- Connect Vercel and create a real Preview deployment. Verify homepage/all work URLs, unknown 404s, static assets, hash links, inquiry origin checks, runtime environment and logs there.
- Configure Resend with a verified sender and test one controlled inquiry: provider acceptance, actual inbox receipt, Reply-To, spam/bounce status and retry behavior. Do not use GET readiness as evidence of verified delivery.
- Configure host-level abuse protection for `/api/inquiry`. Current counters are per instance and reset on cold starts; they are not distributed rate limits. Confirm the available Vercel Firewall controls in the chosen account.
- Decide the stable public URL. Canonical URLs, sitemap, absolute social URL/image and final-domain indexing remain pending; no invented domain was inserted. Titles/descriptions are present. Existing robots file allows crawling; inspect preview noindex/protection before sharing widely and configure production indexing deliberately.
- Approve a real social preview image and favicon/identity, final privacy/retention wording, project evidence/statuses and public contact details. Current product demos remain illustrative.
- Check hosted loading on a documented mobile network/device profile; test keyboard, focus, zoom, reduced motion, screen-reader labels and real Safari/Chromium devices. Do not infer performance from artifact size or screenshots.

## Rollback

Production has not been changed, so no production rollback was required. Keep the ZIP and existing published history intact. For the first hosted preview, record deployment URL, Git SHA (if source committed), environment names and review result. Do not record secret values.

Once there is a verified production deployment, use Vercel's deployment rollback/promotion controls to restore that specific release if a new release fails. Recheck `/api/inquiry` after rollback: presentation rollback must not accidentally restore obsolete delivery settings. Provider-accepted inquiries remain in the provider/inbox; they are not stored in the website. Before any first production promotion, obtain owner release review and complete the hosted checks above.

## Sources

[Nitro Vercel deployment](https://nitro.build/deploy/providers/vercel) and [Vercel TanStack Start guide](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel), checked alongside the installed Lovable wrapper declarations and generated output. Provider documentation may differ from this pinned Nitro beta; the successful local artifact build verifies this installed combination only.

## GitHub source handoff

The complete application, assets, documentation, tests, lockfile and Vercel configuration are included in the source handoff. The original ZIP is retained. Credentials, dependencies, generated builds and local Vercel project files are excluded. Publishing source to GitHub does not itself verify a Vercel deployment or activate Resend.
