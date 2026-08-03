# GloPo Companion

An IB Global Politics study companion web application that provides advanced essay analysis, grammar checking, case study finding, and semantic search powered by Gemini AI and Google Cloud NLP.

## Features
- **Essay Analysis:** Utilizes Gemini AI and Google Cloud NLP.
- **Image/PDF Essay Analysis:** Uses Gemini vision models.
- **Grammar Check & PEEL Review:** Automated analysis for structured writing.
- **Semantic Search:** Embedding-based search for relevant cases.
- **Built-in IB exam bank:** Extensive data for exam preparation.
- **Cloud Autosave:** Enabled by Supabase Magic Link authentication.

## Stack
- Framework: Create React App (react-scripts 5.0.1)
- UI: React 18 + Tailwind CSS
- Runtime: Node.js 22.x
- Backend: Netlify Functions (`netlify/functions/`)
- Database/Auth: Supabase

## Setup & Development
1. `npm install`
2. Create a `.env` file referencing `docs/ENVIRONMENT.md`.
3. `npm start` for local development.

## Documentation
See the `/docs` directory for architectural context, environment variables, known issues, and AI capabilities.
