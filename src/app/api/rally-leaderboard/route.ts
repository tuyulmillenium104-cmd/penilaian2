import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaignAddress = searchParams.get('campaignAddress');
  const limit = parseInt(searchParams.get('limit') || '100');
  
  try {
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
    const totalParticipants = data.total || rawData.length;
    
    const leaderboard = rawData.map((entry: any, index: number) => {
      const rank = entry.rank || index + 1;
      // Calculate topPercent based on rank and total participants
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
