/* ===========================================================
   UI building blocks (BlockFrame grammar)
   =========================================================== */
import { useState } from 'react';
import { usePersisted, rich } from '../lib.jsx';

export function Pill({ tint = 'white', children, className = '', ...rest }) {
  return (
    <span className={`pill tint-${tint} ${className}`} {...rest}>
      {children}
    </span>
  );
}

/* Section header: label-pill eyebrow + uppercase headline (+ optional lead) */
export function SectionHead({ id, eyebrow, tint = 'yellow', title, lead, level = 2 }) {
  const H = `h${level}`;
  return (
    <header className="section-head" id={id}>
      {eyebrow && <Pill tint={tint}>{eyebrow}</Pill>}
      <H className={`display ${level === 1 ? 'h-xl' : 'h-lg'}`}>{title}</H>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}

export function Callout({ label = 'Note', tint = 'blue', children }) {
  return (
    <div className={`callout tint-${tint}`}>
      <span className="label">{label}</span>
      <div>{children}</div>
    </div>
  );
}

/* ---------- code block with a tiny highlighter ---------- */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function highlight(code, lang) {
  let h = esc(code);
  if (lang === 'json') {
    h = h
      .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="tok-h">$1</span>$2')
      .replace(/(:\s*|\[\s*|,\s*)("(?:[^"\\]|\\.)*")/g, '$1<span class="tok-s">$2</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="tok-k">$1</span>')
      .replace(/(:\s*|\[\s*|,\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="tok-n">$2</span>');
  } else if (lang === 'http') {
    h = h
      .split('\n')
      .map((line, i) => {
        if (i === 0) {
          return line
            .replace(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/, '<span class="tok-k">$1</span>')
            .replace(/^(HTTP\/[\d.]+)\s+(\d{3})/, '$1 <span class="tok-n">$2</span>');
        }
        if (/^[A-Za-z-]+:/.test(line)) return line.replace(/^([A-Za-z-]+:)/, '<span class="tok-h">$1</span>');
        return line.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="tok-s">$1</span>');
      })
      .join('\n');
  } else if (lang === 'bash') {
    h = h
      .split('\n')
      .map((line) =>
        line.trim().startsWith('#')
          ? `<span class="tok-c">${line}</span>`
          : line
              .replace(/('[^']*')/g, '<span class="tok-s">$1</span>')
              .replace(/^(\s*)(curl|nslookup|dig|ping|node|npm)\b/, '$1<span class="tok-k">$2</span>')
              .replace(/(\s)(-{1,2}[A-Za-z-]+)/g, '$1<span class="tok-h">$2</span>'),
      )
      .join('\n');
  } else if (lang === 'js') {
    h = h
      .replace(/(\/\/.*)$/gm, '<span class="tok-c">$1</span>')
      .replace(/('(?:[^'\\]|\\.)*'|`[^`]*`)/g, '<span class="tok-s">$1</span>')
      .replace(/\b(const|let|await|async|return|import|from|function|new|if|else)\b/g, '<span class="tok-k">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="tok-n">$1</span>');
  }
  return h;
}

export function CodeBlock({ code, lang = 'text', title, copy = true }) {
  const [copied, setCopied] = useState(false);
  const text = code.replace(/^\n/, '').replace(/\s+$/, '');
  const doCopy = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    };
    try {
      navigator.clipboard.writeText(text).then(done, () => {});
    } catch {
      /* clipboard blocked: user can still select the text */
    }
  };
  return (
    <div className="codeblock">
      <div className="code-head">
        <span>{title || lang}</span>
        {copy && (
          <button type="button" className="copy" onClick={doCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <pre>
        <code
          style={{ background: 'none', border: 0, padding: 0, whiteSpace: 'pre', fontSize: 'inherit' }}
          dangerouslySetInnerHTML={{ __html: highlight(text, lang) }}
        />
      </pre>
    </div>
  );
}

export function Table({ head, rows, caption }) {
  return (
    <div className="table-wrap">
      <table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{rich(c)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Checkbox + text inputs that remember their state in this browser only */
export function Check({ id, children }) {
  const [on, setOn] = usePersisted('chk:' + id, false);
  return (
    <label className="check" htmlFor={'chk-' + id}>
      <input id={'chk-' + id} type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}
export function Field({ id, label, multiline = false, placeholder = '' }) {
  const [val, setVal] = usePersisted('fld:' + id, '');
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label className="stack" style={{ '--gap': '6px' }} htmlFor={'fld-' + id}>
      {label && <span className="label">{label}</span>}
      <Tag id={'fld-' + id} className="field" value={val} placeholder={placeholder} onChange={(e) => setVal(e.target.value)} />
    </label>
  );
}
