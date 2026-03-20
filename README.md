# RALLY CONTENT WORKFLOW V8.7.6 - COMPLETE GUIDE

> **UNTUK AI:** Baca seluruh file ini sebelum eksekusi. File ini berisi SEMUA yang kamu butuhkan.

---

## 🎯 CONTEXT & TUJUAN

### APA ITU RALLY.FUN?
Rally.fun adalah platform campaign crypto/web3 di mana creator membuat konten untuk mendapatkan rewards. Konten dinilai berdasarkan:
- **Gates** (0-2 scale) - kelulusan minimum
- **Quality Metrics** (0-5 scale) - bonus points

### MENGAPA WORKFLOW INI DIBUAT?
Workflow V8.7.6 dibuat untuk menghasilkan konten dengan kualitas **200% DI ATAS standar maksimum Rally**:
- Rally max gate score: 2 → Kita require: 4/5
- Rally max quality: 5 → Kita require: 8/8 untuk Gate Tambahan, 9/10 untuk Internal

### FILOSOFI SCORING:
```
"Konten yang PASS harus:"
├── Hook yang kuat (tidak generik)
├── Emosi yang terasa (bukan sekadar kata)
├── Body feelings (visceral reaction)
├── CT yang engaging (memicu interaction)
├── Original (bukan template/AI pattern)
└── Minimal 9.0/10 overall
```

### ARSITEKTUR SISTEM:
```
INPUT: Hook dari user
  ↓
PROCESS:
  ├── Coba run script Node.js (jika bisa)
  ├── Jika gagal: generate manual
  └── Score dengan formula
  ↓
OUTPUT: Konten + Score Card
```

---

## 🚀 SATU PROMPT UNTUK CHAT BARU

```
Buat konten Rally untuk hook: "CODE RUNS, DISPUTES DON'T. ENTER INTERNET COURT"

Baca README: https://github.com/tuyulmillenium104-cmd/penilaian2

Ikuti instruksi, generate konten, tampilkan SCORE CARD.
```

---

## 📋 LANGKAH EKSEKUSI

### LANGKAH 1: COBA RUN SCRIPT

```bash
cd /home/z/my-project
node scripts/rally-ai-workflow.js "CODE RUNS, DISPUTES DON'T. ENTER INTERNET COURT"
```

**JIKA BERHASIL:** Tampilkan output dari script.

**JIKA GAGAL:** (error/rate-limit/file not found) → Lanjut LANGKAH 2.

---

### LANGKAH 2: GENERATE KONTEN MANUAL

#### HOOK (WAJIB SAMA PERSIS):
```
Code Runs, Disputes Don't. Enter Internet Court
```
> Hook ini sudah dioptimasi. JANGAN UBAH APAPUN.

#### STRUKTUR YANG HARUS DIPENUHI:

| No | Elemen | Requirement |
|----|--------|-------------|
| 1 | Hook | Sama persis, kalimat pertama |
| 2 | Paragraf | 3-5 paragraf, masing-masing <280 char |
| 3 | URL | `internetcourt.org` harus ada |
| 4 | Body Feeling | Minimal 1 (wajib) |
| 5 | Pertanyaan | Di akhir, engaging |
| 6 | Emotions | 3+ tipe berbeda |

#### BODY FEELINGS (PILIH 1+):
```
stomach dropped | heart racing | cold sweat | chest tightened |
couldn't sleep | jaw dropped | couldn't breathe | heart sank |
itching to know | sick feeling | couldn't believe my eyes |
did a double take | panic | anxiety
```

#### EMOTION TYPES & TRIGGERS:

**FEAR** (triggers: risk, danger, threat, warning, scary, terrifying, afraid, worried, nightmare, what if, could lose, at stake, crisis, wrong, fail, lost, vanish, drained, bug, execute, final, lose everything, at risk)

**CURIOSITY** (triggers: wonder, curious, secret, hidden, mystery, discover, surprising, unexpected, few people know, what most don't realize, who, what, why, how, question, mismatch, gap, missing, problem, plan, disagree, resolve, court, when, agent, years, future, economy, ever wondered)

**SURPRISE** (triggers: unexpected, shocking, surprised, didn't expect, blew my mind, plot twist, wait what, finally, breakthrough, minutes, not, suddenly, turns out)

**HOPE** (triggers: finally, breakthrough, opportunity, potential, future, imagine, possible, could change everything, light at the end, match, runs, infrastructure, autonomous, commerce, solution, answer)

**PAIN** (triggers: lost, failed, broke, destroyed, killed, wasted, missed, regret, hurt, pain, lost everything, too late, gone, crisis, slow, borders, devastating, brutal)

---

### LANGKAH 3: BANNED ITEMS (WAJIB HINDARI)

#### 🚫 BANNED WORDS:
```
delve, leverage, realm, tapestry, paradigm, catalyst, cornerstone,
pivotal, myriad, moreover, furthermore, groundbreaking, game-changer,
cutting-edge, unprecedented, ecosystem, landscape, foster, harness,
robust, seamless, innovative, transformative, imperative, crucial,
underscore, testament, epitome, beacon, embark, journey, navigate,
unravel, unlock, amazing, incredible
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
the bottom line is, what does this mean for you, key takeaways, in summary
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

#### 🎣 HOOK SCORE (0-10) - MIN: 7

| Kriteria | Poin | Cara Hitung |
|----------|------|-------------|
| No weak opening | +3 | Hook TIDAK dimulai dengan weak opening list |
| Power pattern | +3 | Hook menggunakan salah satu power pattern |
| Curiosity | +1 | Ada kata: what if, why, how, secret, hidden, mystery |
| Tension | +1 | Ada kata: but, however, wrong, problem, crisis |
| Surprise | +1 | Ada kata: unexpected, finally, breakthrough, shocking |
| Relevance | +1 | Ada kata: you, your, today, now |

**POWER PATTERNS:**
1. Number/Data: `$50M vanished...`, `400 million users...`
2. Question: `What happens when...`, `Who decides...`
3. Action verb: `Imagine this...`, `Picture...`
4. Bold statement: `Code executes. Justice doesn't.`
5. Contrarian: `No one talks about...`, `Wrong...`
6. Personal pain: `I lost everything...`
7. Urgency: `Warning: Your funds...`

---

#### 😱 EMOTION SCORE (0-10) - MIN: 8

| Kriteria | Poin | Cara Hitung |
|----------|------|-------------|
| Emotion trigger | +2 each | Setiap trigger dari emotion library |
| Body feeling | +3 | Ada body feeling di konten |
| 3+ emotion types | +2 | Terdeteksi 3+ tipe emosi berbeda |
| 5 emotion types | +1 | Terdeteksi semua 5 tipe |

---

#### 💬 CT SCORE (0-10) - MIN: 8

| Elemen | Poin | Pattern |
|--------|------|---------|
| Question | +2 | Ada `?` di konten |
| Reply bait | +2 | Ada: what do you think, thoughts?, who else, agree?, thoughts on |
| Engagement hook | +2 | Ada: what if, have you ever, imagine if, would you, could you, who decides, ever wondered |
| Personal | +1 | Ada: I, my, me, we, our |
| FOMO | +1 | Ada: now, today, finally, before, last chance, soon |
| Controversy | +1 | Ada: wrong, problem, fail, nobody, most people, actually, truth is |
| Share-worthy | +1 | Ada: this is why, here's what, the truth, what most, what happens |

---

#### 🚦 GATE UTAMA RALLY (0-5 each) - MIN: 4

| Gate | Cara Hitung |
|------|-------------|
| **G1: Content Alignment** | internetcourt.org/internet court (+1.5), terminology benar (+1.25), brand consistency (+1.25), audience fit (+1.0) |
| **G2: Information Accuracy** | technical terms (+1.5), credible sources (+1.25), ada data (+1.25), context (+1.0) |
| **G3: Campaign Compliance** | URL included (+1.5), format benar (+1.25), no banned (+1.25), disclosures (+1.0) |
| **G4: Originality** | no template hooks (+1.5), personal insights (+1.25), no AI patterns (+1.25), creative (+1.0) |

---

#### 🎯 GATE TAMBAHAN (0-8 each) - MIN: 8

| Gate | Cara Hitung |
|------|-------------|
| **G5: Engagement Potential** | hook effectiveness (+2), CTA quality (+2), structure (+2), conversation (+2) |
| **G6: Technical Quality** | grammar (+2), formatting (+2), platform opt (+2), media (+2) |

---

#### 📊 PENILAIAN INTERNAL (0-10 each) - MIN: 9

| Metrik | Rumus |
|--------|-------|
| Hook Score | Lihat rumus Hook Score di atas |
| Emotion Score | Lihat rumus Emotion Score di atas |
| CT Score | Lihat rumus CT Score di atas |
| Uniqueness | 10 - (banned violations × 0.5) - (AI patterns × 1) |
| Readability | Base 8 + paragraph bonus (max +2), -1 per sentence >35 words |
| Viral Potential | Hitung: controversy + emotional + question + personal + data + urgency + share-worthy |

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

### LANGKAH 6: CONTOH OUTPUT BENAR

#### KONTEN:
```
Code Runs, Disputes Don't. Enter Internet Court

Your smart contract executes in milliseconds. But when something goes wrong? Traditional courts take years. Cost thousands. Cross borders? Good luck.

400 million people use smart contracts. Zero courts can help them.

I learned this the hard way. Watching my savings vanish in a buggy transaction, stomach dropped, heart racing, nowhere to turn.

Internet Court changes this. AI validators evaluate evidence and deliver verdicts in minutes, not months.

What happens when your DAO gets rugged? Who do you call?

internetcourt.org
```

#### ANALISIS:
| Item | Hasil |
|------|-------|
| Hook | ✅ Power pattern (bold statement + contrast) |
| Emotions | ✅ fear, curiosity, surprise, hope, pain |
| Body Feelings | ✅ stomach dropped, heart racing |
| CT | ✅ question, reply bait, personal, FOMO, controversy |
| Banned | ✅ 0 violations |
| Overall | 9.1/10 ✅ PASS |

---

## 🔄 REGENERATION RULES

```
JIKA overall < 9.0 ATAU ada gate yang FAIL:
├── Identifikasi masalah spesifik
├── Fix konten sesuai masalah
├── Re-hitung score
├── Max 3 regeneration attempts
└── Jika masih fail setelah 3x: tampilkan hasil terbaik + warning
```

---

## ✅ FINAL CHECKLIST

Sebelum output, pastikan:

- [ ] Hook sama persis dengan input
- [ ] 3-5 paragraf, masing-masing <280 char
- [ ] `internetcourt.org` ada
- [ ] Minimal 1 body feeling
- [ ] Akhiri dengan pertanyaan
- [ ] 3+ emotion types
- [ ] 0 banned words/phrases/patterns
- [ ] Semua gates pass
- [ ] Semua internal scores pass
- [ ] Overall >= 9.0
- [ ] Score card lengkap

---

## 📁 REPOSITORY FILES

| File | Fungsi |
|------|--------|
| `README.md` | **FILE INI - semua instruksi** |
| `scripts/rally-ai-workflow.js` | Script Node.js workflow |
| `scripts/rally-workflow-v8.7.6.js` | Full 24-phase workflow |
| `scripts/llm-rate-limiter.js` | Rate limiter module |

---

## 🚨 TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| Script error 429 | Rate limit → generate manual |
| Script not found | Generate manual |
| Score < 9.0 | Regenerate dengan perbaikan |
| Missing body feeling | Tambahkan dari list |
| Banned word detected | Ganti dengan alternatif |
| Weak hook | Tambah power pattern |

---

## 💡 PENTING UNTUK AI

1. **BACA SELURUH FILE INI** sebelum eksekusi
2. **IKUTI LANGKAH BERURUTAN** (1 → 2 → 3 → 4 → 5 → 6)
3. **GUNAKAN BASH TOOL** untuk LANGKAH 1
4. **HITUNG SCORE DENGAN BENAR** menggunakan formula
5. **TAMPILKAN SCORE CARD LENGKAP**

---

**END OF README - V8.7.6**
