import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://rally-staging.vercel.app/api/campaigns', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Rally API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return campaigns with all relevant data
    const campaigns = data.campaigns.map((c: any) => ({
      id: c.id,
      title: c.title,
      creator: c.displayCreator?.displayName || 'Unknown',
      creatorUsername: c.displayCreator?.xUsername || '',
      creatorAvatar: c.displayCreator?.avatarUrl || '',
      creatorProfile: c.displayCreator?.profileUrl || '',
      startDate: c.startDate,
      endDate: c.endDate,
      missionCount: c.missionCount,
      token: c.token?.symbol || 'Unknown',
      tokenAddress: c.token?.address || '',
      chainId: c.token?.chainId || 84532,
      totalReward: c.campaignRewards?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0,
      rewards: c.campaignRewards || [],
      headerImageUrl: c.headerImageUrl,
      minimumFollowers: c.minimumFollowers || 0,
      maximumFollowers: c.maximumFollowers || 0,
      onlyVerifiedUsers: c.onlyVerifiedUsers || false,
      participating: c.participating || false,
      userMissionProgress: c.userMissionProgress || 0,
      campaignDurationPeriods: c.campaignDurationPeriods || 0,
      periodLengthDays: c.periodLengthDays || 1,
      intelligentContractAddress: c.intelligentContractAddress,
    }));
    
    // Filter active campaigns (endDate > now)
    const now = new Date();
    const activeCampaigns = campaigns.filter((c: any) => new Date(c.endDate) > now);
    
    return NextResponse.json(activeCampaigns);
  } catch (error) {
    console.error('Failed to fetch Rally campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
