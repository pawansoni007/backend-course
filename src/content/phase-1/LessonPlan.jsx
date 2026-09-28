/* ===========================================================
   LESSON PLAN — the teacher's script for Phase 1 (no timings).
   Five parts, each ending at a natural pause point. Rhythm:
   watch the animation → run the demo → break it → ask.
   =========================================================== */
import { SectionHead, Callout, Check } from '../../components/ui.jsx';
import { Link } from '../../lib.jsx';

export const lessonSections = [
  { id: 'lp1-how', title: 'How to use this plan', keywords: 'teacher guide rhythm' },
  { id: 'lp1-before', title: 'Before the session', keywords: 'setup node git vscode' },
  { id: 'lp1-a', title: 'Part A · JavaScript for the backend', keywords: 'const let functions call stack objects arrays modules errors' },
  { id: 'lp1-b', title: 'Part B · Async JavaScript', keywords: 'event loop promises async await promise.all fetch' },
  { id: 'lp1-c', title: 'Part C · Node.js & npm', keywords: 'node npm package.json env' },
  { id: 'lp1-d', title: 'Part D · Git & GitHub', keywords: 'git commit push gitignore' },
  { id: 'lp1-e', title: 'Part E · A server with no framework', keywords: 'node:http routing body blocking' },
  { id: 'lp1-wrap', title: 'Wrap-up & homework', keywords: 'homework checkpoint quiz' },
  { id: 'lp1-mixups', title: 'Common mix-ups to watch for', keywords: 'misconceptions mistakes' },
];

const S = ({ from, to }) => (
  <Link className="pill tint-blue slide-link" to={`/phase-1/slides?s=${from}`}>Slides {from}–{to}</Link>
);
const A = ({ id, children }) => <Link className="pill tint-pink slide-link" to={`/phase-1/explainers?x=${id}`}>▶ {children}</Link>;
const D = ({ n }) => <Link className="pill tint-cream slide-link" to={`/phase-1/demos?s=dm-${n}`}>Demo {n}</Link>;

function Ask({ q, a }) {
  return (
    <details className="ask">
      <summary><span className="label">Ask</span><span>{q}</span></summary>
      <div className="ask-a"><span className="label">Listen for</span> {a}</div>
    </details>
  );
}

function Part({ id, letter, title, tint, links, goal, say, asks, watch, activity, pause }) {
  return (
    <section className="lp-part" id={id}>
      <div className="lp-part-head">
        <span className={`icon-sq tint-${tint}`}>{letter}</span>
        <div className="stack" style={{ '--gap': '8px' }}>
          <h2 className="display h-md">{title}</h2>
          <div className="row" style={{ '--gap': '8px' }}>{links}</div>
        </div>
      </div>
      <p className="lp-goal"><strong>By the end, he can:</strong> {goal}</p>
      <div className="lp-block">
        <h3 className="h-sm">Say it like this</h3>
        <ol className="numlist">{say.map((s, i) => <li key={i}><div>{s}</div></li>)}</ol>
      </div>
      <div className="lp-block">
        <h3 className="h-sm">Ask him (tap to see what to listen for)</h3>
        <div className="stack" style={{ '--gap': '10px' }}>{asks.map((a, i) => <Ask key={i} {...a} />)}</div>
      </div>
      <div className="grid g2">
        <Callout label="Watch for" tint="pink">{watch}</Callout>
        <Callout label="He does it" tint="green">{activity}</Callout>
      </div>
      <div className="pause-point">
        <span className="pill tint-yellow">Good place to pause</span>
        <span>{pause}</span>
      </div>
    </section>
  );
}

export default function LessonPlan() {
  return (
    <div className="stack" style={{ '--gap': '56px' }}>
      <section className="stack" id="lp1-how">
        <SectionHead eyebrow="Teacher’s copy" tint="yellow" title="How to use this plan" level={2} />
        <div className="prose">
          <p>
            Phase 1 is where he starts typing. Every idea has an <Link to="/phase-1/explainers">animation</Link> that replaces the whiteboard, and a <Link to="/phase-1/demos">live demo</Link> that
            proves it on a real machine. Five parts, each ending at a natural pause point, so this can run over two or three sessions.
          </p>
          <p>For every idea, the same four beats:</p>
        </div>
        <ol className="numlist rhythm">
          <li><div><strong>Watch</strong>: play the animated slide one step at a time with <kbd>→</kbd>. Before each step, ask “what happens next?”</div></li>
          <li><div><strong>Run</strong>: do the live demo on your laptop. He predicts the output out loud <em>before</em> you press Enter.</div></li>
          <li><div><strong>Break</strong>: do the “break it on purpose” step. Reading real error messages is half of backend work.</div></li>
          <li><div><strong>Ask</strong>: the questions below. Let him answer fully before correcting anything.</div></li>
        </ol>
        <p className="muted">Pink <span className="pill tint-pink">▶</span> links open an animation full-screen-ready; cream <span className="pill tint-cream">Demo</span> links jump to the exact demo.</p>
      </section>

      <section className="stack" id="lp1-before">
        <SectionHead eyebrow="Setup" tint="blue" title="Before the session" level={2} />
        <div className="card checklist">
          <Check id="lp1-node">On <strong>both</strong> laptops: <code>node -v</code> shows v22 or newer. If not, install the LTS from nodejs.org.</Check>
          <Check id="lp1-vscode">VS Code installed, and <code>code .</code> works from the terminal (VS Code → Command Palette → “Shell Command: Install ‘code’ command”).</Check>
          <Check id="lp1-git"><code>git --version</code> works, and he has a GitHub account. Optional: GitHub CLI (<code>gh</code>) for a one-line push.</Check>
          <Check id="lp1-win">Windows? Install Git for Windows and use <strong>Git Bash</strong>, so every command on this site works as written.</Check>
          <Check id="lp1-folder">An empty folder <code>campus-events-raw</code> ready on your laptop for the demos.</Check>
          <Check id="lp1-screen">Your screen split: VS Code left, terminal right, slides on the projector or a second screen.</Check>
        </div>
      </section>

      <Part
        id="lp1-a"
        letter="A"
        tint="yellow"
        title="JavaScript for the backend"
        links={<><S from={1} to={14} /><A id="call-stack">Call stack</A><A id="references">References</A><A id="map-filter">filter & map</A><D n={1} /><D n={2} /><D n={3} /><D n={4} /><D n={5} /></>}
        goal="choose const or let, write arrow functions, explain the call stack, use destructuring, spread and array methods, split code into modules, and read a stack trace."
        say={[
          <>Open with the cover slide: by the end of Phase 1 his own laptop will be the server from Phase 0. Then <Link to="/phase-1/demos?s=dm-1">demo 1</Link> in the REPL: typing JS and getting answers instantly makes it feel real.</>,
          <><strong>const by default, let when it changes.</strong> Show that a <code>const</code> object can still have its properties changed: the <em>name</em> is locked, not the object.</>,
          <>Always <code>===</code>. Show <code>'1' == 1</code> once so he knows why, then never use <code>==</code> again.</>,
          <>Functions are values. Write the same function as a declaration and as an arrow, then pass one into <code>setTimeout</code>. “That’s a callback. Every Express route you’ll ever write is one.”</>,
          <>Play the <strong>call stack</strong> animation. The key sentence: “every call gets its own box; return throws the box away.” This is the stack the event loop checks in Part B, so it’s worth the time.</>,
          <>Objects: <code>?.</code>, <code>??</code> and template literals in the context of <code>req.query.page ?? 1</code>. Then destructuring (<code>const {'{ id }'} = req.params</code>) and spread.</>,
          <>Play <strong>values vs references</strong> (the lockers), then do <Link to="/phase-1/demos?s=dm-3">demo 3</Link>. The bug in the demo is a real bug that ships in real APIs.</>,
          <>Array methods: filter, map, find, reduce, some. Play <strong>filter & map</strong>, then <Link to="/phase-1/demos?s=dm-2">demo 2</Link>.</>,
          <>Modules (<Link to="/phase-1/demos?s=dm-4">demo 4</Link>) and errors (<Link to="/phase-1/demos?s=dm-5">demo 5</Link>). Read the stack trace together, top to bottom: message, file:line, who called it.</>,
        ]}
        asks={[
          { q: 'const event = { seats: 60 }; event.seats = 59; Error or not?', a: 'Not an error. const stops the name being reassigned; the object itself can still change.' },
          { q: 'What’s the difference between these two functions: (a) => a * 2 and (a) => { a * 2 }?', a: 'The first returns a*2. The second has braces with no return, so it returns undefined.' },
          { q: 'Why did gala.price change in demo 3 when we only touched sale?', a: 'Both names point to the same object in memory. Spread makes a new object.' },
          { q: 'filter vs find: what does each return when nothing matches?', a: 'filter returns an empty array []; find returns undefined.' },
          { q: 'An uncaught error in a server. What happens to the other users?', a: 'The Node process exits, so the server is down for everyone until restarted.' },
        ]}
        watch={<>Confusing <strong>reassigning</strong> with <strong>mutating</strong>. And writing <code>{'{ }'}</code> around an arrow body, then wondering why it returns <code>undefined</code>.</>}
        activity={<>Lab mission 1: eight predict-then-run snippets in the REPL. He writes each guess first.</>}
        pause="He can explain the call stack animation back to you, and fix the reference bug without looking."
      />

      <Part
        id="lp1-b"
        letter="B"
        tint="blue"
        title="Async JavaScript"
        links={<><S from={15} to={25} /><A id="waiter">Waiter</A><A id="event-loop">Event loop</A><A id="microtasks">Microtasks</A><A id="async-await">async/await</A><A id="parallel">Promise.all</A><D n={6} /><D n={7} /><D n={8} /></>}
        goal="explain why servers need async, predict the order of sync code, promises and timers, write async/await with try/catch, and choose between sequential awaits and Promise.all."
        say={[
          <>Start with the latency slide: if a CPU step were one second, an API call would be three years. <strong>Servers mostly wait.</strong></>,
          <>Play the <strong>waiter</strong> animation. It continues the Phase 0 restaurant: one waiter = one thread. Blocking waiter: 30 minutes. Non-blocking: about 11. Let him say what changed.</>,
          <>Callbacks: “call me when it’s done”. Show the pyramid and say it’s why promises exist. Don’t spend long here.</>,
          <>Play the <strong>event loop</strong> animation step by step. Before step 9, ask: “The stack is empty and the timer fired. Now what?” The rule to land: <em>callbacks only run when the stack is empty</em>.</>,
          <>Promises as a Swiggy order: pending → delivered or cancelled. Then the <strong>microtasks</strong> puzzle: he must predict A D C B before you step through. Then <Link to="/phase-1/demos?s=dm-6">demo 6</Link>, including the blocked timer.</>,
          <>async/await is the same promises, read top to bottom. Play <strong>await pauses one function</strong>: the function steps off the stack, the rest of the program keeps going. That’s the whole reason one Node server can handle thousands of users.</>,
          <>Errors: try/catch around await, and the fetch trap (404 doesn’t throw). Do <Link to="/phase-1/demos?s=dm-7">demo 7</Link> with the “break it” steps.</>,
          <>Play <strong>Promise.all</strong>, then prove it with a stopwatch in <Link to="/phase-1/demos?s=dm-8">demo 8</Link>: 3 seconds vs 1.</>,
        ]}
        asks={[
          { q: 'setTimeout(fn, 0): does fn run immediately?', a: 'No. It waits in the task queue until the call stack is empty, so all the code after it runs first.' },
          { q: 'Why do promise callbacks run before a setTimeout(…, 0) callback?', a: 'Promise callbacks go in the microtask queue, which the event loop empties completely before taking the next task.' },
          { q: 'While a function is paused at await, can the server handle another request?', a: 'Yes. await only pauses that function; the thread is free to run other code.' },
          { q: 'fetch to a URL that returns 404. Does it throw?', a: 'No. The promise fulfils with a response whose status is 404. Check res.ok.' },
          { q: 'Get the user, then that user’s tickets. Promise.all or one by one?', a: 'One by one: the tickets call needs the user’s id first.' },
        ]}
        watch={<>Thinking <code>await</code> blocks the whole program. The <strong>await pauses one function</strong> animation is the fix: watch the function go to the “paused” panel while the script keeps printing.</>}
        activity={<>Lab mission 2: three async-order puzzles, then a script that fetches real users and prints names with <code>map</code>.</>}
        pause="He predicts the output of a new mix of console.log, setTimeout and Promise.then correctly, and explains why."
      />

      <Part
        id="lp1-c"
        letter="C"
        tint="pink"
        title="Node.js & npm"
        links={<><S from={26} to={33} /><A id="npm-install">npm install</A><D n={9} /><D n={10} /><D n={11} /></>}
        goal="explain what Node is, run files with node and --watch, install a package, read package.json, explain the lock file, and load settings from .env."
        say={[
          <>Node is a <strong>runtime</strong>: V8 runs the JavaScript, libuv does the waiting (the “kitchen” from the waiter animation). Same language as the browser, different toolbox.</>,
          <>Three ways to run: REPL, <code>node file.js</code>, <code>node --watch file.js</code>. Show <code>process.argv</code> with the greet example.</>,
          <>Built-ins with the <code>node:</code> prefix. Do <Link to="/phase-1/demos?s=dm-11">demo 11</Link>: save to a JSON file, read it back, then delete the file and read the ENOENT error.</>,
          <>npm: play the <strong>npm install</strong> animation, then <Link to="/phase-1/demos?s=dm-9">demo 9</Link> on your machine. The best moment is deleting <code>node_modules</code> and getting it all back with one command.</>,
          <>Versions: MAJOR.MINOR.PATCH, what <code>^</code> allows, and why the lock file is committed but <code>node_modules</code> never is.</>,
          <>Scripts and <code>.env</code> in <Link to="/phase-1/demos?s=dm-10">demo 10</Link>. Stress: every env value is a string, and <code>.env</code> never goes into Git.</>,
        ]}
        asks={[
          { q: 'Is Node a programming language?', a: 'No. It’s a runtime that runs JavaScript outside the browser (V8 + libuv + built-in modules).' },
          { q: 'Your teammate clones the repo. There’s no node_modules. What do they run?', a: 'npm install (or npm ci), which rebuilds it from package.json and package-lock.json.' },
          { q: 'What does ^1.11.23 allow npm to install?', a: 'Any version from 1.11.23 up to, but not including, 2.0.0.' },
          { q: 'Why not put the database password directly in server.js?', a: 'It would be committed to Git and visible to anyone with the code; it also can’t differ between laptop and production.' },
        ]}
        watch={<>Running <code>npm install</code> in the wrong folder (creates a stray <code>package.json</code> elsewhere). Make <code>pwd</code> a habit.</>}
        activity={<>Lab missions 3 and 4: an npm project with dayjs and scripts, then the same project reading its settings from <code>.env</code>.</>}
        pause="He can set up a new Node project from an empty folder without notes: init, type module, install, script, .env."
      />

      <Part
        id="lp1-d"
        letter="D"
        tint="green"
        title="Git & GitHub"
        links={<><S from={34} to={38} /><A id="git-areas">Git areas</A><D n={12} /></>}
        goal="explain working folder vs staging vs commit vs GitHub, commit regularly with good messages, ignore node_modules and .env, and push to GitHub."
        say={[
          <>Save points in a game: that’s a commit. Git is the tool on the laptop; GitHub is the website.</>,
          <>Play the <strong>Git areas</strong> animation. Point at the end state: the secrets never left the laptop.</>,
          <>The loop he’ll repeat forever: <code>git status</code> → <code>git add</code> → <code>git commit -m</code>. Small commits, messages that say what the commit does.</>,
          <><Link to="/phase-1/demos?s=dm-12">Demo 12</Link> from <code>git init</code> to a live GitHub repo. Use <code>git check-ignore -v .env</code> as proof that <code>.env</code> is safe.</>,
          <>Tell the leaked-key story: bots scan public GitHub constantly. If a secret is ever pushed, revoke it; deleting the file later doesn’t remove it from history.</>,
        ]}
        asks={[
          { q: 'You changed server.js. You run git commit -m "fix". What gets saved?', a: 'Nothing new, unless server.js was staged with git add first. Commit only saves what’s staged.' },
          { q: 'Where does a commit live after git commit but before git push?', a: 'Only in the local repository on your laptop.' },
          { q: 'You pushed your .env with an API key. What now?', a: 'Revoke the key and create a new one. It’s in the history even if you delete the file.' },
        ]}
        watch={<>Committing before creating <code>.gitignore</code>. If <code>node_modules</code> got committed, remove it with <code>git rm -r --cached node_modules</code>, add the ignore rule, and commit.</>}
        activity={<>Lab mission 5: three commits and a push, then confirm on github.com that <code>.env</code> isn’t there.</>}
        pause="He runs the whole add → commit → push cycle alone and explains each step with the animation’s four boxes."
      />

      <Part
        id="lp1-e"
        letter="E"
        tint="cream"
        title="A server with no framework"
        links={<><S from={39} to={48} /><A id="body-stream">POST body</A><A id="one-thread">Never block</A><D n={13} /><D n={14} /><D n={15} /></>}
        goal="build a node:http server with routing, JSON responses, 404s and a POST body, test it with curl, explain why blocking code is dangerous, and list what Express will do for him."
        say={[
          <>The six-line server. Run it in <Link to="/phase-1/demos?s=dm-13">demo 13</Link> and open it three ways: browser, DevTools (just like Phase 0) and <code>curl -i</code>. Point out the second <code>/favicon.ico</code> request.</>,
          <><code>req</code> is the Phase 0 request as an object; <code>res</code> is the response you build. Write the <code>send()</code> helper together.</>,
          <>Routing is just if-statements on method + path. Build <Link to="/phase-1/demos?s=dm-14">demo 14</Link> route by route, testing each with curl before writing the next.</>,
          <>Play <strong>Reading a POST body</strong>, then add POST to the demo. Send broken JSON and get the 400.</>,
          <>Play <strong>Never block the thread</strong>, then prove it with two terminals in <Link to="/phase-1/demos?s=dm-15">demo 15</Link>. This is the event loop from Part B, felt for real.</>,
          <>Finish with “why this hurts”: routing, params, bodies, replies, shared steps. Every one of those is a feature of Express, which is Phase 2.</>,
        ]}
        asks={[
          { q: 'What happens if a handler never calls res.end()?', a: 'The response never finishes; the client waits until it times out.' },
          { q: 'GET /events/abc. Which of your routes matches, and what comes back?', a: 'None: the regex only matches digits, so it falls through to the final 404 “No route for GET /events/abc”.' },
          { q: 'Why is a 5-second while loop worse than a 5-second await?', a: 'The loop keeps the one thread busy, so every other request waits. await frees the thread while it waits.' },
          { q: 'Restart the server. Where did the event you POSTed go?', a: 'Gone. It only lived in memory (the array). A database fixes that in Phase 4.' },
        ]}
        watch={<>Sending two responses (calling <code>send</code> twice), which throws <code>ERR_HTTP_HEADERS_SENT</code>. The fix is <code>return send(…)</code>.</>}
        activity={<>Lab mission 6: his own raw server with four routes, tested with curl. Bonus: POST and the blocking experiment.</>}
        pause="His own server passes all five curl tests from mission 6, and he can explain each status code."
      />

      <section className="stack" id="lp1-wrap">
        <SectionHead eyebrow="Close" tint="cream" title="Wrap-up & homework" level={2} />
        <div className="grid g2">
          <div className="card">
            <h3 className="h-sm">In the session</h3>
            <ul>
              <li>The <Link to="/phase-1/slides?s=47">checkpoint slide</Link>: he answers out loud.</li>
              <li>Pick one animation and have <strong>him</strong> narrate it while you press <kbd>→</kbd>.</li>
              <li>One round of <Link to="/phase-1/flashcards">flashcards</Link> (<kbd>R</kbd> on any page).</li>
              <li>Preview Phase 2 with the “why this hurts” slide.</li>
            </ul>
          </div>
          <div className="card tint-yellow">
            <h3 className="h-sm">Homework</h3>
            <ul>
              <li>Finish lab missions not done in class, including the push to GitHub.</li>
              <li>Take the <Link to="/phase-1/quiz">quiz</Link>: aim for 10 of 12 or more.</li>
              <li>Watch two animations again on his own and explain them to someone.</li>
              <li>One flashcard round a day until the next session.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="stack" id="lp1-mixups">
        <SectionHead eyebrow="Watch list" tint="green" title="Common mix-ups to watch for" level={2} />
        <div className="table-wrap">
          <table>
            <thead><tr><th>He says…</th><th>Gently correct to…</th></tr></thead>
            <tbody>
              <tr><td>“const means it can’t change.”</td><td>The <strong>name</strong> can’t be pointed elsewhere. An object behind it can still change.</td></tr>
              <tr><td>“setTimeout(fn, 1000) runs after exactly 1 second.”</td><td><strong>At least</strong> 1 second, and only once the call stack is empty.</td></tr>
              <tr><td>“await blocks the program.”</td><td>It pauses <strong>that function</strong>. Everything else keeps running.</td></tr>
              <tr><td>“Node is a framework / a language.”</td><td>A <strong>runtime</strong>. Express is the framework; JavaScript is the language.</td></tr>
              <tr><td>“fetch throws on a 404.”</td><td>It only rejects when there’s no response at all. Check <code>res.ok</code>.</td></tr>
              <tr><td>“Git and GitHub are the same.”</td><td>Git is the tool on your laptop; GitHub hosts copies online.</td></tr>
              <tr><td>“I deleted .env in a new commit, so it’s safe.”</td><td>It’s still in the history. <strong>Revoke the key.</strong></td></tr>
              <tr><td>“process.env.PORT is a number.”</td><td>Every env value is a <strong>string</strong>. Convert with <code>Number()</code>.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
