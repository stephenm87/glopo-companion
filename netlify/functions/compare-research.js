// Comparative Case Study Research — Serper-powered multi-perspective article finder
// Searches for 2-3 news/analysis articles per case study from different source types
const { callGeminiWithRetry, extractGeminiText } = require('./gemini-retry');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { caseA, caseB } = JSON.parse(event.body);
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

        const gemRes = await callGeminiWithRetry(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: 'application/json', thinkingConfig: { thinkingBudget: 0 } }
            }
        );

        let analysis = null;
        if (gemRes.ok) {
            const gemData = await gemRes.json();
            const raw = extractGeminiText(gemData, '{}');
            try { analysis = JSON.parse(raw); } catch { analysis = null; }
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
