const http = require('http');
const fs = require('fs');

const GATEWAY = 'http://172.25.136.210:8080/v1';

// Load auto config
let token, chatId, userId;
try {
  const cfg = JSON.parse(fs.readFileSync('/etc/.z-ai-config', 'utf8'));
  token = cfg.token;
  chatId = cfg.chatId;
  userId = cfg.userId;
} catch(e) {
  console.error('Failed to load config');
  process.exit(1);
}

const campaignAddr = '0xd6174FCf9a69837846860CCaC6394D3E6645CC22';

async function generate() {
  const systemPrompt = `You are an expert content creator for Rally.fun campaigns. Create viral, engaging Twitter/X content.

RULES:
- Write in casual, conversational tone (use contractions, lowercase for emphasis)
- Be specific with numbers and details
- Include the campaign URL naturally
- Avoid AI-sounding phrases (delve, leverage, realm, etc.)
- No em dashes (—) or smart quotes
- Start with a hook (tbh, ngl, fun story, etc.)
- End with engagement question
- Include parenthetical asides like (not gonna lie) or (embarrassing to admit)

Campaign: Rally Owns the Narrative
URL: https://app.rally.fun/campaign/${campaignAddr}
Goal: Rally lets you own your narrative. Create content, earn rewards.
Style: Post a banger!

IMPORTANT: Output ONLY the tweet content, nothing else. No explanations.`;

  const userPrompt = `Create a tweet (under 280 chars) for this Rally campaign.
Use personal_story angle with curiosity → surprise emotions.
Structure: hero_journey.
Include the URL naturally. Output ONLY the tweet.`;

  return new Promise((resolve, reject) => {
    const url = new URL(`${GATEWAY}/chat/completions`);
    
    const requestBody = JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 500
    });
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer Z.ai',
      'X-Z-AI-From': 'Z',
      'X-Token': token,
      'X-User-Id': userId,
      'X-Chat-Id': chatId
    };
    
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            const msg = json.choices?.[0]?.message || {};
            
            // Get content from reasoning_content if content is empty
            let content = msg.content || '';
            const reasoning = msg.reasoning_content || '';
            
            // If content is empty, extract from reasoning
            if (!content && reasoning) {
              // Extract the final tweet from reasoning
              // Look for numbered draft attempts and take the best one
              const lines = reasoning.split('\n');
              let foundDraft = '';
              let inDraft = false;
              
              for (const line of lines) {
                // Look for draft content (usually after a number like "5." or in quotes)
                if (line.match(/^\d+\.\s+\*\*Refining/) || line.match(/^\d+\.\s+\*\*Drafting/)) {
                  inDraft = true;
                }
                if (inDraft && line.trim() && !line.match(/^\d+\./) && !line.match(/^\s*\*\*/)) {
                  foundDraft = line.trim();
                }
              }
              
              // Alternative: extract from Attempt patterns
              const attempts = reasoning.match(/Attempt \d+[^:]*:\s*([\s\S]*?)(?=Attempt|\d+\.\s+\*\*|$)/gi);
              if (attempts && attempts.length > 0) {
                const lastAttempt = attempts[attempts.length - 1];
                const lines = lastAttempt.split('\n').filter(l => l.trim() && !l.includes('Attempt'));
                if (lines.length > 0) {
                  content = lines.join(' ').trim();
                }
              }
              
              // If still no content, try to extract URL-containing lines
              if (!content) {
                const urlLines = reasoning.split('\n').filter(l => l.includes('rally.fun') && l.length < 300);
                if (urlLines.length > 0) {
                  content = urlLines[urlLines.length - 1].trim();
                }
              }
            }
            
            resolve({ content, reasoning });
          } catch(e) {
            reject(e);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.write(requestBody);
    req.end();
  });
}

generate().then(({ content, reasoning }) => {
  console.log('\n═════════════════════════════════════════════════════');
  console.log('✅ GENERATED CONTENT:');
  console.log('═════════════════════════════════════════════════════\n');
  console.log(content);
  console.log('\n═════════════════════════════════════════════════════');
  console.log('Length:', content.length, 'chars');
  
  // Save to file
  fs.writeFileSync('/home/z/my-project/download/winner-content.txt', content);
  console.log('Saved to: /home/z/my-project/download/winner-content.txt');
}).catch(err => {
  console.error('Error:', err.message);
});
