#!/usr/bin/env node
/**
 * adapt.js — Normalize recently changed files. APPEND-ONLY. Never restructures.
 *
 * Philosophy:
 *   - Vault structure belongs to the user. Never move, rename, or restructure.
 *   - New concepts found? Append link to existing hub note in same folder.
 *   - Missing frontmatter? Add it. Existing frontmatter? Leave it alone.
 *   - Missing MOC link? Inject "Part of [[MOC - Domain]]" — never remove existing links.
 *   - Add Related section if absent. Never overwrite existing Related section.
 *
 * Usage:
 *   node adapt.js <vault-path>
 *   node adapt.js <vault-path> --dry-run
 *   node adapt.js <vault-path> --path "Backend/Spring Boot/"
 *   node adapt.js <vault-path> --since 48        ← hours
 *   node adapt.js <vault-path> --file "note.md"  ← single file
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const vaultPath = args[0];
if (!vaultPath) { console.error('Usage: node adapt.js <vault-path> [--dry-run] [--path X] [--since N]'); process.exit(1); }

const isDryRun = args.includes('--dry-run');
const pathIdx = args.indexOf('--path');
const scopePath = pathIdx > -1 ? args[pathIdx + 1] : null;
const sinceIdx = args.indexOf('--since');
const sinceHours = sinceIdx > -1 ? parseInt(args[sinceIdx + 1]) : 24;
const fileIdx = args.indexOf('--file');
const singleFile = fileIdx > -1 ? args[fileIdx + 1] : null;

const changes = [];

function log(action, filePath, detail) {
  changes.push({ action, path: filePath, detail });
  console.log(`  ${action.padEnd(16)} ${filePath}${detail ? ' — ' + detail : ''}`);
}

// ── Domain detection ──────────────────────────────────────────────────────────
const DOMAIN_MAP = {
  'Backend': 'Backend', 'Frontend': 'Frontend', 'Programming': 'Programming',
  'DSA': 'DSA', 'Databases': 'Databases', 'DevOps': 'DevOps',
  'System Design': 'System Design', 'AI': 'AI', 'Computer Science': 'Computer Science',
};

function detectDomain(relPath) {
  for (const [folder, domain] of Object.entries(DOMAIN_MAP)) {
    if (relPath.startsWith(`01 Knowledge/${folder}`)) return domain;
  }
  return null;
}

// ── Collect target files ──────────────────────────────────────────────────────
function collectFiles(dir, base) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.')) results.push(...collectFiles(full, base));
    else if (e.isFile() && e.name.endsWith('.md')) results.push(path.relative(base, full));
  }
  return results;
}

let targetFiles;
if (singleFile) {
  targetFiles = [singleFile];
} else {
  let allFiles = collectFiles(vaultPath, vaultPath);
  if (scopePath) allFiles = allFiles.filter(f => f.startsWith(scopePath));
  if (sinceHours) {
    const cutoff = Date.now() - sinceHours * 3600 * 1000;
    allFiles = allFiles.filter(f => {
      try { return fs.statSync(path.join(vaultPath, f)).mtimeMs > cutoff; } catch { return false; }
    });
  }
  targetFiles = allFiles;
}

if (targetFiles.length === 0) {
  console.log(`No files modified in last ${sinceHours}h. Nothing to adapt.`);
  process.exit(0);
}

console.log(`\nAdapting ${targetFiles.length} file(s)${isDryRun ? ' [DRY RUN]' : ''}...\n`);

// ── Process each file ─────────────────────────────────────────────────────────
for (const relPath of targetFiles) {
  const fullPath = path.join(vaultPath, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  const domain = detectDomain(relPath);
  const noteName = path.basename(relPath, '.md');
  const folderPath = path.dirname(relPath);

  // ── 1. Add missing frontmatter (NEVER overwrite existing) ──────────────────
  if (!content.startsWith('---')) {
    const today = new Date().toISOString().split('T')[0];
    const tagLine = domain ? `[${domain.toLowerCase().replace(/ /g, '-')}]` : '[]';
    const fm = `---\ntitle: ${noteName}\ntags: ${tagLine}\naliases: []\ncreated: ${today}\nstatus: active\ntype: concept\n---\n\n`;
    content = fm + content;
    log('ADD_FRONTMATTER', relPath);
    modified = true;
  } else {
    // Frontmatter exists — only add MISSING fields, never touch existing ones
    const fmEnd = content.indexOf('\n---', 3);
    if (fmEnd > -1) {
      const fmBlock = content.slice(0, fmEnd);
      const today = new Date().toISOString().split('T')[0];
      let additions = '';
      if (!/^tags:/m.test(fmBlock)) { additions += `tags: []\n`; }
      if (!/^created:/m.test(fmBlock)) { additions += `created: ${today}\n`; }
      if (!/^status:/m.test(fmBlock)) { additions += `status: active\n`; }
      if (additions) {
        content = content.slice(0, fmEnd) + '\n' + additions.trimEnd() + content.slice(fmEnd);
        log('PATCH_FRONTMATTER', relPath, 'added missing fields');
        modified = true;
      }
    }
  }

  // ── 2. Inject MOC link if domain known and link absent ─────────────────────
  if (domain) {
    const mocLink = `Part of [[MOC - ${domain}]]`;
    if (!content.includes(`MOC - ${domain}`)) {
      // Insert after frontmatter block
      const insertAfter = content.indexOf('\n---\n', 3);
      if (insertAfter > -1) {
        content = content.slice(0, insertAfter + 5) + `\n${mocLink}\n` + content.slice(insertAfter + 5);
      } else {
        content += `\n\n${mocLink}\n`;
      }
      log('INJECT_MOC_LINK', relPath, mocLink);
      modified = true;
    }
  }

  // ── 3. Add Related section if absent ──────────────────────────────────────
  if (!content.includes('[!info] Related') && !content.includes('## Related')) {
    content += `\n\n> [!info] Related Concepts\n> - \n`;
    log('ADD_RELATED', relPath, 'empty Related callout added');
    modified = true;
  }

  // ── 4. Append note link to hub note if this is a NEW concept in folder ─────
  // Only if: note is NOT the hub note itself, hub note exists, hub doesn't already link here
  const folderName = path.basename(folderPath);
  const hubRelPath = path.join(folderPath, `${folderName}.md`);
  const hubFullPath = path.join(vaultPath, hubRelPath);
  const isHubNote = noteName === folderName;

  if (!isHubNote && fs.existsSync(hubFullPath)) {
    let hubContent = fs.readFileSync(hubFullPath, 'utf8');
    if (!hubContent.includes(`[[${noteName}]]`)) {
      // Append to hub note — find last list item or append at end
      hubContent += `\n- [[${noteName}]]\n`;
      log('APPEND_TO_HUB', hubRelPath, `linked [[${noteName}]]`);
      if (!isDryRun) fs.writeFileSync(hubFullPath, hubContent, 'utf8');
    }
  }

  // ── Write ──────────────────────────────────────────────────────────────────
  if (modified && !isDryRun) {
    fs.writeFileSync(fullPath, content, 'utf8');
  }
}

// ── Write .last-adapt marker ──────────────────────────────────────────────────
const systemDir = path.join(vaultPath, 'Meta', 'System');
if (!isDryRun) {
  fs.mkdirSync(systemDir, { recursive: true });
  fs.writeFileSync(path.join(systemDir, '.last-adapt'), new Date().toISOString());
}

console.log(`\n${isDryRun ? '[DRY RUN] ' : ''}Done. ${changes.length} change(s) applied.`);
if (isDryRun) console.log('Run without --dry-run to apply.');
