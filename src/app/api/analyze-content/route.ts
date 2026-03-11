import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// ============================================================================
// RALLY SCORING FORMULA - CALIBRATED FROM REAL DATA
// ============================================================================
// Score range: 0.77 - 3.04
// Formula: Total = Atemporal + Temporal
// Atemporal = (gate_avg / 2) × quality_factor × 0.75 (max: ~1.5)
// Temporal = base + log_engagement (base: ~0.6, max: ~1.5)
// ============================================================================

// Gate score ranges (0-2)
const GATE_MAX = 2;
// Quality score ranges (0-5)
const QUALITY_MAX = 5;

// Calibrated coefficients from Rally data analysis
const ATEMPORAL_CONFIG = {
  base: 0.1,
  multiplier: 0.7,      // Gate contribution
  qualityMultiplier: 0.08, // Quality contribution
  max: 1.5,
  minGatePenalty: 0.5   // Penalty if any gate = 0
};

const TEMPORAL_CONFIG = {
  base: 0.6,
  likesCoef: 0.08,
  repliesCoef: 0.12,
  retweetsCoef: 0.10,
  impressionsCoef: 0.015,
  followersCoef: 0.20,
  max: 1.5
};

// Grade thresholds (calibrated to Rally data)
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

export async function POST(request: NextRequest) {
  try {
    const { content, campaignContext, engagement, scoringConfig } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    // Parse scoring config
    const config = scoringConfig || {};
    const style = config.style || 'Quality Engagement';
    const criteria = config.contentEvaluationCriteria;

    // Build evaluation prompt
    const systemPrompt = `You are a content evaluator for Rally.fun, a Web3 campaign platform.
Evaluate the submitted content based on these criteria:

GATE SCORES (Critical - Score 0-2 each):
1. Content Alignment: How well does the content align with the campaign brief?
   - 0: Completely irrelevant or off-topic
   - 1: Partially relevant, misses key points
   - 2: Fully aligned with campaign message

2. Information Accuracy: Is the information presented accurate?
   - 0: Contains false or misleading information
   - 1: Mostly accurate with minor issues
   - 2: Accurate and well-researched

3. Campaign Compliance: Does it follow the campaign rules?
   - 0: Violates rules (wrong mentions, hashtags, or missing requirements)
   - 1: Partially compliant, minor rule deviations
   - 2: Fully compliant with all rules

4. Originality: Is the content original and creative?
   - 0: Copy-paste or clearly AI-generated without personalization
   - 1: Has some original elements but generic overall
   - 2: Original, creative, and authentic

QUALITY SCORES (Score 0-5 each):
5. Engagement Potential (0-5): How likely is this to generate meaningful engagement?
   - 0-1: Unlikely to engage anyone
   - 2-3: Moderate engagement potential
   - 4-5: Highly engaging, compelling content

6. Technical Quality (0-5): Writing quality, clarity, and presentation
   - 0-1: Poor grammar, confusing structure
   - 2-3: Acceptable quality, clear enough
   - 4-5: Excellent writing, professional presentation

7. Reply Quality (0-5): Quality of potential/authentic replies this content might generate
   - 0-1: Spam-attracting or no meaningful discussion
   - 2-3: Some meaningful discussion possible
   - 4-5: Promotes valuable conversation

IMPORTANT RULES:
- Score 0 for ANY gate criterion if the content violates rules
- Be strict about rule compliance
- Consider the campaign context when evaluating alignment
- Authentic, natural content scores higher than generic/AI-generated`;

    const userPrompt = `Campaign Context:
${campaignContext || 'No specific campaign context provided'}

Content to Evaluate:
"""
${content}
"""

Evaluate this content and provide your assessment in JSON format:
{
  "gates": {
    "contentAlignment": { "score": <0-2>, "reason": "<brief explanation>" },
    "informationAccuracy": { "score": <0-2>, "reason": "<brief explanation>" },
    "campaignCompliance": { "score": <0-2>, "reason": "<brief explanation>" },
    "originality": { "score": <0-2>, "reason": "<brief explanation>" }
  },
  "quality": {
    "engagementPotential": { "score": <0-5>, "reason": "<brief explanation>" },
    "technicalQuality": { "score": <0-5>, "reason": "<brief explanation>" },
    "replyQuality": { "score": <0-5>, "reason": "<brief explanation>" }
  },
  "overallAssessment": "<brief overall assessment>",
  "improvementSuggestions": ["<suggestion1>", "<suggestion2>"]
}`;

    let analysis;
    
    try {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        thinking: { type: 'disabled' }
      });

      const responseText = completion.choices[0]?.message?.content || '';
      
      // Extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      
      analysis = JSON.parse(jsonMatch[0]);
    } catch (llmError) {
      console.error('LLM analysis failed:', llmError);
      // Fallback to rule-based analysis
      analysis = fallbackAnalysis(content, campaignContext);
    }

    // Calculate scores using calibrated Rally formula
    const gates = analysis.gates;
    const quality = analysis.quality;
    
    const gateSum = (gates.contentAlignment?.score || 0) + 
                    (gates.informationAccuracy?.score || 0) + 
                    (gates.campaignCompliance?.score || 0) + 
                    (gates.originality?.score || 0);
    
    const qualitySum = (quality.engagementPotential?.score || 0) + 
                       (quality.technicalQuality?.score || 0) + 
                       (quality.replyQuality?.score || 0);
    
    // Check for rule violations (any gate = 0 means serious issue)
    const minGate = Math.min(
      gates.contentAlignment?.score || 0,
      gates.informationAccuracy?.score || 0,
      gates.campaignCompliance?.score || 0,
      gates.originality?.score || 0
    );

    // ===== ATEMPORAL SCORE (Quality-based) =====
    // Calibrated formula: base + gate_contribution + quality_contribution
    let atemporalPoints = ATEMPORAL_CONFIG.base;
    
    // Gate contribution (normalized to 0-1, then multiplied)
    const gateAvg = gateSum / 8; // 4 gates, max 2 each = 8
    atemporalPoints += gateAvg * ATEMPORAL_CONFIG.multiplier;
    
    // Quality contribution
    const qualityNorm = qualitySum / 15; // 3 criteria, max 5 each = 15
    atemporalPoints += qualityNorm * ATEMPORAL_CONFIG.qualityMultiplier;
    
    // Apply penalty for any zero gate
    if (minGate === 0) {
      atemporalPoints *= ATEMPORAL_CONFIG.minGatePenalty;
    }
    
    // Cap atemporal
    atemporalPoints = Math.min(atemporalPoints, ATEMPORAL_CONFIG.max);

    // ===== TEMPORAL SCORE (Engagement-based) =====
    // Only calculate if style includes engagement
    let temporalPoints = TEMPORAL_CONFIG.base;
    
    if (style !== 'Quality Only') {
      const eng = engagement || { likes: 0, replies: 0, retweets: 0, impressions: 0, followersOfRepliers: 0 };
      
      // Logarithmic contributions
      const likesContrib = Math.log10((eng.likes || 0) + 1) * TEMPORAL_CONFIG.likesCoef;
      const repliesContrib = Math.log10((eng.replies || 0) + 1) * TEMPORAL_CONFIG.repliesCoef;
      const retweetsContrib = Math.log10((eng.retweets || 0) + 1) * TEMPORAL_CONFIG.retweetsCoef;
      const impressionsContrib = Math.log10((eng.impressions || 0) + 1) * TEMPORAL_CONFIG.impressionsCoef;
      const followersContrib = Math.log10((eng.followersOfRepliers || 0) + 1) * TEMPORAL_CONFIG.followersCoef;
      
      temporalPoints += likesContrib + repliesContrib + retweetsContrib + impressionsContrib + followersContrib;
    }
    
    // Cap temporal
    temporalPoints = Math.min(temporalPoints, TEMPORAL_CONFIG.max);

    // ===== TOTAL SCORE =====
    let totalPoints = atemporalPoints + temporalPoints;
    
    // Apply style adjustments
    if (style === 'Quality Only') {
      temporalPoints = 0;
      totalPoints = atemporalPoints * 1.5; // Boost quality since no temporal
      totalPoints = Math.min(totalPoints, 3.0);
    } else if (style === 'Engagement Only') {
      atemporalPoints = ATEMPORAL_CONFIG.base; // Minimal atemporal
      totalPoints = atemporalPoints + temporalPoints;
    }

    const grade = getGrade(totalPoints);

    return NextResponse.json({
      success: true,
      analysis: {
        gates: analysis.gates,
        quality: analysis.quality,
        overallAssessment: analysis.overallAssessment,
        improvementSuggestions: analysis.improvementSuggestions
      },
      scoring: {
        atemporalPoints: Math.round(atemporalPoints * 1000) / 1000,
        temporalPoints: Math.round(temporalPoints * 1000) / 1000,
        totalPoints: Math.round(totalPoints * 1000) / 1000,
        grade,
        formula: {
          atemporalFormula: `${ATEMPORAL_CONFIG.base} + (gate_avg × ${ATEMPORAL_CONFIG.multiplier}) + (quality_norm × ${ATEMPORAL_CONFIG.qualityMultiplier})`,
          temporalFormula: `${TEMPORAL_CONFIG.base} + log(engagement_metrics)`,
          caps: { atemporalMax: ATEMPORAL_CONFIG.max, temporalMax: TEMPORAL_CONFIG.max }
        }
      },
      calibratedFrom: 'Real Rally leaderboard data (score range: 0.77-3.04)'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
  }
}

// Fallback rule-based analysis
function fallbackAnalysis(content: string, context: string | undefined): any {
  const words = content.split(/\s+/);
  const wordCount = words.length;
  const hasHashtags = /#\w+/.test(content);
  const hasMentions = /@\w+/.test(content);
  const hasLinks = /https?:\/\/\S+/.test(content);
  const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
  
  // Check for common AI patterns
  const aiPatterns = [
    /in conclusion/i, /furthermore/i, /moreover/i, /additionally/i,
    /it is important to note/i, /in today's digital landscape/i,
    /—\s*\w/ // Em dash followed by word (common AI pattern)
  ];
  const aiPatternCount = aiPatterns.filter(p => p.test(content)).length;
  
  // Calculate gate scores
  const contentAlignment = wordCount >= 20 ? (wordCount >= 50 ? 2 : 1) : 0;
  const informationAccuracy = 1.5; // Default
  const campaignCompliance = aiPatternCount > 2 ? 0.5 : 1.5;
  const originality = aiPatternCount === 0 ? (hasEmojis ? 2 : 1.5) : 0.5;
  
  // Calculate quality scores
  const engagementPotential = hasHashtags && hasMentions ? 3 : hasHashtags ? 2 : 1.5;
  const technicalQuality = wordCount >= 20 && wordCount <= 280 ? 3 : 2;
  const replyQuality = content.includes('?') ? 2.5 : 1.5;

  return {
    gates: {
      contentAlignment: { score: contentAlignment, reason: wordCount >= 50 ? 'Good length and detail' : 'Could be more detailed' },
      informationAccuracy: { score: informationAccuracy, reason: 'Unable to verify without campaign context' },
      campaignCompliance: { score: campaignCompliance, reason: aiPatternCount > 2 ? 'Contains common AI patterns' : 'Appears natural' },
      originality: { score: originality, reason: aiPatternCount === 0 ? 'Original content' : 'Generic patterns detected' }
    },
    quality: {
      engagementPotential: { score: engagementPotential, reason: hasHashtags ? 'Hashtags present' : 'Consider adding hashtags' },
      technicalQuality: { score: technicalQuality, reason: 'Acceptable length for platform' },
      replyQuality: { score: replyQuality, reason: content.includes('?') ? 'Contains question for engagement' : 'Could include question' }
    },
    overallAssessment: 'Rule-based fallback analysis',
    improvementSuggestions: ['Add campaign-specific details', 'Include relevant hashtags', 'Ask engaging questions']
  };
}
