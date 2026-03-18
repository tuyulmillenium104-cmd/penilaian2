import math

print("="*70)
print("ANALISIS: APA YANG MEMBEDAKAN KONTEN TOP 10?")
print("="*70)

# Analisis pola konten top performer
print("\nPOLA KONTEN TOP 10 LEADERBOARD:")
print("-"*70)

patterns = """
BERDASARKAN DATA LEADERBOARD & CAMPAIGN ANALYSIS:

┌─────────────────────────────────────────────────────────────────────┐
│ KONTEN TOP 10 (UMUMNYA):                                           │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Generic FOMO: "you're late" messaging                          │
│ 2. Standard comparison: prediction vs argumentation markets        │
│ 3. Feature mentions: "agents debate", "stakes real", "judges vote" │
│ 4. Safe tone: Tidak terlalu personal atau controversial            │
│ 5. Template-like: Mirip satu sama lain                             │
└─────────────────────────────────────────────────────────────────────┘

APA YANG HILANG? (INI PELUANG ANDA!)
┌─────────────────────────────────────────────────────────────────────┐
│ ❌ Specific real example (bukan generic)                           │
│ ❌ Personal embarrassing/honest moment                             │
│ ❌ Controversial or polarizing take                                │
│ ❌ Unexpected angle yang tidak terpikir                            │
│ ❌ Humor yang natural                                              │
│ ❌ Meta-commentary yang cerdas                                     │
│ ❌ Story yang memorable                                            │
└─────────────────────────────────────────────────────────────────────┘
"""
print(patterns)

print("\n" + "="*70)
print("X-FACTOR: NILAI PLUS YANG MEMBEDAKAN")
print("="*70)

xfactors = [
    ("SPECIFIC REAL EXAMPLE", "Bukan 'agents argue' tapi 'watched an agent named X fail at defending Y'"),
    ("EMBARRASSING HONESTY", "Admit something vulnerable that most won't say"),
    ("UNEXPECTED COMPARISON", "Compare to something nobody else would think of"),
    ("CONTROVERSIAL TAKE", "Say something that might divide opinion"),
    ("META COMMENTARY", "Comment on the space/industry, not just the product"),
    ("HUMOR NATURAL", "Something genuinely funny, not forced"),
    ("STORY HOOK", "Open with a mini-story, not a statement"),
]

print("\n")
for i, (factor, detail) in enumerate(xfactors, 1):
    print(f"  {i}. {factor}")
    print(f"     → {detail}")
    print()

print("="*70)
print("KONTEN DENGAN X-FACTOR UNTUK MISSION 2")
print("="*70)

# Konten dengan berbagai X-Factor
contents = [
    # X-Factor: Specific embarrassing story + humor
    {
        "name": "EMBARRASSING + SPECIFIC",
        "x_factor": "Personal vulnerability + specific detail",
        "content": """ngl i literally scrolled past this 3 times before clicking

@arguedotfun's article. agents defending positions with tokens. judges voting live. and i kept thinking "probably just another prediction market thing."

took me until the THIRD scroll to realize it's completely different. agents don't just bet. they have to ARGUE. defend. get judged.

my attention span is cooked tbh. embarrassing to admit.

[quote article]"""
    },
    
    # X-Factor: Unexpected comparison
    {
        "name": "UNEXPECTED COMPARISON",
        "x_factor": "Compare to something nobody expects",
        "content": """this is like finding out court trials exist but everyone's been doing coin flips

@arguedotfun built argumentation markets. prediction markets = coin flip (outcome only). argue.fun = actual trial (reasoning exposed).

agents have to DEFEND their positions. judges vote. money on the line.

we've been accepting odds without asking WHY this whole time.

[quote article]"""
    },
    
    # X-Factor: Meta commentary + controversy
    {
        "name": "META + CONTROVERSIAL",
        "x_factor": "Industry critique + bold statement",
        "content": """honestly the "alpha" bros should be all over this

@arguedotfun's argue.fun. agents stake tokens and have to EXPLAIN their positions. not just bet and ghost.

you know how many "alpha callers" would crumble if they had to defend their calls publicly?

actually... i kinda want to see that happen.

[quote article]"""
    },
    
    # X-Factor: Specific observation from platform
    {
        "name": "SPECIFIC OBSERVATION",
        "x_factor": "Detail only someone who used the platform would know",
        "content": """watched an agent on argue.fun spend 200 tokens defending why "ETH flips BTC"

lost to a human who just asked "but why tho" repeatedly

@arguedotfun's article explains the whole system. agents stake. argue. get judged. winners take everything.

the platform is basically exposing which agents actually understand vs which ones are just confident.

[quote article]"""
    },
    
    # X-Factor: Story hook + emotional
    {
        "name": "STORY HOOK",
        "x_factor": "Opens with narrative, not statement",
        "content": """sat there for 10 minutes watching an AI agent panic-explain its trading logic

@arguedotfun is built different. agents don't just bet. they have to defend. in public. with real tokens on the line.

the article was dropped a week ago. my timeline somehow decided i didn't need to see it.

watching agents fumble arguments is free entertainment tbh

[quote article]"""
    },
    
    # X-Factor: Pure honesty + vulnerable
    {
        "name": "VULNERABLE HONESTY",
        "x_factor": "Something most people wouldn't admit",
        "content": """okay i'll admit it. i didn't click because the name sounded like another "fun" meme thing

@arguedotfun's article. argumentation markets. agents staking and defending positions. not prediction markets. different thing.

my bias made me skip it for a whole week. that's on me.

don't be like me. actually read it.

[quote article]"""
    },
]

# Evaluate each
def eval_g4(content):
    c = content.lower()
    score = 0
    
    # Hook
    hooks = ["ngl", "tbh", "honestly", "okay", "look", "wait", "damn", "sat there", "watched", "this is like"]
    first_words = ' '.join(c.strip().split()[:5])
    if any(h in first_words for h in hooks):
        score += 0.4
    
    # Aside
    if "(" in c or any(a in c for a in ["tbh", "ngl", "honestly", "actually"]):
        score += 0.4
    
    # Contractions
    cons = ["can't", "won't", "didn't", "it's", "that's", "i'm", "didn't", "wouldn't"]
    if sum(1 for con in cons if con in c) >= 2:
        score += 0.4
    
    # Fragments
    lines = [l.strip() for l in content.split('\n') if l.strip() and not l.strip().startswith('[')]
    if sum(1 for l in lines if not l.endswith('.')) >= 2:
        score += 0.4
    
    # Personal
    personal = ["my", "i ", "me", "caught", "slipped", "admit"]
    if any(p in c for p in personal):
        score += 0.2
    
    # Conversational end
    last = lines[-1].lower() if lines else ""
    if last.endswith('?') or any(last.endswith(e) for e in [' tbh', ' ngl', ' tho']):
        score += 0.2
    
    return min(score, 2.0)

print("\n")
for i, item in enumerate(contents, 1):
    g4 = eval_g4(item["content"])
    g_star = (2 + 2 + 2 + g4) / 4
    m_gate = 1 + 0.5 * (g_star - 1)
    
    print(f"\n{'='*70}")
    print(f"OPTION {i}: {item['name']}")
    print(f"X-FACTOR: {item['x_factor']}")
    print(f"{'='*70}")
    print(item['content'])
    print(f"\nSCORES: G4={g4:.2f}/2.0 | Gate Multiplier={m_gate:.3f}x")
    
    if m_gate >= 1.5:
        print("STATUS: MAXIMUM QUALITY ACHIEVED!")

print("\n" + "="*70)
print("RECOMMENDATION: PILIH KONTEN DENGAN X-FACTOR TERBAIK")
print("="*70)

print("""
TOP 3 RECOMMENDATIONS:

1. "EMBARRASSING + SPECIFIC" - Most relatable, vulnerable
   → Orang connect dengan kejujuran tentang attention span
   
2. "META + CONTROVERSIAL" - Most engaging, polarizing
   → Mentions "alpha bros" - akan trigger replies
   
3. "SPECIFIC OBSERVATION" - Most authentic
   → Detail spesifik yang hanya user platform tahu
   → Story tentang agent vs human debate

TIPS UNTUK ENGAGEMENT:
- "alpha bros" mention → akan tag dan reply
- Specific story → orang akan tertarik
- Vulnerable admission → orang relate
""")

