# Rally Content Workflow V8.7.6

> **The Ultimate AI-Powered Content Creation System for Rally.fun**

A complete 24-phase content creation workflow that generates high-quality, viral-optimized Twitter/X content for crypto/Web3 campaigns on Rally.fun platform.

---

## 🚀 Quick Start

```bash
# Run with a custom hook
node scripts/rally-workflow-v8.7.6.js --hook "Your Hook Here"

# Example
node scripts/rally-workflow-v8.7.6.js --hook "Code Runs, Disputes Don't. Enter Internet Court"
```

---

## 📋 What This Workflow Does

This workflow takes a **hook** (opening statement) and generates complete Twitter/X thread content through 24 rigorous phases:

1. **Gathers Data** - Campaign info, competitor analysis, web research
2. **Creates Content** - Multi-version generation with LLM
3. **Validates Quality** - Hook, Emotion, CT scoring
4. **Optimizes** - Micro-polish, viral enhancement
5. **Delivers Output** - Ready-to-post content

---

## 📁 File Structure

```
penilaian2/
├── README.md                          # This file
├── package.json                       # Dependencies
├── package-lock.json                  # Lock file
├── scripts/
│   ├── rally-workflow-v8.7.6.js       # MAIN WORKFLOW (24 phases)
│   ├── smart-content-generator.js     # Fallback generator (rate limit handling)
│   └── llm-rate-limiter.js            # API rate limiting
└── docs/
    └── V8.7.6-DOCUMENTATION.md        # Detailed documentation
```

---

## 🔧 Requirements

- Node.js v18+
- `z-ai-web-dev-sdk` package
- `cheerio` package

```bash
npm install z-ai-web-dev-sdk cheerio
```

---

## 📥 Input

| Parameter | Required | Description |
|-----------|----------|-------------|
| `--hook` | Yes | Opening hook for the content |
| `--campaign` | Optional | Campaign ID (defaults to Internet Court) |

### Hook Requirements

The hook should be attention-grabbing. Examples:
- `"Code Runs, Disputes Don't. Enter Internet Court"`
- `"$50M vanished in seconds. No court could help."`
- `"What happens when your DAO gets rugged?"`

---

## 📤 Output

The workflow generates:

1. **JSON Report** - Complete execution log
2. **Text Content** - Ready-to-post thread
3. **Quality Scores** - Hook, Emotion, CT scores

Output location: `/home/z/my-project/download/`

---

## 🎯 24 Phases Overview

### INPUT SECTION (Data Gathering)

| Phase | Name | Description |
|-------|------|-------------|
| 0 | Campaign Fetch | Get campaign data from Rally API |
| 1 | Research | Web scraper + Web Search for external data |
| 2 | Leaderboard | Fetch current leaderboard rankings |
| 2B | Competitor Analysis | Deep LLM analysis of competitor content |

### PROCESS SECTION (Content Creation)

| Phase | Name | Description |
|-------|------|-------------|
| 3 | Gap Identification | Find content gaps in competitor landscape |
| 4 | Strategy Definition | Define content angles and approach |
| 5 | Content Generation | LLM generates multiple content versions |
| 6 | Banned Items Scan | Detect AI patterns, banned words |
| 6B | Rewrite | LLM rewrites if violations found |
| 7 | Uniqueness Check | Compare against competitors |
| 8 | Emotion Injection | Add emotional triggers via LLM |
| 9 | HES + Viral Score | Calculate Hook-Emotion-System scores |
| 9B | Viral Enhancement | Loop to improve viral potential |

### LOCK POINT

| Phase | Name | Description |
|-------|------|-------------|
| 10 | Quality Selection | Select best version (LOCKS to 1 version) |

### REFINE SECTION (Optimization)

| Phase | Name | Description |
|-------|------|-------------|
| 11 | Micro-Optimization | 5-layer polish (power words, flow, etc.) |
| 12 | Flow Polish | Improve content flow and readability |
| 12B | Gate Simulation | 16 quality gates validation |
| 13 | Benchmark Compare | Compare against real competitor data |
| 13B | Beat Top 20 | Loop to improve ranking potential |
| 14 | Final Emotion | Re-inject emotion via LLM |
| 14B | Final Polish | Last content refinement |

### OUTPUT SECTION (Delivery)

| Phase | Name | Description |
|-------|------|-------------|
| 15 | Output Generation | Format final content |
| 15B | CT Maximizer | Loop to maximize CT score |
| 15C | Campaign Compliance | Validate against campaign rules |
| 16 | Export | Save and deliver content |

---

## 📊 Quality Standards - "200% Above Rally Maximum"

### 🚦 GATE UTAMA RALLY (Min: 4/5 each)

| Gate | Range | Min Pass | Description |
|------|-------|----------|-------------|
| Content Alignment | 0-5 | **4** | Message accuracy, terminology, brand consistency, audience fit |
| Information Accuracy | 0-5 | **4** | Technical accuracy, official consistency, data accuracy, context |
| Campaign Compliance | 0-5 | **4** | Required mentions, format, style guidelines, disclosures |
| Originality & Authenticity | 0-5 | **4** | Fresh perspective, personal insights, natural language, creative expression |

### 🎯 GATE TAMBAHAN (Min: 8/8 each)

| Metric | Range | Min Pass | Description |
|--------|-------|----------|-------------|
| Engagement Potential | 0-8 | **8** | Hook effectiveness, CTA quality, structure, conversation potential |
| Technical Quality | 0-8 | **8** | Grammar, formatting, platform optimization, media integration |

### 📊 PENILAIAN INTERNAL (Min: 9/10 each)

| Metric | Range | Min Pass | Description |
|--------|-------|----------|-------------|
| Hook Score | 0-10 | **9** | Opening hook quality |
| Emotion Score | 0-10 | **9** | Emotional impact |
| CT Score | 0-10 | **9** | Call-to-action elements |
| Uniqueness Score | 0-10 | **9** | Originality vs competitors |
| Readability Score | 0-10 | **9** | Ease of reading |
| Viral Potential | 0-10 | **9** | Share-worthiness |
| **OVERALL** | 0-10 | **9** | Weighted combination |

### 📈 Overall Score Formula

```
Overall = (0.40 × Gate_Average) + (0.60 × Internal_Average)

Where:
- Gate_Average = Average of all Gate scores (normalized to 0-10)
- Internal_Average = Average of all Internal scores

Statistical Confidence = 1 - (Standard_Deviation / Mean)
```

### ✅ Pass/Fail Criteria

Content PASSES if ALL conditions are met:
- All 6 Gates ≥ minimum pass score
- All 7 Internal Metrics ≥ minimum pass score
- Overall Score ≥ 9/10

If ANY metric fails → **Regenerate content (max 3 loops)**

---

## 🔄 Loop Protection

The workflow includes intelligent looping:

| Loop Type | Max Iterations | Trigger |
|-----------|---------------|---------|
| Score Card Regeneration | 3 | Any gate or metric < minimum |
| Viral Enhancement | 2 | Viral potential < 9 |
| CT Maximizer | 2 | CT Score < 9 |
| Emotion Re-injection | 2 | Emotion Score < 9 |
| Total Regenerations | 3 | Force proceed |

---

## 🛡️ Banned Items Detection

The workflow detects and removes:

- **AI Words**: delve, leverage, realm, tapestry, paradigm, etc.
- **AI Phrases**: "picture this", "imagine a world", "lets dive in"
- **Template Markers**: "unpopular opinion", "hot take", "thread alert"
- **Smart Quotes**: Em dashes, curly quotes, ellipsis

---

## 🌐 Web Search Integration

V8.7.6 includes external data gathering:

- **Real-time News** - Latest industry trends
- **Competitor Analysis** - Current market landscape
- **Topic Research** - Subject-specific information

Search queries are auto-generated from campaign data.

---

## ⚡ Rate Limiting

Built-in rate limiting for API calls:

- **Token Bucket Algorithm** - Smooth request distribution
- **Exponential Backoff** - Smart retry on rate limit
- **Request Queue** - Priority-based execution
- **Caching** - Reduce duplicate API calls

---

## 📝 Example Usage

```javascript
// Run from command line
node scripts/rally-workflow-v8.7.6.js --hook "Code Runs, Disputes Don't. Enter Internet Court"

// Or import as module
const { runWorkflow } = require('./scripts/rally-workflow-v8.7.6.js');

const result = await runWorkflow({
  hook: "Your Hook Here",
  campaignId: "optional-campaign-id"
});
```

---

## 📈 Expected Output Format

```json
{
  "hook": "Code Runs, Disputes Don't. Enter Internet Court",
  "content": "Full thread content...",
  "scores": {
    "hook": 9,
    "emotion": 8,
    "ct": 9,
    "viral": 8
  },
  "phases": {
    "completed": 24,
    "details": {...}
  },
  "generationMethod": "full_llm",
  "timestamp": "2026-03-20T..."
}
```

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Rate limit errors | Workflow auto-retries with backoff |
| Low hook score | Check hook against HOOK_STANDARDS |
| Low CT score | Add questions, engagement hooks |
| Content drift | Phase 15C validates compliance |

---

## 📚 Documentation

For detailed documentation, see: `docs/V8.7.6-DOCUMENTATION.md`

---

## 🔥 SINGLE PROMPT FOR AI

**Copy-paste this prompt when starting a new chat:**

```
Read this GitHub repo: https://github.com/tuyulmillenium104-cmd/penilaian2

Then create Rally content with this hook: "[YOUR HOOK HERE]"

Execute the complete 24-phase workflow and return the final content with scores.
```

**Example:**
```
Read this GitHub repo: https://github.com/tuyulmillenium104-cmd/penilaian2

Then create Rally content with this hook: "Code Runs, Disputes Don't. Enter Internet Court"

Execute the complete 24-phase workflow and return the final content with scores.
```

---

## 🤝 How AI Should Use This

If you're an AI reading this:

### Step-by-Step Instructions:

1. **Read the hook** provided by user
2. **Clone/setup the repo** if needed
3. **Run the workflow**:
   ```bash
   node scripts/rally-workflow-v8.7.6.js --hook "THE HOOK FROM USER"
   ```
4. **Wait for completion** - All 24 phases will execute (may take 2-5 minutes)
5. **Return the output** to user:
   - Final content text
   - Quality scores (Hook, Emotion, CT, Viral)
   - Any important notes from execution

### CRITICAL RULES:

**DO NOT**:
- Skip phases - All 24 phases MUST execute
- Use templates - Workflow generates dynamic content via LLM
- Ignore low scores - Workflow will automatically regenerate
- Modify the workflow files - Run as-is

**MUST**:
- Execute complete workflow from Phase 0 to Phase 16
- Return all scores (Hook ≥7, Emotion ≥8, CT ≥8)
- Include the full content text ready to post
- Report any errors or warnings from execution

---

## Version History

| Version | Changes |
|---------|---------|
| V8.7.6 | **Scoring System 200% Above Rally**: Gate Utama (4/5), Gate Tambahan (8/8), Internal (9/10), Final Score Card, Statistical Confidence |
| V8.7.5 | Rate limiter, CT threshold 7/10 |
| V8.7 | 24 phases structure |

---

**Created for Rally.fun content creation campaigns**
