# halamanlink

Linktree-style SaaS built with Astro, Astro DB (SQLite), and Stripe.

## Features

- User signup/login with session auth
- Public link-in-bio pages with subdomain routing
- Theme customization (Minimal, Dark, Gradient, Bold)
- Click analytics
- Stripe billing (Free / Pro plans)
- Custom domain scaffold (DNS instructions, verification pending)

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:4321

Demo login: `demo@halamanlink.dev` / `demo1234`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build

## Deployment

See [DEPLOY.md](./DEPLOY.md) for Coolify setup.
