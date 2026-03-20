/**
 * RALLY DATA GATHERER V9.0.0
 * 
 * Script untuk mengumpulkan data dari Rally API dan web.
 * TIDAK memerlukan LLM - pure data fetching.
 * 
 * Output: JSON data untuk diproses oleh AI Chat
 * 
 * Usage:
 *   node scripts/rally-data-gatherer.js <campaign_address>
 *   node scripts/rally-data-gatherer.js 0x123abc...
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
  
  // Known campaign URLs for research
  projectUrls: [
    'https://internetcourt.org',
    'https://genlayer.com'
  ],
  
  // Default campaign data (fallback)
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
// DATA GATHERING FUNCTIONS
// ============================================================================

async function fetchCampaignData(campaignAddress) {
  console.log('📦 Phase 0: Fetching Campaign Data...');
  
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
  
  // Fallback to default
  console.log('   ℹ️ Using default campaign data');
  return {
    success: true,
    source: 'default',
    data: {
      address: campaignAddress,
      ...CONFIG.defaultCampaign
    }
  };
}

async function fetchLeaderboard(campaignAddress) {
  console.log('🏆 Phase 2: Fetching Leaderboard...');
  
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
  
  return {
    success: false,
    source: 'none',
    data: { top10: [], stats: {} }
  };
}

async function fetchProjectResearch() {
  console.log('🔍 Phase 1: Researching Project...');
  
  const research = {
    facts: [],
    websites: [],
    news: []
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
        headings: parsed.headings.slice(0, 5)
      });
      
      console.log(`   ✅ Extracted ${facts.length} facts from ${url}`);
    } catch (error) {
      console.log(`   ⚠️ Failed to fetch ${url}: ${error.message}`);
    }
  }
  
  // Add known facts about Internet Court
  research.facts.push(
    { fact: 'Internet Court uses AI validators to evaluate evidence and deliver verdicts', source: 'known' },
    { fact: 'Verdicts are delivered in minutes instead of months or years', source: 'known' },
    { fact: 'Internet Court handles cross-border disputes without jurisdiction issues', source: 'known' },
    { fact: 'Built on GenLayer infrastructure for AI-powered consensus', source: 'known' },
    { fact: '400+ million smart contract users have no traditional legal recourse', source: 'known' }
  );
  
  return {
    success: true,
    source: 'web_research',
    data: research
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const campaignAddress = process.argv[2];
  
  console.log('\n' + '═'.repeat(70));
  console.log('RALLY DATA GATHERER V9.0.0');
  console.log('═'.repeat(70));
  console.log(`Campaign: ${campaignAddress || 'Default (Internet Court)'}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('═'.repeat(70) + '\n');
  
  const startTime = Date.now();
  
  // Gather all data
  const campaign = await fetchCampaignData(campaignAddress);
  const research = await fetchProjectResearch();
  const leaderboard = await fetchLeaderboard(campaignAddress);
  
  // Compile output
  const output = {
    version: '9.0.0',
    timestamp: new Date().toISOString(),
    campaignAddress: campaignAddress || 'default',
    
    campaign: campaign.data,
    research: research.data,
    leaderboard: leaderboard.data,
    
    // AI-ready summary
    summary: {
      campaignName: campaign.data.title || campaign.data.name,
      campaignGoal: campaign.data.goal,
      topFacts: research.data.facts.slice(0, 10),
      competitorCount: leaderboard.data.stats?.totalCompetitors || 0,
      topCompetitorScore: leaderboard.data.stats?.topScore || 0
    },
    
    // Instructions for AI
    aiInstructions: {
      hook: 'Code Runs, Disputes Don\'t. Enter Internet Court',
      requiredUrl: 'internetcourt.org',
      minLength: 3,
      maxLength: 5,
      minScore: 9.0
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
  console.log(`Facts Gathered: ${research.data.facts.length}`);
  console.log(`Competitors: ${leaderboard.data.stats?.totalCompetitors || 0}`);
  console.log(`Output File: ${outputPath}`);
  console.log('═'.repeat(70) + '\n');
  
  // Output JSON for AI consumption
  console.log('=== JSON OUTPUT ===');
  console.log(JSON.stringify(output, null, 2));
  
  return output;
}

// Export for module usage
module.exports = { 
  fetchCampaignData, 
  fetchLeaderboard, 
  fetchProjectResearch,
  main 
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
