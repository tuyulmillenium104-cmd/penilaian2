import { NextRequest, NextResponse } from 'next/server';

// Rally Knowledge Base
const RALLY_KNOWLEDGE = `
## RALLY SCORING SYSTEM - COMPLETE GUIDE

### OVERVIEW
Rally.fun uses a two-part scoring system:
- Atemporal Score (Quality): 0.27 - 2.70 points
- Temporal Score (Engagement): 2.9 - 4.2 points
- Total Score: ~3.17 - 6.9 points

### GATE SCORES (0-2 each) - MUST PASS ALL
1. Content Alignment (0-2): Is content relevant to campaign mission?
2. Information Accuracy (0-2): Is information factual and correct?
3. Campaign Compliance (0-2): Does it follow ALL rules (mentions, hashtags, links)?
4. Originality (0-2): Is it authentic, not generic AI-generated content?

**CRITICAL**: If ANY gate = 0, score is reduced by 50%!

### QUALITY SCORES (0-5 each)
5. Engagement Potential (0-5): Compelling hook, value proposition
6. Technical Quality (0-5): Writing clarity and structure
7. Reply Quality (0-5): Promotes valuable discussion

### TEMPORAL SCORE (Engagement-Based)
Formula: Base + log10(metrics) x coefficients
- Followers of Repliers: MAIN DRIVER (35% weight)
- Replies: 25% weight
- Likes: 15% weight
- Retweets: 15% weight
- Impressions: 10% weight
`;

// Local chat response generator
function generateLocalResponse(message: string, campaignContext?: any): string {
  const lowerMessage = message.toLowerCase();
  
  // Score-related questions
  if (lowerMessage.includes('score') && (lowerMessage.includes('high') || lowerMessage.includes('max') || lowerMessage.includes('improve') || lowerMessage.includes('boost'))) {
    return `## Tips for High Rally Scores

**To maximize your score on Rally:**

1. **Focus on Followers of Repliers (MAIN DRIVER - 35%)**
   - Tag accounts with large followings
   - Create content influencers want to reply to
   - This is the #1 factor for temporal score!

2. **Get More Replies (25% weight)**
   - Ask genuine questions at the end
   - Share controversial takes (politely)
   - Create threads with cliffhangers

3. **Pass ALL Gate Scores**
   - Content must align with campaign
   - Include required hashtags/mentions
   - Avoid AI-sounding patterns
   - Add personal experience

4. **Strong Hook in First 3 Words**
   - "Hot take:", "NGL,", "Just realized:"
   - "Lost money on this:", "POV:"

5. **Retweets Matter (15%)**
   - News, announcements get shared
   - Hot takes spread
   - Educational threads get bookmarked

${campaignContext?.title ? `\n**For ${campaignContext.title}:**\nMake sure to check the campaign brief and follow all mission rules!` : ''}`;
  }
  
  if (lowerMessage.includes('formula') || (lowerMessage.includes('how') && lowerMessage.includes('calculate'))) {
    return `## Rally Scoring Formula

**Total Score = Atemporal + Temporal**

### Atemporal (Quality) - Max ~2.70
Lookup table based on:
- Engagement Potential (0-5)
- Technical Quality (0-5)
- Reply Quality (0-5)

### Temporal (Engagement) - Max ~4.2
Base 2.9 + log10(metrics) × weights:
- Followers of Repliers: 0.41 (HIGHEST!)
- Replies: 0.22
- Likes: 0.18
- Retweets: 0.15
- Impressions: 0.025

**Key insight:** Getting replies from high-follower accounts is the fastest way to boost your score!`;
  }
  
  if (lowerMessage.includes('gate')) {
    return `## Gate Scores Explained

**Gates are PASS/FAIL criteria (0-2 each):**

1. **Content Alignment** - Is your content relevant to the campaign?
   - 2: Perfectly aligned with mission
   - 1: Partially relevant
   - 0: Off-topic (50% penalty!)

2. **Information Accuracy** - Is it factual?
   - 2: All facts correct
   - 1: Minor issues
   - 0: False claims (50% penalty!)

3. **Campaign Compliance** - Did you follow ALL rules?
   - 2: All requirements met
   - 1: Missing minor elements
   - 0: Missing critical elements (50% penalty!)

4. **Originality** - Is it authentic?
   - 2: Personal voice, unique perspective
   - 1: Standard format
   - 0: AI-generated patterns (50% penalty!)

**CRITICAL: If ANY gate = 0, your total score is cut in HALF!**`;
  }
  
  if (lowerMessage.includes('ai') || lowerMessage.includes('detect') || lowerMessage.includes('pattern')) {
    return `## AI Detection Patterns to AVOID

Rally can detect AI-generated content. Avoid these:

**Forbidden Phrases:**
- "In the world of..."
- "Game changer", "Revolutionary"
- "Unlock the potential"
- "Seamless experience"
- "Furthermore", "Moreover"
- "In conclusion"

**Forbidden Punctuation:**
- Em dashes (—) - use regular hyphens (-)
- Smart quotes ("") - use straight quotes ("")

**What Works (Human Voice):**
- Contractions: don't, can't, won't
- Casual language: tbh, ngl, imo
- Personal stories: "I learned...", "My experience..."
- Start mid-thought, not formal intro
- Sentence fragments for emphasis`;
  }
  
  if (lowerMessage.includes('follower') || lowerMessage.includes('replier')) {
    return `## Followers of Repliers - THE KEY TO HIGH SCORES

**This is the #1 driver of Rally temporal scores (35% weight)!**

**What it means:**
- When someone with 100K followers replies to your tweet
- You get more points than 100 replies from 1-follower accounts

**How to get high-follower replies:**
1. Tag relevant influencers naturally
2. Create content they'd want to engage with
3. Reply to their tweets first (build relationship)
4. Share unique insights they'd find valuable
5. Be controversial (but not offensive)

**Example:**
- 1 reply from 50K follower account = ~1.7 temporal points
- 10 replies from 100-follower accounts = ~0.4 temporal points

**The math:** log10(50000) × 0.41 = 1.72 extra points!`;
  }
  
  if (lowerMessage.includes('hook') || lowerMessage.includes('opening') || lowerMessage.includes('start')) {
    return `## Strong Hooks for Rally Content

**First 3 words determine if people read further:**

**Personal Hooks:**
- "Lost $X on this..."
- "Just realized..."
- "Been testing..."
- "My experience with..."

**Contrarian Hooks:**
- "Hot take: everyone's wrong about..."
- "Unpopular opinion:"
- "NGL, I was skeptical..."

**Insight Hooks:**
- "POV: You finally understand..."
- "What no one tells you about..."
- "The real reason..."

**News Hooks:**
- "Breaking:"
- "Just in:"
- "Finally happened:"

**Avoid:**
- "In this thread..."
- "Here's why..."
- "Let me explain..." (too AI-sounding)`;
  }
  
  // Default response
  return `## Rally AI Assistant

I can help you with:

- **Scoring**: How Rally calculates scores
- **Optimization**: Tips to improve your content  
- **Gates**: Understanding pass/fail criteria
- **Hooks**: Writing attention-grabbing openings
- **AI Detection**: How to avoid being flagged
- **Followers of Repliers**: The #1 scoring factor
- **Campaigns**: Specific advice for your selected campaign

${campaignContext?.title ? `**Current Campaign:** ${campaignContext.title}\n\nI can give tailored advice for this campaign!` : '**Tip:** Select a campaign to get personalized advice!'}

What would you like to know?`;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, campaignContext } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // Use local response generator - no external API needed
    const response = generateLocalResponse(message, campaignContext);

    return NextResponse.json({
      success: true,
      response,
      method: 'local-responder-v1'
    });

  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Chat failed' 
    }, { status: 500 });
  }
}
