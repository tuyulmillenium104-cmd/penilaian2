# RALLY WORKFLOW V9.8.0 - WORKLOG

## Informasi Versi

| Item | Detail |
|------|--------|
| **Versi** | v9.8.0 Hybrid Complete |
| **Tanggal** | 2026-03-24 |
| **File Utama** | `/home/z/my-project/docs/hybrid-nlp-v9.8.0/rally-workflow-v9.8.0-hybrid.js` |
| **File v9.8.2** | `/home/z/my-project/docs/hybrid-nlp-v9.8.0/improvements/rally-workflow-v9.8.2-complete.js` |
| **GitHub** | https://github.com/tuyulmillenium104-cmd/penilaian2 |
| **Based On** | Rally Ultimate Master Guide V3 |

---

## Cara Menjalankan

```bash
# Masuk ke direktori utama
cd /home/z/my-project/docs/hybrid-nlp-v9.8.0

# List semua campaign
node rally-workflow-v9.8.0-hybrid.js list

# Jalankan dengan nama campaign (partial match)
node rally-workflow-v9.8.0-hybrid.js "Internet Court"

# Jalankan dengan alamat campaign
node rally-workflow-v9.8.0-hybrid.js 0xAF5a5B459F4371c1781E3B8456214CDD063EeBA7
```

---

## 🆕 FITUR LENGKAP v9.8.0 (Comprehensive Edition)

### 1. G4 Originality Elements Detection
| Element | Weight | Description |
|---------|--------|-------------|
| Casual Hook Opening | +0.15 | ngl, tbh, honestly, fun story |
| Parenthetical Aside | +0.15 | (embarrassing to admit), (just saying) |
| Contractions (3+) | +0.20 | don't, can't, it's, they're |
| Sentence Fragments | +0.15 | Natural casual effect |
| Personal Angle | +0.20 | I, my, me, specific experience |
| Conversational Ending | +0.15 | tbh, worth checking, what do you think |

### 2. Forbidden Punctuation Detection
| Type | Penalty | Replace With |
|------|---------|--------------|
| Em Dashes (— – ―) | -0.30 | Hyphen (-) or comma |
| Smart Quotes ("" '') | -0.20 | Straight quotes (" ') |
| Ellipsis (…) | Warn | Three dots (...) |

### 3. Gate Multiplier Formula (Official Rally)
```
g_star = (G1 + G2 + G3 + G4) / 4
M_gate = 1 + 0.5 × (g_star - 1)
```
| g_star | M_gate | Bonus |
|--------|--------|-------|
| 2.0 | 1.5x | +50% MAXIMUM |
| 1.75 | 1.375x | +37.5% |
| 1.5 | 1.25x | +25% |
| 1.0 | 1.0x | Baseline |
| Any = 0 | 0.5x | DISQUALIFIED |

### 4. X-Factor Differentiators
- **Specific Numbers**: "down 47%" not "down a lot"
- **Time Specificity**: "25 minutes" not "a while"
- **Embarrassing Honesty**: "embarrassing to admit..."
- **Insider Detail**: "went from 68% to sweating bullets"
- **Unexpected Angle**: Surprise twist, contrary view

### 5. Claim Verification Template
- Red Flags: dates, numbers, chains, features, partnerships, tokens
- Verification Steps: API → knowledgeBase → website → Twitter
- Actions: Remove, generalize, or ask user

### 6. Pre-Submission Validation Checklist
- Mindset Check
- Information Verification
- Gate Scores
- G4 Originality
- Forbidden Punctuation
- X-Factors

### 7. Mindset Framework
- **TARGET**: Beat Top 10
- **EFFORT**: Maximize everything you control
- **ACCEPT**: Whatever result comes
- **LEARN**: From every outcome

### 8. Control Matrix
| CAN Control | CANNOT Control |
|-------------|----------------|
| G1-G4 Scores | Retweets, Likes |
| EP, TQ | Replies, QR, FR |
| Verified Facts | Ranking, Algorithm |

### 9. Multi-Token Pool (11 Tokens)
| # | Label | User ID |
|---|-------|---------|
| 0 | Auto-Config (Primary) | auto |
| 1 | Akun A #1 | 97631263-5dba-4e16-b127-19212e012a9b |
| 2 | Akun B #1 | bb829ea3-0d37-4944-8705-00090bde3671 |
| 3 | Akun A #2 | 97631263-5dba-4e16-b127-19212e012a9b |
| 4 | Akun B #2 | bb829ea3-0d37-4944-8705-00090bde3671 |
| 5 | Akun A #3 | 97631263-5dba-4e16-b127-19212e012a9b |
| 6 | Akun C #1 | 2706ea69-a397-4f3f-8706-5eaf0d6a799b |
| 7 | Akun D #1 | e3b6c803-c6c2-4467-ab2b-0bd3ab9c6a48 |
| 8 | Akun A #4 | 97631263-5dba-4e16-b127-19212e012a9b |
| 9 | Akun E #1 | 1cdcf579-c6e5-4ef7-82d5-d869d8c85a5e |
| 10 | Akun B #3 | bb829ea3-0d37-4944-8705-00090bde3671 |

### 10. Multi-Content Workflow
- Generate 5 konten sekaligus
- Quick Judge (compliance check)
- Full Judge (6 gates × 2 passes)
- Auto regenerate jika gagal
- Ranking system untuk pilih terbaik

### 11. Campaign Search by Name
- Pencarian campaign dengan nama (partial match)
- Tidak harus pakai alamat lagi

### 12. SDK Only Approach
- Pure z-ai-web-dev-sdk
- No HTTP fallbacks
- All features must work!

### 13. Python NLP Integration
- VADER + TextBlob Sentiment Analysis
- Semantic Similarity with Sentence Transformers
- Multi-metric Readability Scoring (textstat)
- Named Entity Recognition (spaCy)
- Advanced Emotion Detection
- Content Depth Analysis
- Anti-Template Detection

---

## Sistem Scoring (141 Poin Total)

| Gate | Poin | Threshold |
|------|------|-----------|
| Gate Utama | 24 | 19 (79%) |
| Gate Tambahan | 16 | 12 (75%) |
| Penilaian Internal | 60 | 54 (90%) |
| Compliance | 11 | 11 (100%) |
| Fact-Check | 5 | 4 (80%) |
| Uniqueness | 25 | 20 (80%) |
| **TOTAL** | **141** | **120 (85%)** |

---

## File Structure

```
/home/z/my-project/docs/hybrid-nlp-v9.8.0/
├── rally-workflow-v9.8.0-hybrid.js  # ✅ MAIN FILE (Updated)
├── nlp_service.py                    # Python NLP Service
├── python_nlp_client.js              # Python NLP Client
├── requirements.txt                  # Python dependencies
├── setup.sh                          # Setup script
├── README.md                         # Documentation
└── improvements/
    ├── rally-workflow-v9.8.1-complete.js
    ├── rally-workflow-v9.8.2-complete.js
    ├── v9.8.1-multi-content-generator.js
    └── CHANGELOG.md
```

---

## Status: SIAP DIGUNAKAN

Workflow siap dijalankan kapan saja. Jika rate limit, multi-token system akan otomatis berganti token.

**Perintah untuk menjalankan:**
```bash
cd /home/z/my-project/docs/hybrid-nlp-v9.8.0
node rally-workflow-v9.8.0-hybrid.js "Internet Court"
```

---

## Update History

### 2026-03-24: Comprehensive Update
- Updated v9.8.0-hybrid.js dengan semua fitur dari v9.8.2
- G4 Originality Detection
- Forbidden Punctuation Check
- Gate Multiplier Formula
- X-Factor Differentiators
- Pre-Submission Validation
- Mindset Framework & Control Matrix
- Multi-Token Rate Limit Handler (11 tokens)
- Campaign Search by Name
- Multi-Content Generator (5 konten)
- Batch Judging with Ranking

### 2026-03-23: Initial v9.8.2 Features
- G4 Originality Elements Detection
- Forbidden Punctuation Detection
- Gate Multiplier Formula
- X-Factor Differentiators

---

## Git Commit Info

```
feat: comprehensive update to v9.8.0-hybrid with all v9.8.2 features
```

Push ke GitHub memerlukan autentikasi manual.
