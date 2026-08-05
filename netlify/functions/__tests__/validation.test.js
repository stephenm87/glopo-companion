const analyzeEssay = require('../analyze-essay').handler;
const analyzeImageEssay = require('../analyze-image-essay').handler;
const compareResearch = require('../compare-research').handler;
const findCases = require('../find-cases').handler;
const generateIntro = require('../generate-intro').handler;
const peelReview = require('../peel-review').handler;
const semanticSearch = require('../semantic-search').handler;
const solutionResearch = require('../solution-research').handler;
const { callGeminiWithRetry, extractGeminiText } = require('../gemini-retry');
const { estimateBase64Bytes, isValidBase64, MAX_DECODED_BYTES } = require('../validation-helper');

jest.mock('../gemini-retry', () => ({
    callGeminiWithRetry: jest.fn(),
    extractGeminiText: jest.fn((data, fallback) => {
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const part = parts.find(p => p.text);
        return part?.text || fallback;
    }),
    PRIMARY_MODEL: 'gemini-3.5-flash',
    FALLBACK_MODEL: 'gemini-2.5-flash'
}));

// Mock fetch for Serper
global.fetch = jest.fn();

// Suppress console.error during tests to keep output clean
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    console.error.mockRestore();
});

const mockEvent = (body) => ({
    httpMethod: 'POST',
    body: JSON.stringify(body)
});

/** Generate a valid base64 string of approximately n decoded bytes. */
function makeBase64(decodedBytes) {
    // Each 3 decoded bytes = 4 base64 chars
    const groups = Math.ceil(decodedBytes / 3);
    return 'A'.repeat(groups * 4);
}

beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
    process.env.SERPER_API_KEY = 'test-serper-key';
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ news: [] }) });
});

// ────────────────────────────────────────────────────────────────────────────────
// Unit tests for validation-helper utilities
// ────────────────────────────────────────────────────────────────────────────────
describe('estimateBase64Bytes', () => {
    it('estimates correctly for unpadded strings', () => {
        // 4 base64 chars = 3 bytes
        expect(estimateBase64Bytes('AAAA')).toBe(3);
    });
    it('estimates correctly with single-pad', () => {
        expect(estimateBase64Bytes('AAA=')).toBe(2);
    });
    it('estimates correctly with double-pad', () => {
        expect(estimateBase64Bytes('AA==')).toBe(1);
    });
});

describe('isValidBase64', () => {
    it('accepts valid padded base64', () => {
        expect(isValidBase64('SGVsbG8gV29ybGQ=')).toBe(true);
    });
    it('rejects invalid characters', () => {
        expect(isValidBase64('SGVsbG8gV29ybGQ=!!!')).toBe(false);
    });
    it('rejects invalid length', () => {
        expect(isValidBase64('SGVsb')).toBe(false);
    });
    it('rejects misplaced padding', () => {
        expect(isValidBase64('SGVsb=G8gV29ybGQ')).toBe(false);
    });
    it('rejects excessive padding', () => {
        expect(isValidBase64('SGVsbG8gV29ybGQ===')).toBe(false);
    });
    it('rejects truncated base64', () => {
        // "SGVsbG8gV29ybGQ" is 15 chars (not multiple of 4)
        expect(isValidBase64('SGVsbG8gV29ybGQ')).toBe(false);
    });
    it('accepts valid image-like binary content', () => {
        expect(isValidBase64(Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]).toString('base64'))).toBe(true);
    });
    it('accepts valid PDF-like binary content', () => {
        expect(isValidBase64(Buffer.from('%PDF-1.4').toString('base64'))).toBe(true);
    });
});

// ────────────────────────────────────────────────────────────────────────────────
// Image & MIME type validation
// ────────────────────────────────────────────────────────────────────────────────
describe('Image validation (analyze-image-essay)', () => {
    const validBase64 = makeBase64(1000); // ~1 KB

    const verifyError = (res, expectedField, expectedCode = 400) => {
        expect(res.statusCode).toBe(expectedCode);
        const body = JSON.parse(res.body);
        expect(body.error).toBeDefined();
        expect(body.error.field).toBe(expectedField);
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    };

    it('accepts valid JPEG', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                transcription: 'T', glow: 'G', grow: 'GR',
                alternativeApproaches: 'A', goldenTip: 'GT', aoEstimate: 'AO'
            })}]}}]}
        });
        const res = await analyzeImageEssay(mockEvent({ imageBase64: validBase64, mimeType: 'image/jpeg' }));
        expect(res.statusCode).toBe(200);
    });

    it('accepts valid PNG', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                transcription: 'T', glow: 'G', grow: 'GR',
                alternativeApproaches: 'A', goldenTip: 'GT', aoEstimate: 'AO'
            })}]}}]}
        });
        const res = await analyzeImageEssay(mockEvent({ imageBase64: validBase64, mimeType: 'image/png' }));
        expect(res.statusCode).toBe(200);
    });

    it('accepts valid WebP', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                transcription: 'T', glow: 'G', grow: 'GR',
                alternativeApproaches: 'A', goldenTip: 'GT', aoEstimate: 'AO'
            })}]}}]}
        });
        const res = await analyzeImageEssay(mockEvent({ imageBase64: validBase64, mimeType: 'image/webp' }));
        expect(res.statusCode).toBe(200);
    });

    it('accepts valid PDF', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                transcription: 'T', glow: 'G', grow: 'GR',
                alternativeApproaches: 'A', goldenTip: 'GT', aoEstimate: 'AO'
            })}]}}]}
        });
        const res = await analyzeImageEssay(mockEvent({ imageBase64: validBase64, mimeType: 'application/pdf' }));
        expect(res.statusCode).toBe(200);
    });

    it('rejects unsupported MIME type (image/gif)', async () => {
        const res = await analyzeImageEssay(mockEvent({ imageBase64: validBase64, mimeType: 'image/gif' }));
        verifyError(res, 'mimeType');
    });

    it('rejects unsupported MIME type (image/heic)', async () => {
        const res = await analyzeImageEssay(mockEvent({ imageBase64: validBase64, mimeType: 'image/heic' }));
        verifyError(res, 'mimeType');
    });

    it('rejects malformed base64 (invalid characters)', async () => {
        const res = await analyzeImageEssay(mockEvent({ imageBase64: '!!!invalid{base64}!!!', mimeType: 'image/jpeg' }));
        verifyError(res, 'imageBase64');
    });

    it('accepts exactly MAX_DECODED_BYTES - 1', async () => {
        const payload = Buffer.alloc(MAX_DECODED_BYTES - 1).toString('base64');
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                transcription: 'T', glow: 'G', grow: 'GR',
                alternativeApproaches: 'A', goldenTip: 'GT', aoEstimate: 'AO'
            })}]}}]}
        });
        const res = await analyzeImageEssay(mockEvent({ imageBase64: payload, mimeType: 'image/jpeg' }));
        expect(res.statusCode).toBe(200);
    });

    it('accepts exactly MAX_DECODED_BYTES', async () => {
        const payload = Buffer.alloc(MAX_DECODED_BYTES).toString('base64');
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                transcription: 'T', glow: 'G', grow: 'GR',
                alternativeApproaches: 'A', goldenTip: 'GT', aoEstimate: 'AO'
            })}]}}]}
        });
        const res = await analyzeImageEssay(mockEvent({ imageBase64: payload, mimeType: 'image/jpeg' }));
        expect(res.statusCode).toBe(200);
    });

    it('returns HTTP 413 for oversized payloads (MAX_DECODED_BYTES + 1)', async () => {
        const payload = Buffer.alloc(MAX_DECODED_BYTES + 1).toString('base64');
        const res = await analyzeImageEssay(mockEvent({ imageBase64: payload, mimeType: 'image/jpeg' }));
        verifyError(res, 'imageBase64', 413);
        const body = JSON.parse(res.body);
        expect(body.error.code).toBe('PAYLOAD_TOO_LARGE');
    });

    it('rejects missing imageBase64', async () => {
        const res = await analyzeImageEssay(mockEvent({ mimeType: 'image/jpeg' }));
        verifyError(res, 'imageBase64');
    });
});

// ────────────────────────────────────────────────────────────────────────────────
// Existing endpoint validation (preserved from prior tests)
// ────────────────────────────────────────────────────────────────────────────────
describe('Endpoint input validation', () => {
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

    it('validates compare-research caseA missing', async () => {
        const res = await compareResearch(mockEvent({ caseB: 'Case B' }));
        verifyError(res, 'caseA');
    });

    it('validates find-cases query missing', async () => {
        const res = await findCases(mockEvent({}));
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
        const res = await peelReview(mockEvent({}));
        verifyError(res, 'paragraph');
    });

    it('validates generate-intro caseA missing', async () => {
        const res = await generateIntro(mockEvent({ concept: 'Concept', definition: 'Definition', caseB: 'Case B', thesis: 'Test thesis' }));
        verifyError(res, 'caseA');
    });
});

// ────────────────────────────────────────────────────────────────────────────────
// Successful response shape from every AI endpoint
// ────────────────────────────────────────────────────────────────────────────────
describe('Successful response shape', () => {
    it('analyze-essay returns { analysis: string }', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                glow: 'G', grow: 'GR', alternativePerspectives: 'A', synthesisGuidance: 'S'
            })}]}}]}
        });
        const res = await analyzeEssay(mockEvent({ essayText: 'Test essay about sovereignty and power.' }));
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toHaveProperty('analysis');
    });

    it('find-cases returns { results: array }', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify([
                { rank: 1, name: 'Test Case', relevance: 'High', angle: 'Realism' }
            ])}]}}]}
        });
        const res = await findCases(mockEvent({ query: 'sovereignty in the Pacific' }));
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toHaveProperty('results');
    });

    it('generate-intro returns { intro: string }', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({ intro: 'A strong introduction paragraph.' }) }] }}] }
        });
        const res = await generateIntro(mockEvent({
            concept: 'Power', definition: 'ability to influence', caseA: 'Syria', caseB: 'Libya', thesis: 'test thesis'
        }));
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body).toHaveProperty('intro');
    });

    it('peel-review returns { feedback: object }', async () => {
        callGeminiWithRetry.mockResolvedValue({
            ok: true, status: 200,
            data: { candidates: [{ content: { parts: [{ text: JSON.stringify({
                improved: 'Better text', bandJump: 'Yes',
                changes: [{ ao: 'AO1', label: 'Missing Case', original: 'it', fix: 'the UN' }],
                pointScore: 3, evidenceScore: 3, explanationScore: 3, linkScore: 3,
                overallFeedback: 'Good'
            })}]}}]}
        });
        const res = await peelReview(mockEvent({ paragraph: 'A PEEL paragraph about sovereignty that is sufficiently long enough to meet the ten character minimum.' }));
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body).toHaveProperty('improved');
        expect(body).toHaveProperty('bandJump');
    });
});

// ────────────────────────────────────────────────────────────────────────────────
// Gemini provider failure for every endpoint
// ────────────────────────────────────────────────────────────────────────────────
describe('Gemini provider failure', () => {
    beforeEach(() => {
        callGeminiWithRetry.mockResolvedValue({
            ok: false, status: 503, error: 'Service Unavailable'
        });
    });

    it('analyze-essay returns 500 on provider failure', async () => {
        const res = await analyzeEssay(mockEvent({ essayText: 'Valid essay text about power.' }));
        expect(res.statusCode).toBe(500);
    });

    it('analyze-image-essay returns 500 on provider failure', async () => {
        const validBase64 = makeBase64(1000);
        const res = await analyzeImageEssay(mockEvent({ imageBase64: validBase64, mimeType: 'image/jpeg' }));
        expect(res.statusCode).toBe(500);
    });

    it('find-cases returns 500 on provider failure', async () => {
        const res = await findCases(mockEvent({ query: 'sovereignty in Pacific' }));
        expect(res.statusCode).toBe(500);
    });

    it('generate-intro returns 500 on provider failure', async () => {
        const res = await generateIntro(mockEvent({
            concept: 'Power', definition: 'ability to influence', caseA: 'CaseA', caseB: 'CaseB', thesis: 'Test thesis'
        }));
        expect(res.statusCode).toBe(500);
    });

    it('peel-review returns 500 on provider failure', async () => {
        const res = await peelReview(mockEvent({ paragraph: 'Valid paragraph text that meets minimum length.' }));
        expect(res.statusCode).toBe(500);
    });

    it('solution-research returns 500 on provider failure', async () => {
        const res = await solutionResearch(mockEvent({ topic: 'Climate', mode: 'evaluate', inputs: {} }));
        expect(res.statusCode).toBe(500);
    });
});

// ────────────────────────────────────────────────────────────────────────────────
// Confirmation: Gemini is NOT called after validation failure
// ────────────────────────────────────────────────────────────────────────────────
describe('Gemini not called after validation failure', () => {
    it('stops before Gemini on invalid analyze-essay input', async () => {
        await analyzeEssay(mockEvent({}));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });

    it('stops before Gemini on invalid image input', async () => {
        await analyzeImageEssay(mockEvent({ imageBase64: '!!', mimeType: 'image/bmp' }));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });

    it('stops before Gemini on invalid find-cases input', async () => {
        await findCases(mockEvent({}));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });

    it('stops before Gemini on invalid peel-review input', async () => {
        await peelReview(mockEvent({}));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });

    it('stops before Gemini on invalid solution-research input', async () => {
        await solutionResearch(mockEvent({}));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });

    it('stops before Gemini on invalid generate-intro input', async () => {
        await generateIntro(mockEvent({}));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });

    it('stops before Gemini on invalid compare-research input', async () => {
        await compareResearch(mockEvent({}));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });

    it('stops before Gemini on invalid semantic-search input', async () => {
        await semanticSearch(mockEvent({}));
        expect(callGeminiWithRetry).not.toHaveBeenCalled();
    });
});
