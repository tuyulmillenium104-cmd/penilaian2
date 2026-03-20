# RALLY CONTENT WORKFLOW V9.2.0 - HYBRID EDITION

> **Versi:** V9.2.0 Hybrid Edition  
> **Arsitektur:** Script untuk Data Dasar + AI Chat untuk Web Research  
> **Total Phases:** 24 phases

---

## 🆕 KENAPA V9.2.0 HYBRID?

### Masalah V9.1.x:
| Masalah | Penyebab |
|---------|----------|
| Web Search API 429 error | Rate limited |
| Data tidak real-time | API terbatas |
| Tidak bisa navigate website | Hanya search snippets |

### Solusi V9.2.0:
| Komponen | Eksekusi | Kemampuan |
|----------|----------|-----------|
| **Rally API** | Script | Campaign + Leaderboard data |
| **Basic Scrape** | Script | HTML parsing project websites |
| **Web Research** | **AI Chat** | Browser capability - navigate, scroll, click, extract |
| **News/Trends** | **AI Chat** | Real-time search, deep analysis |
| **Market Data** | **AI Chat** | Browse multiple sources |

---

## 🏗️ ARSITEKTUR V9.2.0

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     RALLY WORKFLOW V9.2.0 - HYBRID EDITION                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│  PART 1: SCRIPT NODE.JS (Data Dasar)                                        │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  ✅ Phase 0: Campaign Data (Rally API)                                      │
│  ✅ Phase 1: Basic Website Scrape (HTML parsing)                            │
│  ✅ Phase 2: Leaderboard (Rally API)                                        │
│                                                                             │
│  Output: JSON dengan data dasar + instruksi untuk AI Chat                   │
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│  PART 2: AI CHAT (Web Research + Content Creation)                          │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  🌐 BROWSER CAPABILITY (AI Chat)                                            │
│  ├── Web Search: Real-time news dan trends                                  │
│  ├── Navigate: Browse ke websites                                           │
│  ├── Scroll: Baca konten lengkap                                            │
│  ├── Click: Follow links                                                    │
│  └── Extract: Ambil data yang relevan                                       │
│                                                                             │
│  ✅ Phase 1B: Web Research (via AI Chat browser)                            │
│  ├── News: Latest news about campaign topic                                 │
│  ├── Market: Statistics and market data                                     │
│  ├── Trends: Trending topics in community                                   │
│  └── Competitors: Platform analysis                                         │
│                                                                             │
│  ✅ Phase 2B: Competitor Deep Analysis                                      │
│  ✅ Phase 3-16: Content Creation                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 CARA PENGGUNAAN

### Step 1: Run Script (Data Dasar)

```bash
# Clone repo
git clone https://github.com/tuyulmillenium104-cmd/penilaian2
cd penilaian2
git checkout v9.0.0-hybrid

# Run data gatherer
node scripts/rally-data-gatherer.js [campaign_address]
```

### Step 2: AI Chat (Web Research + Content)

Copy JSON output dan paste ke AI Chat dengan prompt:

```
Buat konten Rally menggunakan data berikut:

[PASTE JSON OUTPUT]

---

SEBAGAI AI CHAT DENGAN BROWSER CAPABILITY, LAKUKAN:

## STEP 1: WEB RESEARCH (Gunakan Browser/Search)

Sebelum generate konten, lakukan web research:

1. **News Search**
   - Cari berita terbaru tentang Internet Court / GenLayer
   - Cari developments terkini di Web3 dispute resolution
   - Output: 3-5 news items relevan

2. **Market Research**
   - Cari statistik blockchain arbitration market
   - Cari data adopsi Web3 dispute resolution
   - Output: Data dan statistics

3. **Trends Analysis**
   - Cari trending topics di crypto twitter terkait
   - Cari diskusi komunitas tentang decentralized justice
   - Output: Trending angles

4. **Competitor Analysis**
   - Analyze content dari leaderboard.top10
   - Identify hook patterns dan CTA styles
   - Find content gaps

## STEP 2: CONTENT CREATION (Phases 3-16)

Ikuti workflow phases dari JSON:

### Phase 2B: Competitor Deep Analysis (LLM)
- Analyze patterns dari leaderboard data
- Identify unique angles yang belum digunakan
- Output: opportunity_gaps

### Phase 3: Gap Identification
- Compare dengan competitor patterns
- Find differentiation opportunities

### Phase 4: Strategy Definition
- Select angle: problem_first / contrast / fear / analytical / future
- Define emotion target
- Define CTA approach

### Phase 5: Content Generation ⭐ CORE (LLM)
- Generate 3-5 content versions
- Each: 3-5 tweets, 240-400 chars each
- Include hook, requiredUrl, CTA
- Use web research data

### Phase 6: Banned Items Scanner
- Check setiap version terhadap bannedWords
- Output: violations list

### Phase 6B: Rewrite (if violations)
- Fix violations

### Phase 7: Uniqueness Validation
- Compare vs competitor content
- Score uniqueness

### Phase 8: Emotion Injection ⭐ CORE (LLM)
- Enhance emotional appeal
- Add emotional triggers

### Phase 9: HES + Viral Scoring
- Calculate scores

### Phase 9B: Viral Enhancement (if score < 0.6)

### Phase 10: Quality Selection 🔒 LOCK
- Select best version

### Phase 11: Micro-Optimization
- Word/sentence/char optimization

### Phase 12: Flow Polish
- Smooth transitions

### Phase 12B: 16 Gates Validation
- Validate all gates dari gatesDefinition

### Phase 13: Benchmark Comparison
- Compare vs top competitors

### Phase 13B: Beat Top 20 Strategy

### Phase 14: Final Emotion Check ⭐ CORE (LLM)

### Phase 14B: Final Polish

### Phase 15: Output Format

### Phase 15B: CT Maximizer

### Phase 16: Export + SCORE CARD

---

## SCORE CARD FORMAT:

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
║ WEB RESEARCH USED: ✅                                         ║
║ ├── News Items: [X]                                           ║
║ ├── Market Data: [X] points                                   ║
║ └── Trends: [X] trending topics                               ║
╠══════════════════════════════════════════════════════════════╣
║ FINAL CONTENT:                                                ║
║ [Content here]                                                ║
╠══════════════════════════════════════════════════════════════╣
║ STATUS: ✅ PASS / ❌ NEEDS IMPROVEMENT                         ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📊 PHASE BREAKDOWN

| Phase | Nama | Eksekusi | LLM? | Keterangan |
|-------|------|----------|------|------------|
| 0 | Campaign Fetch | Script | ❌ | Rally API |
| 1 | Website Scrape | Script | ❌ | Basic HTML |
| **1B** | **Web Research** | **AI Chat** | ❌ | **Browser capability** |
| 2 | Leaderboard | Script | ❌ | Rally API |
| **2B** | **Competitor Analysis** | AI Chat | ✅ | Deep pattern analysis |
| 3-16 | Content Creation | AI Chat | Mixed | See workflow |

---

## 📡 DATA FLOW

```
SCRIPT OUTPUT                    AI CHAT ACTIONS
─────────────                    ───────────────
campaign data        ────────>   Use for content requirements
websites[]           ────────>   Reference for facts
leaderboard.top10[]  ────────>   Analyze competitor patterns
bannedWords[]        ────────>   Validate content
gatesDefinition      ────────>   Validate all gates
webResearchTasks[]   ────────>   🌐 PERFORM WEB RESEARCH

                                 ┌─────────────────────┐
                                 │ AI CHAT BROWSER     │
                                 │                     │
                                 │ • Web Search        │
                                 │ • Navigate URLs     │
                                 │ • Extract Data      │
                                 │ • Real-time Info    │
                                 └─────────────────────┘
                                          │
                                          ▼
                                 WEB RESEARCH DATA
                                 ─────────────────
                                 • news[]
                                 • market[]
                                 • trends[]
                                 • competitors[]
                                          │
                                          ▼
                                 CONTENT GENERATION
                                 (Phases 3-16)
```

---

## 🎯 SCORING TARGETS

| Component | Minimum | Maximum |
|-----------|---------|---------|
| Gate Utama | 4 | 5 |
| Gate Tambahan | 8 | 8 |
| Penilaian Internal | 9 | 10 |
| Emotional Score | 7.0 | 10.0 |
| Viral Score | 0.6 | 1.0 |

---

## 📁 FILE STRUCTURE

```
/home/z/my-project/
├── README.md                    # File ini (V9.2.0)
├── scripts/
│   └── rally-data-gatherer.js   # Data gatherer V9.2.0
└── download/
    └── rally-data-*.json        # Output data files
```

---

## ⚠️ PENTING

### Script Output Contains:
- ✅ Campaign data (from Rally API)
- ✅ Basic website scrape
- ✅ Leaderboard data
- ✅ Banned words list
- ✅ 16 Gates definition
- ✅ Web research instructions

### AI Chat Must Do:
- 🌐 **Web research** using browser capability
- 📊 **Analyze** competitor patterns
- ✍️ **Generate** content following all phases
- ✅ **Validate** against 16 gates

---

## 🏷️ METADATA

| Field | Value |
|-------|-------|
| Version | V9.2.0 Hybrid Edition |
| Branch | v9.0.0-hybrid |
| Script Phases | 0, 1, 2 (data gathering) |
| AI Chat Phases | 1B, 2B, 3-16 |
| Web Research | AI Chat (browser capability) |

---

**END OF README V9.2.0**
