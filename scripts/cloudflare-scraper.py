#!/usr/bin/env python3
"""
Cloudflare Bypass Web Scraper V3
Uses cloudscraper + requests + agent-browser for maximum coverage
"""

import sys
import json
import re

def fetch_with_cloudscraper(url, timeout=25):
    """Fetch URL using cloudscraper (bypasses Cloudflare)"""
    import cloudscraper
    
    scraper = cloudscraper.create_scraper(
        browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False}
    )
    
    response = scraper.get(url, timeout=timeout)
    return response

def parse_content(html, url):
    """Extract clean content from HTML"""
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')
    except ImportError:
        # Fallback without BeautifulSoup
        text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = ' '.join(text.split())
        return {
            'title': '',
            'content': text,
            'content_length': len(text)
        }
    
    # Remove unwanted
    for tag in soup(['script', 'style', 'nav', 'footer', 'aside', 'iframe', 'noscript']):
        tag.decompose()
    
    # Get title
    title = soup.title.string if soup.title else ''
    
    # Get meta
    meta = {}
    for m in soup.find_all('meta'):
        name = m.get('name') or m.get('property')
        content = m.get('content')
        if name and content:
            meta[name] = content[:500]
    
    # Get main content
    main_content = None
    for sel in ['article', 'main', '.content', '.post-content', '.article-content', 
                '.detail-text', '.itp-bodycontent', '.text-content', 'body']:
        if sel == 'body':
            main_content = soup.body
            break
        main_content = soup.select_one(sel)
        if main_content:
            break
    
    text = main_content.get_text(separator=' ', strip=True) if main_content else ''
    text = ' '.join(text.split())
    
    # Get headings
    headings = []
    for h in soup.find_all(['h1', 'h2', 'h3'])[:20]:
        h_text = h.get_text(strip=True)
        if h_text:
            headings.append({'level': h.name, 'text': h_text})
    
    # Get links
    links = []
    for a in soup.find_all('a', href=True)[:50]:
        href = a['href']
        link_text = a.get_text(strip=True)[:100]
        if href and link_text:
            links.append({'url': href, 'text': link_text})
    
    return {
        'title': title,
        'meta': meta,
        'content': text,
        'headings': headings,
        'links': links,
        'content_length': len(text)
    }

def fetch_url(url):
    """Main fetch function with fallback"""
    result = {
        'success': False,
        'url': url,
        'method': None,
        'error': None
    }
    
    # Try cloudscraper first (handles Cloudflare)
    try:
        response = fetch_with_cloudscraper(url)
        if response.status_code == 200 and len(response.text) > 1000:
            content = parse_content(response.text, url)
            result.update(content)
            result['success'] = True
            result['method'] = 'cloudscraper'
            result['status_code'] = response.status_code
            return result
    except Exception as e:
        result['error'] = str(e)[:200]
    
    # Fallback to requests
    try:
        import requests
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=25)
        if response.status_code == 200 and len(response.text) > 1000:
            content = parse_content(response.text, url)
            result.update(content)
            result['success'] = True
            result['method'] = 'requests'
            result['status_code'] = response.status_code
            return result
    except Exception as e:
        result['error'] = str(e)[:200]
    
    return result

def search(query, num=10):
    """Search using DuckDuckGo"""
    import cloudscraper
    from bs4 import BeautifulSoup
    import requests.utils
    
    url = f"https://html.duckduckgo.com/html/?q={query}"
    
    try:
        scraper = cloudscraper.create_scraper()
        response = scraper.get(url, timeout=30)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        results = []
        for result in soup.select('.result')[:num]:
            link = result.select_one('.result__a')
            if link and link.get('href'):
                href = link['href']
                if 'uddg=' in href:
                    href = href.split('uddg=')[1].split('&')[0]
                    href = requests.utils.unquote(href)
                
                title = link.get_text(strip=True)
                snippet_el = result.select_one('.result__snippet')
                snippet = snippet_el.get_text(strip=True) if snippet_el else ''
                
                if title and href.startswith('http'):
                    results.append({
                        'title': title,
                        'url': href,
                        'snippet': snippet,
                        'rank': len(results) + 1
                    })
        
        return {'success': True, 'query': query, 'results': results}
    except Exception as e:
        return {'success': False, 'query': query, 'error': str(e), 'results': []}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({
            'usage': {
                'read': 'python cloudflare-scraper.py read <url>',
                'search': 'python cloudflare-scraper.py search <query>'
            }
        }, indent=2))
        sys.exit(0)
    
    cmd = sys.argv[1]
    
    if cmd == 'read' and len(sys.argv) >= 3:
        url = sys.argv[2]
        result = fetch_url(url)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif cmd == 'search' and len(sys.argv) >= 3:
        query = ' '.join(sys.argv[2:])
        result = search(query)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    else:
        print(json.dumps({'error': 'Invalid command'}, indent=2))
