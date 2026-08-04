// Solution Research Bot — Gemini-powered step evaluation and research for P3 Q2
// Supports per-step evaluation, research search, and tiered draft generation.
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { z } = require('zod');

const inputSchema = z.object({
  mode: z.enum(['evaluate', 'research', 'draft']),
  step: z.number().min(1).max(6).optional(),
  inputs: z.record(z.string(), z.any())
});

const evalSchema = z.object({
  score: z.number(),
  feedback: z.string(),
  suggestions: z.array(z.string()),
  improved: z.string()
});

const researchSchema = z.object({
  caseContext: z.string(),
  searchTerms: z.array(z.string()),
  keyOrganizations: z.array(z.string()),
  usefulData: z.array(z.string()),
  policyPrecedents: z.array(z.string())
});

const draftSchema = z.object({
  band34: z.object({ label: z.string(), description: z.string(), text: z.string() }),
  elevation1: z.array(z.string()),
  band56: z.object({ label: z.string(), description: z.string(), text: z.string() }),
  elevation2: z.array(z.string()),
  band7: z.object({ label: z.string(), description: z.string(), text: z.string() })
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        let parsedInput;
        try {
            parsedInput = inputSchema.parse(JSON.parse(event.body));
        } catch (err) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: err.errors?.[0]?.message || err.message,
                        field: err.errors?.[0]?.path?.[0] || 'body'
                    }
                })
            };
        }
        const { mode, step, inputs } = parsedInput;
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

        let schemaDefinition = null;
        if (mode === 'evaluate') {
            schemaDefinition = {
                type: 'OBJECT',
                properties: {
                    score: { type: 'INTEGER' },
                    feedback: { type: 'STRING' },
                    suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
                    improved: { type: 'STRING' }
                },
                required: ['score', 'feedback', 'suggestions', 'improved']
            };
        } else if (mode === 'research') {
            schemaDefinition = {
                type: 'OBJECT',
                properties: {
                    caseContext: { type: 'STRING' },
                    searchTerms: { type: 'ARRAY', items: { type: 'STRING' } },
                    keyOrganizations: { type: 'ARRAY', items: { type: 'STRING' } },
                    usefulData: { type: 'ARRAY', items: { type: 'STRING' } },
                    policyPrecedents: { type: 'ARRAY', items: { type: 'STRING' } }
                },
                required: ['caseContext', 'searchTerms', 'keyOrganizations', 'usefulData', 'policyPrecedents']
            };
        } else if (mode === 'draft') {
            schemaDefinition = {
                type: 'OBJECT',
                properties: {
                    band34: { type: 'OBJECT', properties: { label: { type: 'STRING' }, description: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['label', 'description', 'text'] },
                    elevation1: { type: 'ARRAY', items: { type: 'STRING' } },
                    band56: { type: 'OBJECT', properties: { label: { type: 'STRING' }, description: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['label', 'description', 'text'] },
                    elevation2: { type: 'ARRAY', items: { type: 'STRING' } },
                    band7: { type: 'OBJECT', properties: { label: { type: 'STRING' }, description: { type: 'STRING' }, text: { type: 'STRING' } }, required: ['label', 'description', 'text'] }
                },
                required: ['band34', 'elevation1', 'band56', 'elevation2', 'band7']
            };
        }

        const body = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    responseMimeType: 'application/json', 
                    thinkingConfig: { thinkingBudget: 0 },
                    responseSchema: schemaDefinition
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
            if (mode === 'evaluate') parsed = evalSchema.parse(temp);
            else if (mode === 'research') parsed = researchSchema.parse(temp);
            else if (mode === 'draft') parsed = draftSchema.parse(temp);
        } catch (err) { 
            return { statusCode: 500, body: JSON.stringify({ error: 'Validation error: ' + err.message }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
