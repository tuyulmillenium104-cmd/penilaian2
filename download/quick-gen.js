const https = require('https');
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
  // Generate content
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
Style: Post a banger!`;

  const userPrompt = `Create a tweet (under 280 chars) for this Rally campaign.
Use personal_story angle with curiosity → surprise emotions.
Structure: hero_journey.
Include the URL naturally.`;

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
    
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: headers
    };
    
    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json.choices?.[0]?.message?.content || '');
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

generate().then(content => {
  console.log('\n✅ GENERATED CONTENT:\n');
  console.log(content);
  console.log('\n---');
  console.log('Length:', content.length, 'chars');
}).catch(err => {
  console.error('Error:', err.message);
});
