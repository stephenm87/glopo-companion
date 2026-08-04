const { callGeminiWithRetry, PRIMARY_MODEL, FALLBACK_MODEL } = require('./gemini-retry');
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('gemini-retry', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('successful request on first attempt', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ candidates: [{ content: { parts: [{ text: "success" }] } }] })
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' }, { maxRetries: 0 });
        expect(res.ok).toBe(true);
        expect(res.status).toBe(200);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('400 Bad Request does not retry', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            text: async () => "Bad config"
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' });
        expect(res.ok).toBe(false);
        expect(res.status).toBe(400);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('429 Rate Limit retries', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 429,
            headers: { get: () => '0' }
        }).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' }, { maxRetries: 2 });
        expect(res.ok).toBe(true);
        expect(res.status).toBe(200);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('404 falls back to FALLBACK_MODEL ONCE', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        }).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' });
        expect(res.ok).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(2);
        
        // Assert the first call used PRIMARY_MODEL and second used FALLBACK_MODEL
        expect(fetch.mock.calls[0][0]).toContain(PRIMARY_MODEL);
        expect(fetch.mock.calls[1][0]).toContain(FALLBACK_MODEL);
    });
});
