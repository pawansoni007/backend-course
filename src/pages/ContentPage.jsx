/* Generic long-form page (lesson plan, cheat sheet, lab) with a table of contents. */
import { Link } from '../lib.jsx';

export default function ContentPage({ phase, page }) {
  const Body = page.component;
  return (
    <div className="page">
      <div className="page-head">
        <div className="stack" style={{ '--gap': '14px' }}>
          <div className="row">
            <span className={`pill tint-${page.tint}`}>Phase {phase.num} · {page.title}</span>
            {page.teacher && <span className="pill tint-cream">Teacher</span>}
          </div>
          <h1 className="display h-xl">{page.title}</h1>
          <p className="lead">{page.blurb}</p>
        </div>
      </div>
      <div className="with-toc">
        <aside className="toc" aria-label="On this page">
          <details open>
            <summary className="label">On this page</summary>
            <nav>
              {page.sections.map((s) => (
                <Link key={s.id} to={`/${phase.id}/${page.slug}?s=${s.id}`}>{s.title}</Link>
              ))}
            </nav>
          </details>
        </aside>
        <div className="content">
          <Body />
        </div>
      </div>
    </div>
  );
}
