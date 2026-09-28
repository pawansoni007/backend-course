/* ===========================================================
   PHASE 0 SLIDES — How the web works
   Each slide: { id, part, title, bg, remember, body }
   `body` is JSX that renders both in the 1920×1080 stage
   (Present / Slides view) and in the responsive Read view.
   =========================================================== */
import { Flow, UrlAnatomy, Message, Sequence } from '../../components/diagrams.jsx';
import { rich } from '../../lib.jsx';

export const parts = {
  A: { label: 'Part A · The big picture', tint: 'yellow' },
  B: { label: 'Part B · Finding the server', tint: 'blue' },
  C: { label: 'Part C · Speaking HTTP', tint: 'pink' },
  D: { label: 'Part D · Data & rules', tint: 'green' },
};

const Card = ({ tint = 'white', className = '', children, ...rest }) => (
  <div className={`card sc tint-${tint} ${className}`} {...rest}>{children}</div>
);
const Tag = ({ tint = 'white', children }) => <span className={`pill tint-${tint}`}>{children}</span>;

export const slides = [
  /* ---------------- PART A ---------------- */
  {
    id: 'title',
    part: 'A',
    title: 'How the web works',
    bg: 'offwhite',
    layout: 'cover',
    remember: 'Every app you use is clients and servers passing messages.',
    body: (
      <div className="cover">
        <div className="cover-main card tint-yellow">
          <Tag>Phase 0 · Foundations</Tag>
          <h1 className="display cover-title">How the<br />web works</h1>
          <p className="cover-sub">From typing a URL to getting an answer, one request at a time.</p>
        </div>
        <div className="cover-side">
          <div className="card sc tint-blue">
            <span className="label">Request</span>
            <pre className="cover-code">GET /events/12{'\n'}Host: api.campus-events.dev</pre>
          </div>
          <div className="card sc tint-green">
            <span className="label">Response</span>
            <pre className="cover-code">200 OK{'\n'}{'{ "title": "Hack Night" }'}</pre>
          </div>
        </div>
        <span className="star cover-star">GO</span>
      </div>
    ),
  },
  {
    id: 'map',
    part: 'A',
    title: 'Today’s map',
    bg: 'blue',
    lead: 'Four parts. We can stop after any part and pick up next time.',
    remember: 'A: why · B: where · C: how they talk · D: what they send.',
    body: (
      <div className="sg4">
        {[
          ['A', 'The big picture', 'yellow', ['Client & server', 'What an API is', 'Where the backend fits']],
          ['B', 'Finding the server', 'white', ['IP addresses', 'Domains & DNS', 'Ports', 'Parts of a URL']],
          ['C', 'Speaking HTTP', 'pink', ['Requests', 'Methods', 'Responses', 'Status codes', 'REST (preview)']],
          ['D', 'Data & rules', 'green', ['JSON', 'Stateless', 'HTTPS', 'The full journey']],
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
    id: 'restaurant',
    part: 'A',
    title: 'The web is a restaurant',
    bg: 'offwhite',
    lead: 'You never walk into the kitchen. You order from a menu, and the waiter brings back what you asked for.',
    remember: 'Client orders, API carries, server cooks, database stores.',
    body: (
      <>
        <Flow
          nodes={[
            { tag: 'Customer', title: 'Client', sub: 'Browser, app, Postman', tint: 'yellow' },
            { tag: 'Waiter', title: 'API', sub: 'Takes orders from a fixed menu', tint: 'blue' },
            { tag: 'Kitchen', title: 'Server', sub: 'Does the real work', tint: 'pink' },
            { tag: 'Pantry', title: 'Database', sub: 'Where ingredients are kept', tint: 'green' },
          ]}
          arrows={['order →', 'ticket →', 'fetch →']}
          back={['← food', '← dish', '← items']}
        />
        <div className="sg3 mt">
          <Card className="sc-mini"><strong>The menu</strong> = the API’s list of endpoints. You can’t order what isn’t on it.</Card>
          <Card className="sc-mini"><strong>The order</strong> = a request. <strong>The plate</strong> = the response.</Card>
          <Card className="sc-mini"><strong>No entry to the kitchen</strong> = users never touch the server or database directly.</Card>
        </div>
      </>
    ),
  },
  {
    id: 'client-server',
    part: 'A',
    title: 'Client & server',
    bg: 'green',
    lead: 'A client asks. A server answers. That is the whole relationship.',
    remember: 'Client always starts; server always answers. One program can be both.',
    body: (
      <div className="sg2">
        <Card>
          <Tag tint="yellow">Clients (they ask)</Tag>
          <ul className="big-list">
            <li>A web browser opening a page</li>
            <li>The Instagram app on your phone</li>
            <li>Postman or <code>curl</code> sending a test</li>
            <li>Another server calling an API (for example a payment gateway)</li>
          </ul>
        </Card>
        <Card>
          <Tag tint="pink">Servers (they answer)</Tag>
          <ul className="big-list">
            <li>A program <strong>listening</strong> on a port for requests</li>
            <li>Runs on some computer: a cloud machine, or your laptop</li>
            <li>Never speaks first; only replies</li>
            <li>Can serve thousands of clients at once</li>
          </ul>
        </Card>
        <div className="callout tint-cream span-2">
          <span className="label">Try this</span>
          <div>When you run an Express app on your laptop, your laptop is the server and your browser is the client. Same machine, two roles.</div>
        </div>
      </div>
    ),
  },
  {
    id: 'api',
    part: 'A',
    title: 'What is an API?',
    bg: 'pink',
    lead: 'A set of agreed doors a program opens so other programs can ask it for data or actions.',
    remember: 'API = menu of endpoints. Endpoint = method + path.',
    body: (
      <div className="sg2">
        <Card>
          <Tag tint="blue">Campus Events API: the menu</Tag>
          <div className="endpoint-list">
            {[
              ['GET', '/events', 'List all events'],
              ['GET', '/events/12', 'Get event 12'],
              ['POST', '/events', 'Create an event'],
              ['DELETE', '/events/12', 'Delete event 12'],
            ].map(([m, p, d]) => (
              <div className="endpoint" key={m + p}>
                <span className={`method m-${m.toLowerCase()}`}>{m}</span>
                <code>{p}</code>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="stack">
          <Card tint="yellow" className="sc-mini">
            <strong>Website</strong> → sends HTML, made for <strong>humans</strong> to look at.
          </Card>
          <Card tint="blue" className="sc-mini">
            <strong>API</strong> → sends JSON, made for <strong>programs</strong> to read.
          </Card>
          <Card className="sc-mini">
            Swiggy’s app, its website and its partner restaurants all use the <strong>same API</strong> behind the scenes.
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'backend-fits',
    part: 'A',
    title: 'Where the backend fits',
    bg: 'offwhite',
    lead: 'Three layers. Users only ever touch the first one.',
    remember: 'Frontend shows, backend decides, database remembers.',
    body: (
      <>
        <Flow
          nodes={[
            { tag: 'Frontend', title: 'What you see', sub: 'React site, mobile app', tint: 'yellow' },
            { tag: 'Backend', title: 'The brain', sub: 'Express API: rules, checks, security', tint: 'pink' },
            { tag: 'Database', title: 'The memory', sub: 'PostgreSQL, MongoDB', tint: 'green' },
          ]}
          arrows={['HTTP →', 'query →']}
          back={['← JSON', '← rows']}
        />
        <div className="callout tint-blue mt">
          <span className="label">Why not skip the backend?</span>
          <div>
            If the app talked to the database directly, the <strong>database password</strong> would ship to every phone,
            anyone could run <strong>any query</strong> (even “delete everything”), and there’d be <strong>nowhere to check</strong> input or permissions.
          </div>
        </div>
      </>
    ),
  },

  /* ---------------- PART B ---------------- */
  {
    id: 'ip',
    part: 'B',
    title: 'IP address: the phone number',
    bg: 'blue',
    lead: 'Every device on a network has a number, so messages know where to go.',
    remember: 'IP = a computer’s number. 127.0.0.1 = localhost = this computer.',
    body: (
      <div className="sg3">
        <Card>
          <Tag tint="yellow">IPv4</Tag>
          <p className="huge mono">142.250.183.14</p>
          <p>Four numbers from 0–255. About 4.3 billion possible, which the world has run out of.</p>
        </Card>
        <Card>
          <Tag tint="pink">IPv6</Tag>
          <p className="huge mono small-huge">2404:6800:4009::200e</p>
          <p>Much longer, with enough addresses for every device on Earth many times over.</p>
        </Card>
        <Card tint="cream">
          <Tag>Special</Tag>
          <p className="huge mono">127.0.0.1</p>
          <p>Always means “this same computer”, also called <code>localhost</code>. You’ll use it constantly.</p>
        </Card>
      </div>
    ),
  },
  {
    id: 'dns',
    part: 'B',
    title: 'DNS: the phonebook',
    bg: 'offwhite',
    lead: 'You remember names; computers need numbers. DNS translates.',
    remember: 'DNS turns a name into an IP, then everyone caches it for a while (TTL).',
    body: (
      <>
        <Flow
          className="flow-steps"
          nodes={[
            { tag: '1', title: 'Your cache', sub: 'Seen it recently?', tint: 'yellow' },
            { tag: '2', title: 'Resolver', sub: 'ISP, 1.1.1.1, 8.8.8.8', tint: 'blue' },
            { tag: '3', title: 'Root', sub: '“Ask the .com servers”', tint: 'white' },
            { tag: '4', title: 'TLD (.com)', sub: '“Ask github’s server”', tint: 'white' },
            { tag: '5', title: 'Authoritative', sub: '“It’s 140.82.112.3”', tint: 'green' },
          ]}
        />
        <div className="sg2 mt">
          <Card className="sc-mini">
            <strong>Question:</strong> <code>api.github.com</code> → <strong>Answer:</strong> <code>140.82.112.3</code>
          </Card>
          <Card className="sc-mini">
            The answer is cached for its <strong>TTL</strong> (time to live), so the next visit skips steps 2–5.
          </Card>
        </div>
      </>
    ),
  },
  {
    id: 'ports',
    part: 'B',
    title: 'Ports: which door?',
    bg: 'yellow',
    lead: 'The IP finds the building. The port finds the department inside it.',
    remember: 'One port, one program. HTTP 80, HTTPS 443, our Express app 3000.',
    body: (
      <div className="sg2">
        <Card>
          <div className="port-grid">
            {[
              ['80', 'HTTP (web, unlocked)'],
              ['443', 'HTTPS (web, locked)'],
              ['3000', 'Our Express app while developing'],
              ['5432', 'PostgreSQL database'],
              ['27017', 'MongoDB database'],
              ['22', 'SSH (remote login)'],
            ].map(([p, d]) => (
              <div className="port" key={p}>
                <span className="port-num">{p}</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="stack">
          <Card tint="white" className="sc-mini">
            Full address = <strong>IP + port</strong>: <code>203.0.113.10:443</code>
          </Card>
          <Card tint="blue" className="sc-mini">
            Browsers hide the default port. <code>https://google.com</code> really means <code>:443</code>.
          </Card>
          <Card tint="pink" className="sc-mini">
            “Port 3000 is already in use” means another program already has that door. Stop it or pick another port.
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'url',
    part: 'B',
    title: 'Anatomy of a URL',
    bg: 'offwhite',
    lead: 'Every part of an address has one job.',
    remember: 'scheme :// domain : port / path ? query # fragment',
    body: (
      <>
        <UrlAnatomy
          parts={[
            { text: 'https', label: 'Scheme', tint: 'yellow' },
            { text: '://', label: '', tint: 'white' },
            { text: 'api.campus.dev', label: 'Domain', tint: 'blue' },
            { text: ':443', label: 'Port', tint: 'cream' },
            { text: '/events/12', label: 'Path', tint: 'pink' },
            { text: '?sort=date&page=2', label: 'Query string', tint: 'green' },
            { text: '#reviews', label: 'Fragment', tint: 'white' },
          ]}
        />
        <div className="sg3 mt">
          <Card className="sc-mini"><strong>Path</strong> says <em>which thing</em>: <code>/events/12</code> is event number 12.</Card>
          <Card className="sc-mini"><strong>Query string</strong> gives <em>options</em>: sort, filter, page. Pairs joined by <code>&amp;</code>.</Card>
          <Card className="sc-mini"><strong>Fragment</strong> stays in the browser. It is <em>never</em> sent to the server.</Card>
        </div>
      </>
    ),
  },

  /* ---------------- PART C ---------------- */
  {
    id: 'http',
    part: 'C',
    title: 'HTTP is a conversation',
    bg: 'pink',
    lead: 'HTTP is the agreed rulebook for how a client asks and a server answers. It is just structured text.',
    remember: 'One request in, one response out. The client always goes first.',
    body: (
      <div className="sg2">
        <Message
          title="The client sends"
          blocks={[
            { label: 'Request line', tint: 'yellow', lines: 'GET /events/12 HTTP/1.1' },
            { label: 'Headers', tint: 'blue', lines: 'Host: api.campus-events.dev\nAccept: application/json' },
          ]}
        />
        <Message
          title="The server replies"
          blocks={[
            { label: 'Status line', tint: 'green', lines: 'HTTP/1.1 200 OK' },
            { label: 'Headers', tint: 'blue', lines: 'Content-Type: application/json' },
            { label: 'Body', tint: 'pink', lines: '{ "id": 12, "title": "Hack Night" }' },
          ]}
        />
      </div>
    ),
  },
  {
    id: 'request',
    part: 'C',
    title: 'Anatomy of a request',
    bg: 'offwhite',
    lead: 'What you want to do, to what, with which extra details, and what data.',
    remember: 'Method + path + headers + body (the body is optional).',
    body: (
      <div className="sg2 wide-left">
        <Message
          blocks={[
            { label: 'Method · path', tint: 'yellow', lines: 'POST /api/events HTTP/1.1' },
            { label: 'Headers', tint: 'blue', lines: 'Host: api.campus-events.dev\nContent-Type: application/json\nAuthorization: Bearer eyJhbGciOi…' },
            { label: 'Blank line', tint: 'white', lines: ' ' },
            { label: 'Body', tint: 'pink', lines: '{\n  "title": "Hack Night",\n  "venue": "Lab Block B"\n}' },
          ]}
        />
        <div className="stack">
          <Card className="sc-mini"><code>Host</code>: which website on that server.</Card>
          <Card className="sc-mini"><code>Content-Type</code>: the body’s format.</Card>
          <Card className="sc-mini"><code>Authorization</code>: proof of who you are.</Card>
          <Card className="sc-mini"><code>Accept</code>: the format you’d like back.</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'methods',
    part: 'C',
    title: 'The five methods',
    bg: 'cream',
    lead: 'The method is the verb. The path is the noun.',
    remember: 'GET reads · POST creates · PUT replaces · PATCH edits · DELETE removes.',
    body: (
      <div className="sg5">
        {[
          ['GET', 'Read', 'GET /events', 'blue', 'Safe, repeatable'],
          ['POST', 'Create', 'POST /events', 'green', 'Twice = two events'],
          ['PUT', 'Replace', 'PUT /events/12', 'yellow', 'Send the whole thing'],
          ['PATCH', 'Edit', 'PATCH /events/12', 'pink', 'Send only changes'],
          ['DELETE', 'Remove', 'DELETE /events/12', 'white', 'Gone (repeatable)'],
        ].map(([m, v, ex, tint, note]) => (
          <Card key={m} tint={tint} className="method-card">
            <span className="method-name">{m}</span>
            <span className="label">{v}</span>
            <code>{ex}</code>
            <span className="method-note">{note}</span>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: 'response',
    part: 'C',
    title: 'Anatomy of a response',
    bg: 'green',
    lead: 'How it went, extra details, and the data itself.',
    remember: 'Status line + headers + body. Always check the status code first.',
    body: (
      <div className="sg2 wide-left">
        <Message
          blocks={[
            { label: 'Status', tint: 'yellow', lines: 'HTTP/1.1 201 Created' },
            { label: 'Headers', tint: 'blue', lines: 'Content-Type: application/json\nLocation: /api/events/13\nContent-Length: 71' },
            { label: 'Blank line', tint: 'white', lines: ' ' },
            { label: 'Body', tint: 'pink', lines: '{\n  "id": 13,\n  "title": "Hack Night",\n  "venue": "Lab Block B"\n}' },
          ]}
        />
        <div className="stack">
          <Card className="sc-mini"><strong>Status code</strong>: a 3-digit verdict. Read this first.</Card>
          <Card className="sc-mini"><code>Location</code>: where the new thing lives.</Card>
          <Card className="sc-mini"><code>Set-Cookie</code>: “please store this and send it back next time”.</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'status-families',
    part: 'C',
    title: 'Status code families',
    bg: 'offwhite',
    lead: 'The first digit tells you who to blame.',
    remember: '2xx good · 3xx elsewhere · 4xx your mistake · 5xx our mistake.',
    body: (
      <div className="sg5">
        {[
          ['1xx', 'Hold on', 'Informational. Rarely seen.', 'white', 'Waiter: “one moment…”'],
          ['2xx', 'Success', 'It worked.', 'green', '“Here’s your food.”'],
          ['3xx', 'Go elsewhere', 'Redirect to another URL.', 'blue', '“Please use the other counter.”'],
          ['4xx', 'Client’s mistake', 'Fix the request.', 'yellow', '“That’s not on the menu.”'],
          ['5xx', 'Server’s mistake', 'The server broke.', 'pink', '“The kitchen is on fire.”'],
        ].map(([c, t, d, tint, eg]) => (
          <Card key={c} tint={tint} className="family-card">
            <span className="family-code">{c}</span>
            <h3 className="sc-title">{t}</h3>
            <p>{d}</p>
            <p className="family-eg">{eg}</p>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: 'nine-codes',
    part: 'C',
    title: 'The nine to memorise',
    bg: 'blue',
    lead: 'You will use these in every API you build.',
    remember: '200 201 204 · 400 401 403 404 409 · 500',
    body: (
      <div className="sg3 code-grid">
        {[
          ['200', 'OK', 'Here’s what you asked for.', 'green'],
          ['201', 'Created', 'New thing made (after POST).', 'green'],
          ['204', 'No Content', 'Done, nothing to send back.', 'green'],
          ['400', 'Bad Request', 'Missing field or broken JSON.', 'yellow'],
          ['401', 'Unauthorized', 'Who are you? Log in first.', 'yellow'],
          ['403', 'Forbidden', 'We know you. Still no.', 'yellow'],
          ['404', 'Not Found', 'Nothing at that path or ID.', 'yellow'],
          ['409', 'Conflict', 'Clashes with existing data.', 'yellow'],
          ['500', 'Server Error', 'Our code crashed.', 'pink'],
        ].map(([c, t, d, tint]) => (
          <div className={`code-chip card sm tint-${tint}`} key={c}>
            <span className="code-num">{c}</span>
            <span>
              <strong>{t}</strong>
              <br />
              {d}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: '401-403',
    part: 'C',
    title: '401 vs 403',
    bg: 'yellow',
    lead: 'The most confused pair in backend work. Think of your college campus.',
    remember: '401 = who are you? 403 = I know you, and the answer is no.',
    body: (
      <div className="sg2">
        <Card tint="white" className="versus">
          <span className="versus-code">401</span>
          <h3 className="sc-title">The gate guard</h3>
          <p>You arrive without your ID card. The guard doesn’t know who you are.</p>
          <p className="versus-eg"><strong>API:</strong> no token, or an expired token. <em>Fix: log in.</em></p>
        </Card>
        <Card tint="pink" className="versus">
          <span className="versus-code">403</span>
          <h3 className="sc-title">The staff room</h3>
          <p>Your ID is valid, but students aren’t allowed in the staff room.</p>
          <p className="versus-eg"><strong>API:</strong> a logged-in student tries an admin-only delete. <em>Logging in again won’t help.</em></p>
        </Card>
      </div>
    ),
  },

  {
    id: 'rest',
    part: 'C',
    title: 'This style has a name: REST',
    bg: 'green',
    lead: 'You already know the pieces. REST is the agreed way of putting them together.',
    remember: 'REST = resources as nouns, methods as verbs, status codes as results, no memory between requests.',
    body: (
      <>
        <div className="sg4">
          {[
            ['Resources are nouns', 'Everything has an address: `/events`, `/events/12`, `/users/7`.', 'yellow', 'Slide 5'],
            ['Methods are verbs', 'GET reads, POST creates, PATCH edits, DELETE removes.', 'blue', 'Slide 13'],
            ['Status codes are results', '201 created, 404 not found, 403 not allowed.', 'pink', 'Slide 16'],
            ['No memory', 'Each request carries everything it needs, including proof of who you are.', 'white', 'Slide 21'],
          ].map(([t, d, tint, from]) => (
            <Card key={t} tint={tint} className="rest-card">
              <span className="pill tint-white">{from}</span>
              <h3 className="sc-title">{t}</h3>
              <p>{rich(d)}</p>
            </Card>
          ))}
        </div>
        <div className="sg2 mt">
          <Card className="sc-mini">
            <strong>Not REST:</strong> <code>POST /getEvent?id=12</code> · <code>GET /deleteEvent/12</code>
          </Card>
          <Card tint="yellow" className="sc-mini">
            <strong>REST:</strong> <code>GET /events/12</code> · <code>DELETE /events/12</code>. Designing a full one is <strong>Phase 3</strong>.
          </Card>
        </div>
      </>
    ),
  },

  /* ---------------- PART D ---------------- */
  {
    id: 'json',
    part: 'D',
    title: 'JSON: the shared language',
    bg: 'offwhite',
    lead: 'Plain text that every language can read and write. Built from objects and arrays.',
    remember: 'Objects {}, arrays [], and six value types: string, number, boolean, null, object, array.',
    body: (
      <div className="sg2 wide-left">
        <div className="codeblock">
          <div className="code-head"><span>event.json</span></div>
          <pre className="json-demo">{`{
  "id": 12,
  "title": "Hack Night",
  "free": true,
  "capacity": 60,
  "organiser": { "name": "Asha", "year": 3 },
  "tags": ["coding", "pizza"],
  "cancelledAt": null,
  "startsAt": "2026-10-03T18:00:00Z"
}`}</pre>
        </div>
        <div className="stack">
          <Card tint="blue" className="sc-mini"><strong>Object</strong> <code>{'{ }'}</code>: named fields, <code>"key": value</code>.</Card>
          <Card tint="green" className="sc-mini"><strong>Array</strong> <code>[ ]</code>: an ordered list.</Card>
          <Card tint="pink" className="sc-mini"><strong>Values:</strong> string, number, true/false, null, object, array.</Card>
          <Card tint="yellow" className="sc-mini"><strong>Dates</strong> travel as strings (ISO format).</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'json-rules',
    part: 'D',
    title: 'JSON is strict',
    bg: 'pink',
    lead: 'It looks like a JavaScript object, but a single slip makes it invalid.',
    remember: 'Double quotes on keys, no trailing commas, no comments, no functions.',
    body: (
      <div className="sg2">
        <Card>
          <Tag tint="yellow">Broken</Tag>
          <pre className="rule-code bad">{`{
  name: 'Asha',      // no quotes on key, single quotes
  "year": 3,         // comments not allowed
  "greet": () => {}, // no functions
}                    // trailing comma`}</pre>
        </Card>
        <Card>
          <Tag tint="green">Valid</Tag>
          <pre className="rule-code good">{`{
  "name": "Asha",
  "year": 3
}`}</pre>
          <p>In JavaScript, convert with <code>JSON.stringify(obj)</code> (object → text) and <code>JSON.parse(text)</code> (text → object).</p>
        </Card>
      </div>
    ),
  },
  {
    id: 'stateless',
    part: 'D',
    title: 'HTTP is stateless',
    bg: 'cream',
    lead: 'Every request stands alone. The server doesn’t remember the last one.',
    remember: 'No memory between requests, so send proof (cookie or token) every time.',
    body: (
      <div className="sg2">
        <Card>
          <Tag tint="pink">Without proof</Tag>
          <pre className="rule-code">{`POST /login        → 200 "Welcome, Asha!"
GET  /my-events    → 401 "Who are you?"`}</pre>
          <p>The server already forgot the login.</p>
        </Card>
        <Card>
          <Tag tint="green">With proof on every request</Tag>
          <pre className="rule-code">{`POST /login        → 200 + token
GET  /my-events
  Authorization: Bearer <token>
                   → 200 [ …Asha's events ]`}</pre>
          <p>Like showing your ID card at every gate, every time.</p>
        </Card>
        <div className="callout tint-blue span-2">
          <span className="label">Why stateless?</span>
          <div>Any of 50 servers can answer any request, because none of them needs to remember you. That’s how big sites scale. (Phase 6 builds logins with tokens.)</div>
        </div>
      </div>
    ),
  },
  {
    id: 'https',
    part: 'D',
    title: 'HTTP vs HTTPS',
    bg: 'offwhite',
    lead: 'Same conversation. HTTPS wraps it in a lock (TLS).',
    remember: 'HTTPS = privacy + proof of identity + no tampering. Port 443.',
    body: (
      <div className="sg2">
        <Card tint="yellow" className="versus">
          <span className="versus-code">HTTP</span>
          <h3 className="sc-title">A postcard</h3>
          <p>Anyone who handles it (café Wi-Fi, the network, a snoop) can read and even change it. Passwords travel in plain text.</p>
        </Card>
        <Card tint="green" className="versus">
          <span className="versus-code">HTTPS</span>
          <h3 className="sc-title">A sealed envelope</h3>
          <ul>
            <li><strong>Private</strong>: encrypted on the way</li>
            <li><strong>Proven</strong>: a certificate shows it’s really that site</li>
            <li><strong>Untouched</strong>: changes on the way are detected</li>
          </ul>
        </Card>
      </div>
    ),
  },
  {
    id: 'journey',
    part: 'D',
    title: 'The whole journey',
    bg: 'blue',
    lead: 'Everything from today, in the order it happens.',
    remember: 'DNS → connect → request → server → database → response → show.',
    body: (
      <Sequence
        compact
        lanes={[
          { id: 'c', label: 'Client', tint: 'yellow' },
          { id: 'd', label: 'DNS', tint: 'white' },
          { id: 's', label: 'Express server', tint: 'pink' },
          { id: 'b', label: 'Database', tint: 'green' },
        ]}
        steps={[
          { from: 'c', to: 'd', label: '1 · Where is api.campus-events.dev?' },
          { from: 'd', to: 'c', label: '2 · 203.0.113.10' },
          { from: 'c', to: 's', label: '3 · Connect + lock (TCP, TLS)' },
          { from: 'c', to: 's', label: '4 · GET /events/12' },
          { from: 's', to: 'b', label: '5 · Find event 12' },
          { from: 'b', to: 's', label: '6 · Row data' },
          { from: 's', to: 'c', label: '7 · 200 OK + JSON' },
        ]}
      />
    ),
  },
  {
    id: 'try',
    part: 'D',
    title: 'Try it yourself',
    bg: 'green',
    lead: 'The lab sheet has every step. Five missions, in this order.',
    remember: 'See real requests, send your own, look up an IP, then draw what you saw.',
    body: (
      <div className="sg5">
        {[
          ['1', 'Spy on a site', 'DevTools → Network on any site. Find methods, status codes and headers.', 'yellow'],
          ['2', 'Call an API', 'In Postman: GET, POST and DELETE on JSONPlaceholder.', 'pink'],
          ['3', 'Use the terminal', 'Repeat with curl -i and read the raw response.', 'white'],
          ['4', 'Find an IP', 'Run nslookup and match the IP in DevTools.', 'blue'],
          ['5', 'Draw it', 'Sketch the restaurant and the full journey from memory.', 'cream'],
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
    part: 'D',
    title: 'Checkpoint',
    bg: 'offwhite',
    lead: 'Answer these in your own words before we move on.',
    remember: 'If you can explain it to a first-year, you know it.',
    body: (
      <ol className="numlist checkpoint-list">
        <li><div>What is the difference between <strong>401 and 403</strong>? Give an example of each.</div></li>
        <li><div>Why can’t the browser talk to the <strong>database directly</strong>?</div></li>
        <li><div>What does <strong>stateless</strong> mean, and what problem does it create for logins?</div></li>
        <li><div>In <code>https://api.campus.dev/events/12?sort=date</code>, which part is the <strong>path</strong> and which is the <strong>query string</strong>?</div></li>
        <li><div>Walk through what happens after you press <strong>Enter</strong> on a URL, step by step.</div></li>
      </ol>
    ),
  },
  {
    id: 'next',
    part: 'D',
    title: 'Next: JavaScript & Node.js',
    bg: 'black',
    layout: 'close',
    remember: 'Phase 1: write JavaScript on the server and build a server with no framework.',
    body: (
      <div className="close">
        <div className="close-frame">
          <span className="pill tint-yellow">Coming up · Phase 1</span>
          <h2 className="display close-title">You now know what a server does. Next, you build one.</h2>
          <pre className="close-code">{`// Phase 2 preview: this is all a server is
app.get('/events/:id', (req, res) => {
  res.status(200).json({ id: req.params.id });
});`}</pre>
        </div>
        <span className="star close-star">NEXT</span>
      </div>
    ),
  },
];
