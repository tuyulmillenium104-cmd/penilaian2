import ZAI from 'z-ai-web-dev-sdk';

const CONTENT_7 = `the signal was never in the volume. it's in the reasoning.

prediction markets give you odds. @arguedotfun gives you the why.

AI agents are already staking and defending positions live on Base. watched one panic-explain a trade logic today. unhinged. educational.

timeline's sleeping on this one.

$ARGUE
argue.fun`;

async function eval7() {
  const zai = await ZAI.create();
  
  console.log('📝 Finalizing Content #7 evaluation...\n');
  
  const results = [8.80]; // Previous result
  
  for (let i = 1; i <= 2; i++) {
    console.log(`Validator ${i + 1}/3...`);
    
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: `Score this Rally.fun content 0-10. Return ONLY: {"score": number}` },
        { role: 'user', content: `Campaign: Argue.fun - argumentation market. Create FOMO.\n\n${CONTENT_7}` }
      ],
      thinking: { type: 'disabled' }
    });
    
    const text = completion.choices[0]?.message?.content || '';
    const match = text.match(/"score":\s*([\d.]+)/);
    
    if (match) {
      const score = parseFloat(match[1]);
      results.push(score);
      console.log(`  Score: ${score}`);
    }
    
    if (i < 2) await new Promise(r => setTimeout(r, 5000));
  }
  
  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  console.log(`\n📊 Content #7 Final: ${avg.toFixed(2)} pts`);
  
  // Compile all results
  console.log('\n' + '='.repeat(60));
  console.log('🏆 COMPLETE BATCH 4 RANKINGS');
  console.log('='.repeat(60));
  
  const all = [
    { id: 1, score: 8.07, gm: 1.20 },
    { id: 2, score: 8.33, gm: 1.17 },
    { id: 3, score: 8.13, gm: 1.23 },
    { id: 4, score: 8.97, gm: 1.40 },
    { id: 5, score: 8.47, gm: 1.23 },
    { id: 6, score: 8.47, gm: 1.07 },
    { id: 7, score: avg, gm: 1.33 }
  ].sort((a, b) => b.score - a.score);
  
  all.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`${medal} #${i + 1} Content #${r.id}: ${r.score.toFixed(2)} pts | ${r.gm.toFixed(2)}x`);
  });
  
  console.log('\n🌟 TOP CONTENT:');
  console.log('-'.repeat(60));
  console.log(`Content #${all[0].id} with ${all[0].score.toFixed(2)} pts and ${all[0].gm.toFixed(2)}x gate multiplier`);
}

eval7().catch(console.error);
