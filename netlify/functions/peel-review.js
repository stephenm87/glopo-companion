// PEEL / Intro Paragraph Review — returns structured JSON feedback (server-side Gemini)
// Supports a customPrompt for non-PEEL review modes (e.g. intro review)
const { callGeminiWithRetry } = require('./gemini-retry');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { paragraph, customPrompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }) };

        // If a custom prompt is provided (e.g. from intro review), use it directly
        const prompt = customPrompt || `You are an IB Global Politics senior examiner reviewing a student's PEEL paragraph.

Student paragraph:
"${paragraph}"

Rewrite it to Band 7 standard (keeping the student's argument and case study), then list every specific improvement made.

Return a JSON object with these exact fields:
- "improved": the full rewritten paragraph at Band 7 standard (complete prose, not bullet points)
- "bandJump": e.g. "Band 4 → Band 6-7"
- "changes": an array of 3–5 objects, each with:
  - "ao": one of "AO1", "AO2", "AO3", "AO4"
  - "label": short label e.g. "Evidence Specificity"
  - "original": exact phrase from the student's paragraph (or describe the gap if missing)
  - "fix": what was changed and why, in one sentence

Rules:
- "improved" must be a complete standalone paragraph
- Each "changes" item must quote actual student words in "original"`;

        const body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: 'application/json' }
        };

        const primaryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const res = await callGeminiWithRetry(primaryUrl, body, { fallbackUrl });

        if (!res.ok) {
            const err = await res.text();
            return { statusCode: 500, body: JSON.stringify({ error: `Gemini error ${res.status}: ${err.substring(0, 200)}` }) };
        }

        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            // JSON mode should always return valid JSON, but handle parse failure
            return { statusCode: 500, body: JSON.stringify({ error: 'Failed to parse AI response' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ original: paragraph, ...parsed })
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};

