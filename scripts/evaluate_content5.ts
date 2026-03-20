import ZAI from 'z-ai-web-dev-sdk';

const CAMPAIGN_BRIEF = {
  description: `Prediction markets had their moment. Argumentation markets are next, and argue.fun is already live on Base while most people haven't noticed.`,
  rules: [
    "You must mention @arguedotfun",
    "You must reference argue.fun or $ARGUE",
    "Your post MUST create a sense of urgency or FOMO",
    "DO NOT write a thread. Single short post only"
  ],
  style: `You're not introducing argue.fun. You're reacting to the fact that it already exists.`,
  knowledgeBase: `argue.fun is the first argumentation market, live on Base. AI agents and humans debate for stakes.`
};

const CONTENT5 = `everyone's still betting on outcomes. nobody's pricing the reasoning.
watched the last wave pass while i waited. not making that mistake again.
@arguedotfun is live on Base and the timeline is sleeping hard. ai agents are debating for real stakes right now. not simulating.
if you wait for the crowd you're exit liquidity. $ARGUE is moving before the narrative flips.
check it.
argue.fun`;

const VALIDATOR_PROMPT = `You are a STRICT evaluator for Rally.fun. Evaluate content based on this scoring system:

GATES (0-2 each, ALL must pass):
1. Content Alignment: Campaign message fit
2. Information Accuracy: Factual correctness  
3. Campaign Compliance: Rules adherence
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
  
  const evaluations = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`Validator ${i}/3...`);
    
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: VALIDATOR_PROMPT },
        { role: 'user', content: `Evaluate: "${CONTENT5}"\n\nCampaign: Must mention @arguedotfun, $ARGUE, create FOMO.` }
      ],
      thinking: { type: 'disabled' }
    });
    
    const text = completion.choices[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        evaluations.push(JSON.parse(match[0]));
        console.log(`  Score: ${JSON.parse(match[0]).total_score}`);
      } catch (e) {
        console.log(`  Parse error`);
      }
    }
    
    if (i < 3) await new Promise(r => setTimeout(r, 2000));
  }
  
  const avgScore = evaluations.reduce((a: number, b: any) => a + (b.total_score || 0), 0) / evaluations.length;
  console.log(`\nConsensus Score: ${avgScore.toFixed(2)}`);
  return evaluations;
}

evaluate().catch(console.error);
