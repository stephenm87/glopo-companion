# AI Agent Instructions

This document contains rules for AI agents operating on this repository.

1. Maintain the existing React 18 and Vite conventions.
2. Ensure environment variables are strictly divided (client variables MUST be prefixed with `VITE_`; provider credentials remain server-side and unprefixed).
3. Follow the Conventional Commits specification.
4. Supabase Magic Link auth handles user sessions. Avoid introducing alternative auth paradigms.
5. Reference `docs/KNOWN_ISSUES.md` before attempting to resolve existing bugs.
6. The coordination repository is `stephenm87/website-projects-git`. Use this when managing cross-project dependencies or broad updates.

## Working with other agents

Three agents work on this project: Antigravity, Claude Code and Codex. All three read this file (Claude through `CLAUDE.md`).

- Antigravity is the lead unless the owner says otherwise. It edits files, runs the app and the tests on the desktop, and asks Claude Code or Codex for a read-only review before it finishes a task.
- Claude Code and Codex are reviewers. They return their feedback as text and edit nothing, including `HANDOFF.md`. If the owner gives one of them a task directly, it is the lead for that task and the same rules apply.
- Before starting, the lead reads `HANDOFF.md`. Before stopping, it adds an entry: what it did, what it tested and how, what is unfinished, what the next agent should check.
- Each agent can be asked for a review from the terminal (run from the project root; the commands are launchers in `~/.local/bin`):
  - Claude: `claude -p "<prompt>" < /dev/null`
  - Codex: `codex exec --sandbox read-only "<prompt>"`
  - Antigravity: `agy -p "<prompt>"`
