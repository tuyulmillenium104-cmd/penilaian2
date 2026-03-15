import { NextRequest, NextResponse } from 'next/server';

// Use local LLM Analyzer service (port 3030) - no external token needed
const LLM_ANALYZER_URL = 'http://localhost:3030/analyze';

async function analyzeWithLocalLLM(
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
    const response = await fetch(LLM_ANALYZER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        context: campaignContext || '',
        rules: ''
      })
    });

    if (!response.ok) {
      throw new Error(`LLM Analyzer error: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      analysis: {
        gates: result.gates,
        quality: result.quality
      },
      overallAssessment: result.overallAssessment,
      improvementSuggestions: result.improvementSuggestions,
      metadata: { analysisMethod: 'local-llm-analyzer' }
    };
  } catch (error) {
    console.error('Local LLM analysis error:', error);
    return { success: false, error: String(error) };
  }
}

// Fallback rule-based analysis
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
    metadata: { analysisMethod: 'rule-based-fallback' }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, campaignContext, engagement } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    // Try local LLM analyzer first
    const llmResult = await analyzeWithLocalLLM(content, campaignContext, engagement);
    
    if (llmResult.success && llmResult.analysis) {
      return NextResponse.json({ 
        success: true, 
        analysis: llmResult.analysis, 
        overallAssessment: llmResult.overallAssessment,
        improvementSuggestions: llmResult.improvementSuggestions,
        metadata: llmResult.metadata 
      });
    }

    console.log('Local LLM analysis failed, using rule-based fallback');
    const analysis = ruleBasedAnalysis(content, campaignContext);
    
    return NextResponse.json({ success: true, analysis, metadata: analysis.metadata });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: false, error: 'Failed to analyze content' }, { status: 500 });
  }
}
