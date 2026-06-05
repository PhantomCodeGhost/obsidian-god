#!/usr/bin/env node
/**
 * rollback.js — Restore vault from the most recent (or specified) snapshot
 *
 * Usage:
 *   node rollback.js <vault-path>                    ← rollback latest
 *   node rollback.js <vault-path> --snapshot <dir>   ← rollback specific
 *   node rollback.js <vault-path> --list             ← list available snapshots
 *   node rollback.js <vault-path> --dry-run          ← preview only
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const vaultPath = args[0];

if (!vaultPath) {
  console.error('Usage: node rollback.js <vault-path> [--snapshot <dir>] [--list] [--dry-run]');
  process.exit(1);
}

const snapshotsBase = path.join(vaultPath, '.obsidian-god', 'snapshots');
const isDryRun = args.includes('--dry-run');
const isList = args.includes('--list');

if (!fs.existsSync(snapshotsBase)) {
  console.error('No snapshots found. Nothing to rollback.');
  process.exit(1);
}

const snapshots = fs.readdirSync(snapshotsBase)
  .filter(d => fs.statSync(path.join(snapshotsBase, d)).isDirectory())
  .sort()
  .reverse();

if (isList) {
  console.log('Available snapshots:');
  for (const s of snapshots) {
    const manifest = JSON.parse(fs.readFileSync(path.join(snapshotsBase, s, 'manifest.json'), 'utf8'));
    console.log(`  ${s}  command=${manifest.command}  files=${manifest.fileCount}`);
  }
  process.exit(0);
}

// Find target snapshot
const snapshotIdx = args.indexOf('--snapshot');
const targetSnapshot = snapshotIdx > -1 ? args[snapshotIdx + 1] : snapshots[0];

if (!targetSnapshot) {
  console.error('No snapshot found to rollback.');
  process.exit(1);
}

const snapshotDir = path.join(snapshotsBase, targetSnapshot);
const filesDir = path.join(snapshotDir, 'files');
const manifest = JSON.parse(fs.readFileSync(path.join(snapshotDir, 'manifest.json'), 'utf8'));

console.log(`\nRollback target: ${targetSnapshot}`);
console.log(`Command that created it: ${manifest.command}`);
console.log(`Files in snapshot: ${manifest.fileCount}`);
if (isDryRun) console.log('\n[DRY RUN — no files written]\n');

// Restore all files from snapshot
function restoreDir(dir, baseDir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      restoreDir(fullPath, baseDir);
    } else {
      const relPath = path.relative(baseDir, fullPath);
      const dest = path.join(vaultPath, relPath);
      console.log(`  RESTORE  ${relPath}`);
      if (!isDryRun) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(fullPath, dest);
      }
    }
  }
}

if (fs.existsSync(filesDir)) {
  restoreDir(filesDir, filesDir);
}

// Reverse CREATE operations — delete files that were created after snapshot
for (const op of (manifest.operations || []).reverse()) {
  if (op.op === 'CREATE') {
    const target = path.join(vaultPath, op.path);
    console.log(`  DELETE (was created)  ${op.path}`);
    if (!isDryRun && fs.existsSync(target)) fs.unlinkSync(target);
  }
}

if (!isDryRun) {
  console.log(`\n✅ Rollback complete. Vault restored to state before ${manifest.command}`);
} else {
  console.log('\n[DRY RUN complete — use without --dry-run to apply]');
}
