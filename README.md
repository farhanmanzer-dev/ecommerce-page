# Lumen — Image Journal

An editorial image blog built with **Vite 8 + React 19**.

- **Three.js** (`@react-three/fiber` + `drei`) — 3D hero: a distorted glossy blob orbited by floating photo cards that follow the cursor.
- **GSAP** (`ScrollTrigger`, `useGSAP`) — split-word headline reveals, hero scroll parallax, pinned horizontal "Editor's picks" strip, paragraph reveals.
- **Motion** (Framer Motion) — page curtain transitions, animated filter pill, masonry layout animations, 3D tilt cards, reading progress bar, lightbox.

## Getting started

```bash
npm install
npm run dev
```

### Photos

Photos come from the Unsplash API when `VITE_UNSPLASH_ACCESS_KEY` is set in `.env.local`
(see `.env.example`). Without a key, or if Unsplash fails or rate-limits, the app falls back to
[Picsum](https://picsum.photos), which needs no key.

## Scripts

| Command           | What it does              |
| ----------------- | ------------------------- |
| `npm run dev`     | Start the dev server      |
| `npm run build`   | Production build to `dist` |
| `npm run preview` | Serve the production build |
| `npm run lint`    | ESLint (flat config)      |

## Structure

```
src/
  lib/          api.js (Unsplash/Picsum → post shape), usePosts.js, gsap.js
  three/        HeroScene.jsx
  components/   Nav, Hero, FeaturedStrip, PostGrid, PostCard, Page (transitions), Footer
  pages/        Home, Post, About
```
