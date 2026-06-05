# Graph Patterns

Visual patterns for healthy Obsidian graph architecture.

---

## Pattern 1: Hub-and-Spoke (MOC Pattern)

Best for: domain organization, learning vaults

```
         [MOC - Backend]
        /       |        \
[REST API]  [HTTP]   [Caching]
    |           |         |
[Auth/JWT]  [HTTPS]  [Redis]
```

Rules:
- MOC = hub node (5+ connections)
- Concept notes = spoke nodes (link to MOC + 2–3 peers)
- No concept note should be more than 2 hops from a MOC

---

## Pattern 2: Bridge Pattern (Cross-Domain)

Best for: connecting related domains

```
[MOC - Java] ──────── [MOC - Hibernate]
      |                      |
[Java Collections]    [Hibernate Entities]
      |    \          /      |
      |    [Java Generics]   |
      |                      |
      └──── [MOC - Backend] ─┘
```

Rules:
- Every MOC links to ≥1 other MOC
- Shared concept notes bridge domains (e.g., Java Collections lives in both Java and Backend graphs)
- Bridge nodes are high-value: add them intentionally

---

## Pattern 3: Concept Chain (Learning Path)

Best for: prerequisite sequences

```
[Client-Server Architecture]
         ↓
    [HTTP & HTTPS]
         ↓
[REST API Fundamentals]
         ↓
  [Authentication & JWT]
         ↓
   [API Lifecycle]
```

Rules:
- Use `[[Prerequisite]]` links for forward direction
- Use `[[Application]]` links for backward tracing
- Include the chain order in the MOC's Learning Path section

---

## Pattern 4: Cluster-Mesh (Peer Linking)

Best for: tightly related subtopics

```
[Hibernate Entities] ←→ [Hibernate Relationships]
         ↑                        ↑
         ↓                        ↓
[Hibernate Architecture] ←→ [Hibernate Cascade Types]
         ↑                        ↑
         ↓                        ↓
[ORM vs JDBC]         ←→ [Lazy vs Eager Loading]
```

Rules:
- Every note links to ≥2 peers in its cluster
- All cluster notes link to their MOC
- MOC links to all cluster notes

---

## Anti-Patterns (Avoid)

### ❌ The Orphan Island
```
[Note A] ──── [Note B]      [Note C]   ← no connections
```
Fix: add MOC link + peer links to Note C.

### ❌ The Star Trap
```
         [MEGA INDEX NOTE]
        /  |  |  |  |  \
      [A] [B][C][D][E][F][G][H][I]...
```
Fix: split mega-index into domain MOCs.

### ❌ The Linear Chain
```
[A] → [B] → [C] → [D] → [E]
```
Fix: add lateral links between non-adjacent nodes.

### ❌ The Dead End
```
[MOC - Topic] → [Note A] → [Note B] →  (nothing)
```
Fix: add backlinks from B → A → MOC, plus lateral links.

---

## Graph View Settings (Obsidian)

Recommended filter config for a clean, readable graph:

```json
{
  "colorGroups": [
    { "query": "tag:#moc", "color": { "a": 1, "rgb": 14701138 } },
    { "query": "tag:#backend", "color": { "a": 1, "rgb": 3394764 } },
    { "query": "tag:#java", "color": { "a": 1, "rgb": 16741120 } },
    { "query": "tag:#hibernate", "color": { "a": 1, "rgb": 8388736 } },
    { "query": "tag:#interview", "color": { "a": 1, "rgb": 16711680 } }
  ],
  "showTags": false,
  "showAttachments": false,
  "hideUnresolved": false,
  "showOrphans": true
}
```

**Force graph tip:** Increase "repel force" to spread nodes. Increase "link force" to pull connected clusters together. MOC nodes will naturally float to the center.

---

## Canvas Mind Map for MOC Visualization

Use a `.canvas` file alongside each MOC to create a visual version:

```json
{
  "nodes": [
    {
      "id": "moc001",
      "type": "file",
      "file": "00 - MOCs/MOC - Backend.md",
      "x": 0, "y": 0, "width": 300, "height": 200,
      "color": "4"
    },
    {
      "id": "rest001",
      "type": "file",
      "file": "Backend/Backend - REST API Fundamentals.md",
      "x": 400, "y": -150, "width": 280, "height": 180
    },
    {
      "id": "http001",
      "type": "file",
      "file": "Backend/Backend - HTTP & HTTPS.md",
      "x": 400, "y": 50, "width": 280, "height": 180
    },
    {
      "id": "auth001",
      "type": "file",
      "file": "Backend/Backend - Authentication & JWT.md",
      "x": 400, "y": 250, "width": 280, "height": 180
    }
  ],
  "edges": [
    { "id": "e1", "fromNode": "moc001", "toNode": "rest001", "toEnd": "arrow" },
    { "id": "e2", "fromNode": "moc001", "toNode": "http001", "toEnd": "arrow" },
    { "id": "e3", "fromNode": "moc001", "toNode": "auth001", "toEnd": "arrow" },
    { "id": "e4", "fromNode": "http001", "toNode": "rest001", "toEnd": "arrow", "label": "foundation for" }
  ]
}
```

Name it `Canvas - MOC - Backend.canvas` and embed in the MOC:
```markdown
![[Canvas - MOC - Backend.canvas]]
```
