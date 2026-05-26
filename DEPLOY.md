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
TRAEFIK_DOMAIN_LABEL=links[.]halaman[.]cc
SESSION_SECRET=<long-random-string>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
```

4. Ensure volume **`halamanlink-data`** persists at `/app/data` (SQLite + avatars)
5. Set **Domains** on the resource to **only**:
   ```text
   https://app.links.halaman.cc
   ```
   Do **not** add `https://*.links.halaman.cc` in the Coolify UI — Traefik 3 rejects wildcard `Host()` rules. User subdomains are routed via `HostRegexp` labels in `docker-compose.yml`.
6. **Redeploy** after changing env vars

## Subdomain routing (fix “No available server”)

If `https://team7a.links.halaman.cc` returns **No available server** but `https://app.links.halaman.cc/p/team7a` works:

1. **DNS** — `*.links` A record → your Coolify server IP
2. **Coolify env** — set `TRAEFIK_DOMAIN_LABEL=links[.]halaman[.]cc`  
   (bracket dots `[.]` escape the domain for Traefik regex; match your `APP_DOMAIN`)
3. **Coolify Domains** — only `https://app.links.halaman.cc` (not `*.links...`)
4. **Wildcard SSL** on the Coolify proxy for `*.links.halaman.cc` (DNS challenge)
5. **Redeploy** the compose resource so Traefik labels are applied

Check Traefik picked up the router:
```bash
docker inspect halamanlink --format '{{json .Config.Labels}}' | jq
```
Look for `traefik.http.routers.halamanlink-slugs.rule`.

If `redirect-to-https@file` middleware errors, remove the two `halamanlink-slugs-http` labels and redeploy — HTTPS routing alone is enough.

Coolify injects UI env vars into `${VAR}` placeholders in the compose file. You do **not** need a `.env` file on the server.

**Important:** `ASTRO_DATABASE_FILE` must be `/app/data/content.db` at **build time and runtime** (already set in the Dockerfile). Do not override it to another path in Coolify env vars.

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
