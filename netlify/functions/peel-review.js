// PEEL / Intro Paragraph Review — returns structured JSON feedback (server-side Gemini)
// Supports a customPrompt for non-PEEL review modes (e.g. intro review)
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { protectEndpoint } = require('./security');
const { z } = require('zod');
const { formatValidationError } = require('./validation-helper');

const inputSchema = z.object({
  paragraph: z.string().min(10).max(3000),
  mode: z.enum(['peel', 'intro']).optional().default('peel'),
  customPrompt: z.string().max(6000).optional()
});

const peelSchema = z.object({
  improved: z.string(),
  bandJump: z.string(),
  changes: z.array(z.object({
    ao: z.string(),
    label: z.string(),
    original: z.string(),
    fix: z.string()
  })),
  score: z.string().optional(),
  strengths: z.array(z.string()).max(4).optional()
});

exports.handler = async (event) => {
    const security = await protectEndpoint(event, { maxRequests: 15 });
    if (security.response) return security.response;

    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        let parsedInput;
        try {
            parsedInput = inputSchema.parse(JSON.parse(event.body));
        } catch (err) {
            return formatValidationError(err);
        }
        const { paragraph, mode, customPrompt } = parsedInput;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }) };

        const introPrompt = `You are reviewing a student's IB Global Politics essay introduction for formative practice. Do not present the result as an official IB grade.

Student introduction:
"${paragraph}"

Return an improved 80–120 word introduction that preserves the student's position and voice. Identify 2–4 concrete strengths and 3–5 specific changes. Label changes with AO1, AO2, AO3, or AO4. Include a formative score label such as "Developing", "Secure", or "Advanced" and a concise bandJump description. Evaluate hook specificity, contextual concept definition, analytical tension, case integration, thesis strength, and roadmap clarity.`;

        const prompt = customPrompt || (mode === 'intro' ? introPrompt : `You are an IB Global Politics senior examiner reviewing a student's PEEL paragraph.

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
- Each "changes" item must quote actual student words in "original"`);

        const body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                responseMimeType: 'application/json', 
                thinkingConfig: { thinkingBudget: 0 },
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        improved: { type: 'STRING' },
                        bandJump: { type: 'STRING' },
                        changes: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: {
                                    ao: { type: 'STRING' },
                                    label: { type: 'STRING' },
                                    original: { type: 'STRING' },
                                    fix: { type: 'STRING' }
                                },
                                required: ['ao', 'label', 'original', 'fix']
                            }
                        },
                        score: { type: 'STRING' },
                        strengths: { type: 'ARRAY', items: { type: 'STRING' } }
                    },
                    required: ['improved', 'bandJump', 'changes']
                }
            }
        };

        const res = await callGeminiWithRetry(apiKey, body);

        if (!res.ok) {
            return { statusCode: 500, body: JSON.stringify({ error: `Gemini error ${res.status}: ${res.error}` }) };
        }

        const data = res.data;
        const raw = extractGeminiText(data, '{}');
        let parsed;
        try {
            const temp = JSON.parse(raw);
            parsed = peelSchema.parse(temp);
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Validation error: ' + err.message }) };
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
