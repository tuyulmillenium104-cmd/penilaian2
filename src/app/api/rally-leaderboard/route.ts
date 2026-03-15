import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaignAddress = searchParams.get('campaignAddress');
  const limit = parseInt(searchParams.get('limit') || '100');
  
  try {
    // First, get the campaign info to know total participants and rewards
    let totalParticipants = 0;
    let missionCount = 0;
    let campaignRewards: any[] = [];
    let primaryReward: any = null;
    let totalReward = 0;
    let token = 'Unknown';
    let tokenUsdPrice = 0;
    let tokenDecimals = 18;
    let alpha = 3; // Distribution parameter
    
    if (campaignAddress) {
      try {
        const campaignResponse = await fetch(`https://app.rally.fun/api/campaigns/${campaignAddress}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (campaignResponse.ok) {
          const campaignData = await campaignResponse.json();
          // Use lastSyncedSubmissionCount as total participants
          totalParticipants = campaignData.lastSyncedSubmissionCount || campaignData.participantCount || 0;
          missionCount = campaignData.missionCount || campaignData.missions?.length || 1;
          campaignRewards = campaignData.campaignRewards || [];
          alpha = campaignData.alpha || 3;
          
          // Get primary reward (first claimable or first available)
          primaryReward = campaignRewards.find((r: any) => r.claimable === true) || campaignRewards[0];
          totalReward = primaryReward?.totalAmount || 0;
          token = primaryReward?.token?.symbol || 'Unknown';
          tokenUsdPrice = primaryReward?.token?.usdPrice || 0;
          tokenDecimals = primaryReward?.token?.decimals || 18;
        }
      } catch (e) {
        console.error('Failed to fetch campaign info:', e);
      }
    }
    
    // Get the leaderboard
    let url = 'https://app.rally.fun/api/leaderboard';
    if (campaignAddress) {
      url += `?campaignAddress=${campaignAddress}&limit=1000`;
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
    
    // Update total participants from actual leaderboard if not set
    if (totalParticipants === 0) {
      totalParticipants = rawData.length;
    }
    
    // Calculate sum of POINTS (not total) for Rally's ranking
    let totalPointsSum = 0;
    rawData.forEach((entry: any) => {
      totalPointsSum += Number(entry.points || 0);
    });
    
    // Build leaderboard using Rally's original ranking (by base points)
    const leaderboard = rawData.map((entry: any) => {
      // Use Rally's rank directly - they rank by base points
      const rank = entry.rank;
      
      // Convert from atto (10^-18) to readable format
      const basePoints = Number(entry.points || 0) / 1e18;
      const referralBonus = Number(entry.referralBonus || 0) / 1e18;
      const totalScore = basePoints + referralBonus;
      
      // Calculate top percent based on rank and total participants
      const topPercent = totalParticipants > 0 ? (rank / totalParticipants) * 100 : 0;
      
      // Get user data from nested user object
      const userData = entry.user || {};
      
      // Calculate estimated reward using proportional distribution based on POINTS (not total)
      // This matches Rally's ranking methodology
      let estimatedReward = 0;
      if (totalReward > 0 && totalPointsSum > 0) {
        estimatedReward = totalReward * (Number(entry.points || 0) / totalPointsSum);
      }
      
      return {
        rank,
        username: userData.xUsername || entry.username || 'Unknown',
        displayName: userData.xName || userData.xUsername || entry.username || 'Unknown',
        avatar: userData.xAvatar || '',
        verified: userData.xVerified || false,
        followersCount: userData.xFollowersCount || 0,
        // Base points from all submissions (what Rally ranks by)
        basePoints: Math.round(basePoints * 100) / 100,
        // Referral bonus
        referralBonus: Math.round(referralBonus * 100) / 100,
        // Total score (base + referral) - for display only
        totalPoints: Math.round(totalScore * 100) / 100,
        // Stats
        topPercent: Math.round(topPercent * 100) / 100,
        totalSubmissions: entry.totalSubmissions || 0,
        // Reward estimation based on base points (matches Rally ranking)
        estimatedReward: Math.round(estimatedReward * 100) / 100,
        token: token,
        tokenUsdPrice
      };
    });
    
    // Sort by Rally's rank (ascending)
    const sortedLeaderboard = leaderboard
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit);
    
    // Calculate stats
    const topScore = sortedLeaderboard[0]?.totalPoints || 0;
    const avgScore = sortedLeaderboard.length > 0 
      ? sortedLeaderboard.reduce((sum, e) => sum + e.totalPoints, 0) / sortedLeaderboard.length 
      : 0;
    const avgSubmissions = sortedLeaderboard.length > 0
      ? sortedLeaderboard.reduce((sum, e) => sum + e.totalSubmissions, 0) / sortedLeaderboard.length
      : 0;
    
    return NextResponse.json({
      leaderboard: sortedLeaderboard,
      total: totalParticipants,
      missionCount,
      stats: {
        topScore: Math.round(topScore * 100) / 100,
        avgScore: Math.round(avgScore * 100) / 100,
        avgSubmissions: Math.round(avgSubmissions * 10) / 10,
        participantsWithSubmissions: rawData.length,
        totalRewardPool: totalReward
      },
      // Campaign reward info
      campaignInfo: {
        totalReward,
        token,
        tokenUsdPrice,
        tokenDecimals,
        alpha,
        rewards: campaignRewards.map((r: any) => ({
          amount: r.totalAmount,
          token: r.token?.symbol || 'Unknown',
          tokenLogo: r.token?.logoUri || null,
          claimable: r.claimable !== false
        }))
      }
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
