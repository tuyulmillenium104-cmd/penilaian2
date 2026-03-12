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
    const leaderboard = (Array.isArray(data) ? data : data.leaderboard || []).map((entry: any, index: number) => ({
      rank: entry.rank || index + 1,
      username: entry.xUsername || entry.username || 'Unknown',
      displayName: entry.displayName || entry.xDisplayName || entry.xUsername || 'Unknown',
      avatar: entry.avatarUrl || entry.xAvatarUrl || '',
      verified: entry.xVerified || false,
      totalPoints: (entry.totalPoints || entry.points || 0) / 1e18,
      topPercent: entry.topPercent || entry.topPercentage || 0,
      followersCount: entry.followersCount || entry.xFollowersCount || 0,
      totalSubmissions: entry.totalSubmissions || entry.submissionCount || 0
    }));
    
    return NextResponse.json({
      leaderboard,
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
