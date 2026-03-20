# RALLY CONTENT WORKFLOW V9.0.0 - HYBRID ARCHITECTURE

> **Versi Baru:** Arsitektur Hybrid - Script untuk Data, AI Chat untuk Konten

---

## 🎯 APA YANG BARU DI V9.0.0?

| V8.7.6 | V9.0.0 |
|--------|--------|
| Script untuk SEMUA | Script untuk DATA saja |
| LLM di script (rate limit) | LLM di AI Chat (lebih stabil) |
| Kompleks | Sederhana |
| 24 phases otomatis | 2 phases terpisah |

---

## 🏗️ ARSITEKTUR HYBRID

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RALLY WORKFLOW V9.0.0                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PHASE 1: DATA GATHERING (Script Node.js)                          │
│  ─────────────────────────────────────────────                     │
│  ├── Fetch Campaign Data (Rally API)                               │
│  ├── Web Research (Project websites)                               │
│  ├── Leaderboard Analysis                                          │
│  └── Output: JSON data file                                        │
│                                                                     │
│                            │                                        │
│                            ▼                                        │
│                                                                     │
│  PHASE 2: CONTENT GENERATION (AI Chat)                             │
│  ─────────────────────────────────────────────                     │
│  ├── Read JSON data                                                │
│  ├── Generate konten (LLM kreativitas)                             │
│  ├── Hitung score (algoritma)                                      │
│  └── Output: Konten + Score Card                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 KOMPONEN

| Komponen | Perlu LLM? | Di Mana? |
|----------|------------|----------|
| Fetch Campaign | ❌ Tidak | Script Node.js |
| Web Research | ❌ Tidak | Script Node.js |
| Leaderboard | ❌ Tidak | Script Node.js |
| Generate Konten | ✅ **YA** | **AI Chat** |
| Scoring | ❌ Tidak | AI Chat |
| Formatting | ❌ Tidak | AI Chat |

---

## 🚀 CARA PENGGUNAAN

### Step 1: Gather Data (Node.js)

```bash
cd /home/z/my-project
node scripts/rally-data-gatherer.js <campaign_address>
```

**Output:** JSON file dengan:
- Campaign data
- Research facts
- Leaderboard data
- AI-ready summary

### Step 2: Generate Content (AI Chat)

```
Baca data dari file output script, generate konten Rally.

DATA INPUT:
[paste JSON output dari script]

INSTRUKSI:
1. Gunakan campaign goal untuk alignment
2. Gunakan research facts untuk konten
3. Generate konten dengan hook yang ada
4. Hitung score dan tampilkan SCORE CARD
```

---

## 📋 SINGLE PROMPT UNTUK CHAT BARU

```
Buat konten Rally untuk hook: "CODE RUNS, DISPUTES DON'T. ENTER INTERNET COURT"

LANGKAH 1: Jika bisa, jalankan script untuk data:
  cd /home/z/my-project && node scripts/rally-data-gatherer.js

LANGKAH 2: Jika tidak bisa, gunakan data default:
  Campaign: Internet Court
  Goal: Spread awareness tentang decentralized dispute resolution
  URL: internetcourt.org

LANGKAH 3: Generate konten dengan rules berikut

BANNED WORDS:
delve, leverage, paradigm, ecosystem, groundbreaking, seamless, transformative, realm, tapestry, catalyst, cornerstone, pivotal, myriad

BANNED PHRASES:
in the world of, picture this, imagine a world, lets dive in, at its core, in conclusion, it is important to note

BANNED AI PATTERNS:
in this thread, here's what you need to know, key takeaways, in summary

KONTEN REQUIREMENTS:
- Hook SAMA PERSIS (jangan ubah)
- 3-5 paragraf (masing-masing <280 char)
- Include: internetcourt.org
- Include body feeling (stomach dropped, heart racing, cold sweat)
- Akhiri dengan pertanyaan engaging
- 3+ emotion types (fear, curiosity, surprise, hope, pain)

SCORING (min 9.0 overall):
- Hook Score: min 7/10
- Emotion Score: min 8/10  
- CT Score: min 8/10
- Overall: min 9.0/10

TAMPILKAN:
1. KONTEN
2. SCORE CARD (format box)
```

---

## 📊 SCORING FORMULAS

### HOOK SCORE (0-10)

| Kriteria | Poin |
|----------|------|
| No weak opening | +3 |
| Power pattern | +3 |
| Curiosity element | +1 |
| Tension element | +1 |
| Surprise element | +1 |
| Relevance element | +1 |

**Power Patterns:**
- Number: `$50M vanished...`, `400 million users...`
- Question: `What happens when...`
- Action verb: `Imagine this...`
- Bold statement: `Code executes. Justice doesn't.`
- Contrarian: `Wrong...`
- Personal pain: `I lost everything...`

---

### EMOTION SCORE (0-10)

| Kriteria | Poin |
|----------|------|
| Each emotion trigger | +2 |
| Body feeling | +3 |
| 3+ emotion types | +2 |
| All 5 emotion types | +1 |

**Emotion Triggers:**

| Emotion | Triggers |
|---------|----------|
| Fear | risk, danger, crisis, fail, lost, vanish, nightmare |
| Curiosity | what if, why, how, secret, hidden, gap, mystery |
| Surprise | unexpected, finally, breakthrough, shocking |
| Hope | opportunity, potential, future, solution, imagine |
| Pain | lost, failed, broke, destroyed, regret, hurt, rugged |

**Body Feelings:**
- stomach dropped
- heart racing
- cold sweat
- chest tightened
- couldn't sleep
- jaw dropped
- couldn't breathe

---

### CT SCORE (0-10)

| Elemen | Poin |
|--------|------|
| Question (?) | +2 |
| Reply bait | +2 |
| Engagement hook | +2 |
| Personal (I, my) | +1 |
| FOMO | +1 |
| Controversy | +1 |
| Share-worthy | +1 |

---

### OVERALL SCORE

```
OVERALL = (Hook + Emotion + CT + Uniqueness + Readability + Viral) / 6
```

**Minimum: 9.0/10**

---

## 📝 OUTPUT FORMAT

### KONTEN:
```
Code Runs, Disputes Don't. Enter Internet Court

[Paragraf 2 - problem statement dengan data]

[Paragraf 3 - emotional dengan body feeling]

[Paragraf 4 - solution dengan internetcourt.org]

[Paragraf 5 - pertanyaan engaging]

internetcourt.org
```

### SCORE CARD:
```
╔════════════════════════════════════════════════════════════════════════╗
║                    FINAL CONTENT SCORE CARD - V9.0.0                   ║
║                   "Quality 200% Above Rally Standards"                 ║
╠════════════════════════════════════════════════════════════════════════╣
║  📊 PENILAIAN INTERNAL (Min: 9/10 each)                                ║
║  │ Hook Score:                  X/10    │ ✅ PASS / ❌ FAIL            ║
║  │ Emotion Score:               X/10    │ ✅ PASS / ❌ FAIL            ║
║  │ CT Score:                    X/10    │ ✅ PASS / ❌ FAIL            ║
║  │ Uniqueness:                  X/10    │ ✅ PASS / ❌ FAIL            ║
║  │ Readability:                 X/10    │ ✅ PASS / ❌ FAIL            ║
║  │ Viral Potential:             X/10    │ ✅ PASS / ❌ FAIL            ║
║  ├────────────────────────────────────────────────────────────────────┤║
║  │ OVERALL SCORE:               X.X/10  │ ✅ PASS / ❌ FAIL            ║
║                                                                        ║
║  😱 EMOTION TYPES: [list]                                              ║
║  │ Body Feelings: Yes/No                                               ║
║                                                                        ║
║  📈 SUMMARY                                                            ║
║  │ Scores Passing:           X/6                                       ║
║  │ READY FOR SUBMISSION:     ✅ YES / ❌ NO                             ║
║  │ Confidence Level:         XX%                                        ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 📁 FILE STRUCTURE

```
/home/z/my-project/
├── README.md                        # File ini
├── scripts/
│   ├── rally-data-gatherer.js       # Data gathering (no LLM)
│   ├── rally-ai-workflow.js         # Legacy - with LLM
│   └── rally-workflow-v8.7.6.js     # Legacy - full workflow
└── download/
    └── rally-data-*.json            # Output data files
```

---

## ⚠️ TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| Script error | Generate konten dengan data default |
| No campaign address | Gunakan data default Internet Court |
| Score < 9.0 | Regenerate dengan perbaikan |
| Missing body feeling | Tambahkan dari list |
| Banned word | Ganti dengan alternatif |

---

## 🆚 PERBANDINGAN VERSI

| Aspek | V8.7.6 | V9.0.0 |
|-------|--------|--------|
| LLM Location | Script | AI Chat |
| Rate Limit Risk | Tinggi | Rendah |
| Complexity | 24 phases | 2 phases |
| Flexibility | Rigid | Adaptive |
| Data Freshness | API realtime | API realtime |
| Content Quality | Template-based | AI Creative |

---

## ✅ CHECKLIST

Sebelum output, pastikan:

- [ ] Hook sama persis
- [ ] 3-5 paragraf, <280 char each
- [ ] internetcourt.org ada
- [ ] Body feeling ada
- [ ] Pertanyaan di akhir
- [ ] 3+ emotion types
- [ ] 0 banned items
- [ ] Overall >= 9.0

---

## 🏷️ METADATA

- **Version:** V9.0.0 Hybrid
- **Branch:** v9.0.0-hybrid
- **Created:** 2026-03-20
- **Architecture:** Hybrid (Script + AI Chat)

---

**END OF README V9.0.0**
