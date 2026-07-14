import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const html = readFileSync(new URL('../aresfit-dialer-sandde-v2.html', import.meta.url), 'utf8');

const requiredStateFields = [
  'activeFilters',
  'searchTerm',
  'queueLeadIds',
  'queueLabel',
  'sourceMeta',
];
const saveMatch = html.match(/function buildSessionState\(\)\{[\s\S]*?\n\}/);
assert(saveMatch, 'session state builder is missing');
for (const field of requiredStateFields) {
  assert(saveMatch[0].includes(field), `session state must persist ${field}`);
}

assert(html.includes('id="queue-strip"'), 'the active filtered queue needs a visible strip');
assert(html.includes('id="source-summary"'), 'the imported source needs a visible summary');
assert(html.includes('id="email-confirmation"'), 'Gmail launch needs an explicit sent/not-sent confirmation');
assert(html.includes('id="speaker-role"'), 'call notes need a DM/GK marker control');
assert(html.includes('role="status"'), 'save/toast feedback must be announced accessibly');
assert(html.includes('aria-live="polite"'), 'live feedback must use a polite live region');
assert(html.includes('@media (prefers-reduced-motion: reduce)'), 'reduced motion support is missing');
assert(html.includes('function setupModalAccessibility'), 'modal focus management is missing');
assert(!html.includes('toggleTheme()'), 'the broken light theme control must be removed');
assert(!html.includes('fonts.googleapis.com'), 'the app must not depend on remote fonts');

assert(html.includes('{SENDER_NAME} at AresFit'), 'email templates must use the configured sender');
assert(!html.includes("I'm Sandde, Director at AresFit"), 'email templates must not impersonate Sandde for every rep');

console.log('full refresh UI and persistence contract checks passed');
