const fs = require('fs');
let content = fs.readFileSync('netlify/functions/compare-research.js', 'utf8');

const target = `<<<<<<< HEAD
            
            const raw = extractGeminiText(gemRes.data, '{}');
            try { analysis = JSON.parse(raw); } catch { analysis = null; }
=======
            const gemData = await gemRes.json();
            const raw = extractGeminiText(gemData, '{}');
            try { 
                const parsed = JSON.parse(raw); 
                analysis = compareSchema.parse(parsed);
            } catch (err) { 
                return { statusCode: 500, body: JSON.stringify({ error: 'Validation error: ' + err.message }) };
            }
>>>>>>> bbf0a62 (fix(ai): implement native structured AI responses with Zod validation)`;

const replacement = `            const raw = extractGeminiText(gemRes.data, '{}');
            try { 
                const parsed = JSON.parse(raw); 
                analysis = compareSchema.parse(parsed);
            } catch (err) { 
                return { statusCode: 500, body: JSON.stringify({ error: 'Validation error: ' + err.message }) };
            }`;

content = content.replace(target, replacement);
fs.writeFileSync('netlify/functions/compare-research.js', content);
