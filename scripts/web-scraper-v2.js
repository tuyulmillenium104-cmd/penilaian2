/**
 * Enhanced Web Scraper V2
 * Combines curl + cheerio + agent-browser for maximum coverage
 * Handles both static and JavaScript-required websites
 */

const { exec } = require('child_process');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Sites that require JavaScript (use agent-browser)
const JS_REQUIRED_SITES = [
  'forbes.com',
  'investopedia.com',
  'medium.com',
  'linkedin.com',
  'bloomberg.com',
  'wsj.com',
  'nytimes.com',
  'techcrunch.com',
  'theverge.com',
  'wired.com',
  'cnbc.com',
  'businessinsider.com',
  'hbr.org',
  'kompasiana.com',
  'kalibrr.com',
  'quora.com',
  'reddit.com'
];

// Sites with Cloudflare protection (challenging)
const CLOUDFLARE_SITES = [
  'detik.com',
  'tirto.id',
  'kumparan.com',
  'tempo.co',
  'cnnindonesia.com'
];

/**
 * Check if URL requires JavaScript rendering
 */
function requiresJavaScript(url) {
  const hostname = new URL(url).hostname.replace('www.', '');
  return JS_REQUIRED_SITES.some(site => hostname.includes(site)) ||
         CLOUDFLARE_SITES.some(site => hostname.includes(site));
}

/**
 * Check if URL has Cloudflare protection
 */
function hasCloudflare(url) {
  const hostname = new URL(url).hostname.replace('www.', '');
  return CLOUDFLARE_SITES.some(site => hostname.includes(site));
}

/**
 * Fetch HTML using curl (fast, for static sites)
 */
async function fetchWithCurl(url, options = {}) {
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
 * Fetch HTML using agent-browser (for JS-required sites)
 */
async function fetchWithBrowser(url, options = {}) {
  const timeout = options.timeout || 30000;
  const waitTime = options.waitTime || 5000;
  
  return new Promise((resolve, reject) => {
    const cmd = `agent-browser open "${url}" --timeout ${timeout} && sleep ${Math.floor(waitTime/1000)} && agent-browser eval "document.documentElement.outerHTML" --json`;
    
    exec(cmd, { maxBuffer: 50 * 1024 * 1024, timeout: timeout + waitTime + 10000 }, (error, stdout, stderr) => {
      if (error) {
        // Fallback: try snapshot
        const fallbackCmd = `agent-browser snapshot -c`;
        exec(fallbackCmd, { maxBuffer: 50 * 1024 * 1024 }, (err2, stdout2, stderr2) => {
          if (err2) {
            reject(new Error(`agent-browser error: ${error.message}`));
            return;
          }
          resolve(stdout2); // Return accessibility tree
        });
        return;
      }
      resolve(stdout);
    });
  });
}

/**
 * Parse HTML and extract content
 */
function parseHtml(html, options = {}) {
  const $ = cheerio.load(html);
  
  // Remove unwanted elements
  $('script, style, nav, footer, aside, .sidebar, .nav, .menu, .advertisement, .ad, .ads, .popup, .modal').remove();
  
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
  
  // Extract main content with priority selectors
  const contentSelectors = [
    'article', 'main', '.content', '.post-content', '.article-content',
    '.entry-content', '.post-body', '.article-body', '#content', '#main',
    '.post', '.article', '.single-content'
  ];
  
  let mainContent = '';
  for (const selector of contentSelectors) {
    const el = $(selector);
    if (el.length > 0) {
      mainContent = el.text().trim();
      if (mainContent.length > 200) break; // Got substantial content
    }
  }
  
  if (!mainContent || mainContent.length < 200) {
    mainContent = $('body').text().trim();
  }
  
  // Clean content
  result.content = mainContent
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
  
  // Extract links
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && text && (href.startsWith('http') || href.startsWith('/'))) {
      result.links.push({ url: href, text: text.substring(0, 100) });
    }
  });
  
  // Extract images
  $('img[src]').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt') || '';
    if (src && (src.startsWith('http') || src.startsWith('//'))) {
      result.images.push({ url: src, alt: alt.substring(0, 100) });
    }
  });
  
  // Extract headings
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
 * Main fetch function - auto-selects best method
 */
async function fetchPage(url, options = {}) {
  const useBrowser = requiresJavaScript(url);
  
  console.error(`[INFO] Fetching: ${url}`);
  console.error(`[INFO] Method: ${useBrowser ? 'agent-browser (JS)' : 'curl (static)'}`);
  
  let html;
  let method = useBrowser ? 'browser' : 'curl';
  
  if (useBrowser) {
    try {
      html = await fetchWithBrowser(url, options);
    } catch (error) {
      console.error(`[WARN] Browser fetch failed: ${error.message}`);
      console.error(`[INFO] Falling back to curl...`);
      try {
        html = await fetchWithCurl(url, options);
        method = 'curl-fallback';
      } catch (e2) {
        return {
          success: false,
          url: url,
          error: `Both methods failed. Browser: ${error.message}, Curl: ${e2.message}`,
          method: 'failed'
        };
      }
    }
  } else {
    try {
      html = await fetchWithCurl(url, options);
    } catch (error) {
      console.error(`[WARN] Curl failed, trying browser: ${error.message}`);
      try {
        html = await fetchWithBrowser(url, options);
        method = 'browser-fallback';
      } catch (e2) {
        return {
          success: false,
          url: url,
          error: error.message,
          method: 'failed'
        };
      }
    }
  }
  
  // Parse the HTML
  const parsed = parseHtml(html, options);
  
  return {
    success: true,
    url: url,
    method: method,
    ...parsed,
    rawLength: html.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * Search using DuckDuckGo
 */
async function search(query, options = {}) {
  const numResults = options.numResults || 10;
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  
  try {
    const html = await fetchWithCurl(searchUrl, options);
    const $ = cheerio.load(html);
    
    const results = [];
    
    $('.result').each((i, el) => {
      if (results.length >= numResults) return false;
      
      const linkEl = $(el).find('.result__a').first();
      const title = linkEl.text().trim();
      let url = linkEl.attr('href') || '';
      
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
  const concurrency = options.concurrency || 2; // Lower for browser
  
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(url => fetchPage(url, options).catch(e => ({
        success: false,
        url: url,
        error: e.message
      })))
    );
    results.push(...batchResults);
    
    // Delay between batches to avoid rate limiting
    if (i + concurrency < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
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
          console.error('Usage: node web-scraper-v2.js read <url>');
          process.exit(1);
        }
        const result = await fetchPage(url);
        console.log(JSON.stringify(result, null, 2));
      }
      else if (command === 'search') {
        const query = args.slice(1).join(' ');
        if (!query) {
          console.error('Usage: node web-scraper-v2.js search <query>');
          process.exit(1);
        }
        const result = await search(query);
        console.log(JSON.stringify(result, null, 2));
      }
      else if (command === 'batch') {
        const urlsFile = args[1];
        if (!urlsFile) {
          console.error('Usage: node web-scraper-v2.js batch <urls_file.json>');
          process.exit(1);
        }
        const urls = JSON.parse(fs.readFileSync(urlsFile, 'utf8'));
        const results = await batchFetch(urls);
        console.log(JSON.stringify(results, null, 2));
      }
      else {
        console.log('Usage:');
        console.log('  node web-scraper-v2.js read <url>       - Read any webpage (auto-detects JS)');
        console.log('  node web-scraper-v2.js search <query>   - Search the web');
        console.log('  node web-scraper-v2.js batch <file>     - Batch fetch URLs from JSON file');
        console.log('');
        console.log('Features:');
        console.log('  - Auto-detects JavaScript-required sites');
        console.log('  - Uses curl for static sites (fast)');
        console.log('  - Uses agent-browser for JS sites (full rendering)');
        console.log('  - Handles Cloudflare-protected sites');
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  fetchPage,
  search,
  batchFetch,
  fetchWithCurl,
  fetchWithBrowser,
  requiresJavaScript
};
