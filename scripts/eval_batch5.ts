import ZAI from 'z-ai-web-dev-sdk';

const CONTENTS = [
  {
    id: 1,
    name: "ALMOST SCROLLED",
    content: `almost scrolled past. thought it was another ai agent gimmick.

watched a debate settle on Base. real tokens moved.

@arguedotfun isnt waiting for the narrative to catch up.

by the time influencers post this you're already liquidity.

$ARGUE
argue.fun`
  },
  {
    id: 2,
    name: "HERES THE THING",
    content: `heres the thing. most of you will read this and do nothing.

same as prediction markets. same as perps. same as everything.

@arguedotfun is live on Base. agents are arguing right now.

wake up when youre liquidity or wake up now.

$ARGUE
argue.fun`
  },
  {
    id: 3,
    name: "WATCHING A WEEK",
    content: `been watching argue.fun for a week. said nothing.

watched agents defend positions. watched judges vote. watched tokens move.

@arguedotfun doesnt need hype. it needs people who see it early.

thats you or thats not.

$ARGUE
argue.fun`
  },
  {
    id: 4,
    name: "GOT BURNED",
    content: `got burned on the last narrative. waited for "proof". missed it.

this time im not waiting.

@arguedotfun is live. agents debating. judges voting. on Base.

if this feels like deja vu thats because youve been here before.

$ARGUE
argue.fun`
  },
  {
    id: 5,
    name: "CIRCUS WRONG",
    content: `thought this was another ai agent circus. was wrong.

saw the tx myself. real stakes. real arguments.

@arguedotfun shipped while everyone tweeted about the next memecoin.

you know what happens when you wait.

$ARGUE
argue.fun`
  },
  {
    id: 6,
    name: "3AM SCROLL",
    content: `3am. scrolling. almost slept on this.

watched two agents go at it for 20 mins. one lost eth.

@arguedotfun isnt a pitch deck. its live on Base.

by the time ct talks about this youre funding exits.

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
  "strengths": ["list"],
  "weaknesses": ["list"]
}`;

async function evaluate() {
  const zai = await ZAI.create();
  const results = [];
  
  console.log('🚀 RALLY CONSENSUS EVALUATION - BATCH 5');
  console.log('='.repeat(70));
  
  for (const content of CONTENTS) {
    console.log(`\n📝 [${content.name}] Content #${content.id}`);
    console.log('-'.repeat(70));
    
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
      
      if (v < 3) await new Promise(r => setTimeout(r, 4000));
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
        name: content.name,
        content: content.content,
        score: total_score.consensus,
        gate_mult: gate_multiplier.consensus,
        variance: total_score.variance,
        gates,
        allPass,
        strengths: evaluations.flatMap(e => e.strengths || []),
        weaknesses: evaluations.flatMap(e => e.weaknesses || [])
      });
      
      console.log(`\n  📊 ${total_score.consensus.toFixed(2)} pts | ${gate_multiplier.consensus.toFixed(2)}x | ${allPass ? '✅ PASS' : '⚠️ SPLIT'}`);
    }
    
    await new Promise(r => setTimeout(r, 5000));
  }
  
  // Final ranking
  console.log('\n' + '='.repeat(70));
  console.log('🏆 FINAL RANKINGS - BATCH 5');
  console.log('='.repeat(70));
  
  const sorted = results.sort((a, b) => b.score - a.score);
  
  sorted.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`${medal} #${i + 1} [${r.name}]: ${r.score.toFixed(2)} pts | ${r.gate_mult.toFixed(2)}x`);
  });
  
  // Best content
  console.log('\n' + '='.repeat(70));
  console.log('🌟 BEST CONTENT:');
  console.log('='.repeat(70));
  const best = sorted[0];
  console.log(`\n[${best.name}]`);
  console.log(`Score: ${best.score.toFixed(2)} | Gate Mult: ${best.gate_mult.toFixed(2)}x`);
  console.log(`Gates: CA=${best.gates.ca.consensus.toFixed(2)} IA=${best.gates.ia.consensus.toFixed(2)} CC=${best.gates.cc.consensus.toFixed(2)} OA=${best.gates.oa.consensus.toFixed(2)}`);
  console.log('\n' + '-'.repeat(70));
  console.log(best.content);
  
  // Get common feedback
  const getMostCommon = (arr: string[]) => {
    const counts = arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([item]) => item);
  };
  
  console.log('\n✅ Strengths:', getMostCommon(best.strengths).join(', '));
  console.log('⚠️ Weaknesses:', getMostCommon(best.weaknesses).join(', '));
  
  return sorted;
}

evaluate().then(() => {
  console.log('\n✅ Batch 5 evaluation completed!');
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
