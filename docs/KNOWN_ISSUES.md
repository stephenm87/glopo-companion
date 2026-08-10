# Known Issues

1. Some AI-generated feedback is intentionally session-only; input drafts for the policy engine, comparison builder, introduction wizard, and practice lab persist locally.
2. Supabase data binding and RLS policies require deployment-level verification
3. Per-user throttling is instance-local; durable cross-instance limits require a shared store
4. The top-level tabs now have stable URLs, but `src/App.jsx` remains a large module and station-level component extraction is still needed for maintainability and more granular loading.
5. PDF/handwriting transcription and formative scoring require a representative anonymized, teacher-reviewed evaluation set before quality can be certified.
6. Exam-bank data and third-party dependencies are now split from the application entry chunk. The entry chunk is approximately 339 kB before gzip, with a deferred 46 kB exam-bank chunk and a cacheable 178 kB vendor chunk; station-level component splitting remains an opportunity.

## Recently Resolved — Verification Covered by Tests

- Introduction generation rejects missing fields instead of interpolating `undefined`.
- PEEL Review and Essay Analysis reject empty input.
- AI endpoints enforce input and upload-size limits.
- Provider-backed functions require an authenticated Supabase user.
- The browser-accessible Gemini token endpoint was removed; provider keys remain server-side.
- Grammar checking rejects oversized text before contacting the upstream service.
- Glossary highlighting no longer injects HTML into the React tree.
- Browser auth supports current Supabase publishable keys and legacy anonymous keys.
- Tailwind CSS and Tippy are pinned local dependencies; production no longer permits runtime third-party scripts or `unsafe-eval`.
- Create React App was replaced by Vite 8, and the unused local Netlify CLI was removed.
- Command Term checking, OPVL scoring, and introduction review now use dedicated matching server contracts with automated tests.
- Semantic case embeddings are cached across warm function requests instead of recomputed for every query.
- PDF/image feedback requires explicit consent, validates file signatures, rejects encrypted/over-25-page PDFs, shows a real PDF summary, reports transcription confidence, and stays within a bounded retry budget.
- Grammar checking no longer automates LanguageTool's unsupported public endpoint and no longer reports provider failure as zero issues.
- Speech dictation is allowed for the same origin by the production Permissions Policy.
- Top-level study sections have browser-history-aware URLs and accessible tab/tabpanel semantics.
- Exam-bank data loads only when the Mock Exam Zone is opened, and vendor dependencies are emitted as a separate cacheable chunk.
- Ops Room restores the active station, flashcard ratings, theory summary, and speed-round high score. Flashcards now reach the completed-deck state, and the speed round updates high scores after render rather than mutating React state during render.
- Local persistence falls back safely when saved JSON is malformed or browser storage is unavailable.
