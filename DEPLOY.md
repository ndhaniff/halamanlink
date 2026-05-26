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
5. Set **Domains** on the resource to **only**:
   ```text
   https://app.links.halaman.cc
   ```
   Do **not** add `https://*.links.halaman.cc` in the Coolify UI — Traefik 3 rejects wildcard `Host()` rules. User subdomains are routed via `HostRegexp` labels in `docker-compose.yml`.
6. **Redeploy** after changing env vars

### Coolify UI settings (required)

| Setting | Value |
|---------|--------|
| **Domains** | `https://app.links.halaman.cc` only |
| **Connect To Predefined Network** | ON → `coolify` |
| **Readonly Labels** | OFF (otherwise Coolify may strip compose Traefik labels) |
| **Port** | `4321` (must match compose) |

## Subdomain routing (fix “No available server”)

If `https://team7a.links.halaman.cc` returns **No available server** but `https://app.links.halaman.cc/p/team7a` works, Traefik is not routing slug hosts to the container.

### Step 1 — DNS (Cloudflare)

In the `halaman.cc` zone:

| Type | Name | Content |
|------|------|---------|
| A | `app.links` | Coolify server IP |
| A | `*.links` | Coolify server IP |

Use **DNS only** (grey cloud) while testing, or ensure SSL mode is **Full** if proxied.

### Step 2 — Redeploy with latest compose

Push latest code and **Redeploy** in Coolify. The compose file adds `HostRegexp` Traefik labels for `{slug}.links.halaman.cc`.

### Step 3 — Verify on the server

```bash
# Container name (use in step 4 if needed)
docker ps --format "{{.Names}}" | grep -i halaman

# Traefik labels must include halamanlink-slugs-https
docker inspect CONTAINER_NAME --format '{{json .Config.Labels}}' | jq 'with_entries(select(.key | startswith("traefik.http.routers.halamanlink-slugs")))'

# Container must be on coolify network
docker network inspect coolify --format '{{range .Containers}}{{.Name}} {{end}}' | tr ' ' '\n' | grep -i halaman
```

Expected router rule:

```text
HostRegexp(`^[a-z0-9][a-z0-9-]*[.]links[.]halaman[.]cc$`)
```

### Step 4 — Fallback: Traefik dynamic file

If labels are missing after deploy (Coolify stripped them), use the manual proxy config:

1. Copy `deploy/coolify/traefik-dynamic/halamanlink-slugs.yaml` to `/data/coolify/proxy/dynamic/halamanlink-slugs.yaml` on the server
2. Replace `HALAMANLINK_CONTAINER` with the container name from step 3
3. Traefik reloads automatically (file watch)

### Step 5 — Proxy wildcard cert

Your Traefik proxy should already have (you configured this):

```yaml
traefik.http.routers.traefik.tls.domains[0].main=links.halaman.cc
traefik.http.routers.traefik.tls.domains[0].sans=*.links.halaman.cc
```

Plus `CF_DNS_API_TOKEN` on the **proxy** service for Cloudflare DNS challenge.

Coolify injects UI env vars into `${VAR}` placeholders in the compose file. You do **not** need a `.env` file on the server.

**Important:** `APP_DOMAIN` and `APP_URL` are baked in at **build time** (Dockerfile build args). Redeploy with **Rebuild** after changing them. Astro also uses `APP_DOMAIN` for CSRF `allowedDomains` (fixes POST 403 behind Traefik).

## POST /api/* returns 403

Astro 6 rejects POST requests when the browser `Origin` header does not match what the app sees behind Traefik. Avatar upload, login, signup, and save actions all use POST.

Fix: set `APP_DOMAIN=links.halaman.cc` in Coolify env and **Rebuild** (not just restart). `astro.config.mjs` whitelists `app.links.halaman.cc` and `*.links.halaman.cc`.

**Important:** `ASTRO_DATABASE_FILE` must be `/app/data/content.db` at runtime. Do not override it in Coolify env vars.

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
| `GOOGLE_MAPS_API_KEY` | optional | Google Maps Embed API for pinned location on profiles |
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
