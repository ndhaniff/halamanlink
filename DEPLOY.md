# Deploying Halamanlink on Coolify

## Prerequisites

- Coolify server with Docker
- Domain name (e.g. `halaman.cc`)
- Stripe account (for billing)

## Docker Compose

Copy env and set your domain:

```bash
cp .env.example .env
# edit .env — for halaman.cc:
#   APP_DOMAIN=halaman.cc
#   APP_URL=https://app.halaman.cc
#   SESSION_SECRET=<long-random-string>

docker compose up -d --build
```

Behind a reverse proxy on the same host (localhost bind only):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**Coolify:** create a **Docker Compose** resource, point it at this repo, set the same env vars in the UI, and mount volume `halamanlink-data` → `/app/data`. Rebuild after changing `APP_DOMAIN` or `APP_URL` (they are baked in at build time).

## DNS

Point these records to your Coolify proxy:

| Type | Name | Value |
|------|------|-------|
| A/CNAME | `app` | Coolify app URL |
| A/CNAME | `*` | Coolify app URL (wildcard subdomains) |

## Environment variables

Set in Coolify:

```
APP_DOMAIN=halaman.cc
APP_URL=https://app.halaman.cc
SESSION_SECRET=<long-random-string>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
ASTRO_DATABASE_FILE=/app/data/content.db
UPLOAD_DIR=/app/data/uploads
```

## Persistent SQLite

Mount a volume at `/app/data` in the container. Astro DB uses a local SQLite file during dev/build; for production persistence on Coolify, ensure the database file survives redeploys via the mounted volume.

## Stripe webhook

Add endpoint in Stripe Dashboard:

```
https://app.halamanlink.com/api/stripe/webhook
```

Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Subdomain routing

Public profiles are served at:

```
https://{username}.halamanlink.com
```

Fallback path for local dev:

```
http://localhost:4321/p/{username}
```

## Custom domains (phase 2)

Users on Pro can save a custom domain in Settings. DNS verification is scaffolded but not automated yet. After verification is implemented, verified domains will resolve via middleware host lookup.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

Demo account (after seed): `demo@halamanlink.dev` / `demo1234`

Public demo page: `/p/demo`
