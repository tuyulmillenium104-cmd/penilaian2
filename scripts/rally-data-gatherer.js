/**
 * RALLY DATA GATHERER V9.1.0 - REAL-TIME EDITION
 * 
 * Script untuk mengumpulkan data dari Rally API, Web, dan Real-time Search.
 * TIDAK memerlukan LLM - pure data fetching + web search API.
 * 
 * FITUR V9.1.0:
 * ✅ Real-time web search untuk berita terbaru
 * ✅ Market data fetching  
 * ✅ Trends analysis data
 * ✅ Competitor content discovery
 * ✅ AI-ready JSON output
 * 
 * Usage:
 *   node scripts/rally-data-gatherer.js [campaign_address]
 *   node scripts/rally-data-gatherer.js 0x123abc...
 *   node scripts/rally-data-gatherer.js (default: Internet Court)
 */

const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Try to import ZAI SDK for web search
let ZAI = null;
try {
  ZAI = require('z-ai-web-dev-sdk').default;
} catch (e) {
  console.log('[Warning] z-ai-web-dev-sdk not found, web search disabled');
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  rallyApiBase: 'https://app.rally.fun/api',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  outputDir: '/home/z/my-project/download',
  
  // Project URLs to scrape
  projectUrls: [
    'https://internetcourt.org',
    'https://genlayer.com'
  ],
  
  // Real-time search queries
  searchQueries: {
    news: [
      'Internet Court blockchain dispute resolution latest news 2025',
      'GenLayer AI validators crypto news update',
      'decentralized justice Web3 recent developments',
      'smart contract dispute resolution latest'
    ],
    market: [
      'blockchain arbitration market size statistics 2024 2025',
      'Web3 dispute resolution adoption data',
      'crypto legal challenges market trends'
    ],
    trends: [
      'AI court blockchain twitter trending',
      'decentralized arbitration crypto community',
      'DAO governance disputes solutions'
    ],
    competitors: [
      'Kleros decentralized court reviews',
      'Aragon court vs Internet Court',
      'Web3 dispute resolution platforms comparison'
    ]
  },
  
  // Default campaign data
  defaultCampaign: {
    name: 'Internet Court',
    goal: 'Spread awareness about Internet Court - decentralized dispute resolution powered by AI validators',
    baseUrl: 'internetcourt.org',
    tags: ['blockchain', 'AI', 'justice', 'dispute-resolution', 'GenLayer']
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
  const ogDesc = $('meta[property="og:description"]').attr('content') || '';
  const title = $('title').text().trim();
  
  const headings = [];
  $('h1, h2, h3').each((i, el) => {
    const hText = $(el).text().trim();
    if (hText.length > 5 && hText.length < 200) {
      headings.push({ 
        level: el.tagName, 
        text: hText
      });
    }
  });
  
  // Extract links
  const links = [];
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    const linkText = $(el).text().trim();
    if (href && linkText.length > 3 && linkText.length < 100) {
      links.push({ text: linkText, href });
    }
  });
  
  return { 
    title, 
    metaDesc: metaDesc || ogDesc, 
    text: text.substring(0, 5000), 
    headings: headings.slice(0, 10),
    links: links.slice(0, 20)
  };
}

function extractFacts(text, source, minFacts = 5) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20 && s.trim().length < 300);
  const facts = [];
  
  const factualPatterns = [
    /\d+/,  // Numbers
    /is|are|was|were|has|have|had/,  // Factual verbs
    /launched|founded|created|built|developed|announced|released/,  // Actions
    /percent|billion|million|thousand|\$\d+/,  // Units/money
    /on \d|in \d{4}|since \d|ago/,  // Dates
    /first|only|largest|fastest|smallest/,  // Superlatives
  ];
  
  for (const sentence of sentences) {
    const s = sentence.trim();
    if (factualPatterns.some(p => p.test(s))) {
      facts.push({ fact: s, source, timestamp: new Date().toISOString() });
    }
    if (facts.length >= minFacts) break;
  }
  
  return facts;
}

// ============================================================================
// WEB SEARCH FUNCTION (Real-time data via z-ai-web-dev-sdk)
// ============================================================================

async function performWebSearch(query, numResults = 5) {
  if (!ZAI) {
    console.log(`   ⚠️ Web search disabled (no SDK): "${query.substring(0, 40)}..."`);
    return [];
  }
  
  try {
    const zai = await ZAI.create();
    const searchResult = await zai.functions.invoke("web_search", {
      query: query,
      num: numResults
    });
    
    if (searchResult && Array.isArray(searchResult)) {
      return searchResult.map(result => ({
        title: result.name || result.title || '',
        url: result.url || '',
        snippet: result.snippet || '',
        source: result.host_name || (result.url ? new URL(result.url).hostname : 'web'),
        date: result.date || '',
        rank: result.rank || 0
      }));
    }
    
    return [];
  } catch (error) {
    console.log(`   ⚠️ Web search failed for "${query.substring(0, 30)}...": ${error.message}`);
    return [];
  }
}

async function gatherRealTimeData(campaignName) {
  console.log('\n' + '─'.repeat(60));
  console.log('🔍 PHASE 1B: Real-Time Data Gathering (Web Search API)');
  console.log('─'.repeat(60));
  
  const realTimeData = {
    news: [],
    market: [],
    trends: [],
    competitors: [],
    allSearchResults: [],
    searchStatus: ZAI ? 'ENABLED' : 'DISABLED (fallback mode)'
  };
  
  if (!ZAI) {
    console.log('   ⚠️ Web search SDK not available - using fallback data');
    realTimeData.news = [
      { 
        title: 'Web3 dispute resolution growing rapidly', 
        snippet: 'AI-powered courts emerging as solution for cross-border crypto disputes, with Internet Court leading innovation', 
        source: 'knowledge_base',
        date: new Date().toISOString()
      },
      { 
        title: 'Internet Court AI jury system', 
        snippet: 'Decentralized justice platform processes cases in minutes instead of months', 
        source: 'knowledge_base',
        date: new Date().toISOString()
      }
    ];
    realTimeData.market = [
      { 
        title: 'Blockchain arbitration market growth', 
        snippet: 'Dispute resolution market in crypto expected to grow significantly as DeFi adoption increases', 
        source: 'knowledge_base'
      }
    ];
    return realTimeData;
  }
  
  console.log('   ✅ Web search SDK available - gathering real-time data...\n');
  
  // Search for NEWS
  console.log('   📰 Searching for latest news...');
  for (const query of CONFIG.searchQueries.news) {
    try {
      const results = await performWebSearch(query, 3);
      realTimeData.news.push(...results);
      console.log(`      ✓ "${query.substring(0, 45)}..." → ${results.length} results`);
      await new Promise(r => setTimeout(r, 300)); // Rate limit protection
    } catch (e) {
      console.log(`      ✗ Search failed: ${query.substring(0, 40)}...`);
    }
  }
  
  // Search for MARKET DATA
  console.log('\n   📊 Searching for market data...');
  for (const query of CONFIG.searchQueries.market) {
    try {
      const results = await performWebSearch(query, 3);
      realTimeData.market.push(...results);
      console.log(`      ✓ "${query.substring(0, 45)}..." → ${results.length} results`);
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.log(`      ✗ Market search failed`);
    }
  }
  
  // Search for TRENDS
  console.log('\n   📈 Searching for trends...');
  for (const query of CONFIG.searchQueries.trends) {
    try {
      const results = await performWebSearch(query, 3);
      realTimeData.trends.push(...results);
      console.log(`      ✓ "${query.substring(0, 45)}..." → ${results.length} results`);
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.log(`      ✗ Trend search failed`);
    }
  }
  
  // Search for COMPETITOR INFO
  console.log('\n   🏆 Searching for competitor data...');
  for (const query of CONFIG.searchQueries.competitors) {
    try {
      const results = await performWebSearch(query, 3);
      realTimeData.competitors.push(...results);
      console.log(`      ✓ "${query.substring(0, 45)}..." → ${results.length} results`);
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.log(`      ✗ Competitor search failed`);
    }
  }
  
  // Combine all results
  realTimeData.allSearchResults = [
    ...realTimeData.news,
    ...realTimeData.market,
    ...realTimeData.trends,
    ...realTimeData.competitors
  ];
  
  // Deduplicate by URL
  const seen = new Set();
  realTimeData.allSearchResults = realTimeData.allSearchResults.filter(item => {
    const key = (item.title + item.url).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  console.log(`\n   ✅ Total unique real-time results: ${realTimeData.allSearchResults.length}`);
  
  return realTimeData;
}

// ============================================================================
// DATA GATHERING FUNCTIONS
// ============================================================================

async function fetchCampaignData(campaignAddress) {
  console.log('\n' + '─'.repeat(60));
  console.log('📦 PHASE 0: Campaign Data Fetch');
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
            timestamps: {
              start: data.startDate || data.createdAt,
              end: data.endDate
            }
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ API fetch failed: ${error.message}`);
    }
  }
  
  // Fallback to default
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
  console.log('🏆 PHASE 2: Leaderboard Fetch');
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
        
        // Analyze competitor patterns
        const competitorPatterns = {
          avgLength: 0,
          avgSentences: 0,
          commonHooks: [],
          commonCTAs: [],
          topEmojis: []
        };
        
        if (leaderboard.length > 0) {
          // Calculate basic patterns (LLM needed for deep analysis)
          const contents = leaderboard.filter(e => e.content).map(e => e.content);
          if (contents.length > 0) {
            competitorPatterns.avgLength = Math.round(
              contents.reduce((sum, c) => sum + c.length, 0) / contents.length
            );
            competitorPatterns.avgSentences = Math.round(
              contents.reduce((sum, c) => sum + c.split(/[.!?]+/).length, 0) / contents.length
            );
          }
        }
        
        return {
          success: true,
          source: 'rally_api',
          data: {
            top10: leaderboard.slice(0, 10).map((entry, i) => ({
              rank: entry.rank || i + 1,
              username: entry.username || entry.user?.xUsername || 'Anonymous',
              points: entry.points || 0,
              followers: entry.user?.xFollowersCount || 0,
              contentLength: entry.content?.length || 0
            })),
            stats: {
              totalCompetitors: leaderboard.length,
              avgPoints: leaderboard.reduce((sum, e) => sum + (e.points || 0), 0) / Math.max(1, leaderboard.length),
              topScore: leaderboard[0]?.points || 0
            },
            patterns: competitorPatterns
          }
        };
      }
    } catch (error) {
      console.log(`   ⚠️ Leaderboard fetch failed: ${error.message}`);
    }
  }
  
  console.log('   ℹ️ No leaderboard data available - will analyze from real-time search');
  return {
    success: false,
    source: 'none',
    data: { 
      top10: [], 
      stats: {},
      patterns: {}
    }
  };
}

async function fetchProjectResearch() {
  console.log('\n' + '─'.repeat(60));
  console.log('📄 PHASE 1: Project Website Research');
  console.log('─'.repeat(60));
  
  const research = {
    facts: [],
    websites: [],
    rawContent: []
  };
  
  // Fetch project websites
  for (const url of CONFIG.projectUrls) {
    try {
      console.log(`   📄 Fetching ${url}...`);
      const response = await fetchUrl(url);
      const parsed = parseHtml(response.data);
      const facts = extractFacts(parsed.text + ' ' + parsed.metaDesc, url, 5);
      
      research.facts.push(...facts);
      research.websites.push({
        url,
        title: parsed.title,
        description: parsed.metaDesc,
        headings: parsed.headings,
        wordCount: parsed.text.split(/\s+/).length,
        linkCount: parsed.links.length
      });
      research.rawContent.push({
        url,
        text: parsed.text.substring(0, 3000)
      });
      
      console.log(`   ✅ Extracted ${facts.length} facts from ${parsed.title}`);
    } catch (error) {
      console.log(`   ⚠️ Failed to fetch ${url}: ${error.message}`);
    }
  }
  
  // Add curated knowledge base facts
  research.facts.push(
    { fact: 'Internet Court uses AI validators to evaluate evidence and deliver verdicts', source: 'knowledge_base', importance: 'high' },
    { fact: 'Verdicts are delivered in minutes instead of months or years like traditional courts', source: 'knowledge_base', importance: 'high' },
    { fact: 'Internet Court handles cross-border disputes without jurisdiction issues', source: 'knowledge_base', importance: 'medium' },
    { fact: 'Built on GenLayer infrastructure for AI-powered consensus mechanisms', source: 'knowledge_base', importance: 'high' },
    { fact: '400+ million smart contract users have no traditional legal recourse for disputes', source: 'knowledge_base', importance: 'high' },
    { fact: 'Decentralized dispute resolution eliminates need for expensive legal fees', source: 'knowledge_base', importance: 'medium' },
    { fact: 'AI judges operate 24/7 without bias or corruption potential', source: 'knowledge_base', importance: 'medium' }
  );
  
  console.log(`\n   ✅ Total facts collected: ${research.facts.length}`);
  
  return research;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const campaignAddress = process.argv[2];
  
  console.log('\n' + '═'.repeat(70));
  console.log('  RALLY DATA GATHERER V9.1.0 - REAL-TIME EDITION');
  console.log('═'.repeat(70));
  console.log(`  Campaign: ${campaignAddress || 'Default (Internet Court)'}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log(`  Web Search: ${ZAI ? '✅ ENABLED (z-ai-web-dev-sdk)' : '❌ DISABLED'}`);
  console.log('═'.repeat(70));
  
  const startTime = Date.now();
  
  // ===== PHASE 0: Campaign Data =====
  const campaign = await fetchCampaignData(campaignAddress);
  
  // ===== PHASE 1: Website Research =====
  const research = await fetchProjectResearch();
  
  // ===== PHASE 1B: Real-time Data (NEW!) =====
  const realTimeData = await gatherRealTimeData(campaign.data.name);
  
  // ===== PHASE 2: Leaderboard =====
  const leaderboard = await fetchLeaderboard(campaignAddress);
  
  // Compile output
  const output = {
    version: '9.1.0',
    timestamp: new Date().toISOString(),
    campaignAddress: campaignAddress || 'default',
    
    // === CORE DATA ===
    campaign: campaign.data,
    research: research,
    leaderboard: leaderboard.data,
    
    // === REAL-TIME DATA (NEW IN V9.1.0) ===
    realTimeData: {
      news: realTimeData.news.slice(0, 10),
      market: realTimeData.market.slice(0, 5),
      trends: realTimeData.trends.slice(0, 5),
      competitors: realTimeData.competitors.slice(0, 5),
      totalResults: realTimeData.allSearchResults.length,
      searchStatus: realTimeData.searchStatus
    },
    
    // === AI-READY SUMMARY ===
    summary: {
      campaignName: campaign.data.title || campaign.data.name,
      campaignGoal: campaign.data.goal,
      topFacts: research.facts.slice(0, 10),
      latestNews: realTimeData.news.slice(0, 3).map(n => ({
        title: n.title,
        snippet: n.snippet
      })),
      marketInsights: realTimeData.market.slice(0, 2).map(m => m.snippet),
      trendingTopics: realTimeData.trends.slice(0, 2).map(t => t.title),
      competitorCount: leaderboard.data.stats?.totalCompetitors || 0,
      topCompetitorScore: leaderboard.data.stats?.topScore || 0,
      dataFreshness: new Date().toISOString()
    },
    
    // === INSTRUCTIONS FOR AI ===
    aiInstructions: {
      hook: 'Code Runs, Disputes Don\'t. Enter Internet Court',
      requiredUrl: 'internetcourt.org',
      minLength: 3,
      maxLength: 5,
      minScore: 9.0,
      
      // Content requirements
      requirements: {
        gates: {
          gateUtama: { minScore: 4, maxScore: 5 },
          gateTambahan: { minScore: 8, maxScore: 8 },
          penilaianInternal: { minScore: 9, maxScore: 10 }
        },
        emotionalScore: { minimum: 7.0 },
        viralScore: { minimum: 0.6 }
      },
      
      // Data usage flags
      useRealTimeData: true,
      useWebSearchResults: true,
      useCompetitorPatterns: true
    },
    
    // === RAW DATA FOR DEEP ANALYSIS ===
    raw: {
      webContent: research.rawContent,
      searchResults: realTimeData.allSearchResults.slice(0, 20)
    }
  };
  
  // Save to file
  const outputPath = path.join(CONFIG.outputDir, `rally-data-${Date.now()}.json`);
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
  
  // Print summary
  console.log('\n' + '═'.repeat(70));
  console.log('  DATA GATHERING COMPLETE');
  console.log('═'.repeat(70));
  console.log(`  Execution Time: ${executionTime}s`);
  console.log('─'.repeat(70));
  console.log(`  Website Facts: ${research.facts.length}`);
  console.log(`  Real-time Search Results: ${realTimeData.allSearchResults.length}`);
  console.log(`    ├─ News Items: ${realTimeData.news.length}`);
  console.log(`    ├─ Market Insights: ${realTimeData.market.length}`);
  console.log(`    ├─ Trend Signals: ${realTimeData.trends.length}`);
  console.log(`    └─ Competitor Data: ${realTimeData.competitors.length}`);
  console.log(`  Leaderboard Competitors: ${leaderboard.data.stats?.totalCompetitors || 0}`);
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

// Export for module usage
module.exports = { 
  fetchCampaignData, 
  fetchLeaderboard, 
  fetchProjectResearch,
  performWebSearch,
  gatherRealTimeData,
  main 
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
