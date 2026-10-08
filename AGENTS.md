# AGENTS.md

This file provides guidance to AI coding agents (Cline, Claude Code, Cursor, GitHub Copilot, and others) when working with or contributing to this repository.

## Repository Overview

`ai-agent-skills` is a collection of reusable **skills** for AI coding agents. A skill is a self-contained folder that packages instructions — and optionally scripts — that extend an agent's capabilities for a specific task.

Skills are currently authored for **Cline**. The repository is designed to also host skills for other agents (for example Claude Code, Cursor, GitHub Copilot) in the future.

Skills are task-oriented, not stack-oriented: they target a concrete activity (business analysis, code review, and so on) rather than a specific framework or product.

## Repository Layout

Skills live under an agent-specific root directory that matches the agent's native discovery convention. The currently used root is:

```
.cline/skills/{skill-name}/SKILL.md    # Cline
```

When a skill is added for another agent, place it under that agent's own root, for example:

```
.claude/skills/{skill-name}/SKILL.md   # Claude Code
.cursor/skills/{skill-name}/SKILL.md   # Cursor
```

Rules:

- **One agent = one root directory.** Never mix skills for different agents under the same path.
- Keep the `skills/` directory name inside the agent root; do not invent new layouts without a reason.
- If the same skill should be available to several agents, keep a single canonical copy and mirror it into the other agent roots, adapting for any format differences.

## Creating a New Skill

### Directory Structure

```
{agent-root}/skills/
  {skill-name}/           # kebab-case directory name
    SKILL.md              # Required: skill definition
    scripts/              # Optional: executable scripts
      {script-name}.sh    # Bash scripts
      {script-name}.mjs   # Node scripts
    references/           # Optional: supporting docs loaded on demand
    lib/                  # Optional: shared code for scripts
```

The three skills in `.cline/skills/` (`business-use-case-builder`, `system-use-case-builder`, `java-spring-code-review`) are the reference examples for structure and tone — keep new skills consistent with them.

### Naming Conventions

- **Skill directory**: `kebab-case` (e.g., `business-use-case-builder`).
- **SKILL.md**: always uppercase, always this exact filename.
- **Scripts**: `kebab-case` with an extension-specific suffix (e.g., `deploy.sh`, `collect-signals.mjs`).

### SKILL.md Format

Each skill must start with YAML frontmatter containing `name` and `description`, followed by the body:

```markdown
---
name: {skill-name}
description: {One sentence describing when to activate this skill. Include the trigger phrases a user is likely to say.}
---

# {Skill Title}

{Short description of what the skill does and the role the agent takes on.}

## When to apply

{Signals in the user's request that mean this skill should be activated.}

## Structure / Output

{The mandatory structure of the produced artifact.}

## After output

{Follow-up steps to propose to the user.}
```

### Language Conventions

- Skills are written in **English**, including the frontmatter `description`, trigger phrases, and the body.
- Code, identifiers, and established technical terms (API, DTO, JPA, sequence diagram) stay in Latin/English and are not translated.
- Keep the language consistent across skills unless a skill explicitly requires another language.

### Best Practices for Context Efficiency

Skills are loaded on demand — only the skill `name` and `description` are read at startup; the full `SKILL.md` is loaded into context only when the agent decides the skill is relevant. To minimize context usage:

- **Keep SKILL.md under ~500 lines** — move detailed reference material into separate files under `references/`.
- **Write specific descriptions** — a precise `description` tells the agent exactly when to activate the skill.
- **Use progressive disclosure** — reference supporting files that are read only when needed.
- **Prefer scripts over inline code** — script execution does not consume context (only the output does).
- **File references work one level deep** — link directly from `SKILL.md` to supporting files.

### Script Requirements

- Bash scripts: use `#!/bin/bash` and `set -e`.
- Node scripts: use `#!/usr/bin/env node` and the `.mjs` extension.
- Write status messages to `stderr`.
- Write machine-readable output (JSON) to `stdout`.
- Include a cleanup trap for temp files when scripts create them.
- Reference scripts by relative path, for example `node scripts/{script}.mjs`.

## Distribution

Skills reach users by copying (or symlinking) the skill folder from this repository into the agent's skills directory, for example:

```bash
# Cline
cp -r .cline/skills/{skill-name} ~/.cline/skills/
```

Follow the target agent's own documentation for the exact install path and format.

## Documentation

- `README.md` — human-facing overview and the list of available skills. Keep the skill table in sync when skills are added or removed.
- `AGENTS.md` (this file) — guidance for AI coding agents working on the repository itself.
