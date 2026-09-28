/* ===========================================================
   PHASE 1 ANIMATED EXPLAINERS
   Each one is data for <Scene>. Ops per frame:
     add: [[panel, token]]   move: [[id, panel, patch?]]
     set: [[id, patch]]      remove: [id]      clear: [panel]
     log: 'text'             line: n | [n, m]  say: 'narration'
     loop: true (event loop spins)
   A token { from: 'otherId' } flies out of that block when added.
   =========================================================== */

const T = (id, text, tint = 'white', extra = {}) => ({ id, text, tint, ...extra });
const M = (id, text, value, extra = {}) => ({ id, text, value, ...extra });
const UNINIT = '⟨not ready yet⟩';

/* ---------- A · the call stack ---------- */
export const callStack = {
  id: 'call-stack',
  title: 'The call stack',
  blurb: 'How JavaScript runs a file: a memory pass, then line by line, one function box at a time.',
  file: 'tax.js',
  code: `
const price = 250;

function addTax(amount) {
  const tax = amount * 0.18;
  return amount + tax;
}

const total = addTax(price);
console.log(total);`,
  panels: [
    { id: 'stack', label: 'Call stack', kind: 'stack' },
    { id: 'gmem', label: 'Global memory', kind: 'memory' },
    { id: 'fmem', label: 'addTax’s memory', kind: 'memory', empty: 'only exists while addTax runs' },
    { id: 'console', label: 'Console', kind: 'console' },
  ],
  areas: ['code gmem stack', 'code fmem stack', 'code console console'],
  cols: '1.25fr 1fr 0.85fr',
  frames: [
    { say: 'Before running a single line, JavaScript creates the **global execution context**: a box with its own memory. That box goes on the **call stack**.', add: [['stack', T('g', 'global', 'yellow')]] },
    {
      say: '**Pass 1: memory.** JS scans the whole file and makes a slot for every name. Functions are stored whole. `const` names exist but can’t be used yet.',
      add: [['gmem', M('price', 'price', UNINIT)], ['gmem', M('addTax', 'addTax', 'ƒ addTax(amount)')], ['gmem', M('total', 'total', UNINIT)]],
    },
    { line: 1, say: '**Pass 2: run.** Line 1 puts `250` into `price`.', set: [['price', { value: '250' }]] },
    { line: 3, say: 'Lines 3–6 declare a function. It’s already in memory, so JS jumps over it. Nothing inside runs yet.' },
    {
      line: 8,
      say: 'Line 8 **calls** `addTax(price)`. A brand-new execution context is made for this call and **pushed** on top of the stack, with its own memory.',
      add: [['stack', T('fn', 'addTax(250)', 'pink')], ['fmem', M('amount', 'amount', '250')], ['fmem', M('tax', 'tax', UNINIT)]],
    },
    { line: 4, say: 'Inside the function: `250 * 0.18` is `45`, stored in `tax`.', set: [['tax', { value: '45' }]] },
    { line: 5, say: '`return` hands back `250 + 45`, which is `295`.', set: [['fn', { text: 'addTax → returns 295' }]] },
    {
      line: 8,
      say: 'The call is finished, so its box is **popped** off the stack and its memory is thrown away. `total` receives `295`.',
      remove: ['fn', 'amount', 'tax'],
      set: [['total', { value: '295' }]],
    },
    { line: 9, say: '`console.log(total)` is a function call too: pushed…', add: [['stack', T('log', 'console.log(295)', 'blue')]] },
    { line: 9, say: '…it prints `295`, and it’s popped.', remove: ['log'], log: '295' },
    { line: null, say: 'The file is done, so the global box is popped too. **Empty stack = nothing left to run.** Every call pushes a box; every return pops one.', remove: ['g'] },
  ],
};

/* ---------- A · values vs references ---------- */
export const references = {
  id: 'references',
  title: 'Values vs references',
  blurb: 'Why changing an object “over here” changes it “over there” too.',
  file: 'copy.js',
  code: `
let seats = 60;
let copy = seats;
copy = 59;

const event = { title: 'Hack Night', seats: 60 };
const same = event;
same.seats = 59;
console.log(event.seats);

const safe = { ...event, seats: 0 };`,
  panels: [
    { id: 'vars', label: 'Variables', kind: 'memory' },
    { id: 'heap', label: 'Objects live here (the heap)', kind: 'box', empty: 'no objects yet' },
    { id: 'console', label: 'Console', kind: 'console' },
  ],
  areas: ['code vars', 'code heap', 'code console'],
  cols: '1.25fr 1fr',
  frames: [
    { say: 'Two kinds of values. **Primitives** (numbers, strings, booleans) are stored right in the variable. **Objects and arrays** live in the heap, and the variable only holds their **address**.' },
    { line: 1, say: '`seats` holds the number `60` directly.', add: [['vars', M('seats', 'seats', '60')]] },
    { line: 2, say: '`copy = seats` copies the **value**. Now there are two separate 60s.', add: [['vars', M('copy', 'copy', '60', { from: 'seats' })]] },
    { line: 3, say: 'Changing `copy` doesn’t touch `seats`. It’s still 60.', set: [['copy', { value: '59' }]] },
    {
      line: 5,
      say: 'An object is created in the heap. Think of it as locker **#1**. `event` holds only the address: “locker #1”.',
      add: [['heap', T('o1', "{ title: 'Hack Night', seats: 60 }", 'green', { badge: 'locker #1' })], ['vars', M('event', 'event', '→ locker #1', { tint: 'green' })]],
    },
    { line: 6, say: '`same = event` copies the **address**, not the object. Both names now point at locker #1.', add: [['vars', M('same', 'same', '→ locker #1', { tint: 'green', from: 'event' })]] },
    { line: 7, say: 'Change the seats through `same`…', set: [['o1', { text: "{ title: 'Hack Night', seats: 59 }" }]] },
    { line: 8, say: '…and `event.seats` is 59 too. Same locker. **This is a classic bug:** a function edits an object it was given, and the caller’s object changes as well.', log: '59' },
    {
      line: 10,
      say: 'Spread `{ ...event }` builds a **new** object (locker #2) and copies the fields in. Changing `safe` can’t touch `event`. (It’s a shallow copy: nested objects are still shared.)',
      add: [['heap', T('o2', "{ title: 'Hack Night', seats: 0 }", 'blue', { badge: 'locker #2', from: 'o1' })], ['vars', M('safe', 'safe', '→ locker #2', { tint: 'blue' })]],
    },
  ],
};

/* ---------- A · map & filter ---------- */
export const mapFilter = {
  id: 'map-filter',
  title: 'filter and map, one item at a time',
  blurb: 'Watch each item go through your function and into a brand-new array.',
  file: 'free-events.js',
  code: `
const events = [
  { title: 'Hack Night', price: 0 },
  { title: 'Gala', price: 500 },
  { title: 'Code Jam', price: 0 },
];

const free = events.filter((e) => e.price === 0);

const titles = free.map((e) => e.title.toUpperCase());`,
  panels: [
    { id: 'in', label: 'events (original)', kind: 'queue' },
    { id: 'fn', label: 'Your function', kind: 'box', empty: 'waiting for an item', tint: 'cream' },
    { id: 'free', label: 'free (new array)', kind: 'queue' },
    { id: 'out', label: 'titles (new array)', kind: 'queue' },
  ],
  areas: ['code in', 'code fn', 'code free', 'code out'],
  cols: '1.2fr 1fr',
  frames: [
    {
      line: [1, 2, 3, 4, 5],
      say: 'An array of three events.',
      add: [['in', T('e1', 'Hack Night · ₹0', 'green')], ['in', T('e2', 'Gala · ₹500', 'pink')], ['in', T('e3', 'Code Jam · ₹0', 'green')]],
    },
    { line: 7, say: '`filter` walks the array **one item at a time** and asks your function a yes/no question: `e.price === 0`?' },
    { line: 7, say: 'Hack Night: price is 0 → **true**. Keep it.', add: [['fn', T('c1', 'Hack Night · ₹0', 'green', { from: 'e1', badge: 'true · keep' })]] },
    {
      line: 7,
      say: 'It goes into the new array. Next, Gala: 500 → **false**.',
      move: [['c1', 'free', { badge: undefined }]],
      add: [['fn', T('c2', 'Gala · ₹500', 'pink', { from: 'e2', badge: 'false · drop' })]],
    },
    { line: 7, say: 'Gala is left out. Code Jam: 0 → **true**.', remove: ['c2'], add: [['fn', T('c3', 'Code Jam · ₹0', 'green', { from: 'e3', badge: 'true · keep' })]] },
    { line: 7, say: '`filter` returns a **new** array of 2 events. The original `events` is untouched.', move: [['c3', 'free', { badge: undefined }]] },
    { line: 9, say: '`map` also visits every item, but instead of keep/drop it **transforms** each one. Same number in, same number out.' },
    { line: 9, say: 'Hack Night → `e.title.toUpperCase()`', add: [['fn', T('m1', 'Hack Night · ₹0', 'green', { from: 'c1', badge: 'transform' })]] },
    {
      line: 9,
      say: '→ `HACK NIGHT`. Next item.',
      move: [['m1', 'out', { text: "'HACK NIGHT'", tint: 'yellow', badge: undefined }]],
      add: [['fn', T('m3', 'Code Jam · ₹0', 'green', { from: 'c3', badge: 'transform' })]],
    },
    { line: 9, say: 'Result: `[\'HACK NIGHT\', \'CODE JAM\']`. You’ll do this in every API: **filter** the rows a user may see, then **map** them into the JSON you send.', move: [['m3', 'out', { text: "'CODE JAM'", tint: 'yellow', badge: undefined }]] },
  ],
};

/* ---------- B · one waiter ---------- */
export const waiter = {
  id: 'waiter',
  title: 'One waiter: blocking vs non-blocking',
  blurb: 'The restaurant from Phase 0, with one waiter. This is why Node is fast at waiting.',
  panels: [
    { id: 'floor', label: 'Dining room', kind: 'box' },
    { id: 'kitchen', label: 'Kitchen (slow work)', kind: 'box', empty: 'nothing cooking' },
    { id: 'served', label: 'Served', kind: 'box', empty: 'nobody yet' },
    { id: 'clock', label: 'Clock', kind: 'box' },
  ],
  areas: ['floor floor kitchen kitchen', 'served served served clock'],
  cols: '1fr 1fr 1fr 0.8fr',
  frames: [
    {
      say: 'Three tables order at the same time. The restaurant has **one waiter**, just as JavaScript has **one main thread**.',
      add: [['floor', T('w', 'Waiter', 'yellow', { badge: 'one thread' })], ['floor', T('t1', 'Table 1', 'white')], ['floor', T('t2', 'Table 2', 'white')], ['floor', T('t3', 'Table 3', 'white')], ['clock', T('clk', '0 min', 'cream')]],
    },
    {
      say: '**The blocking waiter.** Takes Table 1’s order to the kitchen… and **stands there** until the food is ready. Tables 2 and 3 are ignored.',
      move: [['w', 'kitchen', { badge: 'standing, waiting' }]],
      add: [['kitchen', T('k1', 'Table 1’s dish', 'pink', { timer: 2.5 })]],
    },
    {
      say: '10 minutes later Table 1 gets its food. Only **now** does the waiter even look at Table 2.',
      move: [['k1', 'served', { text: 'Table 1 · 10 min', timer: undefined, tint: 'green' }], ['w', 'floor', { badge: 'one thread' }]],
      remove: ['t1'],
      set: [['clk', { text: '10 min' }], ['t2', { badge: 'still waiting' }], ['t3', { badge: 'still waiting' }]],
    },
    {
      say: 'Table 2 is served at 20 minutes and Table 3 at **30 minutes**. Everyone waits for everyone else. That’s **blocking**.',
      remove: ['t2', 't3'],
      add: [['served', T('s2', 'Table 2 · 20 min', 'yellow', { from: 't2' })], ['served', T('s3', 'Table 3 · 30 min', 'pink', { from: 't3' })]],
      set: [['clk', { text: '30 min' }]],
    },
    {
      say: '**The non-blocking waiter.** Same three tables, same kitchen. Watch the difference.',
      clear: ['served', 'kitchen'],
      add: [['floor', T('n1', 'Table 1', 'white')], ['floor', T('n2', 'Table 2', 'white')], ['floor', T('n3', 'Table 3', 'white')]],
      set: [['clk', { text: '0 min' }]],
    },
    { say: 'The waiter hands Table 1’s **ticket** to the kitchen and **walks away** straight away.', add: [['kitchen', T('q1', 'Table 1’s ticket', 'pink', { timer: 3, from: 'n1' })]] },
    { say: 'Takes Table 2’s order and hands in that ticket too…', add: [['kitchen', T('q2', 'Table 2’s ticket', 'blue', { timer: 3, from: 'n2' })]] },
    { say: '…and Table 3’s. All three dishes now cook **at the same time**, while the waiter is free.', add: [['kitchen', T('q3', 'Table 3’s ticket', 'green', { timer: 3, from: 'n3' })]], set: [['clk', { text: '1 min' }]] },
    {
      say: 'The kitchen rings a bell as each dish is ready, and the waiter carries it out. Everyone eats by about **11 minutes**, not 30.',
      remove: ['n1', 'n2', 'n3'],
      move: [['q1', 'served', { text: 'Table 1 · 11 min', timer: undefined }], ['q2', 'served', { text: 'Table 2 · 11 min', timer: undefined }], ['q3', 'served', { text: 'Table 3 · 11 min', timer: undefined }]],
      set: [['clk', { text: '11 min' }]],
    },
    { say: '**This is Node.js.** One thread that never stands around waiting. Slow work (database, network, files) is handed off, and a **callback** runs when the “bell” rings.' },
  ],
};

/* ---------- B · setTimeout & the event loop ---------- */
export const eventLoop = {
  id: 'event-loop',
  title: 'setTimeout and the event loop',
  blurb: 'Why the line in the middle of the file prints last.',
  file: 'order.js',
  code: `
console.log('1 · order placed');

setTimeout(() => {
  console.log('3 · food ready');
}, 2000);

console.log('2 · next customer');`,
  panels: [
    { id: 'stack', label: 'Call stack', kind: 'stack' },
    { id: 'api', label: 'Node APIs (timers, network, files)', kind: 'box', empty: 'nothing waiting' },
    { id: 'loop', label: 'Event loop', kind: 'loop' },
    { id: 'queue', label: 'Task queue', kind: 'queue' },
    { id: 'console', label: 'Console', kind: 'console' },
  ],
  areas: ['code stack api', 'code loop queue', 'code console console'],
  cols: '1.3fr 1fr 1fr',
  frames: [
    { say: 'Node runs the file top to bottom. The whole script sits on the **call stack** while it runs.', add: [['stack', T('main', 'main script', 'yellow')]] },
    { line: 1, say: 'Line 1 calls `console.log`: pushed…', add: [['stack', T('l1', "console.log('1 · …')", 'blue')]] },
    { line: 1, say: '…printed immediately, popped.', remove: ['l1'], log: '1 · order placed' },
    { line: 3, say: 'Line 3 calls `setTimeout`. It isn’t a JavaScript feature: it asks **Node’s timer system** to call you back later.', add: [['stack', T('st', 'setTimeout(cb, 2000)', 'pink')]] },
    {
      line: 3,
      say: 'Node starts a 2-second timer and keeps the callback safe. `setTimeout` returns **at once**. JavaScript does **not** wait.',
      remove: ['st'],
      add: [['api', T('cb', '() => console.log(3 …)', 'pink', { badge: 'timer · 2000 ms', timer: 2.6, from: 'st' })]],
    },
    { line: 7, say: 'So line 7 runs right now…', add: [['stack', T('l2', "console.log('2 · …')", 'blue')]] },
    { line: 7, say: '…and prints.', remove: ['l2'], log: '2 · next customer' },
    { line: null, say: 'The script is finished and popped. The stack is **empty**. The timer is still ticking inside Node.', remove: ['main'] },
    { say: 'The **event loop** keeps asking: “Is the stack empty? Is anything waiting in a queue?” Not yet.', loop: true },
    { say: 'Two seconds later the timer fires. The callback moves to the **task queue**. It still can’t run by itself; it waits for its turn.', move: [['cb', 'queue', { badge: undefined, timer: undefined }]] },
    { line: 4, say: 'Stack empty → the event loop takes the callback from the queue and **pushes it onto the stack**.', loop: true, move: [['cb', 'stack']] },
    { line: 4, say: 'The callback runs line 4…', add: [['stack', T('l3', "console.log('3 · …')", 'blue')]] },
    { line: 4, say: '…which prints **last**, even though it sits in the middle of the file.', remove: ['l3'], log: '3 · food ready' },
    { line: null, say: 'The rule: **a callback only runs when the call stack is empty.** Even `setTimeout(cb, 0)` waits for the current code to finish.', remove: ['cb'] },
  ],
};

/* ---------- B · microtasks vs tasks ---------- */
export const microtasks = {
  id: 'microtasks',
  title: 'Promises jump the queue',
  blurb: 'The classic interview puzzle: A, D, C, B. Microtasks always run before the next task.',
  file: 'puzzle.js',
  code: `
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');`,
  panels: [
    { id: 'stack', label: 'Call stack', kind: 'stack' },
    { id: 'api', label: 'Node APIs', kind: 'box', empty: 'nothing waiting' },
    { id: 'micro', label: 'Microtask queue (promises) · VIP', kind: 'queue', tint: 'cream' },
    { id: 'queue', label: 'Task queue (timers, I/O)', kind: 'queue' },
    { id: 'loop', label: 'Event loop', kind: 'loop' },
    { id: 'console', label: 'Console', kind: 'console' },
  ],
  areas: ['code stack api', 'code micro micro', 'code queue queue', 'code loop console'],
  cols: '1.35fr 1fr 1fr',
  frames: [
    { say: 'Predict first: what order do A, B, C and D print in? Say it out loud, then step through.', add: [['stack', T('main', 'main script', 'yellow')]] },
    { line: 1, say: 'Plain synchronous code: `A` prints straight away.', log: 'A' },
    { line: 3, say: '`setTimeout(…, 0)`: even with 0 ms, the callback goes to Node’s timer system.', add: [['api', T('b', "() => log('B')", 'pink', { badge: 'timer · 0 ms' })]] },
    { line: 3, say: '0 ms passes instantly, so the callback is already waiting in the **task queue**. But the stack isn’t empty, so it waits.', move: [['b', 'queue', { badge: undefined }]] },
    { line: 5, say: '`Promise.resolve()` is already fulfilled, so its `.then` callback is queued, but in a **different** queue: the **microtask queue**.', add: [['micro', T('c', "() => log('C')", 'green')]] },
    { line: 7, say: 'More synchronous code: `D` prints.', log: 'D' },
    { line: null, say: 'The script ends. The stack is empty and two callbacks are waiting. Which one goes first?', remove: ['main'] },
    { say: 'The event loop **always empties the microtask queue first**. Promise callbacks are VIPs.', loop: true, move: [['c', 'stack']] },
    { say: 'So `C` prints.', remove: ['c'], log: 'C' },
    { say: 'Only when no microtasks are left does it take the next **task**.', loop: true, move: [['b', 'stack']] },
    { say: 'Output: **A D C B**. Synchronous code first, then promise callbacks, then timers.', remove: ['b'], log: 'B' },
  ],
};

/* ---------- B · async / await ---------- */
export const asyncAwait = {
  id: 'async-await',
  title: 'await pauses one function, not the server',
  blurb: 'Where an async function goes while it waits, and how it comes back.',
  file: 'get-event.js',
  code: `
async function getEvent() {
  console.log('2 · asking the API');
  const res = await fetch(URL);
  console.log('4 · got status', res.status);
}

console.log('1 · start');
getEvent();
console.log('3 · meanwhile…');`,
  panels: [
    { id: 'stack', label: 'Call stack', kind: 'stack' },
    { id: 'api', label: 'Node APIs (network)', kind: 'box', empty: 'no requests in flight' },
    { id: 'paused', label: 'Paused functions', kind: 'box', empty: 'none paused', tint: 'cream' },
    { id: 'micro', label: 'Microtask queue', kind: 'queue' },
    { id: 'console', label: 'Console', kind: 'console' },
  ],
  areas: ['code stack api', 'code paused micro', 'code console console'],
  cols: '1.35fr 1fr 1fr',
  frames: [
    { say: 'An `async` function can **pause** at `await` without blocking anything else. Watch where it goes.', add: [['stack', T('main', 'main script', 'yellow')]] },
    { line: 7, say: 'Line 7 prints first.', log: '1 · start' },
    { line: 8, say: 'Calling `getEvent()` pushes it on the stack. Its body runs **synchronously**, up to the first `await`.', add: [['stack', T('fn', 'getEvent()', 'pink')]] },
    { line: 2, say: 'So line 2 prints immediately.', log: '2 · asking the API' },
    { line: 3, say: '`fetch` hands the request to Node (Node does the waiting) and immediately returns a **pending promise**.', add: [['api', T('req', 'GET URL', 'blue', { badge: 'waiting for the server', timer: 3 })]] },
    { line: 3, say: '`await` sees a pending promise, so the function is **lifted off the stack and paused**. Its local variables are kept safe.', move: [['fn', 'paused', { text: 'getEvent() · paused at line 3', badge: 'await' }]] },
    { line: 9, say: 'Back in the script, nobody awaited `getEvent()`, so it **carries on** to line 9.', log: '3 · meanwhile…' },
    { line: null, say: 'The script ends. The stack is **empty** while the network request is still in flight. The server could handle other requests right now.', remove: ['main'] },
    { say: 'The response arrives. The promise is **fulfilled**, so “resume getEvent” is queued as a **microtask**.', move: [['req', 'micro', { text: 'resume getEvent()', badge: 'res = Response 200', timer: undefined, tint: 'green' }]] },
    { line: 4, say: 'Stack empty → the function is put back and **continues right after the `await`**, with `res` filled in.', remove: ['req'], move: [['fn', 'stack', { text: 'getEvent() · resumed', badge: undefined }]] },
    { line: 4, say: 'Line 4 prints.', log: '4 · got status 200' },
    { line: null, say: 'Output: 1, 2, 3, 4. **`await` pauses this function only.** Everything else keeps running. That’s how one Node server juggles thousands of requests.', remove: ['fn'] },
  ],
};

/* ---------- B · sequential vs parallel ---------- */
export const parallel = {
  id: 'parallel',
  title: 'One after another vs all at once',
  blurb: 'Three independent database calls: await them one by one, or start them together with Promise.all.',
  file: 'dashboard.js',
  code: `
// one after another
const user    = await getUser();     // 1 s
const events  = await getEvents();   // 1 s
const tickets = await getTickets();  // 1 s

// all at once
const [u, e, t] = await Promise.all([
  getUser(), getEvents(), getTickets(),
]);`,
  panels: [
    { id: 'seq', label: 'One after another', kind: 'timeline', lanes: ['user', 'events', 'tickets'], max: 3.4 },
    { id: 'par', label: 'All at once: Promise.all', kind: 'timeline', lanes: ['user', 'events', 'tickets'], max: 3.4 },
  ],
  areas: ['code seq', 'code par'],
  cols: '1.2fr 1fr',
  frames: [
    { say: 'Three database calls, each taking about **1 second**. None of them needs the others’ results.' },
    { line: 2, say: '`await getUser()` waits for the user before even **starting** the next call.', add: [['seq', { id: 's1', lane: 0, from: 0, to: 1, text: 'getUser', tint: 'yellow' }]] },
    { line: 3, say: 'Then events…', add: [['seq', { id: 's2', lane: 1, from: 1, to: 2, text: 'getEvents', tint: 'pink' }]] },
    {
      line: 4,
      say: '…then tickets. Total: about **3 seconds**, and the server spent most of it just waiting.',
      add: [['seq', { id: 's3', lane: 2, from: 2, to: 3, text: 'getTickets', tint: 'green' }], ['seq', { id: 'sm', kind: 'marker', at: 3, text: '≈ 3 s' }]],
    },
    {
      line: [7, 8, 9],
      say: '`Promise.all` **starts all three at once**, then waits for all of them to finish.',
      add: [
        ['par', { id: 'p1', lane: 0, from: 0, to: 1, text: 'getUser', tint: 'yellow' }],
        ['par', { id: 'p2', lane: 1, from: 0, to: 1.05, text: 'getEvents', tint: 'pink' }],
        ['par', { id: 'p3', lane: 2, from: 0, to: 0.95, text: 'getTickets', tint: 'green' }],
      ],
    },
    { line: [7, 8, 9], say: 'Total: about **1 second**, the time of the slowest one. Same work, three times faster.', add: [['par', { id: 'pm', kind: 'marker', at: 1.05, text: '≈ 1 s' }]] },
    { line: null, say: 'Use `Promise.all` when calls don’t depend on each other. Go one by one when a call needs the previous result (get the user, **then** that user’s tickets). If any call fails, `Promise.all` fails.' },
  ],
};

/* ---------- C · npm install ---------- */
export const npmInstall = {
  id: 'npm-install',
  title: 'What npm install actually does',
  blurb: 'Registry → node_modules → package.json → package-lock.json.',
  panels: [
    { id: 'term', label: 'Terminal', kind: 'console' },
    { id: 'registry', label: 'npm registry (registry.npmjs.org)', kind: 'box', empty: 'millions of packages' },
    { id: 'pkg', label: 'package.json', kind: 'memory' },
    { id: 'lock', label: 'package-lock.json', kind: 'memory', empty: 'not created yet' },
    { id: 'nm', label: 'node_modules/', kind: 'box', empty: 'empty folder' },
  ],
  console: 'term',
  areas: ['term term registry', 'pkg lock nm'],
  cols: '1fr 1fr 1.1fr',
  frames: [
    {
      say: 'A fresh project. `package.json` describes it: its name, its scripts, and what it depends on. No dependencies yet.',
      add: [['pkg', M('name', '"name"', '"campus-events"')], ['pkg', M('type', '"type"', '"module"')], ['pkg', M('deps', '"dependencies"', '{ }')]],
    },
    { say: 'You ask npm for a package by name.', log: '$ npm install dayjs' },
    { say: 'npm looks it up on the **registry**, a huge public library of JavaScript packages, and picks the latest version.', add: [['registry', T('r1', 'dayjs', 'blue', { badge: 'v1.11.23', sub: 'dates made easy' })]] },
    { say: 'The package is **downloaded** into `node_modules/`. All third-party code lives in that folder.', move: [['r1', 'nm', { text: 'dayjs/', badge: undefined, sub: 'the downloaded code' }]] },
    { say: '`package.json` records it under **dependencies**. `^1.11.23` means “1.11.23 or any newer 1.x”.', set: [['deps', { value: '{ "dayjs": "^1.11.23" }' }]] },
    { say: '`package-lock.json` records the **exact** version installed, so every laptop and server gets identical code.', add: [['lock', M('lk1', 'dayjs', '1.11.23 (exact)')]] },
    { say: 'Bigger packages bring **their own** dependencies. Installing Express pulls in dozens of packages.', log: '$ npm install express', add: [['registry', T('r2', 'express', 'green', { badge: 'v5', sub: '+ its dependencies' })]] },
    {
      say: 'All of them land in `node_modules/`, and both files are updated.',
      move: [['r2', 'nm', { text: 'express/', badge: undefined, sub: undefined }]],
      add: [['nm', T('d1', 'body-parser/', 'white')], ['nm', T('d2', 'debug/', 'white')], ['nm', T('d3', 'qs/', 'white')], ['nm', T('d4', 'router/', 'white')], ['nm', T('d5', '…and many more', 'white')], ['lock', M('lk2', 'express', '+ every sub-package, exact')]],
      set: [['deps', { value: '{ "dayjs": "^1.11.23", "express": "^5.2.1" }' }]],
    },
    { say: 'That’s why `node_modules/` is huge and **never goes into Git**. Anyone can rebuild it exactly with `npm install` from the two small files.' },
  ],
};

/* ---------- D · git areas ---------- */
export const gitAreas = {
  id: 'git-areas',
  title: 'Git: folder → staging → commit → GitHub',
  blurb: 'Where your files go when you run add, commit and push. And what never leaves your laptop.',
  panels: [
    { id: 'work', label: 'Your project folder', kind: 'box' },
    { id: 'stage', label: 'Staging area (next save)', kind: 'box', empty: 'nothing staged', tint: 'cream' },
    { id: 'repo', label: 'Local repository (history)', kind: 'stack', empty: 'no commits yet' },
    { id: 'remote', label: 'GitHub', kind: 'stack', empty: 'not pushed yet' },
    { id: 'term', label: 'Terminal', kind: 'console' },
  ],
  console: 'term',
  areas: ['work stage repo remote', 'term term term term'],
  cols: '1.25fr 1fr 1fr 1fr',
  frames: [
    {
      say: 'Your project folder. Git can watch it, but saves **nothing** until you tell it to.',
      add: [['work', T('f1', 'server.js', 'yellow')], ['work', T('f2', 'README.md', 'white')], ['work', T('f3', '.env', 'pink', { badge: 'secrets' })], ['work', T('f4', 'node_modules/', 'white', { badge: 'huge' })]],
    },
    { say: '`git init` creates a hidden `.git` folder: an empty repository, right here on your laptop.', log: '$ git init' },
    {
      say: 'A `.gitignore` file lists what Git must **never** track: `node_modules/` and `.env`.',
      add: [['work', T('f5', '.gitignore', 'green')]],
      set: [['f3', { badge: 'ignored', dim: true }], ['f4', { badge: 'ignored', dim: true }]],
    },
    {
      say: '`git add` copies a **snapshot** of the files into the staging area: the box of changes for your next save point.',
      log: '$ git add .',
      add: [['stage', T('a1', 'server.js', 'yellow', { from: 'f1' })], ['stage', T('a2', 'README.md', 'white', { from: 'f2' })], ['stage', T('a5', '.gitignore', 'green', { from: 'f5' })]],
    },
    {
      say: '`git commit` turns everything staged into a permanent **save point** with a message and an ID.',
      log: '$ git commit -m "Add raw HTTP server"',
      remove: ['a1', 'a2', 'a5'],
      add: [['repo', T('c1', 'a1b2c3d', 'green', { sub: 'Add raw HTTP server', from: 'a1' })]],
    },
    { say: 'You edit `server.js` again. `git status` shows it as **modified** since the last commit.', log: '$ git status', set: [['f1', { badge: 'modified' }]] },
    { say: 'Same two steps: add…', log: '$ git add server.js', add: [['stage', T('b1', 'server.js', 'yellow', { from: 'f1' })]], set: [['f1', { badge: undefined }]] },
    {
      say: '…and commit. The history now has **two** save points you can go back to.',
      log: '$ git commit -m "Add 404 route"',
      remove: ['b1'],
      add: [['repo', T('c2', 'e4f5a6b', 'blue', { sub: 'Add 404 route', from: 'b1' })]],
    },
    {
      say: '`git push` uploads your commits to **GitHub**: an online backup that others can see and clone.',
      log: '$ git push -u origin main',
      add: [['remote', T('g1', 'a1b2c3d', 'green', { sub: 'Add raw HTTP server', from: 'c1' })], ['remote', T('g2', 'e4f5a6b', 'blue', { sub: 'Add 404 route', from: 'c2' })]],
    },
    { say: 'Notice what never left your laptop: `.env` (your secrets) and `node_modules/` (rebuilt any time with `npm install`).' },
  ],
};

/* ---------- E · reading a POST body ---------- */
export const bodyStream = {
  id: 'body-stream',
  title: 'Reading a POST body by hand',
  blurb: 'Without a framework the body arrives in chunks, and you glue them together yourself.',
  file: 'server.js',
  code: `
let body = '';
req.on('data', (chunk) => {
  body += chunk;
});
req.on('end', () => {
  const event = JSON.parse(body);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(event));
});`,
  panels: [
    { id: 'net', label: 'Arriving over the network', kind: 'queue', empty: 'all chunks received' },
    { id: 'mem', label: 'Memory', kind: 'memory' },
    { id: 'out', label: 'Response', kind: 'box', empty: 'not sent yet' },
  ],
  areas: ['code net', 'code mem', 'code out'],
  cols: '1.35fr 1fr',
  frames: [
    {
      say: 'A client POSTs some JSON. In plain Node the body doesn’t arrive as one object: it **streams in as chunks** of raw bytes. (Small bodies often fit in one chunk; we split this one to show it.)',
      add: [['net', T('c1', '{"title":"Ha', 'yellow')], ['net', T('c2', 'ck Night","ven', 'pink')], ['net', T('c3', 'ue":"Lab B"}', 'blue')]],
    },
    { line: 1, say: 'Start with an empty string.', add: [['mem', M('body', 'body', "''")]] },
    { line: 2, say: 'Register a listener: “every time a chunk arrives, run this function”.' },
    { line: 3, say: 'Chunk 1 arrives and is added to `body`.', move: [['c1', 'mem']], set: [['body', { value: '\'{"title":"Ha\'' }]] },
    { line: 3, say: 'Chunk 2…', remove: ['c1'], move: [['c2', 'mem']], set: [['body', { value: '\'{"title":"Hack Night","ven\'' }]] },
    { line: 3, say: '…and chunk 3.', remove: ['c2'], move: [['c3', 'mem']], set: [['body', { value: '\'{"title":"Hack Night","venue":"Lab B"}\'' }]] },
    { line: 5, say: 'The **end** event fires: no more chunks. `body` is complete, but it’s still just a **string**.', remove: ['c3'] },
    { line: 6, say: '`JSON.parse` turns the text into a real object. (If the client sent broken JSON, this line **throws**. Handle that with try/catch and a 400.)', add: [['mem', M('event', 'event', "{ title: 'Hack Night', venue: 'Lab B' }", { tint: 'green' })]] },
    { line: [7, 8], say: 'Reply `201 Created` with JSON. Express does all of this for you with one line, `app.use(express.json())`. That’s Phase 2.', add: [['out', T('res', '201 Created', 'green', { sub: '{"title":"Hack Night","venue":"Lab B"}' })]] },
  ],
};

/* ---------- E · one thread, many requests ---------- */
export const oneThread = {
  id: 'one-thread',
  title: 'Never block the thread',
  blurb: 'One slow CPU loop freezes every user. One slow database call freezes nobody.',
  file: 'server.js',
  code: `
// BLOCKING: keeps the CPU busy for 5 s
if (url === '/slow') {
  const end = Date.now() + 5000;
  while (Date.now() < end) {}
  return res.end('slow done');
}

// NON-BLOCKING: waits without the CPU
if (url === '/report') {
  const rows = await db.query(sql); // 5 s
  return res.end('report done');
}`,
  panels: [
    { id: 'clients', label: 'Incoming requests', kind: 'queue', empty: 'none waiting' },
    { id: 'thread', label: 'The one JavaScript thread', kind: 'stack', empty: 'free', tint: 'cream' },
    { id: 'db', label: 'Waiting on the database', kind: 'box', empty: 'nothing waiting' },
    { id: 'out', label: 'Responses sent', kind: 'console' },
  ],
  console: 'out',
  areas: ['code clients', 'code thread', 'code db', 'code out'],
  cols: '1.35fr 1fr',
  frames: [
    { say: 'Two users hit the server at almost the same moment. Node runs every handler on **one** JavaScript thread.', add: [['clients', T('r1', 'GET /slow', 'pink')], ['clients', T('r2', 'GET /hello', 'blue')]] },
    { line: [3, 4], say: '`/slow` spins in a `while` loop for 5 seconds. The thread is **busy**: it can do nothing else.', move: [['r1', 'thread', { text: 'handling /slow', badge: 'while loop · 5 s', timer: 4 }]] },
    { line: [3, 4], say: '`/hello` would take 1 ms, but it’s stuck waiting. To every user, the whole server looks **frozen**.', set: [['r2', { badge: 'waiting…' }]] },
    { line: 5, say: 'Only when the loop ends does `/slow` reply, and `/hello` finally gets the thread.', remove: ['r1'], log: '200 /slow  · 5 s', move: [['r2', 'thread', { text: 'handling /hello', badge: undefined }]] },
    { say: '**`/hello` took 5 seconds for no reason.** One blocking handler slows down **everyone**.', remove: ['r2'], log: '200 /hello · 5 s  ← !' },
    { line: null, say: 'Now the non-blocking version. `/report` needs a slow database query.', clear: ['out'], add: [['clients', T('r3', 'GET /report', 'green')], ['clients', T('r4', 'GET /hello', 'blue')]] },
    { line: 10, say: '`/report` starts on the thread…', move: [['r3', 'thread', { text: 'handling /report' }]] },
    { line: 11, say: '…and hits `await`. The query is handed to the database and the thread is **free again** straight away.', move: [['r3', 'db', { text: '/report · paused at await', badge: 'db query · 5 s', timer: 4 }]] },
    { say: 'So `/hello` runs **immediately**…', move: [['r4', 'thread', { text: 'handling /hello' }]] },
    { say: '…and replies in about a millisecond.', remove: ['r4'], log: '200 /hello  · 1 ms' },
    { line: 12, say: 'When the rows arrive, `/report` resumes on the thread and finishes.', move: [['r3', 'thread', { text: 'resume /report', badge: undefined, timer: undefined }]] },
    { line: null, say: '**Never block the thread.** Waiting with `await` is free; long CPU loops are not. (Heavy CPU work goes to worker threads or a job queue, later in the course.)', remove: ['r3'], log: '200 /report · 5 s' },
  ],
};

export const explainers = [
  { part: 'A', def: callStack },
  { part: 'A', def: references },
  { part: 'A', def: mapFilter },
  { part: 'B', def: waiter },
  { part: 'B', def: eventLoop },
  { part: 'B', def: microtasks },
  { part: 'B', def: asyncAwait },
  { part: 'B', def: parallel },
  { part: 'C', def: npmInstall },
  { part: 'D', def: gitAreas },
  { part: 'E', def: bodyStream },
  { part: 'E', def: oneThread },
];
