# Backend Engineering with Express.js: teaching site

A Vite + React site that holds everything for teaching backend engineering, one phase at a time.

**Live:** https://backend-course.radha-vatika-api.workers.dev/ (Cloudflare Workers)

Phase 0, **How the web works**, is complete:

| Page | What it is |
| --- | --- |
| Slides | 26 slides in four parts. **Slides** view (16:9, arrow keys, `F` to present) or **Read** view (responsive, used by default on phones) |
| Lesson plan | Teacher's script: what to say, analogies, questions with what to listen for, pause points. No timings, so it can run over two days |
| Cheat sheet | One-page reference: URL parts, methods, status codes, headers, JSON, ports, DNS, curl, glossary |
| Request journey | Interactive walk-through of one request, with 200 / 404 / 500 endings |
| Lab worksheet | Five hands-on missions (DevTools, Postman, curl, nslookup, drawing) plus a bonus. Answers save in the browser |
| Quiz | 12 multiple-choice questions (marked instantly) and 4 short answers with model answers |
| Answer key | Teacher's copy of every answer with the reason |
| Flashcards | 50 Anki-style flip cards, filterable by topic |

## Shortcuts

| Key | Does |
| --- | --- |
| `Ctrl K` / `⌘ K` or `/` | Search every page, section, slide and glossary term |
| `R` | Flip any page into revision flashcards (and back) |
| `←` `→` · `F` · `Esc` | Move through slides · present full screen · leave |
| `Space` · `1` · `2` | Flip a flashcard · Again · Got it |

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # → dist/ (static files, relative paths, hash routing)
npm run preview    # check the build locally
```

`dist/` works on any static host with no server config: URLs look like `/#/phase-0/slides`, so refreshes never 404.
`npm run build:single` makes one self-contained `dist-single/index.html` (fonts and code inlined) if you ever need a single file.

## Deploy

**GitHub Pages**
1. Push this folder to a GitHub repo (branch `main`).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes on every push.

**Cloudflare Workers (static assets)**
```bash
npm run build
npx wrangler deploy     # uses wrangler.jsonc, serves ./dist
```
Or use **Cloudflare Pages**: connect the repo with build command `npm run build` and output directory `dist`.

## Add the next phase

Everything is driven by one registry file: `src/content/course.js`.

1. Copy `src/content/phase-0/` to `src/content/phase-1/` and replace the content:
   - `slides.jsx`: the slides (`parts`, `slides` with `title`, `lead`, `body`, `remember`)
   - `flashcards.js`, `glossary.js`, `quiz.js`, `journey.js` (optional)
   - `LessonPlan.jsx`, `Cheatsheet.jsx`, `Lab.jsx`: each exports its `…Sections` for search
   - `index.js`: title, summary, goal, checkpoint, and the `pages` list (drop pages you don't need)
2. In `src/content/course.js`, import it and replace the `soon(1, …)` line with the new phase.

The hub, the phase nav, `Ctrl K` search and revision mode pick it up automatically.

## Structure

```
src/
  content/course.js         ← the one "linker" file: all phases
  content/phase-0/          ← all Phase 0 content
  pages/                    ← page templates (slides, journey, quiz, flashcards…)
  components/               ← search palette, flashcards, diagrams, UI blocks
  styles/                   ← tokens (colours, fonts, dark mode) + layout + slides
```

Design: BlockFrame style (from the `frontend-slides` skill): 4px black borders, hard offset shadows,
five pastels, Archivo Black / Inter / Space Grotesk / Space Mono. Fonts are self-hosted via
`@fontsource`, so the site needs no external requests. Slides keep the fixed 1920×1080 stage
from `frontend-slides` for presenting; the Read view reflows them for phones.
