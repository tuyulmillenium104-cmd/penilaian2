import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaignAddress = searchParams.get('campaignAddress');
  const limit = parseInt(searchParams.get('limit') || '100');
  
  try {
    // First, get the campaign info to know total participants and rewards
    let totalParticipants = 0;
    let campaignRewards: any[] = [];
    let primaryReward: any = null;
    let totalReward = 0;
    let token = 'Unknown';
    let tokenUsdPrice = 0;
    let alpha = 3; // Default distribution curve
    
    if (campaignAddress) {
      try {
        const campaignResponse = await fetch(`https://app.rally.fun/api/campaigns/${campaignAddress}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (campaignResponse.ok) {
          const campaignData = await campaignResponse.json();
          // Use lastSyncedSubmissionCount as total participants estimate
          totalParticipants = campaignData.lastSyncedSubmissionCount || campaignData.participantCount || 0;
          campaignRewards = campaignData.campaignRewards || [];
          alpha = campaignData.alpha || 3;
          
          // Get primary reward
          primaryReward = campaignRewards.find((r: any) => r.claimable === true) || campaignRewards[0];
          totalReward = primaryReward?.totalAmount || 0;
          token = primaryReward?.token?.symbol || campaignData.token?.symbol || 'Unknown';
          tokenUsdPrice = campaignData.token?.usdPrice || 0;
        }
      } catch (e) {
        console.error('Failed to fetch campaign info:', e);
      }
    }
    
    // Then get the leaderboard
    let url = 'https://app.rally.fun/api/leaderboard';
    if (campaignAddress) {
      url += `?campaignAddress=${campaignAddress}&limit=${limit}`;
    } else {
      url += `?limit=${limit}`;
    }
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Rally API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform data
    const rawData = Array.isArray(data) ? data : data.leaderboard || [];
    
    // Use actual total participants from campaign, or fallback to leaderboard length
    if (totalParticipants === 0) {
      totalParticipants = data.total || rawData.length;
    }
    
    const leaderboard = rawData.map((entry: any, index: number) => {
      const rank = entry.rank || index + 1;
      // Calculate topPercent based on actual total participants
      const topPercent = totalParticipants > 0 ? (rank / totalParticipants) * 100 : 0;
      
      // Get user data from nested user object
      const userData = entry.user || {};
      
      // Calculate estimated reward based on rank (power law distribution with alpha)
      let estimatedReward = 0;
      if (totalReward > 0 && totalParticipants > 0) {
        // Power law distribution: reward proportional to rank^(-alpha)
        // Simplified estimation based on percentile
        if (topPercent <= 1) estimatedReward = totalReward * 0.20;
        else if (topPercent <= 5) estimatedReward = totalReward * 0.10;
        else if (topPercent <= 10) estimatedReward = totalReward * 0.05;
        else if (topPercent <= 25) estimatedReward = totalReward * 0.02;
        else if (topPercent <= 50) estimatedReward = totalReward * 0.01;
        else estimatedReward = totalReward * 0.005;
        // Divide by number of periods (typically 1-3)
        estimatedReward = estimatedReward / (1 || 1);
      }
      
      return {
        rank,
        username: userData.xUsername || entry.xUsername || entry.username || 'Unknown',
        displayName: userData.xName || entry.xName || entry.displayName || userData.xUsername || 'Unknown',
        avatar: userData.xAvatar || entry.xAvatar || entry.avatarUrl || '',
        verified: userData.xVerified || entry.xVerified || false,
        // Rally returns scores in atto format (10^-18), convert to 0-10 scale
        totalPoints: (entry.totalPoints || entry.points || 0) / 1e18,
        topPercent: topPercent,
        followersCount: userData.xFollowersCount || entry.followersCount || 0,
        totalSubmissions: entry.totalSubmissions || entry.submissionCount || 0,
        // Reward estimation
        estimatedReward: Math.round(estimatedReward * 100) / 100,
        token: token
      };
    });
    
    return NextResponse.json({
      leaderboard,
      total: totalParticipants,
      // Campaign reward info
      campaignInfo: {
        totalReward,
        token,
        tokenUsdPrice,
        rewards: campaignRewards.map((r: any) => ({
          amount: r.totalAmount,
          token: r.token?.symbol || 'Unknown',
          tokenLogo: r.token?.logoUri || null,
          claimable: r.claimable !== false
        })),
        alpha
      }
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
