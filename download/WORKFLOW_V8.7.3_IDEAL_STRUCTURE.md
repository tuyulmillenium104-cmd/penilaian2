# RALLY WORKFLOW V8.7.3 - IDEAL STRUCTURE
## Perencanaan Phase Lengkap Tanpa Bentrok/Overlap

================================================================================
                    PRINSIP UTAMA: MENCEGAH BENTROK & OVERLAP
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│  RULE 1: Setiap Phase Punya Tanggung Jawab UNIK                            │
│  RULE 2: Content HANYA diubah pada phase tertentu                          │
│  RULE 3: Setelah fase "LOCK" - tidak boleh diubah lagi                     │
│  RULE 4: Setiap phase punya INPUT → PROCESS → OUTPUT → VALIDATE            │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    DIAGRAM ALUR LENGKAP DENGAN FEEDBACK LOOP
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ ═════════════════ INPUT SECTION (Data Gathering) ═════════════════════════│
│  Fokus: Mengumpulkan data, TIDAK mengubah content                          │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   Phase 0    │  Preparation + API Status Check
    │ Preparation  │  OUTPUT: CAMPAIGN_DATA + EXECUTION_MODE
    └──────┬───────┘
           ↓
    ┌──────────────┐
    │   Phase 1    │  Research (Web Scraping)
    │  Research    │  OUTPUT: KNOWLEDGE_BASE (25+ facts)
    └──────┬───────┘
           ↓
    ┌──────────────┐
    │   Phase 2    │  Leaderboard Analysis
    │  Leaderboard │  OUTPUT: COMPETITOR_PATTERNS (10 competitors)
    └──────┬───────┘
           ↓
    ┌──────────────┐
    │  Phase 2B    │  Competitor Deep Analysis [OPTIONAL - Skip if no API]
    │  (OPTIONAL)  │  OUTPUT: COMPETITOR_CONTENT (detailed hooks/CTAs)
    └──────┬───────┘
           ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ ═════════════════ PROCESS SECTION (Content Creation) ═════════════════════│
│  Fokus: Generate dan memilih content terbaik                               │
│  MULTIPLE VERSIONS sampai Phase 10, kemudian LOCK ke 1 version            │
└─────────────────────────────────────────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │   Phase 3    │  Gap Identification
    │   Gaps       │  OUTPUT: UNUSED_PATTERNS (opportunities)
    └──────┬───────┘
           ↓
    ┌──────────────┐
    │   Phase 4    │  Strategy Definition
    │  Strategy    │  OUTPUT: CONTENT_STRATEGY (angle/emotion/CTA)
    └──────┬───────┘
           ↓
    ┌──────────────┐
    │   Phase 5    │  Content Generation
    │  Generate    │  OUTPUT: 5_RAW_VERSIONS (V1-V5)
    └──────┬───────┘
           ↓
    ┌──────────────┐     FAIL (violations found)
    │   Phase 6    │ ───────────────────────────────┐
    │   Scanner    │                                │
    │  (Detect)    │                                ↓
    └──────┬───────┘     ┌──────────────┐     ┌──────────────┐
           │ PASS        │   Phase 6B   │ ──→ │ Re-validate  │
           ↓             │   Rewrite    │     │   Phase 6    │
    ┌──────────────┐     │  (Fix Only)  │     └──────────────┘
    │   Phase 7    │     └──────────────┘
    │  Uniqueness  │     OUTPUT: 5_CLEAN_VERSIONS (0 violations)
    │ Validation   │ ←─────────────────────────────────────────┘
    └──────┬───────┘
           ↓
    ┌──────────────┐     FAIL (emotion < 7)
    │   Phase 8    │ ───────────────────────────────┐
    │   Emotion    │                                │
    │  Injection   │                                ↓
    └──────┬───────┘     ┌──────────────┐     ┌──────────────┐
           │ PASS        │  Enhance     │ ──→ │ Re-check     │
           ↓             │  Emotion     │     │   Phase 8    │
    ┌──────────────┐     └──────────────┘     └──────────────┘
    │   Phase 9    │
    │ HES + Viral  │ ←─────────────────────────────────────────┘
    │   Scores     │     OUTPUT: 5_EMOTIONAL_VERSIONS
    └──────┬───────┘
           │
           ↓
    ╔════════════════╗
    ║ 🔒 LOCK POINT  ║  SELESAI MULTI-VERSION, PILIH 1 TERBAIK
    ╚════════╤═══════╝
             ↓
    ┌──────────────┐
    │   Phase 10   │  Quality Scoring & Selection
    │  Selection   │  OUTPUT: SELECTED_VERSION (1 version)
    └──────┬───────┘  DARI SINI HANYA BEKERJA DENGAN 1 VERSION
           ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ ═════════════════ REFINE SECTION (Optimization) ══════════════════════════│
│  Fokus: Optimasi SELECTED_VERSION                                           │
│  Layer-by-layer optimization, TIDAK mengubah substance                     │
└─────────────────────────────────────────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │   Phase 11   │  Micro-Optimization (5 Layers)
    │ Micro-Opt    │  Layer 1: Word level (remove filler, add power words)
    │ 5 Layers     │  Layer 2: Sentence level (vary length, trim)
    └──────┬───────┘  Layer 3: Character level (fit 280 chars)
           │          Layer 4: Emotion level (preserve target emotion)
           ↓          Layer 5: Psychology level (curiosity, urgency)
    ┌──────────────┐
    │   Phase 12   │  Content Flow Polish
    │ Flow Polish  │  - Analyze transitions between tweets
    │              │  - Add bridges, fix abrupt transitions
    └──────┬───────┘  - Fix emotion jumps, redundancy
           │          OUTPUT: POLISHED_VERSION
           ↓
    ┌──────────────┐     FAIL (any gate)
    │  Phase 12B   │ ───────────────────────────────┐
    │ Gate Simul.  │                                │
    │  (16 Gates)  │                                ↓
    └──────┬───────┘     ┌─────────────────────────────────────┐
           │ PASS        │ G1 FAIL → Back to Phase 11 (align)  │
           ↓             │ G2 FAIL → Back to Phase 1 (facts)   │
    ┌──────────────┐     │ G3 FAIL → Back to Phase 5 (require) │
    │   Phase 13   │     │ G4 FAIL → Back to Phase 3 (unique)  │
    │  Benchmark   │     └─────────────────────────────────────┘
    │ Comparison   │ ←─────────────────────────────────────────┘
    └──────┬───────┘     OUTPUT: GATE_PASSED_VERSION (16/16 gates)
           │
           ↓
    ┌──────────────┐     FAIL (emotion dropped below 7)
    │   Phase 14   │ ───────────────────────────────┐
    │ Final Emo    │                                │
    │  Re-Check    │                                ↓
    └──────┬───────┘     ┌──────────────┐     ┌──────────────┐
           │ PASS        │  Re-inject   │ ──→ │ Re-check     │
           ↓             │  Emotion     │     │   Phase 14   │
    ┌──────────────┐     └──────────────┘     └──────────────┘
    │  Phase 14B   │
    │ Final Polish │ ←─────────────────────────────────────────┘
    │ (Last check) │     OUTPUT: EMOTION_VERIFIED_VERSION
    └──────┬───────┘
           ↓
    ╔════════════════╗
    ║ 🔒 FINAL LOCK  ║  CONTENT TIDAK BOLEH DIUBAH LAGI
    ╚════════╤═══════╝
             ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ ═════════════════ OUTPUT SECTION (Delivery) ══════════════════════════════│
│  Fokus: Formatting dan delivery, TIDAK mengubah content                    │
└─────────────────────────────────────────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │   Phase 15   │  Output Generation
    │   Output     │  - Final content formatting
    │  (No Images) │  - Generate 15 Q&A pairs
    └──────┬───────┘  OUTPUT: COMPLETE_ASSETS
           ↓
    ┌──────────────┐
    │   Phase 16   │  Final Verification
    │  Verify      │  - All phases executed
    │              │  - All gates passed
    └──────────────┘
           ↓
    ████████ READY FOR SUBMISSION ████████


================================================================================
                    TANGGUNG JAWAB SETIAP PHASE (UNIK)
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTENT MODIFICATION PERMISSIONS                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CAN MODIFY CONTENT:                                                        │
│  ├─ Phase 5: Generate content from scratch                                  │
│  ├─ Phase 6B: Fix violations only (word replacement)                        │
│  ├─ Phase 8: Inject emotion words/phrases                                   │
│  ├─ Phase 11: Word/sentence/character optimization                          │
│  ├─ Phase 12: Add bridges, fix transitions                                  │
│  ├─ Phase 14: Re-inject emotion if dropped                                  │
│  └─ Phase 14B: Final polish (minor adjustments)                             │
│                                                                             │
│  CANNOT MODIFY CONTENT (Read-only):                                         │
│  ├─ Phase 0-4: Data gathering only                                          │
│  ├─ Phase 6: Detection only (no fix)                                        │
│  ├─ Phase 7: Validation only                                                │
│  ├─ Phase 9: Scoring only                                                   │
│  ├─ Phase 10: Selection only                                                │
│  ├─ Phase 12B: Gate check only                                              │
│  ├─ Phase 13: Comparison only                                               │
│  ├─ Phase 15: Formatting only                                               │
│  └─ Phase 16: Verification only                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


================================================================================
                    PHASE DEPENDENCY MATRIX
================================================================================

Phase   | Depends On        | Can Failback To    | Output Used By
--------|-------------------|--------------------|-----------------------
0       | -                 | -                  | 1, 2
1       | 0                 | -                  | 3, 10, 15
2       | 0, 1              | -                  | 3, 7, 13
2B      | 2                 | Skip if no API     | 3
3       | 2 (+ 2B if done)  | 2 (more data)      | 4
4       | 3                 | 3 (different gaps) | 5
5       | 4, 1              | -                  | 6
6       | 5                 | 6B (if violations)| 6B, 7
6B      | 6                 | 5 (regenerate)     | 7
7       | 6B, 2             | 5 (regenerate)     | 8
8       | 7                 | 8 (re-enhance)     | 9
9       | 8                 | 8 (if HES fail)    | 10
10      | 9                 | 5 (regenerate all) | 11
11      | 10                | -                  | 12
12      | 11                | 11 (over-optimized)| 12B
12B     | 12                | 11/1/5/3          | 13
13      | 12B, 2            | 4 (re-strategize)  | 14
14      | 13                | 8 (re-emotion)     | 14B
14B     | 14                | -                  | 15
15      | 14B, 1            | -                  | 16
16      | 15                | Any incomplete     | -


================================================================================
                    GATE DETAILS (Phase 12B - 16 Gates)
================================================================================

G1: CONTENT ALIGNMENT (4 sub-gates)
├── G1.1: Main topic aligned with campaign mission
├── G1.2: Tone matches campaign guidelines
├── G1.3: Key message is clear and consistent
└── G1.4: No off-topic tangents

G2: INFORMATION ACCURACY (4 sub-gates)
├── G2.1: All facts verifiable from KNOWLEDGE_BASE
├── G2.2: Numbers/statistics are accurate
├── G2.3: No misleading claims
└── G2.4: Sources are credible

G3: CAMPAIGN COMPLIANCE (4 sub-gates)
├── G3.1: Required mentions included (@___)
├── G3.2: Required topics included (#___)
├── G3.3: Required links included (if applicable)
└── G3.4: Character/tweet limits respected

G4: ORIGINALITY (4 sub-gates)
├── G4.1: No overlap with competitor hooks (>70% different)
├── G4.2: No overlap with competitor CTAs (>70% different)
├── G4.3: No AI template patterns detected
└── G4.4: Emotion approach is unique


================================================================================
                    OPTIMIZATION SEQUENCE (Phase 11)
================================================================================

Layer 1: WORD LEVEL
├── Remove filler words: very, really, just, actually, basically
├── Replace weak words with power words
└── Add emotion triggers if missing

Layer 2: SENTENCE LEVEL
├── Vary sentence lengths (mix short and long)
├── Trim low-value sentences
└── Strengthen opening sentences

Layer 3: CHARACTER LEVEL
├── Ensure each tweet <= 280 characters
├── Optimize line breaks for readability
└── Remove redundant punctuation

Layer 4: EMOTION LEVEL
├── Ensure target emotion present in hook
├── Build emotion arc through thread
└── Preserve emotion during optimization

Layer 5: PSYCHOLOGY LEVEL
├── Enhance curiosity gaps
├── Add urgency to CTA
└── Include social proof elements


================================================================================
                    EMOTION PRESERVATION STRATEGY
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│  EMOTION IS SET IN PHASE 8 AND MUST BE PRESERVED                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 8: EMOTION INJECTION                                                 │
│  └── Sets target emotion and injects emotion triggers                      │
│                                                                             │
│  Phase 11: OPTIMIZATION                                                     │
│  └── Layer 4 specifically preserves emotion (does NOT reduce)              │
│                                                                             │
│  Phase 12: FLOW POLISH                                                      │
│  └── Emotion bridges ensure smooth emotion transitions                     │
│                                                                             │
│  Phase 14: EMOTION RE-CHECK                                                 │
│  └── IF emotion dropped < 7/10: Re-inject (Phase 8 techniques)            │
│  └── This is the LAST chance to fix emotion                                │
│                                                                             │
│  After Phase 14B: EMOTION IS LOCKED                                         │
│  └── No more modifications allowed                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


================================================================================
                    IMPLEMENTATION PRIORITY
================================================================================

PRIORITY 1 (CRITICAL - Must Have):
├── Phase 6B: Rewrite (compliance is essential)
├── Phase 11: Micro-Optimization (quality improvement)
├── Phase 12B: Complete 16 Gates (validation)
└── Phase 14: Final Emotion Re-Check (engagement)

PRIORITY 2 (IMPORTANT - Should Have):
├── Phase 12: Content Flow Polish (readability)
├── Phase 13: Benchmark Comparison (competitive edge)
└── Phase 14B: Final Content Polish (last mile)

PRIORITY 3 (OPTIONAL - Nice to Have):
├── Phase 2B: Competitor Deep Analysis (requires web-reader API)
└── Phase 15: Q&A Generation (requires LLM, images skipped)


================================================================================
                    SUMMARY: NO OVERLAP GUARANTEE
================================================================================

✅ Phase 6 (Detect) ≠ Phase 6B (Fix) - Separate responsibilities
✅ Phase 11 (Optimize) ≠ Phase 12 (Polish) - Different focus
✅ Phase 8 (Inject) ≠ Phase 14 (Verify) - One sets, one verifies
✅ Selection in Phase 10 LOCKS to single version
✅ Content FINALIZED after Phase 14B - No more changes
✅ Phase 15-16 only format, don't modify content
✅ Each gate in 12B has specific failback path
