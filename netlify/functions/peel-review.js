// PEEL Paragraph Review — returns improved version + change explanations (server-side Gemini)
// Uses response_mime_type: application/json for reliable structured output

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { paragraph } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }) };

        const prompt = `You are an IB Global Politics senior examiner reviewing a student's PEEL paragraph.

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

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        );

        if (!res.ok) {
            const err = await res.text();
            return { statusCode: 500, body: JSON.stringify({ error: `Gemini error ${res.status}: ${err.substring(0, 200)}` }) };
        }

        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(raw); // JSON mode guarantees valid JSON — no stripping needed

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ original: paragraph, ...parsed })
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
