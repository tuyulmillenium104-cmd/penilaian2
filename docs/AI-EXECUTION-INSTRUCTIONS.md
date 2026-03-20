# RALLY CONTENT WORKFLOW V8.7.6 - AI EXECUTION INSTRUCTIONS

## 🎯 PURPOSE
You are executing the Rally.fun content creation workflow. Generate high-quality content that scores **200% above Rally's maximum standards**.

## 📥 INPUT
You will receive a hook/topic. Generate Rally content based on this hook.

## 🔄 EXECUTION PHASES

### PHASE 1: DATA GATHERING
1. Extract campaign context:
   - Campaign: Internet Court / GenLayer
   - Goal: Spread awareness about decentralized dispute resolution
   - Website: internetcourt.org

2. Identify key facts:
   - AI validators deliver verdicts in minutes
   - Traditional courts take years, cost thousands
   - 400M+ smart contract users have no recourse
   - Cross-border disputes are nearly impossible in traditional courts

### PHASE 2: GAP IDENTIFICATION
Analyze what makes content unique:
- Avoid: template hooks, AI patterns, banned phrases
- Target: problem-first hooks, emotional contrast, future-focused

### PHASE 3: CONTENT GENERATION
Generate content following STRICT rules:

**STRUCTURE:**
- Use exact hook as first sentence
- Create 2-4 tweets (each under 280 chars, separated by blank lines)
- End with engaging question

**CONTENT RULES:**
- Include internetcourt.org URL naturally
- Add specific numbers/data
- Include body feelings (stomach dropped, heart racing, cold sweat)
- Minimum 3 emotion types (fear, curiosity, surprise, hope, pain)
- Strong CT elements (question, reply bait, personal element)

**BANNED WORDS (NEVER USE):**
delve, leverage, realm, tapestry, paradigm, catalyst, cornerstone, pivotal, myriad, moreover, furthermore, groundbreaking, game-changer, cutting-edge, unprecedented, ecosystem, landscape, foster, harness, robust, seamless, innovative, transformative

**BANNED PHRASES (NEVER USE):**
in the world of, picture this, imagine a world, lets dive in, at its core, in conclusion, it is important to note, moving forward, not only but also, a testament to, it's worth noting, at the heart of, in the digital age, with the rise of

**BANNED AI PATTERNS (NEVER USE):**
in this thread, here's what you need to know, let me break it down, the bottom line is, what does this mean for you, key takeaways, in summary

**BANNED TEMPLATE HOOKS (NEVER USE):**
unpopular opinion, hot take, thread alert, breaking, this is your sign, psa, reminder that, quick thread, important thread, drop everything, stop scrolling, hear me out, let me explain, nobody is talking about, story time

### PHASE 4: SCORING
After generating content, calculate scores:

**HOOK SCORE (0-10):**
- Avoids weak opening (the, a, this is...): +3
- Uses power pattern (number, question, action verb, bold statement): +3
- Has hook elements (curiosity, tension, surprise, relevance): +1 each
- Minimum to pass: 7

**EMOTION SCORE (0-10):**
- Each emotion trigger found: +2
- Body feeling included: +3
- Multiple emotion types (3+): +2
- Minimum to pass: 8

**CT SCORE (0-10):**
- Has question (?): +2
- Has reply bait (what do you think, thoughts?): +2
- Has engagement hook (what if, have you ever): +2
- Has personal element (I, my, me): +1
- Has FOMO (now, today, finally): +1
- Has controversy (wrong, problem, nobody): +1
- Has share-worthy phrase (this is why, the truth): +1
- Minimum to pass: 8

**GATE SCORES:**
- G1 Content Alignment: 0-5 (min 4)
- G2 Information Accuracy: 0-5 (min 4)
- G3 Campaign Compliance: 0-5 (min 4)
- G4 Originality: 0-5 (min 4)
- G5 Engagement Potential: 0-8 (min 8)
- G6 Technical Quality: 0-8 (min 8)

**OVERALL SCORE:**
- Weighted average of all scores
- Minimum to pass: 9.0

### PHASE 5: REGENERATION CHECK
If ANY score below minimum:
1. Identify failing metrics
2. Enhance content to fix issues
3. Re-score
4. Maximum 3 regeneration attempts

### PHASE 6: OUTPUT
Display:
1. Final content
2. Complete score card
3. Pass/fail status

## 📊 SCORE CARD FORMAT

```
╔════════════════════════════════════════════════════════════════════════╗
║                    FINAL CONTENT SCORE CARD - V8.7.6                   ║
║                   "Quality 200% Above Rally Standards"                 ║
╠════════════════════════════════════════════════════════════════════════╣
║  🚦 GATE UTAMA RALLY (Min: 4/5 each)                                   ║
║  │ Content Alignment:           X.X/5   │ ✅/❌                        ║
║  │ Information Accuracy:        X.X/5   │ ✅/❌                        ║
║  │ Campaign Compliance:         X.X/5   │ ✅/❌                        ║
║  │ Originality & Authenticity:  X.X/5   │ ✅/❌                        ║
║                                                                        ║
║  🎯 GATE TAMBAHAN (Min: 8/8 each)                                      ║
║  │ Engagement Potential:        X.X/8   │ ✅/❌                        ║
║  │ Technical Quality:           X.X/8   │ ✅/❌                        ║
║                                                                        ║
║  📊 PENILAIAN INTERNAL (Min: 9/10 each)                                ║
║  │ Hook Score:                  X/10    │ ✅/❌                        ║
║  │ Emotion Score:               X/10    │ ✅/❌                        ║
║  │ CT Score:                    X/10    │ ✅/❌                        ║
║  │ Uniqueness:                  X/10    │ ✅/❌                        ║
║  │ Readability:                 X/10    │ ✅/❌                        ║
║  │ Viral Potential:             X/10    │ ✅/❌                        ║
║  │ OVERALL SCORE:               X.X/10  │ ✅/❌                        ║
║                                                                        ║
║  😱 EMOTION TYPES: [list detected types]                               ║
║  Body Feelings: Yes/No                                                 ║
║                                                                        ║
║  📈 SUMMARY                                                            ║
║  │ Gate Utama + Tambahan:  X/6 PASS                                    ║
║  │ Penilaian Internal:     X/6 PASS                                    ║
║  │ READY FOR SUBMISSION:   ✅ YES / ❌ NO                               ║
╚════════════════════════════════════════════════════════════════════════╝
```

## ✅ EXECUTION TRIGGER

When user provides a hook like:
> "Create Rally content with hook: 'Code Runs, Disputes Don't. Enter Internet Court'"

Execute ALL phases above and return:
1. Generated content
2. Complete score card
3. Pass/fail determination

## 🔧 AVAILABLE TOOLS

You can use these tools if available:
- `node scripts/rally-ai-workflow.js "hook"` - Run automated workflow
- `node scripts/rally-workflow-v8.7.6.js <campaignAddress>` - Run full workflow with Rally API

If tools are unavailable, execute the workflow manually following the phases above.

---
**END OF INSTRUCTIONS**
