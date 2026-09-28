/* ===========================================================
   APP — routing, global keys, command palette, revision flip
   =========================================================== */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute, isTyping, prefersReducedMotion, usePersisted, Link } from './lib.jsx';
import { course, findPhase, buildSearchIndex } from './content/course.js';
import CommandPalette from './components/CommandPalette.jsx';
import Flashcards from './components/Flashcards.jsx';
import Icon from './components/Icon.jsx';
import Home from './pages/Home.jsx';
import PhaseHome from './pages/PhaseHome.jsx';
import SlidesPage from './pages/SlidesPage.jsx';
import ContentPage from './pages/ContentPage.jsx';
import JourneyPage from './pages/JourneyPage.jsx';
import QuizPage, { AnswerKeyPage } from './pages/QuizPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import ExplainersPage from './pages/ExplainersPage.jsx';

const THEMES = ['system', 'light', 'dark'];

export default function App() {
  const { path, params } = useRoute();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [revising, setRevising] = useState(false);
  const [flip, setFlip] = useState('');
  const [theme, setTheme] = usePersisted('theme', 'system');

  /* theme: "system" leaves the attribute alone so the host/OS decides */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);
  const cycleTheme = useCallback(() => setTheme((t) => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]), [setTheme]);

  /* resolve route */
  const segs = path.split('/').filter(Boolean);
  const phase = segs[0] ? findPhase(segs[0]) : null;
  const pageSlug = segs[1] || null;
  const page = phase && pageSlug ? phase.pages.find((p) => p.slug === pageSlug) : null;

  /* the flip: rotate out, swap the view, rotate back in */
  const toggleRevise = useCallback(() => {
    const swap = () => {
      setRevising((r) => !r);
      window.scrollTo(0, 0);
    };
    if (prefersReducedMotion()) return swap();
    setFlip('out');
    setTimeout(() => {
      swap();
      setFlip('in');
      setTimeout(() => setFlip(''), 360);
    }, 260);
    return undefined;
  }, []);
  useEffect(() => { document.body.dataset.revising = String(revising); }, [revising]);

  /* leaving revision mode when the route changes */
  useEffect(() => { setRevising(false); }, [path]);

  /* scroll: to a section (?s=id) or to the top on page change */
  useEffect(() => {
    if (params.s && pageSlug !== 'slides') {
      requestAnimationFrame(() => {
        const el = document.getElementById(params.s);
        if (el) {
          el.scrollIntoView({ block: 'start' });
          el.classList.remove('flash');
          void el.offsetWidth;
          el.classList.add('flash');
        }
      });
    } else if (pageSlug !== 'slides') window.scrollTo(0, 0);
  }, [path, params.s, pageSlug]);

  /* global keys */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (paletteOpen || isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') { e.preventDefault(); setPaletteOpen(true); }
      else if (e.key === 'r' || e.key === 'R') toggleRevise();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, toggleRevise]);

  const searchItems = useMemo(buildSearchIndex, []);
  const onAction = (a) => {
    if (a === 'revise') { if (!revising) toggleRevise(); }
    else if (a === 'theme') cycleTheme();
  };

  /* revision deck: this phase, or every ready phase from the hub */
  const readyPhases = course.phases.filter((p) => p.status === 'ready');
  const revPhases = phase ? [phase] : readyPhases;
  const revCards = revPhases.flatMap((p) => p.flashcards);
  const revTopics = revPhases.flatMap((p) => p.topics);

  let view;
  if (!segs.length) view = <Home />;
  else if (!phase) view = <NotFound />;
  else if (!pageSlug) view = <PhaseHome phase={phase} />;
  else if (!page) view = <NotFound />;
  else if (page.kind === 'slides') view = <SlidesPage key={phase.id} phase={phase} params={params} />;
  else if (page.kind === 'content') view = <ContentPage phase={phase} page={page} />;
  else if (page.kind === 'journey') view = <JourneyPage phase={phase} />;
  else if (page.kind === 'quiz') view = <QuizPage phase={phase} />;
  else if (page.kind === 'answers') view = <AnswerKeyPage phase={phase} />;
  else if (page.kind === 'flashcards') view = <FlashcardsPage phase={phase} />;
  else if (page.kind === 'explainers') view = <ExplainersPage phase={phase} params={params} />;
  else view = <NotFound />;

  const themeIcon = theme === 'dark' ? 'moon' : theme === 'light' ? 'sun' : 'auto';

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link to="/" className="brand" aria-label="Course home">
            <span className="brand-mark">{'{}'}</span>
            <span className="brand-name">Express<br />Backend</span>
          </Link>
          {phase && (
            <Link to={`/${phase.id}`} className="crumb hide-narrow">
              <span className="pill tint-yellow">Phase {phase.num}</span>
              <span className="crumb-title">{phase.title}</span>
            </Link>
          )}
          <div className="top-actions">
            <button type="button" className="search-trigger" onClick={() => setPaletteOpen(true)} aria-label="Search (Ctrl K)">
              <Icon name="search" size={18} />
              <span className="hide-narrow">Search topics</span>
              <span className="kbd-hint hide-narrow"><kbd>Ctrl</kbd> <kbd>K</kbd></span>
            </button>
            <button type="button" className="btn small" aria-pressed={revising} onClick={toggleRevise} title="Flip to flashcards (R)">
              <Icon name="flip" size={17} /> <span>{revising ? 'Back' : 'Revise'}</span>
            </button>
            <button type="button" className="btn ghost icon theme-btn" onClick={cycleTheme} aria-label={`Theme: ${theme}. Change theme`} title={`Theme: ${theme}`}>
              <Icon name={themeIcon} size={18} />
            </button>
          </div>
        </div>
        {phase && !revising && (
          <nav className="phase-nav" aria-label={`Phase ${phase.num} materials`}>
            <div className="wrap phase-nav-inner">
              <Link to={`/${phase.id}`} className={`pn-item ${!pageSlug ? 'is-active' : ''}`}>Overview</Link>
              {phase.pages.map((p) => (
                <Link key={p.slug} to={`/${phase.id}/${p.slug}`} className={`pn-item ${pageSlug === p.slug ? 'is-active' : ''}`}>
                  {p.title}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="wrap main">
        <div className={`flipper ${flip ? 'flip-' + flip : ''}`}>
          {revising ? (
            <section className="revision" aria-label="Revision mode">
              <div className="page-head">
                <div className="stack" style={{ '--gap': '14px' }}>
                  <span className="pill tint-pink">Revision mode</span>
                  <h1 className="display h-lg">{phase ? `Phase ${phase.num}: ${phase.title}` : 'Everything so far'}</h1>
                  <p className="lead">{revCards.length} cards. Flip each one, then mark it <strong>Again</strong> or <strong>Got it</strong>. Missed cards come back until you know them.</p>
                </div>
                <button type="button" className="btn ghost" onClick={toggleRevise}><Icon name="flip" size={17} /> Back to the page</button>
              </div>
              <Flashcards cards={revCards} topics={revTopics} storageKey={'rev:' + (phase ? phase.id : 'all')} />
            </section>
          ) : (
            view
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span className="label">{course.title}</span>
          <span className="muted">
            <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd> search · <kbd>R</kbd> revise · <kbd>F</kbd> present slides
          </span>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={searchItems} onAction={onAction} />
    </>
  );
}

function NotFound() {
  return (
    <div className="page">
      <div className="card tint-yellow" style={{ maxWidth: 640 }}>
        <span className="pill">404 · Not Found</span>
        <h1 className="display h-lg">Nothing lives at this address</h1>
        <p>Fitting, for a course about status codes. Head back to the course home or press <kbd>Ctrl</kbd> <kbd>K</kbd> to search.</p>
        <Link className="btn" to="/">Course home</Link>
      </div>
    </div>
  );
}
