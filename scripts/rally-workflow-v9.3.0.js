/**
 * RALLY WORKFLOW V9.3.0 - MULTI-LLM JUDGING EDITION
 * 
 * Fitur:
 * ✅ Rally API data fetch (campaign, leaderboard, submissions)
 * ✅ Multi-LLM Judging System (3 independent judges)
 * ✅ Blind Judging - tanpa bias dari campaign goal/style
 * ✅ Content generation dengan validasi ketat
 * ✅ SDK integration untuk 3 judges
 * ✅ Decision logic dengan retry mechanism
 * 
 * Usage:
 *   node scripts/rally-workflow-v9.3.0.js [campaign_address]
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
// CONFIGURATION
// ============================================================================

const CONFIG = {
  rallyApiBase: 'https://app.rally.fun/api',
  outputDir: '/home/z/my-project/download',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  
  // Groq API Configuration (FREE - 14M tokens/bulan)
  groq: {
    apiKey: '', // PASTE YOUR API KEY HERE
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.1-8b-instant',  // Fast & free
    fallbackModel: 'llama-3.3-70b-versatile',  // Better quality
    enabled: false
  },
  
  // Together AI Configuration (FREE $1 credit)
  together: {
    enabled: true,
    baseUrl: 'https://api.together.xyz/v1',
    model: 'meta-llama/Llama-3-8b-chat-hf',
    fallbackModel: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
  },
  
  // Scoring thresholds (DIGUNAKAN di aggregateScores)
  thresholds: {
    gateUtama: { pass: 16, max: 20 },        // 80% of 20
    gateTambahan: { pass: 14, max: 16 },     // 87.5% of 16
    penilaianInternal: { pass: 54, max: 60 } // 90% of 60
  },
  
  // Retry settings
  retry: {
    maxAttempts: 3,
    delayMs: 2000  // 2 detik delay antara retry
  },
  
  // Hard requirements untuk penilaian (tanpa bias)
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
  
  // Emotion triggers untuk penilaian
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
// JUDGE PROMPTS - BLIND JUDGING (TIDAK ADA CAMPAIGN GOAL/STYLE)
// ============================================================================

const JUDGE_PROMPTS = {
  
  // JUDGE 1: Gate Utama (G1-G4)
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

Nilai kesesuaian konten dengan topik dari knowledge base.

├── 0 = Tidak ada kesesuaian sama sekali
├── 1 = Kesesuaian sangat rendah (<25%)
├── 2 = Kesesuaian rendah (25-50%)
├── 3 = Kesesuaian cukup (50-75%)
├── 4 = Kesesuaian baik (75-90%)
└── 5 = Kesesuaian sempurna (>90%)

Sub-kriteria:
- topicRelevance: Apakah konten membahas topik yang sama dengan knowledge base?
- terminologyUse: Apakah istilah teknis digunakan dengan benar?
- factualConsistency: Apakah klaim dalam konten konsisten dengan knowledge base?

═══════════════════════════════════════════════════════════════
G2: INFORMATION ACCURACY (0-5)
═══════════════════════════════════════════════════════════════

Nilai akurasi informasi dalam konten.

├── 0 = Informasi salah/sesat
├── 1 = Banyak kesalahan factual
├── 2 = Beberapa kesalahan
├── 3 = Akurasi cukup, minor errors
├── 4 = Akurasi baik, hampir tanpa error
└── 5 = 100% akurat

Sub-kriteria:
- technicalAccuracy: Fakta teknis benar?
- noMisleading: Tidak ada klaim menyesatkan?
- properContext: Konteks penggunaan benar?

═══════════════════════════════════════════════════════════════
G3: CAMPAIGN COMPLIANCE (0-5)
═══════════════════════════════════════════════════════════════

Nilai kepatuhan terhadap hard requirements.

├── 0 = Tidak memenuhi requirement sama sekali
├── 1 = Memenuhi <25% requirement
├── 2 = Memenuhi 25-50% requirement
├── 3 = Memenuhi 50-75% requirement
├── 4 = Memenuhi 75-99% requirement
└── 5 = Memenuhi 100% requirement

Hard checks:
- requiredUrlPresent: URL required ada?
- noEmDashes: Tidak ada em dashes (—)?
- noBannedWords: Tidak ada banned words?
- properStart: Tidak mulai dengan mention?

═══════════════════════════════════════════════════════════════
G4: ORIGINALITY (0-5)
═══════════════════════════════════════════════════════════════

Nilai keunikan konten dibanding kompetitor.

├── 0 = Copy-paste/template murni
├── 1 = Sangat mirip template/kompetitor
├── 2 = Ada unsur original tapi dominan template
├── 3 = Cukup original dengan beberapa pola umum
├── 4 = Original dengan sudut pandang unik
└── 5 = Sangat original, perspektif segar

Sub-kriteria:
- uniqueAngle: Sudut pandang berbeda dari kompetitor?
- noAiPatterns: Tidak ada AI-generated patterns?
- naturalVoice: Bahasa natural, bukan robotic?

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (WAJIB JSON):
═══════════════════════════════════════════════════════════════

{
  "G1_contentAlignment": {
    "score": <0-5>,
    "breakdown": {
      "topicRelevance": <0-2>,
      "terminologyUse": <0-2>,
      "factualConsistency": <0-2>
    },
    "reasoning": "<penjelasan singkat>"
  },
  "G2_informationAccuracy": {
    "score": <0-5>,
    "breakdown": {
      "technicalAccuracy": <0-2>,
      "noMisleading": <0-2>,
      "properContext": <0-2>
    },
    "reasoning": "<penjelasan singkat>"
  },
  "G3_campaignCompliance": {
    "score": <0-5>,
    "breakdown": {
      "requiredUrlPresent": <true/false>,
      "noEmDashes": <true/false>,
      "noBannedWords": <true/false>,
      "properStart": <true/false>
    },
    "reasoning": "<penjelasan singkat>"
  },
  "G4_originality": {
    "score": <0-5>,
    "breakdown": {
      "uniqueAngle": <0-2>,
      "noAiPatterns": <0-2>,
      "naturalVoice": <0-2>
    },
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
  
  // JUDGE 2: Gate Tambahan (G5-G6)
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

1. hookEffectiveness (0-2):
   ├── 0 = Hook lemah/tidak menarik
   ├── 1 = Hook cukup menarik
   └── 2 = Hook sangat kuat

   Indikator hook kuat:
   - Number/data: "$50M vanished..."
   - Question: "What happens when..."
   - Bold statement: "Code runs. Justice doesn't."
   - Contrarian: "No one talks about..."
   - BUKAN weak opening: "The...", "This is..."

2. ctaQuality (0-2):
   ├── 0 = Tidak ada CTA atau lemah
   ├── 1 = CTA ada tapi kurang kuat
   └── 2 = CTA kuat, mengajak engagement

   Indikator CTA kuat:
   - Question yang mengajak jawaban
   - "What do you think?"
   - "Who decides when..."

3. contentStructure (0-2):
   ├── 0 = Struktur berantakan
   ├── 1 = Struktur cukup
   └── 2 = Struktur sangat baik

   Indikator:
   - Line breaks tepat
   - Prosesi logis
   - Tidak ada wall of text

4. conversationPotential (0-2):
   ├── 0 = Tidak membuat orang mau reply
   ├── 1 = Mungkin membuat orang reply
   └── 2 = Sangat likely membuat orang reply

═══════════════════════════════════════════════════════════════
G6: TECHNICAL QUALITY (0-8)
═══════════════════════════════════════════════════════════════

1. grammarSpelling (0-2):
   ├── 0 = Banyak error
   ├── 1 = Beberapa minor errors
   └── 2 = Tanpa error

2. formatting (0-2):
   ├── 0 = Formatting berantakan
   ├── 1 = Formatting cukup
   └── 2 = Formatting profesional

3. platformOptimization (0-2):
   ├── 0 = Tidak optimal untuk X/Twitter
   ├── 1 = Cukup optimal
   └── 2 = Sangat optimal

   Indikator:
   - Hook < 200 chars
   - Setiap tweet 240-400 chars ideal
   - Total 3-5 tweets

4. noProhibitedElements (0-2):
   ├── 0 = Ada prohibited elements
   ├── 1 = Minor violations
   └── 2 = Tidak ada violations

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
  
  // JUDGE 3: Penilaian Internal
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
1. HOOK SCORE (0-10)
═══════════════════════════════════════════════════════════════

Power Patterns (+2 each):
- Number/Data: "$50M vanished..."
- Question: "What happens when..."
- Bold Statement: "Code runs. Justice doesn't."
- Contrarian: "No one talks about..."
- Personal Pain: "I lost everything..."
- Urgency: "Warning: Your funds..."

Weak Openings (-2 each):
- "The ", "A ", "This is", "There are", "I think"
- "In the", "Today ", "So ", "Well "

Required Elements (min 2, +1 each):
- Curiosity: what if, why, how, secret
- Tension: but, however, wrong, problem
- Surprise: unexpected, finally, breakthrough
- Relevance: you, your, today, now

Scoring:
├── 0-3 = Hook lemah
├── 4-6 = Hook cukup
├── 7-8 = Hook baik
└── 9-10 = Hook sangat kuat

═══════════════════════════════════════════════════════════════
2. EMOTION SCORE (0-10)
═══════════════════════════════════════════════════════════════

Emotion Types (identifikasi yang ada):
- Fear: risk, danger, threat, warning
- Curiosity: wonder, curious, secret, hidden
- Surprise: unexpected, shocking, breakthrough
- Hope: finally, opportunity, potential
- Pain: lost, failed, broke, destroyed
- Urgency: now, today, immediately

Body Feelings (WAJIB min 1 untuk score 9+):
- cold sweat, panic, anxiety, heart racing
- stomach dropped, heart sank, chest tightened

Scoring:
├── 0-3 = Tidak ada emosi
├── 4-6 = Emosi lemah/1 type
├── 7-8 = Emosi cukup, 2-3 types
└── 9-10 = Emosi kuat, 3+ types + body feeling

═══════════════════════════════════════════════════════════════
3. CT (CALL-TO-ACTION) SCORE (0-10)
═══════════════════════════════════════════════════════════════

Elements (hitung points):
- Question (?): +2
- Reply Bait ("What do you think?"): +2
- Engagement Hook ("Have you ever..."): +2
- Personal ("I", "my"): +1
- FOMO ("now", "today"): +1
- Controversy ("wrong", "problem"): +1
- Share-worthy ("This is why..."): +1

Max: 10 points

═══════════════════════════════════════════════════════════════
4. UNIQUENESS SCORE (0-10)
═══════════════════════════════════════════════════════════════

Penalties:
- AI Pattern word: -2 each
- Template hook: -3 each
- Banned word: -0.5 each

Formula: 10 - penalties

AI Patterns:
- "delve", "leverage", "realm", "tapestry", "paradigm"
- "picture this", "lets dive in", "in this thread"

Template Hooks:
- "unpopular opinion", "hot take", "thread alert"
- "nobody is talking about", "story time"

═══════════════════════════════════════════════════════════════
5. READABILITY SCORE (0-10)
═══════════════════════════════════════════════════════════════

Sentence Length (0-3):
├── 0 = Terlalu panjang (>40 words)
├── 1 = Campuran
├── 2 = Mayoritas pendek
└── 3 = Ideal (15-25 words)

Structure (0-4):
├── 0 = Wall of text
├── 1 = Ada breaks
├── 2 = Breaks baik
├── 3 = Struktur sangat baik
└── 4 = Profesional

Paragraph Breaks (0-3):
├── 0 = Tidak ada
├── 1 = Minim
├── 2 = Cukup
└── 3 = Optimal

═══════════════════════════════════════════════════════════════
6. VIRAL POTENTIAL SCORE (0-10)
═══════════════════════════════════════════════════════════════

Elements (+1 each, max 10):
- Controversy present
- Strong emotion
- Question present
- Personal element
- Numbers/data
- Urgency
- Share-worthy insight

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (WAJIB JSON):
═══════════════════════════════════════════════════════════════

{
  "hookScore": { "score": <0-10>, "reasoning": "..." },
  "emotionScore": { "score": <0-10>, "emotionTypes": [...], "reasoning": "..." },
  "ctScore": { "score": <0-10>, "elementsFound": [...], "reasoning": "..." },
  "uniquenessScore": { "score": <0-10>, "penaltiesFound": [...], "reasoning": "..." },
  "readabilityScore": { "score": <0-10>, "breakdown": {...}, "reasoning": "..." },
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

1. ORIGINALITY = LIFE - Tidak boleh ada AI patterns, template hooks, atau copy-paste
2. EMOTION = ENGAGEMENT - Konten harus menggugah emosi, bukan informasi kering
3. HOOK = FIRST IMPRESSION - Hook adalah 80% dari keberhasilan konten
4. CTA = CONVERSATION - Ajak reader untuk respond, bukan sekadar baca
5. NO FLUFF - Setiap kata harus punya tujuan

═══════════════════════════════════════════════════════════════
HOOK PRINCIPLES (BUKAN TEMPLATE):
═══════════════════════════════════════════════════════════════

Power Patterns (pilih SALAH SATU):
├── NUMBER + PROBLEM: "$50M locked. No key."
├── BOLD STATEMENT: "Code runs. Justice doesn't."
├── QUESTION + TENSION: "What happens when your smart contract disagrees with you?"
├── PERSONAL PAIN: "I watched $10K vanish into a black hole."
└── CONTRARIAN: "Everyone's wrong about dispute resolution."

WAJIB HINDARI:
├── ❌ Weak openings: "The...", "This is...", "There are...", "I think..."
├── ❌ AI patterns: "Picture this", "Let me explain", "Here's the thing"
├── ❌ Template hooks: "Unpopular opinion", "Hot take", "Thread alert"
└── ❌ Em dashes: Tidak boleh ada "—" di hook

═══════════════════════════════════════════════════════════════
EMOTION INJECTION:
═══════════════════════════════════════════════════════════════

Gunakan 2-3 emotion types:
├── FEAR: risk, danger, warning, threat
├── CURIOSITY: what if, why, secret, hidden
├── SURPRISE: unexpected, shocking, finally
├── HOPE: opportunity, potential, breakthrough
├── PAIN: lost, failed, broke, destroyed
└── URGENCY: now, today, immediately

Body feeling (WAJIB untuk skor tinggi):
├── "cold sweat", "heart racing", "stomach dropped"
└── "chest tightened", "jaw dropped"

═══════════════════════════════════════════════════════════════
CONTENT STRUCTURE:
═══════════════════════════════════════════════════════════════

Tweet 1 (Hook + Setup):
├── Hook < 200 chars
├── Setup the tension
└── No em dashes, no weak openings

Tweet 2-4 (Body):
├── Develop the story/argument
├── Include emotion words
├── Add facts/data from knowledge base
└── Include required URL naturally

Tweet 5 (CTA):
├── Question or challenge
├── Invite response
└── Create conversation

═══════════════════════════════════════════════════════════════
BANNED (AUTO-FAIL):
═══════════════════════════════════════════════════════════════

Words: guaranteed, 100%, risk-free, financial advice, buy now, get rich, passive income, follow me
AI Patterns: delve, leverage, realm, tapestry, paradigm, picture this, let's dive in
Structures: Thread 🧵, (1/X), First... Second... Finally...

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
  },
  ...
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

═══════════════════════════════════════════════════════════════
BUATKAN 3 VERSI KONTEN:
═══════════════════════════════════════════════════════════════

1. Setiap versi harus BERBEDA hook pattern
2. Setiap versi harus include required URL
3. Setiap versi harus UNIK dari competitor hooks
4. WAJIB 5 tweets per version
5. Return dalam format JSON array

KONTEN:`
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Delay function untuk retry
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry wrapper dengan exponential backoff
async function retryWithBackoff(fn, maxAttempts = CONFIG.retry.maxAttempts, delayMs = CONFIG.retry.delayMs) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isRateLimit = error.message?.includes('429') || error.message?.includes('rate');
      
      if (isRateLimit && attempt < maxAttempts) {
        const waitTime = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`   ⏳ Rate limited. Waiting ${waitTime/1000}s before retry ${attempt}/${maxAttempts}...`);
        await delay(waitTime);
      } else if (attempt < maxAttempts) {
        console.log(`   ⚠️ Attempt ${attempt} failed: ${error.message}. Retrying...`);
        await delay(delayMs);
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    const req = protocol.request(url, {
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
  return {
    success: false,
    source: 'none',
    data: {}
  };
}

async function fetchLeaderboardAndSubmissions(campaignAddress) {
  console.log('\n' + '─'.repeat(60));
  console.log('🏆 PHASE 2: Leaderboard + Submissions (Rally API)');
  console.log('─'.repeat(60));
  
  if (campaignAddress && campaignAddress.startsWith('0x')) {
    try {
      // Fetch leaderboard
      const leaderboardUrl = `${CONFIG.rallyApiBase}/leaderboard?campaignAddress=${campaignAddress}&limit=20`;
      console.log(`   Fetching leaderboard: ${leaderboardUrl}`);
      const leaderboardResponse = await fetchUrl(leaderboardUrl);
      
      // Fetch submissions
      const submissionsUrl = `${CONFIG.rallyApiBase}/submissions?campaignAddress=${campaignAddress}&limit=20`;
      console.log(`   Fetching submissions: ${submissionsUrl}`);
      const submissionsResponse = await fetchUrl(submissionsUrl);
      
      if (leaderboardResponse.status === 200 && submissionsResponse.status === 200) {
        const leaderboardData = JSON.parse(leaderboardResponse.data);
        const submissionsData = JSON.parse(submissionsResponse.data);
        
        const leaderboard = Array.isArray(leaderboardData) ? leaderboardData : [];
        
        // Extract competitor info for blind judging
        const competitorHooks = submissionsData.slice(0, 10).map(sub => {
          const originality = sub.analysis?.find(a => a.category === 'Originality and Authenticity');
          let hook = '';
          if (originality?.analysis) {
            const hookMatch = originality.analysis.match(/opening hook ['\"]([^'\"]+)['\"]/i);
            if (hookMatch) hook = hookMatch[1];
          }
          return {
            hook: hook,
            tweetUrl: `https://x.com/${sub.xUsername}/status/${sub.tweetId}`
          };
        }).filter(c => c.hook);
        
        console.log(`   ✅ Found ${leaderboard.length} competitors, ${submissionsData.length} submissions`);
        
        return {
          success: true,
          source: 'rally_api',
          data: {
            leaderboard: leaderboard.slice(0, 10),
            submissions: submissionsData,
            competitorHooks: competitorHooks,
            stats: {
              totalCompetitors: leaderboard.length,
              totalSubmissions: submissionsData.length
            }
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ Fetch failed: ${error.message}`);
    }
  }
  
  return {
    success: false,
    source: 'none',
    data: { leaderboard: [], submissions: [], competitorHooks: [], stats: {} }
  };
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
    // Fetch all campaigns
    const url = `${CONFIG.rallyApiBase}/campaigns?limit=50`;
    const response = await fetchUrl(url);
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      const campaigns = data.campaigns || data;
      
      if (!Array.isArray(campaigns)) {
        console.log('   ❌ Invalid campaign list format');
        return null;
      }
      
      // Search by name (case insensitive, partial match)
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
      
      // Multiple matches - show list
      console.log(`   Found ${matches.length} matching campaigns:\n`);
      matches.forEach((c, i) => {
        console.log(`      ${i + 1}. ${c.title || c.name}`);
        console.log(`         Address: ${c.intelligentContractAddress || c.address}`);
      });
      
      // Return first match
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
  // If input starts with 0x, it's an address
  if (input && input.startsWith('0x')) {
    return { address: input, name: null };
  }
  
  // If input is provided but not an address, search by name
  if (input && input.length > 0) {
    const campaign = await searchCampaignByName(input);
    if (campaign) {
      return { 
        address: campaign.intelligentContractAddress || campaign.address, 
        name: campaign.title || campaign.name 
      };
    }
  }
  
  // No valid input
  return { address: null, name: null };
}

// ============================================================================
// JUDGING SYSTEM
// ============================================================================

function prepareJudge1Input(campaignData, content, competitorHooks) {
  // Extract rules from missions
  const rules = [];
  if (campaignData.missions && campaignData.missions.length > 0) {
    rules.push(campaignData.missions[0].rules || '');
  }
  
  return JUDGE_PROMPTS.judge1.userTemplate
    .replace('{{knowledgeBase}}', campaignData.knowledgeBase || 'Not provided')
    .replace('{{requiredUrl}}', campaignData.baseUrl || 'Not specified')
    .replace('{{rules}}', rules.join('\n') || 'No specific rules')
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '))
    .replace('{{competitorHooks}}', competitorHooks.map(c => `- "${c.hook}"`).join('\n') || 'No competitor data')
    .replace('{{content}}', content);
}

function prepareJudge2Input(content) {
  return JUDGE_PROMPTS.judge2.userTemplate.replace('{{content}}', content);
}

function prepareJudge3Input(content, competitorHooks) {
  return JUDGE_PROMPTS.judge3.userTemplate
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '))
    .replace('{{aiPatterns}}', JSON.stringify(CONFIG.hardRequirements.aiPatterns, null, 2))
    .replace('{{competitorHooks}}', competitorHooks.map(c => `- "${c.hook}"`).join('\n') || 'No competitor data')
    .replace('{{content}}', content);
}

// ============================================================================
// OUTPUT GENERATION
// ============================================================================

function extractRequiredUrl(campaignData) {
  // 1. Check baseUrl directly
  if (campaignData.baseUrl && campaignData.baseUrl.length > 0) {
    return campaignData.baseUrl;
  }
  
  // 2. Extract from rules
  const rules = campaignData.missions?.[0]?.rules || '';
  const urlMatch = rules.match(/mention\s+([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  // 3. Extract from knowledgeBase
  const kb = campaignData.knowledgeBase || '';
  const kbUrlMatch = kb.match(/https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (kbUrlMatch) {
    return kbUrlMatch[1];
  }
  
  return '';
}

function generateJudgeInstructions(campaignData, competitorHooks) {
  const requiredUrl = extractRequiredUrl(campaignData);
  const rules = campaignData.missions?.[0]?.rules || '';
  
  return {
    judge1: {
      description: "Gate Utama (G1-G4) - Content Alignment, Accuracy, Compliance, Originality",
      systemPrompt: JUDGE_PROMPTS.judge1.system,
      inputTemplate: JUDGE_PROMPTS.judge1.userTemplate,
      inputData: {
        knowledgeBase: campaignData.knowledgeBase || '',
        requiredUrl: requiredUrl,
        rules: rules,
        bannedWords: CONFIG.hardRequirements.bannedWords,
        competitorHooks: competitorHooks
      }
    },
    judge2: {
      description: "Gate Tambahan (G5-G6) - Engagement Potential, Technical Quality",
      systemPrompt: JUDGE_PROMPTS.judge2.system,
      inputTemplate: JUDGE_PROMPTS.judge2.userTemplate
    },
    judge3: {
      description: "Penilaian Internal - Hook, Emotion, CT, Uniqueness, Readability, Viral",
      systemPrompt: JUDGE_PROMPTS.judge3.system,
      inputTemplate: JUDGE_PROMPTS.judge3.userTemplate,
      inputData: {
        bannedWords: CONFIG.hardRequirements.bannedWords,
        aiPatterns: CONFIG.hardRequirements.aiPatterns,
        competitorHooks: competitorHooks
      }
    }
  };
}

// ============================================================================
// GROQ API IMPLEMENTATION (FREE FALLBACK)
// ============================================================================

async function callGroqAPI(messages, model = null, maxTokens = 4000, temperature = 0.8) {
  const selectedModel = model || CONFIG.groq.model;
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: selectedModel,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature
    });
    
    const options = {
      hostname: 'api.groq.com',
      port: 443,
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.groq.apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      agent: false  // Disable connection pooling
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}`));
          }
        } else {
          reject(new Error(`Groq API error: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', (e) => reject(new Error(`Request error: ${e.message}`)));
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(postData);
    req.end();
  });
}

// ============================================================================
// SDK CALL IMPLEMENTATION - CONTENT GENERATION
// ============================================================================

async function generateContent(campaignData, competitorHooks) {
  console.log('\n' + '─'.repeat(60));
  console.log('✨ PHASE 3: Content Generation');
  console.log('─'.repeat(60));
  
  const requiredUrl = extractRequiredUrl(campaignData);
  const rules = campaignData.missions?.[0]?.rules || '';
  const competitorHooksArray = Array.isArray(competitorHooks) ? competitorHooks : [];
  const competitorHooksStr = competitorHooksArray.map(c => `- "${c.hook}"`).join('\n') || 'No competitor data';
  
  const userInput = CONTENT_PROMPTS.userTemplate
    .replace('{{campaignTitle}}', campaignData.title || campaignData.name || 'Unknown Campaign')
    .replace('{{requiredUrl}}', requiredUrl || 'Not specified')
    .replace('{{knowledgeBase}}', (campaignData.knowledgeBase || '').substring(0, 2000))
    .replace('{{competitorHooks}}', competitorHooksStr)
    .replace('{{rules}}', rules || 'No specific rules')
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '));
  
  console.log('   📝 Generating 3 content versions...');
  
  let contentText = null;
  let usedProvider = null;
  
  // TRY 1: Groq API (FREE - Primary)
  try {
    console.log('   🚀 Trying Groq API (FREE)...');
    const result = await callGroqAPI([
      { role: 'system', content: CONTENT_PROMPTS.system },
      { role: 'user', content: userInput }
    ]);
    
    contentText = result.choices[0]?.message?.content;
    usedProvider = 'Groq API';
    console.log('   ✅ Groq API success!');
  } catch (groqError) {
    console.log(`   ⚠️ Groq API failed: ${groqError.message}`);
    
    // TRY 2: SDK z-ai-web-dev-sdk (Backup)
    try {
      console.log('   🔄 Trying SDK (z-ai-web-dev-sdk)...');
      const ZAI = await initZAI();
      const zai = await ZAI.create();
      
      const result = await retryWithBackoff(async () => {
        return await zai.chat.completions.create({
          messages: [
            { role: 'system', content: CONTENT_PROMPTS.system },
            { role: 'user', content: userInput }
          ],
          temperature: 0.8,
          max_tokens: 4000
        });
      }, 2, 3000); // Kurangi retry untuk SDK
      
      contentText = result.choices[0]?.message?.content;
      usedProvider = 'SDK';
      console.log('   ✅ SDK success!');
    } catch (sdkError) {
      console.log(`   ⚠️ SDK failed: ${sdkError.message}`);
    }
  }
  
  // Check if we got content
  if (!contentText || contentText.trim().length < 50) {
    console.log('   ❌ All providers failed');
    return {
      success: false,
      versions: [],
      error: 'All content generation providers failed'
    };
  }
  
  // Try to parse JSON from response
  let versions = [];
  try {
    const jsonMatch = contentText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      versions = JSON.parse(jsonMatch[0]);
    } else {
      versions = [{
        version: 1,
        hook: contentText.split('\n')[0].substring(0, 200),
        fullContent: contentText,
        emotionTypes: ['curiosity'],
        hookPattern: 'unknown'
      }];
    }
  } catch (parseError) {
    console.log('   ⚠️ JSON parse failed, using raw content');
    versions = [{
      version: 1,
      hook: contentText.split('\n')[0].substring(0, 200),
      fullContent: contentText,
      emotionTypes: ['curiosity'],
      hookPattern: 'unknown'
    }];
  }
  
  console.log(`   ✅ Generated ${versions.length} content versions via ${usedProvider}`);
  
  return {
    success: true,
    versions: versions,
    provider: usedProvider
  };
}

// ============================================================================
// SDK CALL IMPLEMENTATION - MULTI-LLM JUDGING
// ============================================================================

async function runJudge1(content, inputData) {
  console.log('   👨‍⚖️ Judge 1: Gate Utama (G1-G4)...');
  
  // Safe array handling
  const competitorHooks = Array.isArray(inputData.competitorHooks) ? inputData.competitorHooks : [];
  const bannedWords = Array.isArray(inputData.bannedWords) ? inputData.bannedWords : [];
  
  const userInput = JUDGE_PROMPTS.judge1.userTemplate
    .replace('{{knowledgeBase}}', inputData.knowledgeBase || 'Not provided')
    .replace('{{requiredUrl}}', inputData.requiredUrl || 'Not specified')
    .replace('{{rules}}', inputData.rules || 'No specific rules')
    .replace('{{bannedWords}}', bannedWords.join(', '))
    .replace('{{competitorHooks}}', competitorHooks.map(c => `- "${c.hook}"`).join('\n') || 'No competitor data')
    .replace('{{content}}', content);
  
  // TRY 1: Groq API (Primary)
  try {
    const result = await callGroqAPI([
      { role: 'system', content: JUDGE_PROMPTS.judge1.system },
      { role: 'user', content: userInput }
    ], null, 2000, 0.3);
    
    const responseText = result.choices[0]?.message?.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('   ✅ Judge 1 done (Groq)');
      return JSON.parse(jsonMatch[0]);
    }
  } catch (groqError) {
    console.log(`   ⚠️ Judge 1 Groq failed: ${groqError.message}`);
  }
  
  // TRY 2: SDK (Fallback)
  try {
    const ZAI = await initZAI();
    const zai = await ZAI.create();
    
    const result = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: JUDGE_PROMPTS.judge1.system },
        { role: 'user', content: userInput }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    
    const responseText = result.choices[0]?.message?.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('   ✅ Judge 1 done (SDK)');
      return JSON.parse(jsonMatch[0]);
    }
  } catch (sdkError) {
    console.log(`   ⚠️ Judge 1 SDK failed: ${sdkError.message}`);
  }
  
  // Fallback score
  console.log('   ⚠️ Judge 1 using fallback scores');
  return {
    G1_contentAlignment: { score: 3, reasoning: 'API failed, using fallback' },
    G2_informationAccuracy: { score: 3, reasoning: 'API failed, using fallback' },
    G3_campaignCompliance: { score: 3, reasoning: 'API failed, using fallback' },
    G4_originality: { score: 3, reasoning: 'API failed, using fallback' },
    gateUtamaTotal: '12/20',
    gateUtamaPass: false
  };
}

async function runJudge2(content) {
  console.log('   👨‍⚖️ Judge 2: Gate Tambahan (G5-G6)...');
  
  const userInput = JUDGE_PROMPTS.judge2.userTemplate.replace('{{content}}', content);
  
  // TRY 1: Groq API (Primary)
  try {
    const result = await callGroqAPI([
      { role: 'system', content: JUDGE_PROMPTS.judge2.system },
      { role: 'user', content: userInput }
    ], null, 2000, 0.3);
    
    const responseText = result.choices[0]?.message?.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('   ✅ Judge 2 done (Groq)');
      return JSON.parse(jsonMatch[0]);
    }
  } catch (groqError) {
    console.log(`   ⚠️ Judge 2 Groq failed: ${groqError.message}`);
  }
  
  // TRY 2: SDK (Fallback)
  try {
    const ZAI = await initZAI();
    const zai = await ZAI.create();
    
    const result = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: JUDGE_PROMPTS.judge2.system },
        { role: 'user', content: userInput }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    
    const responseText = result.choices[0]?.message?.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('   ✅ Judge 2 done (SDK)');
      return JSON.parse(jsonMatch[0]);
    }
  } catch (sdkError) {
    console.log(`   ⚠️ Judge 2 SDK failed: ${sdkError.message}`);
  }
  
  // Fallback score
  console.log('   ⚠️ Judge 2 using fallback scores');
  return {
    G5_engagementPotential: { score: 5, reasoning: 'API failed, using fallback' },
    G6_technicalQuality: { score: 5, reasoning: 'API failed, using fallback' },
    gateTambahanTotal: '10/16',
    gateTambahanPass: false
  };
}

async function runJudge3(content, inputData) {
  console.log('   👨‍⚖️ Judge 3: Penilaian Internal...');
  
  // Safe array handling
  const competitorHooks = Array.isArray(inputData.competitorHooks) ? inputData.competitorHooks : [];
  const bannedWords = Array.isArray(inputData.bannedWords) ? inputData.bannedWords : [];
  const aiPatterns = inputData.aiPatterns || CONFIG.hardRequirements.aiPatterns;
  
  const userInput = JUDGE_PROMPTS.judge3.userTemplate
    .replace('{{bannedWords}}', bannedWords.join(', '))
    .replace('{{aiPatterns}}', JSON.stringify(aiPatterns, null, 2))
    .replace('{{competitorHooks}}', competitorHooks.map(c => `- "${c.hook}"`).join('\n') || 'No competitor data')
    .replace('{{content}}', content);
  
  // TRY 1: Groq API (Primary)
  try {
    const result = await callGroqAPI([
      { role: 'system', content: JUDGE_PROMPTS.judge3.system },
      { role: 'user', content: userInput }
    ], CONFIG.groq.fallbackModel, 2000, 0.3); // Use larger model for complex judging
    
    const responseText = result.choices[0]?.message?.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('   ✅ Judge 3 done (Groq)');
      return JSON.parse(jsonMatch[0]);
    }
  } catch (groqError) {
    console.log(`   ⚠️ Judge 3 Groq failed: ${groqError.message}`);
  }
  
  // TRY 2: SDK (Fallback)
  try {
    const ZAI = await initZAI();
    const zai = await ZAI.create();
    
    const result = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: JUDGE_PROMPTS.judge3.system },
        { role: 'user', content: userInput }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    
    const responseText = result.choices[0]?.message?.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('   ✅ Judge 3 done (SDK)');
      return JSON.parse(jsonMatch[0]);
    }
  } catch (sdkError) {
    console.log(`   ⚠️ Judge 3 SDK failed: ${sdkError.message}`);
  }
  
  // Fallback score
  console.log('   ⚠️ Judge 3 using fallback scores');
  return {
    hookScore: { score: 5, reasoning: 'API failed, using fallback' },
    emotionScore: { score: 5, reasoning: 'API failed, using fallback' },
    ctScore: { score: 5, reasoning: 'API failed, using fallback' },
    uniquenessScore: { score: 5, reasoning: 'API failed, using fallback' },
    readabilityScore: { score: 5, reasoning: 'API failed, using fallback' },
    viralPotentialScore: { score: 5, reasoning: 'API failed, using fallback' },
    overallScore: 5,
    allPass: false
  };
}

async function runAllJudges(content, judgeInstructions) {
  console.log('\n' + '─'.repeat(60));
  console.log('⚖️ PHASE 4: Multi-LLM Blind Judging');
  console.log('─'.repeat(60));
  
  const startTime = Date.now();
  
  // Run all 3 judges in parallel
  const [judge1Result, judge2Result, judge3Result] = await Promise.all([
    runJudge1(content, judgeInstructions.judge1.inputData),
    runJudge2(content),
    runJudge3(content, judgeInstructions.judge3.inputData)
  ]);
  
  const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`   ⏱️ Judging completed in ${executionTime}s`);
  
  return {
    judge1: judge1Result,
    judge2: judge2Result,
    judge3: judge3Result,
    executionTime
  };
}

// ============================================================================
// DECISION LOGIC - SCORE AGGREGATION & PASS/FAIL
// ============================================================================

function aggregateScores(judgeResults) {
  console.log('\n' + '─'.repeat(60));
  console.log('📊 PHASE 5: Score Aggregation');
  console.log('─'.repeat(60));
  
  // Extract scores from judge results
  const gateUtama = {
    G1: judgeResults.judge1?.G1_contentAlignment?.score || 0,
    G2: judgeResults.judge1?.G2_informationAccuracy?.score || 0,
    G3: judgeResults.judge1?.G3_campaignCompliance?.score || 0,
    G4: judgeResults.judge1?.G4_originality?.score || 0,
    total: 0,
    max: CONFIG.thresholds.gateUtama.max,
    pass: false
  };
  gateUtama.total = gateUtama.G1 + gateUtama.G2 + gateUtama.G3 + gateUtama.G4;
  gateUtama.pass = gateUtama.total >= CONFIG.thresholds.gateUtama.pass;
  
  const gateTambahan = {
    G5: judgeResults.judge2?.G5_engagementPotential?.score || 0,
    G6: judgeResults.judge2?.G6_technicalQuality?.score || 0,
    total: 0,
    max: CONFIG.thresholds.gateTambahan.max,
    pass: false
  };
  gateTambahan.total = gateTambahan.G5 + gateTambahan.G6;
  gateTambahan.pass = gateTambahan.total >= CONFIG.thresholds.gateTambahan.pass;
  
  const penilaianInternal = {
    hook: judgeResults.judge3?.hookScore?.score || 0,
    emotion: judgeResults.judge3?.emotionScore?.score || 0,
    ct: judgeResults.judge3?.ctScore?.score || 0,
    uniqueness: judgeResults.judge3?.uniquenessScore?.score || 0,
    readability: judgeResults.judge3?.readabilityScore?.score || 0,
    viral: judgeResults.judge3?.viralPotentialScore?.score || 0,
    total: 0,
    max: CONFIG.thresholds.penilaianInternal.max,
    pass: false
  };
  penilaianInternal.total = penilaianInternal.hook + penilaianInternal.emotion + 
                           penilaianInternal.ct + penilaianInternal.uniqueness + 
                           penilaianInternal.readability + penilaianInternal.viral;
  penilaianInternal.pass = penilaianInternal.total >= CONFIG.thresholds.penilaianInternal.pass;
  
  // Calculate total score
  const maxTotal = CONFIG.thresholds.gateUtama.max + CONFIG.thresholds.gateTambahan.max + CONFIG.thresholds.penilaianInternal.max;
  const totalScore = {
    gateUtama: gateUtama.total,
    gateTambahan: gateTambahan.total,
    penilaianInternal: penilaianInternal.total,
    maxTotal: maxTotal,
    total: gateUtama.total + gateTambahan.total + penilaianInternal.total,
    percentage: 0
  };
  totalScore.percentage = (totalScore.total / totalScore.maxTotal * 100).toFixed(1);
  
  // Determine overall pass
  const overallPass = gateUtama.pass && gateTambahan.pass && penilaianInternal.pass;
  
  console.log('   📈 Gate Utama:    ' + gateUtama.total + '/' + gateUtama.max + ' ' + (gateUtama.pass ? '✅' : '❌'));
  console.log('   📈 Gate Tambahan: ' + gateTambahan.total + '/' + gateTambahan.max + ' ' + (gateTambahan.pass ? '✅' : '❌'));
  console.log('   📈 Internal:      ' + penilaianInternal.total + '/' + penilaianInternal.max + ' ' + (penilaianInternal.pass ? '✅' : '❌'));
  console.log('   📈 TOTAL:         ' + totalScore.total + '/' + totalScore.maxTotal + ' (' + totalScore.percentage + '%) ' + (overallPass ? '✅ PASS' : '❌ FAIL'));
  
  return {
    gateUtama,
    gateTambahan,
    penilaianInternal,
    totalScore,
    overallPass
  };
}

function generateFeedback(aggregatedScores, judgeResults) {
  const feedback = [];
  
  // Gate Utama feedback
  if (!aggregatedScores.gateUtama.pass) {
    if (aggregatedScores.gateUtama.G1 < 4) {
      feedback.push('Improve content alignment with knowledge base topic');
    }
    if (aggregatedScores.gateUtama.G2 < 4) {
      feedback.push('Verify factual accuracy and fix any misleading claims');
    }
    if (aggregatedScores.gateUtama.G3 < 4) {
      feedback.push('Ensure required URL is present and all hard requirements met');
    }
    if (aggregatedScores.gateUtama.G4 < 4) {
      feedback.push('Increase originality - avoid AI patterns and template hooks');
    }
  }
  
  // Gate Tambahan feedback
  if (!aggregatedScores.gateTambahan.pass) {
    if (aggregatedScores.gateTambahan.G5 < 7) {
      feedback.push('Improve engagement potential - stronger hook, better CTA');
    }
    if (aggregatedScores.gateTambahan.G6 < 7) {
      feedback.push('Fix technical issues - grammar, formatting, platform optimization');
    }
  }
  
  // Internal feedback
  if (!aggregatedScores.penilaianInternal.pass) {
    if (aggregatedScores.penilaianInternal.hook < 9) {
      feedback.push('Hook needs improvement - try power pattern (number, question, bold statement)');
    }
    if (aggregatedScores.penilaianInternal.emotion < 9) {
      feedback.push('Add more emotional triggers - include body feeling words');
    }
    if (aggregatedScores.penilaianInternal.ct < 9) {
      feedback.push('Strengthen CTA - add question or engagement hook');
    }
    if (aggregatedScores.penilaianInternal.uniqueness < 9) {
      feedback.push('Remove AI patterns and template phrases');
    }
    if (aggregatedScores.penilaianInternal.viral < 9) {
      feedback.push('Add viral elements - controversy, surprise, or share-worthy insight');
    }
  }
  
  return feedback;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const userInput = process.argv[2];
  
  console.log('\n' + '═'.repeat(70));
  console.log('  RALLY WORKFLOW V9.3.0 - MULTI-LLM JUDGING EDITION');
  console.log('═'.repeat(70));
  console.log(`  Input: ${userInput || 'No input provided'}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log('  Features: Blind Judging, Multi-LLM, No Bias from Campaign');
  console.log('  Max Retries: ' + CONFIG.retry.maxAttempts);
  console.log('═'.repeat(70));
  
  const startTime = Date.now();
  
  // ===== RESOLVE CAMPAIGN INPUT (name or address) =====
  const resolved = await resolveCampaignInput(userInput);
  const campaignAddress = resolved.address;
  
  if (!campaignAddress) {
    console.log('\n❌ No campaign found. Exiting.');
    console.log('\n📋 Usage:');
    console.log('   node scripts/rally-workflow-v9.3.0.js <campaign_address>');
    console.log('   node scripts/rally-workflow-v9.3.0.js <campaign_name>');
    console.log('\n📌 Examples:');
    console.log('   node scripts/rally-workflow-v9.3.0.js 0x5B303819B946F464d275b25552f8c9fD3F7029d8');
    console.log('   node scripts/rally-workflow-v9.3.0.js "Grvt Momentum"');
    console.log('   node scripts/rally-workflow-v9.3.0.js "Internet Court"');
    return { success: false, error: 'No campaign found' };
  }
  
  // ===== PHASE 1: Campaign Data =====
  const campaign = await fetchCampaignData(campaignAddress);
  
  if (!campaign.success) {
    console.log('❌ Campaign data fetch failed. Exiting.');
    return { success: false, error: 'Campaign data fetch failed' };
  }
  
  // ===== PHASE 2: Leaderboard + Submissions =====
  const leaderboardData = await fetchLeaderboardAndSubmissions(campaignAddress);
  
  // Generate judge instructions
  const judgeInstructions = generateJudgeInstructions(
    campaign.data,
    leaderboardData.data.competitorHooks || []
  );
  
  // ===== PHASE 3: Content Generation =====
  const contentResult = await generateContent(campaign.data, leaderboardData.data.competitorHooks || []);
  
  if (!contentResult.success || contentResult.versions.length === 0) {
    console.log('❌ Content generation failed. Exiting.');
    return { success: false, error: 'Content generation failed' };
  }
  
  // ===== PHASE 4: Judging dengan Retry =====
  let bestContent = null;
  let bestScores = null;
  let bestJudgeResults = null;
  let attempt = 0;
  
  for (let versionIndex = 0; versionIndex < contentResult.versions.length; versionIndex++) {
    const version = contentResult.versions[versionIndex];
    const content = version.fullContent || version.tweets?.join('\n\n') || '';
    
    if (!content || content.length < 50) {
      console.log(`\n   ⚠️ Version ${versionIndex + 1} has no content, skipping...`);
      continue;
    }
    
    attempt++;
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📝 Evaluating Version ${versionIndex + 1}/${contentResult.versions.length}`);
    console.log(`   Hook: "${(version.hook || content.split('\n')[0]).substring(0, 60)}..."`);
    console.log('─'.repeat(60));
    
    // Run all 3 judges
    const judgeResults = await runAllJudges(content, judgeInstructions);
    
    // Aggregate scores
    const aggregatedScores = aggregateScores(judgeResults);
    
    // Track best content
    if (!bestScores || aggregatedScores.totalScore.total > bestScores.totalScore.total) {
      bestContent = {
        version: versionIndex + 1,
        hook: version.hook || content.split('\n')[0],
        fullContent: content,
        emotionTypes: version.emotionTypes || [],
        hookPattern: version.hookPattern || 'unknown'
      };
      bestScores = aggregatedScores;
      bestJudgeResults = judgeResults;
    }
    
    // If passed, no need to try other versions
    if (aggregatedScores.overallPass) {
      console.log(`\n   ✅ Version ${versionIndex + 1} PASSED all gates!`);
      break;
    } else {
      console.log(`\n   ❌ Version ${versionIndex + 1} did not pass all gates.`);
      const feedback = generateFeedback(aggregatedScores, judgeResults);
      if (feedback.length > 0) {
        console.log('   📝 Feedback for improvement:');
        feedback.forEach((f, i) => console.log(`      ${i + 1}. ${f}`));
      }
    }
  }
  
  // ===== PHASE 6: Final Output =====
  const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
  
  const output = {
    version: '9.3.0',
    timestamp: new Date().toISOString(),
    campaignAddress: campaignAddress || 'none',
    executionTime: executionTime + 's',
    
    // Campaign data
    campaign: {
      title: campaign.data.title || campaign.data.name,
      goal: campaign.data.goal,
      requiredUrl: extractRequiredUrl(campaign.data),
      knowledgeBasePreview: (campaign.data.knowledgeBase || '').substring(0, 500)
    },
    
    // Competitor data
    competitorAnalysis: {
      totalCompetitors: leaderboardData.data.stats?.totalCompetitors || 0,
      competitorHooks: leaderboardData.data.competitorHooks || []
    },
    
    // Final result
    result: {
      success: bestScores?.overallPass || false,
      finalScore: bestScores?.totalScore || null,
      content: bestContent,
      scores: bestScores,
      judgeResults: bestJudgeResults
    },
    
    // All generated versions
    allVersions: contentResult.versions.map((v, i) => ({
      version: i + 1,
      hook: v.hook,
      hookPattern: v.hookPattern,
      emotionTypes: v.emotionTypes
    }))
  };
  
  // Save to file
  const outputPath = path.join(CONFIG.outputDir, `rally-content-v9.3.0-${Date.now()}.json`);
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  // ===== FINAL SUMMARY =====
  console.log('\n' + '═'.repeat(70));
  console.log('  WORKFLOW V9.3.0 COMPLETE');
  console.log('═'.repeat(70));
  console.log(`  Execution Time: ${executionTime}s`);
  console.log(`  Versions Generated: ${contentResult.versions.length}`);
  console.log(`  Versions Evaluated: ${attempt}`);
  console.log('─'.repeat(70));
  
  if (bestContent && bestScores) {
    console.log('  📝 BEST CONTENT:');
    console.log('  ' + '─'.repeat(68));
    console.log(`  Hook: "${bestContent.hook.substring(0, 65)}${bestContent.hook.length > 65 ? '...' : ''}"`);
    console.log('  ' + '─'.repeat(68));
    console.log(`  Gate Utama:    ${bestScores.gateUtama.total}/${bestScores.gateUtama.max} ${bestScores.gateUtama.pass ? '✅' : '❌'}`);
    console.log(`  Gate Tambahan: ${bestScores.gateTambahan.total}/${bestScores.gateTambahan.max} ${bestScores.gateTambahan.pass ? '✅' : '❌'}`);
    console.log(`  Internal:      ${bestScores.penilaianInternal.total}/${bestScores.penilaianInternal.max} ${bestScores.penilaianInternal.pass ? '✅' : '❌'}`);
    console.log('  ' + '─'.repeat(68));
    console.log(`  TOTAL: ${bestScores.totalScore.total}/${bestScores.totalScore.maxTotal} (${bestScores.totalScore.percentage}%)`);
    console.log(`  STATUS: ${bestScores.overallPass ? '✅ PASSED' : '❌ NEEDS IMPROVEMENT'}`);
  } else {
    console.log('  ❌ No valid content generated');
  }
  
  console.log('─'.repeat(70));
  console.log(`  Output File: ${outputPath}`);
  console.log('═'.repeat(70));
  
  // Print final content if passed
  if (bestScores?.overallPass && bestContent) {
    console.log('\n' + '▼'.repeat(35));
    console.log('FINAL APPROVED CONTENT:');
    console.log('▼'.repeat(35));
    console.log(bestContent.fullContent);
    console.log('▲'.repeat(35) + '\n');
  }
  
  return output;
}

// Export
module.exports = { 
  // Data gathering
  fetchCampaignData, 
  fetchLeaderboardAndSubmissions,
  generateJudgeInstructions,
  searchCampaignByName,
  resolveCampaignInput,
  
  // Content generation
  generateContent,
  CONTENT_PROMPTS,
  
  // Multi-LLM Judging
  runJudge1,
  runJudge2,
  runJudge3,
  runAllJudges,
  
  // Decision logic
  aggregateScores,
  generateFeedback,
  
  // Utils
  extractRequiredUrl,
  prepareJudge1Input,
  prepareJudge2Input,
  prepareJudge3Input,
  
  // Configs
  JUDGE_PROMPTS,
  CONFIG,
  
  // Main
  main
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
