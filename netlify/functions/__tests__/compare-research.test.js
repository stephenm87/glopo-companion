const { handler } = require('../compare-research');
const { callGeminiWithRetry } = require('../gemini-retry');

jest.mock('../gemini-retry', () => ({
    callGeminiWithRetry: jest.fn(),
    extractGeminiText: jest.fn(data => JSON.stringify(data)),
    PRIMARY_MODEL: 'models/gemini-2.5-flash',
    FALLBACK_MODEL: 'models/gemini-2.5-flash'
}));

// Mock native fetch for Serper
global.fetch = jest.fn();

describe('compare-research.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test-key';
        process.env.SERPER_API_KEY = 'test-serper-key';
    });

    it('handles successful Serper response and preserves titles and links', async () => {
        // Mock Serper success
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                news: [
                    { title: 'Article 1', link: 'http://a.com', snippet: 'S1', source: 'A' },
                    { title: 'Article 2', link: 'http://b.com', snippet: 'S2', source: 'B' }
                ]
            })
        });

        // Mock Gemini success
        callGeminiWithRetry.mockResolvedValue({
            ok: true,
            status: 200,
            data: {
                similarities: ['s1'], differences: ['d1'],
                theoryLenses: [{ theory: 'Realism', applicationA: 'A', applicationB: 'B' }],
                ibConcepts: ['Power'], examArgument: 'Arg', perspectiveSummary: 'Persp'
            }
        });

        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ caseA: 'Syria', caseB: 'Libya' })
        };

        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        
        expect(body.articlesA.length).toBeGreaterThan(0);
        expect(body.articlesA[0].title).toBe('Article 1');
        expect(body.articlesA[0].url).toBe('http://a.com');
    });

    it('handles empty Serper response', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ news: [] })
        });

        callGeminiWithRetry.mockResolvedValue({
            ok: true,
            data: {
                similarities: ['s1'], differences: ['d1'],
                theoryLenses: [{ theory: 'Realism', applicationA: 'A', applicationB: 'B' }],
                ibConcepts: ['Power'], examArgument: 'Arg', perspectiveSummary: 'Persp'
            }
        });

        const event = { httpMethod: 'POST', body: JSON.stringify({ caseA: 'A', caseB: 'B' }) };
        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.articlesA).toEqual([]);
    });

    it('does not crash Gemini analysis if Serper errors out', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Serper Error'
        });

        callGeminiWithRetry.mockResolvedValue({
            ok: true,
            data: {
                similarities: ['s1'], differences: ['d1'],
                theoryLenses: [{ theory: 'Realism', applicationA: 'A', applicationB: 'B' }],
                ibConcepts: ['Power'], examArgument: 'Arg', perspectiveSummary: 'Persp'
            }
        });

        const event = { httpMethod: 'POST', body: JSON.stringify({ caseA: 'A', caseB: 'B' }) };
        const res = await handler(event);
        expect(res.statusCode).toBe(200);
    });
});
