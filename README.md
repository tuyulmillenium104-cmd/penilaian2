# RALLY CONTENT WORKFLOW V9.1.0 - REAL-TIME EDITION

> **Versi:** V9.1.0 Real-Time Edition  
> **Fitur Baru:** Web Search API untuk data real-time  
> **Total Phases:** 24 phases (dikelompokkan jadi 2 groups)

---

## 🆕 APA YANG BARU DI V9.1.0?

| Feature | V9.0.0 | V9.1.0 |
|---------|--------|--------|
| Data dari Rally API | ✅ | ✅ |
| Data dari Website Scrape | ✅ | ✅ |
| **Real-time Web Search** | ❌ | ✅ **BARU** |
| **News & Trends Data** | ❌ | ✅ **BARU** |
| **Market Insights** | ❌ | ✅ **BARU** |
| **Competitor Discovery** | ❌ | ✅ **BARU** |
| Data Freshness Timestamp | ❌ | ✅ **BARU** |

---

## 🎯 KENAPA V9.1.0 REAL-TIME?

### Masalah Sebelumnya:
1. **Data statis** - hanya dari web yang sudah ada
2. **Tidak ada berita terbaru** - tidak tahu trend terkini
3. **Market data missing** - tidak ada insight pasar
4. **Competitor analysis terbatas** - hanya dari leaderboard

### Solusi V9.1.0:
1. ✅ **Web Search API** - mencari data real-time
2. ✅ **News aggregation** - berita terkini tentang project
3. ✅ **Market insights** - data market dan statistik
4. ✅ **Trend analysis** - apa yang trending di komunitas
5. ✅ **Competitor discovery** - info platform serupa

---

## 🏗️ ARSITEKTUR V9.1.0

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     RALLY WORKFLOW V9.1.0 - REAL-TIME EDITION               │
│                            Total: 24 PHASES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│  GROUP 1: DATA GATHERING (Script Node.js) - Phase 0-2B                     │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  Phase 0: Campaign Data Fetch                                               │
│  ├── HTTP GET Rally API                                                    │
│  ├── Output: title, goal, rules, style, missions                           │
│  └── LLM: ❌ TIDAK DIPERLUKAN                                              │
│                                                                             │
│  Phase 1: Project Website Research                                          │
│  ├── Web scraping project URLs                                             │
│  ├── Extract facts dari HTML                                               │
│  ├── Output: facts, headings, content                                      │
│  └── LLM: ❌ TIDAK DIPERLUKAN                                              │
│                                                                             │
│  Phase 1B: Real-Time Data Gathering ⭐ BARU                                 │
│  ├── Web Search API (z-ai-web-dev-sdk)                                     │
│  ├── Search: News, Market, Trends, Competitors                             │
│  ├── Output: real-time insights                                            │
│  └── LLM: ❌ TIDAK DIPERLUKAN (API call)                                   │
│                                                                             │
│  Phase 2: Leaderboard Fetch                                                 │
│  ├── HTTP GET Rally Leaderboard API                                        │
│  ├── Output: top competitors, stats                                        │
│  └── LLM: ❌ TIDAK DIPERLUKAN                                              │
│                                                                             │
│  Phase 2B: Competitor Pattern Analysis                                      │
│  ├── Extract patterns dari competitor data                                 │
│  ├── Basic: avg length, sentence count (algoritma)                         │
│  ├── Deep: hook patterns, CTA styles, gaps (LLM)                           │
│  └── LLM: ✅ DIPERLUKAN untuk deep analysis                                │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  OUTPUT: JSON file dengan semua data siap untuk AI Chat                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                              │                                              │
│                              ▼                                              │
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│  GROUP 2: CONTENT PROCESSING (AI Chat) - Phase 3-16                        │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ SUB-GROUP 2A: CONTENT CREATION (Phase 3-10)                           │ │
│  │                                                                       │ │
│  │  Phase 3: Gap Identification                                          │ │
│  │  ├── Find unique angles vs competitors                                │ │
│  │  └── LLM: ❌ Algoritma comparison                                     │ │
│  │                                                                       │ │
│  │  Phase 4: Strategy Definition                                         │ │
│  │  ├── Select hook type, emotion target, CTA type                       │ │
│  │  └── LLM: ❌ Algoritma scoring                                        │ │
│  │                                                                       │ │
│  │  Phase 5: Content Generation ⭐ CORE                                  │ │
│  │  ├── LLM generates multi-version content                              │ │
│  │  └── LLM: ✅ **WAJIB** - Ini tahap utama generate                     │ │
│  │                                                                       │ │
│  │  Phase 6: Banned Items Scanner                                        │ │
│  │  ├── Pattern match banned words/phrases                               │ │
│  │  └── LLM: ❌ Pattern matching                                         │ │
│  │                                                                       │ │
│  │  Phase 6B: Rewrite (if violations)                                    │ │
│  │  ├── Fix violations using LLM                                         │ │
│  │  └── LLM: ✅ DIPERLUKAN jika ada violations                           │ │
│  │                                                                       │ │
│  │  Phase 7: Uniqueness Validation                                       │ │
│  │  ├── Compare vs competitor patterns                                   │ │
│  │  └── LLM: ❌ Similarity check                                         │ │
│  │                                                                       │ │
│  │  Phase 8: Emotion Injection ⭐ CORE                                   │ │
│  │  ├── Enhance emotional content                                        │ │
│  │  └── LLM: ✅ **WAJIB** - Butuh kreativitas LLM                        │ │
│  │                                                                       │ │
│  │  Phase 9: HES + Viral Scoring                                         │ │
│  │  ├── Calculate HES score, viral score                                 │ │
│  │  └── LLM: ❌ Mathematical calculation                                 │ │
│  │                                                                       │ │
│  │  Phase 9B: Viral Enhancement (loop max 2x)                            │ │
│  │  ├── Improve viral elements if score low                              │ │
│  │  └── LLM: ✅ DIPERLUKAN untuk enhancement                             │ │
│  │                                                                       │ │
│  │  Phase 10: Quality Selection 🔒 LOCK POINT                            │ │
│  │  ├── Score all versions, select best                                  │ │
│  │  └── LLM: ❌ Scoring algorithm                                        │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ SUB-GROUP 2B: REFINEMENT (Phase 11-14B)                               │ │
│  │                                                                       │ │
│  │  Phase 11: Micro-Optimization                                         │ │
│  │  ├── 5-layer optimization (word, sentence, char, etc.)                │ │
│  │  └── LLM: ❌ Text processing                                          │ │
│  │                                                                       │ │
│  │  Phase 12: Content Flow Polish                                        │ │
│  │  ├── Smooth transitions between paragraphs                            │ │
│  │  └── LLM: ❌ Text processing                                          │ │
│  │                                                                       │ │
│  │  Phase 12B: 16 Gates Simulation                                       │ │
│  │  ├── Validate all 16 gates                                            │ │
│  │  └── LLM: ❌ Rule validation                                          │ │
│  │                                                                       │ │
│  │  Phase 13: Benchmark Comparison                                       │ │
│  │  ├── Compare vs real competitor data                                  │ │
│  │  └── LLM: ❌ Data comparison                                          │ │
│  │                                                                       │ │
│  │  Phase 13B: Beat Top 20 Strategy (loop max 2x)                        │ │
│  │  ├── Ensure content beats top competitors                             │ │
│  │  └── LLM: ✅ DIPERLUKAN untuk strategy                                │ │
│  │                                                                       │ │
│  │  Phase 14: Final Emotion Re-Check ⭐ CORE                             │ │
│  │  ├── Verify emotion score meets minimum                               │ │
│  │  └── LLM: ✅ **WAJIB** - Final emotion polish                         │ │
│  │                                                                       │ │
│  │  Phase 14B: Final Content Polish                                      │ │
│  │  ├── Last review before output                                        │ │
│  │  └── LLM: ❌ Text cleanup                                             │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ SUB-GROUP 2C: OUTPUT (Phase 15-16)                                    │ │
│  │                                                                       │ │
│  │  Phase 15: Output Generation                                          │ │
│  │  ├── Format content, generate Q&A                                     │ │
│  │  └── LLM: ❌ Formatting                                               │ │
│  │                                                                       │ │
│  │  Phase 15B: CT Maximizer (loop max 2x)                                │ │
│  │  ├── Enhance CT elements                                              │ │
│  │  └── LLM: ✅ DIPERLUKAN untuk CT enhancement                          │ │
│  │                                                                       │ │
│  │  Phase 16: Export & Delivery                                          │ │
│  │  ├── Save to file, display score card                                 │ │
│  │  └── LLM: ❌ File writing                                             │ │
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
| **2B** | Competitor Analysis | Script | ✅ | **Deep pattern analysis butuh LLM** |
| 3 | Gap Identification | AI Chat | ❌ | Algoritma comparison |
| 4 | Strategy Definition | AI Chat | ❌ | Algoritma scoring |
| **5** | **Content Generation** | AI Chat | ✅ | **⭐ CORE - LLM WAJIB** |
| 6 | Banned Scanner | AI Chat | ❌ | Pattern matching |
| 6B | Rewrite | AI Chat | ✅ | Jika ada violations |
| 7 | Uniqueness Check | AI Chat | ❌ | Similarity algorithm |
| **8** | **Emotion Injection** | AI Chat | ✅ | **⭐ CORE - LLM WAJIB** |
| 9 | HES + Viral Score | AI Chat | ❌ | Mathematical calculation |
| 9B | Viral Enhancement | AI Chat | ✅ | LLM untuk improvement |
| 10 | Quality Selection | AI Chat | ❌ | Scoring algorithm |
| 11 | Micro-Optimization | AI Chat | ❌ | Text processing |
| 12 | Flow Polish | AI Chat | ❌ | Text processing |
| 12B | Gate Simulation | AI Chat | ❌ | Rule validation |
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
| **WAJIB LLM** | 5, 8, 14 | Core content creation |
| **Perlu LLM** | 2B, 6B, 9B, 13B, 15B | Conditional/enhancement |
| **Tidak Perlu LLM** | 0, 1, 1B, 2, 3, 4, 6, 7, 9, 10, 11, 12, 12B, 13, 14B, 15, 16 | Algoritma/data fetching |

---

## 📡 DATA SOURCES V9.1.0

### 1. Rally API (Static)
```
Endpoint: https://app.rally.fun/api
- Campaign data (title, goal, rules, missions)
- Leaderboard (competitors, scores)
- Creator info
```

### 2. Website Scraping (Semi-Static)
```
Sources:
- internetcourt.org
- genlayer.com

Data extracted:
- Meta descriptions
- Page headings
- Body text content
- Links
```

### 3. Real-Time Web Search ⭐ NEW
```
API: z-ai-web-dev-sdk web_search function

Search Categories:
├── News (4 queries)
│   ├── "Internet Court blockchain dispute resolution latest news 2025"
│   ├── "GenLayer AI validators crypto news update"
│   ├── "decentralized justice Web3 recent developments"
│   └── "smart contract dispute resolution latest"
│
├── Market (3 queries)
│   ├── "blockchain arbitration market size statistics 2024 2025"
│   ├── "Web3 dispute resolution adoption data"
│   └── "crypto legal challenges market trends"
│
├── Trends (3 queries)
│   ├── "AI court blockchain twitter trending"
│   ├── "decentralized arbitration crypto community"
│   └── "DAO governance disputes solutions"
│
└── Competitors (3 queries)
    ├── "Kleros decentralized court reviews"
    ├── "Aragon court vs Internet Court"
    └── "Web3 dispute resolution platforms comparison"
```

### 4. Knowledge Base (Curated)
```
Facts about Internet Court:
- AI validators for evidence evaluation
- Minutes instead of months for verdicts
- Cross-border dispute handling
- GenLayer infrastructure
- 400M+ smart contract users without legal recourse
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

**Output:** JSON file di `/home/z/my-project/download/rally-data-*.json`

### Step 2: Content Processing (AI Chat)

Copy-paste output JSON ke AI Chat dengan prompt:

```
Buat konten Rally menggunakan data berikut:

[PASTE JSON OUTPUT DARI STEP 1]

Jalankan Phase 3-16 lengkap:
1. Phase 3-10: Content creation & validation
2. Phase 11-14B: Refinement & optimization  
3. Phase 15-16: Output & score card

Gunakan real-time data dari JSON untuk konten yang relevan dan fresh.
Tampilkan SCORE CARD di akhir.
```

---

## 📁 FILE STRUCTURE

```
/home/z/my-project/
├── README.md                          # File ini (V9.1.0)
├── scripts/
│   ├── rally-data-gatherer.js         # Main script V9.1.0
│   ├── rally-data-gatherer-v9.1.0.js  # Backup
│   └── rally-workflow-v8.7.6.js       # Legacy
├── docs/
│   ├── V9.1.0-DATA-SOURCES.md         # Data sources documentation
│   └── WORKFLOW-ARCHITECTURE.md       # Architecture docs
└── download/
    └── rally-data-*.json              # Output data files
```

---

## ⚠️ PENTING UNTUK AI CHAT

**AI Chat HARUS menjalankan SEMUA Phase 3-16 dengan lengkap!**

### Checklist:
- [ ] Phase 3: Gap identification from competitor data
- [ ] Phase 4: Strategy definition based on gaps
- [ ] Phase 5: Generate 3-5 content versions
- [ ] Phase 6: Scan for banned items
- [ ] Phase 6B: Rewrite if violations found
- [ ] Phase 7: Uniqueness validation
- [ ] Phase 8: Emotion injection
- [ ] Phase 9: Calculate HES + Viral scores
- [ ] Phase 9B: Enhance if viral score < 0.6
- [ ] Phase 10: Select best version
- [ ] Phase 11: Micro-optimization
- [ ] Phase 12: Flow polish
- [ ] Phase 12B: 16 Gates validation
- [ ] Phase 13: Benchmark comparison
- [ ] Phase 13B: Beat top 20 strategy
- [ ] Phase 14: Final emotion check
- [ ] Phase 14B: Final polish
- [ ] Phase 15: Output formatting
- [ ] Phase 15B: CT maximizer
- [ ] Phase 16: Export with SCORE CARD

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

## 📊 CONTOH OUTPUT JSON

```json
{
  "version": "9.1.0",
  "timestamp": "2025-03-20T10:30:00.000Z",
  "campaignAddress": "default",
  
  "campaign": {
    "name": "Internet Court",
    "goal": "Spread awareness about...",
    "baseUrl": "internetcourt.org"
  },
  
  "realTimeData": {
    "news": [
      {
        "title": "Internet Court Launches AI Jury...",
        "snippet": "...",
        "source": "cryptonews.com",
        "date": "2025-03-19"
      }
    ],
    "market": [...],
    "trends": [...],
    "totalResults": 25
  },
  
  "summary": {
    "campaignName": "Internet Court",
    "topFacts": [...],
    "latestNews": [...],
    "dataFreshness": "2025-03-20T10:30:00.000Z"
  },
  
  "aiInstructions": {
    "hook": "Code Runs, Disputes Don't. Enter Internet Court",
    "requiredUrl": "internetcourt.org",
    "minScore": 9.0
  }
}
```

---

## 🏷️ METADATA

| Field | Value |
|-------|-------|
| Version | V9.1.0 Real-Time Edition |
| Branch | v9.0.0-hybrid |
| Total Phases | 24 phases |
| Groups | 2 (Data Gathering + Content Processing) |
| LLM Phases | 8 phases (5, 2B, 6B, 8, 9B, 13B, 14, 15B) |
| Core LLM Phases | 3 phases (5, 8, 14) |
| Real-Time Search | ✅ Enabled via z-ai-web-dev-sdk |

---

## 🔧 TROUBLESHOOTING

### Web Search Tidak Berfungsi
```
Error: "z-ai-web-dev-sdk not found"
Solution: npm install z-ai-web-dev-sdk
```

### Rate Limit pada Web Search
```
Script otomatis menambahkan delay 300ms antara searches.
Jika masih rate limit, tambahkan delay di CONFIG.
```

### Data Tidak Lengkap
```
Pastikan koneksi internet stabil.
Script akan menggunakan fallback data jika fetch gagal.
```

---

**END OF README V9.1.0**
