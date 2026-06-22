import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const html = readFileSync(new URL('../aresfit-dialer-sandde-v2.html', import.meta.url), 'utf8');

const requiredSnippets = [
  'Export handover + CSV package',
  'function exportSessionPackage',
  'function createZipBlob',
  'AresFit_Session_Package_${stampShort}.zip',
  'handover-${stampLong}.md',
  'AresFit_Call_Sheet_${stampLong}.csv',
  'function exportStampShort',
  'function exportStampLong',
  'function getExportFileName',
  'modal-head',
  'Warm approved row callable',
  'not treated as a fresh dial',
  'function dialGateState',
  'function classifyCallbackState',
  'CALLBACK_ROW_OVERRIDES',
  "'Future CB'",
  "'Stale CB'",
  'Callback queue state split',
  'active call-now callbacks',
];

for (const snippet of requiredSnippets) {
  assert(html.includes(snippet), `missing 2026-06-22 fix snippet: ${snippet}`);
}

assert(
  /function isFreshDial\(l\)\{[\s\S]*if\(l\.notes&&l\.notes\.length\)return false;[\s\S]*if\(st&&st!=='Uncalled'\)return false;[\s\S]*return true;[\s\S]*\}/.test(html),
  'fresh dial gate must treat blank/Uncalled rows as fresh and warm/history rows as callable'
);

assert(
  /Callback:\s*l\s*=>\s*isActiveCallNowCallback\(l\)/.test(html),
  'Callback filter must mean active call-now callbacks only'
);

for (const row of [184, 228, 232, 234, 236, 245, 271, 294, 300, 318]) {
  assert(html.includes(`${row}:{state:`), `missing callback cleanup override for row ${row}`);
}

assert(
  /if\(gate\.state==='blocked'\)\{[\s\S]*alert\(gate\.message/.test(html),
  'call button must block non-callable rows such as DO NOT CALL'
);

assert(
  /if\(gate\.state==='fresh-blocked'\)\{[\s\S]*Fresh dials blocked/.test(html),
  'call button must still block true fresh dials until reviewed or overridden'
);

console.log('dialer 2026-06-22 fix contract passed');
