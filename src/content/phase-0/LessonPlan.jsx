/* ===========================================================
   LESSON PLAN — the teacher's script for Phase 0 (no timings).
   Four parts, each ending at a natural pause point, so the
   lesson can spill into a second day without losing the thread.
   =========================================================== */
import { SectionHead, Callout, Check } from '../../components/ui.jsx';
import { Link } from '../../lib.jsx';

export const lessonSections = [
  { id: 'lp-how', title: 'How to use this plan', keywords: 'teacher guide' },
  { id: 'lp-before', title: 'Before the session', keywords: 'setup checklist postman chrome' },
  { id: 'lp-a', title: 'Part A · The big picture', keywords: 'restaurant client server api backend' },
  { id: 'lp-b', title: 'Part B · Finding the server', keywords: 'ip dns ports url' },
  { id: 'lp-c', title: 'Part C · Speaking HTTP', keywords: 'request response methods status codes 401 403' },
  { id: 'lp-d', title: 'Part D · Data & rules', keywords: 'json stateless https journey' },
  { id: 'lp-wrap', title: 'Wrap-up & homework', keywords: 'homework checkpoint quiz' },
  { id: 'lp-day2', title: 'Continuing on another day', keywords: 'warm up recap day 2' },
  { id: 'lp-mixups', title: 'Common mix-ups to watch for', keywords: 'misconceptions mistakes' },
];

const S = ({ from, to }) => (
  <Link className="pill tint-blue slide-link" to={`/phase-0/slides?s=${from}`}>
    Slides {from}–{to}
  </Link>
);

function Ask({ q, a }) {
  return (
    <details className="ask">
      <summary>
        <span className="label">Ask</span>
        <span>{q}</span>
      </summary>
      <div className="ask-a"><span className="label">Listen for</span> {a}</div>
    </details>
  );
}

function Part({ id, letter, title, tint, slides, goal, say, asks, watch, activity, pause }) {
  return (
    <section className="lp-part" id={id}>
      <div className="lp-part-head">
        <span className={`icon-sq tint-${tint}`}>{letter}</span>
        <div className="stack" style={{ '--gap': '8px' }}>
          <h2 className="display h-md">{title}</h2>
          <div className="row">{slides}</div>
        </div>
      </div>
      <p className="lp-goal"><strong>By the end, he can:</strong> {goal}</p>

      <div className="lp-block">
        <h3 className="h-sm">Say it like this</h3>
        <ol className="numlist">{say.map((s, i) => <li key={i}><div>{s}</div></li>)}</ol>
      </div>

      <div className="lp-block">
        <h3 className="h-sm">Ask him (tap to see what to listen for)</h3>
        <div className="stack" style={{ '--gap': '10px' }}>{asks.map((a, i) => <Ask key={i} {...a} />)}</div>
      </div>

      <div className="grid g2">
        <Callout label="Watch for" tint="pink">{watch}</Callout>
        <Callout label="Quick activity" tint="green">{activity}</Callout>
      </div>

      <div className="pause-point">
        <span className="pill tint-yellow">Good place to pause</span>
        <span>{pause}</span>
      </div>
    </section>
  );
}

export default function LessonPlan() {
  return (
    <div className="stack" style={{ '--gap': '56px' }}>
      <section className="stack" id="lp-how">
        <SectionHead eyebrow="Teacher’s copy" tint="yellow" title="How to use this plan" level={2} />
        <div className="prose">
          <p>
            Phase 0 is all mental model, no coding. The student should leave able to trace one request from the browser to the database and back,
            in his own words. The plan follows the slides in four parts. Each part ends at a natural stopping point, so you can finish today or carry the rest to another day.
          </p>
          <p>Use the same rhythm for every part:</p>
        </div>
        <ol className="numlist rhythm">
          <li><div><strong>Explain</strong> with the analogy first, before any jargon.</div></li>
          <li><div><strong>Show</strong> it for real (DevTools, Postman or the <Link to="/phase-0/journey">request journey</Link>).</div></li>
          <li><div><strong>Ask</strong> the questions below and let him answer fully before you correct anything.</div></li>
          <li><div><strong>Check</strong> with one line: “Explain this to a first-year who has never coded.”</div></li>
        </ol>
      </section>

      <section className="stack" id="lp-before">
        <SectionHead eyebrow="Setup" tint="blue" title="Before the session" level={2} />
        <div className="card checklist">
          <Check id="lp-chrome">Chrome or Firefox installed, and he knows how to open DevTools (<kbd>F12</kbd>, or <kbd>Cmd</kbd>+<kbd>Opt</kbd>+<kbd>I</kbd> on Mac).</Check>
          <Check id="lp-postman">Postman installed (or the Thunder Client extension in VS Code).</Check>
          <Check id="lp-terminal">A terminal he can open. <code>curl --version</code> works (it ships with macOS, Windows 10+ and Linux).</Check>
          <Check id="lp-paper">Paper and pen for the drawing missions.</Check>
          <Check id="lp-links">This site open on the <Link to="/phase-0/slides">slides</Link>, plus the <Link to="/phase-0/lab">lab worksheet</Link> on his screen or phone.</Check>
        </div>
      </section>

      <Part
        id="lp-a"
        letter="A"
        tint="yellow"
        title="The big picture"
        slides={<><S from={1} to={6} /></>}
        goal="name the client, API, server and database in any app he uses, and explain why users never touch the database."
        say={[
          <>Start with the restaurant before any tech words. The customer never walks into the kitchen; they order from a menu and the waiter carries it back and forth. Draw it on paper as you talk.</>,
          <>Now swap the words: customer = <strong>client</strong>, waiter = <strong>API</strong>, kitchen = <strong>server</strong>, pantry = <strong>database</strong>. The menu is the API’s list of endpoints.</>,
          <>A client is anything that asks. Point at his phone: “Instagram is a client. When you pull to refresh, it sends a request.”</>,
          <>A server never speaks first. It sits and listens. Later his own laptop will be both: the Express app is the server, the browser is the client.</>,
          <>An API is a fixed set of doors. Show the Campus Events menu slide: each door is a method plus a path. Websites send HTML for humans; APIs send JSON for programs.</>,
          <>Three layers: frontend shows, backend decides, database remembers. Then ask what breaks if the app talks to the database directly, and let him work it out.</>,
        ]}
        asks={[
          { q: 'Name the client, the server and the database when you order on Swiggy.', a: 'The Swiggy app is the client, Swiggy’s backend is the server, and restaurant, menu and order data live in their database. Bonus: the restaurant’s tablet is also a client.' },
          { q: 'Can a server also be a client?', a: 'Yes. When Swiggy’s server calls a payment gateway’s API, it is the client in that conversation.' },
          { q: 'Why not let the app query the database directly?', a: 'The password would ship inside the app, anyone could run any query, and there’d be nowhere to validate input or check permissions.' },
        ]}
        watch={<>He may think “server” only means a physical machine. Stress that it is <strong>a program that listens</strong>, which runs on some machine.</>}
        activity={<>Pick three apps on his phone. For each, he names one thing the client asks for and what the server probably sends back.</>}
        pause="He can re-draw the restaurant from memory with the four real names on it."
      />

      <Part
        id="lp-b"
        letter="B"
        tint="blue"
        title="Finding the server"
        slides={<><S from={7} to={10} /></>}
        goal="explain how a domain name becomes an IP address, what a port is, and label every part of a URL."
        say={[
          <>An IP address is a phone number for a computer. Show <code>127.0.0.1</code> and tell him he will type <code>localhost</code> a thousand times this course.</>,
          <>Nobody memorises phone numbers; you save contacts. DNS is the phonebook that turns <code>api.github.com</code> into a number.</>,
          <>Walk the DNS chain: your cache, then the resolver, then root, then <code>.com</code>, then the domain’s own server. Then point out that the answer is cached, which is why the second visit is faster.</>,
          <>The IP finds the building; the port finds the department. 443 for HTTPS, 80 for HTTP, 3000 for our Express app while developing.</>,
          <>Break a URL into parts on the board: scheme, domain, port, path, query string, fragment. The fragment never leaves the browser.</>,
        ]}
        asks={[
          { q: 'You type google.com. How does your laptop find the right computer?', a: 'DNS: check the cache, ask a resolver, which asks root, then .com, then Google’s name server, and gets an IP back.' },
          { q: 'Why don’t we see :443 in most URLs?', a: 'It’s the default for https, so the browser hides it.' },
          { q: 'In /events/12?sort=date, what is 12 and what is sort=date?', a: '12 is part of the path (which event); sort=date is a query-string option (how to show it).' },
        ]}
        watch={<>Mixing up <strong>path</strong> and <strong>query string</strong>. Rule of thumb: the path says <em>which thing</em>, the query says <em>how</em> (filter, sort, page).</>}
        activity={<>Lab mission 4: run <code>nslookup github.com</code>. He writes the IP, then opens <code>https://github.com</code> and finds the same IP under “Remote Address” in DevTools.</>}
        pause="He can label every part of https://api.campus.dev:443/events/12?sort=date#top without help."
      />

      <Part
        id="lp-c"
        letter="C"
        tint="pink"
        title="Speaking HTTP"
        slides={<><S from={11} to={18} /></>}
        goal="read a raw request and response, pick the right method for an action, and know the nine key status codes, especially 401 vs 403."
        say={[
          <>HTTP is just text with a strict shape. Show the raw request on the slide: request line, headers, blank line, body.</>,
          <>The method is the verb, the path is the noun. <code>GET /events</code> reads, <code>POST /events</code> creates, <code>PATCH /events/12</code> edits, <code>DELETE /events/12</code> removes.</>,
          <>PUT replaces the whole thing, PATCH changes only the fields you send. Send PUT with one field missing and that field is gone.</>,
          <>The response has a status line, headers and a body. Always read the status code first.</>,
          <>The first digit says who to blame: 4xx the client, 5xx the server. Use the restaurant lines on the slide.</>,
          <>401 vs 403 with the campus analogy: the gate guard (who are you?) vs the staff room (I know you, still no).</>,
          <>Close Part C by naming what he just learned: this style is called <strong>REST</strong>. Things are nouns in the path, the method is the verb, the status code is the result. Keep it to one slide; we design a full REST API in Phase 3.</>,
        ]}
        asks={[
          { q: 'Which method to change only an event’s venue?', a: 'PATCH /events/:id with just the venue field.' },
          { q: 'The server crashed while saving. Whose fault, and which code?', a: 'The server’s, so 500 (a 5xx).' },
          { q: 'A student deletes another student’s event. 401 or 403?', a: '403: we know who they are, and they aren’t allowed.' },
          { q: 'Why is POST dangerous to send twice?', a: 'It is not idempotent, so it creates two things (two orders, two payments).' },
          { q: 'Is GET /deleteEvent/12 RESTful? What should it be?', a: 'No: the verb is hiding in the path and GET should never change anything. It should be DELETE /events/12.' },
        ]}
        watch={<>Thinking 401 means “not allowed”. The name “Unauthorized” is misleading: it really means <strong>not logged in / unknown</strong>.</>}
        activity={<>Lab mission 2 in Postman: GET a list, GET one item, GET id 9999 (404), POST a new item (201), then DELETE. He reads the status code before the body every time.</>}
        pause="Given any action (read, create, edit, remove), he names the method and the expected status code."
      />

      <Part
        id="lp-d"
        letter="D"
        tint="green"
        title="Data & rules of the road"
        slides={<><S from={19} to={26} /></>}
        goal="write valid JSON, explain statelessness and HTTPS in plain words, and walk the full journey of a request."
        say={[
          <>JSON is the shared language: objects, arrays and six value types. Show the event example, then the broken one. He finds all four mistakes.</>,
          <>Stateless: the server forgets you between requests. Show the two-request example and ask how it could remember a login.</>,
          <>The answer: you carry proof every time, a cookie or a token, like showing your ID card at every gate. We build this properly in Phase 6.</>,
          <>HTTP is a postcard, HTTPS is a sealed envelope: private, proven (certificate), untouched.</>,
          <>Finish with the full journey slide, then open the <Link to="/phase-0/journey">interactive journey</Link> and let him drive. Try the 404 and 500 endings too.</>,
        ]}
        asks={[
          { q: 'Is { name: \'Asha\' } valid JSON?', a: 'No: the key needs double quotes and the string needs double quotes: { "name": "Asha" }.' },
          { q: 'If HTTP forgets everything, how does Instagram know it’s you?', a: 'The app sends a token (or cookie) with every request.' },
          { q: 'Why is logging in on café Wi-Fi over plain HTTP risky?', a: 'Anyone on that network can read the password, because HTTP isn’t encrypted.' },
          { q: 'Walk me through what happens after you press Enter.', a: 'DNS → connect (TCP + TLS) → HTTP request → server runs code → database → response with status → browser shows it.' },
        ]}
        watch={<>Treating JSON and JavaScript objects as the same thing. JSON is <strong>text</strong>; it only becomes an object after <code>JSON.parse</code>.</>}
        activity={<>Lab mission 5: he draws the full journey from memory, labels every hop, then checks it against the journey page.</>}
        pause="He explains the full journey out loud without looking at notes."
      />

      <section className="stack" id="lp-wrap">
        <SectionHead eyebrow="Close" tint="cream" title="Wrap-up & homework" level={2} />
        <div className="grid g2">
          <div className="card">
            <h3 className="h-sm">In the session</h3>
            <ul>
              <li>Run the <Link to="/phase-0/slides?s=25">checkpoint slide</Link>. He answers out loud, in his own words.</li>
              <li>One round of <Link to="/phase-0/flashcards">flashcards</Link> together (press <kbd>R</kbd> on any page).</li>
              <li>Preview Phase 1: “Next time, you write the JavaScript that runs on the server.”</li>
            </ul>
          </div>
          <div className="card tint-yellow">
            <h3 className="h-sm">Homework</h3>
            <ul>
              <li>Finish any lab missions not done in class.</li>
              <li>Take the <Link to="/phase-0/quiz">quiz</Link>: aim for 10 out of 12 or more.</li>
              <li>Explain “what happens when I type a URL” to a friend or family member.</li>
              <li>One flashcard round a day until the next session.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="stack" id="lp-day2">
        <SectionHead eyebrow="If it spills over" tint="pink" title="Continuing on another day" level={2} />
        <div className="prose">
          <p>Start the next session with a five-question warm-up from the part you finished last. Don’t re-teach. Only revisit what he gets wrong.</p>
        </div>
        <div className="grid g2">
          <div className="card sm"><strong>After Part A:</strong> draw the restaurant; name client, API, server and database in the Zomato app.</div>
          <div className="card sm"><strong>After Part B:</strong> what does DNS do? Label the parts of a URL on the board.</div>
          <div className="card sm"><strong>After Part C:</strong> method and status code for “create an event”, “event not found” and “not logged in”.</div>
          <div className="card sm"><strong>Any time:</strong> one pass through the flashcards on “Everything”. Cards he misses show you where to start.</div>
        </div>
      </section>

      <section className="stack" id="lp-mixups">
        <SectionHead eyebrow="Watch list" tint="green" title="Common mix-ups to watch for" level={2} />
        <div className="table-wrap">
          <table>
            <thead><tr><th>He says…</th><th>Gently correct to…</th></tr></thead>
            <tbody>
              <tr><td>“The server is the computer.”</td><td>The server is the <strong>program</strong> that listens; it runs on a computer.</td></tr>
              <tr><td>“401 means not allowed.”</td><td>401 = we don’t know who you are. 403 = we know, and it’s still no.</td></tr>
              <tr><td>“The query string is part of the path.”</td><td>Path = which thing. Query (after <code>?</code>) = options like filter, sort, page.</td></tr>
              <tr><td>“DNS stores websites.”</td><td>DNS only maps names to IP addresses, like a phonebook.</td></tr>
              <tr><td>“HTTPS is a different protocol from HTTP.”</td><td>Same HTTP messages, sent inside an encrypted TLS tunnel.</td></tr>
              <tr><td>“JSON is a JavaScript object.”</td><td>JSON is <strong>text</strong>. It becomes an object after <code>JSON.parse</code>.</td></tr>
              <tr><td>“PUT and PATCH are the same.”</td><td>PUT replaces the whole thing; PATCH changes only the fields sent.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
