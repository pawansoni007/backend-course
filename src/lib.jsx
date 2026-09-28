/* ===========================================================
   Small shared helpers: hash router, safe storage, rich text
   =========================================================== */
import { useEffect, useState, Fragment } from 'react';

/* ---------- hash router (works on GitHub Pages / any static host) ---------- */
export function parseHash() {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, '')) || '/';
  const [path, qs = ''] = raw.split('?');
  return { path: path || '/', params: Object.fromEntries(new URLSearchParams(qs)) };
}
export function useRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
export function navigate(to) {
  if (window.location.hash === '#' + to) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else window.location.hash = to;
}
export function Link({ to, children, ...rest }) {
  return <a href={'#' + to} {...rest}>{children}</a>;
}

/* ---------- storage: every read/write guarded (private mode, sandboxes) ---------- */
const NS = 'bec:';
export const store = {
  get(key, fallback) {
    try {
      const v = window.localStorage.getItem(NS + key);
      return v == null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(NS + key, JSON.stringify(value));
    } catch {
      /* storage unavailable: keep working in memory */
    }
  },
};
export function usePersisted(key, initial) {
  const [value, setValue] = useState(() => store.get(key, initial));
  useEffect(() => store.set(key, value), [key, value]);
  return [value, setValue];
}

/* ---------- rich text: `code` and **bold** inside plain strings ---------- */
export function rich(text) {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const isTyping = (el) =>
  el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);

export function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function useMedia(query) {
  const get = () => {
    try { return window.matchMedia(query).matches; } catch { return false; }
  };
  const [m, setM] = useState(get);
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia(query); } catch { return undefined; }
    const f = () => setM(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener(f);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', f) : mq.removeListener(f));
  }, [query]);
  return m;
}
