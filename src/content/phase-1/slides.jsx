/* ===========================================================
   PHASE 1 SLIDES — JavaScript & Node.js essentials
   Slide: { id, part, title, bg, lead, remember, body | scene }
   A slide with `scene` is an animated explainer: in the deck,
   → plays its next step before moving to the next slide.
   =========================================================== */
import { Flow } from '../../components/diagrams.jsx';
import { highlight } from '../../components/ui.jsx';
import * as X from './explainers.js';

export const parts = {
  A: { label: 'Part A · JavaScript for the backend', tint: 'yellow' },
  B: { label: 'Part B · Async JavaScript', tint: 'blue' },
  C: { label: 'Part C · Node.js & npm', tint: 'pink' },
  D: { label: 'Part D · Git & GitHub', tint: 'green' },
  E: { label: 'Part E · A server with no framework', tint: 'cream' },
};

const Card = ({ tint = 'white', className = '', children, ...rest }) => (
  <div className={`card sc tint-${tint} ${className}`} {...rest}>{children}</div>
);
const Tag = ({ tint = 'white', children }) => <span className={`pill tint-${tint}`}>{children}</span>;
const Code = ({ code, lang = 'js', title, out = false }) => (
  <div className={`s-code${out ? ' is-out' : ''}`}>
    {title && <div className="s-code-head">{title}</div>}
    <pre dangerouslySetInnerHTML={{ __html: highlight(code.replace(/^\n/, '').replace(/\s+$/, ''), lang) }} />
  </div>
);
const Demo = ({ n, children }) => (
  <div className="callout tint-cream s-demo">
    <span className="label">Live demo {n}</span>
    <div>{children}</div>
  </div>
);
const Mini = ({ tint = 'white', children }) => <Card tint={tint} className="sc-mini">{children}</Card>;

export const slides = [
  /* ================= PART A · JavaScript for the backend ================= */
  {
    id: 'title',
    part: 'A',
    title: 'JavaScript & Node.js essentials',
    bg: 'offwhite',
    layout: 'cover',
    remember: 'By the end of today you run your own server and call it with curl.',
    body: (
      <div className="cover">
        <div className="cover-main card tint-yellow">
          <Tag>Phase 1 · Week 2</Tag>
          <h1 className="display cover-title">JavaScript<br />&amp; Node.js</h1>
          <p className="cover-sub">The language, the runtime, the tools, and a server built with nothing but Node.</p>
        </div>
        <div className="cover-side">
          <div className="card sc tint-blue">
            <span className="label">You type</span>
            <pre className="cover-code">$ node server.js{'\n'}Listening on :3000</pre>
          </div>
          <div className="card sc tint-green">
            <span className="label">Your server answers</span>
            <pre className="cover-code">$ curl localhost:3000/events{'\n'}[{'{'} "id": 1, "title": "Hack Night" {'}'}]</pre>
          </div>
        </div>
        <span className="star cover-star">JS</span>
      </div>
    ),
  },
  {
    id: 'map',
    part: 'A',
    title: 'Today’s map',
    bg: 'blue',
    lead: 'Five parts. Animated slides first explain the idea; a live demo then proves it on your laptop.',
    remember: 'A: the language · B: waiting · C: the runtime · D: saving work · E: a real server.',
    body: (
      <div className="sg5">
        {[
          ['A', 'JavaScript for the backend', 'yellow', ['const & let', 'Functions', 'The call stack', 'Objects & arrays', 'Modules & errors']],
          ['B', 'Async JavaScript', 'white', ['Why servers wait', 'The event loop', 'Promises', 'async / await', 'Promise.all']],
          ['C', 'Node.js & npm', 'pink', ['Running Node', 'Built-in modules', 'npm & package.json', 'Environment variables']],
          ['D', 'Git & GitHub', 'green', ['Add & commit', '.gitignore', 'Push to GitHub']],
          ['E', 'A server, no framework', 'cream', ['node:http', 'Routing by hand', 'Reading a body', 'Why Express exists']],
        ].map(([k, t, tint, items]) => (
          <Card key={k} tint={tint} className="map-card">
            <span className="icon-sq tint-white">{k}</span>
            <h3 className="sc-title">{t}</h3>
            <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: 'why-js',
    part: 'A',
    title: 'Why JavaScript on the server?',
    bg: 'offwhite',
    lead: 'In Phase 0 the server was a black box. Today you open it, and it runs the same language as the browser.',
    remember: 'Same language, different toolbox: the browser has the page, Node has files, network and the OS.',
    body: (
      <>
        <div className="sg3">
          <Card tint="yellow">
            <Tag>One language</Tag>
            <p>Write the frontend and the backend in JavaScript. One set of skills, and you can share code between them.</p>
          </Card>
          <Card tint="blue">
            <Tag>Node.js (2009)</Tag>
            <p>Takes Chrome’s JavaScript engine (<strong>V8</strong>) out of the browser so JS can run on any computer, including servers.</p>
          </Card>
          <Card tint="green">
            <Tag>Great at waiting</Tag>
            <p>APIs spend most of their time waiting for databases and other APIs. Node is built to wait for thousands of things at once.</p>
          </Card>
        </div>
        <div className="sg2 mt">
          <Mini><strong>Browser JavaScript</strong> can use <code>document</code>, <code>window</code>, clicks. It cannot touch your files.</Mini>
          <Mini tint="pink"><strong>Node JavaScript</strong> can use <code>fs</code> (files), <code>http</code> (servers), <code>process</code> (the OS). There is no page.</Mini>
        </div>
      </>
    ),
  },
  {
    id: 'const-let',
    part: 'A',
    title: 'const and let',
    bg: 'yellow',
    lead: 'Two ways to name a value. Pick const unless the value really has to change.',
    remember: 'const by default, let when it changes, never var.',
    body: (
      <div className="sg2 wide-left">
        <Code
          title="variables.js"
          code={`
const venue = 'Lab Block B';   // never reassigned
let seatsLeft = 60;            // will change

seatsLeft = seatsLeft - 1;     // fine: it's let
venue = 'Main Hall';           // TypeError: Assignment
                               // to constant variable.

const event = { seats: 60 };
event.seats = 59;              // allowed! the object can change,
                               // the name can't point elsewhere`}
        />
        <div className="stack">
          <Mini tint="white"><strong>const</strong>: the name always points to the same value. Use it for almost everything.</Mini>
          <Mini tint="white"><strong>let</strong>: use it for counters, totals, things you really reassign.</Mini>
          <Mini tint="pink"><strong>var</strong>: the old way from before 2015, with confusing scope rules. You’ll see it in old tutorials; don’t write it.</Mini>
          <Mini tint="blue">Both are <strong>block-scoped</strong>: a name made inside <code>{'{ }'}</code> doesn’t exist outside.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'types',
    part: 'A',
    title: 'Types and equality',
    bg: 'offwhite',
    lead: 'Seven kinds of value you’ll meet daily, and the one comparison to use.',
    remember: 'Always use === and !==. Falsy: false, 0, "", null, undefined, NaN.',
    body: (
      <div className="sg2">
        <Code
          title="node REPL"
          code={`
typeof 'Hack Night'   // 'string'
typeof 60             // 'number'  (no separate int/float)
typeof true           // 'boolean'
typeof undefined      // 'undefined' (never set)
typeof null           // 'object'   (a famous old bug)
typeof { id: 1 }      // 'object'
Array.isArray([1, 2]) // true  (typeof [] is 'object')`}
        />
        <div className="stack">
          <Card>
            <Tag tint="green">Use ===</Tag>
            <pre className="rule-code">{`'1' === 1    // false  ✓ strict
'1' == 1     // true   ✗ converts types
0 == ''      // true   ✗ surprising`}</pre>
          </Card>
          <Mini tint="yellow"><strong>null</strong> = “empty on purpose”. <strong>undefined</strong> = “never given a value”. APIs send <code>null</code> in JSON.</Mini>
          <Mini tint="blue"><strong>Falsy</strong> values act like false in an <code>if</code>: <code>false 0 '' null undefined NaN</code>. Everything else is truthy.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'functions',
    part: 'A',
    title: 'Functions, three ways',
    bg: 'pink',
    lead: 'A function is a named recipe. In JavaScript it’s also a value you can hand to someone else.',
    remember: 'Arrow functions everywhere in Express: (req, res) => { … }. Functions can be passed around like any value.',
    body: (
      <div className="sg2 wide-left">
        <Code
          title="functions.js"
          code={`
// 1 · declaration
function addTax(amount, rate = 0.18) {
  return amount + amount * rate;
}

// 2 · arrow function (the one you'll use most)
const addTax2 = (amount, rate = 0.18) => amount + amount * rate;

// 3 · passing a function to another function
setTimeout(() => console.log('later'), 1000);
app.get('/events', (req, res) => res.json(events));`}
        />
        <div className="stack">
          <Mini><strong>Parameters</strong> can have defaults: <code>rate = 0.18</code>.</Mini>
          <Mini>Arrow with one expression returns it <strong>automatically</strong>. With <code>{'{ }'}</code> you must write <code>return</code>.</Mini>
          <Mini tint="yellow">A function passed in to be called later is a <strong>callback</strong>. Every Express route is one.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'call-stack',
    part: 'A',
    title: 'How JavaScript runs your code',
    bg: 'offwhite',
    lead: 'Two passes over the file, and a stack of boxes: one for each function that is running.',
    remember: 'Each call pushes a box on the call stack; return pops it. One stack means one thing at a time.',
    scene: X.callStack,
  },
  {
    id: 'objects',
    part: 'A',
    title: 'Objects: the backend’s favourite shape',
    bg: 'offwhite',
    lead: 'Every request body, every database row and every JSON response is an object.',
    remember: 'obj.key or obj[key] · ?. stops on null · ?? gives a default · `${}` builds strings.',
    body: (
      <div className="sg2 wide-left">
        <Code
          title="objects.js"
          code={`
const title = 'Hack Night';
const event = { id: 12, title, price: 0, organiser: null };
//                        ↑ shorthand for title: title

event.title                  // 'Hack Night'
event['price']               // 0   (bracket: key in a variable)
event.organiser?.name        // undefined, no crash
event.organiser.name         // TypeError: Cannot read
                             // properties of null

const page = req.query.page ?? 1;   // default if missing
const msg = \`Event \${event.id} not found\`;`}
        />
        <div className="stack">
          <Mini tint="yellow"><strong>Optional chaining</strong> <code>?.</code> returns <code>undefined</code> instead of crashing when something is missing.</Mini>
          <Mini tint="blue"><strong>Nullish</strong> <code>??</code> uses the right side only when the left is <code>null</code> or <code>undefined</code> (so <code>0 ?? 5</code> is 0).</Mini>
          <Mini tint="green"><strong>Template literals</strong> use backticks and <code>{'${…}'}</code> to drop values into text.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'destructuring',
    part: 'A',
    title: 'Destructuring and spread',
    bg: 'green',
    lead: 'Unpack what you need, and copy what you don’t want to change.',
    remember: 'const { id } = req.params · { ...obj, key: new } makes a new object.',
    body: (
      <div className="sg2">
        <Code
          title="unpack.js"
          code={`
const event = { id: 12, title: 'Hack Night', price: 0 };

// pull fields out into names
const { title, price } = event;
const { venue = 'TBA' } = event;   // default if missing

// arrays unpack by position
const [first, ...rest] = [3, 7, 9]; // 3, [7, 9]

// function parameters too
function create({ title, venue }) { /* … */ }`}
        />
        <Code
          title="copy.js"
          code={`
// spread copies fields into a NEW object
const free = { ...event, price: 0 };

// merge defaults with what the client sent
const input = { title: 'Gala' };
const saved = { price: 0, venue: 'TBA', ...input };
// { price: 0, venue: 'TBA', title: 'Gala' }

// arrays: copy, or add without changing the original
const more = [...list, newItem];`}
        />
      </div>
    ),
  },
  {
    id: 'references',
    part: 'A',
    title: 'Values vs references',
    bg: 'offwhite',
    lead: 'Why changing an object over here also changes it over there.',
    remember: 'Primitives are copied. Objects and arrays share one copy, unless you spread into a new one.',
    scene: X.references,
  },
  {
    id: 'array-methods',
    part: 'A',
    title: 'Array methods you’ll use every day',
    bg: 'cream',
    lead: 'Loops you don’t have to write. Each one takes a function and runs it for every item.',
    remember: 'map transforms · filter keeps some · find gets one · some/every check · reduce totals.',
    body: (
      <div className="sg3 array-grid">
        {[
          ['map', 'Transform every item', 'events.map((e) => e.title)', "['Hack Night', 'Gala']", 'yellow'],
          ['filter', 'Keep the items that pass', 'events.filter((e) => e.price === 0)', '[{ …Hack Night }]', 'green'],
          ['find', 'First match, or undefined', 'events.find((e) => e.id === 12)', '{ id: 12, … }', 'blue'],
          ['some / every', 'Does any / do all pass?', 'events.some((e) => e.price > 0)', 'true', 'pink'],
          ['reduce', 'Boil down to one value', 'events.reduce((sum, e) => sum + e.price, 0)', '500', 'white'],
          ['includes', 'Is this value in it?', "['admin', 'staff'].includes(role)", 'true / false', 'white'],
        ].map(([n, what, ex, res, tint]) => (
          <Card key={n} tint={tint} className="am-card">
            <span className="am-name">{n}</span>
            <span className="am-what">{what}</span>
            <code>{ex}</code>
            <span className="am-res">→ {res}</span>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: 'map-filter',
    part: 'A',
    title: 'filter and map, animated',
    bg: 'offwhite',
    lead: 'The original array is never changed: each method builds a new one.',
    remember: 'filter decides keep/drop per item; map turns each item into something new. Both return new arrays.',
    scene: X.mapFilter,
  },
  {
    id: 'modules',
    part: 'A',
    title: 'Modules: import and export',
    bg: 'offwhite',
    lead: 'Split code into files. Each file shares only what it exports.',
    remember: 'export from one file, import in another. "type": "module" in package.json. node: for built-ins.',
    body: (
      <>
        <div className="sg2">
          <Code
            title="events.js"
            code={`
export const events = [
  { id: 1, title: 'Hack Night', price: 0 },
];

export function findEvent(id) {
  return events.find((e) => e.id === id);
}

export default events;`}
          />
          <Code
            title="server.js"
            code={`
import { events, findEvent } from './events.js';
import allEvents from './events.js';   // the default

import fs from 'node:fs/promises';     // built-in
import dayjs from 'dayjs';             // from npm

console.log(findEvent(1).title);`}
          />
        </div>
        <div className="sg3 mt">
          <Mini tint="yellow">Put <code>"type": "module"</code> in <code>package.json</code> so Node treats <code>.js</code> files as modules.</Mini>
          <Mini>Your own files: <strong>relative path with <code>.js</code></strong>, like <code>'./events.js'</code>.</Mini>
          <Mini tint="pink">Old tutorials use <code>require()</code> (CommonJS). Same idea, older syntax.</Mini>
        </div>
      </>
    ),
  },
  {
    id: 'errors',
    part: 'A',
    title: 'Errors: throw and try / catch',
    bg: 'pink',
    lead: 'When something goes wrong you throw an error. Whoever called you can catch it.',
    remember: 'throw new Error(msg) · try/catch to handle · an uncaught error stops the whole Node process.',
    body: (
      <div className="sg2 wide-left">
        <Code
          title="errors.js"
          code={`
function findEvent(id) {
  const event = events.find((e) => e.id === id);
  if (!event) throw new Error(\`Event \${id} not found\`);
  return event;
}

try {
  const e = findEvent(99);
  console.log(e.title);          // skipped
} catch (err) {
  console.log('Oops:', err.message);
} finally {
  console.log('runs either way');
}`}
        />
        <div className="stack">
          <Mini><strong>throw</strong> stops the function right there and jumps to the nearest <code>catch</code>.</Mini>
          <Mini tint="yellow"><code>err.message</code> is the text; <code>err.stack</code> shows which lines led there.</Mini>
          <Card tint="white" className="sc-mini">
            <strong>No catch anywhere?</strong> Node prints the error and the <strong>process exits</strong>. For a server, that means it’s down for every user. Phase 5 builds one central error handler.
          </Card>
        </div>
      </div>
    ),
  },

  /* ================= PART B · Async JavaScript ================= */
  {
    id: 'why-async',
    part: 'B',
    title: 'Servers mostly wait',
    bg: 'blue',
    lead: 'Most of a request’s time goes on waiting for something else. The CPU sits idle.',
    remember: 'If a CPU step took 1 second, one 100 ms API call would take about 3 years.',
    body: (
      <div className="sg2 wide-left">
        <Card>
          <div className="latency">
            {[
              ['One CPU step', '≈ 1 nanosecond', 1],
              ['Read from memory (RAM)', '≈ 100 ns', 2],
              ['Read a small file (SSD)', '≈ 0.1 – 1 ms', 4],
              ['Database query', '≈ 1 – 50 ms', 6],
              ['Call another API', '≈ 50 – 500 ms', 9],
            ].map(([t, v, w]) => (
              <div className="lat-row" key={t}>
                <span>{t}</span>
                <span className="lat-bar" style={{ '--w': w }} />
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        </Card>
        <div className="stack">
          <Mini tint="yellow">A request to <code>GET /events</code> might spend <strong>0.1 ms</strong> running your code and <strong>30 ms</strong> waiting for the database.</Mini>
          <Mini tint="pink">If the server sat still during every wait, it could serve only a handful of users.</Mini>
          <Mini>The fix is <strong>asynchronous</strong> code: start the slow thing, do other work, and come back when it’s done.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'waiter',
    part: 'B',
    title: 'One waiter: blocking vs non-blocking',
    bg: 'offwhite',
    lead: 'The restaurant from Phase 0, with a single waiter. Watch the clock.',
    remember: 'Node has one thread. It hands slow work off and serves others instead of standing and waiting.',
    scene: X.waiter,
  },
  {
    id: 'callbacks',
    part: 'B',
    title: 'Callbacks: “call me when it’s done”',
    bg: 'offwhite',
    lead: 'The first way JavaScript handled waiting: pass a function to run later.',
    remember: 'A callback runs later, when the slow thing finishes. Node callbacks get (err, result).',
    body: (
      <div className="sg2">
        <Code
          title="callbacks.js"
          code={`
import fs from 'node:fs';

console.log('1 · asking for the file');

fs.readFile('events.json', 'utf8', (err, text) => {
  if (err) return console.log('Could not read:', err.message);
  console.log('3 · got', text.length, 'characters');
});

console.log('2 · not waiting around');`}
        />
        <div className="stack">
          <Mini tint="yellow">Node callbacks use <strong>error-first</strong>: the first argument is an error (or <code>null</code>), the second is the result.</Mini>
          <Card>
            <Tag tint="pink">Callback hell: why promises exist</Tag>
            <pre className="rule-code">{`getUser(id, (err, user) => {
  getEvents(user, (err, events) => {
    getTickets(events, (err, tickets) => {
      // …deeper and deeper
    });
  });
});`}</pre>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'event-loop',
    part: 'B',
    title: 'The event loop',
    bg: 'offwhite',
    lead: 'Why the line in the middle of the file prints last.',
    remember: 'Callbacks wait in a queue and run only when the call stack is empty. setTimeout(fn, 0) still waits.',
    scene: X.eventLoop,
  },
  {
    id: 'promises',
    part: 'B',
    title: 'Promises: an order receipt',
    bg: 'yellow',
    lead: 'A promise is a receipt for a value that isn’t ready yet, like a Swiggy order tracker.',
    remember: 'pending → fulfilled (value) or rejected (error). It settles once. .then for success, .catch for failure.',
    body: (
      <>
        <Flow
          nodes={[
            { tag: 'Right now', title: 'Pending', sub: 'Order placed. Food not here yet.', tint: 'white' },
            { tag: 'Worked', title: 'Fulfilled', sub: 'Delivered: you get the **value**.', tint: 'green' },
            { tag: 'Or failed', title: 'Rejected', sub: 'Cancelled: you get an **error**.', tint: 'pink' },
          ]}
          arrows={['success →', 'or']}
        />
        <div className="sg2 mt">
          <Code
            title="then / catch"
            code={`
fetch('https://api.campus.dev/events')   // a Promise
  .then((res) => res.json())             // another Promise
  .then((events) => console.log(events.length))
  .catch((err) => console.log('Failed:', err.message))
  .finally(() => console.log('done'));`}
          />
          <div className="stack">
            <Mini>A promise settles <strong>once</strong>. After that its result never changes.</Mini>
            <Mini tint="blue">Chains stay flat: no pyramid. One <code>.catch</code> handles an error from any step above it.</Mini>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'microtasks',
    part: 'B',
    title: 'Promises jump the queue',
    bg: 'offwhite',
    lead: 'Predict the output first. Then step through.',
    remember: 'Order: synchronous code → all microtasks (promises) → the next task (timers, I/O).',
    scene: X.microtasks,
  },
  {
    id: 'async-await',
    part: 'B',
    title: 'async / await',
    bg: 'green',
    lead: 'The same promises, written so they read top to bottom like normal code.',
    remember: 'await waits for a promise inside an async function. An async function always returns a promise.',
    body: (
      <div className="sg2">
        <Code
          title="with .then"
          code={`
function loadEvents() {
  return fetch(URL)
    .then((res) => res.json())
    .then((events) => {
      console.log(events.length);
      return events;
    });
}`}
        />
        <Code
          title="with async / await"
          code={`
async function loadEvents() {
  const res = await fetch(URL);
  const events = await res.json();
  console.log(events.length);
  return events;
}`}
        />
        <div className="sg3 span-2">
          <Mini tint="yellow"><code>await</code> only works inside an <code>async</code> function, or at the top level of a module file.</Mini>
          <Mini>An <code>async</code> function <strong>always returns a promise</strong>, even if you <code>return 5</code>.</Mini>
          <Mini tint="blue">Forget <code>await</code> and you get a <code>Promise {'{ <pending> }'}</code> instead of the data.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'await-pauses',
    part: 'B',
    title: 'await pauses one function, not the server',
    bg: 'offwhite',
    lead: 'Where an async function goes while it waits, and how it comes back.',
    remember: 'At await, the function steps off the stack. Other code runs. It resumes via the microtask queue.',
    scene: X.asyncAwait,
  },
  {
    id: 'async-errors',
    part: 'B',
    title: 'When async code fails',
    bg: 'pink',
    lead: 'try / catch works with await. And fetch has a trap.',
    remember: 'Wrap awaits in try/catch. fetch does NOT fail on 404/500: check res.ok. Unhandled rejections crash Node.',
    body: (
      <div className="sg2 wide-left">
        <Code
          title="safe-fetch.js"
          code={`
async function getPost(id) {
  try {
    const res = await fetch(\`\${API}/posts/\${id}\`);
    if (!res.ok) {
      throw new Error(\`API said \${res.status}\`);
    }
    return await res.json();
  } catch (err) {
    console.log('Could not load post:', err.message);
    return null;
  }
}`}
        />
        <div className="stack">
          <Mini tint="yellow"><strong>The fetch trap:</strong> a 404 or 500 is still a response, so the promise <em>fulfils</em>. It only rejects when there’s no response at all (offline, bad domain).</Mini>
          <Mini><code>res.ok</code> is <code>true</code> for any 2xx status.</Mini>
          <Card tint="white" className="sc-mini">
            A rejected promise that nobody catches is an <strong>unhandled rejection</strong>. Modern Node <strong>exits</strong> on it, taking the server down.
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'parallel',
    part: 'B',
    title: 'One after another, or all at once?',
    bg: 'offwhite',
    lead: 'Three independent database calls. Same work, very different wait.',
    remember: 'Independent calls: Promise.all (≈ slowest one). Dependent calls: await one by one.',
    scene: X.parallel,
  },
  {
    id: 'fetch',
    part: 'B',
    title: 'Calling an API from Node',
    bg: 'blue',
    lead: 'fetch is built into Node 18 and newer. Same API as in the browser.',
    remember: 'await fetch(url) → check res.ok → await res.json(). Top-level await works in module files.',
    body: (
      <>
        <div className="sg2 wide-left">
          <Code
            title="get-post.js"
            code={`
const API = 'https://jsonplaceholder.typicode.com';

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
          <Code
            out
            lang="text"
            title="$ node get-post.js"
            code={`
200 application/json; charset=utf-8
[ 'userId', 'id', 'title', 'body' ]
201 { title: 'Hack Night', userId: 1, id: 101 }`}
          />
        </div>
        <Demo n="7">Run it, then change the id to 9999 and point out that <code>fetch</code> didn’t throw: the status is 404.</Demo>
      </>
    ),
  },

  /* ================= PART C · Node.js & npm ================= */
  {
    id: 'what-node',
    part: 'C',
    title: 'What is Node.js?',
    bg: 'offwhite',
    lead: 'Not a language and not a framework. A runtime: the program that runs your JavaScript.',
    remember: 'Node = V8 (runs JS) + libuv (event loop, files, network) + built-in modules.',
    body: (
      <>
        <Flow
          nodes={[
            { tag: 'You write', title: 'Your JS', sub: 'server.js', tint: 'yellow' },
            { tag: 'Engine', title: 'V8', sub: 'Turns JS into machine code', tint: 'blue' },
            { tag: 'Helper', title: 'libuv', sub: 'Event loop, timers, files, network', tint: 'pink' },
            { tag: 'Toolbox', title: 'Built-ins', sub: '`fs` `http` `path` `crypto`', tint: 'green' },
          ]}
          arrows={['runs on', 'waits via', 'offers']}
        />
        <div className="table-wrap s-table mt">
          <table>
            <thead><tr><th></th><th>Browser</th><th>Node.js</th></tr></thead>
            <tbody>
              <tr><td>Runs</td><td>on the user’s device</td><td>on your laptop or a server</td></tr>
              <tr><td>Has</td><td><code>document</code>, <code>window</code>, clicks</td><td><code>fs</code>, <code>http</code>, <code>process</code></td></tr>
              <tr><td>Both have</td><td colSpan={2}><code>console</code>, <code>fetch</code>, <code>setTimeout</code>, <code>JSON</code>, promises, modules</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'run-node',
    part: 'C',
    title: 'Running JavaScript with Node',
    bg: 'pink',
    lead: 'Three ways: try one line, run a file, or re-run it every time you save.',
    remember: 'node → REPL · node file.js → run · node --watch file.js → restart on save.',
    body: (
      <div className="sg2">
        <Code
          lang="bash"
          title="Terminal"
          code={`
node -v                  # v22.x or newer
node                     # REPL: type JS, see results
> 2 + 2
4
> .exit

node hello.js            # run a file once
node --watch server.js   # re-run on every save
node greet.js Asha       # pass arguments`}
        />
        <div className="stack">
          <Code
            title="greet.js"
            code={`
const name = process.argv[2] ?? 'stranger';
console.log(\`Hello, \${name}!\`);
console.log('Node', process.version, 'on', process.platform);`}
          />
          <Mini tint="yellow"><code>process</code> is Node’s view of the running program: arguments, environment, version, exit.</Mini>
          <Mini><kbd>Ctrl</kbd>+<kbd>C</kbd> stops a running program, including a server.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'built-ins',
    part: 'C',
    title: 'Built-in modules',
    bg: 'offwhite',
    lead: 'Node’s standard library. Nothing to install: just import with the node: prefix.',
    remember: 'node:fs/promises for files, node:path for paths, node:http for servers. Always await file work.',
    body: (
      <div className="sg2 wide-left">
        <Code
          title="store.js"
          code={`
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(import.meta.dirname, 'events.json');

export async function loadEvents() {
  const text = await readFile(file, 'utf8');
  return JSON.parse(text);
}

export async function saveEvents(events) {
  await writeFile(file, JSON.stringify(events, null, 2));
}`}
        />
        <div className="stack">
          {[
            ['node:fs/promises', 'Read and write files', 'yellow'],
            ['node:path', 'Join paths safely on any OS', 'white'],
            ['node:http', 'Make a server (Part E)', 'pink'],
            ['node:crypto', 'Random IDs, hashing (Phase 6)', 'blue'],
            ['node:os', 'Info about the machine', 'white'],
          ].map(([m, d, tint]) => (
            <Mini key={m} tint={tint}><code>{m}</code> {d}</Mini>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'npm',
    part: 'C',
    title: 'npm and package.json',
    bg: 'yellow',
    lead: 'npm installs other people’s code. package.json is your project’s ID card.',
    remember: 'npm init -y makes package.json. dependencies = needed to run; devDependencies = only while developing.',
    body: (
      <div className="sg2 wide-left">
        <Code
          lang="json"
          title="package.json"
          code={`
{
  "name": "campus-events",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch --env-file=.env server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "dayjs": "^1.11.23"
  },
  "devDependencies": {
    "prettier": "^3.9.9"
  }
}`}
        />
        <div className="stack">
          <Mini tint="white"><code>npm init -y</code> creates this file with defaults.</Mini>
          <Mini tint="white"><code>"type": "module"</code> lets you use <code>import</code> / <code>export</code>.</Mini>
          <Mini tint="white"><code>scripts</code> are shortcuts: <code>npm run dev</code>.</Mini>
          <Mini tint="blue"><code>npm install dayjs</code> adds to <strong>dependencies</strong>; <code>npm install -D prettier</code> adds to <strong>devDependencies</strong>.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'npm-install',
    part: 'C',
    title: 'What npm install actually does',
    bg: 'offwhite',
    lead: 'Four places change every time you install a package.',
    remember: 'Registry → node_modules/ → package.json (range) → package-lock.json (exact). Never commit node_modules.',
    scene: X.npmInstall,
  },
  {
    id: 'versions',
    part: 'C',
    title: 'Versions and the lock file',
    bg: 'offwhite',
    lead: 'Three numbers, each with a promise about what changed.',
    remember: 'MAJOR.MINOR.PATCH · ^ allows new minor + patch · commit the lock file, never node_modules.',
    body: (
      <>
        <div className="semver">
          <span className="sv tint-pink"><b>1</b><small>MAJOR · breaking changes</small></span>
          <span className="sv-dot">.</span>
          <span className="sv tint-yellow"><b>11</b><small>MINOR · new features</small></span>
          <span className="sv-dot">.</span>
          <span className="sv tint-green"><b>23</b><small>PATCH · bug fixes</small></span>
        </div>
        <div className="sg3 mt">
          <Mini tint="white"><code>^1.11.23</code> accepts <strong>1.11.23 up to (not including) 2.0.0</strong>. The npm default.</Mini>
          <Mini tint="white"><code>~1.11.23</code> accepts <strong>1.11.x only</strong>: patches, no new features.</Mini>
          <Mini tint="white"><code>1.11.23</code> exactly that version, nothing else.</Mini>
          <Mini tint="blue"><strong>package-lock.json</strong> pins the exact version of every package. <strong>Commit it.</strong></Mini>
          <Mini tint="pink"><strong>node_modules/</strong> can be rebuilt any time. <strong>Never commit it.</strong></Mini>
          <Mini tint="yellow"><code>npm ci</code> installs exactly what the lock file says. Used on servers and in CI.</Mini>
        </div>
      </>
    ),
  },
  {
    id: 'scripts',
    part: 'C',
    title: 'npm scripts and npx',
    bg: 'green',
    lead: 'Name your common commands once, and run them the same way on every machine.',
    remember: 'npm run <name> runs a script. npm start / npm test need no "run". npx runs a package without installing it.',
    body: (
      <div className="sg2">
        <Code
          lang="bash"
          title="Terminal"
          code={`
npm run dev      # node --watch --env-file=.env server.js
npm start        # node server.js ("start" needs no "run")
npm test         # same for "test"

npx cowsay "Hello backend"   # download, run once, done
npx prettier --write .       # run a tool from devDependencies`}
        />
        <div className="stack">
          <Mini tint="white">A new teammate runs <code>npm install</code> then <code>npm run dev</code>. They don’t need to know the long command.</Mini>
          <Mini tint="white">Scripts can use tools from <code>node_modules/.bin</code> without a path.</Mini>
          <Mini tint="yellow">Deploying later (Phase 8)? The host usually runs <code>npm ci</code> then <code>npm start</code>.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'env',
    part: 'C',
    title: 'Environment variables',
    bg: 'offwhite',
    lead: 'Settings that change between your laptop and the real server (ports, database URLs, secret keys) never go in the code.',
    remember: '.env holds settings, process.env reads them, .env never goes into Git. Values are always strings.',
    body: (
      <>
        <Flow
          nodes={[
            { tag: 'File', title: '.env', sub: '`PORT=4000`', tint: 'yellow' },
            { tag: 'Start', title: 'node --env-file', sub: 'Loads it at startup', tint: 'blue' },
            { tag: 'Object', title: 'process.env', sub: "`{ PORT: '4000' }`", tint: 'pink' },
            { tag: 'Your code', title: 'server.js', sub: 'Reads the value', tint: 'green' },
          ]}
          arrows={['read by', 'fills', 'used in']}
        />
        <div className="sg2 mt">
          <Code
            lang="bash"
            title=".env (never committed)"
            code={`
PORT=4000
DATABASE_URL=postgres://localhost/campus
API_KEY=sk_test_replace_me`}
          />
          <Code
            title="server.js"
            code={`
const port = Number(process.env.PORT) || 3000;
const key = process.env.API_KEY;
if (!key) throw new Error('API_KEY is missing');`}
          />
          <Mini tint="yellow">Commit a <code>.env.example</code> with the names and fake values, so others know what to set.</Mini>
          <Mini>Everything in <code>process.env</code> is a <strong>string</strong>: convert numbers yourself.</Mini>
        </div>
      </>
    ),
  },

  /* ================= PART D · Git & GitHub ================= */
  {
    id: 'git-why',
    part: 'D',
    title: 'Git: save points for your code',
    bg: 'green',
    lead: 'Like saving a game before the boss fight. Break something? Go back to the last save.',
    remember: 'Git = the tool on your laptop that keeps history. GitHub = a website that hosts it online.',
    body: (
      <div className="sg2">
        <Card tint="white" className="versus">
          <span className="versus-code">Git</span>
          <h3 className="sc-title">The tool</h3>
          <ul>
            <li>Runs on your laptop, works offline</li>
            <li>Saves snapshots called <strong>commits</strong></li>
            <li>Shows exactly what changed, and when</li>
            <li>Lets you undo, compare, and try ideas safely</li>
          </ul>
        </Card>
        <Card tint="yellow" className="versus">
          <span className="versus-code">GitHub</span>
          <h3 className="sc-title">The website</h3>
          <ul>
            <li>Stores a copy of your repository online</li>
            <li>Backup if your laptop dies</li>
            <li>Where teams share and review code</li>
            <li>Where hosts deploy from (Phase 8)</li>
          </ul>
        </Card>
      </div>
    ),
  },
  {
    id: 'git-areas',
    part: 'D',
    title: 'Folder → staging → commit → GitHub',
    bg: 'offwhite',
    lead: 'Where your files go when you run add, commit and push.',
    remember: 'add = choose what to save · commit = save it locally · push = upload to GitHub.',
    scene: X.gitAreas,
  },
  {
    id: 'git-commands',
    part: 'D',
    title: 'The everyday commands',
    bg: 'offwhite',
    lead: 'Eight commands cover almost everything you’ll do this course.',
    remember: 'status → add → commit, again and again. git status is always safe to run.',
    body: (
      <div className="sg2 wide-left">
        <Code
          lang="bash"
          title="Terminal"
          code={`
# once per laptop
git config --global user.name "Asha Rao"
git config --global user.email "asha@example.com"

# once per project
git init

# every time you reach a good point
git status                  # what changed?
git diff                    # show the exact lines
git add .                   # stage everything (respects .gitignore)
git commit -m "Add 404 route"
git log --oneline           # history, one line each

git restore server.js       # throw away unsaved edits`}
        />
        <div className="stack">
          <Mini tint="yellow"><code>git status</code> tells you what to do next. Run it whenever you’re unsure.</Mini>
          <Mini tint="white"><strong>Small commits</strong>, often. One idea per commit.</Mini>
          <Mini tint="white">Messages say what the commit does: <em>“Add 404 route”</em>, <em>“Fix crash on empty body”</em>.</Mini>
          <Mini tint="pink"><code>git restore</code> deletes your uncommitted edits to that file. There’s no undo.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'gitignore',
    part: 'D',
    title: '.gitignore: what never goes in',
    bg: 'pink',
    lead: 'Some files must never reach GitHub. List them before your first commit.',
    remember: 'Ignore node_modules/ and .env before the first commit. A pushed secret is a leaked secret: change it.',
    body: (
      <div className="sg2">
        <Code
          lang="bash"
          title=".gitignore"
          code={`
node_modules/
.env
dist/
*.log
.DS_Store`}
        />
        <div className="stack">
          <Mini tint="white"><strong>node_modules/</strong>: huge, and rebuilt by <code>npm install</code>.</Mini>
          <Mini tint="white"><strong>.env</strong>: your passwords and API keys.</Mini>
          <Card tint="yellow" className="sc-mini">
            <strong>Pushed a secret by mistake?</strong> Automated bots scan public GitHub for keys all the time. Deleting the file in a new commit isn’t enough: it’s still in the history. <strong>Revoke the key and make a new one.</strong>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'push',
    part: 'D',
    title: 'Push to GitHub',
    bg: 'offwhite',
    lead: 'Connect your local repository to one on GitHub, once. After that it’s just git push.',
    remember: 'remote add origin once, push -u once, then plain git push after each commit.',
    body: (
      <div className="sg2">
        <Code
          lang="bash"
          title="The first push"
          code={`
# on github.com: New repository → no README → Create

git remote add origin https://github.com/you/campus-events.git
git branch -M main
git push -u origin main

# every time after that
git push`}
        />
        <div className="stack">
          <Code
            lang="bash"
            title="Or with the GitHub CLI"
            code={`
gh auth login
gh repo create campus-events --public --source=. --push`}
          />
          <Mini tint="blue"><strong>origin</strong> is just the nickname for “my repo on GitHub”.</Mini>
          <Mini tint="yellow">Refresh the GitHub page: your files and commit messages are there, and <code>.env</code> is not.</Mini>
        </div>
      </div>
    ),
  },

  /* ================= PART E · A server with no framework ================= */
  {
    id: 'six-lines',
    part: 'E',
    title: 'A server in six lines',
    bg: 'cream',
    lead: 'Everything from Phase 0, now on your laptop: a program that listens on a port and answers.',
    remember: 'createServer((req, res) => …) runs once per request. listen(3000) opens the door.',
    body: (
      <>
        <div className="sg2">
          <Code
            title="server.js"
            code={`
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end('Hello from Node!');
});

server.listen(3000, () => console.log('Listening on 3000'));`}
          />
          <Code
            out
            lang="http"
            title="$ curl -i localhost:3000"
            code={`
HTTP/1.1 200 OK
Date: Mon, 05 Oct 2026 10:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 16

Hello from Node!`}
          />
        </div>
        <div className="sg3 mt">
          <Mini tint="yellow">Your function runs <strong>once for every request</strong>, with a fresh <code>req</code> and <code>res</code>.</Mini>
          <Mini>Node filled in the status (200) and headers for you.</Mini>
          <Mini tint="pink">Forget <code>res.end()</code> and the browser spins forever: the response never finishes.</Mini>
        </div>
      </>
    ),
  },
  {
    id: 'req-res',
    part: 'E',
    title: 'req in, res out',
    bg: 'offwhite',
    lead: 'req is the request from Phase 0 as an object. res is the response you build.',
    remember: 'Read req.method, req.url, req.headers. Build res with a status, headers, then end(body).',
    body: (
      <div className="sg2">
        <Card>
          <Tag tint="blue">req · what came in</Tag>
          <div className="kv-list">
            <span><code>req.method</code></span><span>'GET', 'POST'…</span>
            <span><code>req.url</code></span><span>'/events/12?sort=date'</span>
            <span><code>req.headers</code></span><span>{'{ host, \'content-type\', … }'} (lower-case keys)</span>
            <span><code>req.on('data')</code></span><span>the body, in chunks</span>
          </div>
        </Card>
        <Card>
          <Tag tint="green">res · what goes out</Tag>
          <div className="kv-list">
            <span><code>res.statusCode = 404</code></span><span>set the status</span>
            <span><code>res.setHeader(k, v)</code></span><span>add one header</span>
            <span><code>res.writeHead(201, {'{…}'})</code></span><span>status + headers together</span>
            <span><code>res.end(text)</code></span><span>send the body and finish</span>
          </div>
        </Card>
        <Code
          title="a helper you’ll want in every raw server"
          code={`
function send(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}`}
        />
        <Mini tint="yellow">Split the URL properly: <code>new URL(req.url, 'http://localhost')</code> gives you <code>.pathname</code> and <code>.searchParams</code>.</Mini>
      </div>
    ),
  },
  {
    id: 'routing',
    part: 'E',
    title: 'Routing by hand',
    bg: 'offwhite',
    lead: 'A “route” is just an if-statement that matches a method and a path.',
    remember: 'Check method + path, return early, and always finish with a 404 for anything unknown.',
    body: (
      <div className="sg2 wide-left">
        <Code
          title="server.js"
          code={`
const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && pathname === '/health') {
    return send(res, 200, { status: 'ok' });
  }
  if (req.method === 'GET' && pathname === '/events') {
    return send(res, 200, events);
  }
  const match = pathname.match(/^\\/events\\/(\\d+)$/);
  if (req.method === 'GET' && match) {
    const event = events.find((e) => e.id === Number(match[1]));
    if (!event) return send(res, 404, { error: 'Event not found' });
    return send(res, 200, event);
  }
  send(res, 404, { error: \`No route for \${req.method} \${pathname}\` });
});`}
        />
        <div className="stack">
          <Mini tint="white"><code>return send(…)</code> stops there, so two responses are never sent.</Mini>
          <Mini tint="yellow">The regex pulls <code>12</code> out of <code>/events/12</code>. It arrives as a <strong>string</strong>: <code>Number()</code> it.</Mini>
          <Mini tint="pink">This works, but imagine 40 routes. Express turns all of this into <code>app.get('/events/:id', …)</code>.</Mini>
        </div>
      </div>
    ),
  },
  {
    id: 'body-stream',
    part: 'E',
    title: 'Reading a POST body',
    bg: 'offwhite',
    lead: 'The body arrives in chunks. You collect them, then parse.',
    remember: 'data events add chunks; end means complete; JSON.parse can throw, so reply 400 on bad JSON.',
    scene: X.bodyStream,
  },
  {
    id: 'one-thread',
    part: 'E',
    title: 'Never block the thread',
    bg: 'offwhite',
    lead: 'Two requests, one thread. Watch what a slow loop does to everyone else.',
    remember: 'await on I/O frees the thread. A long CPU loop blocks every user.',
    scene: X.oneThread,
  },
  {
    id: 'mini-api',
    part: 'E',
    title: 'The mini Campus Events API',
    bg: 'yellow',
    lead: 'Today’s finished project: a real JSON API with no framework at all.',
    remember: 'You built every piece Express will give you: routing, JSON, status codes, body parsing, 404s.',
    body: (
      <div className="sg2">
        <Card>
          <Tag tint="blue">The menu</Tag>
          <div className="endpoint-list">
            {[
              ['GET', '/health', '200 { status: ok }'],
              ['GET', '/events', '200 all events'],
              ['GET', '/events/:id', '200 one, or 404'],
              ['POST', '/events', '201 created, or 400'],
            ].map(([m, p, d]) => (
              <div className="endpoint" key={m + p}>
                <span className={`method m-${m.toLowerCase()}`}>{m}</span>
                <code>{p}</code>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </Card>
        <Code
          lang="bash"
          title="Test it"
          code={`
curl -i localhost:3000/health
curl -i localhost:3000/events
curl -i localhost:3000/events/2
curl -i localhost:3000/events/99
curl -i -X POST localhost:3000/events \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Code Jam","price":0}'`}
        />
        <Demo n="14">The full <code>server.js</code> is on the Live demos page. Build it live, then break it with bad JSON and watch the 400.</Demo>
      </div>
    ),
  },
  {
    id: 'why-express',
    part: 'E',
    title: 'Why this hurts (and what Express fixes)',
    bg: 'offwhite',
    lead: 'You just did by hand what a framework does for you. Now you know what it’s doing.',
    remember: 'Express = routing, params, body parsing, JSON replies and middleware, on top of node:http.',
    body: (
      <div className="sg2 wide-right">
        <div className="stack">
          {[
            ['Routing', 'if-statements and regex for every path'],
            ['Params', 'pull 12 out of /events/12 yourself'],
            ['Bodies', 'collect chunks, parse, catch bad JSON'],
            ['Replies', 'writeHead + JSON.stringify every time'],
            ['Shared steps', 'logging or auth copied into every route'],
          ].map(([t, d]) => (
            <Mini key={t} tint="pink"><strong>{t}:</strong> {d}</Mini>
          ))}
        </div>
        <Code
          title="Phase 2 preview: the same API in Express"
          code={`
import express from 'express';
const app = express();
app.use(express.json());           // bodies: done

app.get('/events/:id', (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) return res.status(404).json({ error: 'Not found' });
  res.json(event);                  // headers + stringify: done
});

app.listen(3000);`}
        />
      </div>
    ),
  },
  {
    id: 'try',
    part: 'E',
    title: 'Try it yourself',
    bg: 'green',
    lead: 'The lab sheet has every step. Six missions, in this order.',
    remember: 'Predict, run, compare. Every mission ends with something working on your own laptop.',
    body: (
      <div className="sg3">
        {[
          ['1', 'JS warm-up', 'Predict then run 8 snippets in the Node REPL.', 'yellow'],
          ['2', 'Async order', 'Predict the output of 3 async puzzles, then call a real API.', 'blue'],
          ['3', 'npm project', 'npm init, install a package, add scripts, use --watch.', 'pink'],
          ['4', 'Config with .env', 'Move the port and a greeting into .env.', 'white'],
          ['5', 'Git & GitHub', 'Commit three times and push, with .env safely ignored.', 'cream'],
          ['6', 'Raw server', 'Build /health, /events and /events/:id; test with curl.', 'green'],
        ].map(([n, t, d, tint]) => (
          <Card key={n} tint={tint} className="mission">
            <span className="icon-sq tint-white">{n}</span>
            <h3 className="sc-title">{t}</h3>
            <p>{d}</p>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: 'checkpoint',
    part: 'E',
    title: 'Checkpoint',
    bg: 'offwhite',
    lead: 'Answer these in your own words before we move on.',
    remember: 'If you can explain the event loop with the waiter, you’ve got it.',
    body: (
      <ol className="numlist checkpoint-list">
        <li><div>What’s the difference between <strong>const</strong> and <strong>let</strong>? Can you change a property of a <code>const</code> object?</div></li>
        <li><div>Why does <code>setTimeout(fn, 0)</code> still run <strong>after</strong> the code below it?</div></li>
        <li><div>What does <strong>await</strong> do to the function it’s in, and to the rest of the server?</div></li>
        <li><div>Why do we commit <strong>package-lock.json</strong> but never <strong>node_modules/</strong> or <strong>.env</strong>?</div></li>
        <li><div>Walk through what your raw server does when <code>GET /events/99</code> arrives.</div></li>
      </ol>
    ),
  },
  {
    id: 'next',
    part: 'E',
    title: 'Next: your first Express server',
    bg: 'black',
    layout: 'close',
    remember: 'Phase 2: the same API in Express, with routes, middleware and routers.',
    body: (
      <div className="close">
        <div className="close-frame">
          <span className="pill tint-yellow">Coming up · Phase 2</span>
          <h2 className="display close-title">You built a server by hand. Next, you let Express do the boring parts.</h2>
          <pre className="close-code">{`app.get('/events/:id', (req, res) => {
  res.json(findEvent(req.params.id));
});`}</pre>
        </div>
        <span className="star close-star">NEXT</span>
      </div>
    ),
  },
];
