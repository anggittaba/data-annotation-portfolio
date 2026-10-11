# Data Annotation Portfolio — Anggit Taba

**Live:** https://anggittaba.github.io/data-annotation-portfolio/

Interactive portfolio for a data annotation specialist. The centerpiece is a
working annotation studio: visitors draw bounding boxes on sample images,
assign labels, and export normalized JSON — the same format ML training
pipelines consume.

## Why this exists

Most annotation portfolios are screenshots and claims. This one lets a client
test the actual skill in about 30 seconds, with no sign-up and nothing to
install.

## What's inside

- **Annotation studio (live demo)** — bounding-box drawing, quick labels,
  sample loader, JSON export
- **Services** — image annotation, text & content labeling, data entry &
  web research, QA & dataset audit
- **Process** — a 4-stage workflow from guidelines to delivery
- **Track record & about** — verified experience, real numbers only

## Technical notes

Single-page site with zero dependencies and no build step — it loads fast on
any connection and works on mobile (320px+). The demo images are inlined as
data URIs so the studio runs fully from one deploy.

## Preview locally

```bash
python3 -m http.server --directory . 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push this folder to the GitHub repo.
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. Link the `*.github.io/data-annotation-portfolio` URL on the Upwork profile.
