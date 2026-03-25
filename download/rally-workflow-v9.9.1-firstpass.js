/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RALLY WORKFLOW V9.9.1 - FIRST PASS WINS (HIGH STANDARDS)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 ALUR:
 * 1. Generate 3 konten PARALLEL
 * 2. Setiap konten yang selesai → LANGSUNG Judge (Fail Fast)
 * 3. Jika ada yang LOLOS semua judge → STOP! OUTPUT konten tersebut
 * 4. Jika semua GAGAL → Generate 3 konten baru
 * 5. Ulangi sampai dapat 1 konten yang lolos (TANPA BATAS)
 * 
 * 📊 STANDAR TINGGI:
 * - Judge 1 (Gate): 18/20 (90%)
 * - Judge 2 (Facts): 4/5 (80%)
 * - Judge 3 (Quality): 70/80 (87.5%)
 * - Total: 92/105 (87%)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================================================
// GATEWAY CONFIGURATION
// ============================================================================

const GATEWAY_CONFIG = {
  endpoints: [
    'http://172.25.136.210:8080/v1',
    'http://172.25.136.193:8080/v1'
  ],
  currentIndex: 0
};

// ============================================================================
// CONFIGURATION - HIGH STANDARDS
// ============================================================================

const CONFIG = {
  version: '9.9.1-firstpass',
  
  baseUrl: 'https://app.rally.fun',
  gateway: GATEWAY_CONFIG,
  
  parallel: {
    maxConcurrentGenerate: 3,
    maxConcurrentJudges: 5
  },
  
  rateLimiter: {
    maxQPS: 5,
    enabled: true
  },
  
  // 11 Tokens
  tokens: [
    null, // Auto from .z-ai-config
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtNTQ5ZmI5MTEtZWM0NS00NGJiLTg5YjEtMWY2MTljNTEzN2QzIn0.M6IQTOXasSbEw98a4R6p3LEPwJPCWyRZiJSUo8lr2PM',
      chatId: 'chat-549fb911-ec45-44bb-89b1-1f619c5137d3',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun A #1',
      isBackup: false
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtMTAyYTlkMGUtYTVkNy00MmY2LTk3ZjctNDk5NzFiNzcwNjVhIn0.6cDfQbTc2HHdtKXBfaUvpBsNLPbbjYkpJp6br0rYteA',
      chatId: 'chat-102a9d0e-a5d7-42f6-97f7-49971b77065a',
      userId: 'bb829ea3-0d37-4944-8705-00090bde3671',
      label: 'Akun B #1',
      isBackup: false
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtMDAyOWJjNDYtZGI3Ny00ZmZkLWI4ZDItM2RlYzFlNWVkNDU3In0.CMthZytUFBpnqW3K52Q1AAgB9uvhyXf3AG-FQvaDoYI',
      chatId: 'chat-0029bc46-db77-4ffd-b8d2-3dec1e5ed457',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun A #2',
      isBackup: false
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtOTZlZTk1NmItMGYxMi00MGUxLWE0MzYtYTk4YmQwZjk0YzJhIn0.PgpMEiUr8a6Cu2vl9zFMggRsxQrx3JwkUCOjZCUIJnw',
      chatId: 'chat-96ee956b-0f12-40e1-a436-a98bd0f94c2a',
      userId: 'bb829ea3-0d37-4944-8705-00090bde3671',
      label: 'Akun B #2',
      isBackup: false
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtOWJiMzAzOTMtYWE3Mi00Y2QzLWJkNzktYzJkZmI0ODVmNzgyIn0.jb35oqGKPB2FLC-X_mozORmvbBilwRc_pSZEkbyaRfw',
      chatId: 'chat-9bb30393-aa72-4cd3-bd79-c2dfb485f782',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun A #3',
      isBackup: true
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtYjBiMmFhMmUtZTg5My00NGMwLWEzMTktNTZlYTk0YzRkOTQxIn0.GQLbTpxXn-gcONVhEYr6Ozq7sTOdE5NJt5wIiGfVTQM',
      chatId: 'chat-b0b2aa2e-e893-44c0-a319-56ea94c4d941',
      userId: 'bb829ea3-0d37-4944-8705-00090bde3671',
      label: 'Akun B #3',
      isBackup: true
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtZDE3ZGY4ODQtZGNlOC00MmU3LWEzMTctMDQzYjI0YmM3MjdmIn0.W8UQmOxVIqGsAicZc9n4r4jR3IVM5Yj9V-SWv8H_0ac',
      chatId: 'chat-d17df884-dce8-42e7-a317-043b24bc727f',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun A #4',
      isBackup: true
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtYzAwMTI0YWQtODk2Yy00NzBiLWE0OTYtOGFlNTYzMTQ0YTUwIn0.a0UXyTQ3z4D0g0mzHbVLpBMMN6cftW1W_-ELiObLqXY',
      chatId: 'chat-c00124ad-896c-470b-a496-8ae563144a50',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun C #1',
      isBackup: true
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtNTRjOTZlMTQtNzMyYy00NjA1LWIyZTQtNWU3NzI1MjlhNTQ3In0.VzXhIi9TLBZ_7H0c5pRP9AL7HSCaL3RwO7-j_dqH4FY',
      chatId: 'chat-54c96e14-732c-4605-b2e4-5e772529a547',
      userId: 'bb829ea3-0d37-4944-8705-00090bde3671',
      label: 'Akun D #1',
      isBackup: true
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtYWYxZDE3YWQtZDI1NC00YmFkLWI5ZmMtN2YyOTIwOTExNjExIn0.xG3YxW5PNy_LJrO9JfPgPFv3U0f_46IY4NqxYTZfqIo',
      chatId: 'chat-af1d17ad-d254-4bad-b9fc-7f2920911611',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun E #1',
      isBackup: true
    }
  ],
  
  // HIGH STANDARDS THRESHOLDS
  thresholds: {
    gate1: { max: 20, pass: 18 },    // 90%
    judge2: { max: 5, pass: 4 },     // 80%
    judge3: { max: 80, pass: 70 },   // 87.5%
    total: { max: 105, pass: 92 }    // 87%
  },
  
  contentsPerCycle: 3
};

// ============================================================================
// UTILITY
// ============================================================================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function timestamp() {
  return new Date().toISOString().split('T')[1].split('.')[0];
}

// ============================================================================
// SMART TOKEN POOL
// ============================================================================

class SmartTokenPool {
  constructor(config) {
    this.rawTokens = config.tokens || [null];
    this.tokenStats = [];
    this.lockedTokens = new Map();
    this.initializeTokens();
    this.loadAutoConfig();
  }
  
  initializeTokens() {
    this.tokenStats = this.rawTokens.map((t, idx) => ({
      index: idx,
      token: t,
      remainingDaily: 300,
      isExhausted: false,
      label: t?.label || `Token #${idx}`,
      isBackup: t?.isBackup || false
    }));
  }
  
  loadAutoConfig() {
    try {
      const configPath = '/etc/.z-ai-config';
      if (fs.existsSync(configPath)) {
        const autoConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.tokenStats[0].token = {
          token: autoConfig.token,
          chatId: autoConfig.chatId,
          userId: autoConfig.userId,
          label: 'Auto-Config',
          isBackup: false
        };
        console.log('   ✅ Auto-token loaded');
      }
    } catch (e) {
      console.log('   ⚠️ Could not load auto-config');
    }
  }
  
  async acquireToken(taskId, purpose, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const available = this.tokenStats.filter(t => 
        !t.isExhausted && 
        t.token !== null && 
        !this.lockedTokens.has(t.index)
      );
      
      if (available.length > 0) {
        available.sort((a, b) => {
          if (a.isBackup !== b.isBackup) return a.isBackup ? 1 : -1;
          return b.remainingDaily - a.remainingDaily;
        });
        
        const selected = available[0];
        this.lockedTokens.set(selected.index, { lockedAt: Date.now(), taskId, purpose });
        
        return {
          tokenStats: selected,
          release: () => this.releaseToken(selected.index, taskId)
        };
      }
      
      await delay(500);
    }
    
    throw new Error(`Token acquisition timeout for ${taskId}`);
  }
  
  releaseToken(tokenIndex, taskId) {
    const lock = this.lockedTokens.get(tokenIndex);
    if (lock && lock.taskId === taskId) {
      this.lockedTokens.delete(tokenIndex);
    }
  }
  
  updateTokenStats(tokenIndex, headers) {
    const stats = this.tokenStats[tokenIndex];
    if (!stats || !headers) return;
    
    const dailyRemaining = parseInt(headers['x-ratelimit-remaining-daily'] || '300');
    stats.remainingDaily = dailyRemaining;
    
    if (dailyRemaining < 10) {
      stats.isExhausted = true;
      console.log(`   ⚠️ Token ${stats.label} exhausted (${dailyRemaining} remaining)`);
    }
  }
  
  markTokenExhausted(tokenIndex) {
    const stats = this.tokenStats[tokenIndex];
    if (stats) {
      stats.isExhausted = true;
      this.lockedTokens.delete(tokenIndex);
    }
  }
  
  getAvailableCount() {
    return this.tokenStats.filter(t => !t.isExhausted && t.token !== null && !this.lockedTokens.has(t.index)).length;
  }
}

// ============================================================================
// RATE LIMITER
// ============================================================================

class RateLimiter {
  constructor(maxQPS = 5) {
    this.maxQPS = maxQPS;
    this.minInterval = 1000 / maxQPS;
    this.lastRequestTime = 0;
  }
  
  async waitForSlot() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    
    if (elapsed < this.minInterval) {
      await delay(this.minInterval - elapsed);
    }
    
    this.lastRequestTime = Date.now();
  }
}

// Global instances
let smartTokenPool = null;
let rateLimiter = null;

function getSmartTokenPool() {
  if (!smartTokenPool) smartTokenPool = new SmartTokenPool(CONFIG);
  return smartTokenPool;
}

function getRateLimiter() {
  if (!rateLimiter) rateLimiter = new RateLimiter(CONFIG.rateLimiter.maxQPS);
  return rateLimiter;
}

// ============================================================================
// HTTP CALL
// ============================================================================

async function callAIviaHTTP(messages, options = {}) {
  const rl = getRateLimiter();
  await rl.waitForSlot();
  
  const pool = getSmartTokenPool();
  const acquired = await pool.acquireToken(
    `api-${Date.now()}`,
    options.purpose || 'api'
  );
  
  const tokenStats = acquired.tokenStats;
  const tokenData = tokenStats.token;
  const tokenIndex = tokenStats.index;
  
  const gateway = GATEWAY_CONFIG.endpoints[GATEWAY_CONFIG.currentIndex];
  GATEWAY_CONFIG.currentIndex = (GATEWAY_CONFIG.currentIndex + 1) % GATEWAY_CONFIG.endpoints.length;
  
  return new Promise((resolve, reject) => {
    const url = new URL(`${gateway}/chat/completions`);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const requestBody = JSON.stringify({
      model: options.model || 'glm-4-flash',
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000
    });
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer Z.ai',
      'X-Z-AI-From': 'Z',
      'X-Token': tokenData.token,
      'X-User-Id': tokenData.userId,
      'X-Chat-Id': tokenData.chatId
    };
    
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: headers
    };
    
    const req = httpModule.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        pool.updateTokenStats(tokenIndex, res.headers);
        acquired.release();
        
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({ content: json.choices?.[0]?.message?.content || '', headers: res.headers });
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}`));
          }
        } else if (res.statusCode === 429) {
          pool.markTokenExhausted(tokenIndex);
          reject(new Error(`Rate limited (429)`));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (e) => {
      acquired.release();
      reject(new Error(`Request error: ${e.message}`));
    });
    
    req.setTimeout(60000, () => {
      req.destroy();
      acquired.release();
      reject(new Error('Timeout'));
    });
    
    req.write(requestBody);
    req.end();
  });
}

async function callAIWithRetry(messages, options = {}, maxRetries = 5) {
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callAIviaHTTP(messages, options);
    } catch (error) {
      lastError = error;
      
      if (error.message.includes('429') || error.message.includes('Rate limited')) {
        console.log(`   ⚠️ [${timestamp()}] Rate limited, switching token (${attempt + 1}/${maxRetries})`);
        await delay(500);
      } else if (error.message.includes('timeout')) {
        console.log(`   ⚠️ [${timestamp()}] Token busy, waiting (${attempt + 1}/${maxRetries})`);
        await delay(1000);
      } else {
        await delay(500 * (attempt + 1));
      }
    }
  }
  
  throw lastError;
}

// ============================================================================
// CAMPAIGN FUNCTIONS
// ============================================================================

async function fetchAllCampaigns() {
  return new Promise((resolve, reject) => {
    https.get(`${CONFIG.baseUrl}/api/campaigns?limit=100`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.campaigns || json.data || json || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchCampaign(address) {
  return new Promise((resolve, reject) => {
    https.get(`${CONFIG.baseUrl}/api/campaigns/${address}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.campaigns || json.data || json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function isEthereumAddress(str) {
  return /^0x[a-fA-F0-9]{40}$/.test(str);
}

async function resolveCampaign(input) {
  if (isEthereumAddress(input)) return await fetchCampaign(input);
  
  const campaigns = await fetchAllCampaigns();
  const inputLower = input.toLowerCase();
  
  return campaigns.find(c => 
    c.title?.toLowerCase().includes(inputLower) ||
    c.intelligentContractAddress?.toLowerCase() === inputLower
  ) || null;
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

async function generateSingleContent(campaignData, index) {
  const angles = ['personal_story', 'data_driven', 'contrarian', 'insider_perspective', 'case_study'];
  const emotions = [
    ['curiosity', 'surprise'],
    ['fear', 'hope'],
    ['anger', 'trust'],
    ['sadness', 'anticipation'],
    ['surprise', 'joy']
  ];
  const structures = ['hero_journey', 'problem_solution', 'before_after', 'mystery_reveal', 'case_study'];
  
  const selectedAngle = angles[index % angles.length];
  const selectedEmotion = emotions[index % emotions.length];
  const selectedStructure = structures[index % structures.length];
  
  console.log(`   📝 [${timestamp()}] Generating Content ${index + 1} (${selectedAngle})...`);
  
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

Campaign: ${campaignData.title}
URL: https://app.rally.fun/campaign/${campaignData.intelligentContractAddress}
Goal: ${campaignData.goal || 'N/A'}
Style: ${campaignData.style || 'Post a banger!'}

Angle: ${selectedAngle}
Emotions: ${selectedEmotion[0]} → ${selectedEmotion[1]}
Structure: ${selectedStructure}`;

  const userPrompt = `Create a tweet (under 280 chars) for this Rally campaign.
Use the ${selectedAngle} angle with ${selectedEmotion[0]} → ${selectedEmotion[1]} emotions.
Structure: ${selectedStructure}.
Include the URL naturally.`;

  try {
    const result = await callAIWithRetry([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.8, maxTokens: 500, purpose: `gen-${index}` });
    
    console.log(`   ✅ [${timestamp()}] Content ${index + 1} generated`);
    return { index, content: result.content, success: true };
  } catch (error) {
    console.log(`   ❌ [${timestamp()}] Content ${index + 1} failed: ${error.message}`);
    return { index, content: null, success: false };
  }
}

// ============================================================================
// JUDGING - HIGH STANDARDS
// ============================================================================

async function runJudge1(content, campaignData) {
  let score = 0;
  const details = {};
  
  // Programmatic checks
  const urlPattern = /https?:\/\/[^\s]+/g;
  details.urlPresent = urlPattern.test(content) ? 2 : 0;
  score += details.urlPresent;
  
  const bannedWords = ['amazing', 'incredible', 'revolutionary', 'game-changing', 'groundbreaking'];
  details.bannedWords = !bannedWords.some(word => content.toLowerCase().includes(word)) ? 2 : 0;
  score += details.bannedWords;
  
  // AI checks
  const systemPrompt = `You are Judge 1 for Rally.fun content. Score this content against campaign requirements.

Campaign:
- Title: ${campaignData.title}
- Goal: ${campaignData.goal || 'N/A'}
- Style: ${campaignData.style || 'Post a banger!'}
- Rules: ${campaignData.rules || 'N/A'}

Score each (0-max):
1. Description Alignment (0-4): Does content match campaign goal?
2. Rules Compliance (0-4): Does it follow campaign rules?
3. Style Match (0-3): Does it match requested style?
4. Knowledge Base (0-3): Is information accurate?
5. Additional Info (0-2): Extra relevant details?

Reply in JSON format only:
{"description":X,"rules":X,"style":X,"knowledgeBase":X,"additionalInfo":X}`;

  try {
    const result = await callAIWithRetry([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content }
    ], { temperature: 0.2, maxTokens: 200, purpose: 'judge1' });
    
    const match = result.content.match(/\{[^}]+\}/);
    if (match) {
      const aiScores = JSON.parse(match[0]);
      details.description = aiScores.description || 0;
      details.rules = aiScores.rules || 0;
      details.style = aiScores.style || 0;
      details.knowledgeBase = aiScores.knowledgeBase || 0;
      details.additionalInfo = aiScores.additionalInfo || 0;
      
      score += details.description + details.rules + details.style + 
               details.knowledgeBase + details.additionalInfo;
    }
  } catch (error) {
    console.log(`   ⚠️ Judge 1 AI error: ${error.message}`);
  }
  
  const passed = score >= CONFIG.thresholds.gate1.pass;
  return { score, max: CONFIG.thresholds.gate1.max, passed, details };
}

async function runJudge2(content) {
  const systemPrompt = `You are Judge 2: Fact-Checker for Rally.fun content.

Extract claims from the content and verify each one. A claim is any factual statement.

For each claim:
1. Extract the claim
2. Assess if it's verifiable
3. Check if it seems accurate

Reply in JSON format:
{"claims":[{"claim":"...","verifiable":true/false,"verified":true/false}]}

Maximum 5 claims to verify.`;

  try {
    const result = await callAIWithRetry([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content }
    ], { temperature: 0.2, maxTokens: 500, purpose: 'judge2' });
    
    const match = result.content.match(/\{[^}]+\[[\s\S]*?\][^}]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      const claims = parsed.claims || [];
      const verified = claims.filter(c => c.verified).length;
      
      const passed = verified >= CONFIG.thresholds.judge2.pass;
      return { score: verified, max: CONFIG.thresholds.judge2.max, passed, claims };
    }
  } catch (error) {
    console.log(`   ⚠️ Judge 2 error: ${error.message}`);
  }
  
  return { score: 0, max: CONFIG.thresholds.judge2.max, passed: false };
}

async function runJudge3(content) {
  const systemPrompt = `You are Judge 3: Quality Assessor for Rally.fun content.

Score this content (0-max for each):

1. Originality (0-20): Unique angle, fresh perspective?
2. Engagement Potential (0-20): Would people interact?
3. Clarity & Flow (0-15): Easy to understand, good rhythm?
4. Emotional Impact (0-10): Does it evoke feelings?
5. X-Factor (0-15): Memorable, shareable quality?

Reply in JSON format only:
{"originality":X,"engagement":X,"clarity":X,"emotional":X,"xFactor":X}`;

  try {
    const result = await callAIWithRetry([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content }
    ], { temperature: 0.2, maxTokens: 200, purpose: 'judge3' });
    
    const match = result.content.match(/\{[^}]+\}/);
    if (match) {
      const scores = JSON.parse(match[0]);
      
      const total = (scores.originality || 0) + 
                   (scores.engagement || 0) + 
                   (scores.clarity || 0) + 
                   (scores.emotional || 0) + 
                   (scores.xFactor || 0);
      
      const passed = total >= CONFIG.thresholds.judge3.pass;
      return { score: total, max: CONFIG.thresholds.judge3.max, passed, components: scores };
    }
  } catch (error) {
    console.log(`   ⚠️ Judge 3 error: ${error.message}`);
  }
  
  return { score: 0, max: CONFIG.thresholds.judge3.max, passed: false };
}

// ============================================================================
// FULL JUDGING PROCESS WITH EARLY STOP
// ============================================================================

// Global flag to stop all processing when content passes
let contentPassed = false;
let passedContent = null;

async function judgeContent(content, campaignData, contentIndex, cycleNumber) {
  // Check if already have a winner
  if (contentPassed) {
    return { skipped: true, reason: 'Already have winner' };
  }
  
  if (!content) {
    return { content: null, passed: false, failedAt: 'generation' };
  }
  
  console.log(`\n   ⚖️ [${timestamp()}] Judging Content ${contentIndex + 1} (Cycle ${cycleNumber})`);
  
  const results = {
    content,
    contentIndex,
    cycleNumber,
    scores: {},
    passed: false,
    totalScore: 0,
    failedAt: null
  };
  
  // Judge 1: Gate
  console.log(`   🔍 Judge 1 (Gate)...`);
  results.scores.judge1 = await runJudge1(content, campaignData);
  console.log(`   📊 Judge 1: ${results.scores.judge1.score}/${results.scores.judge1.max} (${results.scores.judge1.passed ? '✅ PASS' : '❌ FAIL'})`);
  
  if (!results.scores.judge1.passed) {
    results.failedAt = 'judge1';
    return results;
  }
  
  // Check if already have winner
  if (contentPassed) return { skipped: true, reason: 'Already have winner' };
  
  // Judge 2: Facts
  console.log(`   🔍 Judge 2 (Facts)...`);
  results.scores.judge2 = await runJudge2(content);
  console.log(`   📊 Judge 2: ${results.scores.judge2.score}/${results.scores.judge2.max} (${results.scores.judge2.passed ? '✅ PASS' : '❌ FAIL'})`);
  
  if (!results.scores.judge2.passed) {
    results.failedAt = 'judge2';
    return results;
  }
  
  // Check if already have winner
  if (contentPassed) return { skipped: true, reason: 'Already have winner' };
  
  // Judge 3: Quality
  console.log(`   🔍 Judge 3 (Quality)...`);
  results.scores.judge3 = await runJudge3(content);
  console.log(`   📊 Judge 3: ${results.scores.judge3.score}/${results.scores.judge3.max} (${results.scores.judge3.passed ? '✅ PASS' : '❌ FAIL'})`);
  
  if (!results.scores.judge3.passed) {
    results.failedAt = 'judge3';
    return results;
  }
  
  // Calculate total
  results.totalScore = results.scores.judge1.score + 
                       results.scores.judge2.score + 
                       results.scores.judge3.score;
  
  results.passed = results.totalScore >= CONFIG.thresholds.total.pass;
  
  if (results.passed) {
    // SET WINNER!
    contentPassed = true;
    passedContent = results;
    console.log(`\n   🎉🎉🎉 CONTENT PASSED! Score: ${results.totalScore}/${CONFIG.thresholds.total.max}`);
  }
  
  return results;
}

// ============================================================================
// MAIN WORKFLOW - FIRST PASS WINS
// ============================================================================

async function runFirstPassWorkflow(campaignInput) {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║    RALLY WORKFLOW V9.9.1 - FIRST PASS WINS (HIGH STANDARDS)   ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  🎯 Loop until 1 content passes all judges                     ║');
  console.log('║  📊 High Standards: 90% Gate, 80% Facts, 87% Quality          ║');
  console.log('║  🏆 First content to pass → STOP & OUTPUT                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  // Reset global flags
  contentPassed = false;
  passedContent = null;
  
  const totalStartTime = Date.now();
  
  // Resolve campaign
  console.log(`\n🔍 Resolving campaign: ${campaignInput}`);
  const campaignData = await resolveCampaign(campaignInput);
  
  if (!campaignData) {
    console.log('   ❌ Campaign not found');
    return null;
  }
  
  console.log(`   ✅ Found: ${campaignData.title}`);
  console.log(`   📍 Address: ${campaignData.intelligentContractAddress}`);
  
  // Display thresholds
  console.log('\n📊 HIGH STANDARDS THRESHOLDS:');
  console.log(`   Judge 1 (Gate):   ${CONFIG.thresholds.gate1.pass}/${CONFIG.thresholds.gate1.max} (${Math.round(CONFIG.thresholds.gate1.pass/CONFIG.thresholds.gate1.max*100)}%)`);
  console.log(`   Judge 2 (Facts):  ${CONFIG.thresholds.judge2.pass}/${CONFIG.thresholds.judge2.max} (${Math.round(CONFIG.thresholds.judge2.pass/CONFIG.thresholds.judge2.max*100)}%)`);
  console.log(`   Judge 3 (Quality): ${CONFIG.thresholds.judge3.pass}/${CONFIG.thresholds.judge3.max} (${Math.round(CONFIG.thresholds.judge3.pass/CONFIG.thresholds.judge3.max*100)}%)`);
  console.log(`   Total Required:   ${CONFIG.thresholds.total.pass}/${CONFIG.thresholds.total.max} (${Math.round(CONFIG.thresholds.total.pass/CONFIG.thresholds.total.max*100)}%)`);
  
  // Main loop - keep generating until we get a winner
  let cycleNumber = 0;
  let totalGenerated = 0;
  let totalFailed = 0;
  
  while (!contentPassed) {
    cycleNumber++;
    
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🔄 CYCLE ${cycleNumber}`);
    console.log(`   📊 Stats: ${totalGenerated} generated, ${totalFailed} failed`);
    console.log(`${'═'.repeat(60)}`);
    
    // Generate 3 contents in parallel
    console.log('\n📝 Generating 3 contents in parallel...');
    const generateTasks = [];
    for (let i = 0; i < CONFIG.contentsPerCycle; i++) {
      generateTasks.push(generateSingleContent(campaignData, i));
    }
    const generateResults = await Promise.all(generateTasks);
    
    // Check if we have contents
    const validContents = generateResults.filter(r => r.success);
    totalGenerated += validContents.length;
    
    if (validContents.length === 0) {
      console.log('   ⚠️ No contents generated, retrying...');
      await delay(1000);
      continue;
    }
    
    console.log(`   ✅ Generated ${validContents.length}/${CONFIG.contentsPerCycle} contents`);
    
    // Judge each content in parallel, but stop when one passes
    console.log('\n⚖️ Judging contents (parallel, stop on first pass)...');
    
    const judgePromises = validContents.map((result, idx) => 
      judgeContent(result.content, campaignData, result.index, cycleNumber)
    );
    
    // Wait for all judges to complete (or until one passes)
    const judgeResults = await Promise.all(judgePromises);
    
    // Count failures
    const failedThisCycle = judgeResults.filter(r => !r.passed && !r.skipped).length;
    totalFailed += failedThisCycle;
    
    // Check if we have a winner
    if (contentPassed && passedContent) {
      break;
    }
    
    console.log(`\n   📊 Cycle ${cycleNumber} complete: All ${validContents.length} contents failed`);
    console.log('   🔄 Generating new contents...');
  }
  
  // Output winner
  const totalDuration = Date.now() - totalStartTime;
  
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    🎉 WINNER FOUND! 🎉                         ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║  ⏱️  Total Time: ${(totalDuration / 1000).toFixed(1)}s                                   `);
  console.log(`║  🔄 Cycles: ${cycleNumber}                                              `);
  console.log(`║  📊 Generated: ${totalGenerated} contents                              `);
  console.log(`║  ❌ Failed: ${totalFailed} contents                                  `);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  🏆 WINNING CONTENT:                                           ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║  Score: ${passedContent.totalScore}/${CONFIG.thresholds.total.max}                                        `);
  console.log(`║  Cycle: ${passedContent.cycleNumber}                                                `);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  
  // Print content
  const lines = passedContent.content.match(/.{1,50}/g) || [];
  lines.forEach(line => {
    console.log(`║  ${line.padEnd(58)}║`);
  });
  
  console.log('╚════════════════════════════════════════════════════════════════╝');
  
  // Return only the winning content
  return {
    content: passedContent.content,
    score: passedContent.totalScore,
    scores: passedContent.scores,
    cycle: passedContent.cycleNumber,
    stats: {
      totalTime: totalDuration,
      totalCycles: cycleNumber,
      totalGenerated,
      totalFailed
    }
  };
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('\nUsage: node rally-workflow-v9.9.1-firstpass.js <campaign-address-or-name>');
    process.exit(1);
  }
  
  const campaignInput = args.join(' ');
  const result = await runFirstPassWorkflow(campaignInput);
  
  if (result) {
    console.log('\n\n📝 FINAL OUTPUT:');
    console.log('─'.repeat(60));
    console.log(result.content);
    console.log('─'.repeat(60));
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runFirstPassWorkflow };
