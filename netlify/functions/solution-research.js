// Solution Research Bot — Gemini-powered step evaluation and research for P3 Q2
// Supports per-step evaluation, research search, and tiered draft generation.
const { callGeminiWithRetry } = require('./gemini-retry');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { mode, step, inputs } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };

        let prompt = '';

        if (mode === 'evaluate') {
            const EVAL_PROMPTS = {
                1: `You are an IB Global Politics exam coach evaluating a student's problem statement for Paper 3 Q2.\n\nStudent's problem statement: "${inputs.text}"\n\nEvaluate for:\n1. Specificity (does it name a location, date, or actor?)\n2. Statistical evidence (does it include a number, percentage, or measurable impact?)\n3. Clarity of the harm (is the injustice/failure clearly named?)\n\nReturn JSON: {"score":1-3,"feedback":"one paragraph of specific feedback","suggestions":["suggestion 1","suggestion 2"],"improved":"a stronger version of their statement if score < 3"}`,

                2: `You are an IB Global Politics exam coach. A student named these actors for their policy solution:\n\n"${inputs.text}"\n\nEvaluate:\n1. Are actors specific (named sub-bodies, not just "the UN")?\n2. Did they name the specific tools each actor controls?\n3. Are the actors appropriate for the problem context?\n\nReturn JSON: {"score":1-3,"feedback":"specific feedback","suggestions":["additional actors or sub-bodies they should consider","specific tools they missed"],"improved":"enhanced version of their actor list"}`,

                3: `You are an IB Global Politics exam coach. A student described this policy mechanism:\n\n"${inputs.text}"\n\nEvaluate:\n1. Is it a concrete, verifiable action (not vague like "help" or "intervene")?\n2. Does it follow a mechanism template (amend/certify/condition/establish)?\n3. Could an observer verify whether this policy was implemented?\n\nReturn JSON: {"score":1-3,"feedback":"specific feedback on how to make the mechanism more precise","suggestions":["improvement 1","improvement 2"],"improved":"a stronger version of their mechanism"}`,

                4: `You are an IB Global Politics exam coach. A student provided this rationale:\n\n"${inputs.text}"\n\nEvaluate:\n1. Does it cite a precedent (historical example)?\n2. Does it reference an existing system or framework?\n3. Does it include data showing urgency?\n\nReturn JSON: {"score":1-3,"feedback":"specific feedback","suggestions":["types of evidence they should look for","specific precedents or data points"],"improved":"enhanced rationale"}`,

                5: `You are an IB Global Politics exam coach. A student identified this risk:\n\n"${inputs.text}"\n\nEvaluate:\n1. Is the risk credible and specific to the case?\n2. Does it name a specific actor or dynamic that would cause the obstruction?\n3. Is it categorizable (sovereignty resistance, economic disruption, enforcement gap, or timeline conflict)?\n\nReturn JSON: {"score":1-3,"feedback":"specific feedback","suggestions":["how to make the risk more credible","specific dynamics to consider"],"improved":"stronger risk statement"}`,

                6: `You are an IB Global Politics exam coach. A student proposed this mitigation:\n\n"${inputs.text}"\n\nEvaluate:\n1. Does it name a secondary actor (different from the main actor)?\n2. Is the mitigation mechanism specific and actionable?\n3. Does it directly address the identified risk?\n\nReturn JSON: {"score":1-3,"feedback":"specific feedback","suggestions":["alternative mitigation strategies","secondary actors to consider"],"improved":"stronger mitigation"}`
            };
            prompt = EVAL_PROMPTS[step] || EVAL_PROMPTS[1];

        } else if (mode === 'research') {
            prompt = `You are a research assistant for IB Global Politics Paper 3 Q2. A student is building a policy solution.\n\nTheir problem statement: "${inputs.problem}"\n${inputs.actors ? `Their actors: "${inputs.actors}"` : ''}\n\nGenerate targeted research guidance. Return JSON:\n{"caseContext":"one paragraph summarizing what this case is about and what GPCs it connects to","searchTerms":["5 specific Google search terms that would help find policy mechanisms and evidence"],"keyOrganizations":["3-4 specific organizations, sub-bodies, or frameworks directly relevant"],"usefulData":["3-4 specific statistics, dates, treaties, or precedents the student should know"],"policyPrecedents":["2-3 examples where similar problems were addressed by the international community"]}`;

        } else if (mode === 'draft') {
            prompt = `You are an IB Global Politics senior examiner. A student has completed a solution research sequence for Paper 3 Q2. Using their inputs, generate THREE tiered policy recommendation paragraphs and the elevation moves between them.\n\nStudent Research:\n- Problem: ${inputs.problem}\n- Actors: ${inputs.actors}\n- Mechanism: ${inputs.mechanism}\n- Rationale: ${inputs.rationale || 'not provided'}\n- Risk: ${inputs.risk || 'not provided'}\n- Mitigation: ${inputs.mitigation || 'not provided'}\n\nReturn JSON with this structure:\n{\n  "band34": {"label":"Band 3–4 (Average)","description":"brief description of what this level looks like","text":"the paragraph (80-100 words, vague actor, generic mechanism, no risk)"},\n  "elevation1": ["3-4 specific moves that would elevate from Band 3-4 to Band 5-6"],\n  "band56": {"label":"Band 5–6 (Good)","description":"brief description","text":"the paragraph (120-150 words, specific actor+mechanism+rationale, no risk)"},\n  "elevation2": ["3-4 specific moves that would elevate from Band 5-6 to Band 7"],\n  "band7": {"label":"Band 7 (Exemplar)","description":"brief description","text":"the paragraph (160-200 words, full AMR² with specific evidence, risk acknowledgment, and mitigation naming a secondary actor)"}\n}`;

        } else {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid mode. Use: evaluate, research, or draft' }) };
        }

        const res = await callGeminiWithRetry(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: 'application/json' }
            }
        );

        if (!res.ok) {
            const err = await res.text();
            return { statusCode: 500, body: JSON.stringify({ error: `Gemini error ${res.status}: ${err.substring(0, 200)}` }) };
        }

        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        let parsed;
        try { parsed = JSON.parse(raw); } catch { return { statusCode: 500, body: JSON.stringify({ error: 'Failed to parse AI response' }) }; }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
