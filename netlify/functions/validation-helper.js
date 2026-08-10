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
    const clean = value.replace(/[\r\n\t\s]+/g, '');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) return false;
    if (clean.length % 4 !== 0) return false;
    const buf = Buffer.from(clean, 'base64');
    const reencoded = buf.toString('base64');
    return clean === reencoded;
}

function hasExpectedFileSignature(value, mimeType) {
    if (!isValidBase64(value)) return false;
    const bytes = Buffer.from(value, 'base64');
    if (mimeType === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (mimeType === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (mimeType === 'image/webp') return bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
    if (mimeType === 'application/pdf') return bytes.subarray(0, 5).toString('ascii') === '%PDF-';
    return false;
}

function inspectPdf(value) {
    const text = Buffer.from(value, 'base64').toString('latin1');
    return {
        encrypted: /\/Encrypt\b/.test(text),
        pageCount: (text.match(/\/Type\s*\/Page\b/g) || []).length
    };
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
    hasExpectedFileSignature,
    inspectPdf,
    formatValidationError
};
