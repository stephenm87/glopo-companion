# Security Policy

## Supported Versions
Only the `main` branch is actively supported with security updates.

## Reporting a Vulnerability
If you discover a security vulnerability, please open a security issue via the provided `.github/ISSUE_TEMPLATE/security.md` template or contact `@stephenm87` directly. Do not disclose the vulnerability publicly until it has been addressed.

## Secrets
Never commit API keys (e.g., `GEMINI_API_KEY`, `SERPER_API_KEY`) to the repository. The CI pipeline includes automated secret scanning.
