/**
 * RALLY WORKFLOW V9.9.2 - SIMPLE & DIRECT
 * First content to pass all judges → STOP & OUTPUT
 */

const http = require('http');
const fs = require('fs');

// Tokens
const TOKENS = [
  { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtNTQ5ZmI5MTEtZWM0NS00NGJiLTg5YjEtMWY2MTljNTEzN2QzIn0.M6IQTOXasSbEw98a4R6p3LEPwJPCWyRZiJSUo8lr2PM', userId: '97631263-5dba-4e16-b127-19212e012a9b', chatId: 'chat-549fb911-ec45-44bb-89b1-1f619c5137d3', label: 'A#1' },
  { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtMTAyYTlkMGUtYTVkNy00MmY2LTk3ZjctNDk5NzFiNzcwNjVhIn0.6cDfQbTc2HHdtKXBfaUvpBsNLPbbjYkpJp6br0rYteA', userId: 'bb829ea3-0d37-4944-8705-00090bde3671', chatId: 'chat-102a9d0e-a5d7-42f6-97f7-49971b77065a', label: 'B#1' },
  { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtMDAyOWJjNDYtZGI3Ny00ZmZkLWI4ZDItM2RlYzFlNWVkNDU3In0.CMthZytUFBpnqW3K52Q1AAgB9uvhyXf3AG-FQvaDoYI', userId: '97631263-5dba-4e16-b127-19212e012a9b', chatId: 'chat-0029bc46-db77-4ffd-b8d2-3dec1e5ed457', label: 'A#2' },
  { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtOTZlZTk1NmItMGYxMi00MGUxLWE0MzYtYTk4YmQwZjk0YzJhIn0.PgpMEiUr8a6Cu2vl9zFMggRsxQrx3JwkUCOjZCUIJnw', userId: 'bb829ea3-0d37-4944-8705-00090bde3671', chatId: 'chat-96ee956b-0f12-40e1-a436-a98bd0f94c2a', label: 'B#2' },
];

let tokenIdx = 0;
const GATEWAY = 'http://172.25.136.210:8080/v1';

// Thresholds (80%, 60%, 75%)
const THRESHOLDS = {
  gate: 16,   // /20
  facts: 3,   // /5
  quality: 60 // /80
};

// API Call
async function callAI(prompt, maxTokens = 500) {
  const token = TOKENS[tokenIdx++ % TOKENS.length];
  
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'glm-4-flash',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.9
    });
    
    const req = http.request(`${GATEWAY}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Z.ai',
        'X-Z-AI-From': 'Z',
        'X-Token': token.token,
        'X-User-Id': token.userId,
        'X-Chat-Id': token.chatId
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            const msg = json.choices?.[0]?.message || {};
            resolve(msg.content || msg.reasoning_content || '');
          } catch (e) { reject(e); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

// Generate tweet
async function generateTweet(campaign, idx) {
  const angles = ['story', 'data', 'hot_take', 'question', 'tip'];
  const angle = angles[idx % angles.length];
  
  const prompt = `Write ONE tweet for Rally campaign "${campaign.title}".

URL: https://app.rally.fun/campaign/${campaign.address}

Rules:
- Casual tone (use contractions, lowercase for emphasis)
- Start with hook (tbh, ngl, fun story, honestly)
- Include URL naturally
- End with question
- Use parenthetical asides like (not gonna lie)
- Max 280 characters
- NO hashtags, NO markdown

Angle: ${angle}

Output ONLY the tweet text:`;

  console.log(`   📝 Generating (${angle})...`);
  // Request more tokens to allow for both reasoning and output
  let content = await callAI(prompt, 800);
  
  // Clean up
  content = content
    .replace(/\*\*/g, '')
    .replace(/["']/g, '')
    .trim();
  
  // Extract actual tweet from reasoning if needed
  // Look for the final output after the reasoning
  const lines = content.split('\n');
  let tweetFound = '';
  
  for (const line of lines) {
    const cleaned = line.trim();
    // Skip meta/reasoning lines
    if (cleaned.match(/^(\d+\.|\*|>|Title:|Output:|Tweet:|Campaign:|URL:)/i)) continue;
    if (cleaned.toLowerCase().includes('analyze')) continue;
    if (cleaned.toLowerCase().includes('request')) continue;
    if (cleaned.length < 10) continue;
    if (cleaned.length > 300) continue;
    
    // Found a valid tweet line
    if (cleaned.includes('rally.fun') || cleaned.includes('rally') || 
        cleaned.includes('tbh') || cleaned.includes('ngl') ||
        cleaned.includes('fun story') || cleaned.includes('honestly')) {
      tweetFound = cleaned;
      break;
    }
  }
  
  if (!tweetFound) {
    // Last resort - take the longest line that's under 280 chars
    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned.length > 20 && cleaned.length <= 280) {
        tweetFound = cleaned;
        break;
      }
    }
  }
  
  content = tweetFound || content.substring(0, 280);
  
  console.log(`   ✅ "${content.substring(0, 60)}..."`);
  return content;
}

// Judge Gate
async function judgeGate(content, campaign) {
  const prompt = `Score this Rally tweet (0-20):

Tweet: "${content}"
Campaign: "${campaign.title}"

Score:
- Has URL (0-2):
- No banned words (0-2): amazing, incredible, revolutionary
- Matches goal (0-4):
- Follows style (0-4):
- Good hook (0-4):
- Has question (0-4):

JSON only: {"url":X,"banned":X,"goal":X,"style":X,"hook":X,"question":X}`;

  const result = await callAI(prompt, 200);
  const m = result.match(/\{[^}]+\}/);
  if (m) {
    const s = JSON.parse(m[0]);
    return (s.url||0) + (s.banned||0) + (s.goal||0) + (s.style||0) + (s.hook||0) + (s.question||0);
  }
  return 0;
}

// Judge Facts
async function judgeFacts(content) {
  const prompt = `Extract claims from this tweet and verify.

Tweet: "${content}"

JSON only: {"claims":[{"claim":"...","verified":true/false}]}
Max 3 claims.`;

  const result = await callAI(prompt, 300);
  const m = result.match(/\{[^}]+\[[\s\S]*?\][^}]*\}/);
  if (m) {
    const parsed = JSON.parse(m[0]);
    return (parsed.claims || []).filter(c => c.verified).length;
  }
  return 0;
}

// Judge Quality
async function judgeQuality(content) {
  const prompt = `Score this tweet quality (0-80):

Tweet: "${content}"

Score:
- Originality (0-20):
- Engagement (0-20):
- Clarity (0-15):
- Emotional (0-10):
- X-Factor (0-15):

JSON only: {"originality":X,"engagement":X,"clarity":X,"emotional":X,"xFactor":X}`;

  const result = await callAI(prompt, 200);
  const m = result.match(/\{[^}]+\}/);
  if (m) {
    const s = JSON.parse(m[0]);
    return (s.originality||0) + (s.engagement||0) + (s.clarity||0) + (s.emotional||0) + (s.xFactor||0);
  }
  return 0;
}

// Main
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    RALLY WORKFLOW V9.9.2 - FIRST PASS WINS                     ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  📊 Gate: 16/20 (80%) | Facts: 3/5 (60%) | Quality: 60/80 (75%)║');
  console.log('║  🏆 First content to pass → STOP & OUTPUT                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  const campaign = {
    title: 'Rally Owns the Narrative',
    address: '0xd6174FCf9a69837846860CCaC6394D3E6645CC22'
  };
  
  console.log(`\n🎯 Campaign: ${campaign.title}`);
  
  let attempt = 0;
  const startTime = Date.now();
  
  while (true) {
    attempt++;
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`🔄 Attempt #${attempt}`);
    console.log('═'.repeat(50));
    
    try {
      // Generate
      const content = await generateTweet(campaign, attempt);
      if (!content || content.length < 20) {
        console.log('   ⚠️ Content too short, retrying...');
        continue;
      }
      
      // Judge Gate
      console.log('   ⚖️ Judge 1 (Gate)...');
      const gate = await judgeGate(content, campaign);
      console.log(`   📊 ${gate}/20 ${gate >= THRESHOLDS.gate ? '✅ PASS' : '❌ FAIL'}`);
      if (gate < THRESHOLDS.gate) continue;
      
      // Judge Facts
      console.log('   ⚖️ Judge 2 (Facts)...');
      const facts = await judgeFacts(content);
      console.log(`   📊 ${facts}/5 ${facts >= THRESHOLDS.facts ? '✅ PASS' : '❌ FAIL'}`);
      if (facts < THRESHOLDS.facts) continue;
      
      // Judge Quality
      console.log('   ⚖️ Judge 3 (Quality)...');
      const quality = await judgeQuality(content);
      console.log(`   📊 ${quality}/80 ${quality >= THRESHOLDS.quality ? '✅ PASS' : '❌ FAIL'}`);
      if (quality < THRESHOLDS.quality) continue;
      
      // PASSED!
      const total = gate + facts + quality;
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      console.log('\n');
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║                    🎉 WINNER FOUND! 🎉                         ║');
      console.log('╠════════════════════════════════════════════════════════════════╣');
      console.log(`║  ⏱️  Time: ${duration}s | Attempts: ${attempt}                            `);
      console.log(`║  📊 Score: ${total}/105                                         `);
      console.log('╠════════════════════════════════════════════════════════════════╣');
      console.log('║  📝 CONTENT:                                                   ║');
      const lines = content.match(/.{1,54}/g) || [];
      lines.forEach(line => console.log(`║  ${line.padEnd(56)}║`));
      console.log('╚════════════════════════════════════════════════════════════════╝');
      
      console.log('\n\n🏆 FINAL OUTPUT:');
      console.log('─'.repeat(60));
      console.log(content);
      console.log('─'.repeat(60));
      
      return content;
      
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
    }
  }
}

main().catch(console.error);
