import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Initialize ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Rule-based scoring as fallback
function ruleBasedScoring(content: string, campaignContext?: string) {
  const text = content.toLowerCase();
  const words = text.split(/\s+/).length;
  const hasHashtags = /#\w+/.test(content);
  const hasMentions = /@\w+/.test(content);
  const hasLinks = /https?:\/\/\S+/.test(content);
  const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
  const hasQuestions = /\?/.test(content);
  const hasExclamation = /!/.test(content);
  
  // Parse campaign context
  const contextLower = campaignContext?.toLowerCase() || '';
  const hasMission = contextLower.includes('mission:');
  const hasRules = contextLower.includes('rules:');
  const hasStyle = contextLower.includes('style:');
  const hasKnowledgeBase = contextLower.includes('knowledge base:');
  
  // Extract keywords from campaign context
  const getKeywords = (label: string) => {
    const match = contextLower.match(new RegExp(`${label}\\s*([^.]+)`));
    return match ? match[1].toLowerCase().split(/[,\s]+/).filter(w => w.length > 2) : [];
  };
  
  const missionKeywords = getKeywords('mission');
  const rulesKeywords = getKeywords('rules');
  const styleKeywords = getKeywords('style');
  const kbKeywords = getKeywords('knowledge base');
  
  // Check content against campaign keywords
  const keywordMatches = [...missionKeywords, ...kbKeywords].filter(kw => text.includes(kw)).length;
  const totalKeywords = [...missionKeywords, ...kbKeywords].length;
  
  // Check engagement hooks
  const hasCTA = /check out|read more|learn more|don't miss|join|subscribe|follow|like|retweet|share|comment|what do you think|thoughts\?|agree\?/i.test(content);
  
  // Originality indicators
  const hasPersonalTouch = /i think|i believe|in my opinion|i've|i am|i'm|my|we're|we have|our/i.test(content);
  const hasSpecificDetails = /\d+%|\d+\s*(percent|million|billion|thousand)|specific|exactly|precisely/i.test(content);
  
  // Gate Scores (0-2)
  
  // Content Alignment - based on keyword matching with campaign
  let contentAlignment: number;
  if (campaignContext && totalKeywords > 0) {
    const matchRatio = keywordMatches / totalKeywords;
    contentAlignment = matchRatio >= 0.5 ? 2 : matchRatio >= 0.2 ? 1 : 0;
  } else if (campaignContext) {
    // Has context but no keywords extracted - check general relevance
    contentAlignment = text.length > 50 ? 1 : 0;
  } else {
    // No context provided
    contentAlignment = 2; // Assume aligned when no context
  }
  
  const informationAccuracy = hasSpecificDetails ? 2 : (words > 10 ? 1 : 0);
  
  // Campaign Compliance - check against rules
  let campaignCompliance: number;
  if (hasRules && rulesKeywords.length > 0) {
    // Check if content follows rules (e.g., hashtag requirements)
    const hasRequiredHashtags = rulesKeywords.some(kw => kw.includes('#') && text.includes(kw));
    campaignCompliance = hasRequiredHashtags || hasHashtags ? 2 : 1;
  } else {
    campaignCompliance = hasHashtags && words >= 10 ? 2 : (words >= 5 ? 1 : 0);
  }
  
  const originality = (hasPersonalTouch && hasSpecificDetails) ? 2 : 
    (hasPersonalTouch || hasSpecificDetails) ? 1 : 0;
  
  // Quality Scores (0-5)
  const engagementPotential = 
    (hasCTA && hasQuestions && hasEmojis) ? 5 :
    (hasCTA && (hasQuestions || hasEmojis)) ? 4 :
    (hasCTA || hasQuestions) ? 3 :
    (hasExclamation || hasEmojis) ? 2 : 1;
  
  const technicalQuality = 
    (words >= 20 && !/[\u{1F600}-\u{1F64F}]{3,}/u.test(content)) ? 5 :
    (words >= 15) ? 4 :
    (words >= 10) ? 3 :
    (words >= 5) ? 2 : 1;
  
  return {
    gates: {
      contentAlignment: {
        score: contentAlignment,
        reason: contentAlignment === 2 ? 'Content directly relates to campaign' : 
                contentAlignment === 1 ? 'Content partially relates' : 
                'Content not aligned with campaign'
      },
      informationAccuracy: {
        score: informationAccuracy,
        reason: informationAccuracy === 2 ? 'Contains specific verifiable details' :
                informationAccuracy === 1 ? 'General information, no obvious errors' :
                'Information accuracy could not be verified'
      },
      campaignCompliance: {
        score: campaignCompliance,
        reason: campaignCompliance === 2 ? 'Follows campaign requirements with proper hashtags' :
                campaignCompliance === 1 ? 'Partially follows campaign brief' :
                'Does not meet campaign requirements'
      },
      originality: {
        score: originality,
        reason: originality === 2 ? 'Highly original with personal perspective' :
                originality === 1 ? 'Some original elements' :
                'Generic content, needs more originality'
      }
    },
    quality: {
      engagementPotential: {
        score: engagementPotential,
        reason: engagementPotential >= 4 ? 'Strong engagement hooks and call-to-action' :
                engagementPotential >= 3 ? 'Good engagement potential' :
                'Could use more engagement elements'
      },
      technicalQuality: {
        score: technicalQuality,
        reason: technicalQuality >= 4 ? 'Well-written with good structure' :
                technicalQuality >= 3 ? 'Acceptable quality' :
                'Could improve writing quality'
      }
    }
  };
}

async function analyzeWithAI(content: string, campaignContext?: string) {
  try {
    const zai = await getZAI();
    
    const systemPrompt = `You are a Rally.fun content quality analyst. Analyze the given content and provide scores.

SCORING CRITERIA:

GATE SCORES (0-2 each):
1. Content Alignment: 0=irrelevant, 1=partial, 2=direct alignment
2. Information Accuracy: 0=errors, 1=mostly accurate, 2=well-researched
3. Campaign Compliance: 0=violates, 1=partial, 2=full compliance
4. Originality: 0=copied, 1=some original, 2=highly original

QUALITY SCORES (0-5 each):
1. Engagement Potential: 1=boring, 3=moderate, 5=highly engaging
2. Technical Quality: 1=poor, 3=acceptable, 5=excellent

${campaignContext ? `CAMPAIGN CONTEXT: ${campaignContext}` : 'No campaign context - judge general quality.'}

RESPOND WITH ONLY JSON:
{
  "gates": {
    "contentAlignment": {"score": 0-2, "reason": "brief reason"},
    "informationAccuracy": {"score": 0-2, "reason": "brief reason"},
    "campaignCompliance": {"score": 0-2, "reason": "brief reason"},
    "originality": {"score": 0-2, "reason": "brief reason"}
  },
  "quality": {
    "engagementPotential": {"score": 0-5, "reason": "brief reason"},
    "technicalQuality": {"score": 0-5, "reason": "brief reason"}
  }
}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: `Analyze: "${content}"` }
      ],
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Empty response');
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI analysis error, using rule-based fallback:', error);
    return null; // Signal to use fallback
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, campaignContext } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Try AI first, fallback to rule-based
    let analysis = await analyzeWithAI(content, campaignContext);
    
    if (!analysis) {
      console.log('Using rule-based scoring');
      analysis = ruleBasedScoring(content, campaignContext);
    }

    // Validate and clamp scores
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    
    const result = {
      gates: {
        contentAlignment: {
          score: clamp(analysis.gates?.contentAlignment?.score ?? 1, 0, 2),
          reason: analysis.gates?.contentAlignment?.reason || 'Not specified'
        },
        informationAccuracy: {
          score: clamp(analysis.gates?.informationAccuracy?.score ?? 1, 0, 2),
          reason: analysis.gates?.informationAccuracy?.reason || 'Not specified'
        },
        campaignCompliance: {
          score: clamp(analysis.gates?.campaignCompliance?.score ?? 1, 0, 2),
          reason: analysis.gates?.campaignCompliance?.reason || 'Not specified'
        },
        originality: {
          score: clamp(analysis.gates?.originality?.score ?? 1, 0, 2),
          reason: analysis.gates?.originality?.reason || 'Not specified'
        }
      },
      quality: {
        engagementPotential: {
          score: clamp(analysis.quality?.engagementPotential?.score ?? 3, 0, 5),
          reason: analysis.quality?.engagementPotential?.reason || 'Not specified'
        },
        technicalQuality: {
          score: clamp(analysis.quality?.technicalQuality?.score ?? 3, 0, 5),
          reason: analysis.quality?.technicalQuality?.reason || 'Not specified'
        }
      }
    };

    return NextResponse.json({
      success: true,
      analysis: result
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
