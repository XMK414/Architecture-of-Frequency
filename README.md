# The Architecture of Frequency

A cyberpunk-styled EDM blog dissecting electronic music's pioneers and the underground vanguard — with a **live audio synthesis engine** built on the Web Audio API, a blog, and a community archive.

**Live site:** once GitHub Pages is enabled (see *Hosting* below) → `https://xmk414.github.io/Architecture-of-Frequency/`

## Features

- **🎛️ Working music player** — the FREQ/ARCH Synthesis Engine generates **nine** original genre-tribute compositions (organic bass, old-school dubstep, jungle/DnB, industrial techno, Chicago house, Florida breaks, UK garage, uplifting trance, trip-hop) in real time from oscillators and filtered noise. No audio files, no streams — every kick, wobble, and hi-hat is synthesized live in the browser. Full transport: play/pause, prev/next, seek, drag volume, mute, playlist.
- **📡 Audio-reactive visuals** — the Three.js background grid and the mini equalizer are driven by the engine's real frequency spectrum via an `AnalyserNode` (bass in the center of the grid, highs at the edges).
- **📰 Transmissions (blog)** — six expandable deep-dive posts: the Amen Break, the origins of PLUR, Daft Punk at Even Furthur '96, the Midwest's venue arteries, the Roland TB-303/acid house, and the Belleville Three.
- **🗳️ The Living Archive (community)** — visitors submit and upvote:
  - *Defining Moments* — historical moments that shaped the industry
  - *Artists to Watch* — artists who deserve the spotlight
  - *Essential Tracks* — tracks that need to be heard
- **💬 Frequency Feedback** — a persistent comment section.
- Mobile navigation, XSS-safe rendering of user input, graceful degradation if CDNs fail.

## Two ways to run it

1. **Multi-file site** (`index.html` + `css/` + `js/`) — the canonical version, ideal for GitHub Pages.
2. **`standalone.html`** — a single self-contained file with all CSS and JS inlined. Drop it on any host, email it, or double-click to open locally. Regenerate it with `node build-standalone.js` after editing sources.

## Community data: local vs. shared

Out of the box this is a **fully static site** — comments, archive submissions, and votes are stored per-browser via `localStorage` (the badges read "Saved in your browser").

To make submissions **shared across all visitors**, connect a free Supabase project — no server required. See **[SUPABASE.md](SUPABASE.md)** for the 5-minute setup (create tables, paste your URL + anon key into `js/config.js`). The badges then switch to "Shared · live", and the site automatically falls back to localStorage if the backend is ever unreachable.

## Hosting on GitHub Pages

The site is plain static files at the repo root, so the simplest and most
reliable option is **branch-based Pages** (no Actions workflow required):

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Set **Branch: `main`** and **Folder: `/ (root)`**, then **Save**.
4. Wait ~1 minute — the site goes live at
   `https://xmk414.github.io/Architecture-of-Frequency/`.

This mode **auto-updates**: every push to `main` triggers GitHub's built-in
Pages rebuild, so future changes publish automatically. The repo includes a
`.nojekyll` file so GitHub serves the files as-is without Jekyll processing.

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

> Browsers require a user gesture before audio can start — hit **Fire Up the Engine** or the play button.

## Structure

```
index.html                       page markup
standalone.html                  single-file build (generated)
build-standalone.js              inlines css/js into standalone.html
css/style.css                    custom styles (glass, neon, animations)
js/config.js                     optional Supabase credentials
js/data.js                       article, blog, and seed community content
js/store.js                      data layer (Supabase cloud or localStorage)
js/audio-engine.js               Web Audio generative music engine
js/visualizer.js                 audio-reactive Three.js background
js/app.js                        UI wiring, blog/archive/comments rendering
.nojekyll                        serve files as-is on GitHub Pages
SUPABASE.md                      shared-backend setup guide
```
