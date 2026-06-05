# obsidian-god

> The ultimate God-Mode Obsidian PKM skill for AI agents.
> Full vault audit, graph optimization, MOC generation, rollback safety, and complete Obsidian formatting knowledge — in one skill.

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-green)](https://docs.anthropic.com/claude-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## What It Does

`obsidian-god` turns your AI coding agent into a master Obsidian vault architect — one that **respects your existing structure**, never deletes your data, and always asks before making big changes.

### Commands

| Command | What It Does |
|---------|-------------|
| `/godmode` | Full vault audit → orphan detection → health score → structured change plan (requires your approval before executing) |
| `/godmode --domain Backend` | Scope audit to one domain |
| `/adapt` | Normalize recently changed files — add missing frontmatter, inject MOC links, append to hub notes |
| `/adapt --dry-run` | Preview changes, write nothing |
| `/adapt --since 48` | Look back 48 hours |
| `/rollback` | Restore vault from pre-change snapshot |
| `/rollback --list` | List available snapshots |
| `/rollback --dry-run` | Preview what would be restored |
| `/mocsync` | Create missing MOCs, append new hub note links to existing MOCs |
| `/format` | Apply full Obsidian formatting to a file or folder |

---

## Core Philosophy

> **The vault belongs to the user. Structure built over time is intentional.**

- **Append, not overwrite** — existing notes are patched minimally (missing fields only)
- **Suggest, not restructure** — `/godmode` produces a plan for your approval, never auto-applies
- **Never delete** — orphans and duplicates are archived or proposed for removal, never silently deleted
- **Rollback always available** — every operation snapshots first so you can undo anything
- **New concepts append** — a new note in `Backend/Spring Boot/` gets linked into `Spring Boot.md` automatically

---

## Installation

### Claude Code (recommended)
```bash
npx skills add PhantomCodeGhost/obsidian-god
```

### Gemini CLI
```bash
npx skills add PhantomCodeGhost/obsidian-god -a gemini-cli
```

### All agents (global)
```bash
npx skills add PhantomCodeGhost/obsidian-god -g
```

### Manual
Copy `skills/obsidian-god/` into your agent's skills directory:
- Claude Code: `.claude/skills/`
- Codex CLI: `~/.codex/skills/`
- OpenCode: `~/.opencode/skills/`

---

## Usage Examples

```
# Full vault audit — see health score + issue list
/godmode

# Normalize files you edited today
/adapt

# Preview what /adapt would change without touching anything
/adapt --dry-run

# Something went wrong — undo everything
/rollback

# See what snapshots are available
/rollback --list

# Regenerate MOC files
/mocsync

# Apply Obsidian formatting to a specific file
/format Backend/Spring Boot/Spring Boot.md
```

---

## Vault Architecture (enforced)

```
📁 00 Inbox
📁 01 Knowledge
│   ├── Backend/
│   │   └── Spring Boot/
│   │       ├── Spring Boot.md        ← hub note
│   │       ├── Dependency Injection.md
│   │       └── Bean Lifecycle.md
│   ├── Frontend/
│   ├── Programming/
│   ├── DSA/
│   ├── Databases/
│   ├── DevOps/
│   ├── System Design/
│   ├── AI/
│   └── Computer Science/
📁 02 Resources
📁 03 Archive
📁 Meta/
    ├── Attachments/
    ├── MOCs/                         ← one MOC per domain
    │   ├── MOC - Backend.md
    │   ├── MOC - Frontend.md
    │   └── ...
    ├── Templates/
    └── System/
```

### Graph Shape
```
MOC (1 per root domain)
 ↓
Hub Notes (1 per topic folder)
 ↓
Concept Notes (major subtopics)
 ↓
Related Concepts (cross-domain bridges)
```

---

## Rollback System

Every destructive operation creates a snapshot first:

```
.obsidian-god/
└── snapshots/
    └── 2026-06-05T14-30-00/
        ├── manifest.json    ← operation log
        └── files/           ← full copies of modified files
```

Snapshots are never deleted automatically. Run `/rollback --list` to see all available restore points.

---

## Built-in Obsidian Knowledge

This skill includes a complete Obsidian Flavored Markdown reference — no sub-skills needed:

- **Properties & frontmatter** — all field types, tag taxonomy, required fields
- **Wikilinks & embeds** — `[[links]]`, `![[embeds]]`, block IDs, section links
- **Callouts** — all 13 callout types, foldable syntax, developer patterns
- **Tags** — frontmatter vs inline, tag taxonomy for developer vaults
- **Mermaid** — flowcharts, sequence diagrams, class diagrams, ER diagrams, state machines
- **Canvas** — `.canvas` JSON format for visual mind maps
- **Bases** — `.base` format for dashboard views over vault notes
- **Code blocks** — language-tagged blocks for Java, SQL, YAML, bash, JSON, etc.

---

## File Structure

```
obsidian-god/
├── README.md
├── LICENSE
└── skills/
    └── obsidian-god/
        ├── SKILL.md                        ← main skill (load this)
        ├── scripts/
        │   ├── godmode.js                  ← vault audit
        │   ├── adapt.js                    ← normalize files
        │   ├── mocsync.js                  ← regenerate MOCs
        │   ├── snapshot.js                 ← create rollback snapshot
        │   └── rollback.js                 ← restore from snapshot
        └── references/
            ├── OFM_FORMATTING.md           ← complete Obsidian formatting reference
            ├── GRAPH_PATTERNS.md           ← graph quality rules + anti-patterns
            └── NOTE_TEMPLATES.md           ← hub, concept, MOC, resource templates
```

---

## Health Score

| Score | Status |
|-------|--------|
| 90–100 | 🔵 Knowledge graph mastery |
| 75–89 | 🟢 Healthy vault |
| 50–74 | 🟡 Decent, run `/adapt` regularly |
| < 50 | 🔴 Needs full `/godmode` |

---

## Requirements

- Node.js ≥ 18
- An Agent Skills-compatible agent (Claude Code, Gemini CLI, Codex, OpenCode, Cursor, Windsurf)

---

## Contributing

PRs welcome. Focus areas:
- New domain reference files (`FRONTEND_DOMAIN.md`, `DEVOPS_DOMAIN.md`)
- Additional note templates
- Script improvements

---

## License

MIT — see [LICENSE](./LICENSE)
