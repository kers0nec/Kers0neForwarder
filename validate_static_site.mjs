import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const requiredIds = [
  'botToken', 'channelInput', 'webhook', 'scanInterval', 'startBtn', 'stopBtn',
  'lsBotToken', 'lsChannelInput', 'lsWebhook', 'lsFilter', 'lsScanInterval',
  'lsStartBtn', 'lsStopBtn', 'log', 'lsLog'
];

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing expected interface element: #${id}`);
}

if (html.includes('localStorage.setItem') || html.includes('localStorage.getItem')) {
  throw new Error('Credentials must not be persisted in localStorage.');
}
if (!html.includes("params.set('after', lastId)")) {
  throw new Error('Polling must request messages after the established baseline.');
}
if (html.includes('el.innerHTML +=') || html.includes('logEl.innerHTML +=')) {
  throw new Error('Logs must use DOM text nodes rather than interpolated HTML.');
}
if (!html.includes("allowed_mentions: { parse: [] }")) {
  throw new Error('Forwarded messages must disable automatic Discord mentions.');
}

const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) throw new Error('No inline application script found.');
new vm.Script(match[1], { filename: 'index.inline.js' });

console.log(`PASS: ${requiredIds.length} required controls found.`);
console.log('PASS: No local credential persistence detected.');
console.log('PASS: Ordered after-baseline polling is configured.');
console.log('PASS: Forwarded messages disable automatic mentions.');
console.log('PASS: Inline JavaScript parses successfully.');
