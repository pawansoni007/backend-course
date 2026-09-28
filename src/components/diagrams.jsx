/* ===========================================================
   DIAGRAMS — HTML/CSS based so they scale inside the 1920×1080
   slide stage AND reflow on phones (read mode, cheat sheet).
   Inside the stage we add .in-stage so phone media queries
   never rearrange a presented slide.
   =========================================================== */
import { createContext, useContext } from 'react';
import { rich } from '../lib.jsx';

export const StageCtx = createContext(false);
const useStage = () => (useContext(StageCtx) ? ' in-stage' : '');

/* A → B → C → D boxes with labelled arrows. back = labels for the return trip. */
export function Flow({ nodes, arrows = [], back = [], className = '' }) {
  const st = useStage();
  const out = [];
  nodes.forEach((n, i) => {
    out.push(
      <div className={`flow-node tint-${n.tint || 'white'}`} key={'n' + i}>
        {n.tag && <span className="flow-tag">{n.tag}</span>}
        <strong>{n.title}</strong>
        {n.sub && <span className="flow-sub">{rich(n.sub)}</span>}
      </div>,
    );
    if (i < nodes.length - 1) {
      out.push(
        <div className={`flow-arrow${back[i] ? ' two-way' : ''}`} key={'a' + i} aria-hidden="true">
          {arrows[i] && <span className="fa">{rich(arrows[i])}</span>}
          <span className="fa-line" />
          {back[i] && <span className="fa">{rich(back[i])}</span>}
        </div>,
      );
    }
  });
  return <div className={`flow${st} ${className}`}>{out}</div>;
}

/* A URL broken into coloured, labelled parts */
export function UrlAnatomy({ parts }) {
  const st = useStage();
  return (
    <div className={`url-anatomy${st}`} role="figure" aria-label="Parts of a URL">
      {parts.map((p, i) => (
        <span className="ua-part" key={i}>
          <span className={`ua-text tint-${p.tint}`}>{p.text}</span>
          <span className="ua-label">{p.label}</span>
        </span>
      ))}
    </div>
  );
}

/* Raw HTTP message with a label beside each block of lines */
export function Message({ blocks, title }) {
  const st = useStage();
  return (
    <div className={`message${st}`}>
      {title && <div className="message-title label">{title}</div>}
      {blocks.map((b, i) => (
        <div className={`msg-row`} key={i}>
          <span className={`msg-label tint-${b.tint}`}>{b.label}</span>
          <pre className="msg-lines">{b.lines}</pre>
        </div>
      ))}
    </div>
  );
}

/* Sequence diagram: lanes across the top, one arrow per step */
export function Sequence({ lanes, steps, compact = false }) {
  const st = useStage();
  const idx = Object.fromEntries(lanes.map((l, i) => [l.id, i]));
  const n = lanes.length;
  return (
    <div className={`sequence${st}${compact ? ' compact' : ''}`} style={{ '--lanes': n }}>
      <div className="seq-lanes">
        {lanes.map((l) => (
          <div className={`seq-lane tint-${l.tint}`} key={l.id}>
            <strong>{l.label}</strong>
          </div>
        ))}
      </div>
      <div className="seq-body">
        <div className="seq-lines" aria-hidden="true">
          {lanes.map((l) => <span key={l.id} />)}
        </div>
        {steps.map((s, i) => {
          const a = idx[s.from];
          const b = idx[s.to];
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          const self = a === b;
          const style = self
            ? { left: `${((a + 0.5) / n) * 100}%` }
            : { left: `${((lo + 0.5) / n) * 100}%`, width: `${((hi - lo) / n) * 100}%` };
          return (
            <div className="seq-step" key={i}>
              <span className="seq-text">
                <strong>{lanes[a].label} → {lanes[b].label}</strong> {rich(s.label)}
              </span>
              <div className={`seq-arrow ${self ? 'self' : b < a ? 'rev' : 'fwd'}`} style={style}>
                <span className="seq-label">{rich(s.label)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
