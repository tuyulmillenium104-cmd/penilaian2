/**
 * RALLY DATA GATHERER V9.2.0 - HYBRID EDITION
 * 
 * Script untuk mengumpulkan data DASAR dari Rally API.
 * Web Research dilakukan oleh AI Chat dengan kemampuan browser agent.
 * 
 * FITUR V9.2.0:
 * ✅ Rally API data fetch (campaign, leaderboard)
 * ✅ Basic website scrape
 * ✅ Output JSON dengan instruksi untuk AI Chat
 * ✅ AI Chat melakukan web research dengan browser capability
 * 
 * KENAPA V9.2.0?
 * - Web Search API rate-limited (429 error)
 * - AI Chat punya browser capability yang lebih powerful
 * - AI Chat bisa navigate, scroll, click, extract data dinamis
 * - Tidak tergantung pada rate limit z-ai-web-dev-sdk
 * 
 * Usage:
 *   node scripts/rally-data-gatherer.js [campaign_address]
 *   node scripts/rally-data-gatherer.js (default: Internet Court)
 */

const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  rallyApiBase: 'https://app.rally.fun/api',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  outputDir: '/home/z/my-project/download',
  
  // Project URLs for basic scrape
  projectUrls: [
    'https://internetcourt.org',
    'https://genlayer.com'
  ],
  
  // Default campaign data
  defaultCampaign: {
    name: 'Internet Court',
    goal: 'Spread awareness about Internet Court - decentralized dispute resolution powered by AI validators',
    baseUrl: 'internetcourt.org',
    hook: 'Code Runs, Disputes Don\'t. Enter Internet Court',
    tags: ['blockchain', 'AI', 'justice', 'dispute-resolution', 'GenLayer']
  },
  
  // Banned words for Rally content
  bannedWords: [
    'guaranteed', 'guarantee', '100%', 'risk-free', 'sure thing',
    'financial advice', 'investment advice', 'buy now', 'sell now',
    'get rich', 'quick money', 'easy money', 'passive income',
    'follow me', 'subscribe to my', 'check my profile',
    'click here', 'limited time offer', 'act now',
    'legally binding', 'court order', 'official ruling'
  ],
  
  // 16 Gates definition
  gatesDefinition: {
    gateUtama: {
      name: 'Gate Utama',
      maxScore: 5,
      minScore: 4,
      gates: [
        { id: 1, name: 'URL Presence', desc: 'Required URL must be present in content', weight: 1 },
        { id: 2, name: 'Hook Quality', desc: 'Opening hook must be engaging and attention-grabbing', weight: 1 },
        { id: 3, name: 'Content Length', desc: '3-5 tweets with 240-400 characters each', weight: 1 },
        { id: 4, name: 'CTA Present', desc: 'Clear call-to-action that encourages engagement', weight: 1 },
        { id: 5, name: 'Topic Relevance', desc: 'Content matches campaign topic and goal', weight: 1 }
      ]
    },
    gateTambahan: {
      name: 'Gate Tambahan',
      maxScore: 8,
      minScore: 8,
      gates: [
        { id: 6, name: 'No Banned Words', desc: 'Free from prohibited phrases', weight: 1 },
        { id: 7, name: 'Unique Hook', desc: 'Hook differs from top 20 competitors', weight: 1 },
        { id: 8, name: 'Emotional Appeal', desc: 'Contains emotional triggers that resonate', weight: 1 },
        { id: 9, name: 'Educational Value', desc: 'Provides useful information to reader', weight: 1 },
        { id: 10, name: 'Viral Potential', desc: 'Has shareable elements', weight: 1 },
        { id: 11, name: 'Authentic Voice', desc: 'Sounds natural, not robotic or AI-generated', weight: 1 },
        { id: 12, name: 'Proper Formatting', desc: 'Good line breaks and structure', weight: 1 },
        { id: 13, name: 'Engagement Hook', desc: 'Encourages replies and interaction', weight: 1 }
      ]
    },
    penilaianInternal: {
      name: 'Penilaian Internal',
      maxScore: 10,
      minScore: 9,
      criteria: [
        'Originality and creativity',
        'Depth of insight',
        'Quality of writing',
        'Emotional resonance',
        'Viral coefficient potential'
      ]
    }
  },
  
// NOTE: Tidak ada fallback data spesifik campaign
  // AI Chat harus mengekstrak facts dari:
  // 1. campaign.knowledgeBase (dari Rally API)
  // 2. websites[].textPreview (dari scrape)
  // 3. Web research results (dari AI Chat browser)
  fallbackInstructions: {
    note: 'Tidak ada hardcoded campaign data. Ambil dari sumber dinamis.',
    sources: [
      'campaign.knowledgeBase - Jika ada dari Rally API',
      'websites[].textPreview - Dari website scrape',
      'Web research - AI Chat lakukan dengan browser'
    ]
  },

  // EMOTION PRINCIPLES (bukan template, tapi prinsip)
  emotionPrinciples: {
    types: ['fear', 'curiosity', 'surprise', 'hope', 'pain', 'urgency'],
    principle: 'Gunakan 2-3 emosi dalam konten. Emosi pertama di hook, emosi kedua di body, emosi ketiga di CTA.',
    intensity: 'Emosi harus meningkat sepanjang konten, bukan datar.'
  },

  // HOOK PRINCIPLES (bukan template)
  hookPrinciples: {
    structure: 'Hook harus punya: 1) Attention grabber, 2) Gap/tension, 3) Relevance ke reader',
    length: 'Maksimal 200 karakter untuk hook.',
    patterns: ['problem-first', 'contrast', 'fear-based', 'analytical', 'future-focused'],
    principle: 'Pilih pattern berdasarkan target audience dan campaign goal. Jangan copy template.'
  },

  // CTA PRINCIPLES (bukan template)
  ctaPrinciples: {
    types: ['question', 'challenge', 'open-ended'],
    principle: 'CTA harus invite response. Question = engagement. Challenge = thought. Open-ended = discussion.',
    placement: 'CTA di tweet terakhir, clear dan direct.'
  },

  // 16 Gates validation logic
  gatesValidation: {
    gateUtama: {
      gates: [
        { id: 1, name: 'URL Presence', check: 'content.includes(requiredUrl)', passIf: true },
        { id: 2, name: 'Hook Quality', check: 'firstParagraph.length < 200 && hasHookPattern', passIf: true },
        { id: 3, name: 'Content Length', check: 'tweetCount >= 3 && tweetCount <= 5', passIf: true },
        { id: 4, name: 'CTA Present', check: 'hasQuestion || hasEngagementHook', passIf: true },
        { id: 5, name: 'Topic Relevance', check: 'mentionsTopicKeywords', passIf: true }
      ]
    },
    gateTambahan: {
      gates: [
        { id: 6, name: 'No Banned Words', check: '!containsBannedWords', passIf: true },
        { id: 7, name: 'Unique Hook', check: 'hookUniquenessScore > 0.7', passIf: true },
        { id: 8, name: 'Emotional Appeal', check: 'emotionScore >= 7', passIf: true },
        { id: 9, name: 'Educational Value', check: 'hasNewInformation', passIf: true },
        { id: 10, name: 'Viral Potential', check: 'viralScore >= 0.6', passIf: true },
        { id: 11, name: 'Authentic Voice', check: '!hasAIPatterns', passIf: true },
        { id: 12, name: 'Proper Formatting', check: 'hasProperLineBreaks', passIf: true },
        { id: 13, name: 'Engagement Hook', check: 'hasReplyBait || hasQuestion', passIf: true }
      ]
    }
  },

  // AI patterns to avoid
  aiPatterns: {
    words: ['delve', 'leverage', 'realm', 'tapestry', 'paradigm', 'landscape', 'nuance', 'underscores', 'pivotal', 'crucial'],
    phrases: ['picture this', 'lets dive in', 'in this thread', 'key takeaways', 'heres the thing', 'imagine a world', 'it goes without saying', 'at the end of the day'],
    structures: ['X/x numbering', 'Thread (1/X)', 'First, ... Second, ... Finally, ...']
  },

  // Web research tasks for AI Chat (browser agent)
  // NOTE: Queries akan digenerate dinamis oleh AI Chat berdasarkan campaign data
  webResearchTasks: {
    instructions: 'Generate search queries based on campaign name, tags, and goal dynamically',
    categories: [
      {
        category: 'news',
        task: 'Search for latest news about the campaign topic/project',
        queryTemplate: '[CAMPAIGN_NAME] [PROJECT_TAGS] latest news 2025',
        outputFormat: 'Array of {title, source, date, summary}'
      },
      {
        category: 'market',
        task: 'Research market data and statistics relevant to the campaign',
        queryTemplate: '[CAMPAIGN_INDUSTRY] market size statistics [CURRENT_YEAR]',
        outputFormat: 'Array of {insight, data, source}'
      },
      {
        category: 'trends',
        task: 'Identify trending topics in the campaign\'s industry/community',
        queryTemplate: '[CAMPAIGN_TOPIC] trending twitter discussions',
        outputFormat: 'Array of {topic, sentiment, engagement}'
      },
      {
        category: 'competitors',
        task: 'Analyze competitor platforms/projects',
        queryTemplate: '[CAMPAIGN_NAME] vs alternatives competitors',
        outputFormat: 'Array of {platform, features, comparison}'
      }
    ],
    note: 'AI Chat harus generate actual queries berdasarkan: campaign.name, campaign.tags, campaign.goal'
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
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

function parseHtml(html) {
  const $ = cheerio.load(html);
  $('script, style, noscript, iframe').remove();
  
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const title = $('title').text().trim();
  
  const headings = [];
  $('h1, h2, h3').each((i, el) => {
    const hText = $(el).text().trim();
    if (hText.length > 5 && hText.length < 200) {
      headings.push({ level: el.tagName, text: hText });
    }
  });
  
  return { title, metaDesc, text: text.substring(0, 5000), headings: headings.slice(0, 10) };
}

// ============================================================================
// DATA GATHERING FUNCTIONS
// ============================================================================

async function fetchCampaignData(campaignAddress) {
  console.log('\n' + '─'.repeat(60));
  console.log('📦 PHASE 0: Campaign Data Fetch (Rally API)');
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
            baseUrl: data.baseUrl || CONFIG.defaultCampaign.baseUrl,
            hook: data.hook || CONFIG.defaultCampaign.hook,
            tags: data.tags || CONFIG.defaultCampaign.tags
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ API fetch failed: ${error.message}`);
    }
  }
  
  console.log('   ℹ️ Using default campaign data (Internet Court)');
  return {
    success: true,
    source: 'default',
    data: {
      address: campaignAddress || 'default',
      ...CONFIG.defaultCampaign
    }
  };
}

async function fetchLeaderboard(campaignAddress) {
  console.log('\n' + '─'.repeat(60));
  console.log('🏆 PHASE 2: Leaderboard Fetch (Rally API)');
  console.log('─'.repeat(60));
  
  if (campaignAddress && campaignAddress.startsWith('0x')) {
    try {
      const url = `${CONFIG.rallyApiBase}/leaderboard?campaignAddress=${campaignAddress}&limit=20`;
      console.log(`   Fetching: ${url}`);
      const response = await fetchUrl(url);
      
      if (response.status === 200) {
        const data = JSON.parse(response.data);
        const leaderboard = Array.isArray(data) ? data : (data.leaderboard || data.entries || []);
        
        console.log(`   ✅ Found ${leaderboard.length} competitors`);
        
        return {
          success: true,
          source: 'rally_api',
          data: {
            top10: leaderboard.slice(0, 10).map((entry, i) => ({
              rank: entry.rank || i + 1,
              username: entry.username || entry.user?.xUsername || 'Anonymous',
              points: entry.points || 0,
              followers: entry.user?.xFollowersCount || 0,
              content: entry.content || ''
            })),
            stats: {
              totalCompetitors: leaderboard.length,
              topScore: leaderboard[0]?.points || 0
            }
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ Leaderboard fetch failed: ${error.message}`);
    }
  }
  
  console.log('   ℹ️ No leaderboard data available');
  return {
    success: false,
    source: 'none',
    data: { top10: [], stats: {} }
  };
}

async function fetchBasicWebsiteData() {
  console.log('\n' + '─'.repeat(60));
  console.log('📄 PHASE 1: Basic Website Data (HTML Scrape)');
  console.log('─'.repeat(60));
  
  const websites = [];
  
  for (const url of CONFIG.projectUrls) {
    try {
      console.log(`   📄 Fetching ${url}...`);
      const response = await fetchUrl(url);
      const parsed = parseHtml(response.data);
      
      websites.push({
        url,
        title: parsed.title,
        description: parsed.metaDesc,
        headings: parsed.headings,
        textPreview: parsed.text.substring(0, 1000)
      });
      
      console.log(`   ✅ Extracted data from ${parsed.title}`);
    } catch (error) {
      console.log(`   ⚠️ Failed to fetch ${url}: ${error.message}`);
    }
  }
  
  return websites;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const campaignAddress = process.argv[2];
  
  console.log('\n' + '═'.repeat(70));
  console.log('  RALLY DATA GATHERER V9.2.0 - HYBRID EDITION');
  console.log('═'.repeat(70));
  console.log(`  Campaign: ${campaignAddress || 'Default (Internet Court)'}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log('  Note: Web Research will be done by AI Chat (browser agent)');
  console.log('═'.repeat(70));
  
  const startTime = Date.now();
  
  // ===== PHASE 0: Campaign Data =====
  const campaign = await fetchCampaignData(campaignAddress);
  
  // ===== PHASE 1: Basic Website Data =====
  const websites = await fetchBasicWebsiteData();
  
  // ===== PHASE 2: Leaderboard =====
  const leaderboard = await fetchLeaderboard(campaignAddress);
  
  // Compile output
  const output = {
    version: '9.2.0',
    timestamp: new Date().toISOString(),
    campaignAddress: campaignAddress || 'default',
    
    // === CORE DATA (from Script) ===
    campaign: campaign.data,
    websites: websites,
    leaderboard: leaderboard.data,
    
    // === INSTRUCTIONS FOR AI CHAT ===
    aiInstructions: {
      // Campaign info
      hook: campaign.data.hook,
      requiredUrl: campaign.data.baseUrl,
      campaignName: campaign.data.title || campaign.data.name,
      campaignGoal: campaign.data.goal,
      
      // Content requirements
      minLength: 3,
      maxLength: 5,
      minScore: 9.0,
      
      requirements: {
        gates: {
          gateUtama: { minScore: 4, maxScore: 5 },
          gateTambahan: { minScore: 8, maxScore: 8 },
          penilaianInternal: { minScore: 9, maxScore: 10 }
        },
        emotionalScore: { minimum: 7.0 },
        viralScore: { minimum: 0.6 }
      },
      
      // Banned words
      bannedWords: CONFIG.bannedWords,
      
      // AI patterns to avoid
      aiPatterns: CONFIG.aiPatterns,
      
      // Content principles (bukan template)
      contentPrinciples: {
        emotion: CONFIG.emotionPrinciples,
        hook: CONFIG.hookPrinciples,
        cta: CONFIG.ctaPrinciples
      },
      
      // 16 Gates definition
      gatesDefinition: CONFIG.gatesDefinition,
      
      // 16 Gates validation logic
      gatesValidation: CONFIG.gatesValidation,
      
      // === WEB RESEARCH TASKS FOR AI CHAT (BROWSER AGENT) ===
      webResearchTasks: CONFIG.webResearchTasks,
      
      // Workflow phases
      workflowPhases: {
        phase1_WebResearch: {
          description: 'Use your browser/web search capability to gather real-time data',
          tasks: [
            'Search for latest news about the campaign topic',
            'Gather market data and statistics',
            'Identify trending topics in the community',
            'Analyze competitor platforms'
          ],
          outputFormat: {
            news: 'Array of {title, source, date, summary}',
            market: 'Array of {insight, data, source}',
            trends: 'Array of {topic, sentiment, engagement}',
            competitors: 'Array of {platform, features, comparison}'
          }
        },
        phase2B_CompetitorAnalysis: {
          description: 'Analyze competitor content patterns',
          llm: true,
          tasks: [
            'Analyze leaderboard.top10[].content for patterns',
            'Identify hook patterns used',
            'Find CTA styles that work',
            'Discover content gaps to fill'
          ]
        },
        phase3_16_ContentCreation: {
          description: 'Full content creation workflow',
          phases: [
            { phase: 3, name: 'Gap Identification', llm: false },
            { phase: 4, name: 'Strategy Definition', llm: false },
            { phase: 5, name: 'Content Generation', llm: true, core: true },
            { phase: 6, name: 'Banned Items Scan', llm: false },
            { phase: '6B', name: 'Rewrite', llm: true },
            { phase: 7, name: 'Uniqueness Check', llm: false },
            { phase: 8, name: 'Emotion Injection', llm: true, core: true },
            { phase: 9, name: 'HES + Viral Score', llm: false },
            { phase: '9B', name: 'Viral Enhancement', llm: true },
            { phase: 10, name: 'Quality Selection', llm: false },
            { phase: 11, name: 'Micro-Optimization', llm: false },
            { phase: 12, name: 'Flow Polish', llm: false },
            { phase: '12B', name: '16 Gates Validation', llm: false },
            { phase: 13, name: 'Benchmark', llm: false },
            { phase: '13B', name: 'Beat Top 20', llm: true },
            { phase: 14, name: 'Final Emotion', llm: true, core: true },
            { phase: '14B', name: 'Final Polish', llm: false },
            { phase: 15, name: 'Output Format', llm: false },
            { phase: '15B', name: 'CT Maximizer', llm: true },
            { phase: 16, name: 'Export', llm: false }
          ]
        }
      }
    }
  };
  
  // Save to file
  const outputPath = path.join(CONFIG.outputDir, `rally-data-${Date.now()}.json`);
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '═'.repeat(70));
  console.log('  DATA GATHERING COMPLETE');
  console.log('═'.repeat(70));
  console.log(`  Execution Time: ${executionTime}s`);
  console.log('─'.repeat(70));
  console.log(`  Campaign: ${campaign.data.title || campaign.data.name}`);
  console.log(`  Hook: ${campaign.data.hook}`);
  console.log(`  Required URL: ${campaign.data.baseUrl}`);
  console.log('─'.repeat(70));
  console.log(`  Websites Scraped: ${websites.length}`);
  console.log(`  Leaderboard: ${leaderboard.data.stats?.totalCompetitors || 0} competitors`);
  console.log('─'.repeat(70));
  console.log('  ⚠️  WEB RESEARCH PENDING');
  console.log('  AI Chat must perform web research using browser capability');
  console.log('  See: aiInstructions.webResearchTasks in output JSON');
  console.log('─'.repeat(70));
  console.log(`  Output File: ${outputPath}`);
  console.log('═'.repeat(70));
  
  // Output JSON for AI consumption
  console.log('\n' + '▼'.repeat(35));
  console.log('JSON OUTPUT FOR AI CONSUMPTION:');
  console.log('▼'.repeat(35) + '\n');
  console.log(JSON.stringify(output, null, 2));
  
  return output;
}

// Export
module.exports = { 
  fetchCampaignData, 
  fetchLeaderboard, 
  fetchBasicWebsiteData,
  main,
  CONFIG
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
