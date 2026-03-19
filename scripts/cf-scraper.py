#!/usr/bin/env python3
"""
Cloudflare Bypass Web Scraper - Final Version
Successfully bypasses Cloudflare protection using cloudscraper
"""

import sys
import json
import re

def fetch(url, timeout=30):
    """Fetch URL bypassing Cloudflare protection"""
    import cloudscraper
    
    try:
        scraper = cloudscraper.create_scraper(
            browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False}
        )
        response = scraper.get(url, timeout=timeout)
        
        if response.status_code != 200:
            return {'success': False, 'error': f'HTTP {response.status_code}', 'url': url}
        
        # Extract content
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove scripts and styles
            for tag in soup(['script', 'style', 'nav', 'footer', 'aside', 'iframe']):
                tag.decompose()
            
            title = soup.title.string if soup.title else ''
            
            # Get main content
            main = None
            for sel in ['article', 'main', '.content', '.post-content', '.detail-text', 'body']:
                main = soup.select_one(sel)
                if main:
                    break
            
            text = main.get_text(' ', strip=True) if main else ''
            text = ' '.join(text.split())
            
            return {
                'success': True,
                'url': url,
                'title': title,
                'content': text,
                'content_length': len(text),
                'method': 'cloudscraper',
                'status_code': response.status_code
            }
        except ImportError:
            # Fallback without BeautifulSoup
            text = re.sub(r'<script[^>]*>.*?</script>', '', response.text, flags=re.DOTALL|re.IGNORECASE)
            text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
            text = re.sub(r'<[^>]+>', ' ', text)
            text = ' '.join(text.split())
            
            return {
                'success': True,
                'url': url,
                'content': text,
                'content_length': len(text),
                'method': 'cloudscraper-raw'
            }
            
    except Exception as e:
        return {'success': False, 'error': str(e)[:300], 'url': url}

def search(query, num=10):
    """Search the web using DuckDuckGo"""
    import cloudscraper
    try:
        from bs4 import BeautifulSoup
        import requests.utils
    except ImportError:
        return {'success': False, 'error': 'BeautifulSoup required', 'query': query}
    
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
        print(json.dumps({'usage': {'read': 'python cf-scraper.py read <url>', 'search': 'python cf-scraper.py search <query>'}}, indent=2))
        sys.exit(0)
    
    cmd = sys.argv[1]
    
    if cmd == 'read' and len(sys.argv) >= 3:
        url = sys.argv[2]
        result = fetch(url)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif cmd == 'search' and len(sys.argv) >= 3:
        query = ' '.join(sys.argv[2:])
        result = search(query)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    else:
        print(json.dumps({'error': 'Invalid command'}, indent=2))
