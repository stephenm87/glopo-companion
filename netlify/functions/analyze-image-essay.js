// analyze-image-essay.js — Essay Vision Analysis via Gemini
// Uses native fetch (no SDK) to avoid missing package issues on Netlify Functions

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

REQUIRED OUTPUT FORMAT:

## 📝 What I Read (Transcription)
[Transcribe the student's written response as accurately as possible. Note any unclear handwriting with [unclear].]

## 🟢 GLOW — Strengths
[2-3 specific strengths citing AO bands]

## 🔴 GROW — Improvements
[2-3 actionable improvements with examples of what better looks like]

## 🔀 Alternative Approaches
[2 alternative theoretical lenses or case studies for this question]

## ⭐ Examiner's Golden Tip
[One precise, actionable tip most likely to raise the mark band]

## 📊 AO Estimate
AO1: [Band 1/2/3] | AO2: [Band 1/2/3] | AO3: [Band 1/2/3] | AO4: [Band 1/2/3]`;

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mimeType, data: imageBase64 } }
                ]
            }]
        };

        const callGemini = async () => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000); // 20s — safely under Netlify's 26s limit
            try {
                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody), signal: controller.signal }
                );
                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Gemini API error ${res.status}: ${errText.substring(0, 200)}`);
                }
                const data = await res.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } finally {
                clearTimeout(timeout);
            }
        };

        let text;
        try {
            text = await callGemini();
        } catch (firstErr) {
            if (firstErr.name === 'AbortError') {
                throw new Error('Analysis timed out — your image may be too large or complex. Try a clearer photo or smaller file.');
            }
            if (firstErr.message.includes('429') || firstErr.message.includes('quota')) {
                await new Promise(r => setTimeout(r, 2000));
                text = await callGemini();
            } else {
                throw firstErr;
            }
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
