# Swayam Singh — Industry → Intelligence

Industrial consulting portfolio built with TanStack Start, React 19, TypeScript, Tailwind 4 and Vite. The original Lovable export is preserved in `five-scene-homepage-story.zip`; application source is now available at the repository root.

## Local development

Use Node 22.23.2 (`nvm use`) and Bun 1.4.4.

```sh
bun install --frozen-lockfile
bun run dev --host 127.0.0.1 --port 5174
```

Visit http://127.0.0.1:5174. If Bun is not installed, a temporary runner can be used with `npx --yes --package=bun@1.4.4 bun install --frozen-lockfile`.

## Validation

```sh
bun run typecheck
bun run lint
bun run test
bun run build
```

The Vite/Lovable configuration supplies TanStack, React, Tailwind and Nitro plugins; do not add duplicate plugins. The default build retains Lovable’s Cloudflare-module target. `bun run build:vercel` selects Nitro’s Vercel preset and writes `.vercel/output` without changing frameworks or duplicating plugins. `vercel.json` selects this command for Vercel Git deployments. See [Step 5 deployment instructions](docs/STEP5_RELEASE.md). A hosted deployment and live inquiry delivery still require account configuration.

## Scope

This phase provides the visual foundation, five industry previews, five distinct project showcases, ten case-study URLs, a local workflow guide and an inquiry draft. Industrial interfaces and environments remain explicitly illustrative. The contact form uses a server-side Resend integration when configured; until then it offers an explicitly unsent email draft. See docs/STEP4_INQUIRY.md for activation and verification. No client production system is connected. The optional Solutions Advisor uses public project lookup by default; server-configured OpenAI fact matching requires visitor opt-in and shared cost controls. See docs/PHASE5_ADVISOR.md for setup, limits and verification requirements.

Content and project/capability statuses live in `src/lib/content.ts`. Preserve the honesty states and the Lovable history rules in AGENTS.md.

See `docs/FOUNDATION_HANDOFF.md` for changed files, validation, screenshots and remaining work. The architecture, design system, storyboard and asset manifest remain in `docs/`.

## Current conversion setup (Phase 6)

See [Phase 6 conversion handoff](docs/PHASE6_CONVERSION.md) for the current inquiry security gate, local test mode, Resend/Upstash runtime configuration, optional analytics and SEO verification. Earlier Step 4/5 instructions are historical. Production email requires the shared gate and rate secret as well as provider configuration. No real inbox delivery has been verified.

## Production QA handoff

Start with [launch-checklist.md](docs/launch-checklist.md), [production-qa-report.md](docs/production-qa-report.md), [operations-runbook.md](docs/operations-runbook.md) and [content-update-guide.md](docs/content-update-guide.md). `bun run verify:launch` adds complete internal-link and public-boundary checks after the Vercel build. Production promotion remains blocked until real delivery and hosted security/privacy checks pass.
