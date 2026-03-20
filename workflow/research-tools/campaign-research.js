/**
 * Campaign Research - Simplified Direct Method
 * 
 * Script ini menjalankan research secara bertahap menggunakan
 * agent-browser CLI yang sudah terbukti bekerja
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/z/my-project/workflow/research-tools';

/**
 * Execute agent-browser command and return output
 */
function browserExec(command, timeout = 30000) {
  try {
    const fullCmd = `agent-browser ${command}`;
    const output = execSync(fullCmd, {
      encoding: 'utf-8',
      timeout,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output: output.trim() };
  } catch (error) {
    // Sometimes output is in stdout even on error
    const output = error.stdout || error.message;
    return { success: false, output: output.trim(), error: error.message };
  }
}

/**
 * Close any existing browser session
 */
function ensureBrowserClosed() {
  browserExec('close');
}

/**
 * Scrape articles from a URL
 */
function scrapeArticles(url, sourceName, maxArticles = 10) {
  console.log(`\n[SCRAPING] ${sourceName}: ${url}`);
  
  ensureBrowserClosed();
  
  // Open URL
  const openResult = browserExec(`open "${url}"`, 45000);
  if (!openResult.success) {
    console.log(`[ERROR] Failed to open ${sourceName}`);
    return [];
  }
  
  // Extract articles
  const jsCode = `Array.from(document.querySelectorAll('a[href*="/read/"]')).slice(0,${maxArticles}).map(el => ({title: el.textContent.trim().replace(/\\s+/g, ' ').substring(0,120), url: el.href, source: '${sourceName}'})).filter(a => a.title.length > 15).map(a => JSON.stringify(a)).join('\\n')`;
  
  const evalResult = browserExec(`eval "${jsCode}"`, 15000);
  
  ensureBrowserClosed();
  
  if (evalResult.success && evalResult.output) {
    // Parse JSON objects from output
    const articles = [];
    const lines = evalResult.output.split('\n');
    
    for (const line of lines) {
      try {
        // Find JSON objects
        const jsonMatch = line.match(/\{[^{}]*"title"[^{}]*\}/);
        if (jsonMatch) {
          const article = JSON.parse(jsonMatch[0]);
          if (article.title && article.url) {
            articles.push(article);
          }
        }
      } catch {
        // Skip invalid JSON
      }
    }
    
    console.log(`[OK] ${articles.length} articles from ${sourceName}`);
    return articles;
  }
  
  console.log(`[ERROR] No articles from ${sourceName}`);
  return [];
}

/**
 * Get full article content
 */
function getArticleContent(url, sourceName) {
  console.log(`\n[CONTENT] ${url.substring(0, 60)}...`);
  
  ensureBrowserClosed();
  
  const openResult = browserExec(`open "${url}"`, 30000);
  if (!openResult.success) {
    return null;
  }
  
  const jsCode = `JSON.stringify({title: document.querySelector('h1')?.textContent?.trim() || '', date: document.querySelector('.read__time, .date, time')?.textContent?.trim() || '', content: Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).filter(t => t.length > 40 && !t.includes('ADVERTISEMENT')).join(' ').substring(0, 4000)})`;
  
  const evalResult = browserExec(`eval "${jsCode}"`, 15000);
  
  ensureBrowserClosed();
  
  if (evalResult.success && evalResult.output) {
    try {
      // Find JSON in output
      const jsonMatch = evalResult.output.match(/\{[\s\S]*"content"[\s\S]*\}/);
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0]);
        content.url = url;
        content.source = sourceName;
        content.wordCount = content.content.split(/\s+/).length;
        content.fetchedAt = new Date().toISOString();
        
        console.log(`[OK] ${content.wordCount} words extracted`);
        return content;
      }
    } catch (e) {
      console.log(`[ERROR] Parse failed: ${e.message}`);
    }
  }
  
  console.log(`[ERROR] Content extraction failed`);
  return null;
}

/**
 * Filter articles by keyword
 */
function filterArticles(articles, keyword) {
  if (!keyword || keyword === 'all') return articles;
  
  const keywords = keyword.toLowerCase().split(/\s+/);
  
  return articles.filter(a => {
    const text = (a.title + ' ' + (a.summary || '')).toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });
}

/**
 * Main research function
 */
async function researchCampaign(keyword = 'politik', options = {}) {
  const startTime = Date.now();
  
  console.log('\n' + '='.repeat(70));
  console.log('  CAMPAIGN RESEARCH SYSTEM');
  console.log('  Keyword: ' + keyword);
  console.log('  Method: agent-browser CLI');
  console.log('='.repeat(70));
  
  const results = {
    meta: {
      keyword,
      startedAt: new Date().toISOString(),
      method: 'agent-browser-cli'
    },
    sources: [],
    articles: [],
    contents: []
  };
  
  // Phase 1: Scrape sources
  console.log('\n[PHASE 1] Scraping news sources...');
  
  const sources = [
    { name: 'Kompas', url: 'https://nasional.kompas.com/' },
    // Add more sources as needed
  ];
  
  let allArticles = [];
  
  for (const source of sources) {
    try {
      const articles = scrapeArticles(source.url, source.name, options.maxArticles || 15);
      allArticles.push(...articles);
      
      results.sources.push({
        name: source.name,
        url: source.url,
        articleCount: articles.length,
        status: 'success'
      });
    } catch (error) {
      console.log(`[ERROR] ${source.name}: ${error.message}`);
      results.sources.push({
        name: source.name,
        status: 'error',
        error: error.message
      });
    }
  }
  
  // Filter by keyword
  results.articles = filterArticles(allArticles, keyword);
  console.log(`\n[INFO] Total: ${allArticles.length}, Filtered: ${results.articles.length}`);
  
  // Phase 2: Get detailed content
  if (options.getDetailedContent && results.articles.length > 0) {
    console.log('\n[PHASE 2] Getting detailed content...');
    
    const maxDetailed = options.maxDetailed || 3;
    const topArticles = results.articles.slice(0, maxDetailed);
    
    for (const article of topArticles) {
      try {
        const content = getArticleContent(article.url, article.source);
        if (content && content.content) {
          results.contents.push(content);
        }
      } catch (error) {
        console.log(`[ERROR] ${error.message}`);
      }
    }
  }
  
  // Finalize
  results.meta.completedAt = new Date().toISOString();
  results.meta.duration = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
  results.meta.totalArticles = results.articles.length;
  results.meta.totalContents = results.contents.length;
  
  console.log('\n' + '='.repeat(70));
  console.log(`  COMPLETE in ${results.meta.duration}`);
  console.log(`  Articles: ${results.meta.totalArticles}, Contents: ${results.meta.totalContents}`);
  console.log('='.repeat(70));
  
  return results;
}

/**
 * Save results
 */
function saveResults(results, keyword) {
  const filename = `research-${keyword.replace(/\s+/g, '-')}-${Date.now()}.json`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n[SAVED] ${outputPath}`);
  return outputPath;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const keyword = args[0] || 'politik';
  const detailed = args.includes('--detailed');
  const maxDetailed = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1]) || 2;
  
  try {
    const results = await researchCampaign(keyword, {
      getDetailedContent: detailed,
      maxDetailed,
      maxArticles: 15
    });
    
    // Save
    const savedPath = saveResults(results, keyword);
    
    // Print summary
    console.log('\n### ARTICLES ###\n');
    results.articles.slice(0, 10).forEach((a, i) => {
      console.log(`${i + 1}. [${a.source}] ${a.title}`);
    });
    
    if (results.contents.length > 0) {
      console.log('\n### CONTENT SAMPLE ###\n');
      const sample = results.contents[0];
      console.log(`Title: ${sample.title}`);
      console.log(`Words: ${sample.wordCount}`);
      console.log(`\n${sample.content.substring(0, 400)}...`);
    }
    
    console.log(`\n### OUTPUT ###\n${savedPath}`);
    
  } catch (error) {
    console.error('[FATAL]', error);
    process.exit(1);
  } finally {
    ensureBrowserClosed();
  }
}

module.exports = { researchCampaign, saveResults, scrapeArticles, getArticleContent };

if (require.main === module) {
  main();
}
