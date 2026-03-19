# 🚀 QUICK START - UNTUK AI ASSISTANT

> **Baca file ini jika Anda adalah AI baru yang menerima repository ini**

---

## ⚡ 30 DETIK UNTUK PAHAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎯 APA PROJECT INI?                                                         │
│  Rally.fun content generator dengan AI, validasi ketat, dan auto-fix       │
├─────────────────────────────────────────────────────────────────────────────┤
│  📁 FILE PALING PENTING:                                                     │
│  1. scripts/rally-workflow-v8.7.6.js      ← MAIN FILE (edit di sini)       │
│  2. docs/WORKFLOW_V8.7.3_IDEAL_STRUCTURE.md ← Dokumentasi lengkap          │
│  3. scripts/smart-content-generator.js    ← Fallback content logic         │
│  4. scripts/llm-rate-limiter.js           ← Rate limiting                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  🏃 CARA JALANKAN:                                                           │
│  node scripts/rally-workflow-v8.7.6.js <CAMPAIGN_ADDRESS>                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  📤 OUTPUT:                                                                  │
│  - download/rally-output-<timestamp>.json                                   │
│  - download/content-<timestamp>.txt                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ⚠️ PENTING:                                                                 │
│  - 16 Gates validation WAJIB pass untuk LOCK content                        │
│  - Auto-regeneration max 3x jika validasi gagal                             │
│  - Strict mode = TRUE (fail on errors)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 SKELETON KODE UTAMA

### Class Structure
```javascript
class RallyWorkflowExecutor {
  constructor(campaignAddress) {
    this.campaignData = null;       // Data dari API
    this.knowledgeBase = [];        // Facts dari research
    this.competitorPatterns = null; // Pola dari leaderboard
    this.versions = [];             // 5 versi content
    this.selectedVersion = null;    // Versi terpilih (LOCK)
    
    this.regenerationCount = 0;     // Counter regenerasi
    this.maxRegenerations = 3;      // Max 3x regenerate
    this.failbackPhase = null;      // Phase tujuan failback
  }
  
  async execute() { /* Main execution loop */ }
}
```

### Key Functions
```javascript
// Content Generation
phase5_ContentGeneration()     // Generate 5 versions

// Validation
phase6_BannedScanner()         // Detect violations
phase6B_Rewrite()              // Fix violations
phase7_UniquenessValidation()  // Compare with competitors
phase12B_GateSimulation()      // 16 Gates check

// Enhancement
phase8_EmotionInjection()      // Add emotion triggers
phase9_HESSandViral()          // Calculate scores

// Selection & Lock
phase10_QualityScoringAndSelection()  // LOCK to 1 version
phase14B_FinalContentPolish()         // FINAL LOCK
```

---

## 🔄 VALIDATION FLOW (SIMPLE)

```
Generate → Scan → Rewrite → Uniqueness → Emotion → HES → Select
   ↑         ↓        ↓          ↓                    ↓
   └───── Phase 5 ←──┴──────────┴────────────────────┘
                          (jika validasi gagal)

Select → Optimize → Gates(16) → Benchmark → Emotion Check → Final Lock
   ↑                     ↓                        ↓
   └──── Gate-based ←────┴────────────────────────┘
```

---

## 🚦 GATES FAILBACK

| Gate Group | Fails | Failback To |
|------------|-------|-------------|
| G1 (Alignment) | Content tidak aligned | Phase 11 |
| G2 (Accuracy) | Facts tidak valid | Phase 1 |
| G3 (Compliance) | Requirements missing | Phase 5 |
| G4 (Originality) | Tidak unik | Phase 3 |

---

## 📝 CONTOH PEMANGGILAN

```javascript
// Basic
const executor = new RallyWorkflowExecutor('0x1234...');
const result = await executor.execute();

// Check result
if (result.success) {
  console.log(result.selectedVersion.content);
  console.log(`Gates: ${result.selectedVersion.gateScore}`);
}
```

---

## ⚠️ COMMON ISSUES

### 1. Rate Limit Error
```
Solution: Llm-rate-limiter.js handles this with auto-retry
```

### 2. Gates Failed
```
Solution: Auto-regenerate dengan failback path yang sesuai
```

### 3. Content Masih Terdeteksi AI
```
Solution: Banned items scanner di Phase 6, rewrite di Phase 6B
```

---

## 📚 FILES TO READ (BERDASARKAN KEBUTUHAN)

| Kalau mau... | Baca... |
|--------------|---------|
| Paham workflow lengkap | `docs/WORKFLOW_V8.7.3_IDEAL_STRUCTURE.md` |
| Edit main logic | `scripts/rally-workflow-v8.7.6.js` |
| Ubah content fallback | `scripts/smart-content-generator.js` |
| Tambah banned words | `scripts/rally-workflow-v8.7.6.js` → BANNED_ITEMS |
| Ubah rate limit | `scripts/llm-rate-limiter.js` |

---

## 🎯 CHECKLIST SEBELUM EDIT

- [ ] Baca WORKFLOW_V8.7.3_IDEAL_STRUCTURE.md dulu
- [ ] Pahami phase mana yang boleh modify content
- [ ] Ingat: Phase 10 ke atas = SINGLE VERSION (selectedVersion)
- [ ] Ingat: Phase 14B ke atas = CONTENT LOCKED (no changes)
- [ ] Test dengan campaign address yang valid

---

**Last Updated: 2026-03-20**
