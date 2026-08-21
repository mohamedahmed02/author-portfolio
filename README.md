# Author Portfolio

Premium bilingual (English / Indonesian) writer portfolio with a secure single-admin CMS.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma ORM
- Auth.js (credentials) with Argon2id password hashing
- TipTap rich text editor (sanitized on save/render)
- Light / Dark / System themes
- Vercel-ready (optional Vercel Blob for media)

## Features

- Public editorial site: Home, Writing archive, Article detail, About, Contact, Newsletter
- Locale-prefixed URLs: `/en/...` and `/id/...`
- Admin dashboard at `/admin` (one fixed administrator only — no registration)
- CMS for writings, categories, homepage, about, contact, media, newsletter subscribers
- SEO: metadata, sitemap, robots, Open Graph, Article JSON-LD
- Security: HTTP-only sessions, rate-limited login, server-side authorization, security headers

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js secret (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Single admin email |
| `ADMIN_PASSWORD` | Single admin password (min 12 chars) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

Optional:

| Variable | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads |
| `NEWSLETTER_WEBHOOK_URL` | External newsletter provider webhook |
| `SMTP_*` / `CONTACT_TO_EMAIL` | Optional contact email delivery |

**Never commit real secrets.** `.env` is gitignored. Only placeholders belong in `.env.example`.

### 3. Database

Local Postgres via Docker (optional):

```bash
docker compose up -d
```

Then:

```bash
npm run db:setup
```

This pushes the schema and seeds:

- The single admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Default site settings
- Sample categories and published writings

### 4. Develop

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Admin security model

- Exactly **one** administrator, configured via `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- No public registration, signup, or multi-admin management UI
- Seed/sync enforces a single `User` row with role `ADMIN`
- Password stored as Argon2id hash only
- All `/admin/*` mutations authorize server-side via session checks
- Login is rate-limited; errors are generic (no email enumeration)

## Deploy on Vercel

1. Create a PostgreSQL database (Neon, Supabase, Prisma Postgres, etc.)
2. Set the environment variables listed above in the Vercel project
3. Deploy — `postinstall` runs `prisma generate`; run `prisma db push` (or migrate) against production once
4. Run seed once in production (or create admin via seed script with production env vars)

```bash
npx prisma db push
npm run db:seed
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:setup` | Push schema + seed |
| `npm run db:seed` | Seed / sync admin + sample content |

## Content model

Writings and site settings store bilingual fields (`*En` / `*Id`). Draft posts never appear on the public site.
