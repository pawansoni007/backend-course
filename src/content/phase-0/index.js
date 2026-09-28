/* ===========================================================
   PHASE 0 — How the web works
   To add a phase: copy this folder's shape and register it in
   src/content/course.js. Hub, nav, search and revision pick it up.
   =========================================================== */
import { slides, parts } from './slides.jsx';
import { flashcards, topics } from './flashcards.js';
import { glossary } from './glossary.js';
import { mcq, short } from './quiz.js';
import { lanes, endings, journeySteps } from './journey.js';
import LessonPlan, { lessonSections } from './LessonPlan.jsx';
import Cheatsheet, { cheatSections } from './Cheatsheet.jsx';
import Lab, { labSections } from './Lab.jsx';

export default {
  id: 'phase-0',
  num: 0,
  status: 'ready',
  title: 'How the web works',
  week: 'Week 1',
  summary:
    'Client–server architecture, HTTP, DNS, ports, URLs, status codes, JSON, statelessness and HTTPS: the mental model every API sits on.',
  goal: 'Explain, step by step, what happens between typing a URL and seeing a page, and what an API is. No coding yet.',
  slides,
  parts,
  flashcards,
  topics,
  glossary,
  quiz: { mcq, short },
  journey: { lanes, endings, steps: journeySteps },
  checkpoint: [
    'What is the difference between 401 and 403?',
    'Why can’t the browser talk to the database directly?',
    'What does “stateless” mean, and what problem does it create for logins?',
    'Which part of a URL is the path, and which is the query string?',
  ],
  pages: [
    { slug: 'slides', title: 'Slides', icon: 'S', tint: 'blue', blurb: '26 slides in four parts, with diagrams. Present them, or read them on your phone.', kind: 'slides' },
    { slug: 'lesson-plan', title: 'Lesson plan', icon: 'L', tint: 'yellow', blurb: 'The teacher’s script: what to say, analogies, questions to ask, and where to pause.', kind: 'content', component: LessonPlan, sections: lessonSections, teacher: true },
    { slug: 'cheatsheet', title: 'Cheat sheet', icon: 'C', tint: 'pink', blurb: 'Everything on one page: URL parts, methods, status codes, headers, JSON rules and a glossary.', kind: 'content', component: Cheatsheet, sections: cheatSections },
    { slug: 'journey', title: 'Request journey', icon: 'J', tint: 'green', blurb: 'Click through one request from browser to database and back, step by step.', kind: 'journey' },
    { slug: 'lab', title: 'Lab worksheet', icon: 'W', tint: 'cream', blurb: 'Hands-on missions with DevTools, Postman, curl and DNS, with blanks to fill in.', kind: 'content', component: Lab, sections: labSections },
    { slug: 'quiz', title: 'Quiz', icon: 'Q', tint: 'blue', blurb: '12 multiple-choice and 4 short-answer questions, marked instantly.', kind: 'quiz' },
    { slug: 'answer-key', title: 'Answer key', icon: 'A', tint: 'white', blurb: 'Teacher’s copy: every answer with the reason.', kind: 'answers', teacher: true },
    { slug: 'flashcards', title: 'Flashcards', icon: 'F', tint: 'pink', blurb: `Flip-card revision of the whole phase, Anki style.`, kind: 'flashcards' },
  ],
};
