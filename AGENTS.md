# AI Agent Instructions

This document contains rules for AI agents operating on this repository.

1. Maintain the existing React 18 and Vite conventions.
2. Ensure environment variables are strictly divided (client variables MUST be prefixed with `VITE_`; provider credentials remain server-side and unprefixed).
3. Follow the Conventional Commits specification.
4. Supabase Magic Link auth handles user sessions. Avoid introducing alternative auth paradigms.
5. Reference `docs/KNOWN_ISSUES.md` before attempting to resolve existing bugs.
6. The coordination repository is `stephenm87/website-projects-git`. Use this when managing cross-project dependencies or broad updates.
