# obsidian-god

> The God Mode skill for Obsidian vaults. Full vault analysis, graph optimization, MOC generation, and automatic note normalization — powered by Claude Code, Gemini CLI, and any Agent Skills-compatible agent.

[![skills.sh](https://skills.sh/b/PhantomCodeGhost/obsidian-god)](https://skills.sh/PhantomCodeGhost/obsidian-god)
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

### Also install the kepano sub-skills (recommended)
```bash
npx skills add https://github.com/kepano/obsidian-skills
```

---

## Usage

Trigger in any supported agent:

| Phrase | Action |
|--------|--------|
| `/godmode` | Full vault audit + restructure plan |
| `/godmode --domain Backend` | Scope to one domain |
| `/adapt` | Normalize new/changed files |
| `/adapt --dry-run` | Preview changes, write nothing |
| `/adapt --path Backend/` | Scope to one folder |
| `/adapt --since 48` | Look back 48 hours |

Or invoke scripts directly:

```bash
# Audit vault
node skills/obsidian-god/scripts/godmode.js /path/to/vault

# JSON output for agent parsing
node skills/obsidian-god/scripts/godmode.js /path/to/vault --json

# Normalize recently changed files
node skills/obsidian-god/scripts/adapt.js /path/to/vault --dry-run
```

---

## /godmode — Vault Audit

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

---

## /adapt — Continuous Normalization

1. Detects recently modified `.md` files (default: last 24h)
2. Adds missing frontmatter (`tags`, `aliases`, `date`, `status`)
3. Injects `Part of [[MOC - Domain]]` link
4. Adds `## Related` section
5. Updates `.last-adapt` marker
6. Reports what changed

---

## Graph Architecture

Every healthy vault has 3 layers:

```
Layer 1: MOC Notes         ← hub nodes (5+ connections each)
Layer 2: Concept Notes     ← atomic (1 idea), links to MOC + 2–3 peers
Layer 3: Canvas / Bases    ← visual maps + dashboards, embedded in Layer 2
```

Connection rules per note:
1. `[[MOC link]]` — which map owns this?
2. `[[prerequisite]]` — what to know first?
3. `[[peer concept]]` — same level, related idea
4. `[[application]]` — where is this used in practice?

---

## File Structure

```
obsidian-god/
├── agentskills.json
├── package.json
├── LICENSE
├── README.md
└── skills/
    └── obsidian-god/
        ├── SKILL.md
        ├── scripts/
        │   ├── godmode.js
        │   └── adapt.js
        └── references/
            ├── VAULT_ANALYSIS.md
            ├── NOTE_TEMPLATES.md
            ├── GRAPH_PATTERNS.md
            └── BACKEND_DOMAIN.md
```

---

## Obsidian Format Support

| Format | Extension | Handled By |
|--------|-----------|------------|
| Notes | `.md` | obsidian-god + `obsidian-markdown` sub-skill |
| Bases | `.base` | `obsidian-bases` sub-skill (kepano) |
| Canvas | `.canvas` | `json-canvas` sub-skill (kepano) |
| CLI ops | — | `obsidian-cli` sub-skill (kepano) |

---

## Supported Agents

| Agent | Status |
|-------|--------|
| Claude Code | ✅ |
| Gemini CLI | ✅ |
| Codex (OpenAI) | ✅ |
| OpenCode | ✅ |
| Cursor | ✅ |
| Windsurf | ✅ |
| Any bash-capable agent | ✅ |

---

## Requirements

- Node.js ≥ 18
- Obsidian ≥ 1.4.0
- An Agent Skills-compatible agent

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

---

## License

MIT — see [LICENSE](LICENSE)
