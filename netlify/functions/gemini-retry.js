/**
 * gemini-retry.js — Shared retry wrapper for Gemini API calls.
 * Implements exponential backoff, jitter, timeout, and distinct HTTP status classification.
 */

// Centralized model selection
const PRIMARY_MODEL = process.env.GEMINI_PRIMARY_MODEL || 'gemini-3.5-flash';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash';

if (PRIMARY_MODEL === FALLBACK_MODEL) {
    console.warn(`[gemini-retry] WARNING: PRIMARY_MODEL and FALLBACK_MODEL are both ${PRIMARY_MODEL}. Fallback behavior will point to the same model.`);
}

const TRANSIENT_STATUSES = [429, 500, 502, 503, 504];
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 10000;
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Builds the Gemini API URL for a specific model.
 */
function buildGeminiUrl(modelName, apiKey) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
}

/**
 * Executes a fetch with a timeout.
 */
async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError' || error.type === 'aborted') {
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        throw error;
    }
}

/**
 * Calls Gemini API with robust retry behavior.
 * @param {string} apiKey - The Gemini API Key
 * @param {object} body - Request body to JSON.stringify
 * @param {object} [options] - Optional overrides: { maxRetries, headers, timeout }
 * @returns {Promise<{ ok: boolean, status: number, data?: any, error?: any }>}
 */
async function callGeminiWithRetry(apiKey, body, options = {}) {
    const maxRetries = options.maxRetries ?? MAX_RETRIES;
    const headers = options.headers ?? { 'Content-Type': 'application/json' };
    const timeout = options.timeout ?? REQUEST_TIMEOUT_MS;
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    
    let currentModel = PRIMARY_MODEL;
    let url = options.url || buildGeminiUrl(currentModel, apiKey);
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const res = await fetchWithTimeout(url, {
                method: 'POST',
                headers,
                body: bodyStr
            }, timeout);

            if (res.ok) {
                const data = await res.json();
                return { ok: true, status: res.status, data };
            }

            if (res.status === 400) {
                const errData = await res.text();
                return { ok: false, status: res.status, error: 'Bad Request: ' + errData };
            }

            if (res.status === 401 || res.status === 403) {
                return { ok: false, status: res.status, error: 'Authentication or Authorization failure.' };
            }

            if (res.status === 404) {
                if (!options.url && currentModel === PRIMARY_MODEL && PRIMARY_MODEL !== FALLBACK_MODEL) {
                    console.log(`[gemini-retry] 404 for ${PRIMARY_MODEL}, falling back to ${FALLBACK_MODEL}`);
                    currentModel = FALLBACK_MODEL;
                    url = buildGeminiUrl(currentModel, apiKey);
                    attempt++;
                    continue; 
                }
                return { ok: false, status: res.status, error: `Model ${currentModel} not found.` };
            }

            if (TRANSIENT_STATUSES.includes(res.status)) {
                let delay = INITIAL_DELAY_MS * Math.pow(2, attempt);
                const retryAfter = res.headers.get('Retry-After');
                if (retryAfter) {
                    const parsed = parseInt(retryAfter, 10);
                    if (!isNaN(parsed)) delay = parsed * 1000;
                }
                
                delay = Math.min(delay, MAX_DELAY_MS);
                delay = delay + (Math.random() * 500);

                if (attempt < maxRetries) {
                    console.log(`[gemini-retry] ${res.status} on attempt ${attempt + 1}, retrying in ${Math.round(delay)}ms...`);
                    await new Promise(r => setTimeout(r, delay));
                    attempt++;
                    continue;
                } else {
                    return { ok: false, status: res.status, error: `Exhausted retries. Last status: ${res.status}` };
                }
            }

            return { ok: false, status: res.status, error: `Unexpected status: ${res.status}` };

        } catch (error) {
            if (attempt < maxRetries) {
                const delay = Math.min(INITIAL_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500, MAX_DELAY_MS);
                console.log(`[gemini-retry] Network/Timeout error (${error.message}), retrying in ${Math.round(delay)}ms...`);
                await new Promise(r => setTimeout(r, delay));
                attempt++;
                continue;
            } else {
                return { ok: false, status: 0, error: `Network error or timeout: ${error.message}` };
            }
        }
    }
}

function extractGeminiText(geminiJson, fallback = '') {
    const parts = geminiJson?.candidates?.[0]?.content?.parts || [];
    const part = parts.find(p => p.text && !p.thought) || parts.find(p => p.text);
    return part?.text || fallback;
}

module.exports = { callGeminiWithRetry, extractGeminiText, PRIMARY_MODEL, FALLBACK_MODEL };
