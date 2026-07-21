import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('aresfit-dialer-sandde-v2.html', root), 'utf8');
const index = readFileSync(new URL('index.html', root), 'utf8');
const archive = new URL('versions/2026-07-15-classic-layout-64c3b73/', root);
const archivedHtml = readFileSync(new URL('aresfit-dialer-sandde-v2.html', archive));
const archivedIndex = readFileSync(new URL('index.html', archive));
const manifest = readFileSync(new URL('MANIFEST.md', archive), 'utf8');
const latestArchive = new URL('versions/2026-07-21-compact-mobile-3995075/', root);
const latestArchivedHtml = readFileSync(new URL('aresfit-dialer-sandde-v2.html', latestArchive));
const latestArchivedIndex = readFileSync(new URL('index.html', latestArchive));
const latestManifest = readFileSync(new URL('MANIFEST.md', latestArchive), 'utf8');
const sha256 = value => createHash('sha256').update(value).digest('hex').toUpperCase();

assert.equal(sha256(archivedHtml), 'B683E30073B6B9683E2791D8E8D61A2C92DB4C0D2C6CB3B88F6A09D885A4C5A8');
assert.equal(sha256(archivedIndex), 'A6BF541F023CDAA3C3B892BC96540AAF011B32E228236C28B5CAC17D7B370D44');
assert(manifest.includes('archive/live-2026-07-15-classic-layout-64c3b73'), 'rollback branch is not documented');
assert.equal(sha256(latestArchivedHtml), 'D9ADB032BC95C12BCCD263E5D719C7F38CF88A0CCF7E68A1DFC4ABCD358FA06A');
assert.equal(sha256(latestArchivedIndex), '620752BEB96C7A26B912B5471A0B641BA1C20A3D346FD9088B91C9E4E0B3E95B');
assert(latestManifest.includes('archive/live-2026-07-21-compact-mobile-3995075'), 'latest rollback branch is not documented');
assert(index.includes('20260721-original-layout-r1'), 'cache-busting redirect is stale');
assert(html.includes("const APP_BUILD = '2026.07.21'"), 'build label is stale');
assert(html.includes('@media not all {'), 'the July redesign is not explicitly disabled');
assert(html.includes('.source-summary,.queue-strip{display:none!important}'), 'new header clutter must stay hidden in the original layout');
assert(html.includes("if(onTarget){slot.innerHTML='';return}"), 'current callback is still rendered twice');
assert(html.includes("if(state.state!=='blocked'&&(state.state==='warm'||allowed)){slot.innerHTML='';return}"), 'allowed-call banner is still duplicated');
assert(html.includes('input,textarea,select{font-size:16px;'), 'iOS focus zoom protection is missing');

console.log('original layout restoration, iOS input sizing and rollback archive checks passed');
