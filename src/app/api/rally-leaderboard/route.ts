import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaignAddress = searchParams.get('campaignAddress');
  const limit = parseInt(searchParams.get('limit') || '100');
  
  try {
    // First, get the campaign info to know total participants
    let totalParticipants = 0;
    if (campaignAddress) {
      try {
        const campaignResponse = await fetch(`https://app.rally.fun/api/campaigns/${campaignAddress}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (campaignResponse.ok) {
          const campaignData = await campaignResponse.json();
          // Use lastSyncedSubmissionCount as total participants estimate
          // This represents total submissions in the campaign
          totalParticipants = campaignData.lastSyncedSubmissionCount || campaignData.participantCount || 0;
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
      // Rank 1 of 815 = 0.12% (Top 0.1%)
      const topPercent = totalParticipants > 0 ? (rank / totalParticipants) * 100 : 0;
      
      return {
        rank,
        username: entry.xUsername || entry.username || 'Unknown',
        displayName: entry.displayName || entry.xDisplayName || entry.xUsername || 'Unknown',
        avatar: entry.avatarUrl || entry.xAvatarUrl || '',
        verified: entry.xVerified || false,
        // Rally returns scores in atto format (10^-18), convert to 0-10 scale
        totalPoints: (entry.totalPoints || entry.points || 0) / 1e18,
        topPercent: topPercent,
        followersCount: entry.followersCount || entry.xFollowersCount || 0,
        totalSubmissions: entry.totalSubmissions || entry.submissionCount || 0
      };
    });
    
    return NextResponse.json({
      leaderboard,
      total: totalParticipants
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
