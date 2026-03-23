# RALLY WORKFLOW V9.8.2 - WORKLOG

## Informasi Versi

| Item | Detail |
|------|--------|
| **Versi** | v9.8.2 Enhanced |
| **Tanggal** | 2026-03-23 |
| **File** | `/home/z/my-project/docs/hybrid-nlp-v9.8.0/improvements/rally-workflow-v9.8.1-complete.js` |
| **GitHub** | https://github.com/tuyulmillenium104-cmd/penilaian2 |
| **Based On** | Rally Ultimate Master Guide V3 |

---

## Cara Menjalankan

```bash
# Masuk ke direktori
cd /home/z/my-project/docs/hybrid-nlp-v9.8.0/improvements

# List semua campaign
node rally-workflow-v9.8.1-complete.js list

# Jalankan dengan nama campaign (partial match)
node rally-workflow-v9.8.1-complete.js "Internet Court"

# Jalankan dengan alamat campaign
node rally-workflow-v9.8.1-complete.js 0xAF5a5B459F4371c1781E3B8456214CDD063EeBA7
```

---

## 🆕 NEW v9.8.2 Features (from Rally Master Guide V3)

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

---

## Fitur dari v9.8.1

### 1. Campaign Search by Name
- Pencarian campaign dengan nama (partial match)
- Tidak harus pakai alamat lagi

### 2. Multi-Token Pool (11 Tokens)
| # | Label | User ID |
|---|-------|---------|
| 0 | Auto-Config (Primary) | auto |
| 1 | Akun A #1 | 97631263-5dba-4e16-b127-19212e012a9b |
| 2 | Akun B #1 | bb829ea3-0d37-4944-8705-00090bde3671 |
| ... | ... | ... |

### 3. Multi-Content Workflow
- Generate 5 konten sekaligus
- Quick Judge (compliance check)
- Full Judge (6 gates × 2 passes)
- Auto regenerate jika gagal

### 4. Hybrid Approach
- **Generator**: Tahu quality criteria
- **Judge**: Independen, tidak tahu scoring details

### 5. Web Search (SDK)
- Pure SDK web search
- Multi-token fallback untuk rate limit

---

## Sistem Scoring (136 Poin Total)

| Gate | Poin | Threshold |
|------|------|-----------|
| Gate Utama | 20 | 16 (80%) |
| Gate Tambahan | 16 | 14 (87.5%) |
| Penilaian Internal | 60 | 54 (90%) |
| Compliance | 10 | 10 (100%) |
| Fact-Check | 5 | 4 (80%) |
| Uniqueness | 25 | 20 (80%) |
| **TOTAL** | **136** | **118 (87%)** |

---

## Status: SIAP DIGUNAKAN

Workflow siap dijalankan kapan saja. Jika rate limit, tunggu beberapa jam lalu jalankan lagi.

**Perintah untuk menjalankan:**
```bash
cd /home/z/my-project/docs/hybrid-nlp-v9.8.0/improvements
node rally-workflow-v9.8.1-complete.js "Internet Court"
```

---

## Git Commit Info

```
deb565c feat: upgrade to v9.8.2 with Rally Master Guide V3 features
```

Push ke GitHub memerlukan autentikasi manual.
