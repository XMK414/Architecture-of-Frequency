# The Architecture of Frequency

A cyberpunk-styled EDM blog dissecting electronic music's pioneers and the underground vanguard — with a **live audio synthesis engine** built on the Web Audio API.

## Features

- **🎛️ Working music player** — the FREQ/ARCH Synthesis Engine generates six original, genre-tribute compositions (dubstep, jungle/DnB, industrial techno, Chicago house, organic bass, Florida breaks) in real time from oscillators and filtered noise. No audio files, no streams — every kick, wobble, and hi-hat is synthesized live in the browser. Full transport: play/pause, prev/next, seek, volume, mute, playlist.
- **📡 Audio-reactive visuals** — the Three.js background grid and the mini equalizer are driven by the engine's real frequency spectrum via an `AnalyserNode` (bass in the center of the grid, highs at the edges).
- **📰 Transmissions (blog)** — expandable deep-dive posts on the Amen Break, the origins of PLUR, Daft Punk at Even Furthur '96, and the Midwest's venue arteries.
- **🗳️ The Living Archive (community)** — visitors can submit and upvote:
  - *Defining Moments* — historical moments that shaped the industry
  - *Artists to Watch* — artists who deserve the spotlight
  - *Essential Tracks* — tracks that need to be heard
- **💬 Frequency Feedback** — a comment section with persistence.
- Mobile navigation, XSS-safe rendering of user input, graceful degradation if CDNs fail.

## Persistence note

This is a fully static site (deployable on GitHub Pages). Comments, archive submissions, and votes are stored in each visitor's browser via `localStorage` — there is no backend, so entries are per-browser. Wiring the same UI to a backend (e.g. Supabase/Firebase) is a straightforward next step.

## Running locally

Any static server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

> Browsers require a user gesture before audio can start — hit **Fire Up the Engine** or the play button.

## Structure

```
index.html          page markup
css/style.css       custom styles (glass, neon, animations)
js/data.js          article, blog, and seed community content
js/audio-engine.js  Web Audio generative music engine
js/visualizer.js    audio-reactive Three.js background
js/app.js           UI wiring, blog/archive/comments rendering
```
