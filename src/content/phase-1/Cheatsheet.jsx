/* ===========================================================
   CHEAT SHEET — Phase 1 on one page, built for quick lookup.
   =========================================================== */
import { SectionHead, Table, CodeBlock, Callout } from '../../components/ui.jsx';
import { glossary } from './glossary.js';
import { rich, slug, Link } from '../../lib.jsx';

export const cheatSections = [
  { id: 'cs1-js', title: 'JavaScript essentials', keywords: 'const let types === functions arrow template' },
  { id: 'cs1-objects', title: 'Objects, destructuring, spread', keywords: 'optional chaining nullish ?. ?? spread rest' },
  { id: 'cs1-arrays', title: 'Array methods', keywords: 'map filter find reduce some every includes sort' },
  { id: 'cs1-modules', title: 'Modules & errors', keywords: 'import export throw try catch' },
  { id: 'cs1-async', title: 'Async patterns', keywords: 'callback promise then async await try catch' },
  { id: 'cs1-loop', title: 'Event loop: who runs first', keywords: 'order microtask task queue settimeout' },
  { id: 'cs1-promise-helpers', title: 'Promise helpers', keywords: 'promise.all allsettled race any' },
  { id: 'cs1-node', title: 'Running Node', keywords: 'node repl watch env-file argv process' },
  { id: 'cs1-builtins', title: 'Built-in modules', keywords: 'fs path http crypto os' },
  { id: 'cs1-npm', title: 'npm commands & package.json', keywords: 'npm install ci run npx semver lock' },
  { id: 'cs1-env', title: 'Environment variables', keywords: 'env process.env dotenv example' },
  { id: 'cs1-git', title: 'Git commands', keywords: 'git init status add commit push log diff gitignore' },
  { id: 'cs1-http', title: 'A raw node:http server', keywords: 'createserver req res writehead end routing body' },
  { id: 'cs1-glossary', title: 'Glossary', keywords: 'terms definitions' },
];

const Sec = ({ id, eyebrow, tint, title, children }) => (
  <section className="cs-sec" id={id}>
    <SectionHead eyebrow={eyebrow} tint={tint} title={title} level={2} />
    {children}
  </section>
);

export default function Cheatsheet() {
  return (
    <div className="stack" style={{ '--gap': '64px' }}>
      <Sec id="cs1-js" eyebrow="01" tint="yellow" title="JavaScript essentials">
        <Table
          head={['Thing', 'Write it like this', 'Remember']}
          rows={[
            ['Names', '`const x = 1` · `let n = 0`', 'const by default; let only if reassigned; never var'],
            ['Compare', '`a === b` · `a !== b`', 'never `==` (it converts types)'],
            ['Types', '`typeof x` · `Array.isArray(x)`', 'string number boolean undefined object; `typeof null` is \'object\''],
            ['Falsy', '`false 0 \'\' null undefined NaN`', 'everything else is truthy'],
            ['Function', '`function add(a, b = 0) { return a + b }`', 'default parameters'],
            ['Arrow', '`const add = (a, b) => a + b`', 'one expression returns itself; with `{ }` you need `return`'],
            ['Template literal', 'text in backticks, values in `${id}`', 'builds strings like “Event 12 not found”'],
            ['Callback', '`setTimeout(() => { … }, 1000)`', 'a function you hand over to be called later'],
          ]}
        />
      </Sec>

      <Sec id="cs1-objects" eyebrow="02" tint="blue" title="Objects, destructuring, spread">
        <div className="grid g2">
          <CodeBlock
            lang="js"
            title="objects"
            code={`const event = { id: 12, title, price: 0 };   // title: title
event.title            event['price']
event.organiser?.name  // undefined instead of a crash
req.query.page ?? 1    // default only for null/undefined
0 ?? 5                 // 0      (0 || 5 would be 5)`}
          />
          <CodeBlock
            lang="js"
            title="unpack & copy"
            code={`const { id, venue = 'TBA' } = event;
const [first, ...rest] = list;
const copy = { ...event, price: 0 };      // NEW object
const all = [...list, newItem];           // NEW array
// spread is shallow: nested objects are still shared`}
          />
        </div>
        <Callout label="References" tint="cream">Objects and arrays are shared by reference: <code>const b = a</code> gives two names for <strong>one</strong> object. Spread when you need a separate copy. <Link to="/phase-1/explainers?x=references">Watch the animation</Link>.</Callout>
      </Sec>

      <Sec id="cs1-arrays" eyebrow="03" tint="green" title="Array methods">
        <Table
          head={['Method', 'Returns', 'Example']}
          rows={[
            ['`map(fn)`', 'new array, same length', '`events.map((e) => e.title)`'],
            ['`filter(fn)`', 'new array of items that passed', '`events.filter((e) => e.price === 0)`'],
            ['`find(fn)`', 'first match or `undefined`', '`events.find((e) => e.id === 12)`'],
            ['`some(fn)` / `every(fn)`', '`true` / `false`', '`events.some((e) => e.price > 0)`'],
            ['`reduce(fn, start)`', 'one value', '`events.reduce((sum, e) => sum + e.price, 0)`'],
            ['`includes(x)`', '`true` / `false`', "`['admin', 'staff'].includes(role)`"],
            ['`sort(fn)`', 'the same array, sorted', '`nums.sort((a, b) => a - b)` (default sorts as text!)'],
            ['`forEach(fn)`', '`undefined`', 'for side effects only; prefer map/filter'],
          ]}
        />
      </Sec>

      <div className="grid g2 cs-pair">
        <Sec id="cs1-modules" eyebrow="04" tint="pink" title="Modules & errors">
          <CodeBlock
            lang="js"
            title="modules"
            code={`// events.js
export const events = [];
export function findEvent(id) { … }
export default events;

// server.js
import { findEvent } from './events.js';   // .js required
import allEvents from './events.js';
import fs from 'node:fs/promises';`}
          />
          <p>Needs <code>"type": "module"</code> in <code>package.json</code>.</p>
        </Sec>
        <Sec id="cs1-errors" eyebrow="05" tint="yellow" title="Throwing and catching">
          <CodeBlock
            lang="js"
            title="errors"
            code={`if (!event) throw new Error(\`Event \${id} not found\`);

try {
  risky();
} catch (err) {
  console.log(err.message);   // err.stack for the trace
} finally {
  cleanUp();                  // always runs
}`}
          />
          <p>No catch anywhere → Node prints the error and the <strong>process exits</strong>.</p>
        </Sec>
      </div>

      <Sec id="cs1-async" eyebrow="06" tint="blue" title="Async patterns">
        <div className="grid g3">
          <CodeBlock
            lang="js"
            title="callback (old)"
            code={`fs.readFile(file, 'utf8', (err, text) => {
  if (err) return handle(err);
  use(text);
});`}
          />
          <CodeBlock
            lang="js"
            title="promise"
            code={`fetch(url)
  .then((res) => res.json())
  .then((data) => use(data))
  .catch((err) => handle(err));`}
          />
          <CodeBlock
            lang="js"
            title="async / await (use this)"
            code={`try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  use(await res.json());
} catch (err) { handle(err); }`}
          />
        </div>
        <Table
          head={['Rule', 'Why']}
          rows={[
            ['`await` only inside `async` functions (or top level of a module)', 'otherwise it’s a syntax error'],
            ['An `async` function always returns a promise', '`return 5` gives `Promise<5>`'],
            ['Forgot `await`?', 'you get `Promise { <pending> }` instead of data'],
            ['`fetch` doesn’t throw on 404/500', 'check `res.ok` (true for 2xx)'],
            ['Unhandled rejections crash Node', 'every `await` needs a `try/catch` somewhere above it'],
          ]}
        />
      </Sec>

      <Sec id="cs1-loop" eyebrow="07" tint="pink" title="Event loop: who runs first">
        <ol className="numlist">
          <li><div><strong>All synchronous code</strong> in the current script or callback runs to the end.</div></li>
          <li><div><strong>Every microtask</strong>: promise <code>.then</code> callbacks, code after an <code>await</code>, <code>queueMicrotask</code>.</div></li>
          <li><div><strong>One task</strong>: a timer callback, a finished file read, an incoming request. Then back to step 2.</div></li>
        </ol>
        <CodeBlock lang="js" title="classic puzzle → A D C B" code={`console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`} />
        <Callout label="Never block" tint="yellow">A long synchronous loop keeps the one thread busy and freezes <strong>every</strong> request. Waiting with <code>await</code> costs nothing. <Link to="/phase-1/explainers?x=event-loop">Event loop animation</Link> · <Link to="/phase-1/explainers?x=one-thread">never block</Link>.</Callout>
      </Sec>

      <Sec id="cs1-promise-helpers" eyebrow="08" tint="green" title="Promise helpers">
        <Table
          head={['Helper', 'Waits for', 'Fails when', 'Use it for']}
          rows={[
            ['`Promise.all([…])`', 'all to fulfil', 'any one rejects (fails fast)', 'independent calls you all need'],
            ['`Promise.allSettled([…])`', 'all to finish', 'never', 'a report of which ones worked'],
            ['`Promise.race([…])`', 'the first to finish', 'the first one rejects', 'timeouts'],
            ['`Promise.any([…])`', 'the first to fulfil', 'all reject', 'the fastest of several mirrors'],
          ]}
        />
      </Sec>

      <div className="grid g2 cs-pair">
        <Sec id="cs1-node" eyebrow="09" tint="yellow" title="Running Node">
          <CodeBlock
            lang="bash"
            title="Terminal"
            code={`node -v                          # version (22+)
node                             # REPL (.exit to leave)
node app.js                      # run once
node --watch app.js              # restart on save
node --env-file=.env app.js      # load .env first
node greet.js Asha               # process.argv[2] = 'Asha'`}
          />
          <p><kbd>Ctrl</kbd>+<kbd>C</kbd> stops a running program. <code>process.env</code>, <code>process.argv</code>, <code>process.exit(1)</code>.</p>
        </Sec>
        <Sec id="cs1-builtins" eyebrow="10" tint="blue" title="Built-in modules">
          <Table
            head={['Import', 'For']}
            rows={[
              ["`node:fs/promises`", '`readFile`, `writeFile`, `mkdir`'],
              ["`node:path`", '`path.join(import.meta.dirname, \'data.json\')`'],
              ["`node:http`", '`http.createServer((req, res) => …)`'],
              ["`node:crypto`", '`crypto.randomUUID()`, hashing'],
              ["`node:os`", 'CPU, memory, platform info'],
            ]}
          />
        </Sec>
      </div>

      <Sec id="cs1-npm" eyebrow="11" tint="pink" title="npm commands & package.json">
        <div className="grid g2">
          <Table
            head={['Command', 'Does']}
            rows={[
              ['`npm init -y`', 'create package.json'],
              ['`npm pkg set type=module`', 'use import/export'],
              ['`npm install dayjs`', 'add a dependency'],
              ['`npm install -D prettier`', 'add a dev-only dependency'],
              ['`npm install`', 'install everything listed'],
              ['`npm ci`', 'exact install from the lock file (servers, CI)'],
              ['`npm uninstall dayjs`', 'remove a package'],
              ['`npm run dev` · `npm start`', 'run a script'],
              ['`npx some-tool`', 'run a package without installing it'],
            ]}
          />
          <div className="stack">
            <CodeBlock
              lang="json"
              title="package.json"
              code={`{
  "name": "campus-events",
  "type": "module",
  "scripts": {
    "dev": "node --watch --env-file=.env server.js",
    "start": "node server.js"
  },
  "dependencies": { "dayjs": "^1.11.23" }
}`}
            />
            <Table
              head={['Range', 'Allows']}
              rows={[
                ['`^1.11.23`', '1.11.23 up to (not incl.) 2.0.0'],
                ['`~1.11.23`', '1.11.x patches only'],
                ['`1.11.23`', 'exactly that'],
              ]}
            />
          </div>
        </div>
        <Callout label="Commit or not?" tint="cream">Commit <code>package.json</code> and <code>package-lock.json</code>. Never commit <code>node_modules/</code>: <code>npm install</code> rebuilds it.</Callout>
      </Sec>

      <Sec id="cs1-env" eyebrow="12" tint="green" title="Environment variables">
        <div className="grid g3">
          <CodeBlock lang="bash" title=".env (never committed)" code={`PORT=4000
API_KEY=sk_test_real_value`} />
          <CodeBlock lang="bash" title=".env.example (committed)" code={`PORT=3000
API_KEY=replace-me`} />
          <CodeBlock lang="js" title="read it" code={`const port = Number(process.env.PORT) || 3000;
const key = process.env.API_KEY;
if (!key) throw new Error('API_KEY missing');`} />
        </div>
        <p>Load with <code>node --env-file=.env server.js</code>. Every value is a <strong>string</strong>.</p>
      </Sec>

      <Sec id="cs1-git" eyebrow="13" tint="yellow" title="Git commands">
        <div className="grid g2">
          <Table
            head={['Command', 'Does']}
            rows={[
              ['`git init`', 'start a repository here'],
              ['`git status`', 'what changed? what’s staged? (always safe)'],
              ['`git diff`', 'show changed lines'],
              ['`git add .` / `git add file`', 'stage for the next commit'],
              ['`git commit -m "Add 404 route"`', 'save a snapshot'],
              ['`git log --oneline`', 'history'],
              ['`git restore file`', 'discard uncommitted edits (no undo!)'],
              ['`git remote add origin <url>`', 'link to GitHub (once)'],
              ['`git push -u origin main` → `git push`', 'upload commits'],
              ['`git check-ignore -v .env`', 'prove a file is ignored'],
            ]}
          />
          <div className="stack">
            <CodeBlock lang="bash" title=".gitignore" code={`node_modules/
.env
dist/
*.log
.DS_Store`} />
            <Callout label="Pushed a secret?" tint="pink">Revoke it and make a new one. Deleting the file in a new commit doesn’t remove it from history.</Callout>
          </div>
        </div>
      </Sec>

      <Sec id="cs1-http" eyebrow="14" tint="blue" title="A raw node:http server">
        <div className="grid g2">
          <CodeBlock
            lang="js"
            title="server.js skeleton"
            code={`import http from 'node:http';

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

http.createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && pathname === '/health') {
    return send(res, 200, { status: 'ok' });
  }
  send(res, 404, { error: \`No route for \${req.method} \${pathname}\` });
}).listen(3000);`}
          />
          <Table
            head={['Object', 'Useful parts']}
            rows={[
              ['`req`', '`method`, `url`, `headers` (lower-case), `on(\'data\')`, `on(\'end\')`'],
              ['`res`', '`statusCode`, `setHeader(k, v)`, `writeHead(code, headers)`, `end(body)`'],
              ['Body', 'collect chunks → `JSON.parse` in try/catch → 400 if broken'],
              ['Params', "`pathname.match(/^\\/events\\/(\\d+)$/)` then `Number(m[1])`"],
              ['Errors', '`EADDRINUSE` = port taken · `ERR_HTTP_HEADERS_SENT` = responded twice'],
            ]}
          />
        </div>
        <p>The full version is <Link to="/phase-1/demos?s=dm-14">Live demo 14</Link>.</p>
      </Sec>

      <Sec id="cs1-glossary" eyebrow="15" tint="pink" title="Glossary">
        <dl className="glossary">
          {glossary.map(([term, def]) => (
            <div className="gl-item" id={`term-${slug(term)}`} key={term}>
              <dt>{term}</dt>
              <dd>{rich(def)}</dd>
            </div>
          ))}
        </dl>
      </Sec>
    </div>
  );
}
