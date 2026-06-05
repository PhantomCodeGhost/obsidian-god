# Note Templates

Copy-paste templates for each note type. Fill `{{placeholders}}`.

---

## 1. Concept Note (atomic — one idea)

```markdown
---
title: {{Domain}} - {{Concept}}
tags:
  - {{domain}}
  - {{concept-tag}}
aliases:
  - {{Alternative Name}}
date: {{YYYY-MM-DD}}
status: seed
---

# {{Concept}}

> **One-liner:** {{What this is, in one sentence.}}

Part of [[MOC - {{Domain}}]]

## What It Is
{{2–3 paragraphs in your own words. No copy-paste.}}

## Why It Matters
{{When used? What problem solved?}}

## How It Works
{{Mechanism or steps.}}

## Key Points
- {{Point 1}}
- {{Point 2}}
- {{Point 3}}

## Code Example

```{{language}}
// Minimal, clear example
```

## Trade-offs

| Pros | Cons |
|------|------|
| {{advantage}} | {{limitation}} |

## Common Misconceptions
- ❌ "{{Wrong assumption}}" → ✅ {{Correct understanding}}

## Interview Angle
> {{How this shows up in interviews. 1–2 sentences.}}

## Related
- [[{{Prerequisite}}]] — needed before this
- [[{{Peer Concept}}]] — similar/complementary
- [[{{Application}}]] — where used in practice
- [[MOC - {{Domain}}]]
```

---

## 2. MOC Note

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

> {{One-sentence synthesis.}}

## Core Concepts
- [[{{Domain}} - {{Concept A}}]] — {{one-line desc}}
- [[{{Domain}} - {{Concept B}}]] — {{one-line desc}}

## How They Connect
{{2–4 sentences: narrative relationships.}}

## Subtopics
- [[MOC - {{Subtopic}}]]

## Learning Path
1. [[{{Start here}}]]
2. [[{{Then this}}]]

## Key Questions
- {{Q1}}?
- {{Q2}}?

## Related Domains
- [[MOC - {{Related}}]]

## Interview Prep
- [[MOC - Interview Prep]]
```

---

## 3. Comparison Note

```markdown
---
title: {{A}} vs {{B}}
tags:
  - {{domain}}
  - comparison
aliases:
  - Difference between {{A}} and {{B}}
date: {{YYYY-MM-DD}}
status: seed
---

# {{A}} vs {{B}}

Part of [[MOC - {{Domain}}]]

## Quick Answer
{{One sentence: when to choose A vs B.}}

## {{A}}
{{What it is.}}

## {{B}}
{{What it is.}}

## Comparison

| Aspect | {{A}} | {{B}} |
|--------|-------|-------|
| Use case | | |
| Performance | | |
| Complexity | | |
| Control | | |

## When to Use Each
- **{{A}} when:** {{condition}}
- **{{B}} when:** {{condition}}

## Related
- [[{{Concept A}}]]
- [[{{Concept B}}]]
- [[MOC - {{Domain}}]]
```

---

## 4. Process Note

```markdown
---
title: {{Domain}} - {{Process}}
tags:
  - {{domain}}
  - process
aliases:
  - How {{Process}} Works
date: {{YYYY-MM-DD}}
status: seed
---

# {{Process}}

> {{What this accomplishes.}}

Part of [[MOC - {{Domain}}]]

## Steps

### Step 1: {{Name}}
{{What happens and why.}}

### Step 2: {{Name}}
{{What happens and why.}}

## Diagram

```mermaid
graph LR
  A[{{Step 1}}] --> B[{{Step 2}}] --> C[{{Step 3}}]
```

## Common Failure Points
- {{What breaks at step X}}

## Related
- [[{{Prerequisite}}]]
- [[MOC - {{Domain}}]]
```

---

## 5. Roadmap Note

```markdown
---
title: {{Domain}} - Roadmap
tags:
  - {{domain}}
  - roadmap
aliases:
  - {{Domain}} Learning Path
date: {{YYYY-MM-DD}}
status: evergreen
---

# {{Domain}} Roadmap

> {{Goal: what you can do after completing this path.}}

Part of [[MOC - {{Domain}}]]

## Phase 1: Foundations (Weeks 1–2)
- [ ] [[{{Note}}]] — {{what to learn}}
- [ ] [[{{Note}}]] — {{what to learn}}

## Phase 2: Core Skills (Weeks 3–5)
- [ ] [[{{Note}}]] — {{what to learn}}

## Phase 3: Advanced (Weeks 6–8)
- [ ] [[{{Note}}]] — {{what to learn}}

## Projects to Build
1. {{Project using Phase 1–2}}
2. {{Project using Phase 2–3}}

## Related
- [[MOC - {{Domain}}]]
- [[MOC - Interview Prep]]
```

---

## 6. Interview Prep Note

```markdown
---
title: Interview - {{Topic}}
tags:
  - interview
  - {{domain}}
aliases:
  - {{Topic}} Interview Questions
date: {{YYYY-MM-DD}}
status: growing
---

# Interview — {{Topic}}

Part of [[MOC - Interview Prep]]

## Core Concept (20-second answer)
{{What you'd say in 20 sec if asked "What is {{topic}}?"}}

## Common Questions

### Q: {{Question 1}}?
{{Crisp 2–4 sentence answer.}}

### Q: {{Question 2}}?
{{Answer.}}

### Q: {{Harder follow-up}}?
{{Answer.}}

## Code You Might Write
```{{language}}
// What interviewer might ask you to implement
```

## Key Terms to Use
- **{{Term}}** — {{meaning}}

## Pivot Points
{{How this topic connects to adjacent concepts interviewer might jump to.}}

## Related
- [[{{Main Concept Note}}]]
- [[MOC - Interview Prep]]
- [[MOC - {{Domain}}]]
```
