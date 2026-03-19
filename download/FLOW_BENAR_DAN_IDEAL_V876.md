# RALLY WORKFLOW V8.7.6 - FLOW YANG BENAR DAN IDEAL

## 📊 DIAGRAM FLOW LENGKAP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INPUT SECTION (Data Gathering)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 0: Campaign Data Fetch                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Rally API → campaignData                                            │    │
│  │ • title, goal, rules, style                                          │    │
│  │ • knowledgeBase, missions[], missionRules[]                          │    │
│  │ • ✅ Init: RateLimiter + SmartCaller + ContentGenerator              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 1: Research                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Extract facts from campaign knowledgeBase                          │    │
│  │ • Fetch from internetcourt.org, genlayer.com                         │    │
│  │ • Build knowledgeBase[]                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 2: Leaderboard Analysis                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Rally API → leaderboard                                              │    │
│  │ • Top 10 competitors                                                 │    │
│  │ • Points, usernames, patterns                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 2B: Competitor Deep Analysis (LLM)                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ✅ callLLM() dengan Rate Limiter                                     │    │
│  │ • Analyze hook patterns                                              │    │
│  │ • Identify avoid patterns                                            │    │
│  │ • Find market gaps                                                   │    │
│  │ • Output: { hooks[], ctas[], avoidPatterns[], gaps[] }               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PROCESS SECTION (Content Creation)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 3: Gap Identification                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Map competitor patterns                                            │    │
│  │ • Find unused hooks                                                  │    │
│  │ • Identify emotion opportunities                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 4: Strategy Definition                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Select primaryAngle (problem_first, contrast, fear, etc)           │    │
│  │ • Select targetEmotion                                               │    │
│  │ • Select hookType, ctaType                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  ╔═════════════════════════════════════════════════════════════════════╗    │
│  ║ PHASE 5: Content Generation - MULTI-VERSION                          ║    │
│  ║ ✅ Menggunakan SmartContentGenerator                                 ║    │
│  ╠═════════════════════════════════════════════════════════════════════╣    │
│  ║                                                                       ║    │
│  ║  FOR EACH VERSION (V1-V5):                                            ║    │
│  ║  ┌─────────────────────────────────────────────────────────────┐     ║    │
│  ║  │ generateWithProgressiveFallback(angle, emotion)              │     ║    │
│  ║  │                                                               │     ║    │
│  ║  │  LEVEL 1: Full LLM                                            │     ║    │
│  ║  │  ├── System: Full campaign data + rules                       │     ║    │
│  ║  │  ├── User: Goal + mission + facts                             │     ║    │
│  ║  │  ├── Rate Limiter: ✅ callLLM()                               │     ║    │
│  ║  │  └── Success? → Return content (method: 'full_llm')           │     ║    │
│  ║  │           ↓ Fail (rate limit/timeout)                         │     ║    │
│  ║  │                                                               │     ║    │
│  ║  │  LEVEL 2: Simplified LLM                                      │     ║    │
│  ║  │  ├── System: Short prompt (50 chars)                          │     ║    │
│  ║  │  ├── User: Topic + angle + 1 fact                             │     ║    │
│  ║  │  ├── Rate Limiter: ✅ callLLM()                               │     ║    │
│  ║  │  └── Success? → Return content (method: 'simplified_llm')     │     ║    │
│  ║  │           ↓ Fail                                              │     ║    │
│  ║  │                                                               │     ║    │
│  ║  │  LEVEL 3: Chunk Assembly                                      │     ║    │
│  ║  │  ├── Generate hook (50 chars) → small LLM call                │     ║    │
│  ║  │  ├── Generate body (100 chars) → small LLM call               │     ║    │
│  ║  │  ├── Generate CTA (50 chars) → small LLM call                 │     ║    │
│  ║  │  ├── Rate Limiter: ✅ per chunk                               │     ║    │
│  ║  │  └── Assemble → Return (method: 'chunk_assembly')             │     ║    │
│  ║  │           ↓ Fail                                              │     ║    │
│  ║  │                                                               │     ║    │
│  ║  │  LEVEL 4: Knowledge Extraction ⭐ NO TEMPLATE                  │     ║    │
│  ║  │  ├── buildProblemHook(facts) → Dynamic                        │     ║    │
│  ║  │  ├── buildCoreContent(facts) → Dynamic                        │     ║    │
│  ║  │  ├── buildSolutionContent(facts) → Dynamic                    │     ║    │
│  ║  │  ├── buildDynamicCTA(facts, emotion) → Dynamic                │     ║    │
│  ║  │  └── Return (method: 'knowledge_extraction')                  │     ║    │
│  ║  │      ✅ 100% DYNAMIC dari knowledge base!                     │     ║    │
│  ║  └─────────────────────────────────────────────────────────────┘     ║    │
│  ║                                                                       ║    │
│  ║  Result: 5 versions with NO hardcoded templates!                      ║    │
│  ╚═════════════════════════════════════════════════════════════════════╝    │
│                              ↓                                               │
│  PHASE 6: Banned Items Scanner                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Scan for AI words, banned phrases, chars                          │    │
│  │ • Mark violations[] per version                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 6B: Rewrite with LLM                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ✅ callLLM() dengan Rate Limiter                                     │    │
│  │ • LLM rewrite untuk versi dengan violations                          │    │
│  │ • Natural rewording, bukan simple replace                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 7: Uniqueness Validation                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ✅ Compare dengan competitor patterns                                │    │
│  │ • Check hook uniqueness                                              │    │
│  │ • Check CTA uniqueness                                               │    │
│  │ • ✅ callLLM() untuk LLM-based uniqueness check                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 8: Emotion Injection                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ✅ callLLM() dengan Rate Limiter                                     │    │
│  │ • Jika emotionScore < 7                                              │    │
│  │ • LLM inject emotion triggers                                        │    │
│  │ • Enhance dengan LLM, bukan fake +1                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 9: HES + Viral Scoring                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Calculate HES score (emotional hook, curiosity gap, CTA)           │    │
│  │ • Calculate Viral score (controversial, share_worthy, etc)           │    │
│  │ • No LLM needed (algorithm-based)                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOCK POINT                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 10: Quality Scoring & Selection                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 🔒 LOCK: Select best version                                         │    │
│  │ • Combined score calculation                                          │    │
│  │ • Sort versions by score                                              │    │
│  │ • Lock to single version (no more versions array)                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                      REFINE SECTION (Single Version)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 11: Micro-Optimization (5 Layers)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Layer 1: Word level (remove filler words)                            │    │
│  │ Layer 2: Sentence level (optimize flow)                              │    │
│  │ Layer 3: Character level (length check)                              │    │
│  │ Layer 4: Emotion level (preserve emotion)                            │    │
│  │ Layer 5: Psychology level (curiosity gap)                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 12: Content Flow Polish                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Smooth transitions                                                  │    │
│  │ • Remove redundancy                                                   │    │
│  │ • Improve readability                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 12B: Gate Simulation (16 Gates)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ G1: Content Alignment (4 gates)                                       │    │
│  │ G2: Information Accuracy (4 gates)                                    │    │
│  │ G3: Campaign Compliance (4 gates)                                     │    │
│  │ G4: Originality (4 gates)                                             │    │
│  │ • Uses campaignData.missionRules for validation                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 13: Benchmark Comparison                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ✅ Uses real competitor data from Phase 2B                           │    │
│  │ • Compare hook with competitor hooks                                  │    │
│  │ • Check competitive advantages                                        │    │
│  │ • ✅ callLLM() untuk competitive analysis                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 14: Final Emotion Re-Check                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ✅ callLLM() dengan Rate Limiter                                     │    │
│  │ • Jika emotion dropped                                                │    │
│  │ • LLM re-inject emotion                                               │    │
│  │ • Real enhancement, bukan flag only                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 14B: Final Content Polish                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Final checks                                                        │    │
│  │ • Link presence, question mark, length                                │    │
│  │ • 🔒 CONTENT IS NOW LOCKED                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                      OUTPUT SECTION (No Content Changes)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 15: Output Generation                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Build final output JSON                                             │    │
│  │ • Generate Q&A with LLM                                               │    │
│  │ • Metadata and stats                                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              ↓                                               │
│  PHASE 16: Export & Delivery                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Save JSON output                                                    │    │
│  │ • Save content.txt                                                    │    │
│  │ • Return file paths                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST: FLOW YANG BENAR

| # | Item | V8.7.5 (Old) | V8.7.6 (New) |
|---|------|--------------|--------------|
| 1 | Rate Limiter in Phase 5 | ❌ Tidak | ✅ Ya |
| 2 | Smart Content Generator | ❌ Tidak terintegrasi | ✅ Terintegrasi |
| 3 | Template Fallback | ❌ Masih ada | ✅ Tidak ada |
| 4 | Progressive Fallback | ❌ Tidak ada | ✅ 4 Level |
| 5 | Knowledge Extraction | ❌ Tidak ada | ✅ Dynamic build |
| 6 | LLM-based Rewrite (6B) | ❌ Simple replace | ✅ LLM rewrite |
| 7 | LLM-based Emotion (8) | ❌ Fake +1 | ✅ LLM inject |
| 8 | LLM-based Re-Emotion (14) | ❌ Flag only | ✅ LLM re-inject |

---

## 📈 PERBANDINGAN KUALITAS

### Level Fallback Quality:

| Level | Method | Quality | Rate Limit Resilience |
|-------|--------|---------|----------------------|
| 1 | Full LLM | ⭐⭐⭐⭐⭐ | Low |
| 2 | Simplified LLM | ⭐⭐⭐⭐ | Medium |
| 3 | Chunk Assembly | ⭐⭐⭐ | High |
| 4 | Knowledge Extraction | ⭐⭐⭐ | Very High |

### Key Point:
**Level 4 (Knowledge Extraction) bukan template!**
- Content di-build dari campaign facts
- Hook disesuaikan dengan angle
- CTA disesuaikan dengan emotion
- Berbeda untuk setiap campaign

---

## 🔧 CARA KERJA SMART CONTENT GENERATOR

```javascript
// Di Phase 5:
for (const vp of versionPrompts) {
  const result = await this.contentGenerator.generateWithProgressiveFallback(
    vp.angle,   // 'problem_first', 'contrast', etc
    vp.emotion  // 'curiosity', 'fear', 'hope'
  );
  
  this.versions.push({
    id: vp.id,
    content: result.content,
    generatedBy: result.method  // Track method used
  });
}
```

### Output Tracking:
```
V1: generatedBy: 'full_llm'           → Best quality
V2: generatedBy: 'simplified_llm'     → Good quality
V3: generatedBy: 'chunk_assembly'     → Decent quality
V4: generatedBy: 'knowledge_extraction' → Still dynamic
V5: generatedBy: 'full_llm'           → Best quality
```

---

## 📁 FILE STRUCTURE

```
/home/z/my-project/scripts/
├── llm-rate-limiter.js         # Rate limiter module
├── smart-content-generator.js  # Smart generator with progressive fallback
├── rally-workflow-v8.7.6.js    # Main workflow (CORRECT FLOW)
└── rally-workflow-executor-v8.7.5.js  # Old workflow (NEEDS FIX)
```

---

## ✅ KESIMPULAN

**Flow V8.7.6 sudah BENAR dan IDEAL karena:**

1. ✅ Rate Limiter digunakan di SEMUA LLM calls
2. ✅ Smart Content Generator terintegrasi di Phase 5
3. ✅ TIDAK ADA template fallback
4. ✅ Progressive fallback dengan 4 level
5. ✅ Knowledge Extraction benar-benar dynamic
6. ✅ Setiap phase menggunakan method yang benar
7. ✅ Tracking method yang digunakan per version

**Flow ini memastikan:**
- Kualitas tetap tinggi meski rate limited
- Tidak ada hard-coded content
- Setiap campaign menghasilkan konten unik
- Graceful degradation saat API bermasalah
