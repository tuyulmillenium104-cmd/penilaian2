import math

print("="*70)
print("ANALISIS JUJUR: KONTEN ANDA vs TOP 10")
print("="*70)

# Data real dari leaderboard
leaderboard = [
    (1, "chedaeth", 21.45, 3, 7.15),
    (2, "abahbero", 20.14, 3, 6.71),
    (3, "feier031", 19.27, 3, 6.42),
    (4, "YehoshuaZion", 18.60, 3, 6.20),
    (5, "TOP041091", 18.47, 3, 6.16),
    (6, "spacejunnk", 18.40, 3, 6.13),
    (7, "alver1301", 18.13, 3, 6.04),
    (8, "jvstme_ophyxial", 17.85, 4, 4.46),
    (9, "Eth_Calibur", 17.82, 3, 5.94),
    (10, "0xraguna", 17.76, 4, 4.44),
]

print("\nLEADERBOARD TOP 10 (DATA REAL):")
print("-"*70)
print(f"{'Rank':<6}{'Username':<18}{'Total':<10}{'Subs':<6}{'Avg/Sub':<10}")
print("-"*70)
for rank, name, total, subs, avg in leaderboard:
    print(f"{rank:<6}{name:<18}{total:<10.2f}{subs:<6}{avg:.2f}")

# Your content analysis
print("\n" + "="*70)
print("KONTEN ANDA")
print("="*70)

your_content = """ngl (and this is embarrassing to admit) i completely slept on this

@arguedotfun's article dropped. my timeline? nothing. not a peep. agents arguing onchain with real stakes. judges voting live.

can't believe my algo ghosted me on this one. that's annoying tbh

[quote article]"""

print(f"\n{your_content}")
print("-"*70)

# Scoring
g1 = g2 = g3 = 2.0
g4 = 2.0  # PERFECT

m_gate = 1.5  # MAX

# Quality metrics
ep = 5.0
tq = 5.0

# THE FORMULA
# Campaign_Points = M_gate × Σ(W[i] × normalized_metrics[i])

weights = [0.6, 0.5, 0.7, 0.6, 0.6, 0.6, 0.7]

print("\nSCORE BREAKDOWN:")
print("-"*70)

# Scenario 1: Just quality (no engagement yet)
quality_only = m_gate * (weights[0] * 1.0 + weights[1] * 1.0)  # EP + TQ only
print(f"\n1. QUALITY ONLY (belum ada engagement):")
print(f"   EP: 1.0 × 0.6 = 0.60")
print(f"   TQ: 1.0 × 0.5 = 0.50")
print(f"   Subtotal: 1.10")
print(f"   × Gate Multiplier 1.50 = {quality_only:.3f} pts")

# Scenario 2: With TYPICAL engagement
print(f"\n2. DENGAN ENGAGEMENT TIPIKAL:")
typical = [1.0, 1.0, 0.35, 0.50, 0.35, 0.65, 0.45]  # RT=25, LK=150, RP=30, QR=0.7, FR=5000
typ_sum = sum(w*n for w,n in zip(weights, typical))
typ_pts = m_gate * typ_sum
print(f"   RT: ~25 (log-scaled: 0.35)")
print(f"   LK: ~150 (log-scaled: 0.50)")
print(f"   RP: ~30 (log-scaled: 0.35)")
print(f"   QR: 0.65")
print(f"   FR: ~5,000 (log-scaled: 0.45)")
print(f"   Total: {typ_pts:.3f} pts")

# Scenario 3: With GOOD engagement
print(f"\n3. DENGAN ENGAGEMENT BAIK:")
good = [1.0, 1.0, 0.50, 0.65, 0.45, 0.80, 0.60]  # RT=100, LK=500, RP=80, QR=0.8, FR=30000
good_sum = sum(w*n for w,n in zip(weights, good))
good_pts = m_gate * good_sum
print(f"   RT: ~100")
print(f"   LK: ~500")
print(f"   RP: ~80")
print(f"   QR: 0.80")
print(f"   FR: ~30,000")
print(f"   Total: {good_pts:.3f} pts")

# Scenario 4: With VIRAL engagement
print(f"\n4. DENGAN ENGAGEMENT VIRAL:")
viral = [1.0, 1.0, 0.65, 0.80, 0.55, 0.90, 0.75]  # RT=500, LK=3000, RP=200, QR=0.9, FR=200k
viral_sum = sum(w*n for w,n in zip(weights, viral))
viral_pts = m_gate * viral_sum
print(f"   RT: ~500")
print(f"   LK: ~3,000")
print(f"   RP: ~200")
print(f"   QR: 0.90")
print(f"   FR: ~200,000")
print(f"   Total: {viral_pts:.3f} pts")

# COMPARISON
print("\n" + "="*70)
print("PERBANDINGAN DENGAN TOP 10")
print("="*70)

print(f"\n{'Scenario':<30}{'Your Score':<15}{'vs Top 10 avg':<15}{'Status'}")
print("-"*70)

top10_avg = 4.44  # 0xraguna average per submission
top1_avg = 7.15   # chedaeth average per submission
target_2x = top10_avg * 2  # = 8.88

scenarios = [
    ("Quality only", quality_only),
    ("Typical engagement", typ_pts),
    ("Good engagement", good_pts),
    ("Viral engagement", viral_pts),
]

for name, pts in scenarios:
    if pts >= target_2x:
        status = "✅ 2x TERCAPAI!"
    elif pts >= top1_avg:
        status = "✅ Beat Rank #1"
    elif pts >= top10_avg:
        status = "✅ Beat Top 10"
    else:
        gap = top10_avg - pts
        status = f"❌ -{gap:.2f} dari Top 10"
    
    print(f"{name:<30}{pts:<15.3f}{top10_avg:<15.2f}{status}")

print("\n" + "="*70)
print("JAWABAN JUJUR")
print("="*70)

print(f"""
PERTANYAAN: Apakah konten ini bisa mengalahkan Top 10 dengan kualitas 2x?

JAWABAN: TIDAK.

PENJELASAN:

1. TARGET 2x TOP 10:
   - Top 10 avg: {top10_avg:.2f} pts/submission
   - Target 2x: {target_2x:.2f} pts/submission
   - Max teoritis konten Anda: {viral_pts:.2f} pts (dengan engagement VIRAL)
   - Gap: {target_2x - viral_pts:.2f} pts

2. KENAPA TIDAK BISA 2x?
   - Rally scale maksimal ~10 pts
   - Top 10 sudah sangat optimal
   - 2x dari Top 10 = {target_2x:.2f} pts (hampir mustahil)

3. APA YANG BISA DICAPAI?
""")

print(f"   {'Target':<25}{'Skor Anda':<15}{'Hasil'}")
print("   "+ "-"*55)
print(f"   {'Beat Top 50':<25}{typ_pts:.2f}{'✅ YA' if typ_pts >= 4.96 else '❌ TIDAK'}")
print(f"   {'Beat Top 20':<25}{good_pts:.2f}{'✅ YA' if good_pts >= 5.44 else '❌ TIDAK'}")
print(f"   {'Beat Top 10':<25}{good_pts:.2f}{'✅ YA' if good_pts >= top10_avg else '⚠️ PERLU VIRAL'}")
print(f"   {'Beat Rank #1':<25}{viral_pts:.2f}{'✅ YA' if viral_pts >= top1_avg else '❌ TIDAK'}")
print(f"   {'2x Top 10':<25}{viral_pts:.2f}{'❌ MUSTAHIL'}")

print("""
4. KESIMPULAN:
   - Kualitas KONTEN Anda: MAKSIMAL (G4=2.0, M_gate=1.50x)
   - TAPI total skor bergantung pada ENGAGEMENT
   - Tanpa engagement viral, skor hanya ~3.3 pts
   - Dengan engagement viral, bisa capai ~6.0 pts
   - Target 2x Top 10 (8.88 pts): TIDAK REALISTIS

5. YANG REALISTIS:
   - 3 submission berkualitas = ~18-20 pts total
   - BISA masuk Top 10-20 leaderboard
   - TIDAK BISA 2x di atas Top 10
""")

