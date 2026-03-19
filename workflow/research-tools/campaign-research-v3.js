/**
 * Campaign Research System V3
 * 
 * Solusi lengkap untuk research tanpa X-Token
 * Menggunakan agent-browser untuk web scraping yang reliable
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Research output directory
const OUTPUT_DIR = '/home/z/my-project/workflow/research-tools';
const RESULTS_FILE = path.join(OUTPUT_DIR, 'campaign-research-results.json');

/**
 * Run agent-browser command
 */
function runBrowser(cmd, timeout = 30000) {
  try {
    const result = execSync(`agent-browser ${cmd}`, {
      encoding: 'utf-8',
      timeout,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

/**
 * Open URL with browser
 */
function openUrl(url) {
  console.log(`[BROWSER] Opening: ${url}`);
  const result = runBrowser(`open "${url}"`, 60000);
  return result.success;
}

/**
 * Get page title
 */
function getTitle() {
  const result = runBrowser('get title');
  return result.success ? result.output.trim() : '';
}

/**
 * Get current URL
 */
function getCurrentUrl() {
  const result = runBrowser('get url');
  return result.success ? result.output.trim() : '';
}

/**
 * Evaluate JavaScript on page
 */
function evaluate(jsCode) {
  // Escape for shell
  const escaped = jsCode.replace(/"/g, '\\"');
  const result = runBrowser(`eval "${escaped}"`, 15000);
  
  if (result.success) {
    // Parse JSON output if possible
    try {
      const jsonMatch = result.output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return result.output;
    } catch {
      return result.output;
    }
  }
  return null;
}

/**
 * Close browser
 */
function closeBrowser() {
  runBrowser('close');
}

/**
 * Scrape Kompas Nasional
 */
function scrapeKompasNasional() {
  console.log('\n[SOURCE] Kompas Nasional');
  
  openUrl('https://nasional.kompas.com/');
  
  const articles = evaluate(`
    Array.from(document.querySelectorAll('a[href*="/read/"]'))
      .slice(0, 15)
      .map(el => ({
        title: el.textContent.trim().replace(/\\s+/g, ' ').substring(0, 150),
        url: el.href,
        source: 'Kompas'
      }))
      .filter(a => a.title.length > 20)
  `);
  
  closeBrowser();
  
  if (articles && Array.isArray(articles)) {
    console.log(`[OK] ${articles.length} articles from Kompas`);
    return articles;
  }
  
  console.log('[ERROR] Failed to scrape Kompas');
  return [];
}

/**
 * Scrape Detik News
 */
function scrapeDetikNews() {
  console.log('\n[SOURCE] Detik News');
  
  openUrl('https://news.detik.com/indeks');
  
  const articles = evaluate(`
    Array.from(document.querySelectorAll('a[href*="detik.com"]'))
      .filter(el => el.href.includes('/news/') || el.href.includes('/berita/'))
      .slice(0, 15)
      .map(el => ({
        title: el.textContent.trim().replace(/\\s+/g, ' ').substring(0, 150),
        url: el.href,
        source: 'Detik'
      }))
      .filter(a => a.title.length > 20)
  `);
  
  closeBrowser();
  
  if (articles && Array.isArray(articles)) {
    console.log(`[OK] ${articles.length} articles from Detik`);
    return articles;
  }
  
  console.log('[ERROR] Failed to scrape Detik');
  return [];
}

/**
 * Get full article content
 */
function getArticleContent(url, sourceName = '') {
  console.log(`\n[CONTENT] Fetching: ${url.substring(0, 60)}...`);
  
  openUrl(url);
  
  const content = evaluate(`
    (() => {
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const date = document.querySelector('.read__time, .article__date, .date, time')?.textContent?.trim() || '';
      const paragraphs = Array.from(document.querySelectorAll('p'))
        .map(p => p.textContent.trim())
        .filter(t => t.length > 40 && !t.includes('ADVERTISEMENT') && !t.includes('Baca juga'));
      return {
        title,
        date,
        content: paragraphs.join(' ').substring(0, 4000),
        wordCount: paragraphs.join(' ').split(/\\s+/).length
      };
    })()
  `);
  
  closeBrowser();
  
  if (content && content.content) {
    content.url = url;
    content.source = sourceName;
    content.fetchedAt = new Date().toISOString();
    console.log(`[OK] ${content.wordCount} words extracted`);
    return content;
  }
  
  console.log('[ERROR] Failed to extract content');
  return null;
}

/**
 * Filter articles by keyword
 */
function filterByKeyword(articles, keyword) {
  if (!keyword || keyword === 'all') return articles;
  
  const keywords = keyword.toLowerCase().split(/\s+/);
  
  return articles.filter(article => {
    const text = (article.title + ' ' + (article.summary || '')).toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });
}

/**
 * Comprehensive Campaign Research
 */
async function researchCampaign(keyword = 'politik', options = {}) {
  const startTime = Date.now();
  
  console.log('\n' + '='.repeat(70));
  console.log('  CAMPAIGN RESEARCH SYSTEM V3');
  console.log('  Keyword: ' + keyword);
  console.log('='.repeat(70));
  
  const results = {
    meta: {
      keyword,
      startedAt: new Date().toISOString(),
      version: '3.0',
      method: 'agent-browser'
    },
    sources: [],
    articles: [],
    detailedContents: [],
    summary: null
  };
  
  // Phase 1: Scrape headlines
  console.log('\n[PHASE 1] Scraping news sources...');
  
  const scrapers = [
    { name: 'Kompas', fn: scrapeKompasNasional },
    { name: 'Detik', fn: scrapeDetikNews }
  ];
  
  let allArticles = [];
  
  for (const scraper of scrapers) {
    try {
      const articles = scraper.fn();
      if (articles.length > 0) {
        allArticles.push(...articles);
        results.sources.push({
          name: scraper.name,
          articleCount: articles.length,
          status: 'success'
        });
      }
    } catch (error) {
      console.log(`[ERROR] ${scraper.name}: ${error.message}`);
      results.sources.push({
        name: scraper.name,
        status: 'error',
        error: error.message
      });
    }
  }
  
  // Filter by keyword
  results.articles = filterByKeyword(allArticles, keyword);
  console.log(`\n[INFO] Total articles: ${allArticles.length}, Filtered: ${results.articles.length}`);
  
  // Phase 2: Get detailed content
  if (options.getDetailedContent && results.articles.length > 0) {
    console.log('\n[PHASE 2] Fetching detailed content...');
    
    const maxDetailed = options.maxDetailed || 3;
    const topArticles = results.articles.slice(0, maxDetailed);
    
    for (const article of topArticles) {
      try {
        const content = getArticleContent(article.url, article.source);
        if (content) {
          results.detailedContents.push(content);
        }
      } catch (error) {
        console.log(`[ERROR] Content fetch failed: ${error.message}`);
      }
    }
  }
  
  // Finalize
  results.meta.completedAt = new Date().toISOString();
  results.meta.duration = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
  results.meta.totalArticles = results.articles.length;
  results.meta.totalContents = results.detailedContents.length;
  
  console.log('\n' + '='.repeat(70));
  console.log(`  RESEARCH COMPLETE in ${results.meta.duration}`);
  console.log(`  Sources: ${results.sources.filter(s => s.status === 'success').length}`);
  console.log(`  Articles: ${results.meta.totalArticles}`);
  console.log(`  Detailed: ${results.meta.totalContents}`);
  console.log('='.repeat(70));
  
  return results;
}

/**
 * Save results to file
 */
function saveResults(results, filename) {
  const outputPath = path.join(OUTPUT_DIR, filename || 'research-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n[SAVED] ${outputPath}`);
  return outputPath;
}

/**
 * Generate research summary
 */
function generateSummary(results) {
  const summary = {
    keyword: results.meta.keyword,
    timestamp: results.meta.completedAt,
    duration: results.meta.duration,
    statistics: {
      totalArticles: results.meta.totalArticles,
      sources: results.sources.map(s => `${s.name}: ${s.articleCount || 0}`)
    },
    topHeadlines: results.articles.slice(0, 10).map(a => ({
      title: a.title,
      source: a.source
    })),
    contentPreview: results.detailedContents[0]?.content?.substring(0, 500) || null
  };
  
  return summary;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const keyword = args[0] || 'politik';
  const detailed = args.includes('--detailed');
  const maxDetailed = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1]) || 3;
  
  try {
    const results = await researchCampaign(keyword, {
      getDetailedContent: detailed,
      maxDetailed
    });
    
    // Save results
    const filename = `research-${keyword.replace(/\s+/g, '-')}-${Date.now()}.json`;
    const savedPath = saveResults(results, filename);
    
    // Print summary
    console.log('\n### ARTICLES ###\n');
    results.articles.slice(0, 10).forEach((a, i) => {
      console.log(`${i + 1}. [${a.source}] ${a.title}`);
    });
    
    if (results.detailedContents.length > 0) {
      console.log('\n### CONTENT SAMPLE ###\n');
      const sample = results.detailedContents[0];
      console.log(`Title: ${sample.title}`);
      console.log(`Source: ${sample.source}`);
      console.log(`Words: ${sample.wordCount}`);
      console.log(`\n${sample.content.substring(0, 500)}...`);
    }
    
    console.log(`\n### SAVED TO ###\n${savedPath}`);
    
  } catch (error) {
    console.error('[FATAL]', error);
    process.exit(1);
  }
}

module.exports = {
  researchCampaign,
  saveResults,
  generateSummary,
  scrapeKompasNasional,
  scrapeDetikNews,
  getArticleContent
};

if (require.main === module) {
  main();
}
