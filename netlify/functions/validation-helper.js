/**
 * Shared validation utilities for Netlify function endpoints.
 */

/** Allowed MIME types for image/PDF upload. Single source of truth. */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

/** Maximum decoded binary size in bytes (4 MB). */
const MAX_DECODED_BYTES = 4 * 1024 * 1024;

/**
 * Estimates the decoded byte size of a base64 string.
 * @param {string} value - The base64-encoded string.
 * @returns {number} Estimated decoded byte count.
 */
function estimateBase64Bytes(value) {
    const clean = value.replace(/\s/g, '');
    const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
    return Math.floor((clean.length * 3) / 4) - padding;
}

/**
 * Validates that a string contains only valid base64 characters.
 * @param {string} value - The base64-encoded string.
 * @returns {boolean} True if valid base64 format.
 */
function isValidBase64(value) {
    return /^[A-Za-z0-9+/]*={0,2}$/.test(value.replace(/\s/g, ''));
}

/**
 * Formats a Zod validation error into a standardised HTTP response.
 * Returns HTTP 413 for oversized image payloads, HTTP 400 for all other validation failures.
 */
function formatValidationError(error) {
    const issue = error?.issues?.[0];

    // HTTP 413 Payload Too Large — triggered by the imageBase64 size refinement
    if (issue?.path?.[0] === 'imageBase64' && issue?.code === 'custom' && issue?.message?.includes('exceeds')) {
        return {
            statusCode: 413,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: {
                    code: 'PAYLOAD_TOO_LARGE',
                    message: 'Image data exceeds the maximum allowed size of 4 MB.',
                    field: 'imageBase64'
                }
            })
        };
    }

    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            error: {
                code: 'VALIDATION_ERROR',
                message: issue?.message || error.message || 'Invalid request body.',
                field: issue?.path?.[0] || 'body'
            }
        })
    };
}

module.exports = {
    ALLOWED_MIME_TYPES,
    MAX_DECODED_BYTES,
    estimateBase64Bytes,
    isValidBase64,
    formatValidationError
};
