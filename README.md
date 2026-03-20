# RALLY CONTENT WORKFLOW V9.1.1 - REAL-TIME EDITION

> **Versi:** V9.1.1 Real-Time Edition  
> **Fitur Baru:** Web Search API + Dynamic Campaign + Banned Words + 16 Gates  
> **Total Phases:** 24 phases (dikelompokkan jadi 2 groups)

---

## 🆕 APA YANG BARU DI V9.1.1?

| Feature | V9.0.0 | V9.1.0 | V9.1.1 |
|---------|--------|--------|--------|
| Data dari Rally API | ✅ | ✅ | ✅ |
| Data dari Website Scrape | ✅ | ✅ | ✅ |
| Real-time Web Search | ❌ | ✅ | ✅ |
| News & Trends Data | ❌ | ✅ | ✅ |
| **Dynamic Hook/URL** | ❌ | ❌ | ✅ **FIXED** |
| **Comprehensive Fallback** | ❌ | ⚠️ Minimal | ✅ **FIXED** |
| **Banned Words List** | ❌ | ❌ | ✅ **NEW** |
| **16 Gates Definition** | ❌ | ❌ | ✅ **NEW** |
| **Detailed AI Instructions** | ❌ | ⚠️ Basic | ✅ **FIXED** |

---

## 🎯 ARSITEKTUR V9.1.1

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     RALLY WORKFLOW V9.1.1 - REAL-TIME EDITION               │
│                            Total: 24 PHASES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│  GROUP 1: DATA GATHERING (Script Node.js) - Phase 0-2                      │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  Phase 0: Campaign Data Fetch                                               │
│  ├── HTTP GET Rally API                                                    │
│  ├── Extract: title, goal, rules, style, missions, HOOK, URL               │
│  └── LLM: ❌ TIDAK DIPERLUKAN                                              │
│                                                                             │
│  Phase 1: Project Website Research                                          │
│  ├── Web scraping project URLs                                             │
│  ├── Extract facts dari HTML                                               │
│  └── LLM: ❌ TIDAK DIPERLUKAN                                              │
│                                                                             │
│  Phase 1B: Real-Time Data Gathering ⭐ BARU                                 │
│  ├── Web Search API (z-ai-web-dev-sdk)                                     │
│  ├── Search: News, Market, Trends, Competitors                             │
│  └── LLM: ❌ TIDAK DIPERLUKAN (API call)                                   │
│                                                                             │
│  Phase 2: Leaderboard Fetch                                                 │
│  ├── HTTP GET Rally Leaderboard API                                        │
│  ├── Output: top competitors, stats, basic patterns                        │
│  └── LLM: ❌ TIDAK DIPERLUKAN                                              │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  OUTPUT: JSON file dengan SEMUA data + INSTRUKSI LENGKAP untuk AI Chat     │
│  Termasuk: bannedWords, gatesDefinition, workflowPhases                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                              │                                              │
│                              ▼                                              │
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│  GROUP 2: CONTENT PROCESSING (AI Chat) - Phase 2B + 3-16                   │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ PHASE 2B: COMPETITOR DEEP ANALYSIS (AI Chat) ⭐ PINDAH KE AI CHAT     │ │
│  │                                                                       │ │
│  │ Analyze competitor data from JSON:                                    │ │
│  │ ├── Hook patterns yang sering digunakan                              │ │
│  │ ├── CTA styles yang efektif                                          │ │
│  │ ├── Content gaps yang bisa diisi                                     │ │
│  │ └── Unique angles yang belum dieksplorasi                            │ │
│  │                                                                       │ │
│  │ LLM: ✅ WAJIB (deep pattern analysis butuh LLM)                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ SUB-GROUP 2A: CONTENT CREATION (Phase 3-10)                           │ │
│  │                                                                       │ │
│  │  Phase 3: Gap Identification        LLM: ❌                           │ │
│  │  Phase 4: Strategy Definition       LLM: ❌                           │ │
│  │  Phase 5: Content Generation ⭐     LLM: ✅ CORE                      │ │
│  │  Phase 6: Banned Items Scanner      LLM: ❌ (check bannedWords)       │ │
│  │  Phase 6B: Rewrite (if violations)  LLM: ✅                           │ │
│  │  Phase 7: Uniqueness Validation     LLM: ❌                           │ │
│  │  Phase 8: Emotion Injection ⭐      LLM: ✅ CORE                      │ │
│  │  Phase 9: HES + Viral Scoring       LLM: ❌                           │ │
│  │  Phase 9B: Viral Enhancement        LLM: ✅                           │ │
│  │  Phase 10: Quality Selection        LLM: ❌                           │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ SUB-GROUP 2B: REFINEMENT (Phase 11-14B)                               │ │
│  │                                                                       │ │
│  │  Phase 11: Micro-Optimization       LLM: ❌                           │ │
│  │  Phase 12: Flow Polish              LLM: ❌                           │ │
│  │  Phase 12B: 16 Gates Simulation     LLM: ❌ (use gatesDefinition)     │ │
│  │  Phase 13: Benchmark Comparison     LLM: ❌                           │ │
│  │  Phase 13B: Beat Top 20 Strategy    LLM: ✅                           │ │
│  │  Phase 14: Final Emotion Check ⭐   LLM: ✅ CORE                      │ │
│  │  Phase 14B: Final Polish            LLM: ❌                           │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ SUB-GROUP 2C: OUTPUT (Phase 15-16)                                    │ │
│  │                                                                       │ │
│  │  Phase 15: Output Format            LLM: ❌                           │ │
│  │  Phase 15B: CT Maximizer            LLM: ✅                           │ │
│  │  Phase 16: Export + SCORE CARD      LLM: ❌                           │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 PHASE BREAKDOWN (LENGKAP)

| Phase | Nama | Lokasi | LLM? | Penjelasan |
|-------|------|--------|------|------------|
| **0** | Campaign Fetch | Script | ❌ | HTTP GET ke Rally API |
| **1** | Website Research | Script | ❌ | Scrape HTML dari project URLs |
| **1B** | **Real-Time Search** ⭐ | Script | ❌ | Web Search API untuk data terkini |
| **2** | Leaderboard Fetch | Script | ❌ | HTTP GET leaderboard data |
| **2B** | **Competitor Deep Analysis** | **AI Chat** | ✅ | **⭐ Deep pattern analysis** |
| 3 | Gap Identification | AI Chat | ❌ | Algoritma comparison |
| 4 | Strategy Definition | AI Chat | ❌ | Algoritma scoring |
| **5** | **Content Generation** | AI Chat | ✅ | **⭐ CORE - LLM WAJIB** |
| 6 | Banned Scanner | AI Chat | ❌ | Check `bannedWords` array |
| 6B | Rewrite | AI Chat | ✅ | Jika ada violations |
| 7 | Uniqueness Check | AI Chat | ❌ | Similarity algorithm |
| **8** | **Emotion Injection** | AI Chat | ✅ | **⭐ CORE - LLM WAJIB** |
| 9 | HES + Viral Score | AI Chat | ❌ | Mathematical calculation |
| 9B | Viral Enhancement | AI Chat | ✅ | LLM untuk improvement |
| 10 | Quality Selection | AI Chat | ❌ | Scoring algorithm |
| 11 | Micro-Optimization | AI Chat | ❌ | Text processing |
| 12 | Flow Polish | AI Chat | ❌ | Text processing |
| 12B | Gate Simulation | AI Chat | ❌ | Use `gatesDefinition` |
| 13 | Benchmark | AI Chat | ❌ | Data comparison |
| 13B | Beat Top 20 | AI Chat | ✅ | LLM untuk strategy |
| **14** | **Final Emotion** | AI Chat | ✅ | **⭐ CORE - LLM WAJIB** |
| 14B | Final Polish | AI Chat | ❌ | Text cleanup |
| 15 | Output Format | AI Chat | ❌ | Formatting |
| 15B | CT Maximizer | AI Chat | ✅ | LLM untuk CT enhancement |
| 16 | Export | AI Chat | ❌ | File writing |

### Ringkasan LLM Requirement:
| Kategori | Phases | Keterangan |
|----------|--------|------------|
| **WAJIB LLM** | 2B, 5, 8, 14 | Core content creation |
| **Perlu LLM** | 6B, 9B, 13B, 15B | Conditional/enhancement |
| **Tidak Perlu LLM** | 0, 1, 1B, 2, 3, 4, 6, 7, 9, 10, 11, 12, 12B, 13, 14B, 15, 16 | Algoritma/data fetching |

---

## 📋 APA YANG ADA DI OUTPUT JSON?

### 1. Campaign Data (Dynamic)
```json
"campaign": {
  "name": "Internet Court",
  "goal": "...",
  "baseUrl": "internetcourt.org",
  "hook": "Code Runs, Disputes Don't. Enter Internet Court",
  "tags": ["blockchain", "AI", "justice"]
}
```

### 2. Real-Time Data
```json
"realTimeData": {
  "news": [...],
  "market": [...],
  "trends": [...],
  "competitors": [...],
  "searchStatus": "ENABLED"
}
```

### 3. Banned Words List ⭐ NEW
```json
"aiInstructions": {
  "bannedWords": [
    "guaranteed", "guarantee", "100%", "risk-free",
    "financial advice", "investment advice", "buy now",
    "get rich", "quick money", "easy money",
    "follow me", "subscribe to my", "click here",
    "legally binding", "court order", "official ruling"
  ]
}
```

### 4. 16 Gates Definition ⭐ NEW
```json
"aiInstructions": {
  "gatesDefinition": {
    "gateUtama": {
      "name": "Gate Utama",
      "maxScore": 5,
      "minScore": 4,
      "gates": [
        { "id": 1, "name": "URL Presence", "desc": "Required URL must be present" },
        { "id": 2, "name": "Hook Quality", "desc": "Opening hook must be engaging" },
        { "id": 3, "name": "Content Length", "desc": "3-5 tweets (240-400 chars each)" },
        { "id": 4, "name": "CTA Present", "desc": "Clear call-to-action" },
        { "id": 5, "name": "Topic Relevance", "desc": "Content matches campaign topic" }
      ]
    },
    "gateTambahan": {
      "name": "Gate Tambahan",
      "maxScore": 8,
      "minScore": 8,
      "gates": [
        { "id": 6, "name": "No Banned Words" },
        { "id": 7, "name": "Unique Hook" },
        { "id": 8, "name": "Emotional Appeal" },
        { "id": 9, "name": "Educational Value" },
        { "id": 10, "name": "Viral Potential" },
        { "id": 11, "name": "Authentic Voice" },
        { "id": 12, "name": "Proper Formatting" },
        { "id": 13, "name": "Engagement Hook" }
      ]
    },
    "penilaianInternal": {
      "name": "Penilaian Internal",
      "maxScore": 10,
      "minScore": 9,
      "criteria": [
        "Originality and creativity",
        "Depth of insight",
        "Quality of writing",
        "Emotional resonance",
        "Viral coefficient potential"
      ]
    }
  }
}
```

### 5. Workflow Phases ⭐ NEW
```json
"aiInstructions": {
  "workflowPhases": {
    "group2": {
      "name": "Content Processing (AI Chat)",
      "phases": [
        { "phase": "2B", "name": "Competitor Deep Analysis", "llm": true },
        { "phase": 3, "name": "Gap Identification", "llm": false },
        ...
      ]
    }
  }
}
```

---

## 🚀 CARA PENGGUNAAN

### Step 1: Data Gathering (Script)
```bash
# Dengan campaign address
node scripts/rally-data-gatherer.js 0x123abc...

# Tanpa address (default: Internet Court)
node scripts/rally-data-gatherer.js
```

### Step 2: Content Processing (AI Chat)

**PENTING:** AI Chat baru harus menjalankan workflow lengkap. Copy-paste JSON output dengan prompt ini:

```
Saya ingin membuat konten Rally.fun menggunakan data berikut.

[PASTE JSON OUTPUT DARI STEP 1]

JIKA JSON TIDAK ADA, JALANKAN DULU:
git clone https://github.com/tuyulmillenium104-cmd/penilaian2
cd penilaian2 && git checkout v9.0.0-hybrid
node scripts/rally-data-gatherer.js

---

SETIAP JSON SUDAH BERISI SEMUA YANG KAMU BUTUHKAN:

1. CAMPAIGN DATA:
   - aiInstructions.hook = hook yang harus digunakan
   - aiInstructions.requiredUrl = URL yang harus ada di konten
   - aiInstructions.campaignName = nama campaign

2. CONTENT REQUIREMENTS:
   - aiInstructions.requirements.gates = target score
   - aiInstructions.bannedWords = kata-kata yang DILARANG

3. 16 GATES DEFINITION:
   - aiInstructions.gatesDefinition = detail setiap gate

4. WORKFLOW PHASES:
   - aiInstructions.workflowPhases = semua phase yang harus dijalankan

---

JALANKAN WORKFLOW LENGKAP:

PHASE 2B: Competitor Deep Analysis (LLM)
├── Analyze leaderboard.top10[].content
├── Analyze realTimeData.competitors
├── Find hook patterns, CTA styles, content gaps
└── Output: unique angles yang bisa diambil

PHASE 3: Gap Identification
├── Compare vs competitor patterns
└── Output: opportunity gaps

PHASE 4: Strategy Definition
├── Select hook type based on gaps
├── Define emotion target
└── Output: content strategy

PHASE 5: Content Generation ⭐ CORE (LLM)
├── Generate 3-5 content versions
├── Each: 3-5 tweets, 240-400 chars each
├── Include: hook, requiredUrl, CTA
└── Output: content versions array

PHASE 6: Banned Items Scanner
├── Check each version against bannedWords
└── Output: violations list (if any)

PHASE 6B: Rewrite (if violations found)
├── Fix violations using LLM
└── Output: clean content

PHASE 7: Uniqueness Validation
├── Compare vs competitor content patterns
├── Calculate similarity score
└── Output: uniqueness score per version

PHASE 8: Emotion Injection ⭐ CORE (LLM)
├── Enhance emotional appeal
├── Add emotional triggers
└── Output: emotion-enhanced content

PHASE 9: HES + Viral Scoring
├── Calculate Emotional Score
├── Calculate Viral Score
└── Output: scores per version

PHASE 9B: Viral Enhancement (if score < 0.6)
├── Improve viral elements
└── Output: enhanced content

PHASE 10: Quality Selection 🔒 LOCK
├── Score all versions
├── Select highest scoring version
└── Output: selected content

PHASE 11: Micro-Optimization
├── Word-level optimization
├── Sentence-level optimization
├── Character-level optimization
└── Output: optimized content

PHASE 12: Flow Polish
├── Smooth transitions
└── Output: polished content

PHASE 12B: 16 Gates Simulation
├── Validate all gates from gatesDefinition
├── Score each gate
└── Output: gate results

PHASE 13: Benchmark Comparison
├── Compare vs leaderboard data
└── Output: benchmark score

PHASE 13B: Beat Top 20 Strategy (if not beating)
├── Identify improvements needed
├── Enhance content
└── Output: competitive content

PHASE 14: Final Emotion Check ⭐ CORE (LLM)
├── Verify emotional score >= 7.0
├── Final emotion polish
└── Output: final content

PHASE 14B: Final Polish
├── Last cleanup
└── Output: FINAL CONTENT (LOCKED)

PHASE 15: Output Format
├── Format for Rally submission
└── Output: formatted content

PHASE 15B: CT Maximizer
├── Enhance CT elements
└── Output: CT-enhanced content

PHASE 16: Export
├── Display SCORE CARD
└── DONE

---

SCORE CARD FORMAT:

╔══════════════════════════════════════════════════════════════╗
║                    RALLY CONTENT SCORE CARD                   ║
╠══════════════════════════════════════════════════════════════╣
║ Campaign: [campaignName]                                      ║
║ Required URL: [requiredUrl]                                   ║
╠══════════════════════════════════════════════════════════════╣
║ GATE UTAMA (Target: 4-5)                                      ║
║ ├── URL Present: ✓/✗                                         ║
║ ├── Hook Quality: [score]/1                                   ║
║ ├── Content Length: ✓/✗                                      ║
║ ├── CTA Present: ✓/✗                                         ║
║ └── Topic Relevance: ✓/✗                                     ║
║ TOTAL GATE UTAMA: [X]/5                                       ║
╠══════════════════════════════════════════════════════════════╣
║ GATE TAMBAHAN (Target: 8)                                     ║
║ ├── No Banned Words: ✓/✗                                     ║
║ ├── Unique Hook: ✓/✗                                         ║
║ ├── Emotional Appeal: ✓/✗                                    ║
║ ├── Educational Value: ✓/✗                                   ║
║ ├── Viral Potential: ✓/✗                                     ║
║ ├── Authentic Voice: ✓/✗                                     ║
║ ├── Proper Formatting: ✓/✗                                   ║
║ └── Engagement Hook: ✓/✗                                     ║
║ TOTAL GATE TAMBAHAN: [X]/8                                    ║
╠══════════════════════════════════════════════════════════════╣
║ PENILAIAN INTERNAL (Target: 9-10)                             ║
║ ├── Originality: [X]/2                                        ║
║ ├── Insight Depth: [X]/2                                      ║
║ ├── Writing Quality: [X]/2                                    ║
║ ├── Emotional Resonance: [X]/2                                ║
║ └── Viral Coefficient: [X]/2                                  ║
║ TOTAL PENILAIAN INTERNAL: [X]/10                              ║
╠══════════════════════════════════════════════════════════════╣
║ EMOTIONAL SCORE: [X]/10 (Min: 7.0)                            ║
║ VIRAL SCORE: [X]/1.0 (Min: 0.6)                               ║
╠══════════════════════════════════════════════════════════════╣
║ FINAL CONTENT:                                                ║
║ [Content here]                                                ║
╠══════════════════════════════════════════════════════════════╣
║ STATUS: ✅ PASS / ❌ NEEDS IMPROVEMENT                         ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎯 SCORING TARGETS

| Component | Minimum | Maximum | Notes |
|-----------|---------|---------|-------|
| Gate Utama | 4 | 5 | URL + Hook required |
| Gate Tambahan | 8 | 8 | All 8 gates must pass |
| Penilaian Internal | 9 | 10 | Quality benchmark |
| Emotional Score | 7.0 | 10.0 | From Phase 8, 14 |
| Viral Score | 0.6 | 1.0 | From Phase 9 |

---

## 📁 FILE STRUCTURE

```
/home/z/my-project/
├── README.md                          # File ini (V9.1.1)
├── scripts/
│   ├── rally-data-gatherer.js         # Main script V9.1.1
│   └── rally-workflow-v8.7.6.js       # Legacy
├── docs/
│   ├── V9.1.0-DATA-SOURCES.md         # Data sources documentation
│   └── WORKFLOW-ARCHITECTURE.md       # Architecture docs
└── download/
    └── rally-data-*.json              # Output data files
```

---

## 🔧 TROUBLESHOOTING

### Web Search Rate Limited (429)
```
Script akan otomatis menggunakan comprehensive fallback data.
Fallback mencakup: news, market, trends, competitors.
```

### z-ai-web-dev-sdk Not Found
```
npm install z-ai-web-dev-sdk
```

### Content Rejected by Rally
```
1. Check bannedWords list in JSON
2. Verify requiredUrl is present in content
3. Ensure hook is unique vs competitors
4. Run 16 Gates simulation again
```

---

## 🏷️ METADATA

| Field | Value |
|-------|-------|
| Version | V9.1.1 Real-Time Edition |
| Branch | v9.0.0-hybrid |
| Total Phases | 24 phases |
| Groups | 2 (Data Gathering + Content Processing) |
| LLM Phases | 8 phases (2B, 5, 6B, 8, 9B, 13B, 14, 15B) |
| Core LLM Phases | 4 phases (2B, 5, 8, 14) |
| Real-Time Search | ✅ Enabled via z-ai-web-dev-sdk |
| Banned Words | ✅ 15 words/phrases |
| 16 Gates | ✅ Full definition |

---

**END OF README V9.1.1**
