# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- GloPo Companion initial baseline (2026-08-03).
- React frontend with Tailwind CSS.
- Netlify Functions for AI and data fetching.
- Supabase integration.
- Dedicated Command Term and OPVL feedback functions with validated UI contracts.
- Explicit privacy consent, file-signature checks, transcription confidence, and structured PDF/image feedback.
- URL-addressable, browser-history-aware top-level study sections.

### Changed
- Introduction review now uses a server-owned prompt and a matching response schema.
- Semantic case embeddings are reused across warm requests.
- Grammar checking uses a configured paid/self-hosted LanguageTool endpoint or Gemini instead of the unsupported public endpoint.
- Dictation is permitted for the same origin, save indicators distinguish unsaved from locally saved text, and the primary action grid is responsive.
- Removed the unused `@google/generative-ai` browser package.
