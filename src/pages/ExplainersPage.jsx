/* ===========================================================
   ANIMATED EXPLAINERS — every step-by-step animation of a phase
   in one place, with play/pause and a full-screen present mode.
   =========================================================== */
import { useEffect, useState } from 'react';
import Scene, { framesOf } from '../components/Scene.jsx';
import Icon from '../components/Icon.jsx';
import { Link, navigate, isTyping } from '../lib.jsx';

export default function ExplainersPage({ phase, params }) {
  const list = phase.explainers;
  const current = list.find((x) => x.def.id === params.x) || list[0];
  const { def } = current;
  const [present, setPresent] = useState(false);
  const slideNo = phase.slides.findIndex((s) => s.scene === def) + 1;
  const pick = (id) => navigate(`/${phase.id}/explainers?x=${id}`);

  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.body.dataset.palette === 'open' || document.body.dataset.revising === 'true') return;
      if (e.key === 'f' || e.key === 'F') setPresent((p) => !p);
      else if (e.key === 'Escape') setPresent(false);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!present) return;
        e.preventDefault();
        const i = list.indexOf(current) + (e.key === 'ArrowDown' ? 1 : -1);
        if (list[i]) pick(list[i].def.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('deck-lock', present);
    return () => document.documentElement.classList.remove('deck-lock');
  }, [present]);

  const scene = <Scene key={def.id} def={def} keys />;

  return (
    <div className="page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <span className="pill tint-pink">Phase {phase.num} · Animated</span>
          <h1 className="display h-xl">Animated explainers</h1>
          <p className="lead">
            Step through each idea the way a video would show it: code on the left, and every block moves as it runs.
            Use <kbd>←</kbd> <kbd>→</kbd> to step, <kbd>Space</kbd> to play, and <kbd>F</kbd> for full screen.
          </p>
        </div>
      </div>

      <div className="xp-layout">
        <nav className="xp-list" aria-label="All explainers">
          {Object.entries(phase.parts).map(([k, p]) => {
            const items = list.filter((x) => x.part === k);
            if (!items.length) return null;
            return (
              <div className="xp-group" key={k}>
                <span className={`pill tint-${p.tint}`}>{p.label.replace(/^Part [A-Z] · /, '')}</span>
                {items.map((x) => (
                  <button type="button" key={x.def.id} className={`xp-item ${x === current ? 'is-active' : ''}`} onClick={() => pick(x.def.id)}>
                    <span className="mono">{String(list.indexOf(x) + 1).padStart(2, '0')}</span>
                    <span>{x.def.title}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="xp-main">
          <div className="xp-head">
            <div className="stack" style={{ '--gap': '8px' }}>
              <h2 className="display h-md">{def.title}</h2>
              <p className="muted">
                {def.blurb} {framesOf(def).length} steps.
                {slideNo > 0 && <> Also on <Link to={`/${phase.id}/slides?s=${slideNo}`}>slide {slideNo}</Link>.</>}
              </p>
            </div>
            <button type="button" className="btn ghost small" onClick={() => setPresent(true)}>
              <Icon name="expand" size={16} /> Full screen <kbd>F</kbd>
            </button>
          </div>
          {!present && <div className="xp-stage">{scene}</div>}
        </div>
      </div>

      {present && (
        <div className="xp-present" role="dialog" aria-label={`${def.title}, full screen`}>
          <div className="xp-present-bar">
            <h2 className="display h-md">{def.title}</h2>
            <span className="muted xp-keys hide-narrow"><kbd>←</kbd> <kbd>→</kbd> step · <kbd>Space</kbd> play · <kbd>↑</kbd> <kbd>↓</kbd> other explainers</span>
            <button type="button" className="btn ghost small" onClick={() => setPresent(false)}>
              <Icon name="close" size={16} /> Exit <kbd>Esc</kbd>
            </button>
          </div>
          {scene}
        </div>
      )}
    </div>
  );
}
