import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const loader = readFileSync(new URL('../aresfit-dialer-sandde-v2.html', import.meta.url), 'utf8');
const patch = readFileSync(new URL('../aresfit-dialer-v2-2026-06-22.patch', import.meta.url), 'utf8');
const source = `${loader}\n${patch}`;

assert(loader.includes('ARES_V2_BASE_URL'), 'v2 file must load the pinned remote base');
assert(loader.includes('ARES_V2_PATCH_URL'), 'v2 file must load the 2026-06-22 patch');
assert(loader.includes('applyUnifiedPatch'), 'v2 loader must apply the patch before rendering');
assert(loader.includes('ba4fc91abef4c41451c6d74bc2cffa596a6ee719'), 'v2 loader must pin the expected base commit');
assert(loader.includes('aresfit-dialer-v2-2026-06-22.patch'), 'v2 loader must reference the patch file');

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
  assert(source.includes(snippet), `missing 2026-06-22 fix snippet: ${snippet}`);
}

assert(
  /function isFreshDial\(l\)\{[\s\S]*if\(l\.notes&&l\.notes\.length\)return false;[\s\S]*if\(st&&st!=='Uncalled'\)return false;[\s\S]*return true;[\s\S]*\}/.test(source),
  'fresh dial gate must treat blank/Uncalled rows as fresh and warm/history rows as callable'
);

assert(
  /Callback:\s*l\s*=>\s*isActiveCallNowCallback\(l\)/.test(source),
  'Callback filter must mean active call-now callbacks only'
);

for (const row of [184, 228, 232, 234, 236, 245, 271, 294, 300, 318]) {
  assert(source.includes(`${row}:{state:`), `missing callback cleanup override for row ${row}`);
}

assert(
  /if\(gate\.state==='blocked'\)\{[\s\S]*alert\(gate\.message/.test(source),
  'call button must block non-callable rows such as DO NOT CALL'
);

assert(
  /if\(gate\.state==='fresh-blocked'\)\{[\s\S]*Fresh dials blocked/.test(source),
  'call button must still block true fresh dials until reviewed or overridden'
);

console.log('dialer 2026-06-22 loader + patch contract passed');
