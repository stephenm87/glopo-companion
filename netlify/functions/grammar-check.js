// Grammar and academic-style check.
// Uses a configured LanguageTool Enterprise/self-hosted endpoint when present;
// otherwise uses the existing server-side Gemini provider. It never automates
// LanguageTool's unsupported public endpoint.
const { protectEndpoint } = require('./security');
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { z } = require('zod');
const { formatValidationError } = require('./validation-helper');

const inputSchema = z.object({ text: z.string().min(10).max(20000) });
const issueSchema = z.object({
    message: z.string(),
    shortMessage: z.string(),
    category: z.string(),
    suggestions: z.array(z.string()).max(3)
});
const geminiOutputSchema = z.object({ issues: z.array(issueSchema).max(25) });

function groupIssues(issues) {
    return issues.reduce((groups, issue) => {
        if (!groups[issue.category]) groups[issue.category] = [];
        groups[issue.category].push(issue);
        return groups;
    }, {});
}

function mapLanguageToolIssues(data) {
    return (data.matches || []).map(match => ({
        message: match.message,
        shortMessage: match.shortMessage || match.rule?.description || 'Style issue',
        category: match.rule?.category?.name || 'Grammar',
        suggestions: (match.replacements || []).slice(0, 3).map(replacement => replacement.value)
    }));
}

async function checkWithConfiguredLanguageTool(text) {
    const endpoint = process.env.LANGUAGETOOL_API_URL;
    if (!endpoint) return null;
    const params = new URLSearchParams({ text, language: 'en-GB', level: 'picky' });
    const res = await fetch(endpoint, {
        method: 'POST',
        signal: AbortSignal.timeout(12000),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...(process.env.LANGUAGETOOL_API_KEY ? { Authorization: `Bearer ${process.env.LANGUAGETOOL_API_KEY}` } : {})
        },
        body: params.toString()
    });
    if (!res.ok) throw new Error(`Configured grammar provider returned ${res.status}`);
    return mapLanguageToolIssues(await res.json());
}

async function checkWithGemini(text, apiKey) {
    const result = await callGeminiWithRetry(apiKey, {
        contents: [{ parts: [{ text: `Proofread the following student paragraph using British English. Return only genuine grammar, punctuation, clarity, and academic-style issues. Do not critique the political viewpoint or assign grades. Provide at most 25 issues and up to three concise replacement suggestions per issue.\n\n${text}` }] }],
        generationConfig: {
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 0 },
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    issues: {
                        type: 'ARRAY',
                        items: {
                            type: 'OBJECT',
                            properties: {
                                message: { type: 'STRING' },
                                shortMessage: { type: 'STRING' },
                                category: { type: 'STRING' },
                                suggestions: { type: 'ARRAY', items: { type: 'STRING' } }
                            },
                            required: ['message', 'shortMessage', 'category', 'suggestions']
                        }
                    }
                },
                required: ['issues']
            }
        }
    }, { maxRetries: 1, timeout: 12000 });
    if (!result.ok) throw new Error('Grammar provider unavailable');
    return geminiOutputSchema.parse(JSON.parse(extractGeminiText(result.data, '{"issues":[]}'))).issues;
}

exports.handler = async (event) => {
    const security = await protectEndpoint(event, { maxRequests: 30 });
    if (security.response) return security.response;
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        let input;
        try {
            input = inputSchema.parse(JSON.parse(event.body));
        } catch (error) {
            return formatValidationError(error);
        }

        const configuredIssues = await checkWithConfiguredLanguageTool(input.text);
        if (!configuredIssues && !process.env.GEMINI_API_KEY) {
            return { statusCode: 503, body: JSON.stringify({ error: 'Grammar checking is not configured.' }) };
        }
        const issues = configuredIssues ?? await checkWithGemini(input.text, process.env.GEMINI_API_KEY);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: issues.length, issues, grouped: groupIssues(issues) })
        };
    } catch (error) {
        console.error('[grammar-check]', error.message);
        return { statusCode: 502, body: JSON.stringify({ error: 'Grammar checking is temporarily unavailable.' }) };
    }
};

exports._test = { groupIssues, mapLanguageToolIssues };
