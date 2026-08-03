# Environment Variables

## Client-Side (Prefix: `REACT_APP_`)
These variables are bundled with the React app during the build process:
- `REACT_APP_GEMINI_API_KEY`: API key for Gemini models (client context).
- `REACT_APP_SUPABASE_URL`: Supabase project URL.
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anonymous public key.

## Server-Side (Netlify Functions)
These variables are securely injected into Netlify Functions and should NEVER be prefixed with `REACT_APP_`:
- `GEMINI_API_KEY`: Server-side API key for Gemini.
- `SERPER_API_KEY`: Key for Serper (Google Search) API in functions like solution-research.js.
