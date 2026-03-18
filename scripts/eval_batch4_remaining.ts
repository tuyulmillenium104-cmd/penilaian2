import ZAI from 'z-ai-web-dev-sdk';

const CONTENTS = [
  {
    id: 4,
    content: `we built oracles for prices. we built markets for beliefs.

nobody built anything for logic until now.

@arguedotfun is live. agents are arguing. judges are voting.

if you're not looking you're already behind.

$ARGUE
argue.fun`
  },
  {
    id: 5,
    content: `portfolio is red but this catch feels different.

saw the tx hash before the tweet. that's the signal.

@arguedotfun is live on Base. agents debating for stakes.

you know how these cycles go. wait for permission and you're the exit.

$ARGUE
argue.fun`
  },
  {
    id: 6,
    content: `missed the prediction market wave because i waited for clarity.

not making that mistake twice.

argumentation markets are here and @arguedotfun is the only one live on Base.

you're either early or you're liquidity.

argue.fun
$ARGUE`
  },
  {
    id: 7,
    content: `the signal was never in the volume. it's in the reasoning.

prediction markets give you odds. @arguedotfun gives you the why.

AI agents are already staking and defending positions live on Base. watched one panic-explain a trade logic today. unhinged. educational.

timeline's sleeping on this one.

$ARGUE
argue.fun`
  }
];

const VALIDATOR_PROMPT = `You are a STRICT Rally.fun evaluator. Score content:

GATES (0-2): Content Alignment, Information Accuracy, Campaign Compliance, Originality/Authenticity
QUALITY (0-5): Engagement Potential, Technical Quality

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
  const results = [];
  
  console.log('🚀 Continuing Batch 4 Evaluation...\n');
  
  for (const content of CONTENTS) {
    console.log(`📝 Content #${content.id}`);
    const evaluations = [];
    
    for (let v = 1; v <= 3; v++) {
      console.log(`  V${v}/3...`);
      
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: VALIDATOR_PROMPT },
          { role: 'user', content: `Campaign: Argue.fun - first argumentation market on Base. Create FOMO. Must mention @arguedotfun and $ARGUE.\n\nEvaluate:\n"""\n${content.content}\n"""` }
        ],
        thinking: { type: 'disabled' }
      });
      
      const text = completion.choices[0]?.message?.content || '';
      const match = text.match(/\{[\s\S]*\}/);
      
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          evaluations.push(parsed);
          console.log(`    ✅ ${parsed.total_score.toFixed(2)} | ${parsed.gates?.gate_pass ? 'PASS' : 'FAIL'}`);
        } catch (e) {}
      }
      
      if (v < 3) await new Promise(r => setTimeout(r, 5000));
    }
    
    if (evaluations.length > 0) {
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      const score = avg(evaluations.map(e => e.total_score));
      const gm = avg(evaluations.map(e => e.gate_multiplier));
      
      results.push({
        id: content.id,
        score: Math.round(score * 100) / 100,
        gate_mult: Math.round(gm * 100) / 100,
        allPass: evaluations.every(e => e.gates?.gate_pass)
      });
      
      console.log(`  📊 ${score.toFixed(2)} pts | ${gm.toFixed(2)}x\n`);
    }
    
    await new Promise(r => setTimeout(r, 6000));
  }
  
  // Combine with previous results
  const previous = [
    { id: 1, score: 8.07, gate_mult: 1.20, allPass: true },
    { id: 2, score: 8.33, gate_mult: 1.17, allPass: true },
    { id: 3, score: 8.13, gate_mult: 1.23, allPass: true }
  ];
  
  const all = [...previous, ...results].sort((a, b) => b.score - a.score);
  
  console.log('='.repeat(60));
  console.log('🏆 FINAL RANKINGS (BATCH 4)');
  console.log('='.repeat(60));
  
  all.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`${medal} #${i + 1} Content #${r.id}: ${r.score.toFixed(2)} pts | ${r.gate_mult.toFixed(2)}x`);
  });
  
  return all;
}

evaluate().catch(console.error);
