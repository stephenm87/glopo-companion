# Architecture Overview

## Frontend
- **Framework:** React 18 bundled with Vite 8.
- **Styling:** Locally bundled Tailwind CSS configured in `tailwind.config.js` and customized in `src/index.css`.
- **Glossary Tooltips:** Locally bundled Tippy.js; tooltip content is built with text-safe DOM nodes.
- **Core Components:**
  - `src/main.jsx`: Application entry point.
  - `src/App.jsx`: Main view handling. Top-level sections are URL-addressable through `/app?section=...`, with `/glossary` as a stable direct route and accessible tab semantics. Further component extraction remains planned.
  - `src/AuthModal.jsx`: Interface for Supabase magic link auth.
  - `src/examBank.js`: Static data for IB exam preparation, dynamically imported when the Mock Exam Zone is opened so other study paths do not download it up front.

Vite emits third-party dependencies as a separate vendor chunk. This keeps the application entry chunk below the previous 500 kB warning threshold and allows browser caching of dependencies independently from application updates.

`src/localState.mjs` provides exception-safe JSON persistence for anonymous study progress. Ops Room metrics and underlying flashcard and speed-round records restore without requiring authentication; selected drafts can still synchronize to Supabase when an independent account is configured.

## Backend / Serverless
- **Platform:** Netlify Functions (`netlify/functions/`).
- **Functionality:** 
  - AI wrappers (Gemini + Google Cloud NLP, Gemini Vision) in scripts like `analyze-essay.js` and `analyze-image-essay.js`.
  - Search tools (`semantic-search.js`, `find-cases.js`).
  - Structural analysis (`peel-review.js`, `grammar-check.js`, `command-term-check.js`, `opvl-score.js`) with dedicated response contracts for each UI workflow.
  - Shared access control (`security.js`) validates Supabase bearer tokens and applies per-user throttling.

The frontend uses `src/api.js` to attach the current Supabase access token to serverless tool requests. Provider credentials remain server-side.
  
## Database and Authentication
- **Service:** Supabase
- **Features:** Passwordless user sessions using Magic Links and cloud autosave.

PDF/image uploads are base64-encoded client-side for the synchronous function. The browser enforces a 4 MB decoded limit, requires an explicit privacy acknowledgement, and presents PDFs as document metadata rather than broken image previews. The server verifies file signatures and returns structured formative feedback.

## Scripts
- **Python Scripts:** The repository contains Python prototypes (`PolicyLogic.py`, `test_logic.py`, `scripts/analyze_draft.py`). These are NOT part of the web build process.
