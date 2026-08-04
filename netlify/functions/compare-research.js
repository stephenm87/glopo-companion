// Comparative Case Study Research — Serper-powered multi-perspective article finder
// Searches for 2-3 news/analysis articles per case study from different source types
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');
const { z } = require('zod');

const inputSchema = z.object({
  caseA: z.string().min(2).max(100),
  caseB: z.string().min(2).max(100)
});

const compareSchema = z.object({
  similarities: z.array(z.string()),
  differences: z.array(z.string()),
  theoryLenses: z.array(z.object({
    theory: z.string(),
    applicationA: z.string(),
    applicationB: z.string()
  })),
  ibConcepts: z.array(z.string()),
  examArgument: z.string(),
  perspectiveSummary: z.string()
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        let parsedInput;
        try {
            parsedInput = inputSchema.parse(JSON.parse(event.body));
        } catch (err) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: err.errors?.[0]?.message || err.message,
                        field: err.errors?.[0]?.path?.[0] || 'body'
                    }
                })
            };
        }
        const { caseA, caseB } = parsedInput;
        const serperKey = process.env.SERPER_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };

        // Search for articles on each case from multiple perspectives (skip if no Serper key)
        let articlesA = [];
        let articlesB = [];

        if (serperKey) {
            const searchCase = async (caseName) => {
                const queries = [
                    `${caseName} analysis global politics 2024 2025`,
                    `${caseName} different perspectives debate`,
                    `${caseName} critical analysis international relations`,
                ];

                const allArticles = [];
                for (const q of queries) {
                    try {
                        const res = await fetch('https://google.serper.dev/news', {
                            method: 'POST',
                            headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' },
                            body: JSON.stringify({ q, num: 3, gl: 'us', hl: 'en' })
                        });
                        if (res.ok) {
                            const data = await res.json();
                            const articles = (data.news || []).map(a => ({
                                title: a.title,
                                url: a.link,
                                snippet: a.snippet || '',
                                source: a.source || new URL(a.link).hostname,
                                date: a.date || '',
                                imageUrl: a.imageUrl || null,
                            }));
                            allArticles.push(...articles);
                        }
                    } catch (e) { /* skip failed query */ }
                }

                // Deduplicate by URL and pick top 3 from diverse sources
                const seen = new Set();
                const unique = allArticles.filter(a => {
                    if (seen.has(a.url)) return false;
                    seen.add(a.url);
                    return true;
                });

                // Try to pick from different sources
                const sourcesSeen = new Set();
                const diverse = [];
                for (const a of unique) {
                    const domain = a.source.toLowerCase();
                    if (!sourcesSeen.has(domain) && diverse.length < 3) {
                        sourcesSeen.add(domain);
                        diverse.push(a);
                    }
                }
                // Fill remaining slots if we don't have 3 yet
                for (const a of unique) {
                    if (diverse.length >= 3) break;
                    if (!diverse.includes(a)) diverse.push(a);
                }

                return diverse.slice(0, 3);
            };

            [articlesA, articlesB] = await Promise.all([
                searchCase(caseA),
                searchCase(caseB),
            ]);
        }

        // Generate AI comparative analysis using article snippets
        const snippetsA = articlesA.map(a => `[${a.source}] ${a.title}: ${a.snippet}`).join('\n');
        const snippetsB = articlesB.map(a => `[${a.source}] ${a.title}: ${a.snippet}`).join('\n');

        const prompt = `You are an IB Global Politics exam coach. Based on recent articles, generate a structured comparative analysis of these two case studies.

CASE A: "${caseA}"
Recent coverage:
${snippetsA || 'No articles found — use your knowledge.'}

CASE B: "${caseB}"
Recent coverage:
${snippetsB || 'No articles found — use your knowledge.'}

IMPORTANT: In every similarity and difference, explicitly name both case studies by name — never write "Both" or "each case" without specifying which cases.
For theory lenses, choose ONLY the theories that genuinely illuminate each case from this list: Realism, Liberalism, Constructivism, Marxism, Feminism, Post-colonialism. Include between 2 and 5 theories — only those truly applicable, not all of them.

Return JSON:
{
  "similarities": ["3 key similarities, each explicitly naming both ${caseA} and ${caseB}"],
  "differences": ["3 key differences, each explicitly naming both ${caseA} and ${caseB}"],
  "theoryLenses": [
    {"theory": "TheoryName", "applicationA": "How it applies to ${caseA} (1-2 sentences)", "applicationB": "How it applies to ${caseB} (1-2 sentences)"}
  ],
  "ibConcepts": ["3-4 IB concepts that connect both cases with brief explanation"],
  "examArgument": "A Band 7-level thesis statement comparing both cases (2-3 sentences)",
  "perspectiveSummary": "Provide a detailed 4-6 sentence analysis of how different actors, governments, IGOs, NGOs, and media sources frame each case differently. Name specific actors (e.g., 'the US State Department frames...', 'Al Jazeera emphasizes...', 'the UN Human Rights Council argues...'). Explain how these competing narratives shape public understanding and policy responses for both ${caseA} and ${caseB}."
}`;

        const body = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    responseMimeType: 'application/json', 
                    thinkingConfig: { thinkingBudget: 0 },
                    responseSchema: {
                        type: 'OBJECT',
                        properties: {
                            similarities: { type: 'ARRAY', items: { type: 'STRING' } },
                            differences: { type: 'ARRAY', items: { type: 'STRING' } },
                            theoryLenses: {
                                type: 'ARRAY',
                                items: {
                                    type: 'OBJECT',
                                    properties: {
                                        theory: { type: 'STRING' },
                                        applicationA: { type: 'STRING' },
                                        applicationB: { type: 'STRING' }
                                    },
                                    required: ['theory', 'applicationA', 'applicationB']
                                }
                            },
                            ibConcepts: { type: 'ARRAY', items: { type: 'STRING' } },
                            examArgument: { type: 'STRING' },
                            perspectiveSummary: { type: 'STRING' }
                        },
                        required: ['similarities', 'differences', 'theoryLenses', 'ibConcepts', 'examArgument', 'perspectiveSummary']
                    }
                }
            };
        const gemRes = await callGeminiWithRetry(geminiKey, body);

        let analysis = null;
        if (gemRes.ok) {
            const raw = extractGeminiText(gemRes.data, '{}');
            try { 
                const parsed = JSON.parse(raw); 
                analysis = compareSchema.parse(parsed);
            } catch (err) { 
                return { statusCode: 500, body: JSON.stringify({ error: 'Validation error: ' + err.message }) };
            }
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articlesA, articlesB, analysis })
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
