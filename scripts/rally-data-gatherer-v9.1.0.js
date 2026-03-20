/**
 * RALLY DATA GATHERER V9.1.0 - REAL-TIME EDITION
 * 
 * Script untuk mengumpulkan data dari Rally API, Web, dan Real-time Search.
 * TIDAK memerlukan LLM - pure data fetching + web search API.
 * 
 * FITUR BARU V9.1.0:
 * - Real-time web search untuk berita terbaru
 * - Market data fetching
 * - Trends analysis data
 * - Competitor content discovery
 * 
 * Usage:
 *   node scripts/rally-data-gatherer-v9.1.0.js [campaign_address]
 *   node scripts/rally-data-gatherer-v9.1.0.js 0x123abc...
 *   node scripts/rally-data-gatherer-v9.1.0.js (default: Internet Court)
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
  
  // Project URLs
  projectUrls: [
    'https://internetcourt.org',
    'https://genlayer.com'
  ],
  
  // Web search queries for real-time data
  searchQueries: {
    news: [
      'Internet Court blockchain dispute resolution 2024 2025',
      'GenLayer AI validators crypto news',
      'decentralized justice Web3 latest',
      'smart contract dispute resolution news'
    ],
    market: [
      'blockchain arbitration market size 2024',
      'Web3 dispute resolution adoption statistics',
      'crypto legal challenges 2024'
    ],
    trends: [
      'AI court judge blockchain trending',
      'decentralized arbitration crypto twitter',
      'DAO governance disputes examples'
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
  $('script, style, noscript').remove();
  
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const title = $('title').text().trim();
  
  const headings = [];
  $('h1, h2, h3').each((i, el) => {
    headings.push({ 
      level: el.tagName, 
      text: $(el).text().trim() 
    });
  });
  
  return { title, metaDesc, text, headings };
}

function extractFacts(text, source, minFacts = 5) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const facts = [];
  
  const factualPatterns = [
    /\d+/,  // Numbers
    /is|are|was|were|has|have|had/,  // Factual verbs
    /launched|founded|created|built|developed/,  // Actions
    /percent|billion|million|thousand/,  // Units
    /on \d|in \d{4}|since \d/,  // Dates
  ];
  
  for (const sentence of sentences) {
    const s = sentence.trim();
    if (factualPatterns.some(p => p.test(s))) {
      facts.push({ fact: s, source });
    }
    if (facts.length >= minFacts) break;
  }
  
  return facts;
}

// ============================================================================
// WEB SEARCH FUNCTION (Real-time data)
// ============================================================================

async function performWebSearch(query, numResults = 5) {
  if (!ZAI) {
    console.log(`   ⚠️ Web search disabled (no SDK): "${query}"`);
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
        source: result.host_name || new URL(result.url || '').hostname || 'web',
        date: result.date || ''
      }));
    }
    
    return [];
  } catch (error) {
    console.log(`   ⚠️ Web search failed: ${error.message}`);
    return [];
  }
}

async function gatherRealTimeData(campaignName) {
  console.log('\n🔍 PHASE 1B: Real-time Data Gathering (Web Search)...');
  
  const realTimeData = {
    news: [],
    market: [],
    trends: [],
    allSearchResults: []
  };
  
  if (!ZAI) {
    console.log('   ⚠️ Web search not available - using fallback data');
    realTimeData.news = [
      { title: 'Web3 dispute resolution growing sector', snippet: 'AI-powered courts emerging as solution for cross-border crypto disputes', source: 'fallback' },
      { title: 'Internet Court launches AI jury system', snippet: 'Decentralized justice platform processes cases in minutes', source: 'fallback' }
    ];
    return realTimeData;
  }
  
  // Search for news
  console.log('   📰 Searching for news...');
  for (const query of CONFIG.searchQueries.news) {
    try {
      const results = await performWebSearch(query, 3);
      realTimeData.news.push(...results);
      console.log(`      ✓ Found ${results.length} results for: "${query.substring(0, 40)}..."`);
      await new Promise(r => setTimeout(r, 500)); // Rate limit protection
    } catch (e) {
      console.log(`      ✗ Search failed: ${query.substring(0, 40)}...`);
    }
  }
  
  // Search for market data
  console.log('   📊 Searching for market data...');
  for (const query of CONFIG.searchQueries.market) {
    try {
      const results = await performWebSearch(query, 3);
      realTimeData.market.push(...results);
      console.log(`      ✓ Found ${results.length} market insights`);
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`      ✗ Market search failed`);
    }
  }
  
  // Search for trends
  console.log('   📈 Searching for trends...');
  for (const query of CONFIG.searchQueries.trends) {
    try {
      const results = await performWebSearch(query, 3);
      realTimeData.trends.push(...results);
      console.log(`      ✓ Found ${results.length} trend signals`);
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`      ✗ Trend search failed`);
    }
  }
  
  // Combine all results
  realTimeData.allSearchResults = [
    ...realTimeData.news,
    ...realTimeData.market,
    ...realTimeData.trends
  ];
  
  // Deduplicate
  const seen = new Set();
  realTimeData.allSearchResults = realTimeData.allSearchResults.filter(item => {
    const key = (item.title + item.url).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  console.log(`   ✅ Total unique search results: ${realTimeData.allSearchResults.length}`);
  
  return realTimeData;
}

// ============================================================================
// DATA GATHERING FUNCTIONS
// ============================================================================

async function fetchCampaignData(campaignAddress) {
  console.log('\n📦 PHASE 0: Fetching Campaign Data...');
  
  if (campaignAddress && campaignAddress.startsWith('0x')) {
    try {
      const url = `${CONFIG.rallyApiBase}/campaigns/${campaignAddress}`;
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
  console.log('   ℹ️ Using default campaign data');
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
  console.log('\n🏆 PHASE 2: Fetching Leaderboard...');
  
  if (campaignAddress && campaignAddress.startsWith('0x')) {
    try {
      const url = `${CONFIG.rallyApiBase}/leaderboard?campaignAddress=${campaignAddress}&limit=20`;
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
              followers: entry.user?.xFollowersCount || 0
            })),
            stats: {
              totalCompetitors: leaderboard.length,
              avgPoints: leaderboard.reduce((sum, e) => sum + (e.points || 0), 0) / Math.max(1, leaderboard.length),
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

async function fetchProjectResearch() {
  console.log('\n📄 PHASE 1: Researching Project Websites...');
  
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
        headings: parsed.headings.slice(0, 5),
        wordCount: parsed.text.split(/\s+/).length
      });
      research.rawContent.push({
        url,
        text: parsed.text.substring(0, 2000)
      });
      
      console.log(`   ✅ Extracted ${facts.length} facts from ${url}`);
    } catch (error) {
      console.log(`   ⚠️ Failed to fetch ${url}: ${error.message}`);
    }
  }
  
  // Add known facts
  research.facts.push(
    { fact: 'Internet Court uses AI validators to evaluate evidence and deliver verdicts', source: 'knowledge_base' },
    { fact: 'Verdicts are delivered in minutes instead of months or years', source: 'knowledge_base' },
    { fact: 'Internet Court handles cross-border disputes without jurisdiction issues', source: 'knowledge_base' },
    { fact: 'Built on GenLayer infrastructure for AI-powered consensus', source: 'knowledge_base' },
    { fact: '400+ million smart contract users have no traditional legal recourse', source: 'knowledge_base' }
  );
  
  return research;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const campaignAddress = process.argv[2];
  
  console.log('\n' + '═'.repeat(70));
  console.log('RALLY DATA GATHERER V9.1.0 - REAL-TIME EDITION');
  console.log('═'.repeat(70));
  console.log(`Campaign: ${campaignAddress || 'Default (Internet Court)'}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Web Search: ${ZAI ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log('═'.repeat(70));
  
  const startTime = Date.now();
  
  // Phase 0: Campaign Data
  const campaign = await fetchCampaignData(campaignAddress);
  
  // Phase 1: Website Research
  const research = await fetchProjectResearch();
  
  // Phase 1B: Real-time Data (NEW!)
  const realTimeData = await gatherRealTimeData(campaign.data.name);
  
  // Phase 2: Leaderboard
  const leaderboard = await fetchLeaderboard(campaignAddress);
  
  // Compile output
  const output = {
    version: '9.1.0',
    timestamp: new Date().toISOString(),
    campaignAddress: campaignAddress || 'default',
    
    // Core Data
    campaign: campaign.data,
    research: research,
    leaderboard: leaderboard.data,
    
    // Real-time Data (NEW!)
    realTimeData: {
      news: realTimeData.news.slice(0, 10),
      market: realTimeData.market.slice(0, 5),
      trends: realTimeData.trends.slice(0, 5),
      totalResults: realTimeData.allSearchResults.length
    },
    
    // AI-ready summary
    summary: {
      campaignName: campaign.data.title || campaign.data.name,
      campaignGoal: campaign.data.goal,
      topFacts: research.facts.slice(0, 10),
      latestNews: realTimeData.news.slice(0, 3).map(n => n.snippet),
      marketInsights: realTimeData.market.slice(0, 2).map(m => m.snippet),
      trendingTopics: realTimeData.trends.slice(0, 2).map(t => t.title),
      competitorCount: leaderboard.data.stats?.totalCompetitors || 0,
      topCompetitorScore: leaderboard.data.stats?.topScore || 0
    },
    
    // Instructions for AI
    aiInstructions: {
      hook: 'Code Runs, Disputes Don\'t. Enter Internet Court',
      requiredUrl: 'internetcourt.org',
      minLength: 3,
      maxLength: 5,
      minScore: 9.0,
      useRealTimeData: true,
      dataFreshness: new Date().toISOString()
    },
    
    // Raw data for deep analysis
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
  
  console.log('\n' + '═'.repeat(70));
  console.log('DATA GATHERING COMPLETE');
  console.log('═'.repeat(70));
  console.log(`Execution Time: ${executionTime}s`);
  console.log(`Website Facts: ${research.facts.length}`);
  console.log(`Real-time Results: ${realTimeData.allSearchResults.length}`);
  console.log(`News Items: ${realTimeData.news.length}`);
  console.log(`Market Insights: ${realTimeData.market.length}`);
  console.log(`Trend Signals: ${realTimeData.trends.length}`);
  console.log(`Competitors: ${leaderboard.data.stats?.totalCompetitors || 0}`);
  console.log(`Output File: ${outputPath}`);
  console.log('═'.repeat(70));
  
  // Output JSON for AI consumption
  console.log('\n=== JSON OUTPUT ===');
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
