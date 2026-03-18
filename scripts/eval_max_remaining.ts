import ZAI from 'z-ai-web-dev-sdk';

const CONTENT_4 = `we built oracles for prices. markets for beliefs. nothing for logic.

until @arguedotfun.

agents are arguing. judges are voting. stakes are real. Base is live.

you know what happens to people who wait for the thread.

$ARGUE argue.fun`;

const CONTENT_5 = `two weeks ago prediction markets were the narrative.

this week it's argumentation markets and most of you haven't opened argue.fun yet.

agents are debating for stakes. right now. live.

every cycle has a point where the window closes.

@arguedotfun
$ARGUE`;

const VALIDATOR_PROMPT = `You are a STRICT evaluator for Rally.fun. Score content:

GATES (0-2 each):
1. Content Alignment: Campaign fit
2. Information Accuracy: Factual
3. Campaign Compliance: @arguedotfun, $ARGUE, FOMO
4. Originality: Human voice, not AI

QUALITY (0-5 each):
5. Engagement Potential
6. Technical Quality

Return ONLY JSON:
{
  "gates": {"content_alignment": 0-2, "information_accuracy": 0-2, "campaign_compliance": 0-2, "originality_authenticity": 0-2, "gate_pass": true/false},
  "quality": {"engagement_potential": 0-5, "technical_quality": 0-5},
  "gate_multiplier": 0.5-1.5,
  "total_score": 0-10,
  "strengths": ["list"],
  "weaknesses": ["list"]
}`;

async function evaluate() {
  const zai = await ZAI.create();
  
  console.log('📝 Evaluating Content #4 [CONTRAST FRAMING]...');
  const results4 = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`  Validator ${i}/3...`);
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: VALIDATOR_PROMPT },
        { role: 'user', content: `Campaign: Argue.fun - first argumentation market on Base. Create FOMO, mention @arguedotfun and $ARGUE.\n\nEvaluate:\n"""\n${CONTENT_4}\n"""` }
      ],
      thinking: { type: 'disabled' }
    });
    const text = completion.choices[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        results4.push(parsed);
        console.log(`  Score: ${parsed.total_score}`);
      } catch (e) {}
    }
    if (i < 3) await new Promise(r => setTimeout(r, 4000));
  }
  
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('\n📝 Evaluating Content #5 [URGENCY TRIGGER]...');
  const results5 = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`  Validator ${i}/3...`);
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: VALIDATOR_PROMPT },
        { role: 'user', content: `Campaign: Argue.fun - first argumentation market on Base. Create FOMO, mention @arguedotfun and $ARGUE.\n\nEvaluate:\n"""\n${CONTENT_5}\n"""` }
      ],
      thinking: { type: 'disabled' }
    });
    const text = completion.choices[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        results5.push(parsed);
        console.log(`  Score: ${parsed.total_score}`);
      } catch (e) {}
    }
    if (i < 3) await new Promise(r => setTimeout(r, 4000));
  }
  
  // Calculate averages
  const avg4 = results4.length > 0 ? results4.reduce((a, b) => a + b.total_score, 0) / results4.length : 0;
  const avg5 = results5.length > 0 ? results5.reduce((a, b) => a + b.total_score, 0) / results5.length : 0;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS:');
  console.log(`Content #4: ${avg4.toFixed(2)} pts`);
  console.log(`Content #5: ${avg5.toFixed(2)} pts`);
  
  return { avg4, avg5 };
}

evaluate().catch(console.error);
