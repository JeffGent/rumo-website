/**
 * Demo recorder helpers — visible cursor + element highlight overlay.
 *
 * Playwright's video recorder captures the page but NOT the OS cursor.
 * `installDemoCursor()` injects a DOM cursor element that tracks real
 * mousemove events fired by `page.mouse.move()`. `demoClick` / `demoFill`
 * / `demoSelect` then animate the cursor to a target, pulse a highlight,
 * and run the actual interaction — producing a smooth screencast suitable
 * for marketing pages.
 */

import type { Page, Locator } from '@playwright/test';

const CURSOR_INIT_SCRIPT = `
(() => {
  if (window.__demoCursorInstalled) return;
  window.__demoCursorInstalled = true;

  const css = \`
    #demo-cursor {
      position: fixed;
      top: 0; left: 0;
      width: 28px; height: 28px;
      margin-left: -6px;
      margin-top: -4px;
      pointer-events: none;
      z-index: 2147483647;
    }
    #demo-cursor svg {
      display: block;
      width: 100%; height: 100%;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
    }
    #demo-cursor-ripple {
      position: fixed;
      top: 0; left: 0;
      width: 48px; height: 48px;
      margin-left: -24px;
      margin-top: -24px;
      border-radius: 50%;
      background: rgba(255, 90, 90, 0.45);
      pointer-events: none;
      z-index: 2147483646;
      opacity: 0;
      transform: scale(0.2);
    }
    #demo-cursor-ripple.fire {
      animation: demo-ripple 500ms ease-out forwards;
    }
    @keyframes demo-ripple {
      0%   { opacity: 0.7; transform: scale(0.2); }
      100% { opacity: 0;   transform: scale(1.6); }
    }
    .demo-highlight {
      outline: 3px solid #ff5a5a !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 6px rgba(255,90,90,0.18) !important;
      border-radius: 4px !important;
      transition: outline-color 180ms, box-shadow 180ms;
    }
  \`;
  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;
  var styleInstalled = false;
  function paint() {
    var c = document.getElementById('demo-cursor');
    if (c) { c.style.left = x + 'px'; c.style.top = y + 'px'; }
  }
  function ensureStyle() {
    if (styleInstalled) return true;
    var host = document.head || document.documentElement;
    if (!host) return false;
    var style = document.createElement('style');
    style.textContent = css;
    host.appendChild(style);
    styleInstalled = true;
    return true;
  }
  function ensureMounted() {
    // Order matters: style first (cheap, idempotent), then DOM nodes.
    // addInitScript can fire before <head>, <body> or documentElement
    // exist, so every step is gated and the whole thing retries on a
    // 250ms tick until it sticks.
    if (!ensureStyle()) return false;
    if (!document.body) return false;
    if (document.getElementById('demo-cursor')) return true;
    var cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M5 3 L5 19 L9 15 L12 22 L15 21 L12 14 L18 14 Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>' +
      '</svg>';
    document.body.appendChild(cursor);
    var ripple = document.createElement('div');
    ripple.id = 'demo-cursor-ripple';
    document.body.appendChild(ripple);
    paint();
    return true;
  }
  try { ensureMounted(); } catch (_) { /* retry from setInterval */ }
  document.addEventListener('DOMContentLoaded', function () { try { ensureMounted(); } catch (_) {} });
  setInterval(function () { try { ensureMounted(); } catch (_) {} }, 250);

  document.addEventListener('mousemove', function (e) {
    x = e.clientX; y = e.clientY;
    paint();
  }, true);

  window.__demoCursorClick = () => {
    const r = document.getElementById('demo-cursor-ripple');
    if (!r) return;
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    r.classList.remove('fire');
    void r.offsetWidth;
    r.classList.add('fire');
  };
})();
`;

export async function installDemoCursor(page: Page): Promise<void> {
  await page.addInitScript(CURSOR_INIT_SCRIPT);
}

async function glideTo(page: Page, x: number, y: number): Promise<void> {
  await page.mouse.move(x, y, { steps: 30 });
}

async function targetOf(locator: Locator): Promise<{ x: number; y: number }> {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error('Locator has no bounding box (off-screen or detached)');
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function highlight(locator: Locator): Promise<void> {
  await locator.evaluate((el) => el.classList.add('demo-highlight'));
}

async function unhighlight(locator: Locator): Promise<void> {
  // Best-effort: a post-click unhighlight on an element that React just
  // unmounted (e.g. submit button → success modal swap) would otherwise
  // wait for actionTimeout before erroring. Race with a tiny timer so
  // demos stay snappy even when the target is gone.
  await Promise.race([
    locator.evaluate((el) => el.classList.remove('demo-highlight')).catch(() => {}),
    new Promise<void>((resolve) => setTimeout(resolve, 200)),
  ]);
}

export interface DemoClickOptions {
  /** Milliseconds to hover on the target before clicking. Default 250. */
  hoverMs?: number;
  /** Milliseconds to keep the highlight after clicking. Default 200. */
  afterMs?: number;
}

export async function demoClick(locator: Locator, opts: DemoClickOptions = {}): Promise<void> {
  const page = locator.page();
  const { x, y } = await targetOf(locator);
  await highlight(locator);
  await glideTo(page, x, y);
  await page.waitForTimeout(opts.hoverMs ?? 250);
  await page.evaluate(() => (window as unknown as { __demoCursorClick?: () => void }).__demoCursorClick?.());
  await locator.click();
  await page.waitForTimeout(opts.afterMs ?? 200);
  await unhighlight(locator);
}

export interface DemoFillOptions {
  /** Milliseconds between keystrokes. Default 55. */
  keystrokeMs?: number;
}

export async function demoFill(
  locator: Locator,
  text: string,
  opts: DemoFillOptions = {},
): Promise<void> {
  const page = locator.page();
  const { x, y } = await targetOf(locator);
  await highlight(locator);
  await glideTo(page, x, y);
  await page.waitForTimeout(200);
  await locator.click();
  // Clear any pre-filled value so the typed text doesn't append (the
  // portal pre-fills name fields from the reservation, which would
  // otherwise produce "SophieSophie" on screen).
  await locator.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await locator.press('Delete');
  await locator.pressSequentially(text, { delay: opts.keystrokeMs ?? 55 });
  await page.waitForTimeout(250);
  await unhighlight(locator);
}

export async function demoSelect(locator: Locator, value: string): Promise<void> {
  const page = locator.page();
  const { x, y } = await targetOf(locator);
  await highlight(locator);
  await glideTo(page, x, y);
  await page.waitForTimeout(250);
  await locator.selectOption(value);
  await page.waitForTimeout(250);
  await unhighlight(locator);
}

export async function pause(page: Page, ms: number): Promise<void> {
  await page.waitForTimeout(ms);
}
