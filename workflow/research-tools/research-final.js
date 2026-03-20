/**
 * Campaign Research - Final Version
 * 
 * Menggunakan pendekatan langsung dengan parsing output sederhana
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/z/my-project/workflow/research-tools';

/**
 * Run agent-browser command synchronously
 */
function runBrowserCmd(cmd, timeout = 45000) {
  try {
    const result = execSync(`agent-browser ${cmd}`, {
      encoding: 'utf-8',
      timeout,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result;
  } catch (e) {
    return e.stdout || e.message || '';
  }
}

/**
 * Scrape articles from Kompas
 */
function scrapeKompas(maxArticles = 15) {
  console.log('\n[SOURCE] Kompas Nasional');
  
  // Open
  runBrowserCmd('open "https://nasional.kompas.com/"');
  
  // Get articles
  const output = runBrowserCmd(`eval "Array.from(document.querySelectorAll('a[href*=\\"/read/\\"')).slice(0,${maxArticles}).map(el => el.textContent.trim().replace(/\\\\s+/g, ' ').substring(0,100) + '|' + el.href).join('~~~')"`);
  
  // Close
  runBrowserCmd('close');
  
  // Parse output
  const articles = [];
  const lines = output.split('~~~');
  
  for (const line of lines) {
    const parts = line.split('|https://');
    if (parts.length >= 2) {
      const title = parts[0].replace(/"/g, '').trim().replace(/\s+/g, ' ');
      const url = 'https://' + parts[1].trim();
      
      if (title.length > 15 && url.includes('kompas.com/read')) {
        articles.push({ title, url, source: 'Kompas' });
      }
    }
  }
  
  console.log(`[OK] ${articles.length} articles`);
  return articles;
}

/**
 * Get article content
 */
function getArticleContent(url, sourceName) {
  console.log(`\n[CONTENT] ${url.substring(0, 50)}...`);
  
  runBrowserCmd(`open "${url}"`);
  
  const output = runBrowserCmd(`eval "document.querySelector('h1')?.textContent?.trim() + '|||' + Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).filter(t => t.length > 40 && !t.includes('ADVERTISEMENT')).join(' ')"`);
  
  runBrowserCmd('close');
  
  const parts = output.split('|||');
  if (parts.length >= 2) {
    const title = parts[0].replace(/"/g, '').trim();
    const content = parts[1].replace(/"/g, '').trim().substring(0, 4000);
    const wordCount = content.split(/\s+/).length;
    
    console.log(`[OK] ${wordCount} words`);
    
    return {
      url,
      title,
      content,
      wordCount,
      source: sourceName,
      fetchedAt: new Date().toISOString()
    };
  }
  
  console.log('[ERROR] Parse failed');
  return null;
}

/**
 * Main research function
 */
async function research(keyword = 'politik', options = {}) {
  const startTime = Date.now();
  
  console.log('\n' + '='.repeat(60));
  console.log(`  CAMPAIGN RESEARCH: "${keyword}"`);
  console.log('='.repeat(60));
  
  const results = {
    keyword,
    startedAt: new Date().toISOString(),
    articles: [],
    contents: [],
    sources: []
  };
  
  // Phase 1: Get headlines
  console.log('\n[PHASE 1] Collecting headlines...');
  
  const articles = scrapeKompas(options.maxArticles || 15);
  
  // Filter by keyword
  if (keyword && keyword !== 'all') {
    const keywords = keyword.toLowerCase().split(/\s+/);
    results.articles = articles.filter(a => 
      keywords.some(kw => a.title.toLowerCase().includes(kw))
    );
  } else {
    results.articles = articles;
  }
  
  results.sources.push({ name: 'Kompas', count: articles.length });
  
  console.log(`\n[INFO] Total: ${articles.length}, Filtered: ${results.articles.length}`);
  
  // Phase 2: Get detailed content
  if (options.getDetailedContent && results.articles.length > 0) {
    console.log('\n[PHASE 2] Getting detailed content...');
    
    const max = options.maxDetailed || 2;
    for (const article of results.articles.slice(0, max)) {
      const content = getArticleContent(article.url, article.source);
      if (content) {
        results.contents.push(content);
      }
    }
  }
  
  // Finalize
  results.duration = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
  results.completedAt = new Date().toISOString();
  
  console.log('\n' + '='.repeat(60));
  console.log(`  COMPLETE in ${results.duration}`);
  console.log('='.repeat(60));
  
  return results;
}

/**
 * Save results
 */
function save(results, keyword) {
  const file = path.join(OUTPUT_DIR, `research-${keyword}-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(results, null, 2));
  return file;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const keyword = args[0] || 'politik';
  const detailed = args.includes('--detailed');
  const maxDetailed = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1]) || 2;
  
  try {
    const results = await research(keyword, {
      getDetailedContent: detailed,
      maxDetailed,
      maxArticles: 15
    });
    
    const outputPath = save(results, keyword);
    
    console.log('\n### ARTICLES ###\n');
    results.articles.slice(0, 10).forEach((a, i) => {
      console.log(`${i + 1}. ${a.title}`);
    });
    
    if (results.contents.length > 0) {
      console.log('\n### CONTENT PREVIEW ###\n');
      const c = results.contents[0];
      console.log(`Title: ${c.title}`);
      console.log(`Words: ${c.wordCount}`);
      console.log(`\n${c.content.substring(0, 300)}...`);
    }
    
    console.log(`\n### SAVED: ${outputPath} ###`);
    
  } catch (error) {
    console.error('[ERROR]', error);
    runBrowserCmd('close');
  }
}

module.exports = { research, save, scrapeKompas, getArticleContent };

if (require.main === module) {
  main();
}
