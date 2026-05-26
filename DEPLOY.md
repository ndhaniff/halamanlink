# Deploying Halamanlink on Coolify

## Prerequisites

- Coolify server with Docker
- Domain name (e.g. `halamanlink.com`)
- Stripe account (for billing)

## DNS

Point these records to your Coolify proxy:

| Type | Name | Value |
|------|------|-------|
| A/CNAME | `app` | Coolify app URL |
| A/CNAME | `*` | Coolify app URL (wildcard subdomains) |

## Environment variables

Set in Coolify:

```
APP_DOMAIN=halamanlink.com
APP_URL=https://app.halamanlink.com
SESSION_SECRET=<long-random-string>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
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
