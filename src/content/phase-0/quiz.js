/* Phase 0 checkpoint quiz. `answer` is the index of the correct option. */
export const mcq = [
  {
    q: 'Which of these can be an HTTP client?',
    options: ['Only a web browser', 'Only the database', 'Only a computer with a monitor', 'A browser, a mobile app, Postman, or another server'],
    answer: 3,
    why: 'Anything that sends a request is a client. Servers often act as clients too when they call other APIs.',
  },
  {
    q: 'What does DNS do?',
    options: ['Encrypts traffic between browser and server', 'Stores your website’s files', 'Turns a domain name into an IP address', 'Decides which port a server uses'],
    answer: 2,
    why: 'DNS is the phonebook: `api.github.com` goes in, an IP address comes out.',
  },
  {
    q: 'In `https://shop.com/products/7?color=red`, what is the path?',
    options: ['`https`', '`shop.com`', '`/products/7`', '`?color=red`'],
    answer: 2,
    why: 'The path comes after the domain and before `?`. `?color=red` is the query string.',
  },
  {
    q: 'You visit `https://site.com`. Which port does the browser connect to?',
    options: ['443', '80', '3000', '8080'],
    answer: 0,
    why: 'HTTPS defaults to 443 and HTTP to 80, so the browser leaves the port out of the address bar.',
  },
  {
    q: 'Which HTTP method should you use to create a new event?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    answer: 1,
    why: 'POST creates. GET reads, PUT/PATCH update, DELETE removes.',
  },
  {
    q: 'A user is logged in but tries to delete someone else’s event. Best status code?',
    options: ['401 Unauthorized', '404 Not Found', '500 Internal Server Error', '403 Forbidden'],
    answer: 3,
    why: 'We know who they are (so not 401), but they are not allowed to do this. That is 403.',
  },
  {
    q: 'The client sent JSON with a missing required field. Best status code?',
    options: ['400 Bad Request', '201 Created', '409 Conflict', '503 Service Unavailable'],
    answer: 0,
    why: 'The request itself is wrong, which is the client’s mistake, so a 4xx. 400 fits a malformed or incomplete request.',
  },
  {
    q: 'Your Express code throws an unexpected error while handling a request. What should the client see?',
    options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved Permanently'],
    answer: 2,
    why: '5xx means the server broke, not the client. 500 is the generic "our code crashed" code.',
  },
  {
    q: 'Which of these is valid JSON?',
    options: ["`{ name: 'Asha' }`", '`{ "name": "Asha", }`', '`{ "name": "Asha", "age": 20 }`', '`{ "name": "Asha" // student }`'],
    answer: 2,
    why: 'JSON needs double-quoted keys and strings, no trailing comma and no comments.',
  },
  {
    q: 'What does "HTTP is stateless" mean?',
    options: ['The server can never store data', 'HTTP only works without a database', 'Requests have no headers', 'Each request stands alone; the server doesn’t remember earlier ones by itself'],
    answer: 3,
    why: 'Servers can store data in a database. Stateless means each request must carry everything needed, such as a token, again.',
  },
  {
    q: 'What does HTTPS add on top of HTTP?',
    options: ['Faster downloads', 'Encryption, proof of the server’s identity, and protection from tampering', 'A different set of methods', 'Automatic login'],
    answer: 1,
    why: 'TLS gives privacy, identity (via a certificate) and integrity. The HTTP messages inside are the same.',
  },
  {
    q: 'Which header tells the server that the body is JSON?',
    options: ['`Content-Type: application/json`', '`Accept: text/html`', '`Host: api.site.com`', '`Cache-Control: no-cache`'],
    answer: 0,
    why: '`Content-Type` describes the body being sent. `Accept` says what format you would like back.',
  },
];

export const short = [
  {
    q: 'What is the difference between 401 and 403? Give one example of each.',
    model: '401 means the server does not know who you are, so you must log in, e.g. calling a protected API with no token. 403 means it knows who you are but you are not allowed, e.g. a student trying to use an admin-only delete.',
  },
  {
    q: 'Why can’t the browser talk to the database directly?',
    model: 'The database credentials would be shipped to every user, anyone could run any query (read everyone’s data, delete tables), and there would be nowhere to validate input or apply rules. The backend is the guard in the middle.',
  },
  {
    q: 'HTTP is stateless. What problem does that create for logins, and how is it solved?',
    model: 'The server does not remember that you logged in on an earlier request. So after login the server gives the client proof (a cookie or a token), and the client sends it with every later request.',
  },
  {
    q: 'In `https://api.campus.dev:443/events/12?sort=date`, label the scheme, domain, port, path and query string.',
    model: 'Scheme: https · Domain: api.campus.dev · Port: 443 · Path: /events/12 · Query string: ?sort=date',
  },
];
