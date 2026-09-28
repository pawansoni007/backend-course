/* Revision deck for Phase 1. `q` = front, `a` = back, `more` = optional extra line. */
export const topics = [
  { id: 'js', label: 'JavaScript' },
  { id: 'async', label: 'Async & event loop' },
  { id: 'node', label: 'Node & npm' },
  { id: 'git', label: 'Git' },
  { id: 'server', label: 'Raw server' },
];

const raw = [
  // javascript
  ['js', 'const or let: which by default?', '**const.** Use `let` only when you really reassign the name.', 'Never `var` in new code.'],
  ['js', 'Can you change a property of a `const` object?', '**Yes.** `const` locks the name, not the object behind it.'],
  ['js', '=== or ==?', 'Always **===**. `==` converts types first (`\'1\' == 1` is true).'],
  ['js', 'List the falsy values.', '`false`, `0`, `\'\'`, `null`, `undefined`, `NaN`. Everything else is truthy.'],
  ['js', 'null vs undefined?', '`null` = empty **on purpose**. `undefined` = **never given** a value.'],
  ['js', 'What does `(a) => { a * 2 }` return?', '`undefined`. With braces you must write `return`.'],
  ['js', 'What is a callback?', 'A function you **hand to other code** to be called later: `setTimeout(() => …, 1000)`, every Express route.'],
  ['js', 'What is the call stack?', 'The pile of functions **currently running**. A call pushes a box; `return` pops it. Only the top one runs.'],
  ['js', 'Two passes when JS runs a file?', '**Memory pass:** make a slot for every name (functions stored whole). **Run pass:** execute line by line.'],
  ['js', '`const b = a` where a is an object. How many objects?', '**One.** Both names point to the same object (same locker).'],
  ['js', 'How do you copy an object so changes don’t leak?', 'Spread into a new one: `{ ...event, price: 0 }`. (Shallow: nested objects are still shared.)'],
  ['js', 'What does `?.` do?', 'Optional chaining: `a?.b` returns `undefined` instead of **crashing** if `a` is null/undefined.'],
  ['js', '`0 ?? 5` vs `0 || 5`?', '`0 ?? 5` is **0**; `0 || 5` is **5**. `??` only replaces null/undefined.'],
  ['js', 'map vs filter vs find?', '**map**: transform every item. **filter**: keep items that pass. **find**: first match or `undefined`.'],
  ['js', 'What does `reduce` do?', 'Boils an array down to **one value**: `events.reduce((sum, e) => sum + e.price, 0)`.'],
  ['js', 'Why is `[3, 1, 10].sort()` wrong for numbers?', 'Default sort compares as **text**: `[1, 10, 3]`. Use `.sort((a, b) => a - b)`.'],
  ['js', 'How do you share code between files?', '`export` it from one file, `import { name } from \'./file.js\'` in another. Needs `"type": "module"`.'],
  ['js', 'What happens to an error nobody catches in Node?', 'Node prints it and the **process exits**. For a server: down for everyone.'],

  // async
  ['async', 'Why do servers need async code?', 'They spend most of their time **waiting** (database, other APIs, files). Async lets one thread serve others meanwhile.'],
  ['async', 'Blocking vs non-blocking, in one line?', 'Blocking **stands and waits**; non-blocking **hands the work off** and carries on until a callback says it’s done.'],
  ['async', 'What is the event loop’s one rule?', 'Callbacks only run when the **call stack is empty**.'],
  ['async', 'Does `setTimeout(fn, 0)` run immediately?', '**No.** It waits in the task queue until the current code finishes.'],
  ['async', 'Microtask queue vs task queue: which goes first?', '**Microtasks** (promise callbacks, code after await) are all run before the next **task** (timers, I/O).'],
  ['async', 'Output of: log A · setTimeout B · promise C · log D?', '**A D C B.**'],
  ['async', 'Three states of a promise?', '**Pending**, then settles once as **fulfilled** (value) or **rejected** (error).'],
  ['async', 'What does an `async` function always return?', 'A **promise**, even if you `return 5`.'],
  ['async', 'What does `await` pause?', 'Only **its own function**. The thread is free for other code until the promise settles.'],
  ['async', 'Forgot `await` before fetch. What do you get?', 'A `Promise { <pending> }` instead of the response.'],
  ['async', 'Does fetch throw on 404?', '**No.** It fulfils with `res.status` 404. Check `res.ok`. It only rejects with no response at all.'],
  ['async', 'Promise.all vs awaiting one by one?', '`Promise.all` starts all at once (≈ slowest one). One by one adds them up. Use one by one only when a call needs the previous result.'],
  ['async', 'What is an unhandled rejection?', 'A rejected promise **nobody catches**. Modern Node **exits** on it.'],
  ['async', 'Callback hell is…?', 'Callbacks nested inside callbacks, a growing pyramid. **Promises and async/await** fix it.'],

  // node & npm
  ['node', 'Node.js is a…?', '**Runtime**: V8 (runs JS) + libuv (event loop, files, network) + built-in modules. Not a language or framework.'],
  ['node', 'Browser JS vs Node JS?', 'Browser has `document` and `window`. Node has `fs`, `http`, `process`. Both have `console`, `fetch`, promises.'],
  ['node', 'Run a file and restart it on every save?', '`node --watch server.js`'],
  ['node', 'Where are command-line arguments?', '`process.argv`: `node greet.js Asha` → `process.argv[2]` is `\'Asha\'`.'],
  ['node', 'Read a file the modern way?', "`import { readFile } from 'node:fs/promises'` then `await readFile(file, 'utf8')`."],
  ['node', 'What does ENOENT mean?', '**File not found** (“Error NO ENTry”).'],
  ['node', 'What does `npm install dayjs` change?', 'Downloads into **node_modules/**, adds a range to **package.json**, pins the exact version in **package-lock.json**.'],
  ['node', 'dependencies vs devDependencies?', '**dependencies**: needed to run. **devDependencies** (`-D`): only while developing (formatters, test tools).'],
  ['node', 'MAJOR.MINOR.PATCH means?', 'Breaking changes . new features . bug fixes.'],
  ['node', 'What does `^1.11.23` allow?', 'Any version from 1.11.23 up to, not including, **2.0.0**.'],
  ['node', 'npm install vs npm ci?', '`npm ci` installs **exactly** what the lock file says (fresh node_modules). Used on servers and in CI.'],
  ['node', 'Why is node_modules never committed?', 'Huge, and **rebuilt exactly** by `npm install` from package.json + package-lock.json.'],
  ['node', 'How do you load a .env file?', '`node --env-file=.env server.js`, then read `process.env.NAME`.'],
  ['node', 'Type of every value in process.env?', '**String.** `Number(process.env.PORT)` for numbers.'],
  ['node', 'What is .env.example for?', 'A **committed** list of the variable names with fake values, so others know what to set.'],

  // git
  ['git', 'Git vs GitHub?', '**Git**: the tool on your laptop that keeps history. **GitHub**: a website that hosts repos online.'],
  ['git', 'The four places a change passes through?', 'Working folder → **staging area** (`git add`) → **local repo** (`git commit`) → **GitHub** (`git push`).'],
  ['git', 'The safest command to run when unsure?', '`git status`. It changes nothing and tells you what to do next.'],
  ['git', 'What goes in .gitignore for a Node project?', '`node_modules/` and `.env` (plus things like `dist/` and `*.log`).'],
  ['git', 'You pushed an API key. Fix?', '**Revoke it and make a new one.** Deleting the file later doesn’t remove it from history.'],
  ['git', 'A good commit message?', 'Says what it does, in a few words: “Add 404 route”, “Fix crash on empty body”.'],

  // raw server
  ['server', 'Smallest Node server?', "`http.createServer((req, res) => res.end('Hi')).listen(3000)`"],
  ['server', 'How often does the createServer callback run?', '**Once per request**, with a fresh `req` and `res`.'],
  ['server', 'Three parts of req you check for routing?', '`req.method`, the **path** from `req.url` (use `new URL(req.url, …)`), and `req.headers` when needed.'],
  ['server', 'Send JSON with node:http?', "`res.writeHead(200, { 'Content-Type': 'application/json' })` then `res.end(JSON.stringify(data))`."],
  ['server', 'Forget res.end()?', 'The client **waits forever** (until it times out).'],
  ['server', 'How does a POST body arrive in raw Node?', 'In **chunks**: collect on `data`, finish on `end`, then `JSON.parse` (in try/catch → 400 if broken).'],
  ['server', 'EADDRINUSE means?', 'The **port is already taken** by another program.'],
  ['server', 'What does Express add on top of node:http?', 'Routing with params, body parsing, `res.json()`, status helpers and **middleware**.'],
];

export const flashcards = raw.map(([topic, q, a, more], i) => ({ id: 'p1-' + i, topic, q, a, more }));
