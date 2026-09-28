/* ===========================================================
   FLASHCARD DECK (Anki-style quick revision)
   Tap/Space = flip · 1 or ← = Again · 2 or → = Got it
   "Again" cards go back into the queue; the session ends when
   every card is marked "Got it".
   =========================================================== */
import { useEffect, useMemo, useState, useCallback } from 'react';
import Icon from './Icon.jsx';
import { rich, isTyping, usePersisted } from '../lib.jsx';

const TINTS = ['blue', 'pink', 'green', 'cream', 'yellow'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards({ cards, topics, storageKey = 'deck' }) {
  const [topic, setTopic] = useState('all');
  const pool = useMemo(() => (topic === 'all' ? cards : cards.filter((c) => c.topic === topic)), [cards, topic]);

  const [queue, setQueue] = useState(() => pool.map((c) => c.id));
  const [flipped, setFlipped] = useState(false);
  const [missed, setMissed] = useState(() => new Set());
  const [gotIt, setGotIt] = useState(0);
  const [best, setBest] = usePersisted(storageKey + ':sessions', 0);

  const byId = useMemo(() => Object.fromEntries(cards.map((c) => [c.id, c])), [cards]);

  const start = useCallback((ids) => {
    setQueue(ids);
    setFlipped(false);
    setMissed(new Set());
    setGotIt(0);
  }, []);

  useEffect(() => { start(pool.map((c) => c.id)); }, [pool, start]);

  const current = queue.length ? byId[queue[0]] : null;
  const total = pool.length;
  const done = total > 0 && queue.length === 0;

  const answer = useCallback(
    (knew) => {
      if (!current) return;
      setFlipped(false);
      if (knew) {
        setQueue((q) => q.slice(1));
        setGotIt((n) => n + 1);
      } else {
        setMissed((m) => new Set(m).add(current.id));
        setQueue((q) => {
          const rest = q.slice(1);
          const at = Math.min(rest.length, 3); // see it again a few cards later
          return [...rest.slice(0, at), q[0], ...rest.slice(at)];
        });
      }
    },
    [current],
  );

  useEffect(() => {
    if (done) setBest((b) => b + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e.target) || document.body.dataset.palette === 'open') return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (!current) return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === '1' || e.key === 'ArrowLeft')) answer(false);
      else if (flipped && (e.key === '2' || e.key === 'ArrowRight')) answer(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answer, flipped, current]);

  const tint = current ? TINTS[cards.indexOf(current) % TINTS.length] : 'blue';
  const topicLabel = (id) => topics.find((t) => t.id === id)?.label || id;
  const pct = total ? Math.round((gotIt / total) * 100) : 0;

  return (
    <div className="deck">
      <div className="deck-topics" role="group" aria-label="Choose topic">
        <button type="button" className="btn small ghost" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
          Everything ({cards.length})
        </button>
        {topics.map((t) => (
          <button key={t.id} type="button" className="btn small ghost" aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>
            {t.label} ({cards.filter((c) => c.topic === t.id).length})
          </button>
        ))}
      </div>

      <div className="fc-progress" aria-label={`${gotIt} of ${total} cards done`}>
        <div className="bar"><span style={{ width: pct + '%' }} /></div>
        <span className="label">
          {gotIt}/{total} got it · {missed.size} to revisit
        </span>
      </div>

      {done ? (
        <div className="card tint-green deck-done">
          <span className="pill">Deck complete</span>
          <h3 className="display h-md">All {total} cards done</h3>
          <p>
            {missed.size === 0
              ? 'You knew every card first time.'
              : `${missed.size} card${missed.size > 1 ? 's' : ''} needed a second look.`}{' '}
            Finished decks in this browser: {best}.
          </p>
          <div className="row">
            {missed.size > 0 && (
              <button type="button" className="btn" onClick={() => start(shuffle([...missed]))}>
                Review the {missed.size} I missed
              </button>
            )}
            <button type="button" className="btn ghost" onClick={() => start(shuffle(pool.map((c) => c.id)))}>
              <Icon name="restart" size={16} /> Start over
            </button>
          </div>
        </div>
      ) : current ? (
        <>
          <button
            type="button"
            className={`fc ${flipped ? 'is-flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Card answer. Press to see the question' : 'Card question. Press to see the answer'}
          >
            <span className="fc-inner">
              <span className={`fc-face fc-front tint-${tint}`}>
                <span className="fc-meta">
                  <span className="pill">{topicLabel(current.topic)}</span>
                  <span className="label">Question</span>
                </span>
                <span className="fc-q">{rich(current.q)}</span>
                <span className="fc-hint label">Tap or press Space to flip</span>
              </span>
              <span className="fc-face fc-back tint-white">
                <span className="fc-meta">
                  <span className={`pill tint-${tint}`}>{topicLabel(current.topic)}</span>
                  <span className="label">Answer</span>
                </span>
                <span className="fc-a">{rich(current.a)}</span>
                {current.more && <span className="fc-more">{rich(current.more)}</span>}
              </span>
            </span>
          </button>

          <div className="deck-actions">
            <button type="button" className="btn ghost" disabled={!flipped} onClick={() => answer(false)}>
              Again <kbd>1</kbd>
            </button>
            <button type="button" className="btn" disabled={!flipped} onClick={() => answer(true)}>
              Got it <kbd>2</kbd>
            </button>
            <button type="button" className="btn ghost icon" title="Shuffle" aria-label="Shuffle the remaining cards"
              onClick={() => { setFlipped(false); setQueue((q) => shuffle(q)); }}>
              <Icon name="shuffle" />
            </button>
            <button type="button" className="btn ghost icon" title="Restart" aria-label="Restart this deck"
              onClick={() => start(pool.map((c) => c.id))}>
              <Icon name="restart" />
            </button>
          </div>
        </>
      ) : (
        <p className="muted">No cards in this topic yet.</p>
      )}
    </div>
  );
}
