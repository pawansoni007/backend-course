/* ===========================================================
   LIVE DEMOS — the teacher's practical script. Every file,
   command and expected output, in teaching order. Numbers match
   the "Live demo N" callouts on the slides.
   =========================================================== */
import { SectionHead, CodeBlock, Callout } from '../../components/ui.jsx';
import { Link } from '../../lib.jsx';

export const demoSections = [
  { id: 'dm-setup', title: 'Setup · one project folder', keywords: 'mkdir npm init type module vscode' },
  { id: 'dm-1', title: 'Demo 1 · The REPL warm-up', keywords: 'node repl typeof === const' },
  { id: 'dm-2', title: 'Demo 2 · Objects & array methods', keywords: 'map filter find reduce destructuring spread' },
  { id: 'dm-3', title: 'Demo 3 · The reference bug', keywords: 'mutation object copy spread' },
  { id: 'dm-4', title: 'Demo 4 · Modules', keywords: 'import export esm' },
  { id: 'dm-5', title: 'Demo 5 · An error crashes Node', keywords: 'throw try catch exit code stack trace' },
  { id: 'dm-6', title: 'Demo 6 · Event loop order', keywords: 'settimeout promise microtask order blocking' },
  { id: 'dm-7', title: 'Demo 7 · fetch from Node', keywords: 'fetch api jsonplaceholder res.ok' },
  { id: 'dm-8', title: 'Demo 8 · One by one vs Promise.all', keywords: 'promise.all parallel console.time' },
  { id: 'dm-9', title: 'Demo 9 · npm install', keywords: 'npm install dayjs node_modules package-lock' },
  { id: 'dm-10', title: 'Demo 10 · Scripts, --watch and .env', keywords: 'npm run dev env-file process.env' },
  { id: 'dm-11', title: 'Demo 11 · Files with fs/promises', keywords: 'readfile writefile json enoent' },
  { id: 'dm-12', title: 'Demo 12 · Git, start to GitHub', keywords: 'git init add commit push gitignore' },
  { id: 'dm-13', title: 'Demo 13 · Hello, server', keywords: 'node:http createserver curl eaddrinuse' },
  { id: 'dm-14', title: 'Demo 14 · The mini Campus Events API', keywords: 'routing post body 404 400 201 server.js' },
  { id: 'dm-15', title: 'Demo 15 · Block the server', keywords: 'blocking while loop two terminals' },
];

function Demo({ id, n, tint, title, goal, slide, children }) {
  return (
    <section className="mission-sec demo-sec" id={id}>
      <div className="lp-part-head">
        <span className={`icon-sq tint-${tint}`}>{n}</span>
        <div className="stack" style={{ '--gap': '6px' }}>
          <h2 className="display h-md">{title}</h2>
          <p className="muted">
            {goal}
            {slide && <> · <Link to={`/phase-1/slides?s=${slide}`}>slide {slide}</Link></>}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
const Out = ({ title = 'Expected output', code }) => <CodeBlock lang="text" title={title} code={code} copy={false} />;
const Point = ({ children }) => <Callout label="Point out" tint="blue">{children}</Callout>;
const Break = ({ children }) => <Callout label="Break it on purpose" tint="pink">{children}</Callout>;

export const serverJs = `import http from 'node:http';

const PORT = Number(process.env.PORT) || 3000;

const events = [
  { id: 1, title: 'Hack Night', venue: 'Lab Block B', price: 0 },
  { id: 2, title: 'Design Jam', venue: 'Studio 3', price: 0 },
  { id: 3, title: 'Farewell Gala', venue: 'Main Hall', price: 500 },
];
let nextId = 4;

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// collect the body chunks, then parse them as JSON
function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Body is not valid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  console.log(req.method, pathname);

  if (req.method === 'GET' && pathname === '/health') {
    return send(res, 200, { status: 'ok' });
  }

  if (req.method === 'GET' && pathname === '/events') {
    const onlyFree = searchParams.get('free') === 'true';
    return send(res, 200, onlyFree ? events.filter((e) => e.price === 0) : events);
  }

  const match = pathname.match(/^\\/events\\/(\\d+)$/);
  if (req.method === 'GET' && match) {
    const event = events.find((e) => e.id === Number(match[1]));
    if (!event) return send(res, 404, { error: \`Event \${match[1]} not found\` });
    return send(res, 200, event);
  }

  if (req.method === 'POST' && pathname === '/events') {
    let input;
    try {
      input = await readJson(req);
    } catch (err) {
      return send(res, 400, { error: err.message });
    }
    if (!input.title) return send(res, 400, { error: 'title is required' });
    const event = { id: nextId++, title: input.title, venue: input.venue ?? 'TBA', price: input.price ?? 0 };
    events.push(event);
    return send(res, 201, event);
  }

  send(res, 404, { error: \`No route for \${req.method} \${pathname}\` });
});

server.listen(PORT, () => console.log(\`Campus Events API on http://localhost:\${PORT}\`));`;

export default function Demos() {
  return (
    <div className="stack" style={{ '--gap': '64px' }}>
      <Callout label="How to run these" tint="cream">
        Do each demo live, in the same project folder, with the student watching your screen. <strong>Ask him to predict the output before you press Enter.</strong> Every block has a copy button,
        and every “Break it” step shows a real error message he will meet again. The animations explain the idea; these prove it on a real machine.
      </Callout>

      <section className="stack" id="dm-setup">
        <SectionHead eyebrow="Before demo 1" tint="blue" title="Setup · one project folder" level={2} />
        <CodeBlock
          lang="bash"
          title="Terminal"
          code={`node -v                      # v22 or newer (v24 is fine)
mkdir campus-events-raw && cd campus-events-raw
npm init -y                  # creates package.json
npm pkg set type=module      # lets every .js file use import/export
code .                       # open the folder in VS Code`}
        />
        <p className="muted">Keep VS Code on one half of the screen and the terminal on the other. Every file below lives in this one folder, and it becomes a Git repository in demo 12.</p>
      </section>

      {/* ---------------- PART A ---------------- */}
      <Demo id="dm-1" n="1" tint="yellow" title="The REPL warm-up" goal="Type JavaScript and see the answer instantly." slide={5}>
        <CodeBlock
          lang="text"
          title="$ node   (type each line after the >)"
          copy={false}
          code={`> typeof null
'object'
> '1' === 1
false
> '1' == 1
true
> const venue = 'Lab B'
undefined
> venue = 'Main Hall'
Uncaught TypeError: Assignment to constant variable.
> [1, 2, 3].map((n) => n * 2)
[ 2, 4, 6 ]
> 0.1 + 0.2
0.30000000000000004
> .exit`}
        />
        <Point>
          <code>undefined</code> after <code>const venue = …</code> is just the REPL saying “that line returned nothing”. <code>typeof null</code> is a 30-year-old bug nobody can fix without breaking the web.
          <code>0.1 + 0.2</code> is why money is stored in paise (whole numbers), not rupees with decimals.
        </Point>
      </Demo>

      <Demo id="dm-2" n="2" tint="green" title="Objects & array methods" goal="The everyday tools, on data shaped like our API." slide={11}>
        <CodeBlock
          lang="js"
          title="js-basics.js"
          code={`const events = [
  { id: 1, title: 'Hack Night', price: 0, tags: ['coding'] },
  { id: 2, title: 'Farewell Gala', price: 500, tags: ['party'] },
  { id: 3, title: 'Code Jam', price: 0, tags: ['coding', 'team'] },
];

const free = events.filter((e) => e.price === 0);
const titles = free.map((e) => e.title);
const gala = events.find((e) => e.id === 2);
const revenue = events.reduce((sum, e) => sum + e.price, 0);

const { title, price = 0 } = gala;
const cheaper = { ...gala, price: 250 };

console.log(titles);
console.log(\`\${title} costs ₹\${price}\`);
console.log('total', revenue, '| gala still', gala.price, '| copy', cheaper.price);
console.log(events.some((e) => e.tags.includes('team')));`}
        />
        <CodeBlock lang="bash" title="Terminal" code="node js-basics.js" />
        <Out code={`[ 'Hack Night', 'Code Jam' ]
Farewell Gala costs ₹500
total 500 | gala still 500 | copy 250
true`} />
        <Point>Pause before each <code>console.log</code> and have him say the answer. Then show the <Link to="/phase-1/explainers?x=map-filter">filter/map animation</Link> if any of the first two surprised him.</Point>
      </Demo>

      <Demo id="dm-3" n="3" tint="pink" title="The reference bug" goal="See an object change “by itself”, then fix it with spread." slide={10}>
        <CodeBlock
          lang="js"
          title="references.js"
          code={`function applyDiscount(event) {
  event.price = event.price / 2;   // edits the caller's object!
  return event;
}

const gala = { title: 'Gala', price: 500 };
const sale = applyDiscount(gala);
console.log(sale.price, gala.price);

function applyDiscountSafe(event) {
  return { ...event, price: event.price / 2 };   // a new object
}

const gala2 = { title: 'Gala', price: 500 };
const sale2 = applyDiscountSafe(gala2);
console.log(sale2.price, gala2.price);`}
        />
        <Out code={`250 250
250 500`} />
        <Point>In an API this is how one request’s change leaks into data that every other request sees. Link it to the <Link to="/phase-1/explainers?x=references">lockers animation</Link>: same locker, two names.</Point>
      </Demo>

      <Demo id="dm-4" n="4" tint="white" title="Modules" goal="Split code into files and import between them." slide={13}>
        <div className="grid g2">
          <CodeBlock
            lang="js"
            title="events.js"
            code={`export const events = [
  { id: 1, title: 'Hack Night' },
  { id: 2, title: 'Design Jam' },
];

export function findEvent(id) {
  return events.find((e) => e.id === id);
}`}
          />
          <CodeBlock
            lang="js"
            title="app.js"
            code={`import { events, findEvent } from './events.js';

console.log(events.length, 'events');
console.log(findEvent(2).title);`}
          />
        </div>
        <CodeBlock lang="bash" title="Terminal" code="node app.js" />
        <Out code={`2 events
Design Jam`} />
        <Break>
          Misspell the import as <code>{'{ findEvnt }'}</code> and run again. Node refuses before running a single line:
          <code>SyntaxError: The requested module './events.js' does not provide an export named 'findEvnt'</code>. Then remove <code>.js</code> from the path and show the <code>ERR_MODULE_NOT_FOUND</code> error.
        </Break>
      </Demo>

      <Demo id="dm-5" n="5" tint="cream" title="An error crashes Node" goal="An uncaught error stops the whole program. try/catch keeps it alive." slide={14}>
        <CodeBlock
          lang="js"
          title="crash.js"
          code={`function findEvent(id) {
  throw new Error(\`Event \${id} not found\`);
}

console.log('before');
findEvent(99);
console.log('after');   // never runs`}
        />
        <CodeBlock lang="bash" title="Terminal" code={`node crash.js
echo $?        # the exit code: 0 = fine, anything else = failed`} />
        <Out code={`before
file:///…/campus-events-raw/crash.js:2
  throw new Error(\`Event \${id} not found\`);
        ^

Error: Event 99 not found
    at findEvent (file:///…/crash.js:2:9)
    at file:///…/crash.js:6:1
    …

Node.js v22.x.x
1`} />
        <Point>Read the stack trace from the top: the message, then the file and <strong>line:column</strong>, then who called it. Now wrap line 6 in <code>try {'{ … }'} catch (err) {'{ console.log(err.message) }'}</code>: “after” prints and the exit code is 0.</Point>
      </Demo>

      {/* ---------------- PART B ---------------- */}
      <Demo id="dm-6" n="6" tint="blue" title="Event loop order" goal="Predict, run, explain. Then block a timer on purpose." slide={20}>
        <div className="grid g2">
          <CodeBlock
            lang="js"
            title="order.js"
            code={`console.log('1 · sync');

setTimeout(() => console.log('5 · timeout'), 0);

Promise.resolve().then(() => console.log('3 · promise'));
queueMicrotask(() => console.log('4 · microtask'));

console.log('2 · sync');`}
          />
          <CodeBlock
            lang="js"
            title="blocked-timer.js"
            code={`const start = Date.now();

setTimeout(() => {
  console.log(\`timer fired after \${Date.now() - start} ms\`);
}, 100);

const end = Date.now() + 3000;
while (Date.now() < end) {}   // keep the thread busy

console.log('loop done');`}
          />
        </div>
        <div className="grid g2">
          <Out title="$ node order.js" code={`1 · sync
2 · sync
3 · promise
4 · microtask
5 · timeout`} />
          <Out title="$ node blocked-timer.js" code={`loop done
timer fired after 3001 ms`} />
        </div>
        <Point>The numbers in <code>order.js</code> are the answer key: write the file without them first and let him number the lines. In <code>blocked-timer.js</code>, a 100 ms timer waits <strong>3 seconds</strong>: a timer is a minimum wait, never a promise to run on time.</Point>
      </Demo>

      <Demo id="dm-7" n="7" tint="green" title="fetch from Node" goal="Call a real API from a script, and meet the fetch trap." slide={25}>
        <CodeBlock
          lang="js"
          title="get-post.js"
          code={`const API = 'https://jsonplaceholder.typicode.com';

const res = await fetch(\`\${API}/posts/1\`);
console.log(res.status, res.headers.get('content-type'));

const post = await res.json();
console.log(Object.keys(post));

const created = await fetch(\`\${API}/posts\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Hack Night', userId: 1 }),
});
console.log(created.status, await created.json());`}
        />
        <Out title="$ node get-post.js" code={`200 application/json; charset=utf-8
[ 'userId', 'id', 'title', 'body' ]
201 { title: 'Hack Night', userId: 1, id: 101 }`} />
        <Break>
          Change <code>/posts/1</code> to <code>/posts/9999</code>. No error is thrown: it prints <code>404</code>, and the body is <code>{'{}'}</code>. Add
          <code>{"if (!res.ok) throw new Error(`API said ${res.status}`)"}</code> and run again. Then turn Wi-Fi off: now <code>fetch</code> really rejects with <code>TypeError: fetch failed</code>.
        </Break>
      </Demo>

      <Demo id="dm-8" n="8" tint="yellow" title="One by one vs Promise.all" goal="Measure the difference with a stopwatch." slide={24}>
        <CodeBlock
          lang="js"
          title="parallel.js"
          code={`// a fake "database call" that takes ms milliseconds
const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const getUser = () => wait(1000, { id: 7, name: 'Asha' });
const getEvents = () => wait(1000, ['Hack Night', 'Gala']);
const getTickets = () => wait(1000, 2);

console.time('one by one');
await getUser();
await getEvents();
await getTickets();
console.timeEnd('one by one');

console.time('all at once');
const [user, events, tickets] = await Promise.all([getUser(), getEvents(), getTickets()]);
console.timeEnd('all at once');

console.log(user.name, events.length, tickets);`}
        />
        <Out title="$ node parallel.js" code={`one by one: 3.005s
all at once: 1.002s
Asha 2 2`} />
        <Point>The milliseconds vary slightly on every run; the 3-to-1 ratio doesn’t. Ask: “Which of these calls could <em>not</em> run in parallel?” (One that needs the user’s id first.)</Point>
      </Demo>

      {/* ---------------- PART C ---------------- */}
      <Demo id="dm-9" n="9" tint="pink" title="npm install" goal="Install a package, use it, and look at everything that changed." slide={30}>
        <CodeBlock lang="bash" title="Terminal" code={`npm install dayjs
cat package.json          # "dependencies": { "dayjs": "^1.11.…" }
ls node_modules           # the downloaded code
ls -la                    # package-lock.json appeared`} />
        <CodeBlock
          lang="js"
          title="dates.js"
          code={`import dayjs from 'dayjs';

const startsAt = dayjs('2026-10-03T18:00');
console.log(startsAt.format('ddd D MMM, h:mm A'));
console.log('in', startsAt.diff(dayjs('2026-09-28'), 'day'), 'days');`}
        />
        <Out title="$ node dates.js" code={`Sat 3 Oct, 6:00 PM
in 5 days`} />
        <CodeBlock lang="bash" title="Then delete it all and get it back" code={`rm -rf node_modules
node dates.js             # Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'dayjs'
npm install               # rebuilt from package.json + package-lock.json
node dates.js             # works again`} />
        <Point>That’s the whole reason <code>node_modules/</code> never goes into Git: two small files are enough to rebuild it exactly. Your version numbers may be newer than the ones on the slides; that’s fine.</Point>
      </Demo>

      <Demo id="dm-10" n="10" tint="white" title="Scripts, --watch and .env" goal="Name your commands, auto-restart on save, and keep settings out of the code." slide={33}>
        <div className="grid g2">
          <CodeBlock lang="bash" title=".env" code={`PORT=4000
GREETING=Welcome to Campus Events`} />
          <CodeBlock
            lang="js"
            title="env.js"
            code={`console.log(process.env.GREETING);
console.log(typeof process.env.PORT, process.env.PORT);
console.log(process.env.MISSING);`}
          />
        </div>
        <div className="grid g2">
          <Out title="$ node env.js" code={`undefined
undefined undefined
undefined`} />
          <Out title="$ node --env-file=.env env.js" code={`Welcome to Campus Events
string 4000
undefined`} />
        </div>
        <CodeBlock lang="bash" title="Add scripts (or edit package.json by hand)" code={`npm pkg set scripts.dev="node --watch --env-file=.env server.js"
npm pkg set scripts.start="node server.js"`} />
        <Point>Without <code>--env-file</code> nothing is loaded. <code>PORT</code> comes back as the <strong>string</strong> <code>'4000'</code>. Then create <code>.env.example</code> with the same names and fake values, the one that <em>does</em> get committed.</Point>
      </Demo>

      <Demo id="dm-11" n="11" tint="cream" title="Files with fs/promises" goal="Save data to a JSON file and read it back." slide={28}>
        <div className="grid g2">
          <CodeBlock
            lang="js"
            title="store.js"
            code={`import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(import.meta.dirname, 'events.json');

export async function loadEvents() {
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function saveEvents(events) {
  await writeFile(file, JSON.stringify(events, null, 2));
}`}
          />
          <CodeBlock
            lang="js"
            title="add-event.js"
            code={`import { loadEvents, saveEvents } from './store.js';

const events = await loadEvents();
events.push({ id: events.length + 1, title: process.argv[2] ?? 'Untitled', price: 0 });
await saveEvents(events);

console.log(\`Saved. There are now \${events.length} events.\`);`}
          />
        </div>
        <CodeBlock lang="bash" title="Terminal" code={`echo '[{ "id": 1, "title": "Hack Night", "price": 0 }]' > events.json
node add-event.js "Code Jam"
cat events.json`} />
        <Out code={`Saved. There are now 2 events.
[
  { "id": 1, … },
  { "id": 2, "title": "Code Jam", "price": 0 }
]`} />
        <Break>Delete <code>events.json</code> and run again: <code>Error: ENOENT: no such file or directory, open '…/events.json'</code>. ENOENT means “file not found”. Ask how he’d handle it (try/catch, and start from an empty array).</Break>
      </Demo>

      {/* ---------------- PART D ---------------- */}
      <Demo id="dm-12" n="12" tint="green" title="Git, start to GitHub" goal="The full cycle, with .env provably left behind." slide={35}>
        <CodeBlock
          lang="bash"
          title="Terminal"
          code={`git init
git status                       # everything is "untracked", including .env!

printf "node_modules/\\n.env\\n" > .gitignore
git status                       # node_modules/ and .env have vanished from the list
git check-ignore -v .env         # .gitignore:2:.env   .env   ← proof

git add .
git commit -m "Add JS practice files and a raw Node setup"
git log --oneline

# edit any file, then:
git status                       # modified: …
git diff                         # the exact lines that changed
git add . && git commit -m "Explain the reference bug"

gh repo create campus-events-raw --public --source=. --push`}
        />
        <Point>Open the new repo on github.com. Search the file list for <code>.env</code> and <code>node_modules</code>: neither is there. Then click a commit to show the diff view. No <code>gh</code>? Use the three commands on <Link to="/phase-1/slides?s=38">slide 38</Link>.</Point>
      </Demo>

      {/* ---------------- PART E ---------------- */}
      <Demo id="dm-13" n="13" tint="blue" title="Hello, server" goal="A real server on his laptop, seen from the browser, DevTools and curl." slide={39}>
        <CodeBlock
          lang="js"
          title="server.js"
          code={`import http from 'node:http';

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.end('Hello from Node!');
});

server.listen(3000, () => console.log('Listening on 3000'));`}
        />
        <CodeBlock lang="bash" title="Terminal 1" code={`node --watch server.js`} />
        <CodeBlock lang="bash" title="Terminal 2" code={`curl -i localhost:3000
curl -i 'localhost:3000/anything/at/all?x=1'   # quotes: zsh treats ? as a wildcard`} />
        <Point>
          Open <code>http://localhost:3000</code> in the browser with DevTools → Network, exactly like Phase 0: status, headers, response. Terminal 1 logs <strong>two</strong> requests for one page visit;
          the second is <code>/favicon.ico</code>. Every URL gets the same answer, because there’s no routing yet.
        </Point>
        <Break>
          (1) Comment out <code>res.end(…)</code> and save: curl hangs forever, because the response never finishes (<kbd>Ctrl</kbd>+<kbd>C</kbd>). (2) Start a second copy in a third terminal:
          <code>Error: listen EADDRINUSE: address already in use :::3000</code>, the “door already taken” from Phase 0.
        </Break>
      </Demo>

      <Demo id="dm-14" n="14" tint="yellow" title="The mini Campus Events API" goal="Routing, JSON, status codes and a POST body, all by hand. Build it up route by route." slide={44}>
        <CodeBlock lang="js" title="server.js (the finished version)" code={serverJs} />
        <CodeBlock
          lang="bash"
          title="Terminal 2 · test every route"
          code={`curl -i localhost:3000/health
curl localhost:3000/events
curl 'localhost:3000/events?free=true'
curl -i localhost:3000/events/2
curl -i localhost:3000/events/99

curl -i -X POST localhost:3000/events \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Code Jam"}'

curl -i -X POST localhost:3000/events -d '{"title":'
curl -i -X POST localhost:3000/events -d '{}'
curl -i -X DELETE localhost:3000/events/1`}
        />
        <Out code={`HTTP/1.1 200 OK  ·  {"status":"ok"}
[{"id":1,"title":"Hack Night",…},{"id":2,…},{"id":3,…}]
[{"id":1,…},{"id":2,…}]                           ← only the free ones
HTTP/1.1 200 OK  ·  {"id":2,"title":"Design Jam","venue":"Studio 3","price":0}
HTTP/1.1 404 Not Found  ·  {"error":"Event 99 not found"}

HTTP/1.1 201 Created  ·  {"id":4,"title":"Code Jam","venue":"TBA","price":0}

HTTP/1.1 400 Bad Request  ·  {"error":"Body is not valid JSON"}
HTTP/1.1 400 Bad Request  ·  {"error":"title is required"}
HTTP/1.1 404 Not Found  ·  {"error":"No route for DELETE /events/1"}`} />
        <Point>
          Build it in this order, testing after each: <code>send()</code> + <code>/health</code> → <code>/events</code> → <code>/events/:id</code> with 404 → the final 404 → POST. Restart the server and <code>GET /events</code> again:
          Code Jam is gone. The data lives in memory, which is why Phase 4 adds a database.
        </Point>
        <Break>Add <code>throw new Error('boom')</code> as the first line of the POST branch and send a POST. That curl gets <code>(52) Empty reply from server</code>, the <strong>whole server crashes</strong>, and the next <code>curl /health</code> gets <code>(7) Failed to connect</code>. One bad request took the API down for everyone. Phase 5 fixes this with a central error handler.</Break>
      </Demo>

      <Demo id="dm-15" n="15" tint="pink" title="Block the server" goal="Feel the event loop: one CPU loop freezes every user; one await freezes nobody." slide={43}>
        <CodeBlock
          lang="js"
          title="block.js"
          code={`import http from 'node:http';

http.createServer(async (req, res) => {
  if (req.url === '/slow') {
    const end = Date.now() + 5000;
    while (Date.now() < end) {}                      // blocks the ONE thread
    return res.end('slow done\\n');
  }
  if (req.url === '/wait') {
    await new Promise((r) => setTimeout(r, 5000));   // waits, thread stays free
    return res.end('wait done\\n');
  }
  res.end('hello\\n');
}).listen(3000);`}
        />
        <div className="grid g2">
          <CodeBlock lang="bash" title="Terminal 2" code={`curl localhost:3000/slow
# then, a few seconds later:
curl localhost:3000/wait`} />
          <CodeBlock lang="bash" title="Terminal 3 (straight after each one)" code={`time curl localhost:3000/hello
# after /slow: about 5 s total  ← frozen
# after /wait: about 0.01 s     ← instant`} />
        </div>
        <Point>Same 5-second wait, completely different effect on everyone else. Replay the <Link to="/phase-1/explainers?x=one-thread">“Never block the thread” animation</Link> right after: now he has seen it for real. On Windows, run <code>time</code> in Git Bash.</Point>
      </Demo>
    </div>
  );
}
