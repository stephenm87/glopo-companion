// Case Finder — Gemini-powered IB case study matcher (server-side)
// Updated: JSON output mode for reliable parsing + 5 new 2025-2026 cases
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { z } = require('zod');

const inputSchema = z.object({
  query: z.string().min(5).max(1000)
});

const findCasesSchema = z.array(z.object({
  rank: z.number(),
  name: z.string(),
  relevance: z.string(),
  angle: z.string()
}));

const CASE_POOL = [
    { name: 'South China Sea Dispute', concepts: 'Power, Sovereignty, Security', themes: 'sovereignty power realism maritime security China Philippines military conflict UNCLOS' },
    { name: 'Russia-Ukraine War', concepts: 'Sovereignty, Power, Security', themes: 'sovereignty territorial integrity NATO expansion war realism liberalism humanitarian refugees' },
    { name: 'Syrian Civil War & R2P', concepts: 'Legitimacy, Sovereignty, Human Rights', themes: 'humanitarian intervention R2P sovereignty human rights refugees legitimacy UN veto' },
    { name: 'Venezuela Collapse', concepts: 'Legitimacy, Development, Sovereignty', themes: 'economic collapse authoritarian development poverty inequality sovereignty legitimacy sanctions' },
    { name: 'US-China Trade War', concepts: 'Interdependence, Power, Technology', themes: 'trade war tariffs economic interdependence globalization WTO technology decoupling great power' },
    { name: 'Afghan War & State-Building', concepts: 'Legitimacy, Sovereignty, Development', themes: 'statebuilding intervention sovereignty legitimacy human rights women development security Taliban' },
    { name: 'Israel-Palestine Conflict', concepts: 'Sovereignty, Human Rights, Legitimacy', themes: 'occupation sovereignty human rights humanitarian two-state UN legitimacy power identity' },
    { name: 'Paris Climate Agreement', concepts: 'Interdependence, Sustainability, Equality', themes: 'climate environment sustainability interdependence multilateralism sovereignty emissions development inequality' },
    { name: 'North Korea Nuclear Program', concepts: 'Security, Sovereignty, Power', themes: 'nuclear weapons security proliferation sanctions deterrence realism sovereignty Kim denuclearization' },
    { name: 'Rwanda Genocide', concepts: 'Human Rights, Legitimacy, Sovereignty', themes: 'genocide ethnic conflict humanitarian R2P sovereignty human rights peacekeeping legitimacy failure' },
    { name: 'Iran Nuclear Deal (JCPOA)', concepts: 'Sovereignty, Power, Interdependence', themes: 'nuclear deal diplomacy multilateral sanctions sovereignty Non-Proliferation Treaty realism liberalism' },
    { name: 'Brexit & EU Sovereignty', concepts: 'Sovereignty, Interdependence, Identity', themes: 'Brexit European Union sovereignty interdependence globalization trade nationalism identity liberalism' },
    { name: 'Arab Spring', concepts: 'Legitimacy, Sovereignty, Identity', themes: 'democracy sovereignty legitimacy human rights protest revolution authoritarianism identity regime change' },
    { name: 'COVID-19 Pandemic Response', concepts: 'Interdependence, Health, Equality', themes: 'pandemic health global governance interdependence sovereignty borders WHO development inequality technology' },
    { name: 'Rohingya Crisis', concepts: 'Human Rights, Sovereignty, Identity', themes: 'ethnic cleansing genocide sovereignty human rights humanitarian R2P stateless identity Myanmar ASEAN' },
    // ── 2025–2026 Current Affairs ─────────────────────────────────────────────
    { name: 'US & Israel Strikes on Iran (2026)', concepts: 'Sovereignty, Security, Power', themes: 'US Israel Iran nuclear strikes preemptive military sovereignty unilateral intervention security power 2026' },
    { name: 'Venezuela: Maduro Captured (2025)', concepts: 'Legitimacy, Sovereignty, Democracy', themes: 'Venezuela Maduro captured authoritarian regime change legitimacy sovereignty democracy sanctions ICC 2025' },
    { name: 'Sudan Civil War & Humanitarian Crisis', concepts: 'Human Rights, Sovereignty, Development', themes: 'Sudan civil war RSF humanitarian crisis famine displacement R2P sovereignty ethnic conflict development' },
    { name: 'Gaza Ceasefire & Reconstruction', concepts: 'Sovereignty, Human Rights, Legitimacy', themes: 'Gaza ceasefire Israel Palestine Hamas hostages reconstruction humanitarian law sovereignty legitimacy 2025' },
    { name: 'Trump Tariff Shock & Global Trade (2025)', concepts: 'Interdependence, Power, Equality', themes: 'Trump tariffs US trade war protectionism WTO globalization interdependence economic sovereignty retaliation 2025' },
];

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

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
        const { query } = parsedInput;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }) };
        }

        const caseList = CASE_POOL.map((c, i) => `${i + 1}. ${c.name}: ${c.themes}`).join('\n');
        const prompt = `You are an IB Global Politics teacher. A student's argument:\n\n"${query}"\n\nCase studies available:\n${caseList}\n\nReturn a JSON array of the top 5 most relevant cases (fewer if fewer are genuinely relevant). Each item must have:\n- "rank": integer starting at 1\n- "name": exact case name from the list above\n- "relevance": one sentence explaining why this fits the student's argument\n- "angle": best theoretical lens (Realism/Liberalism/Constructivism/Structuralism)`;

        const body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                responseMimeType: 'application/json', 
                thinkingConfig: { thinkingBudget: 0 },
                responseSchema: {
                    type: 'ARRAY',
                    items: {
                        type: 'OBJECT',
                        properties: {
                            rank: { type: 'INTEGER' },
                            name: { type: 'STRING' },
                            relevance: { type: 'STRING' },
                            angle: { type: 'STRING' }
                        },
                        required: ['rank', 'name', 'relevance', 'angle']
                    }
                }
            }
        };

        const res = await callGeminiWithRetry(apiKey, body);

        if (!res.ok) {
            return { statusCode: 500, body: JSON.stringify({ error: `Gemini error ${res.status}: ${res.error}` }) };
        }

        const data = res.data;
        const raw = extractGeminiText(data, '[]');
        let parsed;
        try {
            parsed = JSON.parse(raw);
            const resultsData = Array.isArray(parsed) ? parsed : parsed.results || [];
            parsed = findCasesSchema.parse(resultsData);
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Validation error: ' + err.message }) };
        }
        const results = parsed;
        const enriched = results.map(r => {
            const match = CASE_POOL.find(c => c.name === r.name);
            return { ...r, concepts: match?.concepts || '' };
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ results: enriched })
        };

    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
