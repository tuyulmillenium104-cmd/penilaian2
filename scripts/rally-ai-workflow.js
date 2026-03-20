/**
 * RALLY AI WORKFLOW - AI-FRIENDLY CONTENT GENERATOR
 * 
 * This script is designed for AI chat interaction.
 * Accepts a hook/topic as input and runs the complete content generation workflow.
 * 
 * Usage:
 *   node rally-ai-workflow.js "Your hook here"
 * 
 * Or import and use:
 *   const { generateRallyContent } = require('./rally-ai-workflow');
 *   const result = await generateRallyContent({ hook: "Your hook" });
 */

const ZAI = require('z-ai-web-dev-sdk').default;

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  campaignName: 'Internet Court',
  campaignGoal: 'Spread awareness about Internet Court - a decentralized dispute resolution system powered by AI validators on GenLayer. Deliver justice at machine speed for the internet economy.',
  baseUrl: 'internetcourt.org',
  maxContentLength: 280, // Per tweet
  minHookScore: 7,
  minEmotionScore: 8,
  minCTScore: 8,
  minOverallScore: 9
};

// ============================================================================
// STANDARDS (from V8.7.6)
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
  aiPatterns: [
    'in this thread',
    "here's what you need to know",
    'let me break it down',
    'the bottom line is',
    'what does this mean for you',
    'key takeaways',
    'in summary'
  ],
  templateHooks: [
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
  ]
};

const EMOTION_LIBRARY = {
  fear: {
    triggers: ['risk', 'danger', 'threat', 'warning', 'scary', 'terrifying', 'afraid', 'worried', 'nightmare', 'what if', 'could lose', 'at stake', 'crisis', 'wrong', 'fail', 'lost', 'drained', 'bug', 'execute', 'final', 'lose everything'],
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
    triggers: ['lost', 'failed', 'broke', 'destroyed', 'killed', 'wasted', 'missed', 'regret', 'hurt', 'pain', 'lost everything', 'too late', 'gone', 'crisis', 'broke', 'slow', 'borders'],
    intensifiers: ['completely', 'totally', 'utterly', 'absolutely', 'brutally', 'devastatingly'],
    bodyFeelings: ['stomach dropped', 'heart sank', 'chest tightened', 'sick feeling', "couldn't sleep"]
  }
};

const HOOK_STANDARDS = {
  weakOpenings: [
    'the ', 'a ', 'an ', 'this is', 'there are', 'there is', 'i think',
    'it is', 'in the', 'today ', 'so ', 'well ', 'basically',
    'honestly ', 'actually ', 'first ', 'let me', 'here is', 'here are'
  ],
  powerPatterns: [
    /^\$\d+/i,
    /^\d+/i,
    /\d+%/i,
    /^(what|who|why|how|when|where|which)/i,
    /^(imagine|picture|consider|think)/i,
    /^(code|justice|courts|your|ai|smart)/i,
    /^(no|wrong|false|never|stop|don't|never)/i,
    /^i (lost|failed|got|spent|wasted|built)/i,
    /^(warning|alert|urgent|breaking|stop|wait)/i
  ]
};

const CT_STANDARDS = {
  requiredElements: [
    { type: 'question', patterns: ['?'], minCount: 1, points: 2, description: 'At least 1 question' },
    { type: 'replyBait', patterns: ['what do you think', 'thoughts?', 'who else', 'agree?', 'thoughts on', 'drop your', 'what would you'], minCount: 1, points: 2, description: 'Reply-triggering phrase' },
    { type: 'engagementHook', patterns: ['have you ever', 'what if', 'imagine if', 'would you', 'could you', 'who decides', 'ever wondered'], minCount: 1, points: 2, description: 'Engagement hook phrase' },
    { type: 'personal', patterns: ['i ', 'my ', 'me ', 'we ', 'our '], minCount: 1, points: 1, description: 'Personal element' },
    { type: 'fomo', patterns: ['now', 'today', 'finally', 'before', 'last chance', 'soon'], minCount: 1, points: 1, description: 'Urgency element' },
    { type: 'controversy', patterns: ['wrong', 'problem', 'fail', 'nobody', 'most people', 'contrary', 'actually', 'truth is'], minCount: 1, points: 1, description: 'Controversial element' },
    { type: 'shareWorthy', patterns: ['this is why', "here's what", 'the truth', 'what most', 'what happens'], minCount: 1, points: 1, description: 'Share-worthy element' }
  ],
  minPassingScore: 8
};

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
  
  for (const pattern of BANNED_ITEMS.aiPatterns) {
    if (lowerContent.includes(pattern)) {
      violations.push({ type: 'AI_PATTERN', item: pattern, severity: 'high' });
    }
  }
  
  const first50 = lowerContent.substring(0, 50);
  for (const marker of BANNED_ITEMS.templateHooks) {
    if (first50.includes(marker)) {
      violations.push({ type: 'TEMPLATE_HOOK', item: marker, severity: 'critical' });
    }
  }
  
  return violations;
}

function calculateHookScore(content) {
  const firstTweet = content.split('\n\n')[0] || content;
  const firstSentence = firstTweet.split(/[.!?]+/)[0] || firstTweet;
  const lowerSentence = firstSentence.toLowerCase();
  const words = firstSentence.trim().split(/\s+/).slice(0, 3);
  const first3Words = words.join(' ').toLowerCase();
  
  let score = 0;
  const breakdown = {
    first3Words,
    hasStrongOpening: false,
    avoidsWeakOpening: false,
    hasHookElements: [],
    issues: []
  };
  
  // Check 1: Avoid weak opening (3 points)
  const hasWeakOpening = HOOK_STANDARDS.weakOpenings.some(weak => 
    lowerSentence.startsWith(weak) || first3Words.startsWith(weak)
  );
  
  if (!hasWeakOpening) {
    score += 3;
    breakdown.avoidsWeakOpening = true;
  } else {
    breakdown.issues.push(`Weak opening: "${first3Words}..."`);
  }
  
  // Check 2: Has power pattern (3 points)
  const hasPowerPattern = HOOK_STANDARDS.powerPatterns.some(pattern => 
    pattern.test(firstSentence)
  );
  
  if (hasPowerPattern) {
    score += 3;
    breakdown.hasStrongOpening = true;
  } else {
    breakdown.issues.push('No power hook pattern');
  }
  
  // Check 3: Hook elements (4 points)
  const elements = {
    curiosity: ['what if', 'why', 'how', 'secret', 'hidden', 'mystery'],
    tension: ['but', 'however', 'wrong', 'problem', 'crisis', 'fail'],
    surprise: ['unexpected', 'finally', 'breakthrough', 'shocking'],
    relevance: ['you', 'your', 'today', 'now']
  };
  
  for (const [element, triggers] of Object.entries(elements)) {
    if (triggers.some(t => lowerSentence.includes(t))) {
      score += 1;
      breakdown.hasHookElements.push(element);
    }
  }
  
  return {
    score: Math.min(10, score),
    breakdown,
    passed: score >= 7,
    firstSentence: firstSentence.trim()
  };
}

function calculateEmotionScore(content) {
  const lowerContent = content.toLowerCase();
  let score = 0;
  const emotionTypes = [];
  let hasBodyFeeling = false;
  
  for (const [emotion, data] of Object.entries(EMOTION_LIBRARY)) {
    const hasTrigger = data.triggers.some(t => lowerContent.includes(t.toLowerCase()));
    const hasBody = data.bodyFeelings.some(f => lowerContent.includes(f.toLowerCase()));
    
    if (hasTrigger || hasBody) {
      emotionTypes.push(emotion);
      if (hasTrigger) score += 2;
      if (hasBody) {
        score += 3;
        hasBodyFeeling = true;
      }
    }
  }
  
  // Check intensifiers
  const highIntensity = ['devastatingly', 'completely', 'totally', 'absolutely', 'brutally', 'seriously', 'genuinely'];
  for (const word of highIntensity) {
    if (lowerContent.includes(word)) score += 1;
  }
  
  // Bonus for multiple emotion types
  if (emotionTypes.length >= 3) score += 2;
  if (emotionTypes.length >= 5) score += 1;
  
  return {
    score: Math.min(10, score),
    emotionTypes,
    hasBodyFeeling,
    passed: Math.min(10, score) >= 8
  };
}

function calculateCTScore(content) {
  const lowerContent = content.toLowerCase();
  let score = 0;
  const breakdown = {};
  
  for (const element of CT_STANDARDS.requiredElements) {
    const found = element.patterns.some(p => lowerContent.includes(p));
    breakdown[element.type] = { found, points: found ? element.points : 0 };
    if (found) score += element.points;
  }
  
  return {
    score: Math.min(10, score),
    breakdown,
    passed: Math.min(10, score) >= CT_STANDARDS.minPassingScore
  };
}

function calculateViralScore(content) {
  const lowerContent = content.toLowerCase();
  let score = 0;
  const elements = [];
  
  if (/wrong|problem|issue|fail|but|however/i.test(content)) { score++; elements.push('controversial'); }
  if (/\?|what|how|why|when|who|thoughts/i.test(content)) { score++; elements.push('reply_bait'); }
  if (/i |my |me |we |our /i.test(content)) { score++; elements.push('personal'); }
  if (/\d+/.test(content)) { score++; elements.push('data'); }
  if (/now|today|finally|before|last/i.test(content)) { score++; elements.push('fomo'); }
  if (/will|future|next|coming|agent|ai/i.test(content)) { score++; elements.push('future'); }
  if (/but|however|while|unlike|vs/i.test(content)) { score++; elements.push('contrast'); }
  
  const hasEmotion = Object.values(EMOTION_LIBRARY).some(e => 
    e.triggers.some(t => lowerContent.includes(t))
  );
  if (hasEmotion) { score++; elements.push('emotional'); }
  
  return { score, elements, passed: score >= 6 };
}

function calculateGateScores(content) {
  const lowerContent = content.toLowerCase();
  
  // Gate Utama (G1-G4) - Scale 0-5
  const G1_ContentAlignment = {
    name: 'Content Alignment',
    score: Math.min(5, (
      (lowerContent.includes('internet court') || lowerContent.includes('internetcourt') ? 1.5 : 0.5) +
      (lowerContent.includes('court') || lowerContent.includes('dispute') ? 1.25 : 0.5) +
      (lowerContent.includes('internetcourt.org') ? 1.25 : 0.5) +
      (lowerContent.includes('you') || lowerContent.includes('your') ? 1.0 : 0.5)
    )),
    passed: false
  };
  G1_ContentAlignment.passed = G1_ContentAlignment.score >= 4;
  
  const G2_InformationAccuracy = {
    name: 'Information Accuracy',
    score: Math.min(5, (
      (lowerContent.includes('verdict') || lowerContent.includes('true') || lowerContent.includes('false') ? 1.5 : 0.5) +
      (lowerContent.includes('internetcourt.org') || lowerContent.includes('genlayer') ? 1.25 : 0.5) +
      (/\d+/.test(content) ? 1.25 : 0.5) +
      (lowerContent.includes('court') || lowerContent.includes('dispute') ? 1.0 : 0.5)
    )),
    passed: false
  };
  G2_InformationAccuracy.passed = G2_InformationAccuracy.score >= 4;
  
  const G3_CampaignCompliance = {
    name: 'Campaign Compliance',
    score: Math.min(5, (
      (lowerContent.includes('internetcourt.org') ? 1.5 : 0.3) +
      (content.split('\n\n').every(t => t.length <= 280) ? 1.25 : 0.5) +
      (scanBannedItems(content).filter(v => v.severity === 'critical').length === 0 ? 1.25 : 0.5) +
      1.0
    )),
    passed: false
  };
  G3_CampaignCompliance.passed = G3_CampaignCompliance.score >= 4;
  
  const G4_Originality = {
    name: 'Originality & Authenticity',
    score: Math.min(5, (
      (scanBannedItems(content).filter(v => v.type === 'TEMPLATE_HOOK').length === 0 ? 1.5 : 0.5) +
      (/i |my |me /i.test(content) ? 1.25 : 0.5) +
      (scanBannedItems(content).filter(v => v.type === 'AI_PATTERN').length === 0 ? 1.25 : 0.5) +
      (calculateEmotionScore(content).score >= 5 ? 1.0 : 0.5)
    )),
    passed: false
  };
  G4_Originality.passed = G4_Originality.score >= 4;
  
  // Gate Tambahan (G5-G6) - Scale 0-8
  const hookResult = calculateHookScore(content);
  const ctResult = calculateCTScore(content);
  
  const G5_EngagementPotential = {
    name: 'Engagement Potential',
    score: Math.min(8, (
      Math.min(2, hookResult.score / 5) +
      (content.includes('?') ? 2 : 0) +
      (content.split('\n\n').length >= 2 ? 2 : 1) +
      Math.min(2, (content.match(/what|how|why|who|when/gi) || []).length * 0.5)
    )),
    passed: false
  };
  G5_EngagementPotential.passed = G5_EngagementPotential.score >= 8;
  
  const G6_TechnicalQuality = {
    name: 'Technical Quality',
    score: Math.min(8, (
      (scanBannedItems(content).length === 0 ? 2 : Math.max(0, 2 - scanBannedItems(content).length * 0.2)) +
      (content.split('\n\n').every(t => t.length <= 280) ? 2 : 1) +
      ([2, 3, 4, 5].includes(content.split('\n\n').length) ? 2 : 1) +
      2
    )),
    passed: false
  };
  G6_TechnicalQuality.passed = G6_TechnicalQuality.score >= 8;
  
  return {
    G1: G1_ContentAlignment,
    G2: G2_InformationAccuracy,
    G3: G3_CampaignCompliance,
    G4: G4_Originality,
    G5: G5_EngagementPotential,
    G6: G6_TechnicalQuality
  };
}

function calculateOverallScore(gates, internal) {
  const gateAvg = Object.values(gates).reduce((sum, g) => sum + g.score, 0) / Object.keys(gates).length;
  const internalAvg = Object.values(internal).reduce((sum, i) => sum + i.score, 0) / Object.keys(internal).length;
  
  const overall = (gateAvg / 8 * 4) + (internalAvg / 10 * 6);
  
  return {
    score: Math.round(overall * 10) / 10,
    gateAverage: Math.round(gateAvg * 10) / 10,
    internalAverage: Math.round(internalAvg * 10) / 10
  };
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

async function callLLMWithRetry(systemPrompt, userPrompt, options = {}, maxRetries = 3) {
  const zai = await ZAI.create();
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature || 0.8,
        max_tokens: options.maxTokens || 1000
      });
      
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      lastError = error;
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        const delay = Math.min(5000 * attempt, 30000); // Exponential backoff, max 30s
        console.log(`⏳ Rate limited, waiting ${delay/1000}s before retry ${attempt}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

async function generateContent(hook, campaignData = {}) {
  const systemPrompt = `You are an expert crypto/web3 content creator for Rally.fun campaigns.

CAMPAIGN: ${campaignData.name || CONFIG.campaignName}
GOAL: ${campaignData.goal || CONFIG.campaignGoal}
WEBSITE: ${campaignData.baseUrl || CONFIG.baseUrl}

STRICT RULES:
1. Start with the EXACT hook provided - do not modify it
2. Create a thread of 2-4 tweets (each under 280 chars, separated by blank lines)
3. Include strong emotions: fear, curiosity, surprise, hope
4. Include body feelings (e.g., "stomach dropped", "heart racing")
5. End with an engaging question or call-to-action
6. Include internetcourt.org URL naturally
7. AVOID ALL banned words and AI patterns
8. NO template hooks or cliches

BANNED WORDS: ${BANNED_ITEMS.words.slice(0, 10).join(', ')}...
BANNED PHRASES: ${BANNED_ITEMS.phrases.slice(0, 5).join(', ')}...
AI PATTERNS TO AVOID: ${BANNED_ITEMS.aiPatterns.join(', ')}

Return ONLY the content, no explanations.`;

  const userPrompt = `Create Rally content with this hook:

"${hook}"

Requirements:
- Use the exact hook as the first sentence
- Add 1-3 more tweets with emotional progression
- Include specific data or examples
- End with an engaging question
- Natural, conversational tone
- No AI-sounding phrases`;

  return await callLLMWithRetry(systemPrompt, userPrompt, { temperature: 0.8, maxTokens: 1000 });
}

async function enhanceContent(content, issues = []) {
  const systemPrompt = `You are an expert content editor. Enhance the content while preserving its core message.

ENHANCEMENT FOCUS:
${issues.length > 0 ? `Fix these issues: ${issues.join(', ')}` : 'Improve emotional impact and engagement'}

STRICT RULES:
- Do NOT change the hook (first sentence)
- Add more emotional triggers if needed
- Strengthen the call-to-action
- Ensure natural, human tone
- Keep each tweet under 280 characters
- AVOID banned words and AI patterns

Return ONLY the enhanced content.`;

  return await callLLMWithRetry(systemPrompt, `Enhance this content:\n\n${content}`, { temperature: 0.7, maxTokens: 1000 });
}

// ============================================================================
// SCORE CARD FORMATTING
// ============================================================================

function formatScoreCard(scoreCard) {
  const lines = [];
  
  lines.push('╔════════════════════════════════════════════════════════════════════════╗');
  lines.push('║                    FINAL CONTENT SCORE CARD                            ║');
  lines.push('║                   "Quality 200% Above Rally Standards"                 ║');
  lines.push('╠════════════════════════════════════════════════════════════════════════╣');
  
  // Gate Utama
  lines.push('║                                                                        ║');
  lines.push('║  🚦 GATE UTAMA RALLY (Min: 4/5 each)                                   ║');
  lines.push('║  ───────────────────────────────────────────────────────────────────── ║');
  
  for (const [key, gate] of Object.entries(scoreCard.gates)) {
    if (['G1', 'G2', 'G3', 'G4'].includes(key)) {
      const status = gate.passed ? '✅ PASS' : '❌ FAIL';
      lines.push(`║  │ ${(gate.name + ':').padEnd(28)} ${String(gate.score).padEnd(4)}/5   │ ${status.padEnd(8)}        │ ║`);
    }
  }
  
  // Gate Tambahan
  lines.push('║                                                                        ║');
  lines.push('║  🎯 GATE TAMBAHAN (Min: 8/8 each)                                      ║');
  lines.push('║  ───────────────────────────────────────────────────────────────────── ║');
  
  for (const [key, gate] of Object.entries(scoreCard.gates)) {
    if (['G5', 'G6'].includes(key)) {
      const status = gate.passed ? '✅ PASS' : '❌ FAIL';
      lines.push(`║  │ ${(gate.name + ':').padEnd(28)} ${String(gate.score).padEnd(4)}/8   │ ${status.padEnd(8)}        │ ║`);
    }
  }
  
  // Internal Scores
  lines.push('║                                                                        ║');
  lines.push('║  📊 PENILAIAN INTERNAL (Min: 9/10 each)                                ║');
  lines.push('║  ───────────────────────────────────────────────────────────────────── ║');
  
  for (const [key, metric] of Object.entries(scoreCard.internal)) {
    if (key !== 'overall') {
      const status = metric.passed ? '✅ PASS' : '❌ FAIL';
      lines.push(`║  │ ${(metric.name + ':').padEnd(28)} ${String(metric.score).padEnd(4)}/10  │ ${status.padEnd(8)}        │ ║`);
    }
  }
  
  lines.push('║  ├────────────────────────────────────────────────────────────────────┤ ║');
  
  const overallStatus = scoreCard.internal.overall?.passed ? '✅ PASS' : '❌ FAIL';
  lines.push(`║  │ OVERALL SCORE:                      ${String(scoreCard.overall?.score || 0).padEnd(4)}/10  │ ${overallStatus.padEnd(8)}        │ ║`);
  
  // Emotion Types
  lines.push('║                                                                        ║');
  lines.push('║  😱 EMOTION TYPES DETECTED                                             ║');
  lines.push('║  ───────────────────────────────────────────────────────────────────── ║');
  
  const emotionList = scoreCard.emotionTypes?.join(', ') || 'None';
  lines.push(`║  │ Types: ${emotionList.padEnd(54)}│ ║`);
  lines.push(`║  │ Body Feelings: ${scoreCard.hasBodyFeeling ? 'Yes' : 'No'}`);
  lines.push('║                                                                        ║');
  
  // Summary
  lines.push('║  📈 SUMMARY                                                            ║');
  lines.push('║  ───────────────────────────────────────────────────────────────────── ║');
  
  const gatesPassed = Object.values(scoreCard.gates).filter(g => g.passed).length;
  const internalPassed = Object.values(scoreCard.internal).filter(i => i.passed).length;
  
  lines.push(`║  │ Gate Utama + Tambahan:  ${gatesPassed}/6 PASS`);
  lines.push(`║  │ Penilaian Internal:     ${internalPassed}/6 PASS`);
  lines.push('║  ├────────────────────────────────────────────────────────────────────┤ ║');
  
  const finalStatus = scoreCard.passed ? '✅ YES' : '❌ NO';
  lines.push(`║  │ READY FOR SUBMISSION:   ${finalStatus}`);
  lines.push('║                                                                        ║');
  lines.push('╚════════════════════════════════════════════════════════════════════════╝');
  
  if (scoreCard.issues?.length > 0) {
    lines.push('');
    lines.push('⚠️ ISSUES TO FIX:');
    for (const issue of scoreCard.issues) {
      lines.push(`   • ${issue}`);
    }
  }
  
  return lines.join('\n');
}

// ============================================================================
// MAIN WORKFLOW
// ============================================================================

async function generateRallyContent(options = {}) {
  const { hook, campaignData = {}, maxRegenerations = 3 } = options;
  
  if (!hook) {
    throw new Error('Hook is required');
  }
  
  console.log('═'.repeat(80));
  console.log('RALLY AI WORKFLOW - STARTING');
  console.log('═'.repeat(80));
  console.log(`Hook: "${hook}"`);
  console.log(`Max Regenerations: ${maxRegenerations}`);
  console.log('═'.repeat(80));
  
  let content = '';
  let regenerationCount = 0;
  let scoreCard = null;
  let passed = false;
  
  while (!passed && regenerationCount <= maxRegenerations) {
    regenerationCount++;
    
    console.log(`\n🔄 Iteration ${regenerationCount}/${maxRegenerations + 1}`);
    
    // Phase 1: Generate content
    console.log('📝 Phase 1: Generating content...');
    if (regenerationCount === 1) {
      content = await generateContent(hook, campaignData);
    } else {
      const issues = [];
      if (scoreCard) {
        if (!scoreCard.internal.hookScore?.passed) issues.push('weak hook');
        if (!scoreCard.internal.emotionScore?.passed) issues.push('low emotion');
        if (!scoreCard.internal.ctScore?.passed) issues.push('weak CT');
      }
      content = await enhanceContent(content, issues);
    }
    
    console.log('\n📄 Generated Content:');
    console.log('-'.repeat(40));
    console.log(content);
    console.log('-'.repeat(40));
    
    // Phase 2: Score content
    console.log('\n📊 Phase 2: Scoring content...');
    
    const hookResult = calculateHookScore(content);
    const emotionResult = calculateEmotionScore(content);
    const ctResult = calculateCTScore(content);
    const viralResult = calculateViralScore(content);
    const gates = calculateGateScores(content);
    
    const internal = {
      hookScore: { name: 'Hook Score', score: hookResult.score, passed: hookResult.passed },
      emotionScore: { name: 'Emotion Score', score: emotionResult.score, passed: emotionResult.passed },
      ctScore: { name: 'CT Score', score: ctResult.score, passed: ctResult.passed },
      uniquenessScore: { name: 'Uniqueness', score: 10 - scanBannedItems(content).length * 0.5, passed: scanBannedItems(content).length < 3 },
      readabilityScore: { name: 'Readability', score: Math.min(10, 8 + content.split('\n\n').length * 0.5), passed: true },
      viralPotential: { name: 'Viral Potential', score: viralResult.score, passed: viralResult.passed }
    };
    
    const overall = calculateOverallScore(gates, internal);
    internal.overall = { name: 'Overall', score: overall.score, passed: overall.score >= 9 };
    
    scoreCard = {
      gates,
      internal,
      overall,
      emotionTypes: emotionResult.emotionTypes,
      hasBodyFeeling: emotionResult.hasBodyFeeling,
      passed: false,
      issues: []
    };
    
    // Check all passes
    const allGatesPassed = Object.values(gates).every(g => g.passed);
    const allInternalPassed = Object.values(internal).every(i => i.passed);
    const enoughEmotions = emotionResult.emotionTypes.length >= 3;
    
    scoreCard.passed = allGatesPassed && allInternalPassed && enoughEmotions;
    
    // Collect issues
    for (const [key, gate] of Object.entries(gates)) {
      if (!gate.passed) {
        scoreCard.issues.push(`${gate.name}: ${gate.score}/${key.startsWith('G5') || key.startsWith('G6') ? '8' : '5'}`);
      }
    }
    for (const [key, metric] of Object.entries(internal)) {
      if (!metric.passed && key !== 'overall') {
        scoreCard.issues.push(`${metric.name}: ${metric.score}/10`);
      }
    }
    if (!enoughEmotions) {
      scoreCard.issues.push(`Emotion Types: ${emotionResult.emotionTypes.length}/3 min`);
    }
    
    passed = scoreCard.passed;
    
    if (!passed) {
      console.log('❌ Content did not pass all checks');
      console.log(`   Issues: ${scoreCard.issues.join(', ')}`);
    } else {
      console.log('✅ Content passed all checks!');
    }
  }
  
  // Display final score card
  console.log('\n' + formatScoreCard(scoreCard));
  
  return {
    success: true,
    content,
    scoreCard,
    regenerationCount,
    hook: hookResult,
    emotion: emotionResult,
    ct: ctResult,
    viral: viralResult
  };
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  const hook = process.argv[2];
  
  if (!hook) {
    console.error('Usage: node rally-ai-workflow.js "Your hook here"');
    console.error('Example: node rally-ai-workflow.js "Code Runs, Disputes Don\'t. Enter Internet Court"');
    process.exit(1);
  }
  
  try {
    const result = await generateRallyContent({ hook });
    
    console.log('\n' + '═'.repeat(80));
    console.log('FINAL CONTENT');
    console.log('═'.repeat(80));
    console.log(result.content);
    console.log('═'.repeat(80));
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export for module usage
module.exports = { generateRallyContent, calculateHookScore, calculateEmotionScore, calculateCTScore, calculateGateScores, formatScoreCard };

// Run if called directly
if (require.main === module) {
  main();
}
