# RALLY WORKFLOW v9.8.2

## 🚀 Quick Start

```bash
# By campaign name
node rally-workflow.js "Internet Court"

# By campaign address
node rally-workflow.js 0xAF5a5B459F4371c1781E3B8456214CDD063EeBA7

# List all campaigns
node rally-workflow.js list
```

## ✨ New Features in v9.8.2

### G4 Originality Elements (Integrated into Generate & Judge)
- ✅ Casual Hook Opening (ngl, tbh, honestly, fun story)
- ✅ Parenthetical Aside ((embarrassing to admit), (just saying))
- ✅ Contractions (3+: don't, can't, it's, I'm)
- ✅ Personal Angle (I, my, me with specific experience)
- ✅ Conversational Ending (tbh, worth checking)

### X-Factor Differentiators (Integrated into Generate & Judge)
- ✅ Specific Numbers (47%, $1.2M, 3.5x)
- ✅ Time Specificity (25 minutes, 3 hours)
- ✅ Embarrassing Honesty
- ✅ Insider Detail
- ✅ Unexpected Angle

### Forbidden Elements Detection
- ✅ Em Dashes Detection (— or –)
- ✅ Smart Quotes Detection (" " ' ')
- ✅ AI Phrases Detection (delve, leverage, realm, tapestry)
- ✅ Template Openings Detection

### Scoring System
- **Total: 141 Points** (from 136)
- Gate Utama: 24 max (with G4 Originality scoring)
- Gate Tambahan: 16 max (with X-Factor scoring)
- Compliance: 11 checks (with Forbidden Punctuation check)

### Gate Multiplier Formula
```
M_gate = 1 + 0.5 x (g_star - 1)
```
- Maximum: 1.5x (+50% bonus)
- Minimum: 0.5x (-50% penalty if any gate = 0)

## 📋 Judge Breakdown

| Judge | Category | Max Points | Pass Threshold |
|-------|----------|------------|----------------|
| 1 | Gate Utama | 24 | 19 |
| 2 | Gate Tambahan | 16 | 12 |
| 3 | Penilaian Internal | 60 | 54 |
| 4 | Compliance | 11 | 11 (all must pass) |
| 5 | Fact Check | 5 | 4 |
| 6 | Uniqueness | 25 | 20 |
| **TOTAL** | | **141** | |

## 📁 Related Files

- [RALLY-FUN-ULTIMATE-MASTER-GUIDE-v2.pdf](../../download/RALLY-FUN-ULTIMATE-MASTER-GUIDE-v2.pdf) - Complete guide

## 🔄 Changelog

### v9.8.2 (Current)
- Integrated G4 Originality into Content Generation prompts
- Integrated X-Factor Differentiators into Content Generation prompts
- Added G4 Originality scoring to Judge 1
- Added X-Factor scoring to Judge 2
- Added Forbidden Punctuation check to Judge 4
- Updated thresholds for new scoring system
- Total score: 141 points (from 136)

### v9.8.1
- Multi-Content Generator (5 contents)
- Batch Judging with Ranking
- Model GLM-5 with Think + WebSearch
- Quick Judge (Compliance Check Only)
