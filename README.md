# Mojave-Shirley

Portfolio site for a web development studio — websites, web apps, analytics implementations, and tracking setups (GTM, GA4, pixels, server-side events) — with satirical and sinister undertones around datacenter politics and surveillance infrastructure.

## Quick Start

```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080` or open `index.html` directly.

**Ops speedrun mode:** `http://localhost:8080/?ops`

## Deploy

Pushes to `main` auto-deploy via GitHub Pages (`.github/workflows/pages.yml`).

If the live site is not updating:

1. **Enable Pages** — Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. **Check Actions** — The “Deploy GitHub Pages” workflow must succeed (green) on each push
3. **Hard refresh** — The service worker uses network-first caching; if you still see old copy, hard-refresh once (`Ctrl+Shift+R` / `Cmd+Shift+R`) or clear site data for the Pages URL

Live URL: `https://themitchyboy.github.io/Mojave-Shirley/`

## Layout notes

### Hero heat parallax

`hero-heat` uses the original bottom-half warm gradient with scroll parallax (`translateY(scrollY * -0.05)`). `--scroll-y` is driven from `main.js` on scroll.

The header uses the original translucent glass style (`rgba` + `backdrop-filter: blur(20px)`), deepening slightly on scroll. `.hero` keeps an explicit `--bg-deep` background so content behind the header stays filled if the heat gradient shifts.

## Features (v3)

- **Web development & tracking showcase** — Flagship card for sites, apps, and measurement stacks (GTM, GA4, Segment, React, Next.js)
- **System status page** — All green except "Local approval pipeline: Degraded"
- **Company timeline** — Founding through Phase 2 construction
- **Careers & investor deck** — Satirical hiring and shareholder modals
- **Daily news ticker** — Rotating headline pair by calendar day
- **Cookie decline arc** — Slow UI shift after declining cookies
- **Uptime mini-game** — Click uptime stat during a dip to stabilize
- **Camera feed simulator** — Vision modal draws bounding boxes on mouse move
- **Risk score** — Visible in classified mode while typing contact form
- **sudo redacted mode** — Terminal command blurs copy; click to unredact
- **24 directives** — Achievement log with finale unlock + sixth project card
- **Clearance share card** — After completing all directives
- **Whistleblower report** — Footer "Report Site" modal
- **Night mode copy** — Midnight–5am hero text shift
- **`/node`** — Minimal facility heartbeat page
- **`robots.txt`** — Disallows `/classified`, `/conscience`
- **404 page** — "Relocated to cold storage"
- **Service worker** — Offline retention message

## Easter Eggs

See [full list in previous versions plus] terminal commands: `glossary`, `careers`, `investors`, `sudo`.

Finale: discover all 22 other directives → unlock **Welcome to the Pipe** + sixth project card.

## Structure

```
index.html, 404.html, robots.txt, sw.js
node/index.html
js/ — config, achievements, terminal, classified, modals, cookie-arc,
      daily-content, time-mode, uptime-game, risk-score, redacted-mode,
      speedrun, easter-eggs, main, sw-register
css/styles.css
assets/favicon.svg, og-image.svg
```
