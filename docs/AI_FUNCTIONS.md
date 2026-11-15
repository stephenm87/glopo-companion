# AI Functions

- `analyze-essay.js`: Gemini+NLP
- `analyze-image-essay.js`: Gemini vision
- `command-term-check.js`: structured formative command-term skill analysis
- `compare-research.js`: research comparison
- `find-cases.js`: case study finder
- `gemini-retry.js`: retry wrapper
- `generate-intro.js`: intro generator
- `grammar-check.js`: configured LanguageTool Enterprise/self-hosted endpoint or Gemini fallback; never the unsupported public endpoint
- `opvl-score.js`: structured formative OPVL scoring and coaching
- `peel-review.js`
- `semantic-search.js`
- `solution-research.js`
- `security.js`: shared Supabase session, origin, and per-user rate-limit enforcement

PDF/image feedback requires explicit user consent, validates binary signatures against declared MIME types, rejects encrypted or over-25-page PDFs, and returns a structured transcription-confidence and feedback contract. Vision calls use a bounded retry budget designed to remain within the synchronous function deadline. All rubric and band outputs are formative rather than official grades.
