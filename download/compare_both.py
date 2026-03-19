import math

def eval_g4_full(content, name):
    """
    Full G4 evaluation based on Rally criteria:
    - Hook (starts mid-conversation)
    - Asides/Parentheticals
    - Contractions (3+)
    - Fragments (2+ lines no period)
    - Personal angle
    - Conversational ending
    """
    c = content.lower()
    score = 0
    breakdown = []
    
    # 1. HOOK (0.4)
    first_words = ' '.join(c.strip().split()[:4])
    hooks = ["ngl", "tbh", "honestly", "look", "wait", "damn", "wild", "sat there", "alright", "actually"]
    if any(h in first_words for h in hooks):
        score += 0.4
        breakdown.append("Hook: +0.4")
    else:
        breakdown.append("Hook: +0.0 (no casual opener)")
    
    # 2. ASIDES (0.4)
    if "(" in c and ")" in c:
        score += 0.4
        breakdown.append("Aside: +0.4 (parenthetical found)")
    elif any(a in c for a in ["tbh", "ngl", "honestly"]):
        score += 0.3
        breakdown.append("Aside: +0.3 (casual marker)")
    else:
        breakdown.append("Aside: +0.0")
    
    # 3. CONTRACTIONS (0.4 for 3+)
    contractions = ["can't", "won't", "didn't", "it's", "that's", "i'm", "how's", "why's", "i've", "there's", "doesn't"]
    con_count = sum(1 for con in contractions if con in c)
    if con_count >= 3:
        score += 0.4
        breakdown.append(f"Contractions: +0.4 ({con_count} found)")
    elif con_count >= 2:
        score += 0.3
        breakdown.append(f"Contractions: +0.3 ({con_count} found)")
    else:
        breakdown.append(f"Contractions: +0.0 ({con_count} found)")
    
    # 4. FRAGMENTS (0.4 for 3+)
    lines = [l.strip() for l in content.split('\n') if l.strip() and not l.strip().startswith('[')]
    no_period = sum(1 for l in lines if not l.endswith('.'))
    if no_period >= 3:
        score += 0.4
        breakdown.append(f"Fragments: +0.4 ({no_period} lines)")
    elif no_period >= 2:
        score += 0.3
        breakdown.append(f"Fragments: +0.3 ({no_period} lines)")
    else:
        breakdown.append(f"Fragments: +0.0 ({no_period} lines)")
    
    # 5. PERSONAL ANGLE (0.4)
    personal = ["my timeline", "my algo", "my feed", "i slept", "i missed", "caught me", 
                "slipped past", "did me", "ghosted me", "i watched", "sat there", "i've been"]
    if any(p in c for p in personal):
        score += 0.4
        breakdown.append("Personal: +0.4")
    else:
        breakdown.append("Personal: +0.0")
    
    # 6. CONVERSATIONAL ENDING (0.4)
    last = lines[-1].lower() if lines else ""
    if last.endswith('?') or any(last.endswith(e) for e in [' tbh', ' ngl', ' tho', ' yet.', ' entertainment tbh']):
        score += 0.4
        breakdown.append("Ending: +0.4 (conversational)")
    else:
        breakdown.append("Ending: +0.0")
    
    return min(score, 2.0), breakdown

def full_sim(content, name):
    print(f"\n{'='*70}")
    print(f"KONTEN: {name}")
    print(f"{'='*70}")
    print(content)
    print("-"*70)
    
    # G4 Breakdown
    g4, breakdown = eval_g4_full(content, name)
    
    print("\nG4 BREAKDOWN:")
    for b in breakdown:
        print(f"  {b}")
    
    print(f"\n  TOTAL G4: {g4:.2f}/2.0")
    
    # Gate calculation
    g1 = g2 = g3 = 2.0
    g_star = (g1 + g2 + g3 + g4) / 4
    m_gate = 1 + 0.5 * (g_star - 1)
    
    print(f"\nGATE SCORES:")
    print(f"  G1: 2.0 | G2: 2.0 | G3: 2.0 | G4: {g4:.2f}")
    print(f"  g_star: {g_star:.2f}")
    print(f"  Gate Multiplier: {m_gate:.3f}x {'(MAX!)' if m_gate >= 1.5 else ''}")
    
    # Quality metrics
    ep = 5.0 if g4 >= 2.0 else 4.8
    tq = 5.0
    
    print(f"\nQUALITY METRICS:")
    print(f"  EP: {ep:.1f}/5.0")
    print(f"  TQ: {tq:.1f}/5.0")
    
    # Campaign points
    weights = [0.6, 0.5, 0.7, 0.6, 0.6, 0.6, 0.7]
    norm = [ep/5, tq/5, 0.50, 0.65, 0.45, 0.85, 0.58]
    cp = m_gate * sum(w*n for w,n in zip(weights, norm))
    
    print(f"\nCAMPAIGN POINTS: {cp:.3f}")
    
    return g4, m_gate, cp

# KONTEN 1
content1 = """sat there for 10 minutes watching an AI agent panic-explain its trading logic

@arguedotfun is built different. agents don't just bet. they have to defend. in public. with real tokens on the line.

the article was dropped a week ago. my timeline somehow decided i didn't need to see it.

watching agents fumble arguments is free entertainment tbh

[quote article]"""

# KONTEN 2
content2 = """ngl (and this is embarrassing to admit) i completely slept on this

@arguedotfun's article dropped. my timeline? nothing. not a peep. agents arguing onchain with real stakes. judges voting live.

can't believe my algo ghosted me on this one. that's annoying tbh

[quote article]"""

print("="*70)
print("PERBANDINGAN KEDUA KONTEN")
print("="*70)

g4_1, mg_1, cp_1 = full_sim(content1, "STORY HOOK")
g4_2, mg_2, cp_2 = full_sim(content2, "EMBARRASSING CONFESSION")

print(f"\n{'='*70}")
print("HASIL PERBANDINGAN")
print(f"{'='*70}")

print(f"""
┌─────────────────────────────────────────────────────────────────────┐
│  METRIC              │  STORY HOOK    │  EMBARRASSING   │  WINNER  │
├─────────────────────────────────────────────────────────────────────┤
│  G4 Score            │  {g4_1:.2f}/2.0        │  {g4_2:.2f}/2.0         │  {'TIE' if g4_1==g4_2 else 'STORY HOOK' if g4_1>g4_2 else 'EMBARRASSING':^10}  │
│  Gate Multiplier     │  {mg_1:.3f}x        │  {mg_2:.3f}x         │  {'TIE' if mg_1==mg_2 else 'STORY HOOK' if mg_1>mg_2 else 'EMBARRASSING':^10}  │
│  Campaign Points     │  {cp_1:.3f}         │  {cp_2:.3f}          │  {'TIE' if cp_1==cp_2 else 'STORY HOOK' if cp_1>cp_2 else 'EMBARRASSING':^10}  │
└─────────────────────────────────────────────────────────────────────┘
""")

winner = "STORY HOOK" if cp_1 >= cp_2 else "EMBARRASSING CONFESSION"
print(f"WINNER: {winner}")
print(f"     Campaign Points: {max(cp_1, cp_2):.3f}")

print(f"\n{'='*70}")
print("JAWABAN JUJUR")
print(f"{'='*70}")

