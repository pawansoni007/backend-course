/* ===========================================================
   LAB WORKSHEET — six missions plus a bonus. The student does
   these himself after seeing the live demos.
   Answers and ticks are remembered in this browser only.
   =========================================================== */
import { SectionHead, CodeBlock, Callout, Check, Field } from '../../components/ui.jsx';
import { Link } from '../../lib.jsx';

export const labSections = [
  { id: 'l1-setup', title: 'Setup', keywords: 'install node vscode git github' },
  { id: 'l1-1', title: 'Mission 1 · JS warm-up', keywords: 'repl predict typeof sort nullish' },
  { id: 'l1-2', title: 'Mission 2 · Async order', keywords: 'event loop predict fetch users' },
  { id: 'l1-3', title: 'Mission 3 · An npm project', keywords: 'npm init install dayjs scripts watch' },
  { id: 'l1-4', title: 'Mission 4 · Config with .env', keywords: 'env-file process.env example' },
  { id: 'l1-5', title: 'Mission 5 · Git & GitHub', keywords: 'commit push gitignore' },
  { id: 'l1-6', title: 'Mission 6 · Your own raw server', keywords: 'node:http routes curl 404' },
  { id: 'l1-bonus', title: 'Bonus · POST and a blocked server', keywords: 'post body blocking' },
  { id: 'l1-reflect', title: 'Reflection', keywords: 'notes' },
];

function Reveal({ label = 'Show the answer', children }) {
  return (
    <details className="ask">
      <summary><span className="label">Check yourself</span><span>{label}</span></summary>
      <div className="ask-a">{children}</div>
    </details>
  );
}

function Mission({ id, n, tint, title, goal, children }) {
  return (
    <section className="mission-sec" id={id}>
      <div className="lp-part-head">
        <span className={`icon-sq tint-${tint}`}>{n}</span>
        <div className="stack" style={{ '--gap': '6px' }}>
          <h2 className="display h-md">{title}</h2>
          <p className="muted">{goal}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Predict({ id, code, answer, why }) {
  return (
    <div className="card sm pm-step">
      <CodeBlock lang="js" title="Predict, then run it" code={code} copy={false} />
      <Field id={id} label="Your prediction" placeholder="What will it print?" />
      <Reveal>
        <code>{answer}</code> {why}
      </Reveal>
    </div>
  );
}

export default function Lab() {
  return (
    <div className="stack" style={{ '--gap': '56px' }}>
      <Callout label="How this works" tint="cream">
        Do the missions in order, on your own laptop. For every “predict” box, <strong>write your guess before running the code</strong>: the wrong guesses are where the learning is.
        Answers save in this browser only.
      </Callout>

      <section className="stack" id="l1-setup">
        <SectionHead eyebrow="Before you start" tint="blue" title="Setup" level={2} />
        <div className="card checklist">
          <Check id="l1-s1"><code>node -v</code> prints <strong>v22</strong> or newer. (If not, install the LTS version from nodejs.org.)</Check>
          <Check id="l1-s2">VS Code is installed and opens a folder with <code>code .</code> (or File → Open Folder).</Check>
          <Check id="l1-s3"><code>git --version</code> prints a version number.</Check>
          <Check id="l1-s4">You have a GitHub account and are logged in on github.com.</Check>
          <Check id="l1-s5">Windows: use <strong>Git Bash</strong> as your terminal, so every command here works as written.</Check>
        </div>
      </section>

      <Mission id="l1-1" n="1" tint="yellow" title="JS warm-up" goal="Open the Node REPL (type node) and try each line. Predict first.">
        <div className="grid g2">
          <Predict id="l1-p1" code="typeof []" answer="'object'" why="Arrays are objects. Use Array.isArray(x) to check for an array." />
          <Predict id="l1-p2" code={`'5' + 3\n'5' - 3`} answer="'53' and 2" why="+ joins strings when either side is a string; - always does maths. This is why === and real numbers matter." />
          <Predict id="l1-p3" code="[1, 2, 3].filter((n) => n > 1).map((n) => n * 10)" answer="[ 20, 30 ]" why="filter keeps 2 and 3, then map multiplies each by 10." />
          <Predict id="l1-p4" code={`const a = { n: 1 };\nconst b = a;\nb.n = 2;\na.n`} answer="2" why="a and b point to the same object (the same locker)." />
          <Predict id="l1-p5" code={`const { x = 5 } = { x: null };\nx`} answer="null" why="Defaults only kick in for undefined, not null." />
          <Predict id="l1-p6" code={`0 ?? 'default'\n0 || 'default'`} answer="0 and 'default'" why="?? only replaces null/undefined; || replaces anything falsy, including 0. Use ?? for page numbers and prices." />
          <Predict id="l1-p7" code="[3, 1, 10].sort()" answer="[ 1, 10, 3 ]" why="sort() compares as text by default. For numbers: .sort((a, b) => a - b)." />
          <Predict id="l1-p8" code={`JSON.parse('{"id": 12}').id + 1`} answer="13" why="JSON.parse turns text into an object; id is a real number." />
        </div>
      </Mission>

      <Mission id="l1-2" n="2" tint="blue" title="Async order" goal="Predict the order, then run each file with node. Then call a real API.">
        <div className="grid g3">
          <Predict id="l1-a1" code={`console.log('a');\nsetTimeout(() => console.log('b'), 0);\nconsole.log('c');`} answer="a c b" why="The timer callback waits until the script has finished." />
          <Predict id="l1-a2" code={`setTimeout(() => console.log('1'), 0);\nPromise.resolve().then(() => console.log('2'));\nconsole.log('3');`} answer="3 2 1" why="Sync first, then microtasks (promises), then timers." />
          <Predict id="l1-a3" code={`async function go() {\n  console.log('b');\n  await null;\n  console.log('d');\n}\nconsole.log('a');\ngo();\nconsole.log('c');`} answer="a b c d" why="go() runs until its await, then pauses; the script prints c; then go resumes." />
        </div>
        <div className="card stack">
          <h3 className="h-sm">Now call a real API</h3>
          <p>In a new folder, run <code>npm init -y</code> and <code>npm pkg set type=module</code>. Create <code>users.js</code> that fetches <code>https://jsonplaceholder.typicode.com/users</code> and prints one line per user: their <strong>name</strong> and <strong>city</strong> (<code>user.address.city</code>). Use <code>map</code>, and check <code>res.ok</code>.</p>
          <div className="grid g2">
            <Field id="l1-a4" label="How many users came back?" />
            <Field id="l1-a5" label="First user’s name and city" />
          </div>
          <Reveal label="Show one possible solution">
            <CodeBlock
              lang="js"
              title="users.js"
              code={`const res = await fetch('https://jsonplaceholder.typicode.com/users');
if (!res.ok) throw new Error(\`API said \${res.status}\`);

const users = await res.json();
const lines = users.map((u) => \`\${u.name} · \${u.address.city}\`);

console.log(users.length, 'users');
console.log(lines.join('\\n'));`}
            />
            <p>10 users. The first is <strong>Leanne Graham · Gwenborough</strong>.</p>
          </Reveal>
        </div>
      </Mission>

      <Mission id="l1-3" n="3" tint="pink" title="An npm project" goal="Create a project, install a package, and give it scripts.">
        <CodeBlock
          lang="bash"
          title="Terminal"
          code={`mkdir days-left && cd days-left
npm init -y
npm pkg set type=module
npm install dayjs`}
        />
        <CodeBlock
          lang="js"
          title="days-left.js"
          code={`import dayjs from 'dayjs';

const target = process.argv[2] ?? '2026-12-31';
const days = dayjs(target).diff(dayjs(), 'day');
console.log(\`\${days} days until \${target}\`);`}
        />
        <ol className="numlist">
          <li><div>Run <code>node days-left.js 2026-12-25</code>.</div></li>
          <li><div>Add a script: <code>npm pkg set scripts.start="node days-left.js"</code>, then run <code>npm start</code>.</div></li>
          <li><div>Run <code>node --watch days-left.js</code>, change the message text, save, and watch it re-run by itself.</div></li>
          <li><div>Delete <code>node_modules</code>, run the file (it fails), then <code>npm install</code> and run it again.</div></li>
        </ol>
        <div className="grid g2">
          <Field id="l1-n1" label="Exact dayjs version installed (look in package-lock.json)" />
          <Field id="l1-n2" label="What does the ^ in package.json allow?" />
          <Field id="l1-n3" label="What error did you get with node_modules deleted?" multiline />
          <Field id="l1-n4" label="Which file(s) would you commit? Which not?" multiline />
        </div>
        <Reveal>
          <code>^1.11.23</code> allows any newer <strong>1.x</strong> version, never 2.0. With <code>node_modules</code> gone: <code>ERR_MODULE_NOT_FOUND: Cannot find package 'dayjs'</code>.
          Commit <code>package.json</code>, <code>package-lock.json</code> and your <code>.js</code> files. Never <code>node_modules/</code>.
        </Reveal>
      </Mission>

      <Mission id="l1-4" n="4" tint="white" title="Config with .env" goal="Move settings out of the code.">
        <div className="grid g2">
          <CodeBlock lang="bash" title=".env" code={`PORT=4000\nGREETING=Hello from my .env`} />
          <CodeBlock
            lang="js"
            title="config.js"
            code={`const port = Number(process.env.PORT) || 3000;
const greeting = process.env.GREETING ?? 'Hello (default)';
console.log(greeting, 'on port', port);`}
          />
        </div>
        <div className="card checklist">
          <Check id="l1-e1">Run <code>node config.js</code>: you see the defaults.</Check>
          <Check id="l1-e2">Run <code>node --env-file=.env config.js</code>: you see your values.</Check>
          <Check id="l1-e3">Create <code>.env.example</code> with the same names and fake values.</Check>
          <Check id="l1-e4">Add a <code>dev</code> script that uses <code>--watch</code> and <code>--env-file=.env</code>.</Check>
        </div>
        <Field id="l1-e5" label="Why is Number() needed around process.env.PORT?" multiline />
        <Reveal>Every value in <code>process.env</code> is a <strong>string</strong>. <code>'4000' + 1</code> would be <code>'40001'</code>.</Reveal>
      </Mission>

      <Mission id="l1-5" n="5" tint="cream" title="Git & GitHub" goal="Three commits and a push, with secrets safely left out. Use your days-left project.">
        <div className="card checklist">
          <Check id="l1-g1">Create <code>.gitignore</code> with <code>node_modules/</code> and <code>.env</code> <strong>before</strong> the first commit.</Check>
          <Check id="l1-g2"><code>git init</code>, <code>git add .</code>, <code>git commit -m "…"</code>. Commit 1 done.</Check>
          <Check id="l1-g3">Make a change, check <code>git status</code> and <code>git diff</code>, then commit 2.</Check>
          <Check id="l1-g4">One more change and commit 3. <code>git log --oneline</code> shows three lines.</Check>
          <Check id="l1-g5">Create an empty repo on GitHub and push (<Link to="/phase-1/slides?s=38">slide 38</Link> has the commands).</Check>
          <Check id="l1-g6">On github.com, confirm <code>.env</code> and <code>node_modules</code> are <strong>not</strong> there.</Check>
        </div>
        <div className="grid g2">
          <Field id="l1-g7" label="Your repository URL" placeholder="https://github.com/…" />
          <Field id="l1-g8" label="Your three commit messages" multiline />
        </div>
      </Mission>

      <Mission id="l1-6" n="6" tint="green" title="Your own raw server" goal="No Express, no copying the demo file. Build it route by route and test each with curl.">
        <ol className="numlist">
          <li><div>New file <code>server.js</code> with <code>node:http</code>. Keep an <code>events</code> array of three events in the file.</div></li>
          <li><div>Write a <code>send(res, status, data)</code> helper that sets <code>Content-Type: application/json</code>.</div></li>
          <li><div><code>GET /health</code> → <code>200 {'{ "status": "ok" }'}</code></div></li>
          <li><div><code>GET /events</code> → 200 with the array.</div></li>
          <li><div><code>GET /events/:id</code> → 200 with one event, or <strong>404</strong> with an error message.</div></li>
          <li><div>Anything else → <strong>404</strong> <code>{'{ "error": "No route for …" }'}</code>.</div></li>
          <li><div>Read the port from <code>.env</code>, and run it with <code>npm run dev</code>.</div></li>
        </ol>
        <CodeBlock
          lang="bash"
          title="Your tests"
          code={`curl -i localhost:3000/health
curl -i localhost:3000/events
curl -i localhost:3000/events/2
curl -i localhost:3000/events/99
curl -i localhost:3000/nope`}
        />
        <div className="rec-table">
          <span className="label">Request</span><span className="label">Status you got</span><span className="label">Body (short)</span><span className="label">Correct?</span>
          {['/health', '/events', '/events/2', '/events/99', '/nope'].map((r) => (
            <div className="rec-row" key={r}>
              <Field id={`l1-r-${r}-p`} placeholder={r} />
              <Field id={`l1-r-${r}-s`} placeholder="200" />
              <Field id={`l1-r-${r}-b`} placeholder="{ … }" />
              <Field id={`l1-r-${r}-ok`} placeholder="yes / no" />
            </div>
          ))}
        </div>
        <Reveal label="Stuck? Compare with the teacher’s version">
          The finished file is <Link to="/phase-1/demos?s=dm-14">Live demo 14</Link>. Compare after you’ve tried: yours doesn’t need to match line for line, it needs to pass the five tests above.
        </Reveal>
      </Mission>

      <Mission id="l1-bonus" n="+" tint="blue" title="Bonus · POST and a blocked server" goal="For when missions 1–6 are done.">
        <ol className="numlist">
          <li><div>Add <code>POST /events</code>: collect the body chunks, <code>JSON.parse</code> them, reply <strong>201</strong> with the new event. Bad JSON → <strong>400</strong>.</div></li>
          <li><div>Add a <code>/slow</code> route with a 5-second <code>while</code> loop. While it runs, call <code>/health</code> from a second terminal with <code>time curl …</code>.</div></li>
          <li><div>Replace the loop with <code>await new Promise((r) =&gt; setTimeout(r, 5000))</code> and try again.</div></li>
        </ol>
        <Field id="l1-b1" label="How long did /health take in each case? Why?" multiline />
        <Reveal>About 5 seconds with the loop (the one thread is busy), almost instant with <code>await</code> (the thread is free while it waits).</Reveal>
      </Mission>

      <section className="stack" id="l1-reflect">
        <SectionHead eyebrow="Wrap up" tint="yellow" title="Reflection" level={2} />
        <div className="grid g3">
          <Field id="l1-rf1" label="The animation that helped most" multiline />
          <Field id="l1-rf2" label="One thing I’m still unsure about" multiline />
          <Field id="l1-rf3" label="The event loop, in my own words" multiline />
        </div>
      </section>
    </div>
  );
}
