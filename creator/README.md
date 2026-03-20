# CREATOR WORKFLOW v2.0

## Deskripsi
Workflow ini bertugas untuk **MEMBUAT konten** yang dirancang untuk **PASS semua kriteria Judge** dan **BEAT leaderboard**.

---

## 🎯 Visi Utama

> **"Build content that PASS all judging criteria, BEAT the leaderboard, and stand out from competitors."**

---

## Prinsip Utama

1. **ORIGINALITY = LIFE** - Tidak boleh ada AI patterns, template hooks, atau copy-paste
2. **EMOTION = ENGAGEMENT** - Konten harus menggugah emosi, bukan informasi kering
3. **HOOK = FIRST IMPRESSION** - Hook adalah 80% dari keberhasilan konten
4. **CTA = CONVERSATION** - Ajak reader untuk respond, bukan sekadar baca
5. **NO FLUFF** - Setiap kata harus punya tujuan
6. **BEAT THE LEADERBOARD** - Konten harus lebih baik dari yang sudah ada

---

## ✅ Elemen WAJIB (Semua Harus Ada)

| Elemen | Status | Detail |
|--------|--------|--------|
| Hook | **WAJIB** | Power pattern, bukan template |
| Emotion | **WAJIB** | Minimal 3 types + 1 body feeling |
| CTA | **WAJIB** | Question yang mengajak respond |
| Required URL | **WAJIB** | Dari campaign, natural placement |
| Facts/Data | **WAJIB** | Fresh data dari web search |
| Body Feelings | **WAJIB** | Untuk emotion score tinggi (10) |

**Jika SATU elemen saja tidak ada, konten TIDAK LAYAK untuk submit.**

---

## 📥 Input

### 1. Campaign Data (dari Rally API)
- Title: Judul campaign
- Knowledge Base: Informasi topik
- Rules: Syarat dan ketentuan
- Required URL: URL yang harus di-include
- Style: Tone dan format

### 2. Leaderboard Data (dari Rally API)
- Top 5 konten pemenang
- Hook pattern yang digunakan
- Emotion types yang berhasil
- Struktur yang tinggi score
- Angle/perspektif yang sukses

### 3. External Data (dari Web Search)
- Data/angka terbaru (lebih fresh dari kompetitor)
- Case study nyata (contoh konkret)
- Quote/statement (kredibilitas)
- Trend terkini (relevansi)
- Verifikasi fakta (akurasi)

---

## 📤 Output

### File Structure
```
/download/creator-output/
├── content-versions.json      # Semua versi konten dengan prediksi score
├── leaderboard-analysis.json  # Hasil analisis leaderboard
└── external-data.json         # Data dari web search
```

### Output Format
```json
{
  "metadata": { ... },
  "leaderboardAnalysis": {
    "topContent": [...],
    "gapAnalysis": {...},
    "beatStrategy": {...}
  },
  "externalData": { ... },
  "contentVersions": [
    {
      "version": 1,
      "hook": "...",
      "tweets": [...],
      "elementsCheck": {...},
      "predictedScores": {...}
    }
  ],
  "recommendation": {
    "bestVersion": 1,
    "reason": "...",
    "confidenceLevel": "HIGH"
  }
}
```

---

## 🔍 Leaderboard Intelligence

### Analisis yang Dilakukan
1. **Extract** hook pattern dari top 5 konten
2. **Identify** emotion types yang berhasil
3. **Map** struktur yang tinggi score
4. **Find** angle/perspektif yang sukses

### Gap Analysis
- Hook pattern mana yang BELUM digunakan?
- Emotion combination mana yang BELUM ada?
- Body feelings ADA atau TIDAK di leaderboard?
- Data fresh (>2024) sudah digunakan atau belum?

### Beat Strategy
- Target score > rank 1
- Gunakan pattern yang belum ada
- Tambahkan elemen unik
- Data lebih fresh dari kompetitor

---

## 🎣 Hook Patterns (Power Patterns)

### Priority Order (berdasarkan leaderboard gap)
1. **PERSONAL PAIN** - Sering belum ada di leaderboard
2. **CONTRARIAN** - Sering belum di-explore
3. **NUMBER + PROBLEM** - Terbukti efektif
4. **BOLD STATEMENT** - Impact tinggi
5. **QUESTION + TENSION** - Engagement kuat

### Examples
| Pattern | Contoh | Score Potential |
|---------|--------|-----------------|
| Number + Problem | "$50M locked. No key." | 8-10 |
| Bold Statement | "Code runs. Justice doesn't." | 8-10 |
| Question + Tension | "What happens when your smart contract disagrees?" | 8-10 |
| Personal Pain | "My heart sank when the tx confirmed." | 9-10 |
| Contrarian | "Everyone's wrong about dispute resolution." | 8-10 |

---

## 🚫 Blacklist (WAJIB HINDARI)

### Weak Openings (Auto-fail Hook Score)
```
"The...", "A...", "An...", "This is...", "There are...", "There is..."
"I think...", "In the...", "Today...", "So...", "Well..."
"Basically...", "Honestly...", "Actually...", "First..."
```

### AI Patterns (Penalty di G4 & Uniqueness)
```
Words: delve, leverage, realm, tapestry, paradigm, landscape, nuance, underscores, pivotal, crucial
Phrases: picture this, lets dive in, in this thread, key takeaways, heres the thing, imagine a world
```

### Template Hooks (Penalty -3 di Uniqueness)
```
"Unpopular opinion", "Hot take", "Thread alert", "Breaking"
"This is your sign", "PSA", "Reminder that", "Quick thread"
"Important thread", "Drop everything", "Stop scrolling"
"Hear me out", "Let me explain", "Nobody is talking about", "Story time"
```

### Banned Words (Auto-fail G3)
```
guaranteed, 100%, risk-free, financial advice, buy now, get rich, passive income
follow me, subscribe to my, check my profile, click here, limited time offer, act now
```

### Prohibited Elements
- Em dashes (—)
- Thread 🧵
- Excess hashtags (>3)
- (1/X) numbering

---

## 💓 Emotion Injection

### Required: 3+ Types + 1 Body Feeling

### Emotion Types
| Type | Keywords | Body Feelings |
|------|----------|---------------|
| FEAR | risk, danger, warning, nightmare | cold sweat, panic, heart racing |
| CURIOSITY | wonder, secret, hidden, mystery | - |
| SURPRISE | unexpected, shocking, breakthrough | jaw dropped |
| HOPE | finally, opportunity, potential | - |
| PAIN | lost, failed, broke, destroyed | stomach dropped, heart sank, chest tightened |
| URGENCY | now, today, immediately | - |

### Body Feelings List
```
cold sweat, panic, anxiety, heart racing
stomach dropped, heart sank, chest tightened
jaw dropped, couldn't believe
```

---

## 📝 Content Structure (Fleksibel)

### Option A: Single Tweet
- **Kapan**: Info simple, announcement
- **Struktur**: Hook + Setup + Facts + URL + CTA
- **Max**: 280 chars

### Option B: Short Thread (3 tweets)
- **Kapan**: Single concept, focused message
- **Struktur**: Hook + Setup → Body + Facts + URL → CTA

### Option C: Standard Thread (5 tweets) - **PALING UMUM**
- **Kapan**: Most campaigns
- **Struktur**:
  - Tweet 1: Hook + Setup
  - Tweet 2: Body - Problem/Pain
  - Tweet 3: Body - Facts + URL
  - Tweet 4: Body - Solution/Hope
  - Tweet 5: CTA

### Option D: Long Thread (7+ tweets)
- **Kapan**: Complex story, detailed analysis
- **Struktur**: Extended version dengan emotion peak

### Determination Factors
- Kompleksitas topik
- Jumlah data/fakta
- Story depth
- Campaign requirements

---

## 🎯 Target Scores

### Gate Utama (Target: ≥17/20)
| Gate | Target | Max |
|------|--------|-----|
| G1 Content Alignment | 5 | 5 |
| G2 Information Accuracy | 5 | 5 |
| G3 Campaign Compliance | 5 | 5 |
| G4 Originality | 4 | 5 |

### Gate Tambahan (Target: ≥15/16)
| Gate | Target | Max |
|------|--------|-----|
| G5 Engagement Potential | 8 | 8 |
| G6 Technical Quality | 7 | 8 |

### Penilaian Internal (Target: ≥56/60)
| Score | Target | Max |
|-------|--------|-----|
| Hook Score | 10 | 10 |
| Emotion Score | 10 | 10 |
| CT Score | 9 | 10 |
| Uniqueness Score | 10 | 10 |
| Readability Score | 9 | 10 |
| Viral Potential | 8 | 10 |

---

## 🔄 Flow

```
1. Load Campaign Data
   └── Fetch dari Rally API / file

2. Load Leaderboard Data
   └── Fetch top 5 konten pemenang

3. Load Competitor Hooks
   └── Untuk menghindari duplikasi

4. Leaderboard Analysis
   └── Analisis pattern, emotion, angle
   └── Gap analysis

5. Web Search for Fresh Data
   └── Facts, case studies, trends

6. Determine Beat Strategy
   └── Pilih differentiator
   └── Tentukan unique angle

7. Generate Content Versions
   └── Buat multiple versions

8. Self-Check Each Version
   └── Validate required elements
   └── Check blacklist
   └── Verify target scores

9. Predict Scores
   └── Calculate predicted judge scores

10. Recommend Best Version
    └── Select highest beat potential

11. Save Output
    └── Write to output files
```

---

## 🔗 Integration

### Judge Workflow
- Path: `../judge/workflow.md`
- Score targets sync dengan Judge thresholds
- Criteria alignment untuk guaranteed PASS

### Rally API
- Base URL: `https://app.rally.fun/api`
- Endpoints: `/campaigns`, `/leaderboard`, `/submissions`

### Web Search
- Provider: `z-ai-web-dev-sdk`
- Purpose: Fresh data, fact verification, case studies

---

## 📋 Self-Check Checklist

Sebelum output, pastikan:

### Hook
- [ ] Menggunakan power pattern?
- [ ] Bukan weak opening?
- [ ] < 200 chars?
- [ ] Bukan template hook?

### Elemen WAJIB
- [ ] Hook ada?
- [ ] Emotion 3+ types?
- [ ] Body feeling ada?
- [ ] CTA question ada?
- [ ] Required URL included?
- [ ] Facts/Data dari web search?

### Larangan
- [ ] Tidak ada AI patterns?
- [ ] Tidak ada template hooks?
- [ ] Tidak ada em dashes?
- [ ] Tidak ada banned words?
- [ ] Tidak mirip competitor?

### Target
- [ ] Gate Utama ≥17?
- [ ] Gate Tambahan ≥15?
- [ ] Penilaian Internal ≥56?
