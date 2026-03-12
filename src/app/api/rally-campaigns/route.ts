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
  
  // Calculate primary reward (first claimable token)
  const primaryReward = campaign.campaignRewards?.find((r: any) => r.claimable === true) || campaign.campaignRewards?.[0];
  const totalPrimaryReward = primaryReward?.totalAmount || 0;
  const primaryToken = primaryReward?.token?.symbol || campaign.token?.symbol || 'Unknown';
  
  // Format all rewards for display
  const rewards = (campaign.campaignRewards || []).map((r: any) => ({
    amount: r.totalAmount,
    token: r.token?.symbol || 'Unknown',
    tokenLogo: r.token?.logoUri || null,
    claimable: r.claimable !== false
  }));
  
  const detail = {
    id: campaign.id,
    title: campaign.title,
    intelligentContractAddress: campaign.intelligentContractAddress,
    
    // Creator info
    creator: campaign.displayCreator?.displayName || campaign.user?.xName || 'Unknown',
    creatorUsername: campaign.displayCreator?.xUsername || campaign.user?.xUsername || '',
    creatorAvatar: campaign.displayCreator?.avatarUrl || campaign.user?.xAvatar || '',
    creatorProfile: campaign.displayCreator?.profileUrl || '',
    creatorVerified: campaign.displayCreator?.xVerified || campaign.user?.xVerified || false,
    
    // Organization
    organizationName: campaign.displayCreator?.organization?.name || '',
    organizationWebsite: campaign.displayCreator?.organization?.websiteUrl || '',
    organizationLogo: campaign.displayCreator?.organization?.logoUrl || '',
    organizationDescription: campaign.displayCreator?.organization?.description || '',
    
    // Campaign details - THESE ARE THE KEY FIELDS!
    goal: campaign.goal || '',  // Main description/brief
    knowledgeBase: campaign.knowledgeBase || '',
    rules: campaign.rules || '',
    style: campaign.style || '',
    
    // Rewards - FIXED!
    token: primaryToken,
    tokenAddress: campaign.token?.address || '',
    tokenLogo: campaign.token?.logoUri || '',
    tokenUsdPrice: campaign.token?.usdPrice || 0,
    chainId: campaign.token?.chainId || 8453,
    totalReward: totalPrimaryReward,  // Primary reward only
    rewards: rewards,  // All rewards for display
    
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
    headerImageUrl: campaign.headerImageUrl || campaign.displayCreator?.organization?.defaultCampaignHeaderUrl || '',
    
    // Status
    participating: campaign.participating || false,
    userMissionProgress: campaign.userMissionProgress || 0,
    
    // Missions - with full details
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
  return NextResponse.json({
    id: campaign.id,
    title: campaign.title,
    intelligentContractAddress: campaign.intelligentContractAddress,
    creator: campaign.displayCreator?.displayName || 'Unknown',
    creatorUsername: campaign.displayCreator?.xUsername || '',
    creatorAvatar: campaign.displayCreator?.avatarUrl || '',
    token: campaign.token?.symbol || 'Unknown',
    tokenLogo: campaign.token?.logoUri || '',
    totalReward: campaign.campaignRewards?.[0]?.totalAmount || 0,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    missionCount: campaign.missionCount || 0,
    headerImageUrl: campaign.headerImageUrl || '',
    minimumFollowers: campaign.minimumFollowers || 0,
    onlyVerifiedUsers: campaign.onlyVerifiedUsers || false
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
    
    if (new Date(c.endDate) > now && c.intelligentContractAddress) {
      try {
        const lbRes = await fetch(`https://app.rally.fun/api/leaderboard?campaignAddress=${c.intelligentContractAddress}&limit=2000`);
        if (lbRes.ok) {
          const lbData = await lbRes.json();
          participantCount = Array.isArray(lbData) ? lbData.length : 0;
        }
      } catch (e) {}
    }
    
    // Primary reward (first claimable)
    const primaryReward = c.campaignRewards?.find((r: any) => r.claimable === true) || c.campaignRewards?.[0];
    
    return {
      id: c.id,
      title: c.title,
      intelligentContractAddress: c.intelligentContractAddress,
      creator: c.displayCreator?.displayName || 'Unknown',
      creatorUsername: c.displayCreator?.xUsername || '',
      creatorAvatar: c.displayCreator?.avatarUrl || '',
      creatorProfile: c.displayCreator?.profileUrl || '',
      creatorVerified: c.displayCreator?.xVerified || false,
      brief: c.displayCreator?.organization?.description || '',
      organizationName: c.displayCreator?.organization?.name || '',
      organizationWebsite: c.displayCreator?.organization?.websiteUrl || '',
      organizationLogo: c.displayCreator?.organization?.logoUrl || '',
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
}
