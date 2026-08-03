# Architecture Overview

## Frontend
- **Framework:** Create React App (React 18).
- **Styling:** Tailwind CSS, customized in `src/index.css`.
- **Core Components:**
  - `src/index.js`: Application entry point.
  - `src/App.js`: Main routing/view handling for various tools.
  - `src/AuthModal.js`: Interface for Supabase magic link auth.
  - `src/examBank.js`: Static data for IB exam preparation.

## Backend / Serverless
- **Platform:** Netlify Functions (`netlify/functions/`).
- **Functionality:** 
  - AI wrappers (Gemini + Google Cloud NLP, Gemini Vision) in scripts like `analyze-essay.js` and `analyze-image-essay.js`.
  - Search tools (`semantic-search.js`, `find-cases.js`).
  - Structural analysis (`peel-review.js`, `grammar-check.js`).
  
## Database and Authentication
- **Service:** Supabase
- **Features:** User sessions using Magic Links (restricted to `@saschina.org` in production settings typically), and cloud autosave.

## Scripts
- **Python Scripts:** The repository contains Python prototypes (`PolicyLogic.py`, `test_logic.py`, `scripts/analyze_draft.py`). These are NOT part of the web build process.
