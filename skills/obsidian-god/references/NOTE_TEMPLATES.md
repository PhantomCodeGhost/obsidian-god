# NOTE_TEMPLATES.md — Standard Templates for Every Note Type

---

## Hub Note Template

Filename: `TopicName.md` (must match folder name exactly)

```markdown
---
title: {{TopicName}}
tags: [{{tech-tag}}, {{domain-tag}}]
aliases: [{{common-variations}}]
created: {{date}}
status: active
type: hub
domain: {{Domain}}
---

# {{TopicName}}

Part of [[MOC - {{Domain}}]]

> [!abstract] Summary
> One-sentence description of what this technology/concept is and why it matters.

---

## Core Concepts

- [[{{Concept 1}}]] — brief description
- [[{{Concept 2}}]] — brief description
- [[{{Concept 3}}]] — brief description

## {{Category 2}}

- [[{{Note}}]]

## {{Category 3}}

- [[{{Note}}]]

---

```mermaid
graph TD
    A[{{TopicName}}] --> B[{{Core Concept 1}}]
    A --> C[{{Core Concept 2}}]
    A --> D[{{Core Concept 3}}]
```

---

> [!info] Related Concepts
> - [[{{Related 1}}]]
> - [[{{Related 2}}]]
> - [[{{Related 3}}]]
```

---

## Concept Note Template

```markdown
---
title: {{ConceptName}}
tags: [{{tech-tag}}, {{domain-tag}}]
aliases: [{{variations}}]
created: {{date}}
status: active
type: concept
domain: {{Domain}}
---

# {{ConceptName}}

Part of [[{{ParentHub}}]] · [[MOC - {{Domain}}]]

> [!abstract] Summary
> What is this? Why does it matter?

---

## Overview

Main explanation here. Use `==highlight==` for key terms on first use.

## How It Works

Detailed explanation with code examples.

```{{language}}
// Code example
```

## When to Use

Practical guidance.

## Common Mistakes

> [!failure] Avoid This
> Description of common mistake.

---

> [!info] Related Concepts
> - [[{{Related 1}}]]
> - [[{{Related 2}}]]
```

---

## MOC Template

Filename: `MOC - {{Domain}}.md`
Location: `Meta/MOCs/`

```markdown
---
title: MOC - {{Domain}}
tags: [moc, {{domain-tag}}]
created: {{date}}
type: moc
---

# MOC - {{Domain}}

> Entry point for all {{Domain}} knowledge.

---

## Topics

- [[{{Hub Note 1}}]] — brief description
- [[{{Hub Note 2}}]] — brief description
- [[{{Hub Note 3}}]] — brief description

## Cross-Domain

- [[{{CrossDomainNote}}]] ({{Other Domain}})

---

> [!tip] Navigation
> Each topic below is a hub note — click to explore its subtopics and concepts.
```

---

## Resource Note Template

Location: `02 Resources/`

```markdown
---
title: {{Resource Title}}
tags: [resource, {{tech-tag}}]
source: {{URL or Book}}
created: {{date}}
status: active
type: resource
---

# {{Resource Title}}

> [!quote] Source
> {{Author}}, {{Year}} — [Link]({{URL}})

## Key Takeaways

- Point 1
- Point 2

## Related Notes

> [!info] Apply In
> - [[{{Note where this is useful}}]]
```

---

## Inbox Note Template

Location: `00 Inbox/`

```markdown
---
title: {{Title}}
tags: [inbox]
created: {{date}}
status: draft
---

# {{Title}}

{{Raw capture — unprocessed}}

---
%% TODO: process this note — move to 01 Knowledge or 02 Resources %%
```
