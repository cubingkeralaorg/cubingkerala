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

## What it does

Competitions, rankings, member profiles, and join requests — all backed by live WCA data (OAuth login, daily sync). Admins manage members and a homepage photo gallery from `/requests`.

## Stack

Astro (SSR) + React islands, on Cloudflare Workers. Cloudflare D1 (via Drizzle) for data, R2 for media. WCA OAuth for auth. Deployed via GitHub Actions.

## Getting started

```bash
git clone https://github.com/cubingkeralaorg/cubingkerala.git
cd cubingkerala/astro-app
npm install

cp .env.example .dev.vars   # fill in CLIENT_ID, CLIENT_SECRET, ADMIN_WCA_ID, ADMIN_USER_ID
npx wrangler d1 migrations apply cubingkerala --local
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). Everything runs from `astro-app/`, not the repo root.

See [`astro-app/.env.example`](astro-app/.env.example) for the full environment variable list, and [`AGENTS.md`](AGENTS.md) for the contributor/agent checklist (secrets handling, verification steps, UI conventions, deploy pipeline).

## Contributing

Open an issue to discuss a change, then send a PR from a branch.

## License

MIT — see [`LICENSE`](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/allenjohn07">Allen John</a>
</p>
