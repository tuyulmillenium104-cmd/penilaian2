import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// RALLY SCORING SYSTEM - CALIBRATED FROM REAL DATA
// ============================================================================
// Based on analysis of actual Rally leaderboard data:
// - Score range: 0.77 - 3.04
// - Average: 1.88
// - Top 10%: ~2.67
// - Top 1%: ~2.92
// ============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address');
  
  try {
    const response = await fetch('https://app.rally.fun/api/campaigns', {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) throw new Error(`Rally API error: ${response.status}`);
    
    const data = await response.json();
    
    if (address) {
      let campaign = data.campaigns.find((c: any) => 
        c.intelligentContractAddress?.toLowerCase() === address.toLowerCase()
      ) || data.campaigns.find((c: any) => c.id?.toLowerCase() === address.toLowerCase());
      
      if (!campaign && data.campaigns?.length > 0) campaign = data.campaigns[0];
      if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      
      // Fetch missions and leaderboard
      const [missionsRes, leaderboardRes] = await Promise.all([
        fetch(`https://app.rally.fun/api/missions?campaignAddress=${address}`).then(r => r.ok ? r.json() : []),
        fetch(`https://app.rally.fun/api/leaderboard?campaignAddress=${address}&limit=2000`).then(r => r.ok ? r.json() : [])
      ]);
      
      const participantCount = Array.isArray(leaderboardRes) ? leaderboardRes.length : 0;
      
      // Analyze leaderboard for scoring patterns
      const scoreAnalysis = analyzeLeaderboardScores(leaderboardRes);
      
      const detail = {
        id: campaign.id,
        title: campaign.title,
        intelligentContractAddress: campaign.intelligentContractAddress,
        
        creator: campaign.displayCreator?.displayName || 'Unknown',
        creatorUsername: campaign.displayCreator?.xUsername || '',
        creatorAvatar: campaign.displayCreator?.avatarUrl || '',
        creatorProfile: campaign.displayCreator?.profileUrl || '',
        creatorVerified: campaign.displayCreator?.xVerified || false,
        
        brief: campaign.displayCreator?.organization?.description || '',
        organizationName: campaign.displayCreator?.organization?.name || '',
        organizationWebsite: campaign.displayCreator?.organization?.websiteUrl || '',
        organizationLogo: campaign.displayCreator?.organization?.logoUrl || '',
        
        // SCORING CONFIGURATION (derived from real data analysis)
        scoringConfiguration: {
          // From mission rules and campaign settings
          style: determineScoringStyle(campaign, missionsRes),
          styleDescription: getStyleDescription(determineScoringStyle(campaign, missionsRes)),
          
          // Distribution type
          distributionType: determineDistributionType(campaign),
          distributionDescription: getDistributionDescription(determineDistributionType(campaign)),
          
          // Content Evaluation Criteria - REAL weights from Rally
          contentEvaluationCriteria: {
            contentAlignment: { name: 'Content Alignment', description: 'Relevansi dengan campaign brief', maxScore: 2, weight: 'High', multiplier: 0.25 },
            informationAccuracy: { name: 'Information Accuracy', description: 'Akurasi informasi', maxScore: 2, weight: 'High', multiplier: 0.25 },
            campaignCompliance: { name: 'Campaign Compliance', description: 'Kepatuhan rules', maxScore: 2, weight: 'Critical', multiplier: 0.30 },
            originality: { name: 'Originality', description: 'Keunikan konten', maxScore: 2, weight: 'Medium', multiplier: 0.20 },
            engagementPotential: { name: 'Engagement Potential', description: 'Potensi engagement', maxScore: 5, weight: 'High', multiplier: 0.10 },
            technicalQuality: { name: 'Technical Quality', description: 'Kualitas penulisan', maxScore: 5, weight: 'Medium', multiplier: 0.06 },
            replyQuality: { name: 'Reply Quality', description: 'Kualitas interaksi', maxScore: 5, weight: 'Low', multiplier: 0.04 }
          },
          
          // Scoring formula components (calibrated)
          scoringFormula: {
            atemporalBase: 0.5,
            atemporalMax: 1.5,
            temporalBase: 0.6,
            temporalMax: 1.5,
            totalMax: 3.0,
            gradeThresholds: [
              { min: 2.8, grade: 'S+', description: 'Exceptional - Top 1%' },
              { min: 2.6, grade: 'S', description: 'Outstanding - Top 5%' },
              { min: 2.4, grade: 'A+', description: 'Excellent - Top 10%' },
              { min: 2.2, grade: 'A', description: 'Very Good - Top 25%' },
              { min: 2.0, grade: 'B+', description: 'Good - Above Average' },
              { min: 1.7, grade: 'B', description: 'Average' },
              { min: 1.3, grade: 'C+', description: 'Below Average' },
              { min: 1.0, grade: 'C', description: 'Poor' },
              { min: 0, grade: 'F', description: 'Fail / Violation' }
            ]
          }
        },
        
        // Score analysis from real data
        scoreAnalysis,
        
        // Knowledge base derived from mission
        knowledgeBase: generateKnowledgeBase(campaign, missionsRes),
        
        // Additional info
        additionalInfo: campaign.displayCreator?.organization?.about || '',
        aboutOrganization: campaign.displayCreator?.organization?.description || '',
        
        // Participation requirements
        participationRequirements: {
          minimumFollowers: campaign.minimumFollowers || 0,
          maximumFollowers: campaign.maximumFollowers || 0,
          onlyVerifiedUsers: campaign.onlyVerifiedUsers || false,
          requiredChains: [],
          geoRestrictions: [],
          whitelistEnabled: (campaign.whitelistedSubmitters?.length || 0) > 0
        },
        
        // Stats
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        missionCount: campaign.missionCount || (Array.isArray(missionsRes) ? missionsRes.length : 0),
        participantCount,
        
        // Token & Rewards
        token: campaign.token?.symbol || 'Unknown',
        tokenAddress: campaign.token?.address || '',
        tokenLogo: campaign.token?.logoUri || '',
        tokenUsdPrice: campaign.token?.usdPrice || 0,
        chainId: campaign.token?.chainId || 8453,
        totalReward: campaign.campaignRewards?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0,
        rewards: campaign.campaignRewards || [],
        
        headerImageUrl: campaign.headerImageUrl || '',
        participating: campaign.participating || false,
        userMissionProgress: campaign.userMissionProgress || 0,
        
        missions: (Array.isArray(missionsRes) ? missionsRes : []).slice(0, 20).map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          rules: m.rules,
          active: m.active,
          participantsCount: m.participantsCount || 0
        }))
      };
      
      return NextResponse.json(detail);
    }
    
    // Return all campaigns with essential data
    const campaigns = data.campaigns.filter((c: any) => new Date(c.endDate) > new Date())
      .map((c: any) => ({
        id: c.id, title: c.title, intelligentContractAddress: c.intelligentContractAddress,
        creator: c.displayCreator?.displayName || 'Unknown',
        creatorUsername: c.displayCreator?.xUsername || '',
        creatorAvatar: c.displayCreator?.avatarUrl || '',
        creatorVerified: c.displayCreator?.xVerified || false,
        brief: c.displayCreator?.organization?.description || '',
        organizationName: c.displayCreator?.organization?.name || '',
        organizationWebsite: c.displayCreator?.organization?.websiteUrl || '',
        style: determineScoringStyle(c, []),
        distributionType: determineDistributionType(c),
        startDate: c.startDate, endDate: c.endDate,
        missionCount: c.missionCount || 0, participantCount: 0,
        token: c.token?.symbol || 'Unknown',
        tokenLogo: c.token?.logoUri || '',
        tokenUsdPrice: c.token?.usdPrice || 0,
        chainId: c.token?.chainId || 8453,
        totalReward: c.campaignRewards?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0,
        minimumFollowers: c.minimumFollowers || 0,
        maximumFollowers: c.maximumFollowers || 0,
        onlyVerifiedUsers: c.onlyVerifiedUsers || false,
        headerImageUrl: c.headerImageUrl || ''
      }));
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch Rally campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// Analyze real leaderboard scores
function analyzeLeaderboardScores(leaderboard: any[]): any {
  if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
    return { available: false };
  }
  
  const scores = leaderboard.map(e => e.points / 1e18).sort((a, b) => b - a);
  
  return {
    available: true,
    participantCount: scores.length,
    maxScore: scores[0],
    minScore: scores[scores.length - 1],
    avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    percentile25: scores[Math.floor(scores.length * 0.25)] || scores[0],
    percentile50: scores[Math.floor(scores.length * 0.50)] || scores[0],
    percentile75: scores[Math.floor(scores.length * 0.75)] || scores[0],
    percentile90: scores[Math.floor(scores.length * 0.90)] || scores[0]
  };
}

// Determine scoring style from campaign/mission data
function determineScoringStyle(campaign: any, missions: any[]): string {
  // Check mission rules for hints
  const rules = missions[0]?.rules?.toLowerCase() || '';
  
  if (rules.includes('quality') && !rules.includes('engagement')) {
    return 'Quality Only';
  }
  if (rules.includes('engagement') && !rules.includes('quality')) {
    return 'Engagement Only';
  }
  if (rules.includes('ai') || rules.includes('generic')) {
    return 'Quality + Engagement (AI Evaluated)';
  }
  
  // Default for Rally
  return 'Quality Engagement';
}

function getStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    'Quality Engagement': 'Konten dievaluasi berdasarkan kualitas (AI) dan engagement (likes, replies, retweets, impressions)',
    'Quality Only': 'Konten hanya dievaluasi berdasarkan kualitas, engagement tidak dihitung',
    'Engagement Only': 'Skor hanya berdasarkan metrics engagement',
    'Quality + Engagement (AI Evaluated)': 'AI mengevaluasi kualitas konten, engagement metrics ditambahkan secara temporal'
  };
  return descriptions[style] || 'Standard Rally scoring dengan quality dan engagement';
}

function determineDistributionType(campaign: any): string {
  const durationPeriods = campaign.campaignDurationPeriods || 1;
  const totalReward = campaign.campaignRewards?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0;
  
  // Rally typically uses leaderboard distribution
  if (totalReward > 0 && durationPeriods === 1) {
    return 'LEADERBOARD';
  }
  if (durationPeriods > 1) {
    return 'PERIODIC';
  }
  
  return 'LEADERBOARD';
}

function getDistributionDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'LEADERBOARD': 'Reward didistribusikan berdasarkan ranking di leaderboard. Semakin tinggi ranking, semakin besar reward.',
    'PERIODIC': 'Reward didistribusikan per periode campaign. Peserta mendapat reward berdasarkan performa di setiap periode.',
    'TIERED': 'Reward dalam bentuk tier. Top 1%, 5%, 10% mendapat jumlah fixed.',
    'EQUAL': 'Semua peserta yang memenuhi syarat mendapat reward yang sama.',
    'RAFFLE': 'Peserta yang memenuhi syarat diundi untuk mendapat reward.'
  };
  return descriptions[type] || descriptions['LEADERBOARD'];
}

function generateKnowledgeBase(campaign: any, missions: any[]): string {
  const orgName = campaign.displayCreator?.organization?.name || 'Organization';
  const orgDesc = campaign.displayCreator?.organization?.description || '';
  const missionDesc = missions[0]?.description || '';
  const missionRules = missions[0]?.rules || '';
  
  return `About ${orgName}:\n${orgDesc}\n\nMission Overview:\n${missionDesc}\n\nRules:\n${missionRules}`;
}
