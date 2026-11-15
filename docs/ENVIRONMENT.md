# Environment Variables

## Client-Side (Prefix: `VITE_`)
These variables are bundled with the React app during the build process:
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key used by the browser client. `VITE_SUPABASE_ANON_KEY` remains supported for legacy projects.

Provider API keys must never use the `VITE_` prefix because Vite exposes those values to browser code.

## Server-Side (Netlify Functions)
These variables are securely injected into Netlify Functions and should NEVER be prefixed with `VITE_`:
- `GEMINI_API_KEY`: Server-side API key for Gemini.
- `SERPER_API_KEY`: Key for Serper (Google Search) API in functions like solution-research.js.
- `GOOGLE_NL_API_KEY`: Optional Google Cloud Natural Language key used by essay analysis.
- `GEMINI_PRIMARY_MODEL`: Optional primary Gemini model override.
- `GEMINI_FALLBACK_MODEL`: Optional fallback Gemini model override.
- `LANGUAGETOOL_API_URL`: Optional LanguageTool Enterprise or self-hosted `/v2/check` endpoint. The public endpoint is intentionally unsupported; when omitted, grammar checking uses Gemini.
- `LANGUAGETOOL_API_KEY`: Optional bearer token for the configured LanguageTool endpoint.
- `SUPABASE_URL`: Supabase project URL used to validate bearer tokens.
- `SUPABASE_PUBLISHABLE_KEY`: Publishable key used by the Supabase Auth user endpoint. `SUPABASE_ANON_KEY` remains supported for legacy projects.
- `ALLOWED_ORIGINS`: Optional comma-separated list of additional preview or custom-domain origins.

All serverless tool endpoints require a valid Supabase access token. Never configure a Supabase service-role or secret key for this validation path.
