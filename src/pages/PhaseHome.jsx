/* PHASE OVERVIEW — goal, suggested order, all materials, checkpoint. */
import { Link } from '../lib.jsx';
import { Callout } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';

export default function PhaseHome({ phase }) {
  const flow = phase.flow || [
    ['slides', 'Teach with the slides', 'Keep the lesson plan open on your side.'],
    ['journey', 'Walk the request journey', 'Let him click through all three endings.'],
    ['lab', 'Do the lab missions', 'DevTools, Postman, curl, nslookup, drawing.'],
    ['quiz', 'Take the quiz', 'Aim for 10 out of 12 or more.'],
    ['flashcards', 'Revise with flashcards', 'A daily round until the next session.'],
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <span className="pill tint-yellow">Phase {phase.num} · {phase.week}</span>
          <h1 className="display h-xl">{phase.title}</h1>
          <p className="lead">{phase.summary}</p>
        </div>
      </div>

      <Callout label="Goal" tint="green">{phase.goal}</Callout>

      <section className="stack" style={{ '--gap': '18px' }}>
        <h2 className="display h-md">Suggested order</h2>
        <ol className="flow-order" style={{ '--n': flow.length > 5 ? 3 : flow.length }}>
          {flow.map(([slug, t, d], i) => (
            <li key={slug}>
              <Link to={`/${phase.id}/${slug}`} className="card sm fo-item">
                <span className="fo-n">{i + 1}</span>
                <span className="stack" style={{ '--gap': '4px' }}>
                  <strong>{t}</strong>
                  <span className="muted">{d}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="stack" style={{ '--gap': '18px' }}>
        <h2 className="display h-md">Everything in this phase</h2>
        <div className="grid g4 materials">
          {phase.pages.map((p) => (
            <Link key={p.slug} to={`/${phase.id}/${p.slug}`} className="card material">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className={`icon-sq tint-${p.tint}`}>{p.icon}</span>
                {p.teacher && <span className="pill tint-cream">Teacher</span>}
              </div>
              <h3 className="h-sm">{p.title}</h3>
              <p>{p.blurb}</p>
              <span className="material-go label">Open <Icon name="arrow" size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="card tint-blue checkpoint">
        <span className="pill">Checkpoint</span>
        <h2 className="display h-md">Before moving to Phase {phase.num + 1}, he should answer these in his own words</h2>
        <ol className="numlist">
          {phase.checkpoint.map((q) => <li key={q}><div>{q}</div></li>)}
        </ol>
      </section>
    </div>
  );
}
