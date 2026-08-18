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

## Other routes

Keep bordered promo cards, green eyebrows, and `AnimatedContactLink` unless
asked to restyle.
