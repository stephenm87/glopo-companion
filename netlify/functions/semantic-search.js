// Semantic Case Study Search — Gemini Embeddings API with deterministic lexical fallback
// Uses the same GEMINI_API_KEY already configured for all other functions.
const { callGeminiWithRetry } = require('./gemini-retry');
const { z } = require('zod');
const { formatValidationError } = require('./validation-helper');

const inputSchema = z.object({
  query: z.string().min(3).max(500),
  topK: z.number().min(1).max(20).optional().default(3)
});

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

// ── Precomputed token sets for lexical fallback (cached at module load) ────────
function tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w.length > 1);
}

/** IB-specific high-value terms receive bonus weighting. */
const IB_TERMS = new Set([
    'sovereignty', 'power', 'legitimacy', 'interdependence',
    'realism', 'liberalism', 'constructivism', 'marxism', 'feminism',
    'humanitarian', 'intervention', 'security', 'conflict', 'sanctions',
    'globalisation', 'globalization', 'multilateral', 'bilateral',
    'human', 'rights', 'democracy', 'authoritarian', 'regime'
]);

const CACHED_CASE_TOKENS = CASE_SUMMARIES.map(c => ({
    name: c.name,
    tokens: tokenize(c.summary),
    tokenSet: new Set(tokenize(c.summary))
}));

/**
 * Deterministic lexical ranking.
 * Scores combine:
 *   - Jaccard overlap between query tokens and case tokens
 *   - Bonus for IB-specific term matches
 *   - Bonus for consecutive bigram phrase matches
 */
function lexicalRank(queryText, topK) {
    const qTokens = tokenize(queryText);
    if (qTokens.length === 0) return CACHED_CASE_TOKENS.slice(0, topK).map(c => ({ name: c.name, score: 0 }));

    const qSet = new Set(qTokens);

    // Build query bigrams for phrase matching
    const qBigrams = new Set();
    for (let i = 0; i < qTokens.length - 1; i++) {
        qBigrams.add(qTokens[i] + ' ' + qTokens[i + 1]);
    }

    const scored = CACHED_CASE_TOKENS.map(c => {
        // Jaccard overlap
        const intersection = [...qSet].filter(t => c.tokenSet.has(t)).length;
        const union = new Set([...qSet, ...c.tokenSet]).size;
        const jaccard = union > 0 ? intersection / union : 0;

        // IB-term bonus: count how many matched tokens are IB-specific
        let ibBonus = 0;
        for (const t of qSet) {
            if (c.tokenSet.has(t) && IB_TERMS.has(t)) ibBonus += 0.05;
        }

        // Bigram phrase bonus
        let phraseBonus = 0;
        for (let i = 0; i < c.tokens.length - 1; i++) {
            const bigram = c.tokens[i] + ' ' + c.tokens[i + 1];
            if (qBigrams.has(bigram)) phraseBonus += 0.08;
        }

        return { name: c.name, score: Math.min(jaccard + ibBonus + phraseBonus, 1.0) };
    });

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

// ── Embedding-based semantic search ───────────────────────────────────────────
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
}

async function getEmbedding(text, apiKey) {
    const res = await callGeminiWithRetry(apiKey, {
            model: 'models/gemini-embedding-2',
            content: { parts: [{ text }] },
            taskType: 'SEMANTIC_SIMILARITY'
        },
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}` }
    );
    if (!res.ok) {
        throw new Error(`Embedding API error ${res.status}: ${res.error}`);
    }
    return res.data.embedding.values;
}

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
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
        const { query, topK } = parsedInput;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured.' }) };
        }

        // ── Attempt embedding-based semantic ranking ──────────────────────────
        try {
            const [queryEmbedding, ...caseEmbeddings] = await Promise.all([
                getEmbedding(query, apiKey),
                ...CASE_SUMMARIES.map(c => getEmbedding(c.summary, apiKey))
            ]);

            const scored = CASE_SUMMARIES
                .map((c, i) => ({ name: c.name, score: cosineSimilarity(queryEmbedding, caseEmbeddings[i]) }))
                .sort((a, b) => b.score - a.score)
                .slice(0, topK);

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    results: scored,
                    searchMode: 'semantic',
                    degraded: false,
                    fallbackReason: null
                })
            };
        } catch (embeddingError) {
            console.warn('[semantic-search] Embedding failed, falling back to lexical:', embeddingError.message);

            // ── Deterministic lexical fallback ────────────────────────────────
            const results = lexicalRank(query, topK);

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    results,
                    searchMode: 'lexical',
                    degraded: true,
                    fallbackReason: 'EMBEDDING_PROVIDER_UNAVAILABLE'
                })
            };
        }

    } catch (error) {
        console.error('Semantic search error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Semantic search failed: ' + error.message })
        };
    }
};

// Export internals for testing
exports._lexicalRank = lexicalRank;
exports._CASE_SUMMARIES = CASE_SUMMARIES;
