# RALLY WORKFLOW V9.3.0 - MULTI-LLM JUDGING EDITION

> **Versi:** V9.3.0 Multi-LLM Judging Edition  
> **Arsitektur:** Script untuk Data + Multi-LLM untuk Blind Judging  
> **Total Phases:** 24 phases + 3 Judge calls

---

## 🆕 KENAPA V9.3.0?

### Masalah Sebelumnya:
| Masalah | Penyebab |
|---------|----------|
| Penilaian bias | LLM yang buat konten juga yang nilai |
| Subjektif | Campaign goal/style mempengaruhi penilaian |
| Tidak konsisten | Satu LLM tidak objektif menilai diri sendiri |

### Solusi V9.3.0:
| Komponen | Eksekusi | Fungsi |
|----------|----------|--------|
| **Data Gatherer** | Script Node.js | Fetch campaign, leaderboard, submissions |
| **Judge 1** | LLM terpisah via SDK | Gate Utama (G1-G4) |
| **Judge 2** | LLM terpisah via SDK | Gate Tambahan (G5-G6) |
| **Judge 3** | LLM terpisah via SDK | Penilaian Internal |

---

## 🏗️ ARSITEKTUR V9.3.0

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     RALLY WORKFLOW V9.3.0                                    │
│                     MULTI-LLM JUDGING EDITION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│  PHASE 0-2: SCRIPT NODE.JS (Data Gathering)                                  │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  ✅ Campaign Data (Rally API)                                                │
│  ✅ Leaderboard (Rally API)                                                  │
│  ✅ Submissions (Rally API)                                                  │
│  ✅ Competitor Hooks (extracted from submissions)                            │
│                                                                              │
│  Output: JSON dengan judge instructions                                      │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│  JUDGING SYSTEM: MULTI-LLM BLIND JUDGING                                     │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│         ┌──────────────┐                                                    │
│         │   KONTEN     │                                                    │
│         └──────┬───────┘                                                    │
│                │                                                             │
│    ┌───────────┼───────────┐                                                │
│    ▼           ▼           ▼                                                │
│  ┌────────┐ ┌────────┐ ┌────────┐                                          │
│  │ JUDGE1 │ │ JUDGE2 │ │ JUDGE3 │                                          │
│  │        │ │        │ │        │                                          │
│  │ G1-G4  │ │ G5-G6  │ │ INT    │                                          │
│  │ 0-5    │ │ 0-8    │ │ 0-10   │                                          │
│  └───┬────┘ └───┬────┘ └───┬────┘                                          │
│      │          │          │                                                 │
│      └──────────┼──────────┘                                                 │
│                 ▼                                                            │
│         ┌──────────────┐                                                    │
│         │  AGGREGATE   │                                                    │
│         │  & DECISION  │                                                    │
│         └──────────────┘                                                    │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│  BLIND JUDGING - DATA YANG DIKIRIM KE JUDGE                                  │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  ✅ DIKIRIM (Hard Requirements):                                             │
│  ├── Knowledge Base (untuk cek akurasi faktual)                              │
│  ├── Required URL (hard check: ada/tidak)                                    │
│  ├── Rules (hard requirements)                                               │
│  ├── Banned Words (hard check)                                               │
│  ├── AI Patterns (hard check)                                                │
│  └── Competitor Hooks (untuk uniqueness check)                               │
│                                                                              │
│  ❌ TIDAK DIKIRIM (untuk hindari bias):                                       │
│  ├── Campaign Goal                                                           │
│  ├── Campaign Style                                                          │
│  ├── Suggested Angles                                                        │
│  └── Tips for Content                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 CARA PENGGUNAAN

### Step 1: Run Data Gatherer Script

```bash
cd /home/z/my-project
node scripts/rally-workflow-v9.3.0.js [campaign_address]
```

Output: JSON file dengan judge instructions

### Step 2: Run Multi-LLM Judging

```javascript
const ZAI = require('z-ai-web-dev-sdk').default;

async function runJudging(workflowOutput, content) {
  const zai = await ZAI.create();
  
  // Run 3 judges in parallel
  const [judge1, judge2, judge3] = await Promise.all([
    // Judge 1: Gate Utama
    zai.chat.completions.create({
      messages: [
        { role: 'system', content: workflowOutput.judgeInstructions.judge1.systemPrompt },
        { role: 'user', content: formatInput(workflowOutput.judgeInstructions.judge1, content) }
      ],
      response_format: { type: 'json_object' }
    }),
    // Judge 2: Gate Tambahan
    zai.chat.completions.create({
      messages: [
        { role: 'system', content: workflowOutput.judgeInstructions.judge2.systemPrompt },
        { role: 'user', content: formatInput(workflowOutput.judgeInstructions.judge2, content) }
      ],
      response_format: { type: 'json_object' }
    }),
    // Judge 3: Penilaian Internal
    zai.chat.completions.create({
      messages: [
        { role: 'system', content: workflowOutput.judgeInstructions.judge3.systemPrompt },
        { role: 'user', content: formatInput(workflowOutput.judgeInstructions.judge3, content) }
      ],
      response_format: { type: 'json_object' }
    })
  ]);
  
  return {
    judge1: JSON.parse(judge1.choices[0].message.content),
    judge2: JSON.parse(judge2.choices[0].message.content),
    judge3: JSON.parse(judge3.choices[0].message.content)
  };
}
```

---

## 📊 PENILAIAN PER JUDGE

### JUDGE 1: GATE UTAMA (G1-G4) - Scale 0-5, Min: 4

| Gate | Kriteria | Sub-Kriteria |
|------|----------|--------------|
| **G1** | Content Alignment | topicRelevance, terminologyUse, factualConsistency |
| **G2** | Information Accuracy | technicalAccuracy, noMisleading, properContext |
| **G3** | Campaign Compliance | requiredUrlPresent, noEmDashes, noBannedWords, properStart |
| **G4** | Originality | uniqueAngle, noAiPatterns, naturalVoice |

### JUDGE 2: GATE TAMBAHAN (G5-G6) - Scale 0-8, Min: 8

| Gate | Kriteria | Sub-Kriteria |
|------|----------|--------------|
| **G5** | Engagement Potential | hookEffectiveness, ctaQuality, contentStructure, conversationPotential |
| **G6** | Technical Quality | grammarSpelling, formatting, platformOptimization, noProhibitedElements |

### JUDGE 3: PENILAIAN INTERNAL - Scale 0-10, Min: 9

| Metrik | Cara Hitung |
|--------|-------------|
| **Hook Score** | Power patterns (+2) - Weak openings (-2) + Required elements (+1) |
| **Emotion Score** | Emotion types + Body feelings presence |
| **CT Score** | Question (+2) + Reply bait (+2) + Engagement hook (+2) + Personal (+1) + FOMO (+1) + Controversy (+1) + Share-worthy (+1) |
| **Uniqueness Score** | 10 - (AI patterns × 2) - (Template hooks × 3) - (Banned words × 0.5) |
| **Readability Score** | Sentence length + Structure + Paragraph breaks |
| **Viral Potential Score** | Controversy + Emotion + Questions + Personal + Numbers + Urgency + Share-worthy |

---

## 🎯 SCORING TARGETS

| Component | Minimum | Maximum | Judge |
|-----------|---------|---------|-------|
| G1 Content Alignment | 4 | 5 | Judge 1 |
| G2 Information Accuracy | 4 | 5 | Judge 1 |
| G3 Campaign Compliance | 4 | 5 | Judge 1 |
| G4 Originality | 4 | 5 | Judge 1 |
| G5 Engagement Potential | 8 | 8 | Judge 2 |
| G6 Technical Quality | 8 | 8 | Judge 2 |
| Hook Score | 9 | 10 | Judge 3 |
| Emotion Score | 9 | 10 | Judge 3 |
| CT Score | 9 | 10 | Judge 3 |
| Uniqueness Score | 9 | 10 | Judge 3 |
| Readability Score | 9 | 10 | Judge 3 |
| Viral Potential Score | 9 | 10 | Judge 3 |

---

## 🔒 BLIND JUDGING PRINCIPLES

### Apa itu Blind Judging?

Blind Judging berarti penilai TIDAK tahu:
- Siapa pembuat konten
- Apa tujuan spesifik campaign
- Style yang diharapkan

Penilai HANYA tahu:
- Hard requirements (URL, rules, banned words)
- Knowledge base (untuk cek akurasi)
- Standar kualitas Rally

### Kenapa Blind Judging?

| Dengan Campaign Info | Blind Judging |
|---------------------|---------------|
| "Oh, konten ini menjelaskan Internet Court, cukup sesuai dengan goal" | "Apakah konten ini akurat dan berkualitas? Tidak peduli goal-nya apa" |
| Score: 4/5 (terlalu baik) | Score: 3/5 (lebih objektif) |

---

## 📁 FILE STRUCTURE

```
/home/z/my-project/
├── README.md                           # File ini (V9.3.0)
├── scripts/
│   └── rally-workflow-v9.3.0.js        # Main workflow script
└── download/
    └── rally-workflow-v9.3.0-*.json    # Output files
```

---

## 🏷️ METADATA

| Field | Value |
|-------|-------|
| Version | V9.3.0 Multi-LLM Judging Edition |
| Branch | v9.0.0-hybrid |
| Script Phases | 0, 2 (data gathering) |
| Judges | 3 independent LLM calls |
| Blind Judging | Yes (no campaign goal/style sent to judges) |

---

**END OF README V9.3.0**
