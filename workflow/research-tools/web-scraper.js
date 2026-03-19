/**
 * Web Research Tool - Direct Web Access Without X-Token
 * 
 * Solusi untuk research tanpa bergantung pada z-ai-web-dev-sdk
 * Menggunakan Node.js fetch + cheerio untuk web scraping
 */

const cheerio = require('cheerio');

// User Agent untuk menghindari Blocking
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Fetch HTML dari URL
 */
async function fetchHTML(url, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Extract headlines dari halaman berita
 */
function extractHeadlines(html, selectors = {}) {
  const $ = cheerio.load(html);
  const headlines = [];
  
  const defaultSelectors = {
    title: 'h1, h2, h3, .title, .article-title',
    link: 'a',
    date: '.date, time, .article-date',
    summary: 'p, .summary'
  };
  
  const sel = { ...defaultSelectors, ...selectors };
  
  // Extract all links with titles
  $('a').each((i, el) => {
    const $el = $(el);
    const title = $el.text().trim();
    const link = $el.attr('href');
    
    // Filter relevant links
    if (title && title.length > 20 && title.length < 200 && link) {
      headlines.push({
        title,
        link: link.startsWith('http') ? link : null,
        source: null
      });
    }
  });
  
  return headlines.filter(h => h.link).slice(0, 20);
}

/**
 * Search news dari multiple sources
 */
async function searchNews(keyword, maxSources = 3) {
  const sources = [
    {
      name: 'Kompas',
      url: `https://www.kompas.com/`,
      searchUrl: `https://search.kompas.com/search/?q=${encodeURIComponent(keyword)}`,
      selectors: { title: '.article__title', date: '.article__date' }
    },
    {
      name: 'CNN Indonesia',
      url: `https://www.cnnindonesia.com/`,
      searchUrl: `https://www.cnnindonesia.com/search/?query=${encodeURIComponent(keyword)}`,
      selectors: { title: 'h1, h2', date: '.date' }
    }
  ];
  
  const results = [];
  
  for (const source of sources.slice(0, maxSources)) {
    try {
      console.log(`[INFO] Fetching from ${source.name}...`);
      const html = await fetchHTML(source.searchUrl || source.url, 10000);
      const headlines = extractHeadlines(html, source.selectors);
      
      results.push({
        source: source.name,
        url: source.searchUrl || source.url,
        articles: headlines.slice(0, 10),
        fetchedAt: new Date().toISOString()
      });
      
      console.log(`[OK] ${source.name}: ${headlines.length} articles`);
    } catch (error) {
      console.log(`[ERROR] ${source.name}: ${error.message}`);
      results.push({
        source: source.name,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Get article content from URL
 */
async function getArticleContent(url) {
  try {
    console.log(`[INFO] Fetching article: ${url}`);
    const html = await fetchHTML(url, 15000);
    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, nav, footer, .ads, .advertisement').remove();
    
    // Extract metadata
    const title = $('h1').first().text().trim() || 
                  $('meta[property="og:title"]').attr('content') || '';
    const date = $('.date, time, .article-date').first().text().trim() ||
                 $('meta[property="article:published_time"]').attr('content') || '';
    
    // Extract main content - get all paragraph text
    let content = '';
    $('p').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 50) {
        content += text + ' ';
      }
    });
    
    return {
      url,
      title,
      date,
      content: content.substring(0, 3000).trim(),
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    return { url, error: error.message };
  }
}

/**
 * Research campaign politik
 */
async function researchCampaignPolitik(keyword, options = {}) {
  console.log(`\n[RESEARCH] Starting research for: "${keyword}"\n`);
  
  const results = {
    keyword,
    startedAt: new Date().toISOString(),
    sources: [],
    articles: []
  };
  
  // 1. Search news
  console.log('[STEP 1] Searching news sources...');
  const newsResults = await searchNews(keyword, options.maxNewsSources || 2);
  results.sources = newsResults;
  
  // 2. Collect all articles
  for (const source of newsResults) {
    if (source.articles) {
      for (const article of source.articles.slice(0, 3)) {
        results.articles.push({
          ...article,
          source: source.source
        });
      }
    }
  }
  
  // 3. Get detailed content if requested
  if (options.getDetailedContent && results.articles.length > 0) {
    console.log('\n[STEP 2] Getting detailed content...');
    for (const article of results.articles.slice(0, 2)) {
      if (article.link) {
        const content = await getArticleContent(article.link);
        article.detailedContent = content;
      }
    }
  }
  
  results.completedAt = new Date().toISOString();
  console.log('\n[COMPLETE] Research finished!');
  
  return results;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const keyword = args[0] || 'pilpres 2024';
  const detailed = args.includes('--detailed');
  
  try {
    const results = await researchCampaignPolitik(keyword, {
      maxNewsSources: 2,
      getDetailedContent: detailed
    });
    
    console.log('\n=== RESULTS ===');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = {
  fetchHTML,
  extractHeadlines,
  searchNews,
  getArticleContent,
  researchCampaignPolitik
};

if (require.main === module) {
  main();
}
