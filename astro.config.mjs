// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// The Cloudflare adapter runs its own worker runtime that breaks Keystatic's
// admin UI in the dev server, so we only attach it for production builds.
// `astro dev` stays adapter-free; `astro build` (used by Cloudflare Pages) gets it.
const isBuild = process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  site: 'https://morleygp.com.au',
  // prerenderEnvironment: 'node' runs the build-time prerender in Node so the
  // Keystatic reader (node:fs / node:path) works. nodejs_compat in wrangler.jsonc
  // covers the runtime admin routes on the worker.
  ...(isBuild ? { adapter: cloudflare({ prerenderEnvironment: 'node' }) } : {}),
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
