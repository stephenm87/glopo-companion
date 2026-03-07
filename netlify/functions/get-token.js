// get-token.js — Returns the Gemini API key for browser-direct calls
// Used by large file uploads (>1MB) that bypass the Netlify function timeout
// Security: same level as REACT_APP_ env var — key is accessible to anyone using the site

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured.' }) };
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
        body: JSON.stringify({ key: apiKey })
    };
};
