# AI Agent Instructions

This document contains rules for AI agents operating on this repository.

1. Maintain standard Create React App (CRA) conventions.
2. Ensure environment variables are strictly divided (client variables MUST be prefixed with `REACT_APP_`).
3. Follow the Conventional Commits specification.
4. Supabase Magic Link auth handles user sessions. Avoid introducing alternative auth paradigms.
5. Reference `docs/KNOWN_ISSUES.md` before attempting to resolve existing bugs.
6. The coordination repository is `stephenm87/website-projects-git`. Use this when managing cross-project dependencies or broad updates.

## Working with other agents

Three agents work on this project: Claude Code, Codex and Antigravity. All three read this file (Claude through `CLAUDE.md`).

- The agent given the task is the lead. Only the lead edits files, and it chooses another agent for a read-only review when a second view helps.
- Before starting, the lead reads `HANDOFF.md`. Before stopping, it adds an entry: what it did, what is unfinished, what the next agent should check.
- Reviewers return their feedback as text and edit nothing, including `HANDOFF.md`.
- Each agent can be asked for a review from the terminal (run from the project root; the commands are launchers in `~/.local/bin`):
  - Claude: `claude -p "<prompt>" < /dev/null`
  - Codex: `codex exec --sandbox read-only "<prompt>"`
  - Antigravity: `agy -p "<prompt>"`
