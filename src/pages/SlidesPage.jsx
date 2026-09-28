/* ===========================================================
   SLIDES PAGE
   · Slides view: fixed 1920×1080 stage scaled to fit (frontend-slides rule)
   · Present: same stage, full window (F to enter, Esc to leave)
   · Read view: every slide as a responsive card, for phones and revision
   =========================================================== */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { StageCtx } from '../components/diagrams.jsx';
import Scene, { framesOf } from '../components/Scene.jsx';
import { isTyping, useMedia } from '../lib.jsx';

const stepsIn = (slide) => (slide?.scene ? framesOf(slide.scene).length : 1);

function SlideView({ slide, parts, index, total, stage, active, sub, setSub }) {
  const p = parts[slide.part];
  const special = slide.layout === 'cover' || slide.layout === 'close';
  const cls = [
    'sl',
    stage ? 'slide' : 'read-slide',
    `bg-${slide.bg}`,
    slide.layout ? `layout-${slide.layout}` : slide.scene ? 'layout-scene' : '',
    active ? 'active visible' : '',
  ].join(' ');
  return (
    <section className={cls} id={stage ? undefined : `slide-${index + 1}`} aria-label={`Slide ${index + 1}: ${slide.title}`} aria-hidden={stage && !active ? true : undefined}>
      <span className="s-num label">{String(index + 1).padStart(2, '0')} / {total}</span>
      {!special && (
        <header className="s-head reveal">
          <span className={`pill tint-${p.tint}`}>{p.label}</span>
          <h2 className="display s-title">{slide.title}</h2>
          {slide.lead && <p className="s-lead">{slide.lead}</p>}
        </header>
      )}
      <div className="s-body reveal r2">
        {slide.scene ? (
          stage ? <Scene def={slide.scene} step={active ? sub : 0} onStep={setSub} /> : <Scene def={slide.scene} />
        ) : slide.body}
      </div>
      {slide.remember && !special && (
        <div className="s-remember reveal r3">
          <span className="label">Remember</span>
          <span>{slide.remember}</span>
        </div>
      )}
    </section>
  );
}

function Deck({ slides, parts, index, go, step, present, setPresent, sub, setSub }) {
  const wrapRef = useRef(null);
  const [box, setBox] = useState({ s: 0.5, x: 0, y: 0, h: 540 });

  const fit = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const W = present ? window.innerWidth : el.clientWidth;
    const H = present ? window.innerHeight - 64 : Math.round((W * 9) / 16);
    const s = Math.min(W / 1920, H / 1080);
    setBox({ s, x: (W - 1920 * s) / 2, y: (H - 1080 * s) / 2, h: H });
  }, [present]);

  useLayoutEffect(() => {
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(wrapRef.current);
    window.addEventListener('resize', fit);
    return () => { ro?.disconnect(); window.removeEventListener('resize', fit); };
  }, [fit]);

  // touch swipe
  const touch = useRef(null);
  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  return (
    <div className={present ? 'deck-present' : 'deck-inline'} ref={wrapRef}>
      <div className="deck-frame" style={{ height: box.h }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="deck-stage" style={{ transform: `translate(${box.x}px, ${box.y}px) scale(${box.s})` }}>
          <StageCtx.Provider value={true}>
            {slides.map((s, i) => (
              Math.abs(i - index) <= 1 ? (
                <SlideView key={s.id} slide={s} parts={parts} index={i} total={slides.length} stage active={i === index} sub={sub} setSub={setSub} />
              ) : null
            ))}
          </StageCtx.Provider>
        </div>
      </div>
      <div className="deck-bar">
        <span className="pill deck-count">{String(index + 1).padStart(2, '0')} / {slides.length}</span>
        {slides[index].scene && <span className="pill tint-yellow deck-count">Step {sub + 1} / {stepsIn(slides[index])}</span>}
        <div className="deck-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div>
        <div className="row" style={{ '--gap': '10px' }}>
          <button type="button" className="btn ghost icon" onClick={() => step(-1)} disabled={index === 0 && sub === 0} aria-label="Back"><Icon name="left" /></button>
          <button type="button" className="btn icon" onClick={() => step(1)} disabled={index === slides.length - 1 && sub >= stepsIn(slides[index]) - 1} aria-label="Next"><Icon name="right" /></button>
          <button type="button" className="btn ghost small" onClick={() => setPresent(!present)}>
            <Icon name={present ? 'close' : 'expand'} size={16} /> {present ? 'Exit' : 'Present'} <kbd>{present ? 'Esc' : 'F'}</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SlidesPage({ phase, params }) {
  const { slides, parts } = phase;
  const narrow = useMedia('(max-width: 760px)');
  const [mode, setMode] = useState(() => (params.view === 'read' ? 'read' : null));
  const view = mode || (narrow ? 'read' : 'deck');
  const [index, setIndex] = useState(() => {
    const n = parseInt(params.s, 10);
    return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), slides.length - 1) : 0;
  });
  const [present, setPresent] = useState(false);
  const [sub, setSub] = useState(0);

  // jump when search sends us to a slide
  useEffect(() => {
    const n = parseInt(params.s, 10);
    if (Number.isFinite(n)) { setIndex(Math.min(Math.max(n - 1, 0), slides.length - 1)); setSub(0); }
  }, [params.s, slides.length]);

  const go = useCallback((i, atEnd = false) => {
    const n = Math.min(Math.max(i, 0), slides.length - 1);
    setIndex(n);
    setSub(atEnd ? stepsIn(slides[n]) - 1 : 0);
  }, [slides]);

  // → plays the next animation step before moving on; ← rewinds it
  const step = useCallback((dir) => {
    const steps = stepsIn(slides[index]);
    if (dir > 0 && sub < steps - 1) setSub(sub + 1);
    else if (dir < 0 && sub > 0) setSub(sub - 1);
    else if (dir > 0) go(index + 1);
    else if (index > 0) go(index - 1, true);
  }, [slides, index, sub, go]);

  // keep the address bar in sync without adding history entries
  useEffect(() => {
    if (view !== 'deck') return;
    try {
      window.history.replaceState(null, '', `#/${phase.id}/slides?s=${index + 1}`);
    } catch { /* ignore */ }
  }, [index, view, phase.id]);

  // read view: scroll to the requested slide
  useEffect(() => {
    if (view === 'read' && params.s) {
      document.getElementById(`slide-${params.s}`)?.scrollIntoView({ block: 'start' });
    }
  }, [view, params.s]);

  // keyboard: arrows / space / F / Esc
  useEffect(() => {
    if (view !== 'deck') return undefined;
    const onKey = (e) => {
      if (isTyping(e.target) || document.body.dataset.palette === 'open' || document.body.dataset.revising === 'true') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (['ArrowRight', ' '].includes(e.key)) { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'PageDown') { e.preventDefault(); go(index + 1); }
      else if (e.key === 'PageUp') { e.preventDefault(); go(index - 1); }
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(slides.length - 1);
      else if (e.key === 'f' || e.key === 'F') setPresent((p) => !p);
      else if (e.key === 'Escape') setPresent(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, index, go, step, slides.length]);

  // lock page scroll while presenting
  useEffect(() => {
    document.documentElement.classList.toggle('deck-lock', present);
    return () => document.documentElement.classList.remove('deck-lock');
  }, [present]);

  return (
    <div className="page slides-page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <span className="pill tint-blue">Phase {phase.num} · Slides</span>
          <h1 className="display h-lg">{phase.title}</h1>
          <p className="lead">
            {slides.length} slides in {Object.keys(parts).length} parts. You can pause after any part.{' '}
            <span className="hide-narrow">Use <kbd>←</kbd> <kbd>→</kbd> to move and <kbd>F</kbd> to present.{slides.some((x) => x.scene) && <> On animated slides, <kbd>→</kbd> plays the next step first.</>}</span>
          </p>
        </div>
        <div className="seg" role="group" aria-label="View">
          <button type="button" className="btn small ghost" aria-pressed={view === 'deck'} onClick={() => setMode('deck')}>Slides</button>
          <button type="button" className="btn small ghost" aria-pressed={view === 'read'} onClick={() => setMode('read')}>Read</button>
        </div>
      </div>

      {view === 'deck' ? (
        <>
          <Deck slides={slides} parts={parts} index={index} go={go} step={step} present={present} setPresent={setPresent} sub={sub} setSub={setSub} />
          <nav className="slide-index" aria-label="All slides">
            {Object.entries(parts).map(([k, p]) => (
              <div key={k} className="si-part">
                <span className={`pill tint-${p.tint}`}>{p.label}</span>
                <div className="si-list">
                  {slides.map((s, i) => s.part === k && (
                    <button type="button" key={s.id} className={`si-item ${i === index ? 'is-active' : ''}`} onClick={() => go(i)}>
                      <span className="mono">{String(i + 1).padStart(2, '0')}</span> {s.title}{s.scene && <span className="si-anim" title="Animated"> ▶</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </>
      ) : (
        <div className="read-deck">
          {slides.map((s, i) => (
            <SlideView key={s.id} slide={s} parts={parts} index={i} total={slides.length} stage={false} active />
          ))}
        </div>
      )}
    </div>
  );
}
