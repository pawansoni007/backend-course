/* ===========================================================
   PHASE 1 — JavaScript & Node.js essentials
   Registered in src/content/course.js.
   =========================================================== */
import { slides, parts } from './slides.jsx';
import { explainers } from './explainers.js';
import { flashcards, topics } from './flashcards.js';
import { glossary } from './glossary.js';
import { mcq, short } from './quiz.js';
import LessonPlan, { lessonSections } from './LessonPlan.jsx';
import Demos, { demoSections } from './Demos.jsx';
import Cheatsheet, { cheatSections } from './Cheatsheet.jsx';
import Lab, { labSections } from './Lab.jsx';

export default {
  id: 'phase-1',
  num: 1,
  status: 'ready',
  title: 'JavaScript & Node.js essentials',
  week: 'Week 2',
  summary:
    'Modern JavaScript, the event loop, promises and async/await, Node and npm, environment variables, Git and GitHub, and a JSON API built with nothing but node:http.',
  goal: 'Write modern JavaScript, explain the event loop with the waiter analogy, set up a Node project with npm and .env, push it to GitHub, and build a small JSON API without a framework.',
  slides,
  parts,
  explainers,
  flashcards,
  topics,
  glossary,
  quiz: { mcq, short },
  flow: [
    ['slides', 'Teach with the slides', 'Animations play inside them, one step per →. Lesson plan open on your side.'],
    ['demos', 'Run the live demos', 'He predicts every output before you press Enter.'],
    ['lab', 'He does the lab', 'Six missions, ending with his own server.'],
    ['explainers', 'Rewatch an animation', 'This time he narrates while you press →.'],
    ['quiz', 'Take the quiz', 'Aim for 10 out of 12 or more.'],
    ['flashcards', 'Revise with flashcards', 'A daily round until the next session.'],
  ],
  checkpoint: [
    'Why does setTimeout(fn, 0) run after the code below it?',
    'What does await pause, and what keeps running?',
    'Why is package-lock.json committed but node_modules/ and .env never are?',
    'What does your raw server do, step by step, when GET /events/99 arrives?',
  ],
  pages: [
    { slug: 'slides', title: 'Slides', icon: 'S', tint: 'blue', blurb: `${slides.length} slides in five parts, ${explainers.length} of them animated step by step. Present them, or read them on your phone.`, kind: 'slides' },
    { slug: 'explainers', title: 'Animations', icon: 'V', tint: 'pink', blurb: `${explainers.length} animated explainers (call stack, event loop, async/await, Git and more) to play full screen.`, kind: 'explainers' },
    { slug: 'lesson-plan', title: 'Lesson plan', icon: 'L', tint: 'yellow', blurb: 'The teacher’s script: watch, run, break, ask. What to say, questions to ask, and where to pause.', kind: 'content', component: LessonPlan, sections: lessonSections, teacher: true },
    { slug: 'demos', title: 'Live demos', icon: 'D', tint: 'cream', blurb: '15 live-coding demos: every file, command and expected output, plus how to break each one on purpose.', kind: 'content', component: Demos, sections: demoSections, teacher: true },
    { slug: 'cheatsheet', title: 'Cheat sheet', icon: 'C', tint: 'pink', blurb: 'JS syntax, array methods, async rules, npm, .env, Git and a raw server skeleton, on one page.', kind: 'content', component: Cheatsheet, sections: cheatSections },
    { slug: 'lab', title: 'Lab worksheet', icon: 'W', tint: 'green', blurb: 'Six hands-on missions: predict-then-run, async puzzles, npm, .env, GitHub and your own server.', kind: 'content', component: Lab, sections: labSections },
    { slug: 'quiz', title: 'Quiz', icon: 'Q', tint: 'blue', blurb: `${mcq.length} multiple-choice and ${short.length} short-answer questions, marked instantly.`, kind: 'quiz' },
    { slug: 'answer-key', title: 'Answer key', icon: 'A', tint: 'white', blurb: 'Teacher’s copy: every answer with the reason.', kind: 'answers', teacher: true },
    { slug: 'flashcards', title: 'Flashcards', icon: 'F', tint: 'pink', blurb: `${flashcards.length} flip cards on the whole phase, Anki style.`, kind: 'flashcards' },
  ],
};
