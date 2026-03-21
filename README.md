<p align="center">
  <img src="public/logotransparent.png" alt="Cubing Kerala" width="120" />
</p>

<h1 align="center">Cubing Kerala</h1>

<p align="center">
  The official platform for Kerala's Rubik's Cube community — competitions, rankings, members, and more.
</p>

<p align="center">
  <a href="https://www.cubingkerala.org">cubingkerala.org</a> ·
  <a href="https://github.com/cubingkeralaorg/cubingkerala/issues">Report a Bug</a> ·
  <a href="https://github.com/cubingkeralaorg/cubingkerala/issues">Request a Feature</a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Competitions** | Browse upcoming & past WCA competitions in Kerala with detailed results |
| **Rankings** | Live member rankings, cached intelligently for instant load |
| **Members** | Community directory — WCA-authenticated profiles with avatars and roles |
| **Join Request** | Submit a join request via WCA OAuth; approved by admins |
| **Learn** | Resources and guides to get started with speedcubing |
| **Contact** | Get in touch with the Cubing Kerala team |
| **Dark / Light Mode** | Full theme support via `next-themes` |
| **Sitemap** | Auto-generated sitemap for SEO |

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS · shadcn/ui · Radix UI primitives · NextUI |
| **Animations** | Framer Motion · Lottie |
| **Database** | PostgreSQL ([Neon](https://neon.tech) serverless) via Prisma ORM |
| **Auth** | WCA OAuth 2.0 |
| **Data Fetching** | TanStack React Query · Axios |
| **Maps** | Leaflet / React Leaflet |
| **Icons** | Lucide React · React Icons · `@cubing/icons` · Radix Icons |
| **Testing** | Vitest + React Testing Library (unit) · Playwright (E2E) |
| **Deployment** | Vercel |

---

## 🗄 Database Models

| Model | Purpose |
|---|---|
| `Users` | Authenticated WCA users |
| `Members` | Approved Cubing Kerala members |
| `Requests` | Pending join requests |
| `Competitions` | Cached Kerala WCA competitions |
| `MemberWcaData` | Cached WCA competition data per member (JSON) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node)
- A **PostgreSQL** database ([Neon](https://neon.tech) recommended)
- WCA OAuth credentials (Client ID & Secret)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/cubingkeralaorg/cubingkerala.git
cd cubingkerala

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, WCA OAuth credentials, and app URL

# 4. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLIENT_ID` | WCA OAuth Client ID |
| `CLIENT_SECRET` | WCA OAuth Client Secret |
| `NEXT_PUBLIC_BASE_URL` | App base URL (e.g. `http://localhost:3000`) |
| `POSTGRES_URL_TEST` | Test database URL (CI/CD) |
| `VERCEL_TOKEN` | Vercel API token (deployment) |
| `ORG_ID` | Vercel Organization ID |
| `PROJECT_ID` | Vercel Project ID |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest, watch mode) |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI |
| `npm run e2e` | Run end-to-end tests (Playwright) |
| `npm run e2e:ui` | Open Playwright UI |
| `npm run e2e:debug` | Debug E2E tests |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:info` | Show database info |
| `npm run db:check` | Check database connectivity |
| `npm run db:backup` | Dump a database backup |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/             # WCA OAuth (login/callback/logout)
│   │   ├── join-cubingkerala/# Submit join request
│   │   ├── approve-requests/ # Admin: approve join requests
│   │   ├── delete-request/   # Admin: reject a request
│   │   ├── delete-member/    # Admin: remove a member
│   │   ├── get-competitions/ # Fetch & cache WCA competitions
│   │   ├── get-member-wcaids/# Get member WCA IDs
│   │   └── update-members/   # Sync member data from WCA
│   ├── competitions/         # Competition listing & detail pages
│   ├── members/[wca_id]/     # Member profile pages
│   ├── rankings/             # Rankings page
│   ├── requests/             # Join request management
│   ├── learn/                # Learning resources
│   ├── error/                # Global error page
│   ├── sitemap/              # Sitemap generation
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── home/                 # Home page sections
│   ├── competitions/         # Competition UI components
│   ├── members/              # Member card & profile components
│   ├── rankings/             # Rankings table components
│   ├── requests/             # Request management UI
│   ├── learn/                # Learn page components
│   ├── contact/              # Contact section
│   ├── auth/                 # Auth buttons & guards
│   ├── layout/               # Navbar, footer, sidebar
│   ├── shared/               # Shared/reusable components (ErrorState, etc.)
│   ├── magicui/              # Magic UI animated components
│   ├── providers/            # Context providers (theme, query)
│   └── ui/                   # Base shadcn/ui primitives
├── hooks/                    # Custom React hooks
├── lib/                      # Prisma client & shared libs
├── services/                 # API service layer (Axios)
├── types/                    # TypeScript type definitions
└── utils/                    # Helper & utility functions

e2e/                          # Playwright E2E tests
prisma/                       # Database schema & migrations
public/                       # Static assets (logo, images)
scripts/                      # DB helper shell scripts
```

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
