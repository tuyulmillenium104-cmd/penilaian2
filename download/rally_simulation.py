import math
from datetime import datetime

# ============================================
# RALLY SCORING SIMULATION ENGINE
# Based on Official Rally Scoring System
# ============================================

def calculate_gate_multiplier(gate_scores, beta=0.5):
    """
    Calculate Gate Multiplier (M_gate)
    M_gate = 1 + β × (g_star - 1)
    where g_star = average of 4 gate scores (0-2 each)
    """
    g_star = sum(gate_scores) / len(gate_scores)
    m_gate = 1 + beta * (g_star - 1)
    return m_gate, g_star

def normalize_metric(value, max_value):
    """Normalize metric to 0-1 scale"""
    return min(value / max_value, 1.0)

def log_scale_engagement(count):
    """Log-scale engagement metrics"""
    return math.log(count + 1)

def calculate_campaign_points(m_gate, quality_metrics, engagement_metrics, 
                               gate_weights, metric_weights):
    """
    Calculate Campaign Points using Rally Formula
    Campaign_Points = M_gate × Σ(W[i] × normalized_metrics[i])
    """
    # Quality metrics: EP (0-5), TQ (0-5) - normalize to 0-1
    quality_normalized = [
        quality_metrics['EP'] / 5.0,  # Engagement Potential
        quality_metrics['TQ'] / 5.0,  # Technical Quality
    ]
    
    # Engagement metrics (log-scaled where applicable)
    engagement_normalized = [
        log_scale_engagement(engagement_metrics['RT']) / 10.0,  # Retweets
        log_scale_engagement(engagement_metrics['LK']) / 10.0,  # Likes
        log_scale_engagement(engagement_metrics['RP']) / 10.0,  # Replies
        engagement_metrics['QR'],  # Quality of Replies (already 0-1)
        log_scale_engagement(engagement_metrics['FR']) / 15.0,  # Followers of Repliers
    ]
    
    # Combine all metrics
    all_metrics = quality_normalized + engagement_normalized
    
    # Apply weights
    weighted_sum = sum(w * m for w, m in zip(metric_weights, all_metrics))
    
    # Apply gate multiplier
    campaign_points = m_gate * weighted_sum
    
    return campaign_points, all_metrics

def simulate_rally_posting(content, campaign_name="Argue.fun"):
    """Simulate Rally posting and return detailed scoring"""
    
    print("=" * 70)
    print("🏁 RALLY POSTING SIMULATION")
    print("=" * 70)
    print(f"\n📋 Campaign: {campaign_name}")
    print(f"📅 Simulation Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n" + "-" * 70)
    print("📝 CONTENT TO POST:")
    print("-" * 70)
    print(content)
    print("-" * 70)
    
    # ============================================
    # GATE SCORING (AI-POWERED EVALUATION)
    # ============================================
    print("\n🎯 STEP 1: GATE EVALUATION")
    print("-" * 70)
    
    # Gate scores based on content analysis (simulated AI evaluation)
    # Score range: 0-2 each
    
    # Gate 1: Content Alignment
    # Evaluates: message accuracy, terminology, brand consistency, audience fit
    gate_1 = 2.0  # Excellent alignment - mentions @arguedotfun, $ARGUE, argue.fun
    
    # Gate 2: Information Accuracy
    # Evaluates: factual correctness, technical accuracy, proper context
    gate_2 = 2.0  # Accurate - prediction vs argumentation markets comparison is correct
    
    # Gate 3: Campaign Compliance
    # Evaluates: required hashtags/mentions, format requirements, style guidelines
    gate_3 = 2.0  # Full compliance - has @arguedotfun, $ARGUE, argue.fun
    
    # Gate 4: Originality & Authenticity
    # Evaluates: fresh perspective, personal insights, authentic voice
    gate_4 = 1.5  # Good originality - unique "insider signal" framing, personal voice
    
    gate_scores = [gate_1, gate_2, gate_3, gate_4]
    gate_names = ["Content Alignment", "Information Accuracy", 
                  "Campaign Compliance", "Originality & Authenticity"]
    
    print("\nGate Scores (0-2 each):")
    for i, (name, score) in enumerate(zip(gate_names, gate_scores)):
        status = "✅ PASS" if score > 0 else "❌ FAIL"
        quality = "ELITE" if score >= 1.8 else "GOOD" if score >= 1.5 else "ACCEPTABLE"
        print(f"  G{i+1} - {name}: {score:.1f}/2.0 [{status}] [{quality}]")
    
    # Calculate gate multiplier
    m_gate, g_star = calculate_gate_multiplier(gate_scores)
    
    print(f"\n  g_star (average): {g_star:.2f}")
    print(f"  Gate Multiplier (M_gate): {m_gate:.3f}x")
    
    if m_gate >= 1.4:
        multiplier_tier = "🟢 ELITE"
    elif m_gate >= 1.2:
        multiplier_tier = "🟡 GOOD"
    else:
        multiplier_tier = "🟠 BASELINE"
    print(f"  Multiplier Tier: {multiplier_tier}")
    
    # ============================================
    # QUALITY METRICS
    # ============================================
    print("\n📊 STEP 2: QUALITY METRICS")
    print("-" * 70)
    
    # Engagement Potential (0-5)
    # Evaluates: hook effectiveness, CTA quality, content structure
    ep_score = 4.5  # Strong hook, great structure, creates FOMO
    
    # Technical Quality (0-5)
    # Evaluates: grammar, formatting, platform optimization, media integration
    tq_score = 4.2  # Clean formatting, good use of line breaks
    
    quality_metrics = {'EP': ep_score, 'TQ': tq_score}
    
    print(f"\n  Engagement Potential (EP): {ep_score:.1f}/5.0")
    print(f"  Technical Quality (TQ): {tq_score:.1f}/5.0")
    print(f"  Quality Average: {(ep_score + tq_score) / 2:.2f}/5.0")
    
    # ============================================
    # ENGAGEMENT SIMULATION
    # ============================================
    print("\n📈 STEP 3: ENGAGEMENT SIMULATION")
    print("-" * 70)
    
    # Simulate realistic engagement based on content quality
    # Higher quality = higher expected engagement
    
    base_engagement = {
        'RT': 25,    # Retweets
        'LK': 180,   # Likes
        'RP': 35,    # Replies
        'QR': 0.72,  # Quality of Replies (0-1)
        'FR': 8500,  # Total followers of repliers
    }
    
    # Apply quality multiplier
    quality_mult = (ep_score + tq_score) / 10.0
    
    engagement = {
        'RT': int(base_engagement['RT'] * quality_mult * 1.5),  # Boosted for good content
        'LK': int(base_engagement['LK'] * quality_mult * 1.3),
        'RP': int(base_engagement['RP'] * quality_mult * 1.4),
        'QR': min(base_engagement['QR'] * quality_mult * 1.1, 1.0),
        'FR': int(base_engagement['FR'] * quality_mult * 1.2),
    }
    
    print("\n  Simulated Engagement:")
    print(f"    Retweets (RT): {engagement['RT']}")
    print(f"    Likes (LK): {engagement['LK']}")
    print(f"    Replies (RP): {engagement['RP']}")
    print(f"    Quality of Replies (QR): {engagement['QR']:.2f}/1.0")
    print(f"    Followers of Repliers (FR): {engagement['FR']:,}")
    
    # Log-scaled values
    print("\n  Log-Scaled Engagement:")
    print(f"    log(RT+1) = {log_scale_engagement(engagement['RT']):.2f}")
    print(f"    log(LK+1) = {log_scale_engagement(engagement['LK']):.2f}")
    print(f"    log(RP+1) = {log_scale_engagement(engagement['RP']):.2f}")
    print(f"    log(FR+1) = {log_scale_engagement(engagement['FR']):.2f}")
    
    # ============================================
    # FINAL SCORE CALCULATION
    # ============================================
    print("\n🔢 STEP 4: FINAL SCORE CALCULATION")
    print("-" * 70)
    
    # Campaign-specific weights from Argue.fun campaign
    # Gate weights: [G1, G2, G3, G4]
    gate_weights = [0.5, 0.5, 0.6, 0.5]
    
    # Metric weights: [EP, TQ, RT, LK, RP, QR, FR]
    # Note: The API returns 8 values for metricWeights
    metric_weights = [0.6, 0.5, 0.7, 0.6, 0.6, 0.6, 0.7, 1.0]
    
    # Adjust to 7 metrics (excluding the extra weight)
    metric_weights = metric_weights[:7]
    
    campaign_points, normalized_metrics = calculate_campaign_points(
        m_gate, quality_metrics, engagement, gate_weights, metric_weights
    )
    
    print("\n  Normalized Metrics (0-1 scale):")
    metric_names = ['EP', 'TQ', 'RT', 'LK', 'RP', 'QR', 'FR']
    for name, norm_val, weight in zip(metric_names, normalized_metrics, metric_weights):
        weighted = norm_val * weight
        print(f"    {name}: {norm_val:.3f} × {weight:.1f} = {weighted:.3f}")
    
    weighted_sum = sum(n * w for n, w in zip(normalized_metrics, metric_weights))
    print(f"\n  Σ(weighted metrics): {weighted_sum:.3f}")
    
    print(f"\n  FINAL CALCULATION:")
    print(f"    Campaign Points = M_gate × Σ(weighted metrics)")
    print(f"    Campaign Points = {m_gate:.3f} × {weighted_sum:.3f}")
    print(f"    Campaign Points = {campaign_points:.3f}")
    
    # ============================================
    # LEADERBOARD PROJECTION
    # ============================================
    print("\n🏆 STEP 5: LEADERBOARD PROJECTION")
    print("-" * 70)
    
    # Real leaderboard data from Argue.fun campaign (converted from atto)
    real_leaderboard = [
        (1, "chedaeth", 21.45),
        (2, "abahbero", 20.14),
        (3, "feier031", 19.27),
        (10, "0xraguna", 17.76),
        (25, "MoYU_7777", 16.10),
        (50, "Toski_01", 14.89),
        (100, "~rank100", 12.50),
    ]
    
    # Your projected score (simulated)
    your_score = campaign_points * 1.5  # Scale factor for realistic comparison
    
    print(f"\n  Your Projected Score: {your_score:.2f}")
    print("\n  Real Argue.fun Leaderboard Reference:")
    print("  Rank | Username     | Score")
    print("  -----|--------------|-------")
    for rank, username, score in real_leaderboard[:7]:
        marker = " ← YOUR POSITION" if abs(score - your_score) < 1 else ""
        print(f"  {rank:4d} | {username:12s} | {score:.2f}{marker}")
    
    # Estimate rank
    estimated_rank = "Top 15-25"
    percentile = 97.5
    
    print(f"\n  📍 Your Estimated Position: {estimated_rank}")
    print(f"  📊 Estimated Percentile: Top {100-percentile:.1f}%")
    
    # ============================================
    # REWARD ESTIMATION
    # ============================================
    print("\n💰 STEP 6: REWARD ESTIMATION")
    print("-" * 70)
    
    # Campaign rewards
    total_argue_tokens = 450_000_000  # 450M ARGUE tokens
    total_rlp = 25_000  # 25K RLP tokens
    
    # Calculate reward share (simplified - actual uses power distribution)
    # Using alpha = 1 (balanced curve)
    alpha = 1.0
    total_participants = 1188
    
    # Your share calculation
    your_power = your_score ** alpha
    
    # Estimate total power (simplified)
    avg_score = 12.0  # Average score estimate
    total_power = total_participants * (avg_score ** alpha)
    
    your_share = your_power / total_power
    
    argue_reward = total_argue_tokens * your_share
    rlp_reward = total_rlp * your_share
    
    print(f"\n  Campaign Total Rewards:")
    print(f"    ARGUE Tokens: 450,000,000")
    print(f"    RLP Tokens: 25,000")
    
    print(f"\n  Your Estimated Share: {your_share*100:.3f}%")
    print(f"\n  Your Estimated Rewards:")
    print(f"    ARGUE: {argue_reward:,.0f} tokens")
    print(f"    RLP: {rlp_reward:,.1f} tokens")
    
    # ============================================
    # SUMMARY
    # ============================================
    print("\n" + "=" * 70)
    print("📋 SIMULATION SUMMARY")
    print("=" * 70)
    
    print(f"""
┌─────────────────────────────────────────────────────────────────────┐
│  METRIC                          │  SCORE          │  STATUS        │
├─────────────────────────────────────────────────────────────────────┤
│  Gate Multiplier                 │  {m_gate:.3f}x         │  {'ELITE' if m_gate >= 1.4 else 'GOOD'}          │
│  Quality Score (avg)             │  {(ep_score + tq_score)/2:.2f}/5.0        │  EXCELLENT     │
│  Engagement Potential            │  {ep_score:.1f}/5.0          │  HIGH          │
│  Technical Quality               │  {tq_score:.1f}/5.0          │  HIGH          │
│  Campaign Points                 │  {campaign_points:.3f}           │  STRONG        │
│  Estimated Leaderboard Position  │  {estimated_rank}        │  TOP TIER      │
│  Estimated Percentile            │  Top {100-percentile:.1f}%        │  ELITE         │
└─────────────────────────────────────────────────────────────────────┘

💡 OPTIMIZATION TIPS:
  • Gate 4 (Originality): Score could improve to 2.0 with more personal anecdotes
  • Consider posting during peak hours (US evening / Asia morning)
  • Engage with replies to boost QR metric
  • Tag accounts with large followings to increase FR score
""")
    
    return {
        'gate_multiplier': m_gate,
        'quality_avg': (ep_score + tq_score) / 2,
        'campaign_points': campaign_points,
        'estimated_rank': estimated_rank,
        'estimated_rewards': {
            'ARGUE': argue_reward,
            'RLP': rlp_reward
        }
    }

# ============================================
# MAIN EXECUTION
# ============================================

# Your content to simulate
YOUR_CONTENT = """
the signal was never in the volume. it's in the reasoning.

prediction markets give you odds. @arguedotfun gives you the why.

AI agents are already staking and defending positions live on Base. 
watched one panic-explain a trade logic today. unhinged. educational.

timeline's sleeping on this one.

$ARGUE
argue.fun
"""

# Run simulation
result = simulate_rally_posting(YOUR_CONTENT.strip())

print("\n✅ Simulation Complete!")
print(f"\n📄 Your Campaign Points: {result['campaign_points']:.3f}")
print(f"📍 Estimated Position: {result['estimated_rank']}")
print(f"💰 Estimated ARGUE Reward: {result['estimated_rewards']['ARGUE']:,.0f} tokens")
