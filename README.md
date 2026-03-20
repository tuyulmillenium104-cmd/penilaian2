# RALLY CONTENT WORKFLOW V8.7.6 - COMPLETE GUIDE

> **UNTUK AI:** Baca seluruh file ini. Tandai mana yang perlu LLM generate dan mana yang bisa diproses lokal.

---

## 🔍 STATUS KOMPONEN - PERLU LLM ATAU TIDAK

| Komponen | Perlu LLM? | Status | Alternatif Jika LLM Tidak Tersedia |
|----------|------------|--------|-----------------------------------|
| Generate Konten | ✅ **YA** | Wajib | AI harus generate manual dengan kreativitas |
| Hitung Score | ❌ TIDAK | Algoritma | Ikuti formula matematika |
| Scan Banned Items | ❌ TIDAK | Pattern matching | Ikuti list banned |
| Format Score Card | ❌ TIDAK | Template | Ikuti format box |
| Emotion Detection | ❌ TIDAK | Pattern matching | Ikuti trigger list |
| Hook Validation | ❌ TIDAK | Algoritma | Ikuti scoring rules |

---

## ⚠️ PENTING: TENTANG "CONTOH OUTPUT"

**CONTOH YANG ADA DI README INI HANYA REFERENSI FORMAT.**

**JANGAN COPY-PASTE KONTEN DARI CONTOH!**

**KONTEN HARUS DI-GENERATE BARU SETIAP KALI DENGAN:**
- Variasi kalimat berbeda
- Emotion progression berbeda
- Data/fakta berbeda
- Tone berbeda sesuai hook

---

## 🎯 SATU PROMPT UNTUK CHAT BARU

```
Buat konten Rally untuk hook: "CODE RUNS, DISPUTES DON'T. ENTER INTERNET COURT"

Baca README: https://github.com/tuyulmillenium104-cmd/penilaian2

Generate konten BARU (jangan copy contoh), hitung score, tampilkan SCORE CARD.
```

---

## 📋 LANGKAH EKSEKUSI

### LANGKAH 1: CHECK LLM AVAILABILITY

```bash
# Coba test LLM
cd /home/z/my-project
node -e "const ZAI = require('z-ai-web-dev-sdk').default; ZAI.create().then(z => z.chat.completions.create({messages: [{role: 'user', content: 'test'}]})).then(r => console.log('LLM OK')).catch(e => console.log('LLM UNAVAILABLE:', e.message))"
```

**JIKA "LLM OK":** Lanjut LANGKAH 2A (generate via script)

**JIKA "LLM UNAVAILABLE":** Lanjut LANGKAH 2B (generate manual)

---

### LANGKAH 2A: GENERATE VIA SCRIPT (JIKA LLM TERSEDIA)

```bash
cd /home/z/my-project
node scripts/rally-ai-workflow.js "CODE RUNS, DISPUTES DON'T. ENTER INTERNET COURT"
```

**JIKA BERHASIL:** Tampilkan output dari script.

**JIKA GAGAL (error/rate-limit):** Lanjut LANGKAH 2B.

---

### LANGKAH 2B: GENERATE MANUAL (JIKA LLM TIDAK TERSEDIA)

> **⚠️ BAGIAN INI PERLU KREATIVITAS - JANGAN COPY CONTOH!**

#### HOOK (SAMA PERSIS - JANGAN UBAH):
```
Code Runs, Disputes Don't. Enter Internet Court
```

#### INSTRUKSI GENERATE:

**PARAGRAF 1 (Hook + Problem Statement):**
- Gunakan hook SAMA PERSIS sebagai kalimat pertama
- Tambahkan 1-2 kalimat yang menjelaskan masalah
- Sertakan ANGKA/STATISTIK spesifik (bisa berbeda setiap generate)
- Contoh angka: jumlah user, nilai transaksi, persentase, dll

**PARAGRAF 2 (Emotional Impact):**
- Gambarkan situasi yang menakutkan/menyedihkan
- WAJIB sertakan BODY FEELING (pilih 1-2):
  - `stomach dropped`
  - `heart racing`
  - `cold sweat`
  - `chest tightened`
  - `couldn't sleep`
  - `jaw dropped`
- Buat VARIASI - jangan sama dengan contoh manapun

**PARAGRAF 3 (Solution/Hope):**
- Perkenalkan Internet Court
- Jelaskan manfaat utama (kecepatan, aksesibilitas, dll)
- Sertakan `internetcourt.org`

**PARAGRAF 4 (Call-to-Action):**
- Akhiri dengan PERTANYAAN engaging
- Pertanyaan harus memicu reply/discussion
- Bisa retoris atau langsung ke reader

---

### 💡 PANDUAN KREATIVITAS (AGAR HASIL BERBEDA SETIAP KALI):

#### Variasi Angka/Data:
```
- "400 million users" → "500M+ smart contract users"
- "$50M vanished" → "Billions locked in contracts"
- "Zero courts" → "No legal recourse"
- "Years" → "Decades of litigation"
```

#### Variasi Body Feelings:
```
- "stomach dropped" → "cold sweat, hands shaking"
- "heart racing" → "couldn't breathe for a moment"
- "chest tightened" → "felt the blood drain from my face"
```

#### Variasi Emotion Progression:
```
Option A: Fear → Curiosity → Hope → Action
Option B: Pain → Surprise → Hope → Question
Option C: Curiosity → Fear → Solution → Engagement
Option D: Surprise → Pain → Hope → Call-to-Action
```

#### Variasi Tone:
```
- Personal: "I watched my savings..."
- Observational: "Most people don't realize..."
- Warning: "Your funds are at risk..."
- Educational: "Here's what happens..."
- Provocative: "The system is broken..."
```

---

### LANGKAH 3: BANNED ITEMS (WAJIB HINDARI)

#### 🚫 BANNED WORDS:
```
delve, leverage, realm, tapestry, paradigm, catalyst, cornerstone,
pivotal, myriad, moreover, furthermore, groundbreaking, game-changer,
cutting-edge, unprecedented, ecosystem, landscape, foster, harness,
robust, seamless, innovative, transformative, imperative, crucial,
underscore, testament, epitome, beacon, embark, journey, navigate,
unravel, unlock
```

#### 🚫 BANNED PHRASES:
```
in the world of, picture this, imagine a world, lets dive in,
at its core, in conclusion, it is important to note, moving forward,
not only but also, a testament to, it's worth noting, needless to say,
at the heart of, the fact of the matter, in the digital age,
with the rise of, in recent years, double-edged sword, tip of the iceberg,
game changer, first and foremost, last but not least,
plays a crucial role, paved the way
```

#### 🚫 BANNED AI PATTERNS:
```
in this thread, here's what you need to know, let me break it down,
the bottom line is, what does this mean for you, key takeaways,
in summary
```

#### 🚫 BANNED TEMPLATE HOOKS:
```
unpopular opinion, hot take, thread alert, breaking, this is your sign,
psa, reminder that, quick thread, important thread, drop everything,
stop scrolling, hear me out, let me explain, nobody is talking about,
story time
```

#### 🚫 WEAK OPENINGS (JANGAN MULAI DENGAN):
```
the, a, an, this is, there are, there is, i think, it is, in the,
today, so, well, basically, honestly, actually, first, let me,
here is, here are
```

---

### LANGKAH 4: SCORING SYSTEM

> **Bagian ini TIDAK perlu LLM - ikuti formula matematika.**

#### 🎣 HOOK SCORE (0-10) - MIN: 7

| Kriteria | Poin | Cara Hitung |
|----------|------|-------------|
| No weak opening | +3 | Hook TIDAK dimulai dengan weak opening |
| Power pattern | +3 | Gunakan salah satu power pattern |
| Curiosity element | +1 | Ada: what if, why, how, secret, hidden, mystery |
| Tension element | +1 | Ada: but, however, wrong, problem, crisis |
| Surprise element | +1 | Ada: unexpected, finally, breakthrough, shocking |
| Relevance element | +1 | Ada: you, your, today, now |

**POWER PATTERNS:**
1. **Number/Data:** `$50M vanished...`, `400 million users...`
2. **Question:** `What happens when...`, `Who decides...`
3. **Action verb:** `Imagine this...`, `Picture...`
4. **Bold statement:** `Code executes. Justice doesn't.`
5. **Contrarian:** `No one talks about...`, `Wrong...`
6. **Personal pain:** `I lost everything...`
7. **Urgency:** `Warning: Your funds...`

---

#### 😱 EMOTION SCORE (0-10) - MIN: 8

| Kriteria | Poin | Cara Hitung |
|----------|------|-------------|
| Emotion trigger | +2 each | Setiap kata trigger dari emotion library |
| Body feeling | +3 | Ada body feeling di konten |
| 3+ emotion types | +2 | Terdeteksi 3+ tipe emosi berbeda |
| All 5 emotion types | +1 | Terdeteksi semua 5 tipe |

**EMOTION TRIGGERS:**

| Emotion | Trigger Words |
|---------|---------------|
| Fear | risk, danger, threat, warning, scary, terrifying, afraid, worried, nightmare, what if, could lose, at stake, crisis, wrong, fail, lost, vanish |
| Curiosity | wonder, curious, secret, hidden, mystery, discover, surprising, unexpected, few people know, what most don't realize, gap, missing, problem |
| Surprise | unexpected, shocking, surprised, didn't expect, blew my mind, plot twist, finally, breakthrough |
| Hope | finally, breakthrough, opportunity, potential, future, imagine, possible, could change everything, solution |
| Pain | lost, failed, broke, destroyed, wasted, missed, regret, hurt, pain, lost everything, too late, gone, rugged |

---

#### 💬 CT SCORE (0-10) - MIN: 8

| Elemen | Poin | Pattern |
|--------|------|---------|
| Question | +2 | Ada `?` |
| Reply bait | +2 | what do you think, thoughts?, who else, agree? |
| Engagement hook | +2 | what if, have you ever, imagine if, would you |
| Personal | +1 | I, my, me, we, our |
| FOMO | +1 | now, today, finally, before, soon |
| Controversy | +1 | wrong, problem, fail, nobody, actually, truth |
| Share-worthy | +1 | this is why, here's what, the truth |

---

#### 🚦 GATE UTAMA RALLY (0-5 each) - MIN: 4

| Gate | Rumus |
|------|-------|
| **G1: Content Alignment** | internetcourt.org mentioned (+1.5), correct terminology (+1.25), brand consistency (+1.25), audience fit (+1.0) |
| **G2: Information Accuracy** | technical terms correct (+1.5), credible context (+1.25), includes data (+1.25), proper context (+1.0) |
| **G3: Campaign Compliance** | URL included (+1.5), correct format (+1.25), no banned items (+1.25), disclosures (+1.0) |
| **G4: Originality** | no template hooks (+1.5), personal insights (+1.25), no AI patterns (+1.25), creative expression (+1.0) |

---

#### 🎯 GATE TAMBAHAN (0-8 each) - MIN: 8

| Gate | Rumus |
|------|-------|
| **G5: Engagement Potential** | hook effectiveness (+2), CTA quality (+2), structure (+2), conversation potential (+2) |
| **G6: Technical Quality** | grammar/spelling (+2), formatting (+2), length optimization (+2), readability (+2) |

---

#### 📊 PENILAIAN INTERNAL (0-10 each) - MIN: 9

| Metrik | Rumus |
|--------|-------|
| Hook Score | Lihat rumus Hook Score di atas |
| Emotion Score | Lihat rumus Emotion Score di atas |
| CT Score | Lihat rumus CT Score di atas |
| Uniqueness | 10 - (banned violations × 0.5) - (AI patterns × 1) |
| Readability | Base 8 + paragraph bonus (max +2), -1 per sentence >35 words |
| Viral Potential | controversy(+1) + emotional(+1) + question(+1) + personal(+1) + data(+1) + urgency(+1) + share-worthy(+1), base 3 |

---

#### 🏆 OVERALL SCORE - MIN: 9.0

```
OVERALL = (Gate_Average / 8 × 4) + (Internal_Average / 10 × 6)
```

---

### LANGKAH 5: FORMAT OUTPUT

#### KONTEN FORMAT:
```
[Hook - sama persis]

[Paragraf 2]

[Paragraf 3 - dengan body feeling]

[Paragraf 4]

[Paragraf 5 - pertanyaan]

internetcourt.org
```

#### SCORE CARD FORMAT:
```
╔════════════════════════════════════════════════════════════════════════╗
║                    FINAL CONTENT SCORE CARD - V8.7.6                   ║
║                   "Quality 200% Above Rally Standards"                 ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  🚦 GATE UTAMA RALLY (Min: 4/5 each)                                   ║
║  │ Content Alignment:           X.X/5   │ ✅ PASS / ❌ FAIL            ║
║  │ Information Accuracy:        X.X/5   │ ✅ PASS / ❌ FAIL            ║
║  │ Campaign Compliance:         X.X/5   │ ✅ PASS / ❌ FAIL            ║
║  │ Originality & Authenticity:  X.X/5   │ ✅ PASS / ❌ FAIL            ║
║                                                                        ║
║  🎯 GATE TAMBAHAN (Min: 8/8 each)                                      ║
║  │ Engagement Potential:        X.X/8   │ ✅ PASS / ❌ FAIL            ║
║  │ Technical Quality:           X.X/8   │ ✅ PASS / ❌ FAIL            ║
║                                                                        ║
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
║  😱 EMOTION TYPES: [list detected types]                               ║
║  │ Body Feelings: Yes/No                                               ║
║                                                                        ║
║  📈 SUMMARY                                                            ║
║  │ Gate Utama + Tambahan:  X/6 PASS                                    ║
║  │ Penilaian Internal:     X/6 PASS                                    ║
║  │ Emotion Types:          X/5                                         ║
║  ├────────────────────────────────────────────────────────────────────┤║
║  │ READY FOR SUBMISSION:   ✅ YES / ❌ NO                               ║
║  │ Confidence Level:       XX%                                          ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

### LANGKAH 6: CONTOH FORMAT (BUKAN UNTUK DICOPY)

> **⚠️ PERINGATAN: Contoh di bawah HANYA untuk memahami FORMAT.**
> **JANGAN copy isi konten - generate konten BARU dengan variasi berbeda!**

**FORMAT YANG BENAR:**
```
Code Runs, Disputes Don't. Enter Internet Court

[Paragraf tentang masalah dengan data spesifik]

[Paragraf dengan body feeling - VARIASIKAN]

[Paragraf tentang solusi dengan internetcourt.org]

[Pertanyaan engaging]

internetcourt.org
```

**CONTOH STRUKTUR (bukan untuk dicopy):**
- Paragraf 1: Hook + problem statement + data
- Paragraf 2: Emotional impact + body feeling
- Paragraf 3: Solution/internetcourt.org
- Paragraf 4: Call-to-action question

---

## 🔄 REGENERATION RULES

```
JIKA overall < 9.0 ATAU ada gate yang FAIL:
├── Identifikasi masalah spesifik
├── Generate ULANG dengan perbaikan
├── VARIASIKAN konten (jangan copy sebelumnya)
├── Re-hitung score
├── Max 3 regeneration attempts
└── Jika masih fail: tampilkan hasil terbaik + warning
```

---

## ✅ FINAL CHECKLIST

Sebelum output, pastikan:

- [ ] Hook sama persis dengan input
- [ ] Konten BARU di-generate (bukan copy contoh)
- [ ] 3-5 paragraf, masing-masing <280 char
- [ ] `internetcourt.org` ada
- [ ] Minimal 1 body feeling
- [ ] Akhiri dengan pertanyaan
- [ ] 3+ emotion types
- [ ] 0 banned words/phrases/patterns
- [ ] Semua gates pass (min 4/5 untuk Utama, 8/8 untuk Tambahan)
- [ ] Semua internal scores pass (min 9/10)
- [ ] Overall >= 9.0
- [ ] Score card lengkap

---

## 📁 REPOSITORY FILES

| File | Fungsi | Perlu LLM? |
|------|--------|------------|
| `README.md` | **File ini - semua instruksi** | ❌ TIDAK |
| `scripts/rally-ai-workflow.js` | Script Node.js workflow | ✅ **YA** |
| `scripts/rally-workflow-v8.7.6.js` | Full 24-phase workflow | ✅ **YA** |
| `scripts/llm-rate-limiter.js` | Rate limiter module | ❌ TIDAK |

---

## 🚨 TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| LLM rate limit (429) | Generate manual dengan kreativitas |
| Script not found | Generate manual mengikuti instruksi |
| Score < 9.0 | Regenerate dengan perbaikan |
| Konten sama dengan contoh | VARIASIKAN - jangan copy! |
| Missing body feeling | Tambahkan dari list |
| Banned word detected | Ganti dengan alternatif |
| Weak hook | Gunakan power pattern |

---

## 💡 PENTING UNTUK AI

1. **LLM GENERATE = WAJIB VARIASI** - Setiap generate harus berbeda
2. **CONTOH = REFERENSI FORMAT** - Bukan untuk dicopy isinya
3. **SCORING = ALGORITMA** - Ikuti formula, tidak perlu LLM
4. **BANNED = WAJIB HINDARI** - Tanpa exception
5. **MINIMUM SCORE = 9.0** - Regenerate jika kurang

---

## 🏷️ METADATA

- **Version:** V8.7.6
- **Last Updated:** 2026-03-20
- **LLM Required For:** Content Generation only
- **Algorithm Required For:** Scoring, Validation, Formatting

---

**END OF README**
