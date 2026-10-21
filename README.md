<p align="center">
  <img src="astro-app/public/cubingkerala_logo.svg" alt="Cubing Kerala logo" width="96" />
</p>

<h3 align="center">Cubing Kerala</h3>

<p align="center">
  <a href="https://github.com/cubingkeralaorg/cubingkerala/actions/workflows/astro-app-ci.yml">
    <img src="https://github.com/cubingkeralaorg/cubingkerala/actions/workflows/astro-app-ci.yml/badge.svg" alt="CI/CD Status" />
  </a>
  <a href="https://github.com/cubingkeralaorg/cubingkerala/actions/workflows/codeql.yml">
    <img src="https://github.com/cubingkeralaorg/cubingkerala/actions/workflows/codeql.yml/badge.svg" alt="CodeQL Status" />
  </a>
</p>

<p align="center">
  The official platform for Kerala's Rubik's Cube community — competitions, rankings, members, and more.
</p>

<p align="center">
  <a href="https://cubingkerala.com">cubingkerala.com</a> ·
  <a href="https://github.com/cubingkeralaorg/cubingkerala/issues">Report a Bug</a> ·
  <a href="https://github.com/cubingkeralaorg/cubingkerala/issues">Request a Feature</a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Competitions** | Browse upcoming & past WCA competitions in Kerala, synced from the live WCA API |
| **Rankings** | Member rankings by event, filterable by single/average |
| **Members** | Community directory — WCA-authenticated profiles with avatars, roles, and personal records |
| **Join Request** | Submit a join request via WCA OAuth; approved by admins (or added directly by WCA ID) |
| **Photo gallery** | Admin-managed homepage photo marquee — drag-and-drop upload straight to R2 |
| **Learn** | Resources and guides to get started with speedcubing |
| **Dark / Light Mode** | Class-based theme toggle with `localStorage` persistence, no flash on load |
| **WCA Sync** | Cloudflare Cron Trigger keeps member data and competitions updated daily |
| **Sitemap** | Auto-generated sitemap for SEO |

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Astro](https://astro.build) (SSR, Workers mode) + React islands |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 (CSS-first config) · Radix UI primitives |
| **Database** | Cloudflare D1 (SQLite) via Drizzle ORM |
| **Storage** | Cloudflare R2 (competition photos, workshop videos, PDF resources) |
| **Auth** | WCA OAuth 2.0 |
| **Markdown rendering** | `marked` + `sanitize-html` (competition info fields) |
| **Icons** | Lucide React · `@cubing/icons` · Radix Icons |
| **Deployment** | Cloudflare Workers, via GitHub Actions |

---

## 🗄 Database Tables (D1)

| Table | Purpose |
|---|---|
| `Users` | Authenticated WCA users |
| `Members` | Approved Cubing Kerala members |
| `Requests` | Pending join requests |
| `Competitions` | Kerala WCA competitions synced from the WCA API |
| `MemberWcaData` | Cached WCA competitor data per member (JSON) |
| `Photos` | Admin-managed homepage photo gallery (R2 object path + alt text) |
| `SystemMetadata` | Key/value store for sync cursors and timestamps |

Schema lives in [`astro-app/src/db/schema.ts`](astro-app/src/db/schema.ts); migrations in [`astro-app/migrations/`](astro-app/migrations/), applied via `wrangler d1 migrations apply`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node)
- A **Cloudflare account** with a D1 database and R2 bucket (see [`astro-app/wrangler.jsonc`](astro-app/wrangler.jsonc))
- WCA OAuth credentials (Client ID & Secret)
- [`wrangler`](https://developers.cloudflare.com/workers/wrangler/) (installed as a dev dependency)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/cubingkeralaorg/cubingkerala.git
cd cubingkerala/astro-app

# 2. Install dependencies
npm install

# 3. Configure local secrets
cp .env.example .dev.vars
# Fill in CLIENT_ID, CLIENT_SECRET, ADMIN_WCA_ID, ADMIN_USER_ID — see .env.example
# for the split between Worker secrets (.dev.vars) and PUBLIC_* build vars (.env)

# 4. Apply D1 migrations locally
npx wrangler d1 migrations apply cubingkerala --local

# 5. Start the dev server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the app. Every command in this project runs from **`astro-app/`**, not the repo root.

### Environment Variables

See [`astro-app/.env.example`](astro-app/.env.example) for the full, current list and the split between Worker secrets (`.dev.vars`, never committed) and `PUBLIC_*` build-time values (`.env`/`.env.local`). In production, Worker secrets are set via `wrangler secret put <NAME>` or `wrangler secret bulk`; `PUBLIC_*` values are set wherever the build runs (GitHub Actions).

---

## 📜 Available Scripts

All run from `astro-app/`:

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (binds to real remote D1/R2 — see `wrangler.jsonc`) |
| `npm run build` | Build for production |
| `npx tsc --noEmit` | Type-check |
| `npx wrangler deploy` | Deploy to Cloudflare Workers |
| `npx wrangler d1 migrations apply cubingkerala --local\|--remote` | Apply D1 schema migrations |
| `npx drizzle-kit generate` | Generate a new migration from `src/db/schema.ts` |

---

## 📁 Project Structure

```
astro-app/
├── src/
│   ├── pages/                 # Routes (.astro) + API endpoints (pages/api/*.ts)
│   ├── components/
│   │   ├── home/               # Landing sections
│   │   ├── competitions/
│   │   ├── members/
│   │   ├── rankings/
│   │   ├── requests/            # Admin panel (approvals, photo gallery)
│   │   ├── layout/               # Navbar, footer, page-loading bar
│   │   ├── shared/                # Reused across features (e.g. EventIcon)
│   │   └── ui/                     # Shared primitives (table, tooltip, dialog, ...)
│   ├── db/                    # Drizzle schema + query helpers
│   ├── lib/                   # Server: WCA sync, competitions API, auth, validation
│   ├── config/                 # Admin check, media/social config
│   ├── types/
│   └── utils/                 # Pure helpers (dates, names, WCA formatting)
├── migrations/                # Drizzle-generated D1 migrations
├── worker.ts                  # Custom Worker entry (adds the Cron Trigger handler)
└── wrangler.jsonc              # Cloudflare bindings, routes, cron schedule
```

Feature files use **kebab-case**. See [`AGENTS.md`](AGENTS.md) for the full contributor/agent checklist (secrets handling, verification steps, UI conventions).

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/allenjohn07">Allen John</a>
</p>
