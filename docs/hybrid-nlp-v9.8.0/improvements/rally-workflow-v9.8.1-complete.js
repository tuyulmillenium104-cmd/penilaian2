/**
 * RALLY WORKFLOW V9.8.1 - HYBRID JavaScript + Python NLP System
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🐍 HYBRID ARCHITECTURE - Python NLP + JavaScript AI/SDK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This version combines:
 * - JavaScript (Node.js): AI calls, SDK, workflow orchestration
 * - Python (FastAPI): Advanced NLP, semantic analysis, ML processing
 * 
 * ENHANCED FEATURES (Python-powered):
 * ✅ VADER + TextBlob Sentiment Analysis
 * ✅ Semantic Similarity with Sentence Transformers
 * ✅ Multi-metric Readability Scoring (textstat)
 * ✅ Named Entity Recognition (spaCy)
 * ✅ Advanced Emotion Detection
 * ✅ Content Depth Analysis
 * ✅ Anti-Template Detection (Semantic level)
 * 
 * NEW IN v9.8.1:
 * ✅ Multi-Content Generator (5 konten sekaligus)
 * ✅ Batch Judging dengan Ranking System
 * ✅ Model GLM-5 dengan Think + WebSearch
 * ✅ Select Best Content dari 5 konten
 * ✅ Total Score System (136 poin max)
 * ✅ SDK Only - No Fallbacks (All features must work!)
 * 
 * BASED ON: v9.8.0 Hybrid System
 * 
 * Usage:
 *   1. Start Python NLP Service:
 *      cd scripts/hybrid-nlp && python nlp_service.py
 *   
 *   2. Run this workflow:
 *      node scripts/hybrid-nlp/rally-workflow-v9.8.1-complete.js [campaign]
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Import Python NLP Client
let PythonNLPClient = null;
try {
  PythonNLPClient = require('../python_nlp_client.js');
} catch (e) {
  console.log('   ⚠️ Python NLP Client not available, using fallback');
}

// Dynamic import for ESM module (SDK Only - Required!)
let ZAI = null;
let SDK_AVAILABLE = false;

async function initZAI() {
  if (ZAI && SDK_AVAILABLE) return ZAI;
  
  try {
    const module = await import('z-ai-web-dev-sdk');
    ZAI = module.default;
    SDK_AVAILABLE = true;
    console.log('   ✅ z-ai-web-dev-sdk loaded successfully');
    return ZAI;
  } catch (e) {
    SDK_AVAILABLE = false;
    throw new Error(`❌ z-ai-web-dev-sdk not available! Please install with: npm install z-ai-web-dev-sdk\n   Error: ${e.message}`);
  }
}

// ============================================================================
// PRE-FLIGHT CHECK - Must pass all checks!
// ============================================================================

async function preflightCheck() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔍 PRE-FLIGHT CHECK - All Dependencies Required!');
  console.log('═'.repeat(60));
  
  const status = {
    sdk: false,
    pythonNLP: false,
    ready: false
  };
  
  // Check SDK - REQUIRED!
  try {
    const ZAIClass = await initZAI();
    if (ZAIClass) {
      status.sdk = true;
      console.log('   ✅ z-ai-web-dev-sdk: Available');
    }
  } catch (e) {
    console.log('   ❌ z-ai-web-dev-sdk: NOT AVAILABLE');
    console.log(`      ${e.message}`);
    throw new Error('SDK not available! Cannot continue without z-ai-web-dev-sdk');
  }
  
  // Check Python NLP Client
  if (PythonNLPClient) {
    status.pythonNLP = true;
    console.log('   ✅ Python NLP Client: Available');
  } else {
    console.log('   ⚠️ Python NLP Client: Not available (optional)');
  }
  
  status.ready = true;
  console.log('\n   🎯 All required dependencies available!');
  
  // Display token pool status
  displayTokenPoolStatus();
  
  console.log('═'.repeat(60));
  
  return status;
}

/**
 * Display token pool status for rate limit handling
 */
function displayTokenPoolStatus() {
  const tokens = CONFIG.tokens || [];
  const activeTokens = tokens.filter(t => t !== null);
  
  console.log('\n   ╔════════════════════════════════════════════════════════════╗');
  console.log('   ║           🎫 MULTI-TOKEN RATE LIMIT HANDLER               ║');
  console.log('   ╠════════════════════════════════════════════════════════════╣');
  
  tokens.forEach((token, index) => {
    const isActive = index === 0; // First token is active initially
    const marker = isActive ? '►' : ' ';
    const label = token?.label || 'Auto-Config (Primary)';
    
    console.log(`   ║ ${marker} #${index}: ${label.padEnd(42)}║`);
  });
  
  console.log('   ╠════════════════════════════════════════════════════════════╣');
  console.log(`   ║  Total: ${tokens.length} tokens available for rate limit fallback    ║`);
  console.log('   ╚════════════════════════════════════════════════════════════╝');
}

// ============================================================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

/**
 * Check if error is a rate limit error (429)
 */
function isRateLimitError(error) {
  const msg = error.message || '';
  return msg.includes('429') || 
         msg.includes('Too many requests') || 
         msg.includes('rate limit') ||
         msg.includes('速率限制');
}

/**
 * Retry with exponential backoff - specifically for rate limits
 */
async function retryWithBackoff(fn, maxRetries = 5, baseDelay = 2000, name = 'Operation') {
  let lastError = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if rate limit - use longer delay
      const isRateLimit = isRateLimitError(error);
      const delayMs = isRateLimit ? 
        Math.max(baseDelay * Math.pow(2, i), 10000) * (1 + Math.random() * 0.5) : // Rate limit: min 10s + jitter
        baseDelay * Math.pow(2, i); // Normal error: exponential
      
      if (i < maxRetries - 1) {
        if (isRateLimit) {
          console.log(`   ⏳ ${name} - Rate limit hit! Waiting ${(delayMs/1000).toFixed(1)}s before retry ${i + 1}/${maxRetries}...`);
        } else {
          console.log(`   ⏳ ${name} retry ${i + 1}/${maxRetries} in ${(delayMs/1000).toFixed(1)}s...`);
        }
        await delay(delayMs);
      }
    }
  }
  
  throw lastError;
}

// ============================================================================
// MULTI-TOKEN MANAGER - For Rate Limit Handling
// ============================================================================

/**
 * Token Manager - Handles multiple tokens for rate limit fallback
 */
class TokenManager {
  constructor(config) {
    this.tokens = config.tokens || [null];
    this.currentIndex = 0;
    this.exhaustedTokens = new Set(); // Track tokens that hit rate limit
    this.lastRateLimitTime = 0;
  }
  
  /**
   * Get current token
   */
  getCurrentToken() {
    return this.tokens[this.currentIndex];
  }
  
  /**
   * Get current token label for logging
   */
  getCurrentLabel() {
    const token = this.getCurrentToken();
    return token?.label || 'Auto-Config';
  }
  
  /**
   * Switch to next available token (for rate limit)
   */
  switchToNextToken() {
    // Mark current token as exhausted
    this.exhaustedTokens.add(this.currentIndex);
    
    // Find next available token
    for (let i = 0; i < this.tokens.length; i++) {
      const nextIndex = (this.currentIndex + 1 + i) % this.tokens.length;
      if (!this.exhaustedTokens.has(nextIndex)) {
        this.currentIndex = nextIndex;
        console.log(`   🔄 SWITCHING TOKEN: ${this.getCurrentLabel()}`);
        return true;
      }
    }
    
    // All tokens exhausted - reset and continue
    console.log('   ⚠️ All tokens exhausted! Resetting...');
    this.exhaustedTokens.clear();
    this.currentIndex = 0;
    return false;
  }
  
  /**
   * Reset exhausted tokens (call after successful request)
   */
  resetExhausted() {
    this.exhaustedTokens.clear();
  }
  
  /**
   * Check if we have alternative tokens available
   */
  hasAlternativeTokens() {
    return this.tokens.length > 1;
  }
  
  /**
   * Get token count
   */
  getTokenCount() {
    return this.tokens.length;
  }
  
  /**
   * Create SDK instance with specific token
   */
  async createSDKWithToken(specificToken = null) {
    if (!SDK_AVAILABLE) {
      throw new Error('SDK not available');
    }
    
    const token = specificToken || this.getCurrentToken();
    
    // If token is null, use default SDK (auto-config)
    if (!token) {
      return await ZAI.create();
    }
    
    // Create SDK with specific token/chat
    // The SDK accepts token in the create options
    return await ZAI.create({
      token: token.token,
      chatId: token.chatId,
      userId: token.userId
    });
  }
}

// Global token manager instance
let tokenManager = null;

function getTokenManager() {
  if (!tokenManager) {
    tokenManager = new TokenManager(CONFIG);
  }
  return tokenManager;
}

// ============================================================================
// AI CALL - SDK Only with Multi-Token for Rate Limits!
// ============================================================================

/**
 * Call AI using SDK with multi-token fallback for rate limits!
 */
async function callAI(messages, options = {}) {
  const temperature = options.temperature || 0.7;
  const maxTokens = options.maxTokens || 4000;
  const maxRetries = options.maxRetries || 5;
  
  if (!SDK_AVAILABLE) {
    throw new Error('SDK not available! Cannot call AI without z-ai-web-dev-sdk');
  }
  
  const tm = getTokenManager();
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create SDK instance with current token
      const zai = await tm.createSDKWithToken();
      
      const response = await zai.chat.completions.create({
        messages,
        temperature,
        max_tokens: maxTokens
      });
      
      // Success - reset exhausted tokens
      tm.resetExhausted();
      
      return {
        content: response.choices[0]?.message?.content || '',
        thinking: response.choices[0]?.message?.thinking || null,
        provider: 'sdk',
        tokenUsed: tm.getCurrentLabel(),
        success: true
      };
      
    } catch (error) {
      lastError = error;
      
      if (isRateLimitError(error)) {
        console.log(`   ⚠️ Rate limit hit on ${tm.getCurrentLabel()}!`);
        
        // Try switching token first
        if (tm.hasAlternativeTokens() && tm.switchToNextToken()) {
          console.log(`   🔄 Retrying with new token: ${tm.getCurrentLabel()}`);
          await delay(2000); // Short delay when switching token
          continue;
        }
        
        // No alternative tokens - use exponential backoff
        const delayMs = Math.max(10000 * Math.pow(1.5, attempt), 15000) * (1 + Math.random() * 0.3);
        console.log(`   ⏳ All tokens rate limited! Waiting ${(delayMs/1000).toFixed(1)}s...`);
        await delay(delayMs);
      } else {
        // Non-rate-limit error - use shorter backoff
        const delayMs = 2000 * Math.pow(2, attempt);
        console.log(`   ⏳ AI Call error: ${error.message}. Retry ${attempt + 1}/${maxRetries} in ${(delayMs/1000).toFixed(1)}s...`);
        await delay(delayMs);
      }
    }
  }
  
  throw lastError;
}

/**
 * Web Search - SDK with Multi-Token fallback!
 */
async function webSearchSDK(query) {
  if (!SDK_AVAILABLE) {
    throw new Error('SDK not available! Cannot perform web search without z-ai-web-dev-sdk');
  }
  
  const tm = getTokenManager();
  const maxRetries = 3;
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const zai = await tm.createSDKWithToken();
      
      const result = await zai.functions.invoke("web_search", { query, num: 5 });
      
      if (!result || result.length === 0) {
        throw new Error(`Web search returned no results for: ${query}`);
      }
      
      tm.resetExhausted();
      return result;
      
    } catch (error) {
      lastError = error;
      
      if (isRateLimitError(error)) {
        console.log(`   ⚠️ Web search rate limit on ${tm.getCurrentLabel()}!`);
        
        if (tm.hasAlternativeTokens() && tm.switchToNextToken()) {
          console.log(`   🔄 Retrying web search with: ${tm.getCurrentLabel()}`);
          await delay(2000);
          continue;
        }
        
        const delayMs = 10000 * (1 + Math.random());
        console.log(`   ⏳ Web search waiting ${(delayMs/1000).toFixed(1)}s...`);
        await delay(delayMs);
      } else {
        throw error; // Non-rate-limit errors fail immediately
      }
    }
  }
  
  throw lastError;
}

// ============================================================================
// HYBRID CONFIGURATION
// ============================================================================

const CONFIG = {
  // Python NLP Service (Optional - will use fallback if unavailable)
  pythonNLP: {
    baseUrl: 'http://localhost:5000',
    enabled: true,
    timeout: 30000,
    fallbackToBasic: true
  },
  
  // Rally API
  rallyApiBase: 'https://app.rally.fun/api',
  outputDir: '/home/z/my-project/download',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MULTI-TOKEN POOL - For Rate Limit Handling
  // When rate limit hit, automatically switch to next token
  // ═══════════════════════════════════════════════════════════════════════════
  tokens: [
    null, // Auto from .z-ai-config (Primary)
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtNTQ5ZmI5MTEtZWM0NS00NGJiLTg5YjEtMWY2MTljNTEzN2QzIn0.M6IQTOXasSbEw98a4R6p3LEPwJPCWyRZiJSUo8lr2PM',
      chatId: 'chat-549fb911-ec45-44bb-89b1-1f619c5137d3',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun A #1'
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtMTAyYTlkMGUtYTVkNy00MmY2LTk3ZjctNDk5NzFiNzcwNjVhIn0.6cDfQbTc2HHdtKXBfaUvpBsNLPbbjYkpJp6br0rYteA',
      chatId: 'chat-102a9d0e-a5d7-42f6-97f7-49971b77065a',
      userId: 'bb829ea3-0d37-4944-8705-00090bde3671',
      label: 'Akun B #1'
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtMDAyOWJjNDYtZGI3Ny00ZmZkLWI4ZDItM2RlYzFlNWVkNDU3In0.CMthZytUFBpnqW3K52Q1AAgB9uvhyXf3AG-FQvaDoYI',
      chatId: 'chat-0029bc46-db77-4ffd-b8d2-3dec1e5ed457',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun A #2'
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmI4MjllYTMtMGQzNy00OTQ0LTg3MDUtMDAwOTBiZGUzNjcxIiwiY2hhdF9pZCI6ImNoYXQtOTZlZTk1NmItMGYxMi00MGUxLWE0MzYtYTk4YmQwZjk0YzJhIn0.PgpMEiUr8a6Cu2vl9zFMggRsxQrx3JwkUCOjZCUIJnw',
      chatId: 'chat-96ee956b-0f12-40e1-a436-a98bd0f94c2a',
      userId: 'bb829ea3-0d37-4944-8705-00090bde3671',
      label: 'Akun B #2'
    },
    {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtOWJiMzAzOTMtYWE3Mi00Y2QzLWJkNzktYzJkZmI0ODVmNzgyIn0.jb35oqGKPB2FLC-X_mozORmvbBilwRc_pSZEkbyaRfw',
      chatId: 'chat-9bb30393-aa72-4cd3-bd79-c2dfb485f782',
      userId: '97631263-5dba-4e16-b127-19212e012a9b',
      label: 'Akun A #3'
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NEW v9.8.1: Multi-Content Configuration
  // ═══════════════════════════════════════════════════════════════════════════
  multiContent: {
    enabled: true,
    count: 5,
    selectBest: true,
    minPassCount: 1,
    maxRegenerateAttempts: 5,
    variations: {
      angles: ['personal_story', 'data_driven', 'contrarian', 'insider_perspective', 'case_study'],
      emotions: [
        ['curiosity', 'surprise'],
        ['fear', 'hope'],
        ['anger', 'trust'],
        ['sadness', 'anticipation'],
        ['surprise', 'joy']
      ],
      structures: ['hero_journey', 'problem_solution', 'before_after', 'mystery_reveal', 'case_study']
    }
  },
  
  // v9.8.1: Model Optimization - GLM-5 (Latest)
  model: {
    name: 'glm-5',
    enableThinking: true,
    enableSearch: true,
    temperature: {
      generation: 0.8,
      judging: 0.2,
      compliance: 0.1
    }
  },
  
  // v9.8.1: Quick Judge = Compliance Check Only
  quickJudge: {
    enabled: true,
    checks: [
      'campaignDescription',
      'rules',
      'style',
      'additionalInfo',
      'knowledgeBase',
      'bannedWords',
      'urlPresent'
    ],
    allMustPass: true
  },
  
  // v9.8.1: Ranking Configuration
  ranking: {
    enabled: true,
    method: 'weighted',
    weights: {
      gateUtama: 0.15,
      gateTambahan: 0.12,
      penilaianInternal: 0.35,
      compliance: 0.10,
      factCheck: 0.08,
      uniqueness: 0.20
    }
  },
  
  // Enhanced thresholds for Hybrid
  thresholds: {
    gateUtama: { pass: 16, max: 20 },
    gateTambahan: { pass: 14, max: 16 },
    penilaianInternal: { pass: 54, max: 60 },
    compliance: { pass: 10, max: 10, allMustPass: true },
    factCheck: { pass: 4, max: 5 },
    uniqueness: { pass: 20, max: 25 },
    readability: { min: 60, optimal: 70 },
    sentiment: { minConfidence: 0.3 },
    similarity: { maxThreshold: 0.7 },
    depth: { minScore: 40 },
    tieThreshold: 3
  },
  
  revision: { maxAttempts: 3, delayMs: 10000 },
  retry: { maxAttempts: 5, delayMs: 10000 },
  
  // v9.8.1: Increased delays to prevent rate limits
  delays: {
    betweenJudges: 8000,        // 8 seconds between each judge (was 3s)
    betweenPasses: 10000,       // 10 seconds between passes
    beforeRevision: 8000,       // 8 seconds before revision
    beforeTieBreaker: 10000,    // 10 seconds before tie breaker
    afterWebSearch: 3000,       // 3 seconds after web search
    afterPythonNLP: 1000,       // 1 second after Python NLP
    betweenContentGen: 5000,    // 5 seconds between content generation
    betweenQuickJudge: 3000,    // 3 seconds between quick judge checks
    afterRateLimit: 15000       // 15 seconds after rate limit detected
  },
  
  enableThinking: true,
  tweetOptions: [1, 3, 5, 7],
  
  personas: [
    { id: 'skeptic', name: 'The Skeptic', trait: 'Doubt → Discovery → Conversion' },
    { id: 'victim_to_hero', name: 'Victim → Hero', trait: 'Pain → Solution → Redemption' },
    { id: 'insider', name: 'The Insider', trait: 'Behind the scenes revelation' },
    { id: 'newbie', name: 'The Newbie', trait: 'Fresh perspective, relatable confusion' },
    { id: 'contrarian', name: 'The Contrarian', trait: 'Bold statement, challenge status quo' },
    { id: 'researcher', name: 'The Researcher', trait: 'Data-driven discovery' },
    { id: 'storyteller', name: 'The Storyteller', trait: 'Narrative-driven, human interest' }
  ],
  
  narrativeStructures: [
    { id: 'hero_journey', name: "Hero's Journey", flow: 'Challenge → Struggle → Discovery → Victory' },
    { id: 'pas', name: 'Problem-Agitation-Solution', flow: 'Problem → Make it worse → Solution → Proof' },
    { id: 'bab', name: 'Before-After-Bridge', flow: 'Before state → After state → How to bridge' },
    { id: 'contrast', name: 'Contrast Frame', flow: 'What most think → What actually is → Proof' },
    { id: 'mystery', name: 'Mystery Reveal', flow: 'Curiosity building → Cliffhanger → Reveal' },
    { id: 'case_study', name: 'Case Study', flow: 'Subject → Problem → Solution → Result' },
    { id: 'qa', name: 'Question-Answer', flow: 'Provocative question → Explore → Answer' }
  ],
  
  audienceSegments: {
    'internet_court': [
      { id: 'scammed_crypto', name: 'Crypto Users Who Got Scammed', pain: 'Lost money, no recourse' },
      { id: 'freelancers', name: 'Freelancers with Unpaid Clients', pain: 'Client ghosted, no contract' },
      { id: 'dao_participants', name: 'DAO/Governance Participants', pain: 'Disputes in voting, unclear resolution' },
      { id: 'ecommerce', name: 'E-commerce Dispute Victims', pain: 'Buyer/seller disputes, biased platforms' },
      { id: 'smart_contract_users', name: 'Smart Contract Users', pain: 'Bugs, hacks, unclear liability' }
    ]
  },
  
  emotionCombos: {
    rare: [
      { emotions: ['surprise', 'anger'], hook: 'Shocking injustice revealed' },
      { emotions: ['relief', 'curiosity'], hook: 'Finally, a solution you did not know' },
      { emotions: ['fear', 'empowerment'], hook: 'The threat is real, but so is hope' },
      { emotions: ['frustration', 'vindication'], hook: 'You were right to be mad' },
      { emotions: ['confusion', 'clarity'], hook: 'The mystery solved' }
    ],
    common: [
      { emotions: ['curiosity', 'hope'], hook: 'Standard curiosity driver' },
      { emotions: ['fear', 'urgency'], hook: 'Fear-based urgency' },
      { emotions: ['pain', 'hope'], hook: 'Pain to hope journey' }
    ]
  },
  
  hardRequirements: {
    bannedWords: [
      'guaranteed', 'guarantee', '100%', 'risk-free', 'sure thing',
      'financial advice', 'investment advice', 'buy now', 'sell now',
      'get rich', 'quick money', 'easy money', 'passive income',
      'follow me', 'subscribe to my', 'check my profile',
      'click here', 'limited time offer', 'act now',
      'legally binding', 'court order', 'official ruling'
    ],
    rallyBannedPhrases: [
      'vibe coding', 'skin in the game', 'intelligent contracts',
      'trust layer', 'agent era', 'agentic era', 'structural shift',
      'capital efficiency', 'how did I miss this', 'losing my mind',
      'how are we all sleeping on this', "don't miss out",
      'designed for creators that desire', 'transforming ideas into something sustainable',
      'entire week', 'frictionless', 'acceptable originality',
      'similar_tweets', 'bank stack', 'version control for disagreements'
    ],
    templatePhrases: [
      'unpopular opinion:', 'hot take:', 'thread alert:', 'breaking:',
      'this is your sign', 'psa:', 'reminder that', 'quick thread:',
      'important thread:', 'drop everything', 'stop scrolling',
      'hear me out', 'let me explain', 'nobody is talking about',
      'story time:', 'in this thread i will', 'key takeaways:',
      "here's the thing", "imagine a world where", "picture this:",
      "let's dive in", "at the end of the day", "it goes without saying"
    ],
    aiPatterns: {
      words: ['delve', 'leverage', 'realm', 'tapestry', 'paradigm', 'landscape', 'nuance', 'underscores', 'pivotal', 'crucial', 'embark', 'journey', 'explore', 'unlock', 'harness'],
      phrases: ['picture this', 'lets dive in', 'in this thread', 'key takeaways', 'heres the thing', 'imagine a world', 'it goes without saying', 'at the end of the day', 'on the other hand', 'in conclusion']
    },
    weakOpenings: ['the ', 'a ', 'an ', 'this is', 'there are', 'there is', 'i think', 'in the', 'today ', 'so ', 'well ', 'basically', 'honestly ', 'actually ', 'first ', 'let me', 'here is', 'here are']
  },
  
  wajibElements: {
    hook: { required: true, description: 'Natural, organic hook (not formulaic)' },
    emotions: { required: true, minCount: 3, description: 'Minimal 3 emotion types' },
    bodyFeeling: { required: true, description: 'Physical/body sensation' },
    cta: { required: true, description: 'Question atau reply bait' },
    url: { required: true, description: 'Required URL dari campaign' },
    facts: { required: true, description: 'Data/fakta pendukung (multi-layer)' },
    originality: {
      mustHave: [
        'Personal story atau experience (genuine)',
        'Unique angle/perspective',
        'Specific details (not generic)',
        'Conversational tone (natural, bukan AI-sounding)',
        'Differentiation from competitors'
      ],
      mustAvoid: [
        'Similar to competitor content',
        'Template-like structure',
        'Generic statements',
        'Overused phrases',
        'Derivative angles',
        'Formulaic hook patterns'
      ]
    }
  },
  
  calibration: {
    rallyMaxScore: 23,
    v9_8_0MaxScore: 100,
    thresholds: {
      excellent: { rally: 21, v9_8_0: 90 },
      pass: { rally: 18, v9_8_0: 75 },
      borderline: { rally: 15, v9_8_0: 62 }
    }
  },
  
  emotionTriggers: {
    fear: ['risk', 'danger', 'threat', 'warning', 'scary', 'terrifying', 'afraid', 'worried', 'nightmare'],
    curiosity: ['wonder', 'curious', 'secret', 'hidden', 'mystery', 'discover', 'surprising', 'unexpected'],
    surprise: ['unexpected', 'shocking', 'surprised', 'blew my mind', 'plot twist', 'wait what', 'finally', 'breakthrough'],
    hope: ['finally', 'breakthrough', 'opportunity', 'potential', 'future', 'imagine', 'possible'],
    pain: ['lost', 'failed', 'broke', 'destroyed', 'killed', 'wasted', 'missed', 'regret', 'hurt', 'pain'],
    urgency: ['now', 'today', 'immediately', 'urgent', 'quickly', 'fast', 'running out'],
    anger: ['unfair', 'wrong', 'scam', 'cheated', 'robbed', 'injustice', 'ridiculous'],
    relief: ['finally', 'solution', 'answer', 'solved', 'resolved', 'fixed']
  },
  
  bodyFeelings: [
    'cold sweat', 'panic', 'anxiety', 'heart racing', 'stomach dropped', 
    'heart sank', 'chest tightened', 'jaw dropped', "couldn't believe",
    'blood boiled', 'hands shaking', 'breath caught'
  ]
};

// ============================================================================
// PYTHON NLP INTEGRATION LAYER
// ============================================================================

class HybridNLPAnalyzer {
  constructor(config) {
    this.config = config;
    this.pythonClient = PythonNLPClient ? new PythonNLPClient(config.pythonNLP.baseUrl) : null;
    this.serviceAvailable = null;
  }
  
  async checkService() {
    if (this.serviceAvailable !== null) {
      return this.serviceAvailable;
    }
    
    if (!this.pythonClient) {
      console.log('   ⚠️ Python NLP Client not available - using basic analysis');
      this.serviceAvailable = false;
      return false;
    }
    
    try {
      const health = await this.pythonClient.healthCheck();
      this.serviceAvailable = health.healthy;
      
      if (health.healthy) {
        console.log('\n   ╔════════════════════════════════════════════════════════════╗');
        console.log('   ║           🐍 PYTHON NLP SERVICE CONNECTED                 ║');
        console.log('   ╠════════════════════════════════════════════════════════════╣');
        console.log('   ║  VADER Sentiment:      ' + (health.services?.sentiment_vader ? '✓' : '✗').padEnd(33) + '║');
        console.log('   ║  TextBlob:             ' + (health.services?.sentiment_textblob ? '✓' : '✗').padEnd(33) + '║');
        console.log('   ║  textstat:             ' + (health.services?.readability_textstat ? '✓' : '✗').padEnd(33) + '║');
        console.log('   ║  spaCy NER:            ' + (health.services?.ner_spacy ? '✓' : '✗').padEnd(33) + '║');
        console.log('   ║  Semantic Similarity:  ' + (health.services?.semantic_similarity ? '✓' : '✗').padEnd(33) + '║');
        console.log('   ╚════════════════════════════════════════════════════════════╝');
      } else {
        console.log('   ⚠️ Python NLP Service not available - using basic analysis');
      }
      
      return this.serviceAvailable;
    } catch (error) {
      console.log('   ⚠️ Python NLP Service unavailable:', error.message);
      this.serviceAvailable = false;
      return false;
    }
  }
  
  async analyzeContent(content, campaignContext = null, competitorContents = []) {
    const serviceOk = await this.checkService();
    
    if (serviceOk && this.pythonClient) {
      console.log('   🐍 Using Python NLP for content analysis...');
      const result = await this.pythonClient.analyzeContent(
        content, 
        campaignContext, 
        competitorContents
      );
      result.hybridMetrics = this._calculateHybridMetrics(result);
      return result;
    }
    
    return this._fallbackContentAnalysis(content, competitorContents);
  }
  
  async checkSimilarity(newContent, competitorContents, threshold = 0.7) {
    const serviceOk = await this.checkService();
    
    if (serviceOk && this.pythonClient) {
      console.log('   🐍 Using Python NLP for similarity check...');
      return await this.pythonClient.checkSimilarity(newContent, competitorContents, threshold);
    }
    
    return this._fallbackSimilarity(newContent, competitorContents);
  }
  
  async detectEmotions(content, detailed = false) {
    const serviceOk = await this.checkService();
    
    if (serviceOk && this.pythonClient) {
      console.log('   🐍 Using Python NLP for emotion detection...');
      return await this.pythonClient.detectEmotions(content, detailed);
    }
    
    return this._fallbackEmotions(content);
  }
  
  async analyzeUniqueness(content, competitorContents) {
    const serviceOk = await this.checkService();
    
    if (serviceOk && this.pythonClient) {
      console.log('   🐍 Using Python NLP for uniqueness analysis...');
      return await this.pythonClient.analyzeUniqueness(content, competitorContents);
    }
    
    return this._fallbackUniqueness(content, competitorContents);
  }
  
  _calculateHybridMetrics(analysis) {
    const metrics = {
      overallQuality: 0,
      qualityGrade: 'C',
      recommendations: []
    };
    
    let score = 50;
    
    if (analysis.readability?.primary?.flesch_reading_ease) {
      const flesch = analysis.readability.primary.flesch_reading_ease;
      if (flesch >= 60 && flesch <= 80) {
        score += 15;
      } else if (flesch >= 50) {
        score += 10;
      } else {
        metrics.recommendations.push('Improve readability - content may be too complex');
      }
    }
    
    if (analysis.sentiment?.consensus_score !== undefined) {
      const sentiment = Math.abs(analysis.sentiment.consensus_score);
      if (sentiment > 0.3) {
        score += 10;
      } else {
        metrics.recommendations.push('Add more emotional depth');
      }
    }
    
    if (analysis.emotions?.emotion_variety) {
      score += Math.min(analysis.emotions.emotion_variety * 5, 15);
      if (analysis.emotions.rare_combo_detected) {
        score += 5;
      }
    }
    
    if (analysis.depth_analysis?.overall_depth_score) {
      score += Math.min(analysis.depth_analysis.overall_depth_score * 0.15, 15);
    }
    
    if (analysis.similarity?.primary?.max_similarity) {
      score -= analysis.similarity.primary.max_similarity * 20;
      if (analysis.similarity.primary.max_similarity > 0.7) {
        metrics.recommendations.push('Content too similar to competitors - increase differentiation');
      }
    }
    
    metrics.overallQuality = Math.max(0, Math.min(100, Math.round(score)));
    
    if (score >= 90) metrics.qualityGrade = 'A+';
    else if (score >= 85) metrics.qualityGrade = 'A';
    else if (score >= 80) metrics.qualityGrade = 'A-';
    else if (score >= 75) metrics.qualityGrade = 'B+';
    else if (score >= 70) metrics.qualityGrade = 'B';
    else if (score >= 65) metrics.qualityGrade = 'B-';
    else if (score >= 60) metrics.qualityGrade = 'C+';
    else if (score >= 55) metrics.qualityGrade = 'C';
    else if (score >= 50) metrics.qualityGrade = 'C-';
    else metrics.qualityGrade = 'D';
    
    return metrics;
  }
  
  _fallbackContentAnalysis(content, competitorContents) {
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      success: true,
      source: 'fallback',
      readability: {
        primary: {
          available: true,
          flesch_reading_ease: this._calculateFleschEase(content),
          word_count: words.length,
          sentence_count: sentences.length
        }
      },
      sentiment: this._fallbackSentiment(content),
      emotions: this._fallbackEmotions(content),
      depth_analysis: { overall_depth_score: 30 },
      content_length: content.length,
      word_count: words.length,
      hybridMetrics: {
        overallQuality: 50,
        qualityGrade: 'C',
        recommendations: ['Python NLP service unavailable - install for better analysis']
      }
    };
  }
  
  _fallbackSimilarity(newContent, competitorContents) {
    if (!competitorContents || competitorContents.length === 0) {
      return { success: true, source: 'fallback', max_similarity: 0, is_unique: true };
    }
    
    const newWords = new Set(newContent.toLowerCase().split(/\s+/));
    let maxSim = 0;
    
    for (const comp of competitorContents) {
      const compWords = new Set(comp.toLowerCase().split(/\s+/));
      const intersection = new Set([...newWords].filter(x => compWords.has(x)));
      const union = new Set([...newWords, ...compWords]);
      const sim = intersection.size / union.size;
      maxSim = Math.max(maxSim, sim);
    }
    
    return {
      success: true,
      source: 'fallback',
      max_similarity: maxSim,
      is_unique: maxSim < 0.3
    };
  }
  
  _fallbackEmotions(content) {
    const emotionKeywords = {
      fear: ['afraid', 'scary', 'terrifying', 'nightmare', 'panic'],
      anger: ['angry', 'furious', 'frustrated', 'unfair', 'injustice'],
      joy: ['happy', 'excited', 'amazing', 'wonderful', 'love'],
      surprise: ['shocked', 'unexpected', 'unbelievable', 'incredible'],
      curiosity: ['curious', 'interesting', 'fascinating', 'mystery', 'secret']
    };
    
    const contentLower = content.toLowerCase();
    const emotions = {};
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const count = keywords.filter(kw => contentLower.includes(kw)).length;
      if (count > 0) emotions[emotion] = count;
    }
    
    return {
      success: true,
      source: 'fallback',
      emotions,
      primary_emotion: Object.keys(emotions)[0] || 'neutral',
      emotion_variety: Object.keys(emotions).length,
      rare_combo_detected: false
    };
  }
  
  _fallbackSentiment(content) {
    const positive = ['good', 'great', 'amazing', 'excellent', 'wonderful', 'love'];
    const negative = ['bad', 'terrible', 'awful', 'horrible', 'hate'];
    
    const contentLower = content.toLowerCase();
    let score = 0;
    
    positive.forEach(w => { if (contentLower.includes(w)) score += 0.1; });
    negative.forEach(w => { if (contentLower.includes(w)) score -= 0.1; });
    
    return {
      consensus_score: score,
      consensus_label: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral'
    };
  }
  
  _fallbackUniqueness(content, competitorContents) {
    const similarity = this._fallbackSimilarity(content, competitorContents);
    const emotions = this._fallbackEmotions(content);
    
    let score = 100;
    score -= similarity.max_similarity * 40;
    score += emotions.emotion_variety * 5;
    
    return {
      success: true,
      source: 'fallback',
      uniqueness: {
        score: Math.max(0, Math.min(100, score)),
        is_unique: similarity.is_unique
      }
    };
  }
  
  _calculateFleschEase(content) {
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (words.length === 0 || sentences.length === 0) return 0;
    
    const avgSentenceLength = words.length / sentences.length;
    const syllables = words.reduce((sum, word) => sum + this._countSyllables(word), 0);
    const avgSyllablesPerWord = syllables / words.length;
    
    const flesch = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, Math.round(flesch)));
  }
  
  _countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }
}

// ============================================================================
// MULTI-PROVIDER LLM CLIENT (SDK Only!)
// ============================================================================

class MultiProviderLLM {
  constructor(config) {
    this.config = config;
    this.nlpAnalyzer = new HybridNLPAnalyzer(config);
  }
  
  async loadAutoToken() {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const os = await import('os');
      
      const homeDir = os.homedir();
      const configPaths = [
        path.join(process.cwd(), '.z-ai-config'),
        path.join(homeDir, '.z-ai-config'),
        '/etc/.z-ai-config'
      ];
      
      for (const filePath of configPaths) {
        try {
          const configStr = fs.readFileSync(filePath, 'utf-8');
          const autoConfig = JSON.parse(configStr);
          if (autoConfig.token) {
            console.log(`   ✅ Auto-token loaded from ${filePath}`);
            return;
          }
        } catch (e) {}
      }
      console.log('   ⚠️ No auto-token found, using SDK default');
    } catch (e) {
      console.log('   ⚠️ Could not load auto-token:', e.message);
    }
  }
  
  // Token pool status now displayed in preflightCheck
  displayTokenPoolStatus() {
    // No-op - token pool status is now displayed during preflight check
  }

  async chat(messages, options = {}) {
    const result = await callAI(messages, options);
    console.log(`   ✅ Response received (${result.provider}, token: ${result.tokenUsed || 'auto'})`);
    
    return {
      content: result.content || '',
      thinking: result.thinking || null,
      provider: result.provider,
      model: CONFIG.model?.name || 'glm-5',
      usage: result.usage
    };
  }
  
  async blindJudge(systemPrompt, userPrompt, judgeId, options = {}) {
    console.log(`\n   🔒 TRUE BLIND JUDGE ${judgeId} - Fresh Context`);

    const result = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.3, maxTokens: 3000 });
    
    console.log(`   ✅ Judge ${judgeId} success!`);

    return {
      content: result.content || '',
      thinking: result.thinking || null,
      provider: result.provider,
      model: CONFIG.model?.name || 'glm-5'
    };
  }
  
  async contextAwareJudge(systemPrompt, userPrompt, judgeId) {
    console.log(`\n   📋 CONTEXT-AWARE JUDGE ${judgeId} - With Campaign Info`);

    const result = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.3, maxTokens: 3000 });
    
    console.log(`   ✅ Context-Aware Judge ${judgeId} success!`);

    return {
      content: result.content || '',
      thinking: result.thinking || null,
      provider: result.provider,
      model: CONFIG.model?.name || 'glm-5'
    };
  }
  
  async factCheckJudge(systemPrompt, userPrompt, judgeId, customSearchQuery = null) {
    console.log(`\n   🔍 FACT-CHECK JUDGE ${judgeId} - With Web Search`);

    const currentYear = new Date().getFullYear();
    const searchQuery = customSearchQuery || `verify facts ${currentYear} latest`;

    console.log(`   🔎 Searching for data from ${currentYear} and earlier...`);

    // Use SDK web search - MUST succeed!
    const webSearchResults = await webSearchSDK(searchQuery);
    console.log(`   ✅ Web search: ${webSearchResults.length} results`);

    const enhancedPrompt = userPrompt + `\n\n═══════════════════════════════════════════════════════════════
🔍 WEB SEARCH RESULTS FOR FACT VERIFICATION:
═══════════════════════════════════════════════════════════════
${webSearchResults.slice(0, 3).map((r, i) => `${i+1}. ${r.name || 'Source'}: ${r.snippet || ''}\n   URL: ${r.url || 'N/A'}`).join('\n\n')}`;

    const result = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: enhancedPrompt }
    ], { temperature: 0.3, maxTokens: 3000 });
    
    console.log(`   ✅ Fact-Check Judge ${judgeId} success!`);

    return {
      content: result.content || '',
      thinking: result.thinking || null,
      webSearchUsed: true,
      provider: result.provider,
      model: CONFIG.model?.name || 'glm-5'
    };
  }
  
  async hybridJudge(systemPrompt, userPrompt, judgeId, content, competitorContents = []) {
    console.log(`\n   🐍 HYBRID JUDGE ${judgeId} - Python NLP Enhanced`);

    const nlpAnalysis = await this.nlpAnalyzer.analyzeContent(content, null, competitorContents);
    
    const enhancedPrompt = userPrompt + `\n\n═══════════════════════════════════════════════════════════════
🐍 PYTHON NLP ANALYSIS (Use this for scoring):
═══════════════════════════════════════════════════════════════
- Readability Score: ${nlpAnalysis.readability?.primary?.flesch_reading_ease || 'N/A'}
- Sentiment: ${nlpAnalysis.sentiment?.consensus_label || 'N/A'} (${nlpAnalysis.sentiment?.consensus_score?.toFixed(2) || 0})
- Emotion Variety: ${nlpAnalysis.emotions?.emotion_variety || 0} emotions detected
- Rare Emotion Combo: ${nlpAnalysis.emotions?.rare_combo_detected ? '✓ Yes' : '✗ No'}
- Content Depth: ${nlpAnalysis.depth_analysis?.depth_level || 'N/A'} (${nlpAnalysis.depth_analysis?.overall_depth_score || 0})
- Similarity to Competitors: ${((nlpAnalysis.similarity?.primary?.max_similarity || 0) * 100).toFixed(1)}%
- Overall Quality Grade: ${nlpAnalysis.hybridMetrics?.qualityGrade || 'N/A'} (${nlpAnalysis.hybridMetrics?.overallQuality || 0}/100)
`;

    const result = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: enhancedPrompt }
    ], { temperature: 0.3, maxTokens: 3000 });
    
    console.log(`   ✅ Hybrid Judge ${judgeId} success!`);

    return {
      content: result.content || '',
      thinking: result.thinking || null,
      nlpAnalysis: nlpAnalysis,
      provider: result.provider,
      model: CONFIG.model?.name || 'glm-5'
    };
  }
  
  async webSearch(query) {
    const currentYear = new Date().getFullYear();
    console.log(`   🔍 Web search: "${query}"`);
    
    const enhancedQuery = `${query} ${currentYear} latest`;
    const result = await webSearchSDK(enhancedQuery);
    
    console.log(`   ✅ Found ${result.length} results`);
    return result;
  }
  
  getNLPAnalyzer() {
    return this.nlpAnalyzer;
  }
  
  httpRequest(url, options) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const reqOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      };
      
      const req = https.request(reqOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      
      req.on('error', reject);
      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      if (options.body) req.write(options.body);
      req.end();
    });
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function safeJsonParse(str) {
  try {
    const jsonMatch = str.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

function displayThinking(phase, thinking) {
  console.log('\n   ' + '┌' + '─'.repeat(54) + '┐');
  console.log(`   │ 🧠 ${phase.toUpperCase()} THINKING${' '.repeat(54 - phase.length - 14)}│`);
  console.log('   ' + '├' + '─'.repeat(54) + '┤');
  
  const lines = thinking.split('\n').slice(0, 15);
  lines.forEach(line => {
    const trimmed = line.substring(0, 52);
    console.log(`   │ ${trimmed}${' '.repeat(53 - trimmed.length)}│`);
  });
  
  console.log('   ' + '└' + '─'.repeat(54) + '┘');
}

function displayJudgeThinking(judgeNum, thinking) {
  console.log('\n   ' + '┌' + '─'.repeat(54) + '┐');
  console.log(`   │ ⚖️  JUDGE ${judgeNum} THINKING${' '.repeat(30)}│`);
  console.log('   ' + '├' + '─'.repeat(54) + '┤');
  
  const lines = thinking.split('\n').slice(0, 15);
  lines.forEach(line => {
    const trimmed = line.substring(0, 52);
    console.log(`   │ ${trimmed}${' '.repeat(53 - trimmed.length)}│`);
  });
  
  console.log('   ' + '└' + '─'.repeat(54) + '┘');
}

// ============================================================================
// SELECTION FUNCTIONS
// ============================================================================

function selectUnusedPersona(competitorAnalysis) {
  const usedPersonas = competitorAnalysis?.personasUsed || [];
  const availablePersonas = CONFIG.personas.filter(p => 
    !usedPersonas.some(used => 
      used.toLowerCase().includes(p.id.toLowerCase()) ||
      used.toLowerCase().includes(p.name.toLowerCase())
    )
  );
  
  if (availablePersonas.length === 0) {
    return CONFIG.personas[Math.floor(Math.random() * CONFIG.personas.length)];
  }
  
  const preferredOrder = ['contrarian', 'skeptic', 'insider', 'researcher', 'storyteller', 'victim_to_hero', 'newbie'];
  for (const pref of preferredOrder) {
    const found = availablePersonas.find(p => p.id === pref);
    if (found) return found;
  }
  
  return availablePersonas[0];
}

function selectUnusedNarrativeStructure(competitorAnalysis) {
  const usedStructures = competitorAnalysis?.structuresUsed || [];
  const availableStructures = CONFIG.narrativeStructures.filter(s => 
    !usedStructures.some(used => 
      used.toLowerCase().includes(s.id.toLowerCase()) ||
      used.toLowerCase().includes(s.name.toLowerCase())
    )
  );
  
  if (availableStructures.length === 0) {
    return CONFIG.narrativeStructures[Math.floor(Math.random() * CONFIG.narrativeStructures.length)];
  }
  
  const preferredOrder = ['mystery', 'contrast', 'case_study', 'qa', 'hero_journey', 'pas', 'bab'];
  for (const pref of preferredOrder) {
    const found = availableStructures.find(s => s.id === pref);
    if (found) return found;
  }
  
  return availableStructures[0];
}

function selectUnaddressedAudience(competitorAnalysis, campaignTopic) {
  const topicLower = (campaignTopic || '').toLowerCase();
  let category = 'internet_court';
  
  const addressedAudiences = competitorAnalysis?.audienceAddressed || [];
  const segments = CONFIG.audienceSegments[category] || [];
  const availableSegments = segments.filter(s => 
    !addressedAudiences.some(addr => 
      addr.toLowerCase().includes(s.id.toLowerCase()) ||
      addr.toLowerCase().includes(s.name.toLowerCase())
    )
  );
  
  if (availableSegments.length === 0) {
    return segments[0] || { id: 'general', name: 'General Audience', pain: 'General interest' };
  }
  
  return availableSegments[0];
}

function selectRareEmotionCombo(competitorAnalysis) {
  const usedEmotions = (competitorAnalysis?.emotionsUsed || []).map(e => 
    typeof e === 'object' ? e.emotion?.toLowerCase() : e.toLowerCase()
  );
  
  const rareCombos = CONFIG.emotionCombos.rare;
  const commonCombos = CONFIG.emotionCombos.common;
  
  const availableRare = rareCombos.filter(combo => 
    !combo.emotions.some(em => usedEmotions.includes(em.toLowerCase()))
  );
  
  if (availableRare.length > 0) {
    return { ...availableRare[0], rarityLevel: 'very rare' };
  }
  
  const availableCommon = commonCombos.filter(combo =>
    !combo.emotions.every(em => usedEmotions.includes(em.toLowerCase()))
  );
  
  if (availableCommon.length > 0) {
    return { ...availableCommon[0], rarityLevel: 'common' };
  }
  
  return {
    emotions: ['curiosity', 'surprise', 'hope'],
    hook: 'Discovery-driven engagement',
    rarityLevel: 'common'
  };
}

function extractKeywords(title) {
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once'];
  
  return (title || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 5);
}

// ============================================================================
// COMPETITOR ANALYSIS - Must Succeed!
// ============================================================================

async function deepCompetitorContentAnalysis(llm, submissions, campaignTitle, campaignData) {
  console.log('\n' + '─'.repeat(60));
  console.log('🔍 DEEP COMPETITOR CONTENT ANALYSIS');
  console.log('─'.repeat(60));
  
  if (!submissions || submissions.length === 0) {
    console.log('   ℹ️ No submissions to analyze - returning empty analysis');
    return { 
      anglesUsed: [], 
      storiesTold: [],
      personasUsed: [],
      structuresUsed: [],
      emotionsUsed: [],
      analogiesUsed: [],
      audienceAddressed: [],
      saturatedElements: [],
      untappedOpportunities: [],
      competitorContent: [],
      strategy: 'No competitor data - create unique content freely'
    };
  }
  
  const competitorContent = submissions.slice(0, 10).map(s => ({
    content: s.content || s.text || s.analysis?.[0]?.analysis || '',
    score: s.score || 0,
    username: s.xUsername || 'Anonymous'
  })).filter(s => s.content && s.content.length > 50);
  
  console.log(`   📄 Analyzing ${competitorContent.length} competitor contents...`);
  
  // Use Python NLP for each competitor content
  const nlpAnalyzer = llm.getNLPAnalyzer();
  const nlpResults = [];
  
  for (let i = 0; i < Math.min(competitorContent.length, 5); i++) {
    console.log(`   🐍 Python NLP analysis for competitor ${i + 1}...`);
    const nlpResult = await nlpAnalyzer.analyzeContent(competitorContent[i].content);
    nlpResults.push({
      index: i,
      score: competitorContent[i].score,
      nlp: nlpResult
    });
    await delay(200);
  }
  
  // AI analysis for patterns
  const analysisPrompt = `Analyze these COMPETITOR CONTENTS for "${campaignTitle}":

${competitorContent.map((c, i) => `
--- COMPETITOR ${i + 1} (Score: ${c.score}) ---
${c.content.substring(0, 800)}
`).join('\n')}

NLP ANALYSIS DATA:
${nlpResults.map(r => `
Competitor ${r.index + 1}: Grade ${r.nlp.hybridMetrics?.qualityGrade || 'N/A'}, 
Emotions: ${r.nlp.emotions?.emotion_variety || 0}, 
Depth: ${r.nlp.depth_analysis?.depth_level || 'N/A'},
Sentiment: ${r.nlp.sentiment?.consensus_label || 'N/A'}
`).join('\n')}

Extract and categorize in JSON format:
{
  "anglesUsed": ["<angle1>", "<angle2>", ...],
  "storiesTold": ["<story type1>", "<story type2>", ...],
  "personasUsed": ["<persona type1>", "<persona type2>", ...],
  "structuresUsed": ["<structure type1>", "<structure type2>", ...],
  "emotionsUsed": [{"emotion": "curiosity", "count": 5}, ...],
  "analogiesUsed": ["<analogy1>", "<analogy2>", ...],
  "audienceAddressed": ["<segment1>", "<segment2>", ...],
  "saturatedElements": ["<overused element1>", "<overused element2>", ...],
  "untappedOpportunities": ["<opportunity1>", "<opportunity2>", ...],
  "uniqueAnglesNotUsed": ["<angle1>", "<angle2>", ...],
  "rareEmotionCombos": [{"emotions": ["surprise", "anger"], "potential": "high"}],
  "depthAnalysis": {
    "averageDepth": "<shallow/medium/deep>",
    "commonEvidenceTypes": ["<type1>", "<type2>"],
    "missingEvidenceTypes": ["<type1>", "<type2>"]
  },
  "recommendations": {
    "winningAngle": "<suggested unique angle>",
    "untappedAudience": "<audience segment>",
    "rareEmotionCombo": ["emotion1", "emotion2"],
    "uniquePerspective": "<perspective not yet used>"
  }
}`;

  const response = await llm.chat([
    { role: 'system', content: 'You are a competitive content analyst specializing in content differentiation. Return JSON only.' },
    { role: 'user', content: analysisPrompt }
  ], { temperature: 0.5, maxTokens: 4000 });
  
  const analysis = safeJsonParse(response.content);
  
  if (!analysis) {
    throw new Error('Failed to parse competitor analysis result');
  }
  
  const thinkingText = `Analyzing ${competitorContent.length} competitor contents...
  
Angles Already Used: ${(analysis.anglesUsed || []).slice(0, 5).join(', ')}
Saturated (AVOID): ${(analysis.saturatedElements || []).slice(0, 3).join(', ')}
Untapped (USE): ${(analysis.untappedOpportunities || []).slice(0, 3).join(', ')}

Recommended Winning Angle: ${analysis.recommendations?.winningAngle || 'Be unique'}`;

  displayThinking('COMPETITOR', thinkingText);
  
  return {
    ...analysis,
    competitorContent: competitorContent.map(c => c.content.substring(0, 300)),
    nlpAnalysis: nlpResults
  };
}

// ============================================================================
// MULTI-QUERY DEEP RESEARCH - Must Succeed!
// ============================================================================

async function multiQueryDeepResearch(llm, campaignTitle, campaignData) {
  console.log('\n' + '─'.repeat(60));
  console.log('🔎 MULTI-QUERY DEEP RESEARCH');
  console.log('─'.repeat(60));
  
  const currentYear = new Date().getFullYear();
  const topicKeywords = extractKeywords(campaignTitle);
  
  const searchQueries = [
    `${campaignTitle} what is how it works ${currentYear}`,
    `${topicKeywords.join(' ')} real cases examples success stories ${currentYear}`,
    `${topicKeywords.join(' ')} controversy debate problems issues`,
    `${topicKeywords.join(' ')} statistics data market size growth ${currentYear}`,
    `${topicKeywords.join(' ')} expert opinion quote analysis insight`,
    `${topicKeywords.join(' ')} untold story hidden problem nobody talks about`
  ];
  
  const allResults = [];
  
  for (let i = 0; i < searchQueries.length; i++) {
    console.log(`   🔍 Query ${i + 1}/${searchQueries.length}: "${searchQueries[i].substring(0, 50)}..."`);
    
    const results = await llm.webSearch(searchQueries[i]);
    
    if (results && results.length > 0) {
      allResults.push({
        query: searchQueries[i],
        queryType: ['basics', 'cases', 'controversies', 'statistics', 'expert', 'untold'][i],
        results: results.slice(0, 3)
      });
    }
    
    // Use configured delay after web search
    await delay(CONFIG.delays.afterWebSearch || 3000);
  }
  
  if (allResults.length === 0) {
    throw new Error('All research queries failed - no results found');
  }
  
  const synthesisPrompt = `Synthesize these research findings for creating unique content about "${campaignTitle}":

${allResults.map(r => `
--- ${r.queryType.toUpperCase()} ---
${r.results.map(res => `- ${res.name}: ${res.snippet?.substring(0, 150)}`).join('\n')}
`).join('\n')}

Extract in JSON format:
{
  "keyFacts": ["<fact1>", "<fact2>", ...],
  "realCases": ["<case1>", "<case2>", ...],
  "controversies": ["<controversy1>", "<controversy2>", ...],
  "statistics": ["<stat1>", "<stat2>", ...],
  "expertQuotes": ["<quote1>", "<quote2>", ...],
  "untoldStories": ["<story1>", "<story2>", ...],
  "uniqueAngles": [{"angle": "<angle>", "evidence": "<supporting evidence>", "uniqueness": "<why unique>"}],
  "evidenceLayers": {
    "macroData": "<large scale data>",
    "caseStudy": "<specific example>",
    "personalTouch": "<relatable element>",
    "expertValidation": "<expert source>"
  }
}`;

  const response = await llm.chat([
    { role: 'system', content: 'You are a research synthesizer. Extract unique angles and evidence for content creation. Return JSON only.' },
    { role: 'user', content: synthesisPrompt }
  ], { temperature: 0.5, maxTokens: 3000 });
  
  const synthesis = safeJsonParse(response.content);
  
  if (!synthesis) {
    throw new Error('Failed to parse research synthesis');
  }
  
  displayThinking('RESEARCH', `Found ${synthesis.keyFacts?.length || 0} facts, ${synthesis.uniqueAngles?.length || 0} unique angles`);
  
  return { rawResults: allResults, synthesis };
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

async function generateUniqueContent(llm, campaignData, competitorAnalysis, researchData, tweetCount = 1) {
  console.log('\n' + '─'.repeat(60));
  console.log('✨ GENERATING UNIQUE CONTENT');
  console.log('─'.repeat(60));
  
  const persona = selectUnusedPersona(competitorAnalysis);
  const narrativeStructure = selectUnusedNarrativeStructure(competitorAnalysis);
  const audience = selectUnaddressedAudience(competitorAnalysis, campaignData.title);
  const emotionCombo = selectRareEmotionCombo(competitorAnalysis);
  
  console.log(`   🎭 Selected Persona: ${persona.name}`);
  console.log(`   📖 Narrative Structure: ${narrativeStructure.name}`);
  console.log(`   👥 Target Audience: ${audience.name}`);
  console.log(`   💫 Emotion Combo: ${emotionCombo.emotions.join(' + ')} (${emotionCombo.rarityLevel})`);
  
  const systemPrompt = `You are an expert content creator for Rally.fun. Create UNIQUE, engaging content.

CRITICAL RULES:
1. NO TEMPLATES - Content must flow naturally
2. NO AI-SOUNDING language (avoid: delve, leverage, realm, tapestry, paradigm, landscape, nuance)
3. Use PERSONAL, CONVERSATIONAL tone
4. Include EVIDENCE LAYERS (data, case, personal touch, expert)
5. Create EMOTIONAL journey (${emotionCombo.emotions.join(' → ')})
6. Target AUDIENCE: ${audience.name} (Pain: ${audience.pain})
7. Use ${persona.name} persona (${persona.trait})
8. Follow ${narrativeStructure.name} flow: ${narrativeStructure.flow}

AVOID THESE OVERUSED ELEMENTS:
${(competitorAnalysis?.saturatedElements || []).slice(0, 5).join(', ') || 'None specific'}
${CONFIG.hardRequirements.templatePhrases.slice(0, 10).join(', ')}

CONTENT REQUIREMENTS:
- Hook: Natural, organic (NOT formulaic)
- Emotions: At least 3 different emotions
- Body Feeling: Physical sensation the reader feels
- CTA: Question or reply bait
- URL: MUST include ${campaignData.campaignUrl || campaignData.url || 'the campaign URL'}
- Facts: Multi-layer evidence

Return JSON:
{
  "tweets": [
    {
      "content": "<full tweet text>",
      "hook": "<the hook>",
      "emotions": ["emotion1", "emotion2", ...],
      "bodyFeeling": "<physical sensation>",
      "cta": "<call to action>",
      "evidenceUsed": ["<evidence1>", "<evidence2>"]
    }
  ],
  "strategyUsed": {
    "angle": "<unique angle>",
    "differentiationPoint": "<how this differs from competitors>",
    "emotionJourney": "<emotional arc>"
  }
}`;

  const userPrompt = `Create ${tweetCount} UNIQUE tweet(s) for:

CAMPAIGN: ${campaignData.title || 'Unknown'}
GOAL: ${campaignData.goal || campaignData.description || 'Not provided'}
KNOWLEDGE BASE: ${campaignData.knowledgeBase || 'Not provided'}
URL: ${campaignData.campaignUrl || campaignData.url || 'Include campaign URL'}

RESEARCH DATA:
${researchData?.synthesis?.keyFacts?.slice(0, 5).join('\n') || 'No research data'}

COMPETITOR ANGLES TO AVOID:
${(competitorAnalysis?.anglesUsed || []).slice(0, 5).join(', ') || 'None'}

Create content that stands out!`;

  const response = await llm.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { temperature: 0.8, maxTokens: 4000 });
  
  const result = safeJsonParse(response.content);
  
  if (!result || !result.tweets) {
    throw new Error('Failed to generate content - invalid response');
  }
  
  console.log(`   ✅ Generated ${result.tweets.length} tweets`);
  
  if (response.thinking) {
    displayThinking('GENERATION', response.thinking);
  }
  
  return {
    tweets: result.tweets,
    strategyUsed: result.strategyUsed || {},
    selectedElements: { persona, narrativeStructure, audience, emotionCombo },
    raw: response.content
  };
}

// ============================================================================
// v9.8.1: QUICK JUDGE = COMPLIANCE CHECK ONLY
// ============================================================================

async function quickJudgeCompliance(llm, content, campaignData) {
  console.log('\n   ' + '┌' + '─'.repeat(56) + '┐');
  console.log('   │         ⚡ QUICK JUDGE - Compliance Check              │');
  console.log('   ' + '└' + '─'.repeat(56) + '┘');
  
  const systemPrompt = `You are a COMPLIANCE CHECKER for Rally.fun content.
Your job is to check if content meets ALL campaign requirements.

Check each item STRICTLY. Mark PASS only if fully satisfied.
Mark FAIL if there's ANY violation or missing requirement.

Return ONLY valid JSON format.`;

  const userPrompt = `COMPLIANCE CHECK for this content:

═══════════════════════════════════════════════════════════════
CONTENT TO CHECK:
═══════════════════════════════════════════════════════════════
${content}

═══════════════════════════════════════════════════════════════
CAMPAIGN REQUIREMENTS:
═══════════════════════════════════════════════════════════════
TITLE: ${campaignData.title || 'N/A'}
DESCRIPTION: ${campaignData.description || campaignData.goal || 'N/A'}
STYLE: ${campaignData.style || 'Standard professional style'}
RULES: ${campaignData.rules || campaignData.requirements || 'No specific rules'}
ADDITIONAL INFO: ${campaignData.additionalInfo || campaignData.additional_info || 'None'}
KNOWLEDGE BASE: ${campaignData.knowledgeBase || campaignData.knowledge_base || 'None'}
REQUIRED URL: ${campaignData.campaignUrl || campaignData.url || 'Required'}

═══════════════════════════════════════════════════════════════
BANNED WORDS (MUST NOT appear):
═══════════════════════════════════════════════════════════════
${CONFIG.hardRequirements.bannedWords.concat(CONFIG.hardRequirements.rallyBannedPhrases).join(', ')}

═══════════════════════════════════════════════════════════════
CHECK EACH ITEM:
═══════════════════════════════════════════════════════════════

Return JSON format:
{
  "checks": {
    "campaignDescription": {
      "pass": true/false,
      "reason": "explain why pass or fail"
    },
    "rules": {
      "pass": true/false,
      "reason": "explain why pass or fail"
    },
    "style": {
      "pass": true/false,
      "reason": "explain why pass or fail"
    },
    "additionalInfo": {
      "pass": true/false,
      "reason": "explain why pass or fail"
    },
    "knowledgeBase": {
      "pass": true/false,
      "reason": "explain why pass or fail"
    },
    "bannedWords": {
      "pass": true/false,
      "foundBannedWords": ["word1", "word2"] or [],
      "reason": "explain why pass or fail"
    },
    "urlPresent": {
      "pass": true/false,
      "urlFound": "the url found" or "not found",
      "reason": "explain why pass or fail"
    }
  },
  "allPass": true/false,
  "failedChecks": ["list of failed check names"],
  "summary": "brief summary of compliance status"
}`;

  // Use callAI which uses SDK
  const result = await callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { temperature: CONFIG.model.temperature.compliance || 0.1, maxTokens: 2000 });

  const parsedResult = safeJsonParse(result.content);
  
  if (!parsedResult) {
    throw new Error('Failed to parse compliance check result');
  }
  
  // Ensure all checks exist
  const defaultChecks = {
    campaignDescription: { pass: false, reason: 'Not checked' },
    rules: { pass: false, reason: 'Not checked' },
    style: { pass: false, reason: 'Not checked' },
    additionalInfo: { pass: false, reason: 'Not checked' },
    knowledgeBase: { pass: false, reason: 'Not checked' },
    bannedWords: { pass: false, reason: 'Not checked', foundBannedWords: [] },
    urlPresent: { pass: false, reason: 'Not checked' }
  };
  
  parsedResult.checks = { ...defaultChecks, ...(parsedResult.checks || {}) };
  
  // Recalculate allPass and failedChecks
  const failedChecks = Object.entries(parsedResult.checks)
    .filter(([key, check]) => check.pass !== true)
    .map(([key]) => key);
  
  parsedResult.allPass = failedChecks.length === 0;
  parsedResult.failedChecks = failedChecks;
  parsedResult.success = true;
  
  // Display results
  console.log('\n   ┌─────────────────────────────────────────────────────────┐');
  console.log('   │              COMPLIANCE CHECK RESULTS                  │');
  console.log('   ├─────────────────────────────────────────────────────────┤');
  
  const checkNames = {
    campaignDescription: 'Description Match',
    rules: 'Rules Followed',
    style: 'Style Matched',
    additionalInfo: 'Additional Info',
    knowledgeBase: 'Knowledge Base',
    bannedWords: 'No Banned Words',
    urlPresent: 'URL Present'
  };
  
  for (const [key, check] of Object.entries(parsedResult.checks)) {
    const icon = check.pass ? '✅' : '❌';
    const name = checkNames[key] || key;
    console.log(`   │ ${icon} ${name.padEnd(20)} ${check.pass ? 'PASS' : 'FAIL'.padEnd(22)}│`);
  }
  
  console.log('   ├─────────────────────────────────────────────────────────┤');
  const statusIcon = parsedResult.allPass ? '✅' : '❌';
  const statusText = parsedResult.allPass ? 'ALL PASSED' : `${failedChecks.length} FAILED`;
  console.log(`   │              ${statusIcon} ${statusText.padEnd(30)}         │`);
  console.log('   └─────────────────────────────────────────────────────────┘');
  
  if (!parsedResult.allPass && parsedResult.failedChecks.length > 0) {
    console.log('\n   ⚠️  FAILED CHECKS:');
    for (const checkName of parsedResult.failedChecks) {
      const check = parsedResult.checks[checkName];
      console.log(`      • ${checkName}: ${check?.reason || 'No reason provided'}`);
    }
  }
  
  return parsedResult;
}

/**
 * BATCH QUICK JUDGE - Check compliance for multiple contents
 */
async function batchQuickJudge(llm, contents, campaignData) {
  console.log('\n' + '═'.repeat(60));
  console.log('⚡ BATCH QUICK JUDGE - Compliance Check for All Contents');
  console.log('═'.repeat(60));
  console.log(`   Checking ${contents.length} contents for compliance...`);
  
  const results = [];
  
  for (let i = 0; i < contents.length; i++) {
    const contentItem = contents[i];
    console.log(`\n   ─── Content #${contentItem.index} ───`);
    
    const complianceResult = await quickJudgeCompliance(llm, contentItem.content, campaignData);
    
    results.push({
      index: contentItem.index,
      content: contentItem.content,
      variation: contentItem.variation,
      compliance: complianceResult,
      passed: complianceResult.allPass,
      failedChecks: complianceResult.failedChecks || []
    });
    
    // Use configured delay between quick judge checks
    await delay(CONFIG.delays.betweenQuickJudge || 3000);
  }
  
  // Summary
  const passedCount = results.filter(r => r.passed).length;
  console.log('\n' + '═'.repeat(60));
  console.log('📊 QUICK JUDGE SUMMARY');
  console.log('═'.repeat(60));
  console.log(`   Total Checked: ${results.length}`);
  console.log(`   ✅ Passed: ${passedCount}`);
  console.log(`   ❌ Failed: ${results.length - passedCount}`);
  
  if (passedCount > 0) {
    const passedIndices = results.filter(r => r.passed).map(r => r.index);
    console.log(`   🎯 Contents that passed: #${passedIndices.join(', #')}`);
  }
  
  return results;
}

// ============================================================================
// JUDGING SYSTEM
// ============================================================================

async function runHybridJudging(llm, content, campaignData, competitorContents, attempt = 1) {
  console.log('\n' + '═'.repeat(60));
  console.log(`⚖️  HYBRID JUDGING SYSTEM - Attempt ${attempt}`);
  console.log('═'.repeat(60));
  
  const results = {
    attempt,
    judges: {},
    scores: {},
    feedback: {},
    nlpAnalysis: null,
    passed: false,
    totalScore: 0
  };
  
  // Get Python NLP Analysis first
  const nlpAnalyzer = llm.getNLPAnalyzer();
  results.nlpAnalysis = await nlpAnalyzer.analyzeContent(content, campaignData, competitorContents);
  
  console.log(`\n   🐍 Python NLP Quality: ${results.nlpAnalysis.hybridMetrics?.qualityGrade} (${results.nlpAnalysis.hybridMetrics?.overallQuality}/100)`);
  
  // Judge 1: Gate Utama
  console.log('\n   ─── JUDGE 1: GATE UTAMA ───');
  const judge1Result = await llm.blindJudge(
    getJudge1SystemPrompt(),
    getJudge1UserPrompt(content, campaignData),
    1
  );
  results.judges.judge1 = parseJudgeResult(judge1Result.content);
  results.scores.gateUtama = calculateJudge1Score(results.judges.judge1);
  
  if (judge1Result.thinking) displayJudgeThinking(1, judge1Result.thinking);
  
  await delay(CONFIG.delays.betweenJudges);
  
  // Judge 2: Gate Tambahan
  console.log('\n   ─── JUDGE 2: GATE TAMBAHAN ───');
  const judge2Result = await llm.blindJudge(
    getJudge2SystemPrompt(),
    getJudge2UserPrompt(content, campaignData),
    2
  );
  results.judges.judge2 = parseJudgeResult(judge2Result.content);
  results.scores.gateTambahan = calculateJudge2Score(results.judges.judge2);
  
  if (judge2Result.thinking) displayJudgeThinking(2, judge2Result.thinking);
  
  await delay(CONFIG.delays.betweenJudges);
  
  // Judge 3: Penilaian Internal
  console.log('\n   ─── JUDGE 3: PENILAIAN INTERNAL ───');
  const judge3Result = await llm.blindJudge(
    getJudge3SystemPrompt(),
    getJudge3UserPrompt(content, campaignData),
    3
  );
  results.judges.judge3 = parseJudgeResult(judge3Result.content);
  results.scores.penilaianInternal = calculateJudge3Score(results.judges.judge3);
  
  if (judge3Result.thinking) displayJudgeThinking(3, judge3Result.thinking);
  
  await delay(CONFIG.delays.betweenJudges);
  
  // Judge 4: Compliance
  console.log('\n   ─── JUDGE 4: COMPREHENSIVE COMPLIANCE ───');
  const judge4Result = await llm.contextAwareJudge(
    getJudge4SystemPrompt(),
    getJudge4UserPrompt(content, campaignData),
    4
  );
  results.judges.judge4 = parseJudge4Result(judge4Result.content);
  results.scores.compliance = calculateJudge4Score(results.judges.judge4);
  
  if (judge4Result.thinking) displayJudgeThinking(4, judge4Result.thinking);
  
  await delay(CONFIG.delays.betweenJudges);
  
  // Judge 5: Fact-Check (with Web Search)
  console.log('\n   ─── JUDGE 5: FACT-CHECK ───');
  const judge5Result = await llm.factCheckJudge(
    getJudge5SystemPrompt(),
    getJudge5UserPrompt(content, campaignData),
    5
  );
  results.judges.judge5 = parseJudgeResult(judge5Result.content);
  results.scores.factCheck = calculateJudge5Score(results.judges.judge5);
  
  if (judge5Result.thinking) displayJudgeThinking(5, judge5Result.thinking);
  
  await delay(CONFIG.delays.betweenJudges);
  
  // Judge 6: Uniqueness
  console.log('\n   ─── JUDGE 6: UNIQUENESS VERIFIER (Hybrid) ───');
  const judge6Result = await llm.hybridJudge(
    getJudge6SystemPrompt(),
    getJudge6UserPrompt(content, campaignData, competitorContents),
    6,
    content,
    competitorContents
  );
  results.judges.judge6 = parseJudge6Result(judge6Result.content, results.nlpAnalysis);
  results.scores.uniqueness = calculateJudge6Score(results.judges.judge6);
  
  if (judge6Result.thinking) displayJudgeThinking(6, judge6Result.thinking);
  
  // Compile feedback
  results.feedback = compileJudgeFeedback(results);
  
  // Calculate final score
  results.totalScore = 
    results.scores.gateUtama +
    results.scores.gateTambahan +
    results.scores.penilaianInternal +
    results.scores.compliance +
    results.scores.factCheck +
    results.scores.uniqueness;
  
  // Determine if passed
  results.passed = determinePassStatus(results);
  
  // Display summary
  displayJudgingSummary(results);
  
  return results;
}

// ============================================================================
// JUDGE PROMPTS
// ============================================================================

function getJudge1SystemPrompt() {
  return `You are Judge 1: Gate Utama for Rally.fun content evaluation.

Score each criterion 1-4:
- Hook Quality (1-4): Is the opening compelling and natural?
- Emotional Impact (1-4): Does it evoke real emotions?
- Body Feeling (1-4): Can the reader FEEL something physical?
- CTA Quality (1-4): Is the call-to-action engaging?
- URL Presence (1-4): Is the campaign URL included?

Return JSON:
{
  "hookQuality": {"score": N, "reason": "..."},
  "emotionalImpact": {"score": N, "reason": "..."},
  "bodyFeeling": {"score": N, "reason": "..."},
  "ctaQuality": {"score": N, "reason": "..."},
  "urlPresence": {"score": N, "reason": "..."},
  "totalScore": N,
  "feedback": "..."
}`;
}

function getJudge1UserPrompt(content, campaignData) {
  return `Evaluate this content for Gate Utama:

CONTENT:
${content}

CAMPAIGN URL: ${campaignData.campaignUrl || campaignData.url || 'Check for URL'}

Evaluate and return JSON scores.`;
}

function getJudge2SystemPrompt() {
  return `You are Judge 2: Gate Tambahan for Rally.fun content evaluation.

Score each criterion 1-4:
- Fact Quality (1-4): Are facts/data compelling?
- Engagement Hook (1-4): Does it hook for replies?
- Readability (1-4): Is it easy to read?
- Originality (1-4): Is it unique, not template-like?

Return JSON:
{
  "factQuality": {"score": N, "reason": "..."},
  "engagementHook": {"score": N, "reason": "..."},
  "readability": {"score": N, "reason": "..."},
  "originality": {"score": N, "reason": "..."},
  "totalScore": N,
  "feedback": "..."
}`;
}

function getJudge2UserPrompt(content, campaignData) {
  return `Evaluate this content for Gate Tambahan:

CONTENT:
${content}

Evaluate and return JSON scores.`;
}

function getJudge3SystemPrompt() {
  return `You are Judge 3: Penilaian Internal for Rally.fun content evaluation.

Score each criterion 1-10:
- Content Depth (1-10): Multi-layer evidence?
- Story Quality (1-10): Compelling narrative?
- Audience Fit (1-10): Matches target audience?
- Emotion Variety (1-10): Multiple emotions?
- Evidence Layering (1-10): Data + Case + Personal + Expert?
- Anti-Template Score (1-10): NOT formulaic?

Return JSON:
{
  "contentDepth": {"score": N, "reason": "..."},
  "storyQuality": {"score": N, "reason": "..."},
  "audienceFit": {"score": N, "reason": "..."},
  "emotionVariety": {"score": N, "reason": "..."},
  "evidenceLayering": {"score": N, "reason": "..."},
  "antiTemplate": {"score": N, "reason": "..."},
  "totalScore": N,
  "feedback": "..."
}`;
}

function getJudge3UserPrompt(content, campaignData) {
  return `Evaluate this content for Penilaian Internal:

CONTENT:
${content}

CAMPAIGN CONTEXT:
Title: ${campaignData.title || 'Unknown'}
Goal: ${campaignData.goal || 'Unknown'}
Target Audience: ${campaignData.targetAudience || 'General'}

Evaluate and return JSON scores.`;
}

function getJudge4SystemPrompt() {
  return `You are Judge 4: Comprehensive Compliance for Rally.fun.

Check ALL 10 requirements (pass/fail):

1. Description Alignment: Does content match campaign description?
2. Style Compliance: Matches campaign style requirements?
3. Knowledge Base: Uses provided knowledge correctly?
4. Campaign Rules: Follows all campaign rules?
5. URL Required: Includes required URL?
6. No Banned Words: No banned phrases used?
7. No AI Patterns: Doesn't sound AI-generated?
8. Evidence Depth: Has sufficient evidence layers?
9. Anti-Template: Not using formulaic structures?
10. Quality Threshold: Meets minimum quality?

Return JSON:
{
  "checks": {
    "descriptionAlignment": {"pass": true/false, "reason": "..."},
    "styleCompliance": {"pass": true/false, "reason": "..."},
    "knowledgeBase": {"pass": true/false, "reason": "..."},
    "campaignRules": {"pass": true/false, "reason": "..."},
    "requiredUrl": {"pass": true/false, "reason": "..."},
    "noBannedWords": {"pass": true/false, "reason": "..."},
    "noAIPatterns": {"pass": true/false, "reason": "..."},
    "evidenceDepth": {"pass": true/false, "reason": "..."},
    "antiTemplate": {"pass": true/false, "reason": "..."},
    "qualityThreshold": {"pass": true/false, "reason": "..."}
  },
  "allPass": true/false,
  "failedChecks": ["list of failed check names"],
  "feedback": "..."
}`;
}

function getJudge4UserPrompt(content, campaignData) {
  return `Check compliance for:

CONTENT:
${content}

CAMPAIGN DATA:
Title: ${campaignData.title || 'Unknown'}
Description: ${campaignData.description || 'Unknown'}
Knowledge Base: ${campaignData.knowledgeBase || 'Unknown'}
Campaign Rules: ${campaignData.rules || 'Standard rules'}
Required URL: ${campaignData.campaignUrl || campaignData.url || 'Required'}

BANNED WORDS: ${CONFIG.hardRequirements.bannedWords.concat(CONFIG.hardRequirements.rallyBannedPhrases).join(', ')}

AI PATTERNS TO DETECT: ${CONFIG.hardRequirements.aiPatterns.words.concat(CONFIG.hardRequirements.aiPatterns.phrases).join(', ')}

Check all 10 requirements and return JSON.`;
}

function getJudge5SystemPrompt() {
  return `You are Judge 5: Fact-Check Judge for Rally.fun.

Verify claims in content using web search results.

Score each criterion 1-5:
- Claim Accuracy (1-5): Are claims verifiable?
- Source Quality (1-5): Are sources reliable?
- Data Freshness (1-5): Is data current?

Return JSON:
{
  "claimAccuracy": {"score": N, "reason": "...", "verified": true/false},
  "sourceQuality": {"score": N, "reason": "..."},
  "dataFreshness": {"score": N, "reason": "..."},
  "totalScore": N,
  "factCheckResults": ["result1", "result2"],
  "feedback": "..."
}`;
}

function getJudge5UserPrompt(content, campaignData) {
  return `Fact-check this content:

CONTENT:
${content}

Use web search results to verify claims.
Return JSON with scores and verification results.`;
}

function getJudge6SystemPrompt() {
  return `You are Judge 6: Uniqueness Verifier for Rally.fun.

Compare content against ALL competitor contents.
Use Python NLP analysis for semantic similarity.

Score each criterion:
- Differentiation (1-10): How different from competitors?
- Unique Angle (1-5): Is the angle unique?
- Emotion Uniqueness (1-5): Rare emotion combo?
- Template Avoidance (1-5): Not formulaic?

Return JSON:
{
  "differentiation": {"score": N, "reason": "..."},
  "uniqueAngle": {"score": N, "reason": "..."},
  "emotionUniqueness": {"score": N, "reason": "..."},
  "templateAvoidance": {"score": N, "reason": "..."},
  "similarityScore": N,
  "isUnique": true/false,
  "totalScore": N,
  "feedback": "..."
}`;
}

function getJudge6UserPrompt(content, campaignData, competitorContents) {
  return `Verify uniqueness:

CONTENT TO CHECK:
${content}

COMPETITOR CONTENTS:
${(competitorContents || []).slice(0, 5).map((c, i) => `
--- Competitor ${i + 1} ---
${c.substring ? c.substring(0, 300) : c}
`).join('\n')}

Compare and score uniqueness. Use NLP similarity data.`;
}

// ============================================================================
// SCORE CALCULATORS
// ============================================================================

function parseJudgeResult(content) {
  return safeJsonParse(content) || { totalScore: 0, feedback: 'Failed to parse' };
}

function parseJudge4Result(content) {
  const result = safeJsonParse(content);
  if (!result) {
    return {
      checks: {},
      allPass: false,
      failedChecks: ['parse_failed'],
      feedback: 'Failed to parse'
    };
  }
  
  const defaultChecks = {
    descriptionAlignment: { pass: false, reason: 'Not checked' },
    styleCompliance: { pass: false, reason: 'Not checked' },
    knowledgeBase: { pass: false, reason: 'Not checked' },
    campaignRules: { pass: false, reason: 'Not checked' },
    requiredUrl: { pass: false, reason: 'Not checked' },
    noBannedWords: { pass: false, reason: 'Not checked' },
    noAIPatterns: { pass: false, reason: 'Not checked' },
    evidenceDepth: { pass: false, reason: 'Not checked' },
    antiTemplate: { pass: false, reason: 'Not checked' },
    qualityThreshold: { pass: false, reason: 'Not checked' }
  };
  
  result.checks = { ...defaultChecks, ...(result.checks || {}) };
  
  const failedChecks = Object.entries(result.checks)
    .filter(([key, check]) => check.pass !== true)
    .map(([key]) => key);
  
  result.allPass = failedChecks.length === 0;
  result.failedChecks = failedChecks;
  
  return result;
}

function parseJudge6Result(content, nlpAnalysis) {
  const result = safeJsonParse(content) || {};
  
  if (nlpAnalysis) {
    result.nlpEnhanced = {
      similarity: nlpAnalysis.similarity?.primary?.max_similarity || 0,
      emotionVariety: nlpAnalysis.emotions?.emotion_variety || 0,
      rareCombo: nlpAnalysis.emotions?.rare_combo_detected || false,
      depthLevel: nlpAnalysis.depth_analysis?.depth_level || 'unknown',
      qualityGrade: nlpAnalysis.hybridMetrics?.qualityGrade || 'N/A'
    };
  }
  
  return result;
}

function calculateJudge1Score(result) {
  if (!result) return 0;
  const scores = [
    result.hookQuality?.score || 0,
    result.emotionalImpact?.score || 0,
    result.bodyFeeling?.score || 0,
    result.ctaQuality?.score || 0,
    result.urlPresence?.score || 0
  ];
  return scores.reduce((a, b) => a + b, 0);
}

function calculateJudge2Score(result) {
  if (!result) return 0;
  const scores = [
    result.factQuality?.score || 0,
    result.engagementHook?.score || 0,
    result.readability?.score || 0,
    result.originality?.score || 0
  ];
  return scores.reduce((a, b) => a + b, 0);
}

function calculateJudge3Score(result) {
  if (!result) return 0;
  const scores = [
    result.contentDepth?.score || 0,
    result.storyQuality?.score || 0,
    result.audienceFit?.score || 0,
    result.emotionVariety?.score || 0,
    result.evidenceLayering?.score || 0,
    result.antiTemplate?.score || 0
  ];
  return scores.reduce((a, b) => a + b, 0);
}

function calculateJudge4Score(result) {
  if (!result || !result.checks) return 0;
  
  const passedCount = Object.values(result.checks)
    .filter(check => check.pass === true)
    .length;
  
  return passedCount;
}

function calculateJudge5Score(result) {
  if (!result) return 0;
  const scores = [
    result.claimAccuracy?.score || 0,
    result.sourceQuality?.score || 0,
    result.dataFreshness?.score || 0
  ];
  return Math.min(scores.reduce((a, b) => a + b, 0), 5);
}

function calculateJudge6Score(result) {
  if (!result) return 0;
  
  let score = 0;
  score += (result.differentiation?.score || 0) * 1.5;
  score += (result.uniqueAngle?.score || 0);
  score += (result.emotionUniqueness?.score || 0);
  
  if (result.nlpEnhanced?.rareCombo) {
    score += 2;
  }
  
  if (result.nlpEnhanced?.similarity > 0.7) {
    score -= 5;
  }
  
  return Math.max(0, Math.min(25, score));
}

function compileJudgeFeedback(results) {
  const feedback = {
    allPass: true,
    issues: [],
    suggestions: [],
    judgeFeedbacks: {}
  };
  
  if (results.judges.judge1) {
    feedback.judgeFeedbacks.judge1 = results.judges.judge1.feedback || '';
    if (results.scores.gateUtama < CONFIG.thresholds.gateUtama.pass) {
      feedback.allPass = false;
      feedback.issues.push(`Gate Utama: ${results.scores.gateUtama}/${CONFIG.thresholds.gateUtama.max} (need ${CONFIG.thresholds.gateUtama.pass})`);
    }
  }
  
  if (results.judges.judge2) {
    feedback.judgeFeedbacks.judge2 = results.judges.judge2.feedback || '';
    if (results.scores.gateTambahan < CONFIG.thresholds.gateTambahan.pass) {
      feedback.allPass = false;
      feedback.issues.push(`Gate Tambahan: ${results.scores.gateTambahan}/${CONFIG.thresholds.gateTambahan.max} (need ${CONFIG.thresholds.gateTambahan.pass})`);
    }
  }
  
  if (results.judges.judge3) {
    feedback.judgeFeedbacks.judge3 = results.judges.judge3.feedback || '';
    if (results.scores.penilaianInternal < CONFIG.thresholds.penilaianInternal.pass) {
      feedback.allPass = false;
      feedback.issues.push(`Penilaian Internal: ${results.scores.penilaianInternal}/${CONFIG.thresholds.penilaianInternal.max} (need ${CONFIG.thresholds.penilaianInternal.pass})`);
    }
  }
  
  if (results.judges.judge4) {
    feedback.judgeFeedbacks.judge4 = results.judges.judge4.feedback || '';
    if (!results.judges.judge4.allPass) {
      feedback.allPass = false;
      feedback.issues.push(`Compliance FAILED: ${results.judges.judge4.failedChecks?.join(', ')}`);
      
      for (const [checkName, checkResult] of Object.entries(results.judges.judge4.checks || {})) {
        if (checkResult.pass !== true) {
          feedback.suggestions.push(`${checkName}: ${checkResult.reason || 'Failed'}`);
        }
      }
    }
  }
  
  if (results.judges.judge5) {
    feedback.judgeFeedbacks.judge5 = results.judges.judge5.feedback || '';
    if (results.scores.factCheck < CONFIG.thresholds.factCheck.pass) {
      feedback.issues.push(`Fact-Check: ${results.scores.factCheck}/${CONFIG.thresholds.factCheck.max} (need ${CONFIG.thresholds.factCheck.pass})`);
    }
  }
  
  if (results.judges.judge6) {
    feedback.judgeFeedbacks.judge6 = results.judges.judge6.feedback || '';
    if (results.scores.uniqueness < CONFIG.thresholds.uniqueness.pass) {
      feedback.allPass = false;
      feedback.issues.push(`Uniqueness: ${results.scores.uniqueness}/${CONFIG.thresholds.uniqueness.max} (need ${CONFIG.thresholds.uniqueness.pass})`);
      
      if (results.judges.judge6.nlpEnhanced?.similarity > 0.7) {
        feedback.suggestions.push('Content too similar to competitors - increase differentiation');
      }
    }
  }
  
  if (results.nlpAnalysis?.hybridMetrics?.recommendations) {
    feedback.suggestions.push(...results.nlpAnalysis.hybridMetrics.recommendations);
  }
  
  return feedback;
}

function determinePassStatus(results) {
  const gateUtamaPass = results.scores.gateUtama >= CONFIG.thresholds.gateUtama.pass;
  const gateTambahanPass = results.scores.gateTambahan >= CONFIG.thresholds.gateTambahan.pass;
  const penilaianInternalPass = results.scores.penilaianInternal >= CONFIG.thresholds.penilaianInternal.pass;
  const compliancePass = results.judges.judge4?.allPass === true;
  const factCheckPass = results.scores.factCheck >= CONFIG.thresholds.factCheck.pass;
  const uniquenessPass = results.scores.uniqueness >= CONFIG.thresholds.uniqueness.pass;
  
  return gateUtamaPass && gateTambahanPass && penilaianInternalPass && 
         compliancePass && factCheckPass && uniquenessPass;
}

function displayJudgingSummary(results) {
  console.log('\n   ' + '═'.repeat(56));
  console.log('   ║              ⚖️  JUDGING SUMMARY                        ║');
  console.log('   ╠' + '═'.repeat(56) + '╣');
  
  const thresholds = CONFIG.thresholds;
  
  const g1Status = results.scores.gateUtama >= thresholds.gateUtama.pass ? '✅' : '❌';
  console.log(`   ║ ${g1Status} Gate Utama:        ${results.scores.gateUtama.toString().padStart(2)}/${thresholds.gateUtama.max}  (need ${thresholds.gateUtama.pass})                    ║`);
  
  const g2Status = results.scores.gateTambahan >= thresholds.gateTambahan.pass ? '✅' : '❌';
  console.log(`   ║ ${g2Status} Gate Tambahan:     ${results.scores.gateTambahan.toString().padStart(2)}/${thresholds.gateTambahan.max}  (need ${thresholds.gateTambahan.pass})                    ║`);
  
  const g3Status = results.scores.penilaianInternal >= thresholds.penilaianInternal.pass ? '✅' : '❌';
  console.log(`   ║ ${g3Status} Penilaian Internal: ${results.scores.penilaianInternal.toString().padStart(2)}/${thresholds.penilaianInternal.max}  (need ${thresholds.penilaianInternal.pass})                   ║`);
  
  const g4Status = results.judges.judge4?.allPass ? '✅' : '❌';
  console.log(`   ║ ${g4Status} Compliance:        ${results.scores.compliance.toString().padStart(2)}/${thresholds.compliance.max}  (all must pass)                  ║`);
  
  const g5Status = results.scores.factCheck >= thresholds.factCheck.pass ? '✅' : '❌';
  console.log(`   ║ ${g5Status} Fact-Check:         ${results.scores.factCheck.toString().padStart(2)}/${thresholds.factCheck.max}  (need ${thresholds.factCheck.pass})                     ║`);
  
  const g6Status = results.scores.uniqueness >= thresholds.uniqueness.pass ? '✅' : '❌';
  console.log(`   ║ ${g6Status} Uniqueness:        ${results.scores.uniqueness.toString().padStart(2)}/${thresholds.uniqueness.max}  (need ${thresholds.uniqueness.pass})                    ║`);
  
  console.log('   ╠' + '─'.repeat(56) + '╣');
  
  const totalStatus = results.passed ? '✅ PASSED' : '❌ FAILED';
  console.log(`   ║              TOTAL: ${results.totalScore.toString().padStart(3)}/136  ${totalStatus.padEnd(14)}║`);
  
  if (results.nlpAnalysis?.hybridMetrics) {
    const grade = results.nlpAnalysis.hybridMetrics.qualityGrade;
    const quality = results.nlpAnalysis.hybridMetrics.overallQuality;
    console.log(`   ║         NLP Quality: ${grade} (${quality}/100)                        ║`);
  }
  
  console.log('   ╚' + '═'.repeat(56) + '╝');
  
  if (!results.passed && results.feedback?.issues?.length > 0) {
    console.log('\n   ⚠️  ISSUES:');
    results.feedback.issues.forEach(issue => {
      console.log(`      • ${issue}`);
    });
    
    if (results.feedback.suggestions?.length > 0) {
      console.log('\n   💡 SUGGESTIONS:');
      results.feedback.suggestions.slice(0, 5).forEach(suggestion => {
        console.log(`      • ${suggestion}`);
      });
    }
  }
}

// ============================================================================
// RALLY API FUNCTIONS
// ============================================================================

async function fetchCampaignData(campaignAddress) {
  console.log(`\n📥 Fetching campaign data: ${campaignAddress}`);
  
  try {
    const response = await new Promise((resolve, reject) => {
      let url = `${CONFIG.rallyApiBase}/campaigns/${campaignAddress}`;
      
      https.get(url, { headers: { 'User-Agent': CONFIG.userAgent } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error('Failed to parse campaign data'));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      }).on('error', reject);
    });
    
    const campaign = {
      ...response,
      description: response.goal || response.description || '',
      campaignUrl: response.campaignUrl || `https://app.rally.fun/campaign/${response.intelligentContractAddress}`,
      url: response.campaignUrl || `https://app.rally.fun/campaign/${response.intelligentContractAddress}`,
      additionalInfo: response.adminNotice || response.additionalInfo || ''
    };
    
    console.log('   ✅ Campaign data fetched');
    console.log(`   📋 Title: ${campaign.title}`);
    console.log(`   🎨 Style: ${(campaign.style || 'Standard').substring(0, 50)}...`);
    console.log(`   📜 Rules: ${(campaign.rules || 'Standard rules').substring(0, 50)}...`);
    
    return campaign;
  } catch (error) {
    throw new Error(`Failed to fetch campaign: ${error.message}`);
  }
}

async function fetchLeaderboard(campaignAddress) {
  console.log(`\n📥 Fetching leaderboard...`);
  
  try {
    const response = await new Promise((resolve, reject) => {
      const url = `${CONFIG.rallyApiBase}/campaigns/${campaignAddress}/leaderboard`;
      
      https.get(url, { headers: { 'User-Agent': CONFIG.userAgent } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve([]);
            }
          } else {
            resolve([]);
          }
        });
      }).on('error', () => resolve([]));
    });
    
    console.log(`   ✅ Leaderboard fetched: ${response?.length || 0} submissions`);
    return response || [];
  } catch (error) {
    console.log(`   ⚠️ Failed to fetch leaderboard: ${error.message}`);
    return [];
  }
}

// ============================================================================
// REVISION LOOP
// ============================================================================

async function revisionLoop(llm, content, campaignData, competitorContents, attempt, feedback) {
  console.log('\n' + '─'.repeat(60));
  console.log(`🔄 REVISION LOOP - Attempt ${attempt + 1}`);
  console.log('─'.repeat(60));
  
  if (attempt >= CONFIG.revision.maxAttempts) {
    console.log('   ❌ Max revision attempts reached');
    return null;
  }
  
  await delay(CONFIG.delays.beforeRevision);
  
  const revisionPrompt = `REVISE this content based on judge feedback.

ORIGINAL CONTENT:
${content}

JUDGE FEEDBACK:
${JSON.stringify(feedback, null, 2)}

ISSUES TO FIX:
${feedback?.issues?.join('\n') || 'None specific'}

SUGGESTIONS:
${feedback?.suggestions?.join('\n') || 'None specific'}

Create REVISED content that:
1. Addresses ALL failed checks
2. Maintains the unique angle
3. Improves weak areas
4. Keeps the URL included

Return JSON:
{
  "revisedContent": "<full revised tweet>",
  "changes": ["change1", "change2", ...]
}`;

  const response = await llm.chat([
    { role: 'system', content: 'You are a content revision specialist. Fix issues while maintaining uniqueness.' },
    { role: 'user', content: revisionPrompt }
  ], { temperature: 0.6, maxTokens: 2000 });
  
  const result = safeJsonParse(response.content);
  
  if (!result || !result.revisedContent) {
    throw new Error('Failed to generate revision');
  }
  
  console.log(`   ✅ Revision generated`);
  console.log(`   📝 Changes: ${(result.changes || []).join(', ')}`);
  return result.revisedContent;
}

// ============================================================================
// v9.8.1: MULTI-CONTENT GENERATOR CLASS
// ============================================================================

class MultiContentGenerator {
  constructor(llm, config) {
    this.llm = llm;
    this.config = config;
    this.generatedContents = [];
    this.judgingResults = [];
    this.rankings = [];
  }
  
  async generateMultipleContents(campaignData, competitorAnalysis, researchData) {
    console.log('\n' + '═'.repeat(60));
    console.log(`🚀 GENERATING ${this.config.multiContent.count} CONTENTS`);
    console.log('═'.repeat(60));
    
    this.generatedContents = [];
    const variations = this.config.multiContent.variations;
    
    for (let i = 0; i < this.config.multiContent.count; i++) {
      console.log(`\n📝 Generating Content ${i + 1}/${this.config.multiContent.count}...`);
      
      const variation = {
        index: i,
        angle: variations.angles[i % variations.angles.length],
        emotions: variations.emotions[i % variations.emotions.length],
        structure: variations.structures[i % variations.structures.length]
      };
      
      console.log(`   🎭 Angle: ${variation.angle}`);
      console.log(`   💫 Emotions: ${variation.emotions.join(' → ')}`);
      console.log(`   📖 Structure: ${variation.structure}`);
      
      const content = await this._generateSingleContent(
        campaignData,
        competitorAnalysis,
        researchData,
        variation
      );
      
      if (content) {
        this.generatedContents.push({
          index: i + 1,
          content: content,
          variation: variation,
          timestamp: new Date().toISOString()
        });
        console.log(`   ✅ Content ${i + 1} generated successfully`);
      }
      
      // Use configured delay between content generation
      await delay(this.config.delays.betweenContentGen || 5000);
    }
    
    if (this.generatedContents.length === 0) {
      throw new Error('Failed to generate any contents');
    }
    
    console.log(`\n📊 Generated ${this.generatedContents.length}/${this.config.multiContent.count} contents`);
    return this.generatedContents;
  }
  
  async _generateSingleContent(campaignData, competitorAnalysis, researchData, variation) {
    const persona = this._selectPersona(variation.angle);
    const narrativeStructure = this._selectStructure(variation.structure);
    const audience = selectUnaddressedAudience(competitorAnalysis, campaignData.title);
    const emotionCombo = { emotions: variation.emotions, hook: `${variation.emotions[0]} → ${variation.emotions[1]}` };
    
    const systemPrompt = `You are an expert content creator for Rally.fun. Create UNIQUE, engaging content.

CRITICAL RULES:
1. NO TEMPLATES - Content must flow naturally
2. NO AI-SOUNDING language (avoid: delve, leverage, realm, tapestry, paradigm, landscape, nuance)
3. Use PERSONAL, CONVERSATIONAL tone
4. Include EVIDENCE LAYERS (data, case, personal touch, expert)
5. Create EMOTIONAL journey (${variation.emotions.join(' → ')})
6. Target AUDIENCE: ${audience.name} (Pain: ${audience.pain})
7. Use ${persona.name} persona (${persona.trait})
8. Follow ${narrativeStructure.name} flow: ${narrativeStructure.flow}

AVOID THESE OVERUSED ELEMENTS:
${(competitorAnalysis?.saturatedElements || []).slice(0, 5).join(', ') || 'None specific'}
${CONFIG.hardRequirements.templatePhrases.slice(0, 10).join(', ')}

CONTENT REQUIREMENTS:
- Hook: Natural, organic (NOT formulaic)
- Emotions: At least 3 different emotions
- Body Feeling: Physical sensation the reader feels
- CTA: Question or reply bait
- URL: MUST include ${campaignData.campaignUrl || campaignData.url || 'the campaign URL'}
- Facts: Multi-layer evidence

Return JSON:
{
  "tweets": [{ "content": "<full tweet text>", "hook": "...", "emotions": [], "bodyFeeling": "...", "cta": "..." }],
  "strategyUsed": { "angle": "...", "differentiationPoint": "..." }
}`;

    const userPrompt = `Create 1 UNIQUE tweet for:

CAMPAIGN: ${campaignData.title || 'Unknown'}
GOAL: ${campaignData.goal || campaignData.description || 'Not provided'}
KNOWLEDGE BASE: ${campaignData.knowledgeBase || 'Not provided'}
URL: ${campaignData.campaignUrl || campaignData.url || 'Include campaign URL'}

VARIATION SETTINGS:
- Angle: ${variation.angle}
- Emotions: ${variation.emotions.join(' → ')}
- Structure: ${variation.structure}

RESEARCH DATA:
${researchData?.synthesis?.keyFacts?.slice(0, 5).join('\n') || 'No research data'}

COMPETITOR ANGLES TO AVOID:
${(competitorAnalysis?.anglesUsed || []).slice(0, 5).join(', ') || 'None'}

Create unique content!`;

    const response = await this.llm.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { 
      temperature: this.config.model.temperature.generation, 
      maxTokens: 4000 
    });
    
    const result = safeJsonParse(response.content);
    
    if (result && result.tweets) {
      return result.tweets[0]?.content || result.tweets[0]?.text || null;
    }
    
    return null;
  }
  
  _selectPersona(angle) {
    const personaMap = {
      'personal_story': CONFIG.personas.find(p => p.id === 'storyteller'),
      'data_driven': CONFIG.personas.find(p => p.id === 'researcher'),
      'contrarian': CONFIG.personas.find(p => p.id === 'contrarian'),
      'insider_perspective': CONFIG.personas.find(p => p.id === 'insider'),
      'case_study': CONFIG.personas.find(p => p.id === 'researcher')
    };
    return personaMap[angle] || CONFIG.personas[0];
  }
  
  _selectStructure(structureId) {
    return CONFIG.narrativeStructures.find(s => s.id === structureId) || CONFIG.narrativeStructures[0];
  }
}

// ============================================================================
// v9.8.1: MULTI-CONTENT MAIN WORKFLOW
// ============================================================================

async function mainMultiContent(campaignAddress) {
  console.log('\n' + '═'.repeat(70));
  console.log('║      RALLY WORKFLOW V9.8.1 - MULTI-CONTENT SYSTEM              ║');
  console.log('║   Generate 5 → Quick Judge → Full Judge → Regenerate if Fail   ║');
  console.log('═'.repeat(70));
  
  const startTime = Date.now();
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PRE-FLIGHT CHECK - All dependencies required!
  // ═══════════════════════════════════════════════════════════════════════════
  await preflightCheck();
  
  // Initialize LLM
  const llm = new MultiProviderLLM(CONFIG);
  await llm.loadAutoToken();
  llm.displayTokenPoolStatus();
  
  // Check Python NLP Service
  const nlpAnalyzer = llm.getNLPAnalyzer();
  await nlpAnalyzer.checkService();
  
  // Fetch campaign data
  console.log('\n📥 Fetching campaign data...');
  const campaignData = await fetchCampaignData(campaignAddress);
  
  console.log(`\n   📋 Campaign: ${campaignData.title}`);
  console.log(`   🔗 URL: ${campaignData.campaignUrl || campaignData.url}`);
  console.log(`   📝 Description: ${(campaignData.description || campaignData.goal || 'N/A').substring(0, 100)}...`);
  console.log(`   🎨 Style: ${campaignData.style || 'Standard'}`);
  console.log(`   📜 Rules: ${(campaignData.rules || 'Standard rules').substring(0, 50)}...`);
  
  // Fetch competitor submissions
  console.log('\n📥 Fetching competitor submissions...');
  const submissions = await fetchLeaderboard(campaignAddress);
  console.log(`   📊 Found ${submissions?.length || 0} submissions`);
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Deep competitor analysis - MUST succeed!
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🔍 Running Deep Competitor Analysis...');
  const competitorAnalysis = await deepCompetitorContentAnalysis(llm, submissions, campaignData.title, campaignData);
  console.log('   ✅ Competitor analysis completed');
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Multi-query research - MUST succeed!
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🔎 Running Multi-Query Deep Research...');
  const researchData = await multiQueryDeepResearch(llm, campaignData.title, campaignData);
  console.log('   ✅ Research completed');
  
  // Get competitor contents for similarity checking
  const competitorContents = (competitorAnalysis?.competitorContent || []).slice(0, 10);
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NEW v9.8.1 WORKFLOW: Quick judge → Full Judge → Regenerate
  // ═══════════════════════════════════════════════════════════════════════════
  
  const generator = new MultiContentGenerator(llm, CONFIG);
  let generateAttempt = 0;
  let finalContent = null;
  let finalJudgingResult = null;
  let allQuickJudgeResults = [];
  let allFullJudgeResults = [];
  
  const maxAttempts = CONFIG.multiContent.maxRegenerateAttempts || 5;
  
  while (generateAttempt < maxAttempts && !finalContent) {
    generateAttempt++;
    
    console.log('\n' + '═'.repeat(70));
    console.log(`║           🔄 GENERATION CYCLE ${generateAttempt}/${maxAttempts}                           ║`);
    console.log('═'.repeat(70));
    
    // STEP 1: Generate 5 contents
    console.log('\n📝 STEP 1: Generating 5 contents...');
    await generator.generateMultipleContents(campaignData, competitorAnalysis, researchData);
    
    // STEP 2: Quick Judge (Compliance Check) all 5
    console.log('\n⚡ STEP 2: Quick Judge - Compliance Check...');
    const quickJudgeResults = await batchQuickJudge(llm, generator.generatedContents, campaignData);
    allQuickJudgeResults.push(...quickJudgeResults);
    
    // STEP 3: Filter only contents that PASSED compliance
    const passedCompliance = quickJudgeResults.filter(r => r.passed);
    
    if (passedCompliance.length === 0) {
      console.log('\n   ❌ No contents passed compliance check!');
      console.log('   🔄 Regenerating all 5 contents...');
      generator.generatedContents = [];
      await delay(CONFIG.delays.beforeRevision);
      continue;
    }
    
    console.log(`\n   ✅ ${passedCompliance.length} content(s) passed compliance check!`);
    
    // STEP 4: Full Judge for content that passed compliance
    const contentToFullJudge = passedCompliance[0];
    
    console.log(`\n⚖️  STEP 3: Full Double Pass Judge for Content #${contentToFullJudge.index}...`);
    const fullJudgeResult = await runHybridJudging(
      llm,
      contentToFullJudge.content,
      campaignData,
      competitorContents,
      1
    );
    
    allFullJudgeResults.push({
      index: contentToFullJudge.index,
      result: fullJudgeResult
    });
    
    // STEP 5: Check if passed Full Judge
    if (fullJudgeResult.passed) {
      console.log('\n   ✅ FULL JUDGE PASSED!');
      finalContent = contentToFullJudge.content;
      finalJudgingResult = fullJudgeResult;
    } else {
      console.log('\n   ❌ Full Judge FAILED!');
      console.log(`   Issues: ${fullJudgeResult.feedback?.issues?.join(', ') || 'Unknown'}`);
      console.log('   🔄 Regenerating all 5 contents...');
      generator.generatedContents = [];
      await delay(CONFIG.delays.beforeRevision);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FINAL RESULTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  const finalResults = {
    campaign: campaignData.title,
    campaignData: {
      title: campaignData.title,
      description: campaignData.description,
      style: campaignData.style,
      rules: campaignData.rules,
      url: campaignData.campaignUrl || campaignData.url
    },
    success: !!finalContent,
    finalContent: finalContent,
    finalJudgingResult: finalJudgingResult,
    totalGenerateAttempts: generateAttempt,
    quickJudgeResults: allQuickJudgeResults.map(r => ({
      index: r.index,
      passed: r.passed,
      failedChecks: r.failedChecks
    })),
    fullJudgeResults: allFullJudgeResults.map(r => ({
      index: r.index,
      totalScore: r.result?.totalScore,
      passed: r.result?.passed
    })),
    competitorAnalysis: {
      anglesUsed: competitorAnalysis?.anglesUsed?.slice(0, 5),
      saturatedElements: competitorAnalysis?.saturatedElements?.slice(0, 5)
    },
    researchData: {
      keyFacts: researchData?.synthesis?.keyFacts?.slice(0, 5),
      uniqueAngles: researchData?.synthesis?.uniqueAngles?.slice(0, 3)
    },
    metadata: {
      version: '9.8.1-sdk-only',
      model: CONFIG.model.name,
      timestamp: new Date().toISOString(),
      duration: `${duration}s`
    }
  };
  
  // Save to file
  const outputPath = `${CONFIG.outputDir}/rally-v9.8.1-${Date.now()}.json`;
  fs.writeFileSync(outputPath, JSON.stringify(finalResults, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
  
  // Final summary
  console.log('\n' + '═'.repeat(70));
  console.log('║                    FINAL SUMMARY                                ║');
  console.log('═'.repeat(70));
  
  console.log(`\n   📊 Total Generate Attempts: ${generateAttempt}`);
  console.log(`   ⚡ Quick Judge Results: ${allQuickJudgeResults.filter(r => r.passed).length}/${allQuickJudgeResults.length} passed`);
  console.log(`   ⚖️  Full Judge Attempts: ${allFullJudgeResults.length}`);
  console.log(`   ⏱️  Total Duration: ${duration}s`);
  
  if (finalContent && finalJudgingResult) {
    console.log(`\n   ✅ SUCCESS! Content passed all judges.`);
    console.log(`   📊 Final Score: ${finalJudgingResult.totalScore}/136`);
    console.log(`\n   📝 FINAL CONTENT:`);
    console.log('   ' + '─'.repeat(60));
    console.log('   ' + finalContent.split('\n').join('\n   '));
    console.log('   ' + '─'.repeat(60));
  } else {
    console.log('\n   ❌ FAILED! No content passed all judges after maximum attempts.');
  }
  
  return finalResults;
}

// ============================================================================
// ENTRY POINT
// ============================================================================

const campaignArg = process.argv[2] || 'internet-court-v0';
const modeArg = process.argv[3] || 'multi';

if (modeArg === 'single') {
  console.log('\n📌 MODE: Single Content');
  // Single content mode not implemented in this version
  console.log('   ⚠️ Single mode not implemented. Use multi mode.');
  process.exit(1);
} else {
  console.log('\n📌 MODE: Multi-Content (v9.8.1)');
  console.log('   Generate 5 contents → Quick Judge → Full Judge → Select Best');
  mainMultiContent(campaignArg)
    .then(results => {
      if (results && results.success) {
        console.log('\n✅ Multi-Content Workflow completed successfully!');
        process.exit(0);
      } else {
        console.log('\n❌ No content passed all judges!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Workflow failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    });
}
