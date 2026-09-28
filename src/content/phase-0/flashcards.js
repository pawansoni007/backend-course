/* Revision deck for Phase 0. `q` = front, `a` = back, `more` = optional extra line. */
export const topics = [
  { id: 'big', label: 'Big picture' },
  { id: 'find', label: 'Finding the server' },
  { id: 'http', label: 'HTTP messages' },
  { id: 'status', label: 'Status codes' },
  { id: 'json', label: 'JSON' },
  { id: 'rules', label: 'Stateless & HTTPS' },
];

const raw = [
  // big picture
  ['big', 'What is a client?', 'The program that **asks**: a browser, a mobile app, Postman, curl, or another server.'],
  ['big', 'What is a server?', 'A program that **waits for requests and answers them**. The word also means the computer it runs on.'],
  ['big', 'Who always starts an HTTP conversation?', 'The **client**. A server never sends a response nobody asked for.'],
  ['big', 'What is an API, in one line?', 'A fixed set of **doors (endpoints)** a program opens so other programs can ask it for data or actions.'],
  ['big', 'In the restaurant analogy, what are the customer, waiter, kitchen and pantry?', 'Customer = **client**, waiter = **API**, kitchen = **server**, pantry = **database**.', 'The menu is the API documentation: you can only order what is on it.'],
  ['big', 'Why can’t the browser talk to the database directly?', 'The database password would be exposed to everyone, anyone could run any query (even delete everything), and there would be no place for validation or business rules.'],
  ['big', 'What does the backend do that the frontend can’t be trusted to do?', 'Check permissions, validate input, apply business rules, keep secrets and talk to the database.'],

  // finding the server
  ['find', 'What is an IP address?', 'A computer’s **number on a network**, like a phone number. Example: `142.250.183.14`.'],
  ['find', 'What does DNS do?', 'Turns a **domain name into an IP address**, like a phonebook turns a contact name into a number.'],
  ['find', 'Name the DNS lookup order.', 'Browser cache → OS cache → **resolver** → root server → TLD server (`.com`) → **authoritative** server → IP address.'],
  ['find', 'What is `localhost`?', 'A name that always means **this same computer**. IP `127.0.0.1`.'],
  ['find', 'What is a port?', 'A **numbered door** on a computer that leads to one program. One port, one program.'],
  ['find', 'Default ports for HTTP and HTTPS?', 'HTTP = **80**, HTTPS = **443**. The browser hides them from the URL.'],
  ['find', 'Which port will our Express server use while developing?', 'Usually **3000**, e.g. `http://localhost:3000`.'],
  ['find', 'In `https://api.site.com:443/events/12?sort=date#top`, which part is the path?', '`/events/12`'],
  ['find', 'In that URL, which part is the query string?', '`?sort=date`: extra options as `key=value` pairs joined by `&`.'],
  ['find', 'Which part of a URL is never sent to the server?', 'The **fragment** (after `#`). Only the browser uses it.'],

  // http messages
  ['http', 'What are the four parts of an HTTP request?', '**Method**, **path** (+ version), **headers**, and an optional **body**.'],
  ['http', 'What are the three parts of an HTTP response?', '**Status line** (code + text), **headers**, and usually a **body**.'],
  ['http', 'What is a header?', 'A labelled piece of extra info on a message, like `Content-Type: application/json`.'],
  ['http', 'GET is used to…', '**Read** data. It has no body and should never change anything.'],
  ['http', 'POST is used to…', '**Create** something new, e.g. a new event. Sending it twice creates two.'],
  ['http', 'PUT vs PATCH?', '**PUT** replaces the whole thing. **PATCH** changes only the fields you send.'],
  ['http', 'DELETE is used to…', '**Remove** a resource, e.g. `DELETE /events/12`.'],
  ['http', 'What does “idempotent” mean?', 'Doing the request **once or ten times gives the same end result**. GET, PUT, DELETE are; POST is not.'],
  ['http', 'Which header says what format the body is in?', '`Content-Type`, e.g. `application/json`.'],
  ['http', 'Which header usually carries a login token?', '`Authorization`, e.g. `Authorization: Bearer <token>`.'],
  ['http', 'What is REST, in one line?', 'A style for designing APIs: **resources as nouns** in the path, **methods as verbs**, **status codes as results**, and **no memory** between requests.', 'We design a full REST API in Phase 3.'],
  ['http', 'Make `GET /deleteEvent/12` RESTful.', '`DELETE /events/12`. The action belongs in the **method**, not in the path, and GET must never change data.'],

  // status codes
  ['status', 'What do the five status families mean?', '**1xx** info · **2xx** success · **3xx** go elsewhere · **4xx** client made a mistake · **5xx** server broke.'],
  ['status', '200', '**OK**: it worked, here is the data.'],
  ['status', '201', '**Created**: a new thing was made (typical reply to POST).'],
  ['status', '204', '**No Content**: it worked, nothing to send back (typical for DELETE).'],
  ['status', '400', '**Bad Request**: the request itself is wrong, e.g. a missing field or broken JSON.'],
  ['status', '401', '**Unauthorized**: we don’t know who you are. Log in first.'],
  ['status', '403', '**Forbidden**: we know who you are, but you’re not allowed to do this.'],
  ['status', '404', '**Not Found**: nothing lives at that path or ID.'],
  ['status', '409', '**Conflict**: clashes with current data, e.g. that email is already registered.'],
  ['status', '500', '**Internal Server Error**: the server’s code crashed. Not the client’s fault.'],
  ['status', '401 vs 403, using a college campus?', '**401**: the guard doesn’t know you (no ID card). **403**: your ID is valid, but it doesn’t open the staff room.'],

  // json
  ['json', 'What is JSON?', 'A **text format for data**, built from objects `{}` and arrays `[]`. The web’s common language for APIs.'],
  ['json', 'Which value types can JSON hold?', '**string, number, boolean, null, object, array.** No functions, no `undefined`, no dates (send dates as strings).'],
  ['json', 'Three rules that break JSON most often?', 'Keys must use **double quotes**, **no trailing commas**, **no comments**.'],
  ['json', 'Which JS functions convert to and from JSON?', '`JSON.stringify(obj)` → text, `JSON.parse(text)` → object.'],
  ['json', 'How should a date travel in JSON?', 'As an **ISO 8601 string**, e.g. `"2026-10-03T18:00:00Z"`.'],

  // stateless + https
  ['rules', 'What does “stateless” mean?', 'Each request **stands alone**. The server doesn’t remember the last one unless the client sends proof again.'],
  ['rules', 'If HTTP is stateless, how do logins work?', 'The client sends **proof on every request**: a cookie (sent automatically) or a token in the `Authorization` header.'],
  ['rules', 'HTTP vs HTTPS, in one line?', 'HTTP is a **postcard** anyone on the way can read. HTTPS is a **sealed envelope**.'],
  ['rules', 'Three things TLS gives you?', '**Privacy** (encrypted), **identity** (certificate proves the server), **integrity** (can’t be changed on the way).'],
  ['rules', 'Put the full journey in order.', 'Type URL → **DNS** finds IP → **connect** (TCP + TLS) → send **request** → server runs code → asks **database** → sends **response** → browser shows it.'],
];

export const flashcards = raw.map(([topic, q, a, more], i) => ({ id: 'p0-' + i, topic, q, a, more }));
