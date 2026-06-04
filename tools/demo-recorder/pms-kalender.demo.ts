/**
 * Demo recording — PMS calendar overview (against the carlton hotel).
 *
 * Story: "Je dag, in één scherm." Lands on the calendar, filters to
 * arriving guests, opens a reservation card, sits on the detail view.
 *
 * Data: seeds 5 obviously-fake reservations (booking-ref prefix DEMO-)
 * for today against rooms 101/102/103, navigates the calendar, then
 * wipes them. A pre-run sweep removes any leftovers from a crashed run.
 *
 * Requires a saved Keycloak session — run `npm run auth` once first.
 */

import { test } from '@playwright/test';
import { installDemoCursor, demoClick, pause } from './helpers/cursor.js';

const HOTEL_ID = process.env.PMS_HOTEL_ID || 'development-carlton';
const DEMO_PREFIX = 'DEMO-';

const DEMO_GUESTS = [
  { firstName: 'Sophie',  lastName: 'Janssens',     room: '101', daysOut: 0 },
  { firstName: 'Marc',    lastName: 'De Smet',      room: '102', daysOut: 0 },
  { firstName: 'Élodie',  lastName: 'Lambert',      room: '103', daysOut: 1 },
  { firstName: 'Thomas',  lastName: 'Vandenberghe', room: '101', daysOut: 2 },
  { firstName: 'Anouk',   lastName: 'Peeters',      room: '102', daysOut: 3 },
];

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

function buildReservationBody(args: {
  ref: string; firstName: string; lastName: string;
  room: string; checkin: string; nights: number;
}) {
  const { ref, firstName, lastName, room, checkin, nights } = args;
  const checkout = addDays(checkin, nights);
  const nightPrices = Array.from({ length: nights }, (_, i) => ({
    date: addDays(checkin, i), price: 120,
  }));
  const total = nightPrices.reduce((s, p) => s + p.price, 0);
  return {
    bookingRef: ref,
    guest: `${firstName} ${lastName}`,
    checkin, checkout, reservationStatus: 'confirmed',
    data: {
      bookingRef: ref, guest: `${firstName} ${lastName}`,
      checkin, checkout, reservationStatus: 'confirmed', status: 'confirmed',
      bookedVia: 'rumo-demo', source: 'DIR',
      rooms: [{
        id: `r-${ref}`, roomNumber: room,
        roomType: 'Standard Room', roomTypeId: '', ratePlanId: '',
        checkin, checkout, status: 'confirmed',
        priceType: 'fixed' as const, fixedPrice: total, nightPrices,
        guestCount: 1,
        guests: [{
          firstName, lastName, email: `demo+${ref.toLowerCase()}@test.local`,
          phone: '', nationality: 'BE', idType: '', idNumber: '',
        }],
        extras: [], housekeeping: 'clean',
        housekeepingNote: '', housekeepingTags: [],
        fnbNote: '', fnbTags: [],
        optionExpiry: null, roomLocked: false,
      }],
      booker: { firstName, lastName, email: `demo+${ref.toLowerCase()}@test.local`,
                phone: '', language: 'nl' },
      price: total, extras: [], payments: [], invoices: [],
      activityLog: [{ id: 1, timestamp: Date.now(), action: 'Created by demo recorder', user: 'demo' }],
      messages: [], notes: '', reminders: [],
      paymentGuarantee: null, paymentCollect: 'property', paymentType: 'credit_card',
    },
  };
}

test('pms — calendar overview', async ({ page }) => {
  // ── 1. Open Carlton calendar so we can capture the user's auth token
  //       (the SPA injects it into every XHR via getAuthHeaders).
  let userToken = '';
  await page.route('**/api/v1/hotels/**', (route) => {
    const auth = route.request().headers()['authorization'];
    if (auth && !userToken) userToken = auth;
    void route.continue();
  });

  await installDemoCursor(page);

  // Quick light navigation to fire an authenticated XHR so we can grab
  // the user's Bearer token. The dashboard route triggers `my-role` etc.
  // almost immediately — much faster than waiting for the full calendar
  // grid to render before we even start seeding.
  await page.goto(`/h/${HOTEL_ID}/dashboard`);
  await page.waitForResponse(
    (r) => r.url().includes('/api/v1/hotels/') && r.request().method() === 'GET',
    { timeout: 15_000 },
  );
  if (!userToken) throw new Error('Could not capture user auth token from XHRs');

  // ── 2. API helper that runs from inside the page (browser session +
  //       captured Bearer token). Tenant resolution flows through the
  //       logged-in user — no X-Tenant-Id header gymnastics needed.
  const api = async <T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<{ status: number; body: T | null }> => {
    return page.evaluate(
      async ({ path, init, token }) => {
        const headers: Record<string, string> = { Authorization: token };
        if (init.body !== undefined) headers['Content-Type'] = 'application/json';
        const r = await fetch(path, {
          method: init.method ?? 'GET',
          headers,
          body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
        });
        let body: unknown = null;
        try { body = await r.json(); } catch {}
        return { status: r.status, body: body as T };
      },
      { path, init, token: userToken },
    );
  };

  // ── 3. Idempotent cleanup: any DEMO-* leftovers from a crashed run.
  const existing = await api<{ data: Array<{ bookingRef: string }> }>(
    `/api/v1/hotels/${HOTEL_ID}/reservations?limit=500`,
  );
  for (const r of existing.body?.data ?? []) {
    if (r.bookingRef?.startsWith(DEMO_PREFIX)) {
      await api(`/api/v1/hotels/${HOTEL_ID}/reservations/${r.bookingRef}`, { method: 'DELETE' });
    }
  }

  // ── 4. Seed fresh demo reservations for today + a few days.
  const seededRefs: string[] = [];
  const todayIso = today();
  for (const g of DEMO_GUESTS) {
    const ref = `${DEMO_PREFIX}${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const body = buildReservationBody({
      ref, firstName: g.firstName, lastName: g.lastName,
      room: g.room, checkin: addDays(todayIso, g.daysOut), nights: 2,
    });
    const res = await api(`/api/v1/hotels/${HOTEL_ID}/reservations`, {
      method: 'POST', body,
    });
    if (res.status >= 200 && res.status < 300) {
      seededRefs.push(ref);
      console.log(`[demo] seeded ${g.firstName} ${g.lastName} → ${ref} (room ${g.room}, +${g.daysOut}d)`);
    } else {
      console.warn(`[demo] FAILED seed ${g.firstName}: ${res.status} ${JSON.stringify(res.body).slice(0, 200)}`);
    }
  }

  try {
    // ── 5. Now navigate to the calendar. Single fresh load — no reload
    //       jank — and the grid renders with our seeded reservations
    //       already in place because the API has them.
    await page.goto(`/h/${HOTEL_ID}/calendar`);
    await page.waitForSelector('[data-tour="cal-grid"]', { timeout: 30_000 });
    await pause(page, 1200);

    // Filter tabs — index 0 = All, 1 = Arriving, 2 = Leaving, 3 = In-house.
    const tabs = page.locator('[data-tour="cal-filter-tabs"] button');
    await demoClick(tabs.nth(1));
    await pause(page, 1500);

    // Open the first visible reservation chip → side panel slides in.
    const firstChip = page.locator('.res-chip').first();
    await demoClick(firstChip);
    await pause(page, 2500);
  } finally {
    // ── 6. Always wipe our demo data, even if the recording errored.
    for (const ref of seededRefs) {
      await api(`/api/v1/hotels/${HOTEL_ID}/reservations/${ref}`, { method: 'DELETE' })
        .catch((err) => console.warn(`[demo] cleanup ${ref}: ${err.message}`));
    }
  }
});
