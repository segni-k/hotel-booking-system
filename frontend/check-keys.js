const fs = require('fs');

function extractKeys(content) {
  content = content.replace(/\/\/.*$/gm, '');
  content = content.replace(/import.*$/gm, '');
  content = content.replace(/export.*$/gm, '');
  content = content.replace(/as const;/g, '');
  
  const keys = [];
  const lines = content.split('\n');
  const path = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    const sectionMatch = trimmed.match(/^(\w+)\s*:\s*\{$/);
    if (sectionMatch) {
      path.push(sectionMatch[1]);
      continue;
    }
    const kvMatch = trimmed.match(/^(\w+)\s*:/);
    if (kvMatch && !trimmed.endsWith('{')) {
      keys.push([...path, kvMatch[1]].join('.'));
    }
    if (trimmed === '},' || trimmed === '}') {
      if (path.length > 0) path.pop();
    }
  }
  return keys.sort();
}

const en = fs.readFileSync('i18n/en.ts', 'utf8');
const am = fs.readFileSync('i18n/am.ts', 'utf8');
const or_ = fs.readFileSync('i18n/or.ts', 'utf8');

const enKeys = extractKeys(en);
const amKeys = extractKeys(am);
const orKeys = extractKeys(or_);

const missingAm = enKeys.filter(k => !amKeys.includes(k));
const missingOr = enKeys.filter(k => !orKeys.includes(k));
const extraAm = amKeys.filter(k => !enKeys.includes(k));
const extraOr = orKeys.filter(k => !enKeys.includes(k));

console.log('EN keys:', enKeys.length);
console.log('AM keys:', amKeys.length);
console.log('OR keys:', orKeys.length);
console.log('Missing in AM:', missingAm.length === 0 ? 'NONE' : missingAm.join(', '));
console.log('Missing in OR:', missingOr.length === 0 ? 'NONE' : missingOr.join(', '));
console.log('Extra in AM:', extraAm.length === 0 ? 'NONE' : extraAm.join(', '));
console.log('Extra in OR:', extraOr.length === 0 ? 'NONE' : extraOr.join(', '));
