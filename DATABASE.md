# Database Documentation

## Current Setup

### Provider
**Neon** - Serverless Postgres
- Dashboard: https://console.neon.tech
- Project: Cubing Kerala
- Region: us-east-2

### Database Details
- **Database Name:** `cubing_kerala_db`
- **Owner:** `cubing-kerala-db_owner`
- **Host:** `ep-xxx-xxx.us-east-2.aws.neon.tech` (check your .env.local for actual host)
- **Connection String Location:**
  - Local: `.env.local` → `DATABASE_URL`
  - Production: Vercel Environment Variables → `DATABASE_URL`
  - CI/CD: GitHub Secrets → `DATABASE_URL`

### Environments

#### Production
- **Used by:** Vercel deployment (main branch)
- **URL stored in:** Vercel → Settings → Environment Variables
- **GitHub Secret:** `DATABASE_URL`

#### Preview/Test
- **Used by:** Test branch, PR previews
- **URL stored in:** Vercel → Settings → Environment Variables (Preview)
- **GitHub Secret:** `POSTGRES_URL_TEST`

#### Local Development
- **Used by:** Your machine
- **URL stored in:** `.env.local` (gitignored)

### Quick Access

#### View Database Content
```bash
# Open Prisma Studio
npx prisma studio

# Or connect via psql
psql "$DATABASE_URL"
```

#### Get Connection String
```bash
# Local
cat .env.local | grep DATABASE_URL

# Production (Vercel Dashboard)
# https://vercel.com/dashboard → Project → Settings → Environment Variables

# CI/CD (GitHub)
# https://github.com/cubingkeralaorg/cubingkerala/settings/secrets/actions
```

### Backup & Recovery

#### Create Backup
```bash
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d).sql
```

#### Restore Backup
```bash
psql "$DATABASE_URL" < backup_20250126.sql
```

### Troubleshooting

#### Find Database Location
```bash
# Run diagnostic script
./scripts/check-database.sh
```

### Contact & Access
- **Neon Account:** cubingkerala.org@gmail.com
- **Vercel Project Owner:** cubingkeralaorg
- **GitHub Repo:** https://github.com/cubingkeralaorg/cubingkerala

---

## Last Updated
- Date: 2025-01-26
- Updated by: Allen John
- Reason: Initial documentation
