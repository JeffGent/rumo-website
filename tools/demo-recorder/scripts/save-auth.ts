#!/usr/bin/env tsx
/**
 * One-time interactive login helper for the demo recorder.
 *
 *   npm run auth
 *
 * Launches a Chromium window, opens the PMS at the configured hotel's
 * calendar, and waits for you to log in via Keycloak. As soon as the
 * calendar grid is rendered (post-login), the browser session is
 * captured to `tools/demo-recorder/.auth.json` and the window closes.
 * Demo scripts under `*.demo.ts` then load that file via `storageState`
 * and skip the login dance entirely.
 *
 * Re-run this whenever the saved session expires (Keycloak refresh
 * tokens typically last ~30 days). The file is gitignored.
 */

import { chromium } from '@playwright/test';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const AUTH_PATH = resolve(here, '..', '.auth.json');
const BASE_URL = process.env.PMS_BASE_URL || 'http://localhost:5174';
const HOTEL_ID = process.env.PMS_HOTEL_ID || 'development-carlton';

async function main() {
  if (!existsSync(dirname(AUTH_PATH))) mkdirSync(dirname(AUTH_PATH), { recursive: true });

  console.log('Launching browser…');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/h/${HOTEL_ID}/calendar`);

  console.log('');
  console.log('  ┌────────────────────────────────────────────────────────────┐');
  console.log('  │  Log in with your Keycloak account in the opened browser.  │');
  console.log('  │  Once the PMS calendar loads, this script will save the    │');
  console.log('  │  session and close automatically.                          │');
  console.log('  │  Tip: dismiss the cookie banner too — it gets saved with   │');
  console.log('  │  the session so it stays out of the recorded videos.       │');
  console.log('  └────────────────────────────────────────────────────────────┘');
  console.log('');

  // Wait for the calendar grid to render. That only happens AFTER the
  // full Keycloak round-trip + SPA boot — much more reliable than a URL
  // pattern (the initial goto URL matches before Keycloak redirects you
  // away, so a URL-based wait fires too early).
  // Generous timeout: user might fumble the password, do MFA, etc.
  await page.waitForSelector('[data-tour="cal-grid"]', { timeout: 5 * 60_000 });

  // Let the SPA settle so we capture localStorage populated by the
  // Keycloak adapter. networkidle never settles (PMS polls), so race
  // it with a short fixed delay.
  await Promise.race([
    page.waitForLoadState('networkidle'),
    new Promise<void>((r) => setTimeout(r, 2_000)),
  ]).catch(() => {});

  await context.storageState({ path: AUTH_PATH });
  console.log(`✓ Session saved to ${AUTH_PATH}`);
  console.log('  Demo scripts will reuse this until your Keycloak session expires.');

  await browser.close();
}

main().catch((err) => {
  console.error('Failed to save auth:', err);
  process.exit(1);
});
