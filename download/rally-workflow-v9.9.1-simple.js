/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RALLY WORKFLOW V9.9.1 - FIRST PASS WINS (SIMPLE & RELIABLE)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 ALUR:
 * 1. Generate 1 konten
 * 2. Judge (Fail Fast)
 * 3. Jika LOLOS → STOP! OUTPUT
 * 4. Jika GAGAL → Generate konten baru
 * 5. Ulangi sampai dapat 1 konten yang lolos
 * 
 * 📊 STANDAR TINGGI: 90%, 80%, 87%
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

// Gateway
const GATEWAY = {
  endpoints: [
    'http://172.25.136.210:8080/v1',
    'http://172.25.136.193:8080/v1'
  ],
  index: 0
};

// Config
const CONFIG = {
  version: '9.9.1-simple',
  baseUrl: 'https://app.rally.fun',
  
  // HIGH STANDARDS - Updated to match display
  thresholds: {
    gate1: { max: 20, pass: 18 },   // 90%
    judge2: { max: 5, pass: 4 },    // 80%
    judge3: { max: 80, pass: 70 },  // 87.5%
    total: { max: 105, pass: 92 }   // 87%
  },
  
  // Tokens
  tokens: [
    null,
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtNTQ5ZmI5MTEtZWM0NS00NGJiLTg5YjEtMWY2MTljNTEzN2QzIn0.M6IQTOXasSbEw98a4R6p3LEPwJPCWyRZiJSUo8lr2PM', chatId: 'chat-549fb911-ec45-44bb-89b1-1f619c5137d3', userId: '97631263-5dba-4e16-b127-19212e012a9b', label: 'A#1' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtMTAyYTlkMGUtYTVkNy00MmY2LTk3ZjctNDk5NzFiNzcwNjVhIn0.6cDfQbTc2HHdtKXBfaUvpBsNLPbbjYkpJp6br0rYteA', chatId: 'chat-102a9d0e-a5d7-42f6-97f7-49971b77065a', userId: 'bb829ea3-0d37-4944-8705-00090bde3671', label: 'B#1' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtMDAyOWJjNDYtZGI3Ny00ZmZkLWI4ZDItM2RlYzFlNWVkNDU3In0.CMthZytUFBpnqW3K52Q1AAgB9uvhyXf3AG-FQvaDoYI', chatId: 'chat-0029bc46-db77-4ffd-b8d2-3dec1e5ed457', userId: '97631263-5dba-4e16-b127-19212e012a9b', label: 'A#2' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtOTZlZTk1NmItMGYxMi00MGUxLWE0MzYtYTk4YmQwZjk0YzJhIn0.PgpMEiUr8a6Cu2vl9zFMggRsxQrx3JwkUCOjZCUIJnw', chatId: 'chat-96ee956b-0f12-40e1-a436-a98bd0f94c2a', userId: 'bb829ea3-0d37-4944-8705-00090bde3671', label: 'B#2' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtOWJiMzAzOTMtYWE3Mi00Y2QzLWJkNzktYzJkZmI0ODVmNzgyIn0.jb35oqGKPB2FLC-X_mozORmvbBilwRc_pSZEkbyaRfw', chatId: 'chat-9bb30393-aa72-4cd3-bd79-c2dfb485f782', userId: '97631263-5dba-4e16-b127-19212e012a9b', label: 'A#3' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtYjBiMmFhMmUtZTg5My00NGMwLWEzMTktNTZlYTk0YzRkOTQxIn0.GQLbTpxXn-gcONVhEYr6Ozq7sTOdE5NJt5wIiGfVTQM', chatId: 'chat-b0b2aa2e-e893-44c0-a319-56ea94c4d941', userId: 'bb829ea3-0d37-4944-8705-00090bde3671', label: 'B#3' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtZDE3ZGY4ODQtZGNlOC00MmU3LWEzMTctMDQzYjI0YmM3MjdmIn0.W8UQmOxVIqGsAicZc9n4r4jR3IVM5Yj9V-SWv8H_0ac', chatId: 'chat-d17df884-dce8-42e7-a317-043b24bc727f', userId: '97631263-5dba-4e16-b127-19212e012a9b', label: 'A#4' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtYzAwMTI0YWQtODk2Yy00NzBiLWE0OTYtOGFlNTYzMTQ0YTUwIn0.a0UXyTQ3z4D0g0mzHbVLpBMMN6cftW1W_-ELiObLqXY', chatId: 'chat-c00124ad-896c-470b-a496-8ae563144a50', userId: '97631263-5dba-4e16-b127-19212e012a9b', label: 'C#1' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtNTRjOTZlMTQtNzMyYy00NjA1LWIyZTQtNWU3NzI1MjlhNTQ3In0.VzXhIi9TLBZ_7H0c5pRP9AL7HSCaL3RwO7-j_dqH4FY', chatId: 'chat-54c96e14-732c-4605-b2e4-5e772529a547', userId: 'bb829ea3-0d37-4944-8705-00090bde3671', label: 'D#1' },
    { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtYWYxZDE3YWQtZDI1NC00YmFkLWI5ZmMtN2YyOTIwOTExNjExIn0.xG3YxW5PNy_LJrO9JfPgPFv3U0f_46IY4NqxYTZfqIo', chatId: 'chat-af1d17ad-d254-4bad-b9fc-7f2920911611', userId: '97631263-5dba-4e16-b127-19212e012a9b', label: 'E#1' }
  ]
};

// Token Manager
let tokenIndex = 0;
let tokenStats = [];

function initTokens() {
  tokenStats = CONFIG.tokens.map((t, idx) => ({
    index: idx,
    token: t,
    exhausted: false,
    label: t?.label || `T#${idx}`
  }));
  
  // Load auto config
  try {
    const cfg = JSON.parse(fs.readFileSync('/etc/.z-ai-config', 'utf8'));
    tokenStats[0].token = { token: cfg.token, chatId: cfg.chatId, userId: cfg.userId, label: 'Auto' };
    console.log('   ✅ Auto-token loaded');
  } catch (e) {}
}

function getNextToken() {
  for (let i = 0; i < tokenStats.length; i++) {
    const idx = (tokenIndex + i) % tokenStats.length;
    const t = tokenStats[idx];
    if (!t.exhausted && t.token) {
      tokenIndex = (idx + 1) % tokenStats.length;
      return t;
    }
  }
  // Reset all
  tokenStats.forEach(t => t.exhausted = false);
  return tokenStats.find(t => t.token);
}

function markExhausted(idx) {
  tokenStats[idx].exhausted = true;
}

// HTTP Call
async function callAI(messages, options = {}) {
  const token = getNextToken();
  if (!token?.token) throw new Error('No token');
  
  const gateway = GATEWAY.endpoints[GATEWAY.index];
  GATEWAY.index = (GATEWAY.index + 1) % GATEWAY.endpoints.length;
  
  console.log(`   🔗 [${token.label}] ${gateway.split('/')[2]}`);
  
  return new Promise((resolve, reject) => {
    const url = new URL(`${gateway}/chat/completions`);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const body = JSON.stringify({
      model: options.model || 'glm-4-flash',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000
    });
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer Z.ai',
      'X-Z-AI-From': 'Z',
      'X-Token': token.token.token,
      'X-User-Id': token.token.userId,
      'X-Chat-Id': token.token.chatId
    };
    
    const req = httpModule.request({
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            const msg = json.choices?.[0]?.message || {};
            // Return both content and reasoning_content
            resolve({ 
              content: msg.content || '',
              reasoning_content: msg.reasoning_content || ''
            });
          } catch (e) {
            reject(new Error('Parse error'));
          }
        } else if (res.statusCode === 429) {
          markExhausted(token.index);
          reject(new Error('429'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', e => reject(e));
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

async function callAIRetry(messages, options = {}, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      return await callAI(messages, options);
    } catch (e) {
      if (e.message === '429') {
        console.log(`   ⚠️ Rate limited, switching token (${i+1}/${retries})`);
      } else {
        console.log(`   ⚠️ Error: ${e.message} (${i+1}/${retries})`);
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error('Max retries');
}

// Campaign
async function fetchCampaign(input) {
  if (/^0x[a-fA-F0-9]{40}$/.test(input)) {
    return new Promise((resolve, reject) => {
      https.get(`${CONFIG.baseUrl}/api/campaigns/${input}`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        });
      }).on('error', reject);
    });
  }
  
  return new Promise((resolve, reject) => {
    https.get(`${CONFIG.baseUrl}/api/campaigns?limit=100`, res => {
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

// Generate
async function generateContent(campaign, idx) {
  const angles = ['personal_story', 'data_driven', 'contrarian', 'insider_perspective', 'case_study'];
  const emotions = [['curiosity', 'surprise'], ['fear', 'hope'], ['anger', 'trust'], ['sadness', 'anticipation'], ['surprise', 'joy']];
  
  const angle = angles[idx % angles.length];
  const emotion = emotions[idx % emotions.length];
  
  console.log(`   📝 Generating (${angle})...`);
  
  const userPrompt = `Create ONE tweet (max 280 chars) for this Rally campaign.

Campaign: ${campaign.title}
URL: https://app.rally.fun/campaign/${campaign.intelligentContractAddress}
Goal: ${campaign.goal || 'N/A'}
Style: ${campaign.style || 'Post a banger!'}

Requirements:
- Use ${angle} angle
- Emotion arc: ${emotion[0]} → ${emotion[1]}
- Casual tone with contractions
- Start with hook (tbh, ngl, fun story, honestly)
- Include URL naturally
- End with question
- Use parenthetical asides like (not gonna lie)
- NO hashtags, NO em dashes
- Max 280 characters

OUTPUT ONLY THE TWEET TEXT. Nothing else.`;

  const result = await callAIRetry([
    { role: 'user', content: userPrompt }
  ], { temperature: 0.9, maxTokens: 500 });
  
  // Use reasoning_content if content is empty (GLM-4 behavior)
  let rawContent = result.content || result.reasoning_content || '';
  
  // Extract tweet from reasoning content - look for drafting attempts
  let content = '';
  
  // Try to find "Drafting - Attempt" sections
  const draftMatches = rawContent.match(/Drafting - Attempt \d+:\s*\n([^\n]+\n?[^\n]*)/gi);
  if (draftMatches && draftMatches.length > 0) {
    // Get the last draft attempt
    const lastDraft = draftMatches[draftMatches.length - 1];
    content = lastDraft.replace(/Drafting - Attempt \d+:\s*\n?/i, '').trim();
  }
  
  // If no draft found, try to extract text that looks like a tweet
  if (!content) {
    const lines = rawContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      // Look for lines that start with common tweet hooks
      if (/^(tbh|ngl|fun story|honestly|not gonna lie)/i.test(trimmed)) {
        content = trimmed;
        break;
      }
    }
  }
  
  // Fallback: clean up the raw content
  if (!content) {
    content = rawContent.split('\n').filter(line => {
      const l = line.toLowerCase().trim();
      return l && 
             !l.includes('analyze') && 
             !l.includes('here is') && 
             !l.includes('here\'s') &&
             !l.match(/^\d+\./) &&
             !l.includes('tweet:') &&
             !l.includes('output:') &&
             !l.includes('constraint') &&
             !l.includes('checking') &&
             !l.startsWith('*') &&
             l.length > 20;
    }).join(' ').trim();
  }
  
  // Remove quotes if present
  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }
  
  // Truncate to 280 chars if needed
  if (content.length > 280) {
    content = content.substring(0, 277) + '...';
  }
  
  return content;
}

// Judges
async function judge1(content, campaign) {
  let score = 0;
  
  // URL check
  if (/https?:\/\/[^\s]+/g.test(content)) score += 2;
  
  // Banned words
  const banned = ['amazing', 'incredible', 'revolutionary', 'game-changing', 'groundbreaking'];
  if (!banned.some(w => content.toLowerCase().includes(w))) score += 2;
  
  // AI check
  const prompt = `Score this Rally.fun content against campaign requirements.

Campaign: ${campaign.title}
Goal: ${campaign.goal || 'N/A'}

Score (0-max each):
1. Description Alignment (0-4): Match campaign goal?
2. Rules Compliance (0-4): Follow rules?
3. Style Match (0-3): Match style?
4. Knowledge Base (0-3): Accurate?
5. Additional Info (0-2): Extra details?

JSON only: {"description":X,"rules":X,"style":X,"knowledgeBase":X,"additionalInfo":X}`;

  try {
    const res = await callAIRetry([{ role: 'system', content: prompt }, { role: 'user', content }], { temperature: 0.2, maxTokens: 500 });
    const raw = res.content || res.reasoning_content || '';
    const m = raw.match(/\{[^}]+\}/);
    if (m) {
      const s = JSON.parse(m[0]);
      score += (s.description || 0) + (s.rules || 0) + (s.style || 0) + (s.knowledgeBase || 0) + (s.additionalInfo || 0);
    }
  } catch (e) {
    console.log(`   ⚠️ Judge1 error: ${e.message}`);
  }
  
  return { score, max: 20, passed: score >= CONFIG.thresholds.gate1.pass };
}

async function judge2(content) {
  const prompt = `Extract and verify claims from this content. A claim is any factual statement.

JSON only: {"claims":[{"claim":"...","verifiable":true/false,"verified":true/false}]}
Max 5 claims.`;

  try {
    const res = await callAIRetry([{ role: 'system', content: prompt }, { role: 'user', content }], { temperature: 0.2, maxTokens: 800 });
    const raw = res.content || res.reasoning_content || '';
    const m = raw.match(/\{[^}]+\[[\s\S]*?\][^}]*\}/);
    if (m) {
      const parsed = JSON.parse(m[0]);
      const verified = (parsed.claims || []).filter(c => c.verified).length;
      return { score: verified, max: 5, passed: verified >= CONFIG.thresholds.judge2.pass };
    }
  } catch (e) {
    console.log(`   ⚠️ Judge2 error: ${e.message}`);
  }
  
  return { score: 0, max: 5, passed: false };
}

async function judge3(content) {
  const prompt = `Score this content (0-max each):
1. Originality (0-20)
2. Engagement (0-20)
3. Clarity (0-15)
4. Emotional (0-10)
5. X-Factor (0-15)

JSON only: {"originality":X,"engagement":X,"clarity":X,"emotional":X,"xFactor":X}`;

  try {
    const res = await callAIRetry([{ role: 'system', content: prompt }, { role: 'user', content }], { temperature: 0.2, maxTokens: 500 });
    const raw = res.content || res.reasoning_content || '';
    const m = raw.match(/\{[^}]+\}/);
    if (m) {
      const s = JSON.parse(m[0]);
      const total = (s.originality || 0) + (s.engagement || 0) + (s.clarity || 0) + (s.emotional || 0) + (s.xFactor || 0);
      return { score: total, max: 80, passed: total >= CONFIG.thresholds.judge3.pass, components: s };
    }
  } catch (e) {
    console.log(`   ⚠️ Judge3 error: ${e.message}`);
  }
  
  return { score: 0, max: 80, passed: false };
}

// Main
async function main() {
  const input = process.argv.slice(2).join(' ') || 'Rally';
  
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    RALLY WORKFLOW V9.9.1 - FIRST PASS WINS (HIGH STANDARDS)   ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  📊 Gate: 18/20 (90%) | Facts: 4/5 (80%) | Quality: 70/80 (88%)║');
  console.log('║  🏆 First content to pass → STOP & OUTPUT                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  initTokens();
  
  // Get campaign
  console.log(`\n🔍 Finding campaign: ${input}`);
  const campaign = await fetchCampaign(input);
  if (!campaign) { console.log('   ❌ Not found'); return; }
  console.log(`   ✅ ${campaign.title}`);
  
  const startTime = Date.now();
  let attempts = 0;
  
  // Loop until pass
  while (true) {
    attempts++;
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`🔄 Attempt #${attempts}`);
    console.log('═'.repeat(50));
    
    try {
      // Generate
      const content = await generateContent(campaign, attempts);
      if (!content) { console.log('   ⚠️ No content, retrying...'); continue; }
      
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
      
      // Total
      const total = j1.score + j2.score + j3.score;
      if (total >= CONFIG.thresholds.total.pass) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log('\n');
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║                    🎉 WINNER FOUND! 🎉                         ║');
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log(`║  ⏱️  Time: ${duration}s | Attempts: ${attempts}                            `);
        console.log(`║  📊 Score: ${total}/${CONFIG.thresholds.total.max}                                      `);
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log('║  📝 CONTENT:                                                   ║');
        const lines = content.match(/.{1,54}/g) || [];
        lines.forEach(line => console.log(`║  ${line.padEnd(56)}║`));
        console.log('╚════════════════════════════════════════════════════════════════╝');
        
        console.log('\n\n🏆 FINAL OUTPUT:');
        console.log('─'.repeat(60));
        console.log(content);
        console.log('─'.repeat(60));
        
        return;
      }
      
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
    }
  }
}

main().catch(console.error);
