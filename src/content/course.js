/* ===========================================================
   COURSE REGISTRY — the one "linker" file.
   Every phase listed here appears on the hub, in the nav,
   in Ctrl/Cmd+K search and in revision mode.
   =========================================================== */
import phase0 from './phase-0/index.js';
import { slug } from '../lib.jsx';

const soon = (num, title, summary, week) => ({ id: `phase-${num}`, num, title, summary, week, status: 'soon', pages: [] });

export const course = {
  title: 'Backend Engineering with Express.js',
  short: 'Express Backend',
  phases: [
    phase0,
    soon(1, 'JavaScript & Node.js essentials', 'Modern JS, async/await, npm, environment variables, Git, and a server with no framework.', 'Week 2'),
    soon(2, 'Your first Express server', 'Routes, the request and response objects, middleware and routers.', 'Week 3'),
    soon(3, 'REST API design & CRUD', 'Resource naming, methods, status codes, pagination, and full CRUD.', 'Week 4'),
    soon(4, 'Databases & data modelling', 'SQL, relationships, PostgreSQL with Prisma, migrations and transactions.', 'Weeks 5–6'),
    soon(5, 'Validation, errors & structure', 'Zod validation, a central error handler, and a layered project layout.', 'Week 7'),
    soon(6, 'Authentication & authorization', 'Password hashing, JWTs, protected routes, roles and ownership checks.', 'Week 8'),
    soon(7, 'Security, testing & docs', 'helmet, CORS, rate limits, Supertest integration tests and Swagger.', 'Week 9'),
    soon(8, 'Deployment & production', 'Hosting, managed Postgres, CI with GitHub Actions, health checks.', 'Week 10'),
    { ...soon(9, 'Capstone project', 'Design and ship a new API alone, end to end.', 'Weeks 11–12'), label: 'Capstone' },
  ],
};

export const findPhase = (id) => course.phases.find((p) => p.id === id && p.status === 'ready');

/* ---------- search index for the command palette ---------- */
export function buildSearchIndex() {
  const items = [];
  const add = (x) => items.push({ id: items.length + ':' + x.title, ...x });

  add({ group: 'Pages', title: 'Course home', sub: 'All phases', to: '/', featured: true, boost: 1 });
  add({ group: 'Actions', title: 'Flip to revision cards', sub: 'Quick flashcard revision of everything', action: 'revise', keywords: 'anki revise flashcards review', featured: true, boost: 2 });
  add({ group: 'Actions', title: 'Change theme', sub: 'System → light → dark', action: 'theme', keywords: 'dark light mode' });

  course.phases.forEach((ph) => {
    const name = ph.label || `Phase ${ph.num}`;
    if (ph.status !== 'ready') {
      add({ group: 'Coming soon', title: `${name}: ${ph.title}`, sub: ph.summary, to: '/', keywords: ph.summary });
      return;
    }
    add({ group: 'Pages', title: `${name}: ${ph.title}`, sub: 'Overview', to: `/${ph.id}`, featured: true, boost: 1 });
    ph.pages.forEach((pg) => {
      add({ group: 'Pages', title: pg.title, sub: `${name} · ${pg.blurb}`, to: `/${ph.id}/${pg.slug}`, featured: ['slides', 'cheatsheet', 'journey', 'lab'].includes(pg.slug), boost: 3 });
      (pg.sections || []).forEach((s) => {
        add({ group: pg.title, title: s.title, sub: s.sub || `${name} · ${pg.title}`, to: `/${ph.id}/${pg.slug}?s=${s.id}`, keywords: s.keywords || '' });
      });
    });
    ph.slides.forEach((s, i) => {
      add({ group: 'Slides', title: s.title, sub: `Slide ${i + 1} · ${ph.parts[s.part].label}`, to: `/${ph.id}/slides?s=${i + 1}`, keywords: `${s.lead || ''} ${s.remember || ''}` });
    });
    ph.glossary.forEach(([term, def]) => {
      add({ group: 'Glossary', title: term, sub: def.replace(/`/g, ''), to: `/${ph.id}/cheatsheet?s=term-${slug(term)}`, keywords: def });
    });
  });
  return items;
}
