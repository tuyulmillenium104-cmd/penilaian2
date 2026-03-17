# DEMO: External Data Collection + Generation Engine
## Rally Workflow V8.0 - Proof of Concept

---

## 🎯 INTI PERMASALAHAN

### Masalah di Semua Workflow Sebelumnya:
```
❌ EXTERNAL DATA:
   - Tidak ada sama sekali
   - Atau fetch random tanpa kondisi
   - Tidak ada integration dengan scoring

❌ GENERATION:
   - Template-based: "unpopular opinion: [X]"
   - Placeholder filling
   - Semua campaign menghasilkan konten mirip
```

### Solusi yang Benar:
```
✅ EXTERNAL DATA (KONDISIONAL):
   - WHAT to fetch = dihitung dari kondisi campaign
   - WHEN to fetch = berdasarkan timing optimization
   - HOW MUCH data = berdasarkan complexity scoring

✅ GENERATION ENGINE (CALCULATED):
   - Hook = derive(facts, gap, emotion, FR_target)
   - Words = calculate(audience, platform, naturalness)
   - Structure = generate(campaign_type, engagement_goal)
   - Output: 100% UNIQUE per campaign
```

---

## 🔬 PART 1: EXTERNAL DATA COLLECTION BERDASARKAN KONDISI

### 1.1 Data Collection Decision Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              KAPAN EXTERNAL DATA DIPERLUKAN?                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CONDITION CHECK (Hitung sebelum fetch):                                    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ COND_1: Campaign Type Classification                                │    │
│  │                                                                      │    │
│  │ IF campaign involves:                                               │    │
│  │   - Token/Protocol → NEED market data                               │    │
│  │   - Event/News → NEED news data                                     │    │
│  │   - Community → NEED sentiment data                                 │    │
│  │   - Product → NEED competitor data                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ COND_2: Market Movement Threshold                                   │    │
│  │                                                                      │    │
│  │ BTC_24h_change = fetch("BTC price 24h change")                      │    │
│  │                                                                      │    │
│  │ IF |BTC_24h_change| > 5%:                                           │    │
│  │   PRIORITY = "trend_jacking"                                        │    │
│  │   DATA_NEED = ["market_sentiment", "related_news", "fear_greed"]    │    │
│  │                                                                      │    │
│  │ IF |BTC_24h_change| < 2%:                                           │    │
│  │   PRIORITY = "educational"                                          │    │
│  │   DATA_NEED = ["project_developments", "competitor_content"]        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ COND_3: Leaderboard Gap Analysis                                    │    │
│  │                                                                      │    │
│  │ GAP = target_score - current_top_score                              │    │
│  │                                                                      │    │
│  │ IF GAP > 3.0:                                                       │    │
│  │   CONTENT_ANGLE = "controversial"                                   │    │
│  │   DATA_NEED += ["controversy_topics", "debate_hooks"]               │    │
│  │                                                                      │    │
│  │ IF GAP < 1.0:                                                       │    │
│  │   CONTENT_ANGLE = "optimization"                                    │    │
│  │   DATA_NEED += ["micro_trends", "timing_data"]                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ COND_4: Timing Context                                              │    │
│  │                                                                      │    │
│  │ CURRENT_HOUR = get_hour_EST()                                       │    │
│  │                                                                      │    │
│  │ IF CURRENT_HOUR in PEAK_WINDOWS (9-11 AM EST):                      │    │
│  │   DATA_FRESHNESS = "real-time"                                      │    │
│  │   FETCH_DELAY = 0                                                   │    │
│  │                                                                      │    │
│  │ IF CURRENT_HOUR in OFF_PEAK:                                        │    │
│  │   DATA_FRESHNESS = "cached"                                         │    │
│  │   PRE_FETCH for next peak                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Data Source Selection (Calculated)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              DATA SOURCE SELECTION MATRIX                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CALCULATE: data_source_priority = f(campaign_type, audience, timing)       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ SOURCE_1: Market Data                                                │   │
│  │                                                                       │   │
│  │ TRIGGER CONDITION:                                                   │   │
│  │   IF campaign_token EXISTS OR crypto_audience = TRUE                 │   │
│  │                                                                       │   │
│  │ FETCH:                                                                │   │
│  │   - BTC/ETH 24h price change                                         │   │
│  │   - Fear & Greed Index                                               │   │
│  │   - Market cap trend                                                 │   │
│  │   - Gas price (if ETH-related)                                       │   │
│  │                                                                       │   │
│  │ CALCULATION:                                                          │   │
│  │   market_sentiment_score = (fear_greed + price_momentum) / 2         │   │
│  │   emotion_weight = IF market_sentiment < 30 THEN "fear"              │   │
│  │                    IF market_sentiment > 70 THEN "greed"             │   │
│  │                    ELSE "neutral"                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ SOURCE_2: News & Trends                                              │   │
│  │                                                                       │   │
│  │ TRIGGER CONDITION:                                                   │   │
│  │   current_hour in PEAK_WINDOWS OR                                    │   │
│  │   campaign_type = "announcement" OR                                  │   │
│  │   trend_jacking_eligible = TRUE                                      │   │
│  │                                                                       │   │
│  │ FETCH:                                                                │   │
│  │   - Top 5 crypto news (last 6h)                                      │   │
│  │   - Trending hashtags in crypto Twitter                              │   │
│  │   - Breaking news related to campaign_keywords                       │   │
│  │                                                                       │   │
│  │ CALCULATION:                                                          │   │
│  │   trend_relevance = cosine_similarity(trend, campaign_keywords)      │   │
│  │   IF trend_relevance > 0.7: USE_FOR_HOOK = TRUE                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ SOURCE_3: Competitor Content                                         │   │
│  │                                                                       │   │
│  │ TRIGGER CONDITION:                                                   │   │
│  │   leaderboard_analyzed = TRUE AND                                    │   │
│  │   (gap > 2.0 OR similar_content_count > 3)                           │   │
│  │                                                                       │   │
│  │ FETCH:                                                                │   │
│  │   - Top 10 tweets in campaign leaderboard                            │   │
│  │   - Analyze patterns: hooks, angles, emotions                        │   │
│  │   - Identify gaps: what's NOT being said                             │   │
│  │                                                                       │   │
│  │ CALCULATION:                                                          │   │
│  │   FOR EACH top_tweet:                                                │   │
│  │     hook_type = classify(tweet.hook)                                 │   │
│  │     emotion_type = classify(tweet.emotion)                           │   │
│  │     angle_type = classify(tweet.angle)                               │   │
│  │                                                                       │   │
│  │   GAP_OPPORTUNITY = ALL_TYPES - FOUND_TYPES                          │   │
│  │   angle_to_use = random_select(GAP_OPPORTUNITY)                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ SOURCE_4: Project-Specific Data                                     │   │
│  │                                                                       │   │
│  │ TRIGGER CONDITION:                                                   │   │
│  │   ALWAYS (required for G1, G2 scoring)                               │   │
│  │                                                                       │   │
│  │ FETCH:                                                                │   │
│  │   - Official Twitter account recent posts                            │   │
│  │   - Project documentation/whitepaper summary                         │   │
│  │   - Token metrics (if applicable)                                    │   │
│  │   - Recent announcements                                             │   │
│  │                                                                       │   │
│  │ CALCULATION:                                                          │   │
│  │   key_facts = extract_facts(official_sources)                        │   │
│  │   terminology = extract_terms(official_sources)                      │   │
│  │   value_prop = extract_value_proposition(official_sources)           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 DEMO: Kalkulasi External Data untuk Campaign "Internet Court"

```javascript
// ═══════════════════════════════════════════════════════════════════════════
// DEMO: External Data Collection - Internet Court Campaign
// ═══════════════════════════════════════════════════════════════════════════

async function calculateExternalDataNeeds(campaign) {
  // STEP 1: Analyze Campaign Type
  const campaignType = classifyCampaign(campaign);
  // Result: "protocol_dispute_resolution"
  // Involves: Token (RLY), Protocol, Community

  // STEP 2: Check Market Conditions
  const marketData = await fetchMarketData();
  // BTC_24h = -1.2% (below threshold)
  // Fear_Greed = 45 (neutral)

  // STEP 3: Calculate Data Priority
  const dataPriority = {
    market_data: {
      needed: true,          // Campaign involves token
      urgency: "medium",     // No major movement
      sources: ["fear_greed", "rly_token_price"]
    },
    news_trends: {
      needed: true,          // Legal/dispute = news-worthy
      urgency: "high",       // Topic may have recent developments
      sources: ["crypto_regulation_news", "dispute_resolution_trends"]
    },
    competitor_content: {
      needed: true,          // Always needed for gap analysis
      urgency: "high",
      sources: ["leaderboard_top_10", "similar_campaigns"]
    },
    project_data: {
      needed: true,          // Required for G1, G2
      urgency: "critical",
      sources: ["rally_docs", "rally_twitter", "internet_court_docs"]
    }
  };

  return dataPriority;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTED DATA FETCH (Based on Calculated Needs)
// ═══════════════════════════════════════════════════════════════════════════

async function executeDataFetch(dataPriority) {
  const collectedData = {};

  // FETCH 1: Project Data (CRITICAL - always first)
  if (dataPriority.project_data.urgency === "critical") {
    collectedData.project = {
      official_facts: [
        "Rally Internet Court is a decentralized dispute resolution system",
        "Uses token-curated registry for juror selection",
        "RLY token used for staking and rewards",
        "Anyone can become a juror by staking RLY",
        "Decisions are binding and enforced on-chain"
      ],
      terminology: ["Internet Court", "Jurors", "Staking", "Dispute Resolution", "On-chain"],
      value_prop: "Decentralized justice without traditional legal barriers"
    };
  }

  // FETCH 2: Competitor Content (HIGH priority)
  if (dataPriority.competitor_content.urgency === "high") {
    collectedData.competitor = {
      top_tweets_analysis: [
        { hook_type: "curiosity", emotion: "surprise", angle: "discovery" },
        { hook_type: "educational", emotion: "interest", angle: "how_to" },
        { hook_type: "fomo", emotion: "greed", angle: "opportunity" },
        { hook_type: "story", emotion: "empathy", angle: "personal" }
      ],
      gaps_identified: [
        "NO contrarian takes (avoiding 'unpopular opinion' template)",
        "NO controversy/exploitation angle",
        "NO comparison with traditional legal systems",
        "NO real-world case study hooks"
      ],
      angle_to_exploit: "controversy" // GAP identified!
    };
  }

  // FETCH 3: News & Trends (HIGH priority)
  if (dataPriority.news_trends.urgency === "high") {
    collectedData.trends = {
      trending_topics: [
        "crypto regulation",
        "decentralized governance",
        "DAO disputes"
      ],
      news_hooks: [
        "Recent SEC enforcement actions increasing",
        "More crypto projects facing legal challenges",
        "Traditional legal systems struggling with crypto cases"
      ],
      timing_relevance: "HIGH - legal/regulation trending"
    };
  }

  // FETCH 4: Market Data (MEDIUM priority)
  if (dataPriority.market_data.needed) {
    collectedData.market = {
      btc_change: -1.2,
      fear_greed: 45,
      rly_price_change: 2.3,
      sentiment: "neutral",
      emotion_weight: "curiosity" // Neutral market = curiosity angle
    };
  }

  return collectedData;
}
```

---

## 🔬 PART 2: GENERATION ENGINE (NO TEMPLATES)

### 2.1 Why Templates Fail

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEMPLATE vs GENERATION                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TEMPLATE APPROACH (WRONG):                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Input:  [campaign_topic]                                             │    │
│  │ Template: "unpopular opinion: [campaign_topic] is actually good"    │    │
│  │ Output: "unpopular opinion: Internet Court is actually good"        │    │
│  │                                                                      │    │
│  │ PROBLEMS:                                                            │    │
│  │ ❌ G4 Originality penalty (template detected)                        │    │
│  │ ❌ Same structure every time                                         │    │
│  │ ❌ AI detection easy                                                 │    │
│  │ ❌ No adaptation to unique campaign characteristics                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  GENERATION APPROACH (CORRECT):                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Input:  external_data + gap_analysis + emotion_weight               │    │
│  │                                                                      │    │
│  │ CALCULATION:                                                         │    │
│  │   hook_angle = identify_gap(competitor_analysis)                    │    │
│  │   hook_emotion = determine_emotion(market_sentiment, timing)        │    │
│  │   hook_words = generate_unique(facts, angle, emotion)               │    │
│  │                                                                      │    │
│  │ Output: GENERATED, not templated                                    │    │
│  │                                                                      │    │
│  │ ADVANTAGES:                                                          │    │
│  │ ✅ G4 Originality boost (unique per campaign)                        │    │
│  │ ✅ Different structure each time                                     │    │
│  │ ✅ Adapts to external conditions                                     │    │
│  │ ✅ No AI template detection                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Generation Engine Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GENERATION ENGINE ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                           ┌─────────────────┐                               │
│                           │  EXTERNAL DATA  │                               │
│                           │  (Collected)    │                               │
│                           └────────┬────────┘                               │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CALCULATION LAYER                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  GAP_CALCULATOR:                                                    │   │
│  │  ┌───────────────────────────────────────────────────────────┐      │   │
│  │  │ analyzed_hooks = [curiosity, educational, fomo, story]    │      │   │
│  │  │ all_possible_hooks = [contrarian, controversy,            │      │   │
│  │  │                        debate, revelation, case_study]    │      │   │
│  │  │ gap = all_possible - analyzed_hooks                       │      │   │
│  │  │ gap = [contrarian, controversy, debate, revelation]       │      │   │
│  │  │ selected_angle = weighted_random(gap)                     │      │   │
│  │  │ // Result: "controversy" (highest gap impact)             │      │   │
│  │  └───────────────────────────────────────────────────────────┘      │   │
│  │                                                                      │   │
│  │  EMOTION_DERIVER:                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐      │   │
│  │  │ market_emotion = IF fear_greed < 30: "fear"                │      │   │
│  │  │                 IF fear_greed > 70: "greed"                │      │   │
│  │  │                 ELSE: "curiosity"                          │      │   │
│  │  │ // fear_greed = 45 → curiosity                             │      │   │
│  │  │                                                           │      │   │
│  │  │ topic_emotion = analyze(campaign_topic)                    │      │   │
│  │  │ // "Internet Court" = justice, fairness, controversy      │      │   │
│  │  │                                                           │      │   │
│  │  │ final_emotion = combine(market_emotion, topic_emotion)    │      │   │
│  │  │ // Result: "righteous_indignation" (controversy + justice)│      │   │
│  │  └───────────────────────────────────────────────────────────┘      │   │
│  │                                                                      │   │
│  │  FR_TARGET_CALCULATOR:                                              │   │
│  │  ┌───────────────────────────────────────────────────────────┐      │   │
│  │  │ target_FR = calculate_FR_target(leaderboard_top)          │      │   │
│  │  │ current_top_FR = 5.84 (from leaderboard)                  │      │   │
│  │  │ target_FR = current_top_FR × 1.2 = 7.0                     │      │   │
│  │  │ // Need influencer reply potential                         │      │   │
│  │  │                                                           │      │   │
│  │  │ reply_bait_score = calculate_reply_potential(angle)       │      │   │
│  │  │ // controversy angle = HIGH reply potential               │      │   │
│  │  └───────────────────────────────────────────────────────────┘      │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    GENERATION LAYER                                  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  HOOK_GENERATOR (NO TEMPLATES):                                     │   │
│  │  ┌───────────────────────────────────────────────────────────┐      │   │
│  │  │ derive_hook(facts, gap_angle, emotion, FR_target):        │      │   │
│  │  │                                                           │      │   │
│  │  │ // NOT: "unpopular opinion: [X]"                          │      │   │
│  │  │ // BUT: Generate from FACTS + ANGLE + EMOTION             │      │   │
│  │  │                                                           │      │   │
│  │  │ fact_anchor = select_fact(facts, relevance_to_angle)      │      │   │
│  │  │ // "Traditional legal systems struggling with crypto"     │      │   │
│  │  │                                                           │      │   │
│  │  │ controversy_spark = create_tension(fact_anchor, gap)      │      │   │
│  │  │ // "Traditional courts CAN'T handle crypto disputes"      │      │   │
│  │  │                                                           │      │   │
│  │  │ emotion_injection = add_emotion(controversy_spark)        │      │   │
│  │  │ // Add righteous indignation                              │      │   │
│  │  │                                                           │      │   │
│  │  │ hook = "Code runs. Disputes don't. Enter Internet Court." │      │   │
│  │  │ // GENERATED, not templated!                              │      │   │
│  │  └───────────────────────────────────────────────────────────┘      │   │
│  │                                                                      │   │
│  │  BODY_GENERATOR:                                                    │   │
│  │  ┌───────────────────────────────────────────────────────────┐      │   │
│  │  │ generate_body(hook, facts, structure_type):               │      │   │
│  │  │                                                           │      │   │
│  │  │ structure = determine_structure(campaign_type, length)    │      │   │
│  │  │ // For Internet Court: problem → solution → call_to_action│      │   │
│  │  │                                                           │      │   │
│  │  │ word_count = calculate_optimal_length(platform, timing)   │      │   │
│  │  │ // Twitter: 71-100 chars optimal for engagement           │      │   │
│  │  │                                                           │      │   │
│  │  │ naturalness = ensure_human_voice(facts, avoid_patterns)   │      │   │
│  │  │ // Check for template patterns, AI phrases                │      │   │
│  │  └───────────────────────────────────────────────────────────┘      │   │
│  │                                                                      │   │
│  │  CALL_TO_ACTION_GENERATOR:                                          │   │
│  │  ┌───────────────────────────────────────────────────────────┐      │   │
│  │  │ derive_cta(engagement_goal, FR_target, platform):         │      │   │
│  │  │                                                           │      │   │
│  │  │ // For FR optimization: need REPLY potential              │      │   │
│  │  │ reply_bait = create_debate_invitation(angle)              │      │   │
│  │  │ // "What's your verdict?"                                 │      │   │
│  │  │                                                           │      │   │
│  │  │ // NOT template: "Drop your thoughts below"               │      │   │
│  │  │ // BUT contextual to campaign                             │      │   │
│  │  └───────────────────────────────────────────────────────────┘      │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│                           ┌─────────────────┐                               │
│                           │  UNIQUE OUTPUT  │                               │
│                           │  Per Campaign   │                               │
│                           └─────────────────┘                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 DEMO: Generation Engine Execution

```javascript
// ═══════════════════════════════════════════════════════════════════════════
// DEMO: Generation Engine - Internet Court Campaign
// ═══════════════════════════════════════════════════════════════════════════

async function generateContent(externalData, campaignData) {

  // ════════════════════════════════════════════════════════════════════════
  // STEP 1: CALCULATE PARAMETERS
  // ════════════════════════════════════════════════════════════════════════

  // Gap Analysis
  const gap = identifyGap(externalData.competitor.top_tweets_analysis);
  // Result: { missing: ["controversy", "contrarian", "debate"],
  //           selected: "controversy",
  //           reason: "highest engagement potential + no competitor using" }

  // Emotion Derivation
  const emotion = deriveEmotion({
    market: externalData.market,
    topic: campaignData.topic,
    gap: gap.selected
  });
  // Result: {
  //   primary: "righteous_indignation",
  //   secondary: "curiosity",
  //   arc: "tension → resolution",
  //   trigger: "injustice_resolved"
  // }

  // FR Target
  const frTarget = calculateFRTarget(externalData.competitor.top_tweets_analysis);
  // Result: {
  //   target_score: 7.0,
  //   strategy: "reply_bait",
  //   influencer_types: ["crypto_law", "defi_protocol", "dispute_resolution"],
  //   keywords_to_use: ["verdict", "court", "justice", "ruling"]
  // }

  // ════════════════════════════════════════════════════════════════════════
  // STEP 2: GENERATE HOOK (NO TEMPLATE!)
  // ════════════════════════════════════════════════════════════════════════

  const hook = await generateHook({
    // INPUTS (all calculated, no templates):
    facts: externalData.project.official_facts,
    gap_angle: gap.selected, // "controversy"
    emotion: emotion.primary, // "righteous_indignation"
    fr_strategy: frTarget.strategy, // "reply_bait"
    news_hooks: externalData.trends.news_hooks,

    // GENERATION RULES:
    rules: {
      max_length: 60, // Twitter optimal
      no_templates: [
        "unpopular opinion",
        "hot take",
        "change my mind",
        "nobody is talking about",
        "here's the thing"
      ],
      must_include: ["tension", "resolution hint"],
      emotion_weight: 0.7, // 70% emotion-driven
      fact_weight: 0.3    // 30% fact-driven
    }
  });

  // GENERATED HOOK:
  // "Code runs. Disputes don't. Enter Internet Court."
  //
  // WHY THIS HOOK:
  // - Tension: "Code runs. Disputes don't." (creates controversy)
  // - Resolution hint: "Enter Internet Court." (solution)
  // - Short: 46 characters (optimal for Twitter)
  // - No template: Generated from facts + gap + emotion
  // - Reply bait: People will debate "code vs disputes"

  // ════════════════════════════════════════════════════════════════════════
  // STEP 3: GENERATE THREAD BODY
  // ════════════════════════════════════════════════════════════════════════

  const thread = await generateThread({
    hook: hook,
    facts: externalData.project.official_facts,
    structure: "problem_agitation_solution",
    emotion_arc: emotion.arc,
    length: 7, // tweets
    cta_type: "reply_bait",

    rules: {
      no_link_until_tweet: 5, // Link strategy
      no_hashtag_until_tweet: 2, // Hashtag strategy
      hashtag_count: 1, // Optimal
      hashtag_location: "end",
      mention_requirements: campaignData.required_mentions,
      natural_language_check: true
    }
  });

  // GENERATED THREAD:
  return {
    hook: "Code runs. Disputes don't. Enter Internet Court.",

    tweet_2: "Traditional courts take months. Cost thousands. And still can't handle on-chain evidence properly. The system wasn't built for crypto.",

    tweet_3: "Internet Court changes that. Stake RLY, become a juror, resolve disputes on-chain. No lawyers. No delays. Just code.",

    tweet_4: "The beautiful part? Incentives align naturally. Good jurors get rewarded. Bad rulings get slashed. Skin in the game = better decisions.",

    tweet_5: "Already seeing real cases. Wallet disputes. NFT ownership. Smart contract conflicts. Stuff traditional courts would dismiss as 'not real.'",

    tweet_6: "This is what decentralized justice looks like. Not perfect, but evolving. And way faster than waiting 2 years for a court date.",

    tweet_7: "What's your verdict? Would you trust 12 random RLY stakers over a judge who doesn't know what a blockchain is? #InternetCourt",

    metadata: {
      hook_type: "controversy", // Generated, not template
      emotion: "righteous_indignation",
      angle: "system_criticism",
      fr_potential: 7.2,
      reply_bait_score: 8.5,
      originality_score: "HIGH" // No templates used
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON: Template vs Generation
// ═══════════════════════════════════════════════════════════════════════════

/*
TEMPLATE APPROACH (V7.0 FINAL - WRONG):
─────────────────────────────────────────────────────────────────────────────
Hook: "unpopular opinion: Internet Court is the future of justice"
       ^^^^^^^^^^^^^^^^^^^
       TEMPLATE DETECTED!

Problems:
- G4 Originality: PENALTY (same structure as other campaigns)
- AI Detection: HIGH RISK
- Engagement: MEDIUM (seen before)
- FR Potential: 5.2 (no reply bait)

GENERATION APPROACH (V8.0 - CORRECT):
─────────────────────────────────────────────────────────────────────────────
Hook: "Code runs. Disputes don't. Enter Internet Court."
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
       GENERATED FROM:
       - Facts: "On-chain dispute resolution"
       - Gap: "controversy" (missing in leaderboard)
       - Emotion: "righteous_indignation"
       - FR Target: reply_bait strategy

Advantages:
- G4 Originality: BONUS (unique structure)
- AI Detection: LOW RISK
- Engagement: HIGH (controversy + tension)
- FR Potential: 7.2 (high reply bait)
*/
```

---

## 🔬 PART 3: INTEGRATION FLOW

### 3.1 Complete Workflow Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTEGRATED WORKFLOW (V8.0)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 0: Pre-Workflow                                                       │
│  ────────────────────────                                                    │
│  ├─ Input: campaign_id, user_context                                        │
│  └─ Output: workflow_initialized                                            │
│                                                                              │
│  PHASE 1: Campaign Research (Internal API)                                  │
│  ────────────────────────────────────                                        │
│  ├─ Fetch: campaign_details, requirements, leaderboard                      │
│  └─ Output: campaign_data, top_scores, required_elements                    │
│                                                                              │
│  PHASE 1.5: Leaderboard Gap Analysis                                        │
│  ────────────────────────────────                                            │
│  ├─ Analyze: top_10_tweets                                                  │
│  ├─ Identify: hook_types, emotions, angles used                             │
│  ├─ Calculate: GAP = all_types - used_types                                 │
│  └─ Output: gap_opportunities, angle_to_exploit                             │
│                                                                              │
│  PHASE 1.6: Timing Optimization (V3.14)                                     │
│  ──────────────────────────────────                                          │
│  ├─ Calculate: optimal_window                                               │
│  ├─ Determine: audience_timezone                                            │
│  └─ Output: post_timing, data_freshness_requirement                         │
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════╗     │
│  ║ PHASE 1.7: EXTERNAL DATA COLLECTION (NEW!)                        ║     │
│  ╠═══════════════════════════════════════════════════════════════════╣     │
│  ║                                                                   ║     │
│  ║  Step 1: CALCULATE what data is needed                           ║     │
│  ║  ─────────────────────────────────────                           ║     │
│  ║  ├─ IF campaign_token EXISTS → market_data = TRUE                ║     │
│  ║  ├─ IF timing = peak → data_freshness = real-time                ║     │
│  ║  ├─ IF gap = controversy → news_hooks = TRUE                     ║     │
│  ║  └─ ALWAYS → project_data = TRUE                                 ║     │
│  ║                                                                   ║     │
│  ║  Step 2: FETCH calculated data                                   ║     │
│  ║  ────────────────────────────                                     ║     │
│  ║  ├─ Market: BTC/ETH, Fear&Greed, token_price                     ║     │
│  ║  ├─ News: trending_topics, breaking_news                         ║     │
│  ║  ├─ Competitor: gap_analysis, patterns                           ║     │
│  ║  └─ Project: official_facts, terminology                         ║     │
│  ║                                                                   ║     │
│  ║  Step 3: DERIVE generation parameters                            ║     │
│  ║  ────────────────────────────────────                            ║     │
│  ║  ├─ emotion_weight = f(market_sentiment, timing)                 ║     │
│  ║  ├─ angle = select_from(gap_opportunities)                       ║     │
│  ║  ├─ FR_target = f(leaderboard_top_scores)                        ║     │
│  ║  └─ Output: external_data, generation_params                     ║     │
│  ║                                                                   ║     │
│  ╚═══════════════════════════════════════════════════════════════════╝     │
│                                                                              │
│  PHASE 2: Knowledge Base Extraction                                         │
│  ──────────────────────────────────                                          │
│  ├─ Combine: campaign_data + external_data                                  │
│  ├─ Extract: key_facts, terminology, value_prop                             │
│  └─ Output: knowledge_base                                                  │
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════╗     │
│  ║ PHASE 3: GENERATION ENGINE (NEW!)                                 ║     │
│  ╠═══════════════════════════════════════════════════════════════════╣     │
│  ║                                                                   ║     │
│  ║  NO TEMPLATES - All calculated:                                  ║     │
│  ║                                                                   ║     │
│  ║  Hook = derive(                                                  ║     │
│  ║    facts = knowledge_base.key_facts,                             ║     │
│  ║    gap = gap_opportunities.selected,                             ║     │
│  ║    emotion = generation_params.emotion_weight,                   ║     │
│  ║    FR_target = generation_params.FR_target                       ║     │
│  ║  )                                                               ║     │
│  ║                                                                   ║     │
│  ║  Body = generate(                                                ║     │
│  ║    hook = generated_hook,                                        ║     │
│  ║    facts = knowledge_base,                                       ║     │
│  ║    structure = determine_structure(campaign_type),               ║     │
│  ║    naturalness = ensure_human_voice(avoid_templates)             ║     │
│  ║  )                                                               ║     │
│  ║                                                                   ║     │
│  ║  CTA = derive(                                                   ║     │
│  ║    engagement_goal = "reply",                                    ║     │
│  ║    FR_strategy = generation_params.FR_target,                    ║     │
│  ║    context = campaign_context                                    ║     │
│  ║  )                                                               ║     │
│  ║                                                                   ║     │
│  ╚═══════════════════════════════════════════════════════════════════╝     │
│                                                                              │
│  PHASE 4-8: Enhancement Layers                                              │
│  ─────────────────────────────                                              │
│  ├─ Phase 4: Thread Structure                                               │
│  ├─ Phase 5: Invisible Influence (V7.0 FINAL)                               │
│  ├─ Phase 6: Viral Mechanics (V3.16)                                        │
│  ├─ Phase 7: Psychological Triggers (V3.16)                                 │
│  └─ Phase 8: Network Effect / FR Strategy (V5.0)                            │
│                                                                              │
│  PHASE 9-11: Optimization                                                   │
│  ─────────────────────────────                                              │
│  ├─ Phase 9: Micro-Optimization                                             │
│  ├─ Phase 10: Multi-Version Generation                                      │
│  └─ Phase 11: Benchmark Comparison                                          │
│                                                                              │
│  PHASE 12: Quality Scoring (BEFORE submit!)                                 │
│  ─────────────────────────────────────                                       │
│  ├─ Gate Scoring: G1-G4 (0-4 each, 4 aspects each)                          │
│  ├─ Quality Scoring: EP, TQ (0-8 each)                                      │
│  └─ Master Score: 32/32 target                                              │
│                                                                              │
│  PHASE 13: Iterative Refinement + Rescore Loop                              │
│  ───────────────────────────────────────────                                 │
│  ├─ IF score < target → refine → rescore                                    │
│  └─ Max 3 iterations                                                        │
│                                                                              │
│  PHASE 14-19: Submit & Post-Submit                                          │
│  ─────────────────────────────────                                          │
│  └─ Submit, track, refresh engagement                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 SUMMARY: Key Differences

| Aspect | OLD (Template) | NEW (Generation) |
|--------|----------------|------------------|
| **Hook Source** | Template library | Calculated from data |
| **External Data** | None | Conditional fetching |
| **Gap Analysis** | Static | Dynamic calculation |
| **Emotion** | Pre-selected | Derived from market + topic |
| **FR Strategy** | After content | Before content generation |
| **Originality** | PENALTY risk | BONUS potential |
| **AI Detection** | HIGH risk | LOW risk |
| **Uniqueness** | Similar across campaigns | Unique per campaign |

---

## ✅ NEXT STEPS

1. **Implement Web Search Integration** untuk Phase 1.7
2. **Build Generation Engine** untuk Phase 3
3. **Create Template Detection** untuk validation
4. **Test dengan Multiple Campaigns** untuk verify uniqueness

---

**END OF DEMO**
