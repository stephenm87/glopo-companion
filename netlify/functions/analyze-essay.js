const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { essayText, questionText, marks } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Gemini API Key not configured." })
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: `You are an IB Global Politics Senior Examiner for the 2026 syllabus. 
            Your goal is to provide constructive, pedagogically sound, and strictly unbiased feedback. 
            Maintain a neutral, academic tone. Avoid taking ideological sides; instead, evaluate the student's ability to synthesize competing perspectives (e.g., Realism vs. Liberalism). 
            Always identify how the 4 core concepts (Power, Sovereignty, Legitimacy, Interdependence) are applied.`
        });

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ analysis: text })
        };

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to analyze essay. " + error.message })
        };
    }
};
