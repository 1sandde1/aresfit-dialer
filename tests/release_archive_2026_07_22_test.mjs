import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const root = new URL('../', import.meta.url);
const archive = new URL('versions/2026-07-22-original-restore-c346ce1/', root);
const app = readFileSync(new URL('aresfit-dialer-sandde-v2.html', archive));
const index = readFileSync(new URL('index.html', archive));
const manifest = readFileSync(new URL('MANIFEST.md', archive), 'utf8');
const sha256 = value => createHash('sha256').update(value).digest('hex').toUpperCase();

assert.equal(sha256(app), 'EA76152BE105E788015E0D126185301FB279487003028872BE37789603E2FB7F');
assert.equal(sha256(index), 'E31F6A998659B79710BBD73B10D570A0C8906299007624554A2237BB39EDA354');
assert(manifest.includes('Status: archived'));
assert(manifest.includes('c346ce19d6b2bc9c93367cc20c495e665d69aecc'));
assert(manifest.includes('archive/live-2026-07-22-original-restore-c346ce1'));

console.log('2026-07-22 pre-change live release archive is intact');
