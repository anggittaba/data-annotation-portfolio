# Anggit Taba — Data Annotation Portfolio

A single-page portfolio for a data annotation specialist, built by hand with
vanilla HTML/CSS/JS. No frameworks, no build step, no templates.

## What's inside

- **Annotation studio** — a live, working bounding-box demo. Visitors draw
  boxes on sample images, label them, and export COCO-style JSON. This is the
  portfolio piece: it demonstrates the actual skill instead of describing it.
- **Services, process, track record, about, contact** — honest copy, real
  numbers only.

## Run locally

```bash
python3 -m http.server --directory . 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push this folder to a GitHub repo (e.g. `data-annotation-portfolio`).
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. Link the `*.github.io/data-annotation-portfolio` URL on the Upwork profile.

## Design notes

Follows the Hallmark anti-slop disciplines: locked design tokens (all colors
and fonts via CSS variables), no invented metrics, roman-only headings,
mobile-first responsive (320px+), typography-led with one accent color.
