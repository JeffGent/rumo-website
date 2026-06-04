/**
 * Playwright config for the marketing-video recorder.
 *
 * Run from `tools/demo-recorder/`:
 *   npm run record                                # all demos
 *   npm run record -- pms-kalender.demo.ts        # one
 *
 * Video output: `output/<demo-name>/video.webm`. Convert to MP4 + WebM
 * with the project README's ffmpeg snippets, drop into `../../img/`.
 */

import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const BASE_URL = process.env.PMS_BASE_URL || 'http://localhost:5174';
const here = dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = resolve(here, '.auth.json');
const HAS_AUTH = existsSync(AUTH_FILE);

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.demo.ts',
  outputDir: './output',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 180_000,
  reporter: 'list',

  use: {
    baseURL: BASE_URL,
    locale: 'nl-BE',
    viewport: { width: 1280, height: 800 },
    video: { mode: 'on', size: { width: 1280, height: 800 } },
    trace: 'off',
    screenshot: 'off',
    // Bound every locator action — without this, default is "no timeout",
    // and a post-click helper that touches an element React just unmounted
    // (e.g. unhighlighting a submit button that was replaced by a success
    // modal) hangs the whole test until the 180s timeout.
    actionTimeout: 5_000,
    // slowMo adds a small natural pause between every Playwright action,
    // on top of the explicit pause()/hoverMs the helpers already insert.
    // headless: false because headless Chromium blocks third-party cookies
    // more aggressively, which breaks Keycloak's silent-SSO iframe check
    // and bounces every PMS demo to the login screen.
    launchOptions: { slowMo: 120, headless: false },
  },

  projects: [
    {
      name: 'pms',
      testMatch: '**/pms-*.demo.ts',
      use: {
        ...devices['Desktop Chrome'],
        ...(HAS_AUTH ? { storageState: AUTH_FILE } : {}),
      },
    },
  ],
});
