# GRAPH_PATTERNS.md — Graph Quality & Link Architecture

Reference for maintaining a healthy, meaningful Obsidian graph.

---

## Target Graph Shape

```
Global MOC (1 per domain)
    ↓ links to
Topic Hub Notes (1 per topic folder)
    ↓ links to
Major Concept Notes (key subtopics)
    ↓ links to / cross-links with
Related Concepts (same or cross-domain)
```

Every note has a role. Notes without a role become orphans.

---

## Link Semantics

Every `[[link]]` should answer one of:

| Relationship | Example |
|---|---|
| **depends on** | `Spring Boot` depends on `[[Java]]` |
| **implements** | `JwtFilter` implements `[[Authentication]]` |
| **extends** | `@RestController` extends `[[Controller]]` |
| **compares with** | `[[REST API]]` vs `[[GraphQL]]` |
| **relates to** | `[[Docker]]` relates to `[[DevOps]]` |
| **part of** | `Streams API` part of `[[Java]]` |
| **uses** | `Spring Boot` uses `[[JPA & Hibernate]]` |

Bad link: dumping 20 `[[links]]` in a "See Also" section with no context.
Good link: `Spring's [[IoC Container]] manages the [[Bean Lifecycle]] automatically.`

---

## MOC Layer Rules

- MOCs link **only to hub notes** — never to leaf concept notes
- MOCs should have 5–20 links (more → create sub-MOC)
- Every hub note MUST have `Part of [[MOC - Domain]]`
- MOCs are the graph's entry points — keep them clean

### Sub-MOC Pattern (when MOC > 20 links)
```
MOC - Backend.md
    ↓
MOC - Backend - Spring.md   ← sub-MOC for Spring ecosystem
MOC - Backend - APIs.md     ← sub-MOC for API design
```

---

## Hub Note Layer Rules

- Hub = one per technology/major topic
- Hub links to: parent MOC + all major concept notes in its folder
- Hub receives links from: MOC, other hubs that depend on it
- Hub note name = folder name (e.g. `Spring Boot/Spring Boot.md`)

---

## Concept Note Layer Rules

- One major concept per note
- Links up to its hub note
- Links sideways to 2–4 peer concepts (same level)
- Links down only if it has a truly complex subtopic (rare)

---

## Cross-Domain Bridges (valuable for graph health)

Good cross-domain links:
- `Spring Boot.md` → `[[Docker]]` (deployment context)
- `JPA & Hibernate.md` → `[[PostgreSQL Indexing]]` (performance)
- `JWT Authentication.md` → `[[HTTP Methods]]` (REST context)
- `React.md` → `[[REST API]]` (frontend calling backend)

These bridges make the graph meaningful. They show real understanding.

---

## Orphan Detection & Repair

**Orphan** = note with 0 inbound links.

Repair options (in priority order):
1. Link from hub note in the same folder
2. Link from MOC if it's a major topic
3. Link from a related concept note
4. Archive if the note is truly isolated and stale
5. Delete ONLY if empty AND user confirms

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Flat 200-note domain | No structure, unusable graph | Add topic subfolders + hub notes |
| 50-link MOC | MOC becomes a junk drawer | Split into sub-MOCs |
| Atomic notes for everything | Graph spaghetti, low signal | Merge small related concepts |
| Links without context | Graph looks connected but isn't meaningful | Add contextual sentences |
| Duplicate concept notes | Confuses links, splits graph | Merge into canonical note |
| Missing hub notes | Topic folder is dead end | Create hub note with links |

---

## Graph Health Metrics

Target scores per domain:
- **Orphan rate** < 10% of notes
- **Average connections** > 3 per note
- **Hub coverage** 100% (every folder has a hub)
- **MOC coverage** 100% (every domain has a MOC)
- **Cross-domain links** > 5 per 50 notes
