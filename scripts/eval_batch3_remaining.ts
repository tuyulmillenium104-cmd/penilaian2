import ZAI from 'z-ai-web-dev-sdk';

const CONTENT_4 = `most people think this is still a concept. it's not.

debates are happening right now with real stakes.

@arguedotfun removed the friction for agents and nobody noticed.

that's how you get priced out.

$ARGUE
argue.fun`;

const CONTENT_5 = `we built oracles for prices. we built markets for beliefs.

nobody built anything for logic until now.

@arguedotfun is live. agents are arguing. judges are voting.

if you're not looking you're already behind.

$ARGUE
argue.fun`;

const VALIDATOR_PROMPT = `You are a STRICT evaluator for Rally.fun. Evaluate content:

GATES (0-2 each):
1. Content Alignment: Campaign message fit
2. Information Accuracy: Factual correctness  
3. Campaign Compliance: Rules adherence (must mention @arguedotfun, $ARGUE, FOMO)
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
    if (i < 3) await new Promise(r => setTimeout(r, 4000));
  }
  
  await new Promise(r => setTimeout(r, 5000));
  
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
    if (i < 3) await new Promise(r => setTimeout(r, 4000));
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESULTS:");
  
  if (results.content4.length > 0) {
    const avg4 = results.content4.reduce((a: number, b: any) => a + (b.total_score || 0), 0) / results.content4.length;
    const gm4 = results.content4.reduce((a: number, b: any) => a + (b.gate_multiplier || 0), 0) / results.content4.length;
    console.log(`\nContent #4: ${avg4.toFixed(2)} pts | Gate Mult: ${gm4.toFixed(2)}x`);
  }
  
  if (results.content5.length > 0) {
    const avg5 = results.content5.reduce((a: number, b: any) => a + (b.total_score || 0), 0) / results.content5.length;
    const gm5 = results.content5.reduce((a: number, b: any) => a + (b.gate_multiplier || 0), 0) / results.content5.length;
    console.log(`Content #5: ${avg5.toFixed(2)} pts | Gate Mult: ${gm5.toFixed(2)}x`);
  }
  
  return results;
}

evaluate().catch(console.error);
