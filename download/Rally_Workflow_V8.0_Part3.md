================================================================================
                    RALLY WORKFLOW V8.0 - PART 3
                    SCORING SYSTEM & POST-SUBMIT
================================================================================

================================================================================
                    SECTION 17: PHASE 12 - QUALITY SCORING
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 12: QUALITY SCORING                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Score content against Rally criteria (ENHANCED)                 │
│  DURATION: 60-120 seconds                                                   │
│  SKILLS: LLM (for score prediction)                                         │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                              │
│  V8.0 SCORING SYSTEM ENHANCEMENT                                            │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Rally Standard:        V8.0 Enhanced:                               │    │
│  │ - Gates: 0-2 each     → 0-4 each (4 aspects per gate)              │    │
│  │ - Quality: 0-5 each   → 0-8 each (8 aspects per quality)           │    │
│  │ - Master: 18/18       → 32/32                                       │    │
│  │                                                                      │    │
│  │ V8.0 also includes LLM-based score PREDICTION before submission     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                              │
│  STEP 12.1: GATE SCORING (0-4 SCALE)                                        │
│  ──────────────────────────────────                                          │
│                                                                              │
│  G1: CONTENT ALIGNMENT (0-4)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Aspect 1: Core Message Accuracy (0-1)                               │    │
│  │   - Does content accurately represent the campaign message?         │    │
│  │                                                                      │    │
│  │ Aspect 2: Terminology Precision (0-1)                               │    │
│  │   - Are project-specific terms used correctly?                      │    │
│  │                                                                      │    │
│  │ Aspect 3: Brand Voice Consistency (0-1)                             │    │
│  │   - Does content match expected brand tone?                         │    │
│  │                                                                      │    │
│  │ Aspect 4: Value Proposition Clarity (0-1)                           │    │
│  │   - Is the value proposition communicated clearly?                  │    │
│  │                                                                      │    │
│  │ G1_SCORE = Sum of 4 aspects (0-4)                                   │    │
│  │ PASS REQUIREMENT: All aspects > 0, Total ≥ 3                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  G2: INFORMATION ACCURACY (0-4)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Aspect 1: Technical Facts Verification (0-1)                        │    │
│  │   - Are technical claims factually correct?                         │    │
│  │                                                                      │    │
│  │ Aspect 2: Source Verification (0-1)                                 │    │
│  │   - Are claims supported by official sources?                       │    │
│  │                                                                      │    │
│  │ Aspect 3: No Misleading Information (0-1)                           │    │
│  │   - Is content free from misleading statements?                     │    │
│  │                                                                      │    │
│  │ Aspect 4: Completeness (0-1)                                        │    │
│  │   - Does content provide complete information?                      │    │
│  │                                                                      │    │
│  │ G2_SCORE = Sum of 4 aspects (0-4)                                   │    │
│  │ PASS REQUIREMENT: All aspects > 0, Total ≥ 3                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  G3: CAMPAIGN COMPLIANCE (0-4)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Aspect 1: Required Mentions (0-1)                                   │    │
│  │   - Are all required mentions included?                             │    │
│  │                                                                      │    │
│  │ Aspect 2: Required Hashtags (0-1)                                   │    │
│  │   - Are all required hashtags included?                             │    │
│  │                                                                      │    │
│  │ Aspect 3: Required Links (0-1)                                      │    │
│  │   - Are all required links included?                                │    │
│  │                                                                      │    │
│  │ Aspect 4: Format & Style Guidelines (0-1)                           │    │
│  │   - Does content follow format requirements?                        │    │
│  │                                                                      │    │
│  │ G3_SCORE = Sum of 4 aspects (0-4)                                   │    │
│  │ PASS REQUIREMENT: All aspects > 0, Total ≥ 3                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  G4: ORIGINALITY & AUTHENTICITY (0-4)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Aspect 1: Fresh Perspective (0-1)                                   │    │
│  │   - Does content offer a unique angle?                              │    │
│  │   - V8.0 CHECK: NOT using template hooks                            │    │
│  │                                                                      │    │
│  │ Aspect 2: Personal Insight (0-1)                                    │    │
│  │   - Does content show personal understanding?                       │    │
│  │                                                                      │    │
│  │ Aspect 3: Natural Language (0-1)                                    │    │
│  │   - Is language natural, not AI-generated sounding?                 │    │
│  │   - V8.0 CHECK: No AI detection patterns                            │    │
│  │                                                                      │    │
│  │ Aspect 4: Authentic Voice (0-1)                                     │    │
│  │   - Does content have a distinct voice?                             │    │
│  │   - V8.0 CHECK: Unique structure (not template-based)               │    │
│  │                                                                      │    │
│  │ G4_SCORE = Sum of 4 aspects (0-4)                                   │    │
│  │ PASS REQUIREMENT: All aspects > 0, Total ≥ 3                        │    │
│  │                                                                      │    │
│  │ ⚠️ V8.0 CRITICAL: Template hooks get G4 penalty!                     │    │
│  │    Template used → Aspect 1 & 4 score 0                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  GATE TOTAL CALCULATION:                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ GATE_TOTAL = G1 + G2 + G3 + G4 (0-16)                               │    │
│  │                                                                      │    │
│  │ gate_pass = min(G1, G2, G3, G4) > 0                                 │    │
│  │                                                                      │    │
│  │ IF NOT gate_pass:                                                   │    │
│  │   Content DISQUALIFIED                                              │    │
│  │   Return to Phase 13 for complete rewrite                           │    │
│  │                                                                      │    │
│  │ GATE_MULTIPLIER:                                                    │    │
│  │ g_star = (G1 + G2 + G3 + G4) / 4                                    │    │
│  │ M_gate = 1 + 0.5 × (g_star - 1)                                     │    │
│  │                                                                      │    │
│  │ // Higher gate scores = bonus multiplier                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 12.2: QUALITY SCORING (0-8 SCALE)                                     │
│  ────────────────────────────────────                                        │
│                                                                              │
│  EP: ENGAGEMENT POTENTIAL (0-8)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Aspect 1: Hook Effectiveness (0-1)                                  │    │
│  │ Aspect 2: Hook Uniqueness (0-1)        [V8.0: Template check]       │    │
│  │ Aspect 3: Tension Creation (0-1)                                    │    │
│  │ Aspect 4: Call-to-Action Quality (0-1)                              │    │
│  │ Aspect 5: Content Structure (0-1)                                   │    │
│  │ Aspect 6: Conversation Potential (0-1)                              │    │
│  │ Aspect 7: Reply Bait Strength (0-1)                                 │    │
│  │ Aspect 8: Share Worthiness (0-1)                                    │    │
│  │                                                                      │    │
│  │ EP_SCORE = Sum of 8 aspects (0-8)                                   │    │
│  │ TARGET: ≥ 6 for quality content                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  TQ: TECHNICAL QUALITY (0-8)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Aspect 1: Grammar Correctness (0-1)                                 │    │
│  │ Aspect 2: Spelling Accuracy (0-1)                                   │    │
│  │ Aspect 3: Punctuation Usage (0-1)                                   │    │
│  │ Aspect 4: Formatting Consistency (0-1)                              │    │
│  │ Aspect 5: Platform Optimization (0-1)                               │    │
│  │ Aspect 6: Character Count Compliance (0-1)                          │    │
│  │ Aspect 7: Link Strategy Adherence (0-1)                             │    │
│  │ Aspect 8: Hashtag Strategy Adherence (0-1)                          │    │
│  │                                                                      │    │
│  │ TQ_SCORE = Sum of 8 aspects (0-8)                                   │    │
│  │ TARGET: ≥ 6 for quality content                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  QUALITY TOTAL CALCULATION:                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ QUALITY_TOTAL = EP + TQ (0-16)                                      │    │
│  │ TARGET: ≥ 12 for quality content                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 12.3: MASTER SCORE CALCULATION                                        │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ MASTER_SCORE = GATE_TOTAL + QUALITY_TOTAL (0-32)                    │    │
│  │                                                                      │    │
│  │ LEVEL CLASSIFICATION:                                               │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Score Range │ Level              │ Description               │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ 28-32       │ Level 5 Maximum    │ Exceptional quality       │   │    │
│  │ │ 24-27       │ Level 4 High       │ High quality              │   │    │
│  │ │ 20-23       │ Level 3 Good       │ Good quality              │   │    │
│  │ │ 16-19       │ Level 2 Acceptable │ Acceptable quality        │   │    │
│  │ │ 0-15        │ Level 1 Needs Work │ Requires improvement      │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ V8.0 TARGET: ≥ 28 (Level 5 Maximum)                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 12.4: LLM SCORE PREDICTION (NEW)                                      │
│  ─────────────────────────────────────                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function predictScores(content, rallyCriteria) {              │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │                                                                      │    │
│  │   const prompt = `Predict Rally scores for this content:            │    │
│  │                                                                      │    │
│  │ CONTENT:                                                            │    │
│  │ Hook: "${content.hook}"                                             │    │
│  │ Thread:                                                             │    │
│  │ ${Object.entries(content.thread).map(([n, t]) =>                    │    │
│  │   `Tweet ${n}: ${t}`).join('\n')}                                   │    │
│  │                                                                      │    │
│  │ SCORING CRITERIA:                                                   │    │
│  │ G1 Content Alignment (0-4):                                         │    │
│  │   - Core message accuracy, terminology, brand voice, value prop    │    │
│  │                                                                      │    │
│  │ G2 Information Accuracy (0-4):                                      │    │
│  │   - Technical facts, source verification, no misleading info       │    │
│  │                                                                      │    │
│  │ G3 Campaign Compliance (0-4):                                       │    │
│  │   - Required mentions, hashtags, links, format guidelines          │    │
│  │                                                                      │    │
│  │ G4 Originality (0-4):                                               │    │
│  │   - Fresh perspective, personal insight, natural language          │    │
│  │   - Template hooks should score LOW                                │    │
│  │                                                                      │    │
│  │ EP Engagement Potential (0-8):                                      │    │
│  │   - Hook effectiveness, conversation potential, reply bait         │    │
│  │                                                                      │    │
│  │ TQ Technical Quality (0-8):                                         │    │
│  │   - Grammar, spelling, formatting, platform optimization           │    │
│  │                                                                      │    │
│  │ Output as JSON:                                                     │    │
│  │ {                                                                   │    │
│  │   "G1": {"score": X, "aspects": {...}, "issues": [...]},           │    │
│  │   "G2": {"score": X, "aspects": {...}, "issues": [...]},           │    │
│  │   "G3": {"score": X, "aspects": {...}, "issues": [...]},           │    │
│  │   "G4": {"score": X, "aspects": {...}, "issues": [...]},           │    │
│  │   "EP": {"score": X, "aspects": {...}, "issues": [...]},           │    │
│  │   "TQ": {"score": X, "aspects": {...}, "issues": [...]},           │    │
│  │   "master_score": X,                                                │    │
│  │   "overall_issues": [...],                                          │    │
│  │   "improvement_suggestions": [...]                                  │    │
│  │ }`;                                                                 │    │
│  │                                                                      │    │
│  │   const completion = await zai.chat.completions.create({            │    │
│  │     messages: [                                                     │    │
│  │       { role: 'assistant', content: 'You are a Rally content       │    │
│  │                scoring expert. Score content objectively based on   │    │
│  │                Rally criteria. Be strict but fair.' },             │    │
│  │       { role: 'user', content: prompt }                             │    │
│  │     ],                                                              │    │
│  │     thinking: { type: 'disabled' }                                  │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   return JSON.parse(completion.choices[0]?.message?.content);       │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "calculated_scores": {                                             │    │
│  │     "G1": 4, "G2": 4, "G3": 4, "G4": 4,                              │    │
│  │     "EP": 7, "TQ": 8                                                 │    │
│  │   },                                                                 │    │
│  │   "llm_predicted_scores": {                                          │    │
│  │     "G1": 4, "G2": 4, "G3": 4, "G4": 3.5,                            │    │
│  │     "EP": 7, "TQ": 8,                                                │    │
│  │     "master_score": 30.5,                                            │    │
│  │     "overall_issues": ["G4: Could be more unique"],                  │    │
│  │     "improvement_suggestions": ["Add more personal perspective"]     │    │
│  │   },                                                                 │    │
│  │   "gate_pass": true,                                                 │    │
│  │   "master_score": 31,                                                │    │
│  │   "level": "Level 5 Maximum",                                        │    │
│  │   "next_phase": 13                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 18: PHASE 13 - ITERATIVE REFINEMENT
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 13: ITERATIVE REFINEMENT                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Improve content based on predicted scores                       │
│  DURATION: 60-180 seconds (max 3 iterations)                                │
│  SKILLS: LLM (for optimization)                                             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 13.1: SCORE THRESHOLD CHECK                                           │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ THRESHOLDS:                                                         │    │
│  │ - Minimum Master Score: 28 (Level 5 Maximum)                        │    │
│  │ - Minimum Gate Score each: 3                                        │    │
│  │ - Minimum EP: 6                                                     │    │
│  │ - Minimum TQ: 6                                                     │    │
│  │                                                                      │    │
│  │ IF master_score >= 28 AND all_gates_pass:                           │    │
│  │   PROCEED to Phase 14                                               │    │
│  │ ELSE:                                                               │    │
│  │   BEGIN ITERATIVE REFINEMENT                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 13.2: IDENTIFY WEAK AREAS                                             │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function identifyWeakAreas(predictedScores) {                       │    │
│  │   const weakAreas = [];                                             │    │
│  │                                                                      │    │
│  │   // Check each gate                                                │    │
│  │   for (const gate of ['G1', 'G2', 'G3', 'G4']) {                    │    │
│  │     if (predictedScores[gate].score < 3) {                          │    │
│  │       weakAreas.push({                                              │    │
│  │         component: gate,                                            │    │
│  │         currentScore: predictedScores[gate].score,                  │    │
│  │         targetScore: 3,                                             │    │
│  │         issues: predictedScores[gate].issues                        │    │
│  │       });                                                           │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Check EP                                                       │    │
│  │   if (predictedScores.EP.score < 6) {                               │    │
│  │     weakAreas.push({                                                │    │
│  │       component: 'EP',                                              │    │
│  │       currentScore: predictedScores.EP.score,                       │    │
│  │       targetScore: 6,                                               │    │
│  │       issues: predictedScores.EP.issues                             │    │
│  │     });                                                             │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Check TQ                                                       │    │
│  │   if (predictedScores.TQ.score < 6) {                               │    │
│  │     weakAreas.push({                                                │    │
│  │       component: 'TQ',                                              │    │
│  │       currentScore: predictedScores.TQ.score,                       │    │
│  │       targetScore: 6,                                               │    │
│  │       issues: predictedScores.TQ.issues                             │    │
│  │     });                                                             │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return weakAreas;                                                 │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 13.3: LLM OPTIMIZATION (LLM CALL #5)                                  │
│  ─────────────────────────────────────────────                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function optimizeContent(content, weakAreas, iteration) {     │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │                                                                      │    │
│  │   const prompt = `Optimize this content to improve scores.          │    │
│  │                                                                      │    │
│  │ CURRENT CONTENT:                                                    │    │
│  │ Hook: "${content.hook}"                                             │    │
│  │ Thread:                                                             │    │
│  │ ${Object.entries(content.thread).map(([n, t]) =>                    │    │
│  │   `Tweet ${n}: ${t}`).join('\n')}                                   │    │
│  │                                                                      │    │
│  │ WEAK AREAS TO IMPROVE:                                              │    │
│  │ ${weakAreas.map(w => `                                               │    │
│  │   ${w.component}: Current ${w.currentScore}, Target ${w.targetScore}│    │
│  │   Issues: ${w.issues.join(', ')}                                    │    │
│  │ `).join('\n')}                                                      │    │
│  │                                                                      │    │
│  │ ITERATION: ${iteration}/3                                           │    │
│  │                                                                      │    │
│  │ RULES:                                                              │    │
│  │ - Maintain original angle and emotion                               │    │
│  │ - Keep same structure (7 tweets)                                    │    │
│  │ - Do NOT introduce templates                                        │    │
│  │ - Address each weak area specifically                               │    │
│  │ - Keep under 280 chars per tweet                                    │    │
│  │                                                                      │    │
│  │ Output optimized content in same format.`;                          │    │
│  │                                                                      │    │
│  │   const completion = await zai.chat.completions.create({            │    │
│  │     messages: [                                                     │    │
│  │       { role: 'assistant', content: 'You are a content optimization │    │
│  │                expert. Improve content while maintaining its core   │    │
│  │                message and uniqueness.' },                          │    │
│  │       { role: 'user', content: prompt }                             │    │
│  │     ],                                                              │    │
│  │     thinking: { type: 'disabled' }                                  │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   return parseOptimizedContent(completion.choices[0]?.message?.content); │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 13.4: REFINEMENT LOOP                                                 │
│  ──────────────────────────                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function refinementLoop(content, maxIterations = 3) {         │    │
│  │   let currentContent = content;                                     │    │
│  │   let iteration = 0;                                                │    │
│  │                                                                      │    │
│  │   while (iteration < maxIterations) {                               │    │
│  │     iteration++;                                                    │    │
│  │                                                                      │    │
│  │     // Predict scores for current content                           │    │
│  │     const predictedScores = await predictScores(currentContent);    │    │
│  │                                                                      │    │
│  │     // Check if passes threshold                                    │    │
│  │     if (predictedScores.master_score >= 28 &&                       │    │
│  │         allGatesPass(predictedScores)) {                            │    │
│  │       return {                                                      │    │
│  │         success: true,                                              │    │
│  │         content: currentContent,                                    │    │
│  │         finalScores: predictedScores,                               │    │
│  │         iterations: iteration                                       │    │
│  │       };                                                            │    │
│  │     }                                                               │    │
│  │                                                                      │    │
│  │     // Identify weak areas                                          │    │
│  │     const weakAreas = identifyWeakAreas(predictedScores);           │    │
│  │                                                                      │    │
│  │     // Optimize content                                             │    │
│  │     currentContent = await optimizeContent(                         │    │
│  │       currentContent,                                               │    │
│  │       weakAreas,                                                    │    │
│  │       iteration                                                     │    │
│  │     );                                                              │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Max iterations reached - return best attempt                   │    │
│  │   return {                                                          │    │
│  │     success: false,                                                 │    │
│  │     content: currentContent,                                        │    │
│  │     finalScores: await predictScores(currentContent),               │    │
│  │     iterations: maxIterations,                                      │    │
│  │     message: "Max iterations reached. Review content manually."     │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ function allGatesPass(scores) {                                     │    │
│  │   return ['G1', 'G2', 'G3', 'G4'].every(g => scores[g].score >= 3); │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "refinement_result": {                                             │    │
│  │     "success": true,                                                 │    │
│  │     "iterations": 2,                                                 │    │
│  │     "initial_score": 27,                                             │    │
│  │     "final_score": 30                                                │    │
│  │   },                                                                 │    │
│  │   "optimized_content": {                                             │    │
│  │     "hook": "...",                                                   │    │
│  │     "thread": {...}                                                  │    │
│  │   },                                                                 │    │
│  │   "improvements_made": [                                             │    │
│  │     "Enhanced G4 originality with unique angle",                     │    │
│  │     "Improved EP reply bait strength"                                │    │
│  │   ],                                                                 │    │
│  │   "next_phase": 14                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 19: PHASE 14-15 - PRE-SUBMIT
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 14: PRE-SUBMIT VALIDATION                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Final validation before submission                              │
│  DURATION: 30 seconds                                                       │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 14.1: FINAL CHECKLIST                                                 │
│  ──────────────────────────                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PRE-SUBMIT CHECKLIST:                                               │    │
│  │                                                                      │    │
│  │ CONTENT QUALITY:                                                    │    │
│  │ [ ] Master Score ≥ 28                                               │    │
│  │ [ ] All Gates pass (G1-G4 ≥ 3)                                      │    │
│  │ [ ] EP ≥ 6                                                          │    │
│  │ [ ] TQ ≥ 6                                                          │    │
│  │                                                                      │    │
│  │ COMPLIANCE:                                                         │    │
│  │ [ ] All required mentions included                                  │    │
│  │ [ ] All required hashtags included                                  │    │
│  │ [ ] All required links included                                     │    │
│  │ [ ] Format requirements met                                         │    │
│  │                                                                      │    │
│  │ TECHNICAL:                                                          │    │
│  │ [ ] All tweets under 280 characters                                 │    │
│  │ [ ] Link placement correct (Tweet 5+ or reply)                      │    │
│  │ [ ] Hashtag placement correct (Tweet 7, 1-2 max)                    │    │
│  │ [ ] No forbidden templates used                                     │    │
│  │                                                                      │    │
│  │ OPTIMIZATION:                                                       │    │
│  │ [ ] Gap angle exploited                                             │    │
│  │ [ ] FR strategy implemented                                         │    │
│  │ [ ] Psychological triggers applied                                  │    │
│  │ [ ] Invisible influence keywords present                            │    │
│  │                                                                      │    │
│  │ TIMING:                                                             │    │
│  │ [ ] Within campaign submission window                               │    │
│  │ [ ] Optimal posting time considered                                 │    │
│  │                                                                      │    │
│  │ IF ALL CHECKS PASS → Phase 15                                       │    │
│  │ IF ANY FAIL → Return to Phase 13                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 14.2: FINAL CONTENT ASSEMBLY                                          │
│  ────────────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function assembleFinalContent(content, requirements) {              │    │
│  │   const finalContent = {                                            │    │
│  │     thread: [],                                                     │    │
│  │     metadata: {}                                                    │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   // Assemble thread in order                                       │    │
│  │   finalContent.thread.push(content.hook);  // Tweet 1               │    │
│  │   for (let i = 2; i <= 7; i++) {                                    │    │
│  │     finalContent.thread.push(content.thread[i]);                    │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Add metadata                                                   │    │
│  │   finalContent.metadata = {                                         │    │
│  │     total_tweets: 7,                                                │    │
│  │     total_characters: calculateTotalChars(finalContent.thread),     │    │
│  │     required_elements: {                                            │    │
│  │       mentions: checkMentions(finalContent, requirements.mentions), │    │
│  │       hashtags: checkHashtags(finalContent, requirements.hashtags), │    │
│  │       links: checkLinks(finalContent, requirements.links)           │    │
│  │     },                                                              │    │
│  │     submission_timestamp: new Date().toISOString()                  │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   return finalContent;                                              │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "validation_passed": true,                                         │    │
│  │   "checklist_results": {                                             │    │
│  │     "content_quality": true,                                         │    │
│  │     "compliance": true,                                              │    │
│  │     "technical": true,                                               │    │
│  │     "optimization": true,                                            │    │
│  │     "timing": true                                                   │    │
│  │   },                                                                 │    │
│  │   "final_content_assembled": true,                                   │    │
│  │   "next_phase": 15                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 15: FINAL REVIEW                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Human-in-the-loop final approval                                │
│  DURATION: Variable (human decision)                                        │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 15.1: PRESENTATION TO USER                                            │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ DISPLAY TO USER:                                                    │    │
│  │                                                                      │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │ FINAL CONTENT PREVIEW                                               │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │                                                                      │    │
│  │ TWEET 1 (Hook):                                                     │    │
│  │ "Crypto courts: justice for the code, not the rich."                │    │
│  │ [46 chars]                                                          │    │
│  │                                                                      │    │
│  │ TWEET 2:                                                            │    │
│  │ "Traditional courts can't even read a smart contract..."            │    │
│  │ [112 chars]                                                         │    │
│  │                                                                      │    │
│  │ ... (all 7 tweets)                                                  │    │
│  │                                                                      │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │ PREDICTED SCORES                                                    │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │                                                                      │    │
│  │ Gates: G1=4/4, G2=4/4, G3=4/4, G4=4/4                               │    │
│  │ Quality: EP=7/8, TQ=8/8                                             │    │
│  │ Master Score: 31/32 (Level 5 Maximum)                               │    │
│  │                                                                      │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │ OPTIMIZATION SUMMARY                                                │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │                                                                      │    │
│  │ - Gap exploited: controversy (not used in top 10)                   │    │
│  │ - FR target: 7.0 (reply bait in Tweet 7)                            │    │
│  │ - External data sources: 15                                         │    │
│  │ - LLM generations: 5 calls                                          │    │
│  │ - Templates used: 0 (100% unique)                                   │    │
│  │                                                                      │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │                                                                      │    │
│  │ OPTIONS:                                                            │    │
│  │ [APPROVE] - Submit to Rally                                         │    │
│  │ [EDIT] - Manual modifications                                       │    │
│  │ [REGENERATE] - Create new version                                   │    │
│  │ [CANCEL] - Abort submission                                         │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 15.2: USER DECISION HANDLING                                          │
│  ────────────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ IF APPROVE:                                                         │    │
│  │   → Phase 16 (Submit)                                               │    │
│  │                                                                      │    │
│  │ IF EDIT:                                                            │    │
│  │   → Allow manual modifications                                      │    │
│  │   → Re-validate modified content                                    │    │
│  │   → Return to Phase 14                                              │    │
│  │                                                                      │    │
│  │ IF REGENERATE:                                                      │    │
│  │   → Return to Phase 3 (Generation Engine)                           │    │
│  │   → Use alternative version or regenerate                           │    │
│  │                                                                      │    │
│  │ IF CANCEL:                                                          │    │
│  │   → Phase 21 (Campaign Completion) with status: cancelled           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 20: PHASE 16-21 - POST-SUBMIT
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 16: SUBMIT                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Submit content to Rally platform                                │
│  DURATION: 30-60 seconds                                                    │
│  SKILLS: None (Rally API)                                                   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 16.1: POST TO TWITTER                                                 │
│  ──────────────────────────                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Post Tweet 1 (hook) to Twitter                                   │    │
│  │ 2. Post Tweet 2-7 as replies to previous tweet                      │    │
│  │ 3. Get Tweet URL(s) for Rally submission                            │    │
│  │ 4. If required link not in thread, post as reply                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 16.2: SUBMIT TO RALLY                                                 │
│  ──────────────────────────                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ API Endpoint: POST /campaigns/{campaign_id}/submissions             │    │
│  │                                                                      │    │
│  │ Request Body:                                                       │    │
│  │ {                                                                   │    │
│  │   "tweet_url": "https://twitter.com/user/status/xxx",               │    │
│  │   "wallet_address": "0x...",                                         │    │
│  │   "period": 1                                                        │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ Response:                                                           │    │
│  │ {                                                                   │    │
│  │   "submission_id": "sub_xxx",                                        │    │
│  │   "status": "pending_evaluation",                                    │    │
│  │   "estimated_evaluation_time": "24-48 hours"                         │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "submission_successful": true,                                     │    │
│  │   "submission_id": "sub_xxx",                                        │    │
│  │   "tweet_url": "https://twitter.com/user/status/xxx",                │    │
│  │   "status": "pending_evaluation",                                    │    │
│  │   "next_phase": 17                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 17: ENGAGEMENT TRACKING                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Monitor initial engagement metrics                              │
│  DURATION: Ongoing (first 24-48 hours)                                      │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 17.1: TRACK ENGAGEMENT                                                │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ METRICS TO TRACK:                                                   │    │
│  │                                                                      │    │
│  │ Hour 1:                                                             │    │
│  │ - Initial impressions                                               │    │
│  │ - First RTs/Likes                                                   │    │
│  │ - First replies (note follower counts)                              │    │
│  │                                                                      │    │
│  │ Hour 6:                                                             │    │
│  │ - RT/Like/Reply growth                                              │    │
│  │ - FR calculation (sum of repliers' followers)                       │    │
│  │ - Quality of replies                                                │    │
│  │                                                                      │    │
│  │ Hour 24:                                                            │    │
│  │ - Total engagement                                                  │    │
│  │ - FR final score                                                    │    │
│  │ - Campaign Points earned                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 17.2: POST-SUBMIT OPTIMIZATION (NOT SCORED)                           │
│  ────────────────────────────────────────────────────                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ACTIONS TO BOOST FR (after submission):                             │    │
│  │                                                                      │    │
│  │ 1. ENGAGE WITH REPLIES                                              │    │
│  │    - Reply to all comments (increases reply count)                  │    │
│  │    - Ask follow-up questions                                        │    │
│  │                                                                      │    │
│  │ 2. CROSS-PROMOTE                                                    │    │
│  │    - Quote tweet relevant content: "This connects to my thread..."  │    │
│  │    - Reply to related threads with value                            │    │
│  │                                                                      │    │
│  │ 3. TIMING BOOST                                                     │    │
│  │    - Engage during peak hours                                       │    │
│  │    - Respond quickly to influencer replies                          │    │
│  │                                                                      │    │
│  │ 4. COMMUNITY ENGAGEMENT                                             │    │
│  │    - Share in relevant Discord/Telegram                             │    │
│  │    - Engage with project community                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "tracking_started": true,                                          │    │
│  │   "initial_metrics": {                                               │    │
│  │     "impressions": 500,                                              │    │
│  │     "likes": 12,                                                     │    │
│  │     "retweets": 3,                                                   │    │
│  │     "replies": 5                                                     │    │
│  │   },                                                                 │    │
│  │   "next_phase": 18                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 18: REFRESH ENGAGEMENT                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Update engagement metrics in later periods                      │
│  DURATION: Performed in subsequent campaign periods                         │
│  SKILLS: None (Rally API)                                                   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 18.1: REFRESH MECHANISM                                               │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ RALLY REFRESH ENGAGEMENT SYSTEM:                                    │    │
│  │                                                                      │    │
│  │ - Quality component: FIXED from first submission                    │    │
│  │ - Engagement metrics: Can be refreshed in later periods             │    │
│  │ - Credits only POSITIVE difference from previous baseline           │    │
│  │                                                                      │    │
│  │ WHEN TO REFRESH:                                                    │    │
│  │ - Significant new engagement occurred                               │    │
│  │ - New influencer replies                                            │    │
│  │ - Viral spread after initial submission                             │    │
│  │                                                                      │    │
│  │ HOW TO REFRESH:                                                     │    │
│  │ API Endpoint: POST /submissions/{submission_id}/refresh             │    │
│  │                                                                      │    │
│  │ NOTE: Only refresh if meaningful growth, not minor changes          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "refresh_available": true,                                         │    │
│  │   "current_engagement": {                                            │    │
│  │     "RT": 8, "LK": 35, "RP": 15, "FR": 6500                          │    │
│  │   },                                                                 │    │
│  │   "previous_baseline": {                                             │    │
│  │     "RT": 5, "LK": 22, "RP": 10, "FR": 5844                          │    │
│  │   },                                                                 │    │
│  │   "potential_points_gain": 0.5,                                      │    │
│  │   "recommendation": "Refresh recommended"                            │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 19: PERFORMANCE ANALYSIS                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Analyze submission performance vs predictions                   │
│  DURATION: After Rally evaluation completes                                 │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 19.1: COMPARISON ANALYSIS                                             │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ COMPARE PREDICTED vs ACTUAL:                                        │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Metric      │ Predicted │ Actual │ Difference │ Analysis     │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ G1 Score    │ 4         │ 4      │ 0          │ Accurate     │   │    │
│  │ │ G2 Score    │ 4         │ 4      │ 0          │ Accurate     │   │    │
│  │ │ G3 Score    │ 4         │ 4      │ 0          │ Accurate     │   │    │
│  │ │ G4 Score    │ 3.5       │ 4      │ +0.5       │ Exceeded     │   │    │
│  │ │ EP Score    │ 7         │ 7      │ 0          │ Accurate     │   │    │
│  │ │ TQ Score    │ 8         │ 8      │ 0          │ Accurate     │   │    │
│  │ │ Master      │ 30.5      │ 31     │ +0.5       │ Exceeded     │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ Campaign CP │ 6.8       │ 7.2    │ +0.4       │ Exceeded     │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ ANALYSIS:                                                           │    │
│  │ - Prediction accuracy: 95%+                                         │    │
│  │ - Areas exceeded: G4 (originality better than expected)             │    │
│  │ - Areas underperformed: None                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 19.2: ENGAGEMENT ANALYSIS                                             │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ENGAGEMENT PERFORMANCE:                                             │    │
│  │                                                                      │    │
│  │ ┌───────────────────────────────────────────────────────────────┐   │    │
│  │ │ Metric       │ Benchmark │ Actual │ vs Benchmark │ Rating    │   │    │
│  │ │─────────────────────────────────────────────────────────────│   │    │
│  │ │ Retweets     │ 5         │ 8      │ +60%         │ Excellent │   │    │
│  │ │ Likes        │ 20        │ 35     │ +75%         │ Excellent │   │    │
│  │ │ Replies      │ 10        │ 15     │ +50%         │ Very Good │   │    │
│  │ │ FR           │ 5.8       │ 7.2    │ +24%         │ Excellent │   │    │
│  │ │ Reply Quality│ 4.0       │ 4.5    │ +12.5%       │ Very Good │   │    │
│  │ └───────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │ KEY INSIGHTS:                                                       │    │
│  │ - Controversy angle drove higher than average replies              │    │
│  │ - Reply bait in CTA worked well                                     │    │
│  │ - FR exceeded target due to influencer engagement                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "analysis_complete": true,                                         │    │
│  │   "prediction_accuracy": 0.95,                                       │    │
│  │   "performance_rating": "excellent",                                 │    │
│  │   "key_insights": [                                                  │    │
│  │     "Controversy angle drove 50% more replies than benchmark",       │    │
│  │     "FR target exceeded by 24%",                                     │    │
│  │     "G4 originality higher than predicted"                           │    │
│  │   ],                                                                 │    │
│  │   "next_phase": 20                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 20: LEARNING INTEGRATION                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Learn from this campaign for future improvements                │
│  DURATION: 30 minutes                                                       │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 20.1: SUCCESS FACTORS EXTRACTION                                      │
│  ──────────────────────────────────────────                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ FACTORS THAT WORKED:                                                │    │
│  │                                                                      │    │
│  │ 1. External Data Integration                                        │    │
│  │    - 15 sources provided rich factual content                       │    │
│  │    - Legal/regulation trend provided strong controversy hook        │    │
│  │                                                                      │    │
│  │ 2. Gap Exploitation                                                 │    │
│  │    - "Controversy" angle was unused in top 10                       │    │
│  │    - Resulted in higher G4 score                                    │    │
│  │                                                                      │    │
│  │ 3. LLM Generation (No Templates)                                    │    │
│  │    - Unique structure avoided AI detection                          │    │
│  │    - Natural language improved engagement                           │    │
│  │                                                                      │    │
│  │ 4. FR Strategy Integration                                          │    │
│  │    - Reply bait in CTA drove 15 replies                             │    │
│  │    - Target accounts engaged (evidenced by FR score)                │    │
│  │                                                                      │    │
│  │ 5. Market Context                                                   │    │
│  │    - Neutral market allowed focus on topic                          │    │
│  │    - Would adjust for volatile market conditions                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 20.2: IMPROVEMENT OPPORTUNITIES                                       │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ AREAS TO IMPROVE FOR NEXT CAMPAIGN:                                 │    │
│  │                                                                      │    │
│  │ 1. Timing                                                           │    │
│  │    - Posted at sub-optimal time                                     │    │
│  │    - Could have gained 10-20% more engagement at peak               │    │
│  │                                                                      │    │
│  │ 2. Link Strategy                                                    │    │
│  │    - Link in Tweet 5 may have reduced engagement                    │    │
│  │    - Consider reply-based link for non-Premium accounts             │    │
│  │                                                                      │    │
│  │ 3. Multi-Version Selection                                          │    │
│  │    - Version B might have performed better                          │    │
│  │    - Consider A/B testing in future                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 20.3: KNOWLEDGE BASE UPDATE                                           │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ UPDATE GLOBAL KNOWLEDGE BASE:                                       │    │
│  │                                                                      │    │
│  │ 1. Successful Patterns                                              │    │
│  │    - Add "controversy" as high-performer for legal topics           │    │
│  │    - Record this hook structure as reference                        │    │
│  │                                                                      │    │
│  │ 2. FR Benchmarks                                                    │    │
│  │    - Update FR benchmark for this campaign type                     │    │
│  │    - Record target accounts that engaged                            │    │
│  │                                                                      │    │
│  │ 3. LLM Prompts                                                      │    │
│  │    - Save successful prompt templates                               │    │
│  │    - Note any prompt adjustments that improved output               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "learning_integrated": true,                                       │    │
│  │   "success_factors_recorded": 5,                                     │    │
│  │   "improvement_opportunities": 3,                                    │    │
│  │   "knowledge_base_updated": true,                                    │    │
│  │   "next_phase": 21                                                   │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 21: CAMPAIGN COMPLETION                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Finalize workflow and generate report                           │
│  DURATION: 30 seconds                                                       │
│  SKILLS: XLSX, DOCX, PDF (for reporting)                                    │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 21.1: FINAL SUMMARY                                                   │
│  ──────────────────────────                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │ WORKFLOW V8.0 COMPLETION REPORT                                     │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  │                                                                      │    │
│  │ Campaign: Internet Court                                            │    │
│  │ Status: COMPLETED                                                    │    │
│  │                                                                      │    │
│  │ PERFORMANCE:                                                        │    │
│  │ - Master Score: 31/32 (Level 5 Maximum)                             │    │
│  │ - Campaign Points: 7.2 (Top 1 predicted)                             │    │
│  │ - Engagement vs Benchmark: +60%                                     │    │
│  │                                                                      │    │
│  │ V8.0 FEATURES USED:                                                 │    │
│  │ - External Data Collection: 15 sources                              │    │
│  │ - LLM Generation: 5 calls                                           │    │
│  │ - Templates Used: 0 (100% unique)                                   │    │
│  │ - FR Strategy: Integrated                                           │    │
│  │ - Market Context: Analyzed                                          │    │
│  │                                                                      │    │
│  │ SKILL INTEGRATION:                                                  │    │
│  │ - WEB-SEARCH: 3 queries, 15 results                                 │    │
│  │ - WEB-READER: 6 deep extractions                                    │    │
│  │ - FINANCE: Market context fetched                                   │    │
│  │ - LLM: 5 generation calls                                           │    │
│  │                                                                      │    │
│  │ TIME METRICS:                                                       │    │
│  │ - Total Workflow Duration: 8 minutes                                │    │
│  │ - External Data Collection: 2 minutes                               │    │
│  │ - Content Generation: 3 minutes                                     │    │
│  │ - Refinement Iterations: 2                                          │    │
│  │                                                                      │    │
│  │ ════════════════════════════════════════════════════════════════    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 21.2: REPORT GENERATION                                               │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Generate comprehensive report in multiple formats:                  │    │
│  │                                                                      │    │
│  │ 1. PDF Report                                                       │    │
│  │    - Full workflow execution log                                    │    │
│  │    - Content preview                                                │    │
│  │    - Score analysis                                                 │    │
│  │    - Performance metrics                                            │    │
│  │                                                                      │    │
│  │ 2. XLSX Spreadsheet                                                │    │
│  │    - Score breakdown                                                │    │
│  │    - Engagement metrics                                             │    │
│  │    - Comparison with benchmarks                                     │    │
│  │                                                                      │    │
│  │ 3. JSON Data Export                                                │    │
│  │    - All workflow state data                                        │    │
│  │    - All generated content                                          │    │
│  │    - All metrics and scores                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "workflow_completed": true,                                        │    │
│  │   "completion_time": "2025-01-15T10:30:00Z",                         │    │
│  │   "final_status": "SUCCESS",                                         │    │
│  │   "reports_generated": [                                             │    │
│  │     "Rally_V8.0_Campaign_Report.pdf",                                │    │
│  │     "Rally_V8.0_Metrics.xlsx",                                       │    │
│  │     "Rally_V8.0_Data.json"                                           │    │
│  │   ]                                                                  │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

