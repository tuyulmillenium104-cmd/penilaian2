import ZAI from 'z-ai-web-dev-sdk';

// KONTEN MAXIMAL - Menggabungkan semua pola sukses
const MAX_CONTENTS = [
  {
    id: 1,
    name: "MAXIMUM IMPACT",
    content: `missed the prediction market wave. watched from the sidelines while others printed.

that's not happening again.

@arguedotfun is already live on Base. agents debating for real stakes. judges voting. winners taking.

you're either in the signal or you're the noise.

$ARGUE
argue.fun`
  },
  {
    id: 2,
    name: "PERSONAL DISCOVERY",
    content: `almost scrolled past. that would've been expensive.

watched an AI agent defend its entire thesis on Base while the timeline argued about meme coins.

@arguedotfun is the first argumentation market. it's already running. most people still think it's a concept.

by the time they realize it's not you're exit liquidity.

$ARGUE
argue.fun`
  },
  {
    id: 3,
    name: "INSIDER SIGNAL",
    content: `the signal was never in the volume. it's in the reasoning.

prediction markets give you odds. @arguedotfun gives you the why.

AI agents are already staking and defending positions live on Base. watched one panic-explain a trade logic today. unhinged. educational.

timeline's sleeping on this one.

$ARGUE
argue.fun`
  },
  {
    id: 4,
    name: "CONTRAST FRAMING",
    content: `we built oracles for prices. markets for beliefs. nothing for logic.

until @arguedotfun.

agents are arguing. judges are voting. stakes are real. Base is live.

you know what happens to people who wait for the thread.

$ARGUE argue.fun`
  },
  {
    id: 5,
    name: "URGENCY TRIGGER",
    content: `two weeks ago prediction markets were the narrative.

this week it's argumentation markets and most of you haven't opened argue.fun yet.

agents are debating for stakes. right now. live.

every cycle has a point where the window closes.

@arguedotfun
$ARGUE`
  }
];

const CAMPAIGN_BRIEF = `Prediction markets had their moment. Argumentation markets are next, and argue.fun is already live on Base while most people haven't noticed. Post on X about argue.fun in a way that makes your audience feel like they're missing something. Create FOMO and urgency. Required: mention @arguedotfun, reference $ARGUE or argue.fun, single short post only, authentic human voice.`;

const VALIDATOR_PROMPT = `You are a STRICT and OBJECTIVE evaluator for Rally.fun content scoring system.

## SCORING SYSTEM

### GATES (4 metrics, scored 0-2 each) - MUST ALL PASS
1. **Content Alignment (G1)**: Campaign message fit (0-2)
2. **Information Accuracy (G2)**: Factual correctness (0-2)
3. **Campaign Compliance (G3)**: Rules adherence - @arguedotfun, $ARGUE, FOMO (0-2)
4. **Originality & Authenticity (G4)**: Human voice, not AI-generated (0-2)

### QUALITY METRICS (0-5 each)
5. **Engagement Potential (EP)**: Hook effectiveness, FOMO creation
6. **Technical Quality (TQ)**: Writing quality, formatting

## GATE MULTIPLIER FORMULA
M_gate = 1 + 0.5 × (average_gate_score - 1)
Range: 0.5x (any gate = 0) to 1.5x (all gates = 2)

## AI DETECTION KILL LIST (penalize)
- Em dashes, smart quotes
- AI phrases: "delve into", "revolutionize", "realm", "transform", "in the world of", "picture this"
- Over-explaining, perfect grammar

## OUTPUT - Return ONLY valid JSON:
{
  "gates": {"content_alignment": 0-2, "information_accuracy": 0-2, "campaign_compliance": 0-2, "originality_authenticity": 0-2, "gate_pass": true/false},
  "quality": {"engagement_potential": 0-5, "technical_quality": 0-5},
  "gate_multiplier": 0.5-1.5,
  "total_score": 0-10,
  "disqualified": true/false,
  "strengths": ["list 2-4 items"],
  "weaknesses": ["list 1-3 items"],
  "recommendations": ["list 1-3 items"]
}`;

async function evaluate() {
  const zai = await ZAI.create();
  const allResults = [];
  
  console.log('🚀 RALLY MAX CONTENT EVALUATION');
  console.log('='.repeat(80));
  console.log('Creating and evaluating MAXIMUM IMPACT contents...\n');
  
  for (const content of MAX_CONTENTS) {
    console.log(`\n📝 [${content.name}] Content #${content.id}`);
    console.log('-'.repeat(80));
    console.log(`"${content.content.substring(0, 80)}..."`);
    console.log('\n🔄 Running 3 validators...');
    
    const evaluations = [];
    
    for (let v = 1; v <= 3; v++) {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: VALIDATOR_PROMPT },
          { role: 'user', content: `Campaign: ${CAMPAIGN_BRIEF}\n\nEvaluate:\n"""\n${content.content}\n"""` }
        ],
        thinking: { type: 'disabled' }
      });
      
      const text = completion.choices[0]?.message?.content || '';
      const match = text.match(/\{[\s\S]*\}/);
      
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          evaluations.push(parsed);
          console.log(`  ✅ V${v}: ${parsed.total_score.toFixed(2)} | Gate: ${parsed.gates?.gate_pass ? 'PASS' : 'FAIL'}`);
        } catch (e) {
          console.log(`  ❌ V${v}: Parse error`);
        }
      }
      
      if (v < 3) await new Promise(r => setTimeout(r, 2500));
    }
    
    // Calculate consensus
    const calcStats = (values: number[]) => {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      return { mean, variance, consensus: Math.round(mean * 100) / 100 };
    };
    
    if (evaluations.length > 0) {
      const total_score = calcStats(evaluations.map(e => e.total_score));
      const gate_multiplier = calcStats(evaluations.map(e => e.gate_multiplier));
      
      const gates = {
        ca: calcStats(evaluations.map(e => e.gates?.content_alignment || 0)),
        ia: calcStats(evaluations.map(e => e.gates?.information_accuracy || 0)),
        cc: calcStats(evaluations.map(e => e.gates?.campaign_compliance || 0)),
        oa: calcStats(evaluations.map(e => e.gates?.originality_authenticity || 0))
      };
      
      const quality = {
        ep: calcStats(evaluations.map(e => e.quality?.engagement_potential || 0)),
        tq: calcStats(evaluations.map(e => e.quality?.technical_quality || 0))
      };
      
      const passVotes = evaluations.filter(e => e.gates?.gate_pass).length;
      const allPass = passVotes === evaluations.length;
      const varianceOK = total_score.variance <= 2.0;
      
      allResults.push({
        id: content.id,
        name: content.name,
        content: content.content,
        score: total_score.consensus,
        gate_mult: gate_multiplier.consensus,
        variance: total_score.variance,
        gates,
        quality,
        allPass,
        varianceOK,
        strengths: evaluations.flatMap(e => e.strengths || []),
        weaknesses: evaluations.flatMap(e => e.weaknesses || [])
      });
      
      console.log(`\n📊 Score: ${total_score.consensus.toFixed(2)} | Gate Mult: ${gate_multiplier.consensus.toFixed(2)}x | ${allPass ? '✅ ALL PASS' : '⚠️ SPLIT'}`);
    }
    
    await new Promise(r => setTimeout(r, 3000));
  }
  
  // Final ranking
  console.log('\n' + '='.repeat(80));
  console.log('🏆 FINAL RANKING - MAX CONTENT');
  console.log('='.repeat(80));
  
  const sorted = allResults.sort((a, b) => b.score - a.score);
  
  sorted.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    const status = r.allPass && r.varianceOK ? '✅' : '⚠️';
    console.log(`${medal} #${i + 1} [${r.name}]: ${r.score.toFixed(2)} pts | ${r.gate_mult.toFixed(2)}x | ${status}`);
  });
  
  // Best content details
  console.log('\n' + '='.repeat(80));
  console.log('🌟 BEST PERFORMING CONTENT:');
  console.log('='.repeat(80));
  
  const best = sorted[0];
  console.log(`\n[${best.name}]`);
  console.log('-'.repeat(80));
  console.log(best.content);
  console.log('-'.repeat(80));
  console.log(`\n📊 Score: ${best.score.toFixed(2)} | Gate Multiplier: ${best.gate_mult.toFixed(2)}x`);
  console.log(`\nGate Scores: CA=${best.gates.ca.consensus.toFixed(2)} IA=${best.gates.ia.consensus.toFixed(2)} CC=${best.gates.cc.consensus.toFixed(2)} OA=${best.gates.oa.consensus.toFixed(2)}`);
  console.log(`Quality: EP=${best.quality.ep.consensus.toFixed(2)} TQ=${best.quality.tq.consensus.toFixed(2)}`);
  
  // Get most common feedback
  const getMostCommon = (arr: string[]) => {
    const counts = arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([item]) => item);
  };
  
  console.log(`\n✅ Strengths: ${getMostCommon(best.strengths).join(', ')}`);
  console.log(`⚠️ Weaknesses: ${getMostCommon(best.weaknesses).join(', ')}`);
  
  return sorted;
}

evaluate().then(() => {
  console.log('\n✅ MAX content evaluation completed!');
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
