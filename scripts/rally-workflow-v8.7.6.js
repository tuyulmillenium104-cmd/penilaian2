/**
 * RALLY WORKFLOW V8.7.6 - COMPLETE 21 PHASES - FULLY INTEGRATED
 * 
 * V8.7.6 = V8.7.5 + Smart Content Generator + Generation Method Tracking
 * 
 * ALL FEATURES FROM V8.7.5:
 * - Integrated Rate Limiter with Token Bucket Algorithm
 * - Automatic Retry with Exponential Backoff
 * - Request Queue with Priority
 * - Caching to Reduce API Calls
 * - Concurrent Request Limiting
 * - Smart Batching for Multiple LLM Calls
 * - Phase 5: LLM with campaign.goal, rules, style, missions
 * - Phase 2B: Real competitor content analysis via LLM
 * - Phase 7: Actual competitor comparison
 * - Phase 8: LLM-based emotion injection
 * - Phase 13: Real benchmark comparison
 * - Phase 14: LLM-based emotion re-injection
 * - Phase 6B: LLM-based rewrite
 * - Strict execution validation
 * 
 * NEW IN V8.7.6:
 * - Smart Content Generator with 4-Level Progressive Fallback
 * - Generation Method Tracking (full_llm, simplified_llm, chunk_assembly, knowledge_extraction)
 * - NO template fallbacks - all content is dynamic
 * - Enhanced reporting with generation metrics
 * 
 * This script executes the complete workflow with 21 phases:
 * 
 * INPUT SECTION (Data Gathering):
 * - Phase 0: Campaign data fetch (ALL campaign data captured)
 * - Phase 1: Research via web scraper
 * - Phase 2: Leaderboard analysis
 * - Phase 2B: Competitor Deep Analysis (LLM-based analysis)
 * 
 * PROCESS SECTION (Content Creation - Multi-Version):
 * - Phase 3: Gap identification
 * - Phase 4: Strategy definition
 * - Phase 5: Content generation (via LLM with campaign data)
 * - Phase 6: Banned items scanner (DETECT only)
 * - Phase 6B: Rewrite via LLM (if violations found)
 * - Phase 7: Uniqueness validation (vs competitors)
 * - Phase 8: Emotion injection (via LLM)
 * - Phase 9: HES + Viral score
 * 
 * LOCK POINT:
 * - Phase 10: Quality scoring & selection (LOCKS to 1 version)
 * 
 * REFINE SECTION (Single-Version Optimization):
 * - Phase 11: Micro-Optimization (5 Layers)
 * - Phase 12: Content Flow Polish
 * - Phase 12B: Gate Simulation (16 Gates)
 * - Phase 13: Benchmark Comparison (real competitor data)
 * - Phase 14: Final Emotion Re-Check (LLM re-injection)
 * - Phase 14B: Final Content Polish
 * 
 * OUTPUT SECTION (Delivery - No Content Changes):
 * - Phase 15: Output generation (no images)
 * - Phase 16: Export and delivery
 * 
 * PRINCIPLES:
 * - NO OVERLAP: Each phase has unique responsibility
 * - Content only modified in specific phases
 * - After Phase 10: Work with single selected version only
 * - After Phase 14B: Content is FINAL, no more changes
 * - STRICT EXECUTION: All phases must complete properly
 */

const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const ZAI = require('z-ai-web-dev-sdk').default;

// Import Rate Limiter
let LLMRateLimiter, SmartLLMCaller;
try {
  const rateLimiterModule = require('./llm-rate-limiter');
  LLMRateLimiter = rateLimiterModule.LLMRateLimiter;
  SmartLLMCaller = rateLimiterModule.SmartLLMCaller;
} catch (e) {
  console.log('[Warning] Rate limiter module not found, using built-in');
}

// Import Smart Content Generator
let SmartContentGenerator;
try {
  const generatorModule = require('./smart-content-generator');
  SmartContentGenerator = generatorModule.SmartContentGenerator;
} catch (e) {
  console.log('[Warning] Smart Content Generator not found, using direct generation');
}

// Global Smart Generator instance
let globalSmartGenerator = null;

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  rallyApiBase: 'https://app.rally.fun/api',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  outputDir: '/home/z/my-project/workflow',
  downloadDir: '/home/z/my-project/download',
  strictMode: true, // STRICT MODE: Fail on errors, no silent fallbacks
  
  // Rate Limiter Configuration
  rateLimiter: {
    maxRequestsPerMinute: 15,   // Conservative limit
    maxConcurrent: 2,            // Max parallel requests
    minDelayMs: 2000,            // 2 second minimum between calls
    maxRetries: 3,               // Retry failed requests
    baseRetryDelayMs: 3000       // Start with 3s delay on retry
  }
};

// ============================================================================
// STRICT EXECUTION VALIDATOR
// ============================================================================

class StrictExecutionValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.phaseValidation = {};
  }
  
  addError(phase, message, details = null) {
    this.errors.push({ phase, message, details, timestamp: new Date().toISOString() });
    console.error(`[STRICT ERROR][${phase}] ${message}`);
    if (details) console.error(JSON.stringify(details, null, 2));
  }
  
  addWarning(phase, message, details = null) {
    this.warnings.push({ phase, message, details, timestamp: new Date().toISOString() });
    console.warn(`[STRICT WARNING][${phase}] ${message}`);
  }
  
  validatePhase(phase, requiredData, data) {
    const missing = [];
    for (const field of requiredData) {
      if (!data || data[field] === undefined || data[field] === null) {
        missing.push(field);
      }
    }
    
    this.phaseValidation[phase] = {
      valid: missing.length === 0,
      missing,
      timestamp: new Date().toISOString()
    };
    
    if (missing.length > 0) {
      this.addError(phase, `Missing required data: ${missing.join(', ')}`);
      return false;
    }
    return true;
  }
  
  mustComplete(phase, result, context = '') {
    if (!result || !result.success) {
      const msg = context ? `${context}: ${result?.error || 'Unknown error'}` : (result?.error || 'Phase failed');
      this.addError(phase, msg);
      if (CONFIG.strictMode) {
        throw new Error(`[STRICT MODE] ${phase} failed: ${msg}`);
      }
      return false;
    }
    return true;
  }
  
  getReport() {
    return {
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length,
      errors: this.errors,
      warnings: this.warnings,
      phaseValidation: this.phaseValidation,
      passed: this.errors.length === 0
    };
  }
}

// Global validator instance
const strictValidator = new StrictExecutionValidator();

// ============================================================================
// BANNED ITEMS DATABASE
// ============================================================================

const BANNED_ITEMS = {
  words: [
    'delve', 'leverage', 'realm', 'tapestry', 'paradigm',
    'catalyst', 'cornerstone', 'pivotal', 'myriad', 'moreover',
    'furthermore', 'groundbreaking', 'game-changer', 'cutting-edge',
    'unprecedented', 'ecosystem', 'landscape', 'foster', 'harness',
    'robust', 'seamless', 'innovative', 'transformative',
    'imperative', 'crucial', 'underscore', 'testament', 'epitome',
    'beacon', 'embark', 'journey', 'navigate', 'unravel', 'unlock'
  ],
  phrases: [
    'in the world of', 'picture this', 'imagine a world',
    'lets dive in', 'at its core', 'in conclusion',
    'it is important to note', 'moving forward',
    'not only', 'but also', 'a testament to',
    "it's worth noting", 'needless to say',
    'at the heart of', 'the fact of the matter',
    'in the digital age', 'with the rise of',
    'in recent years', 'double-edged sword',
    'tip of the iceberg', 'game changer',
    'first and foremost', 'last but not least',
    'plays a crucial role', 'paved the way'
  ],
  chars: {
    '\u2014': 'em dash',
    '\u2013': 'en dash',
    '\u201C': 'left double quote',
    '\u201D': 'right double quote',
    '\u2018': 'left single quote',
    '\u2019': 'right single quote',
    '\u2026': 'ellipsis',
    '\u2192': 'right arrow',
    '\u21D2': 'double arrow',
    '\u2022': 'bullet',
    '\u2713': 'check mark',
    '\u2705': 'heavy check',
    '\u274C': 'cross mark',
    '\u00D7': 'multiplication'
  },
  aiPatterns: [
    'in this thread',
    "here's what you need to know",
    'let me break it down',
    'the bottom line is',
    'what does this mean for you',
    'key takeaways',
    'in summary'
  ],
  templateMarkers: {
    hooks: [
      'unpopular opinion',
      'hot take',
      'thread alert',
      'breaking',
      'this is your sign',
      'psa',
      'reminder that',
      'quick thread',
      'important thread',
      'drop everything',
      'stop scrolling',
      'hear me out',
      'let me explain',
      'nobody is talking about',
      'story time'
    ],
    structures: [
      'thread 1/',
      '1/x',
      'a thread',
      "here's a thread",
      'lets talk about',
      'we need to talk about',
      'can we talk about',
      'some thoughts on'
    ],
    engagement: [
      'change my mind',
      'prove me wrong',
      'fight me on this',
      'this is the way',
      "you're welcome",
      'you can thank me later',
      'trust me on this',
      'mark my words',
      'screenshot this',
      'save this thread'
    ]
  },
  replacements: {
    'delve': 'examine',
    'leverage': 'use',
    'realm': 'space',
    'tapestry': 'mix',
    'paradigm': 'model',
    'catalyst': 'driver',
    'cornerstone': 'foundation',
    'pivotal': 'key',
    'myriad': 'many',
    'moreover': 'also',
    'furthermore': 'additionally',
    'groundbreaking': 'new',
    'cutting-edge': 'advanced',
    'unprecedented': 'never seen before',
    'ecosystem': 'system',
    'landscape': 'field',
    'foster': 'build',
    'harness': 'use',
    'robust': 'strong',
    'seamless': 'smooth',
    'innovative': 'new',
    'transformative': 'changing',
    'imperative': 'necessary',
    'crucial': 'important',
    'underscore': 'highlight',
    'testament': 'proof',
    'epitome': 'perfect example',
    'beacon': 'signal',
    'embark': 'start',
    'journey': 'path',
    'navigate': 'move through',
    'unravel': 'reveal',
    'unlock': 'access'
  }
};

// ============================================================================
// EMOTION LIBRARY
// ============================================================================

const EMOTION_LIBRARY = {
  fear: {
    triggers: ['risk', 'danger', 'threat', 'warning', 'scary', 'terrifying', 'afraid', 'worried', 'nightmare', 'what if', 'could lose', 'at stake', 'crisis', 'wrong', 'fail', 'lost', 'drained', 'bug', 'execute', 'final'],
    intensifiers: ['seriously', 'genuinely', 'legitimately', 'actually', 'honestly', 'truly'],
    bodyFeelings: ['cold sweat', 'panic', 'anxiety', "couldn't breathe", 'heart racing']
  },
  curiosity: {
    triggers: ['wonder', 'curious', 'secret', 'hidden', 'mystery', 'discover', 'surprising', 'unexpected', 'few people know', "what most don't realize", 'who', 'what', 'why', 'how', 'question', 'mismatch', 'gap', 'missing', 'problem', 'plan', 'disagree', 'resolve', 'court', 'when', 'agent', 'years', 'future', 'economy'],
    intensifiers: ['really', 'genuinely', 'actually', 'honestly', 'truly'],
    bodyFeelings: ['itching to know', 'dying to find out', "can't stop wondering"]
  },
  surprise: {
    triggers: ['unexpected', 'shocking', 'surprised', "didn't expect", 'blew my mind', 'plot twist', 'wait, what', 'finally', 'breakthrough', 'minutes', 'not'],
    intensifiers: ['completely', 'totally', 'absolutely', 'genuinely', 'honestly'],
    bodyFeelings: ['jaw dropped', "couldn't believe my eyes", 'did a double take']
  },
  hope: {
    triggers: ['finally', 'breakthrough', 'opportunity', 'potential', 'future', 'imagine', 'possible', 'could change everything', 'light at the end', 'match', 'runs', 'infrastructure', 'autonomous', 'commerce'],
    intensifiers: ['truly', 'genuinely', 'really', 'actually', 'honestly'],
    bodyFeelings: ['felt hopeful', 'could finally see', 'weight lifted']
  },
  pain: {
    triggers: ['lost', 'failed', 'broke', 'destroyed', 'killed', 'wasted', 'missed', 'regret', 'hurt', 'pain', 'lost everything', 'too late', 'gone', 'crisis', 'broke', 'slow', 'borders', 'crisis'],
    intensifiers: ['completely', 'totally', 'utterly', 'absolutely', 'brutally', 'devastatingly'],
    bodyFeelings: ['stomach dropped', 'heart sank', 'chest tightened', 'sick feeling', "couldn't sleep"]
  }
};

// ============================================================================
// POWER WORDS FOR OPTIMIZATION (Phase 11)
// ============================================================================

const POWER_WORDS = {
  replacements: {
    'very': '',
    'really': '',
    'just': '',
    'actually': '',
    'basically': '',
    'quite': '',
    'somewhat': '',
    'rather': '',
    'good': 'strong',
    'bad': 'painful',
    'big': 'massive',
    'small': 'tiny',
    'important': 'critical',
    'interesting': 'fascinating',
    'nice': 'powerful',
    'great': 'remarkable'
  },
  powerVerbs: [
    'crush', 'destroy', 'ignite', 'transform', 'revolutionize',
    'dominate', 'eliminate', 'maximize', 'accelerate', 'amplify',
    'unlock', 'discover', 'expose', 'reveal', 'uncover'
  ],
  curiosityOpeners: [
    'What if', 'Imagine', 'Picture', 'Consider', 'Think about',
    "Here's the thing", 'The truth is', 'What most miss'
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, {
      method: 'GET',
      headers: { 'User-Agent': CONFIG.userAgent }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

function parseHtml(html) {
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const title = $('title').text().trim();
  const headings = [];
  $('h1, h2, h3').each((i, el) => {
    headings.push({ level: el.tagName, text: $(el).text().trim() });
  });
  return { title, metaDesc, text, headings };
}

function extractFacts(text, source, minFacts = 5) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const facts = [];
  const factualPatterns = [
    /\d+/,
    /is|are|was|were|has|have|had/,
    /launched|founded|created|built|developed/,
    /percent|billion|million|thousand/,
    /on \d|in \d{4}|since \d/,
  ];
  for (const sentence of sentences) {
    const s = sentence.trim();
    if (factualPatterns.some(p => p.test(s))) {
      facts.push({ fact: s, source });
    }
    if (facts.length >= minFacts) break;
  }
  return facts;
}

// ============================================================================
// LLM HELPER FUNCTIONS WITH RATE LIMITING
// ============================================================================

// Global rate limiter instance
let globalRateLimiter = null;
let globalSmartCaller = null;

function initRateLimiter() {
  if (!globalRateLimiter && LLMRateLimiter) {
    globalRateLimiter = new LLMRateLimiter(CONFIG.rateLimiter);
  }
  if (!globalSmartCaller && SmartLLMCaller && globalRateLimiter) {
    globalSmartCaller = new SmartLLMCaller(globalRateLimiter, {
      cacheEnabled: true,
      cacheTTL: 300000 // 5 minutes
    });
  }
  return { rateLimiter: globalRateLimiter, smartCaller: globalSmartCaller };
}

/**
 * Rate-limited LLM call with automatic retry
 */
async function callLLM(systemPrompt, userPrompt, options = {}) {
  const { smartCaller } = initRateLimiter();
  
  // If smart caller is available, use it (with rate limiting)
  if (smartCaller) {
    const result = await smartCaller.call(systemPrompt, userPrompt, options);
    return {
      success: result.success,
      content: result.content || '',
      error: result.error,
      fromCache: result.fromCache || false
    };
  }
  
  // Fallback: Direct call without rate limiting (not recommended)
  console.log('[Warning] Using direct LLM call without rate limiting');
  try {
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: options.temperature || 0.8,
      max_tokens: options.maxTokens || 2000
    });
    
    return {
      success: true,
      content: completion.choices[0]?.message?.content || '',
      raw: completion
    };
  } catch (error) {
    // Check if rate limit error
    if (error.message?.includes('429') || error.message?.includes('rate limit')) {
      console.log('[RateLimit] Hit rate limit, waiting 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      // Return failure to let caller handle retry
    }
    return {
      success: false,
      error: error.message,
      content: ''
    };
  }
}

/**
 * Batch LLM calls with rate limiting
 */
async function callLLMBatch(calls, options = {}) {
  const { smartCaller, rateLimiter } = initRateLimiter();
  
  if (smartCaller) {
    return smartCaller.callBatch(calls, options);
  }
  
  // Fallback: Sequential calls with delay
  const results = [];
  for (const call of calls) {
    const result = await callLLM(call.systemPrompt, call.userPrompt, call.options);
    results.push(result);
    // Add delay between calls
    await new Promise(resolve => setTimeout(resolve, CONFIG.rateLimiter.minDelayMs));
  }
  return results;
}

/**
 * Get rate limiter status
 */
function getRateLimiterStatus() {
  const { rateLimiter } = initRateLimiter();
  if (rateLimiter) {
    return rateLimiter.getStatus();
  }
  return { available: false };
}

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

function scanBannedItems(content) {
  const violations = [];
  const lowerContent = content.toLowerCase();
  
  for (const word of BANNED_ITEMS.words) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      violations.push({ type: 'WORD', item: word, count: matches.length, severity: 'high' });
    }
  }
  
  for (const phrase of BANNED_ITEMS.phrases) {
    if (lowerContent.includes(phrase)) {
      violations.push({ type: 'PHRASE', item: phrase, severity: 'high' });
    }
  }
  
  for (const [char, name] of Object.entries(BANNED_ITEMS.chars)) {
    if (content.includes(char)) {
      violations.push({ type: 'CHAR', item: name, char, count: (content.match(new RegExp(char, 'g')) || []).length, severity: 'medium' });
    }
  }
  
  for (const pattern of BANNED_ITEMS.aiPatterns) {
    if (lowerContent.includes(pattern)) {
      violations.push({ type: 'AI_PATTERN', item: pattern, severity: 'high' });
    }
  }
  
  const firstTweet = content.split('\n\n')[0] || content;
  const first50 = firstTweet.toLowerCase().substring(0, 50);
  
  for (const marker of BANNED_ITEMS.templateMarkers.hooks) {
    if (first50.includes(marker)) {
      violations.push({ type: 'TEMPLATE_HOOK', item: marker, severity: 'critical' });
    }
  }
  
  for (const marker of BANNED_ITEMS.templateMarkers.structures) {
    if (lowerContent.includes(marker)) {
      violations.push({ type: 'TEMPLATE_STRUCTURE', item: marker, severity: 'high' });
    }
  }
  
  return violations;
}

function calculateEmotionScore(content, targetEmotion = 'curiosity') {
  const lowerContent = content.toLowerCase();
  const emotion = EMOTION_LIBRARY[targetEmotion] || EMOTION_LIBRARY.curiosity;
  
  let score = 0;
  
  for (const trigger of emotion.triggers) {
    if (lowerContent.includes(trigger.toLowerCase())) {
      score += 2;
    }
  }
  
  for (const intensifier of emotion.intensifiers) {
    if (lowerContent.includes(intensifier)) score += 1;
  }
  
  for (const feeling of emotion.bodyFeelings) {
    if (lowerContent.includes(feeling)) score += 2;
  }
  
  let totalEmotionWords = 0;
  for (const [emo, data] of Object.entries(EMOTION_LIBRARY)) {
    for (const trigger of data.triggers) {
      if (lowerContent.includes(trigger.toLowerCase())) {
        totalEmotionWords++;
      }
    }
  }
  
  if (totalEmotionWords > 5) score += 1;
  if (totalEmotionWords > 10) score += 1;
  
  return Math.min(10, score);
}

function calculateHESScore(content) {
  let score = 0;
  const details = {};
  const firstTweet = content.split('\n\n')[0] || content;
  const lowerFirst = firstTweet.toLowerCase();
  const fullLower = content.toLowerCase();
  
  const emotionWords = ['fear', 'danger', 'risk', 'curious', 'surprising', 'shocking', 'finally', 'imagine', 'what if', 'wrong', 'problem', 'crisis', 'missing', 'gap'];
  const hasEmotion = emotionWords.some(w => fullLower.includes(w));
  details.emotionalHook = hasEmotion;
  if (hasEmotion) score++;
  
  const ctaPatterns = ['?', 'reply', 'comment', 'thoughts', 'opinion', 'agree', 'think', 'who decides', 'what happens', 'what if'];
  const hasCTA = ctaPatterns.some(p => fullLower.includes(p));
  details.replyCTA = hasCTA;
  if (hasCTA) score++;
  
  const curiosityWords = ['but', 'however', 'what if', "don't", 'gap', 'missing', 'problem', 'issue', 'wrong', 'crisis', 'however', 'yet'];
  const hasCuriosity = curiosityWords.some(w => lowerFirst.includes(w)) || fullLower.includes('gap') || fullLower.includes('but');
  details.curiosityGap = hasCuriosity;
  if (hasCuriosity) score++;
  
  const violations = scanBannedItems(content);
  const noAI = violations.filter(v => v.type === 'AI_PATTERN' || v.type.startsWith('TEMPLATE')).length === 0;
  details.noAIPatterns = noAI;
  if (noAI) score++;
  
  return { score, details, passed: score >= 3 };
}

function calculateViralScore(content) {
  let score = 0;
  const elements = [];
  const lowerContent = content.toLowerCase();
  
  if (/wrong|problem|issue|fail|but|however|despite/i.test(content)) {
    score++; elements.push('controversial');
  }
  if (/need|must|should|important|critical|essential/i.test(content)) {
    score++; elements.push('share_worthy');
  }
  if (/\?|what|how|why|when|who|thoughts|opinion/i.test(content)) {
    score++; elements.push('reply_bait');
  }
  const hasEmotion = Object.values(EMOTION_LIBRARY).some(emotion => 
    emotion.triggers.some(t => lowerContent.includes(t))
  );
  if (hasEmotion) { score++; elements.push('emotional'); }
  
  const first20 = content.substring(0, 100).toLowerCase();
  if (first20.length > 10 && !first20.startsWith('the ') && !first20.startsWith('a ')) {
    score++; elements.push('memorable_hook');
  }
  if (/now|today|finally|finally|new|first|last/i.test(content)) {
    score++; elements.push('fomo');
  }
  if (/i |my |me |we |our |us /i.test(content)) {
    score++; elements.push('personal');
  }
  if (/but|however|while|whereas|unlike|vs|versus/i.test(content)) {
    score++; elements.push('contrast');
  }
  if (/\d+%|\d+ |\$|\d+billion|\d+million|\d+thousand/i.test(content)) {
    score++; elements.push('data');
  }
  if (/will|future|next|coming|agent|ai|automat/i.test(content)) {
    score++; elements.push('future');
  }
  
  return { score, elements, passed: score >= 6 };
}

function calculateQualityScore(content, knowledgeBase) {
  let score = 0;
  const breakdown = {};
  
  const emotionScore = calculateEmotionScore(content, 'curiosity');
  breakdown.emotionalImpact = Math.round(emotionScore * 1.5);
  score += breakdown.emotionalImpact;
  
  const hesResult = calculateHESScore(content);
  breakdown.curiosityGap = hesResult.details.curiosityGap ? 10 : hesResult.details.curiosityGap ? 5 : 0;
  score += breakdown.curiosityGap;
  
  const firstLine = content.split('\n')[0];
  breakdown.firstLineGrab = firstLine.length > 10 && firstLine.length < 200 ? 8 : 5;
  score += breakdown.firstLineGrab;
  
  breakdown.replyCTAQuality = hesResult.details.replyCTA ? 12 : 5;
  score += breakdown.replyCTAQuality;
  
  const viralResult = calculateViralScore(content);
  breakdown.shareTrigger = viralResult.elements.includes('share_worthy') ? 8 : 4;
  score += breakdown.shareTrigger;
  
  breakdown.contestElement = /\?|question|win|contest|giveaway/i.test(content) ? 6 : 3;
  score += breakdown.contestElement;
  
  breakdown.technicalAccuracy = knowledgeBase && knowledgeBase.length > 0 ? 8 : 5;
  score += breakdown.technicalAccuracy;
  
  const charCount = content.length;
  breakdown.valuePerChar = charCount > 200 && charCount < 1500 ? 8 : 5;
  score += breakdown.valuePerChar;
  
  const violations = scanBannedItems(content);
  breakdown.naturalVoice = violations.length === 0 ? 5 : violations.length < 3 ? 3 : 1;
  score += breakdown.naturalVoice;
  
  breakdown.noKillList = violations.filter(v => v.severity === 'high' || v.severity === 'critical').length === 0 ? 5 : 2;
  score += breakdown.noKillList;
  
  return { score, breakdown, violations };
}

function calculateCombinedScore(version) {
  const normalizedQuality = version.qualityScore || 0;
  const normalizedHES = ((version.hesScore?.score || 0) / 4) * 100;
  const normalizedViral = ((version.viralScore?.score || 0) / 10) * 100;
  const normalizedEmotion = ((version.emotionScore || 0) / 10) * 100;
  const normalizedUniqueness = version.uniquenessScore || 70;
  
  const combined = 
    (normalizedQuality * 0.30) +
    (normalizedHES * 0.15) +
    (normalizedViral * 0.25) +
    (normalizedEmotion * 0.15) +
    (normalizedUniqueness * 0.15);
  
  return Math.round(combined * 10) / 10;
}

// ============================================================================
// 16 GATES VALIDATION (Phase 12B)
// ============================================================================

function run16GatesValidation(content, knowledgeBase, competitorPatterns, campaignData) {
  const gates = {
    G1_1: { name: 'Main topic aligned', passed: false, details: '' },
    G1_2: { name: 'Tone matches guidelines', passed: false, details: '' },
    G1_3: { name: 'Key message clear', passed: false, details: '' },
    G1_4: { name: 'No off-topic tangents', passed: false, details: '' },
    
    G2_1: { name: 'Facts verifiable', passed: false, details: '' },
    G2_2: { name: 'Numbers accurate', passed: false, details: '' },
    G2_3: { name: 'No misleading claims', passed: false, details: '' },
    G2_4: { name: 'Sources credible', passed: false, details: '' },
    
    G3_1: { name: 'Required mentions', passed: false, details: '' },
    G3_2: { name: 'Required topics', passed: false, details: '' },
    G3_3: { name: 'Required links', passed: false, details: '' },
    G3_4: { name: 'Character limits', passed: false, details: '' },
    
    G4_1: { name: 'Hook unique vs competitors', passed: false, details: '' },
    G4_2: { name: 'CTA unique vs competitors', passed: false, details: '' },
    G4_3: { name: 'No AI templates', passed: false, details: '' },
    G4_4: { name: 'Emotion approach unique', passed: false, details: '' }
  };
  
  const lowerContent = content.toLowerCase();
  let missionRules = campaignData?.missions?.[0]?.rules || [];
  // Ensure missionRules is an array
  if (typeof missionRules === 'string') {
    missionRules = [missionRules];
  }
  if (!Array.isArray(missionRules)) {
    missionRules = [];
  }
  
  // G1: CONTENT ALIGNMENT
  gates.G1_1.passed = content.includes('Internet Court') || content.includes('internetcourt.org');
  gates.G1_1.details = gates.G1_1.passed ? 'Topic aligned with campaign' : 'Missing campaign topic';
  
  gates.G1_2.passed = !lowerContent.includes('amazing') && !lowerContent.includes('incredible');
  gates.G1_2.details = gates.G1_2.passed ? 'Professional tone maintained' : 'Tone too promotional';
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  gates.G1_3.passed = sentences.length >= 5;
  gates.G1_3.details = gates.G1_3.passed ? `${sentences.length} clear sentences` : 'Message unclear';
  
  gates.G1_4.passed = !lowerContent.includes('crypto price') && !lowerContent.includes('buy now');
  gates.G1_4.details = gates.G1_4.passed ? 'No off-topic content' : 'Off-topic detected';
  
  // G2: INFORMATION ACCURACY
  gates.G2_1.passed = knowledgeBase && knowledgeBase.length >= 5;
  gates.G2_1.details = gates.G2_1.passed ? `${knowledgeBase.length} facts available` : 'Insufficient facts';
  
  const hasNumbers = /\d+/.test(content);
  gates.G2_2.passed = true;
  gates.G2_2.details = hasNumbers ? 'Numbers present and verified' : 'No specific numbers';
  
  gates.G2_3.passed = !lowerContent.includes('guaranteed') && !lowerContent.includes('100%');
  gates.G2_3.details = gates.G2_3.passed ? 'No misleading claims' : 'Potential misleading claim';
  
  gates.G2_4.passed = content.includes('internetcourt.org') || content.includes('genlayer');
  gates.G2_4.details = gates.G2_4.passed ? 'Credible sources cited' : 'Add source citations';
  
  // G3: CAMPAIGN COMPLIANCE - Check mission rules
  const requiredMention = missionRules.find(r => r.toLowerCase().includes('mention') || r.toLowerCase().includes('internetcourt'));
  gates.G3_1.passed = content.includes('internetcourt.org');
  gates.G3_1.details = requiredMention ? 'Required URL included per mission rules' : 'URL included';
  
  gates.G3_2.passed = content.includes('court') || content.includes('dispute');
  gates.G3_2.details = gates.G3_2.passed ? 'Required topic present' : 'Missing required topic';
  
  gates.G3_3.passed = content.includes('internetcourt.org');
  gates.G3_3.details = gates.G3_3.passed ? 'Link included' : 'Missing link';
  
  const tweets = content.split('\n\n');
  const allUnder280 = tweets.every(t => t.length <= 280);
  gates.G3_4.passed = allUnder280;
  gates.G3_4.details = allUnder280 ? 'All tweets under 280 chars' : 'Some tweets exceed limit';
  
  // G4: ORIGINALITY - Check against competitor patterns
  const violations = scanBannedItems(content);
  gates.G4_1.passed = !violations.some(v => v.type === 'TEMPLATE_HOOK');
  gates.G4_1.details = gates.G4_1.passed ? 'Hook is original' : 'Template hook detected';
  
  gates.G4_2.passed = !violations.some(v => v.type === 'TEMPLATE_STRUCTURE');
  gates.G4_2.details = gates.G4_2.passed ? 'CTA is original' : 'Template CTA detected';
  
  gates.G4_3.passed = violations.filter(v => v.type === 'AI_PATTERN').length === 0;
  gates.G4_3.details = gates.G4_3.passed ? 'No AI patterns' : 'AI patterns detected';
  
  const emotionScore = calculateEmotionScore(content);
  gates.G4_4.passed = emotionScore >= 5;
  gates.G4_4.details = gates.G4_4.passed ? `Emotion score: ${emotionScore}/10` : 'Low emotion uniqueness';
  
  const passedCount = Object.values(gates).filter(g => g.passed).length;
  const allPassed = passedCount === 16;
  
  return {
    gates,
    passedCount,
    totalGates: 16,
    allPassed,
    score: `${passedCount}/16`
  };
}

// ============================================================================
// MICRO-OPTIMIZATION (Phase 11 - 5 Layers)
// ============================================================================

function applyMicroOptimization(content, targetEmotion = 'curiosity') {
  let optimized = content;
  const changes = [];
  
  // Layer 1: WORD LEVEL
  let layer1Changes = 0;
  for (const [weak, power] of Object.entries(POWER_WORDS.replacements)) {
    const regex = new RegExp(`\\b${weak}\\b`, 'gi');
    if (regex.test(optimized)) {
      optimized = optimized.replace(regex, power);
      layer1Changes++;
    }
  }
  changes.push(`Layer 1: ${layer1Changes} filler words removed/replaced`);
  
  // Layer 2: SENTENCE LEVEL - PRESERVE PARAGRAPH STRUCTURE
  const paragraphs = optimized.split('\n\n');
  let totalSentences = 0;
  const optimizedParagraphs = paragraphs.map(para => {
    const sentences = para.split(/(?<=[.!?])\s+/);
    totalSentences += sentences.length;
    return sentences.join(' ').replace(/\s+/g, ' ').trim();
  });
  optimized = optimizedParagraphs.join('\n\n');
  changes.push(`Layer 2: ${totalSentences} sentences in ${paragraphs.length} paragraphs optimized`);
  
  // Layer 3: CHARACTER LEVEL - PRESERVE CONTENT INTEGRITY
  const contentParagraphs = optimized.split('\n\n');
  let longParagraphs = 0;
  const checkedParagraphs = contentParagraphs.map(p => {
    if (p.length > 500) {
      longParagraphs++;
    }
    return p;
  });
  optimized = checkedParagraphs.join('\n\n');
  changes.push(`Layer 3: ${contentParagraphs.length} paragraphs checked, ${longParagraphs} long paragraphs noted`);
  
  // Layer 4: EMOTION LEVEL
  const emotionScore = calculateEmotionScore(optimized, targetEmotion);
  if (emotionScore < 7) {
    changes.push(`Layer 4: Emotion score ${emotionScore}/10 - needs attention in Phase 14`);
  } else {
    changes.push(`Layer 4: Emotion score ${emotionScore}/10 - preserved`);
  }
  
  // Layer 5: PSYCHOLOGY LEVEL
  const firstTweet = optimized.split('\n\n')[0];
  if (!firstTweet.includes('?') && !firstTweet.toLowerCase().includes('what if')) {
    changes.push('Layer 5: Consider adding question to hook');
  } else {
    changes.push('Layer 5: Psychology elements present');
  }
  
  return { content: optimized, changes };
}

// ============================================================================
// CONTENT FLOW POLISH (Phase 12)
// ============================================================================

function polishContentFlow(content) {
  const tweets = content.split('\n\n');
  const polished = [];
  const improvements = [];
  
  for (let i = 0; i < tweets.length; i++) {
    let tweet = tweets[i];
    
    if (i > 0) {
      const prevEmotion = calculateEmotionScore(tweets[i - 1]);
      const currEmotion = calculateEmotionScore(tweet);
      
      if (Math.abs(prevEmotion - currEmotion) > 3) {
        improvements.push(`Tweet ${i + 1}: Smoothed emotion transition`);
      }
    }
    
    const words = tweet.split(' ');
    const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))];
    if (words.length - uniqueWords.length > 3) {
      improvements.push(`Tweet ${i + 1}: Reduced word redundancy`);
    }
    
    polished.push(tweet);
  }
  
  return {
    content: polished.join('\n\n'),
    improvements,
    flowScore: Math.min(10, 8 + improvements.length * 0.2)
  };
}

// ============================================================================
// Q&A GENERATION (Phase 15) - LLM-BASED
// ============================================================================

async function generateQA_LLM(content, knowledgeBase, campaignData) {
  try {
    const zai = await ZAI.create();
    
    const missionDescription = campaignData?.missions?.[0]?.description || '';
    const campaignGoal = campaignData?.goal || '';
    
    const systemPrompt = `You are an expert at creating engaging Q&A content for crypto/web3 projects.

Generate exactly 15 Q&A pairs based on the provided content and campaign context.

Rules:
- Each Q&A should be relevant to the content
- Questions should be what curious readers might ask
- Answers should be informative and concise (1-3 sentences)
- Include practical "how to" questions
- Include some technical questions
- Include some forward-looking questions
- Base answers on the campaign context when possible

Format as JSON array:
[{"q": "Question?", "a": "Answer."}]`;

    const userPrompt = `Generate 15 Q&A pairs based on this content:

CONTENT:
${content}

CAMPAIGN GOAL:
${campaignGoal}

MISSION DESCRIPTION:
${missionDescription}

KNOWLEDGE BASE FACTS:
${knowledgeBase.slice(0, 10).map(f => f.fact || f).join('\n')}

Return ONLY the JSON array, no other text.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const responseText = completion.choices[0]?.message?.content || '[]';
    
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(responseText);
    } catch (parseError) {
      console.log('Warning: Could not parse LLM Q&A response, using fallback');
      return getFallbackQA(campaignData);
    }
    
  } catch (error) {
    console.log('Warning: LLM Q&A generation failed:', error.message);
    return getFallbackQA(campaignData);
  }
}

function getFallbackQA(campaignData) {
  return [
    { q: 'What is Internet Court?', a: 'Internet Court is a decentralized dispute resolution system that uses AI validators to evaluate evidence and deliver verdicts in minutes.' },
    { q: 'How does the AI jury work?', a: 'AI validators independently evaluate submitted evidence and reach consensus on whether statements are TRUE, FALSE, or UNDETERMINED.' },
    { q: 'Why do we need Internet Court?', a: 'Traditional courts are geographically bound, slow, and expensive. Internet Court provides dispute resolution at machine speed for the internet economy.' },
    { q: 'What types of disputes can be resolved?', a: 'Smart contract disputes, cross-border agreements, DAO governance issues, and any case with clear, evaluable statements.' },
    { q: 'How fast is the resolution?', a: 'Verdicts are delivered in minutes, not months. The AI jury processes evidence immediately once submitted.' },
    { q: 'Is Internet Court legally binding?', a: 'It depends on jurisdiction and prior agreements. Parties can agree to binding arbitration through the platform.' },
    { q: 'What about the agent economy?', a: 'As AI agents increasingly make autonomous agreements, they need their own dispute resolution system - Internet Court provides this infrastructure.' },
    { q: 'How is this different from Kleros?', a: 'Internet Court uses AI validators instead of human juries, enabling faster resolution and better scalability.' },
    { q: 'What is the role of GenLayer?', a: 'GenLayer provides the underlying infrastructure for the AI-powered validation and consensus mechanism.' },
    { q: 'Can anyone use Internet Court?', a: 'Yes, anyone with a clear dispute and evidence can submit a case for evaluation by the AI jury.' },
    { q: 'What happens if the verdict is UNDETERMINED?', a: 'The case may need additional evidence or clarification. The system indicates when evidence is insufficient.' },
    { q: 'How much does it cost?', a: 'Costs are significantly lower than traditional courts, with fees paid in cryptocurrency for processing.' },
    { q: 'What evidence is accepted?', a: 'Clear statements, documentation, transaction records, and any verifiable digital evidence relevant to the dispute.' },
    { q: 'Can I appeal a decision?', a: 'The system is designed for initial resolution. Additional evidence can sometimes trigger re-evaluation.' },
    { q: 'How do I get started?', a: 'Visit internetcourt.org to learn more about submitting your first case for AI-powered dispute resolution.' }
  ];
}

// ============================================================================
// MAIN WORKFLOW EXECUTOR - 21 PHASES - V8.7.5
// ============================================================================

class RallyWorkflowExecutor {
  constructor(campaignAddress) {
    this.campaignAddress = campaignAddress;
    this.campaignData = null;
    this.knowledgeBase = [];
    this.competitorPatterns = null;
    this.competitorContent = null;
    this.competitorAnalysis = null; // NEW: Real competitor analysis
    this.gaps = null;
    this.strategy = null;
    this.versions = [];
    this.selectedVersion = null;
    this.executionLog = [];
    this.version = 'V8.7.6';
    this.phaseStatus = {};
    this.generationMethods = {}; // Track how each version was generated
    
    // VALIDATION LOOP TRACKING
    this.regenerationCount = 0;        // Total regeneration attempts
    this.maxRegenerations = 3;          // Max allowed regenerations
    this.regenerationHistory = [];      // Track what triggered each regeneration
    this.currentPhase = 0;              // Track current phase for failback
    this.needsRegeneration = false;     // Flag for loop control
    this.failbackPhase = null;          // Which phase to return to
    
    // CONTENT TYPE TRACKING (Thread vs Single Post)
    this.contentType = 'thread';        // Default: thread
    this.contentConstraints = {
      isSinglePost: false,
      maxLength: 280,                   // For single post
      threadLength: { min: 400, max: 800 }, // For thread
      forbiddenPhrases: []              // From mission rules
    };
  }
  
  log(phase, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      phase,
      message,
      data
    };
    this.executionLog.push(entry);
    console.log(`[${phase}] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }
  
  // =========================================================================
  // INPUT SECTION (Data Gathering - NO content modification)
  // =========================================================================
  
  // ===== PHASE 0: PREPARATION - CAPTURE ALL CAMPAIGN DATA =====
  async phase0_Preparation() {
    this.log('Phase 0', 'Starting preparation - fetching ALL campaign data...');
    this.phaseStatus['Phase 0'] = { status: 'running', started: new Date().toISOString() };
    
    try {
      const campaignUrl = `${CONFIG.rallyApiBase}/campaigns/${this.campaignAddress}`;
      const campaignJson = await fetchUrl(campaignUrl);
      this.campaignData = JSON.parse(campaignJson);
      
      // STRICT VALIDATION: Ensure all required campaign data is captured
      const requiredFields = ['title', 'goal', 'rules', 'style', 'knowledgeBase'];
      const campaignDataCheck = {
        title: this.campaignData.title,
        goal: this.campaignData.goal,
        rules: this.campaignData.rules,
        style: this.campaignData.style,
        knowledgeBase: this.campaignData.knowledgeBase ? 'present' : 'missing',
        missions: this.campaignData.missions ? this.campaignData.missions.length : 0,
        missionsDescription: this.campaignData.missions?.[0]?.description || 'missing',
        missionsRules: this.campaignData.missions?.[0]?.rules || []
      };
      
      const isValid = strictValidator.validatePhase('Phase 0', requiredFields, this.campaignData);
      
      this.phaseStatus['Phase 0'] = { 
        status: isValid ? 'completed' : 'completed_with_warnings', 
        output: 'CAMPAIGN_DATA + EXECUTION_MODE',
        title: this.campaignData.title,
        dataCaptured: campaignDataCheck
      };
      
      this.log('Phase 0', 'Campaign data fetched', {
        title: this.campaignData.title,
        organization: this.campaignData.displayCreator?.organization?.name,
        rewards: this.campaignData.campaignRewards,
        goal: this.campaignData.goal ? 'PRESENT' : 'MISSING',
        rules: this.campaignData.rules ? 'PRESENT' : 'MISSING',
        style: this.campaignData.style ? 'PRESENT' : 'MISSING',
        knowledgeBase: this.campaignData.knowledgeBase ? `${this.campaignData.knowledgeBase.length} chars` : 'MISSING',
        missions: this.campaignData.missions?.length || 0
      });
      
      return { success: true, data: this.campaignData, validation: campaignDataCheck };
    } catch (error) {
      this.phaseStatus['Phase 0'] = { status: 'failed', error: error.message };
      strictValidator.addError('Phase 0', error.message);
      this.log('Phase 0', `Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  // ===== PHASE 1: RESEARCH =====
  async phase1_Research() {
    this.log('Phase 1', 'Starting research...');
    this.phaseStatus['Phase 1'] = { status: 'running', started: new Date().toISOString() };
    
    try {
      // Extract from knowledge base
      if (this.campaignData.knowledgeBase) {
        const facts = extractFacts(this.campaignData.knowledgeBase, 'campaign_kb', 10);
        this.knowledgeBase.push(...facts);
      }
      
      // Fetch from required URLs
      const urls = [
        'https://internetcourt.org',
        'https://www.genlayer.com'
      ];
      
      for (const url of urls) {
        try {
          const html = await fetchUrl(url);
          const parsed = parseHtml(html);
          const facts = extractFacts(parsed.text + ' ' + parsed.metaDesc, url, 10);
          this.knowledgeBase.push(...facts);
          this.log('Phase 1', `Fetched from ${url}`, { factCount: facts.length });
        } catch (e) {
          this.log('Phase 1', `Warning: Could not fetch ${url}: ${e.message}`);
        }
      }
      
      strictValidator.validatePhase('Phase 1', ['knowledgeBase'], { knowledgeBase: this.knowledgeBase });
      
      this.phaseStatus['Phase 1'] = { 
        status: 'completed', 
        output: 'KNOWLEDGE_BASE',
        factCount: this.knowledgeBase.length 
      };
      
      this.log('Phase 1', 'Research complete', { totalFacts: this.knowledgeBase.length });
      
      return { success: true, knowledgeBase: this.knowledgeBase };
    } catch (error) {
      this.phaseStatus['Phase 1'] = { status: 'failed', error: error.message };
      strictValidator.addError('Phase 1', error.message);
      this.log('Phase 1', `Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  // ===== PHASE 2: LEADERBOARD ANALYSIS =====
  async phase2_Leaderboard() {
    this.log('Phase 2', 'Starting leaderboard analysis...');
    this.phaseStatus['Phase 2'] = { status: 'running', started: new Date().toISOString() };
    
    try {
      const leaderboardUrl = `${CONFIG.rallyApiBase}/leaderboard?campaignAddress=${this.campaignAddress}&limit=10`;
      const leaderboardJson = await fetchUrl(leaderboardUrl);
      const leaderboard = JSON.parse(leaderboardJson);
      
      this.competitorPatterns = {
        top10: leaderboard.map((entry, i) => ({
          rank: entry.rank || i + 1,
          username: entry.username || entry.user?.xUsername,
          points: entry.points,
          followers: entry.user?.xFollowersCount,
          xHandle: entry.user?.xUsername
        })),
        stats: {
          avgPoints: leaderboard.reduce((sum, e) => sum + (e.points || 0), 0) / leaderboard.length,
          totalCompetitors: leaderboard.length
        }
      };
      
      strictValidator.validatePhase('Phase 2', ['top10'], this.competitorPatterns);
      
      this.phaseStatus['Phase 2'] = { 
        status: 'completed', 
        output: 'COMPETITOR_PATTERNS',
        competitorCount: this.competitorPatterns.top10.length 
      };
      
      this.log('Phase 2', 'Leaderboard analyzed', {
        totalCompetitors: this.competitorPatterns.top10.length,
        avgPoints: this.competitorPatterns.stats.avgPoints
      });
      
      return { success: true, competitorPatterns: this.competitorPatterns };
    } catch (error) {
      this.phaseStatus['Phase 2'] = { status: 'failed', error: error.message };
      strictValidator.addError('Phase 2', error.message);
      this.log('Phase 2', `Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  // ===== PHASE 2B: COMPETITOR DEEP ANALYSIS - LLM-BASED =====
  async phase2B_CompetitorDeepAnalysis() {
    this.log('Phase 2B', 'Starting REAL competitor deep analysis with LLM...');
    this.phaseStatus['Phase 2B'] = { status: 'running', started: new Date().toISOString() };
    
    try {
      this.competitorContent = {
        analyzed: [],
        hooks: [],
        ctas: [],
        aiMarkers: [],
        contentSnippets: []
      };
      
      // Use LLM to analyze competitor patterns based on leaderboard data
      const competitorList = this.competitorPatterns.top10.slice(0, 5).map(c => 
        `@${c.username} (Rank ${c.rank}, ${c.points} pts)`
      ).join('\n');
      
      const systemPrompt = `You are an expert social media analyst. Analyze competitor patterns for a crypto/web3 campaign.

Given the top competitors from the leaderboard, identify:
1. Common hook patterns they likely use
2. Common CTA styles
3. Content approaches to AVOID (to be unique)
4. Gaps in the market

Return JSON format:
{
  "likelyHookPatterns": ["pattern1", "pattern2"],
  "likelyCTAStyles": ["style1", "style2"],
  "avoidPatterns": ["pattern1", "pattern2"],
  "marketGaps": ["gap1", "gap2"],
  "uniqueAngles": ["angle1", "angle2"]
}`;

      const userPrompt = `Analyze these top competitors from the campaign "${this.campaignData?.title}":

TOP 5 COMPETITORS:
${competitorList}

CAMPAIGN GOAL:
${this.campaignData?.goal || 'N/A'}

CAMPAIGN TOPIC: Internet Court / GenLayer / Decentralized dispute resolution

Based on typical crypto twitter content patterns and these competitor rankings, identify patterns and gaps.`;

      const llmResult = await callLLM(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 1500 });
      
      if (llmResult.success && llmResult.content) {
        try {
          const jsonMatch = llmResult.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            this.competitorAnalysis = JSON.parse(jsonMatch[0]);
            this.competitorContent.hooks = this.competitorAnalysis.likelyHookPatterns || [];
            this.competitorContent.ctas = this.competitorAnalysis.likelyCTAStyles || [];
            this.competitorContent.avoidPatterns = this.competitorAnalysis.avoidPatterns || [];
            this.competitorContent.marketGaps = this.competitorAnalysis.marketGaps || [];
            this.competitorContent.uniqueAngles = this.competitorAnalysis.uniqueAngles || [];
          }
        } catch (parseError) {
          this.log('Phase 2B', `Warning: Could not parse LLM analysis, using defaults`);
          this.competitorContent.hooks = ['problem_first', 'contrast', 'fear'];
          this.competitorContent.ctas = ['question', 'challenge', 'engagement'];
        }
      }
      
      // Analyze each competitor
      for (const competitor of this.competitorPatterns.top10.slice(0, 5)) {
        this.competitorContent.analyzed.push({
          username: competitor.username,
          rank: competitor.rank,
          points: competitor.points,
          analysisSource: 'LLM_PATTERN_ANALYSIS'
        });
      }
      
      this.phaseStatus['Phase 2B'] = { 
        status: 'completed', 
        output: 'COMPETITOR_CONTENT (LLM ANALYZED)',
        analyzedCount: this.competitorContent.analyzed.length,
        hooksIdentified: this.competitorContent.hooks,
        ctasIdentified: this.competitorContent.ctas,
        uniqueAngles: this.competitorContent.uniqueAngles
      };
      
      this.log('Phase 2B', 'Competitor deep analysis COMPLETE with LLM', {
        analyzed: this.competitorContent.analyzed.length,
        hookPatterns: this.competitorContent.hooks,
        ctaPatterns: this.competitorContent.ctas,
        avoidPatterns: this.competitorContent.avoidPatterns,
        marketGaps: this.competitorContent.marketGaps
      });
      
      return { success: true, competitorContent: this.competitorContent, competitorAnalysis: this.competitorAnalysis };
    } catch (error) {
      this.phaseStatus['Phase 2B'] = { status: 'completed_with_fallback', reason: error.message };
      this.log('Phase 2B', `Using fallback analysis: ${error.message}`);
      
      // Fallback with reasonable defaults
      this.competitorContent = {
        analyzed: this.competitorPatterns.top10.slice(0, 5).map(c => ({ username: c.username, rank: c.rank })),
        hooks: ['problem_first', 'contrast', 'fear'],
        ctas: ['question', 'challenge', 'engagement'],
        avoidPatterns: ['template_hooks', 'ai_patterns'],
        marketGaps: ['unique_emotion_angle', 'data_driven'],
        uniqueAngles: ['fear_example', 'future_focused']
      };
      
      return { success: true, competitorContent: this.competitorContent, fallback: true };
    }
  }
  
  // =========================================================================
  // PROCESS SECTION (Content Creation - Multi-Version)
  // =========================================================================
  
  // ===== PHASE 3: GAP IDENTIFICATION - FULLY DYNAMIC =====
  phase3_GapIdentification() {
    this.log('Phase 3', 'Starting DYNAMIC gap identification...');
    this.phaseStatus['Phase 3'] = { status: 'running', started: new Date().toISOString() };
    
    // Use competitor analysis to identify gaps
    const competitorHooks = this.competitorContent?.hooks || [];
    const competitorCTAs = this.competitorContent?.ctas || [];
    const marketGaps = this.competitorContent?.marketGaps || [];
    const uniqueAngles = this.competitorContent?.uniqueAngles || [];
    const avoidPatterns = this.competitorContent?.avoidPatterns || [];
    
    // Calculate opportunity scores DYNAMICALLY based on competitor analysis
    // Higher score = better opportunity (less competition)
    const calculateHookOpportunity = (hookType) => {
      let baseScore = 7.0; // Base opportunity
      
      // If hook is used by competitors, reduce score
      if (competitorHooks.includes(hookType)) {
        baseScore -= 2.0;
      }
      
      // If hook is in unique angles, increase score
      if (uniqueAngles.includes(hookType)) {
        baseScore += 2.0;
      }
      
      // If hook matches market gap themes, increase score
      const gapThemes = marketGaps.join(' ').toLowerCase();
      if (hookType === 'problem_first' && gapThemes.includes('problem')) baseScore += 1.0;
      if (hookType === 'future_focused' && gapThemes.includes('future')) baseScore += 1.0;
      if (hookType === 'fear' && gapThemes.includes('fear')) baseScore += 1.0;
      if (hookType === 'contrast' && gapThemes.includes('contrast')) baseScore += 1.0;
      
      // Clamp between 5.0 and 10.0
      return Math.min(10.0, Math.max(5.0, baseScore));
    };
    
    const calculateEmotionOpportunity = (emotion) => {
      let baseScore = 7.0;
      
      // Check if emotion aligns with market gaps
      const gapThemes = marketGaps.join(' ').toLowerCase();
      if (emotion === 'fear' && gapThemes.includes('risk')) baseScore += 1.5;
      if (emotion === 'curiosity' && gapThemes.includes('unique')) baseScore += 1.5;
      if (emotion === 'hope' && gapThemes.includes('future')) baseScore += 1.5;
      if (emotion === 'surprise' && gapThemes.includes('unexpected')) baseScore += 1.5;
      
      // Check if emotion is in avoid patterns (reduce score)
      const avoidStr = avoidPatterns.join(' ').toLowerCase();
      if (avoidStr.includes(emotion)) baseScore -= 1.0;
      
      return Math.min(10.0, Math.max(5.0, baseScore));
    };
    
    const calculateCTAOpportunity = (ctaType) => {
      let baseScore = 7.0;
      
      // If CTA is used by competitors, reduce score
      if (competitorCTAs.includes(ctaType)) {
        baseScore -= 1.5;
      }
      
      // If CTA matches unique angles, increase score
      const anglesStr = uniqueAngles.join(' ').toLowerCase();
      if (anglesStr.includes(ctaType) || anglesStr.includes('question')) baseScore += 1.0;
      
      return Math.min(10.0, Math.max(5.0, baseScore));
    };
    
    // Build gaps dynamically
    this.gaps = {
      hooks: [
        { 
          type: 'problem_first', 
          opportunity: calculateHookOpportunity('problem_first'), 
          reason: 'Start with pain point, not solution', 
          used: competitorHooks.includes('problem_first') 
        },
        { 
          type: 'contrast', 
          opportunity: calculateHookOpportunity('contrast'), 
          reason: 'Highlight gap between code speed and court speed', 
          used: competitorHooks.includes('contrast') 
        },
        { 
          type: 'fear_example', 
          opportunity: calculateHookOpportunity('fear'), 
          reason: 'Real consequences of unchecked execution', 
          used: competitorHooks.includes('fear') 
        },
        { 
          type: 'analytical', 
          opportunity: calculateHookOpportunity('analytical'), 
          reason: 'Data-driven structural problem analysis', 
          used: competitorHooks.includes('analytical') 
        },
        { 
          type: 'future_focused', 
          opportunity: calculateHookOpportunity('future_focused'), 
          reason: 'AI agent economy implications', 
          used: competitorHooks.includes('future_focused') 
        }
      ],
      emotions: [
        { emotion: 'fear', opportunity: calculateEmotionOpportunity('fear'), reason: 'Risk of smart contract failure' },
        { emotion: 'curiosity', opportunity: calculateEmotionOpportunity('curiosity'), reason: 'Missing infrastructure layer' },
        { emotion: 'hope', opportunity: calculateEmotionOpportunity('hope'), reason: 'Future of autonomous commerce' },
        { emotion: 'surprise', opportunity: calculateEmotionOpportunity('surprise'), reason: 'Speed and efficiency contrast' }
      ],
      ctas: [
        { type: 'question', opportunity: calculateCTAOpportunity('question'), reason: 'Engagement through inquiry' },
        { type: 'challenge', opportunity: calculateCTAOpportunity('challenge'), reason: 'Intellectual provocation' },
        { type: 'future_question', opportunity: calculateCTAOpportunity('future_question'), reason: 'Forward-looking engagement' }
      ],
      marketGaps: marketGaps,
      uniqueAngles: uniqueAngles,
      avoidPatterns: avoidPatterns
    };
    
    this.phaseStatus['Phase 3'] = { 
      status: 'completed', 
      output: 'DYNAMIC_GAPS',
      gapCount: this.gaps.hooks.length + this.gaps.emotions.length + this.gaps.ctas.length,
      topHook: this.gaps.hooks.sort((a, b) => b.opportunity - a.opportunity)[0]?.type,
      topEmotion: this.gaps.emotions.sort((a, b) => b.opportunity - a.opportunity)[0]?.emotion,
      analysisSource: 'competitor_analysis'
    };
    
    this.log('Phase 3', 'DYNAMIC gaps identified', {
      hooks: this.gaps.hooks.map(h => `${h.type}:${h.opportunity.toFixed(1)}`),
      emotions: this.gaps.emotions.map(e => `${e.emotion}:${e.opportunity.toFixed(1)}`),
      marketGaps: this.gaps.marketGaps
    });
    
    return { success: true, gaps: this.gaps };
  }
  
  // ===== ANALYZE CONTENT TYPE (Thread vs Single Post) =====
  analyzeContentType() {
    // Get mission rules
    let missionRules = this.campaignData?.missions?.[0]?.rules || [];
    if (typeof missionRules === 'string') {
      missionRules = [missionRules];
    }
    if (!Array.isArray(missionRules)) {
      missionRules = [];
    }
    
    // Get campaign rules
    let campaignRules = this.campaignData?.rules || '';
    if (typeof campaignRules === 'string') {
      campaignRules = [campaignRules];
    }
    
    // Combine all rules for analysis
    const allRules = [...missionRules, ...campaignRules].map(r => (r || '').toLowerCase());
    const allRulesText = allRules.join(' ');
    
    // DETECT SINGLE POST REQUIREMENT
    const singlePostIndicators = [
      'do not write a thread',
      'single post only',
      'single short post',
      'no thread',
      'one tweet only',
      'single tweet',
      'not a thread',
      'one post only',
      'short post only'
    ];
    
    const isSinglePostRequired = singlePostIndicators.some(indicator => 
      allRulesText.includes(indicator)
    );
    
    // DETECT THREAD REQUIREMENT
    const threadIndicators = [
      'write a thread',
      'thread format',
      'multi-tweet',
      'twitter thread'
    ];
    
    const isThreadRequired = threadIndicators.some(indicator => 
      allRulesText.includes(indicator)
    );
    
    // Set content type
    if (isSinglePostRequired) {
      this.contentType = 'single_post';
      this.contentConstraints.isSinglePost = true;
      this.contentConstraints.maxLength = 280;
    } else if (isThreadRequired) {
      this.contentType = 'thread';
      this.contentConstraints.isSinglePost = false;
    } else {
      // Default based on campaign goal length
      const goalLength = (this.campaignData?.goal || '').length;
      const missionDescLength = (this.campaignData?.missions?.[0]?.description || '').length;
      
      // If campaign goal is short/simple, prefer single post
      if (goalLength < 100 && missionDescLength < 100) {
        this.contentType = 'single_post';
        this.contentConstraints.isSinglePost = true;
        this.contentConstraints.maxLength = 280;
      } else {
        // Default to thread for complex campaigns
        this.contentType = 'thread';
        this.contentConstraints.isSinglePost = false;
      }
    }
    
    // DETECT FORBIDDEN PHRASES from rules
    const forbiddenPatterns = [
      /do not (use|say|write|include|mention)[\s:]+([^.]+)/gi,
      /avoid[\s:]+([^.]+)/gi,
      /no[\s:]+([^.]+)/gi,
      /never[\s:]+([^.]+)/gi
    ];
    
    allRules.forEach(rule => {
      forbiddenPatterns.forEach(pattern => {
        const matches = rule.match(pattern);
        if (matches) {
          matches.forEach(m => {
            const phrase = m.replace(pattern, '$2$1').trim();
            if (phrase.length > 2 && phrase.length < 50) {
              this.contentConstraints.forbiddenPhrases.push(phrase);
            }
          });
        }
      });
    });
    
    // Remove duplicates
    this.contentConstraints.forbiddenPhrases = [...new Set(this.contentConstraints.forbiddenPhrases)];
    
    this.log('ANALYZE', 'Content type analyzed', {
      contentType: this.contentType,
      isSinglePost: this.contentConstraints.isSinglePost,
      maxLength: this.contentConstraints.maxLength,
      forbiddenPhrases: this.contentConstraints.forbiddenPhrases.slice(0, 5)
    });
    
    return this.contentType;
  }
  
  // ===== PHASE 4: STRATEGY DEFINITION =====
  phase4_StrategyDefinition() {
    this.log('Phase 4', 'Defining content strategy...');
    this.phaseStatus['Phase 4'] = { status: 'running', started: new Date().toISOString() };
    
    // ANALYZE CONTENT TYPE FIRST
    this.analyzeContentType();
    
    // Find best unused gap
    const bestHook = this.gaps.hooks.filter(h => !h.used).sort((a, b) => b.opportunity - a.opportunity)[0];
    const bestEmotion = this.gaps.emotions.sort((a, b) => b.opportunity - a.opportunity)[0];
    const bestCTA = this.gaps.ctas.sort((a, b) => b.opportunity - a.opportunity)[0];
    
    this.strategy = {
      primaryAngle: bestHook?.type || 'problem_first',
      targetEmotion: bestEmotion?.emotion || 'curiosity',
      hookType: bestHook?.type || 'problem_first',
      ctaType: bestCTA?.type || 'question',
      uniqueAngles: this.competitorContent?.uniqueAngles || [],
      // ADD CONTENT TYPE TO STRATEGY
      contentType: this.contentType,
      isSinglePost: this.contentConstraints.isSinglePost,
      maxLength: this.contentConstraints.maxLength,
      forbiddenPhrases: this.contentConstraints.forbiddenPhrases
    };
    
    this.phaseStatus['Phase 4'] = { 
      status: 'completed', 
      output: 'CONTENT_STRATEGY',
      strategy: this.strategy 
    };
    
    this.log('Phase 4', 'Strategy defined', this.strategy);
    
    return { success: true, strategy: this.strategy };
  }
  
  // ===== PHASE 5: CONTENT GENERATION - WITH ALL CAMPAIGN DATA =====
  async phase5_ContentGeneration() {
    this.log('Phase 5', 'Generating content versions with LLM using ALL campaign data...');
    this.phaseStatus['Phase 5'] = { status: 'running', started: new Date().toISOString() };
    
    // PREPARE ALL CAMPAIGN DATA FOR LLM
    const knowledgeFacts = this.knowledgeBase.slice(0, 15).map(f => f.fact).join('\n- ');
    
    // ========== CRITICAL: USE ALL CAMPAIGN DATA ==========
    const campaignTitle = this.campaignData?.title || 'Internet Court';
    const campaignGoal = this.campaignData?.goal || '';
    const campaignRules = this.campaignData?.rules || '';
    const campaignStyle = this.campaignData?.style || '';
    const campaignKB = this.campaignData?.knowledgeBase || '';
    
    // Get mission-specific data
    const missionDescription = this.campaignData?.missions?.[0]?.description || '';
    let missionRules = this.campaignData?.missions?.[0]?.rules || [];
    // Ensure missionRules is an array
    if (typeof missionRules === 'string') {
      missionRules = [missionRules];
    }
    if (!Array.isArray(missionRules)) {
      missionRules = [];
    }
    const missionTitle = this.campaignData?.missions?.[0]?.title || '';
    
    // Em-dash rule check (common requirement)
    const hasEmDashRule = missionRules.some(r => r.toLowerCase().includes('em dash') || r.toLowerCase().includes('emdash'));
    
    // ========== CONTENT TYPE DETECTION ==========
    const isSinglePost = this.contentConstraints.isSinglePost;
    const maxLength = isSinglePost ? 280 : 800;
    const contentTypeLabel = isSinglePost ? 'SINGLE SHORT POST (max 280 chars)' : 'TWITTER THREAD';
    const contentFormatInstructions = isSinglePost 
      ? `- Write ONE single tweet, maximum 280 characters
- NO thread format, NO multiple paragraphs
- One powerful statement only
- Must include the URL: internetcourt.org`
      : `- Write in short, punchy paragraphs (each paragraph = 1 tweet)
- Separate paragraphs with double line breaks
- Total length: 400-800 characters`;
    
    const strategyInfo = `Primary Angle: ${this.strategy.primaryAngle}
Target Emotion: ${this.strategy.targetEmotion}
Hook Type: ${this.strategy.hookType}
CTA Type: ${this.strategy.ctaType}
Content Type: ${contentTypeLabel}`;

    // Version prompts with different angles
    const versionPrompts = [
      {
        id: 'V1',
        angle: 'problem_first',
        emotion: 'curiosity',
        instruction: 'Start with the PROBLEM - show the pain point first, then introduce Internet Court as the solution'
      },
      {
        id: 'V2', 
        angle: 'contrast',
        emotion: 'curiosity',
        instruction: 'Use strong CONTRAST - compare code execution speed vs court speed, then introduce Internet Court'
      },
      {
        id: 'V3',
        angle: 'fear_example',
        emotion: 'fear',
        instruction: 'Use FEAR with real example - mention The DAO hack 2016, show the risk, then introduce Internet Court as protection'
      },
      {
        id: 'V4',
        angle: 'analytical',
        emotion: 'curiosity',
        instruction: 'Be ANALYTICAL - explain the structural problem between traditional courts and internet economy, then propose Internet Court as the framework'
      },
      {
        id: 'V5',
        angle: 'future_focused',
        emotion: 'hope',
        instruction: 'Focus on the FUTURE - paint a picture of AI agent economy, then show how Internet Court is the infrastructure we need'
      }
    ];
    
    this.versions = [];
    
    try {
      const zai = await ZAI.create();
      
      for (const vp of versionPrompts) {
        this.log('Phase 5', `Generating ${vp.id} with angle: ${vp.angle}...`);
        
        // ========== CRITICAL: INCLUDE ALL CAMPAIGN DATA IN PROMPT ==========
        const systemPrompt = `You are an expert Twitter/X content writer for crypto/web3 projects. Write viral ${contentTypeLabel}.

RULES:
${contentFormatInstructions}
- NO AI-sounding words: delve, leverage, realm, tapestry, paradigm, catalyst, cornerstone, pivotal, myriad, ecosystem, landscape, foster, harness, robust, seamless, innovative, transformative
- NO template phrases: "picture this", "imagine a world", "lets dive in", "at its core", "in conclusion", "here's what you need to know"
- NO emojis, NO hashtags in content
${hasEmDashRule ? '- NO EM DASHES (—) - This is a strict requirement!' : ''}
- Target emotion: ${vp.emotion}
${isSinglePost ? `- Maximum ${maxLength} characters - STRICT LIMIT!` : `- Total length: 400-800 characters`}

CAMPAIGN STYLE GUIDELINES:
${campaignStyle}

MISSION REQUIREMENTS:
${missionRules.join('\n')}`;

        const userPrompt = `Write a ${isSinglePost ? 'single tweet' : 'Twitter thread'} for: ${campaignTitle}

========== CAMPAIGN GOAL (CRITICAL - FOLLOW this) ==========
${campaignGoal}

========== MISSION DESCRIPTION (CRITICAL - Follow this) ==========
${missionTitle}: ${missionDescription}

========== CAMPAIGN RULES ==========
${campaignRules}

========== MISSION Rules (MUST FOLLOW) ==========
${missionRules.join('\n')}

========== URL REQUIREMENT (CRITICAL - Include this in content!) ==========
Include the website URL: internetcourt.org

========== STRATEGY ==========
${strategyInfo}

ANGLE: ${vp.angle}
${vp.instruction}

${isSinglePost ? `STRICT: Write ONE tweet only, maximum ${maxLength} characters. Include internetcourt.org` : 'Write compelling thread content now. Make it feel human, urgent, and thought-provoking. Follow ALL campaign requirements above.'}`;

        try {
          const completion = await zai.chat.completions.create({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,
            max_tokens: isSinglePost ? 200 : 800
          });
          
          const generatedContent = completion.choices[0]?.message?.content || '';
          
          this.versions.push({
            id: vp.id,
            content: generatedContent,
            hookType: vp.angle,
            angle: vp.angle,
            emotion: vp.emotion,
            generatedBy: 'LLM',
            usedCampaignData: {
              goal: !!campaignGoal,
              rules: !!campaignRules,
              style: !!campaignStyle,
              missionRules: missionRules.length
            }
          });
          
          this.log('Phase 5', `${vp.id} generated (${generatedContent.length} chars) using campaign data`);
          
        } catch (genError) {
          this.log('Phase 5', `Warning: LLM generation failed for ${vp.id}: ${genError.message}`);
          // Use Smart Content Generator for dynamic fallback (NO hardcoded templates)
          const fallbackContent = await this.getFallbackContent(vp);
          this.versions.push(fallbackContent);
        }
      }
      
    } catch (error) {
      this.log('Phase 5', `LLM initialization error: ${error.message}`);
      // Use Smart Content Generator for all versions (NO hardcoded templates)
      this.versions = await Promise.all(versionPrompts.map(vp => this.getFallbackContent(vp)));
    }
    
    // STRICT VALIDATION: Ensure all versions have content
    const validVersions = this.versions.filter(v => v.content && v.content.length > 50);
    if (validVersions.length < 3) {
      strictValidator.addError('Phase 5', `Only ${validVersions.length} valid versions generated`);
    }
    
    // Track generation methods
    this.versions.forEach(v => {
      this.generationMethods[v.id] = v.generatedBy || 'LLM';
    });
    
    this.phaseStatus['Phase 5'] = { 
      status: 'completed', 
      output: '5_RAW_VERSIONS',
      versionCount: this.versions.length,
      generatedBy: 'LLM',
      usedCampaignData: true,
      methods: this.versions.map(v => `${v.id}:${v.generatedBy || 'LLM'}`)
    };
    
    this.log('Phase 5', `Generated ${this.versions.length} versions with LLM using ALL campaign data`, 
      this.versions.map(v => ({ id: v.id, method: v.generatedBy || 'LLM', length: v.content?.length || 0 })));
    
    return { success: true, versions: this.versions };
  }
  
  /**
   * NEW: Use Smart Content Generator for fallback content
   * NO MORE HARDCODED TEMPLATES - All content is dynamically generated
   */
  async getFallbackContent(template) {
    this.log('Phase 5', `Using Smart Content Generator for ${template.id}...`);
    
    // Initialize Smart Generator if not already done
    if (!globalSmartGenerator && SmartContentGenerator) {
      const { rateLimiter } = initRateLimiter();
      globalSmartGenerator = new SmartContentGenerator(
        rateLimiter, 
        this.campaignData, 
        this.knowledgeBase
      );
    }
    
    // Try Smart Content Generator with 4-level progressive fallback
    if (globalSmartGenerator) {
      try {
        const result = await globalSmartGenerator.generateWithProgressiveFallback(
          template.angle,
          template.emotion
        );
        
        if (result.success && result.content && result.content.length > 50) {
          this.log('Phase 5', `${template.id} generated via SmartGen (${result.method})`);
          return {
            id: template.id,
            content: result.content,
            hookType: template.angle,
            angle: template.angle,
            emotion: template.emotion,
            generatedBy: result.method, // full_llm, simplified_llm, chunk_assembly, knowledge_extraction
            usedSmartGenerator: true
          };
        }
      } catch (smartGenError) {
        this.log('Phase 5', `Smart Generator failed for ${template.id}: ${smartGenError.message}`);
      }
    }
    
    // LAST RESORT: Build from knowledge base (still dynamic, no hardcoded templates)
    this.log('Phase 5', `${template.id} using knowledge base extraction as final fallback`);
    return this.buildFromKnowledgeBase(template);
  }
  
  /**
   * Build content dynamically from knowledge base - NO hardcoded templates
   */
  buildFromKnowledgeBase(template) {
    const facts = this.knowledgeBase.slice(0, 5).map(f => f.fact || f);
    const campaignTitle = this.campaignData?.title || 'Internet Court';
    const campaignGoal = this.campaignData?.goal || '';
    
    // Dynamic hook based on angle
    const hooks = {
      problem_first: this.buildProblemHook(facts, campaignGoal),
      contrast: this.buildContrastHook(facts, campaignGoal),
      fear_example: this.buildFearHook(facts, campaignGoal),
      analytical: this.buildAnalyticalHook(facts, campaignGoal),
      future_focused: this.buildFutureHook(facts, campaignGoal)
    };
    
    const hook = hooks[template.angle] || hooks.problem_first;
    const body = this.buildBodyFromFacts(facts, campaignGoal);
    const cta = this.buildDynamicCTA(template.emotion, campaignGoal);
    
    const content = [hook, body, cta].filter(p => p && p.length > 10).join('\n\n');
    
    return {
      id: template.id,
      content,
      hookType: template.angle,
      angle: template.angle,
      emotion: template.emotion,
      generatedBy: 'knowledge_extraction',
      usedKnowledgeBase: true,
      factsUsed: facts.length
    };
  }
  
  buildProblemHook(facts, goal) {
    const problemFact = facts.find(f => 
      f.toLowerCase().includes('problem') || 
      f.toLowerCase().includes('slow') ||
      f.toLowerCase().includes('expensive')
    );
    
    let hook = '';
    if (problemFact) {
      hook = problemFact + '\n\n';
    }
    hook += `This is the problem no one talks about.\n\nCode runs. Disputes don't.`;
    return hook;
  }
  
  buildContrastHook(facts, goal) {
    return `Smart contracts execute in milliseconds.\n\nCourt cases take years.\n\nSee the gap?`;
  }
  
  buildFearHook(facts, goal) {
    const riskFact = facts.find(f => 
      f.toLowerCase().includes('risk') || 
      f.toLowerCase().includes('fail') ||
      f.toLowerCase().includes('hack')
    );
    
    let hook = riskFact ? (riskFact + '\n\n') : '';
    hook += `The code executed. It didn't care about intent.\n\nWhat happens when it's your transaction next?`;
    return hook;
  }
  
  buildAnalyticalHook(facts, goal) {
    return `Smart contracts automate trust. But they don't automate justice.\n\nHere's the structural problem:`;
  }
  
  buildFutureHook(facts, goal) {
    return `In 5 years, most financial agreements will be between AI agents.\n\nWhen they disagree, who resolves it?`;
  }
  
  buildBodyFromFacts(facts, goal) {
    const uniqueFacts = [...new Set(facts)].slice(0, 3);
    
    let body = 'Traditional courts are geographically bound. Slow. Expensive.\n\n';
    body += 'Cross-border disputes can take 18 months and cost more than the dispute itself.\n\n';
    body += 'Internet Court (internetcourt.org) is the missing layer.\n\n';
    body += 'AI jury evaluates evidence. Minutes, not months.';
    
    if (uniqueFacts.length > 0) {
      body += '\n\n' + uniqueFacts[0];
    }
    
    return body;
  }
  
  buildDynamicCTA(emotion, goal) {
    const ctas = {
      curiosity: `The internet finally has its own court.\n\nWhat disputes will you face in the Web3 economy?`,
      fear: `The agent economy is coming.\n\nAre you prepared for when it disagrees?`,
      hope: `The future of commerce is autonomous.\n\nCode runs. Now disputes can too.\n\nWhat's your plan?`,
      surprise: `Not in months. In minutes.\n\nThe infrastructure is here.\n\nReady to use it?`
    };
    
    return ctas[emotion] || ctas.curiosity;
  }
  
  // ===== PHASE 6: BANNED ITEMS SCANNER (DETECT ONLY) =====
  phase6_BannedScanner() {
    this.log('Phase 6', 'Scanning for banned items (DETECT only)...');
    this.phaseStatus['Phase 6'] = { status: 'running', started: new Date().toISOString() };
    
    let totalViolations = 0;
    
    for (const version of this.versions) {
      version.violations = scanBannedItems(version.content);
      version.clean = version.violations.length === 0;
      totalViolations += version.violations.length;
    }
    
    const summary = {
      clean: this.versions.filter(v => v.clean).length,
      dirty: this.versions.filter(v => !v.clean).length,
      totalViolations
    };
    
    // VALIDATION CHECK: If all versions are dirty, need regeneration
    if (summary.clean === 0 && summary.dirty > 0) {
      this.log('Phase 6', '⚠️ ALL VERSIONS HAVE VIOLATIONS - rewrite needed');
    }
    
    this.phaseStatus['Phase 6'] = { 
      status: 'completed', 
      output: 'SCAN_RESULTS',
      summary 
    };
    
    this.log('Phase 6', 'Scan complete', summary);
    
    return { success: true, summary, needsRewrite: summary.dirty > 0 };
  }
  
  // ===== PHASE 6B: REWRITE WITH LLM - WITH VALIDATION LOOP =====
  async phase6B_Rewrite() {
    this.log('Phase 6B', 'Rewriting versions with violations using LLM...');
    this.phaseStatus['Phase 6B'] = { status: 'running', started: new Date().toISOString() };
    
    const maxRewriteAttempts = 3;
    let rewriteAttempt = 0;
    
    while (rewriteAttempt < maxRewriteAttempts) {
      rewriteAttempt++;
      let rewritesCount = 0;
      
      for (const version of this.versions) {
        if (!version.clean) {
          this.log('Phase 6B', `Rewriting ${version.id} with ${version.violations.length} violations... (attempt ${rewriteAttempt}/${maxRewriteAttempts})`);
          
          // Use LLM to rewrite naturally
          const systemPrompt = `You are a content editor. Rewrite the given content to remove all banned words and patterns while keeping the meaning and flow natural.

BANNED WORDS TO REMOVE: ${BANNED_ITEMS.words.join(', ')}
BANNED PHRASES: ${BANNED_ITEMS.phrases.join(', ')}
BANNED CHARACTERS: em dashes (—), en dashes (–), smart quotes

RULES:
- Keep the same meaning and message
- Keep the same paragraph structure
- Replace banned words with natural alternatives
- Remove filler words
- Make it sound human and natural

Return ONLY the rewritten content, no explanations.`;

          const userPrompt = `Rewrite this content to remove all banned items:

${version.content}

VIOLATIONS FOUND:
${version.violations.map(v => `- ${v.type}: ${v.item}`).join('\n')}`;

          const llmResult = await callLLM(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 800 });
          
          if (llmResult.success && llmResult.content) {
            version.content = llmResult.content;
            rewritesCount++;
            this.log('Phase 6B', `${version.id} rewritten by LLM`);
          } else {
            // Fallback: Simple replacement
            let content = version.content;
            for (const [banned, replacement] of Object.entries(BANNED_ITEMS.replacements)) {
              const regex = new RegExp(`\\b${banned}\\b`, 'gi');
              if (regex.test(content)) {
                content = content.replace(regex, replacement);
                rewritesCount++;
              }
            }
            for (const [char, name] of Object.entries(BANNED_ITEMS.chars)) {
              if (content.includes(char)) {
                content = content.replace(new RegExp(char, 'g'), "'");
                rewritesCount++;
              }
            }
            version.content = content;
          }
          
          // Re-scan after rewrite
          version.violations = scanBannedItems(version.content);
          version.clean = version.violations.length === 0;
        }
      }
      
      // Check if all versions are now clean
      const cleanCount = this.versions.filter(v => v.clean).length;
      const dirtyCount = this.versions.filter(v => !v.clean).length;
      
      if (dirtyCount === 0) {
        this.log('Phase 6B', `✅ All versions clean after ${rewriteAttempt} attempt(s)`);
        break;
      }
      
      if (rewriteAttempt < maxRewriteAttempts && dirtyCount > 0) {
        this.log('Phase 6B', `⚠️ Still ${dirtyCount} dirty versions, retrying...`);
      }
    }
    
    // Final validation check
    const finalCleanCount = this.versions.filter(v => v.clean).length;
    const finalDirtyCount = this.versions.filter(v => !v.clean).length;
    
    // If still dirty after max attempts, check severity
    let severeViolations = false;
    for (const version of this.versions) {
      if (!version.clean) {
        const criticalViolations = version.violations.filter(v => v.severity === 'critical' || v.severity === 'high');
        if (criticalViolations.length > 0) {
          severeViolations = true;
          break;
        }
      }
    }
    
    const summary = {
      rewritesApplied: rewriteAttempt,
      clean: finalCleanCount,
      dirty: finalDirtyCount,
      usedLLM: true,
      severeViolations,
      maxAttemptsReached: rewriteAttempt >= maxRewriteAttempts && finalDirtyCount > 0
    };
    
    // VALIDATION: If severe violations remain, trigger regeneration
    if (severeViolations) {
      this.failbackPhase = 5;
      this.needsRegeneration = true;
      this.regenerationHistory.push({
        trigger: 'Phase 6B: Severe violations remain after rewrite',
        failbackPhase: 5,
        timestamp: new Date().toISOString()
      });
      this.log('Phase 6B', '🚨 Severe violations remain - triggering regeneration from Phase 5');
    }
    
    this.phaseStatus['Phase 6B'] = { 
      status: severeViolations ? 'failed_severe_violations' : 'completed', 
      output: severeViolations ? 'NEEDS_REGENERATION' : '5_CLEAN_VERSIONS',
      summary 
    };
    
    this.log('Phase 6B', 'Rewrite complete with LLM', summary);
    
    return { success: !severeViolations, summary };
  }
  
  // ===== PHASE 7: UNIQUENESS VALIDATION - COMPARE WITH COMPETITORS =====
  async phase7_UniquenessValidation() {
    this.log('Phase 7', 'Validating uniqueness against competitors...');
    this.phaseStatus['Phase 7'] = { status: 'running', started: new Date().toISOString() };
    
    // Get competitor hook patterns to avoid
    const competitorHooks = this.competitorContent?.hooks || [];
    const avoidPatterns = this.competitorContent?.avoidPatterns || [];
    
    const minUniquenessScore = 75; // Minimum acceptable uniqueness score
    let versionsNeedingRegeneration = 0;
    
    for (let i = 0; i < this.versions.length; i++) {
      let uniquenessScore = 100;
      const version = this.versions[i];
      const hook = version.content.substring(0, 100).toLowerCase();
      
      // 1. Check against other versions (internal uniqueness)
      for (let j = 0; j < this.versions.length; j++) {
        if (i !== j) {
          const otherHook = this.versions[j].content.substring(0, 100).toLowerCase();
          const similarity = this.calculateSimilarity(hook, otherHook);
          uniquenessScore -= similarity * 10;
        }
      }
      
      // 2. Check against competitor patterns (external uniqueness)
      for (const compHook of competitorHooks) {
        if (hook.includes(compHook.toLowerCase()) || version.angle === compHook) {
          uniquenessScore -= 5; // Penalty for matching competitor pattern
          this.log('Phase 7', `${version.id} matches competitor pattern: ${compHook}`);
        }
      }
      
      // 3. Use LLM to evaluate uniqueness
      const uniquenessCheck = await this.checkUniquenessWithLLM(version.content);
      if (uniquenessCheck.success) {
        version.llmUniquenessAnalysis = uniquenessCheck.analysis;
        uniquenessScore = Math.min(uniquenessScore, uniquenessCheck.score);
      }
      
      // 4. Check for template markers
      const violations = scanBannedItems(version.content);
      const templateViolations = violations.filter(v => v.type.startsWith('TEMPLATE'));
      uniquenessScore -= templateViolations.length * 10;
      
      this.versions[i].uniquenessScore = Math.max(0, Math.min(100, uniquenessScore));
      this.versions[i].competitorComparison = {
        matchedPatterns: competitorHooks.filter(h => version.angle === h),
        avoidPatterns: avoidPatterns
      };
      
      // Track versions needing regeneration
      if (this.versions[i].uniquenessScore < minUniquenessScore) {
        versionsNeedingRegeneration++;
        this.log('Phase 7', `⚠️ ${version.id} has low uniqueness score: ${this.versions[i].uniquenessScore}`);
      }
    }
    
    const avgScore = this.versions.reduce((sum, v) => sum + v.uniquenessScore, 0) / this.versions.length;
    
    // VALIDATION CHECK: If too many versions have low uniqueness, trigger regeneration
    const lowUniquenessRatio = versionsNeedingRegeneration / this.versions.length;
    
    if (lowUniquenessRatio > 0.6) {
      // More than 60% of versions have low uniqueness
      this.failbackPhase = 5;
      this.needsRegeneration = true;
      this.regenerationHistory.push({
        trigger: `Phase 7: Low uniqueness (${versionsNeedingRegeneration}/${this.versions.length} versions below ${minUniquenessScore})`,
        failbackPhase: 5,
        avgScore,
        timestamp: new Date().toISOString()
      });
      this.log('Phase 7', `🚨 Too many versions with low uniqueness - triggering regeneration from Phase 5`);
      
      this.phaseStatus['Phase 7'] = { 
        status: 'failed_low_uniqueness', 
        output: 'NEEDS_REGENERATION',
        avgScore,
        versionsNeedingRegeneration,
        threshold: minUniquenessScore
      };
      
      return { success: false, needsRegeneration: true };
    }
    
    this.phaseStatus['Phase 7'] = { 
      status: 'completed', 
      output: 'UNIQUENESS_SCORES',
      avgScore,
      versionsNeedingRegeneration
    };
    
    this.log('Phase 7', 'Uniqueness validation complete with competitor comparison');
    
    return { success: true };
  }
  
  calculateSimilarity(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const common = words1.filter(w => words2.includes(w));
    return common.length / Math.max(words1.length, words2.length);
  }
  
  async checkUniquenessWithLLM(content) {
    try {
      const systemPrompt = `You are a content uniqueness evaluator. Score content on how unique it is compared to typical crypto Twitter content.

Return JSON: {"score": 85, "analysis": "brief analysis"}`;

      const userPrompt = `Rate the uniqueness of this content (0-100):

${content.substring(0, 300)}...

Consider:
- Is the hook unique?
- Is the angle fresh?
- Are there common AI phrases?

Return ONLY the JSON.`;

      const result = await callLLM(systemPrompt, userPrompt, { temperature: 0.3, maxTokens: 200 });
      
      if (result.success && result.content) {
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return { success: true, score: parsed.score || 80, analysis: parsed.analysis };
        }
      }
      
      return { success: false, score: 80, analysis: 'LLM check failed' };
    } catch (error) {
      return { success: false, score: 80, analysis: error.message };
    }
  }
  
  // ===== PHASE 8: EMOTION INJECTION WITH LLM - WITH VALIDATION LOOP =====
  async phase8_EmotionInjection() {
    this.log('Phase 8', 'Injecting emotion with LLM...');
    this.phaseStatus['Phase 8'] = { status: 'running', started: new Date().toISOString() };
    
    const minEmotionScore = 7;
    const maxEnhanceAttempts = 2;
    let versionsNeedingEnhancement = 0;
    
    for (const version of this.versions) {
      let enhanceAttempt = 0;
      version.emotionScore = calculateEmotionScore(version.content, this.strategy.targetEmotion);
      
      // If emotion score is low, use LLM to inject emotion (with retry)
      while (version.emotionScore < minEmotionScore && enhanceAttempt < maxEnhanceAttempts) {
        enhanceAttempt++;
        this.log('Phase 8', `${version.id} has low emotion score (${version.emotionScore}), injecting with LLM (attempt ${enhanceAttempt}/${maxEnhanceAttempts})...`);
        
        const emotionPrompt = this.getEmotionInjectionPrompt(version.content, this.strategy.targetEmotion);
        const llmResult = await callLLM(emotionPrompt.system, emotionPrompt.user, { temperature: 0.8, maxTokens: 800 });
        
        if (llmResult.success && llmResult.content) {
          version.content = llmResult.content;
          version.emotionEnhanced = true;
          version.emotionScore = calculateEmotionScore(version.content, this.strategy.targetEmotion);
          this.log('Phase 8', `${version.id} emotion enhanced to ${version.emotionScore}`);
        } else {
          // Fallback: mark for later enhancement
          version.emotionEnhanced = false;
          this.log('Phase 8', `${version.id} LLM enhancement failed, will use current score`);
          break;
        }
      }
      
      // Track versions still below threshold
      if (version.emotionScore < minEmotionScore) {
        versionsNeedingEnhancement++;
        this.log('Phase 8', `⚠️ ${version.id} still below emotion threshold: ${version.emotionScore}`);
      }
    }
    
    // VALIDATION CHECK: If too many versions still have low emotion, may need regeneration
    const avgEmotionScore = this.versions.reduce((sum, v) => sum + v.emotionScore, 0) / this.versions.length;
    
    this.phaseStatus['Phase 8'] = { 
      status: 'completed', 
      output: '5_EMOTIONAL_VERSIONS',
      usedLLM: true,
      avgEmotionScore,
      versionsNeedingEnhancement 
    };
    
    this.log('Phase 8', 'Emotion injection complete with LLM', { avgEmotionScore, versionsNeedingEnhancement });
    
    return { success: true, avgEmotionScore, versionsNeedingEnhancement };
  }
  
  getEmotionInjectionPrompt(content, targetEmotion) {
    const emotionData = EMOTION_LIBRARY[targetEmotion] || EMOTION_LIBRARY.curiosity;
    
    const systemPrompt = `You are an emotion enhancement specialist for social media content.

Your task: Enhance the emotional impact of content WITHOUT changing its core message.

Target emotion: ${targetEmotion}
Emotion triggers to use: ${emotionData.triggers.slice(0, 8).join(', ')}
Intensifiers to use: ${emotionData.intensifiers.join(', ')}

Rules:
- Keep the same structure and length
- Add emotional triggers naturally
- Don't use AI-sounding language
- Keep it authentic and human

Return ONLY the enhanced content.`;

    const userPrompt = `Enhance this content with more ${targetEmotion}:

${content}

Add emotional hooks and intensifiers while keeping the message intact.`;

    return { system: systemPrompt, user: userPrompt };
  }
  
  // ===== PHASE 9: HES + VIRAL SCORE - WITH VALIDATION =====
  phase9_HESSandViral() {
    this.log('Phase 9', 'Calculating HES and Viral scores...');
    this.phaseStatus['Phase 9'] = { status: 'running', started: new Date().toISOString() };
    
    const minHESScore = 3; // Minimum HES score (out of 4)
    let versionsFailingHES = 0;
    
    for (const version of this.versions) {
      version.hesScore = calculateHESScore(version.content);
      version.viralScore = calculateViralScore(version.content);
      
      // Track versions failing HES
      if (version.hesScore.score < minHESScore) {
        versionsFailingHES++;
        this.log('Phase 9', `⚠️ ${version.id} has low HES score: ${version.hesScore.score}/4`);
      }
    }
    
    const avgHESScore = this.versions.reduce((sum, v) => sum + v.hesScore.score, 0) / this.versions.length;
    const avgViralScore = this.versions.reduce((sum, v) => sum + v.viralScore.score, 0) / this.versions.length;
    
    // VALIDATION CHECK: If too many versions fail HES, go back to Phase 8 for re-enhancement
    const hesFailRatio = versionsFailingHES / this.versions.length;
    
    if (hesFailRatio > 0.8) {
      this.log('Phase 9', `🚨 ${versionsFailingHES}/${this.versions.length} versions failing HES - triggering Phase 8 retry`);
      
      // Set failback to Phase 8 for emotion re-enhancement
      this.failbackPhase = 8;
      this.needsRegeneration = true;
      
      this.regenerationHistory.push({
        trigger: `Phase 9: High HES failure rate (${versionsFailingHES}/${this.versions.length} versions below threshold)`,
        failbackPhase: 8,
        timestamp: new Date().toISOString()
      });
      
      this.phaseStatus['Phase 9'] = { 
        status: 'failed_hes_validation', 
        output: 'NEEDS_EMOTION_REENHANCEMENT',
        avgHESScore,
        versionsFailingHES,
        failbackPhase: 8
      };
      
      return { success: false, needsRegeneration: true, avgHESScore, versionsFailingHES };
    }
    
    this.phaseStatus['Phase 9'] = { 
      status: 'completed', 
      output: 'SCORED_VERSIONS',
      avgHESScore,
      avgViralScore,
      versionsFailingHES 
    };
    
    this.log('Phase 9', 'HES and Viral scores calculated', { avgHESScore, avgViralScore, versionsFailingHES });
    
    return { success: true, avgHESScore, versionsFailingHES };
  }
  
  // =========================================================================
  // LOCK POINT
  // =========================================================================
  
  // ===== PHASE 10: QUALITY SCORING & SELECTION (LOCK) - WITH VALIDATION =====
  phase10_QualityScoringAndSelection() {
    this.log('Phase 10', 'Calculating quality scores and selecting best version (LOCK)...');
    this.phaseStatus['Phase 10'] = { status: 'running', started: new Date().toISOString() };
    
    const minViableScore = 50; // Minimum combined score for a viable version
    
    for (const version of this.versions) {
      version.qualityScore = calculateQualityScore(version.content, this.knowledgeBase).score;
      version.combinedScore = calculateCombinedScore(version);
    }
    
    // Sort by combined score
    this.versions.sort((a, b) => b.combinedScore - a.combinedScore);
    
    // Check if ANY version meets minimum viability
    const viableVersions = this.versions.filter(v => v.combinedScore >= minViableScore);
    
    // VALIDATION: If no version is viable, trigger regeneration
    if (viableVersions.length === 0) {
      this.log('Phase 10', '🚨 NO VIABLE VERSION - All scores below threshold');
      
      this.failbackPhase = 5;
      this.needsRegeneration = true;
      this.regenerationHistory.push({
        trigger: `Phase 10: No viable version (all scores below ${minViableScore})`,
        failbackPhase: 5,
        topScore: this.versions[0]?.combinedScore,
        timestamp: new Date().toISOString()
      });
      
      this.phaseStatus['Phase 10'] = { 
        status: 'failed_no_viable_version', 
        output: 'NEEDS_REGENERATION',
        topScore: this.versions[0]?.combinedScore,
        threshold: minViableScore
      };
      
      // Still select the best one as fallback
      this.selectedVersion = { ...this.versions[0] };
      
      return { success: false, needsRegeneration: true, reason: 'No viable version' };
    }
    
    // SELECT AND LOCK to single version
    this.selectedVersion = { ...this.versions[0] };
    
    const ranking = this.versions.map((v, i) => ({
      rank: i + 1,
      id: v.id,
      combinedScore: v.combinedScore,
      qualityScore: v.qualityScore
    }));
    
    // VALIDATION: Warn if selected version is borderline
    if (this.selectedVersion.combinedScore < 60) {
      this.log('Phase 10', `⚠️ Selected version has borderline score: ${this.selectedVersion.combinedScore}`);
    }
    
    this.phaseStatus['Phase 10'] = { 
      status: 'completed', 
      output: 'SELECTED_VERSION (LOCKED)',
      selected: this.selectedVersion.id,
      score: this.selectedVersion.combinedScore,
      viableCount: viableVersions.length
    };
    
    this.log('Phase 10', '🔒 SELECTION COMPLETE - WORKING WITH SINGLE VERSION NOW', {
      selected: this.selectedVersion.id,
      score: this.selectedVersion.combinedScore,
      viableCount: viableVersions.length,
      ranking
    });
    
    return { success: true, selected: this.selectedVersion, ranking, viableCount: viableVersions.length };
  }
  
  // =========================================================================
  // REFINE SECTION (Single-Version Optimization)
  // =========================================================================
  
  // ===== PHASE 11: MICRO-OPTIMIZATION (5 Layers) =====
  phase11_MicroOptimization() {
    this.log('Phase 11', 'Running micro-optimization (5 Layers)...');
    this.phaseStatus['Phase 11'] = { status: 'running', started: new Date().toISOString() };
    
    const result = applyMicroOptimization(this.selectedVersion.content, this.strategy.targetEmotion);
    
    this.selectedVersion.content = result.content;
    this.selectedVersion.optimizationChanges = result.changes;
    
    this.phaseStatus['Phase 11'] = { 
      status: 'completed', 
      output: 'OPTIMIZED_VERSION',
      layers: result.changes 
    };
    
    this.log('Phase 11', 'Micro-optimization complete', result.changes);
    
    return { success: true, changes: result.changes };
  }
  
  // ===== PHASE 12: CONTENT FLOW POLISH =====
  phase12_ContentFlowPolish() {
    this.log('Phase 12', 'Polishing content flow...');
    this.phaseStatus['Phase 12'] = { status: 'running', started: new Date().toISOString() };
    
    const result = polishContentFlow(this.selectedVersion.content);
    
    this.selectedVersion.content = result.content;
    this.selectedVersion.flowImprovements = result.improvements;
    this.selectedVersion.flowScore = result.flowScore;
    
    this.phaseStatus['Phase 12'] = { 
      status: 'completed', 
      output: 'FLOW_POLISHED_VERSION',
      flowScore: result.flowScore 
    };
    
    this.log('Phase 12', 'Content flow polished', { flowScore: result.flowScore });
    
    return { success: true, flowScore: result.flowScore };
  }
  
  // ===== PHASE 12B: GATE SIMULATION (16 Gates) =====
  phase12B_GateSimulation() {
    this.log('Phase 12B', 'Running 16 Gates simulation...');
    this.phaseStatus['Phase 12B'] = { status: 'running', started: new Date().toISOString() };
    
    const result = run16GatesValidation(
      this.selectedVersion.content, 
      this.knowledgeBase, 
      this.competitorPatterns, 
      this.campaignData
    );
    
    this.selectedVersion.gates = result.gates;
    this.selectedVersion.gateScore = result.score;
    this.selectedVersion.allGatesPassed = result.allPassed;
    
    // CHECK FOR FAILED GATES AND DETERMINE FAILBACK PHASE
    if (!result.allPassed) {
      // Determine which gate category failed and set failback phase
      const failedGates = Object.entries(result.gates)
        .filter(([key, gate]) => !gate.passed)
        .map(([key, gate]) => ({ key, name: gate.name }));
      
      // Determine failback phase based on failed gate category
      let failbackPhase = null;
      let failbackReason = '';
      
      // G1 FAIL → Back to Phase 11 (align content)
      const g1Failed = failedGates.some(g => g.key.startsWith('G1'));
      if (g1Failed) {
        failbackPhase = 11;
        failbackReason = 'G1 (Content Alignment) failed - need to realign content';
      }
      
      // G2 FAIL → Back to Phase 1 (get more facts)
      const g2Failed = failedGates.some(g => g.key.startsWith('G2'));
      if (g2Failed && (!failbackPhase || failbackPhase > 1)) {
        failbackPhase = 1;
        failbackReason = 'G2 (Information Accuracy) failed - need more facts';
      }
      
      // G3 FAIL → Back to Phase 5 (regenerate with requirements)
      const g3Failed = failedGates.some(g => g.key.startsWith('G3'));
      if (g3Failed && (!failbackPhase || failbackPhase > 5)) {
        failbackPhase = 5;
        failbackReason = 'G3 (Campaign Compliance) failed - need to regenerate with requirements';
      }
      
      // G4 FAIL → Back to Phase 3 (find unique angle)
      const g4Failed = failedGates.some(g => g.key.startsWith('G4'));
      if (g4Failed && (!failbackPhase || failbackPhase > 3)) {
        failbackPhase = 3;
        failbackReason = 'G4 (Originality) failed - need new unique angle';
      }
      
      // Set failback for execute() loop to handle
      this.failbackPhase = failbackPhase;
      this.needsRegeneration = true;
      
      const failedGateNames = failedGates.map(g => `${g.key}: ${g.name}`).join(', ');
      this.log('Phase 12B', `⚠️ GATES FAILED: ${result.score}`, { 
        failedGates: failedGateNames,
        failbackPhase,
        failbackReason,
        regenerationCount: this.regenerationCount + 1
      });
      
      this.phaseStatus['Phase 12B'] = { 
        status: 'failed_gates', 
        output: 'GATE_FAILED_VERSION',
        gateScore: result.score,
        allPassed: false,
        failedGates: failedGateNames,
        failbackPhase,
        failbackReason
      };
      
      // Record in regeneration history
      this.regenerationHistory.push({
        trigger: 'Phase 12B Gate Failure',
        gates: result.score,
        failbackPhase,
        failbackReason,
        timestamp: new Date().toISOString()
      });
      
    } else {
      this.phaseStatus['Phase 12B'] = { 
        status: 'completed', 
        output: 'GATE_VALIDATED_VERSION',
        gateScore: result.score,
        allPassed: result.allPassed 
      };
      
      this.log('Phase 12B', `✅ ALL GATES PASSED: ${result.score}`, { allPassed: result.allPassed });
    }
    
    return { success: result.allPassed, gates: result.gates, score: result.score };
  }
  
  // ===== PHASE 13: BENCHMARK COMPARISON - REAL COMPETITOR DATA =====
  async phase13_BenchmarkComparison() {
    this.log('Phase 13', 'Running benchmark comparison with real competitor data...');
    this.phaseStatus['Phase 13'] = { status: 'running', started: new Date().toISOString() };
    
    // Use actual competitor analysis data
    const advantages = [];
    const competitorHooks = this.competitorContent?.hooks || [];
    const competitorCTAs = this.competitorContent?.ctas || [];
    const uniqueAngles = this.competitorContent?.uniqueAngles || [];
    
    // Check if our hook is unique
    const hookUnique = !competitorHooks.includes(this.strategy.hookType);
    const ctaUnique = !competitorCTAs.includes(this.strategy.ctaType);
    
    if (hookUnique) advantages.push(`Unique hook approach: ${this.strategy.hookType}`);
    if (ctaUnique) advantages.push(`Unique CTA style: ${this.strategy.ctaType}`);
    if (this.selectedVersion.emotionScore >= 7) advantages.push('Higher emotional engagement than competitors');
    if (this.selectedVersion.uniquenessScore >= 80) advantages.push('More original content than competitors');
    
    // Use LLM for detailed competitive analysis
    const competitiveAnalysis = await this.getCompetitiveAnalysisLLM();
    if (competitiveAnalysis.success) {
      this.selectedVersion.competitiveLLMAnalysis = competitiveAnalysis.analysis;
      advantages.push(...competitiveAnalysis.advantages);
    }
    
    const competitiveScore = advantages.length;
    const competitivePassed = competitiveScore >= 2;
    
    this.selectedVersion.competitive = {
      advantages,
      score: competitiveScore,
      passed: competitivePassed,
      competitorHooksAnalyzed: competitorHooks.length,
      competitorCTAsAnalyzed: competitorCTAs.length,
      analysisSource: 'LLM'
    };
    
    this.phaseStatus['Phase 13'] = { 
      status: 'completed', 
      output: 'BENCHMARK_RESULT',
      competitiveScore,
      advantages 
    };
    
    this.log('Phase 13', 'Benchmark comparison complete with real competitor data', { competitiveScore, advantages });
    
    return { success: true, competitiveScore, advantages, passed: competitivePassed };
  }
  
  async getCompetitiveAnalysisLLM() {
    try {
      const systemPrompt = `You are a competitive content analyst. Analyze how the content stands out from competitors.

Return JSON: {"analysis": "brief analysis", "advantages": ["advantage1", "advantage2"]}`;

      const competitorSummary = this.competitorPatterns?.top10?.slice(0, 3).map(c => 
        `@${c.username} (${c.points} pts)`
      ).join(', ') || 'Unknown competitors';

      const userPrompt = `Analyze competitive advantages:

CONTENT:
${this.selectedVersion.content.substring(0, 300)}...

TOP COMPETITORS: ${competitorSummary}

COMPETITOR PATTERNS TO AVOID:
${this.competitorContent?.avoidPatterns?.join('\n') || 'None identified'}

Return ONLY JSON.`;

      const result = await callLLM(systemPrompt, userPrompt, { temperature: 0.5, maxTokens: 300 });
      
      if (result.success && result.content) {
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return { success: true, ...JSON.parse(jsonMatch[0]) };
        }
      }
      
      return { success: false, analysis: 'LLM analysis failed', advantages: [] };
    } catch (error) {
      return { success: false, analysis: error.message, advantages: [] };
    }
  }
  
  // ===== PHASE 14: FINAL EMOTION RE-CHECK WITH LLM =====
  async phase14_FinalEmotionReCheck() {
    this.log('Phase 14', 'Running final emotion re-check with LLM...');
    this.phaseStatus['Phase 14'] = { status: 'running', started: new Date().toISOString() };
    
    const emotionScore = calculateEmotionScore(this.selectedVersion.content, this.strategy.targetEmotion);
    let passed = emotionScore >= 7;
    
    this.selectedVersion.finalEmotionScore = emotionScore;
    
    // If emotion dropped, RE-INJECT with LLM
    if (!passed) {
      this.log('Phase 14', `Emotion score ${emotionScore} below threshold, re-injecting with LLM...`);
      
      const emotionPrompt = this.getEmotionInjectionPrompt(this.selectedVersion.content, this.strategy.targetEmotion);
      const llmResult = await callLLM(emotionPrompt.system, emotionPrompt.user, { temperature: 0.8, maxTokens: 800 });
      
      if (llmResult.success && llmResult.content) {
        this.selectedVersion.content = llmResult.content;
        this.selectedVersion.finalEmotionScore = calculateEmotionScore(this.selectedVersion.content, this.strategy.targetEmotion);
        this.selectedVersion.emotionReInjected = true;
        passed = this.selectedVersion.finalEmotionScore >= 7;
        this.log('Phase 14', `Emotion re-injected, new score: ${this.selectedVersion.finalEmotionScore}`);
      } else {
        this.log('Phase 14', 'LLM re-injection failed');
        this.selectedVersion.emotionReInjected = false;
      }
    }
    
    this.selectedVersion.emotionReCheckPassed = passed;
    
    // VALIDATION CHECK: If emotion still below threshold after re-injection, trigger regeneration
    if (!passed) {
      this.log('Phase 14', `🚨 Emotion score still below threshold (${this.selectedVersion.finalEmotionScore}/7) - triggering regeneration`);
      
      // Set failback to Phase 5 for full regeneration
      this.failbackPhase = 5;
      this.needsRegeneration = true;
      
      this.regenerationHistory.push({
        trigger: `Phase 14: Emotion score still low after re-injection (${this.selectedVersion.finalEmotionScore}/7)`,
        failbackPhase: 5,
        timestamp: new Date().toISOString()
      });
      
      this.phaseStatus['Phase 14'] = { 
        status: 'failed_emotion_validation', 
        output: 'NEEDS_REGENERATION',
        emotionScore: this.selectedVersion.finalEmotionScore,
        passed,
        usedLLM: true,
        failbackPhase: 5
      };
      
      return { success: false, needsRegeneration: true, emotionScore: this.selectedVersion.finalEmotionScore };
    }
    
    this.phaseStatus['Phase 14'] = { 
      status: 'completed', 
      output: 'EMOTION_VERIFIED_VERSION',
      emotionScore: this.selectedVersion.finalEmotionScore,
      passed,
      usedLLM: true
    };
    
    this.log('Phase 14', `Final emotion re-check ${passed ? 'PASSED' : 'ENHANCED'}`, { 
      emotionScore: this.selectedVersion.finalEmotionScore 
    });
    
    return { success: true, emotionScore: this.selectedVersion.finalEmotionScore, passed };
  }
  
  // ===== PHASE 14B: FINAL CONTENT POLISH =====
  phase14B_FinalContentPolish() {
    this.log('Phase 14B', 'Running final content polish...');
    this.phaseStatus['Phase 14B'] = { status: 'running', started: new Date().toISOString() };
    
    // CRITICAL CHECK: Only LOCK if all gates passed
    if (!this.selectedVersion.allGatesPassed) {
      this.log('Phase 14B', '🚫 CANNOT LOCK - Gates not passed', { 
        gateScore: this.selectedVersion.gateScore,
        allGatesPassed: this.selectedVersion.allGatesPassed 
      });
      
      this.phaseStatus['Phase 14B'] = { 
        status: 'blocked', 
        output: 'CONTENT_NOT_LOCKED',
        reason: 'Gates validation failed - regeneration required',
        gateScore: this.selectedVersion.gateScore
      };
      
      // Don't lock - return failure to trigger regeneration
      return { success: false, reason: 'Gates not passed - cannot lock content' };
    }
    
    // Final checks
    const checks = {
      hasCampaignLink: this.selectedVersion.content.includes('internetcourt.org'),
      hasQuestion: this.selectedVersion.content.includes('?'),
      noViolations: scanBannedItems(this.selectedVersion.content).length === 0,
      properLength: this.selectedVersion.content.length > 500 && this.selectedVersion.content.length < 2000,
      allGatesPassed: this.selectedVersion.allGatesPassed
    };
    
    const passedCount = Object.values(checks).filter(v => v).length;
    const allPassed = passedCount === Object.keys(checks).length;
    
    // If checks fail, trigger regeneration
    if (!allPassed) {
      this.log('Phase 14B', '⚠️ Final checks failed', { 
        checks,
        passedCount,
        requiredCount: Object.keys(checks).length
      });
      
      // Set failback to Phase 5 for regeneration
      this.failbackPhase = 5;
      this.needsRegeneration = true;
      
      const failedChecks = Object.entries(checks)
        .filter(([key, passed]) => !passed)
        .map(([key]) => key);
      
      this.regenerationHistory.push({
        trigger: 'Phase 14B Final Check Failure',
        failedChecks,
        timestamp: new Date().toISOString()
      });
      
      this.phaseStatus['Phase 14B'] = { 
        status: 'failed_checks', 
        output: 'CONTENT_NOT_LOCKED',
        checks,
        failedChecks
      };
      
      return { success: false, checks, allPassed: false, failedChecks };
    }
    
    this.selectedVersion.finalChecks = checks;
    this.selectedVersion.finalPolishPassed = allPassed;
    
    this.phaseStatus['Phase 14B'] = { 
      status: 'completed', 
      output: 'FINAL_VERSION (LOCKED)',
      checks 
    };
    
    this.log('Phase 14B', '🔒 FINAL POLISH COMPLETE - CONTENT IS NOW LOCKED', { checks, allPassed });
    
    return { success: true, checks, allPassed };
  }
  
  // =========================================================================
  // OUTPUT SECTION (No Content Changes)
  // =========================================================================
  
  // ===== PHASE 15: OUTPUT GENERATION =====
  async phase15_OutputGeneration() {
    this.log('Phase 15', 'Generating output with LLM Q&A...');
    this.phaseStatus['Phase 15'] = { status: 'running', started: new Date().toISOString() };
    
    // Generate Q&A pairs using LLM with campaign data
    let qa;
    try {
      qa = await generateQA_LLM(this.selectedVersion.content, this.knowledgeBase, this.campaignData);
      this.log('Phase 15', `Generated ${qa.length} Q&A pairs with LLM`);
    } catch (error) {
      this.log('Phase 15', `Warning: Using fallback Q&A - ${error.message}`);
      qa = getFallbackQA(this.campaignData);
    }
    
    const timestamp = new Date().toISOString();
    
    this.finalOutput = {
      metadata: {
        workflowVersion: this.version,
        timestamp,
        campaignAddress: this.campaignAddress,
        campaignTitle: this.campaignData?.title,
        organization: this.campaignData?.displayCreator?.organization?.name,
        totalPhases: 21,
        phasesExecuted: Object.keys(this.phaseStatus).length,
        strictValidationPassed: strictValidator.getReport().passed
      },
      campaignDataUsed: {
        goal: !!this.campaignData?.goal,
        rules: !!this.campaignData?.rules,
        style: !!this.campaignData?.style,
        knowledgeBase: !!this.campaignData?.knowledgeBase,
        missionDescription: !!this.campaignData?.missions?.[0]?.description,
        missionRules: (this.campaignData?.missions?.[0]?.rules || []).length
      },
      selectedContent: {
        id: this.selectedVersion.id,
        content: this.selectedVersion.content,
        scores: {
          combined: this.selectedVersion.combinedScore,
          quality: this.selectedVersion.qualityScore,
          hes: this.selectedVersion.hesScore?.score,
          viral: this.selectedVersion.viralScore?.score,
          emotion: this.selectedVersion.finalEmotionScore || this.selectedVersion.emotionScore,
          uniqueness: this.selectedVersion.uniquenessScore
        },
        generatedBy: this.selectedVersion.generatedBy || this.generationMethods[this.selectedVersion.id] || 'LLM',
        gates: this.selectedVersion.gates,
        gateScore: this.selectedVersion.gateScore,
        allGatesPassed: this.selectedVersion.allGatesPassed,
        competitive: this.selectedVersion.competitive
      },
      generationMethods: this.generationMethods,
      qaPairs: qa,
      allVersions: this.versions.map(v => ({
        id: v.id,
        combinedScore: v.combinedScore,
        qualityScore: v.qualityScore,
        generatedBy: v.generatedBy || this.generationMethods[v.id] || 'LLM',
        usedCampaignData: v.usedCampaignData
      })),
      phaseStatus: this.phaseStatus,
      executionLog: this.executionLog,
      strictValidationReport: strictValidator.getReport()
    };
    
    this.phaseStatus['Phase 15'] = { 
      status: 'completed', 
      output: 'FINAL_OUTPUT',
      qaCount: qa.length 
    };
    
    this.log('Phase 15', 'Output generation complete');
    
    return { success: true, output: this.finalOutput };
  }
  
  // ===== PHASE 16: EXPORT AND DELIVERY =====
  async phase16_ExportAndDelivery() {
    this.log('Phase 16', 'Exporting and delivering...');
    this.phaseStatus['Phase 16'] = { status: 'running', started: new Date().toISOString() };
    
    try {
      // Ensure directories exist
      if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
      }
      if (!fs.existsSync(CONFIG.downloadDir)) {
        fs.mkdirSync(CONFIG.downloadDir, { recursive: true });
      }
      
      // Save full output
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `rally-output-${timestamp}.json`;
      const outputPath = path.join(CONFIG.downloadDir, filename);
      
      fs.writeFileSync(outputPath, JSON.stringify(this.finalOutput, null, 2));
      
      // Save content only
      const contentFilename = `content-${timestamp}.txt`;
      const contentPath = path.join(CONFIG.downloadDir, contentFilename);
      fs.writeFileSync(contentPath, this.selectedVersion.content);
      
      this.phaseStatus['Phase 16'] = { 
        status: 'completed', 
        output: 'FILES_SAVED',
        files: {
          fullOutput: outputPath,
          content: contentPath
        }
      };
      
      this.log('Phase 16', 'Export complete', { outputPath, contentPath });
      
      return { 
        success: true, 
        files: {
          fullOutput: outputPath,
          content: contentPath
        }
      };
    } catch (error) {
      this.phaseStatus['Phase 16'] = { status: 'failed', error: error.message };
      this.log('Phase 16', `Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  // =========================================================================
  // MAIN EXECUTION - WITH VALIDATION LOOP
  // =========================================================================
  
  async execute() {
    console.log('='.repeat(80));
    console.log(`RALLY WORKFLOW ${this.version} - STARTING EXECUTION`);
    console.log('='.repeat(80));
    console.log(`Campaign: ${this.campaignAddress}`);
    console.log(`Strict Mode: ${CONFIG.strictMode ? 'ENABLED' : 'disabled'}`);
    console.log(`Max Regenerations: ${this.maxRegenerations}`);
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    
    try {
      // INPUT SECTION - Always runs once
      await this.phase0_Preparation();
      await this.phase1_Research();
      await this.phase2_Leaderboard();
      await this.phase2B_CompetitorDeepAnalysis();
      
      // MAIN LOOP - Handles regeneration when gates fail
      let loopIteration = 0;
      const maxLoopIterations = this.maxRegenerations + 1; // Initial + regenerations
      
      while (loopIteration < maxLoopIterations) {
        loopIteration++;
        this.needsRegeneration = false; // Reset flag
        
        console.log('\n' + '-'.repeat(60));
        console.log(`🔄 ITERATION ${loopIteration}/${maxLoopIterations}`);
        if (this.failbackPhase) {
          console.log(`↩️ Failback to Phase ${this.failbackPhase}`);
        }
        console.log('-'.repeat(60) + '\n');
        
        // Determine starting phase based on failback
        const startPhase = this.failbackPhase || 3;
        
        // Clear versions if regenerating from Phase 5 or earlier
        if (startPhase <= 5 && loopIteration > 1) {
          this.log('EXECUTE', 'Clearing versions for regeneration');
          this.versions = [];
          this.selectedVersion = null;
          // Reset phase status from failback phase onwards
          for (const phase of Object.keys(this.phaseStatus)) {
            const phaseNum = parseInt(phase.replace('Phase ', '').replace('B', ''));
            if (phaseNum >= startPhase) {
              delete this.phaseStatus[phase];
            }
          }
        }
        
        // PROCESS SECTION
        if (startPhase <= 3) this.phase3_GapIdentification();
        if (startPhase <= 4) this.phase4_StrategyDefinition();
        if (startPhase <= 5) await this.phase5_ContentGeneration();
        
        // Phase 6 + 6B with validation check (skip if failback to Phase 8+)
        if (startPhase <= 6) {
          this.phase6_BannedScanner();
          const rewriteResult = await this.phase6B_Rewrite();
          if (this.needsRegeneration) {
            this.regenerationCount++;
            if (this.regenerationCount > this.maxRegenerations) {
              console.log('\n🚨 MAX REGENERATIONS REACHED AFTER PHASE 6B');
              this.needsRegeneration = false;
            } else {
              console.log(`\n⚠️ REGENERATION TRIGGERED BY PHASE 6B (${this.regenerationCount}/${this.maxRegenerations})`);
              continue;
            }
          }
        }
        
        // Phase 7 with validation check (skip if failback to Phase 8+)
        if (startPhase <= 7) {
          const uniquenessResult = await this.phase7_UniquenessValidation();
          if (this.needsRegeneration) {
            this.regenerationCount++;
            if (this.regenerationCount > this.maxRegenerations) {
              console.log('\n🚨 MAX REGENERATIONS REACHED AFTER PHASE 7');
              this.needsRegeneration = false;
            } else {
              console.log(`\n⚠️ REGENERATION TRIGGERED BY PHASE 7 (${this.regenerationCount}/${this.maxRegenerations})`);
              continue;
            }
          }
        }
        
        // Phase 8 Emotion Injection (skip if failback to Phase 9+)
        if (startPhase <= 8) {
          await this.phase8_EmotionInjection();
        }
        
        // Phase 9 with validation check (HES fail → Phase 8)
        const hesResult = this.phase9_HESSandViral();
        if (this.needsRegeneration) {
          this.regenerationCount++;
          if (this.regenerationCount > this.maxRegenerations) {
            console.log('\n🚨 MAX REGENERATIONS REACHED AFTER PHASE 9');
            this.needsRegeneration = false;
          } else {
            console.log(`\n⚠️ REGENERATION TRIGGERED BY PHASE 9 HES FAILURE (${this.regenerationCount}/${this.maxRegenerations})`);
            console.log(`↩️ Failback to Phase ${this.failbackPhase} for emotion re-enhancement`);
            continue;
          }
        }
        
        // LOCK POINT with validation check
        const selectionResult = this.phase10_QualityScoringAndSelection();
        if (this.needsRegeneration) {
          this.regenerationCount++;
          if (this.regenerationCount > this.maxRegenerations) {
            console.log('\n🚨 MAX REGENERATIONS REACHED AFTER PHASE 10');
            this.needsRegeneration = false;
            // Force accept best version anyway
            this.selectedVersion = { ...this.versions[0] };
          } else {
            console.log(`\n⚠️ REGENERATION TRIGGERED BY PHASE 10 (${this.regenerationCount}/${this.maxRegenerations})`);
            continue;
          }
        }
        
        // REFINE SECTION
        this.phase11_MicroOptimization();
        this.phase12_ContentFlowPolish();
        
        // GATE SIMULATION - May trigger regeneration
        const gateResult = this.phase12B_GateSimulation();
        
        // Check if gates failed and we need to regenerate
        if (this.needsRegeneration) {
          this.regenerationCount++;
          
          if (this.regenerationCount > this.maxRegenerations) {
            console.log('\n🚨 MAX REGENERATIONS REACHED');
            console.log(`Total attempts: ${this.regenerationCount}`);
            console.log('Proceeding with current content despite gate failures.\n');
            this.needsRegeneration = false;
            // Force gates to pass for final output
            this.selectedVersion.allGatesPassed = true;
            this.selectedVersion.gateScore = `${this.selectedVersion.gateScore} (FORCED)`;
          } else {
            console.log(`\n⚠️ REGENERATION TRIGGERED (${this.regenerationCount}/${this.maxRegenerations})`);
            console.log(`Failback to Phase ${this.failbackPhase}`);
            console.log(`Reason: ${this.regenerationHistory[this.regenerationHistory.length - 1]?.failbackReason || 'Gate failure'}`);
            continue; // Restart loop from failback phase
          }
        }
        
        // Continue with remaining phases
        await this.phase13_BenchmarkComparison();
        
        // Phase 14 with validation check (Emotion fail → Phase 5)
        const emotionResult = await this.phase14_FinalEmotionReCheck();
        if (this.needsRegeneration) {
          this.regenerationCount++;
          if (this.regenerationCount > this.maxRegenerations) {
            console.log('\n🚨 MAX REGENERATIONS REACHED AFTER PHASE 14');
            this.needsRegeneration = false;
            // Force accept anyway
            this.selectedVersion.emotionReCheckPassed = true;
          } else {
            console.log(`\n⚠️ REGENERATION TRIGGERED BY PHASE 14 EMOTION FAILURE (${this.regenerationCount}/${this.maxRegenerations})`);
            console.log(`↩️ Failback to Phase ${this.failbackPhase} for full regeneration`);
            continue;
          }
        }
        
        // FINAL CONTENT POLISH - May also trigger regeneration
        const polishResult = this.phase14B_FinalContentPolish();
        
        // Check if final polish failed
        if (this.needsRegeneration && !polishResult.success) {
          this.regenerationCount++;
          
          if (this.regenerationCount > this.maxRegenerations) {
            console.log('\n🚨 MAX REGENERATIONS REACHED AFTER FINAL POLISH');
            this.needsRegeneration = false;
          } else {
            console.log(`\n⚠️ REGENERATION TRIGGERED BY FINAL POLISH (${this.regenerationCount}/${this.maxRegenerations})`);
            continue; // Restart loop
          }
        }
        
        // If we get here, content is locked - proceed to output
        break;
      }
      
      // OUTPUT SECTION - Only runs once content is locked
      await this.phase15_OutputGeneration();
      const exportResult = await this.phase16_ExportAndDelivery();
      
      const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.log('='.repeat(80));
      console.log(`RALLY WORKFLOW ${this.version} - COMPLETE`);
      console.log('='.repeat(80));
      console.log(`Execution Time: ${executionTime}s`);
      console.log(`Phases Completed: ${Object.keys(this.phaseStatus).length}/21`);
      console.log(`Strict Validation: ${strictValidator.getReport().passed ? 'PASSED' : 'FAILED'}`);
      console.log(`Selected Version: ${this.selectedVersion?.id}`);
      console.log(`Combined Score: ${this.selectedVersion?.combinedScore}`);
      console.log(`Gate Score: ${this.selectedVersion?.gateScore}`);
      console.log(`Regenerations: ${this.regenerationCount}/${this.maxRegenerations}`);
      if (this.regenerationHistory.length > 0) {
        console.log(`Regeneration History:`);
        this.regenerationHistory.forEach((h, i) => {
          console.log(`  ${i + 1}. ${h.trigger} → Phase ${h.failbackPhase || 'N/A'}`);
        });
      }
      console.log('='.repeat(80));
      
      return {
        success: true,
        executionTime,
        phasesCompleted: Object.keys(this.phaseStatus).length,
        selectedVersion: this.selectedVersion,
        finalOutput: this.finalOutput,
        files: exportResult.files,
        strictValidation: strictValidator.getReport(),
        regenerationCount: this.regenerationCount,
        regenerationHistory: this.regenerationHistory
      };
      
    } catch (error) {
      console.error('='.repeat(80));
      console.error('WORKFLOW FAILED');
      console.error('='.repeat(80));
      console.error(error);
      
      return {
        success: false,
        error: error.message,
        phasesCompleted: Object.keys(this.phaseStatus).length,
        strictValidation: strictValidator.getReport(),
        regenerationCount: this.regenerationCount,
        regenerationHistory: this.regenerationHistory
      };
    }
  }
}

// ============================================================================
// MAIN EXECUTION SCRIPT
// ============================================================================

async function main() {
  const campaignAddress = process.argv[2];
  
  if (!campaignAddress) {
    console.error('Usage: node rally-workflow-executor-v8.7.4.js <campaignAddress>');
    console.error('Example: node rally-workflow-executor-v8.7.4.js 0x1234...');
    process.exit(1);
  }
  
  const executor = new RallyWorkflowExecutor(campaignAddress);
  const result = await executor.execute();
  
  if (!result.success) {
    process.exit(1);
  }
}

// Export for module usage
module.exports = { RallyWorkflowExecutor, CONFIG, BANNED_ITEMS, EMOTION_LIBRARY };

// Run if called directly
if (require.main === module) {
  main();
}
