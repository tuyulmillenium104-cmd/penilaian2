import math

print("="*60)
print("RALLY SCORING - MAXIMUM THEORETICAL CALCULATION")
print("="*60)

# From Rally docs - the formula
# Campaign_Points = M_gate × Σ(W[i] × normalized_metrics[i])

# GATE MULTIPLIER
print("\n1. GATE MULTIPLIER")
print("-"*40)
g1 = g2 = g3 = g4 = 2.0  # MAX
g_star = (g1 + g2 + g3 + g4) / 4  # = 2.0
m_gate = 1 + 0.5 * (g_star - 1)  # = 1.50
print(f"   All Gates = 2.0 → g_star = {g_star}")
print(f"   M_gate = 1 + 0.5×(2.0-1) = {m_gate}x (MAXIMUM)")

# QUALITY METRICS (0-5 scale)
print("\n2. QUALITY METRICS")
print("-"*40)
ep = 5.0  # MAX
tq = 5.0  # MAX
ep_norm = ep / 5.0  # = 1.0
tq_norm = tq / 5.0  # = 1.0
print(f"   EP = 5.0 → normalized = {ep_norm}")
print(f"   TQ = 5.0 → normalized = {tq_norm}")

# ENGAGEMENT METRICS (log-scaled)
print("\n3. ENGAGEMENT METRICS (for max, assume viral)")
print("-"*40)
# Assuming extremely viral tweet: 1000 RT, 10000 LK, 500 RP, QR=1.0, FR=1000000
rt = math.log(1000 + 1) / 10  # normalize
lk = math.log(10000 + 1) / 10
rp = math.log(500 + 1) / 10
qr = 1.0  # MAX
fr = math.log(1000000 + 1) / 15  # different scale for FR

print(f"   RT: log(1000+1)/10 = {rt:.3f}")
print(f"   LK: log(10000+1)/10 = {lk:.3f}")
print(f"   RP: log(500+1)/10 = {rp:.3f}")
print(f"   QR: 1.0 (MAX)")
print(f"   FR: log(1M+1)/15 = {fr:.3f}")

# WEIGHTS from Argue.fun campaign
print("\n4. CAMPAIGN WEIGHTS")
print("-"*40)
weights = [0.6, 0.5, 0.7, 0.6, 0.6, 0.6, 0.7]
metrics = [ep_norm, tq_norm, rt, lk, rp, qr, fr]
names = ['EP', 'TQ', 'RT', 'LK', 'RP', 'QR', 'FR']

total = 0
for i, (n, w, m) in enumerate(zip(names, weights, metrics)):
    weighted = w * m
    total += weighted
    print(f"   {n}: {m:.3f} × {w} = {weighted:.3f}")

print(f"\n   Sum of weighted metrics: {total:.3f}")

# FINAL CALCULATION
print("\n5. MAXIMUM CAMPAIGN POINTS")
print("-"*40)
max_cp = m_gate * total
print(f"   Campaign Points = {m_gate} × {total:.3f} = {max_cp:.3f}")

# Compare with Rank #1
print("\n" + "="*60)
print("COMPARISON")
print("="*60)
rank1_avg = 7.15
target_2x = rank1_avg * 2

print(f"\n   Rank #1 average per submission: {rank1_avg:.2f}")
print(f"   User target (2x above): {target_2x:.2f}")
print(f"   Maximum theoretical score: {max_cp:.2f}")
print(f"   Maximum on Rally (0-10 scale): ~10.00")

if target_2x > max_cp:
    print(f"\n   ❌ TARGET {target_2x:.1f} IS IMPOSSIBLE")
    print(f"   Rally scoring maxes out around 10, not {target_2x:.1f}")
    print(f"\n   BUT: We can aim for TOP 1 position!")
    print(f"   To beat Rank #1 (7.15): need {rank1_avg:.2f}+")
    print(f"   Maximum achievable: {max_cp:.2f}")

print(f"\n" + "="*60)
print("REALISTIC GOAL")
print("="*60)
print(f"""
THEORETICAL MAX: {max_cp:.2f} points
RANK #1 CURRENT: {rank1_avg:.2f} points
GAP TO BEAT: {(rank1_avg/max_cp)*100:.0f}% of max needed

TO BEAT RANK #1:
1. All gates = 2.0 (M_gate = 1.50x) ✓
2. Quality metrics = 5.0 ✓
3. Need VIRAL engagement (RT, LK, RP high)
4. Need high FR (followers of repliers)

YOUR CONTENT MUST:
- Pass all gates with 2.0
- Have perfect quality score
- GO VIRAL for engagement metrics
""")

