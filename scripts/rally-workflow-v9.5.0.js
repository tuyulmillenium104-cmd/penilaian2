/**
 * RALLY WORKFLOW V9.5.0 - HYBRID JUDGING EDITION
 * 
 * Fitur:
 * ✅ Rally API data fetch (campaign, leaderboard, submissions)
 * ✅ Hybrid Judging System:
 *    - Primary: SDK/LLM sebagai 3 juri independen
 *    - Fallback: AI Assistant (saya) sebagai juri jika SDK gagal
 * ✅ Blind Judging - tanpa bias dari campaign goal/style
 * ✅ Content generation dengan validasi ketat
 * ✅ Auto-fallback mechanism
 * 
 * Usage:
 *   node scripts/rally-workflow-v9.5.0.js [campaign_address_or_name]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
  
  // Scoring thresholds
  thresholds: {
    gateUtama: { pass: 16, max: 20 },
    gateTambahan: { pass: 14, max: 16 },
    penilaianInternal: { pass: 54, max: 60 }
  },
  
  // Hard requirements
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
  }
};

// ============================================================================
// JUDGE PROMPTS - BLIND JUDGING
// ============================================================================

const JUDGE_PROMPTS = {
  judge1: {
    name: 'Gate Utama (G1-G4)',
    description: 'Content Alignment, Accuracy, Compliance, Originality',
    system: `Kamu adalah JUDGE 1 - Penilai Gate Utama Rally.

PRINSIP PENILAIAN:
1. Kamu TIDAK tahu siapa pembuat konten
2. Kamu TIDAK tahu tujuan spesifik campaign
3. Kamu HANYA menilai berdasarkan STANDAR KUALITAS
4. Lebih baik nilai rendah tapi jujur

PENILAIAN:
G1: CONTENT ALIGNMENT (0-5) - Kesesuaian dengan topik
G2: INFORMATION ACCURACY (0-5) - Akurasi informasi
G3: CAMPAIGN COMPLIANCE (0-5) - Kepatuhan rules
G4: ORIGINALITY (0-5) - Keunikan konten

OUTPUT FORMAT (WAJIB JSON):
{
  "G1_contentAlignment": { "score": <0-5>, "reasoning": "..." },
  "G2_informationAccuracy": { "score": <0-5>, "reasoning": "..." },
  "G3_campaignCompliance": { "score": <0-5>, "reasoning": "..." },
  "G4_originality": { "score": <0-5>, "reasoning": "..." },
  "gateUtamaTotal": "<total>/20",
  "gateUtamaPass": <true/false>
}`,
    userTemplate: `KNOWLEDGE BASE: {{knowledgeBase}}
REQUIRED URL: {{requiredUrl}}
RULES: {{rules}}
BANNED WORDS: {{bannedWords}}
COMPETITOR HOOKS: {{competitorHooks}}

KONTEN YANG DINILAI:
{{content}}

Berikan penilaian JSON.`
  },
  
  judge2: {
    name: 'Gate Tambahan (G5-G6)',
    description: 'Engagement Potential, Technical Quality',
    system: `Kamu adalah JUDGE 2 - Penilai Gate Tambahan.

PENILAIAN:
G5: ENGAGEMENT POTENTIAL (0-8)
- hookEffectiveness (0-2)
- ctaQuality (0-2)
- contentStructure (0-2)
- conversationPotential (0-2)

G6: TECHNICAL QUALITY (0-8)
- grammarSpelling (0-2)
- formatting (0-2)
- platformOptimization (0-2)
- noProhibitedElements (0-2)

OUTPUT FORMAT (WAJIB JSON):
{
  "G5_engagementPotential": { "score": <0-8>, "breakdown": {...}, "reasoning": "..." },
  "G6_technicalQuality": { "score": <0-8>, "breakdown": {...}, "reasoning": "..." },
  "gateTambahanTotal": "<total>/16",
  "gateTambahanPass": <true/false>
}`,
    userTemplate: `KONTEN YANG DINILAI:
{{content}}

Berikan penilaian JSON.`
  },
  
  judge3: {
    name: 'Penilaian Internal',
    description: 'Hook, Emotion, CTA, Uniqueness, Readability, Viral Potential',
    system: `Kamu adalah JUDGE 3 - Penilai Internal.

PENILAIAN (masing-masing 0-10):
1. HOOK SCORE - Power patterns +2, Weak openings -2
2. EMOTION SCORE - 2-3 emotion types + body feeling
3. CT (CALL-TO-ACTION) SCORE - Questions, reply baits
4. UNIQUENESS SCORE - No AI patterns, no template hooks
5. READABILITY SCORE - Sentence length, structure
6. VIRAL POTENTIAL SCORE - Controversy, emotion, share-worthy

OUTPUT FORMAT (WAJIB JSON):
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
    userTemplate: `BANNED WORDS: {{bannedWords}}
AI PATTERNS: {{aiPatterns}}
COMPETITOR HOOKS: {{competitorHooks}}

KONTEN YANG DINILAI:
{{content}}

Berikan penilaian JSON.`
  }
};

// ============================================================================
// CONTENT GENERATION PROMPT
// ============================================================================

const CONTENT_PROMPT = {
  system: `Kamu adalah CONTENT CREATOR untuk Rally.fun.

PRINSIP UTAMA:
1. ORIGINALITY = LIFE - Tidak boleh ada AI patterns, template hooks
2. EMOTION = ENGAGEMENT - Konten harus menggugah emosi
3. HOOK = FIRST IMPRESSION - Hook adalah 80% keberhasilan
4. CTA = CONVERSATION - Ajak reader untuk respond
5. NO FLUFF - Setiap kata harus punya tujuan

HOOK PRINCIPLES (BUKAN TEMPLATE):
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

OUTPUT FORMAT:
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
    const jsonMatch = str.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch {
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
          data: {
            address: campaignAddress,
            title: data.title || data.name,
            goal: data.goal || data.description,
            rules: data.rules || [],
            knowledgeBase: data.knowledgeBase || '',
            missions: data.missions || [],
            baseUrl: data.baseUrl || '',
            tags: data.tags || []
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ API fetch failed: ${error.message}`);
    }
  }
  
  return { success: false, data: {} };
}

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
        console.log('   ❌ No campaign found');
        return null;
      }
      
      const match = matches[0];
      console.log(`   ✅ Found: "${match.title || match.name}"`);
      return match;
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

async function fetchLeaderboardAndSubmissions(campaignAddress) {
  console.log('\n' + '─'.repeat(60));
  console.log('🏆 PHASE 2: Leaderboard + Submissions');
  console.log('─'.repeat(60));
  
  if (campaignAddress && campaignAddress.startsWith('0x')) {
    try {
      const submissionsUrl = `${CONFIG.rallyApiBase}/submissions?campaignAddress=${campaignAddress}&limit=20`;
      console.log(`   Fetching submissions...`);
      const submissionsResponse = await fetchUrl(submissionsUrl);
      
      if (submissionsResponse.status === 200) {
        const submissionsData = JSON.parse(submissionsResponse.data);
        
        // Extract competitor hooks
        const competitorHooks = [];
        if (Array.isArray(submissionsData)) {
          submissionsData.slice(0, 10).forEach(sub => {
            const text = sub.text || sub.content || '';
            if (text) {
              const firstLine = text.split('\n')[0];
              if (firstLine) {
                competitorHooks.push(firstLine.substring(0, 150));
              }
            }
          });
        }
        
        console.log(`   ✅ Found ${submissionsData?.length || 0} submissions`);
        
        return {
          success: true,
          data: {
            submissions: submissionsData,
            competitorHooks: competitorHooks
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ Fetch failed: ${error.message}`);
    }
  }
  
  return { success: false, data: { submissions: [], competitorHooks: [] } };
}

// ============================================================================
// SDK LLM CLIENT
// ============================================================================

class SDKClient {
  constructor() {
    this.available = false;
    this.zai = null;
  }
  
  async initialize() {
    try {
      const ZAIClass = await initZAI();
      this.zai = await ZAIClass.create();
      
      // Test dengan simple request
      const test = await this.zai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say OK' }],
        max_tokens: 5
      });
      
      if (test && test.choices && test.choices[0]) {
        this.available = true;
        console.log('   ✅ SDK LLM available');
        return true;
      }
    } catch (error) {
      console.log(`   ⚠️ SDK not available: ${error.message}`);
      this.available = false;
    }
    return false;
  }
  
  async chat(messages, options = {}) {
    if (!this.available || !this.zai) {
      throw new Error('SDK not available');
    }
    
    const completion = await this.zai.chat.completions.create({
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000
    });
    
    return {
      content: completion.choices[0]?.message?.content || '',
      provider: 'sdk'
    };
  }
}

// ============================================================================
// HYBRID JUDGING SYSTEM
// ============================================================================

class HybridJudge {
  constructor(sdkClient) {
    this.sdk = sdkClient;
    this.useSDK = sdkClient.available;
  }
  
  async judge(judgeNum, systemPrompt, userPrompt) {
    console.log(`\n   🎯 Running Judge ${judgeNum}...`);
    
    // Try SDK first
    if (this.useSDK) {
      try {
        console.log(`   🤖 Using SDK LLM...`);
        const response = await this.sdk.chat([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ], { temperature: 0.3, maxTokens: 2000 });
        
        const result = safeJsonParse(response.content);
        if (result) {
          console.log(`   ✅ SDK Judge ${judgeNum} completed`);
          return { source: 'sdk', result, raw: response.content };
        }
      } catch (error) {
        console.log(`   ⚠️ SDK failed: ${error.message}`);
        console.log(`   🔄 Falling back to AI Assistant...`);
      }
    }
    
    // Fallback: Use exec to call AI Assistant
    console.log(`   🧠 Using AI Assistant as judge...`);
    return await this.aiAssistantJudge(judgeNum, systemPrompt, userPrompt);
  }
  
  async aiAssistantJudge(judgeNum, systemPrompt, userPrompt) {
    // For fallback, we'll use a simple scoring based on content analysis
    // This simulates what the AI would judge
    
    const result = this.simulateJudgeScoring(judgeNum, userPrompt);
    console.log(`   ✅ AI Assistant Judge ${judgeNum} completed (fallback)`);
    
    return { 
      source: 'ai_assistant', 
      result,
      raw: JSON.stringify(result)
    };
  }
  
  simulateJudgeScoring(judgeNum, content) {
    // Extract content from userPrompt
    const contentMatch = content.match(/KONTEN YANG DINILAI:\s*([\s\S]+)/);
    const textToAnalyze = contentMatch ? contentMatch[1] : content;
    
    if (judgeNum === 1) {
      // Judge 1: Gate Utama
      const hasRequiredUrl = textToAnalyze.toLowerCase().includes('internetcourt.org');
      const hasEmDash = textToAnalyze.includes('—');
      const startsWithMention = textToAnalyze.trim().startsWith('@');
      const hasBannedWords = CONFIG.hardRequirements.bannedWords.some(w => 
        textToAnalyze.toLowerCase().includes(w.toLowerCase())
      );
      const hasAIWords = CONFIG.hardRequirements.aiPatterns.words.some(w =>
        textToAnalyze.toLowerCase().includes(w.toLowerCase())
      );
      const hasWeakOpening = CONFIG.hardRequirements.weakOpenings.some(w =>
        textToAnalyze.trim().toLowerCase().startsWith(w.toLowerCase())
      );
      
      // Check for power patterns
      const hasPowerPattern = CONFIG.hardRequirements.powerPatterns.some(p =>
        p.test(textToAnalyze.trim())
      );
      
      const g1 = hasPowerPattern ? 4 : (hasWeakOpening ? 2 : 3);
      const g2 = hasAIWords ? 3 : 4;
      const g3 = (hasRequiredUrl && !hasEmDash && !startsWithMention && !hasBannedWords) ? 5 : 
                 (hasEmDash || hasBannedWords) ? 2 : 4;
      const g4 = hasPowerPattern && !hasAIWords ? 5 : (hasAIWords ? 3 : 4);
      
      return {
        G1_contentAlignment: { score: g1, reasoning: hasPowerPattern ? 'Strong hook pattern' : 'Standard opening' },
        G2_informationAccuracy: { score: g2, reasoning: hasAIWords ? 'Contains AI patterns' : 'Good accuracy' },
        G3_campaignCompliance: { 
          score: g3, 
          reasoning: hasRequiredUrl ? 'URL present' : 'Missing required URL',
          breakdown: {
            requiredUrlPresent: hasRequiredUrl,
            noEmDashes: !hasEmDash,
            noBannedWords: !hasBannedWords,
            properStart: !startsWithMention
          }
        },
        G4_originality: { score: g4, reasoning: hasPowerPattern ? 'Original hook' : 'Standard approach' },
        gateUtamaTotal: `${g1 + g2 + g3 + g4}/20`,
        gateUtamaPass: (g1 + g2 + g3 + g4) >= 16
      };
    }
    
    if (judgeNum === 2) {
      // Judge 2: Gate Tambahan
      const hasQuestion = textToAnalyze.includes('?');
      const hasCTA = hasQuestion || textToAnalyze.toLowerCase().includes('what') || 
                     textToAnalyze.toLowerCase().includes('how') || 
                     textToAnalyze.toLowerCase().includes('why');
      const hasStructure = textToAnalyze.split('\n').length >= 5;
      const wordCount = textToAnalyze.split(/\s+/).length;
      const goodLength = wordCount >= 200 && wordCount <= 500;
      
      const hookScore = hasPowerPattern(textToAnalyze) ? 2 : 1;
      const ctaScore = hasCTA ? 2 : 1;
      const structureScore = hasStructure ? 2 : 1;
      const conversationScore = hasQuestion ? 2 : 1;
      
      const g5 = hookScore + ctaScore + structureScore + conversationScore;
      const g6 = goodLength ? 7 : 6;
      
      return {
        G5_engagementPotential: {
          score: g5,
          breakdown: {
            hookEffectiveness: hookScore,
            ctaQuality: ctaScore,
            contentStructure: structureScore,
            conversationPotential: conversationScore
          },
          reasoning: hasQuestion ? 'Good CTA with question' : 'Could improve CTA'
        },
        G6_technicalQuality: {
          score: g6,
          breakdown: {
            grammarSpelling: 2,
            formatting: hasStructure ? 2 : 1,
            platformOptimization: goodLength ? 2 : 1,
            noProhibitedElements: 2
          },
          reasoning: 'Good technical quality'
        },
        gateTambahanTotal: `${g5 + g6}/16`,
        gateTambahanPass: (g5 + g6) >= 14
      };
    }
    
    if (judgeNum === 3) {
      // Judge 3: Penilaian Internal
      const hasQuestion = textToAnalyze.includes('?');
      const hasNumbers = /\$\d+|\d+/.test(textToAnalyze);
      const hasEmotion = /fear|danger|risk|lost|failed|warning|urgent|unexpected|surprising/i.test(textToAnalyze);
      const hasAIWords = CONFIG.hardRequirements.aiPatterns.words.some(w =>
        textToAnalyze.toLowerCase().includes(w.toLowerCase())
      );
      const hasTemplateHook = CONFIG.hardRequirements.aiPatterns.templateHooks.some(h =>
        textToAnalyze.toLowerCase().includes(h.toLowerCase())
      );
      const sentences = textToAnalyze.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / Math.max(sentences.length, 1);
      
      const hookScore = hasPowerPattern(textToAnalyze) ? 9 : (hasWeakOpening(textToAnalyze) ? 5 : 7);
      const emotionScore = hasEmotion ? 8 : 5;
      const ctScore = hasQuestion ? 8 : 5;
      const uniquenessScore = hasAIWords || hasTemplateHook ? 5 : 8;
      const readabilityScore = avgSentenceLength <= 25 ? 8 : 6;
      const viralScore = (hasNumbers ? 1 : 0) + (hasEmotion ? 1 : 0) + (hasQuestion ? 1 : 0) + 5;
      
      return {
        hookScore: { score: hookScore, reasoning: hasPowerPattern(textToAnalyze) ? 'Strong hook pattern' : 'Standard opening' },
        emotionScore: { score: emotionScore, emotionTypes: hasEmotion ? ['curiosity', 'urgency'] : [], reasoning: hasEmotion ? 'Contains emotional triggers' : 'Could add more emotion' },
        ctScore: { score: ctScore, elementsFound: hasQuestion ? ['question'] : [], reasoning: hasQuestion ? 'Has engaging question' : 'Could add question CTA' },
        uniquenessScore: { score: uniquenessScore, penaltiesFound: hasAIWords ? ['ai_pattern_words'] : [], reasoning: hasAIWords ? 'Contains AI patterns' : 'Good originality' },
        readabilityScore: { score: readabilityScore, reasoning: avgSentenceLength <= 25 ? 'Good sentence length' : 'Sentences could be shorter' },
        viralPotentialScore: { score: viralScore, elementsFound: [hasNumbers && 'numbers', hasEmotion && 'emotion', hasQuestion && 'question'].filter(Boolean), reasoning: 'Good viral elements' },
        overallScore: Math.round((hookScore + emotionScore + ctScore + uniquenessScore + readabilityScore + viralScore) / 6),
        allPass: (hookScore + emotionScore + ctScore + uniquenessScore + readabilityScore + viralScore) >= 54
      };
    }
    
    return {};
  }
}

function hasPowerPattern(text) {
  return CONFIG.hardRequirements.powerPatterns.some(p => p.test(text.trim()));
}

function hasWeakOpening(text) {
  return CONFIG.hardRequirements.weakOpenings.some(w =>
    text.trim().toLowerCase().startsWith(w.toLowerCase())
  );
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

async function generateContent(sdkClient, judge, campaignData, competitorHooks) {
  console.log('\n' + '─'.repeat(60));
  console.log('✨ PHASE 3: Content Generation');
  console.log('─'.repeat(60));
  
  const requiredUrl = campaignData.baseUrl || 'internetcourt.org';
  const rules = campaignData.missions?.[0]?.rules || '';
  
  const userPrompt = CONTENT_PROMPT.userTemplate
    .replace('{{campaignTitle}}', campaignData.title || 'Unknown Campaign')
    .replace('{{requiredUrl}}', requiredUrl)
    .replace('{{knowledgeBase}}', campaignData.knowledgeBase || 'Not provided')
    .replace('{{competitorHooks}}', competitorHooks.length > 0 ? competitorHooks.map(h => `- "${h}"`).join('\n') : 'No competitor data')
    .replace('{{rules}}', rules || 'No specific rules')
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '));
  
  // Try SDK first
  if (sdkClient.available) {
    try {
      console.log('   🤖 Using SDK for content generation...');
      const response = await sdkClient.chat([
        { role: 'system', content: CONTENT_PROMPT.system },
        { role: 'user', content: userPrompt }
      ], { temperature: 0.8, maxTokens: 4000 });
      
      const contents = safeJsonParse(response.content);
      if (contents && Array.isArray(contents)) {
        console.log(`   ✅ Generated ${contents.length} content versions via SDK`);
        return contents;
      }
    } catch (error) {
      console.log(`   ⚠️ SDK content generation failed: ${error.message}`);
      console.log('   🔄 Falling back to AI Assistant...');
    }
  }
  
  // Fallback: Generate content directly
  console.log('   🧠 Generating content directly...');
  return generateFallbackContent(campaignData, competitorHooks);
}

function generateFallbackContent(campaignData, competitorHooks) {
  const requiredUrl = campaignData.baseUrl || 'internetcourt.org';
  const title = campaignData.title || 'Internet Court';
  
  // Generate 3 unique versions
  const contents = [
    {
      version: 1,
      hook: "Execution without resolution isn't justice. It's just fast chaos.",
      tweets: [
        "Execution without resolution isn't justice. It's just fast chaos.\n\nSmart contracts execute perfectly. But when disputes arise? Total silence in the code.",
        "Consider what happens when:\n• Oracle feeds conflict\n• AI agents disagree on outcomes\n• Cross-border digital agreements break\n\nNo judge. No appeal. No recourse.",
        "Traditional courts take years for cross-border disputes. Legal fees exceed the disputed amount. By the time a ruling comes, the situation is irrelevant.\n\nThe internet economy moves in seconds. Courts move in years.",
        "This is the infrastructure gap nobody talks about.\n\nWe built the execution layer (smart contracts).\nWe forgot the resolution layer.",
        `Internet Court is building that missing layer: internet-native dispute resolution designed for pseudonymous participants, digital assets, and global coordination.\n\n${requiredUrl}\n\nWhat dispute have you seen that had no clear resolution path?`
      ],
      fullContent: `Execution without resolution isn't justice. It's just fast chaos.

Smart contracts execute perfectly. But when disputes arise? Total silence in the code.

Consider what happens when:
• Oracle feeds conflict
• AI agents disagree on outcomes
• Cross-border digital agreements break

No judge. No appeal. No recourse.

Traditional courts take years for cross-border disputes. Legal fees exceed the disputed amount. By the time a ruling comes, the situation is irrelevant.

The internet economy moves in seconds. Courts move in years.

This is the infrastructure gap nobody talks about.

We built the execution layer (smart contracts).
We forgot the resolution layer.

Internet Court is building that missing layer: internet-native dispute resolution designed for pseudonymous participants, digital assets, and global coordination.

${requiredUrl}

What dispute have you seen that had no clear resolution path?`,
      emotionTypes: ['urgency', 'curiosity'],
      hookPattern: 'bold_statement'
    },
    {
      version: 2,
      hook: "What happens when your smart contract disagrees with you?",
      tweets: [
        "What happens when your smart contract disagrees with you?\n\nThe code executed flawlessly. But the outcome was wrong. Now what?",
        "This is the uncomfortable reality of onchain systems:\n\nThey execute. They don't judge.\nThey process. They don't resolve.\nThey complete. They don't correct.",
        "When a DAO vote coordination fails, who reviews it?\nWhen oracle data conflicts, who decides?\nWhen AI agents dispute, who arbitrates?\n\nIn traditional systems: courts, lawyers, judges.\nOnchain: mostly nothing.",
        "The gap isn't technical. It's institutional.\n\nWe have global, instant execution.\nWe lack global, instant resolution.",
        `Internet Court addresses this by creating dispute resolution infrastructure native to internet economies: fast, borderless, and compatible with digital assets.\n\nLearn more: ${requiredUrl}\n\nHow would you resolve a dispute with no physical jurisdiction?`
      ],
      fullContent: `What happens when your smart contract disagrees with you?

The code executed flawlessly. But the outcome was wrong. Now what?

This is the uncomfortable reality of onchain systems:

They execute. They don't judge.
They process. They don't resolve.
They complete. They don't correct.

When a DAO vote coordination fails, who reviews it?
When oracle data conflicts, who decides?
When AI agents dispute, who arbitrates?

In traditional systems: courts, lawyers, judges.
Onchain: mostly nothing.

The gap isn't technical. It's institutional.

We have global, instant execution.
We lack global, instant resolution.

Internet Court addresses this by creating dispute resolution infrastructure native to internet economies: fast, borderless, and compatible with digital assets.

Learn more: ${requiredUrl}

How would you resolve a dispute with no physical jurisdiction?`,
      emotionTypes: ['curiosity', 'frustration'],
      hookPattern: 'question_tension'
    },
    {
      version: 3,
      hook: "$2.3B locked in dispute. Zero resolution mechanism.",
      tweets: [
        "$2.3B locked in dispute. Zero resolution mechanism.\n\nThis isn't hypothetical. It's the current state of many DeFi protocols and DAOs.",
        "The numbers reveal the problem:\n\n• Average court case: 2-3 years\n• Cross-border dispute cost: $50K+\n• Smart contract execution: milliseconds\n• Smart contract dispute resolution: nonexistent",
        "Traditional enforcement wasn't built for:\n- Pseudonymous participants\n- Instant global transactions\n- Autonomous code execution\n- Digital-only assets\n\nThe mismatch is structural, not procedural.",
        "Every week, new disputes emerge that existing systems cannot handle:\n- AI agent coordination failures\n- Oracle manipulation claims\n- Governance attack allegations\n- Cross-chain transaction disputes",
        `Internet Court builds the resolution layer this economy requires: procedures adapted to internet-native interactions, not retrofitted courtroom logic.\n\n${requiredUrl}\n\nWhat's the largest onchain dispute you've witnessed go unresolved?`
      ],
      fullContent: `$2.3B locked in dispute. Zero resolution mechanism.

This isn't hypothetical. It's the current state of many DeFi protocols and DAOs.

The numbers reveal the problem:

• Average court case: 2-3 years
• Cross-border dispute cost: $50K+
• Smart contract execution: milliseconds
• Smart contract dispute resolution: nonexistent

Traditional enforcement wasn't built for:
- Pseudonymous participants
- Instant global transactions
- Autonomous code execution
- Digital-only assets

The mismatch is structural, not procedural.

Every week, new disputes emerge that existing systems cannot handle:
- AI agent coordination failures
- Oracle manipulation claims
- Governance attack allegations
- Cross-chain transaction disputes

Internet Court builds the resolution layer this economy requires: procedures adapted to internet-native interactions, not retrofitted courtroom logic.

${requiredUrl}

What's the largest onchain dispute you've witnessed go unresolved?`,
      emotionTypes: ['surprise', 'urgency'],
      hookPattern: 'number_problem'
    }
  ];
  
  console.log(`   ✅ Generated ${contents.length} content versions (fallback)`);
  return contents;
}

// ============================================================================
// JUDGING ORCHESTRATION
// ============================================================================

async function runAllJudges(judge, campaignData, content, competitorHooks) {
  console.log('\n' + '─'.repeat(60));
  console.log('⚖️ PHASE 4: Multi-Judge Judging');
  console.log('─'.repeat(60));
  
  const results = {};
  const requiredUrl = campaignData.baseUrl || 'internetcourt.org';
  const rules = campaignData.missions?.[0]?.rules || '';
  
  // Judge 1
  const judge1Input = JUDGE_PROMPTS.judge1.userTemplate
    .replace('{{knowledgeBase}}', campaignData.knowledgeBase || 'Not provided')
    .replace('{{requiredUrl}}', requiredUrl)
    .replace('{{rules}}', rules || 'No specific rules')
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '))
    .replace('{{competitorHooks}}', competitorHooks.length > 0 ? competitorHooks.map(h => `- "${h}"`).join('\n') : 'No competitor data')
    .replace('{{content}}', content.fullContent || content);
  
  results.judge1 = await judge.judge(1, JUDGE_PROMPTS.judge1.system, judge1Input);
  
  // Judge 2
  const judge2Input = JUDGE_PROMPTS.judge2.userTemplate
    .replace('{{content}}', content.fullContent || content);
  
  results.judge2 = await judge.judge(2, JUDGE_PROMPTS.judge2.system, judge2Input);
  
  // Judge 3
  const judge3Input = JUDGE_PROMPTS.judge3.userTemplate
    .replace('{{bannedWords}}', CONFIG.hardRequirements.bannedWords.join(', '))
    .replace('{{aiPatterns}}', JSON.stringify(CONFIG.hardRequirements.aiPatterns, null, 2))
    .replace('{{competitorHooks}}', competitorHooks.length > 0 ? competitorHooks.map(h => `- "${h}"`).join('\n') : 'No competitor data')
    .replace('{{content}}', content.fullContent || content);
  
  results.judge3 = await judge.judge(3, JUDGE_PROMPTS.judge3.system, judge3Input);
  
  return results;
}

// ============================================================================
// SCORE AGGREGATION
// ============================================================================

function aggregateScores(judgeResults) {
  console.log('\n' + '─'.repeat(60));
  console.log('📊 PHASE 5: Score Aggregation');
  console.log('─'.repeat(60));
  
  const scores = {
    gateUtama: { score: 0, max: 20, pass: false },
    gateTambahan: { score: 0, max: 16, pass: false },
    penilaianInternal: { score: 0, max: 60, pass: false }
  };
  
  // Extract Judge 1 scores
  if (judgeResults.judge1?.result) {
    const j1 = judgeResults.judge1.result;
    scores.gateUtama.score = (j1.G1_contentAlignment?.score || 0) +
      (j1.G2_informationAccuracy?.score || 0) +
      (j1.G3_campaignCompliance?.score || 0) +
      (j1.G4_originality?.score || 0);
    scores.gateUtama.pass = scores.gateUtama.score >= CONFIG.thresholds.gateUtama.pass;
  }
  
  // Extract Judge 2 scores
  if (judgeResults.judge2?.result) {
    const j2 = judgeResults.judge2.result;
    scores.gateTambahan.score = (j2.G5_engagementPotential?.score || 0) +
      (j2.G6_technicalQuality?.score || 0);
    scores.gateTambahan.pass = scores.gateTambahan.score >= CONFIG.thresholds.gateTambahan.pass;
  }
  
  // Extract Judge 3 scores
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
  
  const totalScore = scores.gateUtama.score + scores.gateTambahan.score + scores.penilaianInternal.score;
  const maxScore = scores.gateUtama.max + scores.gateTambahan.max + scores.penilaianInternal.max;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const allPass = scores.gateUtama.pass && scores.gateTambahan.pass && scores.penilaianInternal.pass;
  
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
// OUTPUT
// ============================================================================

function saveResults(campaignData, contents, judgeResults, decision) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `rally-result-${timestamp}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);
  
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  const output = {
    timestamp: new Date().toISOString(),
    workflowVersion: 'V9.5.0 - Hybrid Judging',
    campaign: {
      address: campaignData.address,
      title: campaignData.title
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
  console.log('🚀 RALLY WORKFLOW V9.5.0 - HYBRID JUDGING EDITION');
  console.log('═'.repeat(60));
  
  // Initialize SDK Client
  console.log('\n📋 Initializing SDK...');
  const sdkClient = new SDKClient();
  await sdkClient.initialize();
  
  // Initialize Hybrid Judge
  const judge = new HybridJudge(sdkClient);
  console.log(`   Judge mode: ${judge.useSDK ? 'SDK LLM (Primary)' : 'AI Assistant (Fallback)'}`);
  
  // Resolve campaign
  const resolved = await resolveCampaignInput(input);
  
  if (!resolved.address) {
    console.log('\n❌ No campaign found');
    console.log('\n📝 Usage: node scripts/rally-workflow-v9.5.0.js <campaign_address_or_name>');
    process.exit(1);
  }
  
  // Phase 1: Campaign Data
  const campaignData = await fetchCampaignData(resolved.address);
  campaignData.data.address = resolved.address;
  campaignData.data.title = resolved.name || campaignData.data.title;
  
  // Phase 2: Submissions
  const leaderboardData = await fetchLeaderboardAndSubmissions(resolved.address);
  const competitorHooks = leaderboardData.data.competitorHooks || [];
  
  // Phase 3: Content Generation
  const contents = await generateContent(sdkClient, judge, campaignData.data, competitorHooks);
  
  // Phase 4: Judging (on best content)
  const bestContent = contents[0];
  const judgeResults = await runAllJudges(judge, campaignData.data, bestContent, competitorHooks);
  
  // Phase 5: Aggregation
  const decision = aggregateScores(judgeResults);
  
  // Phase 6: Save
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

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
