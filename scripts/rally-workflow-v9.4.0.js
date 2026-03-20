/**
 * RALLY WORKFLOW V9.4.0 - MULTI-PROVIDER EDITION
 * 
 * Fitur:
 * ✅ Multi-LLM Provider Support (SDK, Groq, Gemini, Together, OpenRouter, Custom)
 * ✅ Auto-fallback ke provider lain jika satu gagal
 * ✅ Easy API key configuration
 * ✅ Rally API data fetch (campaign, leaderboard, submissions)
 * ✅ Multi-LLM Judging System (3 independent judges)
 * ✅ Blind Judging - tanpa bias dari campaign goal/style
 * ✅ Content generation dengan validasi ketat
 * 
 * Usage:
 *   node scripts/rally-workflow-v9.4.0.js [campaign_address_or_name]
 * 
 * Provider Priority (edit CONFIG.providers below):
 *   1. Set enabled: true untuk provider yang punya API key valid
 *   2. Workflow akan coba provider dalam urutan yang ditentukan
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Dynamic import for ESM module
let ZAI = null;
async function initZAI() {
  if (!ZAI) {
    const module = await import('z-ai-web-dev-sdk');
    ZAI = module.default;
  }
  return ZAI;
}

// ============================================================================
// CONFIGURATION - EDIT API KEYS HERE
// ============================================================================

const CONFIG = {
  rallyApiBase: 'https://app.rally.fun/api',
  outputDir: '/home/z/my-project/download',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MULTI-PROVIDER CONFIGURATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Set enabled: true untuk provider yang memiliki API key valid
  // Workflow akan mencoba provider dalam urutan prioritas (priority field)
  
  providers: {
    // Provider 1: z-ai-web-dev-sdk (Built-in SDK)
    // Rate limit: Varies (currently rate-limited)
    sdk: {
      enabled: true,
      priority: 1,
      name: 'z-ai-web-dev-sdk',
      type: 'sdk',
      models: {
        chat: 'default',
        fast: 'default'
      }
    },
    
    // Provider 2: Groq API (FREE - 14M tokens/month)
    // Get key: https://console.groq.com/keys
    groq: {
      enabled: false, // Set true jika API key valid
      priority: 2,
      name: 'Groq',
      type: 'openai-compatible',
      apiKey: '', // PASTE YOUR GROQ API KEY HERE
      baseUrl: 'https://api.groq.com/openai/v1',
      models: {
        chat: 'llama-3.3-70b-versatile',
        fast: 'llama-3.1-8b-instant'
      }
    },
    
    // Provider 3: Gemini API (FREE - 60 req/min)
    // Get key: https://aistudio.google.com/app/apikey
    // NOTE: May be region blocked. Use VPN if needed.
    gemini: {
      enabled: false, // Set true jika API key valid
      priority: 3,
      name: 'Gemini',
      type: 'gemini',
      apiKey: '', // PASTE YOUR GEMINI API KEY HERE
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      models: {
        chat: 'gemini-1.5-flash',
        fast: 'gemini-1.5-flash'
      }
    },
    
    // Provider 4: Together AI (FREE $1 credit)
    // Get key: https://api.together.ai/settings/api-keys
    together: {
      enabled: false, // Set true jika API key valid
      priority: 4,
      name: 'Together AI',
      type: 'openai-compatible',
      apiKey: '',
      baseUrl: 'https://api.together.xyz/v1',
      models: {
        chat: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        fast: 'meta-llama/Llama-3.2-3B-Instruct-Turbo'
      }
    },
    
    // Provider 5: OpenRouter (Multiple models, some FREE)
    // Get key: https://openrouter.ai/keys
    openrouter: {
      enabled: false, // Set true jika API key valid
      priority: 5,
      name: 'OpenRouter',
      type: 'openai-compatible',
      apiKey: '',
      baseUrl: 'https://openrouter.ai/api/v1',
      models: {
        chat: 'meta-llama/llama-3.3-70b-instruct:free',
        fast: 'meta-llama/llama-3.2-3b-instruct:free'
      }
    },
    
    // Provider 6: DeepSeek (FREE tier available)
    // Get key: https://platform.deepseek.com/api_keys
    deepseek: {
      enabled: false, // Set true jika API key valid
      priority: 6,
      name: 'DeepSeek',
      type: 'openai-compatible',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com/v1',
      models: {
        chat: 'deepseek-chat',
        fast: 'deepseek-chat'
      }
    }
  },
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // Scoring thresholds
  thresholds: {
    gateUtama: { pass: 16, max: 20 },
    gateTambahan: { pass: 14, max: 16 },
    penilaianInternal: { pass: 54, max: 60 }
  },
  
  // Retry settings
  retry: {
    maxAttempts: 3,
    delayMs: 2000
  },
  
  // Hard requirements untuk penilaian
  hardRequirements: {
    bannedWords: [
      'guaranteed', 'guarantee', '100%', 'risk-free', 'sure thing',
      'financial advice', 'investment advice', 'buy now', 'sell now',
      'get rich', 'quick money', 'easy money', 'passive income',
      'follow me', 'subscribe to my', 'check my profile',
      'click here', 'limited time offer', 'act now',
      'legally binding', 'court order', 'official ruling'
    ],
    aiPatterns: {
      words: ['delve', 'leverage', 'realm', 'tapestry', 'paradigm', 'landscape', 'nuance', 'underscores', 'pivotal', 'crucial'],
      phrases: ['picture this', 'lets dive in', 'in this thread', 'key takeaways', 'heres the thing', 'imagine a world', 'it goes without saying', 'at the end of the day'],
      templateHooks: ['unpopular opinion', 'hot take', 'thread alert', 'breaking', 'this is your sign', 'psa', 'reminder that', 'quick thread', 'important thread', 'drop everything', 'stop scrolling', 'hear me out', 'let me explain', 'nobody is talking about', 'story time']
    },
    weakOpenings: ['the ', 'a ', 'an ', 'this is', 'there are', 'there is', 'i think', 'in the', 'today ', 'so ', 'well ', 'basically', 'honestly ', 'actually ', 'first ', 'let me', 'here is', 'here are'],
    powerPatterns: [
      /^\$\d+/i,
      /^\d+/i,
      /^(what|who|why|how|when|where|which)/i,
      /^(imagine|picture|consider|think)/i,
      /^(no|wrong|false|never|stop|don't)/i,
      /^i (lost|failed|got|spent|wasted|built)/i,
      /^(warning|alert|urgent|breaking|stop|wait)/i
    ]
  },
  
  emotionTriggers: {
    fear: ['risk', 'danger', 'threat', 'warning', 'scary', 'terrifying', 'afraid', 'worried', 'nightmare'],
    curiosity: ['wonder', 'curious', 'secret', 'hidden', 'mystery', 'discover', 'surprising', 'unexpected'],
    surprise: ['unexpected', 'shocking', 'surprised', 'blew my mind', 'plot twist', 'wait what', 'finally', 'breakthrough'],
    hope: ['finally', 'breakthrough', 'opportunity', 'potential', 'future', 'imagine', 'possible'],
    pain: ['lost', 'failed', 'broke', 'destroyed', 'killed', 'wasted', 'missed', 'regret', 'hurt', 'pain'],
    urgency: ['now', 'today', 'immediately', 'urgent', 'quickly', 'fast', 'running out']
  },
  
  bodyFeelings: [
    'cold sweat', 'panic', 'anxiety', 'heart racing', 'stomach dropped', 
    'heart sank', 'chest tightened', 'jaw dropped', "couldn't believe"
  ]
};

// ============================================================================
// MULTI-PROVIDER LLM CLIENT
// ============================================================================

class MultiProviderLLM {
  constructor(config) {
    this.config = config;
    this.providers = this.getEnabledProviders();
    this.currentProviderIndex = 0;
  }
  
  getEnabledProviders() {
    return Object.entries(this.config.providers)
      .filter(([key, provider]) => provider.enabled)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([key, provider]) => ({ key, ...provider }));
  }
  
  async chat(messages, options = {}) {
    const errors = [];
    
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      this.currentProviderIndex = i;
      
      console.log(`   🤖 Using provider: ${provider.name} (${provider.key})`);
      
      try {
        let result;
        
        switch (provider.type) {
          case 'sdk':
            result = await this.callSDK(messages, options, provider);
            break;
          case 'openai-compatible':
            result = await this.callOpenAICompatible(messages, options, provider);
            break;
          case 'gemini':
            result = await this.callGemini(messages, options, provider);
            break;
          default:
            throw new Error(`Unknown provider type: ${provider.type}`);
        }
        
        console.log(`   ✅ ${provider.name} response received`);
        return result;
        
      } catch (error) {
        errors.push({ provider: provider.name, error: error.message });
        console.log(`   ❌ ${provider.name} failed: ${error.message}`);
        
        // Try next provider
        if (i < this.providers.length - 1) {
          console.log(`   ⏭️ Trying next provider...`);
        }
      }
    }
    
    // All providers failed
    throw new Error(`All providers failed:\n${errors.map(e => `  - ${e.provider}: ${e.error}`).join('\n')}`);
  }
  
  async callSDK(messages, options, provider) {
    const ZAIClass = await initZAI();
    const zai = await ZAIClass.create();
    
    const completion = await zai.chat.completions.create({
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000
    });
    
    return {
      content: completion.choices[0]?.message?.content || '',
      provider: 'sdk',
      model: 'default',
      usage: completion.usage
    };
  }
  
  async callOpenAICompatible(messages, options, provider) {
    if (!provider.apiKey) {
      throw new Error('No API key configured');
    }
    
    const body = JSON.stringify({
      model: options.fast ? provider.models.fast : provider.models.chat,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000
    });
    
    const response = await this.httpRequest(
      `${provider.baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`
        },
        body: body
      }
    );
    
    if (response.status !== 200) {
      const errorData = JSON.parse(response.data);
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    
    const data = JSON.parse(response.data);
    return {
      content: data.choices[0]?.message?.content || '',
      provider: provider.key,
      model: data.model,
      usage: data.usage
    };
  }
  
  async callGemini(messages, options, provider) {
    if (!provider.apiKey) {
      throw new Error('No API key configured');
    }
    
    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    const body = JSON.stringify({
      contents: contents,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 4000
      }
    });
    
    const model = options.fast ? provider.models.fast : provider.models.chat;
    const url = `${provider.baseUrl}/models/${model}:generateContent?key=${provider.apiKey}`;
    
    const response = await this.httpRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });
    
    if (response.status !== 200) {
      const errorData = JSON.parse(response.data);
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    
    const data = JSON.parse(response.data);
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      provider: 'gemini',
      model: model,
      usage: data.usageMetadata
    };
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
      
      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }
}

// ============================================================================
// JUDGE PROMPTS - BLIND JUDGING
// ============================================================================

const JUDGE_PROMPTS = {
  judge1: {
    system: `Kamu adalah JUDGE 1 - Penilai Gate Utama Rally.

═══════════════════════════════════════════════════════════════
PRINSIP PENILAIAN:
═══════════════════════════════════════════════════════════════

1. Kamu TIDAK tahu siapa pembuat konten
2. Kamu TIDAK tahu tujuan spesifik campaign
3. Kamu HANYA menilai berdasarkan STANDAR KUALITAS
4. Lebih baik nilai rendah tapi jujur
5. Jangan kompromi - standar adalah standar

═══════════════════════════════════════════════════════════════
G1: CONTENT ALIGNMENT (0-5)
═══════════════════════════════════════════════════════════════

├── 0 = Tidak ada kesesuaian sama sekali
├── 1 = Kesesuaian sangat rendah (<25%)
├── 2 = Kesesuaian rendah (25-50%)
├── 3 = Kesesuaian cukup (50-75%)
├── 4 = Kesesuaian baik (75-90%)
└── 5 = Kesesuaian sempurna (>90%)

═══════════════════════════════════════════════════════════════
G2: INFORMATION ACCURACY (0-5)
═══════════════════════════════════════════════════════════════

├── 0 = Informasi salah/sesat
├── 1 = Banyak kesalahan factual
├── 2 = Beberapa kesalahan
├── 3 = Akurasi cukup, minor errors
├── 4 = Akurasi baik, hampir tanpa error
└── 5 = 100% akurat

═══════════════════════════════════════════════════════════════
G3: CAMPAIGN COMPLIANCE (0-5)
═══════════════════════════════════════════════════════════════

├── 0 = Tidak memenuhi requirement sama sekali
├── 1 = Memenuhi <25% requirement
├── 2 = Memenuhi 25-50% requirement
├── 3 = Memenuhi 50-75% requirement
├── 4 = Memenuhi 75-99% requirement
└── 5 = Memenuhi 100% requirement

═══════════════════════════════════════════════════════════════
G4: ORIGINALITY (0-5)
═══════════════════════════════════════════════════════════════

├── 0 = Copy-paste/template murni
├── 1 = Sangat mirip template/kompetitor
├── 2 = Ada unsur original tapi dominan template
├── 3 = Cukup original dengan beberapa pola umum
├── 4 = Original dengan sudut pandang unik
└── 5 = Sangat original, perspektif segar

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (WAJIB JSON):
═══════════════════════════════════════════════════════════════

{
  "G1_contentAlignment": {
    "score": <0-5>,
    "reasoning": "<penjelasan singkat>"
  },
  "G2_informationAccuracy": {
    "score": <0-5>,
    "reasoning": "<penjelasan singkat>"
  },
  "G3_campaignCompliance": {
    "score": <0-5>,
    "reasoning": "<penjelasan singkat>"
  },
  "G4_originality": {
    "score": <0-5>,
    "reasoning": "<penjelasan singkat>"
  },
  "gateUtamaTotal": "<total>/20",
  "gateUtamaPass": <true/false>
}`,

    userTemplate: `KNOWLEDGE BASE (REFERENSI TOPIK):
{{knowledgeBase}}

REQUIRED URL (HARUS ADA):
{{requiredUrl}}

HARD REQUIREMENTS:
{{rules}}

BANNED WORDS:
{{bannedWords}}

COMPETITOR HOOKS (UNTUK CEK ORIGINALITY):
{{competitorHooks}}

═══════════════════════════════════════════════════════════════
KONTEN YANG DINILAI:
═══════════════════════════════════════════════════════════════

{{content}}

═══════════════════════════════════════════════════════════════

Berikan penilaian dalam format JSON sesuai sistem prompt.`
  },
  
  judge2: {
    system: `Kamu adalah JUDGE 2 - Penilai Gate Tambahan Rally.

═══════════════════════════════════════════════════════════════
PRINSIP PENILAIAN:
═══════════════════════════════════════════════════════════════

1. Kamu fokus pada ENGAGEMENT dan TECHNICAL QUALITY
2. Standar tinggi - harus 8/8 untuk PASS
3. Jangan kompromi - 7/8 = FAIL
4. Nilai berdasarkan bukti, bukan perasaan

═══════════════════════════════════════════════════════════════
G5: ENGAGEMENT POTENTIAL (0-8)
═══════════════════════════════════════════════════════════════

1. hookEffectiveness (0-2)
2. ctaQuality (0-2)
3. contentStructure (0-2)
4. conversationPotential (0-2)

═══════════════════════════════════════════════════════════════
G6: TECHNICAL QUALITY (0-8)
═══════════════════════════════════════════════════════════════

1. grammarSpelling (0-2)
2. formatting (0-2)
3. platformOptimization (0-2)
4. noProhibitedElements (0-2)

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (WAJIB JSON):
═══════════════════════════════════════════════════════════════

{
  "G5_engagementPotential": {
    "score": <0-8>,
    "breakdown": {
      "hookEffectiveness": <0-2>,
      "ctaQuality": <0-2>,
      "contentStructure": <0-2>,
      "conversationPotential": <0-2>
    },
    "reasoning": "<penjelasan>"
  },
  "G6_technicalQuality": {
    "score": <0-8>,
    "breakdown": {
      "grammarSpelling": <0-2>,
      "formatting": <0-2>,
      "platformOptimization": <0-2>,
      "noProhibitedElements": <0-2>
    },
    "reasoning": "<penjelasan>"
  },
  "gateTambahanTotal": "<total>/16",
  "gateTambahanPass": <true/false>
}`,

    userTemplate: `KONTEN YANG DINILAI:

{{content}}

Berikan penilaian dalam format JSON.`
  },
  
  judge3: {
    system: `Kamu adalah JUDGE 3 - Penilai Internal Rally.

═══════════════════════════════════════════════════════════════
PRINSIP PENILAIAN:
═══════════════════════════════════════════════════════════════

1. Kamu menilai aspek SUBSTANSIAL konten
2. Standar sangat tinggi - minimum 9/10 untuk PASS
3. Jika ada keraguan, nilai lebih rendah
4. Kualitas > Kuantitas

═══════════════════════════════════════════════════════════════
PENILAIAN (masing-masing 0-10):
═══════════════════════════════════════════════════════════════

1. HOOK SCORE - Power patterns +2, Weak openings -2
2. EMOTION SCORE - 2-3 emotion types + body feeling
3. CT (CALL-TO-ACTION) SCORE - Questions, reply baits
4. UNIQUENESS SCORE - No AI patterns, no template hooks
5. READABILITY SCORE - Sentence length, structure, breaks
6. VIRAL POTENTIAL SCORE - Controversy, emotion, share-worthy

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (WAJIB JSON):
═══════════════════════════════════════════════════════════════

{
  "hookScore": { "score": <0-10>, "reasoning": "..." },
  "emotionScore": { "score": <0-10>, "emotionTypes": [...], "reasoning": "..." },
  "ctScore": { "score": <0-10>, "elementsFound": [...], "reasoning": "..." },
  "uniquenessScore": { "score": <0-10>, "penaltiesFound": [...], "reasoning": "..." },
  "readabilityScore": { "score": <0-10>, "reasoning": "..." },
  "viralPotentialScore": { "score": <0-10>, "elementsFound": [...], "reasoning": "..." },
  "overallScore": <0-10>,
  "allPass": <true/false>
}`,

    userTemplate: `BANNED WORDS:
{{bannedWords}}

AI PATTERNS TO DETECT:
{{aiPatterns}}

COMPETITOR HOOKS (untuk uniqueness check):
{{competitorHooks}}

═══════════════════════════════════════════════════════════════
KONTEN YANG DINILAI:
═══════════════════════════════════════════════════════════════

{{content}}

Berikan penilaian dalam format JSON.`
  }
};

// ============================================================================
// CONTENT GENERATION PROMPTS
// ============================================================================

const CONTENT_PROMPTS = {
  system: `Kamu adalah CONTENT CREATOR untuk Rally.fun - platform content competition.

═══════════════════════════════════════════════════════════════
PRINSIP UTAMA:
═══════════════════════════════════════════════════════════════

1. ORIGINALITY = LIFE - Tidak boleh ada AI patterns, template hooks
2. EMOTION = ENGAGEMENT - Konten harus menggugah emosi
3. HOOK = FIRST IMPRESSION - Hook adalah 80% keberhasilan
4. CTA = CONVERSATION - Ajak reader untuk respond
5. NO FLUFF - Setiap kata harus punya tujuan

═══════════════════════════════════════════════════════════════
HOOK PRINCIPLES (BUKAN TEMPLATE):
═══════════════════════════════════════════════════════════════

Power Patterns (pilih SALAH SATU):
├── NUMBER + PROBLEM: "$50M locked. No key."
├── BOLD STATEMENT: "Code runs. Justice doesn't."
├── QUESTION + TENSION: "What happens when your smart contract disagrees?"
├── PERSONAL PAIN: "I watched $10K vanish into a black hole."
└── CONTRARIAN: "Everyone's wrong about dispute resolution."

WAJIB HINDARI:
├── ❌ Weak openings: "The...", "This is...", "There are..."
├── ❌ AI patterns: "Picture this", "Let me explain"
├── ❌ Template hooks: "Unpopular opinion", "Hot take"
└── ❌ Em dashes: Tidak boleh ada "—" di hook

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT:
═══════════════════════════════════════════════════════════════

Return JSON array with 3 content versions:
[
  {
    "version": 1,
    "hook": "<the hook>",
    "tweets": ["<tweet 1>", "<tweet 2>", "<tweet 3>", "<tweet 4>", "<tweet 5>"],
    "fullContent": "<all tweets joined with newlines>",
    "emotionTypes": ["fear", "curiosity"],
    "hookPattern": "<pattern used>"
  }
]`,

  userTemplate: `CAMPAIGN INFO:
├── Title: {{campaignTitle}}
├── Required URL: {{requiredUrl}}
└── Knowledge Base: {{knowledgeBase}}

COMPETITOR HOOKS (HINDARI INI):
{{competitorHooks}}

RULES:
{{rules}}

BANNED WORDS:
{{bannedWords}}

BUATKAN 3 VERSI KONTEN dengan hook pattern BERBEDA. Return JSON array.`
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: { 
        'User-Agent': CONFIG.userAgent,
        'Accept': 'application/json, text/html, */*'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        data, 
        status: res.statusCode,
        headers: res.headers 
      }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

function safeJsonParse(str) {
  try {
    // Try to extract JSON from response
    const jsonMatch = str.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch {
    return null;
  }
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function fetchCampaignData(campaignAddress) {
  console.log('\n' + '─'.repeat(60));
  console.log('📦 PHASE 1: Campaign Data Fetch (Rally API)');
  console.log('─'.repeat(60));
  
  if (campaignAddress && campaignAddress.startsWith('0x')) {
    try {
      const url = `${CONFIG.rallyApiBase}/campaigns/${campaignAddress}`;
      console.log(`   Fetching: ${url}`);
      const response = await fetchUrl(url);
      
      if (response.status === 200) {
        const data = JSON.parse(response.data);
        console.log(`   ✅ Campaign found: ${data.title || data.name}`);
        
        return {
          success: true,
          source: 'rally_api',
          data: {
            address: campaignAddress,
            title: data.title || data.name,
            goal: data.goal || data.description,
            rules: data.rules || [],
            style: data.style || '',
            knowledgeBase: data.knowledgeBase || '',
            missions: data.missions || [],
            rewards: data.campaignRewards || {},
            creator: data.displayCreator || {},
            baseUrl: data.baseUrl || '',
            hook: data.hook || '',
            tags: data.tags || []
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ API fetch failed: ${error.message}`);
    }
  }
  
  console.log('   ℹ️ No campaign data available');
  return { success: false, source: 'none', data: {} };
}

async function fetchLeaderboardAndSubmissions(campaignAddress) {
  console.log('\n' + '─'.repeat(60));
  console.log('🏆 PHASE 2: Leaderboard + Submissions (Rally API)');
  console.log('─'.repeat(60));
  
  if (campaignAddress && campaignAddress.startsWith('0x')) {
    try {
      const leaderboardUrl = `${CONFIG.rallyApiBase}/leaderboard?campaignAddress=${campaignAddress}&limit=20`;
      console.log(`   Fetching leaderboard...`);
      const leaderboardResponse = await fetchUrl(leaderboardUrl);
      
      const submissionsUrl = `${CONFIG.rallyApiBase}/submissions?campaignAddress=${campaignAddress}&limit=20`;
      console.log(`   Fetching submissions...`);
      const submissionsResponse = await fetchUrl(submissionsUrl);
      
      if (leaderboardResponse.status === 200 && submissionsResponse.status === 200) {
        const leaderboardData = JSON.parse(leaderboardResponse.data);
        const submissionsData = JSON.parse(submissionsResponse.data);
        
        const leaderboard = Array.isArray(leaderboardData) ? leaderboardData : [];
        
        // Extract competitor hooks with safety check
        const competitorHooks = [];
        if (Array.isArray(submissionsData)) {
          submissionsData.slice(0, 10).forEach(sub => {
            const originality = sub.analysis?.find(a => a.category === 'Originality and Authenticity');
            if (originality?.analysis) {
              const hookMatch = originality.analysis.match(/opening hook ['\"]([^'\"]+)['\"]/i);
              if (hookMatch && hookMatch[1]) {
                competitorHooks.push({ hook: hookMatch[1], tweetUrl: `https://x.com/${sub.xUsername}/status/${sub.tweetId}` });
              }
            }
          });
        }
        
        console.log(`   ✅ Found ${leaderboard.length} competitors, ${submissionsData?.length || 0} submissions`);
        
        return {
          success: true,
          source: 'rally_api',
          data: {
            leaderboard: leaderboard.slice(0, 10),
            submissions: submissionsData,
            competitorHooks: competitorHooks,
            stats: {
              totalCompetitors: leaderboard.length,
              totalSubmissions: submissionsData?.length || 0
            }
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ Fetch failed: ${error.message}`);
    }
  }
  
  return { success: false, source: 'none', data: { leaderboard: [], submissions: [], competitorHooks: [], stats: {} } };
}

// ============================================================================
// CAMPAIGN SEARCH BY NAME
// ============================================================================

async function searchCampaignByName(campaignName) {
  console.log('\n' + '─'.repeat(60));
  console.log('🔍 Searching campaign by name...');
  console.log('─'.repeat(60));
  console.log(`   Query: "${campaignName}"`);
  
  try {
    const url = `${CONFIG.rallyApiBase}/campaigns?limit=50`;
    const response = await fetchUrl(url);
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      const campaigns = data.campaigns || data;
      
      if (!Array.isArray(campaigns)) {
        console.log('   ❌ Invalid campaign list format');
        return null;
      }
      
      const searchLower = campaignName.toLowerCase();
      const matches = campaigns.filter(c => {
        const title = (c.title || c.name || '').toLowerCase();
        return title.includes(searchLower) || searchLower.includes(title);
      });
      
      if (matches.length === 0) {
        console.log('   ❌ No campaign found with that name');
        console.log('\n   📋 Available campaigns:');
        campaigns.slice(0, 10).forEach((c, i) => {
          console.log(`      ${i + 1}. ${c.title || c.name}`);
        });
        return null;
      }
      
      if (matches.length === 1) {
        const match = matches[0];
        console.log(`   ✅ Found: "${match.title || match.name}"`);
        console.log(`      Address: ${match.intelligentContractAddress || match.address}`);
        return match;
      }
      
      console.log(`   Found ${matches.length} matching campaigns:\n`);
      matches.forEach((c, i) => {
        console.log(`      ${i + 1}. ${c.title || c.name}`);
        console.log(`         Address: ${c.intelligentContractAddress || c.address}`);
      });
      
      const firstMatch = matches[0];
      console.log(`\n   ➡️ Using: "${firstMatch.title || firstMatch.name}"`);
      return firstMatch;
    }
  } catch (error) {
    console.log(`   ❌ Search failed: ${error.message}`);
  }
  
  return null;
}

async function resolveCampaignInput(input) {
  if (input && input.startsWith('0x')) {
    return { address: input, name: null };
  }
  
  if (input && input.length > 0) {
    const campaign = await searchCampaignByName(input);
    if (campaign) {
      return { 
        address: campaign.intelligentContractAddress || campaign.address, 
        name: campaign.title || campaign.name 
      };
    }
  }
  
  return { address: null, name: null };
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

async function generateContent(llm, campaignData, competitorHooks) {
  console.log('\n' + '─'.repeat(60));
  console.log('✨ PHASE 3: Content Generation');
  console.log('─'.repeat(60));
  
  const requiredUrl = campaignData.baseUrl || '';
  const rules = campaignData.missions?.[0]?.rules || '';
  
  const userPrompt = CONTENT_PROMPTS.userTemplate
    .replace('{{campaignTitle}}', campaignData.title || 'Unknown Campaign')
    .replace('{{requiredUrl}}', requiredUrl)
    .replace('{{knowledgeBase}}', campaignData.knowledgeBase || 'Not provided')
    .replace('{{competitorHooks}}', Array.isArray(competitorHooks) && competitorHooks.length > 0 
      ? competitorHooks.map(c => `- "${c.hook}"`).join('\n') 
      : 'No competitor data')
    .replace('{{rules}}', rules || 'No specific rules')
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '));
  
  try {
    const response = await llm.chat([
      { role: 'system', content: CONTENT_PROMPTS.system },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.8, maxTokens: 4000 });
    
    const contents = safeJsonParse(response.content);
    
    if (contents && Array.isArray(contents)) {
      console.log(`   ✅ Generated ${contents.length} content versions`);
      return contents;
    }
    
    console.log('   ⚠️ Failed to parse content, using fallback');
    return [createFallbackContent(campaignData, competitorHooks)];
    
  } catch (error) {
    console.log(`   ❌ Content generation failed: ${error.message}`);
    return [createFallbackContent(campaignData, competitorHooks)];
  }
}

function createFallbackContent(campaignData, competitorHooks) {
  const requiredUrl = campaignData.baseUrl || 'https://example.com';
  return {
    version: 1,
    hook: "Code runs on-chain. Justice doesn't.",
    tweets: [
      "Code runs on-chain. Justice doesn't.\n\nWhen disputes hit smart contracts, who decides what's fair?",
      "Traditional courts take years. Legal fees stack up. And most of the time? No one's happy with the outcome.",
      "That's where Internet Court comes in. A faster, transparent way to resolve blockchain disputes.",
      "No judges in robes. No endless paperwork. Just code and community consensus.",
      `Learn how it works: ${requiredUrl}\n\nWhat's your biggest concern about on-chain disputes?`
    ],
    fullContent: `Code runs on-chain. Justice doesn't.\n\nWhen disputes hit smart contracts, who decides what's fair?\n\nTraditional courts take years. Legal fees stack up. And most of the time? No one's happy with the outcome.\n\nThat's where Internet Court comes in. A faster, transparent way to resolve blockchain disputes.\n\nNo judges in robes. No endless paperwork. Just code and community consensus.\n\nLearn how it works: ${requiredUrl}\n\nWhat's your biggest concern about on-chain disputes?`,
    emotionTypes: ['curiosity', 'urgency'],
    hookPattern: 'bold_statement'
  };
}

// ============================================================================
// JUDGING SYSTEM
// ============================================================================

async function runJudge(llm, judgeNum, systemPrompt, userPrompt) {
  console.log(`\n   🎯 Running Judge ${judgeNum}...`);
  
  try {
    const response = await llm.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.3, maxTokens: 2000 });
    
    const result = safeJsonParse(response.content);
    
    if (result) {
      console.log(`   ✅ Judge ${judgeNum} completed`);
      return { success: true, result, raw: response.content };
    }
    
    console.log(`   ⚠️ Judge ${judgeNum} response parse error`);
    return { success: false, result: null, raw: response.content };
    
  } catch (error) {
    console.log(`   ❌ Judge ${judgeNum} failed: ${error.message}`);
    return { success: false, result: null, error: error.message };
  }
}

async function runAllJudges(llm, campaignData, content, competitorHooks) {
  console.log('\n' + '─'.repeat(60));
  console.log('⚖️ PHASE 4: Multi-LLM Judging (3 Judges)');
  console.log('─'.repeat(60));
  
  const results = {};
  
  // Judge 1: Gate Utama
  const judge1Input = JUDGE_PROMPTS.judge1.userTemplate
    .replace('{{knowledgeBase}}', campaignData.knowledgeBase || 'Not provided')
    .replace('{{requiredUrl}}', campaignData.baseUrl || 'Not specified')
    .replace('{{rules}}', campaignData.missions?.[0]?.rules || 'No specific rules')
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '))
    .replace('{{competitorHooks}}', Array.isArray(competitorHooks) && competitorHooks.length > 0 
      ? competitorHooks.map(c => `- "${c.hook}"`).join('\n') 
      : 'No competitor data')
    .replace('{{content}}', content.fullContent || content);
  
  results.judge1 = await runJudge(llm, 1, JUDGE_PROMPTS.judge1.system, judge1Input);
  
  // Judge 2: Gate Tambahan
  const judge2Input = JUDGE_PROMPTS.judge2.userTemplate
    .replace('{{content}}', content.fullContent || content);
  
  results.judge2 = await runJudge(llm, 2, JUDGE_PROMPTS.judge2.system, judge2Input);
  
  // Judge 3: Penilaian Internal
  const judge3Input = JUDGE_PROMPTS.judge3.userTemplate
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '))
    .replace('{{aiPatterns}}', JSON.stringify(CONFIG.hardRequirements.aiPatterns, null, 2))
    .replace('{{competitorHooks}}', Array.isArray(competitorHooks) && competitorHooks.length > 0 
      ? competitorHooks.map(c => `- "${c.hook}"`).join('\n') 
      : 'No competitor data')
    .replace('{{content}}', content.fullContent || content);
  
  results.judge3 = await runJudge(llm, 3, JUDGE_PROMPTS.judge3.system, judge3Input);
  
  return results;
}

// ============================================================================
// DECISION LOGIC
// ============================================================================

function aggregateScores(judgeResults) {
  console.log('\n' + '─'.repeat(60));
  console.log('📊 PHASE 5: Score Aggregation & Decision');
  console.log('─'.repeat(60));
  
  const scores = {
    gateUtama: { score: 0, max: 20, pass: false },
    gateTambahan: { score: 0, max: 16, pass: false },
    penilaianInternal: { score: 0, max: 60, pass: false }
  };
  
  // Extract Judge 1 scores (Gate Utama)
  if (judgeResults.judge1?.result) {
    const j1 = judgeResults.judge1.result;
    const g1 = j1.G1_contentAlignment?.score || 0;
    const g2 = j1.G2_informationAccuracy?.score || 0;
    const g3 = j1.G3_campaignCompliance?.score || 0;
    const g4 = j1.G4_originality?.score || 0;
    scores.gateUtama.score = g1 + g2 + g3 + g4;
    scores.gateUtama.pass = scores.gateUtama.score >= CONFIG.thresholds.gateUtama.pass;
  }
  
  // Extract Judge 2 scores (Gate Tambahan)
  if (judgeResults.judge2?.result) {
    const j2 = judgeResults.judge2.result;
    scores.gateTambahan.score = j2.G5_engagementPotential?.score || 0;
    scores.gateTambahan.score += j2.G6_technicalQuality?.score || 0;
    scores.gateTambahan.pass = scores.gateTambahan.score >= CONFIG.thresholds.gateTambahan.pass;
  }
  
  // Extract Judge 3 scores (Penilaian Internal)
  if (judgeResults.judge3?.result) {
    const j3 = judgeResults.judge3.result;
    scores.penilaianInternal.score = (j3.hookScore?.score || 0) +
      (j3.emotionScore?.score || 0) +
      (j3.ctScore?.score || 0) +
      (j3.uniquenessScore?.score || 0) +
      (j3.readabilityScore?.score || 0) +
      (j3.viralPotentialScore?.score || 0);
    scores.penilaianInternal.pass = scores.penilaianInternal.score >= CONFIG.thresholds.penilaianInternal.pass;
  }
  
  // Final decision
  const allPass = scores.gateUtama.pass && scores.gateTambahan.pass && scores.penilaianInternal.pass;
  const totalScore = scores.gateUtama.score + scores.gateTambahan.score + scores.penilaianInternal.score;
  const maxScore = scores.gateUtama.max + scores.gateTambahan.max + scores.penilaianInternal.max;
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  console.log(`\n   ╔══════════════════════════════════════════════════════╗`);
  console.log(`   ║              FINAL SCORING RESULTS                   ║`);
  console.log(`   ╠══════════════════════════════════════════════════════╣`);
  console.log(`   ║  Gate Utama:      ${scores.gateUtama.score}/${scores.gateUtama.max}  ${scores.gateUtama.pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   ║  Gate Tambahan:   ${scores.gateTambahan.score}/${scores.gateTambahan.max}  ${scores.gateTambahan.pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   ║  Penilaian:       ${scores.penilaianInternal.score}/${scores.penilaianInternal.max}  ${scores.penilaianInternal.pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   ╠══════════════════════════════════════════════════════╣`);
  console.log(`   ║  TOTAL: ${totalScore}/${maxScore} (${percentage}%)`);
  console.log(`   ║  DECISION: ${allPass ? '✅ APPROVED' : '❌ NEEDS REVISION'}`);
  console.log(`   ╚══════════════════════════════════════════════════════╝`);
  
  return {
    scores,
    totalScore,
    maxScore,
    percentage,
    allPass,
    decision: allPass ? 'APPROVED' : 'NEEDS_REVISION'
  };
}

// ============================================================================
// OUTPUT GENERATION
// ============================================================================

function saveResults(campaignData, contents, judgeResults, decision) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `rally-result-${timestamp}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  const output = {
    timestamp: new Date().toISOString(),
    campaign: {
      address: campaignData.address,
      title: campaignData.title,
      goal: campaignData.goal
    },
    generatedContents: contents,
    judging: judgeResults,
    decision: decision
  };
  
  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
  console.log(`\n   💾 Results saved to: ${filepath}`);
  
  return filepath;
}

// ============================================================================
// MAIN WORKFLOW
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const input = args[0];
  
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 RALLY WORKFLOW V9.4.0 - MULTI-PROVIDER EDITION');
  console.log('═'.repeat(60));
  
  // Initialize LLM client
  const llm = new MultiProviderLLM(CONFIG);
  
  // Check available providers
  const enabledProviders = llm.getEnabledProviders();
  if (enabledProviders.length === 0) {
    console.log('\n❌ ERROR: No providers enabled!');
    console.log('\n📝 To fix this:');
    console.log('   1. Open scripts/rally-workflow-v9.4.0.js');
    console.log('   2. Find CONFIG.providers section');
    console.log('   3. Set enabled: true for at least one provider');
    console.log('   4. Add your API key to the apiKey field');
    process.exit(1);
  }
  
  console.log(`\n📋 Enabled providers: ${enabledProviders.map(p => p.name).join(', ')}`);
  
  // Resolve campaign input
  const resolved = await resolveCampaignInput(input);
  
  if (!resolved.address) {
    console.log('\n❌ No campaign found or provided');
    console.log('\n📝 Usage:');
    console.log('   node scripts/rally-workflow-v9.4.0.js <campaign_address_or_name>');
    console.log('\n   Examples:');
    console.log('   node scripts/rally-workflow-v9.4.0.js 0x123abc...');
    console.log('   node scripts/rally-workflow-v9.4.0.js "Internet Court"');
    process.exit(1);
  }
  
  // Phase 1: Fetch campaign data
  const campaignData = await fetchCampaignData(resolved.address);
  if (campaignData.success) {
    campaignData.data.address = resolved.address;
    campaignData.data.title = resolved.name || campaignData.data.title;
  } else {
    campaignData.data = { address: resolved.address, title: resolved.name };
  }
  
  // Phase 2: Fetch leaderboard and submissions
  const leaderboardData = await fetchLeaderboardAndSubmissions(resolved.address);
  const competitorHooks = leaderboardData.data.competitorHooks || [];
  
  // Phase 3: Generate content
  const contents = await generateContent(llm, campaignData.data, competitorHooks);
  
  // Phase 4: Run all 3 judges on best content
  const bestContent = contents[0];
  const judgeResults = await runAllJudges(llm, campaignData.data, bestContent, competitorHooks);
  
  // Phase 5: Aggregate scores and make decision
  const decision = aggregateScores(judgeResults);
  
  // Phase 6: Save results
  console.log('\n' + '─'.repeat(60));
  console.log('💾 PHASE 6: Save Results');
  console.log('─'.repeat(60));
  
  const savedFile = saveResults(campaignData.data, contents, judgeResults, decision);
  
  // Display best content
  console.log('\n' + '═'.repeat(60));
  console.log('📝 BEST CONTENT GENERATED');
  console.log('═'.repeat(60));
  console.log(bestContent.fullContent);
  console.log('═'.repeat(60));
  
  console.log('\n✅ Workflow completed!');
  console.log(`   Results: ${savedFile}`);
}

// Run
main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
