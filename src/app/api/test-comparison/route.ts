import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Real Rally submissions data with actual scores from Rally API
  const realSubmissions = [
    {
      id: 1,
      username: 'mpaya35',
      tweet: `Building on @n4vib_'s "non-obvious use cases": I'd use @rallyonchain to reward localization leads—people who turn complex updates into accurate, native-language threads. That's real adoption: clarity over clout.`,
      rallyAtemporal: 2.16,
      rallyTemporal: 2.14,
      rallyTotal: 4.30,
      rallyAnalysis: {
        contentAlignment: 2.0,
        informationAccuracy: 2.0,
        campaignCompliance: 2.0,
        originality: 2.0,
        engagementPotential: 4.0,
        technicalQuality: 4.0,
        replyQuality: 4.0
      },
      engagement: { likes: 8, replies: 6, retweets: 6, impressions: 5000, followersOfRepliers: 2400 }
    },
    {
      id: 2,
      username: 'oxdavinci',
      tweet: `Reputation in marketing is broken. Brands spend on impressions that aren't real. Creators compete with bots and fake accounts. Both sides are stuck with vanity metrics that don't show true impact. @rallyonchain changes this with AI validators built on GenLayer.`,
      rallyAtemporal: 1.98,
      rallyTemporal: 2.02,
      rallyTotal: 4.00,
      rallyAnalysis: {
        contentAlignment: 2.0,
        informationAccuracy: 2.0,
        campaignCompliance: 2.0,
        originality: 1.0,
        engagementPotential: 4.0,
        technicalQuality: 4.0,
        replyQuality: 4.0
      },
      engagement: { likes: 55, replies: 57, retweets: 1, impressions: 15000, followersOfRepliers: 5000 }
    },
    {
      id: 3,
      username: 'decatilion_',
      tweet: `Imagine if Wikipedia editors like @martin034548 had their work judged by @RallyOnChain... AI validators could score edits on clarity, accuracy & impact rewarding real value instantly, on-chain, without bias. Would you trust AI to score your contributions?`,
      rallyAtemporal: 2.43,
      rallyTemporal: 1.53,
      rallyTotal: 3.96,
      rallyAnalysis: {
        contentAlignment: 2.0,
        informationAccuracy: 2.0,
        campaignCompliance: 2.0,
        originality: 2.0,
        engagementPotential: 4.0,
        technicalQuality: 4.0,
        replyQuality: 4.0
      },
      engagement: { likes: 22, replies: 8, retweets: 1, impressions: 8000, followersOfRepliers: 2400 }
    }
  ];

  const results: any[] = [];
  
  for (const sub of realSubmissions) {
    try {
      const response = await fetch('http://localhost:3000/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: sub.tweet,
          campaignContext: 'Rally campaign about AI-powered content scoring platform',
          rules: 'Must mention @RallyOnChain',
          engagement: sub.engagement
        })
      });
      
      const myResult = await response.json();
      
      results.push({
        id: sub.id,
        username: sub.username,
        rally: {
          atemporal: sub.rallyAtemporal,
          temporal: sub.rallyTemporal,
          total: sub.rallyTotal
        },
        my: {
          atemporal: myResult.scoring.atemporalPoints,
          temporal: myResult.scoring.temporalPoints,
          total: myResult.scoring.totalPoints
        },
        gates: myResult.analysis.gates,
        diff: Math.round((myResult.scoring.totalPoints - sub.rallyTotal) * 100) / 100
      });
    } catch (error) {
      results.push({
        id: sub.id,
        error: String(error)
      });
    }
  }
  
  // Calculate accuracy metrics
  const validResults = results.filter(r => !r.error);
  const totalDiff = validResults.reduce((sum, r) => sum + Math.abs(r.diff || 0), 0);
  const avgDiff = totalDiff / validResults.length;
  const avgAccuracy = Math.max(0, 100 - (avgDiff / 5.0 * 100));
  
  return NextResponse.json({
    success: true,
    submissions: results,
    summary: {
      totalTests: validResults.length,
      averageDiff: Math.round(avgDiff * 100) / 100,
      averageAccuracy: Math.round(avgAccuracy),
      maxPossibleScore: 5.0
    }
  });
}
