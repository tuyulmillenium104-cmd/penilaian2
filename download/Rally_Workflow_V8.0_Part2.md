================================================================================
                    RALLY WORKFLOW V8.0 - PART 2
                    GENERATION ENGINE & ENHANCEMENT LAYERS
================================================================================

================================================================================
                    SECTION 8: PHASE 3 - GENERATION ENGINE (REWRITTEN)
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: GENERATION ENGINE                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Generate unique content using LLM (NO TEMPLATES)                │
│  DURATION: 60-120 seconds                                                   │
│  SKILLS: LLM (5 calls)                                                      │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                              │
│  ⚠️ CRITICAL: NO TEMPLATES ALLOWED                                          │
│  ────────────────────────────────                                            │
│  The following patterns are FORBIDDEN:                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ❌ "unpopular opinion: [X]"                                         │    │
│  │ ❌ "hot take: [X]"                                                  │    │
│  │ ❌ "change my mind: [X]"                                            │    │
│  │ ❌ "nobody is talking about [X]"                                    │    │
│  │ ❌ "here's the thing about [X]"                                     │    │
│  │ ❌ "thread 🧵" (as hook)                                            │    │
│  │ ❌ "let me explain [X]"                                             │    │
│  │ ❌ "95% of people get this wrong"                                   │    │
│  │ ❌ "3am realization: [X]"                                           │    │
│  │ ❌ "POV: [X]"                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                              │
│  STEP 3.1: CALCULATE GENERATION PARAMETERS                                  │
│  ──────────────────────────────────────────                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function calculateGenerationParams(knowledgeBase) {                 │    │
│  │                                                                      │    │
│  │   // 1. DERIVE EMOTION (NOT PRE-DEFINED)                            │    │
│  │   // ─────────────────────────────────────                          │    │
│  │   const emotionParams = {                                           │    │
│  │     market_component: deriveEmotionFromMarket(                      │    │
│  │       knowledgeBase.market_emotion                                  │    │
│  │     ),                                                              │    │
│  │     topic_component: deriveEmotionFromTopic(                        │    │
│  │       knowledgeBase.official_facts,                                 │    │
│  │       knowledgeBase.external_facts                                  │    │
│  │     ),                                                              │    │
│  │     gap_component: deriveEmotionFromGap(                            │    │
│  │       knowledgeBase.gap_opportunities.selected_gap                  │    │
│  │     )                                                               │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   // Calculate weighted emotion                                     │    │
│  │   const finalEmotion = {                                            │    │
│  │     primary: calculatePrimaryEmotion(emotionParams),                │    │
│  │     secondary: calculateSecondaryEmotion(emotionParams),            │    │
│  │     intensity: calculateIntensity(emotionParams),                   │    │
│  │     arc: determineEmotionalArc(emotionParams)                       │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   // 2. SELECT ANGLE FROM GAP                                       │    │
│  │   // ─────────────────────────                                       │    │
│  │   const selectedAngle = {                                           │    │
│  │     type: knowledgeBase.gap_opportunities.selected_gap,             │    │
│  │     reason: knowledgeBase.gap_opportunities.gap_reason,             │    │
│  │     alternatives: knowledgeBase.gap_opportunities.missing_hooks     │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   // 3. CALCULATE FR STRATEGY                                       │    │
│  │   // ─────────────────────────                                       │    │
│  │   const frStrategy = {                                              │    │
│  │     target_score: knowledgeBase.benchmark_scores.target_FR,         │    │
│  │     strategy: determineFRStrategy(                                  │    │
│  │       knowledgeBase.benchmark_scores.target_FR,                     │    │
│  │       selectedAngle.type                                            │    │
│  │     ),                                                              │    │
│  │     reply_bait_required: true,                                      │    │
│  │     question_format: true,                                          │    │
│  │     controversy_level: calculateControversyLevel(selectedAngle)     │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   // 4. PREPARE FACTS FOR GENERATION                                │    │
│  │   // ────────────────────────────────                                │    │
│  │   const factsForGeneration = selectFactsForGeneration(              │    │
│  │     knowledgeBase.official_facts,                                   │    │
│  │     knowledgeBase.external_facts,                                   │    │
│  │     max_facts: 10                                                   │    │
│  │   );                                                                │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     emotion: finalEmotion,                                          │    │
│  │     angle: selectedAngle,                                           │    │
│  │     frStrategy: frStrategy,                                         │    │
│  │     facts: factsForGeneration,                                      │    │
│  │     requirements: knowledgeBase.requirements                         │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  EMOTION DERIVATION FUNCTIONS:                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function deriveEmotionFromMarket(marketEmotion) {                   │    │
│  │   if (marketEmotion.primary === "fear") return "concern";           │    │
│  │   if (marketEmotion.primary === "greed") return "excitement";       │    │
│  │   if (marketEmotion.primary === "neutral") return "curiosity";      │    │
│  │   return "neutral";                                                 │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function deriveEmotionFromTopic(officialFacts, externalFacts) {     │    │
│  │   const allFacts = [...officialFacts, ...externalFacts];            │    │
│  │   const content = allFacts.map(f => f.content).join(' ');           │    │
│  │                                                                      │    │
│  │   // Check for legal/dispute content                                │    │
│  │   if (/legal|court|dispute|lawsuit|regulation/i.test(content)) {    │    │
│  │     return "righteous_indignation";                                 │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Check for innovation content                                   │    │
│  │   if (/innovative|revolutionary|new|first/i.test(content)) {        │    │
│  │     return "excitement";                                            │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return "curiosity";                                               │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function deriveEmotionFromGap(selectedGap) {                        │    │
│  │   const gapEmotionMap = {                                           │    │
│  │     "controversy": "righteous_indignation",                         │    │
│  │     "contrarian": "confidence",                                     │    │
│  │     "debate": "challenge",                                          │    │
│  │     "revelation": "surprise",                                       │    │
│  │     "case_study": "interest"                                        │    │
│  │   };                                                                │    │
│  │   return gapEmotionMap[selectedGap] || "curiosity";                 │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 3.2: LLM CALL #1 - GENERATE HOOK                                      │
│  ───────────────────────────────────────────                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function generateHook(genParams) {                            │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │                                                                      │    │
│  │   const prompt = `Generate a Twitter hook (max 60 chars) for a      │    │
│  │ thread about ${campaign.topic}.                                     │    │
│  │                                                                      │    │
│  │ KEY FACTS (from external research):                                 │    │
│  │ ${genParams.facts.slice(0, 5).map((f, i) =>                         │    │
│  │   `${i+1}. ${f.content}`).join('\n')}                               │    │
│  │                                                                      │    │
│  │ ANGLE: ${genParams.angle.type} (gap in competitor content)          │    │
│  │ EMOTION: ${genParams.emotion.primary}                               │    │
│  │ FR TARGET: ${genParams.frStrategy.target_score} (reply bait needed) │    │
│  │                                                                      │    │
│  │ RULES:                                                              │    │
│  │ - Do NOT use these templates:                                       │    │
│  │   "unpopular opinion", "hot take", "change my mind",                │    │
│  │   "nobody is talking about", "here's the thing", "thread"           │    │
│  │ - Create tension between problem and solution                       │    │
│  │ - Optimize for reply potential (controversial but defensible)       │    │
│  │ - Keep under 60 characters                                          │    │
│  │ - Be unique and memorable                                           │    │
│  │ - NO emojis in hook                                                 │    │
│  │                                                                      │    │
│  │ Output only the hook text, no explanation:`;
│  │                                                                      │    │
│  │   const completion = await zai.chat.completions.create({            │    │
│  │     messages: [                                                     │    │
│  │       {                                                             │    │
│  │         role: 'assistant',                                          │    │
│  │         content: 'You are a viral Twitter content expert. You       │    │
│  │                  generate unique hooks without using cliché         │    │
│  │                  templates. You are concise and only output the     │    │
│  │                  requested hook.'                                   │    │
│  │       },                                                            │    │
│  │       { role: 'user', content: prompt }                             │    │
│  │     ],                                                              │    │
│  │     thinking: { type: 'disabled' }                                  │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   const hook = completion.choices[0]?.message?.content.trim();      │    │
│  │                                                                      │    │
│  │   // Validate hook                                                  │    │
│  │   const validation = validateHook(hook);                            │    │
│  │   if (!validation.valid) {                                          │    │
│  │     // Regenerate with stricter prompt                              │    │
│  │     return regenerateHook(genParams, validation.issues);            │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     hook: hook,                                                     │    │
│  │     character_count: hook.length,                                   │    │
│  │     validation: validation,                                         │    │
│  │     llm_metadata: {                                                 │    │
│  │       model: completion.model,                                      │    │
│  │       tokens: completion.usage.total_tokens                         │    │
│  │     }                                                               │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function validateHook(hook) {                                       │    │
│  │   const issues = [];                                                │    │
│  │                                                                      │    │
│  │   // Check length                                                   │    │
│  │   if (hook.length > 60) {                                           │    │
│  │     issues.push("Hook exceeds 60 characters");                      │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Check for forbidden templates                                  │    │
│  │   const forbiddenPatterns = [                                       │    │
│  │     /unpopular opinion/i,                                           │    │
│  │     /hot take/i,                                                    │    │
│  │     /change my mind/i,                                              │    │
│  │     /nobody is talking about/i,                                     │    │
│  │     /here'?s the thing/i,                                           │    │
│  │     /^thread/i,                                                     │    │
│  │     /let me explain/i                                               │    │
│  │   ];                                                                │    │
│  │                                                                      │    │
│  │   for (const pattern of forbiddenPatterns) {                        │    │
│  │     if (pattern.test(hook)) {                                       │    │
│  │       issues.push(`Contains forbidden pattern: ${pattern}`);        │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Check for emojis                                               │    │
│  │   if (/[\u{1F300}-\u{1F9FF}]/u.test(hook)) {                        │    │
│  │     issues.push("Contains emoji (forbidden in hook)");              │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     valid: issues.length === 0,                                     │    │
│  │     issues: issues                                                  │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 3.3: LLM CALL #2 - GENERATE THREAD BODY                               │
│  ──────────────────────────────────────────────                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function generateThreadBody(hook, genParams, requirements) {  │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │                                                                      │    │
│  │   const prompt = `Generate a 6-tweet thread body for:               │    │
│  │                                                                      │    │
│  │ HOOK (Tweet 1): "${hook}"                                           │    │
│  │                                                                      │    │
│  │ FACTS TO USE:                                                       │    │
│  │ ${genParams.facts.map((f, i) => `${i+1}. ${f.content}`).join('\n')} │    │
│  │                                                                      │    │
│  │ CAMPAIGN REQUIREMENTS:                                              │    │
│  │ - Required mentions: ${requirements.mentions?.join(', ') || 'None'} │    │
│  │ - Required hashtags: ${requirements.hashtags?.join(', ') || 'None'} │    │
│  │ - Required links: ${requirements.links?.join(', ') || 'None'}       │    │
│  │                                                                      │    │
│  │ EMOTIONAL ARC: ${genParams.emotion.arc}                             │    │
│  │ ANGLE: ${genParams.angle.type}                                      │    │
│  │ FR STRATEGY: ${genParams.frStrategy.strategy}                       │    │
│  │                                                                      │    │
│  │ GENERATION RULES:                                                   │    │
│  │ 1. Each tweet under 280 characters                                  │    │
│  │ 2. Tweet 2-3: Problem amplification (use facts)                     │    │
│  │ 3. Tweet 4-5: Solution explanation                                  │    │
│  │ 4. Tweet 6: Real-world application / proof                          │    │
│  │ 5. Tweet 7: Call to action with reply bait + hashtag at end         │    │
│  │ 6. Natural, conversational tone (no AI-sounding phrases)            │    │
│  │ 7. NO links in first 4 tweets                                       │    │
│  │ 8. NO hashtags in first 5 tweets                                    │    │
│  │ 9. Vary sentence structure                                          │    │
│  │ 10. Include specific details from facts                             │    │
│  │                                                                      │    │
│  │ Output format:                                                      │    │
│  │ TWEET 2: [content]                                                  │    │
│  │ TWEET 3: [content]                                                  │    │
│  │ TWEET 4: [content]                                                  │    │
│  │ TWEET 5: [content]                                                  │    │
│  │ TWEET 6: [content]                                                  │    │
│  │ TWEET 7: [content]`;                                                │    │
│  │                                                                      │    │
│  │   const completion = await zai.chat.completions.create({            │    │
│  │     messages: [                                                     │    │
│  │       {                                                             │    │
│  │         role: 'assistant',                                          │    │
│  │         content: 'You are an expert crypto Twitter writer. You      │    │
│  │                  create engaging, viral threads with natural        │    │
│  │                  language. You avoid AI-sounding phrases and        │    │
│  │                  templates. Output only the requested tweets.'      │    │
│  │       },                                                            │    │
│  │       { role: 'user', content: prompt }                             │    │
│  │     ],                                                              │    │
│  │     thinking: { type: 'disabled' }                                  │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   const content = completion.choices[0]?.message?.content;          │    │
│  │   const tweets = parseThreadOutput(content);                        │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     tweets: tweets,                                                 │    │
│  │     raw_output: content,                                            │    │
│  │     llm_metadata: {                                                 │    │
│  │       model: completion.model,                                      │    │
│  │       tokens: completion.usage.total_tokens                         │    │
│  │     }                                                               │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function parseThreadOutput(content) {                               │    │
│  │   const tweets = {};                                                │    │
│  │   const lines = content.split('\n');                                │    │
│  │                                                                      │    │
│  │   let currentTweet = null;                                          │    │
│  │   let currentContent = [];                                          │    │
│  │                                                                      │    │
│  │   for (const line of lines) {                                       │    │
│  │     const match = line.match(/^TWEET (\d+):\s*(.*)/i);              │    │
│  │     if (match) {                                                    │    │
│  │       if (currentTweet !== null) {                                  │    │
│  │         tweets[currentTweet] = currentContent.join(' ').trim();     │    │
│  │       }                                                             │    │
│  │       currentTweet = parseInt(match[1]);                            │    │
│  │       currentContent = [match[2]];                                  │    │
│  │     } else if (currentTweet !== null && line.trim()) {              │    │
│  │       currentContent.push(line.trim());                             │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   if (currentTweet !== null) {                                      │    │
│  │     tweets[currentTweet] = currentContent.join(' ').trim();         │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return tweets;                                                    │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 3.4: LLM CALL #3 - MULTI-VERSION GENERATION                           │
│  ─────────────────────────────────────────────────                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function generateMultipleVersions(hook, thread, genParams) {  │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │                                                                      │    │
│  │   const prompt = `Generate 3 alternative versions of this thread:   │    │
│  │                                                                      │    │
│  │ ORIGINAL HOOK: "${hook}"                                            │    │
│  │ ORIGINAL THREAD:                                                    │    │
│  │ ${Object.entries(thread).map(([n, t]) => `Tweet ${n}: ${t}`).join('\n')} │    │
│  │                                                                      │    │
│  │ GENERATION RULES:                                                   │    │
│  │ - Version A: More provocative/controversial angle                   │    │
│  │ - Version B: More educational/informative angle                     │    │
│  │ - Version C: More personal/story-driven angle                       │    │
│  │ - Each version must be UNIQUE (not just rewording)                  │    │
│  │ - Each version still uses facts from:                               │    │
│  │   ${genParams.facts.slice(0, 3).map(f => f.content).join('; ')}    │    │
│  │ - NO templates                                                      │    │
│  │                                                                      │    │
│  │ Output format:                                                      │    │
│  │ VERSION A:                                                          │    │
│  │ Hook: [hook text]                                                   │    │
│  │ Tweet 2: [content]                                                  │    │
│  │ ...                                                                 │    │
│  │                                                                      │    │
│  │ VERSION B:                                                          │    │
│  │ Hook: [hook text]                                                   │    │
│  │ ...                                                                 │    │
│  │                                                                      │    │
│  │ VERSION C:                                                          │    │
│  │ Hook: [hook text]                                                   │    │
│  │ ...`;                                                               │    │
│  │                                                                      │    │
│  │   const completion = await zai.chat.completions.create({            │    │
│  │     messages: [                                                     │    │
│  │       {                                                             │    │
│  │         role: 'assistant',                                          │    │
│  │         content: 'You are a creative content generator specializing │    │
│  │                  in creating unique variations. Each version must   │    │
│  │                  be genuinely different in approach and tone.'      │    │
│  │       },                                                            │    │
│  │       { role: 'user', content: prompt }                             │    │
│  │     ],                                                              │    │
│  │     thinking: { type: 'disabled' }                                  │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   return parseMultiVersionOutput(completion.choices[0]?.message?.content); │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "primary_content": {                                               │    │
│  │     "hook": "Crypto courts: justice for the code, not the rich.",   │    │
│  │     "thread": {                                                      │    │
│  │       "2": "Traditional courts can't even read...",                 │    │
│  │       "3": "...",                                                    │    │
│  │       "7": "... #InternetCourt"                                      │    │
│  │     }                                                                │    │
│  │   },                                                                 │    │
│  │   "alternatives": {                                                  │    │
│  │     "A": { "hook": "...", "thread": {...} },                        │    │
│  │     "B": { "hook": "...", "thread": {...} },                        │    │
│  │     "C": { "hook": "...", "thread": {...} }                         │    │
│  │   },                                                                 │    │
│  │   "llm_calls_made": 3,                                               │    │
│  │   "total_tokens_used": 1500,                                         │    │
│  │   "next_phase": 4                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 9: PHASE 4 - THREAD STRUCTURE
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: THREAD STRUCTURE                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Validate and optimize thread structure                          │
│  DURATION: 30 seconds                                                       │
│  SKILLS: None (rules-based validation)                                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 4.1: STRUCTURE VALIDATION                                             │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ THREAD STRUCTURE REQUIREMENTS:                                      │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Tweet │ Content Type     │ Requirements                       │   │    │
│  │ │───────────────────────────────────────────────────────────────│   │    │
│  │ │ 1     │ Hook             │ Max 60 chars, no emoji, no link    │   │    │
│  │ │ 2     │ Problem          │ Introduce tension/pain point       │   │    │
│  │ │ 3     │ Agitation        │ Amplify problem with facts         │   │    │
│  │ │ 4     │ Solution Intro   │ Present the solution               │   │    │
│  │ │ 5     │ Solution Detail  │ How it works, benefits             │   │    │
│  │ │ 6     │ Proof/Example    │ Real-world application             │   │    │
│  │ │ 7     │ CTA              │ Question + hashtag, reply bait     │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ VALIDATION CHECKS:                                                  │    │
│  │ - Total thread length: 7 tweets (optimal for engagement)            │    │
│  │ - Each tweet: < 280 characters                                      │    │
│  │ - Link placement: Tweet 5 or later (or reply)                       │    │
│  │ - Hashtag placement: Tweet 7 only (max 1-2 hashtags)                │    │
│  │ - Mention placement: Natural integration, not forced                │    │
│  │ - Flow: Problem → Agitation → Solution → Proof → CTA               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 4.2: CHARACTER COUNT VALIDATION                                       │
│  ──────────────────────────────────────────                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function validateCharacterCounts(thread) {                          │    │
│  │   const issues = [];                                                │    │
│  │                                                                      │    │
│  │   for (const [tweetNum, content] of Object.entries(thread)) {       │    │
│  │     if (content.length > 280) {                                     │    │
│  │       issues.push({                                                 │    │
│  │         tweet: tweetNum,                                            │    │
│  │         issue: "exceeds_280_chars",                                 │    │
│  │         current: content.length,                                    │    │
│  │         excess: content.length - 280                                │    │
│  │       });                                                           │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     valid: issues.length === 0,                                     │    │
│  │     issues: issues                                                  │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 4.3: LINK STRATEGY CHECK (From V3.15)                                 │
│  ───────────────────────────────────────────────                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ LINK PENALTY REALITY:                                               │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Account Type │ Link Placement      │ Reach Impact             │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ Non-Premium  │ Main tweet          │ ZERO median engagement  │   │    │
│  │ │ Premium      │ Single link         │ -20% to -50%            │   │    │
│  │ │ Any          │ Multiple links      │ -70%                    │   │    │
│  │ │ Any          │ Shortened URL       │ Additional -10%         │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ RULES:                                                              │    │
│  │ - Non-Premium accounts: Link in REPLY ONLY                          │    │
│  │ - Premium accounts: Link in Tweet 5+ or Reply                       │    │
│  │ - NEVER: Link in Tweet 1 (hook tweet)                               │    │
│  │ - NEVER: Shortened URLs                                             │    │
│  │ - NEVER: Multiple links in same tweet                               │    │
│  │                                                                      │    │
│  │ function validateLinkPlacement(thread, isPremium) {                 │    │
│  │   const issues = [];                                                │    │
│  │   const urlPattern = /https?:\/\/[^\s]+/g;                          │    │
│  │                                                                      │    │
│  │   for (const [tweetNum, content] of Object.entries(thread)) {       │    │
│  │     const links = content.match(urlPattern) || [];                  │    │
│  │                                                                      │    │
│  │     if (links.length > 1) {                                         │    │
│  │       issues.push({ tweet: tweetNum, issue: "multiple_links" });    │    │
│  │     }                                                               │    │
│  │                                                                      │    │
│  │     if (parseInt(tweetNum) <= 4 && links.length > 0) {              │    │
│  │       if (!isPremium) {                                             │    │
│  │         issues.push({ tweet: tweetNum, issue: "link_too_early_non_premium" }); │    │
│  │       } else if (parseInt(tweetNum) === 1) {                        │    │
│  │         issues.push({ tweet: tweetNum, issue: "link_in_hook" });    │    │
│  │       }                                                             │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return { valid: issues.length === 0, issues };                    │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 4.4: HASHTAG STRATEGY CHECK (From V3.15)                              │
│  ──────────────────────────────────────────────────                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ HASHTAG IMPACT:                                                     │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Count │ Impact        │ V8.0 Rule                              │   │    │
│  │ │───────────────────────────────────────────────────────────────│   │    │
│  │ │ 0     │ Baseline      │ ✅ OK for hooks                       │   │    │
│  │ │ 1     │ +100% (2x)    │ ✅ OPTIMAL                             │   │    │
│  │ │ 2     │ +80%          │ ✅ GOOD                                │   │    │
│  │ │ 3+    │ -21%          │ ❌ AVOID                               │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ RULES:                                                              │    │
│  │ 1. Maximum 1-2 hashtags per tweet                                   │    │
│  │ 2. NEVER in Tweet 1 (hook tweet)                                    │    │
│  │ 3. Place at END of tweet                                            │    │
│  │ 4. Split across tweets if campaign requires 3+                      │    │
│  │                                                                      │    │
│  │ function validateHashtagPlacement(thread) {                         │    │
│  │   const issues = [];                                                │    │
│  │   const hashtagPattern = /#[\w]+/g;                                 │    │
│  │                                                                      │    │
│  │   for (const [tweetNum, content] of Object.entries(thread)) {       │    │
│  │     const hashtags = content.match(hashtagPattern) || [];           │    │
│  │                                                                      │    │
│  │     if (hashtags.length > 2) {                                      │    │
│  │       issues.push({ tweet: tweetNum, issue: "too_many_hashtags", count: hashtags.length }); │    │
│  │     }                                                               │    │
│  │                                                                      │    │
│  │     if (parseInt(tweetNum) === 1 && hashtags.length > 0) {          │    │
│  │       issues.push({ tweet: tweetNum, issue: "hashtag_in_hook" });   │    │
│  │     }                                                               │    │
│  │                                                                      │    │
│  │     // Check hashtag is at end                                      │    │
│  │     if (hashtags.length > 0) {                                      │    │
│  │       const lastHashtag = hashtags[hashtags.length - 1];            │    │
│  │       const lastHashtagIndex = content.lastIndexOf(lastHashtag);    │    │
│  │       const textAfterHashtag = content.slice(lastHashtagIndex + lastHashtag.length).trim(); │    │
│  │       if (textAfterHashtag.length > 0) {                            │    │
│  │         issues.push({ tweet: tweetNum, issue: "hashtag_not_at_end" }); │    │
│  │       }                                                             │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return { valid: issues.length === 0, issues };                    │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "structure_validation": {                                          │    │
│  │     "character_counts": { "valid": true, "issues": [] },             │    │
│  │     "link_placement": { "valid": true, "issues": [] },               │    │
│  │     "hashtag_placement": { "valid": true, "issues": [] },            │    │
│  │     "flow": { "valid": true, "pattern": "problem_agitation_solution" }│    │
│  │   },                                                                 │    │
│  │   "next_phase": 5                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 10: PHASE 5 - INVISIBLE INFLUENCE
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: INVISIBLE INFLUENCE                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Optimize for influencer engagement WITHOUT direct mentions      │
│  DURATION: 30-60 seconds                                                    │
│  SKILLS: None                                                               │
│  SOURCE: V7.0 FINAL Best Practice                                           │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  WHY NOT MENTION DIRECTLY?                                                  │
│  ────────────────────────────                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ❌ Direct mentions can violate:                                     │    │
│  │    - G3 Campaign Compliance (if not required)                       │    │
│  │    - G4 Originality (can be seen as clout chasing)                  │    │
│  │    - Campaign Guidelines (if prohibited)                            │    │
│  │                                                                      │    │
│  │ ✅ Invisible Influence approach:                                    │    │
│  │    - Target keywords/topics they monitor                            │    │
│  │    - Use hashtags they follow                                       │    │
│  │    - Create content format that attracts them                       │    │
│  │    - Post when they're active                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 5.1: IDENTIFY TARGET ACCOUNTS                                         │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ INFLUENCER TARGET MATRIX:                                           │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Influencer Type      │ Keywords They Monitor                   │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ DeFi Influencers     │ "DeFi", "yield", "protocol", "TVL"     │   │    │
│  │ │ Crypto News Bots     │ "Breaking", "🚨", "Just in", "Update"   │   │    │
│  │ │ Project Team         │ Project name, token ticker             │   │    │
│  │ │ Alpha Callers        │ "Alpha", "Gem", "Hidden", "100x"       │   │    │
│  │ │ Legal/Crypto         │ "SEC", "regulation", "court", "lawsuit"│   │    │
│  │ │ DAO Governors        │ "DAO", "governance", "vote", "proposal"│   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ function identifyTargetAccounts(campaign, gapAnalysis) {            │    │
│  │   const targets = [];                                               │    │
│  │                                                                      │    │
│  │   // Based on campaign type                                         │    │
│  │   if (campaign.is_crypto_related) {                                 │    │
│  │     targets.push({ type: "defi_influencers", keywords: ["DeFi", "protocol"] }); │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Based on gap angle                                             │    │
│  │   if (gapAnalysis.selected_gap === "controversy") {                 │    │
│  │     targets.push({ type: "legal_crypto", keywords: ["court", "legal", "dispute"] }); │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Based on FR target                                             │    │
│  │   if (frTarget > 6.0) {                                             │    │
│  │     targets.push({ type: "high_follower_accounts", min_followers: 50000 }); │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return targets;                                                   │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 5.2: KEYWORD/CONTENT MAGNET STRATEGY                                  │
│  ───────────────────────────────────────────────                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ CONTENT FORMAT MAGNETS:                                             │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Format              │ Why Attracts                              │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ Contrarian take     │ They love debate, will reply            │   │    │
│  │ │ Data reveal         │ News bots pickup                         │   │    │
│  │ │ First to report     │ Scoop hunters notice                    │   │    │
│  │ │ Hot take            │ Engagement magnet                       │   │    │
│  │ │ Educational thread  │ Value-driven sharing                    │   │    │
│  │ │ Case study          │ Evidence-based appeal                   │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ function injectInvisibleInfluence(content, targets) {               │    │
│  │   const enhancedContent = { ...content };                           │    │
│  │                                                                      │    │
│  │   // Inject target keywords naturally                               │    │
│  │   for (const target of targets) {                                   │    │
│  │     for (const keyword of target.keywords) {                        │    │
│  │       // Check if keyword already exists                            │    │
│  │       // If not, find natural place to add                         │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return enhancedContent;                                           │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 5.3: POST-SUBMIT STRATEGY (NOT SCORED)                                │
│  ───────────────────────────────────────────────                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ AFTER SUBMISSION (for FR optimization):                             │    │
│  │                                                                      │    │
│  │ 1. QUOTE TWEET relevant influencer content:                         │    │
│  │    "This connects to what I wrote about [topic]..."                 │    │
│  │                                                                      │    │
│  │ 2. REPLY to relevant threads:                                       │    │
│  │    "Wrote more about this concept here: [link to your tweet]"       │    │
│  │                                                                      │    │
│  │ 3. ENGAGE with accounts that might be interested:                   │    │
│  │    - Like their relevant tweets                                     │    │
│  │    - Reply with value (not just "great point")                      │    │
│  │                                                                      │    │
│  │ ⚠️ These actions happen AFTER Rally submission, so they don't      │    │
│  │    affect scoring but can significantly boost FR.                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "target_accounts_identified": [                                    │    │
│  │     { "type": "defi_influencers", "keywords": ["DeFi", "protocol"] },│    │
│  │     { "type": "legal_crypto", "keywords": ["court", "dispute"] }     │    │
│  │   ],                                                                 │    │
│  │   "content_enhanced": true,                                          │    │
│  │   "keywords_injected": ["court", "dispute", "justice"],              │    │
│  │   "post_submit_strategy": [                                          │    │
│  │     "Quote tweet relevant legal/crypto accounts",                    │    │
│  │     "Reply to trending thread about topic"                           │    │
│  │   ],                                                                 │    │
│  │   "next_phase": 6                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 11: PHASE 6 - VIRAL MECHANICS
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: VIRAL MECHANICS                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Add viral amplification elements                                │
│  DURATION: 30-60 seconds                                                    │
│  SKILLS: None                                                               │
│  SOURCE: V3.16 Best Practice                                                │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 6.1: VIRAL COEFFICIENT CALCULATION                                    │
│  ───────────────────────────────────────                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ VIRAL COEFFICIENT (k-factor):                                       │    │
│  │                                                                      │    │
│  │ k = Share Rate × Secondary Reach                                    │    │
│  │                                                                      │    │
│  │ k ≥ 1.0 = Viral (each share generates 1+ more shares)              │    │
│  │ k ≥ 0.5 = Good amplification                                        │    │
│  │ k < 0.5 = Limited reach                                             │    │
│  │                                                                      │    │
│  │ function calculateViralCoefficient(content) {                       │    │
│  │   const shareRate = estimateShareRate(content);                     │    │
│  │   const secondaryReach = estimateSecondaryReach(content);           │    │
│  │   return shareRate * secondaryReach;                                │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function estimateShareRate(content) {                               │    │
│  │   let rate = 0.01; // Base rate                                     │    │
│  │                                                                      │    │
│  │   // Boosters                                                       │    │
│  │   if (hasControversialTake(content)) rate *= 2;                     │    │
│  │   if (hasDataPoint(content)) rate *= 1.5;                           │    │
│  │   if (hasEmotionalHook(content)) rate *= 1.3;                       │    │
│  │   if (hasCallToShare(content)) rate *= 1.2;                         │    │
│  │                                                                      │    │
│  │   return Math.min(rate, 0.15); // Cap at 15%                        │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 6.2: SHARE TRIGGER WORDS                                              │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SHARE TRIGGER WORDS LIBRARY:                                        │    │
│  │                                                                      │    │
│  │ High Share Rate Triggers:                                           │    │
│  │ ┌─────────────────────────────────────────────────────────────┐     │    │
│  │ │ Category        │ Trigger Words                              │     │    │
│  │ │────────────────────────────────────────────────────────────│     │    │
│  │ │ Revelation      │ "Actually", "Turns out", "The truth is"   │     │    │
│  │ │ Urgency         │ "Now", "Today", "Just happened", "Breaking"│     │    │
│  │ │ Exclusivity     │ "First", "Only", "Secret", "Hidden"       │     │    │
│  │ │ Proof           │ "Data shows", "Study found", "Evidence"   │     │    │
│  │ │ Controversy     │ "Wrong", "Lie", "Myth", "Actually"        │     │    │
│  │ │ Opportunity     │ "Opportunity", "Chance", "Window"         │     │    │
│  │ └─────────────────────────────────────────────────────────────┘     │    │
│  │                                                                      │    │
│  │ function injectShareTriggers(content, gapAngle) {                   │    │
│  │   const triggers = selectTriggersForAngle(gapAngle);                │    │
│  │   // Inject naturally into content                                  │    │
│  │   return enhanceContent(content, triggers);                         │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 6.3: REPLY BAIT ENGINEERING                                           │
│  ───────────────────────────────                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ REPLY BAIT TECHNIQUES:                                              │    │
│  │                                                                      │    │
│  │ 1. DEBATE INVITATION                                                │    │
│  │    "What's your verdict on [X]?"                                    │    │
│  │    "Would you trust [A] over [B]?"                                  │    │
│  │                                                                      │    │
│  │ 2. OPINION REQUEST                                                  │    │
│  │    "What's your experience with [X]?"                               │    │
│  │    "Anyone else seen this?"                                         │    │
│  │                                                                      │    │
│  │ 3. COMPLETION CHALLENGE                                             │    │
│  │    "Finish this sentence: [X] is..."                                │    │
│  │    "What would you add?"                                            │    │
│  │                                                                      │    │
│  │ 4. CONTROVERSIAL STATEMENT (defensible)                             │    │
│  │    "[X] is better than [Y], and here's why"                         │    │
│  │    "Unpopular but true: [X]"                                        │    │
│  │                                                                      │    │
│  │ function engineerReplyBait(content, frStrategy) {                   │    │
│  │   const lastTweet = content.thread[7];                              │    │
│  │                                                                      │    │
│  │   // Ensure CTA has reply bait                                     │    │
│  │   if (!hasReplyBait(lastTweet)) {                                   │    │
│  │     // Add question format                                          │    │
│  │     content.thread[7] = addQuestionCTA(lastTweet, frStrategy);      │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return content;                                                   │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 6.4: SCREENSHOT WORTHINESS                                            │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ SCREENSHOT WORTHINESS CHECK:                                        │    │
│  │                                                                      │    │
│  │ A tweet is screenshot-worthy if:                                    │    │
│  │ 1. Has quotable one-liner                                           │    │
│  │ 2. Contains surprising data point                                   │    │
│  │ 3. Makes bold prediction                                            │    │
│  │ 4. States controversial opinion clearly                             │    │
│  │                                                                      │    │
│  │ function checkScreenshotWorthiness(tweet) {                         │    │
│  │   const factors = {                                                 │    │
│  │     has_quotable_line: /"[^"]{20,50}"/.test(tweet),                 │    │
│  │     has_data_point: /\d+%|\$[\d,]+|\d+[xX]/.test(tweet),            │    │
│  │     has_prediction: /will|going to|predict|expect/i.test(tweet),    │    │
│  │     has_bold_statement: isBoldStatement(tweet)                      │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   return Object.values(factors).filter(Boolean).length >= 2;        │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "viral_coefficient": 0.65,                                         │    │
│  │   "share_triggers_added": ["actually", "turns out"],                 │    │
│  │   "reply_bait_engineered": true,                                     │    │
│  │   "screenshot_worthy_tweets": [3, 5],                                │    │
│  │   "next_phase": 7                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 12: PHASE 7 - PSYCHOLOGICAL TRIGGERS
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 7: PSYCHOLOGICAL TRIGGERS                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Apply psychological principles for engagement                   │
│  DURATION: 30 seconds                                                       │
│  SKILLS: None                                                               │
│  SOURCE: V3.16 Best Practice                                                │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 7.1: 8 PSYCHOLOGICAL TRIGGERS                                         │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ TRIGGER           │ TECHNIQUE                    │ USE CASE          │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 1. Curiosity Gap  │ "The answer isn't what you   │ Hook creation     │    │
│  │                   │ think..."                    │                   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 2. FOMO           │ "Only X days left" or        │ Urgency creation  │    │
│  │                   │ "Window closing"             │                   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 3. Social Proof   │ "X people already..."        │ Credibility       │    │
│  │                   │ "Top projects use..."        │                   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 4. Authority      │ Cite credible sources        │ Trust building    │    │
│  │                   │ "According to [research]..." │                   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 5. Scarcity       │ "Rare opportunity"           │ Value perception  │    │
│  │                   │ "Limited time"               │                   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 6. Reciprocity    │ "Free insight"               │ Engagement        │    │
│  │                   │ "Sharing this because..."    │                   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 7. Loss Aversion  │ "Don't miss out on..."       │ Action motivation │    │
│  │                   │ "Risk of..."                 │                   │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ 8. Identity       │ "As a [X], you..."           │ Personal appeal   │    │
│  │                   │ "If you believe in..."       │                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 7.2: TRIGGER SELECTION BY ANGLE                                       │
│  ────────────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function selectPsychologicalTriggers(gapAngle, emotion) {           │    │
│  │   const triggerMap = {                                              │    │
│  │     "controversy": ["curiosity_gap", "authority", "identity"],      │    │
│  │     "educational": ["curiosity_gap", "authority", "reciprocity"],   │    │
│  │     "fomo": ["fomo", "scarcity", "loss_aversion"],                  │    │
│  │     "social_proof": ["social_proof", "authority", "identity"],      │    │
│  │     "debate": ["curiosity_gap", "identity", "authority"]            │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   return triggerMap[gapAngle] || triggerMap["educational"];         │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function applyPsychologicalTriggers(content, triggers) {            │    │
│  │   const enhancedContent = { ...content };                           │    │
│  │                                                                      │    │
│  │   for (const trigger of triggers) {                                 │    │
│  │     switch (trigger) {                                              │    │
│  │       case "curiosity_gap":                                         │    │
│  │         enhancedContent.hook = addCuriosityGap(enhancedContent.hook); │    │
│  │         break;                                                      │    │
│  │       case "authority":                                             │    │
│  │         enhancedContent.thread[4] = addAuthorityCitation(           │    │
│  │           enhancedContent.thread[4],                                │    │
│  │           "Stanford research"                                       │    │
│  │         );                                                          │    │
│  │         break;                                                      │    │
│  │       case "social_proof":                                          │    │
│  │         enhancedContent.thread[5] = addSocialProof(                 │    │
│  │           enhancedContent.thread[5]                                 │    │
│  │         );                                                          │    │
│  │         break;                                                      │    │
│  │       // ... other triggers                                         │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return enhancedContent;                                           │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "triggers_applied": ["curiosity_gap", "authority", "identity"],    │    │
│  │   "trigger_locations": {                                             │    │
│  │     "curiosity_gap": "hook",                                         │    │
│  │     "authority": "tweet_4",                                          │    │
│  │     "identity": "tweet_7"                                            │    │
│  │   },                                                                 │    │
│  │   "next_phase": 8                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 13: PHASE 8 - NETWORK EFFECT / FR STRATEGY
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 8: NETWORK EFFECT / FR STRATEGY                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Optimize for FR (Followers of Repliers) - THE CHEAT CODE        │
│  DURATION: 30-60 seconds                                                    │
│  SKILLS: None                                                               │
│  SOURCE: V5.0 FR Cheat Code                                                 │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                              │
│  ⚠️ FR IS THE MOST IMPORTANT ENGAGEMENT METRIC                              │
│  ────────────────────────────────────────────────                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ FR = log(Sum of Followers of All Repliers + 1)                      │    │
│  │                                                                      │    │
│  │ EXAMPLE CALCULATIONS:                                                │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Scenario                        │ Total Followers │ FR Score  │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ 1 reply from 100K account      │ 100,000         │ ≈ 5.0     │   │    │
│  │ │ 10 replies from 10K each       │ 100,000         │ ≈ 5.0     │   │    │
│  │ │ 1 reply from 1M account        │ 1,000,000       │ ≈ 6.0     │   │    │
│  │ │ 100 replies from 100 each      │ 10,000          │ ≈ 4.0     │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ ★ KEY INSIGHT: 1 reply from influencer > 100 replies from small!   │    │
│  │ ★ FR contributes ~22% of total engagement score                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 8.1: FR TARGET CALCULATION                                            │
│  ───────────────────────────────                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function calculateFRTarget(leaderboard, gapAngle) {                 │    │
│  │                                                                      │    │
│  │   // Get top FR from leaderboard                                    │    │
│  │   const topFR = Math.max(...leaderboard.map(e => e.FR));            │    │
│  │                                                                      │    │
│  │   // Target 20% above top                                           │    │
│  │   const targetFR = topFR * 1.2;                                     │    │
│  │                                                                      │    │
│  │   // Adjust based on angle                                          │    │
│  │   const angleMultipliers = {                                        │    │
│  │     "controversy": 1.3,  // Higher FR potential                     │    │
│  │     "debate": 1.2,                                                  │    │
│  │     "educational": 1.0,                                             │    │
│  │     "promotional": 0.8                                              │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   return targetFR * (angleMultipliers[gapAngle] || 1.0);            │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 8.2: REPLY BAIT OPTIMIZATION                                          │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ HIGH FR REPLY BAIT TECHNIQUES:                                      │    │
│  │                                                                      │    │
│  │ 1. CONTROVERSIAL OPINION (defensible)                               │    │
│  │    "Traditional courts can't handle crypto. Internet Court can."    │    │
│  │    → Attracts legal/crypto influencers                              │    │
│  │                                                                      │    │
│  │ 2. DEBATE INVITATION                                                │    │
│  │    "Would you trust 12 random jurors over a judge?"                 │    │
│  │    → Attracts engagement from both sides                            │    │
│  │                                                                      │    │
│  │ 3. IDENTITY APPEAL                                                  │    │
│  │    "If you believe in decentralized justice, what's your take?"     │    │
│  │    → Attracts believers in the space                                │    │
│  │                                                                      │    │
│  │ 4. DATA CHALLENGE                                                   │    │
│  │    "数据显示 X. 你同意吗?"                                          │    │
│  │    → Attracts data-oriented accounts                                │    │
│  │                                                                      │    │
│  │ function optimizeReplyBait(content, frTarget) {                     │    │
│  │   const cta = content.thread[7];                                    │    │
│  │                                                                      │    │
│  │   // Check current reply bait score                                 │    │
│  │   const currentScore = scoreReplyBait(cta);                         │    │
│  │                                                                      │    │
│  │   if (currentScore < frTarget * 0.1) {                              │    │
│  │     // Enhance CTA                                                  │    │
│  │     content.thread[7] = enhanceReplyBait(cta, frTarget);            │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return content;                                                   │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function scoreReplyBait(tweet) {                                    │    │
│  │   let score = 0;                                                    │    │
│  │                                                                      │    │
│  │   if (/\?/.test(tweet)) score += 30;  // Has question               │    │
│  │   if (/you|your/i.test(tweet)) score += 20;  // Direct address      │    │
│  │   if (/would|should|could/i.test(tweet)) score += 15;  // Modal     │    │
│  │   if (/vs|over|than/i.test(tweet)) score += 15;  // Comparison      │    │
│  │   if (/[!?]{2,}/.test(tweet)) score -= 20;  // Too aggressive       │    │
│  │                                                                      │    │
│  │   return score;                                                     │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 8.3: FIRST TWEET 60% RULE                                             │
│  ────────────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ FIRST TWEET CHECKLIST (9 Points):                                   │    │
│  │                                                                      │    │
│  │ [ ] Hook under 60 characters                                        │    │
│  │ [ ] No emojis in first line                                         │    │
│  │ [ ] Creates tension/curiosity                                       │    │
│  │ [ ] No links                                                        │    │
│  │ [ ] No hashtags                                                     │    │
│  │ [ ] First 3 words grab attention                                    │    │
│  │ [ ] Sets up thread expectation                                      │    │
│  │ [ ] No mentions (unless required)                                   │    │
│  │ [ ] Unique (no template)                                            │    │
│  │                                                                      │    │
│  │ Why: First tweet determines 60% of thread engagement               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "fr_target": 7.0,                                                  │    │
│  │   "reply_bait_score": 85,                                            │    │
│  │   "reply_bait_technique": "debate_invitation",                       │    │
│  │   "first_tweet_checklist": {                                         │    │
│  │     "passed": 9,                                                     │    │
│  │     "failed": 0                                                      │    │
│  │   },                                                                 │    │
│  │   "next_phase": 9                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 14: PHASE 9 - MICRO-OPTIMIZATION
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 9: MICRO-OPTIMIZATION                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Fine-tune content for maximum engagement                        │
│  DURATION: 30-60 seconds                                                    │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 9.1: WORD CHOICE OPTIMIZATION                                         │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ POWER WORDS TO USE:                                                 │    │
│  │ ┌─────────────────────────────────────────────────────────────┐     │    │
│  │ │ Category    │ Power Words                                   │     │    │
│  │ │────────────────────────────────────────────────────────────│     │    │
│  │ │ Action      │ Transform, Unlock, Discover, Master          │     │    │
│  │ │ Result      │ Proven, Guaranteed, Verified, Demonstrated   │     │    │
│  │ │ Exclusivity │ Secret, Hidden, Only, Rare                   │     │    │
│  │ │ Urgency     │ Now, Today, Immediately, Limited             │     │    │
│  │ │ Value       │ Free, Bonus, Extra, Premium                  │     │    │
│  │ │ Trust       │ Verified, Official, Certified, Authentic     │     │    │
│  │ └─────────────────────────────────────────────────────────────┘     │    │
│  │                                                                      │    │
│  │ WEAK WORDS TO AVOID:                                                │    │
│  │ - "maybe", "might", "could be" (uncertainty)                        │    │
│  │ - "very", "really", "quite" (filler words)                          │    │
│  │ - "thing", "stuff", "something" (vague)                             │    │
│  │ - "I think", "I believe" (weak authority)                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 9.2: SENTENCE STRUCTURE                                               │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ OPTIMAL SENTENCE STRUCTURE:                                         │    │
│  │                                                                      │    │
│  │ 1. HOOK TWEET: Short, punchy sentences (5-10 words each)            │    │
│  │ 2. BODY TWEETS: Mix of short and medium (varied rhythm)             │    │
│  │ 3. CTA TWEET: Direct question or clear call-to-action               │    │
│  │                                                                      │    │
│  │ RATIO: 60% short sentences (< 15 words)                             │    │
│  │        30% medium sentences (15-25 words)                           │    │
│  │        10% long sentences (> 25 words)                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 9.3: AI DETECTION AVOIDANCE                                           │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ AI DETECTION FLAGS TO AVOID:                                        │    │
│  │                                                                      │    │
│  │ ❌ Overused AI phrases:                                              │    │
│  │    - "In today's digital landscape..."                              │    │
│  │    - "It's worth noting that..."                                    │    │
│  │    - "In conclusion..."                                             │    │
│  │    - "Let's dive into..."                                           │    │
│  │    - "Here's the thing..."                                          │    │
│  │    - "At the end of the day..."                                     │    │
│  │                                                                      │    │
│  │ ✅ HUMAN MARKERS:                                                    │    │
│  │    - Contractions (it's, don't, won't)                              │    │
│  │    - Casual transitions (So, But, And at start)                     │    │
│  │    - Personal asides (trust me, honestly)                           │    │
│  │    - Imperfect grammar (occasionally)                               │    │
│  │    - Emoji use (sparingly, in body tweets)                          │    │
│  │    - Numbers and specific details                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 9.4: TIMING OPTIMIZATION (From V3.14)                                 │
│  ───────────────────────────────────────────────                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ GLOBAL OPTIMAL TIMING:                                              │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Day       │ Best Time (EST)        │ Engagement Multiplier    │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ Wednesday │ 9 AM EST (14:00 UTC)   │ 1.3x (PEAK)             │   │    │
│  │ │ Tuesday   │ 9-11 AM EST            │ 1.2x                     │   │    │
│  │ │ Thursday  │ 10 AM - 5 PM EST       │ 1.1x                     │   │    │
│  │ │ Monday    │ 9-11 AM EST            │ 1.0x                     │   │    │
│  │ │ Friday    │ 9 AM EST               │ 0.9x                     │   │    │
│  │ │ Weekend   │ Avoid                  │ 0.7x                     │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ CRYPTO-SPECIFIC TIMING:                                             │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Audience      │ Best Window (EST)                              │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ US Crypto     │ 9-11 AM EST                                    │   │    │
│  │ │ EU Crypto     │ 3-5 AM EST (8-10 AM UTC)                       │   │    │
│  │ │ Asia Crypto   │ 8-10 PM EST (1-3 AM UTC+8)                     │   │    │
│  │ │ Global Mix    │ 9-11 AM EST                                    │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ TREND JACKING:                                                      │    │
│  │ - BTC +5% in 24h → Post immediately (FOMO angle)                   │    │
│  │ - BTC -5% in 24h → Post with fear/reassurance angle                │    │
│  │ - Major news → Act within 30 minutes                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "power_words_used": ["transform", "unlock", "proven"],             │    │
│  │   "weak_words_removed": ["maybe", "very"],                           │    │
│  │   "ai_detection_risk": "low",                                        │    │
│  │   "sentence_variety_score": 0.85,                                    │    │
│  │   "optimal_post_time": "Wednesday 9:00 AM EST",                      │    │
│  │   "next_phase": 10                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 15: PHASE 10 - MULTI-VERSION GENERATION
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 10: MULTI-VERSION GENERATION                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Generate and compare multiple content versions                  │
│  DURATION: 60-120 seconds                                                   │
│  SKILLS: LLM (already done in Phase 3)                                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 10.1: VERSION COMPARISON MATRIX                                       │
│  ────────────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Compare all versions against:                                       │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Criteria        │ Primary │ Version A │ Version B │ Version C │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ Hook Strength   │ 8/10    │ 7/10      │ 9/10      │ 6/10      │   │    │
│  │ │ FR Potential    │ 7.2     │ 6.5       │ 7.8       │ 5.5       │   │    │
│  │ │ Originality     │ HIGH    │ MED       │ HIGH      │ MED       │   │    │
│  │ │ Angle Match     │ ✅      │ ✅        │ ✅        │ ❌        │   │    │
│  │ │ Compliance      │ ✅      │ ✅        │ ✅        │ ✅        │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ TOTAL SCORE     │ 8.5     │ 7.8       │ 9.2       │ 6.8       │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ SELECT: Version with highest total score                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 10.2: VERSION SCORING FUNCTION                                        │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function scoreVersion(content, requirements, gapAnalysis) {         │    │
│  │   let score = 0;                                                    │    │
│  │                                                                      │    │
│  │   // Hook Strength (25 points max)                                  │    │
│  │   score += scoreHook(content.hook) * 2.5;                           │    │
│  │                                                                      │    │
│  │   // FR Potential (25 points max)                                   │    │
│  │   score += scoreFRPotential(content) * 2.5;                         │    │
│  │                                                                      │    │
│  │   // Originality (20 points max)                                    │    │
│  │   score += scoreOriginality(content) * 2.0;                         │    │
│  │                                                                      │    │
│  │   // Angle Match (15 points max)                                    │    │
│  │   score += scoreAngleMatch(content, gapAnalysis.selected_gap) * 1.5;│    │
│  │                                                                      │    │
│  │   // Compliance (15 points max)                                     │    │
│  │   score += scoreCompliance(content, requirements) * 1.5;            │    │
│  │                                                                      │    │
│  │   return score;                                                     │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 10.3: VERSION SELECTION                                               │
│  ────────────────────────────                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function selectBestVersion(primaryContent, alternatives) {          │    │
│  │   const allVersions = [                                             │    │
│  │     { name: 'primary', content: primaryContent },                   │    │
│  │     { name: 'version_A', content: alternatives.A },                 │    │
│  │     { name: 'version_B', content: alternatives.B },                 │    │
│  │     { name: 'version_C', content: alternatives.C }                  │    │
│  │   ];                                                                │    │
│  │                                                                      │    │
│  │   // Score each version                                             │    │
│  │   const scoredVersions = allVersions.map(v => ({                    │    │
│  │     ...v,                                                           │    │
│  │     score: scoreVersion(v.content, requirements, gapAnalysis)       │    │
│  │   }));                                                              │    │
│  │                                                                      │    │
│  │   // Sort by score                                                  │    │
│  │   scoredVersions.sort((a, b) => b.score - a.score);                 │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     selected: scoredVersions[0],                                    │    │
│  │     allScores: scoredVersions                                       │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "selected_version": "version_B",                                   │    │
│  │   "selected_score": 9.2,                                             │    │
│  │   "all_version_scores": {                                            │    │
│  │     "primary": 8.5,                                                  │    │
│  │     "version_A": 7.8,                                                │    │
│  │     "version_B": 9.2,                                                │    │
│  │     "version_C": 6.8                                                 │    │
│  │   },                                                                 │    │
│  │   "selection_reason": "Highest FR potential + strong hook",          │    │
│  │   "next_phase": 11                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 16: PHASE 11 - BENCHMARK COMPARISON
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 11: BENCHMARK COMPARISON                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Compare selected content against leaderboard benchmarks         │
│  DURATION: 30 seconds                                                       │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 11.1: BENCHMARK COMPARISON                                            │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ COMPARISON METRICS:                                                 │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Metric          │ Benchmark │ Our Content │ Status            │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ Hook Uniqueness │ 70%       │ 95%         │ ✅ PASS (+25%)   │   │    │
│  │ │ FR Potential    │ 5.8       │ 7.8         │ ✅ PASS (+34%)   │   │    │
│  │ │ Angle Gap Fill  │ N/A       │ "controversy" │ ✅ UNIQUE      │   │    │
│  │ │ Hashtag Usage   │ 1-2       │ 1           │ ✅ OPTIMAL       │   │    │
│  │ │ Link Strategy   │ Tweet 5+  │ Tweet 5     │ ✅ COMPLIANT     │   │    │
│  │ │ Char per Tweet  │ < 280     │ < 260       │ ✅ GOOD          │   │    │
│  │ │ CTQ Score Est.  │ 3.5       │ 4.5         │ ✅ ABOVE AVG     │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 11.2: GAP EXPLOITATION CONFIRMATION                                   │
│  ──────────────────────────────────────────                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function confirmGapExploitation(content, gapAnalysis) {             │    │
│  │   const selectedGap = gapAnalysis.selected_gap;                     │    │
│  │                                                                      │    │
│  │   // Check if content uses the gap angle                            │    │
│  │   const hasAngleKeywords = checkAngleKeywords(                      │    │
│  │     content,                                                        │    │
│  │     getAngleKeywords(selectedGap)                                   │    │
│  │   );                                                                │    │
│  │                                                                      │    │
│  │   // Check if content avoids patterns already used                  │    │
│  │   const avoidsUsedPatterns = checkAvoidsUsedPatterns(               │    │
│  │     content,                                                        │    │
│  │     gapAnalysis.found_hooks                                         │    │
│  │   );                                                                │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     gap_exploited: hasAngleKeywords && avoidsUsedPatterns,          │    │
│  │     details: {                                                      │    │
│  │       angle_used: selectedGap,                                      │    │
│  │       keywords_found: hasAngleKeywords,                             │    │
│  │       patterns_avoided: avoidsUsedPatterns                          │    │
│  │     }                                                               │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 11.3: PREDICTED ENGAGEMENT RANKING                                    │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function predictEngagementRanking(content, leaderboard) {           │    │
│  │                                                                      │    │
│  │   // Calculate predicted scores                                     │    │
│  │   const predictedScores = {                                         │    │
│  │     gate_multiplier: predictGateMultiplier(content),                │    │
│  │     quality_score: predictQualityScore(content),                    │    │
│  │     engagement_estimate: predictEngagement(content)                 │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   // Compare to leaderboard                                         │    │
│  │   const currentTop = leaderboard[0].campaign_points;                │    │
│  │   const predictedTotal = calculateTotalScore(predictedScores);      │    │
│  │                                                                      │    │
│  │   const ranking = {                                                 │    │
│  │     predicted_score: predictedTotal,                                │    │
│  │     current_top_score: currentTop,                                  │    │
│  │     rank_potential: predictedTotal > currentTop ? "TOP 1" :         │    │
│  │                     predictedTotal > currentTop * 0.9 ? "TOP 3" :   │    │
│  │                     predictedTotal > currentTop * 0.8 ? "TOP 10" :  │    │
│  │                     "BELOW TOP 10"                                  │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   return ranking;                                                   │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "benchmark_comparison": {                                          │    │
│  │     "hook_uniqueness": { "benchmark": "70%", "ours": "95%", "pass": true },│    │
│  │     "fr_potential": { "benchmark": "5.8", "ours": "7.8", "pass": true }   │    │
│  │   },                                                                 │    │
│  │   "gap_exploitation": {                                              │    │
│  │     "confirmed": true,                                               │    │
│  │     "angle_used": "controversy",                                     │    │
│  │     "patterns_avoided": true                                         │    │
│  │   },                                                                 │    │
│  │   "predicted_ranking": {                                             │    │
│  │     "predicted_score": 6.8,                                          │    │
│  │     "current_top_score": 5.29,                                       │    │
│  │     "rank_potential": "TOP 1"                                        │    │
│  │   },                                                                 │    │
│  │   "next_phase": 12                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

