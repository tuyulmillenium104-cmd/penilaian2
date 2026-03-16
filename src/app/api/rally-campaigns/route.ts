import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address');
  
  try {
    // If address provided, fetch detailed campaign data
    if (address) {
      return await fetchCampaignDetail(address);
    }
    
    // Otherwise fetch all campaigns
    return await fetchAllCampaigns();
  } catch (error) {
    console.error('Failed to fetch Rally campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

async function fetchCampaignDetail(address: string) {
  // Fetch detailed campaign from Rally API
  const detailRes = await fetch(`https://app.rally.fun/api/campaigns/${address}`, {
    headers: { 'Accept': 'application/json' },
  });
  
  if (!detailRes.ok) {
    // Fallback to list endpoint
    return fetchCampaignFromList(address);
  }
  
  const campaign = await detailRes.json();
  
  // Fetch participant count from leaderboard
  let participantCount = 0;
  try {
    const leaderboardRes = await fetch(`https://app.rally.fun/api/leaderboard?campaignAddress=${campaign.intelligentContractAddress || address}&limit=2000`);
    if (leaderboardRes.ok) {
      const leaderboardData = await leaderboardRes.json();
      participantCount = Array.isArray(leaderboardData) ? leaderboardData.length : 0;
    }
  } catch (e) {
    console.error('Failed to fetch participant count:', e);
  }
  
  // Get primary reward (first claimable)
  const primaryReward = campaign.campaignRewards?.find((r: any) => r.claimable === true) || campaign.campaignRewards?.[0];
  const totalPrimaryReward = primaryReward?.totalAmount || 0;
  const primaryToken = primaryReward?.token?.symbol || campaign.token?.symbol || 'Unknown';
  
  // Format all rewards
  const rewards = (campaign.campaignRewards || []).map((r: any) => ({
    amount: r.totalAmount,
    token: r.token?.symbol || 'Unknown',
    tokenLogo: r.token?.logoUri || null,
    claimable: r.claimable !== false
  }));
  
  // Get organization from displayCreator
  const org = campaign.displayCreator?.organization || {};
  const creator = campaign.displayCreator || {};
  
  const detail = {
    id: campaign.id,
    title: campaign.title,
    intelligentContractAddress: campaign.intelligentContractAddress,
    
    // Creator info
    creator: creator.displayName || campaign.user?.xName || 'Unknown',
    creatorUsername: creator.xUsername || campaign.user?.xUsername || '',
    creatorAvatar: creator.avatarUrl || campaign.user?.xAvatar || '',
    creatorProfile: creator.profileUrl || '',
    creatorVerified: creator.xVerified || campaign.user?.xVerified || false,
    
    // Organization
    organizationName: org.name || '',
    organizationWebsite: org.websiteUrl || '',
    organizationLogo: org.logoUrl || '',
    organizationDescription: org.description || '',
    
    // Campaign details - THE KEY FIELDS!
    goal: campaign.goal || '',
    knowledgeBase: campaign.knowledgeBase || '',
    rules: campaign.rules || '',
    style: campaign.style || '',
    brief: org.description || '',  // For backward compatibility
    
    // Rewards
    token: primaryToken,
    tokenAddress: campaign.token?.address || '',
    tokenLogo: campaign.token?.logoUri || primaryReward?.token?.logoUri || '',
    tokenUsdPrice: campaign.token?.usdPrice || primaryReward?.token?.usdPrice || 0,
    chainId: campaign.token?.chainId || 8453,
    totalReward: totalPrimaryReward,
    rewards: rewards,
    
    // Stats
    missionCount: campaign.missionCount || campaign.missions?.length || 0,
    participantCount,
    
    // Requirements
    minimumFollowers: campaign.minimumFollowers || 0,
    maximumFollowers: campaign.maximumFollowers || 0,
    onlyVerifiedUsers: campaign.onlyVerifiedUsers || false,
    
    // Dates
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    campaignDurationPeriods: campaign.campaignDurationPeriods || 1,
    periodLengthDays: campaign.periodLengthDays || 14,
    
    // Images
    headerImageUrl: campaign.headerImageUrl || org.defaultCampaignHeaderUrl || '',
    
    // Status
    participating: campaign.participating || false,
    userMissionProgress: campaign.userMissionProgress || 0,
    
    // Missions
    missions: (campaign.missions || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description || '',
      rules: m.rules || '',
      active: m.active !== false
    }))
  };
  
  return NextResponse.json(detail);
}

async function fetchCampaignFromList(address: string) {
  const response = await fetch('https://app.rally.fun/api/campaigns', {
    headers: { 'Accept': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`Rally API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  let campaign = data.campaigns.find((c: any) => 
    c.intelligentContractAddress?.toLowerCase() === address.toLowerCase()
  );
  
  if (!campaign) {
    campaign = data.campaigns.find((c: any) => 
      c.id?.toLowerCase() === address.toLowerCase()
    );
  }
  
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found', address }, { status: 404 });
  }
  
  // Return basic info
  const org = campaign.displayCreator?.organization || {};
  const creator = campaign.displayCreator || {};
  const primaryReward = campaign.campaignRewards?.find((r: any) => r.claimable === true) || campaign.campaignRewards?.[0];
  
  return NextResponse.json({
    id: campaign.id,
    title: campaign.title,
    intelligentContractAddress: campaign.intelligentContractAddress,
    creator: creator.displayName || 'Unknown',
    creatorUsername: creator.xUsername || '',
    creatorAvatar: creator.avatarUrl || '',
    brief: org.description || '',
    organizationName: org.name || '',
    organizationWebsite: org.websiteUrl || '',
    organizationLogo: org.logoUrl || '',
    token: primaryReward?.token?.symbol || campaign.token?.symbol || 'Unknown',
    tokenAddress: campaign.token?.address || '',
    tokenLogo: campaign.token?.logoUri || primaryReward?.token?.logoUri || '',
    tokenUsdPrice: campaign.token?.usdPrice || 0,
    totalReward: primaryReward?.totalAmount || 0,
    rewards: (campaign.campaignRewards || []).map((r: any) => ({
      amount: r.totalAmount,
      token: r.token?.symbol || 'Unknown',
      tokenLogo: r.token?.logoUri || null,
      claimable: r.claimable !== false
    })),
    missionCount: campaign.missionCount || 0,
    participantCount: 0,
    minimumFollowers: campaign.minimumFollowers || 0,
    maximumFollowers: campaign.maximumFollowers || 0,
    onlyVerifiedUsers: campaign.onlyVerifiedUsers || false,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    headerImageUrl: campaign.headerImageUrl || org.defaultCampaignHeaderUrl || '',
    participating: campaign.participating || false,
    userMissionProgress: campaign.userMissionProgress || 0,
  });
}

async function fetchAllCampaigns() {
  const response = await fetch('https://app.rally.fun/api/campaigns', {
    headers: { 'Accept': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`Rally API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Process campaigns with participant count
  const campaignPromises = data.campaigns.map(async (c: any) => {
    let participantCount = 0;
    const now = new Date();
    
    // Only fetch leaderboard for active campaigns
    if (new Date(c.endDate) > now && c.intelligentContractAddress) {
      try {
        const lbRes = await fetch(`https://app.rally.fun/api/leaderboard?campaignAddress=${c.intelligentContractAddress}&limit=2000`);
        if (lbRes.ok) {
          const lbData = await lbRes.json();
          participantCount = Array.isArray(lbData) ? lbData.length : 0;
        }
      } catch (e) {}
    }
    
    // Get organization and creator
    const org = c.displayCreator?.organization || {};
    const creator = c.displayCreator || {};
    
    // Primary reward (first claimable)
    const primaryReward = c.campaignRewards?.find((r: any) => r.claimable === true) || c.campaignRewards?.[0];
    
    return {
      id: c.id,
      title: c.title,
      intelligentContractAddress: c.intelligentContractAddress,
      creator: creator.displayName || 'Unknown',
      creatorUsername: creator.xUsername || '',
      creatorAvatar: creator.avatarUrl || '',
      creatorProfile: creator.profileUrl || '',
      creatorVerified: creator.xVerified || false,
      brief: org.description || '',
      organizationName: org.name || '',
      organizationWebsite: org.websiteUrl || '',
      organizationLogo: org.logoUrl || '',
      token: primaryReward?.token?.symbol || c.token?.symbol || 'Unknown',
      tokenAddress: c.token?.address || '',
      tokenLogo: c.token?.logoUri || primaryReward?.token?.logoUri || '',
      tokenUsdPrice: c.token?.usdPrice || 0,
      chainId: c.token?.chainId || 8453,
      totalReward: primaryReward?.totalAmount || 0,
      rewards: (c.campaignRewards || []).map((r: any) => ({
        amount: r.totalAmount,
        token: r.token?.symbol || 'Unknown',
        tokenLogo: r.token?.logoUri || null,
        claimable: r.claimable !== false
      })),
      missionCount: c.missionCount || 0,
      participantCount,
      minimumFollowers: c.minimumFollowers || 0,
      maximumFollowers: c.maximumFollowers || 0,
      onlyVerifiedUsers: c.onlyVerifiedUsers || false,
      startDate: c.startDate,
      endDate: c.endDate,
      headerImageUrl: c.headerImageUrl || org.defaultCampaignHeaderUrl || '',
      participating: c.participating || false,
      userMissionProgress: c.userMissionProgress || 0,
    };
  });
  
  let campaigns = await Promise.all(campaignPromises);
  const now = new Date();
  
  // Filter active campaigns
  campaigns = campaigns.filter((c: any) => new Date(c.endDate) > now);
  
  // Sort by participant count (most popular first)
  campaigns.sort((a: any, b: any) => b.participantCount - a.participantCount);
  
  return NextResponse.json(campaigns);
}
