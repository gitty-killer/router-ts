const fs = require('fs');
const path = require('path');

const FIELDS = ["method", "path", "target"];
const NUMERIC_FIELD = null;
const STORE_PATH = path.join('data', 'store.txt');

function parseKv(items) {
  const record = {};
  for (const item of items) {
    const idx = item.indexOf('=');
    if (idx === -1) throw new Error(`Invalid item: ${item}`);
    const key = item.slice(0, idx);
    const value = item.slice(idx + 1);
    if (!FIELDS.includes(key)) throw new Error(`Unknown field: ${key}`);
    if (value.includes('|')) throw new Error("Value may not contain '|' ");
    record[key] = value;
  }
  for (const f of FIELDS) if (!(f in record)) record[f] = '';
  return record;
}

function formatRecord(values) {
  return FIELDS.map((k) => `${k}=${values[k] || ''}`).join('|');
}

function parseLine(line) {
  const values = {};
  const parts = line.trim().split('|');
  for (const part of parts) {
    if (!part) continue;
    const idx = part.indexOf('=');
    if (idx === -1) throw new Error(`Bad part: ${part}`);
    const k = part.slice(0, idx);
    const v = part.slice(idx + 1);
    values[k] = v;
  }
  return values;
}

function loadRecords() {
  if (!fs.existsSync(STORE_PATH)) return [];
  const lines = fs.readFileSync(STORE_PATH, 'utf8').split('
');
  return lines.filter((l) => l.trim()).map(parseLine);
}

function appendRecord(values) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.appendFileSync(STORE_PATH, formatRecord(values) + '
', 'utf8');
}

function summary(records) {
  const count = records.length;
  if (NUMERIC_FIELD === null) return `count=${count}`;
  let total = 0;
  for (const r of records) {
    const n = parseInt(r[NUMERIC_FIELD] || '0', 10);
    if (!Number.isNaN(n)) total += n;
  }
  return `count=${count}, ${NUMERIC_FIELD}_total=${total}`;
}

function main(argv) {
  const cmd = argv[0];
  const rest = argv.slice(1);
  if (!cmd) {
    console.log('Usage: init | add key=value... | list | summary');
    return 2;
  }
  if (cmd === 'init') {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, '', 'utf8');
    return 0;
  }
  if (cmd === 'add') {
    appendRecord(parseKv(rest));
    return 0;
  }
  if (cmd === 'list') {
    for (const r of loadRecords()) console.log(formatRecord(r));
    return 0;
  }
  if (cmd === 'summary') {
    console.log(summary(loadRecords()));
    return 0;
  }
  console.error(`Unknown command: ${cmd}`);
  return 2;
}

process.exitCode = main(process.argv.slice(2));
