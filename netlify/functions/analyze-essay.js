// analyze-essay.js — Deep Critique for Mock Exam Zone
// Uses native fetch (no SDK) to call Gemini REST API + optional Cloud NL API
const { callGeminiWithRetry } = require('./gemini-retry');

// Cloud Natural Language API — extract entities + sentiment from essay
async function analyzeWithNlApi(text, apiKey) {
    try {
        const nlEndpoint = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`;
        const sentEndpoint = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;
        const doc = { document: { type: 'PLAIN_TEXT', content: text } };

        const [entityRes, sentRes] = await Promise.all([
            fetch(nlEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) }),
            fetch(sentEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) })
        ]);

        let entitySummary = null;
        let sentimentSummary = null;

        if (entityRes.ok) {
            const data = await entityRes.json();
            const top = (data.entities || [])
                .sort((a, b) => b.salience - a.salience)
                .slice(0, 5)
                .map(e => `${e.name} (${e.type}, salience: ${(e.salience * 100).toFixed(0)}%)`)
                .join(', ');
            const people = (data.entities || []).filter(e => e.type === 'PERSON').length;
            const orgs = (data.entities || []).filter(e => e.type === 'ORGANIZATION').length;
            const locations = (data.entities || []).filter(e => e.type === 'LOCATION').length;
            const events = (data.entities || []).filter(e => e.type === 'EVENT').length;
            entitySummary = { top, counts: { people, orgs, locations, events }, total: (data.entities || []).length };
        }

        if (sentRes.ok) {
            const data = await sentRes.json();
            const score = data.documentSentiment?.score ?? null;
            const magnitude = data.documentSentiment?.magnitude ?? null;
            sentimentSummary = { score, magnitude };
        }

        return { entitySummary, sentimentSummary };
    } catch (err) {
        console.warn('NL API error (non-fatal):', err.message);
        return { entitySummary: null, sentimentSummary: null };
    }
}

function buildAoInsights(entitySummary, sentimentSummary) {
    if (!entitySummary && !sentimentSummary) return '';

    const lines = ['\n\n---\n## 📊 AO Insights (Cloud NL Analysis)'];

    if (entitySummary) {
        const { counts, total, top } = entitySummary;
        const density = total >= 8 ? '✅ High (Band 3 AO1)' : total >= 4 ? '⚠️ Moderate (Band 2)' : '❌ Low (Band 1–2)';
        lines.push(`**AO1 — Entity Density:** ${density} · ${total} named entities detected.`);
        lines.push(`Top entities: ${top}`);
        lines.push(`Breakdown: ${counts.people} people · ${counts.orgs} organisations · ${counts.locations} locations · ${counts.events} events`);
    }

    if (sentimentSummary?.score !== null) {
        const { score, magnitude } = sentimentSummary;
        const balanced = Math.abs(score) < 0.2 ? '✅ Balanced (AO3 Band 3)' : score > 0.2 ? '⚠️ Positively skewed — counter-argument may be weak' : '⚠️ Negatively skewed — consider adding a concession';
        const depth = magnitude > 1.5 ? '✅ High argumentative depth' : '⚠️ Low argumentative depth — expand evaluative language';
        lines.push(`\n**AO3 — Argumentative Balance:** ${balanced}`);
        lines.push(`Sentiment score: ${score.toFixed(2)} · Magnitude: ${magnitude?.toFixed(2)} · ${depth}`);
    }

    return lines.join('\n');
}

async function callGemini(prompt, apiKey) {
    const body = {
        system_instruction: {
            parts: [{
                text: `You are an IB Global Politics Senior Examiner for the 2026 syllabus. 
Your goal is to provide constructive, pedagogically sound, and strictly unbiased feedback. 
Maintain a neutral, academic tone. Avoid taking ideological sides; instead, evaluate the student's ability to synthesize competing perspectives (e.g., Realism vs. Liberalism). 
Always identify how the 4 core concepts (Power, Sovereignty, Legitimacy, Interdependence) are applied.`
            }]
        },
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }]
    };

    const primaryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await callGeminiWithRetry(primaryUrl, body, { fallbackUrl });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${errText.substring(0, 200)}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { essayText, questionText, marks } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;
        const nlApiKey = process.env.GOOGLE_NL_API_KEY || apiKey;

        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return { statusCode: 500, body: JSON.stringify({ error: 'Gemini API Key not configured.' }) };
        }

        const prompt = `
Question: ${questionText}
Marks Available: ${marks || 15}

Student Response:
${essayText}

Please provide a rigorous assessment.

REQUIRED SECTIONS:
## Glow
[Key strengths in knowledge, analysis, and evaluation.]

## Grow
[Specific actionable areas for improvement based on the 2026 IB Rubric.]

## Alternative Perspectives
[Crucially, provide 2-3 'alternative ways' of responding to this specific prompt. Suggest different theoretical lenses (e.g., "A feminist Critique would focus on...") or different case studies that would offer a counter-argument to the student's current position. Keep this unbiased and constructive.]

## Synthesis Guidance
[A one-sentence 'golden tip' on how to bridge these perspectives for a higher mark band.]
`;

        // Run Gemini + NL API in parallel
        let [geminiText, nlResult] = await Promise.all([
            callGemini(prompt, apiKey),
            analyzeWithNlApi(essayText, nlApiKey)
        ]);

        // Append NL API AO insights
        const aoInsights = buildAoInsights(nlResult.entitySummary, nlResult.sentimentSummary);
        if (aoInsights) geminiText += aoInsights;

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysis: geminiText })
        };

    } catch (error) {
        console.error('Gemini Analysis Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to analyze essay. ' + error.message })
        };
    }
};
