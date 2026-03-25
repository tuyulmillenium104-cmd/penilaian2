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

// Extract clean tweet from reasoning content
function extractTweet(reasoning) {
  const lines = reasoning.split('\n');
  const candidates = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip if it's analysis/meta text
    if (trimmed.startsWith('*') || trimmed.startsWith('#') || 
        trimmed.startsWith('**') || trimmed.match(/^\d+\.\s+\*\*/) ||
        trimmed.includes('Critique') || trimmed.includes('Attempt') ||
        trimmed.includes('Character Count') || trimmed.includes('Checking') ||
        trimmed.includes('Refining') || trimmed.includes('Drafting') ||
        trimmed.match(/^\d+\.\s+[A-Z]/) || // "3. Spent years..."
        trimmed.length < 50 || trimmed.length > 300) {
      continue;
    }
    
    // Must contain URL
    if (trimmed.includes('rally.fun')) {
      candidates.push(trimmed);
    }
  }
  
  // Return the last/best candidate
  return candidates.length > 0 ? candidates[candidates.length - 1] : null;
}

async function generate() {
  const systemPrompt = `You are an expert Twitter content creator.

Create a viral tweet for Rally.fun campaign. 

RULES:
- Casual, conversational tone with lowercase emphasis
- NO em dashes (—) EVER
- Start with hook: tbh, ngl, fun story, spent years, honestly
- End with engaging question
- Include URL naturally in middle/end
- Use parenthetical asides like (not gonna lie)
- Under 280 characters

Campaign: Rally Owns the Narrative
URL: https://app.rally.fun/campaign/${campaignAddr}

OUTPUT: Just the tweet text, no numbering, no explanation.`;

  const userPrompt = `Write a creative tweet about Rally campaign. Just the tweet.`;

  return new Promise((resolve, reject) => {
    const url = new URL(`${GATEWAY}/chat/completions`);
    
    const requestBody = JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.9,
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
            
            let content = msg.content || '';
            const reasoning = msg.reasoning_content || '';
            
            // Extract from reasoning if content is empty
            if (!content && reasoning) {
              content = extractTweet(reasoning) || '';
            }
            
            // Clean up - remove leading numbers
            content = content.replace(/^\d+\.\s*/, '').trim();
            
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

// Generate multiple and pick best
async function runMultiple() {
  const results = [];
  
  for (let i = 0; i < 3; i++) {
    console.log(`\n📝 Generating content ${i + 1}/3...`);
    try {
      const { content } = await generate();
      if (content && content.length > 50 && content.includes('rally.fun')) {
        results.push(content);
        console.log(`   ✅ Got: ${content.substring(0, 60)}...`);
      } else {
        console.log(`   ⚠️ Content not valid`);
      }
    } catch(e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
  }
  
  return results;
}

runMultiple().then(results => {
  console.log('\n═════════════════════════════════════════════════════');
  console.log('🏆 GENERATED CONTENTS:');
  console.log('═════════════════════════════════════════════════════\n');
  
  results.forEach((c, i) => {
    console.log(`${i + 1}. ${c}`);
    console.log(`   (${c.length} chars)\n`);
  });
  
  if (results.length > 0) {
    const best = results[results.length - 1];
    fs.writeFileSync('/home/z/my-project/download/winner-content.txt', best);
    console.log('═════════════════════════════════════════════════════');
    console.log('✅ Best content saved to: winner-content.txt');
  }
}).catch(err => {
  console.error('Error:', err.message);
});
