# 🚀 RALLY WORKFLOW V8.7.6 - Smart Content Generator

> **AI-Powered Content Generation untuk Rally.fun dengan Validasi 16 Gates**

[![Version](https://img.shields.io/badge/version-8.7.6-blue.svg)](https://github.com/tuyulmillenium104-cmd/penilaian2)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

---

## 📋 UNTUK AI BARU - BACA INI DULU!

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🤖 AI ASSISTANT QUICK CONTEXT                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PROJECT INI ADALAH:                                                        │
│  - Rally.fun content generator dengan 21 phases                            │
│  - Menggunakan LLM (z-ai-web-dev-sdk) untuk generate content               │
│  - Memiliki 16 Gates validation untuk quality control                      │
│  - Auto-regeneration jika validasi gagal (max 3x)                          │
│                                                                             │
│  FILE UTAMA:                                                                │
│  ├─ scripts/rally-workflow-v8.7.6.js      ← MAIN WORKFLOW (EDIT INI)       │
│  ├─ scripts/smart-content-generator.js    ← Content fallback logic         │
│  ├─ scripts/llm-rate-limiter.js           ← Rate limiting untuk LLM        │
│  └─ docs/WORKFLOW_V8.7.3_IDEAL_STRUCTURE.md ← Dokumentasi lengkap          │
│                                                                             │
│  CARA JALANKAN:                                                             │
│  node scripts/rally-workflow-v8.7.6.js <CAMPAIGN_ADDRESS>                  │
│                                                                             │
│  OUTPUT:                                                                    │
│  ├─ download/rally-output-<timestamp>.json  ← Full output                  │
│  ├─ download/content-<timestamp>.txt        ← Content only                 │
│  └─ workflow/                               ← Execution logs                │
│                                                                             │
│  VALIDATION PENTING:                                                        │
│  - Phase 12B: 16 Gates (wajib pass untuk LOCK)                             │
│  - Failback paths sudah ada untuk setiap phase                             │
│  - Max regeneration = 3 untuk prevent infinite loop                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 STRUKTUR REPOSITORY

```
penilaian2/
├── 📄 README.md                           ← ANDA DI SINI
├── 📄 QUICK_START.md                      ← Panduan cepat untuk AI
│
├── 📂 scripts/                            ← KODE UTAMA
│   ├── rally-workflow-v8.7.6.js          ← ⭐ MAIN WORKFLOW
│   ├── rally-workflow-v8.7.6-standalone.js ← Versi standalone
│   ├── smart-content-generator.js         ← Content generator dengan fallback
│   ├── llm-rate-limiter.js                ← Rate limiting untuk LLM calls
│   ├── web-scraper-v2.js                  ← Web scraping untuk research
│   └── ... (versi sebelumnya untuk referensi)
│
├── 📂 docs/                               ← DOKUMENTASI
│   ├── WORKFLOW_V8.7.3_IDEAL_STRUCTURE.md ← ⭐ Dokumentasi lengkap
│   ├── FLOW_BENAR_DAN_IDEAL_V876.md       ← Flow diagram
│   └── ... (dokumentasi lainnya)
│
├── 📂 download/                           ← OUTPUT FILES
│   ├── rally-output-*.json                ← Full JSON output
│   ├── content-*.txt                      ← Content text only
│   └── ... (reports, analysis, dll)
│
└── 📂 workflow/                           ← EXECUTION LOGS
    └── research-tools/                    ← Research data
```

---

## 🔧 INSTALASI

```bash
# Clone repository
git clone https://github.com/tuyulmillenium104-cmd/penilaian2.git
cd penilaian2

# Install dependencies
npm install

# atau dengan bun
bun install
```

### Dependencies Utama
- `z-ai-web-dev-sdk` - LLM integration
- `cheerio` - HTML parsing
- `node-fetch` - HTTP requests

---

## 🚀 CARA PENGGUNAAN

### Basic Usage
```bash
# Jalankan dengan campaign address
node scripts/rally-workflow-v8.7.6.js 0x1234567890abcdef...
```

### Programmatic Usage
```javascript
const { RallyWorkflowExecutor } = require('./scripts/rally-workflow-v8.7.6.js');

async function main() {
  const executor = new RallyWorkflowExecutor('0x_campaign_address');
  const result = await executor.execute();
  
  if (result.success) {
    console.log('Content generated:', result.selectedVersion.content);
    console.log('Gate Score:', result.selectedVersion.gateScore);
  }
}

main();
```

---

## 📊 WORKFLOW PHASES (21 PHASES)

### INPUT SECTION (Phase 0-2B)
| Phase | Nama | Fungsi | Output |
|-------|------|--------|--------|
| 0 | Preparation | Fetch campaign data | CAMPAIGN_DATA |
| 1 | Research | Web scraping | KNOWLEDGE_BASE (25+ facts) |
| 2 | Leaderboard | Analyze competitors | COMPETITOR_PATTERNS |
| 2B | Competitor Deep | LLM analysis (optional) | COMPETITOR_CONTENT |

### PROCESS SECTION (Phase 3-10)
| Phase | Nama | Fungsi | Validasi/Failback |
|-------|------|--------|-------------------|
| 3 | Gap Identification | Find opportunities | - |
| 4 | Strategy Definition | Define angle/emotion | - |
| 5 | Content Generation | Generate 5 versions | - |
| 6 | Banned Scanner | Detect violations | → Phase 6B |
| 6B | Rewrite | Fix violations | → Phase 5 if severe |
| 7 | Uniqueness | Compare with competitors | → Phase 5 if low |
| 8 | Emotion Injection | Enhance emotion | Loop up to 2x |
| 9 | HES + Viral | Calculate scores | → Phase 8 if HES fail |
| 10 | Selection | **LOCK to 1 version** | → Phase 5 if no viable |

### REFINE SECTION (Phase 11-14B)
| Phase | Nama | Fungsi | Validasi/Failback |
|-------|------|--------|-------------------|
| 11 | Micro-Optimization | 5-layer optimize | - |
| 12 | Flow Polish | Smooth transitions | - |
| 12B | Gate Simulation | **16 Gates check** | Gate-based failback |
| 13 | Benchmark | Compare with competitors | - |
| 14 | Emotion Re-Check | Final emotion check | → Phase 8 if low |
| 14B | Final Polish | **FINAL LOCK** | → Phase 5 if fail |

### OUTPUT SECTION (Phase 15-16)
| Phase | Nama | Fungsi | Output |
|-------|------|--------|--------|
| 15 | Output Generation | Format + Q&A | COMPLETE_ASSETS |
| 16 | Export | Save files | JSON + TXT files |

---

## 🚦 16 GATES VALIDATION

### G1: Content Alignment (4 gates)
- G1.1: Main topic aligned
- G1.2: Tone matches guidelines
- G1.3: Key message clear
- G1.4: No off-topic tangents

### G2: Information Accuracy (4 gates)
- G2.1: Facts verifiable
- G2.2: Numbers accurate
- G2.3: No misleading claims
- G2.4: Sources credible

### G3: Campaign Compliance (4 gates)
- G3.1: Required mentions
- G3.2: Required topics
- G3.3: Required links
- G3.4: Character limits

### G4: Originality (4 gates)
- G4.1: Hook unique vs competitors
- G4.2: CTA unique vs competitors
- G4.3: No AI templates
- G4.4: Emotion approach unique

### Failback Paths
```
G1 FAIL → Phase 11 (re-align)
G2 FAIL → Phase 1  (get more facts)
G3 FAIL → Phase 5  (regenerate with requirements)
G4 FAIL → Phase 3  (find new angle)
```

---

## 🔄 VALIDATION & REGENERATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGENERATION FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 5 (Generate) → Phase 6 (Scan) → Phase 6B (Rewrite)       │
│      ↑                     ↓ if severe                          │
│      └─────────────────────┘                                    │
│                                                                  │
│  Phase 6B → Phase 7 (Uniqueness)                                │
│      ↑              ↓ if low                                    │
│      └──────────────┘                                           │
│                                                                  │
│  Phase 7 → Phase 8 (Emotion) → Phase 9 (HES)                    │
│      ↑                               ↓ if HES fail              │
│      └───────────────────────────────┘                          │
│                                                                  │
│  Phase 9 → Phase 10 (Selection)                                 │
│      ↑              ↓ if no viable                              │
│      └──────────────┘                                           │
│                                                                  │
│  Phase 10 → Phase 11-12 → Phase 12B (Gates)                     │
│      ↑        ↑        ↓ G1→11, G2→1, G3→5, G4→3               │
│      └────────┴────────┘                                        │
│                                                                  │
│  Phase 12B → Phase 13 → Phase 14 (Emotion Re-check)             │
│      ↑                          ↓ if still low                  │
│      └──────────────────────────┘                               │
│                                                                  │
│  Phase 14 → Phase 14B (Final Lock) → Phase 15-16 (Output)       │
│      ↑              ↓ if fail                                   │
│      └──────────────┘                                           │
│                                                                  │
│  MAX REGENERATIONS: 3 (prevent infinite loop)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 OUTPUT FORMAT

### JSON Output
```json
{
  "success": true,
  "executionTime": "45.23",
  "selectedVersion": {
    "id": "V1",
    "content": "Thread content...",
    "combinedScore": 85.5,
    "gateScore": "16/16",
    "allGatesPassed": true,
    "emotionScore": 8,
    "hesScore": { "score": 4, "passed": true },
    "viralScore": { "score": 8, "elements": [...] }
  },
  "regenerationCount": 0,
  "regenerationHistory": []
}
```

### Content Output
```
Tweet 1: Hook with emotion trigger...

Tweet 2: Main content with facts...

Tweet 3: Supporting evidence...

...

Link: https://internetcourt.org
```

---

## 🛠️ CONFIGURATION

```javascript
const CONFIG = {
  rallyApiBase: 'https://app.rally.fun/api',
  outputDir: '/home/z/my-project/workflow',
  downloadDir: '/home/z/my-project/download',
  strictMode: true,  // Fail on errors
  
  rateLimiter: {
    maxRequestsPerMinute: 15,
    maxConcurrent: 2,
    minDelayMs: 2000,
    maxRetries: 3
  }
};
```

---

## 🔍 BANNED ITEMS (AI Detection Prevention)

### Words to Avoid
```javascript
['delve', 'leverage', 'realm', 'tapestry', 'paradigm', 
 'catalyst', 'cornerstone', 'pivotal', 'myriad', ...]
```

### Phrases to Avoid
```javascript
['in the world of', 'picture this', 'imagine a world',
 'lets dive in', 'at its core', 'in conclusion', ...]
```

### Template Hooks to Avoid
```javascript
['unpopular opinion', 'hot take', 'thread alert',
 'breaking', 'this is your sign', 'psa', ...]
```

---

## 📚 DOCUMENTATION

- [QUICK_START.md](./QUICK_START.md) - Panduan cepat untuk AI
- [docs/WORKFLOW_V8.7.3_IDEAL_STRUCTURE.md](./docs/WORKFLOW_V8.7.3_IDEAL_STRUCTURE.md) - Dokumentasi lengkap
- [docs/FLOW_BENAR_DAN_IDEAL_V876.md](./docs/FLOW_BENAR_DAN_IDEAL_V876.md) - Flow diagram

---

## 🤝 CONTRIBUTING

1. Fork repository
2. Buat branch feature (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing`)
5. Buat Pull Request

---

## 📄 LICENSE

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 ACKNOWLEDGMENTS

- Rally.fun untuk platform campaign
- z-ai-web-dev-sdk untuk LLM integration
- Semua contributor yang sudah membantu

---

**Made with ❤️ for Rally.fun content creators**
