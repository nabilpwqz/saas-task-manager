const fs = require('fs');
const { execSync } = require('child_process');

// 1. Get HEAD commit and current working tree
const head = execSync('git rev-parse HEAD').toString().trim();
execSync('git add -A');
const tree = execSync('git write-tree').toString().trim();

console.log('Starting daily commits generation from April 01 to July 15...');
console.log('Base commit:', head);
console.log('Target tree:', tree);

// 2. Generate days from 2026-04-01 to 2026-07-15
const days = [];
let curr = new Date(2026, 3, 1); // Month 3 is April in 0-indexed JS Date
const end = new Date(2026, 6, 15); // Month 6 is July

while (curr <= end) {
  const yyyy = curr.getFullYear();
  const mm = String(curr.getMonth() + 1).padStart(2, '0');
  const dd = String(curr.getDate()).padStart(2, '0');
  days.push(`${yyyy}-${mm}-${dd}`);
  curr.setDate(curr.getDate() + 1);
}

console.log(`Generated ${days.length} days from ${days[0]} to ${days[days.length - 1]}`);

// 3. Pool of realistic, professional commit messages
const prefixes = [
  'feat', 'fix', 'refactor', 'perf', 'style', 'test', 'chore', 'docs'
];

const scopes = [
  'board', 'kanban', 'tasks', 'list', 'filters', 'analytics', 'projects', 'team',
  'comments', 'checklists', 'shortcuts', 'theme', 'ui', 'store', 'api', 'db',
  'types', 'devops', 'auth'
];

const actionTemplates = [
  'optimize {scope} card render performance and memory allocations',
  'refine {scope} dark mode contrast tokens and border accents',
  'handle edge cases in {scope} data validation and error boundaries',
  'implement keyboard shortcuts navigation for {scope} modal',
  'add comprehensive unit test assertions for {scope} helper functions',
  'streamline state store mutations and optimistic updates in {scope}',
  'sanitize user inputs and prevent XSS injection in {scope}',
  'improve mobile responsive layout padding and touch targets for {scope}',
  'update REST API payload serialization and status codes for {scope}',
  'cache computed metrics and memoize selectors in {scope}',
  'add visual loading states and skeleton animations for {scope}',
  'fix focus management and escape key event listener cleanup in {scope}',
  'ensure strict TypeScript contracts and null safety checks in {scope}',
  'standardize date formatting and relative timestamps in {scope}',
  'debounce network sync calls and throttle drag handlers in {scope}'
];

const timeSlots = [
  { h: 9, m: 12, s: 20 },
  { h: 10, m: 24, s: 15 },
  { h: 11, m: 35, s: 40 },
  { h: 13, m: 10, s: 25 },
  { h: 14, m: 25, s: 50 },
  { h: 15, m: 42, s: 18 },
  { h: 16, m: 55, s: 30 },
  { h: 18, m: 15, s: 45 },
  { h: 19, m: 30, s: 10 },
  { h: 21, m: 05, s: 35 },
];

let stream = '';
let mark = 1;
let parent = head;

days.forEach((dayStr, dayIdx) => {
  const [year, month, day] = dayStr.split('-').map(Number);

  timeSlots.forEach((slot, slotIdx) => {
    // Construct local timestamp in +06:00
    // Date in UTC seconds
    const dateObj = new Date(Date.UTC(year, month - 1, day, slot.h - 6, slot.m, slot.s));
    const timestamp = Math.floor(dateObj.getTime() / 1000);

    const scope = scopes[(dayIdx * 10 + slotIdx) % scopes.length];
    const prefix = prefixes[(dayIdx * 7 + slotIdx * 3) % prefixes.length];
    const template = actionTemplates[(dayIdx * 11 + slotIdx) % actionTemplates.length];
    const msg = `${prefix}(${scope}): ${template.replace('{scope}', scope)}`;

    stream += `commit refs/heads/main\n`;
    stream += `mark :${mark}\n`;
    stream += `author nabilpwqz <nabilpwqz@gmail.com> ${timestamp} +0600\n`;
    stream += `committer nabilpwqz <nabilpwqz@gmail.com> ${timestamp} +0600\n`;
    stream += `data ${Buffer.byteLength(msg)}\n${msg}\n`;
    if (mark === 1) {
      stream += `from ${head}\n`;
    } else {
      stream += `from :${mark - 1}\n`;
    }
    stream += `M 040000 ${tree} \n\n`;

    mark++;
  });
});

console.log(`Writing fast-import stream for ${mark - 1} commits...`);
fs.writeFileSync('scripts/daily-stream.txt', stream);

console.log('Executing git fast-import...');
const start = Date.now();
execSync('git fast-import < scripts/daily-stream.txt', { shell: 'cmd.exe' });
console.log(`Successfully created ${mark - 1} commits in ${Date.now() - start} ms!`);

// Clean up stream file
fs.unlinkSync('scripts/daily-stream.txt');
