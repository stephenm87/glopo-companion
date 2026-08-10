const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { protectEndpoint } = require('./security');
const { z } = require('zod');
const { formatValidationError } = require('./validation-helper');

const inputSchema = z.object({
    text: z.string().min(20).max(5000)
});

const outputSchema = z.object({
    detected_skill: z.string().min(1),
    confidence: z.enum(['high', 'medium', 'low']),
    explanation: z.string().min(1),
    upgrade_tip: z.string().min(1)
});

exports.handler = async (event) => {
    const security = await protectEndpoint(event, { maxRequests: 20 });
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
        if (!apiKey) return { statusCode: 503, body: JSON.stringify({ error: 'Command-term analysis is not configured.' }) };

        const prompt = `Evaluate which IB-style command-term skill this paragraph currently demonstrates.

Paragraph:
${input.text}

Use one concise detected_skill label such as Describe, Explain, Analyse, Compare, Evaluate, Examine, Discuss, or To what extent. Confidence must be high, medium, or low. Explain using evidence from the paragraph and give one specific upgrade tip. Do not assign an official IB grade.`;

        const result = await callGeminiWithRetry(apiKey, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingBudget: 0 },
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        detected_skill: { type: 'STRING' },
                        confidence: { type: 'STRING', enum: ['high', 'medium', 'low'] },
                        explanation: { type: 'STRING' },
                        upgrade_tip: { type: 'STRING' }
                    },
                    required: ['detected_skill', 'confidence', 'explanation', 'upgrade_tip']
                }
            }
        }, { maxRetries: 1, timeout: 12000 });

        if (!result.ok) return { statusCode: 502, body: JSON.stringify({ error: 'Command-term provider unavailable.' }) };
        const output = outputSchema.parse(JSON.parse(extractGeminiText(result.data, '{}')));
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(output) };
    } catch (error) {
        console.error('[command-term-check]', error.message);
        return { statusCode: 500, body: JSON.stringify({ error: 'Command-term analysis failed.' }) };
    }
};
