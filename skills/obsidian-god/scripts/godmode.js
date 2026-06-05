#!/usr/bin/env node
/**
 * godmode.js — obsidian-god /godmode command
 *
 * Full vault audit + restructure:
 *   1. Inventory all files
 *   2. Detect orphans, duplicates, missing frontmatter
 *   3. Compute health score
 *   4. Output a structured change plan (JSON + human-readable)
 *
 * Actual file writes are done by the agent (Claude Code / Gemini CLI)
 * using this script's output as a plan. This keeps the script safe —
 * agent reviews before executing.
 *
 * Usage:
 *   node godmode.js [vault-path] [options]
 *
 * Options:
 *   --domain <name>   Scope to one domain only
 *   --json            Output raw JSON plan (for agent parsing)
 *   --score-only      Print health score and exit
 *
 * Compatible: Claude Code, Gemini CLI, Codex CLI, OpenCode
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const vaultPath = args.find(a => !a.startsWith('--')) || '.';
const domainFilter = (() => { const i = args.indexOf('--domain'); return i !== -1 ? args[i+1] : null; })();
const jsonOutput = args.includes('--json');
const scoreOnly = args.includes('--score-only');

// ─── Utilities ────────────────────────────────────────────────────────────────

function walkMd(dir) {
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

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const obj = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (kv) obj[kv[1]] = kv[2].trim();
  }
  return obj;
}

function extractWikilinks(content) {
  const matches = content.match(/\[\[([^\]#|]+)[^\]]*\]\]/g) || [];
  return matches.map(m => m.replace(/\[\[([^\]#|]+)[^\]]*\]\]/, '$1').trim());
}

function inferDomain(filename) {
  const base = path.basename(filename, '.md');
  const dash = base.indexOf(' - ');
  return dash > 0 ? base.slice(0, dash) : null;
}

function isMoc(filename) {
  return path.basename(filename, '.md').startsWith('MOC - ');
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

function analyzeVault(vaultPath, domainFilter) {
  const allFiles = walkMd(vaultPath);
  const files = domainFilter
    ? allFiles.filter(f => inferDomain(f) === domainFilter || isMoc(f))
    : allFiles;

  const notes = files.map(f => {
    const content = fs.readFileSync(f, 'utf8');
    const fm = parseFrontmatter(content);
    const links = extractWikilinks(content);
    const domain = inferDomain(f);
    return {
      path: f,
      rel: path.relative(vaultPath, f),
      name: path.basename(f, '.md'),
      domain,
      isMoc: isMoc(f),
      hasFrontmatter: !!fm,
      fm,
      links,
      outDegree: links.length,
    };
  });

  // Build backlink map
  const backlinkMap = {};
  for (const note of notes) {
    for (const link of note.links) {
      if (!backlinkMap[link]) backlinkMap[link] = [];
      backlinkMap[link].push(note.name);
    }
  }

  for (const note of notes) {
    note.inDegree = (backlinkMap[note.name] || []).length;
    note.isOrphan = note.outDegree === 0 && note.inDegree === 0;
    note.hasMocLink = note.links.some(l => l.startsWith('MOC - '));
  }

  // Detect duplicates (naive: same domain, similar suffix after last ' - ')
  const duplicates = [];
  const seen = {};
  for (const note of notes) {
    if (note.isMoc) continue;
    const suffix = note.name.includes(' - ') ? note.name.split(' - ').slice(1).join(' - ').toLowerCase() : note.name.toLowerCase();
    if (seen[suffix]) {
      duplicates.push({ a: seen[suffix], b: note.name });
    } else {
      seen[suffix] = note.name;
    }
  }

  // Domain coverage
  const domains = [...new Set(notes.filter(n => !n.isMoc && n.domain).map(n => n.domain))];
  const mocDomains = new Set(notes.filter(n => n.isMoc).map(n => n.name.replace('MOC - ', '')));
  const domainsMissingMoc = domains.filter(d => !mocDomains.has(d));

  // Health score
  const total = notes.filter(n => !n.isMoc).length || 1;
  const avgLinks = notes.filter(n => !n.isMoc).reduce((s, n) => s + n.outDegree, 0) / total;
  const fmRatio = notes.filter(n => n.hasFrontmatter).length / (notes.length || 1);
  const mocCoverage = domains.length ? (domains.length - domainsMissingMoc.length) / domains.length : 1;
  const orphanRatio = notes.filter(n => n.isOrphan).length / (notes.length || 1);
  const dupRatio = duplicates.length / (total || 1);

  const score = Math.round(
    Math.min(avgLinks / 3, 1) * 25 +
    fmRatio * 20 +
    mocCoverage * 20 +
    (1 - orphanRatio) * 20 +
    (1 - dupRatio) * 15
  );

  return { notes, duplicates, domains, domainsMissingMoc, backlinkMap, avgLinks, fmRatio, mocCoverage, orphanRatio, score };
}

// ─── Plan Builder ─────────────────────────────────────────────────────────────

function buildPlan(analysis) {
  const plan = { create: [], rename: [], merge: [], addLinks: [], addFrontmatter: [], report: [] };

  for (const d of analysis.domainsMissingMoc) {
    plan.create.push({ type: 'moc', path: `00 - MOCs/MOC - ${d}.md`, reason: `Domain "${d}" has no MOC` });
  }

  for (const note of analysis.notes) {
    if (!note.hasFrontmatter) {
      plan.addFrontmatter.push({ path: note.rel, reason: 'Missing frontmatter' });
    }
    if (!note.isMoc && !note.hasMocLink && note.domain) {
      plan.addLinks.push({ path: note.rel, add: `[[MOC - ${note.domain}]]`, reason: 'No MOC link' });
    }
    if (!note.isMoc && note.outDegree < 2) {
      plan.addLinks.push({ path: note.rel, add: '2+ peer wikilinks', reason: `Only ${note.outDegree} outgoing link(s)` });
    }
  }

  for (const dup of analysis.duplicates) {
    plan.merge.push({ keep: dup.a, remove: dup.b, reason: 'Possible duplicate (same concept suffix)' });
  }

  return plan;
}

// ─── Output ───────────────────────────────────────────────────────────────────

function printHuman(analysis, plan) {
  const emoji = analysis.score >= 90 ? '🔵' : analysis.score >= 75 ? '🟢' : analysis.score >= 50 ? '🟡' : '🔴';

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║    obsidian-god  /godmode  REPORT    ║');
  console.log('╚══════════════════════════════════════╝\n');

  console.log(`Vault: ${path.resolve(vaultPath)}`);
  console.log(`Notes scanned: ${analysis.notes.length}`);
  console.log(`Domains found: ${analysis.domains.join(', ') || 'none'}\n`);

  console.log('── HEALTH SCORE ──────────────────────');
  console.log(`${emoji}  ${analysis.score}/100`);
  console.log(`   Avg links/note: ${analysis.avgLinks.toFixed(1)} (target ≥3)`);
  console.log(`   Frontmatter: ${Math.round(analysis.fmRatio*100)}% complete`);
  console.log(`   MOC coverage: ${Math.round(analysis.mocCoverage*100)}%`);
  console.log(`   Orphan rate: ${Math.round(analysis.orphanRatio*100)}%`);
  console.log(`   Possible duplicates: ${analysis.duplicates.length}\n`);

  console.log('── PROPOSED CHANGES ─────────────────');
  if (plan.create.length) {
    console.log('\nCREATE:');
    plan.create.forEach(c => console.log(`  + ${c.path}  [${c.reason}]`));
  }
  if (plan.addFrontmatter.length) {
    console.log('\nADD FRONTMATTER:');
    plan.addFrontmatter.forEach(c => console.log(`  ~ ${c.path}`));
  }
  if (plan.addLinks.length) {
    console.log('\nADD LINKS:');
    plan.addLinks.forEach(c => console.log(`  ~ ${c.path}  →  ${c.add}  [${c.reason}]`));
  }
  if (plan.merge.length) {
    console.log('\nREVIEW DUPLICATES:');
    plan.merge.forEach(c => console.log(`  ? KEEP "${c.keep}"  REVIEW "${c.remove}"`));
  }

  const total = plan.create.length + plan.addFrontmatter.length + plan.addLinks.length + plan.merge.length;
  console.log(`\nTotal proposed actions: ${total}`);
  console.log('\nReview the plan above, then instruct your agent to execute.\n');
  console.log('Tip: Pass --json to get machine-readable output for agent execution.\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const analysis = analyzeVault(vaultPath, domainFilter);
const plan = buildPlan(analysis);

if (scoreOnly) {
  console.log(analysis.score);
  process.exit(0);
}

if (jsonOutput) {
  console.log(JSON.stringify({ score: analysis.score, analysis: {
    noteCount: analysis.notes.length,
    domains: analysis.domains,
    domainsMissingMoc: analysis.domainsMissingMoc,
    duplicates: analysis.duplicates,
    avgLinks: analysis.avgLinks,
    orphanRatio: analysis.orphanRatio,
  }, plan }, null, 2));
} else {
  printHuman(analysis, plan);
}
