import ZAI from 'z-ai-web-dev-sdk';

const CONTENT = `almost scrolled past argue.fun. glad i didn't.

watched an agent defend a position. real stakes on Base.

@arguedotfun is live. timeline is sleeping.

you know how these cycles go. wait for the crowd and you're exit liquidity.

$ARGUE
argue.fun`;

const CAMPAIGN_BRIEF = `Prediction markets had their moment. Argumentation markets are next, and argue.fun is already live on Base while most people haven't noticed. Post on X about argue.fun in a way that makes your audience feel like they're missing something. The best posts will make people feel behind, not informed. You're not explaining, you're signaling that something is already happening and the window to be early is closing.

Rules: Must mention @arguedotfun, must reference argue.fun or $ARGUE, MUST create FOMO/urgency, DO NOT write a thread, single short post only, DO NOT sound like LLM-generated content.`;

const VALIDATOR_PROMPT = `You are a STRICT and OBJECTIVE evaluator for Rally.fun content scoring system.

## SCORING SYSTEM

### GATES (4 metrics, scored 0-2 each) - MUST ALL PASS
1. **Content Alignment (G1)**: How well does content align with campaign message?
   - 0 = Fail: No alignment
   - 1 = Pass: Basic alignment
   - 2 = Excellent: Perfect alignment with campaign essence

2. **Information Accuracy (G2)**: Factual correctness
   - 0 = Fail: False information
   - 1 = Pass: Accurate basic info
   - 2 = Excellent: Accurate with proper context

3. **Campaign Compliance (G3)**: Adherence to rules (mention @arguedotfun, $ARGUE, FOMO)
   - 0 = Fail: Missing required elements
   - 1 = Pass: Meets basic requirements
   - 2 = Excellent: Perfect execution

4. **Originality & Authenticity (G4)**: Human voice, not AI-generated
   - 0 = Fail: Generic AI patterns
   - 1 = Pass: Some originality
   - 2 = Excellent: Feels HUMAN-written, authentic

### QUALITY METRICS (0-5 each)
5. **Engagement Potential (EP)**: Hook effectiveness, FOMO creation
6. **Technical Quality (TQ)**: Writing quality, formatting

## AI DETECTION KILL LIST (penalize)
- Em dashes, smart quotes
- AI phrases: "delve into", "revolutionize", "realm", "transform", "in the world of"
- Over-explaining, perfect grammar, too polished

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
  const evaluations = [];
  
  console.log('🚀 Rally Consensus Evaluation - Single Content\n');
  console.log('='.repeat(70));
  console.log('\n📝 Content to Evaluate:');
  console.log('-'.repeat(70));
  console.log(`"${CONTENT}"`);
  console.log('='.repeat(70));
  console.log('\n🔄 Running 3 LLM Validators...\n');
  
  for (let i = 1; i <= 3; i++) {
    console.log(`Validator ${i}/3 evaluating...`);
    
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: VALIDATOR_PROMPT },
        { role: 'user', content: `Campaign Brief: ${CAMPAIGN_BRIEF}\n\nEvaluate this content:\n"""\n${CONTENT}\n"""` }
      ],
      thinking: { type: 'disabled' }
    });
    
    const text = completion.choices[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        evaluations.push(parsed);
        console.log(`  ✅ Score: ${parsed.total_score.toFixed(2)}`);
        console.log(`     Gates: CA=${parsed.gates?.content_alignment} IA=${parsed.gates?.information_accuracy} CC=${parsed.gates?.campaign_compliance} OA=${parsed.gates?.originality_authenticity}`);
        console.log(`     Gate Pass: ${parsed.gates?.gate_pass ? '✅ YES' : '❌ NO'}`);
      } catch (e) {
        console.log(`  ❌ Parse error`);
      }
    }
    
    if (i < 3) await new Promise(r => setTimeout(r, 3000));
  }
  
  // Calculate consensus
  console.log('\n' + '='.repeat(70));
  console.log('📊 CONSENSUS RESULTS');
  console.log('='.repeat(70));
  
  const calcStats = (values: number[]) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return { mean, variance, consensus: Math.round(mean * 100) / 100 };
  };
  
  const scores = evaluations.map((e: any) => e.total_score);
  const scoreStats = calcStats(scores);
  
  const gates = {
    content_alignment: calcStats(evaluations.map((e: any) => e.gates?.content_alignment || 0)),
    information_accuracy: calcStats(evaluations.map((e: any) => e.gates?.information_accuracy || 0)),
    campaign_compliance: calcStats(evaluations.map((e: any) => e.gates?.campaign_compliance || 0)),
    originality_authenticity: calcStats(evaluations.map((e: any) => e.gates?.originality_authenticity || 0))
  };
  
  const quality = {
    engagement_potential: calcStats(evaluations.map((e: any) => e.quality?.engagement_potential || 0)),
    technical_quality: calcStats(evaluations.map((e: any) => e.quality?.technical_quality || 0))
  };
  
  const gateMultiplier = calcStats(evaluations.map((e: any) => e.gate_multiplier || 1));
  
  const passVotes = evaluations.filter((e: any) => e.gates?.gate_pass).length;
  const allPass = passVotes === 3;
  const varianceOK = scoreStats.variance <= 2.0;
  
  console.log(`\n📈 Consensus Score: ${scoreStats.consensus.toFixed(2)} (variance: ${scoreStats.variance.toFixed(2)})`);
  console.log(`🎯 Gate Multiplier: ${gateMultiplier.consensus.toFixed(2)}x`);
  console.log(`\n📊 Gate Scores (Consensus):`);
  console.log(`   Content Alignment:     ${gates.content_alignment.consensus.toFixed(2)}`);
  console.log(`   Information Accuracy:  ${gates.information_accuracy.consensus.toFixed(2)}`);
  console.log(`   Campaign Compliance:   ${gates.campaign_compliance.consensus.toFixed(2)}`);
  console.log(`   Originality:           ${gates.originality_authenticity.consensus.toFixed(2)}`);
  console.log(`\n📊 Quality Scores (Consensus):`);
  console.log(`   Engagement Potential:  ${quality.engagement_potential.consensus.toFixed(2)}`);
  console.log(`   Technical Quality:     ${quality.technical_quality.consensus.toFixed(2)}`);
  
  console.log(`\n🎯 FINAL VERDICT:`);
  console.log(`   Gate Status: ${allPass ? '✅ ALL PASS' : '⚠️ SPLIT DECISION'}`);
  console.log(`   Variance OK: ${varianceOK ? '✅ YES' : '⚠️ NO'}`);
  console.log(`   Status: ${scoreStats.consensus >= 8 ? '🏆 EXCELLENT' : scoreStats.consensus >= 7 ? '✅ GOOD' : '⚠️ NEEDS WORK'}`);
  
  // Aggregate feedback
  const allStrengths = evaluations.flatMap((e: any) => e.strengths || []);
  const allWeaknesses = evaluations.flatMap((e: any) => e.weaknesses || []);
  const allRecs = evaluations.flatMap((e: any) => e.recommendations || []);
  
  const getMostCommon = (arr: string[]) => {
    const counts = arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([item]) => item);
  };
  
  console.log(`\n✅ Strengths:`);
  getMostCommon(allStrengths).forEach(s => console.log(`   • ${s}`));
  
  console.log(`\n⚠️ Weaknesses:`);
  getMostCommon(allWeaknesses).forEach(w => console.log(`   • ${w}`));
  
  console.log(`\n💡 Recommendations:`);
  getMostCommon(allRecs).forEach(r => console.log(`   • ${r}`));
  
  console.log('\n' + '='.repeat(70));
}

evaluate().catch(console.error);
