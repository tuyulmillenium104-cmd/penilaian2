# SKILL YANG TERSEDIA UNTUK PENINGKATAN KUALITAS KONTEN
## Rally Workflow Integration Guide

---

## 📊 RINGKASAN SKILL YANG RELEVAN

| Skill | Relevansi | Prioritas | Use Case di Rally |
|-------|-----------|-----------|-------------------|
| **web-search** | ⭐⭐⭐⭐⭐ | KRITIS | External data collection |
| **web-reader** | ⭐⭐⭐⭐⭐ | KRITIS | Deep content extraction |
| **LLM** | ⭐⭐⭐⭐⭐ | KRITIS | Content generation |
| **VLM** | ⭐⭐⭐⭐ | TINGGI | Image/tweet screenshot analysis |
| **finance** | ⭐⭐⭐⭐ | TINGGI | Market data untuk crypto campaigns |
| **image-generation** | ⭐⭐⭐ | SEDANG | Visual content creation |
| **xlsx** | ⭐⭐⭐ | SEDANG | Scoring data analysis |
| **docx** | ⭐⭐ | RENDAH | Report generation |
| **pdf** | ⭐⭐ | RENDAH | Document analysis |

---

## 🔴 KRITIS: Skill Wajib untuk Rally

### 1. WEB-SEARCH ⭐⭐⭐⭐⭐

**Lokasi Skill:** `{project_path}/skills/web-search`

**Fungsi:** Mencari informasi real-time dari web

**CLI Usage:**
```bash
# Basic search
z-ai function -n web_search -a '{"query": "crypto trends 2025"}'

# With result limit
z-ai function -n web_search -a '{"query": "DeFi news", "num": 5}'

# With recency filter
z-ai function -n web_search -a '{"query": "Bitcoin price", "recency_days": 7}'
```

**SDK Usage:**
```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function searchWeb(query, num = 10) {
  const zai = await ZAI.create();
  
  const results = await zai.functions.invoke('web_search', {
    query: query,
    num: num
  });
  
  return results; // Array of SearchFunctionResultItem
}
```

**Integration ke Rally Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1.7: EXTERNAL DATA COLLECTION                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  KONDISI                          → SEARCH QUERY                            │
│  ─────────────────────────────────────────────────────────────              │
│  Campaign involves token?         → "{token_name} price news 2025"         │
│  Gap angle = controversy?         → "{topic} legal disputes regulation"    │
│  Campaign type = protocol?        → "{protocol_name} development updates"  │
│  Market movement > 5%?            → "crypto market {direction} trend"      │
│                                                                              │
│  OUTPUT:                                                                     │
│  - Trending topics                                                           │
│  - News hooks                                                                │
│  - Competitor mentions                                                       │
│  - Market sentiment data                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Contoh Implementasi:**
```javascript
async function collectExternalData(campaign, gapAnalysis) {
  const zai = await ZAI.create();
  
  // Generate queries based on conditions
  const queries = [];
  
  if (campaign.hasToken) {
    queries.push(`${campaign.tokenName} price news 2025`);
  }
  
  if (gapAnalysis.angle === 'controversy') {
    queries.push(`${campaign.topic} legal disputes regulation 2025`);
  }
  
  // Execute searches in parallel
  const results = await Promise.all(
    queries.map(q => zai.functions.invoke('web_search', { query: q, num: 5 }))
  );
  
  return results.flat();
}
```

---

### 2. WEB-READER ⭐⭐⭐⭐⭐

**Fungsi:** Extract konten lengkap dari halaman web (lebih dalam dari search)

**CLI Usage:**
```bash
z-ai function -n web_reader -a '{"url": "https://example.com/article"}'
```

**SDK Usage:**
```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function readWebPage(url) {
  const zai = await ZAI.create();
  
  const content = await zai.functions.invoke('web_reader', {
    url: url
  });
  
  return content; // { title, content, publishTime, ... }
}
```

**Integration ke Rally Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1.7.1: DEEP CONTENT EXTRACTION                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FLOW:                                                                       │
│  1. web-search → Get top 5 URLs                                             │
│  2. web-reader → Extract full content from each URL                         │
│  3. LLM → Summarize and extract key facts                                   │
│                                                                              │
│  USE CASES:                                                                  │
│  ─────────────────────────────────────                                       │
│  - Extract official project documentation                                   │
│  - Get full article content for facts                                       │
│  - Analyze competitor's Twitter threads                                     │
│  - Read whitepaper sections                                                 │
│                                                                              │
│  OUTPUT:                                                                     │
│  - Full text content (not just snippets)                                    │
│  - Publication date                                                          │
│  - Structured data extraction                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Contoh Implementasi:**
```javascript
async function deepContentExtraction(searchResults) {
  const zai = await ZAI.create();
  
  // Extract content from top 3 URLs
  const deepContent = await Promise.all(
    searchResults.slice(0, 3).map(async (result) => {
      const content = await zai.functions.invoke('web_reader', {
        url: result.url
      });
      
      return {
        url: result.url,
        title: content.title,
        content: content.content,
        publishTime: content.publishTime
      };
    })
  );
  
  return deepContent;
}
```

---

### 3. LLM ⭐⭐⭐⭐⭐

**Fungsi:** Generate konten menggunakan Large Language Model

**CLI Usage:**
```bash
# Basic chat
z-ai chat -p "Generate a Twitter hook about DeFi"

# With system prompt
z-ai chat -p "Create content" -s "You are a crypto content expert"

# With thinking (complex reasoning)
z-ai chat -p "Analyze this..." --thinking

# Save to file
z-ai chat -p "Generate thread" -o output.json
```

**SDK Usage:**
```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function generateContent(prompt, systemPrompt) {
  const zai = await ZAI.create();
  
  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'assistant', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    thinking: { type: 'disabled' }
  });
  
  return completion.choices[0]?.message?.content;
}
```

**Integration ke Rally Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: GENERATION ENGINE                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MULTI-STEP LLM CALLS:                                                      │
│                                                                              │
│  Step 1: HOOK GENERATION                                                    │
│  ────────────────────────                                                   │
│  Input: external_facts + gap_angle + emotion_weight                         │
│  LLM Call: generate unique hook                                             │
│  Output: 60-char hook                                                       │
│                                                                              │
│  Step 2: THREAD GENERATION                                                  │
│  ──────────────────────────                                                 │
│  Input: hook + campaign_kb + structure_type                                 │
│  LLM Call: generate thread body                                             │
│  Output: 6-7 tweets                                                         │
│                                                                              │
│  Step 3: MULTI-VERSION                                                      │
│  ────────────────────                                                       │
│  Input: all previous + variation_request                                    │
│  LLM Call: generate 3-5 alternative versions                                │
│  Output: version array                                                      │
│                                                                              │
│  Step 4: SCORING ASSISTANCE                                                 │
│  ──────────────────────────                                                 │
│  Input: content + rally_criteria                                            │
│  LLM Call: predict scores for G1-G4, EP, TQ                                 │
│  Output: predicted scores                                                   │
│                                                                              │
│  Step 5: OPTIMIZATION                                                       │
│  ─────────────────                                                          │
│  Input: content + predicted_weak_scores                                     │
│  LLM Call: suggest improvements                                             │
│  Output: optimized content                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Contoh Implementasi Lengkap:**
```javascript
class RallyGenerationEngine {
  constructor() {
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  // Step 1: Generate Hook
  async generateHook(facts, gap, emotion) {
    const completion = await this.zai.chat.completions.create({
      messages: [{
        role: 'user',
        content: `Generate a Twitter hook (max 60 chars) for decentralized dispute resolution.

FACTS: ${facts.join('\n')}
ANGLE: ${gap}
EMOTION: ${emotion}

RULES:
- NO templates: 'unpopular opinion', 'hot take', 'change my mind'
- Create tension
- Optimize for reply potential

Output only the hook:`
      }],
      thinking: { type: 'disabled' }
    });
    
    return completion.choices[0]?.message?.content;
  }

  // Step 2: Generate Thread
  async generateThread(hook, facts, requirements) {
    const completion = await this.zai.chat.completions.create({
      messages: [{
        role: 'user',
        content: `Generate a 7-tweet thread.

HOOK: ${hook}
FACTS: ${facts.join('\n')}
REQUIREMENTS: ${JSON.stringify(requirements)}

Generate tweets 2-7:`
      }],
      thinking: { type: 'disabled' }
    });
    
    return completion.choices[0]?.message?.content;
  }

  // Step 3: Predict Scores
  async predictScores(content, rallyCriteria) {
    const completion = await this.zai.chat.completions.create({
      messages: [{
        role: 'user',
        content: `Score this content against Rally criteria.

CONTENT: ${content}
CRITERIA: ${JSON.stringify(rallyCriteria)}

Score G1-G4 (0-2 each), EP (0-5), TQ (0-5). Output as JSON:`
      }],
      thinking: { type: 'disabled' }
    });
    
    return JSON.parse(completion.choices[0]?.message?.content);
  }

  // Step 4: Optimize Content
  async optimizeContent(content, weakAreas) {
    const completion = await this.zai.chat.completions.create({
      messages: [{
        role: 'user',
        content: `Optimize this content for better Rally scores.

CONTENT: ${content}
WEAK AREAS: ${weakAreas.join(', ')}

Provide optimized version:`
      }],
      thinking: { type: 'disabled' }
    });
    
    return completion.choices[0]?.message?.content;
  }
}
```

---

## 🟠 TINGGI: Skill Penting untuk Campaign Crypto

### 4. FINANCE ⭐⭐⭐⭐

**Fungsi:** Mendapatkan data pasar finansial (crypto, stocks)

**CLI Usage:**
```bash
# Stock price
z-ai function -n finance -a '{"function": "quote", "symbol": "BTC"}'

# Market data
z-ai function -n finance -a '{"function": "market"}'
```

**Integration ke Rally Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1.6: MARKET CONTEXT                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FETCH:                                                                      │
│  ──────                                                                      │
│  - BTC/ETH price (24h change)                                               │
│  - Fear & Greed Index                                                       │
│  - Project token price (if applicable)                                      │
│  - Market cap trends                                                        │
│                                                                              │
│  CALCULATION:                                                                │
│  ────────────                                                                │
│  IF BTC_24h_change > 5%:                                                    │
│    emotion_weight = "greed/fomo"                                            │
│    content_angle = "opportunity"                                            │
│                                                                              │
│  IF BTC_24h_change < -5%:                                                   │
│    emotion_weight = "fear"                                                  │
│    content_angle = "reassurance"                                            │
│                                                                              │
│  IF token_price trend aligned:                                              │
│    G1_score_boost = +0.5                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Contoh Implementasi:**
```javascript
async function getMarketContext(campaign) {
  const zai = await ZAI.create();
  
  // Get BTC price
  const btcData = await zai.functions.invoke('finance', {
    function: 'quote',
    symbol: 'BTC'
  });
  
  // Get project token if exists
  let tokenData = null;
  if (campaign.tokenSymbol) {
    tokenData = await zai.functions.invoke('finance', {
      function: 'quote',
      symbol: campaign.tokenSymbol
    });
  }
  
  // Calculate emotion weight
  const btcChange = btcData.changePercent24h;
  let emotionWeight = 'neutral';
  
  if (btcChange > 5) emotionWeight = 'greed';
  else if (btcChange < -5) emotionWeight = 'fear';
  
  return {
    btcPrice: btcData.price,
    btcChange: btcChange,
    tokenPrice: tokenData?.price,
    emotionWeight: emotionWeight
  };
}
```

---

### 5. VLM (Vision Language Model) ⭐⭐⭐⭐

**Fungsi:** Analisis gambar, video, dan dokumen

**CLI Usage:**
```bash
# Analyze image from URL
z-ai vision -p "Describe this image" -i "https://example.com/image.png"

# Analyze local image
z-ai vision -p "What's in this screenshot?" -i "./screenshot.png"

# Multiple images
z-ai vision -p "Compare these" -i "./img1.png" -i "./img2.png"

# With thinking
z-ai vision -p "Analyze this chart" -i "./chart.png" --thinking
```

**Integration ke Rally Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1.5: LEADERBOARD ANALYSIS (Enhanced)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USE CASES:                                                                  │
│  ────────────                                                                │
│  1. Analyze tweet screenshots from leaderboard                              │
│     - Extract text content                                                  │
│     - Identify hook patterns                                                │
│     - Analyze engagement metrics shown                                      │
│                                                                              │
│  2. Analyze infographics from competitors                                   │
│     - What visuals work?                                                    │
│     - Color schemes, layouts                                                │
│                                                                              │
│  3. Read charts/graphs from project docs                                    │
│     - Extract data points                                                   │
│     - Use as facts in content                                               │
│                                                                              │
│  FLOW:                                                                       │
│  ──────                                                                      │
│  Tweet Screenshot → VLM Analysis → Pattern Extraction → Gap Identification │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Contoh Implementasi:**
```javascript
async function analyzeTweetScreenshot(imageUrl) {
  const zai = await ZAI.create();
  
  const response = await zai.chat.completions.createVision({
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: `Analyze this tweet screenshot for:
1. Hook type used
2. Emotional tone
3. Content angle
4. Engagement metrics visible
5. What makes it engaging?

Output as JSON.` },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    }],
    thinking: { type: 'disabled' }
  });
  
  return JSON.parse(response.choices[0]?.message?.content);
}

async function analyzeCompetitorScreenshots(screenshots) {
  const analyses = await Promise.all(
    screenshots.map(url => analyzeTweetScreenshot(url))
  );
  
  // Find patterns
  const hookTypes = analyses.map(a => a.hook_type);
  const gaps = findMissingHooks(hookTypes);
  
  return { analyses, gaps };
}
```

---

### 6. IMAGE-GENERATION ⭐⭐⭐

**Fungsi:** Generate gambar dari text prompt

**CLI Usage:**
```bash
# Generate image
z-ai-generate --prompt "A futuristic crypto courtroom" --output "./court.png"

# With size
z-ai-generate -p "DeFi infographic" -o "./infographic.png" -s 1344x768
```

**Available Sizes:**
- 1024x1024 (square)
- 768x1344 (portrait)
- 1344x768 (landscape)
- 864x1152, 1152x864, 1440x720, 720x1440

**Integration ke Rally Workflow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ENHANCEMENT: VISUAL CONTENT                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USE CASES:                                                                  │
│  ────────────                                                                │
│  1. Generate infographic for tweet                                          │
│     - Statistics visualization                                              │
│     - Process flow diagram                                                  │
│                                                                              │
│  2. Create meme-style image                                                 │
│     - Controversial take visualization                                      │
│     - Reaction image                                                        │
│                                                                              │
│  3. Brand visuals                                                           │
│     - Project logo integration                                              │
│     - Consistent visual identity                                            │
│                                                                              │
│  NOTE: Images are NOT scored by Rally, but can increase engagement!         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Contoh Implementasi:**
```javascript
async function generateThreadVisual(hook, facts) {
  const zai = await ZAI.create();
  
  // Generate image for tweet
  const response = await zai.images.generations.create({
    prompt: `Create a minimalist, professional infographic about decentralized dispute resolution. 
Style: Modern, clean, crypto-themed with blue and purple gradients.
Include: Justice scales made of code, blockchain elements.
Text overlay: "${hook}"
Format: Twitter-compatible aspect ratio.`,
    size: '1344x768'
  });
  
  // Save image
  const imageBuffer = Buffer.from(response.data[0].base64, 'base64');
  // ... save to file
  
  return response.data[0].base64;
}
```

---

## 🟡 SEDANG: Skill Pendukung

### 7. XLSX ⭐⭐⭐

**Fungsi:** Analisis dan visualisasi data scoring

**Use Cases:**
- Track scoring trends across campaigns
- Analyze what content performs best
- Create scoring dashboard

### 8. DOCX / PDF ⭐⭐

**Fungsi:** Generate reports dan dokumentasi

**Use Cases:**
- Campaign execution reports
- Workflow documentation
- Performance analysis

---

## 📊 SKILL INTEGRATION MATRIX

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RALLY WORKFLOW V8.0 - COMPLETE SKILL INTEGRATION         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 0: PRE-WORKFLOW                                                       │
│  └── (No external skills)                                                   │
│                                                                              │
│  PHASE 1: CAMPAIGN RESEARCH                                                  │
│  └── Rally API (internal)                                                   │
│                                                                              │
│  PHASE 1.5: LEADERBOARD ANALYSIS                                            │
│  ├── VLM ────────────→ Analyze tweet screenshots                           │
│  └── LLM ────────────→ Pattern extraction                                   │
│                                                                              │
│  PHASE 1.6: MARKET CONTEXT                                                   │
│  └── FINANCE ────────→ BTC/ETH prices, Fear & Greed                        │
│                                                                              │
│  PHASE 1.7: EXTERNAL DATA COLLECTION                                        │
│  ├── WEB-SEARCH ─────→ Find trending topics, news                          │
│  └── WEB-READER ─────→ Extract full content from URLs                      │
│                                                                              │
│  PHASE 2: KNOWLEDGE BASE                                                     │
│  └── LLM ────────────→ Summarize & extract facts                           │
│                                                                              │
│  PHASE 3: GENERATION ENGINE                                                  │
│  ├── LLM ────────────→ Generate hook, thread, CTA                          │
│  └── IMAGE-GEN ──────→ Create visual content (optional)                    │
│                                                                              │
│  PHASE 4-11: ENHANCEMENT                                                     │
│  └── LLM ────────────→ Iterative optimization                              │
│                                                                              │
│  PHASE 12: QUALITY SCORING                                                   │
│  └── LLM ────────────→ Predict scores, identify weak areas                 │
│                                                                              │
│  PHASE 13: ITERATIVE REFINEMENT                                             │
│  └── LLM ────────────→ Suggest improvements                                │
│                                                                              │
│  PHASE 14-19: POST-SUBMIT                                                    │
│  ├── XLSX ───────────→ Track performance                                   │
│  └── DOCX/PDF ───────→ Generate reports                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 REKOMENDASI IMPLEMENTASI

### Prioritas 1 (Wajib):
1. **LLM** - Core generation engine
2. **WEB-SEARCH** - External data collection

### Prioritas 2 (Penting):
3. **WEB-READER** - Deep content extraction
4. **FINANCE** - Market context for crypto

### Prioritas 3 (Enhancement):
5. **VLM** - Image/screenshot analysis
6. **IMAGE-GENERATION** - Visual content

### Prioritas 4 (Support):
7. **XLSX** - Data tracking
8. **DOCX/PDF** - Reporting

---

## ✅ KESIMPULAN

Untuk Rally Workflow V8.0 yang optimal, diperlukan minimal:

| Skill | Role |
|-------|------|
| **LLM** | Generation Engine (hook, thread, optimization) |
| **WEB-SEARCH** | External data collection |
| **WEB-READER** | Deep content extraction |
| **FINANCE** | Market context (untuk campaign crypto) |
| **VLM** | Competitor analysis dari screenshots |

Dengan kombinasi skill ini, workflow dapat:
- ✅ Fetch external data kondisional
- ✅ Generate konten unik (tanpa template)
- ✅ Adaptasi ke market conditions
- ✅ Analyze competitor patterns
- ✅ Predict dan optimize scores

---

**END OF SKILL GUIDE**
