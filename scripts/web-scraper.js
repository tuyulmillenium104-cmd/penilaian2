/**
 * Web Scraper Tool
 * Alternatif untuk web-search dan web-reader tanpa X-Token
 * Menggunakan curl + cheerio untuk fetch dan parse HTML
 */

const { exec } = require('child_process');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Fetch HTML dari URL menggunakan curl
 */
async function fetchHtml(url, options = {}) {
  const timeout = options.timeout || 30000;
  const userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  return new Promise((resolve, reject) => {
    const curlCmd = `curl -s -L --max-time ${Math.floor(timeout/1000)} -A "${userAgent}" "${url}"`;
    
    exec(curlCmd, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`curl error: ${error.message}`));
        return;
      }
      resolve(stdout);
    });
  });
}

/**
 * Parse HTML dan extract konten utama
 */
function parseHtml(html, options = {}) {
  const $ = cheerio.load(html);
  
  // Remove script, style, nav, footer, sidebar
  $('script, style, nav, footer, aside, .sidebar, .nav, .menu, .advertisement, .ad, .ads').remove();
  
  const result = {
    title: '',
    meta: {},
    content: '',
    links: [],
    images: [],
    structured: {}
  };
  
  // Extract title
  result.title = $('title').text().trim() || $('h1').first().text().trim();
  
  // Extract meta tags
  $('meta').each((i, el) => {
    const name = $(el).attr('name') || $(el).attr('property') || $(el).attr('itemprop');
    const content = $(el).attr('content');
    if (name && content) {
      result.meta[name] = content;
    }
  });
  
  // Extract main content
  const contentSelectors = [
    'article', 'main', '.content', '.post-content', '.article-content',
    '.entry-content', '.post-body', '.article-body', '#content', '#main'
  ];
  
  let mainContent = '';
  for (const selector of contentSelectors) {
    const el = $(selector);
    if (el.length > 0) {
      mainContent = el.text().trim();
      break;
    }
  }
  
  if (!mainContent) {
    // Fallback to body
    mainContent = $('body').text().trim();
  }
  
  // Clean up content
  result.content = mainContent
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
  
  // Extract links
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && text && href.startsWith('http')) {
      result.links.push({ url: href, text: text.substring(0, 100) });
    }
  });
  
  // Extract images
  $('img[src]').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt') || '';
    if (src && src.startsWith('http')) {
      result.images.push({ url: src, alt: alt.substring(0, 100) });
    }
  });
  
  // Extract structured data (headings)
  result.structured.headings = [];
  $('h1, h2, h3').each((i, el) => {
    const tag = el.tagName;
    const text = $(el).text().trim();
    if (text) {
      result.structured.headings.push({ level: tag, text });
    }
  });
  
  return result;
}

/**
 * Web reader - fetch dan parse halaman web
 */
async function webReader(url, options = {}) {
  try {
    const html = await fetchHtml(url, options);
    const parsed = parseHtml(html, options);
    
    return {
      success: true,
      url: url,
      ...parsed,
      rawLength: html.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      url: url,
      error: error.message
    };
  }
}

/**
 * Simple web search menggunakan DuckDuckGo HTML version
 */
async function webSearch(query, options = {}) {
  const numResults = options.numResults || 10;
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  
  try {
    const html = await fetchHtml(searchUrl, options);
    const $ = cheerio.load(html);
    
    const results = [];
    
    // DuckDuckGo HTML results parsing
    $('.result').each((i, el) => {
      if (results.length >= numResults) return false;
      
      const linkEl = $(el).find('.result__a').first();
      const title = linkEl.text().trim();
      let url = linkEl.attr('href') || '';
      
      // DuckDuckGo uses redirect URLs, extract actual URL
      const urlMatch = url.match(/uddg=([^&]+)/);
      if (urlMatch) {
        url = decodeURIComponent(urlMatch[1]);
      }
      
      const snippet = $(el).find('.result__snippet').text().trim();
      
      if (title && url && url.startsWith('http')) {
        results.push({
          title,
          url,
          snippet,
          rank: results.length + 1
        });
      }
    });
    
    return {
      success: true,
      query: query,
      results: results,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      query: query,
      error: error.message,
      results: []
    };
  }
}

/**
 * Batch fetch multiple URLs
 */
async function batchFetch(urls, options = {}) {
  const results = [];
  const concurrency = options.concurrency || 3;
  
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(url => webReader(url, options))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  (async () => {
    try {
      if (command === 'read') {
        const url = args[1];
        if (!url) {
          console.error('Usage: node web-scraper.js read <url>');
          process.exit(1);
        }
        const result = await webReader(url);
        console.log(JSON.stringify(result, null, 2));
      }
      else if (command === 'search') {
        const query = args.slice(1).join(' ');
        if (!query) {
          console.error('Usage: node web-scraper.js search <query>');
          process.exit(1);
        }
        const result = await webSearch(query);
        console.log(JSON.stringify(result, null, 2));
      }
      else {
        console.log('Usage:');
        console.log('  node web-scraper.js read <url>      - Read and parse a web page');
        console.log('  node web-scraper.js search <query>  - Search the web');
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  fetchHtml,
  parseHtml,
  webReader,
  webSearch,
  batchFetch
};
