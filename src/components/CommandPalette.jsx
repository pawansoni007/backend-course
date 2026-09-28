/* ===========================================================
   COMMAND PALETTE — Ctrl+K / Cmd+K (or "/") to search topics
   =========================================================== */
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { navigate } from '../lib.jsx';

function score(item, terms) {
  const title = item.title.toLowerCase();
  const hay = (item.title + ' ' + (item.sub || '') + ' ' + (item.keywords || '') + ' ' + item.group).toLowerCase();
  let s = 0;
  for (const t of terms) {
    const i = hay.indexOf(t);
    if (i === -1) return -1;
    s += title.includes(t) ? 10 : 2;
    if (title.startsWith(t)) s += 6;
  }
  return s + (item.boost || 0);
}

export default function CommandPalette({ open, onClose, items, onAction }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      document.body.dataset.palette = 'open';
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      delete document.body.dataset.palette;
    }
  }, [open]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items.filter((i) => i.featured);
    return items
      .map((i) => ({ i, s: score(i, terms) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map((x) => x.i);
  }, [q, items]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const choose = (item) => {
    onClose();
    if (item.action) onAction(item.action);
    else if (item.to) navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); choose(results[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  // group while keeping rank order of first appearance
  const groups = [];
  results.forEach((r, idx) => {
    let g = groups.find((x) => x.name === r.group);
    if (!g) groups.push((g = { name: r.group, items: [] }));
    g.items.push({ ...r, idx });
  });

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search the course" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette-input">
          <Icon name="search" />
          <input
            ref={inputRef}
            id="palette-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search topics, slides, terms…"
            autoComplete="off"
            spellCheck="false"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `pr-${active}` : undefined}
          />
          <button type="button" className="btn ghost small" onClick={onClose} aria-label="Close search">Esc</button>
        </div>
        <div className="palette-results" id="palette-results" role="listbox" ref={listRef}>
          {!q && <p className="palette-tip label">Try: status codes · dns · 401 · json · port</p>}
          {groups.map((g) => (
            <div key={g.name} className="palette-group">
              <div className="label palette-group-name">{g.name}</div>
              {g.items.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  id={`pr-${r.idx}`}
                  data-idx={r.idx}
                  role="option"
                  aria-selected={r.idx === active}
                  className={`palette-item ${r.idx === active ? 'is-active' : ''}`}
                  onMouseMove={() => setActive(r.idx)}
                  onClick={() => choose(r)}
                >
                  <span className="pi-title">{r.title}</span>
                  {r.sub && <span className="pi-sub">{r.sub}</span>}
                  <Icon name="arrow" size={16} className="pi-arrow" />
                </button>
              ))}
            </div>
          ))}
          {q && !results.length && <p className="palette-empty">Nothing matches “{q}”. Try a shorter word.</p>}
        </div>
        <div className="palette-foot label">
          <span><kbd>↑</kbd> <kbd>↓</kbd> move</span>
          <span><kbd>Enter</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
