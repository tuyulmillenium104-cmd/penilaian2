import ZAI from 'z-ai-web-dev-sdk';

const CONTENTS = [
  {
    id: 1,
    content: `watched an agent lose tokens in a debate. real time on Base.

most people think this is theory. it's not.

@arguedotfun is live. reasoning is the new oracle.

if you wait for a thread you're the liquidity.

$ARGUE
argue.fun`
  },
  {
    id: 2,
    content: `missed the prediction market wave. waited for clarity. got priced out.

not making that mistake again.

argumentation markets are live on Base. @arguedotfun is the only one shipping.

you're either early or you're exit liquidity.

argue.fun
$ARGUE`
  },
  {
    id: 3,
    content: `ai agents trade billions but never explain why. that breaks today.

watched the first debate settle on @arguedotfun.

skin in the game for logic. not just outcomes.

timeline is sleeping. that's your window.

$ARGUE
argue.fun`
  },
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

const VALIDATOR_PROMPT = `You are a STRICT evaluator for Rally.fun. Score content:

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
  const results = [];
  
  console.log('🚀 RALLY CONSENSUS EVALUATION - BATCH 4');
  console.log('='.repeat(70));
  
  for (const content of CONTENTS) {
    console.log(`\n📝 Content #${content.id}`);
    console.log('-'.repeat(70));
    console.log(`"${content.content.substring(0, 60)}..."`);
    
    const evaluations = [];
    
    for (let v = 1; v <= 3; v++) {
      console.log(`  V${v}/3...`);
      
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: VALIDATOR_PROMPT },
          { role: 'user', content: `Campaign: Argue.fun - first argumentation market on Base. AI agents debate for stakes. Must create FOMO.\n\nEvaluate:\n"""\n${content.content}\n"""` }
        ],
        thinking: { type: 'disabled' }
      });
      
      const text = completion.choices[0]?.message?.content || '';
      const match = text.match(/\{[\s\S]*\}/);
      
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          evaluations.push(parsed);
          console.log(`    ✅ ${parsed.total_score.toFixed(2)} | Gate: ${parsed.gates?.gate_pass ? 'PASS' : 'FAIL'}`);
        } catch (e) {
          console.log(`    ❌ Parse error`);
        }
      }
      
      if (v < 3) await new Promise(r => setTimeout(r, 3000));
    }
    
    // Calculate consensus
    if (evaluations.length > 0) {
      const calcStats = (values: number[]) => {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        return { mean, variance, consensus: Math.round(mean * 100) / 100 };
      };
      
      const total_score = calcStats(evaluations.map(e => e.total_score));
      const gate_multiplier = calcStats(evaluations.map(e => e.gate_multiplier));
      
      const gates = {
        ca: calcStats(evaluations.map(e => e.gates?.content_alignment || 0)),
        ia: calcStats(evaluations.map(e => e.gates?.information_accuracy || 0)),
        cc: calcStats(evaluations.map(e => e.gates?.campaign_compliance || 0)),
        oa: calcStats(evaluations.map(e => e.gates?.originality_authenticity || 0))
      };
      
      const passVotes = evaluations.filter(e => e.gates?.gate_pass).length;
      const allPass = passVotes === evaluations.length;
      
      results.push({
        id: content.id,
        content: content.content,
        score: total_score.consensus,
        gate_mult: gate_multiplier.consensus,
        variance: total_score.variance,
        gates,
        allPass,
        strengths: evaluations.flatMap(e => e.strengths || []),
        weaknesses: evaluations.flatMap(e => e.weaknesses || [])
      });
      
      console.log(`\n  📊 Consensus: ${total_score.consensus.toFixed(2)} | Gate: ${gate_multiplier.consensus.toFixed(2)}x | ${allPass ? '✅ PASS' : '⚠️ SPLIT'}`);
    }
    
    await new Promise(r => setTimeout(r, 3500));
  }
  
  // Final ranking
  console.log('\n' + '='.repeat(70));
  console.log('🏆 FINAL RANKINGS');
  console.log('='.repeat(70));
  
  const sorted = results.sort((a, b) => b.score - a.score);
  
  sorted.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`${medal} #${i + 1} Content #${r.id}: ${r.score.toFixed(2)} pts | ${r.gate_mult.toFixed(2)}x | ${r.allPass ? '✅' : '⚠️'}`);
  });
  
  // Best content
  console.log('\n' + '='.repeat(70));
  console.log('🌟 BEST CONTENT:');
  console.log('='.repeat(70));
  const best = sorted[0];
  console.log(`\nContent #${best.id}`);
  console.log(`Score: ${best.score.toFixed(2)} | Gate Mult: ${best.gate_mult.toFixed(2)}x`);
  console.log(`Gates: CA=${best.gates.ca.consensus.toFixed(2)} IA=${best.gates.ia.consensus.toFixed(2)} CC=${best.gates.cc.consensus.toFixed(2)} OA=${best.gates.oa.consensus.toFixed(2)}`);
  console.log('\n' + '-'.repeat(70));
  console.log(best.content);
  
  return sorted;
}

evaluate().then(() => {
  console.log('\n✅ Evaluation completed!');
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
