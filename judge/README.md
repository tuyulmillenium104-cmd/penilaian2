# JUDGE WORKFLOW v1.1.0

## Deskripsi
Workflow ini bertugas untuk MENILAI konten dengan objektif dan blind judging.

## Prinsip Utama
1. **BLIND JUDGING** - Tidak tahu siapa pembuat konten
2. **OBJEKTIF** - Berdasarkan rubrik dan bukti
3. **TRANSPARAN** - Setiap skor ada reasoning dan evidence
4. **STRICT** - Standar tinggi, tidak kompromi
5. **FACT-CHECK** - Verifikasi klaim faktual dengan web search
6. **VERIFICATION 2x** - Setiap konten dinilai 2x untuk akurasi maksimal
7. **NO DOUBLE PENALTY** - Setiap kesalahan hanya dihukum sekali

## Struktur Penilaian

### Judge 1: Gate Utama (G1-G4) - Max 20, Pass 16

| Gate | Kriteria | Max | Breakdown |
|------|----------|-----|-----------|
| G1 | Content Alignment | 5 | topicRelevance(2) + terminologyUse(2) + factualConsistency(1) |
| G2 | Information Accuracy | 5 | technicalAccuracy(2) + noMisleading(2) + properContext(1) |
| G3 | Campaign Compliance | 5 | 5 binary checks × 1 poin |
| G4 | Originality | 5 | uniqueAngle(2) + noAiPatterns(2) + naturalVoice(1) |

### Judge 2: Gate Tambahan (G5-G6) - Max 16, Pass 14

| Gate | Kriteria | Max | Breakdown |
|------|----------|-----|-----------|
| G5 | Engagement Potential | 8 | hook(2) + cta(2) + structure(2) + conversation(2) |
| G6 | Technical Quality | 8 | grammar(2) + formatting(2) + platform(2) + charCount(2) |

### Judge 3: Penilaian Internal - Max 60, Pass 54

| Kriteria | Max | Cara Hitung |
|----------|-----|-------------|
| Hook Score | 10 | BASE (4/6/8) + BONUS (max +2) |
| Emotion Score | 10 | 3+ emotions+body(10), 3+ emotions(9), 2(7-8), 1(5-6) |
| CT Score | 10 | Question(2) + ReplyBait(2) + Engagement(2) + Personal(1) + FOMO(1) + Controversy(1) + Share(1) |
| Uniqueness Score | 10 | Start 10 - TemplateHook(3) - BannedWord(0.5) |
| Readability Score | 10 | SentenceLength(3) + Structure(4) + ParagraphBreaks(3) |
| Viral Potential | 10 | Base 3 + (elements count) |

## G3 Campaign Compliance - 5 Hard Checks

| # | Check | Points |
|---|-------|--------|
| 1 | requiredUrlPresent | 1 |
| 2 | noEmDashes | 1 |
| 3 | noBannedWords | 1 |
| 4 | properStart | 1 |
| 5 | noProhibitedElements (Thread 🧵, excess hashtags) | 1 |

## Hook Score - Priority System

```
STEP 1: Determine BASE
├── IF Power Pattern detected → BASE = 8
├── ELSE IF Weak Opening → BASE = 4
└── ELSE → BASE = 6

STEP 2: Add BONUS (max +2)
├── +1 IF emotion word in hook
└── +1 IF hook < 100 chars

STEP 3: CAP at 10
```

## Emotion Score - Clarified Rules

| Score | Condition |
|-------|-----------|
| 10 | 3+ emotion types + body feeling present |
| 9 | 3+ emotion types, NO body feeling |
| 7-8 | 2 emotion types |
| 5-6 | 1 emotion type |
| 0-4 | No emotion detected |

## No Double Penalty Rule

```
┌─────────────────────────────────────────────────────────────┐
│ AI PATTERNS                                                 │
├─────────────────────────────────────────────────────────────┤
│ ✓ Dihukum di: G4 Originality (-2 per word)                │
│ ✗ JANGAN hukum di: Judge 3 Uniqueness                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TEMPLATE HOOKS                                              │
├─────────────────────────────────────────────────────────────┤
│ ✓ Dihukum di: Judge 3 Uniqueness (-3 per hook)            │
│ ✗ JANGAN hukum di: G4 Originality                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ BANNED WORDS                                                │
├─────────────────────────────────────────────────────────────┤
│ ✓ Dihukum di: G3 Campaign Compliance (hard check)         │
│ ✓ Minor penalty di: Judge 3 Uniqueness (-0.5 per word)    │
└─────────────────────────────────────────────────────────────┘
```

## Verification 2x System

```
PENILAIAN 1 → FEEDBACK 1
       ↓
PENILAIAN 2 → FEEDBACK 2
       ↓
RECONCILIATION → FINAL DECISION
```

### Reconciliation Rules

| Selisih | Resolusi |
|---------|----------|
| 0 | Gunakan skor yang sama |
| 1 | Rata-rata kedua skor (round down) |
| 2-3 | Gunakan skor terendah (konservatif) |
| > 3 | **TIE-BREAKER diperlukan** |

### Tie-Breaker Triggers

- Selisih > 3 poin pada gate manapun
- Kontradiksi verdict (satu ACCURATE, satu INACCURATE)
- Mixed PASS/FAIL dengan gap besar

## Edge Cases Handling

| Case | Action |
|------|--------|
| Konten < 50 chars | REJECT tanpa penilaian |
| Tidak ada hook | Hook Score = 0 |
| Semua UPPERCASE | Readability Structure = 0 |
| Wall of text | Paragraph Breaks = 0 |
| Web search gagal | Gunakan KB atau skor konservatif |
| KB tidak tersedia | External verification + note |

## Confidence Levels

| Level | Kondisi |
|-------|---------|
| HIGH | Hard checks, factual claims dengan sumber, pattern match jelas |
| MEDIUM | Subjective dengan evidence, emotion tanpa body feeling |
| LOW | Web search gagal, KB unavailable, edge case |

## Decision Logic

```
IF kedua penilaian PASS → APPROVED
IF kedua penilaian FAIL → REJECTED
IF mixed:
   ├── Gate Utama fail di salah satu → REJECTED
   └── Gate lain → gunakan reconciliation
```

## Fact-Checking (G2)

### Verdict Categories
- **ACCURATE**: Klaim terverifikasi dengan sumber kredibel
- **PARTIALLY_ACCURATE**: Ada benarnya tapi ada yang kurang tepat
- **UNVERIFIED**: Tidak ditemukan sumber
- **INACCURATE**: Klaim salah

### Confidence Level
- **HIGH**: Sumber primer/resmi
- **MEDIUM**: Sumber sekunder kredibel
- **LOW**: Hanya satu sumber

## Output Format

```json
{
  "metadata": { "contentId", "timestamp", "verificationMethod" },
  "assessment1": { "scores", "feedback", "pass" },
  "assessment2": { "scores", "feedback", "pass" },
  "reconciliation": { "scoreComparison", "analysis", "finalScores" },
  "tieBreaker": { "assessment", "reasoning" },
  "finalDecision": { "approved", "confidence", "reasoning" }
}
```

## Files
- `workflow.md` - Complete system prompt dan rubrik
- `config.json` - Konfigurasi dan thresholds
- `README.md` - Dokumentasi ini

## Version History

| Version | Changes |
|---------|---------|
| 1.0.0 | Initial release |
| 1.1.0 | Fixed math bugs (G1-G4 breakdown), fixed double penalty, added tie-breaker, added edge cases, clarified hook/emotion scoring |
