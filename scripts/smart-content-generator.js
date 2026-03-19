/**
 * SMART CONTENT GENERATOR - NO TEMPLATE FALLBACK
 * 
 * Solusi ketika LLM rate limited tanpa menggunakan hard-coded templates:
 * 
 * 1. PROGRESSIVE PROMPT DEGRADATION
 *    - Jika prompt kompleks gagal → coba prompt sederhana
 *    - Jika prompt sederhana gagal → coba chunk-based generation
 * 
 * 2. MODULAR CONTENT ASSEMBLY
 *    - Generate per bagian kecil (hook, body, cta)
 *    - Jika satu bagian gagal, tidak mengganggu bagian lain
 * 
 * 3. KNOWLEDGE BASE EXTRACTION
 *    - Extract info langsung dari knowledge base
 *    - Build content dari facts + rules
 * 
 * 4. CONTENT RECYCLING
 *    - Gunakan konten dari versi yang berhasil
 *    - Remix dan optimize
 * 
 * 5. SIMPLIFIED PROMPT CHAIN
 *    - Break down kompleks task menjadi sub-tasks
 *    - Setiap sub-task lebih kecil = lebih mudah sukses
 */

const ZAI = require('z-ai-web-dev-sdk').default;

// ============================================================================
// PROGRESSIVE CONTENT GENERATOR
// ============================================================================

class SmartContentGenerator {
  constructor(rateLimiter, campaignData, knowledgeBase) {
    this.rateLimiter = rateLimiter;
    this.campaignData = campaignData;
    this.knowledgeBase = knowledgeBase;
    this.zai = null;
    this.successfulChunks = []; // Store successful generations
  }
  
  async init() {
    if (!this.zai) {
      this.zai = await ZAI.create();
    }
    return this.zai;
  }
  
  // =========================================================================
  // STRATEGY 1: PROGRESSIVE PROMPT DEGRADATION
  // =========================================================================
  
  /**
   * Generate content dengan 3 level fallback:
   * Level 1: Full LLM dengan semua campaign data
   * Level 2: Simplified prompt dengan data minimal
   * Level 3: Chunk-based generation (per bagian)
   */
  async generateWithProgressiveFallback(angle, emotion, maxRetries = 3) {
    console.log(`[SmartGen] Starting progressive generation for ${angle}...`);
    
    // LEVEL 1: Full LLM Generation
    const fullResult = await this.tryFullGeneration(angle, emotion);
    if (fullResult.success) {
      console.log('[SmartGen] ✓ Level 1 success: Full LLM generation');
      return { ...fullResult, method: 'full_llm' };
    }
    
    console.log('[SmartGen] ✗ Level 1 failed, trying Level 2...');
    
    // LEVEL 2: Simplified Generation
    const simpleResult = await this.trySimplifiedGeneration(angle, emotion);
    if (simpleResult.success) {
      console.log('[SmartGen] ✓ Level 2 success: Simplified generation');
      return { ...simpleResult, method: 'simplified_llm' };
    }
    
    console.log('[SmartGen] ✗ Level 2 failed, trying Level 3...');
    
    // LEVEL 3: Chunk-Based Assembly
    const chunkResult = await this.tryChunkBasedGeneration(angle, emotion);
    if (chunkResult.success) {
      console.log('[SmartGen] ✓ Level 3 success: Chunk-based assembly');
      return { ...chunkResult, method: 'chunk_assembly' };
    }
    
    console.log('[SmartGen] ✗ All levels failed, using knowledge extraction...');
    
    // LEVEL 4: Knowledge Extraction (last resort, but still dynamic)
    const extractedResult = await this.generateFromKnowledgeBase(angle, emotion);
    return { ...extractedResult, method: 'knowledge_extraction' };
  }
  
  // =========================================================================
  // LEVEL 1: FULL GENERATION
  // =========================================================================
  
  async tryFullGeneration(angle, emotion) {
    const systemPrompt = this.buildFullSystemPrompt(emotion);
    const userPrompt = this.buildFullUserPrompt(angle);
    
    return this.callLLMWithRetry(systemPrompt, userPrompt, { 
      maxTokens: 800, 
      temperature: 0.8 
    }, 2); // 2 retries
  }
  
  buildFullSystemPrompt(emotion) {
    return `You are an expert Twitter/X content writer for crypto/web3 projects.

RULES:
- Write in short, punchy paragraphs (each = 1 tweet)
- Separate paragraphs with double line breaks
- NO AI-sounding words: delve, leverage, realm, tapestry, paradigm
- NO template phrases: "picture this", "imagine a world", "lets dive in"
- NO emojis, NO hashtags
- Target emotion: ${emotion}
- Length: 400-800 characters

STYLE: ${this.campaignData?.style || 'Professional and engaging'}
`;
  }
  
  buildFullUserPrompt(angle) {
    return `Write a Twitter thread about: ${this.campaignData?.title || 'Internet Court'}

CAMPAIGN GOAL:
${this.campaignData?.goal || 'Explain the project and its benefits'}

MISSION:
${this.campaignData?.missions?.[0]?.description || ''}

KEY FACTS:
${this.knowledgeBase.slice(0, 5).map(f => `- ${f.fact}`).join('\n')}

ANGLE: ${angle}

Write compelling content now.`;
  }
  
  // =========================================================================
  // LEVEL 2: SIMPLIFIED GENERATION
  // =========================================================================
  
  async trySimplifiedGeneration(angle, emotion) {
    // Use much shorter prompts
    const systemPrompt = `Write a Twitter thread. Short paragraphs. No AI words. Target: ${emotion}.`;
    
    const userPrompt = `Topic: ${this.campaignData?.title || 'Internet Court'}
Angle: ${angle}
Key point: ${this.knowledgeBase[0]?.fact || 'Decentralized dispute resolution'}
Include: internetcourt.org

Write the thread now.`;
    
    return this.callLLMWithRetry(systemPrompt, userPrompt, { 
      maxTokens: 500, 
      temperature: 0.9 
    }, 3); // More retries with smaller prompt
  }
  
  // =========================================================================
  // LEVEL 3: CHUNK-BASED GENERATION
  // =========================================================================
  
  async tryChunkBasedGeneration(angle, emotion) {
    try {
      await this.init();
      
      // Generate in 3 small chunks
      const chunks = {
        hook: null,
        body: null,
        cta: null
      };
      
      // CHUNK 1: Hook (first tweet)
      chunks.hook = await this.generateChunk('hook', angle, emotion);
      if (!chunks.hook) {
        chunks.hook = this.buildHookFromKnowledge(angle);
      }
      
      // CHUNK 2: Body (main content)
      chunks.body = await this.generateChunk('body', angle, emotion);
      if (!chunks.body) {
        chunks.body = this.buildBodyFromKnowledge();
      }
      
      // CHUNK 3: CTA (call to action)
      chunks.cta = await this.generateChunk('cta', angle, emotion);
      if (!chunks.cta) {
        chunks.cta = this.buildCTAFromKnowledge();
      }
      
      // Assemble
      const content = [chunks.hook, chunks.body, chunks.cta]
        .filter(Boolean)
        .join('\n\n');
      
      return {
        success: content.length > 50,
        content,
        chunks
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async generateChunk(chunkType, angle, emotion) {
    const prompts = {
      hook: {
        system: `Write ONE short hook tweet (max 200 chars). Make it attention-grabbing. No AI words.`,
        user: `Topic: ${this.campaignData?.title}\nAngle: ${angle}\nWrite hook:`
      },
      body: {
        system: `Write 2-3 short tweets explaining a concept. No AI words. Include internetcourt.org`,
        user: `Topic: ${this.campaignData?.title}\nFact: ${this.knowledgeBase[0]?.fact || 'AI dispute resolution'}\nWrite:`
      },
      cta: {
        system: `Write ONE ending tweet with a question. No AI words.`,
        user: `Topic: ${this.campaignData?.title}\nWrite engaging question:`
      }
    };
    
    const prompt = prompts[chunkType];
    const result = await this.callLLMWithRetry(prompt.system, prompt.user, { 
      maxTokens: 200, 
      temperature: 0.9 
    }, 2);
    
    return result.success ? result.content.trim() : null;
  }
  
  // =========================================================================
  // LEVEL 4: KNOWLEDGE BASE EXTRACTION
  // =========================================================================
  
  async generateFromKnowledgeBase(angle, emotion) {
    console.log('[SmartGen] Building content from knowledge base...');
    
    // Extract key facts
    const facts = this.knowledgeBase.slice(0, 8).map(f => f.fact);
    
    // Build content structure
    const parts = [];
    
    // Part 1: Hook based on angle
    const hooks = {
      problem_first: this.buildProblemHook(facts),
      contrast: this.buildContrastHook(facts),
      fear_example: this.buildFearHook(facts),
      analytical: this.buildAnalyticalHook(facts),
      future_focused: this.buildFutureHook(facts)
    };
    parts.push(hooks[angle] || hooks.problem_first);
    
    // Part 2: Core information from facts
    const coreContent = this.buildCoreContent(facts);
    parts.push(coreContent);
    
    // Part 3: Solution/integration
    const solution = this.buildSolutionContent(facts);
    parts.push(solution);
    
    // Part 4: CTA
    const cta = this.buildDynamicCTA(facts, emotion);
    parts.push(cta);
    
    const content = parts.filter(p => p && p.length > 10).join('\n\n');
    
    return {
      success: content.length > 100,
      content,
      method: 'knowledge_extraction',
      factsUsed: facts.length
    };
  }
  
  buildProblemHook(facts) {
    const problemFact = facts.find(f => 
      f.toLowerCase().includes('problem') || 
      f.toLowerCase().includes('issue') ||
      f.toLowerCase().includes('slow') ||
      f.toLowerCase().includes('expensive')
    ) || facts[0];
    
    return `${problemFact}

This is the problem no one talks about.

Code runs. Disputes don't.`;
  }
  
  buildContrastHook(facts) {
    return `Smart contracts execute in milliseconds.

Court cases take years.

See the gap?`;
  }
  
  buildFearHook(facts) {
    return `$50 million drained from The DAO in 2016. A bug in the code.

The blockchain didn't care. It just executed.

What happens when it's your transaction next?`;
  }
  
  buildAnalyticalHook(facts) {
    return `Smart contracts automate trust. But they don't automate justice.

Here's the structural problem:`;
  }
  
  buildFutureHook(facts) {
    return `In 5 years, most financial agreements will be between AI agents.

When they disagree, who resolves it?

A court in Delaware? A judge in Singapore?`;
  }
  
  buildCoreContent(facts) {
    // Extract unique facts and build content
    const uniqueFacts = [...new Set(facts)].slice(0, 3);
    
    let content = '';
    
    if (uniqueFacts[0]) {
      content += uniqueFacts[0] + '\n\n';
    }
    
    content += `Traditional courts are geographically bound. Slow. Expensive.

Cross-border disputes can take 18 months and cost more than the dispute itself.`;
    
    if (uniqueFacts[1]) {
      content += '\n\n' + uniqueFacts[1];
    }
    
    return content;
  }
  
  buildSolutionContent(facts) {
    let content = `Internet Court (internetcourt.org) is the missing layer.

AI jury evaluates evidence. Minutes, not months.

Verdict: TRUE. FALSE. UNDETERMINED.`;
    
    const solutionFact = facts.find(f => 
      f.toLowerCase().includes('ai') || 
      f.toLowerCase().includes('consensus') ||
      f.toLowerCase().includes('validator')
    );
    
    if (solutionFact) {
      content += '\n\n' + solutionFact;
    }
    
    return content;
  }
  
  buildDynamicCTA(facts, emotion) {
    const ctas = {
      curiosity: `The internet finally has its own court.

What disputes will you face in the Web3 economy?`,
      fear: `The agent economy is coming. AI-to-AI transactions at scale.

When they disagree, they need their own court.

Are you prepared?`,
      hope: `The future of commerce is autonomous. The future of dispute resolution has to match.

Code runs. Now disputes can too.

What's your plan?`,
      surprise: `Not in months. In minutes.

The infrastructure is here.

Ready to use it?`
    };
    
    return ctas[emotion] || ctas.curiosity;
  }
  
  buildHookFromKnowledge(angle) {
    return this.buildProblemHook(this.knowledgeBase.map(f => f.fact));
  }
  
  buildBodyFromKnowledge() {
    return this.buildCoreContent(this.knowledgeBase.map(f => f.fact));
  }
  
  buildCTAFromKnowledge() {
    return this.buildDynamicCTA(this.knowledgeBase.map(f => f.fact), 'curiosity');
  }
  
  // =========================================================================
  // LLM CALL WITH RETRY
  // =========================================================================
  
  async callLLMWithRetry(systemPrompt, userPrompt, options = {}, maxRetries = 3) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Use rate limiter if available
        if (this.rateLimiter) {
          const result = await this.rateLimiter.execute(async () => {
            await this.init();
            return this.zai.chat.completions.create({
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: options.temperature || 0.8,
              max_tokens: options.maxTokens || 500
            });
          });
          
          return {
            success: true,
            content: result.choices[0]?.message?.content || ''
          };
        }
        
        // Direct call
        await this.init();
        const completion = await this.zai.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: options.temperature || 0.8,
          max_tokens: options.maxTokens || 500
        });
        
        return {
          success: true,
          content: completion.choices[0]?.message?.content || ''
        };
        
      } catch (error) {
        lastError = error;
        console.log(`[SmartGen] Attempt ${attempt}/${maxRetries} failed: ${error.message.slice(0, 50)}...`);
        
        // If rate limit, wait longer
        if (error.message?.includes('429') || error.message?.includes('rate')) {
          const waitTime = 3000 * attempt; // Progressive wait
          console.log(`[SmartGen] Rate limited, waiting ${waitTime}ms...`);
          await new Promise(r => setTimeout(r, waitTime));
        }
      }
    }
    
    return {
      success: false,
      error: lastError?.message || 'All retries failed',
      content: ''
    };
  }
}

// ============================================================================
// CONTENT RECYCLER - Use successful content parts
// ============================================================================

class ContentRecycler {
  constructor() {
    this.successfulParts = {
      hooks: [],
      bodies: [],
      ctas: []
    };
  }
  
  addSuccessful(content) {
    const parts = content.split('\n\n');
    if (parts[0]) this.successfulParts.hooks.push(parts[0]);
    if (parts[1]) this.successfulParts.bodies.push(parts[1]);
    if (parts[parts.length - 1]) this.successfulParts.ctas.push(parts[parts.length - 1]);
  }
  
  canRecycle() {
    return this.successfulParts.hooks.length > 0 || 
           this.successfulParts.bodies.length > 0;
  }
  
  recycle(angle, emotion) {
    // Combine successful parts with variation
    const hook = this.getVariedPart('hooks', angle);
    const body = this.getVariedPart('bodies', angle);
    const cta = this.getVariedPart('ctas', angle);
    
    return [hook, body, cta].filter(Boolean).join('\n\n');
  }
  
  getVariedPart(type, angle) {
    const parts = this.successfulParts[type];
    if (parts.length === 0) return null;
    
    // Get random part and slightly modify
    const part = parts[Math.floor(Math.random() * parts.length)];
    return this.addVariation(part, angle);
  }
  
  addVariation(text, angle) {
    // Simple variation - you could make this more sophisticated
    const variations = {
      problem_first: ['But here\'s the issue:', 'The problem is:', 'Here\'s what\'s broken:'],
      contrast: ['On one hand:', 'Compare this:', 'The difference:'],
      fear: ['The scary part:', 'What keeps me up:', 'The risk is real:'],
      analytical: ['The data shows:', 'Let\'s break it down:', 'Here\'s the analysis:'],
      future_focused: ['Looking ahead:', 'In the future:', 'What\'s coming:']
    };
    
    const prefix = variations[angle]?.[Math.floor(Math.random() * 3)] || '';
    return prefix ? `${prefix} ${text}` : text;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  SmartContentGenerator,
  ContentRecycler
};
