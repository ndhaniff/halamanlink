/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
      name: string;
    };
    profileSlug?: string;
  }
}

interface ImportMetaEnv {
  readonly APP_DOMAIN: string;
  readonly APP_URL: string;
  readonly SESSION_SECRET: string;
  readonly UPLOAD_DIR?: string;
  readonly STRIPE_SECRET_KEY?: string;
  readonly STRIPE_WEBHOOK_SECRET?: string;
  readonly STRIPE_PRICE_PRO_MONTHLY?: string;
  readonly GOOGLE_MAPS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
