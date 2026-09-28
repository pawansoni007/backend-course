/* ===========================================================
   LAB WORKSHEET — five missions plus a bonus.
   Answers and ticks are remembered in this browser only.
   =========================================================== */
import { SectionHead, CodeBlock, Callout, Check, Field } from '../../components/ui.jsx';

export const labSections = [
  { id: 'lab-setup', title: 'Setup', keywords: 'install postman devtools' },
  { id: 'lab-1', title: 'Mission 1 · Spy on a website', keywords: 'devtools network tab' },
  { id: 'lab-2', title: 'Mission 2 · Call an API with Postman', keywords: 'postman jsonplaceholder get post delete' },
  { id: 'lab-3', title: 'Mission 3 · The same thing with curl', keywords: 'curl terminal raw' },
  { id: 'lab-4', title: 'Mission 4 · Find a server’s IP', keywords: 'nslookup dns remote address' },
  { id: 'lab-5', title: 'Mission 5 · Draw it from memory', keywords: 'draw diagram' },
  { id: 'lab-bonus', title: 'Bonus · A real-world API', keywords: 'github api headers rate limit' },
  { id: 'lab-reflect', title: 'Reflection', keywords: 'notes' },
];

const API = 'https://jsonplaceholder.typicode.com';

function Reveal({ children }) {
  return (
    <details className="ask">
      <summary><span className="label">Check yourself</span><span>Show the expected result</span></summary>
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

function PostmanStep({ id, method, path, body, ask, expect }) {
  return (
    <div className="card sm pm-step">
      <div className="pm-line">
        <span className={`method m-${method.toLowerCase()}`}>{method}</span>
        <code className="pm-url">{API}{path}</code>
      </div>
      {body && <CodeBlock lang="json" title="Body → raw → JSON" code={body} />}
      <div className="grid g2" style={{ '--gap': '12px' }}>
        <Field id={`${id}-status`} label="Status code you got" placeholder="e.g. 200" />
        <Field id={`${id}-note`} label={ask} />
      </div>
      <Reveal>{expect}</Reveal>
    </div>
  );
}

export default function Lab() {
  return (
    <div className="stack" style={{ '--gap': '56px' }}>
      <Callout label="How this works" tint="cream">
        Work through the missions in order. Type your answers in the boxes; they are saved in this browser only, so use the same device to come back to them.
      </Callout>

      <section className="stack" id="lab-setup">
        <SectionHead eyebrow="Before you start" tint="blue" title="Setup" level={2} />
        <div className="card checklist">
          <Check id="lab-s1">Chrome, Edge or Firefox is open.</Check>
          <Check id="lab-s2">Postman is installed and open (a free account is fine), or Thunder Client inside VS Code.</Check>
          <Check id="lab-s3">A terminal is open. Typing <code>curl --version</code> prints a version number.</Check>
          <Check id="lab-s4">Paper and a pen are nearby.</Check>
        </div>
      </section>

      <Mission id="lab-1" n="1" tint="yellow" title="Spy on a website" goal="See the real requests a page makes, with their methods, status codes and headers.">
        <ol className="numlist">
          <li><div>Open any site you use (a news site, Wikipedia, your college site).</div></li>
          <li><div>Open DevTools: <kbd>F12</kbd>, or <kbd>Cmd</kbd>+<kbd>Opt</kbd>+<kbd>I</kbd> on Mac. Click the <strong>Network</strong> tab.</div></li>
          <li><div>Reload the page (<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>R</kbd>). Watch the list fill with requests.</div></li>
          <li><div>Click the first request (the page itself). Under <strong>Headers</strong>, find the method, status code and <code>content-type</code>.</div></li>
          <li><div>Filter by <strong>Fetch/XHR</strong>. These are usually API calls returning JSON. Click one and open <strong>Preview</strong> or <strong>Response</strong>.</div></li>
        </ol>
        <div className="card">
          <h3 className="h-sm">Record five requests</h3>
          <div className="rec-table">
            <span className="label">Path (short)</span><span className="label">Method</span><span className="label">Status</span><span className="label">Content-Type</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <div className="rec-row" key={r}>
                <Field id={`l1-r${r}-path`} placeholder={r === 1 ? '/' : '/api/…'} />
                <Field id={`l1-r${r}-m`} placeholder="GET" />
                <Field id={`l1-r${r}-s`} placeholder="200" />
                <Field id={`l1-r${r}-ct`} placeholder="text/html" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid g2">
          <Field id="l1-q1" label="Did you find any request that was not 2xx? Which code?" multiline />
          <Field id="l1-q2" label="Which request returned JSON? What was inside?" multiline />
        </div>
      </Mission>

      <Mission id="lab-2" n="2" tint="pink" title="Call an API with Postman" goal="Send every kind of request yourself and read the status code before the body.">
        <Callout label="About this API" tint="blue">
          JSONPlaceholder is a free fake API for practice. It answers POST, PATCH and DELETE realistically but does not really save anything, so your new post won’t appear afterwards.
        </Callout>
        <div className="stack" style={{ '--gap': '22px' }}>
          <PostmanStep id="l2a" method="GET" path="/posts" ask="How many posts came back?" expect={<>Status <strong>200</strong>, and an array of <strong>100</strong> posts.</>} />
          <PostmanStep id="l2b" method="GET" path="/posts/1" ask="What is post 1’s userId?" expect={<>Status <strong>200</strong>, one object with <code>userId: 1</code>, <code>id: 1</code>, a title and a body.</>} />
          <PostmanStep id="l2c" method="GET" path="/posts?userId=1" ask="How many posts did user 1 write?" expect={<>Status <strong>200</strong>, and <strong>10</strong> posts. The query string filtered the list.</>} />
          <PostmanStep id="l2d" method="GET" path="/posts/9999" ask="What did the body contain?" expect={<>Status <strong>404</strong>, with an empty object <code>{'{}'}</code>. No post has that id.</>} />
          <PostmanStep
            id="l2e"
            method="POST"
            path="/posts"
            body={`{
  "title": "Hack Night",
  "body": "Lab Block B, Saturday 6 pm",
  "userId": 1
}`}
            ask="What id did the new post get?"
            expect={<>Status <strong>201 Created</strong>. Your data comes back with <code>"id": 101</code>. Try removing the <code>Content-Type: application/json</code> header and compare the result.</>}
          />
          <PostmanStep
            id="l2f"
            method="PATCH"
            path="/posts/1"
            body={`{ "title": "Changed title" }`}
            ask="Which fields changed?"
            expect={<>Status <strong>200</strong>. Only the title changed; everything else came back as before. That’s PATCH.</>}
          />
          <PostmanStep id="l2g" method="DELETE" path="/posts/1" ask="What was in the body?" expect={<>Status <strong>200</strong> with <code>{'{}'}</code>. Many APIs return <strong>204</strong> here instead; both are fine.</>} />
        </div>
      </Mission>

      <Mission id="lab-3" n="3" tint="white" title="The same thing with curl" goal="See the raw text of HTTP without any app in between.">
        <CodeBlock
          lang="bash"
          title="Run these one at a time"
          code={`curl -i ${API}/posts/1

curl -i -X POST ${API}/posts \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Hack Night","body":"Lab Block B","userId":1}'

curl -v ${API}/posts/1`}
        />
        <p className="muted">On Windows, use Git Bash or WSL. In PowerShell, type <code>curl.exe</code> instead of <code>curl</code>.</p>
        <div className="grid g2">
          <Field id="l3-q1" label="With -i, which line shows the status code?" multiline />
          <Field id="l3-q2" label="Copy the Content-Type header you received" />
          <Field id="l3-q3" label="With -v, lines starting with > are what? And < ?" multiline />
          <Field id="l3-q4" label="What does -X change? What does -H add? What is -d?" multiline />
        </div>
        <Reveal>
          The first line, like <code>HTTP/2 200</code>, is the status line. <code>&gt;</code> lines are the request you sent; <code>&lt;</code> lines are the response headers.
          <code>-X</code> sets the method, <code>-H</code> adds a header, and <code>-d</code> sends a body.
        </Reveal>
      </Mission>

      <Mission id="lab-4" n="4" tint="blue" title="Find a server’s IP" goal="Watch DNS turn a name into a number, then spot that number in the browser.">
        <CodeBlock lang="bash" title="Terminal" code={`nslookup github.com`} />
        <ol className="numlist">
          <li><div>Write down the address from the <strong>Answer</strong> part of the output.</div></li>
          <li><div>Open <code>https://github.com</code> with DevTools → Network, reload, and click the first request.</div></li>
          <li><div>Under Headers → General, find <strong>Remote Address</strong>. It shows IP:port.</div></li>
        </ol>
        <div className="grid g2">
          <Field id="l4-ip" label="IP from nslookup" placeholder="140.82.…" />
          <Field id="l4-remote" label="Remote Address in DevTools" placeholder="…:443" />
        </div>
        <Reveal>The port is <strong>443</strong> because the site uses HTTPS. If the two IPs differ slightly, that’s normal: big sites run many servers and DNS can hand out different ones.</Reveal>
      </Mission>

      <Mission id="lab-5" n="5" tint="cream" title="Draw it from memory" goal="If you can draw it, you understand it. No peeking at the slides.">
        <div className="grid g2">
          <div className="card">
            <h3 className="h-sm">Drawing A · The restaurant</h3>
            <div className="stack" style={{ '--gap': '10px' }}>
              <Check id="l5a-1">Customer, waiter, kitchen and pantry, each with its real name (client, API, server, database).</Check>
              <Check id="l5a-2">Arrows for the order going in and the food coming back.</Check>
              <Check id="l5a-3">A note saying why the customer can’t enter the kitchen.</Check>
            </div>
          </div>
          <div className="card">
            <h3 className="h-sm">Drawing B · The full journey</h3>
            <div className="stack" style={{ '--gap': '10px' }}>
              <Check id="l5b-1">DNS lookup, with a name going in and an IP coming out.</Check>
              <Check id="l5b-2">Connection to IP:443, with TLS.</Check>
              <Check id="l5b-3">The request line: method + path.</Check>
              <Check id="l5b-4">Server → database → server.</Check>
              <Check id="l5b-5">The response, with a status code and JSON.</Check>
            </div>
          </div>
        </div>
        <p>Then compare with the <a href="#/phase-0/journey">interactive journey</a>.</p>
      </Mission>

      <Mission id="lab-bonus" n="+" tint="green" title="Bonus · A real-world API" goal="Read a production API that millions of developers use.">
        <ol className="numlist">
          <li><div>Open <code>https://api.github.com/users/octocat</code> directly in the browser. That’s raw JSON from GitHub’s API.</div></li>
          <li><div>Run <code>curl -i https://api.github.com/users/octocat</code> and look through the headers.</div></li>
          <li><div>Find the headers starting with <code>x-ratelimit-</code>. What do you think they are for?</div></li>
          <li><div>Try a user that doesn’t exist, like <code>/users/this-user-should-not-exist-12345</code>. What status and body come back?</div></li>
        </ol>
        <Field id="lb-q1" label="What did the rate-limit headers tell you?" multiline />
        <Reveal>GitHub limits how many requests you can make per hour without logging in. <code>x-ratelimit-remaining</code> counts down with each call. A missing user returns <strong>404</strong> with a JSON message.</Reveal>
      </Mission>

      <section className="stack" id="lab-reflect">
        <SectionHead eyebrow="Wrap up" tint="yellow" title="Reflection" level={2} />
        <div className="grid g3">
          <Field id="lr-1" label="One thing that surprised me" multiline />
          <Field id="lr-2" label="One thing I’m still unsure about" multiline />
          <Field id="lr-3" label="How I’d explain HTTP to a friend" multiline />
        </div>
      </section>
    </div>
  );
}
