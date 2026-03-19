/**
 * Web Research Tool V2 - Enhanced for Indonesian Political News
 * 
 * Solusi untuk research tanpa bergantung pada z-ai-web-dev-sdk
 * Menggunakan Node.js fetch + cheerio untuk web scraping
 */

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Fetch HTML dengan retry
 */
async function fetchHTML(url, timeout = 20000, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      if (i === retries) throw error;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

/**
 * Scrape Detik News Politik
 */
async function scrapeDetikPolitik() {
  const url = 'https://news.detik.com/indeks';
  console.log('[INFO] Fetching Detik News Index...');
  
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const articles = [];
    
    // Detik article structure
    $('.media.media--left.media--news, .list-content__item').each((i, el) => {
      const $el = $(el);
      const titleEl = $el.find('.media__title a, .list-content__title a').first();
      const title = titleEl.text().trim();
      const link = titleEl.attr('href');
      const date = $el.find('.media__date, .list-content__date').text().trim();
      const summary = $el.find('.media__desc, .list-content__summary').text().trim();
      
      if (title && link && title.length > 10) {
        articles.push({ title, link, date, summary, source: 'Detik News' });
      }
    });
    
    console.log(`[OK] Detik: ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.log(`[ERROR] Detik: ${error.message}`);
    return [];
  }
}

/**
 * Scrape Kompas Politik
 */
async function scrapeKompasPolitik() {
  const url = 'https://nasional.kompas.com/';
  console.log('[INFO] Fetching Kompas Nasional...');
  
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const articles = [];
    
    // Kompas article structure
    $('.article__link, .trending__link, .latest__link').each((i, el) => {
      const $el = $(el);
      const title = $el.find('.article__title, .trending__title, .latest__title').text().trim() || 
                    $el.text().trim();
      const link = $el.attr('href');
      const date = $el.find('.article__date, .trending__date').text().trim();
      
      if (title && link && title.length > 10 && title.length < 300) {
        articles.push({ 
          title: title.substring(0, 200), 
          link, 
          date, 
          source: 'Kompas' 
        });
      }
    });
    
    console.log(`[OK] Kompas: ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.log(`[ERROR] Kompas: ${error.message}`);
    return [];
  }
}

/**
 * Scrape Tempo Politik
 */
async function scrapeTempoPolitik() {
  const url = 'https://nasional.tempo.co/';
  console.log('[INFO] Fetching Tempo Nasional...');
  
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const articles = [];
    
    $('article, .card-article, .news-item, .title').each((i, el) => {
      const $el = $(el);
      const titleEl = $el.find('a').first();
      const title = titleEl.text().trim() || $el.find('h2, h3').text().trim();
      const link = titleEl.attr('href');
      
      if (title && link && title.length > 10 && title.length < 200) {
        articles.push({ title, link, source: 'Tempo' });
      }
    });
    
    console.log(`[OK] Tempo: ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.log(`[ERROR] Tempo: ${error.message}`);
    return [];
  }
}

/**
 * Get full article content
 */
async function getArticleContent(url, sourceName = '') {
  console.log(`[INFO] Fetching content: ${url.substring(0, 60)}...`);
  
  try {
    const html = await fetchHTML(url, 20000);
    const $ = cheerio.load(html);
    
    // Remove unwanted
    $('script, style, nav, footer, .ads, .advertisement, .related, .share, .comments').remove();
    
    // Extract title
    const title = $('h1').first().text().trim() ||
                  $('meta[property="og:title"]').attr('content') || '';
    
    // Extract date
    const date = $('.date, time, .article-date, .post-date').first().text().trim() ||
                 $('meta[property="article:published_time"]').attr('content') || '';
    
    // Extract content - specific selectors for each source
    let content = '';
    
    // Detik
    if (url.includes('detik')) {
      content = $('.detail__body-text, .itp_bodycontent, .detail__body').text();
    }
    // Kompas
    else if (url.includes('kompas')) {
      content = $('.read__content, .article__body, .js-read-article').text();
    }
    // Tempo
    else if (url.includes('tempo')) {
      content = $('.article-body, .detail-in, .itp_bodycontent').text();
    }
    // Generic
    else {
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 30) content += text + ' ';
      });
    }
    
    // Clean content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/ADVERTISEMENT.*?SCROLL/gi, '')
      .trim()
      .substring(0, 4000);
    
    return {
      url,
      title,
      date,
      content,
      source: sourceName,
      wordCount: content.split(/\s+/).length,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    return { url, error: error.message };
  }
}

/**
 * Comprehensive Campaign Research
 */
async function researchCampaign(keyword, options = {}) {
  console.log('\n' + '='.repeat(60));
  console.log(`[RESEARCH] Campaign Research: "${keyword}"`);
  console.log('='.repeat(60) + '\n');
  
  const startTime = Date.now();
  const results = {
    keyword,
    startedAt: new Date().toISOString(),
    sources: [],
    articles: [],
    contents: [],
    summary: null
  };
  
  // 1. Scrape news sources
  console.log('[PHASE 1] Fetching news sources...\n');
  
  const scrapers = [
    scrapeDetikPolitik,
    scrapeKompasPolitik,
    scrapeTempoPolitik
  ];
  
  const allArticles = [];
  
  for (const scraper of scrapers) {
    try {
      const articles = await scraper();
      allArticles.push(...articles);
    } catch (e) {
      console.log(`[SKIP] Scraper failed: ${e.message}`);
    }
  }
  
  results.articles = allArticles;
  console.log(`\n[INFO] Total articles collected: ${allArticles.length}`);
  
  // 2. Filter by keyword if provided
  if (keyword && keyword !== 'all') {
    const keywordLower = keyword.toLowerCase();
    const filtered = allArticles.filter(a => 
      a.title.toLowerCase().includes(keywordLower) ||
      (a.summary && a.summary.toLowerCase().includes(keywordLower))
    );
    
    if (filtered.length > 0) {
      results.articles = filtered;
      console.log(`[INFO] Filtered by keyword: ${filtered.length} articles`);
    }
  }
  
  // 3. Get detailed content for top articles
  if (options.getDetailedContent && results.articles.length > 0) {
    console.log('\n[PHASE 2] Fetching detailed content...\n');
    
    const topArticles = results.articles.slice(0, options.maxDetailed || 3);
    
    for (const article of topArticles) {
      if (article.link) {
        const content = await getArticleContent(article.link, article.source);
        if (content.content) {
          results.contents.push(content);
        }
      }
    }
  }
  
  // 4. Compile summary
  results.duration = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
  results.completedAt = new Date().toISOString();
  
  console.log('\n' + '='.repeat(60));
  console.log(`[COMPLETE] Research finished in ${results.duration}`);
  console.log(`[STATS] Sources: ${results.sources.length}, Articles: ${results.articles.length}, Contents: ${results.contents.length}`);
  console.log('='.repeat(60) + '\n');
  
  return results;
}

/**
 * Save results to file
 */
function saveResults(results, filename = 'research-results.json') {
  const outputPath = path.join('/home/z/my-project/workflow/research-tools', filename);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`[SAVED] Results saved to: ${outputPath}`);
  return outputPath;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const keyword = args[0] || 'pilpres';
  const detailed = args.includes('--detailed');
  const maxDetailed = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1]) || 3;
  
  try {
    const results = await researchCampaign(keyword, {
      getDetailedContent: detailed,
      maxDetailed
    });
    
    // Save results
    const savedPath = saveResults(results, `research-${keyword.replace(/\s+/g, '-')}.json`);
    
    // Print summary
    console.log('\n=== ARTICLES SUMMARY ===\n');
    results.articles.slice(0, 10).forEach((a, i) => {
      console.log(`${i + 1}. [${a.source}] ${a.title.substring(0, 80)}${a.title.length > 80 ? '...' : ''}`);
    });
    
    if (results.contents.length > 0) {
      console.log('\n=== DETAILED CONTENTS ===\n');
      results.contents.forEach((c, i) => {
        console.log(`\n--- Article ${i + 1}: ${c.title} ---`);
        console.log(`Source: ${c.source} | Words: ${c.wordCount}`);
        console.log(`Content preview: ${c.content.substring(0, 300)}...`);
      });
    }
    
  } catch (error) {
    console.error('[FATAL]', error);
    process.exit(1);
  }
}

module.exports = {
  fetchHTML,
  scrapeDetikPolitik,
  scrapeKompasPolitik,
  scrapeTempoPolitik,
  getArticleContent,
  researchCampaign,
  saveResults
};

if (require.main === module) {
  main();
}
