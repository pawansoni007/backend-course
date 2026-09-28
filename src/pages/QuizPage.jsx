/* ===========================================================
   QUIZ — multiple choice marked instantly, plus short answers
   with a model answer to compare against. Answer key is a
   separate page for the teacher.
   =========================================================== */
import { useState } from 'react';
import { rich, Link } from '../lib.jsx';
import { Field } from '../components/ui.jsx';

export default function QuizPage({ phase }) {
  const { mcq, short } = phase.quiz;
  const [picks, setPicks] = useState({});
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState({});
  const score = mcq.reduce((s, q, i) => s + (picks[i] === q.answer ? 1 : 0), 0);
  const answered = Object.keys(picks).length;

  return (
    <div className="page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <span className="pill tint-blue">Phase {phase.num} · Quiz</span>
          <h1 className="display h-xl">Checkpoint quiz</h1>
          <p className="lead">{mcq.length} multiple-choice questions, marked when you press Check, then {short.length} short answers to write in your own words.</p>
        </div>
      </div>

      <section className="stack" style={{ '--gap': '22px' }}>
        {mcq.map((q, i) => {
          const pick = picks[i];
          return (
            <fieldset className="card quiz-q" key={i}>
              <legend className="sr-only">Question {i + 1}</legend>
              <div className="qq-head">
                <span className="qq-n">{i + 1}</span>
                <p className="qq-text">{rich(q.q)}</p>
              </div>
              <div className="qq-options">
                {q.options.map((o, k) => {
                  const state = checked ? (k === q.answer ? 'right' : k === pick ? 'wrong' : '') : pick === k ? 'picked' : '';
                  return (
                    <label key={k} className={`qq-opt ${state}`} htmlFor={`q${i}-${k}`}>
                      <input id={`q${i}-${k}`} type="radio" name={`q${i}`} checked={pick === k} disabled={checked}
                        onChange={() => setPicks((p) => ({ ...p, [i]: k }))} />
                      <span className="qq-letter">{String.fromCharCode(65 + k)}</span>
                      <span>{rich(o)}</span>
                    </label>
                  );
                })}
              </div>
              {checked && (
                <p className={`qq-why tint-${pick === q.answer ? 'green' : 'pink'}`}>
                  <strong>{pick === q.answer ? 'Correct.' : pick == null ? 'Not answered.' : 'Not quite.'}</strong> {rich(q.why)}
                </p>
              )}
            </fieldset>
          );
        })}
      </section>

      <div className="quiz-bar card sm">
        {checked ? (
          <>
            <span className="quiz-score"><strong>{score}</strong> / {mcq.length}</span>
            <span>{score >= 10 ? 'Ready for Phase 1.' : score >= 7 ? 'Nearly there. Revise the ones you missed.' : 'Go back through the slides and flashcards, then try again.'}</span>
            <button type="button" className="btn ghost" onClick={() => { setPicks({}); setChecked(false); window.scrollTo(0, 0); }}>Try again</button>
          </>
        ) : (
          <>
            <span>{answered} of {mcq.length} answered</span>
            <button type="button" className="btn" onClick={() => setChecked(true)} disabled={answered === 0}>Check my answers</button>
          </>
        )}
      </div>

      <section className="stack" style={{ '--gap': '22px' }}>
        <h2 className="display h-lg">Short answers</h2>
        <p className="lead">Write your answer first, then compare it with the model answer.</p>
        {short.map((s, i) => (
          <div className="card quiz-q" key={i}>
            <div className="qq-head">
              <span className="qq-n">{mcq.length + i + 1}</span>
              <p className="qq-text">{rich(s.q)}</p>
            </div>
            <Field id={`${phase.id}-short-${i}`} multiline placeholder="Your answer…" />
            {shown[i] ? (
              <p className="qq-why tint-blue"><strong>Model answer:</strong> {s.model}</p>
            ) : (
              <button type="button" className="btn ghost small" onClick={() => setShown((x) => ({ ...x, [i]: true }))}>Show model answer</button>
            )}
          </div>
        ))}
      </section>

      <p className="muted">Teacher? The <Link to={`/${phase.id}/answer-key`}>answer key</Link> has every answer on one page.</p>
    </div>
  );
}

export function AnswerKeyPage({ phase }) {
  const { mcq, short } = phase.quiz;
  return (
    <div className="page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <div className="row">
            <span className="pill tint-white">Phase {phase.num} · Answer key</span>
            <span className="pill tint-cream">Teacher</span>
          </div>
          <h1 className="display h-xl">Answer key</h1>
          <p className="lead">Every quiz answer with the reason. Keep this one for yourself; share the <Link to={`/${phase.id}/quiz`}>quiz</Link> with the student.</p>
        </div>
      </div>
      <div className="grid g2 key-grid">
        {mcq.map((q, i) => (
          <div className="card sm key-item" key={i}>
            <div className="qq-head">
              <span className="qq-n">{i + 1}</span>
              <p className="qq-text">{rich(q.q)}</p>
            </div>
            <p className="key-answer"><strong>{String.fromCharCode(65 + q.answer)}.</strong> {rich(q.options[q.answer])}</p>
            <p className="muted">{rich(q.why)}</p>
          </div>
        ))}
      </div>
      <section className="stack" style={{ '--gap': '16px' }}>
        <h2 className="display h-md">Short answers: what to look for</h2>
        {short.map((s, i) => (
          <div className="card sm" key={i}>
            <p><strong>{mcq.length + i + 1}. {rich(s.q)}</strong></p>
            <p>{s.model}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
