/* The journey of one request: https://api.campus-events.dev/events/12
   lanes: client · dns · server · db
   Steps 10–12 change with the chosen ending (ok / notfound / crash). */
export const lanes = [
  { id: 'client', label: 'Client', sub: 'Browser / app', tint: 'yellow' },
  { id: 'dns', label: 'DNS', sub: 'Phonebook', tint: 'blue' },
  { id: 'server', label: 'Server', sub: 'Express API', tint: 'pink' },
  { id: 'db', label: 'Database', sub: 'Stored data', tint: 'green' },
];

export const endings = [
  { id: 'ok', label: '200 · Found it' },
  { id: 'notfound', label: '404 · No such event' },
  { id: 'crash', label: '500 · Database down' },
];

const common = [
  {
    title: 'You type the address',
    from: 'client', to: 'client',
    plain: 'You type the URL and press Enter. The browser splits it into parts: which rules (https), which server (the domain), which door (port 443, hidden) and which thing (the path).',
    code: 'https://api.campus-events.dev/events/12\n\nscheme  https  → use HTTPS, port 443\nhost    api.campus-events.dev\npath    /events/12',
    lang: 'text',
  },
  {
    title: 'Check the memory first',
    from: 'client', to: 'client',
    plain: 'Before asking anyone, the browser and your operating system check whether they already know this domain’s IP address from a recent visit. This time they don’t, so they must ask DNS.',
    code: 'browser DNS cache ...... miss\nOS cache / hosts file .. miss\n→ ask the DNS resolver',
    lang: 'text',
  },
  {
    title: 'Ask DNS: where is it?',
    from: 'client', to: 'dns',
    plain: 'Your computer asks a DNS resolver (from your internet provider, or a public one like 1.1.1.1). The resolver asks the root servers, then the servers for “.dev”, then the domain’s own name server.',
    code: 'resolver → root server     "who handles .dev?"\nresolver → .dev server     "who handles campus-events.dev?"\nresolver → name server     "what is api.campus-events.dev?"',
    lang: 'text',
  },
  {
    title: 'DNS answers with an IP',
    from: 'dns', to: 'client',
    plain: 'The answer comes back as a number, plus how long it may be remembered (the TTL). Next time, step 2 finds it in the cache and skips DNS.',
    code: 'api.campus-events.dev  →  203.0.113.10\nTTL: 300 seconds (keep this answer for 5 minutes)',
    lang: 'text',
  },
  {
    title: 'Open a connection (TCP)',
    from: 'client', to: 'server',
    plain: 'The browser knocks on 203.0.113.10, port 443, to open a reliable line. It is a three-message handshake: “Can we talk?” “Yes, can you hear me?” “Yes.”',
    code: 'client → server   SYN      (can we talk?)\nserver → client   SYN-ACK  (yes, can you hear me?)\nclient → server   ACK      (yes, let’s go)',
    lang: 'text',
  },
  {
    title: 'Lock the line (TLS)',
    from: 'server', to: 'client',
    plain: 'Because it is HTTPS, the server shows its certificate (its digital ID card). The browser checks it is genuine and for this domain, then both sides agree on secret keys. From now on everything is encrypted.',
    code: 'server → client   certificate for api.campus-events.dev\nclient            checks: trusted issuer? right domain? not expired?\nboth              agree on encryption keys  →  line is locked',
    lang: 'text',
  },
  {
    title: 'Send the HTTP request',
    from: 'client', to: 'server',
    plain: 'Now the actual question travels, inside the locked line. It is plain text: a method, a path, and headers with extra details.',
    code: 'GET /events/12 HTTP/1.1\nHost: api.campus-events.dev\nAccept: application/json\nUser-Agent: Mozilla/5.0 (…)',
    lang: 'http',
  },
  {
    title: 'Express handles it',
    from: 'server', to: 'server',
    plain: 'On the server, Express reads the request, runs middleware (such as logging), and finds the route that matches GET /events/:id. The route’s code runs with id = 12.',
    code: "app.get('/events/:id', async (req, res) => {\n  const id = req.params.id;      // '12'\n  const event = await db.findEvent(id);\n  // …decide what to send back\n});",
    lang: 'js',
  },
  {
    title: 'Ask the database',
    from: 'server', to: 'db',
    plain: 'The server asks the database for event 12. Only the server can do this; the browser never sees the database.',
    code: 'SELECT * FROM events WHERE id = 12;',
    lang: 'text',
  },
];

const byEnding = {
  ok: [
    {
      title: 'Database returns the row',
      from: 'db', to: 'server',
      plain: 'The database finds one matching row and hands it back to the server.',
      code: 'id | title       | venue       | starts_at\n12 | Hack Night  | Lab Block B | 2026-10-03 18:00',
      lang: 'text',
    },
    {
      title: 'Server sends 200 + JSON',
      from: 'server', to: 'client',
      plain: 'The server turns the row into JSON and replies with status 200 OK.',
      code: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{ "id": 12, "title": "Hack Night", "venue": "Lab Block B",\n  "startsAt": "2026-10-03T18:00:00Z" }',
      lang: 'http',
    },
    {
      title: 'Client shows the event',
      from: 'client', to: 'client',
      plain: 'The app reads the JSON and shows the event card. The whole trip usually takes a fraction of a second.',
      code: 'Hack Night\nLab Block B · Sat 3 Oct, 6 pm',
      lang: 'text',
    },
  ],
  notfound: [
    {
      title: 'Database finds nothing',
      from: 'db', to: 'server',
      plain: 'No event has id 12 (maybe it was deleted). The database answers with zero rows. That is not a crash; it is a normal empty answer.',
      code: '(0 rows)',
      lang: 'text',
    },
    {
      title: 'Server sends 404',
      from: 'server', to: 'client',
      plain: 'The server replies 404 Not Found with a short JSON error, so the client knows exactly what went wrong.',
      code: 'HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{ "error": { "code": "EVENT_NOT_FOUND", "message": "No event with id 12" } }',
      lang: 'http',
    },
    {
      title: 'Client explains it',
      from: 'client', to: 'client',
      plain: 'The app sees 404 and shows a friendly “This event doesn’t exist any more” message instead of a blank screen.',
      code: 'This event doesn’t exist any more.\n← Back to all events',
      lang: 'text',
    },
  ],
  crash: [
    {
      title: 'Database doesn’t answer',
      from: 'db', to: 'server',
      plain: 'The database server is down, so the connection is refused. The server’s code gets an error instead of data.',
      code: 'Error: connect ECONNREFUSED 10.0.0.5:5432',
      lang: 'text',
    },
    {
      title: 'Server sends 500',
      from: 'server', to: 'client',
      plain: 'This is the server’s problem, not the client’s, so the reply is 500. A good API logs the full error privately and sends only a safe message.',
      code: 'HTTP/1.1 500 Internal Server Error\nContent-Type: application/json\n\n{ "error": { "code": "INTERNAL", "message": "Something went wrong. Try again soon." } }',
      lang: 'http',
    },
    {
      title: 'Client asks you to retry',
      from: 'client', to: 'client',
      plain: 'The app shows “Something went wrong” with a Retry button. Retrying makes sense here because the problem may be temporary.',
      code: 'Something went wrong on our side.\n[ Retry ]',
      lang: 'text',
    },
  ],
};

export function journeySteps(ending = 'ok') {
  return [...common, ...byEnding[ending]];
}
