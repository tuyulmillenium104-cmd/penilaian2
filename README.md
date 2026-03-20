# RALLY CONTENT WORKFLOW V8.7.6

## 🎯 SATU PROMPT UNTUK CHAT BARU

```
Buat konten Rally untuk hook: "CODE RUNS, DISPUTES DON'T. ENTER INTERNET COURT"

Baca README lengkap di: https://github.com/tuyulmillenium104-cmd/penilaian2

Ikuti semua instruksi di README, jalankan workflow, tampilkan konten + SCORE CARD.
```

---

## 📋 INSTRUKSI LENGKAP UNTUK AI

### LANGKAH 1: EKSEKUSI SCRIPT

```bash
cd /home/z/my-project
node scripts/rally-ai-workflow.js "CODE RUNS, DISPUTES DON'T. ENTER INTERNET COURT"
```

**JIKA BERHASIL:** Tampilkan output dari script.

**JIKA GAGAL (error/rate-limit):** Lanjut ke LANGKAH 2.

---

### LANGKAH 2: GENERATE KONTEN MANUAL

#### HOOK (WAJIB SAMA PERSIS):
```
Code Runs, Disputes Don't. Enter Internet Court
```

#### STRUKTUR KONTEN:
1. Hook = kalimat pertama (JANGAN diubah!)
2. 3-5 paragraf, masing-masing <280 karakter
3. Pisahkan paragraf dengan baris kosong
4. Include: `internetcourt.org`
5. Include minimal 1 BODY FEELING
6. Akhiri dengan PERTANYAAN engaging

#### BODY FEELINGS (WAJIB 1+):
```
stomach dropped | heart racing | cold sweat | chest tightened | 
couldn't sleep | jaw dropped | couldn't breathe | heart sank |
itching to know | sick feeling
```

#### EMOTION TRIGGERS (WAJIB 3+ TIPE):

| Emotion | Triggers |
|---------|----------|
| **Fear** | risk, danger, threat, warning, scary, terrifying, afraid, worried, nightmare, what if, could lose, at stake, crisis, wrong, fail, lost, vanish, drained |
| **Curiosity** | wonder, curious, secret, hidden, mystery, discover, surprising, unexpected, few people know, what most don't realize, gap, missing, problem |
| **Surprise** | unexpected, shocking, surprised, didn't expect, blew my mind, plot twist, wait what, finally, breakthrough |
| **Hope** | finally, breakthrough, opportunity, potential, future, imagine, possible, could change everything, solution |
| **Pain** | lost, failed, broke, destroyed, killed, wasted, missed, regret, hurt, pain, lost everything, too late, gone, rugged |

---

### LANGKAH 3: BANNED ITEMS (JANGAN GUNAKAN)

#### BANNED WORDS:
```
delve, leverage, realm, tapestry, paradigm, catalyst, cornerstone, 
pivotal, myriad, moreover, furthermore, groundbreaking, game-changer, 
cutting-edge, unprecedented, ecosystem, landscape, foster, harness, 
robust, seamless, innovative, transformative, imperative, crucial, 
underscore, testament, epitome, beacon, embark, journey, navigate, 
unravel, unlock
```

#### BANNED PHRASES:
```
in the world of, picture this, imagine a world, lets dive in, 
at its core, in conclusion, it is important to note, moving forward,
not only but also, a testament to, it's worth noting, needless to say,
at the heart of, the fact of the matter, in the digital age, 
with the rise of, in recent years, double-edged sword, tip of the iceberg,
game changer, first and foremost, last but not least,
plays a crucial role, paved the way
```

#### BANNED AI PATTERNS:
```
in this thread, here's what you need to know, let me break it down,
the bottom line is, what does this mean for you, key takeaways,
in summary
```

#### BANNED TEMPLATE HOOKS:
```
unpopular opinion, hot take, thread alert, breaking, this is your sign,
psa, reminder that, quick thread, important thread, drop everything,
stop scrolling, hear me out, let me explain, nobody is talking about,
story time
```

#### WEAK OPENINGS (JANGAN BUKA DENGAN):
```
the, a, an, this is, there are, there is, i think, it is, in the,
today, so, well, basically, honestly, actually, first, let me,
here is, here are
```

---

### LANGKAH 4: SCORING SYSTEM

#### HOOK SCORE (0-10) - MIN: 7

| Kriteria | Poin |
|----------|------|
| Tidak buka dengan weak opening | +3 |
| Pakai power pattern (lihat bawah) | +3 |
| Ada curiosity element | +1 |
| Ada tension element | +1 |
| Ada surprise element | +1 |
| Ada relevance element | +1 |

**POWER PATTERNS:**
- Number/Data: `$50M vanished...`, `400 million users...`
- Question: `What happens when...`, `Who decides...`
- Action verb: `Imagine this...`, `Picture...`
- Bold statement: `Code executes perfectly. Justice doesn't.`
- Contrarian: `No one talks about...`, `Wrong...`
- Personal pain: `I lost everything...`, `I couldn't believe...`
- Urgency: `Warning: Your funds...`, `Alert...`

---

#### EMOTION SCORE (0-10) - MIN: 8

| Kriteria | Poin |
|----------|------|
| Setiap emotion trigger | +2 |
| Body feeling included | +3 |
| 3+ emotion types | +2 |
| 5 emotion types | +1 |

---

#### CT SCORE (0-10) - MIN: 8

| Elemen | Poin | Pattern |
|--------|------|---------|
| Question | +2 | `?` |
| Reply bait | +2 | `what do you think`, `thoughts?`, `who else`, `agree?` |
| Engagement hook | +2 | `what if`, `have you ever`, `imagine if`, `would you` |
| Personal | +1 | `I`, `my`, `me`, `we`, `our` |
| FOMO | +1 | `now`, `today`, `finally`, `before`, `last chance` |
| Controversy | +1 | `wrong`, `problem`, `fail`, `nobody`, `truth is` |
| Share-worthy | +1 | `this is why`, `here's what`, `the truth` |

---

#### GATE UTAMA RALLY (0-5 each) - MIN: 4

| Gate | Kriteria Scoring |
|------|------------------|
| **G1: Content Alignment** | Mention Internet Court/internetcourt.org (+1.5), terminology benar (+1.25), brand consistency (+1.25), audience fit (+1.0) |
| **G2: Information Accuracy** | Technical terms (+1.5), credible sources (+1.25), ada data/angka (+1.25), proper context (+1.0) |
| **G3: Campaign Compliance** | URL included (+1.5), format benar (+1.25), no banned items (+1.25), disclosures (+1.0) |
| **G4: Originality** | No template hooks (+1.5), personal insights (+1.25), no AI patterns (+1.25), creative expression (+1.0) |

---

#### GATE TAMBAHAN (0-8 each) - MIN: 8

| Gate | Kriteria Scoring |
|------|------------------|
| **G5: Engagement Potential** | Hook effectiveness (+2), CTA quality (+2), content structure (+2), conversation potential (+2) |
| **G6: Technical Quality** | Grammar/spelling (+2), formatting (+2), platform optimization (+2), media integration (+2) |

---

#### PENILAIAN INTERNAL (0-10 each) - MIN: 9

| Metrik | Kriteria |
|--------|----------|
| **Hook Score** | Lihat rumus Hook Score di atas |
| **Emotion Score** | Lihat rumus Emotion Score di atas |
| **CT Score** | Lihat rumus CT Score di atas |
| **Uniqueness** | 10 - (banned violations × 0.5) - (AI patterns × 1) |
| **Readability** | Base 8 + paragraph count bonus, minus long sentences |
| **Viral Potential** | Controversy + emotional + question + personal + data + urgency + share-worthy |

---

#### OVERALL SCORE - MIN: 9.0

```
OVERALL = (Gate_Average / 8 × 4) + (Internal_Average / 10 × 6)
```

---

### LANGKAH 5: FORMAT OUTPUT

#### KONTEN:
```
[Hook - sama persis]

[Paragraf 2]

[Paragraf 3]

[Paragraf 4 - dengan body feeling]

[Paragraf 5 - pertanyaan]

internetcourt.org
```

#### SCORE CARD:
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
║  ├────────────────────────────────────────────────────────────────────┤ ║
║  │ OVERALL SCORE:               X.X/10  │ ✅ PASS / ❌ FAIL            ║
║                                                                        ║
║  😱 EMOTION TYPES: [list detected types]                               ║
║  │ Body Feelings: Yes/No                                               ║
║                                                                        ║
║  📈 SUMMARY                                                            ║
║  │ Gate Utama + Tambahan:  X/6 PASS                                    ║
║  │ Penilaian Internal:     X/6 PASS                                    ║
║  │ Emotion Types:          X/5                                         ║
║  ├────────────────────────────────────────────────────────────────────┤ ║
║  │ READY FOR SUBMISSION:   ✅ YES / ❌ NO                               ║
║  │ Confidence Level:       XX%                                          ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

### LANGKAH 6: CONTOH OUTPUT YANG BENAR

#### KONTEN:
```
Code Runs, Disputes Don't. Enter Internet Court

Your smart contract executes in milliseconds. But when something goes wrong? Traditional courts take years. Cost thousands. Cross borders? Good luck.

400 million people use smart contracts. Zero courts can help them.

I learned this the hard way. Watching my savings vanish in a buggy transaction, stomach dropped, heart racing, nowhere to turn.

Internet Court changes this. AI validators evaluate evidence and deliver verdicts in minutes, not months. No geographical limits. No astronomical legal fees.

What happens when your DAO gets rugged? Who do you call?

internetcourt.org
```

#### ANALISIS:
- Hook: ✅ Power pattern (bold statement + contrast)
- Emotions: ✅ fear, curiosity, surprise, hope, pain
- Body Feelings: ✅ stomach dropped, heart racing
- CT: ✅ question, reply bait, personal, FOMO, controversy
- Banned: ✅ 0 violations
- Overall: 9.1/10 ✅ PASS

---

## 🔄 REGENERATION RULES

Jika overall < 9.0 atau ada gate yang fail:

1. Identifikasi masalah
2. Fix konten
3. Re-score
4. Max 3 regeneration attempts
5. Jika masih fail setelah 3x, tampilkan hasil terbaik dengan warning

---

## 📁 FILE DI REPOSITORY

| File | Fungsi |
|------|--------|
| `README.md` | **File ini - semua instruksi** |
| `scripts/rally-ai-workflow.js` | Script Node.js workflow |
| `scripts/rally-workflow-v8.7.6.js` | Full 24-phase workflow |
| `scripts/llm-rate-limiter.js` | Rate limiter module |

---

## 🚀 TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| Script error 429 | Rate limit, lanjut generate manual |
| Script not found | Generate manual mengikuti instruksi di atas |
| Score < 9.0 | Regenerate dengan perbaikan |
| Missing body feeling | Tambahkan body feeling |
| Banned word detected | Ganti dengan alternatif |

---

## ✅ CHECKLIST FINAL

Sebelum submit, pastikan:

- [ ] Hook sama persis dengan input
- [ ] Semua gates pass (min 4/5 untuk Gate Utama, 8/8 untuk Tambahan)
- [ ] Semua internal scores pass (min 9/10)
- [ ] Overall score >= 9.0
- [ ] Ada 3+ emotion types
- [ ] Ada body feeling
- [ ] Tidak ada banned items
- [ ] Format score card lengkap

---

**END OF README**
