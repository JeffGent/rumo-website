# Demo recorder

Playwright-driven screencast generator for the marketing-site hero
videos. Drives the running PMS through a scripted scenario with a
visible cursor and element highlights, captures it as `.webm`, then
hands off to `ffmpeg` for MP4 / WebM that ships in `../../img/`.

Lives here (not in `rumo-pms`) because the output belongs to the
website. The PMS is just a black-box HTTP target driven over
`localhost:5174`.

## Setup (one-time)

```sh
cd tools/demo-recorder
npm install
npm run install-browsers   # downloads Chromium
```

You also need `rumo-pms` running locally:

```sh
# in the rumo-pms repo
npm run dev    # client on :5174, server on :3002, Keycloak reachable
```

Then save a Keycloak session — opens a browser, you log in, the script
captures the cookies + storage to `.auth.json`:

```sh
npm run auth
```

Dismiss the cookie banner during this step too — that state gets saved
with the session and stays out of the recorded videos. Re-run when
your Keycloak refresh token expires (~30 days).

## Record

```sh
npm run record                                  # all *.demo.ts
npm run record -- pms-kalender.demo.ts          # one
```

Output:

```
output/<demo-name>-pms/video.webm
```

## Convert to MP4 + WebM for the website

```sh
SRC="output/pms-kalender.demo.ts-pms-—-calendar-overview-pms/video.webm"
TRIM=4.5                                        # seconds of splash to skip

ffmpeg -y -ss $TRIM -i "$SRC" \
  -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart \
  ../../img/pms-kalender.mp4

ffmpeg -y -ss $TRIM -i "$SRC" \
  -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 \
  ../../img/pms-kalender.webm
```

Target weights: MP4 ~250 KB, WebM ~190 KB at 1280×800 / ~9s. WebM
loads first in `<video>`, MP4 fallback.

## Add a new scenario

1. Drop `pms-<name>.demo.ts` here (the prefix is what the project's
   `testMatch` picks up).
2. Start from `pms-kalender.demo.ts` — keep the auth-capture + seed +
   `try / finally` cleanup pattern.
3. Selectors: prefer `data-tour="..."` anchors and `data-testid` —
   they survive layout changes. Hover-text and CSS-class selectors
   rot fast.
4. Tempo: the helpers insert 250 ms hover + 200 ms after-click pauses
   automatically. Add `await pause(page, 1500)` between phases so the
   viewer has time to read.

## Helper API (helpers/cursor.ts)

- `installDemoCursor(page)` — injects the SVG cursor + highlight
  overlay. Call once after `page` is created, before any navigation.
  Survives reloads via `addInitScript` + a defensive setInterval.
- `demoClick(locator, { hoverMs?, afterMs? })` — glide cursor to
  target, pulse the highlight, click. Skips post-click unhighlight
  via a race-with-timeout (the target often unmounts on click).
- `demoFill(locator, text, { keystrokeMs? })` — focus, clear (Cmd+A
  Delete), type one character at a time.
- `demoSelect(locator, value)` — glide, then `selectOption`.
- `pause(page, ms)` — readable wrapper around `page.waitForTimeout`.

## Environment

| Var             | Default                    | What                                    |
|-----------------|----------------------------|-----------------------------------------|
| `PMS_BASE_URL`  | `http://localhost:5174`    | Vite dev server of `rumo-pms` client    |
| `PMS_HOTEL_ID`  | `development-carlton`      | Hotel slug for the demo scenarios       |

## Known limits

- **Single-user auth.** `.auth.json` ties to one Keycloak session.
  Multiple developers each save their own.
- **Demo data lives in the live hotel.** PMS demos seed 5 fake
  reservations (booking-ref prefix `DEMO-`) into the actual Carlton
  hotel, then delete them in `finally`. A pre-run sweep clears
  leftovers if a previous run crashed before cleanup.
- **Headed Chromium.** Headless blocks Keycloak's third-party SSO
  cookies; the recorder runs headed. The video recorder works fine
  either way, so it's the right trade.
