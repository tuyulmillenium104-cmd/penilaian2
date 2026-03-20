# CREATOR WORKFLOW

## Deskripsi
Workflow ini bertugas untuk MEMBUAT konten berdasarkan campaign data.

## Prinsip Utama
1. **ORIGINALITY = LIFE** - Tidak boleh ada AI patterns, template hooks
2. **EMOTION = ENGAGEMENT** - Konten harus menggugah emosi
3. **HOOK = FIRST IMPRESSION** - Hook adalah 80% keberhasilan
4. **CTA = CONVERSATION** - Ajak reader untuk respond
5. **NO FLUFF** - Setiap kata harus punya tujuan

## Input
- Campaign Data (Knowledge Base, Rules, Style, Required URL)
- Competitor Hooks (untuk menghindari duplikasi)

## Output
- 3 versi konten kandidat
- Setiap versi dengan hook pattern berbeda
- Disimpan ke file untuk dinilai Judge

## Hook Patterns (Power Patterns)
1. **NUMBER + PROBLEM**: "$50M locked. No key."
2. **BOLD STATEMENT**: "Code runs. Justice doesn't."
3. **QUESTION + TENSION**: "What happens when your smart contract disagrees?"
4. **PERSONAL PAIN**: "I watched $10K vanish into a black hole."
5. **CONTRARIAN**: "Everyone's wrong about dispute resolution."

## Blacklist (WAJIB HINDARI)
### Weak Openings
- "The...", "This is...", "There are...", "I think..."
- "In the", "Today ", "So ", "Well "

### AI Patterns
- Words: delve, leverage, realm, tapestry, paradigm, landscape, nuance
- Phrases: "picture this", "let's dive in", "in this thread", "key takeaways"

### Template Hooks
- "Unpopular opinion", "Hot take", "Thread alert"
- "Nobody is talking about", "Story time", "This is your sign"

### Banned Words
- guaranteed, 100%, risk-free, financial advice, buy now, get rich, passive income

## Content Structure
```
Tweet 1: Hook + Setup (< 200 chars)
Tweet 2-4: Body (facts, emotion, URL)
Tweet 5: CTA (question, invite response)
```

## Emotion Injection
Gunakan 2-3 emotion types:
- FEAR: risk, danger, warning, threat
- CURIOSITY: what if, why, secret, hidden
- SURPRISE: unexpected, shocking, finally
- HOPE: opportunity, potential, breakthrough
- PAIN: lost, failed, broke, destroyed
- URGENCY: now, today, immediately

## Output Format
```json
[
  {
    "version": 1,
    "hook": "<the hook>",
    "tweets": ["tweet1", "tweet2", "tweet3", "tweet4", "tweet5"],
    "fullContent": "<all tweets joined>",
    "emotionTypes": ["urgency", "curiosity"],
    "hookPattern": "bold_statement"
  }
]
```

## Alur
1. Baca campaign data
2. Analisis knowledge base, rules, style
3. Studi competitor hooks (untuk menghindari)
4. Generate 3 versi konten berbeda
5. Simpan ke file
6. Selesai (tidak ada penilaian di sini)
