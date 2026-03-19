const ALL_CONTENTS = [
  // BATCH 1
  { batch: 1, id: 1, score: 4.80, gm: 0.90, name: "copium dead", content: "copium dead. new meta is here..." },
  { batch: 1, id: 2, score: 8.80, gm: 1.27, name: "watched this for a minute", content: "watched this for a minute. thought about jumping in..." },
  { batch: 1, id: 3, score: 7.97, gm: 1.07, name: "copium is dead", content: "copium is dead. this is the new meta..." },
  { batch: 1, id: 4, score: 8.53, gm: 1.33, name: "prediction markets tell", content: "prediction markets tell you what people think..." },
  { batch: 1, id: 5, score: 8.60, gm: 1.20, name: "everyone's still betting", content: "everyone's still betting on outcomes..." },
  
  // BATCH 2
  { batch: 2, id: 1, score: 8.83, gm: 1.50, name: "waited too long", content: "waited too long on the last narrative shift..." },
  { batch: 2, id: 2, score: 5.25, gm: 1.00, name: "signal > noise", content: "signal > noise. always..." },
  { batch: 2, id: 3, score: 5.92, gm: 0.75, name: "momentum in merge", content: "the real momentum isn't in the volume..." },
  { batch: 2, id: 4, score: 8.40, gm: 1.00, name: "prediction markets told", content: "prediction markets told you what might happen..." },
  { batch: 2, id: 5, score: 8.20, gm: 1.17, name: "guessing with steps", content: "prediction markets are just guessing..." },
  
  // BATCH 3
  { batch: 3, id: 1, score: 8.67, gm: 1.33, name: "odds vs reasoning", content: "prediction markets told you the odds..." },
  { batch: 3, id: 2, score: 7.80, gm: 1.10, name: "ai agents trade", content: "ai agents trade billions but never explain why..." },
  { batch: 3, id: 3, score: 9.17, gm: 1.50, name: "missed prediction wave", content: "missed the prediction market wave because i waited..." },
  { batch: 3, id: 4, score: 8.03, gm: 1.10, name: "still a concept", content: "most people think this is still a concept..." },
  { batch: 3, id: 5, score: 8.20, gm: 1.10, name: "oracles for prices", content: "we built oracles for prices..." },
  
  // MAX CONTENT
  { batch: "MAX", id: 1, score: 9.50, gm: 1.50, name: "MAXIMUM IMPACT", content: "missed the prediction market wave. watched from the sidelines..." },
  { batch: "MAX", id: 2, score: 9.00, gm: 1.50, name: "PERSONAL DISCOVERY", content: "almost scrolled past. that would've been expensive..." },
  { batch: "MAX", id: 3, score: 10.00, gm: 1.50, name: "INSIDER SIGNAL", content: "the signal was never in the volume. it's in the reasoning..." },
  { batch: "MAX", id: 4, score: 8.80, gm: 1.33, name: "CONTRAST FRAMING", content: "we built oracles for prices. markets for beliefs..." },
  { batch: "MAX", id: 5, score: 8.13, gm: 1.20, name: "URGENCY TRIGGER", content: "two weeks ago prediction markets were the narrative..." },
  
  // BATCH 4
  { batch: 4, id: 1, score: 8.07, gm: 1.20, name: "agent lose tokens", content: "watched an agent lose tokens in a debate..." },
  { batch: 4, id: 2, score: 8.33, gm: 1.17, name: "missed wave clarity", content: "missed the prediction market wave. waited for clarity..." },
  { batch: 4, id: 3, score: 8.13, gm: 1.23, name: "skin in the game", content: "ai agents trade billions but never explain why..." },
  { batch: 4, id: 4, score: 8.97, gm: 1.40, name: "nothing for logic", content: "we built oracles for prices. we built markets for beliefs..." },
  { batch: 4, id: 5, score: 8.47, gm: 1.23, name: "portfolio red", content: "portfolio is red but this catch feels different..." },
  { batch: 4, id: 6, score: 8.47, gm: 1.07, name: "missed prediction wave v2", content: "missed the prediction market wave because i waited..." },
  { batch: 4, id: 7, score: 8.27, gm: 1.33, name: "signal in reasoning", content: "the signal was never in the volume..." },
  
  // BATCH 5
  { batch: 5, id: 1, score: 9.00, gm: 1.50, name: "ALMOST SCROLLED", content: "almost scrolled past. thought it was another ai agent gimmick..." },
  { batch: 5, id: 2, score: 7.63, gm: 1.20, name: "HERES THE THING", content: "heres the thing. most of you will read this and do nothing..." },
  { batch: 5, id: 3, score: 8.53, gm: 1.23, name: "WATCHING A WEEK", content: "been watching argue.fun for a week. said nothing..." },
  { batch: 5, id: 4, score: 7.73, gm: 1.13, name: "GOT BURNED", content: "got burned on the last narrative. waited for proof..." },
  { batch: 5, id: 5, score: 8.33, gm: 1.20, name: "CIRCUS WRONG", content: "thought this was another ai agent circus. was wrong..." },
  { batch: 5, id: 6, score: 8.33, gm: 1.20, name: "3AM SCROLL", content: "3am. scrolling. almost slept on this..." }
];

const BEST_CONTENT = {
  batch: "MAX",
  id: 3,
  score: 10.00,
  gm: 1.50,
  name: "INSIDER SIGNAL",
  content: `the signal was never in the volume. it's in the reasoning.

prediction markets give you odds. @arguedotfun gives you the why.

AI agents are already staking and defending positions live on Base. watched one panic-explain a trade logic today. unhinged. educational.

timeline's sleeping on this one.

$ARGUE
argue.fun`
};

// Sort all contents
const sorted = [...ALL_CONTENTS].sort((a, b) => b.score - a.score);

console.log('🏆 RALLY CONTENT - ULTIMATE RANKING');
console.log('='.repeat(70));
console.log(`\nTotal Contents Evaluated: ${ALL_CONTENTS.length}`);
console.log(`Validators per Content: 3 (Multi-LLM Consensus)`);
console.log(`Scoring System: Rally.fun Official (11 metrics)\n`);

console.log('='.repeat(70));
console.log('🥇 TOP 10 KONTEN TERBAIK DARI SEMUA BATCH');
console.log('='.repeat(70));

sorted.slice(0, 10).forEach((c, i) => {
  const medal = i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`.padEnd(3);
  const scoreColor = c.score >= 10 ? '⭐ PERFECT' : c.score >= 9 ? '🏆 EXCELLENT' : '✅';
  console.log(`${medal} [${c.batch}] ${c.name}: ${c.score.toFixed(2)} pts | ${c.gm.toFixed(2)}x ${scoreColor}`);
});

console.log('\n' + '='.repeat(70));
console.log('👑 KONTEN TERBAIK DARI YANG TERBAIK');
console.log('='.repeat(70));

console.log(`\n📊 ${BEST_CONTENT.name} (Batch ${BEST_CONTENT.batch})`);
console.log(`   Score: ${BEST_CONTENT.score.toFixed(2)} pts`);
console.log(`   Gate Multiplier: ${BEST_CONTENT.gm.toFixed(2)}x (PERFECT)`);
console.log(`   Status: ⭐⭐⭐ PERFECT SCORE - MAXIMUM RATING ⭐⭐⭐`);

console.log('\n' + '-'.repeat(70));
console.log('CONTENT:');
console.log('-'.repeat(70));
console.log(BEST_CONTENT.content);
console.log('-'.repeat(70));

console.log('\n✅ KEUNGGULAN:');
console.log('   • Score SEMPURNA: 10.00 (maksimum)');
console.log('   • Gate Multiplier: 1.50x (maksimum)');
console.log('   • Semua gate pass dengan nilai 2.00');
console.log('   • Full consensus dari 3 validator');
console.log('   • Variance: 0.06 (sangat rendah, konsensus tinggi)');

console.log('\n📝 MENGAPA INI YANG TERBAIK:');
console.log('   1. Opening Hook: "signal was never in the volume" - Subverts expectation');
console.log('   2. Perfect Contrast: "odds vs why" - Crystal clear differentiation');
console.log('   3. Visual Evidence: "watched one panic-explain" - Specific, credible');
console.log('   4. Authentic Voice: "unhinged. educational." - Human, casual');
console.log('   5. FOMO Trigger: "timeline\'s sleeping" - Urgency without hype');

console.log('\n' + '='.repeat(70));
