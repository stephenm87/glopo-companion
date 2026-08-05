const { handler, _lexicalRank, _CASE_SUMMARIES } = require('../semantic-search');
const { callGeminiWithRetry } = require('../gemini-retry');

jest.mock('../gemini-retry', () => ({
    callGeminiWithRetry: jest.fn(),
    PRIMARY_MODEL: 'gemini-3.5-flash',
    FALLBACK_MODEL: 'gemini-2.5-flash'
}));

describe('semantic-search.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
    });

    // ── Semantic mode ─────────────────────────────────────────────────────────
    it('returns ranked case summaries with semantic mode metadata', async () => {
        callGeminiWithRetry.mockImplementation(async (key, body) => {
            let val = [0.1, 0.2, 0.3];
            if (body.content.parts[0].text === 'test query') val = [1, 0, 0];
            if (body.content.parts[0].text.includes('South China Sea')) val = [1, 0, 0];
            if (body.content.parts[0].text.includes('Russia-Ukraine')) val = [0, 1, 0];
            return { ok: true, status: 200, data: { embedding: { values: val } } };
        });

        const res = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'test query', topK: 3 }) });
        expect(res.statusCode).toBe(200);

        const body = JSON.parse(res.body);
        expect(body.results).toBeDefined();
        expect(body.results.length).toBe(3);
        expect(body.results[0].name).toBe('South China Sea Dispute');
        expect(body.searchMode).toBe('semantic');
        expect(body.degraded).toBe(false);
        expect(body.fallbackReason).toBeNull();
    });

    // ── Lexical fallback on embedding failure ─────────────────────────────────
    it('falls back to lexical mode on embedding provider failure', async () => {
        callGeminiWithRetry.mockRejectedValue(new Error('Embedding API error 503: Service Unavailable'));

        const res = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'sovereignty power conflict', topK: 3 }) });
        expect(res.statusCode).toBe(200);

        const body = JSON.parse(res.body);
        expect(body.searchMode).toBe('lexical');
        expect(body.degraded).toBe(true);
        expect(body.fallbackReason).toBe('EMBEDDING_PROVIDER_UNAVAILABLE');
        expect(body.results.length).toBe(3);
        // Results should have scores > 0 for sovereignty-related cases
        expect(body.results[0].score).toBeGreaterThan(0);
    });

    it('lexical fallback returns deterministic results for identical queries', async () => {
        callGeminiWithRetry.mockRejectedValue(new Error('503'));

        const run1 = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'nuclear weapons security', topK: 5 }) });
        const run2 = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'nuclear weapons security', topK: 5 }) });

        const body1 = JSON.parse(run1.body);
        const body2 = JSON.parse(run2.body);
        expect(body1.results.map(r => r.name)).toEqual(body2.results.map(r => r.name));
        expect(body1.results.map(r => r.score)).toEqual(body2.results.map(r => r.score));
    });

    it('lexical fallback prefers cases with matching IB terms', async () => {
        callGeminiWithRetry.mockRejectedValue(new Error('503'));

        const res = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'sovereignty legitimacy humanitarian intervention', topK: 5 }) });
        const body = JSON.parse(res.body);

        // Cases about sovereignty + humanitarian intervention should rank high
        const topNames = body.results.map(r => r.name);
        // At least one R2P / humanitarian case should appear in top results
        const hasR2P = topNames.some(n => /R2P|Rwanda|Rohingya|Syria/i.test(n));
        expect(hasR2P).toBe(true);
    });

    // ── Fallback metadata shape ───────────────────────────────────────────────
    it('semantic success response has correct metadata shape', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200, data: { embedding: { values: [0.1, 0.2, 0.3] } }
        });

        const res = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'test', topK: 1 }) });
        const body = JSON.parse(res.body);

        expect(body).toHaveProperty('results');
        expect(body).toHaveProperty('searchMode');
        expect(body).toHaveProperty('degraded');
        expect(body).toHaveProperty('fallbackReason');
    });

    it('lexical fallback response has correct metadata shape', async () => {
        callGeminiWithRetry.mockRejectedValue(new Error('down'));

        const res = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'test query', topK: 1 }) });
        const body = JSON.parse(res.body);

        expect(body).toEqual(expect.objectContaining({
            results: expect.any(Array),
            searchMode: 'lexical',
            degraded: true,
            fallbackReason: 'EMBEDDING_PROVIDER_UNAVAILABLE'
        }));
    });

    // ── Results contain expected case names ────────────────────────────────────
    it('all returned case names exist in CASE_SUMMARIES', async () => {
        callGeminiWithRetry.mockRejectedValue(new Error('503'));

        const res = await handler({ httpMethod: 'POST', body: JSON.stringify({ query: 'trade war economy', topK: 10 }) });
        const body = JSON.parse(res.body);
        const knownNames = _CASE_SUMMARIES.map(c => c.name);

        for (const r of body.results) {
            expect(knownNames).toContain(r.name);
        }
    });

    // ── _lexicalRank unit tests ───────────────────────────────────────────────
    it('_lexicalRank returns topK results sorted by score', () => {
        const results = _lexicalRank('nuclear weapons security proliferation', 3);
        expect(results.length).toBe(3);
        expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
        expect(results[1].score).toBeGreaterThanOrEqual(results[2].score);
    });

    it('_lexicalRank returns results even for unrelated queries', () => {
        const results = _lexicalRank('quantum physics', 3);
        expect(results.length).toBe(3);
    });
});
