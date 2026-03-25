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
  const systemPrompt = `You are an expert Twitter content creator.

IMPORTANT: You must output ONLY the tweet text, nothing else. No explanations, no drafts, no critiques. Just the final tweet.

RULES:
- Casual, conversational tone
- No em dashes (—) 
- Start with a hook (tbh, ngl, fun story, spent years, etc.)
- End with a question
- Include URL naturally
- Use parenthetical asides like (not gonna lie)

Campaign: Rally Owns the Narrative
URL: https://app.rally.fun/campaign/${campaignAddr}

OUTPUT ONLY THE TWEET TEXT.`;

  const userPrompt = `Write a tweet (under 280 chars) about this Rally campaign. Output ONLY the tweet, nothing else.`;

  return new Promise((resolve, reject) => {
    const url = new URL(`${GATEWAY}/chat/completions`);
    
    const requestBody = JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 300
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
            
            let content = msg.content || '';
            const reasoning = msg.reasoning_content || '';
            
            // If content is empty, extract from reasoning
            if (!content && reasoning) {
              // Find lines that contain the URL and look like a tweet
              const lines = reasoning.split('\n');
              let bestLine = '';
              
              for (const line of lines) {
                const trimmed = line.trim();
                // Skip headers, critiques, analysis
                if (trimmed.startsWith('*') || trimmed.startsWith('#') || 
                    trimmed.startsWith('**') || trimmed.match(/^\d+\.\s+\*\*/) ||
                    trimmed.includes('Critique') || trimmed.includes('Attempt') ||
                    trimmed.includes('Character Count') || trimmed.length < 50) {
                  continue;
                }
                // Look for lines with URL
                if (trimmed.includes('rally.fun') && trimmed.length < 300) {
                  bestLine = trimmed;
                }
              }
              
              if (bestLine) {
                content = bestLine;
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
