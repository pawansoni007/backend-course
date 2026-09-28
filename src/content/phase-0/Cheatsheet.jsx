/* ===========================================================
   CHEAT SHEET — Phase 0 on one page, built for quick lookup.
   =========================================================== */
import { SectionHead, Table, CodeBlock, Callout } from '../../components/ui.jsx';
import { Flow, UrlAnatomy, Sequence } from '../../components/diagrams.jsx';
import { glossary } from './glossary.js';
import { rich, slug } from '../../lib.jsx';

export const cheatSections = [
  { id: 'cs-big', title: 'The big picture', keywords: 'client server api database restaurant' },
  { id: 'cs-url', title: 'Parts of a URL', keywords: 'scheme domain port path query fragment' },
  { id: 'cs-request', title: 'Request anatomy', keywords: 'method path headers body' },
  { id: 'cs-response', title: 'Response anatomy', keywords: 'status line headers body' },
  { id: 'cs-methods', title: 'HTTP methods', keywords: 'get post put patch delete crud idempotent' },
  { id: 'cs-status', title: 'Status codes', keywords: '200 201 204 400 401 403 404 409 500 families' },
  { id: 'cs-headers', title: 'Common headers', keywords: 'content-type authorization accept host cookie' },
  { id: 'cs-json', title: 'JSON rules', keywords: 'json parse stringify types' },
  { id: 'cs-ports', title: 'Ports to know', keywords: '80 443 3000 5432 localhost' },
  { id: 'cs-dns', title: 'How DNS finds a server', keywords: 'dns resolver root tld ttl' },
  { id: 'cs-rules', title: 'Stateless & HTTPS', keywords: 'stateless cookie token https tls certificate' },
  { id: 'cs-journey', title: 'The full journey', keywords: 'what happens when you type a url' },
  { id: 'cs-curl', title: 'curl quick reference', keywords: 'terminal command' },
  { id: 'cs-glossary', title: 'Glossary', keywords: 'terms definitions' },
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
      <Sec id="cs-big" eyebrow="01" tint="yellow" title="The big picture">
        <Flow
          nodes={[
            { tag: 'Customer', title: 'Client', sub: 'Browser, app, Postman, curl', tint: 'yellow' },
            { tag: 'Waiter', title: 'API', sub: 'Fixed menu of endpoints', tint: 'blue' },
            { tag: 'Kitchen', title: 'Server', sub: 'Runs the code (Express)', tint: 'pink' },
            { tag: 'Pantry', title: 'Database', sub: 'Stores data permanently', tint: 'green' },
          ]}
          arrows={['request →', 'handles →', 'query →']}
          back={['← response', '← result', '← rows']}
        />
        <p className="prose">
          A <strong>client</strong> always starts; a <strong>server</strong> always answers. The frontend shows, the backend decides,
          the database remembers. Users never talk to the database directly: the backend holds the secrets, checks input and permissions, and applies the rules.
        </p>
      </Sec>

      <Sec id="cs-url" eyebrow="02" tint="blue" title="Parts of a URL">
        <UrlAnatomy
          parts={[
            { text: 'https', label: 'Scheme', tint: 'yellow' },
            { text: '://', label: '', tint: 'white' },
            { text: 'api.campus.dev', label: 'Domain', tint: 'blue' },
            { text: ':443', label: 'Port', tint: 'cream' },
            { text: '/events/12', label: 'Path', tint: 'pink' },
            { text: '?sort=date&page=2', label: 'Query', tint: 'green' },
            { text: '#reviews', label: 'Fragment', tint: 'white' },
          ]}
        />
        <Table
          head={['Part', 'Job', 'Sent to server?']}
          rows={[
            ['Scheme', 'Which rules: `http` or `https`', 'Decides how to connect'],
            ['Domain', 'Which server (DNS turns it into an IP)', 'Yes, as the `Host` header'],
            ['Port', 'Which program on that server (hidden when default)', 'Used to connect'],
            ['Path', 'Which thing: `/events/12`', 'Yes'],
            ['Query string', 'Options: filter, sort, page. `key=value` joined by `&`', 'Yes'],
            ['Fragment', 'A spot on the page, used by the browser only', '**No, never**'],
          ]}
        />
      </Sec>

      <div className="grid g2 cs-pair">
        <Sec id="cs-request" eyebrow="03" tint="pink" title="Request anatomy">
          <CodeBlock
            lang="http"
            title="Request"
            code={`POST /api/events HTTP/1.1
Host: api.campus-events.dev
Content-Type: application/json
Authorization: Bearer eyJhbGciOi…

{ "title": "Hack Night", "venue": "Lab Block B" }`}
          />
          <p><strong>Method + path + version</strong>, then <strong>headers</strong>, a blank line, and an optional <strong>body</strong>.</p>
        </Sec>
        <Sec id="cs-response" eyebrow="04" tint="green" title="Response anatomy">
          <CodeBlock
            lang="http"
            title="Response"
            code={`HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/events/13

{ "id": 13, "title": "Hack Night", "venue": "Lab Block B" }`}
          />
          <p><strong>Status line</strong> (version, code, reason), then <strong>headers</strong>, a blank line, and the <strong>body</strong>.</p>
        </Sec>
      </div>

      <Sec id="cs-methods" eyebrow="05" tint="yellow" title="HTTP methods">
        <Table
          head={['Method', 'Does', 'Example', 'Body?', 'Idempotent?', 'Success code']}
          rows={[
            ['`GET`', 'Read', '`GET /events?category=tech`', 'No', 'Yes', '200'],
            ['`POST`', 'Create', '`POST /events`', 'Yes', '**No**: twice = two', '201'],
            ['`PUT`', 'Replace whole thing', '`PUT /events/12`', 'Yes (all fields)', 'Yes', '200'],
            ['`PATCH`', 'Change some fields', '`PATCH /events/12`', 'Yes (changed fields)', 'Not guaranteed', '200'],
            ['`DELETE`', 'Remove', '`DELETE /events/12`', 'Usually no', 'Yes', '204 or 200'],
          ]}
        />
        <Callout label="Idempotent" tint="cream">Doing it once or ten times leaves the same end result. That’s why retrying a GET is safe, but double-clicking “Pay” (POST) is not.</Callout>
      </Sec>

      <Sec id="cs-status" eyebrow="06" tint="pink" title="Status codes">
        <div className="families">
          {[
            ['1xx', 'Informational', 'white'],
            ['2xx', 'Success', 'green'],
            ['3xx', 'Redirect', 'blue'],
            ['4xx', 'Client’s mistake', 'yellow'],
            ['5xx', 'Server’s mistake', 'pink'],
          ].map(([c, t, tint]) => (
            <div key={c} className={`family tint-${tint}`}><strong>{c}</strong><span>{t}</span></div>
          ))}
        </div>
        <Table
          head={['Code', 'Name', 'Use it when…']}
          rows={[
            ['**200**', 'OK', 'Request worked; here is the data.'],
            ['**201**', 'Created', 'A POST made something new.'],
            ['**204**', 'No Content', 'Worked, nothing to send back (often DELETE).'],
            ['301 / 302', 'Moved', 'The thing lives at another URL (see `Location` header).'],
            ['304', 'Not Modified', 'Your cached copy is still fresh.'],
            ['**400**', 'Bad Request', 'Malformed JSON, missing or invalid fields.'],
            ['**401**', 'Unauthorized', 'Not logged in / no valid token. “Who are you?”'],
            ['**403**', 'Forbidden', 'Logged in, but not allowed. “I know you. No.”'],
            ['**404**', 'Not Found', 'No such path or ID.'],
            ['**409**', 'Conflict', 'Clashes with current data, e.g. duplicate email.'],
            ['422', 'Unprocessable', 'Valid JSON, but the values break the rules (some APIs use 400 instead).'],
            ['429', 'Too Many Requests', 'Rate limit hit; slow down.'],
            ['**500**', 'Internal Server Error', 'Our code crashed.'],
            ['502 / 503', 'Bad Gateway / Unavailable', 'A server in front or behind is down or overloaded.'],
          ]}
        />
        <p className="muted">Bold = the nine to memorise.</p>
      </Sec>

      <Sec id="cs-headers" eyebrow="07" tint="blue" title="Common headers">
        <Table
          head={['Header', 'Sent by', 'Meaning', 'Example']}
          rows={[
            ['`Host`', 'Client', 'Which website on the server', '`Host: api.campus-events.dev`'],
            ['`Content-Type`', 'Both', 'Format of the body', '`application/json`'],
            ['`Accept`', 'Client', 'Format I’d like back', '`application/json`'],
            ['`Authorization`', 'Client', 'Proof of who I am', '`Bearer eyJhbGciOi…`'],
            ['`User-Agent`', 'Client', 'Which program is asking', '`Mozilla/5.0 …` or `curl/8.4.0`'],
            ['`Cookie`', 'Client', 'Cookies the site stored earlier', '`session=abc123`'],
            ['`Set-Cookie`', 'Server', 'Please store this cookie', '`session=abc123; HttpOnly; Secure`'],
            ['`Location`', 'Server', 'Where to go / where the new thing is', '`/api/events/13`'],
            ['`Cache-Control`', 'Server', 'How long it may be cached', '`max-age=60`'],
          ]}
        />
      </Sec>

      <Sec id="cs-json" eyebrow="08" tint="green" title="JSON rules">
        <div className="grid g2">
          <CodeBlock
            lang="json"
            title="Valid JSON"
            code={`{
  "id": 12,
  "title": "Hack Night",
  "free": true,
  "tags": ["coding", "pizza"],
  "organiser": { "name": "Asha", "year": 3 },
  "cancelledAt": null,
  "startsAt": "2026-10-03T18:00:00Z"
}`}
          />
          <div className="card">
            <h3 className="h-sm">The rules</h3>
            <ul>
              <li>Keys and strings use <strong>double quotes</strong>.</li>
              <li>Six value types: string, number, <code>true</code>/<code>false</code>, <code>null</code>, object, array.</li>
              <li><strong>No</strong> trailing commas, comments, functions or <code>undefined</code>.</li>
              <li>Dates travel as ISO strings: <code>"2026-10-03T18:00:00Z"</code>.</li>
              <li>Send it with <code>Content-Type: application/json</code>.</li>
              <li><code>JSON.stringify(obj)</code> → text · <code>JSON.parse(text)</code> → object.</li>
            </ul>
          </div>
        </div>
      </Sec>

      <div className="grid g2 cs-pair">
        <Sec id="cs-ports" eyebrow="09" tint="cream" title="Ports to know">
          <Table
            head={['Port', 'Used for']}
            rows={[
              ['`80`', 'HTTP'],
              ['`443`', 'HTTPS'],
              ['`3000`', 'Express apps in development (convention)'],
              ['`5173`', 'Vite dev server (frontend)'],
              ['`5432`', 'PostgreSQL'],
              ['`27017`', 'MongoDB'],
              ['`22`', 'SSH'],
            ]}
          />
          <p><code>localhost</code> = <code>127.0.0.1</code> = this computer. Full address = IP + port, e.g. <code>127.0.0.1:3000</code>.</p>
        </Sec>
        <Sec id="cs-dns" eyebrow="10" tint="yellow" title="How DNS finds a server">
          <ol className="numlist">
            <li><div><strong>Cache</strong>: browser, then operating system (and the hosts file).</div></li>
            <li><div><strong>Resolver</strong>: your ISP’s, or public ones like <code>1.1.1.1</code> and <code>8.8.8.8</code>.</div></li>
            <li><div><strong>Root server</strong>: “ask the <code>.com</code> servers”.</div></li>
            <li><div><strong>TLD server</strong>: “ask github.com’s name server”.</div></li>
            <li><div><strong>Authoritative server</strong>: “it’s <code>140.82.112.3</code>”.</div></li>
          </ol>
          <p>The answer is cached for its <strong>TTL</strong> (time to live).</p>
        </Sec>
      </div>

      <Sec id="cs-rules" eyebrow="11" tint="pink" title="Stateless & HTTPS">
        <div className="grid g2">
          <div className="card">
            <h3 className="h-sm">Stateless</h3>
            <p>Every request stands alone; the server doesn’t remember the previous one. So the client sends proof every time:</p>
            <ul>
              <li><strong>Cookie</strong>: stored by the browser, sent automatically.</li>
              <li><strong>Token</strong>: sent in <code>Authorization: Bearer …</code>.</li>
            </ul>
            <p className="muted">Upside: any server in a big fleet can answer any request.</p>
          </div>
          <div className="card">
            <h3 className="h-sm">HTTPS = HTTP + TLS</h3>
            <ul>
              <li><strong>Private</strong>: encrypted, so snoopers see noise.</li>
              <li><strong>Proven</strong>: a certificate from a trusted authority shows it’s really that site.</li>
              <li><strong>Untouched</strong>: tampering on the way is detected.</li>
            </ul>
            <p className="muted">HTTP = postcard. HTTPS = sealed envelope. Default port 443.</p>
          </div>
        </div>
      </Sec>

      <Sec id="cs-journey" eyebrow="12" tint="green" title="The full journey">
        <Sequence
          lanes={[
            { id: 'c', label: 'Client', tint: 'yellow' },
            { id: 'd', label: 'DNS', tint: 'white' },
            { id: 's', label: 'Server', tint: 'pink' },
            { id: 'b', label: 'Database', tint: 'green' },
          ]}
          steps={[
            { from: 'c', to: 'd', label: '1 · Where is the domain?' },
            { from: 'd', to: 'c', label: '2 · Here is the IP' },
            { from: 'c', to: 's', label: '3 · Connect + TLS' },
            { from: 'c', to: 's', label: '4 · HTTP request' },
            { from: 's', to: 'b', label: '5 · Query' },
            { from: 'b', to: 's', label: '6 · Rows' },
            { from: 's', to: 'c', label: '7 · Response + status' },
          ]}
        />
      </Sec>

      <Sec id="cs-curl" eyebrow="13" tint="blue" title="curl quick reference">
        <CodeBlock
          lang="bash"
          title="Terminal"
          code={`# GET and show the status line + headers too
curl -i https://jsonplaceholder.typicode.com/posts/1

# only the headers (HEAD request)
curl -I https://jsonplaceholder.typicode.com/posts/1

# POST JSON
curl -i -X POST https://jsonplaceholder.typicode.com/posts \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Hack Night","body":"Lab Block B","userId":1}'

# DELETE
curl -i -X DELETE https://jsonplaceholder.typicode.com/posts/1

# see everything, including the request you sent
curl -v https://jsonplaceholder.typicode.com/posts/1

# look up a domain's IP
nslookup github.com`}
        />
        <p className="muted">On Windows, run these in Git Bash or WSL exactly as written. In PowerShell, type <code>curl.exe</code> instead of <code>curl</code> (plain <code>curl</code> there is a different command).</p>
      </Sec>

      <Sec id="cs-glossary" eyebrow="14" tint="yellow" title="Glossary">
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
