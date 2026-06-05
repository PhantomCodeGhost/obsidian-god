#!/usr/bin/env node
/**
 * mocsync.js — Regenerate or update MOC files from current vault state.
 *
 * Behavior:
 *   - MOC does NOT exist → create it, linking all hub notes in that domain
 *   - MOC EXISTS → ONLY append missing hub note links. Never remove existing content.
 *
 * Usage:
 *   node mocsync.js <vault-path>
 *   node mocsync.js <vault-path> --domain Backend
 *   node mocsync.js <vault-path> --dry-run
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const vaultPath = args[0];
if (!vaultPath) { console.error('Usage: node mocsync.js <vault-path>'); process.exit(1); }

const isDryRun = args.includes('--dry-run');
const domainIdx = args.indexOf('--domain');
const scopeDomain = domainIdx > -1 ? args[domainIdx + 1] : null;

const DOMAINS = [
  'Backend','Frontend','Programming','DSA','Databases',
  'DevOps','System Design','AI','Computer Science',
];

const domains = scopeDomain ? [scopeDomain] : DOMAINS;

for (const domain of domains) {
  const domainDir = path.join(vaultPath, '01 Knowledge', domain);
  if (!fs.existsSync(domainDir)) continue;

  // Find all hub notes: TopicFolder/TopicFolder.md
  const hubNotes = [];
  for (const entry of fs.readdirSync(domainDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const hubPath = path.join(domainDir, entry.name, `${entry.name}.md`);
    if (fs.existsSync(hubPath)) {
      hubNotes.push(entry.name);
    }
  }

  const mocDir = path.join(vaultPath, 'Meta', 'MOCs');
  fs.mkdirSync(mocDir, { recursive: true });
  const mocPath = path.join(mocDir, `MOC - ${domain}.md`);

  if (!fs.existsSync(mocPath)) {
    // CREATE new MOC
    const today = new Date().toISOString().split('T')[0];
    const tag = domain.toLowerCase().replace(/ /g, '-');
    const links = hubNotes.map(n => `- [[${n}]]`).join('\n');
    const content = `---
title: MOC - ${domain}
tags: [moc, ${tag}]
created: ${today}
type: moc
---

# MOC - ${domain}

> Entry point for all ${domain} knowledge.

---

## Topics

${links || '- (no hub notes found yet)'}

---

> [!tip] Navigation
> Each topic is a hub note — click to explore its subtopics.
`;
    console.log(`CREATE  Meta/MOCs/MOC - ${domain}.md  (${hubNotes.length} topics)`);
    if (!isDryRun) fs.writeFileSync(mocPath, content, 'utf8');
  } else {
    // MOC EXISTS — append only missing links
    let mocContent = fs.readFileSync(mocPath, 'utf8');
    let appended = 0;
    for (const hub of hubNotes) {
      if (!mocContent.includes(`[[${hub}]]`)) {
        mocContent += `\n- [[${hub}]]\n`;
        appended++;
      }
    }
    if (appended > 0) {
      console.log(`APPEND  Meta/MOCs/MOC - ${domain}.md  (+${appended} new topics)`);
      if (!isDryRun) fs.writeFileSync(mocPath, mocContent, 'utf8');
    } else {
      console.log(`OK      Meta/MOCs/MOC - ${domain}.md  (up to date)`);
    }
  }
}

if (isDryRun) console.log('\n[DRY RUN — no files written]');
else console.log('\nMOC sync complete.');
