/**
 * gemini-retry.js — Shared retry wrapper for Gemini API calls.
 * Retries on 429 (rate limit) and 503 (overloaded) with exponential backoff.
 * Supports automatic model fallback (e.g. gemini-2.5-pro → gemini-2.0-flash).
 */
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));

const RETRYABLE_STATUSES = [429, 503];
const MAX_RETRIES = 2;
const INITIAL_DELAY_MS = 1000;

/**
 * Calls a Gemini API endpoint with automatic retry on 429/503.
 * If all retries fail and a fallbackUrl is provided, retries once with the fallback model.
 * @param {string} url - Full Gemini API URL (including ?key=...)
 * @param {object} body - Request body to JSON.stringify
 * @param {object} [options] - Optional overrides: { maxRetries, headers, fallbackUrl }
 * @returns {Promise<Response>} - The successful fetch Response
 */
async function callGeminiWithRetry(url, body, options = {}) {
    const maxRetries = options.maxRetries ?? MAX_RETRIES;
    const headers = options.headers ?? { 'Content-Type': 'application/json' };
    const fallbackUrl = options.fallbackUrl ?? null;
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);

    // --- Primary model attempts ---
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: bodyStr
        });

        if (res.ok || !RETRYABLE_STATUSES.includes(res.status)) {
            return res;
        }

        // Retryable error
        if (attempt < maxRetries) {
            const delay = INITIAL_DELAY_MS * Math.pow(2, attempt); // 1s → 2s
            console.log(`[gemini-retry] ${res.status} on attempt ${attempt + 1}/${maxRetries + 1}, retrying in ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
        } else {
            // Exhausted retries on primary model
            if (fallbackUrl) {
                console.log(`[gemini-retry] Primary model exhausted (${res.status} after ${maxRetries + 1} attempts). Falling back to flash model...`);
                // Single attempt on fallback model
                const fallbackRes = await fetch(fallbackUrl, {
                    method: 'POST',
                    headers,
                    body: bodyStr
                });
                if (fallbackRes.ok || !RETRYABLE_STATUSES.includes(fallbackRes.status)) {
                    console.log(`[gemini-retry] Fallback model returned ${fallbackRes.status}.`);
                    return fallbackRes;
                }
                console.log(`[gemini-retry] Fallback model also failed (${fallbackRes.status}). Giving up.`);
                return fallbackRes;
            }
            console.log(`[gemini-retry] ${res.status} after ${maxRetries + 1} attempts, giving up.`);
            return res;
        }
    }
}

module.exports = { callGeminiWithRetry };
