<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Content (scenes, projects, statuses) lives in `src/lib/content.ts`; components read from it — keeps copy honest and editable in one place.
- Cinematic scroll uses GSAP loaded dynamically in `useEffect` with `gsap.matchMedia`; mobile/reduced-motion get stacked static scenes — SSR-safe and accessible.
- Scroll scenes use `useCine` (src/lib/useCine.ts) plus the `cine:` Tailwind variant for desktop-only pinned layouts; each Featured Work showcase lives in `src/components/site/work/` with its own interaction pattern — avoids repeated card layouts and keeps mobile static.
- Project capabilities carry an honesty state (Implemented / In development / Planned / To verify) and statuses use only the six allowed labels — planned work must never read as shipped.
- Scenes accept `image` or `video` so rendered assets drop in without layout changes (see docs/ASSET_MANIFEST.md).
- Never show invented metrics, clients, or testimonials; label sample UI as illustrative.
