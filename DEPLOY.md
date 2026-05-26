# Deploying Halamanlink on Coolify

## Prerequisites

- Coolify server with Docker
- Domain name (e.g. `halaman.cc`)
- Stripe account (for billing)

## Coolify (single `docker-compose.yml`)

1. **New Resource** → **Docker Compose** → point at this repo
2. Coolify uses `docker-compose.yml` only — no override file needed
3. Set **Environment Variables** in the Coolify UI:

```
APP_DOMAIN=links.halaman.cc
APP_URL=https://app.links.halaman.cc
SESSION_SECRET=<long-random-string>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
```

4. Ensure volume **`halamanlink-data`** persists at `/app/data` (SQLite + avatars)
5. Set **Domains** on the resource (e.g. `https://app.links.halaman.cc`, `https://*.links.halaman.cc`)
6. **Redeploy / rebuild** after changing `APP_DOMAIN` or `APP_URL` — they are baked in at build time

Coolify injects UI env vars into `${VAR}` placeholders in the compose file. You do **not** need a `.env` file on the server. Do **not** set `ASTRO_DATABASE_FILE` as a build arg — the Dockerfile uses `/tmp` during build and `/app/data/content.db` at runtime.

## Local Docker (optional)

```bash
cp .env.example .env
# edit .env

docker compose up -d --build
```

Compose auto-loads `.env` from the project root for `${VAR}` substitution.

## DNS

Point these records to your Coolify server:

| Type | Name | Value |
|------|------|-------|
| A/CNAME | `app.links` (or `app`) | Coolify server |
| A/CNAME | `*.links` (or `*`) | Coolify server (wildcard user subdomains) |

If `halaman.cc` is already used for another site, use a subdomain as `APP_DOMAIN` (e.g. `links.halaman.cc`) and leave the apex on your existing app.

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `APP_DOMAIN` | yes | Root domain for user pages, e.g. `links.halaman.cc` |
| `APP_URL` | yes | App URL for auth/dashboard, e.g. `https://app.links.halaman.cc` |
| `SESSION_SECRET` | yes | Long random string |
| `STRIPE_*` | optional | Billing |
| `ASTRO_DATABASE_FILE` | set in compose | `/app/data/content.db` |
| `UPLOAD_DIR` | set in compose | `/app/data/uploads` |

## Persistent SQLite

Volume `halamanlink-data` → `/app/data` must survive redeploys.

## Stripe webhook

```
https://app.links.halaman.cc/api/stripe/webhook
```

Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Subdomain routing

Public profiles:

```
https://{username}.links.halaman.cc
```

Fallback (any host):

```
https://app.links.halaman.cc/p/{username}
```

## Local development (no Docker)

```bash
cp .env.example .env
npm install
npm run dev
```

Demo account (after seed): `demo@halamanlink.dev` / `demo1234`

Public demo page: `/p/demo`
