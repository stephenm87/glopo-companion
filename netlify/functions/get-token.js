// get-token.js — Returns the Gemini API key for browser-direct calls
// Used by large file uploads (>1MB) that bypass the Netlify function timeout
//
// Security: Restricted to same-origin requests via Referer check.
// The API key should also be restricted in GCP Console (see README).

const ALLOWED_ORIGINS = [
    'https://glopocompanion.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001',
];

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // --- Origin / Referer check ---
    const origin = event.headers['origin'] || '';
    const referer = event.headers['referer'] || '';
    const isAllowed = ALLOWED_ORIGINS.some(o =>
        origin.startsWith(o) || referer.startsWith(o)
    );

    if (!isAllowed && process.env.NODE_ENV !== 'development') {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Forbidden — origin not allowed.' })
        };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured.' }) };
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': origin || ALLOWED_ORIGINS[0],
        },
        body: JSON.stringify({ key: apiKey })
    };
};
