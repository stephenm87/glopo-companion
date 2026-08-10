# Testing

Run the complete automated suite with `npm test`.

Run Netlify function validation, retry, comparison, and semantic-search tests with `npm run test:functions`.

Run the standalone security-boundary tests with `npm run test:security`. CI runs the complete test command before the production build.

Run browser-state serialization and malformed-storage fallback tests with `npm run test:unit`. The complete `npm test` command includes these unit checks.
