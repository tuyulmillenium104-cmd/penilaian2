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
    
    // Return campaigns with relevant data
    const campaigns = data.campaigns.map((c: any) => ({
      id: c.id,
      title: c.title,
      creator: c.displayCreator?.displayName || 'Unknown',
      creatorUsername: c.displayCreator?.xUsername || '',
      startDate: c.startDate,
      endDate: c.endDate,
      missionCount: c.missionCount,
      token: c.token?.symbol || 'Unknown',
      totalReward: c.campaignRewards?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0,
      headerImageUrl: c.headerImageUrl,
      organizationDescription: c.displayCreator?.organization?.description || '',
      organizationWebsite: c.displayCreator?.organization?.websiteUrl || '',
    }));
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch Rally campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
