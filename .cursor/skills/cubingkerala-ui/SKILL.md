---
name: cubingkerala-ui
description: >-
  UI guidance for Cubing Kerala. Home `/` is a Supabase-inspired shadcn
  landing. Other routes keep the original promo-card language unless the user
  asks to restyle them.
---

# Cubing Kerala UI

## Home `/`

Two viewport screens, start-aligned. Slim navbar. CK SVG favicon. No table,
Lottie, logo image, or landing grid.

**Screen 1 — Hero:** Left = community H1 (`text-4xl md:text-5xl`) + Join
WhatsApp. Right = Apple-style browser card for the next upcoming competition,
else latest past. Below = “Everything for cubing in Kerala” destination cards.

**Screen 2 — Unravel:** Left = Unraveling headline + about. Right = Mission +
Follow us on socials (icon + name). Below = Get in touch destination-style card.

**Navbar:** Wordmark `Cubing Kerala`. Muted links and GitHub with accent hover.
Compact primary Login; compact red Logout. No theme toggle (footer has it).

**Footer:** Wordmark + nav + social icons + theme toggle. One copyright line
with Allen John credit. No Login/Logout.

Light/dark via semantic tokens. `.ck-landing` scopes the green primary.

Do not bring back GradientText, DotPattern, ShinyButton, RainbowButton, a
floating pill navbar, centered landing copy, `lg:text-7xl` headlines, the
competitions dashboard table, or a Lottie on `/`.

## Competitions `/competitions`

Landing chrome (`.ck-landing`). No FadeUp / BlurIn / table reveal. Page title
matches the home H1 scale. Data table is a rounded bordered grid (Date, Name,
Status, Location, Events) with a search bar above it — no insert action.

Competition detail `/competitions/[compId]`: start-aligned H1, date subtitle,
two-column details (event left, registration/organizers right), shared grid
for results. Links use primary. No motion.

## Rankings `/rankings`

Same landing chrome and grid table as competitions. Headings stay `#`, Name,
Best, NR, CR, WR. Event/round filter in the header. No motion, no gray row fills.

## Members `/members`

Same landing chrome and grid table. Headings stay `#`, Name, WCA ID, Role,
Competitions, Medals. Search in the table toolbar. Join Cubing Kerala stays in
the page header. No motion, no gray row fills.

Member detail `/members/[wca_id]`: start-aligned H1, role subtitle, avatar on
the right, labeled stats, shared grid for personal records. No motion.

## Learn `/learn`

Landing chrome. Page H1 plus Beginner / Intermediate / Advanced sections.
Video cards match destination cards (`shadow-none`). No FadeUp, BlurIn, or
shiny coming-soon chrome on this page.

## Other routes

Keep bordered promo cards, green eyebrows, and `AnimatedContactLink` unless
asked to restyle.
