// LanguageTool Grammar Check — free public API, no key required
// Checks English grammar, style, and punctuation; returns categorised issues with suggestions

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { text } = JSON.parse(event.body);
        if (!text || text.trim().length < 10) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Text too short to check.' }) };
        }

        // LanguageTool free public API — en-GB for IB academic English
        const params = new URLSearchParams({
            text: text,
            language: 'en-GB',
            disabledCategories: 'TYPOGRAPHY,REDUNDANCY', // suppress low-value formatting categories
            level: 'picky', // enable additional style suggestions
        });

        const res = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
            body: params.toString()
        });

        if (!res.ok) {
            const err = await res.text();
            return { statusCode: 500, body: JSON.stringify({ error: `LanguageTool error ${res.status}: ${err.substring(0, 200)}` }) };
        }

        const data = await res.json();

        // Map to a lean structure for the UI
        const issues = (data.matches || []).map(m => ({
            message: m.message,
            shortMessage: m.shortMessage || m.rule?.description || 'Style issue',
            category: m.rule?.category?.name || 'Grammar',
            offset: m.offset,
            length: m.length,
            context: m.context?.text || '',
            contextOffset: m.context?.offset || 0,
            suggestions: (m.replacements || []).slice(0, 3).map(r => r.value),
            ruleId: m.rule?.id || '',
        }));

        // Group by category for display
        const grouped = issues.reduce((acc, issue) => {
            const cat = issue.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(issue);
            return acc;
        }, {});

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: issues.length, issues, grouped })
        };

    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Grammar check failed: ' + err.message }) };
    }
};
