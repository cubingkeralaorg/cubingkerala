# Page inventory

## Home `/`

**Files:** `src/app/page.tsx`, `src/components/home/*`

Two full-viewport screens:

1. Hero — community headline + featured meet browser card + destination cards
2. Unravel — about + mission + socials, then Get in touch

Featured competition: next upcoming (not cancelled), else latest past, else
browse-competitions fallback. Fetch via `getCachedCompetitions` (`revalidate =
300`). Helper: `src/utils/featuredCompetition.ts`.

Navbar wordmark: Cubing Kerala. Favicon: `src/app/icon.svg` (CK).
