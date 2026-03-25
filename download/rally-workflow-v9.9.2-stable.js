/**
 * RALLY WORKFLOW V9.9.2 - STABLE VERSION
 * - Single token (auto)
 * - High standards (90%, 80%, 87%)
 * - Simple error handling
 * - First pass wins
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

// Load config
let CFG;
try {
  CFG = JSON.parse(fs.readFileSync('/etc/.z-ai-config', 'utf8'));
} catch (e) {
  console.error('Cannot load config');
  process.exit(1);
}

// High standards thresholds
const THRESHOLDS = {
  judge1: 18,  // 90% of 20
  judge2: 4,   // 80% of 5
  judge3: 70   // 87% of 80
};

// API call with timeout
function callAI(messages, maxTokens = 500, temperature = 0.7) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'glm-4-flash',
      messages,
      max_tokens: maxTokens,
      temperature
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
        'X-Token': CFG.token,
        'X-User-Id': CFG.userId,
        'X-Chat-Id': CFG.chatId
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            const msg = json.choices?.[0]?.message || {};
            resolve(msg.content || msg.reasoning_content || '');
          } catch (e) {
            reject(new Error('Parse error'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(45000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

// Extract tweet from reasoning
function extractTweet(raw) {
  // Look for lines starting with hooks
  const lines = raw.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (/^(tbh|ngl|fun story|honestly|not gonna lie)/i.test(t) && t.length > 30) {
      return t.substring(0, 280);
    }
  }
  
  // Look for draft sections
  const draftMatch = raw.match(/Drafting[^:]*:\s*\n([^\n]+)/i);
  if (draftMatch) {
    return draftMatch[1].trim().substring(0, 280);
  }
  
  // Fallback
  return raw.replace(/\n/g, ' ').substring(0, 280);
}

// Extract JSON from response
function extractJSON(raw, pattern) {
  const m = raw.match(pattern);
  return m ? m[0] : null;
}

// Generate content
async function generateContent(campaign, attempt) {
  const angles = ['personal_story', 'data_driven', 'contrarian', 'insider_perspective', 'case_study'];
  const angle = angles[attempt % angles.length];
  
  console.log(`   📝 Generating (${angle})...`);
  
  const prompt = `Create ONE tweet (max 280 chars) for Rally campaign: ${campaign.title}
URL: https://app.rally.fun/campaign/${campaign.intelligentContractAddress}
Style: ${campaign.style || 'Post a banger!'}

Requirements:
- Use ${angle} angle
- Casual tone with contractions
- Start with hook (tbh, ngl, fun story, honestly)
- Include URL naturally
- End with question
- NO hashtags, NO em dashes
- Max 280 characters

OUTPUT ONLY THE TWEET TEXT.`;

  const raw = await callAI([{ role: 'user', content: prompt }], 600, 0.9);
  return extractTweet(raw);
}

// Judge 1: Gate
async function judge1(content, campaign) {
  let score = 0;
  
  // Quick checks
  if (/https?:\/\/[^\s]+/i.test(content)) score += 2;
  
  const banned = ['amazing', 'incredible', 'revolutionary', 'game-changing', 'groundbreaking'];
  if (!banned.some(w => content.toLowerCase().includes(w))) score += 2;
  
  // AI scoring
  const prompt = `Score this Rally content:
Content: "${content}"
Campaign: ${campaign.title}

Score each (0-max):
1. Description Alignment (0-4)
2. Rules Compliance (0-4)
3. Style Match (0-3)
4. Knowledge Base (0-3)
5. Additional Info (0-2)

JSON only: {"description":X,"rules":X,"style":X,"knowledgeBase":X,"additionalInfo":X}`;

  const raw = await callAI([
    { role: 'system', content: 'You are a content judge. Output only JSON.' },
    { role: 'user', content: prompt }
  ], 400, 0.2);
  
  const json = extractJSON(raw, /\{[^}]+\}/);
  if (json) {
    try {
      const s = JSON.parse(json);
      score += (s.description || 0) + (s.rules || 0) + (s.style || 0) + (s.knowledgeBase || 0) + (s.additionalInfo || 0);
    } catch (e) {}
  }
  
  return { score, max: 20, passed: score >= THRESHOLDS.judge1 };
}

// Judge 2: Facts
async function judge2(content) {
  const prompt = `Extract claims from this content:
"${content}"

A claim is any factual statement. JSON only:
{"claims":[{"claim":"...","verified":true/false}]}

Max 5 claims.`;

  const raw = await callAI([
    { role: 'system', content: 'You are a fact checker. Output only JSON.' },
    { role: 'user', content: prompt }
  ], 600, 0.2);
  
  const json = extractJSON(raw, /\{[^}]*"claims"[^}]*\[[\s\S]*?\][^}]*\}/);
  if (json) {
    try {
      const parsed = JSON.parse(json);
      const verified = (parsed.claims || []).filter(c => c.verified).length;
      return { score: verified, max: 5, passed: verified >= THRESHOLDS.judge2 };
    } catch (e) {}
  }
  
  return { score: 0, max: 5, passed: false };
}

// Judge 3: Quality
async function judge3(content) {
  const prompt = `Score this content (0-max each):
1. Originality (0-20)
2. Engagement (0-20)
3. Clarity (0-15)
4. Emotional (0-10)
5. X-Factor (0-15)

Content: "${content}"

JSON only: {"originality":X,"engagement":X,"clarity":X,"emotional":X,"xFactor":X}`;

  const raw = await callAI([
    { role: 'system', content: 'You are a content quality judge. Output only JSON.' },
    { role: 'user', content: prompt }
  ], 400, 0.2);
  
  const json = extractJSON(raw, /\{[^}]+\}/);
  if (json) {
    try {
      const s = JSON.parse(json);
      const total = (s.originality || 0) + (s.engagement || 0) + (s.clarity || 0) + (s.emotional || 0) + (s.xFactor || 0);
      return { score: total, max: 80, passed: total >= THRESHOLDS.judge3, components: s };
    } catch (e) {}
  }
  
  return { score: 0, max: 80, passed: false };
}

// Fetch campaign
async function fetchCampaign(input) {
  return new Promise((resolve, reject) => {
    https.get(`https://app.rally.fun/api/campaigns?limit=100`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const campaigns = json.campaigns || json.data || json || [];
          const inputLower = input.toLowerCase();
          resolve(campaigns.find(c => 
            c.title?.toLowerCase().includes(inputLower) ||
            c.intelligentContractAddress?.toLowerCase() === inputLower
          ));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// Main
async function main() {
  const input = process.argv.slice(2).join(' ') || 'Rally';
  
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    RALLY WORKFLOW V9.9.2 - STABLE (HIGH STANDARDS)            ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  📊 Gate: 18/20 (90%) | Facts: 4/5 (80%) | Quality: 70/80 (88%)║');
  console.log('║  🏆 First content to pass → STOP & OUTPUT                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  // Get campaign
  console.log(`\n🔍 Finding campaign: ${input}`);
  const campaign = await fetchCampaign(input);
  if (!campaign) { console.log('   ❌ Not found'); return; }
  console.log(`   ✅ ${campaign.title}`);
  
  const startTime = Date.now();
  let attempts = 0;
  
  // Main loop
  while (true) {
    attempts++;
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`🔄 Attempt #${attempts}`);
    console.log('═'.repeat(50));
    
    try {
      // Generate
      const content = await generateContent(campaign, attempts);
      if (!content || content.length < 20) {
        console.log('   ⚠️ Content too short, retrying...');
        continue;
      }
      console.log(`   ✅ Generated: "${content.substring(0, 60)}..."`);
      
      // Judge 1
      console.log('\n   ⚖️ Judge 1 (Gate)...');
      const j1 = await judge1(content, campaign);
      console.log(`   📊 ${j1.score}/${j1.max} ${j1.passed ? '✅ PASS' : '❌ FAIL'}`);
      if (!j1.passed) continue;
      
      // Judge 2
      console.log('   ⚖️ Judge 2 (Facts)...');
      const j2 = await judge2(content);
      console.log(`   📊 ${j2.score}/${j2.max} ${j2.passed ? '✅ PASS' : '❌ FAIL'}`);
      if (!j2.passed) continue;
      
      // Judge 3
      console.log('   ⚖️ Judge 3 (Quality)...');
      const j3 = await judge3(content);
      console.log(`   📊 ${j3.score}/${j3.max} ${j3.passed ? '✅ PASS' : '❌ FAIL'}`);
      if (!j3.passed) continue;
      
      // WINNER!
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      const total = j1.score + j2.score + j3.score;
      
      console.log('\n');
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║                    🎉 WINNER FOUND! 🎉                         ║');
      console.log('╠════════════════════════════════════════════════════════════════╣');
      console.log(`║  ⏱️  Time: ${duration}s | Attempts: ${attempts}                            `);
      console.log(`║  📊 Score: ${total}/105                                           `);
      console.log('╠════════════════════════════════════════════════════════════════╣');
      console.log('║  📝 CONTENT:                                                   ║');
      const lines = content.match(/.{1,54}/g) || [];
      lines.forEach(line => console.log(`║  ${line.padEnd(56)}║`));
      console.log('╚════════════════════════════════════════════════════════════════╝');
      
      console.log('\n\n🏆 FINAL OUTPUT:');
      console.log('─'.repeat(60));
      console.log(content);
      console.log('─'.repeat(60));
      
      // Save to file
      fs.writeFileSync('/home/z/my-project/download/winner-content.txt', content);
      console.log('\n💾 Saved to: /home/z/my-project/download/winner-content.txt');
      
      return;
      
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
