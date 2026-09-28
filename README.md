# Backend Engineering with Express.js: teaching site

A Vite + React site that holds everything for teaching backend engineering, one phase at a time.

**Live:** https://backend-course.radha-vatika-api.workers.dev/ (Cloudflare Workers)

Two phases are complete. **Phase 0, How the web works**:

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

**Phase 1, JavaScript & Node.js essentials** (same pages minus the journey, plus two new ones):

| Page | What it is |
| --- | --- |
| Slides | 48 slides in five parts; 12 of them are step-by-step animations |
| Animations | The 12 animated explainers (call stack, references, filter/map, one waiter, event loop, microtasks, async/await, Promise.all, npm install, Git areas, POST body, never block the thread), with play/pause and full screen |
| Live demos | Teacher's practical script: 15 demos with every file, command and expected output (all run and checked on Node 24), plus how to break each one |
| Lab worksheet | Six missions: predict-then-run, async puzzles, npm, `.env`, GitHub, and a raw `node:http` server |

## Shortcuts

| Key | Does |
| --- | --- |
| `Ctrl K` / `⌘ K` or `/` | Search every page, section, slide and glossary term |
| `R` | Flip any page into revision flashcards (and back) |
| `←` `→` · `F` · `Esc` | Move through slides (on animated slides, `→` plays the next step first) · present full screen · leave |
| `Space` on Animations | Play / pause the animation · `↑` `↓` switch animation in full screen |
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

Hosted on **Cloudflare Workers** (static assets):
```bash
npm run build
npx wrangler deploy     # uses wrangler.jsonc, serves ./dist
```

## Add the next phase

Everything is driven by one registry file: `src/content/course.js`.

1. Copy `src/content/phase-1/` to `src/content/phase-2/` and replace the content:
   - `slides.jsx`: the slides (`parts`, `slides` with `title`, `lead`, `body` or `scene`, `remember`)
   - `explainers.js`: animated explainers (see below)
   - `flashcards.js`, `glossary.js`, `quiz.js` (`journey.js` from Phase 0 if you want a journey page)
   - `LessonPlan.jsx`, `Demos.jsx`, `Cheatsheet.jsx`, `Lab.jsx`: each exports its `…Sections` for search
   - `index.js`: title, summary, goal, checkpoint, `flow`, and the `pages` list (drop pages you don't need)
2. In `src/content/course.js`, import it and replace the `soon(2, …)` line with the new phase.

The hub, the phase nav, `Ctrl K` search and revision mode pick it up automatically.

## Animated explainers

An explainer is plain data rendered by `src/components/Scene.jsx`: optional `code`, a list of `panels`
(`stack`, `queue`, `box`, `memory`, `console`, `loop`, `timeline`), a CSS grid `areas` layout, and `frames`.
Each frame applies a few operations to the previous one:

```js
{ line: 3, say: 'Narration for this step', add: [['stack', { id: 'fn', text: 'getEvent()', tint: 'pink' }]] }
{ move: [['fn', 'paused', { badge: 'await' }]], log: 'printed line', remove: ['x'], set: [['id', { value: '45' }]] }
```

Blocks keep their `id` between frames, so a block that changes panel glides there; new blocks pop in
(or fly out of another block with `from: 'otherId'`); removed ones fade out. Put `scene: myExplainer`
on a slide to present it step by step, and list it in the phase's `explainers` for the Animations page.

## Structure

```
src/
  content/course.js         ← the one "linker" file: all phases
  content/phase-0/          ← all Phase 0 content
  content/phase-1/          ← all Phase 1 content (explainers.js = the animations)
  pages/                    ← page templates (slides, journey, quiz, flashcards…)
  components/               ← search palette, flashcards, diagrams, Scene (animations), UI blocks
  styles/                   ← tokens (colours, fonts, dark mode) + layout + slides
```

Design: BlockFrame style (from the `frontend-slides` skill): 4px black borders, hard offset shadows,
five pastels, Archivo Black / Inter / Space Grotesk / Space Mono. Fonts are self-hosted via
`@fontsource`, so the site needs no external requests. Slides keep the fixed 1920×1080 stage
from `frontend-slides` for presenting; the Read view reflows them for phones.
