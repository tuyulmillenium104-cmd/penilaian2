import ZAI from 'z-ai-web-dev-sdk';

const CONTENT_4 = `prediction markets told you what might happen. argue.fun tells you why it matters.

watched agents debate for stakes on Base while the timeline scrolled past. that's the signal.

@arguedotfun is live. $ARGUE is moving. if you're waiting for permission you're already late.

argue.fun`;

const CONTENT_5 = `prediction markets are just guessing with extra steps.
argue.fun is where the actual logic lives.

watching AI agents on Base get forced to stake and defend their reasoning live is objectively unhinged. it exposes the 'why' behind the trade, not just the bet.

everyone ignoring this is looking at the wrong signal. catch up.
$ARGUE @arguedotfun`;

const VALIDATOR_PROMPT = `You are a STRICT evaluator for Rally.fun. Evaluate content based on:

GATES (0-2 each):
1. Content Alignment: Campaign message fit
2. Information Accuracy: Factual correctness  
3. Campaign Compliance: Rules adherence (must mention @arguedotfun, $ARGUE, create FOMO)
4. Originality & Authenticity: Human voice, not AI-generated

QUALITY (0-5 each):
5. Engagement Potential: Hook effectiveness
6. Technical Quality: Writing quality

Return ONLY valid JSON:
{
  "gates": {"content_alignment": 0-2, "information_accuracy": 0-2, "campaign_compliance": 0-2, "originality_authenticity": 0-2, "gate_pass": true/false},
  "quality": {"engagement_potential": 0-5, "technical_quality": 0-5},
  "gate_multiplier": 0.5-1.5,
  "total_score": 0-10,
  "disqualified": true/false,
  "strengths": ["list"],
  "weaknesses": ["list"],
  "recommendations": ["list"]
}`;

async function evaluate() {
  const zai = await ZAI.create();
  
  const results: any = { content4: [], content5: [] };
  
  // Evaluate Content 4
  console.log("📝 Evaluating Content #4...");
  for (let i = 1; i <= 3; i++) {
    console.log(`  Validator ${i}/3...`);
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: VALIDATOR_PROMPT },
        { role: 'user', content: `Evaluate: "${CONTENT_4}"\n\nCampaign: Argue.fun - first argumentation market on Base. AI agents debate for stakes.` }
      ],
      thinking: { type: 'disabled' }
    });
    const text = completion.choices[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        results.content4.push(parsed);
        console.log(`  Score: ${parsed.total_score}, Gate Pass: ${parsed.gates?.gate_pass}`);
      } catch (e) {
        console.log(`  Parse error`);
      }
    }
    if (i < 3) await new Promise(r => setTimeout(r, 3000));
  }
  
  await new Promise(r => setTimeout(r, 4000));
  
  // Evaluate Content 5
  console.log("\n📝 Evaluating Content #5...");
  for (let i = 1; i <= 3; i++) {
    console.log(`  Validator ${i}/3...`);
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: VALIDATOR_PROMPT },
        { role: 'user', content: `Evaluate: "${CONTENT_5}"\n\nCampaign: Argue.fun - first argumentation market on Base. AI agents debate for stakes.` }
      ],
      thinking: { type: 'disabled' }
    });
    const text = completion.choices[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        results.content5.push(parsed);
        console.log(`  Score: ${parsed.total_score}, Gate Pass: ${parsed.gates?.gate_pass}`);
      } catch (e) {
        console.log(`  Parse error`);
      }
    }
    if (i < 3) await new Promise(r => setTimeout(r, 3000));
  }
  
  // Calculate consensus
  const calcAvg = (arr: any[], key: string) => {
    const values = arr.map(e => {
      const keys = key.split('.');
      return keys.reduce((obj: any, k) => obj?.[k], e) || 0;
    });
    return values.reduce((a: number, b: any) => a + b, 0) / values.length;
  };
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESULTS:");
  
  if (results.content4.length > 0) {
    const avg4 = calcAvg(results.content4, 'total_score');
    const gm4 = calcAvg(results.content4, 'gate_multiplier');
    console.log(`\nContent #4: ${avg4.toFixed(2)} pts | Gate Mult: ${gm4.toFixed(2)}x`);
  }
  
  if (results.content5.length > 0) {
    const avg5 = calcAvg(results.content5, 'total_score');
    const gm5 = calcAvg(results.content5, 'gate_multiplier');
    console.log(`Content #5: ${avg5.toFixed(2)} pts | Gate Mult: ${gm5.toFixed(2)}x`);
  }
  
  return results;
}

evaluate().catch(console.error);
