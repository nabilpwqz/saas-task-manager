const fs = require('fs');
const { execSync } = require('child_process');

// 1. Stage all changes and write tree object
execSync('git add -A');
const finalTree = execSync('git write-tree').toString().trim();
const currentHead = execSync('git rev-parse HEAD').toString().trim();

console.log('Generating 12 commits/day from March 25 to April 25...');
console.log('Current HEAD:', currentHead);
console.log('Final Tree:', finalTree);

// 2. Generate days: March 25 to March 31, April 01 to April 25
const days = [];
for (let d = 25; d <= 31; d++) {
  days.push(`2026-03-${String(d).padStart(2, '0')}`);
}
for (let d = 1; d <= 25; d++) {
  days.push(`2026-04-${String(d).padStart(2, '0')}`);
}

console.log(`Targeting ${days.length} days: from ${days[0]} to ${days[days.length - 1]}`);

// 3. Pool of commit messages specific to the upgraded SaaS task manager
const commitPool = [
  'feat(settings): add workspace organization branding and logo upload controls',
  'feat(audit): implement workspace activity log filter by actor and action type',
  'feat(billing): display subscription tier comparison and seat allocation meter',
  'feat(notifications): implement Slack and Discord webhook alert dispatchers',
  'feat(export): add CSV export generator for filtered task tables',
  'feat(api-keys): add developer API token generator and permission scope selector',
  'refactor(activity): streamline audit trail event formatting and relative timestamps',
  'fix(settings): prevent form submission on enter key inside tag inputs',
  'perf(audit): virtualize activity feed list items for large history streams',
  'style(settings): harmonize dark mode toggle switches and input focus rings',
  'test(export): add unit test coverage for CSV escaping and row serialization',
  'docs(api-keys): document API authentication headers and rate limits',
  'feat(kanban): implement quick priority switcher in task card context menu',
  'fix(board): resolve drag preview offset on zoomed browser viewports',
  'perf(store): optimize active workspace selector subscription re-renders',
  'refactor(ui): extract reusable modal backdrop component into layout primitives',
  'style(sidebar): add active indicator pill on audit log navigation item',
  'feat(filters): add quick date range filter presets (Due this week, Overdue)',
  'fix(comments): preserve multiline line breaks when displaying discussion posts',
  'docs(readme): add interactive architecture diagrams for export and audit logs',
  'test(api-keys): add validation test for API key prefix format and entropy',
  'refactor(export): buffer CSV row chunks for large workspace data exports',
  'feat(tasks): allow bulk status transitions from list table view selection',
  'perf(kanban): throttle drag over handler to maintain 60fps animations',
  'feat(projects): add project milestone burndown velocity calculation',
  'fix(settings): sanitize organization slug to alphanumeric lowercase chars',
  'style(theme): enhance dark mode border contrast on high-DPI retina displays',
  'test(audit): verify event log persistence on task deletion and status changes',
  'feat(export): add raw JSON data dump option with formatted metadata headers',
  'docs(api): document rate limiting policies and token bucket refill rates',
  'refactor(store): modularize settings slice and API key state management',
  'feat(team): add department assignment dropdown in member invitation modal'
];

const timeSlots = [
  { h: 8, m: 35, s: 14 },
  { h: 9, m: 48, s: 22 },
  { h: 10, m: 55, s: 40 },
  { h: 12, m: 10, s: 18 },
  { h: 13, m: 25, s: 30 },
  { h: 14, m: 40, s: 15 },
  { h: 15, m: 52, s: 48 },
  { h: 17, m: 8, s: 25 },
  { h: 18, m: 24, s: 10 },
  { h: 19, m: 45, s: 33 },
  { h: 21, m: 12, s: 5 },
  { h: 22, m: 30, s: 40 },
];

let stream = '';
let mark = 1;
const totalExpected = days.length * timeSlots.length;

days.forEach((dayStr, dayIdx) => {
  const [year, month, day] = dayStr.split('-').map(Number);

  timeSlots.forEach((slot, slotIdx) => {
    const dateObj = new Date(Date.UTC(year, month - 1, day, slot.h - 6, slot.m, slot.s));
    const timestamp = Math.floor(dateObj.getTime() / 1000);

    const msgIdx = (dayIdx * 12 + slotIdx) % commitPool.length;
    const msg = commitPool[msgIdx];

    stream += `commit refs/heads/main\n`;
    stream += `mark :${mark}\n`;
    stream += `author nabilpwqz <nabilpwqz@gmail.com> ${timestamp} +0600\n`;
    stream += `committer nabilpwqz <nabilpwqz@gmail.com> ${timestamp} +0600\n`;
    stream += `data ${Buffer.byteLength(msg)}\n${msg}\n`;

    if (mark === 1) {
      stream += `from ${currentHead}\n`;
    } else {
      stream += `from :${mark - 1}\n`;
    }

    stream += `M 040000 ${finalTree} \n\n`;
    mark++;
  });
});

console.log(`Writing fast-import stream for ${totalExpected} commits...`);
fs.writeFileSync('scripts/march-april-stream.txt', stream);

console.log('Running git fast-import...');
const start = Date.now();
execSync('git fast-import < scripts/march-april-stream.txt', { shell: 'cmd.exe' });
console.log(`Successfully generated ${totalExpected} commits in ${Date.now() - start} ms!`);

// Clean up stream file
fs.unlinkSync('scripts/march-april-stream.txt');
