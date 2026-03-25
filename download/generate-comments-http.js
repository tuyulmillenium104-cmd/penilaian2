/**
 * Generate 17 High-Quality Engagement Comments & Replies
 * Using HTTP Direct (same method as workflow)
 */

const http = require('http');

const TOKENS = [
  { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTc2MzEyNjMtNWRiYS00ZTE2LWIxMjctMTkyMTJlMDEyYTliIiwiY2hhdF9pZCI6ImNoYXQtNTQ5ZmI5MTEtZWM0NS00NGJiLTg5YjEtMWY2MTljNTEzN2QzIn0.M6IQTOXasSbEw98a4R6p3LEPwJPCWyRZiJSUo8lr2PM', userId: '97631263-5dba-4e16-b127-19212e012a9b', chatId: 'chat-549fb911-ec45-44bb-89b1-1f619c5137d3' },
];

const GATEWAY_HOST = '172.25.136.210';
const GATEWAY_PORT = 8080;

const WINNING_CONTENT = `Most referral programs in crypto are designed to dump on you. This one is mathematically impossible to rug.

I assumed it was a trap. My stomach turned just looking at the "earn forever" headline. We've all been burned by empty promises and magic money trees.

But Rally is different. It's not token speculation; it's AI-verified attribution on GenLayer. You earn 10% of Campaign Points from creators you refer, based on their actual work.

The data backs this "forever" model. Look at Branch Basics or the six-figure earners in Forever2Drive. When the system relies on real value, it works.

I'm seeing the points stack up on-chain right now. No gatekeepers, just verified rewards.

Finally found a loop that isn't a grift: https://app.rally.fun/campaign/0xb98FEb296B811443aB9f845aD22105b8F8Cc1D7e

Curious if anyone else has actually checked the contracts on this?`;

async function callLLM(messages) {
  return new Promise((resolve, reject) => {
    const tokenData = TOKENS[0];
    
    const body = JSON.stringify({
      model: 'glm-4-flash',
      messages: messages,
      max_tokens: 4000,
      temperature: 0.8
    });
    
    const options = {
      hostname: GATEWAY_HOST,
      port: GATEWAY_PORT,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Z-AI-From': 'Z',
        'X-Token': tokenData.token,
        'X-User-Id': tokenData.userId,
        'X-Chat-Id': tokenData.chatId
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            const msg = json.choices?.[0]?.message || {};
            resolve({ content: msg.content || '' });
          } catch (e) {
            reject(new Error('Parse error: ' + data.substring(0, 200)));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🚀 Generating 17 engagement comments...\n');
  
  const systemPrompt = `You are a social media engagement expert. Generate authentic, human-like Twitter/X comments that drive engagement. 

RULES:
1. Comments must feel REAL - no AI phrases like "Great post!", "Interesting!"
2. Use natural Twitter language: contractions, some lowercase, casual tone
3. Mix reaction types: curiosity, skepticism, excitement, technical questions, shared experiences
4. Include reply suggestions for each comment
5. Make them feel like real crypto Twitter users`;

  const userPrompt = `Generate 17 high-quality engagement comments for this Twitter post about Rally.fun's referral program:

"""
${WINNING_CONTENT}
"""

Return JSON in this EXACT format:
{
  "comments": [
    {
      "id": 1,
      "type": "question|skepticism|experience|excitement|technical|support",
      "comment": "the comment text",
      "reply": "suggested reply from author"
    }
  ]
}

Mix these types across the 17 comments:
- 4 questions about earnings/mechanics
- 3 skepticism about "forever" claims  
- 3 shared experiences with other programs
- 3 excitement/interest
- 2 technical questions about contracts/GenLayer
- 2 supportive/already tried it

Return ONLY valid JSON.`;

  try {
    const response = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
    
    const content = response.content;
    
    // Parse JSON
    let data;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Parse error:', e.message);
      console.log('Raw response:', content.substring(0, 500));
      return;
    }

    // Display
    console.log('═'.repeat(70));
    console.log('📝 17 ENGAGEMENT COMMENTS & REPLIES FOR RALLY POST');
    console.log('═'.repeat(70));
    
    data.comments?.forEach((item) => {
      console.log(`\n${'─'.repeat(70)}`);
      console.log(`💬 COMMENT #${item.id} [${item.type?.toUpperCase() || 'UNKNOWN'}]`);
      console.log(`${'─'.repeat(70)}`);
      console.log(`\n"${item.comment}"`);
      console.log(`\n↪️  YOUR REPLY:`);
      console.log(`"${item.reply}"`);
    });

    console.log(`\n${'═'.repeat(70)}`);
    console.log(`✅ Total: ${data.comments?.length || 0} comments`);
    console.log('═'.repeat(70));

    // Save
    const fs = require('fs');
    const outputPath = '/home/z/my-project/download/engagement-comments.json';
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
