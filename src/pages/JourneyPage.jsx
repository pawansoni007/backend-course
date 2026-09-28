/* ===========================================================
   REQUEST JOURNEY — step through one request, with three endings.
   =========================================================== */
import { useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { CodeBlock } from '../components/ui.jsx';
import { isTyping, prefersReducedMotion } from '../lib.jsx';

export default function JourneyPage({ phase }) {
  const { lanes, endings, steps: build } = phase.journey;
  const [ending, setEnding] = useState('ok');
  const steps = useMemo(() => build(ending), [build, ending]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[i];
  const idx = Object.fromEntries(lanes.map((l, k) => [l.id, k]));
  const a = idx[step.from];
  const b = idx[step.to];
  const n = lanes.length;
  const pos = (k) => ((k + 0.5) / n) * 100;

  const go = (k) => setI(Math.min(Math.max(k, 0), steps.length - 1));

  useEffect(() => {
    if (!playing) return undefined;
    if (i >= steps.length - 1) { setPlaying(false); return undefined; }
    const t = setTimeout(() => setI((x) => x + 1), 2600);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e.target) || document.body.dataset.palette === 'open' || document.body.dataset.revising === 'true') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const moving = a !== b;
  const statusTint = ending === 'ok' ? 'green' : ending === 'notfound' ? 'yellow' : 'pink';

  return (
    <div className="page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <span className="pill tint-green">Phase {phase.num} · Interactive</span>
          <h1 className="display h-xl">The request journey</h1>
          <p className="lead">
            Follow one request, <code>GET https://api.campus-events.dev/events/12</code>, from the moment you press Enter until something appears on screen. Use <kbd>←</kbd> <kbd>→</kbd> or the buttons.
          </p>
        </div>
      </div>

      <div className="row endings" role="group" aria-label="Choose how it ends">
        <span className="label">Ending:</span>
        {endings.map((e) => (
          <button key={e.id} type="button" className="btn small ghost" aria-pressed={ending === e.id}
            onClick={() => { setEnding(e.id); if (i > 8) setI(9); }}>
            {e.label}
          </button>
        ))}
      </div>

      <div className="journey card">
        <div className="j-lanes" style={{ '--lanes': n }}>
          {lanes.map((l, k) => (
            <div key={l.id} className={`j-lane tint-${l.tint} ${k === a || k === b ? 'is-on' : ''}`}>
              <strong>{l.label}</strong>
              <span>{l.sub}</span>
            </div>
          ))}
        </div>
        <div className="j-track" aria-hidden="true">
          {moving && (
            <span className="j-path" style={{ left: `${pos(lo)}%`, width: `${pos(hi) - pos(lo)}%` }} />
          )}
          <span
            key={`${ending}-${i}`}
            className={`j-packet ${moving ? 'is-moving' : 'is-working'} ${prefersReducedMotion() ? 'no-motion' : ''}`}
            style={{ '--from': `${pos(a)}%`, '--to': `${pos(b)}%` }}
          />
        </div>

        <div className="j-step">
          <div className="j-step-head">
            <span className="j-count">{String(i + 1).padStart(2, '0')}<small>/{steps.length}</small></span>
            <div className="stack" style={{ '--gap': '6px' }}>
              <span className="label">
                {lanes[a].label}{moving ? ` → ${lanes[b].label}` : ' (working)'}
              </span>
              <h2 className="display h-md">{step.title}</h2>
            </div>
          </div>
          <div className="grid g2 j-body">
            <p className="j-plain">{step.plain}</p>
            <CodeBlock code={step.code} lang={step.lang} title={step.lang === 'http' ? 'On the wire' : step.lang === 'js' ? 'Express code' : 'What happens'} copy={false} />
          </div>
        </div>

        <div className="j-controls">
          <button type="button" className="btn ghost icon" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous step"><Icon name="left" /></button>
          <button type="button" className="btn" onClick={() => { if (i >= steps.length - 1) setI(0); setPlaying((p) => !p); }}>
            <Icon name={playing ? 'pause' : 'play'} size={16} /> {playing ? 'Pause' : i >= steps.length - 1 ? 'Replay' : 'Auto-play'}
          </button>
          <button type="button" className="btn ghost icon" onClick={() => go(i + 1)} disabled={i === steps.length - 1} aria-label="Next step"><Icon name="right" /></button>
          <div className="j-dots" role="tablist" aria-label="Steps">
            {steps.map((s, k) => (
              <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Step ${k + 1}: ${s.title}`}
                className={`j-dot ${k === i ? 'is-on' : ''} ${k < i ? 'is-done' : ''} ${k >= 9 ? 'tint-' + statusTint : ''}`}
                onClick={() => go(k)} />
            ))}
          </div>
        </div>
      </div>

      <section className="stack" style={{ '--gap': '14px' }}>
        <h2 className="display h-md">All steps at a glance</h2>
        <ol className="j-list">
          {steps.map((s, k) => (
            <li key={k}>
              <button type="button" className={`j-li ${k === i ? 'is-on' : ''}`} onClick={() => { go(k); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <span className="mono">{String(k + 1).padStart(2, '0')}</span>
                <span>{s.title}</span>
                <span className="muted j-li-lanes">{lanes[idx[s.from]].label}{s.from !== s.to ? ` → ${lanes[idx[s.to]].label}` : ''}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
