/* Phase 1 checkpoint quiz. `answer` is the index of the correct option. */
export const mcq = [
  {
    q: '`const event = { seats: 60 }; event.seats = 59;` What happens?',
    options: ['TypeError: Assignment to constant variable', 'It works: event.seats is now 59', 'event.seats stays 60 silently', 'A new object is created'],
    answer: 1,
    why: '`const` stops the **name** being pointed at something else. The object it points to can still change.',
  },
  {
    q: 'Nothing in the array matches. What do `filter` and `find` return?',
    options: ['`[]` and `undefined`', '`undefined` and `[]`', '`null` and `null`', 'Both throw an error'],
    answer: 0,
    why: '`filter` always returns an array (maybe empty). `find` returns the first match, or `undefined`.',
  },
  {
    q: "Output order? `console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D');`",
    options: ['A B C D', 'A C B D', 'A D C B', 'A D B C'],
    answer: 2,
    why: 'Synchronous code first (A, D), then microtasks like promise callbacks (C), then timer tasks (B).',
  },
  {
    q: 'When does the callback in `setTimeout(fn, 0)` run?',
    options: ['Immediately, before the next line', 'After exactly 0 ms, even mid-function', 'Only when the call stack is empty and it’s the next task', 'Never: 0 ms timers are ignored'],
    answer: 2,
    why: 'The callback waits in the task queue. The event loop only runs it once all current code has finished.',
  },
  {
    q: 'What does `await` do while a database query is in progress?',
    options: ['Freezes the whole server until the query returns', 'Pauses only that async function; other code and requests keep running', 'Runs the query on a second JavaScript thread', 'Cancels the query if it takes too long'],
    answer: 1,
    why: 'The function steps off the call stack and resumes later via the microtask queue. The thread is free meanwhile.',
  },
  {
    q: '`const res = await fetch(url)` and the server answers **404**. What happens?',
    options: ['fetch throws an error', 'The promise fulfils; `res.status` is 404 and `res.ok` is false', 'res is undefined', 'Node exits'],
    answer: 1,
    why: 'fetch only rejects when there is no response at all (offline, bad domain). Always check `res.ok`.',
  },
  {
    q: 'Three independent calls, each about 1 second, wrapped in `Promise.all`. Total time?',
    options: ['About 1 second', 'About 2 seconds', 'About 3 seconds', 'It depends on the order in the array'],
    answer: 0,
    why: 'All three start at once, so you wait roughly as long as the slowest one.',
  },
  {
    q: 'Which of these must **never** be committed to Git?',
    options: ['package.json', 'package-lock.json', '.gitignore', '.env'],
    answer: 3,
    why: '`.env` holds secrets. (`node_modules/` is the other one to ignore.) The other three are committed.',
  },
  {
    q: '`"dayjs": "^1.11.23"` in package.json. Which version could npm install?',
    options: ['1.10.0', '1.12.4', '2.0.0', 'Only 1.11.23 exactly'],
    answer: 1,
    why: '`^` allows newer minor and patch versions (up to, not including, 2.0.0). 1.12.4 fits; 2.0.0 could have breaking changes.',
  },
  {
    q: 'What does `git add server.js` do?',
    options: ['Uploads server.js to GitHub', 'Saves a commit', 'Stages the current version of server.js for the next commit', 'Adds server.js to .gitignore'],
    answer: 2,
    why: '`add` chooses what goes into the next snapshot; `commit` saves it locally; `push` uploads to GitHub.',
  },
  {
    q: 'With `PORT=4000` in `.env`, what is `typeof process.env.PORT`?',
    options: ["'number'", "'string'", "'undefined' always", "'object'"],
    answer: 1,
    why: 'Every environment variable is a string. Convert it: `Number(process.env.PORT)`.',
  },
  {
    q: 'A route handler in a raw node:http server never calls `res.end()`. What does the client see?',
    options: ['An automatic 200 OK', 'An automatic 404', 'It keeps waiting until it times out', 'The server crashes'],
    answer: 2,
    why: 'The response is never finished, so the client just waits. Every path through a handler must end the response exactly once.',
  },
];

export const short = [
  {
    q: 'Explain the event loop using the one-waiter restaurant. Why does `setTimeout(fn, 0)` run after the lines below it?',
    model: 'JavaScript has one waiter (one thread, one call stack). Slow work is handed to the kitchen (Node’s timers, network, files), and when it’s ready its callback waits in a queue. The waiter only picks up a queued callback once it has finished what it’s doing now, i.e. the call stack is empty. So even a 0 ms timer waits for the current code to finish.',
  },
  {
    q: 'Why is a 5-second `while` loop inside a request handler far worse than `await`ing a 5-second database query?',
    model: 'The loop keeps the single JavaScript thread busy for 5 seconds, so no other request can be handled: every user waits. With await, the query is handed off, the function pauses, and the thread is free to serve other requests until the result arrives.',
  },
  {
    q: 'Why do we commit `package-lock.json` but never `node_modules/`?',
    model: 'node_modules is huge and can be rebuilt exactly with npm install (or npm ci) from package.json plus the lock file. The lock file pins exact versions so every machine installs identical code; without it, installs could drift to newer versions.',
  },
  {
    q: 'Walk through what your raw server does when `GET /events/99` arrives and no event 99 exists.',
    model: 'Node calls the createServer callback with req and res. We parse the URL to get the pathname, skip the /health and /events checks, match /events/(digits) with the regex, convert "99" to a number and look it up with find. It returns undefined, so we call send(res, 404, { error: "Event 99 not found" }), which sets the status and Content-Type and ends the response with JSON.',
  },
];
