/**
 * RALLY WORKFLOW V9.9.3 - SDK VERSION
 * Using z-ai-web-dev-sdk for stability
 */

const https = require('https');
const fs = require('fs');
const ZAI = require('z-ai-web-dev-sdk').default;

// Thresholds
const THRESHOLDS = {
  judge1: 18,
  judge2: 4,
  judge3: 70
};

// Create ZAI instance
let zai;

async function initZAI() {
  zai = await ZAI.create();
  console.log('   ✅ ZAI SDK initialized');
}

// API call via SDK
async function callAI(messages, maxTokens = 500, temperature = 0.7) {
  const result = await zai.chat.completions.create({
    model: 'glm-4-flash',
    messages,
    max_tokens: maxTokens,
    temperature
  });
  
  return result.choices[0]?.message?.content || '';
}

// Extract tweet
function extractTweet(raw) {
  const lines = raw.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (/^(tbh|ngl|fun story|honestly|not gonna lie)/i.test(t) && t.length > 30) {
      return t.substring(0, 280);
    }
  }
  const draftMatch = raw.match(/Drafting[^:]*:\s*\n([^\n]+)/i);
  if (draftMatch) return draftMatch[1].trim().substring(0, 280);
  return raw.replace(/\n/g, ' ').substring(0, 280);
}

// Extract JSON
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
- NO hashtags
- Max 280 characters

OUTPUT ONLY THE TWEET TEXT.`;

  const raw = await callAI([{ role: 'user', content: prompt }], 600, 0.9);
  return extractTweet(raw);
}

// Judge 1
async function judge1(content, campaign) {
  let score = 0;
  if (/https?:\/\/[^\s]+/i.test(content)) score += 2;
  const banned = ['amazing', 'incredible', 'revolutionary', 'game-changing', 'groundbreaking'];
  if (!banned.some(w => content.toLowerCase().includes(w))) score += 2;
  
  const prompt = `Score this content: "${content}"
Campaign: ${campaign.title}

Score each (0-max):
1. Description Alignment (0-4)
2. Rules Compliance (0-4)
3. Style Match (0-3)
4. Knowledge Base (0-3)
5. Additional Info (0-2)

JSON only: {"description":X,"rules":X,"style":X,"knowledgeBase":X,"additionalInfo":X}`;

  try {
    const raw = await callAI([
      { role: 'system', content: 'Output only JSON.' },
      { role: 'user', content: prompt }
    ], 400, 0.2);
    
    const json = extractJSON(raw, /\{[^}]+\}/);
    if (json) {
      const s = JSON.parse(json);
      score += (s.description || 0) + (s.rules || 0) + (s.style || 0) + (s.knowledgeBase || 0) + (s.additionalInfo || 0);
    }
  } catch (e) {
    console.log(`   ⚠️ Judge1 error: ${e.message}`);
  }
  
  return { score, max: 20, passed: score >= THRESHOLDS.judge1 };
}

// Judge 2
async function judge2(content) {
  const prompt = `Extract claims from: "${content}"
JSON: {"claims":[{"claim":"...","verified":true/false}]}
Max 5 claims.`;

  try {
    const raw = await callAI([
      { role: 'system', content: 'Output only JSON.' },
      { role: 'user', content: prompt }
    ], 600, 0.2);
    
    const json = extractJSON(raw, /\{[^}]*"claims"[^}]*\[[\s\S]*?\][^}]*\}/);
    if (json) {
      const parsed = JSON.parse(json);
      const verified = (parsed.claims || []).filter(c => c.verified).length;
      return { score: verified, max: 5, passed: verified >= THRESHOLDS.judge2 };
    }
  } catch (e) {
    console.log(`   ⚠️ Judge2 error: ${e.message}`);
  }
  
  return { score: 0, max: 5, passed: false };
}

// Judge 3
async function judge3(content) {
  const prompt = `Score this content (0-max):
1. Originality (0-20)
2. Engagement (0-20)
3. Clarity (0-15)
4. Emotional (0-10)
5. X-Factor (0-15)

Content: "${content}"
JSON only: {"originality":X,"engagement":X,"clarity":X,"emotional":X,"xFactor":X}`;

  try {
    const raw = await callAI([
      { role: 'system', content: 'Output only JSON.' },
      { role: 'user', content: prompt }
    ], 400, 0.2);
    
    const json = extractJSON(raw, /\{[^}]+\}/);
    if (json) {
      const s = JSON.parse(json);
      const total = (s.originality || 0) + (s.engagement || 0) + (s.clarity || 0) + (s.emotional || 0) + (s.xFactor || 0);
      return { score: total, max: 80, passed: total >= THRESHOLDS.judge3, components: s };
    }
  } catch (e) {
    console.log(`   ⚠️ Judge3 error: ${e.message}`);
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
  console.log('║    RALLY WORKFLOW V9.9.3 - SDK VERSION (HIGH STANDARDS)       ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  📊 Gate: 18/20 (90%) | Facts: 4/5 (80%) | Quality: 70/80 (88%)║');
  console.log('║  🏆 First content to pass → STOP & OUTPUT                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  // Init SDK
  await initZAI();
  
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
      
      fs.writeFileSync('/home/z/my-project/download/winner-content.txt', content);
      console.log('\n💾 Saved to: /home/z/my-project/download/winner-content.txt');
      
      return;
      
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
