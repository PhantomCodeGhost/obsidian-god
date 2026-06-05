# obsidian-god

> The God Mode skill for Obsidian vaults. Full vault analysis, graph optimization, MOC generation, and automatic note normalization — powered by Claude Code, Gemini CLI, and any Agent Skills-compatible agent.

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-green)](https://docs.anthropic.com/claude-code)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-compatible-blue)](https://github.com/google-gemini/gemini-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What It Does

`obsidian-god` is an [Agent Skills](https://agentskills.io/specification)-compatible skill that turns your AI coding agent into a master Obsidian vault architect.

Two power commands:

| Command | What It Does |
|---------|-------------|
| `/godmode` | Full vault audit → orphan detection → duplicate finding → health score → restructure plan |
| `/adapt` | Scans new/changed files → normalizes frontmatter → injects MOC links → integrates into graph |

It also embeds the full knowledge base for:
- **Graph architecture** — MOC design, hub-and-spoke patterns, cross-domain bridges
- **Obsidian Markdown** — wikilinks, callouts, embeds, frontmatter, properties
- **Obsidian Bases** — `.base` file views, filters, formulas
- **JSON Canvas** — `.canvas` mind maps and visual diagrams
- **Obsidian CLI** — bulk vault operations from the command line

---

## Installation

### Claude Code (recommended)
```bash
npx skills add https://github.com/PhantomCodeGhost/obsidian-god
```

### Gemini CLI
```bash
npx skills add https://github.com/PhantomCodeGhost/obsidian-god
```

### Codex CLI
```bash
# Copy skills/ directory into your Codex skills path
cp -r skills/ ~/.codex/skills/obsidian-god/
```

### OpenCode
```bash
git clone https://github.com/PhantomCodeGhost/obsidian-god.git ~/.opencode/skills/obsidian-god
```

### Manual (any agent with file access)
Clone the repo and add the `skills/` folder to your agent's skills path or `.claude/` folder in your vault root.

### Also install the kepano sub-skills (recommended)
```bash
# Full obsidian format reference bundle
npx skills add https://github.com/kepano/obsidian-skills

# Or just markdown
npx skills add https://github.com/kepano/obsidian-skills --skill obsidian-markdown
```

---

## Usage

Once installed, use natural language in your agent session:

```
/godmode
/godmode --domain Backend
/adapt
/adapt --path Backend/ --dry-run
/adapt --since 48
```

Or invoke the scripts directly from terminal:

```bash
# Audit vault and print health score + plan
node skills/obsidian-god/scripts/godmode.js /path/to/vault

# Scope to one domain
node skills/obsidian-god/scripts/godmode.js /path/to/vault --domain Hibernate

# Machine-readable JSON output (for agent parsing)
node skills/obsidian-god/scripts/godmode.js /path/to/vault --json

# Normalize recently changed files
node skills/obsidian-god/scripts/adapt.js /path/to/vault

# Dry run (see changes without writing)
node skills/obsidian-god/scripts/adapt.js /path/to/vault --dry-run

# Scan specific folder
node skills/obsidian-god/scripts/adapt.js /path/to/vault --path Backend/
```

---

## /godmode — Vault Audit

Running `/godmode` triggers a 5-phase workflow:

```
Phase 1: Inventory      — list all .md, .canvas, .base files
Phase 2: Analyze        — orphans, duplicates, missing frontmatter, link density
Phase 3: Plan           — structured change list (CREATE / RENAME / MERGE / ADD LINKS)
Phase 4: Execute        — apply changes (with your confirmation)
Phase 5: Report         — new health score, graph improvement metrics
```

### Health Score (0–100)

| Score | Status |
|-------|--------|
| 90–100 | 🔵 Knowledge graph mastery |
| 75–89  | 🟢 Healthy vault |
| 50–74  | 🟡 Decent, needs regular /adapt |
| < 50   | 🔴 Needs full /godmode |

Score is based on: avg links/note, frontmatter completeness, MOC coverage, orphan rate, duplicate rate.

---

## /adapt — Continuous Normalization

Running `/adapt` on new or changed files:

1. Detects recently modified `.md` files (default: last 24h)
2. Adds missing frontmatter (`tags`, `aliases`, `date`, `status`)
3. Injects `Part of [[MOC - Domain]]` link
4. Adds `## Related` section
5. Updates `.last-adapt` marker
6. Reports what changed

```bash
# Options
--dry-run         Show plan, write nothing
--path <folder>   Scope to specific folder
--since <hours>   Look back N hours (default: 24)
--force           Skip confirmation prompt
```

---

## Graph Architecture Philosophy

Every healthy vault has 3 layers:

```
Layer 1: MOC Notes         ← hub nodes (5+ connections each)
Layer 2: Concept Notes     ← atomic (1 idea), links to MOC + 2–3 peers
Layer 3: Canvas / Bases    ← visual maps + dashboards, embedded in Layer 2
```

**Connection rules per note:**
1. `[[MOC link]]` — which map owns this?
2. `[[prerequisite]]` — what to know first?
3. `[[peer concept]]` — same level, related idea
4. `[[application]]` — where is this used in practice?

---

## File Structure

```
obsidian-god/
├── agentskills.json                    ← Agent Skills spec manifest
├── package.json
├── LICENSE
├── README.md
└── skills/
    └── obsidian-god/
        ├── SKILL.md                    ← Main skill (agent reads this)
        ├── scripts/
        │   ├── godmode.js              ← /godmode CLI script
        │   └── adapt.js               ← /adapt CLI script
        └── references/
            ├── VAULT_ANALYSIS.md       ← Full audit checklist + health scoring
            ├── NOTE_TEMPLATES.md       ← 6 note type templates
            ├── GRAPH_PATTERNS.md       ← Graph design patterns + anti-patterns
            └── BACKEND_DOMAIN.md       ← Backend/Java/Hibernate vault plan
```

---

## Obsidian Format Support

| Format | Extension | Handled By |
|--------|-----------|-----------|
| Notes | `.md` | obsidian-god + `obsidian-markdown` sub-skill |
| Bases | `.base` | `obsidian-bases` sub-skill (kepano) |
| Canvas | `.canvas` | `json-canvas` sub-skill (kepano) |
| CLI ops | — | `obsidian-cli` sub-skill (kepano) |

This skill coordinates all four formats. The kepano sub-skills provide deep format references.

---

## Note Naming Convention

```
MOC Notes:      MOC - Domain.md           (e.g. MOC - Backend.md)
Concept Notes:  Domain - Topic.md         (e.g. Backend - REST API Fundamentals.md)
Canvas Files:   Canvas - MOC - Domain.canvas
Base Files:     Domain Dashboard.base
Interview:      Interview - Topic.md
```

---

## Frontmatter Standard

Every note should have:
```yaml
---
title: Domain - Concept Name
tags:
  - domain-tag
  - topic-tag
aliases:
  - Alternative Search Term
date: YYYY-MM-DD
status: seed        # seed | growing | evergreen
---
```

---

## Requirements

- Node.js ≥ 18 (for CLI scripts)
- Obsidian ≥ 1.4.0 (for Bases and CLI features)
- An Agent Skills-compatible agent (Claude Code, Gemini CLI, Codex CLI, or OpenCode)

---

## Contributing

PRs welcome. Focus areas:
- New domain reference files (e.g. `FRONTEND_DOMAIN.md`, `DEVOPS_DOMAIN.md`)
- Additional note templates
- Graph pattern documentation
- Script improvements

---

## Credits

- Sub-skill format references: [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)
- Agent Skills specification: [agentskills.io](https://agentskills.io/specification)
- Built for: [PhantomCodeGhost](https://github.com/PhantomCodeGhost)

---

## License

MIT — see [LICENSE](LICENSE)
