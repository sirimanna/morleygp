#!/usr/bin/env node
/*
 * Patch @keystatic/astro so it reads Cloudflare runtime env the Astro 7 way.
 *
 * Keystatic 5.x reads `context.locals.runtime.env`, which Astro v6+ removed.
 * On the Cloudflare adapter that access now THROWS, crashing every /api/keystatic
 * request with a 500. We rewrite that one line to pull env from the
 * `cloudflare:workers` module at runtime instead (with a dev-safe fallback).
 *
 * Runs on postinstall and before build, so it re-applies on every fresh install
 * (including Cloudflare's build environment). Idempotent.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '../node_modules/@keystatic/astro/dist/keystatic-astro-api.js'
);

const OLD =
  'const envVarsForCf = (_context$locals = context.locals) === null || _context$locals === void 0 || (_context$locals = _context$locals.runtime) === null || _context$locals === void 0 ? void 0 : _context$locals.env;';

const NEW =
  "let envVarsForCf; /* PATCH_CF_ENV */ try { const __cfMod = 'cloudflare:workers'; envVarsForCf = (await import(/* @vite-ignore */ __cfMod)).env; } catch (e) { envVarsForCf = undefined; }";

try {
  if (!fs.existsSync(filePath)) {
    console.log('[patch-keystatic-cf] @keystatic/astro not found yet, skipping.');
    process.exit(0);
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('PATCH_CF_ENV')) {
    console.log('[patch-keystatic-cf] already patched.');
    process.exit(0);
  }
  if (!content.includes(OLD)) {
    console.error('[patch-keystatic-cf] target line not found. @keystatic/astro may have changed.');
    process.exit(1);
  }
  content = content.replace(OLD, NEW);
  fs.writeFileSync(filePath, content);
  console.log('[patch-keystatic-cf] patched @keystatic/astro for Cloudflare env.');
} catch (err) {
  console.error('[patch-keystatic-cf] error:', err.message);
  process.exit(1);
}
