import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address');
  
  try {
    const response = await fetch('https://app.rally.fun/api/campaigns', {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Rally API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (address) {
      let campaign = data.campaigns.find((c: any) => 
        c.intelligentContractAddress?.toLowerCase() === address.toLowerCase()
      );
      
      if (!campaign) {
        campaign = data.campaigns.find((c: any) => 
          c.id?.toLowerCase() === address.toLowerCase()
        );
      }
      
      if (!campaign && data.campaigns && data.campaigns.length > 0) {
        console.log('Campaign address not found, using first campaign for demo:', address);
        campaign = data.campaigns[0];
      }
      
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found', address }, { status: 404 });
      }
      
      // Fetch missions
      let missions = [];
      try {
        const missionsRes = await fetch(`https://app.rally.fun/api/missions?campaignAddress=${address}`);
        if (missionsRes.ok) {
          missions = await missionsRes.json();
        }
      } catch (e) {
        console.error('Failed to fetch missions:', e);
      }
      
      // Fetch participant count
      let participantCount = 0;
      try {
        const leaderboardRes = await fetch(`https://app.rally.fun/api/leaderboard?campaignAddress=${address}&limit=2000`);
        if (leaderboardRes.ok) {
          const leaderboardData = await leaderboardRes.json();
          participantCount = Array.isArray(leaderboardData) ? leaderboardData.length : 0;
        }
      } catch (e) {
        console.error('Failed to fetch participant count:', e);
      }
      
      // Get scoring type and distribution from campaign
      const scoringType = campaign.scoringType || campaign.scoreType || 'QUALITY_ENGAGEMENT';
      const distributionType = campaign.distributionType || 'LEADERBOARD';
      const criteria = campaign.criteria || campaign.contentCriteria || {};
      
      const detail = {
        id: campaign.id,
        title: campaign.title,
        intelligentContractAddress: campaign.intelligentContractAddress,
        
        // Creator info
        creator: campaign.displayCreator?.displayName || 'Unknown',
        creatorUsername: campaign.displayCreator?.xUsername || '',
        creatorAvatar: campaign.displayCreator?.avatarUrl || '',
        creatorProfile: campaign.displayCreator?.profileUrl || '',
        creatorVerified: campaign.displayCreator?.xVerified || false,
        
        // Organization/Brief
        brief: campaign.displayCreator?.organization?.description || campaign.description || '',
        organizationName: campaign.displayCreator?.organization?.name || '',
        organizationWebsite: campaign.displayCreator?.organization?.websiteUrl || '',
        organizationLogo: campaign.displayCreator?.organization?.logoUrl || '',
        
        // === BRIEFING SECTIONS ===
        // Style
        style: campaign.style || campaign.campaignStyle || 'Quality Engagement',
        styleDescription: campaign.styleDescription || 'Content is evaluated based on quality and engagement metrics',
        
        // Additional Information
        additionalInfo: campaign.additionalInfo || campaign.displayCreator?.organization?.additionalInfo || '',
        aboutOrganization: campaign.displayCreator?.organization?.about || '',
        
        // Knowledge Base
        knowledgeBase: campaign.knowledgeBase || campaign.contentGuidelines || getDefaultKnowledgeBase(campaign),
        
        // Content Evaluation Criteria
        contentEvaluationCriteria: campaign.contentEvaluationCriteria || getDefaultEvaluationCriteria(campaign),
        
        // Distribution Type
        distributionType: distributionType,
        distributionDescription: getDistributionDescription(distributionType),
        
        // Participation Requirements
        participationRequirements: {
          minimumFollowers: campaign.minimumFollowers || 0,
          maximumFollowers: campaign.maximumFollowers || 0,
          onlyVerifiedUsers: campaign.onlyVerifiedUsers || false,
          requiredChains: campaign.requiredChains || [],
          geoRestrictions: campaign.geoRestrictions || [],
          whitelistEnabled: campaign.whitelistEnabled || false,
        },
        
        // Scoring Configuration
        scoringType: scoringType,
        scoringDescription: getScoringDescription(scoringType),
        
        // Dates
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        campaignDurationPeriods: campaign.campaignDurationPeriods || 0,
        periodLengthDays: campaign.periodLengthDays || 1,
        
        // Stats
        missionCount: campaign.missionCount || missions.length,
        participantCount,
        
        // Token & Rewards
        token: campaign.token?.symbol || 'Unknown',
        tokenAddress: campaign.token?.address || '',
        tokenLogo: campaign.token?.logoUri || '',
        tokenUsdPrice: campaign.token?.usdPrice || 0,
        chainId: campaign.token?.chainId || 8453,
        totalReward: campaign.campaignRewards?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0,
        rewards: campaign.campaignRewards || [],
        
        // Images
        headerImageUrl: campaign.headerImageUrl || campaign.displayCreator?.organization?.defaultCampaignHeaderUrl || '',
        
        // User status
        participating: campaign.participating || false,
        userMissionProgress: campaign.userMissionProgress || 0,
        
        // Missions
        missions: missions.slice(0, 20).map((m: any) => ({
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
    
    // Return all campaigns
    const campaignPromises = data.campaigns.map(async (c: any) => {
      let participantCount = 0;
      
      const now = new Date();
      if (new Date(c.endDate) > now && c.intelligentContractAddress) {
        try {
          const lbRes = await fetch(`https://app.rally.fun/api/leaderboard?campaignAddress=${c.intelligentContractAddress}&limit=2000`);
          if (lbRes.ok) {
            const lbData = await lbRes.json();
            participantCount = Array.isArray(lbData) ? lbData.length : 0;
          }
        } catch (e) {}
      }
      
      return {
        id: c.id,
        title: c.title,
        intelligentContractAddress: c.intelligentContractAddress,
        creator: c.displayCreator?.displayName || 'Unknown',
        creatorUsername: c.displayCreator?.xUsername || '',
        creatorAvatar: c.displayCreator?.avatarUrl || '',
        creatorProfile: c.displayCreator?.profileUrl || '',
        creatorVerified: c.displayCreator?.xVerified || false,
        brief: c.displayCreator?.organization?.description || c.description || '',
        organizationName: c.displayCreator?.organization?.name || '',
        organizationWebsite: c.displayCreator?.organization?.websiteUrl || '',
        organizationLogo: c.displayCreator?.organization?.logoUrl || '',
        style: c.style || c.campaignStyle || 'Quality Engagement',
        distributionType: c.distributionType || 'LEADERBOARD',
        scoringType: c.scoringType || c.scoreType || 'QUALITY_ENGAGEMENT',
        startDate: c.startDate,
        endDate: c.endDate,
        campaignDurationPeriods: c.campaignDurationPeriods || 0,
        periodLengthDays: c.periodLengthDays || 1,
        missionCount: c.missionCount || 0,
        participantCount,
        token: c.token?.symbol || 'Unknown',
        tokenAddress: c.token?.address || '',
        tokenLogo: c.token?.logoUri || '',
        tokenUsdPrice: c.token?.usdPrice || 0,
        chainId: c.token?.chainId || 8453,
        totalReward: c.campaignRewards?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0,
        rewards: c.campaignRewards || [],
        minimumFollowers: c.minimumFollowers || 0,
        maximumFollowers: c.maximumFollowers || 0,
        onlyVerifiedUsers: c.onlyVerifiedUsers || false,
        headerImageUrl: c.headerImageUrl || c.displayCreator?.organization?.defaultCampaignHeaderUrl || '',
        participating: c.participating || false,
        userMissionProgress: c.userMissionProgress || 0,
      };
    });
    
    let campaigns = await Promise.all(campaignPromises);
    
    const now = new Date();
    campaigns = campaigns.filter((c: any) => new Date(c.endDate) > now);
    campaigns.sort((a: any, b: any) => b.participantCount - a.participantCount);
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch Rally campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// Helper functions
function getDefaultKnowledgeBase(campaign: any): string {
  const orgName = campaign?.displayCreator?.organization?.name || 'the organization';
  return `Welcome to ${orgName}'s campaign! This knowledge base provides essential information about our project and guidelines for creating quality content.\n\nPlease ensure your content aligns with our brand values and messaging. Focus on providing value to your audience while authentically representing our product/service.`;
}

function getDefaultEvaluationCriteria(campaign: any): any {
  return {
    contentAlignment: {
      name: 'Content Alignment',
      description: 'How well the content aligns with the campaign brief and objectives',
      maxScore: 2,
      weight: 'High'
    },
    informationAccuracy: {
      name: 'Information Accuracy',
      description: 'Accuracy of facts, claims, and information presented',
      maxScore: 2,
      weight: 'High'
    },
    campaignCompliance: {
      name: 'Campaign Compliance',
      description: 'Adherence to campaign rules and guidelines',
      maxScore: 2,
      weight: 'High'
    },
    originality: {
      name: 'Originality',
      description: 'Uniqueness and creativity of the content',
      maxScore: 2,
      weight: 'Medium'
    },
    engagementPotential: {
      name: 'Engagement Potential',
      description: 'Likelihood to generate meaningful engagement',
      maxScore: 5,
      weight: 'High'
    },
    technicalQuality: {
      name: 'Technical Quality',
      description: 'Quality of writing, visuals, and presentation',
      maxScore: 5,
      weight: 'Medium'
    },
    replyQuality: {
      name: 'Reply Quality',
      description: 'Quality and authenticity of replies to your content',
      maxScore: 5,
      weight: 'Medium'
    }
  };
}

function getDistributionDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'LEADERBOARD': 'Rewards are distributed based on leaderboard ranking. Higher rank = higher rewards. Top performers receive the largest share of the reward pool.',
    'EQUAL': 'All participants who meet the minimum criteria receive equal rewards regardless of ranking.',
    'TIERED': 'Rewards are distributed in tiers. Participants are grouped into tiers (e.g., Top 1%, Top 5%, Top 10%) and each tier receives a fixed reward amount.',
    'RAFFLE': 'Qualified participants are entered into a raffle. Winners are selected randomly from all eligible participants.',
    'FIRST_COME': 'Rewards are distributed on a first-come, first-served basis to participants who complete the campaign objectives.'
  };
  return descriptions[type] || 'Rewards are distributed based on your position in the leaderboard. The higher your rank, the more rewards you receive.';
}

function getScoringDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'QUALITY_ENGAGEMENT': 'Score is calculated based on content quality (Atemporal) and engagement metrics (Temporal). Quality is assessed by AI, while engagement considers likes, replies, retweets, impressions, and followers of repliers.',
    'ENGAGEMENT_ONLY': 'Score is based purely on engagement metrics including likes, replies, retweets, and impressions.',
    'QUALITY_ONLY': 'Score is based purely on content quality as assessed by AI evaluation of alignment, accuracy, compliance, and originality.',
    'MANUAL_REVIEW': 'Content is manually reviewed by the campaign organizer. Scores are assigned based on their evaluation.'
  };
  return descriptions[type] || 'Score combines content quality (Atemporal) and engagement performance (Temporal).';
}
