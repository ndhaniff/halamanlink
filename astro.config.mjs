// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import react from '@astrojs/react';
import db from '@astrojs/db';
import tailwindcss from '@tailwindcss/vite';

const appDomain = process.env.APP_DOMAIN?.trim() || 'localhost';

/** @type {import('astro').Hostname[]} */
const allowedDomains =
  appDomain === 'localhost'
    ? [{ hostname: 'localhost', protocol: 'http' }]
    : [
        { hostname: `app.${appDomain}`, protocol: 'https' },
        { hostname: `**.${appDomain}`, protocol: 'https' },
        { hostname: appDomain, protocol: 'https' },
      ];

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: node({
    mode: 'standalone'
  }),

  integrations: [db(), react()],

  // Astro 6 CSRF check — required behind Traefik/Coolify (fixes POST 403 on /api/*)
  security: {
    allowedDomains,
  },

  vite: {
    plugins: [tailwindcss()]
  },

  server: {
    port: 4321,
    host: true
  }
});