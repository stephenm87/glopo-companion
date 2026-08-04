// analyze-image-essay.js — Essay Vision Analysis via Gemini
// Uses native fetch (no SDK) to avoid missing package issues on Netlify Functions
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { z } = require('zod');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { imageBase64, mimeType, questionText, marks } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return { statusCode: 500, body: JSON.stringify({ error: 'Gemini API Key not configured.' }) };
        }

        if (!imageBase64 || !mimeType) {
            return { statusCode: 400, body: JSON.stringify({ error: 'File data missing.' }) };
        }

        const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
        if (!SUPPORTED_TYPES.includes(mimeType)) {
            return { statusCode: 400, body: JSON.stringify({ error: `Unsupported file type: ${mimeType}. Please upload an image or PDF.` }) };
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
"glow": [2-3 specific strengths citing AO bands]
"grow": [2-3 actionable improvements with examples of what better looks like]
"alternativeApproaches": [2 alternative theoretical lenses or case studies for this question]
"goldenTip": [One precise, actionable tip most likely to raise the mark band]
"aoEstimate": [AO1: Band X | AO2: Band X | AO3: Band X | AO4: Band X] | AO2: [Band 1/2/3] | AO3: [Band 1/2/3] | AO4: [Band 1/2/3]`;

        const body = {
        generationConfig: {
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 0 },
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    transcription: { type: 'STRING' },
                    glow: { type: 'STRING' },
                    grow: { type: 'STRING' },
                    alternativeApproaches: { type: 'STRING' },
                    goldenTip: { type: 'STRING' },
                    aoEstimate: { type: 'STRING' }
                },
                required: ['transcription', 'glow', 'grow', 'alternativeApproaches', 'goldenTip', 'aoEstimate']
            }
        },
        
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mimeType, data: imageBase64 } }
                ]
            }]
        
    };

    const res = await callGeminiWithRetry(apiKey, body);

    if (!res.ok) {
        throw new Error(`Gemini API error ${res.status}: ${res.error}`);
    }

    const raw = extractGeminiText(res.data, '{}');
    let text = '';
    try {
        const parsed = JSON.parse(raw);
        text = `## 📝 What I Read (Transcription)\n${parsed.transcription}\n\n## 🟢 GLOW — Strengths\n${parsed.glow}\n\n## 🔴 GROW — Improvements\n${parsed.grow}\n\n## 🔀 Alternative Approaches\n${parsed.alternativeApproaches}\n\n## ⭐ Examiner's Golden Tip\n${parsed.goldenTip}\n\n## 📊 AO Estimate\n${parsed.aoEstimate}`;
    } catch (err) {
        throw new Error('Validation error: ' + err.message);
    }


        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysis: text })
        };

    } catch (error) {
        console.error('Image Essay Analysis Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to analyse image: ' + error.message })
        };
    }
};
