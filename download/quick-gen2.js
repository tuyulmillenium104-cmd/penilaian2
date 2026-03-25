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
  const systemPrompt = `You are an expert content creator. Create a short tweet for Rally.fun campaign.

Campaign: Rally Owns the Narrative
URL: https://app.rally.fun/campaign/${campaignAddr}`;

  const userPrompt = `Create a short tweet (under 280 chars) with the URL. Be creative and casual.`;

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
    
    console.log('Sending request...');
    
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
        console.log('Status:', res.statusCode);
        console.log('Raw response:', data.substring(0, 1000));
        
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('\nParsed:', JSON.stringify(json, null, 2));
          } catch(e) {
            console.log('Parse error:', e.message);
          }
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.log('Error:', e.message);
      reject(e);
    });
    
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.write(requestBody);
    req.end();
  });
}

generate().catch(console.error);
