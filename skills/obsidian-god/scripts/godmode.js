#!/usr/bin/env node
/**
 * godmode.js — Full vault audit
 *
 * Usage:
 *   node godmode.js <vault-path>
 *   node godmode.js <vault-path> --json
 *   node godmode.js <vault-path> --domain Backend
 *   node godmode.js <vault-path> --dry-run
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const vaultPath = args[0];
if (!vaultPath) { console.error('Usage: node godmode.js <vault-path>'); process.exit(1); }

const isJson = args.includes('--json');
const isDryRun = args.includes('--dry-run');
const domainIdx = args.indexOf('--domain');
const scopeDomain = domainIdx > -1 ? args[domainIdx + 1] : null;

// ── Collect all notes ────────────────────────────────────────────────────────
function collectFiles(dir, base) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.')) {
      results.push(...collectFiles(full, base));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

let allFiles = collectFiles(vaultPath, vaultPath);
if (scopeDomain) allFiles = allFiles.filter(f => f.startsWith(`01 Knowledge/${scopeDomain}`));

// ── Parse frontmatter + links ────────────────────────────────────────────────
function parseNote(relPath) {
  const content = fs.readFileSync(path.join(vaultPath, relPath), 'utf8');
  const links = [...content.matchAll(/\[\[([^\]|#]+)/g)].map(m => m[1].trim());
  const hasFrontmatter = content.startsWith('---');
  const hasTags = /^tags:/m.test(content);
  const hasStatus = /^status:/m.test(content);
  const hasCreated = /^created:/m.test(content);
  const lineCount = content.split('\n').length;
  return { relPath, links, hasFrontmatter, hasTags, hasStatus, hasCreated, lineCount, content };
}

const notes = allFiles.map(parseNote);
const noteSet = new Set(notes.map(n => path.basename(n.relPath, '.md')));

// ── Build inbound link map ───────────────────────────────────────────────────
const inbound = {};
for (const n of notes) {
  for (const link of n.links) {
    if (!inbound[link]) inbound[link] = [];
    inbound[link].push(n.relPath);
  }
}

// ── Analysis ─────────────────────────────────────────────────────────────────
const issues = [];

for (const n of notes) {
  const name = path.basename(n.relPath, '.md');
  const inboundCount = (inbound[name] || []).length;
  const outboundCount = n.links.length;

  // Orphan
  if (inboundCount === 0 && outboundCount === 0) {
    issues.push({ type: 'ORPHAN', path: n.relPath, detail: 'No inbound or outbound links' });
  }

  // Missing frontmatter fields
  if (!n.hasTags) issues.push({ type: 'MISSING_TAGS', path: n.relPath });
  if (!n.hasStatus) issues.push({ type: 'MISSING_STATUS', path: n.relPath });

  // Giant note
  if (n.lineCount > 500) {
    issues.push({ type: 'GIANT_NOTE', path: n.relPath, detail: `${n.lineCount} lines — consider splitting` });
  }

  // Broken links (target not in vault)
  for (const link of n.links) {
    if (!noteSet.has(link)) {
      issues.push({ type: 'BROKEN_LINK', path: n.relPath, detail: `[[${link}]] target not found` });
    }
  }

  // Generic names
  const genericNames = ['Note', 'Untitled', 'New note', 'Draft', 'Temp'];
  if (genericNames.some(g => name.toLowerCase().includes(g.toLowerCase()))) {
    issues.push({ type: 'POOR_NAMING', path: n.relPath, detail: 'Generic filename' });
  }
}

// Check missing hub notes
const folders = new Set();
for (const f of allFiles) {
  const dir = path.dirname(f);
  if (dir !== '.') folders.add(dir);
}
for (const folder of folders) {
  const folderName = path.basename(folder);
  const hubPath = path.join(folder, `${folderName}.md`);
  if (!fs.existsSync(path.join(vaultPath, hubPath))) {
    issues.push({ type: 'MISSING_HUB', path: folder, detail: `No hub note ${folderName}.md` });
  }
}

// Check missing MOCs
const domains = ['Backend','Frontend','Programming','DSA','Databases','DevOps','System Design','AI','Computer Science'];
for (const d of (scopeDomain ? [scopeDomain] : domains)) {
  const mocPath = `Meta/MOCs/MOC - ${d}.md`;
  if (!fs.existsSync(path.join(vaultPath, mocPath))) {
    issues.push({ type: 'MISSING_MOC', path: mocPath, detail: `MOC for ${d} not found` });
  }
}

// ── Score ────────────────────────────────────────────────────────────────────
const totalNotes = notes.length || 1;
const orphans = issues.filter(i => i.type === 'ORPHAN').length;
const missingHubs = issues.filter(i => i.type === 'MISSING_HUB').length;
const missingMOCs = issues.filter(i => i.type === 'MISSING_MOC').length;
const brokenLinks = issues.filter(i => i.type === 'BROKEN_LINK').length;

const score = Math.max(0, Math.round(
  100
  - (orphans / totalNotes) * 30
  - (missingHubs * 5)
  - (missingMOCs * 3)
  - (brokenLinks / totalNotes) * 20
));

const result = {
  vaultPath,
  scope: scopeDomain || 'full',
  totalNotes,
  healthScore: score,
  issueCount: issues.length,
  issues,
  dryRun: isDryRun,
};

if (isJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`\n📊 Vault Health Score: ${score}/100`);
  console.log(`   Notes scanned: ${totalNotes}`);
  console.log(`   Issues found:  ${issues.length}\n`);

  const byType = {};
  for (const i of issues) { (byType[i.type] = byType[i.type] || []).push(i); }
  for (const [type, list] of Object.entries(byType)) {
    console.log(`── ${type} (${list.length})`);
    for (const item of list.slice(0, 5)) {
      console.log(`   ${item.path}${item.detail ? ' — ' + item.detail : ''}`);
    }
    if (list.length > 5) console.log(`   ... and ${list.length - 5} more`);
    console.log();
  }

  if (isDryRun) console.log('[DRY RUN — no changes written]');
}
