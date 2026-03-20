#!/bin/bash
# Campaign Research Script
# Research berita politik menggunakan agent-browser

OUTPUT_DIR="/home/z/my-project/workflow/research-tools"
KEYWORD="${1:-politik}"
MAX_ARTICLES="${2:-10}"

echo "============================================================"
echo "  CAMPAIGN RESEARCH - Agent Browser Method"
echo "  Keyword: $KEYWORD"
echo "============================================================"

# Function to extract articles
extract_articles() {
    local url="$1"
    local source="$2"
    
    echo "[INFO] Fetching from $source..."
    agent-browser open "$url" 2>/dev/null
    
    # Extract article links
    agent-browser eval "Array.from(document.querySelectorAll('a[href*=\"/read/\"]')).slice(0,$MAX_ARTICLES).map(el => ({title: el.textContent.trim().replace(/\s+/g, ' ').substring(0,120), url: el.href, source: '$source'})).filter(a => a.title.length > 15).map(a => JSON.stringify(a)).join('\n')" 2>/dev/null
    
    agent-browser close 2>/dev/null
}

# Function to get article content
get_content() {
    local url="$1"
    
    echo "[INFO] Getting content from: ${url:0:60}..."
    agent-browser open "$url" 2>/dev/null
    
    agent-browser eval "JSON.stringify({title: document.querySelector('h1')?.textContent?.trim() || '', content: Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).filter(t => t.length > 40 && !t.includes('ADVERTISEMENT')).join(' ').substring(0, 3000)})" 2>/dev/null
    
    agent-browser close 2>/dev/null
}

# Main execution
echo ""
echo "[PHASE 1] Collecting headlines..."
echo ""

# Collect from multiple sources
KOMPAS_ARTICLES=$(extract_articles "https://nasional.kompas.com/" "Kompas")

echo ""
echo "=== RESULTS ==="
echo ""

# Parse and display
echo "$KOMPAS_ARTICLES" | grep -o '{.*}' | head -10 | while read -r line; do
    if [ -n "$line" ]; then
        title=$(echo "$line" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
        echo "- $title"
    fi
done

echo ""
echo "[COMPLETE] Research finished"
