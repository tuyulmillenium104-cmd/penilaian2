import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// RALLY SCORING SYSTEM - LLM-POWERED ANALYSIS
// Uses internal LLM analyzer service at port 3030
// ============================================================================

const LLM_SERVICE_URL = 'http://localhost:3030';

const RALLY_FORMULA = {
  maxAtemporal: 2.70,
  temporalBase: 0.5,
  temporalCap: 4.2,
  temporalScaling: {
    likes: 0.0045,
    replies: 0.009,
    retweets: 0.016,
    impressionsFactor: 0.00009,
    followersFactor: 0.000009
  }
};

const GRADE_CONFIG = [
  { min: 2.80, grade: 'S+', color: 'text-yellow-400', label: 'Exceptional', percentile: 'Top 1%' },
  { min: 2.60, grade: 'S', color: 'text-amber-400', label: 'Outstanding', percentile: 'Top 5%' },
  { min: 2.40, grade: 'A+', color: 'text-green-400', label: 'Excellent', percentile: 'Top 10%' },
  { min: 2.20, grade: 'A', color: 'text-emerald-400', label: 'Very Good', percentile: 'Top 25%' },
  { min: 2.00, grade: 'B+', color: 'text-teal-400', label: 'Good', percentile: 'Above Avg' },
  { min: 1.70, grade: 'B', color: 'text-cyan-400', label: 'Average', percentile: 'Average' },
  { min: 1.30, grade: 'C+', color: 'text-blue-400', label: 'Below Avg', percentile: 'Below Avg' },
  { min: 1.00, grade: 'C', color: 'text-gray-400', label: 'Poor', percentile: 'Poor' },
  { min: 0, grade: 'F', color: 'text-red-400', label: 'Fail', percentile: 'Fail/Violation' }
];

function getGrade(points: number) {
  return GRADE_CONFIG.find(g => points >= g.min) || GRADE_CONFIG[GRADE_CONFIG.length - 1];
}

// Call internal LLM analyzer service
async function analyzeWithLLM(
  content: string,
  campaignContext: string,
  rules: string
): Promise<{
  gates: any;
  quality: any;
  overallAssessment: string;
  improvementSuggestions: string[];
  usedLLM: boolean;
}> {
  try {
    const response = await fetch(`${LLM_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        context: campaignContext,
        rules
      })
    });

    if (!response.ok) {
      throw new Error(`LLM service error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the response to our expected format
    return {
      gates: {
        contentAlignment: data.gates?.contentAlignment || { score: 2, reason: 'OK' },
        informationAccuracy: data.gates?.informationAccuracy || { score: 2, reason: 'OK' },
        campaignCompliance: data.gates?.campaignCompliance || { score: 2, reason: 'OK' },
        originality: data.gates?.originality || { score: 2, reason: 'OK' }
      },
      quality: {
        engagementPotential: data.quality?.engagementPotential || { score: 4, reason: 'OK' },
        technicalQuality: data.quality?.technicalQuality || { score: 4, reason: 'OK' },
        replyQuality: data.quality?.replyQuality || { score: 4, reason: 'OK' }
      },
      overallAssessment: data.overallAssessment || 'Analysis completed.',
      improvementSuggestions: data.improvementSuggestions || [],
      usedLLM: true
    };
  } catch (error) {
    console.error('LLM service error:', error);
    return {
      ...getFallbackAnalysis(content, campaignContext, rules),
      usedLLM: false
    };
  }
}

// Check if content is gibberish/low quality
function analyzeContentQuality(content: string): {
  isGibberish: boolean;
  hasRealWords: boolean;
  hasSentenceStructure: boolean;
  wordCount: number;
  realWordRatio: number;
  issues: string[];
} {
  const issues: string[] = [];
  const words = content.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Common English words for validation
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
    'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
    'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
    'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most',
    'us', 'is', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'did', 'does', 'doing', 'am', 'im',
    'crypto', 'web3', 'blockchain', 'twitter', 'x', 'project', 'community', 'token', 'defi', 'nft', 'airdrop',
    'love', 'great', 'amazing', 'awesome', 'thanks', 'thank', 'please', 'help', 'need', 'check', 'look'
  ]);
  
  // Count real words
  let realWordCount = 0;
  for (const word of words) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length >= 2 && (commonWords.has(cleanWord) || cleanWord.length > 6)) {
      realWordCount++;
    }
  }
  
  const realWordRatio = wordCount > 0 ? realWordCount / wordCount : 0;
  const hasRealWords = realWordRatio > 0.3;
  
  // Check for sentence structure (punctuation, capitalization)
  const hasSentenceStructure = /[.!?]/.test(content) || /[A-Z][a-z]+/.test(content);
  
  // Detect gibberish patterns
  const isGibberish = 
    wordCount < 3 ||                                    // Too few words
    realWordRatio < 0.2 ||                              // Too few real words
    /^[a-z]{1,5}$/i.test(content.trim()) ||             // Single short word
    /^(.)\1+$/.test(content.replace(/\s/g, '')) ||      // Repeated characters (aaa, bbb)
    !/[aeiou]/i.test(content);                          // No vowels (not real words)
  
  // Collect issues
  if (wordCount < 5) issues.push('Content too short');
  if (realWordRatio < 0.3) issues.push('Contains mostly gibberish');
  if (!hasSentenceStructure && wordCount > 3) issues.push('No proper sentence structure');
  if (!hasRealWords) issues.push('No meaningful words detected');
  
  return {
    isGibberish,
    hasRealWords,
    hasSentenceStructure,
    wordCount,
    realWordRatio,
    issues
  };
}

// Fallback analysis - improved with quality detection
function getFallbackAnalysis(content: string, _campaignContext: string, _rules: string) {
  const qualityAnalysis = analyzeContentQuality(content);
  
  // Base penalties for low-quality content
  let gatePenalty = 0;
  let qualityPenalty = 0;
  
  if (qualityAnalysis.isGibberish) {
    gatePenalty = 1.5;
    qualityPenalty = 2.5;
  } else if (!qualityAnalysis.hasRealWords) {
    gatePenalty = 1.0;
    qualityPenalty = 2.0;
  } else if (qualityAnalysis.wordCount < 5) {
    gatePenalty = 0.5;
    qualityPenalty = 1.5;
  }
  
  // Positive signals
  const hasBrandMention = /@[a-z0-9_]+/i.test(content);
  const hasHashtag = /#[a-z0-9_]+/i.test(content);
  const hasSuspicious = /click here|buy now|limited time|act fast|shocking/i.test(content);
  const hasAI = /in today's|harnessing the power|seamless experience|game-changing/i.test(content);
  const hasQuestion = /\?/.test(content);
  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(content);
  
  // Calculate gate scores (0-2)
  const contentAlignmentScore = Math.max(0, Math.min(2, 
    (hasBrandMention ? 1.5 : 0.5) + 
    (hasHashtag ? 0.3 : 0) - 
    gatePenalty
  ));
  
  const informationAccuracyScore = qualityAnalysis.isGibberish ? 0 : 
    Math.max(0, Math.min(2, 
      (hasSuspicious ? 0 : 1.5) - 
      (qualityAnalysis.wordCount < 5 ? 0.5 : 0)
    ));
  
  const campaignComplianceScore = Math.max(0, Math.min(2, 
    1.0 - gatePenalty + (hasBrandMention ? 0.5 : 0)
  ));
  
  const originalityScore = Math.max(0, Math.min(2,
    (hasAI ? 0.5 : 1.5) - 
    (qualityAnalysis.isGibberish ? 1.0 : 0)
  ));
  
  // Calculate quality scores (0-5)
  const engagementPotentialScore = Math.max(0, Math.min(5,
    2.0 + 
    (hasQuestion ? 0.8 : 0) + 
    (hasEmoji ? 0.3 : 0) + 
    (hasBrandMention ? 0.5 : 0) - 
    qualityPenalty
  ));
  
  const technicalQualityScore = Math.max(0, Math.min(5,
    1.5 + 
    (qualityAnalysis.hasSentenceStructure ? 1.0 : 0) + 
    (qualityAnalysis.wordCount > 20 ? 1.0 : 0.5) - 
    qualityPenalty
  ));
  
  const replyQualityScore = Math.max(0, Math.min(5,
    1.5 + 
    (hasQuestion ? 1.0 : 0) + 
    (qualityAnalysis.hasRealWords ? 0.5 : 0) - 
    qualityPenalty
  ));
  
  // Generate reasons
  const gateReasons = {
    contentAlignment: qualityAnalysis.isGibberish 
      ? 'Gibberish content - no meaningful alignment' 
      : contentAlignmentScore < 1 
        ? 'Poor content alignment with campaign' 
        : hasBrandMention 
          ? 'Mentions brand/handle' 
          : 'Basic content alignment',
    informationAccuracy: qualityAnalysis.isGibberish 
      ? 'Cannot verify - not meaningful content' 
      : hasSuspicious 
        ? 'Contains suspicious patterns' 
        : 'Content appears accurate',
    campaignCompliance: qualityAnalysis.isGibberish 
      ? 'Does not meet minimum content requirements' 
      : campaignComplianceScore < 1 
        ? 'Poor compliance with campaign rules' 
        : 'Meets basic compliance',
    originality: qualityAnalysis.isGibberish 
      ? 'Not original - appears to be random text' 
      : hasAI 
        ? 'May contain AI-generated patterns' 
        : 'Content appears original'
  };
  
  const qualityReasons = {
    engagementPotential: qualityAnalysis.isGibberish 
      ? 'No engagement potential - gibberish content' 
      : engagementPotentialScore < 2 
        ? 'Low engagement potential' 
        : hasQuestion 
          ? 'Questions can drive engagement' 
          : 'Moderate engagement potential',
    technicalQuality: qualityAnalysis.isGibberish 
      ? 'Very low technical quality' 
      : technicalQualityScore < 2 
        ? 'Short or poorly structured' 
        : 'Well-structured content',
    replyQuality: qualityAnalysis.isGibberish 
      ? 'Unlikely to generate quality replies' 
      : replyQualityScore < 2 
        ? 'Low reply quality potential' 
        : hasQuestion 
          ? 'Questions invite responses' 
          : 'Moderate reply potential'
  };
  
  return {
    gates: {
      contentAlignment: { 
        score: Math.round(contentAlignmentScore * 10) / 10, 
        reason: gateReasons.contentAlignment 
      },
      informationAccuracy: { 
        score: Math.round(informationAccuracyScore * 10) / 10, 
        reason: gateReasons.informationAccuracy 
      },
      campaignCompliance: { 
        score: Math.round(campaignComplianceScore * 10) / 10, 
        reason: gateReasons.campaignCompliance 
      },
      originality: { 
        score: Math.round(originalityScore * 10) / 10, 
        reason: gateReasons.originality 
      }
    },
    quality: {
      engagementPotential: { 
        score: Math.round(engagementPotentialScore * 10) / 10, 
        reason: qualityReasons.engagementPotential 
      },
      technicalQuality: { 
        score: Math.round(technicalQualityScore * 10) / 10, 
        reason: qualityReasons.technicalQuality 
      },
      replyQuality: { 
        score: Math.round(replyQualityScore * 10) / 10, 
        reason: qualityReasons.replyQuality 
      }
    },
    overallAssessment: qualityAnalysis.isGibberish 
      ? 'Content appears to be gibberish or very low quality. Please provide meaningful content.'
      : qualityAnalysis.issues.length > 0 
        ? `Quality issues detected: ${qualityAnalysis.issues.join(', ')}`
        : 'Analysis completed using rule-based system.',
    improvementSuggestions: qualityAnalysis.isGibberish 
      ? ['Write meaningful content', 'Include proper sentences', 'Add relevant information']
      : ['Add personal perspective', 'Include examples', 'Ask questions to engage readers']
  };
}

// API Handler
export async function POST(request: NextRequest) {
  try {
    const { content, campaignContext, engagement, scoringConfig } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const config = scoringConfig || {};
    const style = config.style || 'Quality Engagement';
    const rules = campaignContext || '';
    
    // Use internal LLM service
    const analysis = await analyzeWithLLM(content, campaignContext || '', rules);
    
    const gates = analysis.gates;
    const quality = analysis.quality;
    
    // Extract quality scores
    const engagementScore = quality.engagementPotential.score;
    const technicalScore = quality.technicalQuality.score;
    const replyScore = quality.replyQuality.score;
    const qualityAverage = (engagementScore + technicalScore + replyScore) / 3;
    const minScore = Math.min(engagementScore, technicalScore, replyScore);
    
    // Count 5-star scores (using 4.8 threshold for rounding)
    const fivesCount = [engagementScore, technicalScore, replyScore].filter(s => s >= 4.8).length;
    
    // RALLY'S ACTUAL FORMULA (discovered through pattern analysis):
    // Rally uses a LOOKUP TABLE based on engagement + technical scores!
    // Reply quality does NOT affect atemporal score directly
    
    let atemporalPoints = 0;
    
    // Check for spam (information accuracy = 0 means spam detected)
    const isSpam = gates.informationAccuracy.score === 0;
    
    // Check if content is meaningful (not gibberish with all gates near 0)
    const avgGate = (
      gates.contentAlignment.score +
      gates.informationAccuracy.score +
      gates.campaignCompliance.score +
      gates.originality.score
    ) / 4;
    
    // Spam gets heavily penalized (80% penalty)
    if (isSpam) {
      atemporalPoints = qualityAverage * 0.2;
    } else if (avgGate < 0.3 && qualityAverage < 1) {
      // Gibberish content
      atemporalPoints = qualityAverage * 0.3;
    } else {
      // RALLY'S LOOKUP TABLE FORMULA:
      // Based on Engagement Potential + Technical Quality
      const eng = Math.round(engagementScore);
      const tech = Math.round(technicalScore);
      
      // Lookup table discovered from 150+ real Rally samples
      const lookupTable: Record<string, number> = {
        '2_4': 1.62,
        '3_3': 1.62,
        '3_4': 1.89,
        '3_5': 2.16,
        '4_4': 2.16,
        '4_5': 2.43,
        '5_5': 2.70
      };
      
      const lookupKey = `${eng}_${tech}`;
      
      if (lookupTable[lookupKey]) {
        atemporalPoints = lookupTable[lookupKey];
      } else {
        // Fallback: interpolate based on formula
        const baseScore = Math.min(engagementScore, technicalScore) * 0.54;
        const bonusScore = Math.max(engagementScore, technicalScore) * 0.27;
        atemporalPoints = Math.min(baseScore + bonusScore, 2.70);
      }
    }
    
    // Ensure we don't exceed Rally's cap
    atemporalPoints = Math.min(atemporalPoints, RALLY_FORMULA.maxAtemporal);

    // TEMPORAL SCORE
    let temporalPoints = RALLY_FORMULA.temporalBase;
    if (style !== 'Quality Only') {
      const eng = engagement || { likes: 0, replies: 0, retweets: 0, impressions: 0, followersOfRepliers: 0 };
      const engagementPoints = 
        (eng.likes || 0) * RALLY_FORMULA.temporalScaling.likes +
        (eng.replies || 0) * RALLY_FORMULA.temporalScaling.replies +
        (eng.retweets || 0) * RALLY_FORMULA.temporalScaling.retweets +
        (eng.impressions || 0) * RALLY_FORMULA.temporalScaling.impressionsFactor +
        (eng.followersOfRepliers || 0) * RALLY_FORMULA.temporalScaling.followersFactor;
      temporalPoints = Math.min(RALLY_FORMULA.temporalCap, RALLY_FORMULA.temporalBase + engagementPoints);
    }

    let totalPoints = atemporalPoints + temporalPoints;
    if (style === 'Quality Only') {
      temporalPoints = 0;
      totalPoints = Math.min(atemporalPoints * 1.5, 3.0);
    }

    const grade = getGrade(totalPoints);

    return NextResponse.json({
      success: true,
      analysis: {
        gates,
        quality,
        overallAssessment: analysis.overallAssessment,
        improvementSuggestions: analysis.improvementSuggestions
      },
      scoring: {
        atemporalPoints: Math.round(atemporalPoints * 1000) / 1000,
        temporalPoints: Math.round(temporalPoints * 1000) / 1000,
        totalPoints: Math.round(totalPoints * 1000) / 1000,
        grade,
        formula: {
          atemporalFormula: `Lookup: eng=${Math.round(engagementScore)}, tech=${Math.round(technicalScore)} → ${atemporalPoints.toFixed(3)}`,
          temporalFormula: `base(0.5) + weighted_engagement (cap 4.2)`,
          analysisMethod: analysis.usedLLM ? 'LLM-powered analysis' : 'Rule-based fallback'
        }
      },
      analysisMethod: analysis.usedLLM 
        ? 'LLM-powered semantic analysis (internal service)' 
        : 'Rule-based analysis (LLM fallback)',
      calibratedFrom: 'Real Rally API data'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
  }
}
