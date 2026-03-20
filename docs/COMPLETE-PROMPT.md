# RALLY WORKFLOW - COMPLETE PROMPT FOR NEW CHAT

## 🎯 COPY PASTE INI KE CHAT BARU (LENGKAP):

```
Buat konten Rally untuk hook: "Code Runs, Disputes Don't. Enter Internet Court"

=== LANGKAH 1: COBA RUN SCRIPT ===

Jalankan command:
cd /home/z/my-project && node scripts/rally-ai-workflow.js "Code Runs, Disputes Don't. Enter Internet Court"

JIKA BERHASIL: Tampilkan output dari script.

JIKA GAGAL (error/rate limit): Lanjut ke Langkah 2.

=== LANGKAH 2: GENERATE MANUAL ===

Jika script gagal, generate konten manual dengan rules:

HOOK (WAJIB SAMA PERSIS):
"Code Runs, Disputes Don't. Enter Internet Court"

KONTEN REQUIREMENTS:
1. Hook = kalimat pertama (JANGAN diubah!)
2. 3-5 paragraf, masing-masing <280 char
3. Include: internetcourt.org
4. Include BODY FEELING: "stomach dropped" atau "heart racing" atau "cold sweat"
5. Akhiri dengan PERTANYAAN engaging
6. Sertakan EMOTIONS: fear, curiosity, surprise, hope, pain

BANNED (JANGAN GUNAKAN):
- Words: delve, leverage, paradigm, ecosystem, groundbreaking, seamless, transformative
- Phrases: "in this thread", "key takeaways", "picture this", "imagine a world"
- Openings: "The ", "A ", "This is", "There are", "I think"

CONTOH YANG BENAR:
---
Code Runs, Disputes Don't. Enter Internet Court

Your smart contract executes in milliseconds. But when something goes wrong? Traditional courts take years. Cost thousands. Cross borders? Good luck.

400 million people use smart contracts. Zero courts can help them.

I learned this the hard way. Watching my savings vanish in a buggy transaction, stomach dropped, heart racing, nowhere to turn.

What happens when your DAO gets rugged? Who do you call?

internetcourt.org
---

=== LANGKAH 3: HITUNG SCORE ===

HOOK SCORE (0-10):
- Tidak buka dengan weak opening (the/a/this is): +3
- Pakai power pattern (number/question/action/bold): +3
- Ada curiosity/tension/surprise/relevance: +1 each
- Min: 7/10

EMOTION SCORE (0-10):
- Setiap emotion trigger: +2
- Body feeling: +3
- 3+ emotion types: +2
- Min: 8/10

CT SCORE (0-10):
- Ada ?: +2
- Reply bait (what do you think/thoughts): +2
- Engagement hook (what if/have you ever): +2
- Personal (I/my/me): +1
- FOMO (now/today/finally): +1
- Controversy (wrong/problem/nobody): +1
- Share-worthy (this is why/the truth): +1
- Min: 8/10

=== LANGKAH 4: TAMPILKAN OUTPUT ===

FORMAT OUTPUT:

## 📝 KONTEN:
[konten yang di-generate]

## 📊 SCORE CARD:
╔════════════════════════════════════════════════════════════════════════╗
║                    FINAL CONTENT SCORE CARD - V8.7.6                   ║
╠════════════════════════════════════════════════════════════════════════╣
║  │ Hook Score:                  X/10    │ ✅/❌                        ║
║  │ Emotion Score:               X/10    │ ✅/❌                        ║
║  │ CT Score:                    X/10    │ ✅/❌                        ║
║  │ Uniqueness:                  X/10    │ ✅/❌                        ║
║  │ Readability:                 X/10    │ ✅/❌                        ║
║  │ Viral Potential:             X/10    │ ✅/❌                        ║
║  │ OVERALL SCORE:               X.X/10  │ ✅/❌                        ║
║                                                                        ║
║  │ Emotion Types: [list]                                               ║
║  │ Body Feelings: Yes/No                                               ║
║  │ READY FOR SUBMISSION:   ✅ YES / ❌ NO                               ║
╚════════════════════════════════════════════════════════════════════════╝

MULAI EKSEKUSI SEKARANG DARI LANGKAH 1.
```

---

## 📁 FILE INI:

https://github.com/tuyulmillenium104-cmd/penilaian2/blob/master/docs/COMPLETE-PROMPT.md

---

## ✅ KEUNGGULAN PROMPT INI:

| Fitur | Status |
|-------|--------|
| Coba run script dulu | ✅ |
| Fallback manual jika gagal | ✅ |
| Rules konten lengkap | ✅ |
| Scoring rules | ✅ |
| Contoh yang benar | ✅ |
| Format output | ✅ |
| Score card format | ✅ |

**Prompt ini AMAN karena:**
1. Mencoba script dulu
2. Jika gagal, tetap bisa generate manual
3. Ada scoring rules yang jelas
4. Ada contoh output yang benar
