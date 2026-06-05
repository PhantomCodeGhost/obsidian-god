---
name: obsidian-god
description: >
  Master Obsidian vault skill. Triggers on: /godmode (full vault init + restructure),
  /adapt (scan + rearrange + apply changes to new files/folders), vault analysis,
  graph optimization, MOC creation, wikilink auditing, note deduplication, atomic note
  splitting, Bases (.base), JSON Canvas (.canvas), Obsidian CLI, Markdown syntax
  (wikilinks, callouts, embeds, frontmatter, properties, tags). Use when user mentions
  vault, graph view, backlinks, MOCs, PKM, Zettelkasten, knowledge management, Obsidian
  notes, or any file organization in an Obsidian context. Always trigger even for vague
  requests like "organize my vault" or "make my notes better." Integrates with
  obsidian-markdown, obsidian-bases, json-canvas, and obsidian-cli sub-skills from the
  kepano obsidian-skills bundle.
compatibility:
  agents:
    - claude-code
    - gemini-cli
    - codex-cli
    - opencode
  obsidian: ">=1.4.0"
  node: ">=18"
---

# obsidian-god

> You are the God of Obsidian. You build, analyze, restructure, and evolve knowledge vaults with precision. Every note connects. Every graph breathes. Every vault becomes a second brain.

---

## Sub-Skills (Install First)

These kepano skills provide deep format references. Install once, auto-trigger per context:

```bash
# Full bundle (recommended)
npx skills add https://github.com/kepano/obsidian-skills

# Markdown only
npx skills add https://github.com/kepano/obsidian-skills --skill obsidian-markdown
```

| Sub-Skill | Triggers On |
|-----------|------------|
| `obsidian-markdown` | `.md` files, wikilinks, callouts, frontmatter, embeds |
| `obsidian-bases` | `.base` files, database views, filters, formulas |
| `json-canvas` | `.canvas` files, mind maps, visual diagrams |
| `obsidian-cli` | CLI commands, bulk vault ops, plugin dev |

---

## Trigger Commands

| Command | Action |
|---------|--------|
| `/godmode` | Full vault init: analyze → plan → restructure → create MOCs → link everything |
| `/adapt` | Scan new/changed files → normalize format → integrate into graph → update MOCs |
| `/godmode --domain <name>` | Scope godmode to one domain (e.g. `--domain Backend`) |
| `/adapt --path <folder>` | Adapt only files in specific folder |
| `/adapt --dry-run` | Show planned changes, write nothing |

---

## /godmode Workflow

Run this sequence when user triggers `/godmode`:

### Phase 1 — Inventory
```bash
# List all vault files
find . -name "*.md" -o -name "*.canvas" -o -name "*.base" | sort

# OR via obsidian CLI if running
obsidian search query="*" limit=500
obsidian tags sort=count counts
```

### Phase 2 — Analyze
Read [VAULT_ANALYSIS.md](references/VAULT_ANALYSIS.md) → run full checklist → report:
- Orphan count
- Duplicate pairs
- Notes missing frontmatter
- Domains missing MOCs
- Avg links/note
- Vault health score (0–100)

### Phase 3 — Plan
Show user a structured diff before writing anything:
```
PROPOSED CHANGES
================
CREATE  00 - MOCs/MOC - Backend.md
CREATE  00 - MOCs/MOC - Java.md
RENAME  Backend - Java Collections.md → Java/Java - Collections.md
MERGE   Hibernate - What is ORM.md → keep, add alias to Hibernate - ORM vs JDBC.md
ADD LINKS  Backend - REST API Fundamentals.md → [[HTTP & HTTPS]], [[Stateless vs Stateful]]
DELETE  untitled.md (empty stub)
```

Wait for confirmation unless `--force` flag passed.

### Phase 4 — Execute
Apply changes in order: create MOCs → rename/move → merge duplicates → add frontmatter → add wikilinks → verify graph.

### Phase 5 — Report
```
GODMODE COMPLETE
================
✅ Created: 4 MOC files
✅ Renamed: 3 notes
✅ Merged: 1 duplicate pair  
✅ Added frontmatter: 8 notes
✅ Added 23 wikilinks across 11 notes
✅ New vault health score: 82/100 (was 41/100)

Graph improvement: +31 edges, +4 hub nodes
Run 'obsidian dev:screenshot' to see updated graph.
```

---

## /adapt Workflow

Run when user adds new files or triggers `/adapt`:

### Step 1 — Detect New/Changed Files
```bash
# Find files modified in last 24h
find . -name "*.md" -newer .last-adapt -not -path "./.obsidian/*" | sort

# OR check git diff
git diff --name-only HEAD
git status --short
```

### Step 2 — Normalize Each File
For every new/changed file, apply **Format Normalization** (see below).

### Step 3 — Integrate into Graph
- Find which MOC(s) this note belongs to
- Add `[[MOC - Domain]]` link inside note
- Add note link inside MOC under correct section
- Find 2+ existing notes to cross-link

### Step 4 — Update .last-adapt Marker
```bash
touch .last-adapt
```

### Step 5 — Report
```
ADAPT COMPLETE
==============
Scanned: 3 new files
Normalized: 3 (frontmatter added, titles fixed)
Integrated: 3 → MOC - Backend (2), MOC - Java (1)
New links added: 7
```

---

## Format Normalization

Apply to every note during `/adapt`:

```markdown
# Required structure — every .md file

---
title: Domain - Concept Name        ← matches filename
tags:
  - domain-tag
  - topic-tag
aliases:
  - Alternative Search Term
date: YYYY-MM-DD
status: seed                        ← seed | growing | evergreen
---

# Concept Name

> One-liner definition.

Part of [[MOC - Domain]]

## [Content sections]

## Related
- [[Related Concept A]]
- [[Related Concept B]]
- [[MOC - Domain]]
```

**Naming convention (enforce strictly):**
- Concept notes: `Domain - Topic.md` (e.g. `Backend - REST API Fundamentals.md`)
- MOC files: `MOC - Domain.md`
- Canvas files: `Domain - Topic Name.canvas`
- Base files: `Domain Dashboard.base`

---

## Graph Architecture Rules

Every vault should have 3 layers:

```
Layer 1: MOC Notes          ← hub nodes, high connectivity
Layer 2: Concept Notes      ← atomic, 1 idea each, links to MOC + peers
Layer 3: Canvas/Bases       ← visual/database views, embedded in Layer 2
```

### Connection Rules Per Note

```markdown
1. [[MOC link]]          — which map owns this note?
2. [[prerequisite]]      — what to know first?
3. [[peer concept]]      — same level, related idea
4. [[application]]       — where is this used in practice?
```

### Graph Health Targets

| Vault Size | Avg links/note | Hub notes |
|------------|---------------|-----------|
| <30 notes  | 2–3 | 20% |
| 30–100     | 3–5 | 15% |
| 100+       | 4–7 | 10% |

### Graph Troubleshooting

| Symptom | Fix |
|---------|-----|
| Isolated clusters | Add cross-domain links between MOCs |
| Star topology (one mega-hub) | Split into multiple MOCs |
| Long chains | Add lateral peer links |
| Empty graph | Run `/adapt` on all files |
| Hairball | Add MOC hierarchy layer |

---

## MOC Template

```markdown
---
title: MOC - {{Topic}}
tags:
  - moc
  - {{domain}}
aliases:
  - {{Topic}} Index
  - {{Topic}} Map
date: {{YYYY-MM-DD}}
status: evergreen
---

# MOC — {{Topic}}

> {{One-sentence synthesis of this domain.}}

## Core Concepts
- [[{{Domain}} - {{Concept A}}]] — {{one-line desc}}
- [[{{Domain}} - {{Concept B}}]] — {{one-line desc}}
- [[{{Domain}} - {{Concept C}}]] — {{one-line desc}}

## How They Connect
{{2–4 sentences: narrative relationships between concepts.}}

## Subtopics
- [[MOC - {{Subtopic}}]]

## Learning Path
1. [[{{Start here}}]]
2. [[{{Then this}}]]
3. [[{{Then this}}]]

## Key Questions
- {{Q1}}?
- {{Q2}}?

## Related Domains
- [[MOC - {{Related}}]]

## Interview Prep
- [[MOC - Interview Prep]]
```

---

## Obsidian Format Specs

### Wikilinks (defer to `obsidian-markdown` sub-skill for full syntax)
```markdown
[[Note Name]]                  → basic link
[[Note Name|Display Text]]     → aliased link  
[[Note Name#Heading]]          → deep link
![[Note Name]]                 → embed
![[image.png|400]]             → sized embed
[[#Local Heading]]             → same-note link
```

### Frontmatter Properties
```yaml
---
title: string
tags: [list]
aliases: [list]
date: YYYY-MM-DD
status: seed | growing | evergreen
cssclasses: [list]             # optional styling
---
```

### Callouts (key types)
```markdown
> [!note] Title
> [!tip]- Collapsible tip
> [!warning] Warning
> [!info] Info
> [!example] Example
> [!quote] Quote
> [!abstract] Summary / TL;DR
> [!todo] Task
> [!question]+ Expanded FAQ
```

### Bases (`.base`) — defer to `obsidian-bases` sub-skill
```yaml
filters:
  and:
    - file.hasTag("backend")
views:
  - type: table
    name: "All Backend Notes"
    order:
      - file.name
      - status
      - file.mtime
```

### JSON Canvas (`.canvas`) — defer to `json-canvas` sub-skill
```json
{
  "nodes": [
    {"id": "abc123", "type": "file", "file": "Backend - REST API Fundamentals.md",
     "x": 0, "y": 0, "width": 400, "height": 300}
  ],
  "edges": [
    {"id": "edge1", "fromNode": "abc123", "toNode": "def456", "label": "uses"}
  ]
}
```

### CLI Commands — defer to `obsidian-cli` sub-skill
```bash
obsidian read file="Note Name"
obsidian create name="New Note" content="# Hello" silent
obsidian append file="Note" content="- [[New Link]]"
obsidian backlinks file="Backend - REST API Fundamentals"
obsidian search query="[[" limit=500
obsidian tags sort=count counts
obsidian property:set name="status" value="growing" file="Note Name"
```

---

## Smart Restructure Rules

Apply in this order during `/godmode`:

1. **Deduplicate** — same concept, two files → merge, add alias, delete duplicate
2. **Atomize** — one file covering 3+ unrelated concepts → split into atomic notes
3. **Rename** — enforce `Domain - Topic.md` convention, sentence-case
4. **Frontmatter** — add missing `tags`, `aliases`, `date`, `status`
5. **MOC creation** — 3+ notes share a topic with no MOC → create `MOC - Topic.md`
6. **Link injection** — every note gets ≥1 MOC link + ≥2 peer links

---

## Reference Files

| File | When to Read |
|------|-------------|
| [VAULT_ANALYSIS.md](references/VAULT_ANALYSIS.md) | Full audit checklist, health scoring |
| [NOTE_TEMPLATES.md](references/NOTE_TEMPLATES.md) | All note type templates |
| [GRAPH_PATTERNS.md](references/GRAPH_PATTERNS.md) | Graph design patterns, examples |
| [BACKEND_DOMAIN.md](references/BACKEND_DOMAIN.md) | Backend/Java/Hibernate vault plan |

---

## Agent Compatibility

This skill follows the [Agent Skills specification](https://agentskills.io/specification).

**Claude Code:** Works natively. `/godmode` and `/adapt` trigger full bash workflows.  
**Gemini CLI:** All bash commands + file ops work. Use `gemini -p` for multi-step analysis.  
**Codex CLI:** Copy `skills/` into your Codex skills path.  
**OpenCode:** Clone full repo into `~/.opencode/skills/obsidian-god/`.

```bash
# Install for Claude Code
npx skills add https://github.com/PhantomCodeGhost/obsidian-god

# Install specific skill only
npx skills add https://github.com/PhantomCodeGhost/obsidian-god --skill obsidian-god
```
