#!/usr/bin/env node
/**
 * snapshot.js — Create a rollback snapshot before any vault modifications
 *
 * Usage:
 *   node snapshot.js <vault-path> --command "/godmode"
 *   node snapshot.js <vault-path> --command "/adapt" --files "file1.md,file2.md"
 *
 * Creates: <vault-path>/.obsidian-god/snapshots/<ISO-timestamp>/
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const vaultPath = args[0];
if (!vaultPath) {
  console.error('Usage: node snapshot.js <vault-path> [--command <cmd>] [--files <comma-list>]');
  process.exit(1);
}

const commandIdx = args.indexOf('--command');
const command = commandIdx > -1 ? args[commandIdx + 1] : 'manual';

const filesIdx = args.indexOf('--files');
const targetFiles = filesIdx > -1 ? args[filesIdx + 1].split(',') : null;

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const snapshotDir = path.join(vaultPath, '.obsidian-god', 'snapshots', timestamp);
const filesDir = path.join(snapshotDir, 'files');

fs.mkdirSync(filesDir, { recursive: true });

// Collect files to snapshot
function collectMdFiles(dir, baseDir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      results.push(...collectMdFiles(fullPath, baseDir));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.canvas') || entry.name.endsWith('.base'))) {
      results.push(path.relative(baseDir, fullPath));
    }
  }
  return results;
}

const filesToSnapshot = targetFiles || collectMdFiles(vaultPath, vaultPath);

// Copy files into snapshot
let copied = 0;
for (const relPath of filesToSnapshot) {
  const src = path.join(vaultPath, relPath);
  const dest = path.join(filesDir, relPath);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    copied++;
  }
}

// Write manifest
const manifest = {
  timestamp: new Date().toISOString(),
  command,
  vaultPath,
  fileCount: copied,
  operations: [],  // Populated by godmode/adapt during execution
  snapshotDir,
};
fs.writeFileSync(path.join(snapshotDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(JSON.stringify({
  status: 'ok',
  snapshotDir,
  filesCopied: copied,
  timestamp,
}));
