# AI Agent Skills

A collection of skills for AI coding agents.

## Overview

This repository contains reusable skills that AI coding agents can activate automatically (when a request matches the
`description` in the skill's frontmatter) or invoke explicitly by name.

Skills are agent-agnostic: the same skill can be distributed to any supported agent (for example
Cline, Claude Code, Cursor, GitHub Copilot). See [AGENTS.md](AGENTS.md) for the layout and
contribution conventions.

## Structure

```
skills/
├── business-use-case-builder/
│   └── SKILL.md
├── java-backend-developer/
│   └── SKILL.md
├── java-spring-code-review/
│   └── SKILL.md
└── system-use-case-builder/
    └── SKILL.md
```

## Skills

| Skill                                                                    | Purpose                                                                                                     |
|--------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [`business-use-case-builder`](skills/business-use-case-builder/SKILL.md) | Build structured business use cases from raw process information                                            |
| [`system-use-case-builder`](skills/system-use-case-builder/SKILL.md)     | Build structured system use cases with a call flow rendered as a Sequence Diagram                           |
| [`java-spring-code-review`](skills/java-spring-code-review/SKILL.md)     | Review Java/Spring Boot code against the target project's AGENTS.md and industry conventions                |
| [`java-backend-developer`](skills/java-backend-developer/SKILL.md)       | Implement Java/Spring Boot backend features against the target project's AGENTS.md and industry conventions |

## Usage

Each skill is defined in a `SKILL.md` file with frontmatter containing `name` and `description`.

Activation:

- **Automatic** — the agent picks up a skill when the user's request matches its description.
- **Explicit** — invoke by name, for example `/business-use-case-builder`.

## Adding a New Skill

1. Create a directory under the top-level `skills/` root, e.g. `skills/<skill-name>/`.
2. Add a `SKILL.md` file with frontmatter:

   ```markdown
   ---
   name: <skill-name>
   description: <one sentence describing when to activate the skill>
   ---
   ```

3. Describe the role, the conditions for applying the skill, and the structure of the result in the body.

See [AGENTS.md](AGENTS.md) for naming conventions, the SKILL.md format, and best practices.
