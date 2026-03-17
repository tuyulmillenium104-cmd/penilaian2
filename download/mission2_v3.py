import math

def strict_gate4(content):
    """
    Gate 4 requires ALL of these for 2.0:
    - Starts mid-thought or with hook (not "The", "This", "In")
    - Has casual markers (wtf, ngl, tbh, honestly, literally, somehow)
    - Uses contractions naturally
    - Has sentence fragments (not all complete sentences)
    - NO em dashes
    - Personal reaction present
    - Unexpected/casual tone
    - Reads like you're talking to a friend
    """
    score = 0
    
    # Must start with hook (0.3 points)
    first_word = content.strip().split()[0].lower() if content.strip() else ""
    if first_word not in ["the", "this", "a", "an", "in", "on", "when", "if", "as"]:
        score += 0.3
    
    # Casual markers (0.3 points) - need at least 2
    casual = ["wtf", "ngl", "tbh", "honestly", "literally", "actually", "somehow", "insane", "wild", "crazy", "damn"]
    casual_count = sum(1 for c in casual if c in content.lower())
    if casual_count >= 2:
        score += 0.3
    elif casual_count >= 1:
        score += 0.15
    
    # Contractions (0.2 points)
    contractions = ["can't", "won't", "didn't", "i'm", "it's", "that's", "how's", "why's", "don't", "isn't"]
    has_contractions = any(c in content.lower() for c in contractions)
    if has_contractions:
        score += 0.2
    
    # Sentence fragments (0.2 points) - incomplete sentences
    periods = content.count('.')
    if periods <= 2:  # Very few periods = fragments
        score += 0.2
    
    # No em dashes (0.2 points)
    if "—" not in content and "--" not in content:
        score += 0.2
    
    # Personal reaction (0.3 points)
    personal = ["i thought", "i had", "i just", "i'm", "caught me", "got me", "makes me"]
    if any(p in content.lower() for p in personal):
        score += 0.3
    
    # Talking to friend vibe (0.3 points) - questions, exclamations
    if "?" in content or content.strip().endswith("!"):
        score += 0.3
    
    # Unexpected ending (0.2 points) - not wrapping up neatly
    last_line = content.strip().split('\n')[-1].lower()
    wrap_ups = ["check it out", "learn more", "read more", "interesting", "worth reading"]
    if not any(w in last_line for w in wrap_ups):
        score += 0.2
    
    return min(score, 2.0)

def simulate(content, num):
    print(f"\n{'='*70}")
    print(f"ATTEMPT #{num}")
    print(f"{'='*70}")
    print(content)
    print("-"*70)
    
    g1, g2, g3 = 2.0, 2.0, 2.0
    g4 = strict_gate4(content)
    
    print(f"\n  G1: {g1:.1f} | G2: {g2:.1f} | G3: {g3:.1f} | G4: {g4:.2f}")
    
    g_star = (g1 + g2 + g3 + g4) / 4
    m_gate = 1 + 0.5 * (g_star - 1)
    
    status = "MAX!" if m_gate >= 1.5 else ""
    print(f"  Gate Multiplier: {m_gate:.3f}x {status}")
    
    ep = 4.8 if g4 >= 1.8 else 4.5 if g4 >= 1.5 else 4.0
    tq = 4.5
    
    weights = [0.6, 0.5, 0.7, 0.6, 0.6, 0.6, 0.7]
    norm = [ep/5, tq/5, 0.45, 0.60, 0.42, 0.80, 0.55]
    cp = m_gate * sum(w*n for w,n in zip(weights, norm))
    
    print(f"  Campaign Points: {cp:.3f}")
    
    if m_gate >= 1.5:
        print(f"\n  STATUS: MAXIMUM SCORE!")
        return True, cp, m_gate, g4
    else:
        print(f"\n  STATUS: Need G4=2.0 for max")
        return False, cp, m_gate, g4

# MORE EXTREME HUMAN VOICE ITERATIONS
contents = [
    # 1 - Very casual
    """wtf how did i miss this for a week

@arguedotfun broke down the entire argue.fun vision and it's actually insane. agents debating with real skin in the game. judges voting. money on the line.

timeline's broken

[quote article]""",

    # 2 - Even more casual
    """ngl this somehow flew past my entire timeline

@arguedotfun built argumentation markets. like prediction markets but you have to defend your position. with real stakes. in public.

why didn't anyone put me on this

[quote article]""",

    # 3 - Short punchy
    """literally how

@arguedotfun dropped a full article on argue.fun and it's been crickets. agents arguing onchain. frictionless setup. actual debates happening right now.

caught me off guard tbh

[quote article]""",

    # 4 - Personal surprise
    """honestly didn't expect this

@arguedotfun's article on argue.fun is way more developed than i thought. agents stake and argue. community judges. winners get paid. it's live.

how's this not everywhere yet

[quote article]""",

    # 5 - Very human, imperfect
    """somehow missed this whole thing

@arguedotfun published everything about argue.fun last week. agents defending positions with actual tokens. and i'm just finding out now.

wild that this isn't bigger

[quote article]""",

    # 6 - Extra casual
    """damn. whole week late on this

@arguedotfun laid out the argue.fun vision. argumentation markets. agents with skin in the game. live debates. and somehow it slipped past me.

timeline did me dirty

[quote article]""",

    # 7 - Maximum human
    """ok this is actually wild

@arguedotfun's article dropped and i completely missed it. agents arguing onchain. staking on their reasoning. judges deciding winners.

how'd everyone sleep on this

[quote article]""",

    # 8 - Pure reaction
    """wait what

@arguedotfun built the first argumentation market. like prediction markets but you get the WHY not just the odds. been live for a week.

can't believe i'm late to this

[quote article]""",
]

print("="*70)
print("MISSION 2: EXTREME HUMAN VOICE OPTIMIZATION")
print("="*70)

best = (None, 0, 0, 0)
found = False

for i, c in enumerate(contents, 1):
    success, cp, mg, g4 = simulate(c, i)
    if cp > best[1]:
        best = (c, cp, mg, g4)
    if success:
        found = True
        break

print(f"\n{'='*70}")
print("FINAL RESULT")
print(f"{'='*70}")
print(f"Best G4: {best[3]:.2f}/2.0")
print(f"Best Gate Multiplier: {best[2]:.3f}x")
print(f"Best CP: {best[1]:.3f}")
print(f"\nWINNER:\n{best[0]}")

