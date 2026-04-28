// generate-intro.js — Intro Builder Netlify function
// Uses native fetch (no SDK) to avoid missing package issues on Netlify Functions
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { concept, definition, caseA, caseB, thesis } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return { statusCode: 500, body: JSON.stringify({ error: 'Gemini API Key not configured.' }) };
        }

        const prompt = `Write a model introduction paragraph for an IB Global Politics Paper 2 essay using ONLY the following student inputs:

KEY CONCEPT: ${concept}
STUDENT'S DEFINITION: ${definition}
CASE STUDY A: ${caseA}
CASE STUDY B: ${caseB}
STUDENT'S THESIS: ${thesis}

REQUIREMENTS:
1. Open with a contextual hook that is SPECIFIC to the concept "${concept}" — not a generic opener. Reference a real-world tension, trend, or paradox directly related to this concept.
2. Define the concept using the student's own definition, weaving it naturally into the paragraph (not as a standalone dictionary entry).
3. Frame the central analytical tension or debate around "${concept}" — identify the competing perspectives relevant to THIS concept (e.g., for Sovereignty: statist vs globalist; for Development: modernization vs dependency; for Peace: negative vs positive peace). Do NOT default to "globalist vs statist" for every concept.
4. Introduce both case studies ("${caseA}" and "${caseB}") with a brief phrase explaining WHY each is relevant to the argument — don't just name-drop them.
5. Integrate the student's thesis naturally as the essay's central claim.
6. End with a brief roadmap sentence that signals the analytical direction.

OUTPUT: Write ONLY the introduction paragraph in quotation marks. No headers, no bullet points, no meta-commentary. Keep it between 80-120 words. Write in a formal academic register appropriate for an IB examination.`;

        const body = {
            system_instruction: {
                parts: [{
                    text: `You are an IB Global Politics essay writing coach for the 2026 syllabus. 
You help students craft exemplary introduction paragraphs for Paper 2 essays. 
Your introductions should be academically rigorous, analytically sharp, and demonstrate the "Golden Thread" structure that examiners reward.
You must adapt your language, framing, and analytical tension to the SPECIFIC concept, definition, and case studies provided — never use a generic template.`
                }]
            },
            contents: [{ parts: [{ text: prompt }] }]
        };

        const primaryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const res = await callGeminiWithRetry(primaryUrl, body, { fallbackUrl });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Gemini API error ${res.status}: ${errText.substring(0, 200)}`);
        }
        const data = await res.json();
        const text = extractGeminiText(data, '');

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intro: text })
        };

    } catch (error) {
        console.error('Intro Generation Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate introduction. ' + error.message })
        };
    }
};
