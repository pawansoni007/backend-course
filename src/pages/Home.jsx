/* HUB — the course's front door. Lists every phase from the registry. */
import { course } from '../content/course.js';
import { Link } from '../lib.jsx';
import Icon from '../components/Icon.jsx';

const TINTS = ['yellow', 'blue', 'pink', 'green', 'cream'];

export default function Home() {
  const ready = course.phases.filter((p) => p.status === 'ready');
  return (
    <div className="page home">
      <section className="hero card tint-yellow">
        <span className="pill">12 weeks · 9 phases + capstone</span>
        <h1 className="display h-xl hero-title">Backend engineering with Express.js</h1>
        <p className="hero-sub">
          Slides, lesson plans, labs, quizzes and flashcards for learning to build real APIs, from “what is a server?” to a tested, deployed API.
        </p>
        <div className="row">
          <Link className="btn tint-white" to={`/${ready[0].id}`}>Start Phase {ready[0].num} <Icon name="arrow" size={16} /></Link>
          <Link className="btn ghost" to={`/${ready[0].id}/slides`}>Open the slides</Link>
        </div>
        <span className="star hero-star">API</span>
      </section>

      <section className="grid g3 how">
        <div className="card sm">
          <span className="label">Find anything</span>
          <p><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> (or <kbd>/</kbd>) searches every slide, section and glossary term.</p>
        </div>
        <div className="card sm tint-pink">
          <span className="label">Revise fast</span>
          <p>Press <kbd>R</kbd> or tap <strong>Revise</strong> to flip any page into flashcards.</p>
        </div>
        <div className="card sm tint-blue">
          <span className="label">Present</span>
          <p>On the slides, <kbd>←</kbd> <kbd>→</kbd> move and <kbd>F</kbd> goes full screen. Phones get a readable scroll view.</p>
        </div>
      </section>

      <section className="stack" style={{ '--gap': '22px' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 className="display h-lg">The roadmap</h2>
          <span className="pill tint-green">{ready.length} of {course.phases.length} ready</span>
        </div>
        <div className="phase-grid">
          {course.phases.map((p, i) => {
            const isReady = p.status === 'ready';
            const inner = (
              <>
                <div className="pc-top">
                  <span className={`pc-num tint-${isReady ? TINTS[i % TINTS.length] : 'white'}`}>{p.label ? 'C' : p.num}</span>
                  <span className={`pill ${isReady ? 'tint-green' : ''}`}>{isReady ? 'Ready' : 'Coming soon'}</span>
                </div>
                <h3 className="h-sm">{p.title}</h3>
                <p>{p.summary}</p>
                <span className="label muted">{p.week}</span>
              </>
            );
            return isReady ? (
              <Link key={p.id} to={`/${p.id}`} className="card phase-card is-ready">{inner}</Link>
            ) : (
              <div key={p.id} className="card flat phase-card is-soon">{inner}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
