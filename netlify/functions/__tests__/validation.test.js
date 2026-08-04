const analyzeEssay = require('../analyze-essay').handler;
const analyzeImageEssay = require('../analyze-image-essay').handler;
const compareResearch = require('../compare-research').handler;
const findCases = require('../find-cases').handler;
const generateIntro = require('../generate-intro').handler;
const peelReview = require('../peel-review').handler;
const semanticSearch = require('../semantic-search').handler;
const solutionResearch = require('../solution-research').handler;
const { callGeminiWithRetry } = require('../gemini-retry');

jest.mock('../gemini-retry', () => ({
    callGeminiWithRetry: jest.fn()
}));

const mockEvent = (body) => ({
    httpMethod: 'POST',
    body: JSON.stringify(body)
});

describe('Validation Logic Across Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const verifyError = (res, expectedField, expectedCode = 400) => {
        expect(res.statusCode).toBe(expectedCode);
        const body = JSON.parse(res.body);
        expect(body.error).toBeDefined();
        expect(body.error.field).toBe(expectedField);
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    };

    it('rejects malformed JSON', async () => {
        const res = await analyzeEssay({ httpMethod: 'POST', body: '{ bad json' });
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error.message).toMatch(/JSON/i);
    });

    it('validates analyze-essay essayText missing', async () => {
        const res = await analyzeEssay(mockEvent({ questionText: 'Q' }));
        verifyError(res, 'essayText');
    });

    it('validates analyze-essay essayText too long', async () => {
        const res = await analyzeEssay(mockEvent({ essayText: 'a'.repeat(20001) }));
        verifyError(res, 'essayText');
    });

    it('validates analyze-image-essay imageBase64 missing', async () => {
        const res = await analyzeImageEssay(mockEvent({ mimeType: 'image/jpeg', prompt: 'P' }));
        verifyError(res, 'imageBase64');
    });

    it('validates analyze-image-essay mimeType invalid', async () => {
        const res = await analyzeImageEssay(mockEvent({ imageBase64: 'abcdeabcde', mimeType: 'image/gif' }));
        verifyError(res, 'mimeType');
    });

    it('returns HTTP 413 for oversized analyze-image-essay imageBase64', async () => {
        const res = await analyzeImageEssay(mockEvent({ imageBase64: 'a'.repeat(15000000), mimeType: 'image/jpeg' }));
        verifyError(res, 'imageBase64', 413);
        const body = JSON.parse(res.body);
        expect(body.error.code).toBe('PAYLOAD_TOO_LARGE');
    });

    it('validates compare-research caseA missing', async () => {
        const res = await compareResearch(mockEvent({ caseB: 'Case B' }));
        verifyError(res, 'caseA');
    });

    it('validates compare-research caseB missing', async () => {
        const res = await compareResearch(mockEvent({ caseA: 'Case A' }));
        verifyError(res, 'caseB');
    });

    it('validates find-cases query missing', async () => {
        const res = await findCases(mockEvent({ }));
        verifyError(res, 'query');
    });

    it('validates semantic-search query missing', async () => {
        const res = await semanticSearch(mockEvent({ topK: 3 }));
        verifyError(res, 'query');
    });

    it('validates solution-research mode missing', async () => {
        const res = await solutionResearch(mockEvent({ topic: 'T' }));
        verifyError(res, 'mode');
    });

    it('validates peel-review paragraph missing', async () => {
        const res = await peelReview(mockEvent({ }));
        verifyError(res, 'paragraph');
    });

    it('validates generate-intro caseA wrong type (missing)', async () => {
        const res = await generateIntro(mockEvent({ concept: 'Concept', definition: 'Definition', caseB: 'C1', thesis: 'T' }));
        verifyError(res, 'caseA');
    });
});
