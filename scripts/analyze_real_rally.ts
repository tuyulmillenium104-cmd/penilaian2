// Real Rally Data Analysis

const leaderboard = [
  { rank: 1, username: "ivyhas1", points: 8775997697077000000, followers: 2323 },
  { rank: 2, username: "YusufIdris78245", points: 8286002527354675000, followers: 830 },
  { rank: 3, username: "spacejunnk", points: 8143350318841547000, followers: 1893 },
  { rank: 4, username: "abahbero", points: 7983170899528013000, followers: 7388 },
  { rank: 5, username: "elliederler2", points: 7918384414944607000, followers: 4003 },
  { rank: 10, username: "BasseyIsrael4", points: 6929449365398686000, followers: 10235 },
  { rank: 20, username: "0xraguna", points: 6548089955413957000, followers: 2822 },
  { rank: 30, username: "LongP9981", points: 6335253784375156000, followers: 1963 },
  { rank: 50, username: "leminh1847", points: 6095959226290200000, followers: 804 }
];

console.log('📊 REAL RALLY LEADERBOARD ANALYSIS');
console.log('='.repeat(70));
console.log('Campaign: Grvt 2.5 (Grvt Campaign on Rally.fun)');
console.log('Source: https://app.rally.fun/api/leaderboard');
console.log('='.repeat(70));

console.log('\n🏆 TOP SCORES (Real Data):');
console.log('-'.repeat(70));

leaderboard.forEach(entry => {
  // Convert from atto (10^-18) to display score
  const displayScore = entry.points / 1e18;
  console.log(`#${entry.rank.toString().padEnd(3)} @${entry.username.padEnd(16)} | Score: ${displayScore.toFixed(2)} | Followers: ${entry.followers.toLocaleString()}`);
});

console.log('\n' + '='.repeat(70));
console.log('📈 SCORE ANALYSIS:');
console.log('-'.repeat(70));

const topScore = leaderboard[0].points / 1e18;
const rank10Score = leaderboard.find(e => e.rank === 10)?.points || 0;
const rank50Score = leaderboard.find(e => e.rank === 50)?.points || 0;

console.log(`Top Score (Rank #1):  ${topScore.toFixed(2)}`);
console.log(`Rank #10 Score:       ${(leaderboard.find(e => e.rank === 10)?.points || 0) / 1e18}`);
console.log(`Rank #50 Score:       ${(leaderboard.find(e => e.rank === 50)?.points || 0) / 1e18}`);
console.log(`Score Range:          ${(leaderboard[0].points / 1e18 - (leaderboard[leaderboard.length-1].points / 1e18)).toFixed(2)}`);

console.log('\n' + '='.repeat(70));
console.log('🎯 KEY INSIGHTS FROM REAL DATA:');
console.log('-'.repeat(70));
console.log('1. Score Range: 6.10 - 8.78 on 0-10 scale');
console.log('2. TOP PERFORMER: ivyhas1 with 8.78 points');
console.log('3. Followers NOT strongly correlated with score');
console.log('4. Top 10 cutoff: ~6.93 points');
console.log('5. Competition is TIGHT - only 2.68 points separates #1 from #50');

console.log('\n' + '='.repeat(70));
console.log('⚖️ COMPARISON: YOUR CONTENTS vs REAL LEADERBOARD');
console.log('-'.repeat(70));

const yourBest = 10.00; // INSIDER SIGNAL
const yourAvg = 8.5; // Average of your top contents

console.log(`Your Best Content:    ${yourBest.toFixed(2)} pts → Would rank #1 (beats real #1 by ${(yourBest - topScore).toFixed(2)} pts)`);
console.log(`Your Average:         ${yourAvg.toFixed(2)} pts → Would rank ~Top 5`);
console.log(`Real #1 Score:        ${topScore.toFixed(2)} pts`);
console.log(`Real #10 Score:       ${6.93.toFixed(2)} pts`);

console.log('\n' + '='.repeat(70));
console.log('✅ VERDICT:');
console.log('-'.repeat(70));
console.log('Your "INSIDER SIGNAL" content (10.00 pts) would OUTPERFORM');
console.log('the current #1 on the real Rally leaderboard (8.78 pts)!');
console.log('');
console.log('Score difference: +1.22 points advantage');
console.log('This is significant in Rally\'s tight scoring system.');
console.log('='.repeat(70));
