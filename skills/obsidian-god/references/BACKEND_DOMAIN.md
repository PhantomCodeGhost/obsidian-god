# Backend Domain Plan

Tailored restructure for Backend / Hibernate / Java / Interview Prep vaults.

---

## Recommended Folder Structure

```
vault/
├── 00 - MOCs/
│   ├── MOC - Backend.md
│   ├── MOC - Hibernate.md
│   ├── MOC - Java.md
│   └── MOC - Interview Prep.md
├── Backend/
│   ├── Backend - API Lifecycle.md
│   ├── Backend - Authentication & JWT.md       ← NEW
│   ├── Backend - CICD Basics.md
│   ├── Backend - Client-Server Architecture.md
│   ├── Backend - Database Design Basics.md     ← NEW
│   ├── Backend - Design Patterns.md            ← NEW
│   ├── Backend - Docker for Backend.md
│   ├── Backend - Exception Handling.md
│   ├── Backend - HTTP & HTTPS.md
│   ├── Backend - JSON and XML.md
│   ├── Backend - Microservices vs Monolith.md  ← NEW
│   ├── Backend - OOP for Backend.md
│   ├── Backend - Redis Caching.md
│   ├── Backend - REST API Fundamentals.md
│   ├── Backend - Roadmap.md
│   ├── Backend - Stateless vs Stateful.md
│   └── Canvas - MOC - Backend.canvas          ← NEW (visual map)
├── Java/
│   ├── Java - Collections.md                  ← moved + renamed
│   ├── Java - Exception Types.md              ← NEW (split from Exception Handling)
│   ├── Java - Generics.md                     ← NEW
│   ├── Java - OOP Principles.md               ← NEW (paired with Backend - OOP)
│   ├── Java - Streams API.md                  ← moved + renamed
│   └── Canvas - MOC - Java.canvas            ← NEW
├── Hibernate/
│   ├── Hibernate - Architecture.md
│   ├── Hibernate - Cascade Types.md
│   ├── Hibernate - Entities.md
│   ├── Hibernate - Lazy vs Eager Loading.md
│   ├── Hibernate - ORM vs JDBC.md
│   ├── Hibernate - Relationships.md
│   ├── Hibernate - Session & Transaction.md   ← NEW
│   ├── Hibernate - What is ORM.md
│   └── Canvas - MOC - Hibernate.canvas       ← NEW
└── Interview Prep/
    ├── Interview - Backend Fundamentals.md    ← NEW
    ├── Interview - Java Core.md               ← NEW
    └── Interview - Hibernate & ORM.md         ← NEW
```

---

## New Notes to Create

| File | Why Essential | Links To |
|------|---------------|----------|
| `Backend - Authentication & JWT.md` | In every backend interview | HTTP, REST API, Stateless vs Stateful |
| `Backend - Database Design Basics.md` | Missing DB layer | Hibernate, ORM vs JDBC, Redis |
| `Backend - Design Patterns.md` | Factory/Singleton/Observer used in backend | OOP, REST API |
| `Backend - Microservices vs Monolith.md` | Architecture choice, interview staple | Client-Server, Docker, CICD |
| `Hibernate - Session & Transaction.md` | Core Hibernate workflow | Architecture, Entities |
| `Java - Generics.md` | Required for Collections mastery | Collections, OOP |
| `Java - Exception Types.md` | Splits checked vs unchecked from Backend note | Exception Handling |
| `Java - OOP Principles.md` | Pure Java OOP (Backend note = applied OOP) | Backend - OOP for Backend |

---

## Link Enrichment: Existing Notes

Add these links to existing notes:

### Backend - REST API Fundamentals.md
```markdown
## Related
- [[Backend - HTTP & HTTPS]]        ← REST runs on HTTP
- [[Backend - Stateless vs Stateful]]  ← REST is stateless
- [[Backend - Authentication & JWT]]  ← securing REST
- [[Backend - JSON and XML]]         ← REST payloads
- [[Backend - API Lifecycle]]        ← lifecycle of a REST API
- [[MOC - Backend]]
```

### Backend - HTTP & HTTPS.md
```markdown
## Related
- [[Backend - REST API Fundamentals]]  ← REST built on HTTP
- [[Backend - Client-Server Architecture]]  ← HTTP is the protocol
- [[Backend - Authentication & JWT]]  ← HTTPS for auth security
- [[MOC - Backend]]
```

### Backend - Exception Handling.md
```markdown
## Related
- [[Java - Exception Types]]     ← Java-specific exception hierarchy
- [[Backend - OOP for Backend]]  ← exceptions as OOP construct
- [[MOC - Backend]]
- [[MOC - Java]]
```

### Backend - Redis Caching.md
```markdown
## Related
- [[Backend - Stateless vs Stateful]]  ← caching enables statelessness
- [[Backend - Database Design Basics]]  ← caching layer in DB architecture
- [[Backend - REST API Fundamentals]]  ← caching REST responses
- [[MOC - Backend]]
```

### Hibernate - Architecture.md
```markdown
## Related
- [[Hibernate - Entities]]            ← what architecture manages
- [[Hibernate - Session & Transaction]]  ← how architecture operates
- [[Hibernate - ORM vs JDBC]]         ← why this architecture exists
- [[MOC - Hibernate]]
```

### Hibernate - Relationships.md
```markdown
## Related
- [[Hibernate - Cascade Types]]        ← cascade on relationships
- [[Hibernate - Lazy vs Eager Loading]]  ← fetch strategy per relationship
- [[Hibernate - Entities]]             ← relationships between entities
- [[MOC - Hibernate]]
```

### Hibernate - What is ORM.md
```markdown
## Related
- [[Hibernate - ORM vs JDBC]]       ← ORM vs alternative
- [[Hibernate - Architecture]]      ← how ORM implemented in Hibernate
- [[Backend - Database Design Basics]]  ← ORM in DB context
- [[MOC - Hibernate]]
```

---

## Master Connection Map

Key graph edges to establish (→ = directional link, ↔ = bidirectional):

```
MOC - Backend ↔ MOC - Hibernate
MOC - Backend ↔ MOC - Java
MOC - Backend ↔ MOC - Interview Prep
MOC - Hibernate ↔ MOC - Java
MOC - Java ↔ MOC - Interview Prep

# HTTP chain
Client-Server Architecture → HTTP & HTTPS → REST API Fundamentals → Authentication & JWT

# Auth chain
Authentication & JWT → Stateless vs Stateful → Redis Caching

# OOP chain
Java - OOP Principles → Backend - OOP for Backend → Backend - Design Patterns

# Java chain
Java - Collections → Java - Generics → Java - Streams API
Java - Exception Types ↔ Backend - Exception Handling

# Hibernate chain
Hibernate - What is ORM → Hibernate - ORM vs JDBC → Hibernate - Architecture
Hibernate - Architecture → Hibernate - Entities → Hibernate - Relationships
Hibernate - Relationships → Hibernate - Cascade Types
Hibernate - Relationships → Hibernate - Lazy vs Eager Loading
Hibernate - Architecture → Hibernate - Session & Transaction

# Cross-domain bridges
Backend - OOP for Backend ↔ Java - OOP Principles
Backend - Exception Handling ↔ Java - Exception Types
Hibernate - Entities ↔ Backend - Database Design Basics
Backend - CICD Basics ↔ Backend - Docker for Backend
```

---

## Bases Dashboards to Create

### `Backend Progress.base`
```yaml
filters:
  and:
    - file.inFolder("Backend")
    - 'file.ext == "md"'

views:
  - type: table
    name: "All Backend Notes"
    order:
      - file.name
      - status
      - file.mtime
    groupBy:
      property: status
      direction: ASC
```

### `Study Tracker.base`
```yaml
filters:
  or:
    - file.hasTag("backend")
    - file.hasTag("java")
    - file.hasTag("hibernate")

formulas:
  needs_review: 'status == "seed"'

views:
  - type: table
    name: "Seeds to Grow"
    filters:
      and:
        - 'status == "seed"'
    order:
      - file.name
      - file.mtime
```
