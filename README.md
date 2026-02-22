<p align="center">
  <img src="public/logotransparent.png" alt="Cubing Kerala" width="120" />
</p>

<h1 align="center">Cubing Kerala</h1>

<p align="center">
  The official platform for Kerala's Rubik's Cube community — competitions, rankings, and more.
</p>

<p align="center">
  <a href="https://www.cubingkerala.org">cubingkerala.org</a> · <a href="https://github.com/cubingkeralaorg/cubingkerala/issues">Report a Bug</a> · <a href="https://github.com/cubingkeralaorg/cubingkerala/issues">Request Feature</a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Competitions** | Browse upcoming & past WCA competitions with detailed results |
| **Rankings** | Live member rankings updated from competition performances |
| **Members** | Community directory — join and connect with fellow cubers |
| **Learn** | Resources and guides to get started with speedcubing |
| **Contact** | Get in touch with the Cubing Kerala team |

## 🛠 Tech Stack

- **Framework** — [Next.js](https://nextjs.org) (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS + shadcn/ui + Radix primitives
- **Animations** — Framer Motion + Lottie
- **Database** — PostgreSQL (Neon serverless) via Prisma ORM
- **Auth** — WCA OAuth
- **Data Fetching** — TanStack React Query + Axios
- **Maps** — Leaflet / React Leaflet
- **Testing** — Vitest + React Testing Library (unit) · Playwright (E2E)
- **Deployment** — Vercel

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node)
- A **PostgreSQL** database ([Neon](https://neon.tech) recommended)
- WCA OAuth credentials (for authentication)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/cubingkeralaorg/cubingkerala.git
cd cubingkerala

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in your database URL, WCA OAuth credentials, etc.

# 4. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run e2e` | Run end-to-end tests (Playwright) |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/       # Reusable UI components
├── config/           # App configuration
├── hooks/            # Custom React hooks
├── lib/              # Shared utilities & Prisma client
├── services/         # API service layer
├── types/            # TypeScript type definitions
└── utils/            # Helper functions

e2e/                  # Playwright E2E tests
prisma/               # Database schema & migrations
public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/allenjohn07">Allen John</a>
</p>
