#!/usr/bin/env node
/**
 * adapt.js — obsidian-god /adapt command
 *
 * Scans new/changed vault files and:
 *   1. Normalizes frontmatter
 *   2. Enforces naming convention
 *   3. Injects MOC links
 *   4. Reports changes
 *
 * Usage:
 *   node adapt.js [vault-path] [options]
 *
 * Options:
 *   --dry-run     Show planned changes, write nothing
 *   --path <dir>  Scan only files in this folder
 *   --since <n>   Hours since modification (default: 24)
 *   --force       Skip confirmation prompt
 *
 * Compatible: Claude Code, Gemini CLI, Codex CLI, OpenCode
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const vaultPath = args.find(a => !a.startsWith('--')) || '.';
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const scopeIdx = args.indexOf('--path');
const scopeDir = scopeIdx !== -1 ? args[scopeIdx + 1] : null;
const sinceIdx = args.indexOf('--since');
const sinceHours = sinceIdx !== -1 ? parseInt(args[sinceIdx + 1]) : 24;

const today = new Date().toISOString().split('T')[0];
const markerFile = path.join(vaultPath, '.last-adapt');
const cutoffMs = sinceHours * 3600 * 1000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg) { console.log(msg); }
function warn(msg) { console.warn(`⚠️  ${msg}`); }
function ok(msg)  { console.log(`✅ ${msg}`); }
function info(msg){ console.log(`ℹ️  ${msg}`); }

function getAllMd(dir) {
  const results = [];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) results.push(full);
    }
  }
  walk(dir);
  return results;
}

function getRecentFiles(dir, cutoffMs) {
  const now = Date.now();
  return getAllMd(dir).filter(f => {
    try {
      const mtime = fs.statSync(f).mtimeMs;
      return (now - mtime) <= cutoffMs;
    } catch { return false; }
  });
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { hasFm: false, fm: {}, body: content };
  const fm = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return { hasFm: true, fm, body: content.slice(match[0].length).trim() };
}

function buildFrontmatter(fm) {
  const tags = fm.tags || [];
  const aliases = fm.aliases || [];
  const tagStr = Array.isArray(tags) ? tags.map(t => `  - ${t}`).join('\n') : `  - ${tags}`;
  const aliasStr = Array.isArray(aliases) ? aliases.map(a => `  - ${a}`).join('\n') : `  - ${aliases}`;
  return [
    '---',
    `title: ${fm.title || ''}`,
    'tags:',
    tagStr || '  - unfiled',
    'aliases:',
    aliasStr || '  []',
    `date: ${fm.date || today}`,
    `status: ${fm.status || 'seed'}`,
    '---'
  ].join('\n');
}

function inferDomain(filename, content) {
  const base = path.basename(filename, '.md');
  // Domain from "Domain - Topic" convention
  const dashIdx = base.indexOf(' - ');
  if (dashIdx > 0) return base.slice(0, dashIdx);
  // From tags in content
  const tagMatch = content.match(/tags:\s*\n((?:\s+-\s+\S+\n)+)/);
  if (tagMatch) {
    const firstTag = tagMatch[1].match(/\s+-\s+(\S+)/);
    if (firstTag) return firstTag[1].charAt(0).toUpperCase() + firstTag[1].slice(1);
  }
  return null;
}

function hasMocLink(content, domain) {
  return content.includes(`[[MOC - ${domain}]]`);
}

function hasRelatedSection(content) {
  return /^## Related/m.test(content);
}

function injectMocLink(content, domain) {
  // Try to add after first H1 paragraph
  const h1Match = content.match(/(# .+\n\n(?:>[^\n]+\n\n)?)/);
  const injection = `\nPart of [[MOC - ${domain}]]\n`;
  if (h1Match) {
    return content.replace(h1Match[0], h1Match[0] + injection);
  }
  return injection + content;
}

function addRelatedSection(content, domain) {
  return content.trim() + `\n\n## Related\n- [[MOC - ${domain}]]\n`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log('\n🔮 obsidian-god /adapt');
  log(`   Vault: ${path.resolve(vaultPath)}`);
  log(`   Scope: ${scopeDir || 'all'}`);
  log(`   Window: last ${sinceHours}h`);
  log(`   Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE'}\n`);

  const scanDir = scopeDir ? path.join(vaultPath, scopeDir) : vaultPath;
  const files = getRecentFiles(scanDir, cutoffMs);

  if (files.length === 0) {
    info('No recently modified .md files found.');
    info(`Hint: Use --since 168 to scan the last 7 days.`);
    return;
  }

  log(`Found ${files.length} file(s) to process:\n`);

  const changes = [];

  for (const filePath of files) {
    const rel = path.relative(vaultPath, filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { hasFm, fm, body } = parseFrontmatter(raw);
    let content = raw;
    let modified = false;
    const fileChanges = [];

    // 1. Frontmatter
    if (!hasFm) {
      const domain = inferDomain(filePath, raw);
      const newFm = {
        title: path.basename(filePath, '.md'),
        tags: domain ? [domain.toLowerCase()] : ['unfiled'],
        aliases: [],
        date: today,
        status: 'seed'
      };
      content = buildFrontmatter(newFm) + '\n\n' + body;
      modified = true;
      fileChanges.push('+ added frontmatter');
    }

    // 2. MOC link injection
    const domain = inferDomain(filePath, raw);
    if (domain && !hasMocLink(content, domain)) {
      content = injectMocLink(content, domain);
      modified = true;
      fileChanges.push(`+ injected [[MOC - ${domain}]] link`);
    }

    // 3. Related section
    if (!hasRelatedSection(content) && domain) {
      content = addRelatedSection(content, domain);
      modified = true;
      fileChanges.push('+ added ## Related section');
    }

    if (modified) {
      log(`📄 ${rel}`);
      fileChanges.forEach(c => log(`   ${c}`));
      changes.push({ filePath, content });
    } else {
      log(`✓  ${rel} — no changes needed`);
    }
  }

  if (changes.length === 0) {
    log('\n✨ All files already normalized. Vault is clean.\n');
    return;
  }

  log(`\n─────────────────────────────────────────`);
  log(`${changes.length} file(s) need updates.`);

  if (dryRun) {
    log('\n[DRY RUN] No files written. Remove --dry-run to apply.\n');
    return;
  }

  if (!force) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise(resolve => {
      rl.question('\nApply all changes? (y/N) ', answer => {
        rl.close();
        if (answer.toLowerCase() !== 'y') {
          log('Aborted. Use --force to skip this prompt.\n');
          process.exit(0);
        }
        resolve();
      });
    });
  }

  // Write changes
  for (const { filePath, content } of changes) {
    fs.writeFileSync(filePath, content, 'utf8');
    ok(`Written: ${path.relative(vaultPath, filePath)}`);
  }

  // Update marker
  fs.writeFileSync(markerFile, new Date().toISOString(), 'utf8');

  log(`\n✨ /adapt complete: ${changes.length} file(s) updated.\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
