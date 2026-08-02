---
name: cubingkerala-ui
description: >-
  UI guidance for Cubing Kerala that preserves the existing visual language
  (GradientText, bordered promo sections, green eyebrows, Shiny/Rainbow
  buttons, DotPattern). Use when editing home, competitions, rankings, or
  members UI. Prefer enhancing content and hierarchy inside the current style
  over restyling the site to a new aesthetic.
---

# Cubing Kerala UI

Preserve the site’s established look. Content and hierarchy can change; the
visual system should not be replaced wholesale.

## Existing visual language (keep)

- Brand: `GradientText` (“Cubing Kerala”)
- Hero chrome: `ComingSoonBadge`, `DotPattern`, `ShinyButton`, `RainbowButton`
- Sections: muted bordered cards (`bg-neutral-500/[0.04] border rounded-lg`)
- Eyebrows: `text-green-500` labels
- CTAs: `AnimatedContactLink` on marketing sections
- Motion: `FadeUp` / `StaggerReveal` / `FadeIn` with `reveal-config`
- Font: Rubik via `--font-sans`
- Theme: light/dark CSS variables in `globals.css`

Do **not** apply a flat editorial restyle, remove the promo cards, or swap in a
new token system unless the user explicitly asks for a redesign.

## Content rules that do change

Home hero should feature a competition when data exists:

1. Prefer the next non-cancelled **upcoming** competition
2. Else fall back to the most recent non-cancelled **past** competition
3. Else keep the classic community headline + Contact / WhatsApp CTAs

When featuring a competition in the hero (still in the existing style):

- Green eyebrow: “Next competition” or “Latest competition”
- H1: competition name
- Subcopy: date · city · event count
- Primary `ShinyButton`: View competition / View results
- Secondary `RainbowButton`: Join WhatsApp

Fetch via `getCachedCompetitions` on the home page (`revalidate = 300`).

## Stack constraints

- Next.js App Router, Tailwind, existing `components/ui` and `components/home`
- No drive-by auth/Prisma/API changes for visual work
- Match dark + light; keep mobile layout of existing sections

## Page jobs

| Route | Job |
|-------|-----|
| `/` | Brand + featured competition (or community fallback), then section CTAs |
| `/competitions` | Browse upcoming and past |
| `/rankings` | Compare results |
| `/members` | Find cubers |
| `/learn` | Learning content |

## Additional notes

- For page-level inventory see [pages.md](pages.md)
- The personal `frontend-design` skill is optional reference only; **this site’s
  existing style wins** unless the user requests a new direction
