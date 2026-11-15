// analyze-image-essay.js — Essay Vision Analysis via Gemini
// Uses native fetch (no SDK) to avoid missing package issues on Netlify Functions
const { callGeminiWithRetry, extractGeminiText, PRIMARY_MODEL } = require('./gemini-retry');
const { protectEndpoint } = require('./security');
const { z } = require('zod');
const {
    ALLOWED_MIME_TYPES,
    MAX_DECODED_BYTES,
    estimateBase64Bytes,
    isValidBase64,
    hasExpectedFileSignature,
    inspectPdf,
    formatValidationError
} = require('./validation-helper');

const inputSchema = z.object({
    imageBase64: z.string()
        .min(10)
        .refine(isValidBase64, { message: 'imageBase64 contains invalid characters.' })
        .refine(
            (val) => estimateBase64Bytes(val) <= MAX_DECODED_BYTES,
            { message: `Decoded image exceeds ${MAX_DECODED_BYTES} bytes (4 MB).` }
        ),
    mimeType: z.enum(ALLOWED_MIME_TYPES),
    questionText: z.string().max(500).optional().default(''),
    marks: z.number().min(1).max(25).optional().default(15),
    consentConfirmed: z.literal(true)
}).superRefine((value, ctx) => {
    if (!hasExpectedFileSignature(value.imageBase64, value.mimeType)) {
        ctx.addIssue({ code: 'custom', path: ['imageBase64'], message: 'File contents do not match the declared file type.' });
        return;
    }
    if (value.mimeType === 'application/pdf') {
        const pdf = inspectPdf(value.imageBase64);
        if (pdf.encrypted) ctx.addIssue({ code: 'custom', path: ['imageBase64'], message: 'Encrypted PDFs are not supported.' });
        if (pdf.pageCount > 25) ctx.addIssue({ code: 'custom', path: ['imageBase64'], message: 'PDFs are limited to 25 pages.' });
    }
});

const outputSchema = z.object({
    transcription: z.string(),
    transcriptionConfidence: z.enum(['high', 'medium', 'low']).optional().default('medium'),
    uncertainPassages: z.array(z.string()).max(10).optional().default([]),
    glow: z.string(),
    grow: z.string(),
    alternativeApproaches: z.string(),
    goldenTip: z.string(),
    aoEstimate: z.string()
});

exports.handler = async (event) => {
    const security = await protectEndpoint(event, { maxRequests: 8 });
    if (security.response) return security.response;

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        let parsedInput;
        try {
            parsedInput = inputSchema.parse(JSON.parse(event.body));
        } catch (err) {
            return formatValidationError(err);
        }
        const { imageBase64, mimeType, questionText, marks } = parsedInput;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return { statusCode: 500, body: JSON.stringify({ error: 'Gemini API Key not configured.' }) };
        }

        const IB_RUBRIC = `IB GLOBAL POLITICS 2026 — ASSESSMENT CRITERIA:
AO1 — KNOWLEDGE & UNDERSTANDING: Accurate, specific named cases, dates, treaties, statistics.
AO2 — APPLICATION & ANALYSIS: Named IR theory consistently applied with analytical connectives.
AO3 — SYNTHESIS & EVALUATION: Competing perspectives synthesised; counter-argument addressed; evaluative judgement reached.
AO4 — KEY CONCEPTS: Power, Sovereignty, Legitimacy, Interdependence — defined in context and used analytically throughout.`;

        const prompt = `You are an IB Global Politics Senior Examiner. A student has photographed their handwritten or printed exam response.

First, carefully read and transcribe the visible essay text from the image. Then provide examiner-level feedback.

${questionText ? `EXAM QUESTION: ${questionText}` : 'No specific question provided — assess general IB Global Politics quality.'}
MARKS AVAILABLE: ${marks || 15}

${IB_RUBRIC}

REQUIRED OUTPUT FORMAT (JSON):
Return a JSON object with these EXACT string keys:
"transcription": [Transcribe the student's written response as accurately as possible.]
"transcriptionConfidence": [high, medium, or low]
"uncertainPassages": [A JSON array of short passages that were difficult to read; use an empty array if none.]
"glow": [2-3 specific strengths citing AO bands]
"grow": [2-3 actionable improvements with examples of what better looks like]
"alternativeApproaches": [2 alternative theoretical lenses or case studies for this question]
"goldenTip": [One precise, actionable tip most likely to raise the mark band]
"aoEstimate": [AO1: Band X | AO2: Band X | AO3: Band X | AO4: Band X]`;

        const body = {
            generationConfig: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingBudget: 0 },
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        transcription: { type: 'STRING' },
                        transcriptionConfidence: { type: 'STRING', enum: ['high', 'medium', 'low'] },
                        uncertainPassages: { type: 'ARRAY', items: { type: 'STRING' } },
                        glow: { type: 'STRING' },
                        grow: { type: 'STRING' },
                        alternativeApproaches: { type: 'STRING' },
                        goldenTip: { type: 'STRING' },
                        aoEstimate: { type: 'STRING' }
                    },
                    required: ['transcription', 'transcriptionConfidence', 'uncertainPassages', 'glow', 'grow', 'alternativeApproaches', 'goldenTip', 'aoEstimate']
                }
            },
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mimeType, data: imageBase64 } }
                ]
            }]
        };

        const res = await callGeminiWithRetry(apiKey, body, { maxRetries: 1, timeout: 20000 });

        if (!res.ok) {
            throw new Error(`Gemini API error ${res.status}: ${res.error}`);
        }

        const raw = extractGeminiText(res.data, '{}');
        let feedback;
        try {
            feedback = outputSchema.parse(JSON.parse(raw));
        } catch (err) {
            throw new Error('Validation error: ' + err.message);
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                feedback,
                meta: {
                    model: PRIMARY_MODEL,
                    formativeOnly: true,
                    rubricVersion: 'repository-rubric-2026',
                    processedAt: new Date().toISOString()
                }
            })
        };

    } catch (error) {
        console.error('Image Essay Analysis Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to analyse image: ' + error.message })
        };
    }
};
