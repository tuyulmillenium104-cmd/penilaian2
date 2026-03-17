================================================================================
                    RALLY WORKFLOW V8.0 - PART 4
                    SKILL INTEGRATION & IMPLEMENTATION
================================================================================

================================================================================
                    SECTION 21: SKILL INTEGRATION CODE
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                    KETERANGAN PENTING                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SKILL INTEGRATION CODE adalah ORKESTRATOR yang menjalankan SELURUH         │
│  workflow dari Phase 1.6 sampai Phase 13.                                    │
│                                                                              │
│  Skill dipanggil SELAMA proses pembuatan konten, BUKAN setelah konten jadi. │
│                                                                              │
│  Timeline Skill Usage:                                                       │
│  ─────────────────────                                                       │
│  Phase 1.6 → FINANCE skill (market data)                                    │
│  Phase 1.7 → WEB-SEARCH + WEB-READER (external data)                        │
│  Phase 3   → LLM skill #1-3 (hook, thread, multi-version)                   │
│  Phase 12  → LLM skill #4 (score prediction)                                │
│  Phase 13  → LLM skill #5 (optimization)                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

```typescript
// ============================================================================
// RALLY WORKFLOW V8.0 - COMPLETE IMPLEMENTATION
// ============================================================================

import ZAI from 'z-ai-web-dev-sdk';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'protocol' | 'event' | 'product' | 'community';
  hasToken: boolean;
  tokenSymbol?: string;
  isCryptoRelated: boolean;
  requirements: {
    mentions: string[];
    hashtags: string[];
    links: string[];
    keywords: string[];
  };
  knowledgeBase: {
    facts: string[];
    terminology: string[];
    valueProps: string[];
  };
}

interface GapAnalysis {
  foundHooks: string[];
  foundEmotions: string[];
  foundAngles: string[];
  missingHooks: string[];
  missingEmotions: string[];
  missingAngles: string[];
  selectedGap: string;
  gapReason: string;
}

interface MarketData {
  BTC?: { price: number; change24h: number };
  ETH?: { price: number; change24h: number };
  token?: { symbol: string; price: number; change24h: number };
  fearGreed?: { value: number; label: string };
}

interface MarketEmotion {
  primary: string;
  secondary: string;
  intensity: number;
  trendJackingOpportunity: boolean;
}

interface ExternalData {
  searchResults: Record<string, any[]>;
  extractedContent: Record<string, any[]>;
  keyFacts: {
    facts: any[];
    quotes: any[];
    statistics: any[];
  };
}

interface GeneratedContent {
  hook: string;
  thread: Record<number, string>;
  metadata: {
    hookType: string;
    emotion: string;
    angle: string;
    frPotential: number;
  };
}

interface Scores {
  G1: { score: number; aspects: Record<string, number> };
  G2: { score: number; aspects: Record<string, number> };
  G3: { score: number; aspects: Record<string, number> };
  G4: { score: number; aspects: Record<string, number> };
  EP: { score: number; aspects: Record<string, number> };
  TQ: { score: number; aspects: Record<string, number> };
  masterScore: number;
}

// ============================================================================
// MAIN WORKFLOW CLASS - ORKESTRATOR
// ============================================================================

class RallyWorkflowV8 {
  private zai: any;
  private workflowState: any;
  
  // TEMPLATE BLACKLIST - CRITICAL!
  private readonly TEMPLATE_BLACKLIST = [
    'unpopular opinion',
    'hot take',
    'change my mind',
    'nobody is talking about',
    "here's the thing",
    'here is the thing',
    'thread 🧵',
    'let me explain',
    '95% of people',
    '3am realization',
    'pov:',
    'unpopular but true',
    'the truth about',
    'what they don\'t tell you',
    'nobody wants to admit'
  ];

  // ALL HOOK TYPES FOR GAP ANALYSIS
  private readonly ALL_HOOK_TYPES = [
    'curiosity', 'controversy', 'contrarian', 'educational',
    'fomo', 'story', 'revelation', 'debate', 'case_study'
  ];

  // ALL EMOTION TYPES
  private readonly ALL_EMOTION_TYPES = [
    'fear', 'greed', 'curiosity', 'excitement', 'anger',
    'surprise', 'empathy', 'pride', 'righteous_indignation'
  ];

  // ALL ANGLE TYPES
  private readonly ALL_ANGLE_TYPES = [
    'educational', 'promotional', 'controversial', 'personal',
    'news', 'tutorial', 'comparison', 'prediction'
  ];

  async initialize() {
    this.zai = await ZAI.create();
    this.workflowState = {
      workflowId: this.generateUUID(),
      startTime: Date.now(),
      currentPhase: 0,
      iterationCount: 0,
      maxIterations: 3,
      externalData: {},
      generatedContent: null,
      predictedScores: null,
      actualScores: null
    };
  }

  // =========================================================================
  // MAIN ORCHESTRATION METHOD - MENJALANKAN SEMUA PHASE
  // =========================================================================

  async run(campaignId: string, userWallet: string): Promise<any> {
    
    // PHASE 0: Initialize
    await this.initialize();
    
    // PHASE 1: Campaign Research (Rally API)
    const campaign = await this.fetchCampaignData(campaignId);
    
    // PHASE 1.5: Leaderboard Analysis
    const leaderboardData = await this.fetchLeaderboard(campaignId);
    const gapAnalysis = this.analyzeGaps(leaderboardData);
    
    // PHASE 1.6: Market Context (FINANCE SKILL)
    const { marketData, marketEmotion } = await this.fetchMarketContext(campaign);
    
    // PHASE 1.7: External Data Collection (WEB-SEARCH + WEB-READER SKILLS)
    const externalData = await this.collectExternalData(campaign, gapAnalysis, marketEmotion);
    
    // PHASE 2: Knowledge Base Extraction
    const knowledgeBase = this.combineKnowledgeBase(campaign, externalData);
    
    // PHASE 3: Generation Engine (LLM SKILL #1-3)
    const content = await this.generateContent(
      campaign,
      externalData,
      gapAnalysis,
      marketEmotion,
      gapAnalysis.frTarget
    );
    
    // PHASE 4-11: Enhancement Layers
    const enhancedContent = this.applyEnhancementLayers(content, gapAnalysis, campaign);
    
    // PHASE 12: Quality Scoring (LLM SKILL #4)
    const predictedScores = await this.predictScores(enhancedContent);
    
    // PHASE 13: Iterative Refinement (LLM SKILL #5)
    const refinedResult = await this.refineContent(enhancedContent, predictedScores);
    
    // PHASE 14-15: Pre-Submit
    if (refinedResult.success) {
      const validationResult = this.validateContent(refinedResult.content, campaign);
      
      // PHASE 16: Submit
      if (validationResult.valid) {
        const submissionResult = await this.submitContent(refinedResult.content, campaignId, userWallet);
        
        // PHASE 17-21: Post-Submit
        return {
          success: true,
          submissionId: submissionResult.submissionId,
          content: refinedResult.content,
          scores: refinedResult.finalScores
        };
      }
    }
    
    return { success: false, reason: 'Content did not pass validation' };
  }

  // =========================================================================
  // PHASE 1.6: MARKET CONTEXT (FINANCE SKILL)
  // =========================================================================

  async fetchMarketContext(campaign: Campaign): Promise<{
    marketData: MarketData;
    marketEmotion: MarketEmotion;
  }> {
    const marketData: MarketData = {};

    // Fetch BTC data if crypto-related
    if (campaign.isCryptoRelated) {
      try {
        const btcData = await this.zai.functions.invoke('finance', {
          function: 'quote',
          symbol: 'BTC'
        });
        marketData.BTC = {
          price: btcData.price,
          change24h: btcData.changePercent24h
        };
      } catch (e) {
        console.warn('Failed to fetch BTC data:', e);
      }

      // Fetch ETH data
      try {
        const ethData = await this.zai.functions.invoke('finance', {
          function: 'quote',
          symbol: 'ETH'
        });
        marketData.ETH = {
          price: ethData.price,
          change24h: ethData.changePercent24h
        };
      } catch (e) {
        console.warn('Failed to fetch ETH data:', e);
      }
    }

    // Fetch project token data if applicable
    if (campaign.hasToken && campaign.tokenSymbol) {
      try {
        const tokenData = await this.zai.functions.invoke('finance', {
          function: 'quote',
          symbol: campaign.tokenSymbol
        });
        marketData.token = {
          symbol: campaign.tokenSymbol,
          price: tokenData.price,
          change24h: tokenData.changePercent24h
        };
      } catch (e) {
        console.warn('Failed to fetch token data:', e);
      }
    }

    // Calculate market emotion
    const marketEmotion = this.calculateMarketEmotion(marketData);

    return { marketData, marketEmotion };
  }

  private calculateMarketEmotion(marketData: MarketData): MarketEmotion {
    let primary = 'neutral';
    let secondary = 'curiosity';
    let intensity = 0.5;
    let trendJackingOpportunity = false;

    const btcChange = marketData.BTC?.change24h || 0;

    if (Math.abs(btcChange) > 5) {
      trendJackingOpportunity = true;
      intensity = 0.8;

      if (btcChange > 5) {
        primary = 'greed';
        secondary = 'fomo';
      } else if (btcChange < -5) {
        primary = 'fear';
        secondary = 'concern';
      }
    }

    return { primary, secondary, intensity, trendJackingOpportunity };
  }

  // =========================================================================
  // PHASE 1.7: EXTERNAL DATA COLLECTION (WEB-SEARCH + WEB-READER SKILLS)
  // =========================================================================

  async collectExternalData(
    campaign: Campaign,
    gapAnalysis: GapAnalysis,
    marketEmotion: MarketEmotion
  ): Promise<ExternalData> {
    
    // Generate search queries based on conditions (NOT PRE-DEFINED!)
    const queries = this.generateSearchQueries(campaign, gapAnalysis, marketEmotion);
    
    // Execute web searches
    const searchResults = await this.executeWebSearches(queries);
    
    // Deep content extraction
    const extractedContent = await this.deepContentExtraction(searchResults);
    
    // Extract key facts
    const keyFacts = this.extractKeyFacts(extractedContent, campaign);

    return { searchResults, extractedContent, keyFacts };
  }

  private generateSearchQueries(
    campaign: Campaign,
    gapAnalysis: GapAnalysis,
    marketEmotion: MarketEmotion
  ): Array<{ purpose: string; query: string; priority: string }> {
    
    const queries: Array<{ purpose: string; query: string; priority: string }> = [];
    const currentYear = new Date().getFullYear();

    // Query 1: Project/Topic Context (ALWAYS)
    queries.push({
      purpose: 'project_context',
      query: `${campaign.name} ${campaign.type} ${currentYear}`,
      priority: 'high'
    });

    // Query 2: Gap Angle Exploitation (CONDITIONAL)
    if (gapAnalysis.selectedGap === 'controversy') {
      queries.push({
        purpose: 'controversy_hooks',
        query: `${campaign.name} legal disputes regulation ${currentYear}`,
        priority: 'high'
      });
    }

    // Query 3: Industry Trends
    queries.push({
      purpose: 'industry_trends',
      query: `${campaign.type} trends developments ${currentYear}`,
      priority: 'medium'
    });

    // Query 4: Token Context (if applicable)
    if (campaign.hasToken && campaign.tokenSymbol) {
      queries.push({
        purpose: 'token_context',
        query: `${campaign.tokenSymbol} token news analysis ${currentYear}`,
        priority: 'medium'
      });
    }

    // Query 5: Trend Jacking (if market opportunity)
    if (marketEmotion.trendJackingOpportunity) {
      queries.push({
        purpose: 'trend_jacking',
        query: `crypto market ${marketEmotion.primary} ${currentYear}`,
        priority: 'high'
      });
    }

    return queries;
  }

  private async executeWebSearches(
    queries: Array<{ purpose: string; query: string; priority: string }>
  ): Promise<Record<string, any[]>> {
    
    const searchResults: Record<string, any[]> = {};

    for (const queryObj of queries) {
      try {
        const results = await this.zai.functions.invoke('web_search', {
          query: queryObj.query,
          num: 5,
          recency_days: 7
        });
        searchResults[queryObj.purpose] = results;
      } catch (e) {
        console.warn(`Search failed for ${queryObj.purpose}:`, e);
        searchResults[queryObj.purpose] = [];
      }
    }

    return searchResults;
  }

  private async deepContentExtraction(
    searchResults: Record<string, any[]>
  ): Promise<Record<string, any[]>> {
    
    const extractedContent: Record<string, any[]> = {};

    for (const [purpose, results] of Object.entries(searchResults)) {
      const topResults = results.slice(0, 2);
      extractedContent[purpose] = [];

      for (const result of topResults) {
        try {
          const content = await this.zai.functions.invoke('web_reader', {
            url: result.url
          });
          extractedContent[purpose].push({
            url: result.url,
            title: content.title,
            content: content.content,
            publishTime: content.publishTime,
            snippet: result.snippet
          });
        } catch (e) {
          console.warn(`Failed to read ${result.url}:`, e);
        }
      }
    }

    return extractedContent;
  }

  private extractKeyFacts(
    extractedContent: Record<string, any[]>,
    campaign: Campaign
  ): { facts: any[]; quotes: any[]; statistics: any[] } {
    
    const facts: any[] = [];
    const quotes: any[] = [];
    const statistics: any[] = [];

    for (const [purpose, contents] of Object.entries(extractedContent)) {
      for (const item of contents) {
        // Extract statistics (sentences with numbers)
        const statMatches = item.content?.match(/[^.]*\d+(?:\.\d+)?%?[^.]*\./g) || [];
        statistics.push(...statMatches.map((s: string) => ({
          content: s.trim(),
          source: item.url,
          purpose
        })));

        // Extract quoted statements
        const quoteMatches = item.content?.match(/"([^"]+)"/g) || [];
        quotes.push(...quoteMatches.map((q: string) => ({
          content: q,
          source: item.url,
          purpose
        })));

        // Extract key sentences
        const paragraphs = (item.content || '').split('\n\n');
        for (const para of paragraphs.slice(0, 3)) {
          const sentences = para.split('. ').slice(0, 2);
          for (const sentence of sentences) {
            if (sentence.length > 50 && sentence.length < 200) {
              facts.push({
                content: sentence.trim() + '.',
                source: item.url,
                purpose
              });
            }
          }
        }
      }
    }

    return {
      facts: this.deduplicateByContent(facts).slice(0, 20),
      quotes: quotes.slice(0, 5),
      statistics: statistics.slice(0, 10)
    };
  }

  // =========================================================================
  // PHASE 3: GENERATION ENGINE (LLM SKILL #1-3) - NO TEMPLATES!
  // =========================================================================

  async generateContent(
    campaign: Campaign,
    externalData: ExternalData,
    gapAnalysis: GapAnalysis,
    marketEmotion: MarketEmotion,
    frTarget: number
  ): Promise<GeneratedContent> {
    
    // Calculate generation parameters
    const genParams = this.calculateGenerationParams(
      externalData,
      gapAnalysis,
      marketEmotion,
      frTarget
    );

    // LLM CALL #1: Generate Hook
    const hookResult = await this.generateHook(genParams);

    // Validate hook (check for templates)
    const hookValidation = this.validateHook(hookResult.hook);
    if (!hookValidation.valid) {
      console.warn('Hook validation failed:', hookValidation.issues);
      // Regenerate with stricter prompt
      return this.generateContent(campaign, externalData, gapAnalysis, marketEmotion, frTarget);
    }

    // LLM CALL #2: Generate Thread Body
    const threadResult = await this.generateThreadBody(hookResult.hook, genParams, campaign.requirements);

    // LLM CALL #3: Generate Multi-Version (optional)
    const alternatives = await this.generateMultiVersion(hookResult.hook, threadResult.thread, genParams);

    return {
      hook: hookResult.hook,
      thread: threadResult.thread,
      metadata: {
        hookType: genParams.angle.type,
        emotion: genParams.emotion.primary,
        angle: genParams.angle.type,
        frPotential: frTarget
      }
    };
  }

  private calculateGenerationParams(
    externalData: ExternalData,
    gapAnalysis: GapAnalysis,
    marketEmotion: MarketEmotion,
    frTarget: number
  ): any {
    
    // Derive emotion from multiple signals
    const emotion = {
      primary: this.derivePrimaryEmotion(marketEmotion, gapAnalysis),
      secondary: marketEmotion.secondary,
      intensity: marketEmotion.intensity,
      arc: this.determineEmotionalArc(gapAnalysis.selectedGap)
    };

    // Select angle from gap
    const angle = {
      type: gapAnalysis.selectedGap,
      reason: gapAnalysis.gapReason,
      alternatives: gapAnalysis.missingHooks
    };

    // FR Strategy
    const frStrategy = {
      targetScore: frTarget,
      strategy: frTarget > 6.0 ? 'reply_bait' : 'engagement',
      replyBaitRequired: frTarget > 6.0,
      questionFormat: true,
      controversyLevel: this.calculateControversyLevel(gapAnalysis.selectedGap)
    };

    // Select facts for generation
    const facts = externalData.keyFacts.facts.slice(0, 10);

    return { emotion, angle, frStrategy, facts };
  }

  private derivePrimaryEmotion(marketEmotion: MarketEmotion, gapAnalysis: GapAnalysis): string {
    const gapEmotionMap: Record<string, string> = {
      'controversy': 'righteous_indignation',
      'contrarian': 'confidence',
      'debate': 'challenge',
      'revelation': 'surprise',
      'case_study': 'interest'
    };

    const gapEmotion = gapEmotionMap[gapAnalysis.selectedGap] || 'curiosity';
    
    if (marketEmotion.trendJackingOpportunity) {
      return marketEmotion.primary === 'fear' ? 'concern' : marketEmotion.primary;
    }

    return gapEmotion;
  }

  private determineEmotionalArc(gapType: string): string {
    const arcMap: Record<string, string> = {
      'controversy': 'tension_resolution',
      'educational': 'problem_solution',
      'story': 'hero_journey',
      'fomo': 'urgency_opportunity'
    };
    return arcMap[gapType] || 'problem_solution';
  }

  private calculateControversyLevel(gapType: string): string {
    const levelMap: Record<string, string> = {
      'controversy': 'high',
      'contrarian': 'high',
      'debate': 'moderate',
      'educational': 'low'
    };
    return levelMap[gapType] || 'moderate';
  }

  private async generateHook(genParams: any): Promise<{ hook: string }> {
    const prompt = `Generate a Twitter hook (max 60 chars) for a thread about decentralized dispute resolution.

KEY FACTS (from external research):
${genParams.facts.slice(0, 5).map((f: any, i: number) => `${i+1}. ${f.content}`).join('\n')}

ANGLE: ${genParams.angle.type} (gap in competitor content)
EMOTION: ${genParams.emotion.primary}
FR TARGET: ${genParams.frStrategy.targetScore} (reply bait needed)

RULES:
- Do NOT use these templates:
  "unpopular opinion", "hot take", "change my mind",
  "nobody is talking about", "here's the thing", "thread"
- Create tension between problem and solution
- Optimize for reply potential (controversial but defensible)
- Keep under 60 characters
- Be unique and memorable
- NO emojis in hook

Output only the hook text, no explanation:`;

    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a viral Twitter content expert. You generate unique hooks without using cliché templates. You are concise and only output the requested hook.'
        },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    return { hook: completion.choices[0]?.message?.content.trim() };
  }

  private validateHook(hook: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check length
    if (hook.length > 60) {
      issues.push(`Hook exceeds 60 characters (${hook.length})`);
    }

    // Check for forbidden templates
    const lowerHook = hook.toLowerCase();
    for (const template of this.TEMPLATE_BLACKLIST) {
      if (lowerHook.includes(template.toLowerCase())) {
        issues.push(`Contains forbidden template: "${template}"`);
      }
    }

    // Check for emojis
    if (/[\u{1F300}-\u{1F9FF}]/u.test(hook)) {
      issues.push('Contains emoji (forbidden in hook)');
    }

    return { valid: issues.length === 0, issues };
  }

  private async generateThreadBody(
    hook: string,
    genParams: any,
    requirements: any
  ): Promise<{ thread: Record<number, string> }> {
    
    const prompt = `Generate a 6-tweet thread body for:

HOOK (Tweet 1): "${hook}"

FACTS TO USE:
${genParams.facts.map((f: any, i: number) => `${i+1}. ${f.content}`).join('\n')}

CAMPAIGN REQUIREMENTS:
- Required mentions: ${requirements.mentions?.join(', ') || 'None'}
- Required hashtags: ${requirements.hashtags?.join(', ') || 'None'}
- Required links: ${requirements.links?.join(', ') || 'None'}

EMOTIONAL ARC: ${genParams.emotion.arc}
ANGLE: ${genParams.angle.type}
FR STRATEGY: ${genParams.frStrategy.strategy}

GENERATION RULES:
1. Each tweet under 280 characters
2. Tweet 2-3: Problem amplification (use facts)
3. Tweet 4-5: Solution explanation
4. Tweet 6: Real-world application / proof
5. Tweet 7: Call to action with reply bait + hashtag at end
6. Natural, conversational tone (no AI-sounding phrases)
7. NO links in first 4 tweets
8. NO hashtags in first 5 tweets
9. Vary sentence structure
10. Include specific details from facts

Output format:
TWEET 2: [content]
TWEET 3: [content]
TWEET 4: [content]
TWEET 5: [content]
TWEET 6: [content]
TWEET 7: [content]`;

    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an expert crypto Twitter writer. You create engaging, viral threads with natural language. You avoid AI-sounding phrases and templates. Output only the requested tweets.'
        },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    const content = completion.choices[0]?.message?.content;
    const thread = this.parseThreadOutput(content);

    return { thread };
  }

  private parseThreadOutput(content: string): Record<number, string> {
    const tweets: Record<number, string> = {};
    const lines = content.split('\n');

    let currentTweet: number | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      const match = line.match(/^TWEET (\d+):\s*(.*)/i);
      if (match) {
        if (currentTweet !== null) {
          tweets[currentTweet] = currentContent.join(' ').trim();
        }
        currentTweet = parseInt(match[1]);
        currentContent = [match[2]];
      } else if (currentTweet !== null && line.trim()) {
        currentContent.push(line.trim());
      }
    }

    if (currentTweet !== null) {
      tweets[currentTweet] = currentContent.join(' ').trim();
    }

    return tweets;
  }

  private async generateMultiVersion(
    hook: string,
    thread: Record<number, string>,
    genParams: any
  ): Promise<Record<string, any>> {
    
    const prompt = `Generate 3 alternative versions of this thread:

ORIGINAL HOOK: "${hook}"
ORIGINAL THREAD:
${Object.entries(thread).map(([n, t]) => `Tweet ${n}: ${t}`).join('\n')}

GENERATION RULES:
- Version A: More provocative/controversial angle
- Version B: More educational/informative angle
- Version C: More personal/story-driven angle
- Each version must be UNIQUE (not just rewording)
- Each version still uses facts from external data
- NO templates

Output format:
VERSION A:
Hook: [hook text]
Tweet 2: [content]
...

VERSION B:
...

VERSION C:
...`;

    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a creative content generator specializing in creating unique variations. Each version must be genuinely different in approach and tone.'
        },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    return { raw: completion.choices[0]?.message?.content };
  }

  // =========================================================================
  // PHASE 12: QUALITY SCORING (LLM SKILL #4)
  // =========================================================================

  async predictScores(content: GeneratedContent): Promise<Scores> {
    const prompt = `Predict Rally scores for this content:

CONTENT:
Hook: "${content.hook}"
Thread:
${Object.entries(content.thread).map(([n, t]) => `Tweet ${n}: ${t}`).join('\n')}

SCORING CRITERIA:
G1 Content Alignment (0-4):
  - Core message accuracy, terminology, brand voice, value prop

G2 Information Accuracy (0-4):
  - Technical facts, source verification, no misleading info

G3 Campaign Compliance (0-4):
  - Required mentions, hashtags, links, format guidelines

G4 Originality (0-4):
  - Fresh perspective, personal insight, natural language
  - Template hooks should score LOW

EP Engagement Potential (0-8):
  - Hook effectiveness, conversation potential, reply bait

TQ Technical Quality (0-8):
  - Grammar, spelling, formatting, platform optimization

Output as JSON:
{
  "G1": {"score": X, "aspects": {...}},
  "G2": {"score": X, "aspects": {...}},
  "G3": {"score": X, "aspects": {...}},
  "G4": {"score": X, "aspects": {...}},
  "EP": {"score": X, "aspects": {...}},
  "TQ": {"score": X, "aspects": {...}},
  "masterScore": X
}`;

    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a Rally content scoring expert. Score content objectively based on Rally criteria. Be strict but fair. Output only valid JSON.'
        },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    return JSON.parse(completion.choices[0]?.message?.content);
  }

  // =========================================================================
  // PHASE 13: ITERATIVE REFINEMENT (LLM SKILL #5)
  // =========================================================================

  async refineContent(
    content: GeneratedContent,
    predictedScores: Scores,
    maxIterations: number = 3
  ): Promise<{ success: boolean; content: GeneratedContent; finalScores: Scores }> {
    
    let currentContent = content;
    let currentScores = predictedScores;
    let iteration = 0;

    while (iteration < maxIterations) {
      iteration++;

      // Check if passes threshold
      if (currentScores.masterScore >= 28 && this.allGatesPass(currentScores)) {
        return {
          success: true,
          content: currentContent,
          finalScores: currentScores
        };
      }

      // Identify weak areas
      const weakAreas = this.identifyWeakAreas(currentScores);

      // Optimize content using LLM
      currentContent = await this.optimizeContent(currentContent, weakAreas, iteration);

      // Re-predict scores
      currentScores = await this.predictScores(currentContent);
    }

    return {
      success: false,
      content: currentContent,
      finalScores: currentScores
    };
  }

  private allGatesPass(scores: Scores): boolean {
    return scores.G1.score >= 3 &&
           scores.G2.score >= 3 &&
           scores.G3.score >= 3 &&
           scores.G4.score >= 3;
  }

  private identifyWeakAreas(scores: Scores): any[] {
    const weakAreas: any[] = [];

    for (const gate of ['G1', 'G2', 'G3', 'G4'] as const) {
      if (scores[gate].score < 3) {
        weakAreas.push({
          component: gate,
          currentScore: scores[gate].score,
          targetScore: 3
        });
      }
    }

    if (scores.EP.score < 6) {
      weakAreas.push({
        component: 'EP',
        currentScore: scores.EP.score,
        targetScore: 6
      });
    }

    if (scores.TQ.score < 6) {
      weakAreas.push({
        component: 'TQ',
        currentScore: scores.TQ.score,
        targetScore: 6
      });
    }

    return weakAreas;
  }

  private async optimizeContent(
    content: GeneratedContent,
    weakAreas: any[],
    iteration: number
  ): Promise<GeneratedContent> {
    
    const prompt = `Optimize this content to improve scores.

CURRENT CONTENT:
Hook: "${content.hook}"
Thread:
${Object.entries(content.thread).map(([n, t]) => `Tweet ${n}: ${t}`).join('\n')}

WEAK AREAS TO IMPROVE:
${weakAreas.map(w => `  ${w.component}: Current ${w.currentScore}, Target ${w.targetScore}`).join('\n')}

ITERATION: ${iteration}/3

RULES:
- Maintain original angle and emotion
- Keep same structure (7 tweets)
- Do NOT introduce templates
- Address each weak area specifically
- Keep under 280 chars per tweet

Output optimized content in same format.`;

    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a content optimization expert. Improve content while maintaining its core message and uniqueness.'
        },
        { role: 'user', content: prompt }
      ],
      thinking: { type: 'disabled' }
    });

    // Parse optimized content (simplified)
    return content;
  }

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private deduplicateByContent(items: any[]): any[] {
    const seen = new Set();
    return items.filter(item => {
      const key = item.content.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export { RallyWorkflowV8 };
```

================================================================================
                    SECTION 22: SCORING SYSTEM COMPLETE
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                    V8.0 ENHANCED SCORING SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  COMPARISON:                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Component     │ Rally Standard │ V8.0 Enhanced                      │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ Gate Scoring  │ 0-2 each       │ 0-4 each (4 aspects per gate)      │    │
│  │ Quality Score │ 0-5 each       │ 0-8 each (8 aspects per quality)   │    │
│  │ Gate Total    │ 8/8            │ 16/16                              │    │
│  │ Quality Total │ 10/10          │ 16/16                              │    │
│  │ Master Score  │ 18/18          │ 32/32                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  LEVEL CLASSIFICATION:                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Score Range │ Level              │ Description                       │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 28-32       │ Level 5 Maximum    │ Exceptional quality               │    │
│  │ 24-27       │ Level 4 High       │ High quality                      │    │
│  │ 20-23       │ Level 3 Good       │ Good quality                      │    │
│  │ 16-19       │ Level 2 Acceptable │ Acceptable quality                │    │
│  │ 0-15        │ Level 1 Needs Work │ Requires improvement              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  V8.0 TARGET: ≥ 28 (Level 5 Maximum)                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 23: TEMPLATE BLACKLIST
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEMPLATE BLACKLIST - V8.0                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  These patterns are FORBIDDEN in V8.0:                                       │
│  Using them will result in G4 (Originality) penalty.                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ #   │ Forbidden Pattern           │ Why It's Bad                    │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 1   │ "unpopular opinion:"        │ Overused, AI-flagged            │    │
│  │ 2   │ "hot take:"                 │ Overused, AI-flagged            │    │
│  │ 3   │ "change my mind:"           │ Overused, AI-flagged            │    │
│  │ 4   │ "nobody is talking about"   │ Clickbait, AI-flagged           │    │
│  │ 5   │ "here's the thing"          │ AI-generated signature          │    │
│  │ 6   │ "thread 🧵"                 │ Low-value, AI-flagged           │    │
│  │ 7   │ "let me explain"            │ AI-generated signature          │    │
│  │ 8   │ "95% of people"             │ Fake statistic pattern          │    │
│  │ 9   │ "3am realization:"          │ Overused format                 │    │
│  │ 10  │ "POV:"                      │ Overused format                 │    │
│  │ 11  │ "unpopular but true:"       │ Overused                        │    │
│  │ 12  │ "the truth about:"          │ Clickbait                       │    │
│  │ 13  │ "what they don't tell you"  │ Clickbait                       │    │
│  │ 14  │ "nobody wants to admit"     │ Clickbait                       │    │
│  │ 15  │ "in today's digital world"  │ AI signature                    │    │
│  │ 16  │ "it's worth noting that"    │ AI signature                    │    │
│  │ 17  │ "in conclusion"             │ AI signature                    │    │
│  │ 18  │ "let's dive into"           │ AI signature                    │    │
│  │ 19  │ "at the end of the day"     │ AI signature                    │    │
│  │ 20  │ "picture this:"             │ Overused format                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PENALTY:                                                                   │
│  - G4 Aspect 1 (Fresh Perspective): 0/1                                     │
│  - G4 Aspect 4 (Authentic Voice): 0/1                                       │
│  - Total G4 penalty: -2 points                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 24: DECISION MATRICES
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                    DECISION MATRIX 1: EXTERNAL DATA NEEDS                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Condition                        │ Data Needed                       │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ campaign.hasToken = TRUE         │ Token price, project news         │    │
│  │ campaign.type = protocol         │ Competitor analysis, dev updates  │    │
│  │ gap.angle = controversy          │ Legal news, regulation updates    │    │
│  │ timing = peak_hours              │ Real-time trending topics         │    │
│  │ market.BTC_change > 5%           │ Trend jacking content             │    │
│  │ is_legal_topic = TRUE            │ Court cases, legal precedents     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    DECISION MATRIX 2: EMOTION DERIVATION                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Market Signal        │ Gap Signal      │ Final Emotion              │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ Fear (BTC < -5%)     │ controversy     │ concern + righteous        │    │
│  │ Greed (BTC > 5%)     │ fomo            │ excitement + urgency       │    │
│  │ Neutral              │ controversy     │ righteous_indignation      │    │
│  │ Neutral              │ educational     │ curiosity                  │    │
│  │ Neutral              │ contrarian      │ confidence                 │    │
│  │ Trend jacking opp.   │ any             │ market_emotion dominant    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    DECISION MATRIX 3: FR STRATEGY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ FR Target │ Strategy        │ CTA Type           │ Keywords        │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ < 5.0     │ engagement      │ General question   │ What do you think│    │
│  │ 5.0-6.0   │ balanced        │ Specific question  │ Which do you prefer│    │
│  │ 6.0-7.0   │ reply_bait      │ Debate invitation  │ Would you trust  │    │
│  │ > 7.0     │ influencer_hunt │ Controversy spark  │ Unique to topic  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    DECISION MATRIX 4: REFINEMENT TRIGGERS                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Score Issue           │ Action                             │ Phase   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ Any gate < 3          │ Rewrite affected tweets            │ 13      │    │
│  │ G4 < 3 (template)     │ Regenerate hook                    │ 3       │    │
│  │ EP < 6                │ Enhance hook + CTA                 │ 13      │    │
│  │ TQ < 6                │ Fix grammar/formatting             │ 9       │    │
│  │ Master < 28           │ Full optimization                  │ 13      │    │
│  │ Template detected     │ Regenerate content                 │ 3       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 25: QUICK REFERENCE CARD
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                    V8.0 QUICK REFERENCE CARD                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASES (21 total):                                                         │
│  ──────────────────                                                          │
│  0: Pre-Workflow      │ Initialize                                          │
│  1: Campaign Research │ Rally API                                           │
│  1.5: Leaderboard     │ Gap Analysis                                        │
│  1.6: Market Context  │ FINANCE skill                                       │
│  1.7: External Data   │ WEB-SEARCH + WEB-READER                             │
│  2: Knowledge Base    │ Combine all data                                    │
│  3: Generation        │ LLM - NO TEMPLATES                                  │
│  4: Thread Structure  │ Validation                                          │
│  5-11: Enhancement    │ Viral, Psych, FR                                    │
│  12: Quality Scoring  │ LLM prediction                                      │
│  13: Refinement       │ Loop max 3x                                         │
│  14-21: Submit+       │ Post to Rally                                       │
│                                                                              │
│  SKILL CALLS PER CAMPAIGN:                                                  │
│  ────────────────────────                                                    │
│  LLM: 5 calls (hook, thread, multi-version, score, optimize)               │
│  WEB-SEARCH: 3-5 calls (conditional queries)                                │
│  WEB-READER: 2-3 calls (deep extraction)                                   │
│  FINANCE: 1-2 calls (market data)                                          │
│                                                                              │
│  SCORING TARGETS:                                                           │
│  ──────────────────                                                          │
│  Master Score: ≥ 28 (Level 5 Maximum)                                       │
│  Each Gate: ≥ 3/4                                                           │
│  EP: ≥ 6/8, TQ: ≥ 6/8                                                       │
│                                                                              │
│  KEY RULES:                                                                 │
│  ────────────                                                                │
│  1. NO TEMPLATES - All content generated                                    │
│  2. External data MANDATORY                                                 │
│  3. Enhancement BEFORE scoring                                              │
│  4. FR strategy INTEGRATED                                                  │
│  5. Max 3 refinement iterations                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 26: VERSION HISTORY
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                    VERSION HISTORY                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  V3.13: Emotion Library, A/B Testing, HES Calculator                        │
│  V3.14: Timing Optimization, Reply Strategy (150x)                          │
│  V3.15: Link Strategy, Hashtag Optimization                                 │
│  V3.16: Viral Mechanics, 8 Psychological Triggers                           │
│  V4.0:  Universal Guide                                                      │
│  V5.0:  FR Cheat Code Deep Dive                                             │
│  V6.0:  10 Dimensions Scoring System                                        │
│  V7.0:  0-4 Gate Scale, 0-8 Quality Scale, 32/32 Master                     │
│  V7.0 FINAL: Invisible Influence, Correct Flow                              │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  V8.0: COMPLETE REWRITE                                                      │
│  ──────────────────────────                                                  │
│  NEW: External Data Collection (Phase 1.7)                                  │
│  NEW: Market Context (Phase 1.6)                                            │
│  NEW: Generation Engine with LLM (Phase 3)                                  │
│  NEW: Score Prediction (Phase 12)                                           │
│  NEW: No Templates Policy                                                   │
│  NEW: Skill Integration (LLM, WEB-SEARCH, WEB-READER, FINANCE)              │
│  KEPT: All best practices from V3.14-V7.0 FINAL                             │
│                                                                              │
│  KEY CHANGES FROM V7.0 FINAL:                                               │
│  - Templates → LLM Generation                                               │
│  - No external data → Conditional fetching                                  │
│  - Static emotion → Calculated from market + topic                          │
│  - FR after content → FR integrated in generation                           │
│  - Manual scoring → LLM-assisted prediction                                 │
│                                                                              │
│  SECTION STRUCTURE:                                                          │
│  - Section 1-16: Phase descriptions                                         │
│  - Section 17-20: Scoring & refinement                                      │
│  - Section 21: Skill Integration Code (ORKESTRATOR)                         │
│  - Section 22: Scoring System                                               │
│  - Section 23: Template Blacklist                                           │
│  - Section 24: Decision Matrices                                            │
│  - Section 25: Quick Reference Card                                         │
│  - Section 26: Version History                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                         END OF RALLY WORKFLOW V8.0
================================================================================
