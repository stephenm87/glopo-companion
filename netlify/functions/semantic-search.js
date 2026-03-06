// Semantic Case Study Search — Gemini Embeddings API
// Replaces Vertex AI textembedding-gecko with gemini text-embedding-004
// Uses the same GEMINI_API_KEY already configured for all other functions.

const CASE_SUMMARIES = [
    { name: "South China Sea Dispute", summary: "China territorial claims nine-dash line sovereignty power realism maritime security Philippines UNCLOS freedom of navigation military conflict" },
    { name: "Russia-Ukraine War", summary: "Russia invasion Ukraine sovereignty territorial integrity NATO expansion realism liberalism humanitarian crisis conflict war security power" },
    { name: "Syrian Civil War & R2P", summary: "Syria civil war humanitarian intervention responsibility to protect sovereignty human rights refugees Assad conflict United Nations legitimacy" },
    { name: "Venezuela Collapse", summary: "Venezuela economic collapse authoritarian development poverty inequality sovereignty legitimacy democracy Maduro sanctions hyperinflation" },
    { name: "US-China Trade War", summary: "Trade war tariffs economic interdependence globalization WTO sanctions technology decoupling great power competition economy" },
    { name: "Afghan War & State-Building", summary: "Afghanistan Taliban intervention statebuilding sovereignty legitimacy human rights women development security failure peacekeeping" },
    { name: "Israel-Palestine Conflict", summary: "Israel Palestine occupation sovereignty human rights humanitarian security two-state solution UN legitimacy power realism constructivism" },
    { name: "Paris Climate Agreement", summary: "Climate change environment sustainability interdependence multilateralism sovereignty emissions COP26 development inequality technology" },
    { name: "North Korea Nuclear Program", summary: "North Korea nuclear weapons security proliferation sanctions legitimacy sovereignty deterrence realism Kim Jong Un denuclearization" },
    { name: "Rwanda Genocide", summary: "Rwanda genocide ethnic conflict humanitarian intervention responsibility to protect sovereignty human rights peacekeeping legitimacy failure" },
    { name: "Iran Nuclear Deal (JCPOA)", summary: "Iran nuclear weapons sanctions multilateral diplomacy sovereignty security realism liberalism Non-Proliferation Treaty power" },
    { name: "Brexit & EU Sovereignty", summary: "Brexit European Union sovereignty interdependence globalization trade economy nationalism identity liberalism integration" },
    { name: "Arab Spring", summary: "Arab Spring democracy sovereignty legitimacy human rights protest revolution Egypt Libya Syria authoritarian regime change identity" },
    { name: "COVID-19 Pandemic Response", summary: "COVID pandemic health global governance interdependence sovereignty borders multilateral WHO development inequality technology" },
    { name: "Rohingya Crisis", summary: "Myanmar Rohingya ethnic cleansing genocide sovereignty human rights humanitarian legitimacy responsibility to protect stateless identity ASEAN" },
    // ── 2025–2026 Current Affairs ──────────────────────────────────────────────
    { name: "US & Israel Strikes on Iran (2026)", summary: "US Israel Iran nuclear strikes Operation Epic Fury preemptive military sovereignty legitimacy unilateral intervention security power 2026" },
    { name: "Venezuela: Maduro Captured (2025)", summary: "Venezuela Maduro captured authoritarian regime change legitimacy sovereignty democracy sanctions ICC accountability Latin America 2025" },
    { name: "Sudan Civil War & Humanitarian Crisis", summary: "Sudan civil war RSF SAF humanitarian crisis famine displacement R2P sovereignty ethnic conflict development equality peacekeeping" },
    { name: "Gaza Ceasefire & Reconstruction", summary: "Gaza ceasefire Israel Palestine Hamas hostages reconstruction humanitarian law sovereignty legitimacy two-state UN intervention 2025" },
    { name: "Trump Tariff Shock & Global Trade (2025)", summary: "Trump tariffs US trade war protectionism WTO globalization interdependence economic sovereignty China EU retaliation 2025" },
];

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
}

async function getEmbedding(text, apiKey) {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'models/text-embedding-004',
                content: { parts: [{ text }] },
                taskType: 'SEMANTIC_SIMILARITY'
            })
        }
    );
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini embedding error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.embedding.values;
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { query, topK = 3 } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured.' }) };
        }

        // Embed the query and all cases in parallel
        const [queryEmbedding, ...caseEmbeddings] = await Promise.all([
            getEmbedding(query, apiKey),
            ...CASE_SUMMARIES.map(c => getEmbedding(c.summary, apiKey))
        ]);

        // Rank by cosine similarity
        const scored = CASE_SUMMARIES
            .map((c, i) => ({ name: c.name, score: cosineSimilarity(queryEmbedding, caseEmbeddings[i]) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ results: scored })
        };

    } catch (error) {
        console.error('Semantic search error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Semantic search failed: ' + error.message })
        };
    }
};
