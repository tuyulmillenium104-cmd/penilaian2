import { NextRequest, NextResponse } from 'next/server';

// Rally Knowledge Base
const RALLY_KNOWLEDGE = `
## RALLY SCORING SYSTEM - COMPLETE GUIDE

### OVERVIEW
Rally.fun uses a two-part scoring system:
- Atemporal Score (Quality): 0.27 - 2.70 points
- Temporal Score (Engagement): 2.9 - 4.2 points
- Total Score: ~3.17 - 6.9 points

### ATEMPORAL SCORE (Quality-Based)
This is a LOOKUP TABLE based on Engagement Potential (0-5) + Technical Quality (0-5):

| Engagement | Technical | Atemporal |
|------------|-----------|-----------|
| 5          | 5         | 2.70 (MAX)|
| 4          | 5         | 2.43      |
| 4          | 4         | 2.16      |
| 3          | 5         | 2.16      |
| 3          | 4         | 1.89      |
| 3          | 3         | 1.62      |

**IMPORTANT**: Reply Quality does NOT affect Atemporal score directly!

### TEMPORAL SCORE (Engagement-Based)
Formula: 2.9 + log10(metrics) x coefficients
- Base: 2.9
- Likes: +0.08 per log10(likes+1)
- Replies: +0.12 per log10(replies+1)
- Retweets: +0.15 per log10(retweets+1)
- Impressions: +0.015 per log10(impressions+1)
- Followers of Repliers: +0.008 per log10(followers+1)
- Max: 4.2

**KEY INSIGHT**: Retweets have the highest weight (0.15). Create shareable content!

### GATE SCORES (0-2 each) - MUST PASS ALL
1. Content Alignment (0-2): Is content relevant to campaign mission?
2. Information Accuracy (0-2): Is information factual and correct?
3. Campaign Compliance (0-2): Does it follow ALL rules (mentions, hashtags, links)?
4. Originality (0-2): Is it authentic, not generic AI-generated content?

**CRITICAL**: If ANY gate = 0, score is reduced by 80%!

### QUALITY SCORES (0-5 each)
5. Engagement Potential (0-5): Compelling hook, value proposition
6. Technical Quality (0-5): Writing clarity and structure
7. Reply Quality (0-5): Promotes valuable discussion
`;

function generateFallbackResponse(message: string, context: any): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('score') && (lowerMessage.includes('high') || lowerMessage.includes('max') || lowerMessage.includes('improve'))) {
    return `## Tips for High Rally Scores

**To maximize your score on Rally:**

1. **Focus on Engagement + Technical Quality**
   - These determine your Atemporal score (up to 2.70)
   - Aim for 5/5 on both for maximum points

2. **Create Shareable Content**
   - Retweets have the highest weight (0.15) for Temporal score
   - News, hot takes, and threads get more retweets

3. **Strong Hooks**
   - Start with: "Breaking:", "Hot take:", "Thread"
   - Capture attention in the first 3 seconds

4. **Include CTA**
   - End with: "Thoughts?", "What's your take?", "Agree or disagree?"
   - This boosts Reply Quality

5. **Avoid AI Patterns**
   - No: "Furthermore", "In conclusion", "Moreover"
   - These reduce Originality score

${context?.title ? `\n**For ${context.title}:**\nMake sure to check the campaign brief and follow all mission rules!` : ''}`;
  }
  
  if (lowerMessage.includes('formula') || (lowerMessage.includes('how') && lowerMessage.includes('calculate'))) {
    return `## Rally Scoring Formula

**Total Score = Atemporal + Temporal**

### Atemporal (Quality)
Lookup table based on:
- Engagement Potential (0-5)
- Technical Quality (0-5)

Top scores: 5+5 = 2.70, 4+5 = 2.43, 4+4 = 2.16

### Temporal (Engagement)
Base: 2.9 + log10(metrics) x coefficients
- Likes: 0.08
- Replies: 0.12
- Retweets: 0.15 (highest!)
- Impressions: 0.015
- Followers: 0.008
Max: 4.2

**Key insight:** Retweets matter most!`;
  }
  
  if (lowerMessage.includes('gate')) {
    return `## Gate Scores Explained

**Gates are PASS/FAIL criteria (0-2 each):**

1. **Content Alignment** - Is your content relevant to the campaign?
2. **Information Accuracy** - Is it factual?
3. **Campaign Compliance** - Did you follow ALL rules?
4. **Originality** - Is it authentic (not generic AI)?

CRITICAL: If ANY gate = 0, your score drops by 80%!

**How to pass all gates:**
- Read the campaign brief carefully
- Include required mentions and hashtags
- Add your personal opinion/experience
- Verify facts before posting`;
  }
  
  return `## Rally AI Assistant

I can help you with:

- **Scoring**: How Rally calculates scores
- **Optimization**: Tips to improve your content
- **Gates**: Understanding pass/fail criteria
- **Hooks**: Writing attention-grabbing openings
- **Campaigns**: Specific advice for your selected campaign

${context?.title ? `**Current Campaign:** ${context.title}\n\nI can give tailored advice for this campaign!` : '**Tip:** Select a campaign to get personalized advice!'}

What would you like to know?`;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, campaignContext } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // Build context string
    let contextString = '';
    if (campaignContext) {
      contextString = `
CURRENT CAMPAIGN CONTEXT:
- Campaign: ${campaignContext.title || 'Unknown'}
- Organization: ${campaignContext.organizationName || 'Unknown'}
- Brief: ${campaignContext.brief || 'No brief available'}
${campaignContext.knowledgeBase ? `- Knowledge Base: ${campaignContext.knowledgeBase.substring(0, 500)}...` : ''}
${campaignContext.missionTitle ? `- Mission: ${campaignContext.missionTitle}` : ''}
${campaignContext.missionRules ? `- Rules: ${campaignContext.missionRules}` : ''}
`;
    }

    // Try AI chat
    try {
      const ZAI = await import('z-ai-web-dev-sdk').then(m => m.default);
      const zai = await ZAI.create();
      
      const systemPrompt = `You are Rally.fun's expert AI assistant. You have deep knowledge of the Rally scoring system and help users optimize their content for maximum scores.

${RALLY_KNOWLEDGE}

${contextString}

YOUR ROLE:
1. Answer questions about Rally scoring, optimization, and campaigns
2. Provide specific, actionable advice
3. Help users understand why certain content scores better
4. Give examples when helpful
5. Be friendly but professional
6. If campaign context is available, tailor advice to that specific campaign

GUIDELINES:
- Be concise but thorough
- Use bullet points for lists
- Include specific numbers/examples when relevant
- Reference the scoring formula when explaining why
- Suggest concrete improvements users can make`;

      const messages: Array<{role: 'assistant' | 'user'; content: string}> = [
        { role: 'assistant', content: systemPrompt }
      ];
      
      if (history && Array.isArray(history)) {
        history.forEach((msg: {role: string; content: string}) => {
          messages.push({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          });
        });
      }
      
      messages.push({ role: 'user', content: message });

      const completion = await zai.chat.completions.create({
        messages,
        thinking: { type: 'disabled' }
      });

      const response = completion.choices[0]?.message?.content || '';

      return NextResponse.json({
        success: true,
        response,
        method: 'ai'
      });

    } catch (aiError) {
      console.log('[Chat API] AI failed, using fallback');
      
      const response = generateFallbackResponse(message, campaignContext);

      return NextResponse.json({
        success: true,
        response,
        method: 'fallback'
      });
    }

  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Chat failed' 
    }, { status: 500 });
  }
}
