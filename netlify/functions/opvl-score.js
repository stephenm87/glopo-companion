const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { protectEndpoint } = require('./security');
const { z } = require('zod');
const { formatValidationError } = require('./validation-helper');

const componentSchema = z.object({
    origin: z.string().min(1).max(2500),
    purpose: z.string().min(1).max(2500),
    value: z.string().min(1).max(2500),
    limitation: z.string().min(1).max(2500)
});

const inputSchema = z.object({
    sourceTitle: z.string().min(1).max(500),
    sourceExcerpt: z.string().max(5000).optional().default(''),
    response: componentSchema,
    modelResponse: componentSchema
});

const outputSchema = z.object({
    overall_band: z.string().min(1),
    scores: z.object({
        origin: z.number().int().min(1).max(4),
        purpose: z.number().int().min(1).max(4),
        value: z.number().int().min(1).max(4),
        limitation: z.number().int().min(1).max(4)
    }),
    strengths: z.array(z.string()).max(4),
    improvements: z.array(z.string()).max(4),
    examiner_tip: z.string().min(1)
});

exports.handler = async (event) => {
    const security = await protectEndpoint(event, { maxRequests: 12 });
    if (security.response) return security.response;
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        let input;
        try {
            input = inputSchema.parse(JSON.parse(event.body));
        } catch (error) {
            return formatValidationError(error);
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return { statusCode: 503, body: JSON.stringify({ error: 'OPVL scoring is not configured.' }) };

        const prompt = `Give formative feedback on a student's OPVL source analysis. This is practice feedback, not an official IB grade.

SOURCE TITLE: ${input.sourceTitle}
SOURCE EXCERPT: ${input.sourceExcerpt}

STUDENT RESPONSE:
${JSON.stringify(input.response)}

REFERENCE RESPONSE:
${JSON.stringify(input.modelResponse)}

Score origin, purpose, value, and limitation from 1 to 4. Reward source-specific reasoning, provenance, audience, contextual value, and concrete limits. Return a suggested overall_band label, strengths, improvements, and one examiner_tip.`;

        const result = await callGeminiWithRetry(apiKey, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingBudget: 0 },
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        overall_band: { type: 'STRING' },
                        scores: {
                            type: 'OBJECT',
                            properties: {
                                origin: { type: 'INTEGER', minimum: 1, maximum: 4 },
                                purpose: { type: 'INTEGER', minimum: 1, maximum: 4 },
                                value: { type: 'INTEGER', minimum: 1, maximum: 4 },
                                limitation: { type: 'INTEGER', minimum: 1, maximum: 4 }
                            },
                            required: ['origin', 'purpose', 'value', 'limitation']
                        },
                        strengths: { type: 'ARRAY', items: { type: 'STRING' } },
                        improvements: { type: 'ARRAY', items: { type: 'STRING' } },
                        examiner_tip: { type: 'STRING' }
                    },
                    required: ['overall_band', 'scores', 'strengths', 'improvements', 'examiner_tip']
                }
            }
        }, { maxRetries: 1, timeout: 12000 });

        if (!result.ok) return { statusCode: 502, body: JSON.stringify({ error: 'OPVL provider unavailable.' }) };
        const output = outputSchema.parse(JSON.parse(extractGeminiText(result.data, '{}')));
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(output) };
    } catch (error) {
        console.error('[opvl-score]', error.message);
        return { statusCode: 500, body: JSON.stringify({ error: 'OPVL scoring failed.' }) };
    }
};
