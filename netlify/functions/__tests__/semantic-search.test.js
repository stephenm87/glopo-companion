const { handler } = require('../semantic-search');
const { callGeminiWithRetry } = require('../gemini-retry');

jest.mock('../gemini-retry', () => ({
    callGeminiWithRetry: jest.fn(),
    PRIMARY_MODEL: 'models/gemini-embedding-2'
}));

describe('semantic-search.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
    });

    it('returns ranked case summaries using valid embeddings', async () => {
        // Mock successful embedding for both the query and the 20 case studies
        // We'll mock it so that the first case is identical to the query
        callGeminiWithRetry.mockImplementation(async (key, body) => {
            let val = [0.1, 0.2, 0.3]; // default
            if (body.content.parts[0].text === 'test query') val = [1, 0, 0]; // query
            if (body.content.parts[0].text.includes('South China Sea')) val = [1, 0, 0]; // match
            if (body.content.parts[0].text.includes('Russia-Ukraine')) val = [0, 1, 0]; // orthogonal
            return {
                ok: true,
                status: 200,
                data: { embedding: { values: val } }
            };
        });

        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ query: 'test query', topK: 3 })
        };

        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        
        const body = JSON.parse(res.body);
        expect(body.results).toBeDefined();
        expect(body.results.length).toBe(3);
        // The first match should be South China Sea
        expect(body.results[0].name).toBe('South China Sea Dispute');
    });

    it('returns HTTP 500 on Gemini provider error', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: false,
            status: 429,
            error: 'Rate limited'
        });

        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ query: 'test query', topK: 3 })
        };

        const res = await handler(event);
        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body).error).toContain('Rate limited');
    });
});
