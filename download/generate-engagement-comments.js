/**
 * Generate 17 High-Quality Engagement Comments & Replies
 * For Rally.fun "Share, Refer, Earn Forever" content
 */

import ZAI from 'z-ai-web-dev-sdk';

const WINNING_CONTENT = `Most referral programs in crypto are designed to dump on you. This one is mathematically impossible to rug.

I assumed it was a trap. My stomach turned just looking at the "earn forever" headline. We've all been burned by empty promises and magic money trees.

But Rally is different. It's not token speculation; it's AI-verified attribution on GenLayer. You earn 10% of Campaign Points from creators you refer, based on their actual work.

The data backs this "forever" model. Look at Branch Basics or the six-figure earners in Forever2Drive. When the system relies on real value, it works.

I'm seeing the points stack up on-chain right now. No gatekeepers, just verified rewards.

Finally found a loop that isn't a grift: https://app.rally.fun/campaign/0xb98FEb296B811443aB9f845aD22105b8F8Cc1D7e

Curious if anyone else has actually checked the contracts on this?`;

async function generateEngagementComments() {
  const zai = await ZAI.create();
  
  const prompt = `You are an expert social media engagement specialist. Generate 17 HIGH-QUALITY comments and replies for this Twitter/X post about Rally.fun's referral program.

IMPORTANT RULES:
1. Comments must feel AUTHENTIC and HUMAN - no AI-sounding phrases
2. Mix of reactions: curious questions, shared experiences, skepticism, excitement, technical questions
3. Include reply suggestions for each comment (how the author should respond)
4. Vary lengths - some short, some longer
5. Use natural Twitter/X language (contractions, casual tone, some lowercase)
6. AVOID: "Great post!", "Interesting!", "Thanks for sharing!", emoji spam
7. Make them feel like REAL crypto Twitter users

THE POST:
"""
${WINNING_CONTENT}
"""

Generate 17 engagement comments in this JSON format:
{
  "comments": [
    {
      "id": 1,
      "type": "question|skepticism|experience|excitement|technical",
      "comment": "the actual comment text",
      "reply": "suggested reply from the author"
    }
  ]
}

Make sure comments cover different angles:
- Questions about the 10% earnings
- Skepticism about "forever" claims
- Technical questions about GenLayer
- Shared experiences with other referral programs
- Excitement about the opportunity
- Questions about on-chain verification
- Comparisons to other platforms

Return ONLY valid JSON, no additional text.`;

  console.log('🚀 Generating 17 engagement comments...\n');
  
  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: 'You are a social media expert who creates authentic, human-like engagement content. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    thinking: { type: 'disabled' }
  });

  const response = completion.choices[0]?.message?.content;
  
  // Parse JSON
  let data;
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      data = JSON.parse(jsonMatch[0]);
    } else {
      data = JSON.parse(response);
    }
  } catch (e) {
    console.error('Failed to parse JSON:', e.message);
    console.log('Raw response:', response);
    return;
  }

  // Display results
  console.log('═'.repeat(70));
  console.log('📝 17 ENGAGEMENT COMMENTS & REPLIES');
  console.log('═'.repeat(70));
  
  data.comments.forEach((item, index) => {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`💬 COMMENT #${item.id} [${item.type.toUpperCase()}]`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`\n"${item.comment}"`);
    console.log(`\n↪️  SUGGESTED REPLY:`);
    console.log(`"${item.reply}"`);
  });

  console.log(`\n${'═'.repeat(70)}`);
  console.log('✅ Total Comments Generated: ' + data.comments.length);
  console.log('═'.repeat(70));

  // Save to file
  const outputPath = '/home/z/my-project/download/engagement-comments.json';
  const fs = await import('fs');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n💾 Saved to: ${outputPath}`);

  return data;
}

generateEngagementComments().catch(console.error);
