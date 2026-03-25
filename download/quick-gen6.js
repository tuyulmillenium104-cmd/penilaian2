const http = require('http');
const fs = require('fs');

const GATEWAY = 'http://172.25.136.210:8080/v1';

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
const fullURL = `https://app.rally.fun/campaign/${campaignAddr}`;

function extractTweet(reasoning) {
  const lines = reasoning.split('\n');
  const candidates = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip meta text
    if (trimmed.startsWith('*') || trimmed.startsWith('#') || 
        trimmed.startsWith('**') || trimmed.match(/^\d+\.\s+\*\*/) ||
        trimmed.includes('Critique') || trimmed.includes('Attempt') ||
        trimmed.includes('Character Count') || trimmed.includes('Checking') ||
        trimmed.includes('Refining') || trimmed.includes('Drafting') ||
        trimmed.match(/^\d+\.\s+[A-Z]/) || trimmed.length < 50) {
      continue;
    }
    
    // Must contain rally.fun
    if (trimmed.includes('rally.fun')) {
      // Fix truncated URLs
      let fixed = trimmed;
      if (!fixed.includes(campaignAddr) && fixed.includes('rally.fun/campaign')) {
        // URL is there but maybe truncated, ensure full URL
        fixed = fixed.replace(/https:\/\/app\.rally\.fun\/campaign[^\s]*/, fullURL);
      }
      if (!fixed.includes(campaignAddr) && fixed.includes('rally.fun/c')) {
        // Truncated URL, fix it
        fixed = fixed.replace(/https:\/\/app\.rally\.fun\/c[^\s]*/, fullURL);
      }
      candidates.push(fixed);
    }
  }
  
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
- Include this exact URL: ${fullURL}
- Use parenthetical asides like (not gonna lie)
- Under 280 characters TOTAL

Campaign: Rally Owns the Narrative

OUTPUT: Just the tweet text only.`;

  const userPrompt = `Write a creative tweet. Include the exact URL: ${fullURL}`;

  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.9,
      max_tokens: 500
    });
    
    const req = http.request({
      hostname: '172.25.136.210',
      port: 8080,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Z.ai',
        'X-Z-AI-From': 'Z',
        'X-Token': token,
        'X-User-Id': userId,
        'X-Chat-Id': chatId
      }
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
            
            if (!content && reasoning) {
              content = extractTweet(reasoning) || '';
            }
            
            // Clean up and ensure full URL
            content = content.replace(/^\d+\.\s*/, '').trim();
            
            // Fix truncated URL
            if (content.includes('rally.fun') && !content.includes(campaignAddr)) {
              content = content.replace(/https:\/\/app\.rally\.fun\/[^\s]*/, fullURL);
            }
            
            resolve(content);
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

async function runMultiple() {
  const results = [];
  
  for (let i = 0; i < 5; i++) {
    console.log(`\n📝 Generating content ${i + 1}/5...`);
    try {
      const content = await generate();
      if (content && content.length > 50 && content.includes('rally.fun')) {
        // Verify no em dashes
        if (!content.includes('—')) {
          results.push(content);
          console.log(`   ✅ Got: ${content.substring(0, 80)}...`);
        } else {
          console.log(`   ⚠️ Contains em dash, skipping`);
        }
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
    console.log(`\n${i + 1}. ${c}`);
    console.log(`   (${c.length} chars) ${c.includes('—') ? '❌ HAS EM DASH' : '✅ No em dash'}`);
  });
  
  if (results.length > 0) {
    const best = results[0];
    fs.writeFileSync('/home/z/my-project/download/winner-content.txt', best);
    console.log('\n═════════════════════════════════════════════════════');
    console.log('✅ Best content saved to: winner-content.txt');
    console.log('\n📄 FINAL OUTPUT:');
    console.log(best);
  }
}).catch(err => {
  console.error('Error:', err.message);
});
