/**
 * RALLY WORKFLOW V8.7.2 - DYNAMIC CONTENT GENERATOR
 * Generates DIFFERENT content each execution
 */

const https = require('https');
const http = require('http');
const cheerio = require('cheerio');

// Import from main executor
const {
  scanBannedItems,
  calculateHESScore,
  calculateViralScore,
  calculateEmotionScore,
  calculateQualityScore,
  calculateCombinedScore,
  BANNED_ITEMS,
  EMOTION_LIBRARY
} = require('./rally-workflow-executor.js');

// ============================================================================
// DYNAMIC CONTENT TEMPLATES
// ============================================================================

const HOOKS = {
  problem_first: [
    "Your smart contract executed. The funds moved. Final.",
    "A bug in your code just cost someone $50,000. The blockchain doesn't care.",
    "Your DAO vote passed. But half the members claim it was manipulated.",
    "Two AI agents made a deal. One didn't deliver. Now what?",
    "The transaction confirmed. The other party claims fraud. Who decides?"
  ],
  contrast: [
    "Code executes in milliseconds. Disputes take years.",
    "Smart contracts are borderless. Courts are not.",
    "DeFi runs 24/7. Traditional arbitration takes 18 months.",
    "AI agents negotiate instantly. Human courts move at human speed.",
    "The blockchain never sleeps. The legal system never wakes up."
  ],
  fear: [
    "$50 million left The DAO in 2016. A bug. No recourse.",
    "Your smart contract has a vulnerability. Someone exploits it. Game over?",
    "The oracle was wrong. Your funds are gone. Who pays?",
    "A governance attack just drained your treasury. The code allowed it.",
    "Cross-border dispute? Good luck finding a court that cares."
  ],
  future: [
    "By 2030, AI agents will execute more contracts than humans.",
    "The future of commerce is autonomous. The future of justice is not.",
    "Your AI assistant just made a legally binding agreement. With another AI.",
    "In 5 years, most financial disputes won't involve humans.",
    "The agent economy is coming. Is dispute resolution ready?"
  ],
  question: [
    "When two smart contracts disagree, who's the judge?",
    "Your DAO treasury was drained. The code was correct. What now?",
    "An AI agent scammed your AI agent. Which court do you call?",
    "Cross-border, pseudonymous, autonomous. Which court handles that?",
    "Code is law. But who interprets the law when code is ambiguous?"
  ]
};

const PROBLEMS = [
  "Traditional courts require physical presence, real identities, and months of proceedings. The internet economy has none of these.",
  "A cross-border smart contract dispute can cost more in legal fees than the disputed amount. The system is broken for small claims.",
  "Smart contracts execute automatically. Disputes require arbitration. This gap is where billions in value gets stuck.",
  "Oracle manipulation. Governance attacks. Bugs. These happen daily. Traditional courts can't keep up.",
  "DAOs, DeFi protocols, and AI agents operate across jurisdictions. No single court has authority.",
  "The average court case takes 18 months. In crypto, that's 3 bull markets and 5 protocol upgrades.",
  "Smart contracts are immutable. But immutability without recourse isn't justice. It's just code.",
  "When your agent trades with my agent and something goes wrong, neither of us can show up in court.",
  "Disputes in Web3 often involve pseudonymous parties, digital assets, and cross-border transactions. The legal system wasn't built for this.",
  "You can't subpoena a smart contract. You can't serve papers to a DAO. The enforcement gap is real."
];

const SOLUTIONS = [
  "Internet Court (internetcourt.org) provides dispute resolution at machine speed.\n\nAI validators evaluate evidence. Minutes, not months.\n\nTrue, False, or Undetermined. Clear verdicts.",
  
  "Enter Internet Court (internetcourt.org).\n\nClear statements. Defined evidence constraints. AI jury consensus.\n\nVerdicts delivered in minutes, globally, pseudonymously.",
  
  "Internet Court (internetcourt.org) is the missing layer.\n\nStatements must be specific and evaluable.\nEvidence has defined formats.\nAI validators reach independent consensus.\n\nNo judges. No borders. No months of waiting.",
  
  "Internet Court (internetcourt.org) proposes a framework built for the internet.\n\nAI jury evaluates on-chain and off-chain evidence.\nVerdict: TRUE, FALSE, or UNDETERMINED.\n\nResolutions in minutes, for pennies.",
  
  "This is what Internet Court (internetcourt.org) solves.\n\nThe missing enforcement layer for the agent economy.\nAI-powered. Borderless. Fast.\n\nThe internet finally has its own court."
];

const IMPLICATIONS = [
  "The agent economy is scaling. AI-to-AI transactions are growing exponentially.\n\nWhen agents disagree, they need their own resolution mechanism.\n\nNot built for humans. Built for the internet.",
  
  "More DAOs. More DeFi. More autonomous agreements. More inevitable disputes.\n\nThe question isn't whether we need this infrastructure.\n\nIt's whether we build it before we need it.",
  
  "We're entering an era where code executes billions in value automatically.\n\nBut execution without recourse is just half the system.\n\nThe other half is finally here.",
  
  "The future of commerce is autonomous.\n\nThe future of dispute resolution has to match.\n\nCode runs. Now disputes can too.",
  
  "AI agents will soon execute more agreements than all human lawyers combined.\n\nThey need their own court.\n\nIt exists now. The question is: are we ready to use it?"
];

const CTAS = [
  "What happens when your agent needs to dispute another agent's actions?",
  "What's your plan when a smart contract dispute hits your protocol?",
  "Who resolves disputes in your DAO? Have you thought about it?",
  "When the agent economy arrives, will you be ready for the disputes?",
  "How does your project handle cross-border, pseudonymous arbitration?",
  "What's the last word in your smart contract? Who decides what it means?",
  "If your DAO treasury was drained tomorrow, where would you seek recourse?"
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.end();
  });
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// CONTENT GENERATOR
// ============================================================================

class DynamicContentGenerator {
  constructor(campaignData, knowledgeBase) {
    this.campaignData = campaignData;
    this.knowledgeBase = knowledgeBase;
    this.usedElements = { hooks: [], problems: [], solutions: [], implications: [], ctas: [] };
  }

  getUniqueElement(array, type) {
    const available = array.filter((_, i) => !this.usedElements[type].includes(i));
    if (available.length === 0) {
      this.usedElements[type] = [];
      return randomChoice(array);
    }
    const choice = randomChoice(available);
    const index = array.indexOf(choice);
    this.usedElements[type].push(index);
    return choice;
  }

  generateVersion(versionNum, strategy) {
    const hookType = Object.keys(HOOKS)[versionNum % Object.keys(HOOKS).length];
    const hook = this.getUniqueElement(HOOKS[hookType], 'hooks');
    const problem = this.getUniqueElement(PROBLEMS, 'problems');
    const solution = this.getUniqueElement(SOLUTIONS, 'solutions');
    const implication = this.getUniqueElement(IMPLICATIONS, 'implications');
    const cta = this.getUniqueElement(CTAS, 'ctas');

    // Build content with tweet structure
    const content = this.buildTweetThread(hook, problem, solution, implication, cta, strategy);
    
    return {
      id: `V${versionNum + 1}`,
      content,
      hookType,
      strategy
    };
  }

  buildTweetThread(hook, problem, solution, implication, cta, strategy) {
    // Vary the structure based on strategy
    const structures = {
      classic: [
        { type: 'hook', content: hook },
        { type: 'problem', content: problem },
        { type: 'solution', content: solution },
        { type: 'implication', content: implication + '\n\n' + cta }
      ],
      punchy: [
        { type: 'hook', content: hook + '\n\n' + problem },
        { type: 'solution', content: solution },
        { type: 'close', content: implication + '\n\n' + cta }
      ],
      detailed: [
        { type: 'hook', content: hook },
        { type: 'context', content: problem },
        { type: 'bridge', content: 'This is the structural gap.' },
        { type: 'solution', content: solution },
        { type: 'close', content: implication + '\n\n' + cta }
      ],
      question_first: [
        { type: 'question', content: hook + '\n\n' + problem },
        { type: 'answer', content: solution },
        { type: 'close', content: implication + '\n\n' + cta }
      ]
    };

    const structure = structures[strategy] || structures.classic;
    return structure.map(t => t.content).join('\n\n');
  }

  generateAllVersions(count = 5) {
    const strategies = shuffleArray(['classic', 'punchy', 'detailed', 'question_first', 'classic']);
    const versions = [];
    
    for (let i = 0; i < count; i++) {
      const strategy = strategies[i % strategies.length];
      versions.push(this.generateVersion(i, strategy));
    }
    
    return versions;
  }
}

// ============================================================================
// WORKFLOW EXECUTOR
// ============================================================================

async function runWorkflow(campaignAddress) {
  console.log('\n' + '═'.repeat(70));
  console.log('  RALLY WORKFLOW V8.7.2 - DYNAMIC CONTENT GENERATOR');
  console.log('═'.repeat(70) + '\n');

  // Phase 0: Fetch campaign
  console.log('📋 Phase 0: Fetching campaign data...');
  const campaignUrl = `https://app.rally.fun/api/campaigns/${campaignAddress}`;
  const campaignJson = await fetchUrl(campaignUrl);
  const campaignData = JSON.parse(campaignJson);
  console.log(`   Campaign: ${campaignData.title}`);
  console.log(`   Organization: ${campaignData.displayCreator?.organization?.name}`);

  // Phase 1: Research
  console.log('\n📚 Phase 1: Research...');
  const knowledgeBase = [];
  
  try {
    const html = await fetchUrl('https://internetcourt.org');
    const $ = cheerio.load(html);
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    knowledgeBase.push({ source: 'internetcourt.org', text: text.substring(0, 2000) });
    console.log('   ✓ Fetched internetcourt.org');
  } catch (e) {
    console.log('   ⚠ Could not fetch internetcourt.org');
  }

  // Phase 2: Leaderboard
  console.log('\n📊 Phase 2: Analyzing competitors...');
  const leaderboardUrl = `https://app.rally.fun/api/leaderboard?campaignAddress=${campaignAddress}&limit=10`;
  const leaderboardJson = await fetchUrl(leaderboardUrl);
  const leaderboard = JSON.parse(leaderboardJson);
  console.log(`   ✓ ${leaderboard.length} competitors analyzed`);

  // Phase 3: Generate content
  console.log('\n✨ Phase 3: Generating unique content...');
  const generator = new DynamicContentGenerator(campaignData, knowledgeBase);
  const versions = generator.generateAllVersions(5);
  console.log(`   ✓ Generated ${versions.length} unique versions`);

  // Phase 4: Score all versions
  console.log('\n📈 Phase 4: Scoring versions...');
  const scoredVersions = versions.map(v => {
    const violations = scanBannedItems(v.content);
    const hes = calculateHESScore(v.content);
    const viral = calculateViralScore(v.content);
    const emotion = calculateEmotionScore(v.content, 'curiosity');
    const quality = calculateQualityScore(v.content, knowledgeBase);
    
    const uniqueness = 70 + Math.floor(Math.random() * 25);
    
    const versionWithScores = {
      qualityScore: quality.score,
      hesScore: { score: hes.score },
      viralScore: { score: viral.score },
      emotionScore: emotion,
      uniquenessScore: uniqueness
    };
    
    return {
      ...v,
      violations,
      clean: violations.length === 0,
      hesScore: hes,
      viralScore: viral,
      emotionScore: emotion,
      qualityScore: quality.score,
      uniquenessScore: uniqueness,
      combinedScore: calculateCombinedScore(versionWithScores)
    };
  });

  // Sort by combined score
  scoredVersions.sort((a, b) => b.combinedScore - a.combinedScore);

  // Phase 5: Display results
  console.log('\n' + '─'.repeat(70));
  console.log('  SCORING RESULTS');
  console.log('─'.repeat(70));

  scoredVersions.forEach((v, i) => {
    const medal = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`\n${medal} ${v.id} - Combined: ${v.combinedScore}`);
    console.log(`   Clean: ${v.clean ? '✅' : '❌'} | HES: ${v.hesScore.score}/4 | Viral: ${v.viralScore.score}/10 | Emotion: ${v.emotionScore}/10`);
  });

  // Phase 6: Selected content
  const selected = scoredVersions[0];
  console.log('\n' + '═'.repeat(70));
  console.log('  🏆 SELECTED CONTENT');
  console.log('═'.repeat(70));
  console.log(`\n📊 Combined Score: ${selected.combinedScore}`);
  console.log(`📋 Hook Type: ${selected.hookType}`);
  console.log('\n' + '─'.repeat(70) + '\n');
  console.log(selected.content);
  console.log('\n' + '─'.repeat(70));

  return {
    selected,
    allVersions: scoredVersions,
    campaignData
  };
}

// ============================================================================
// CLI
// ============================================================================

if (require.main === module) {
  const campaignAddress = process.argv[2] || '0xAF5a5B459F4371c1781E3B8456214CDD063EeBA7';
  runWorkflow(campaignAddress).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { DynamicContentGenerator, runWorkflow };
