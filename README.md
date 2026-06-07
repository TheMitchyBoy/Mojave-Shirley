# Mojave-Shirley

Company website with satirical and sinister undertones to play into modern critics of technology.

## Quick Start

```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080` or open `index.html` directly.

## Deploy

Pushes to `main` auto-deploy via GitHub Pages (`.github/workflows/pages.yml`). Enable Pages in repo Settings → Pages → Source: GitHub Actions.

## Features

- **Project spotlights** — Wearables, security camera AI, apps, fintech with tech stack tags and case-study modals
- **News ticker** — Local opposition headlines vs corporate responses
- **Municipal partnership doc** — Fake town hall PDF with jobs promised vs delivered
- **Achievement log** — 14 discoverable directives, persisted in localStorage
- **Progressive disclosure** — Copy shifts after classified unlock
- **Optional ambient sound** — Off by default (footer toggle)
- **Live metrics** — Signals processed counter ticks upward

## Easter Eggs

| Trigger | Effect |
|---------|--------|
| Triple-click logo | Hidden edge terminal |
| Long-press logo | Surveillance grid overlay |
| Type `datacenter` | Terminal + infrastructure intel |
| Type `mojave` | Classified overlay |
| Type `edge-7-mojave` | Node ID verified (also in HTML source) |
| Konami code (↑↑↓↓←→←→BA) | Glitch → classified overlay |
| Terminal `mojave` | Classified overlay |
| Terminal `ls`, `cat memo.txt`, `tail -f protests.log` | Hidden files |
| Terminal `rm -rf conscience` | Permission denied |
| Terminal `node-id` | Source inspection logged |
| Click stat "4" | Reveals fifth [REDACTED] project card |
| Transparency Report | Coordinates appear |
| Click coordinates | Facility status map |
| Submit contact form | Fake ticket with review pipeline |
| Directive Log (footer) | Achievement tracker |
| Idle 30s | Logo hint pulse |
| Idle 60s | "Session idle" toast |
| Escape | Close overlays / terminal / modals |

## Structure

```
index.html
css/styles.css
js/
  config.js         — Shared utilities, toast, focus trap
  achievements.js   — Directive tracking
  sounds.js         — Optional ambient audio
  metrics.js        — Live counters
  content-swap.js   — Progressive copy changes
  terminal.js         — Hidden terminal
  classified.js     — Classified overlay
  modals.js         — Project, municipal, facility, ticket modals
  easter-eggs.js    — Konami, keywords, idle watcher
  main.js           — Core UI interactions
assets/
  favicon.svg
  og-image.svg
.github/workflows/pages.yml
```
