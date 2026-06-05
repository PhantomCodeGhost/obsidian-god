# Vault Analysis Reference

Full audit checklist for `/godmode`. Run top-to-bottom. Score at end.

---

## 1. Orphan Detection

Orphan = 0 outgoing `[[links]]` AND 0 backlinks.

```bash
# CLI
obsidian backlinks file="Note Name"
obsidian search query="[[" limit=500   # notes with outgoing links

# Manual: Graph View → filter → show orphans (disconnected dots)
```

Priority orphans: rich content, no connections = wasted knowledge.

**Fix options:**
- Add MOC link: `Part of [[MOC - Domain]]`
- Add to existing MOC's concept list
- Merge into related note if content overlaps

---

## 2. Duplicate Detection

Signals:
- Same concept, different names: `REST API Fundamentals` vs `RESTful API Basics`
- Prefix variants: `Backend - HTTP` vs `HTTP Basics` vs `HTTP Notes`
- Near-identical content body

**Resolution matrix:**

| Situation | Action |
|-----------|--------|
| One note richer | Keep richer, add other's name as `alias`, delete |
| Both have unique content | Merge → one file, delete second |
| One is stub (<50 words) | Merge stub into main, delete stub |
| Different angles same topic | Keep both, add `[[See also: X]]` links |

---

## 3. Frontmatter Audit

Minimum required:
```yaml
---
tags:
  - domain-tag
aliases:
  - Alternative Name
date: YYYY-MM-DD
status: seed
---
```

Missing frontmatter = Bases dashboards won't work. Fix with:
```bash
obsidian property:set name="status" value="seed" file="Note Name"
```

---

## 4. Link Density Audit

Per note:
- Outgoing `[[links]]` — count manually or grep
- Incoming backlinks:
```bash
obsidian backlinks file="Backend - REST API Fundamentals"
```

Target: ≥2 outgoing, ≥1 incoming per note.

Notes with 0 outgoing → add:
1. `Part of [[MOC - Domain]]`
2. `Requires [[Prerequisite Topic]]`
3. `See also [[Related Concept]]`

---

## 5. MOC Coverage Audit

For each domain:
- [ ] `MOC - Domain.md` exists
- [ ] Every domain note links to MOC
- [ ] MOC links back to every major note
- [ ] MOC has narrative (not just link list)
- [ ] MOC links to ≥1 other MOC (cross-domain bridge)

---

## 6. Naming Convention Audit

Violations to fix:
- Mixed case: `REST api` → `REST API`
- No prefix: `caching.md` → `Backend - Redis Caching.md`
- Vague: `notes.md`, `temp.md`, `draft.md`, `untitled.md` → rename or delete
- Spaces in canvas/base files: use hyphens

**Rename rule:** filename = exact phrase you'd type in a wikilink.

---

## 7. Content Quality Flags

| Flag | Signal | Fix |
|------|--------|-----|
| Too long | >1000 words, multiple unrelated H2s | Split into atomic notes |
| Stub | <50 words, no links | Expand or merge |
| List-only | Only bullets, no prose | Add synthesis paragraph |
| No headings | Wall of text >200 words | Add H2/H3 structure |
| Copy-paste dump | Verbatim from external source | Rewrite in own words + `> [!quote]` for verbatim |

---

## 8. Wikilink Health

```bash
# Find broken links (unresolved) — show in graph as disconnected dots
# Filter graph: Settings → Graph View → show unresolved links
```

Common breaks:
```markdown
[[Note That Doesn't Exist]]           → broken (red in Obsidian)
[[note name]]                          → case mismatch
[[Very Long Title Without Alias]]      → fix: [[Very Long Title|Short Name]]
```

---

## Vault Health Score (0–100)

| Metric | Max | Score Formula |
|--------|-----|---------------|
| Avg links/note ≥ 3 | 25 | min(actual/3, 1) × 25 |
| All notes have frontmatter | 20 | (% with FM) × 20 |
| All domains have MOC | 20 | (domains with MOC / total domains) × 20 |
| No orphans | 20 | (1 - orphan_ratio) × 20 |
| No duplicates | 15 | (1 - duplicate_ratio) × 15 |
| **Total** | **100** | |

| Score | Status |
|-------|--------|
| <50 | 🔴 Needs full `/godmode` |
| 50–74 | 🟡 Decent, run `/adapt` regularly |
| 75–89 | 🟢 Healthy vault |
| 90+ | 🔵 Knowledge graph mastery |
