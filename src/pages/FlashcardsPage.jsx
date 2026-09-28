import Flashcards from '../components/Flashcards.jsx';

export default function FlashcardsPage({ phase }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <span className="pill tint-pink">Phase {phase.num} · Flashcards</span>
          <h1 className="display h-xl">Flashcards</h1>
          <p className="lead">
            {phase.flashcards.length} cards covering the whole phase. Flip each one (tap, or <kbd>Space</kbd>), then mark it <strong>Again</strong> (<kbd>1</kbd>) or <strong>Got it</strong> (<kbd>2</kbd>).
            Missed cards come back a few cards later. Press <kbd>R</kbd> on any page to open these too.
          </p>
        </div>
      </div>
      <Flashcards cards={phase.flashcards} topics={phase.topics} storageKey={'fc:' + phase.id} />
    </div>
  );
}
