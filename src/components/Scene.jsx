/* ===========================================================
   SCENE — step-by-step animated explainer (Lydia Hallie /
   Namaste JS style). An explainer is plain data:
     { id, title, code?, file?, panels, areas, cols, frames }
   Each frame is a list of operations applied to the previous
   frame: add · move · set · remove · clear · log · line · say.
   Blocks keep their id between frames, so when a block changes
   panel it glides there (FLIP), new blocks pop in, removed
   blocks fade out.
   =========================================================== */
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { highlight } from './ui.jsx';
import { StageCtx } from './diagrams.jsx';
import { rich, prefersReducedMotion } from '../lib.jsx';

const cache = new WeakMap();

export function framesOf(def) {
  if (cache.has(def)) return cache.get(def);
  const empty = Object.fromEntries(def.panels.map((p) => [p.id, []]));
  let prev = { panels: empty, line: null };
  const out = def.frames.map((f, fi) => {
    const P = Object.fromEntries(Object.entries(prev.panels).map(([k, v]) => [k, v.slice()]));
    const find = (id) => {
      for (const k of Object.keys(P)) {
        const i = P[k].findIndex((t) => t.id === id);
        if (i >= 0) return [k, i];
      }
      return null;
    };
    (f.clear || []).forEach((k) => { P[k] = []; });
    (f.remove || []).forEach((id) => {
      const at = find(id);
      if (at) P[at[0]].splice(at[1], 1);
    });
    (f.move || []).forEach(([id, to, patch]) => {
      const at = find(id);
      if (!at) return;
      const [t] = P[at[0]].splice(at[1], 1);
      P[to].push(patch ? { ...t, ...patch, from: undefined } : { ...t, from: undefined });
    });
    (f.set || []).forEach(([id, patch]) => {
      const at = find(id);
      if (at) P[at[0]][at[1]] = { ...P[at[0]][at[1]], ...patch };
    });
    // a block only "flies out of" another block on the frame it is added
    Object.values(P).forEach((list) => list.forEach((t, i) => { if (t.from) list[i] = { ...t, from: undefined }; }));
    (f.add || []).forEach(([to, tok]) => { P[to].push(tok); });
    [].concat(f.log ?? []).forEach((text, k) => {
      P[def.console || 'console'].push({ id: `log-${fi}-${k}`, text });
    });
    const next = {
      panels: P,
      line: 'line' in f ? f.line : prev.line,
      say: f.say || '',
      loop: !!f.loop,
    };
    prev = next;
    return next;
  });
  cache.set(def, out);
  return out;
}

const lineSet = (line) => new Set(line == null ? [] : [].concat(line));

function Token({ t, kind }) {
  const sig = `${t.text}|${t.value ?? ''}|${t.badge ?? ''}|${t.sub ?? ''}`;
  return (
    <div
      className={`sc-tok tint-${t.tint || (kind === 'console' ? 'none' : 'white')}${t.dim ? ' is-dim' : ''}`}
      data-fid={t.id}
      data-fsig={sig}
      data-ffrom={t.from || undefined}
    >
      {t.badge && <span className="sc-badge">{rich(t.badge)}</span>}
      <span className="sc-text">{rich(t.text)}</span>
      {t.value !== undefined && <span className="sc-val">{rich(String(t.value))}</span>}
      {t.sub && <span className="sc-sub">{rich(t.sub)}</span>}
      {t.timer && <span className="sc-timer" style={{ '--dur': `${t.timer}s` }} aria-hidden="true" />}
    </div>
  );
}

function Timeline({ p, tokens }) {
  const max = p.max || 3;
  const bars = tokens.filter((t) => t.kind !== 'marker');
  const marks = tokens.filter((t) => t.kind === 'marker');
  return (
    <div className="sc-timeline" style={{ '--lanes': p.lanes.length }}>
      {p.lanes.map((lane, i) => (
        <div className="sc-lane" key={lane}>
          <span className="sc-lane-name">{lane}</span>
          <div className="sc-lane-track">
            {bars.filter((b) => b.lane === i).map((b) => (
              <span
                key={b.id}
                className={`sc-bar tint-${b.tint || 'blue'}`}
                style={{ left: `${(b.from / max) * 100}%`, width: `${((b.to - b.from) / max) * 100}%` }}
              >
                {b.text}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="sc-axis">
        <span />
        <div className="sc-axis-track">
          {Array.from({ length: Math.floor(max) + 1 }, (_, s) => (
            <span key={s} style={{ left: `${(s / max) * 100}%` }}>{s}s</span>
          ))}
          {marks.map((m) => (
            <span key={m.id} className="sc-mark" style={{ left: `${(m.at / max) * 100}%` }}>
              <b>{m.text}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Panel({ p, tokens, frame }) {
  const kind = p.kind || 'box';
  let inner;
  if (kind === 'loop') {
    inner = (
      <div className={`sc-loop${frame.loop ? ' is-on' : ''}`}>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M38 14a17 17 0 1 0 3 14" fill="none" stroke="currentColor" strokeWidth="5" />
          <path d="M41 5v11H30" fill="none" stroke="currentColor" strokeWidth="5" />
        </svg>
        <span>{frame.loop ? 'Stack empty? Take the next callback.' : 'Waiting for the stack to empty'}</span>
      </div>
    );
  } else if (kind === 'timeline') {
    inner = <Timeline p={p} tokens={tokens} />;
  } else {
    inner = tokens.length ? tokens.map((t) => <Token key={t.id} t={t} kind={kind} />) : <span className="sc-empty">{p.empty || 'empty'}</span>;
  }
  return (
    <section className={`sc-panel k-${kind}${p.tint ? ' tint-' + p.tint : ''}`} style={{ gridArea: p.area || p.id }} aria-label={p.label}>
      <header className="sc-plabel">{p.label}</header>
      <div className="sc-slot">{inner}</div>
    </section>
  );
}

function CodePanel({ def, line }) {
  const lines = def.code.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const on = lineSet(line);
  return (
    <section className="sc-panel k-code" style={{ gridArea: 'code' }} aria-label="Code">
      <header className="sc-plabel">{def.file || 'index.js'}</header>
      <pre className="sc-code">
        {lines.map((ln, i) => (
          <div key={i} className={`sc-line${on.has(i + 1) ? ' is-on' : ''}`}>
            <span className="sc-ln">{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: highlight(ln, def.lang || 'js') || ' ' }} />
          </div>
        ))}
      </pre>
    </section>
  );
}

/* FLIP: remember where every block was, then animate from there. */
function useFlip(rootRef, ghostRef, step) {
  const mem = useRef({ rects: new Map(), clones: new Map(), sigs: new Map(), width: -1, step: -1 });
  useLayoutEffect(() => {
    const root = rootRef.current;
    const ghostLayer = ghostRef.current;
    if (!root || !ghostLayer) return;
    const m = mem.current;
    const box = root.getBoundingClientRect();
    const scale = box.width / (root.offsetWidth || 1) || 1;
    const animate = m.step !== -1 && m.step !== step && m.width === root.offsetWidth && !prefersReducedMotion();
    const rects = new Map();
    const clones = new Map();
    const sigs = new Map();
    const nodes = [...root.querySelectorAll('[data-fid]')];
    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      rects.set(n.dataset.fid, { x: (r.left - box.left) / scale, y: (r.top - box.top) / scale, w: r.width / scale, h: r.height / scale });
    });
    nodes.forEach((n) => {
      const id = n.dataset.fid;
      const now = rects.get(id);
      sigs.set(id, n.dataset.fsig);
      if (animate) {
        const old = m.rects.get(id) || (n.dataset.ffrom && (m.rects.get(n.dataset.ffrom) || rects.get(n.dataset.ffrom)));
        if (old) {
          const dx = old.x - now.x;
          const dy = old.y - now.y;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            n.animate(
              [{ transform: `translate(${dx}px, ${dy}px)`, zIndex: 5 }, { transform: 'none', zIndex: 5 }],
              { duration: 720, easing: 'cubic-bezier(.2,.9,.25,1)' },
            );
          }
          if (m.rects.has(id) && m.sigs.get(id) !== n.dataset.fsig) {
            n.animate([{ outlineColor: '#fe90e8' }, { outlineColor: 'transparent' }], { duration: 1100, easing: 'ease-out' });
          }
        } else {
          n.animate(
            [{ opacity: 0, transform: 'scale(0.4)' }, { opacity: 1, transform: 'none' }],
            { duration: 460, easing: 'cubic-bezier(.34,1.56,.64,1)' },
          );
        }
      }
      clones.set(id, n.cloneNode(true));
    });
    if (animate) {
      m.rects.forEach((r, id) => {
        if (rects.has(id)) return;
        const c = m.clones.get(id);
        if (!c) return;
        c.removeAttribute('data-fid');
        c.classList.add('sc-ghost');
        Object.assign(c.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
        ghostLayer.appendChild(c);
        const a = c.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.6) translateY(-0.6em)' }],
          { duration: 420, easing: 'ease-in', fill: 'forwards' },
        );
        a.onfinish = () => c.remove();
      });
    }
    mem.current = { rects, clones, sigs, width: root.offsetWidth, step };
  }, [step, rootRef, ghostRef]);
}

export default function Scene({ def, step: ctrl, onStep, keys = false, autoplay = false }) {
  const frames = framesOf(def);
  const inStage = useContext(StageCtx);
  const [own, setOwn] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const controlled = ctrl != null;
  const last = frames.length - 1;
  const step = Math.min(Math.max(controlled ? ctrl : own, 0), last);
  const setStep = (n) => {
    const v = Math.min(Math.max(n, 0), last);
    if (controlled) onStep?.(v);
    else setOwn(v);
  };
  const f = frames[step];
  const root = useRef(null);
  const ghosts = useRef(null);
  useFlip(root, ghosts, step);

  useEffect(() => {
    if (!playing) return undefined;
    if (step >= last) { setPlaying(false); return undefined; }
    const t = setTimeout(() => setStep(step + 1), Math.min(2200 + f.say.length * 28, 6500));
    return () => clearTimeout(t);
  });

  useEffect(() => {
    if (!keys) return undefined;
    const onKey = (e) => {
      if (document.body.dataset.palette === 'open' || document.body.dataset.revising === 'true') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); setPlaying(false); setStep(step + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setPlaying(false); setStep(step - 1); }
      else if (e.key === ' ' || e.key === 'k') { e.preventDefault(); if (step >= last) setStep(0); setPlaying((p) => !p); }
      else if (e.key === 'Home') setStep(0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const cols = def.cols || `repeat(${def.areas[0].split(/\s+/).length}, minmax(0, 1fr))`;
  return (
    <div className={`scene${inStage ? ' in-stage' : ''}`} ref={root}>
      <div
        className="sc-grid"
        style={{ gridTemplateAreas: def.areas.map((a) => `"${a}"`).join(' '), gridTemplateColumns: cols, gridTemplateRows: def.rows }}
      >
        {def.code && <CodePanel def={def} line={f.line} />}
        {def.panels.map((p) => <Panel key={p.id} p={p} tokens={f.panels[p.id]} frame={f} />)}
      </div>
      <div className="sc-foot">
        <p className="sc-say" aria-live="polite">
          <span className="sc-stepno">{step + 1}<small>/{frames.length}</small></span>
          <span>{rich(f.say)}</span>
        </p>
        <div className="sc-controls">
          <button type="button" className="btn ghost icon" onClick={() => { setPlaying(false); setStep(0); }} disabled={step === 0} aria-label="Restart"><Icon name="restart" size={18} /></button>
          <button type="button" className="btn ghost icon" onClick={() => { setPlaying(false); setStep(step - 1); }} disabled={step === 0} aria-label="Previous step"><Icon name="left" /></button>
          <button type="button" className="btn icon" onClick={() => { if (step >= last) setStep(0); setPlaying((p) => !p); }} aria-label={playing ? 'Pause' : 'Play'}>
            <Icon name={playing ? 'pause' : 'play'} size={18} />
          </button>
          <button type="button" className="btn ghost icon" onClick={() => { setPlaying(false); setStep(step + 1); }} disabled={step === last} aria-label="Next step"><Icon name="right" /></button>
        </div>
        <div className="sc-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / frames.length) * 100}%` }} /></div>
      </div>
      <div className="sc-ghosts" ref={ghosts} aria-hidden="true" />
    </div>
  );
}
