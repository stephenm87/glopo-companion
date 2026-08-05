const { callGeminiWithRetry, PRIMARY_MODEL, FALLBACK_MODEL } = require('../gemini-retry');

global.fetch = jest.fn();

describe('gemini-retry', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('successful request on first attempt', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ candidates: [{ content: { parts: [{ text: "success" }] } }] })
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' }, { maxRetries: 0 });
        expect(res.ok).toBe(true);
        expect(res.status).toBe(200);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('400 Bad Request does not retry', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            text: async () => "Bad config"
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' });
        expect(res.ok).toBe(false);
        expect(res.status).toBe(400);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('429 Rate Limit retries', async () => {
        global.fetch.mockResolvedValueOnce({
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
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

        test('404 falls back to FALLBACK_MODEL ONCE', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        }).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' });
        expect(res.ok).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(2);
        
        expect(global.fetch.mock.calls[0][0]).toContain(PRIMARY_MODEL);
        expect(global.fetch.mock.calls[1][0]).toContain(FALLBACK_MODEL);
    });

    test('options.url overrides model url generation and prevents 404 fallback', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        const res = await callGeminiWithRetry('test-key', { prompt: 'test' }, { url: 'https://custom-url.com' });
        expect(res.ok).toBe(false);
        expect(res.status).toBe(404);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch.mock.calls[0][0]).toBe('https://custom-url.com');
    });
});
