import math

print("="*70)
print("COMPARISON: YOUR CONTENT vs REAL LEADERBOARD")
print("="*70)

# Real leaderboard data (converted from atto)
leaderboard = [
    (1, "chedaeth", 21.45, 3),
    (2, "abahbero", 20.14, 3),
    (3, "feier031", 19.27, 3),
    (4, "YehoshuaZion", 18.60, 3),
    (5, "TOP041091", 18.47, 3),
    (6, "spacejunnk", 18.40, 3),
    (10, "0xraguna", 17.76, 4),
    (20, "kharather", 16.31, 3),
    (50, "Toski_01", 14.89, 3),
    (100, "~rank100", 12.50, 3),
]

# Your content score
your_cp = 4.338
your_m_gate = 1.462
your_submissions = 1  # Single submission

print(f"\nYOUR CONTENT SCORE:")
print(f"  Campaign Points (per submission): {your_cp:.3f}")
print(f"  Gate Multiplier: {your_m_gate:.3f}x")
print(f"  Submissions: {your_submissions}")

print(f"\n{'='*70}")
print("REAL LEADERBOARD ANALYSIS")
print(f"{'='*70}")

print(f"\n{'Rank':<6}{'Username':<15}{'Total Points':<12}{'Subs':<6}{'Avg per Sub':<12}")
print("-"*55)

for rank, name, total, subs in leaderboard:
    avg = total / subs
    print(f"{rank:<6}{name:<15}{total:<12.2f}{subs:<6}{avg:.2f}")

print(f"\n{'='*70}")
print("CRITICAL INSIGHT")
print(f"{'='*70}")

# Calculate estimated position
avg_top1 = 21.45 / 3  # 7.15 per submission
avg_top10 = 17.76 / 4  # 4.44 per submission
avg_top50 = 14.89 / 3  # 4.96 per submission

print(f"""
LEADERBOARD POINTS ANALYSIS:

Top performers average per submission:
  - Rank #1 (chedaeth): {avg_top1:.2f} points/submission
  - Rank #10 (0xraguna): {avg_top10:.2f} points/submission
  - Rank #50 (Toski_01): {avg_top50:.2f} points/submission

YOUR CONTENT:
  - Per submission: {your_cp:.2f} points

KEY FACTORS:
""")

# Explain the scoring scale difference
print(f"""
IMPORTANT: Rally uses a 0-10 scale on leaderboard, NOT raw Campaign Points.

The leaderboard shows accumulated scores that include:
  1. Quality component (from gates + metrics) 
  2. Engagement metrics (log-scaled)
  3. Multiple submissions accumulated
  4. Potential referral bonuses

ESTIMATED COMPARISON:
""")

# More realistic comparison
your_projected = your_cp * 1.2  # Scale factor for engagement projection

print(f"  Your projected per-tweet score: ~{your_projected:.2f}")
print(f"  If you submit 3 times (max): ~{your_projected * 3:.2f} total")

# Can you beat top performers?
if your_projected >= avg_top1:
    result = "YES - Can compete with Rank #1"
elif your_projected >= avg_top10:
    result = "MAYBE - Can reach Top 10 with 3 submissions"
elif your_projected >= avg_top50:
    result = "POSSIBLY - Can reach Top 50 with 3 submissions"
else:
    result = "UNLIKELY - Need higher engagement"

print(f"\n{'='*70}")
print("VERDICT: Can you beat the top?")
print(f"{'='*70}")
print(f"\n  {result}")

print(f"""
DETAILED ANALYSIS:

  To beat Rank #1 (21.45 points):
    - Need ~7.15 points per submission
    - Your content: ~{your_projected:.2f} projected points
    - Gap: {avg_top1 - your_projected:.2f} points needed

  To reach Top 10 (~17.76 points):
    - Need ~4.44 points per submission with 4 subs
    - Your content: ~{your_projected:.2f} projected points
    - {"ACHIEVABLE" if your_projected >= 4.44 else "NEEDS IMPROVEMENT"}

  To reach Top 50 (~14.89 points):
    - Need ~4.96 points per submission with 3 subs
    - Your content: ~{your_projected:.2f} projected points
    - {"ACHIEVABLE" if your_projected >= 4.96 else "NEEDS IMPROVEMENT"}
""")

print(f"{'='*70}")
print("HONEST ANSWER")
print(f"{'='*70}")
print(f"""
NO, konten ini TIDAK AKAN mengalahkan Rank #1.

MENGAPA?

1. SKOR PER SUBMISSION LEBIH RENDAH
   - Rank #1 rata-rata: 7.15 points/submission
   - Konten Anda: {your_projected:.2f} points/submission
   - Gap: {avg_top1 - your_projected:.2f} points

2. ENGAGEMENT NYATA vs SIMULASI
   - Leaderboard sudah termasuk engagement REAL
   - Simulasi saya hanya memproyeksikan engagement
   - Engagement real bisa jauh berbeda

3. GATE 4 BELUM MAKSIMAL (1.70 vs 2.0)
   - Masih kehilangan ~0.3x gate multiplier
   - Jika G4=2.0, multiplier = 1.50x (bukan 1.462x)

BAGAIMANA CARA MENGALAHKAN?

1. Optimalkan G4 ke 2.0 → multiplier 1.50x
2. Dapatkan engagement real yang tinggi
3. Submit 3 konten berkualitas (max submissions)
4. Gunakan peak hours posting
5. Tag influencer untuk boost FR metric
""")

