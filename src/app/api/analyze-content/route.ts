import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Rally-style AI content analysis - Updated with real Rally scoring data
async function analyzeWithLLM(
  content: string, 
  campaignContext?: string,
  engagement?: {
    likes: number;
    replies: number;
    retweets: number;
    impressions: number;
    followersOfRepliers: number;
  }
) {
  try {
    const zai = await ZAI.create();

    const systemPrompt = `You are Rally.fun's AI content scoring system. Analyze social media content EXACTLY like Rally's multi-LLM validator.

## RALLY SCORING SYSTEM (Based on Real Submissions)

### GATE SCORES (0-2 each) - Must pass ALL to qualify

**1. Content Alignment (0-2)**
Score 2: PERFECTLY ALIGNED
- Message matches campaign's core message
- Key terms used correctly
- Value propositions integrated strongly
- Brand voice consistent
- Target audience aligned
- All mission requirements met

Score 1: PARTIALLY ALIGNED
- Mentions project but some misalignment
- Some required elements missing
- Target audience somewhat off

Score 0: OFF-TOPIC
- Content has nothing to do with campaign
- Completely irrelevant to project

**2. Information Accuracy (0-2)**
Score 2: ACCURATE
- All information correct vs campaign knowledge base
- Technical details verified
- No misleading claims
- Data/statistics are correct

Score 1: MIXED
- Mostly accurate but contains minor errors
- Some unverified claims
- Slight terminology issues
- EXAMPLE ERROR: Saying "deposits $250" when docs say "trades $250"

Score 0: FALSE
- Contains verifiable false claims
- Major misinformation

**3. Campaign Compliance (0-2)**
Score 2: FULLY COMPLIANT
- ALL required elements present:
  * Correct hashtag/tag
  * Original screenshot
  * All required mentions
  * Referral link included
  * All campaign-specific requirements met
  
Score 1: PARTIAL
- Has most requirements but missing minor elements
- Minor wording deviations

Score 0: NON-COMPLIANT
- Missing required elements
- Violates disallowed content rules

**4. Originality & Authenticity (0-2)**
Score 2: ORIGINAL
- Unique perspective, personal insight
- Authentic voice, not templated
- Creative expression beyond standard formats
- Avoids AI-generated patterns

Score 1: DERIVATIVE
- Some original thought but follows common patterns
- Uses common crypto influencer formats (e.g., caps lock headers)
- Structured but not innovative

Score 0: PLAGIARIZED/SPAM
- Copy-paste, bot behavior
- Generic AI-generated patterns
- No personal voice

### QUALITY SCORES (0-5 each)

**5. Engagement Potential (0-5)**
Evaluate:
- Hook Effectiveness (strong opening line?)
- Call-to-Action Quality (clear next steps?)
- Content Structure (scannable, organized?)
- Conversation Potential (invites discussion?)
- Value Delivery (useful information?)

Score 5: Exceptional - All elements excellent
Score 4: Strong - Most elements strong
Score 3: Good - Adequate engagement elements
Score 2: Fair - Limited engagement hooks
Score 1: Weak - Minimal engagement potential
Score 0: None - No engagement value

**6. Technical Quality (0-5)**
Evaluate:
- Language Mechanics (grammar, spelling)
- Structure & Formatting (readable, organized)
- Platform Optimization (appropriate length, formatting)
- Media Integration (images, links work properly)

Score 5: Perfect - No technical issues
Score 4: Excellent - Minor improvements possible
Score 3: Good - Adequate quality
Score 2: Fair - Some technical issues
Score 1: Poor - Multiple issues
Score 0: Unacceptable

**7. Reply Quality (0-5)**
Evaluate: Quality of replies this content will attract
- Relevance to topic
- Substantive engagement
- Authentic user questions
- Constructive discussion

Score 5: Excellent - Will attract high-quality replies
Score 4: Good - Will attract meaningful replies
Score 3: Average - Standard replies expected
Score 2: Below Average - Low-quality replies likely
Score 1: Poor - Spam/generic replies likely
Score 0: None - No replies expected

## IMPORTANT DISALLOWED CONTENT CHECK:
Check if content contains:
- Overused phrases: "game changer", "next level"
- Rewriting campaign description verbatim
- Explaining project in generic terms
- Full system end-to-end explanation
- Copy-pasted or AI-structured threads
- Missing required elements
- Spam or low effort

If disallowed content found, mark compliance as 0.

Return ONLY valid JSON:
{
  "gates": {
    "contentAlignment": { "score": <0-2>, "reason": "<detailed explanation>" },
    "informationAccuracy": { "score": <0-2>, "reason": "<detailed explanation>" },
    "campaignCompliance": { "score": <0-2>, "reason": "<detailed explanation>" },
    "originality": { "score": <0-2>, "reason": "<detailed explanation>" }
  },
  "quality": {
    "engagementPotential": { "score": <0-5>, "reason": "<analysis>" },
    "technicalQuality": { "score": <0-5>, "reason": "<analysis>" },
    "replyQuality": { "score": <0-5>, "reason": "<analysis>" }
  }
}`;

    const userPrompt = `Analyze this content for Rally.fun scoring:

## CAMPAIGN CONTEXT:
${campaignContext || 'No specific campaign context - evaluate as general social media content'}

## CONTENT TO ANALYZE:
"""
${content}
"""

${engagement ? `## CURRENT ENGAGEMENT METRICS:
- Likes: ${engagement.likes}
- Replies: ${engagement.replies}
- Retweets: ${engagement.retweets}
- Impressions: ${engagement.impressions}
- Followers of Repliers: ${engagement.followersOfRepliers}` : ''}

Provide your analysis as JSON only:`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content || '';
    
    let jsonStr = response;
    if (response.includes('```json')) {
      jsonStr = response.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || response;
    } else if (response.includes('```')) {
      jsonStr = response.match(/```\s*([\s\S]*?)\s*```/)?.[1] || response;
    }
    
    const parsed = JSON.parse(jsonStr.trim());
    
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, Number(val) || 0));
    
    return {
      success: true,
      analysis: {
        gates: {
          contentAlignment: { score: clamp(parsed.gates?.contentAlignment?.score ?? 1, 0, 2), reason: parsed.gates?.contentAlignment?.reason || 'Content alignment assessed.' },
          informationAccuracy: { score: clamp(parsed.gates?.informationAccuracy?.score ?? 1, 0, 2), reason: parsed.gates?.informationAccuracy?.reason || 'Information accuracy assessed.' },
          campaignCompliance: { score: clamp(parsed.gates?.campaignCompliance?.score ?? 1, 0, 2), reason: parsed.gates?.campaignCompliance?.reason || 'Campaign compliance assessed.' },
          originality: { score: clamp(parsed.gates?.originality?.score ?? 1, 0, 2), reason: parsed.gates?.originality?.reason || 'Originality assessed.' }
        },
        quality: {
          engagementPotential: { score: clamp(parsed.quality?.engagementPotential?.score ?? 3, 0, 5), reason: parsed.quality?.engagementPotential?.reason || 'Engagement potential assessed.' },
          technicalQuality: { score: clamp(parsed.quality?.technicalQuality?.score ?? 3, 0, 5), reason: parsed.quality?.technicalQuality?.reason || 'Technical quality assessed.' },
          replyQuality: { score: clamp(parsed.quality?.replyQuality?.score ?? 3, 0, 5), reason: parsed.quality?.replyQuality?.reason || 'Reply quality assessed.' }
        }
      },
      metadata: { analysisMethod: 'rally-llm-v2' }
    };
  } catch (error) {
    console.error('LLM analysis error:', error);
    return { success: false, error: String(error) };
  }
}

// Rule-based fallback with improved accuracy
function ruleBasedAnalysis(content: string, campaignContext?: string) {
  const text = content.toLowerCase();
  const words = content.split(/\s+/).length;
  
  // Check for required elements
  const hasHashtags = /#\w+/.test(content);
  const hasMentions = /@\w+/.test(content);
  const hasQuestions = /\?/.test(content);
  const hasNumbers = /\d+%|\d+\s*(percent|million|billion|thousand|k|m|usdt|usdc)/i.test(content);
  const hasLinks = /https?:\/\/[^\s]+/.test(content);
  const hasCTA = /check out|read more|learn more|don't miss|join|subscribe|follow|like|retweet|share|comment|what do you think|thoughts\?|try|deposit/i.test(content);
  const hasPersonalTouch = /i think|i believe|in my opinion|i've|i am|i'm|my|we're|we have|our|personally|experience|tested/i.test(content);
  const hasSpecificDetails = /\$?\d+[,.]?\d*\s*(usdt|usdc|eth|btc|sol|%)/i.test(content);
  
  // Check for disallowed patterns
  const hasOverusedPhrases = /game changer|next level|revolutionary|paradigm shift/i.test(content);
  const hasAIPatterns = /—|"In the world of|"Picture this|"In today's|━━━━|════/i.test(content);

  // Gate scores
  const contentAlignment = campaignContext ? (hasMentions || hasHashtags ? 2 : 1) : 2;
  const informationAccuracy = hasSpecificDetails && !hasOverusedPhrases ? 2 : (hasNumbers ? 1 : 1);
  const campaignCompliance = (hasHashtags || hasMentions) && hasLinks ? 2 : (hasMentions ? 1 : 0);
  const originality = hasAIPatterns ? 0 : (hasPersonalTouch && hasSpecificDetails && !hasOverusedPhrases ? 2 : 1);

  // Quality scores
  const engagementPotential = (hasCTA ? 2 : 0) + (hasQuestions ? 1 : 0) + (hasNumbers ? 1 : 0) + (words > 50 ? 1 : 0);
  const technicalQuality = Math.min(5, Math.floor(words / 30) + 2);
  const replyQuality = hasQuestions ? 4 : (hasCTA ? 3 : 2);

  return {
    gates: {
      contentAlignment: { 
        score: contentAlignment, 
        reason: contentAlignment === 2 ? 'Content aligns with campaign goals' : 'Partial alignment with campaign' 
      },
      informationAccuracy: { 
        score: informationAccuracy, 
        reason: informationAccuracy === 2 ? 'Contains specific verifiable details' : 'General information provided' 
      },
      campaignCompliance: { 
        score: campaignCompliance, 
        reason: campaignCompliance === 2 ? 'All required elements present' : 'Missing some required elements' 
      },
      originality: { 
        score: originality, 
        reason: originality === 2 ? 'Contains personal voice and unique perspective' : (originality === 0 ? 'Contains AI-generated or templated patterns' : 'Standard content format') 
      }
    },
    quality: {
      engagementPotential: { 
        score: Math.min(5, engagementPotential), 
        reason: hasCTA ? 'Has call-to-action' : 'Limited engagement hooks' 
      },
      technicalQuality: { 
        score: Math.min(5, technicalQuality), 
        reason: `${words} words, ${technicalQuality >= 4 ? 'good structure' : 'adequate structure'}` 
      },
      replyQuality: { 
        score: replyQuality, 
        reason: hasQuestions ? 'Asks questions, invites discussion' : 'Standard reply quality expected' 
      }
    },
    metadata: { analysisMethod: 'rule-based-v2' }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, campaignContext, engagement } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const llmResult = await analyzeWithLLM(content, campaignContext, engagement);
    
    if (llmResult.success && llmResult.analysis) {
      return NextResponse.json({ success: true, analysis: llmResult.analysis, metadata: llmResult.metadata });
    }

    console.log('LLM analysis failed, using rule-based fallback');
    const analysis = ruleBasedAnalysis(content, campaignContext);
    
    return NextResponse.json({ success: true, analysis, metadata: analysis.metadata });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: false, error: 'Failed to analyze content' }, { status: 500 });
  }
}
