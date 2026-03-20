# RALLY CONTENT WORKFLOW V9.0.0 - HYBRID ARCHITECTURE

> **Versi Baru:** Hybrid - Script untuk Data, AI Chat untuk Konten  
> **Total Phases:** Masih 24 phases (dikelompokkan jadi 2 groups)

---

## 🎯 KENAPA V9.0.0 HYBRID?

| Masalah V8.7.6 | Solusi V9.0.0 |
|----------------|---------------|
| LLM di script → Rate limit | LLM di AI Chat → Stabil |
| Script crash → Workflow stop | Script gagal → AI tetap bisa |
| Template-based output | AI creative output |
| Rigid 24 phases | Flexible phases |

---

## 🏗️ ARSITEKTUR HYBRID

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RALLY WORKFLOW V9.0.0                            │
│                    Total: 24 PHASES (2 Groups)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ════════════════════════════════════════════════════════════════   │
│  GROUP 1: DATA GATHERING (Script Node.js) - Phase 0-2B             │
│  ════════════════════════════════════════════════════════════════   │
│                                                                     │
│  Phase 0: Campaign Data Fetch                                       │
│  ├── HTTP GET Rally API                                            │
│  └── Output: title, goal, rules, style, missions                   │
│                                                                     │
│  Phase 1: Research                                                  │
│  ├── Web scraping project URLs                                     │
│  ├── Extract facts                                                 │
│  └── Output: knowledge base                                        │
│                                                                     │
│  Phase 2: Leaderboard Analysis                                      │
│  ├── HTTP GET leaderboard data                                     │
│  └── Output: top competitors, stats                                │
│                                                                     │
│  Phase 2B: Competitor Deep Analysis                                 │
│  ├── Analyze competitor patterns                                   │
│  └── Output: hook patterns, CTA styles, gaps                       │
│                                                                     │
│  LLM NEEDED: ❌ TIDAK (pure data fetching)                          │
│                                                                     │
│                              │                                      │
│                              ▼                                      │
│                                                                     │
│  ════════════════════════════════════════════════════════════════   │
│  GROUP 2: CONTENT PROCESSING (AI Chat) - Phase 3-16                │
│  ════════════════════════════════════════════════════════════════   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ SUB-GROUP 2A: CONTENT CREATION (Phase 3-10)                 │   │
│  │                                                             │   │
│  │  Phase 3: Gap Identification                                │   │
│  │  ├── Find unique angles vs competitors                      │   │
│  │  └── Output: opportunity gaps                               │   │
│  │                                                             │   │
│  │  Phase 4: Strategy Definition                               │   │
│  │  ├── Select hook type, emotion target, CTA type             │   │
│  │  └── Output: content strategy                               │   │
│  │                                                             │   │
│  │  Phase 5: Content Generation ⭐ CORE                        │   │
│  │  ├── LLM generates multi-version content                    │   │
│  │  └── Output: 3-5 content versions                           │   │
│  │                                                             │   │
│  │  Phase 6: Banned Items Scanner                              │   │
│  │  ├── Pattern match banned words/phrases                     │   │
│  │  └── Output: violations list                                │   │
│  │                                                             │   │
│  │  Phase 6B: Rewrite (if violations)                          │   │
│  │  ├── Fix violations                                         │   │
│  │  └── Output: clean content                                  │   │
│  │                                                             │   │
│  │  Phase 7: Uniqueness Validation                             │   │
│  │  ├── Compare vs competitor patterns                         │   │
│  │  └── Output: uniqueness score                               │   │
│  │                                                             │   │
│  │  Phase 8: Emotion Injection ⭐ CORE                         │   │
│  │  ├── Enhance emotional content                              │   │
│  │  └── Output: emotion-enhanced content                       │   │
│  │                                                             │   │
│  │  Phase 9: HES + Viral Scoring                               │   │
│  │  ├── Calculate HES score, viral score                       │   │
│  │  └── Output: scores                                         │   │
│  │                                                             │   │
│  │  Phase 9B: Viral Enhancement (loop max 2x)                  │   │
│  │  ├── Improve viral elements if score low                    │   │
│  │  └── Output: enhanced content                               │   │
│  │                                                             │   │
│  │  Phase 10: Quality Selection 🔒 LOCK POINT                  │   │
│  │  ├── Score all versions, select best                        │   │
│  │  └── Output: 1 selected version                             │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ SUB-GROUP 2B: REFINEMENT (Phase 11-14B)                     │   │
│  │                                                             │   │
│  │  Phase 11: Micro-Optimization                               │   │
│  │  ├── 5-layer optimization (word, sentence, char, etc.)      │   │
│  │  └── Output: optimized content                              │   │
│  │                                                             │   │
│  │  Phase 12: Content Flow Polish                              │   │
│  │  ├── Smooth transitions between paragraphs                  │   │
│  │  └── Output: polished content                               │   │
│  │                                                             │   │
│  │  Phase 12B: 16 Gates Simulation                             │   │
│  │  ├── Validate all 16 gates                                  │   │
│  │  └── Output: gate results                                   │   │
│  │                                                             │   │
│  │  Phase 13: Benchmark Comparison                             │   │
│  │  ├── Compare vs real competitor data                        │   │
│  │  └── Output: benchmark score                                │   │
│  │                                                             │   │
│  │  Phase 13B: Beat Top 20 Strategy (loop max 2x)              │   │
│  │  ├── Ensure content beats top competitors                   │   │
│  │  └── Output: competitive content                            │   │
│  │                                                             │   │
│  │  Phase 14: Final Emotion Re-Check ⭐ CORE                   │   │
│  │  ├── Verify emotion score meets minimum                     │   │
│  │  └── Output: emotion-validated content                      │   │
│  │                                                             │   │
│  │  Phase 14B: Final Content Polish                            │   │
│  │  ├── Last review before output                              │   │
│  │  └── Output: final content (LOCKED)                         │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ SUB-GROUP 2C: OUTPUT (Phase 15-16)                          │   │
│  │                                                             │   │
│  │  Phase 15: Output Generation                                │   │
│  │  ├── Format content, generate Q&A                           │   │
│  │  └── Output: formatted content                              │   │
│  │                                                             │   │
│  │  Phase 15B: CT Maximizer (loop max 2x)                      │   │
│  │  ├── Enhance CT elements                                    │   │
│  │  └── Output: CT-enhanced content                            │   │
│  │                                                             │   │
│  │  Phase 16: Export & Delivery                                │   │
│  │  ├── Save to file, display score card                       │   │
│  │  └── Output: FINAL DELIVERABLE                              │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  LLM NEEDED: ✅ YA (Phase 5, 8, 14 core - yang lain algoritma)      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 PHASE BREAKDOWN:

| Phase | Nama | Di Mana? | Perlu LLM? | Fungsi |
|-------|------|----------|------------|--------|
| 0 | Campaign Fetch | Script | ❌ | API call |
| 1 | Research | Script | ❌ | Web scraping |
| 2 | Leaderboard | Script | ❌ | API call |
| 2B | Competitor Analysis | Script | ❌ | Pattern analysis |
| 3 | Gap Identification | AI Chat | ❌ | Algoritma |
| 4 | Strategy | AI Chat | ❌ | Algoritma |
| **5** | **Content Generation** | AI Chat | ✅ **YA** | **LLM generate** |
| 6 | Banned Scanner | AI Chat | ❌ | Pattern match |
| 6B | Rewrite | AI Chat | ✅ YA | LLM fix |
| 7 | Uniqueness | AI Chat | ❌ | Comparison |
| **8** | **Emotion Injection** | AI Chat | ✅ **YA** | **LLM enhance** |
| 9 | HES + Viral | AI Chat | ❌ | Algoritma |
| 9B | Viral Enhancement | AI Chat | ✅ YA | LLM improve |
| 10 | Quality Selection | AI Chat | ❌ | Algoritma |
| 11 | Micro-Optimization | AI Chat | ❌ | Text processing |
| 12 | Flow Polish | AI Chat | ❌ | Text processing |
| 12B | Gate Simulation | AI Chat | ❌ | Validation |
| 13 | Benchmark | AI Chat | ❌ | Comparison |
| 13B | Beat Top 20 | AI Chat | ✅ YA | LLM strategy |
| **14** | **Final Emotion** | AI Chat | ✅ **YA** | **LLM validate** |
| 14B | Final Polish | AI Chat | ❌ | Text processing |
| 15 | Output | AI Chat | ❌ | Formatting |
| 15B | CT Maximizer | AI Chat | ✅ YA | LLM enhance |
| 16 | Export | AI Chat | ❌ | File writing |

---

## 🎯 KESIMPULAN:

| Pertanyaan | Jawaban |
|------------|---------|
| Apakah phases berkurang? | **TIDAK - tetap 24 phases** |
| Kenapa disebut 2 groups? | Berdasarkan **lokasi eksekusi** (Script vs AI Chat) |
| Apa yang membedakan? | **LLM tidak di script, tapi di AI Chat** |
| Apakah lengkap? | **YA - semua phase dari V8.7.6 ada** |

---

## 🚀 CARA PENGGUNAAN:

### Step 1: Data Gathering (Script)
```bash
node scripts/rally-data-gatherer.js [campaign_address]
```

**Output:** JSON dengan Phase 0-2B complete

### Step 2: Content Processing (AI Chat)

```
Buat konten Rally dengan data berikut:

[paste JSON output dari Step 1]

Ikuti Phase 3-16:
1. Phase 3-10: Generate & validate content
2. Phase 11-14B: Refine & optimize
3. Phase 15-16: Output & score card

Tampilkan hasil dengan SCORE CARD.
```

---

## 📁 FILE STRUCTURE:

```
/home/z/my-project/
├── README.md                        # File ini (V9.0.0)
├── scripts/
│   ├── rally-data-gatherer.js       # Phase 0-2B (Script)
│   └── rally-workflow-v8.7.6.js     # Legacy (all in script)
└── download/
    └── rally-data-*.json            # Output data files
```

---

## ⚠️ PENTING:

**AI Chat harus menjalankan SEMUA Phase 3-16, bukan hanya generate konten!**

Checklist untuk AI:
- [ ] Phase 3: Gap identification
- [ ] Phase 4: Strategy definition
- [ ] Phase 5: Generate content
- [ ] Phase 6: Scan banned items
- [ ] Phase 6B: Rewrite if needed
- [ ] Phase 7: Uniqueness check
- [ ] Phase 8: Emotion injection
- [ ] Phase 9: HES + Viral score
- [ ] Phase 9B: Enhance if needed
- [ ] Phase 10: Select best version
- [ ] Phase 11: Micro-optimization
- [ ] Phase 12: Flow polish
- [ ] Phase 12B: 16 Gates validation
- [ ] Phase 13: Benchmark comparison
- [ ] Phase 13B: Beat top 20
- [ ] Phase 14: Final emotion check
- [ ] Phase 14B: Final polish
- [ ] Phase 15: Output format
- [ ] Phase 15B: CT maximize
- [ ] Phase 16: Export + Score Card

---

## 🏷️ METADATA

- **Version:** V9.0.0 Hybrid
- **Branch:** v9.0.0-hybrid
- **Total Phases:** 24 phases (unchanged)
- **Groups:** 2 (Data Gathering + Content Processing)
- **LLM Phases:** 6 phases (5, 6B, 8, 9B, 13B, 14, 15B)

---

**END OF README V9.0.0**
