================================================================================
                    RALLY WORKFLOW V8.0 - COMPLETE EDITION
                    "From Template-Based to Generation-Based"
================================================================================

Version: 8.0.0
Release Date: 2025
Status: PRODUCTION READY
Total Phases: 21
Skills Integrated: LLM, WEB-SEARCH, WEB-READER, FINANCE, VLM

================================================================================
                            TABLE OF CONTENTS
================================================================================

SECTION 1:  OVERVIEW & PHILOSOPHY
SECTION 2:  PHASE 0 - PRE-WORKFLOW PREPARATION
SECTION 3:  PHASE 1 - CAMPAIGN RESEARCH
SECTION 4:  PHASE 1.5 - LEADERBOARD ANALYSIS
SECTION 5:  PHASE 1.6 - MARKET CONTEXT (NEW)
SECTION 6:  PHASE 1.7 - EXTERNAL DATA COLLECTION (NEW)
SECTION 7:  PHASE 2 - KNOWLEDGE BASE EXTRACTION
SECTION 8:  PHASE 3 - GENERATION ENGINE (REWRITTEN)
SECTION 9:  PHASE 4 - THREAD STRUCTURE
SECTION 10: PHASE 5 - INVISIBLE INFLUENCE
SECTION 11: PHASE 6 - VIRAL MECHANICS
SECTION 12: PHASE 7 - PSYCHOLOGICAL TRIGGERS
SECTION 13: PHASE 8 - NETWORK EFFECT / FR STRATEGY
SECTION 14: PHASE 9 - MICRO-OPTIMIZATION
SECTION 15: PHASE 10 - MULTI-VERSION GENERATION
SECTION 16: PHASE 11 - BENCHMARK COMPARISON
SECTION 17: PHASE 12 - QUALITY SCORING
SECTION 18: PHASE 13 - ITERATIVE REFINEMENT
SECTION 19: PHASE 14-15 - PRE-SUBMIT
SECTION 20: PHASE 16-21 - POST-SUBMIT
SECTION 21: SKILL INTEGRATION CODE (ORKESTRATOR)
SECTION 22: SCORING SYSTEM COMPLETE
SECTION 23: TEMPLATE BLACKLIST
SECTION 24: DECISION MATRICES
SECTION 25: QUICK REFERENCE CARD
SECTION 26: VERSION HISTORY

================================================================================
                    SECTION 1: OVERVIEW & PHILOSOPHY
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                    V8.0 CORE PRINCIPLES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PRINCIPLE 1: NO TEMPLATES                                                   │
│  ────────────────────────────                                                │
│  All content must be GENERATED, not filled from templates.                  │
│  Templates create similarity → G4 Originality penalty.                      │
│  Generation creates uniqueness → G4 Originality bonus.                      │
│                                                                              │
│  PRINCIPLE 2: EXTERNAL DATA IS MANDATORY                                    │
│  ────────────────────────────────────────                                    │
│  Every campaign MUST fetch external data before generation.                 │
│  Internal Rally API is NOT enough for unique content.                       │
│  External data provides: trends, context, competitor gaps, news hooks.      │
│                                                                              │
│  PRINCIPLE 3: CALCULATION OVER SELECTION                                     │
│  ──────────────────────────────────                                          │
│  Emotion, angle, hook structure = CALCULATED from data.                     │
│  NOT selected from pre-defined options.                                      │
│  This ensures uniqueness per campaign.                                       │
│                                                                              │
│  PRINCIPLE 4: SKILL INTEGRATION                                              │
│  ────────────────────────────                                                │
│  LLM: Generation + Prediction + Optimization                                │
│  WEB-SEARCH: Trending topics + News + Competitor content                    │
│  WEB-READER: Deep content extraction                                        │
│  FINANCE: Market context for crypto campaigns                               │
│  VLM: Screenshot analysis (optional)                                        │
│                                                                              │
│  PRINCIPLE 5: ENHANCEMENT BEFORE SCORING                                     │
│  ──────────────────────────────────                                          │
│  WRONG: Research → Scoring → Enhancement → Submit                           │
│  CORRECT: Research → Enhancement → Scoring → Refine → Rescore → Submit      │
│                                                                              │
│  PRINCIPLE 6: FR STRATEGY INTEGRATION                                        │
│  ────────────────────────────────                                            │
│  FR (Followers of Repliers) = Most important engagement metric.             │
│  FR strategy must be INTEGRATED into generation, not added after.           │
│  "1 reply from 100K account > 100 replies from 100 accounts"               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    V8.0 SKILL INTEGRATION OVERVIEW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        SKILL FLOW MAP                                │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │  FINANCE ──────────→ Phase 1.6 ─────→ Market Emotion               │    │
│  │      │                                  Calculation                  │    │
│  │      │                                        │                      │    │
│  │      ▼                                        ▼                      │    │
│  │  WEB-SEARCH ────→ Phase 1.7 ─────→ External Facts ──┐              │    │
│  │      │                                              │              │    │
│  │      ▼                                              │              │    │
│  │  WEB-READER ─────→ Deep Content ────→ More Facts ───┤              │    │
│  │                                                      │              │    │
│  │                                                      ▼              │    │
│  │  VLM ────────────→ Phase 1.5 ────→ Competitor ──────┤              │    │
│  │                      │              Patterns         │              │    │
│  │                      │                    │          │              │    │
│  │                      ▼                    ▼          ▼              │    │
│  │                    GAP ANALYSIS ◄────────────────────┘              │    │
│  │                           │                                         │    │
│  │                           ▼                                         │    │
│  │  LLM ────────────→ Phase 3 ────────→ GENERATION ENGINE             │    │
│  │      │                   │                    │                     │    │
│  │      │                   ▼                    ▼                     │    │
│  │      │              Hook + Thread      Unique Content               │    │
│  │      │                   │                    │                     │    │
│  │      │                   ▼                    ▼                     │    │
│  │      └───────────→ Phase 12 ────────→ Score Prediction              │    │
│  │                           │                                         │    │
│  │                           ▼                                         │    │
│  │                    Optimization Loop                                 │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    V8.0 PHASE STRUCTURE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE GROUPINGS:                                                           │
│                                                                              │
│  GROUP A: RESEARCH & DATA (Phase 0-2)                                       │
│  ├── Phase 0: Pre-Workflow Preparation                                      │
│  ├── Phase 1: Campaign Research (Rally API)                                │
│  ├── Phase 1.5: Leaderboard Analysis                                        │
│  ├── Phase 1.6: Market Context (NEW - FINANCE skill)                        │
│  ├── Phase 1.7: External Data Collection (NEW - WEB-SEARCH/READER)          │
│  └── Phase 2: Knowledge Base Extraction                                     │
│                                                                              │
│  GROUP B: GENERATION (Phase 3-4)                                            │
│  ├── Phase 3: Generation Engine (REWRITTEN - LLM skill)                     │
│  └── Phase 4: Thread Structure                                              │
│                                                                              │
│  GROUP C: ENHANCEMENT (Phase 5-9)                                           │
│  ├── Phase 5: Invisible Influence                                           │
│  ├── Phase 6: Viral Mechanics                                               │
│  ├── Phase 7: Psychological Triggers                                        │
│  ├── Phase 8: Network Effect / FR Strategy                                  │
│  └── Phase 9: Micro-Optimization                                            │
│                                                                              │
│  GROUP D: OPTIMIZATION (Phase 10-11)                                        │
│  ├── Phase 10: Multi-Version Generation                                     │
│  └── Phase 11: Benchmark Comparison                                         │
│                                                                              │
│  GROUP E: SCORING (Phase 12-13)                                             │
│  ├── Phase 12: Quality Scoring                                              │
│  └── Phase 13: Iterative Refinement                                         │
│                                                                              │
│  GROUP F: SUBMISSION (Phase 14-21)                                          │
│  ├── Phase 14: Pre-Submit Validation                                        │
│  ├── Phase 15: Final Review                                                 │
│  ├── Phase 16: Submit                                                       │
│  ├── Phase 17: Engagement Tracking                                          │
│  ├── Phase 18: Refresh Engagement                                           │
│  ├── Phase 19: Performance Analysis                                         │
│  ├── Phase 20: Learning Integration                                         │
│  └── Phase 21: Campaign Completion                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 2: PHASE 0 - PRE-WORKFLOW PREPARATION
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: PRE-WORKFLOW PREPARATION                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Initialize all systems and validate inputs                      │
│  DURATION: Immediate                                                        │
│  SKILLS: None                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 0.1: INPUT VALIDATION                                                 │
│  ──────────────────────────                                                  │
│  Required Inputs:                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Input                  │ Type    │ Validation                      │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ campaign_id            │ string  │ Must exist in Rally API         │    │
│  │ user_wallet_address    │ string  │ Valid Ethereum address          │    │
│  │ submission_period      │ number  │ Active campaign period          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 0.2: SKILL INITIALIZATION                                             │
│  ───────────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Skill        │ Initialize | Purpose                                 │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ LLM          │ Yes        │ Generation + Prediction                 │    │
│  │ WEB-SEARCH   │ Yes        │ External data                          │    │
│  │ WEB-READER   │ Yes        │ Deep extraction                        │    │
│  │ FINANCE      │ Conditional│ Only if crypto-related campaign        │    │
│  │ VLM          │ Optional   │ Screenshot analysis                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 0.3: WORKFLOW STATE INITIALIZATION                                    │
│  ──────────────────────────────────────                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ State Variable         │ Initial Value | Description                │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ workflow_id            │ UUID          │ Unique execution ID        │    │
│  │ start_timestamp        │ now()         │ Execution start            │    │
│  │ current_phase          │ 0             │ Phase pointer              │    │
│  │ iteration_count        │ 0             │ Refinement iterations      │    │
│  │ max_iterations         │ 3             │ Maximum refinement loops   │    │
│  │ external_data          │ {}            │ Collected external data    │    │
│  │ generated_content      │ null          │ Generated content          │    │
│  │ predicted_scores       │ {}            │ LLM-predicted scores       │    │
│  │ actual_scores          │ {}            │ Rally API scores           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "status": "initialized",                                           │    │
│  │   "workflow_id": "uuid-xxxx",                                        │    │
│  │   "skills_ready": ["LLM", "WEB-SEARCH", "WEB-READER", "FINANCE"],   │    │
│  │   "next_phase": 1                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 3: PHASE 1 - CAMPAIGN RESEARCH
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: CAMPAIGN RESEARCH                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Gather all campaign data from Rally API                         │
│  DURATION: 30-60 seconds                                                    │
│  SKILLS: None (Rally API internal)                                          │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 1.1: FETCH CAMPAIGN DETAILS                                           │
│  ────────────────────────────────                                            │
│  API Endpoint: GET /campaigns/{campaign_id}                                 │
│                                                                              │
│  Extract:                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Field                  │ Description                                │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ campaign_name          │ Campaign title                             │    │
│  │ campaign_description   │ Full description                           │    │
│  │ campaign_type          │ Category (protocol, event, product, etc.) │    │
│  │ start_date             │ Campaign start                             │    │
│  │ end_date               │ Campaign end                               │    │
│  │ reward_pool            │ Total rewards available                    │    │
│  │ distribution_curve     │ Balanced/Default/Extreme                   │    │
│  │ metric_weights         │ Weights for each of 11 metrics            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.2: FETCH CAMPAIGN REQUIREMENTS                                      │
│  ────────────────────────────────────────                                    │
│  API Endpoint: GET /campaigns/{campaign_id}/requirements                    │
│                                                                              │
│  Extract:                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Requirement Type       │ Data to Extract                            │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ Required mentions      │ Twitter handles to mention (@handle)       │    │
│  │ Required hashtags      │ Hashtags to include (#tag)                 │    │
│  │ Required links         │ URLs to include                            │    │
│  │ Required keywords      │ Keywords that must appear                  │    │
│  │ Format requirements    │ Thread length, media requirements          │    │
│  │ Style guidelines       │ Tone, voice, restrictions                  │    │
│  │ Prohibited content     │ What to avoid                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.3: FETCH CAMPAIGN KNOWLEDGE BASE                                    │
│  ───────────────────────────────────────                                     │
│  API Endpoint: GET /campaigns/{campaign_id}/knowledge-base                  │
│                                                                              │
│  Extract:                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Knowledge Type         │ Purpose                                    │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ Official facts         │ G2 Information Accuracy source             │    │
│  │ Key terminology        │ G1 Content Alignment source                │    │
│  │ Value propositions     │ Content focus points                       │    │
│  │ Project background     │ Context for content                        │    │
│  │ Official links         │ Required references                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.4: CLASSIFY CAMPAIGN TYPE                                           │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Classification Logic:                                                │    │
│  │                                                                      │    │
│  │ IF campaign_mentions_token():                                       │    │
│  │   has_token = TRUE                                                  │    │
│  │   token_symbol = extract_token_symbol()                             │    │
│  │                                                                      │    │
│  │ IF campaign_topic IN ["protocol", "DeFi", "blockchain"]:           │    │
│  │   is_crypto_related = TRUE                                          │    │
│  │                                                                      │    │
│  │ IF campaign_topic IN ["legal", "court", "dispute", "regulation"]:  │    │
│  │   is_legal_topic = TRUE                                             │    │
│  │                                                                      │    │
│  │ IF campaign_type == "event":                                        │    │
│  │   is_time_sensitive = TRUE                                          │    │
│  │                                                                      │    │
│  │ OUTPUT: campaign_classification                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "campaign_details": {...},                                         │    │
│  │   "requirements": {...},                                             │    │
│  │   "knowledge_base": {...},                                           │    │
│  │   "classification": {                                                │    │
│  │     "has_token": true,                                               │    │
│  │     "token_symbol": "RLY",                                           │    │
│  │     "is_crypto_related": true,                                       │    │
│  │     "is_legal_topic": true,                                          │    │
│  │     "is_time_sensitive": false                                       │    │
│  │   },                                                                 │    │
│  │   "next_phase": 1.5                                                  │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 4: PHASE 1.5 - LEADERBOARD ANALYSIS
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1.5: LEADERBOARD ANALYSIS                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Analyze top performers to identify gaps and opportunities       │
│  DURATION: 60-120 seconds                                                   │
│  SKILLS: VLM (optional, for screenshot analysis)                            │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 1.5.1: FETCH LEADERBOARD DATA                                         │
│  ──────────────────────────────────                                          │
│  API Endpoint: GET /campaigns/{campaign_id}/leaderboard                     │
│                                                                              │
│  Extract for top 10 submissions:                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Data Point              │ Purpose                                    │    │
│  │─────────────────────────────────────────────────────────────────────│    │
│  │ Tweet content           │ Pattern analysis                           │    │
│  │ Campaign Points         │ Score benchmarking                         │    │
│  │ Engagement metrics      │ RT, likes, replies, FR                     │    │
│  │ Gate scores             │ G1, G2, G3, G4 breakdown                   │    │
│  │ Quality scores          │ EP, TQ breakdown                           │    │
│  │ Timestamp               │ Timing analysis                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.5.2: PATTERN ANALYSIS                                               │
│  ──────────────────────────                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ FOR each tweet in top_10:                                            │    │
│  │                                                                      │    │
│  │   // Hook Type Classification                                       │    │
│  │   hook_type = classify_hook(tweet.first_line)                       │    │
│  │   // Types: curiosity, controversy, contrarian, educational,        │    │
│  │   //        fomo, story, revelation, debate, case_study             │    │
│  │                                                                      │    │
│  │   // Emotion Classification                                         │    │
│  │   emotion_type = classify_emotion(tweet.content)                    │    │
│  │   // Types: fear, greed, curiosity, excitement, anger,              │    │
│  │   //        surprise, empathy, pride, righteous_indignation         │    │
│  │                                                                      │    │
│  │   // Content Angle Classification                                   │    │
│  │   angle_type = classify_angle(tweet.content)                        │    │
│  │   // Types: educational, promotional, controversial,                │    │
│  │   //        personal, news, tutorial, comparison, prediction        │    │
│  │                                                                      │    │
│  │   // Structure Classification                                       │    │
│  │   structure_type = classify_structure(tweet.thread)                 │    │
│  │   // Types: problem_solution, listicle, story_arc,                  │    │
│  │   //        comparison, how_to, news_analysis                       │    │
│  │                                                                      │    │
│  │   ADD TO analysis_results                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.5.3: GAP IDENTIFICATION                                             │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ALL_HOOK_TYPES = [                                                   │    │
│  │   "curiosity", "controversy", "contrarian", "educational",          │    │
│  │   "fomo", "story", "revelation", "debate", "case_study"             │    │
│  │ ]                                                                    │    │
│  │                                                                      │    │
│  │ ALL_EMOTION_TYPES = [                                                │    │
│  │   "fear", "greed", "curiosity", "excitement", "anger",              │    │
│  │   "surprise", "empathy", "pride", "righteous_indignation"           │    │
│  │ ]                                                                    │    │
│  │                                                                      │    │
│  │ ALL_ANGLE_TYPES = [                                                  │    │
│  │   "educational", "promotional", "controversial", "personal",        │    │
│  │   "news", "tutorial", "comparison", "prediction"                    │    │
│  │ ]                                                                    │    │
│  │                                                                      │    │
│  │ FOUND_HOOKS = unique(analysis_results.hook_types)                   │    │
│  │ FOUND_EMOTIONS = unique(analysis_results.emotion_types)             │    │
│  │ FOUND_ANGLES = unique(analysis_results.angle_types)                 │    │
│  │                                                                      │    │
│  │ GAP_HOOKS = ALL_HOOK_TYPES - FOUND_HOOKS                            │    │
│  │ GAP_EMOTIONS = ALL_EMOTION_TYPES - FOUND_EMOTIONS                   │    │
│  │ GAP_ANGLES = ALL_ANGLE_TYPES - FOUND_ANGLES                         │    │
│  │                                                                      │    │
│  │ // Select highest impact gap                                        │    │
│  │ SELECTED_GAP = select_by_impact(GAP_HOOKS, GAP_ANGLES)              │    │
│  │ // Priority: controversy > contrarian > revelation > debate         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.5.4: BENCHMARK CALCULATION                                          │
│  ────────────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ // Calculate target scores                                          │    │
│  │ top_score = max(leaderboard.campaign_points)                        │    │
│  │ avg_top_3_score = mean(leaderboard[0:3].campaign_points)            │    │
│  │ target_score = avg_top_3_score * 1.2  // Aim 20% above average      │    │
│  │                                                                      │    │
│  │ // Calculate engagement benchmarks                                  │    │
│  │ benchmark_RT = calculate_benchmark(leaderboard, "retweets")         │    │
│  │ benchmark_LK = calculate_benchmark(leaderboard, "likes")            │    │
│  │ benchmark_RP = calculate_benchmark(leaderboard, "replies")          │    │
│  │ benchmark_FR = calculate_benchmark(leaderboard, "FR")               │    │
│  │                                                                      │    │
│  │ // FR Target (most important)                                      │    │
│  │ target_FR = max(leaderboard.FR) * 1.2                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.5.5: VLM SCREENSHOT ANALYSIS (Optional)                             │
│  ───────────────────────────────────────────────────                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ IF tweet_screenshots_available:                                     │    │
│  │                                                                      │    │
│  │   FOR each screenshot in top_5_screenshots:                         │    │
│  │     analysis = VLM_ANALYZE(screenshot, prompt:                      │    │
│  │       "Analyze this tweet for:                                      │    │
│  │        1. Hook pattern used                                         │    │
│  │        2. Visual elements (images, formatting)                      │    │
│  │        3. Engagement metrics visible                                │    │
│  │        4. What makes it engaging?                                   │    │
│  │        Output as JSON.")                                            │    │
│  │                                                                      │    │
│  │     ADD analysis TO screenshot_analyses                             │    │
│  │                                                                      │    │
│  │   // Extract visual patterns                                       │    │
│  │   visual_patterns = extract_visual_patterns(screenshot_analyses)    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "leaderboard_data": {...},                                         │    │
│  │   "pattern_analysis": {                                              │    │
│  │     "found_hooks": ["curiosity", "educational", "story"],           │    │
│  │     "found_emotions": ["curiosity", "excitement"],                  │    │
│  │     "found_angles": ["educational", "promotional"]                  │    │
│  │   },                                                                 │    │
│  │   "gap_analysis": {                                                  │    │
│  │     "missing_hooks": ["controversy", "contrarian", "debate"],       │    │
│  │     "missing_emotions": ["anger", "righteous_indignation"],         │    │
│  │     "missing_angles": ["controversial", "comparison"],              │    │
│  │     "selected_gap": "controversy",                                   │    │
│  │     "gap_reason": "Highest engagement potential, not used"           │    │
│  │   },                                                                 │    │
│  │   "benchmarks": {                                                    │    │
│  │     "top_score": 5.29,                                               │    │
│  │     "target_score": 6.5,                                             │    │
│  │     "target_FR": 7.0,                                                │    │
│  │     "benchmark_RT": 5,                                               │    │
│  │     "benchmark_LK": 20,                                              │    │
│  │     "benchmark_RP": 10                                               │    │
│  │   },                                                                 │    │
│  │   "next_phase": 1.6                                                  │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 5: PHASE 1.6 - MARKET CONTEXT (NEW)
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1.6: MARKET CONTEXT                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Fetch market data for emotion calculation                       │
│  DURATION: 10-30 seconds                                                    │
│  SKILLS: FINANCE                                                            │
│  CONDITION: Only if campaign.is_crypto_related == TRUE                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 1.6.1: DETERMINE DATA NEEDS                                           │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ IF campaign.has_token:                                              │    │
│  │   needs_token_data = TRUE                                           │    │
│  │   token_symbol = campaign.token_symbol                              │    │
│  │                                                                      │    │
│  │ IF campaign.is_crypto_related:                                      │    │
│  │   needs_btc_data = TRUE                                             │    │
│  │   needs_eth_data = TRUE                                             │    │
│  │   needs_fear_greed = TRUE                                           │    │
│  │                                                                      │    │
│  │ IF campaign.type == "trading" OR campaign.type == "investment":     │    │
│  │   needs_market_cap = TRUE                                           │    │
│  │   needs_volume = TRUE                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.6.2: FETCH MARKET DATA (FINANCE SKILL)                              │
│  ───────────────────────────────────────────────                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ // Using FINANCE skill                                              │    │
│  │                                                                      │    │
│  │ async function fetchMarketData(campaign) {                          │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │   const marketData = {};                                            │    │
│  │                                                                      │    │
│  │   // Fetch BTC data                                                 │    │
│  │   if (campaign.is_crypto_related) {                                 │    │
│  │     const btcData = await zai.functions.invoke('finance', {         │    │
│  │       function: 'quote',                                            │    │
│  │       symbol: 'BTC'                                                 │    │
│  │     });                                                             │    │
│  │     marketData.BTC = {                                              │    │
│  │       price: btcData.price,                                         │    │
│  │       change_24h: btcData.changePercent24h,                         │    │
│  │       change_7d: btcData.changePercent7d                            │    │
│  │     };                                                              │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Fetch ETH data                                                 │    │
│  │   if (campaign.is_crypto_related) {                                 │    │
│  │     const ethData = await zai.functions.invoke('finance', {         │    │
│  │       function: 'quote',                                            │    │
│  │       symbol: 'ETH'                                                 │    │
│  │     });                                                             │    │
│  │     marketData.ETH = {                                              │    │
│  │       price: ethData.price,                                         │    │
│  │       change_24h: ethData.changePercent24h                          │    │
│  │     };                                                              │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Fetch project token data                                       │    │
│  │   if (campaign.has_token) {                                         │    │
│  │     const tokenData = await zai.functions.invoke('finance', {       │    │
│  │       function: 'quote',                                            │    │
│  │       symbol: campaign.token_symbol                                 │    │
│  │     });                                                             │    │
│  │     marketData.token = {                                            │    │
│  │       symbol: campaign.token_symbol,                                │    │
│  │       price: tokenData.price,                                       │    │
│  │       change_24h: tokenData.changePercent24h                        │    │
│  │     };                                                              │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Fear & Greed Index (if available via API)                      │    │
│  │   marketData.fear_greed = await fetchFearGreedIndex();              │    │
│  │                                                                      │    │
│  │   return marketData;                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.6.3: CALCULATE MARKET EMOTION                                       │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function calculateMarketEmotion(marketData) {                       │    │
│  │                                                                      │    │
│  │   let marketEmotion = {                                             │    │
│  │     primary: "neutral",                                             │    │
│  │     secondary: "curiosity",                                         │    │
│  │     intensity: 0.5,                                                 │    │
│  │     trend_jacking_opportunity: false                                │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   // Analyze BTC movement                                           │    │
│  │   const btcChange = marketData.BTC?.change_24h || 0;                │    │
│  │                                                                      │    │
│  │   if (Math.abs(btcChange) > 5) {                                    │    │
│  │     marketEmotion.trend_jacking_opportunity = true;                 │    │
│  │     marketEmotion.intensity = 0.8;                                  │    │
│  │                                                                      │    │
│  │     if (btcChange > 5) {                                            │    │
│  │       marketEmotion.primary = "greed";                              │    │
│  │       marketEmotion.secondary = "fomo";                             │    │
│  │       marketEmotion.content_angle = "opportunity";                  │    │
│  │     } else if (btcChange < -5) {                                    │    │
│  │       marketEmotion.primary = "fear";                               │    │
│  │       marketEmotion.secondary = "concern";                          │    │
│  │       marketEmotion.content_angle = "reassurance";                  │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Analyze Fear & Greed Index                                     │    │
│  │   const fearGreed = marketData.fear_greed?.value || 50;             │    │
│  │                                                                      │    │
│  │   if (fearGreed < 30) {                                             │    │
│  │     marketEmotion.primary = "fear";                                 │    │
│  │     marketEmotion.content_angle = "contrarian_opportunity";         │    │
│  │   } else if (fearGreed > 70) {                                      │    │
│  │     marketEmotion.primary = "greed";                                │    │
│  │     marketEmotion.content_angle = "caution_or_celebration";         │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Token-specific analysis                                        │    │
│  │   if (marketData.token) {                                           │    │
│  │     const tokenChange = marketData.token.change_24h;                │    │
│  │     if (Math.abs(tokenChange) > 10) {                               │    │
│  │       marketEmotion.token_momentum = tokenChange > 0 ? "bullish" : "bearish"; │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return marketEmotion;                                             │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.6.4: DETERMINE CONTENT URGENCY                                      │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function determineContentUrgency(marketEmotion, timing) {           │    │
│  │                                                                      │    │
│  │   if (marketEmotion.trend_jacking_opportunity) {                    │    │
│  │     return {                                                        │    │
│  │       urgency: "immediate",                                         │    │
│  │       reason: "Market movement > 5%, trend jacking opportunity",    │    │
│  │       optimal_post_window: "within_30_minutes"                      │    │
│  │     };                                                              │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   if (timing.is_peak_hour) {                                        │    │
│  │     return {                                                        │    │
│  │       urgency: "high",                                              │    │
│  │       reason: "Peak posting hours, maximize reach",                 │    │
│  │       optimal_post_window: "within_1_hour"                          │    │
│  │     };                                                              │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     urgency: "normal",                                              │    │
│  │     reason: "No urgent market conditions",                          │    │
│  │     optimal_post_window: "anytime_today"                            │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "market_data": {                                                   │    │
│  │     "BTC": { "price": 67500, "change_24h": 1.2 },                   │    │
│  │     "ETH": { "price": 3450, "change_24h": -0.5 },                   │    │
│  │     "token": { "symbol": "RLY", "price": 0.012, "change_24h": 3.2 },│    │
│  │     "fear_greed": { "value": 45, "label": "Fear" }                  │    │
│  │   },                                                                 │    │
│  │   "market_emotion": {                                                │    │
│  │     "primary": "neutral",                                            │    │
│  │     "secondary": "curiosity",                                        │    │
│  │     "intensity": 0.5,                                                │    │
│  │     "trend_jacking_opportunity": false,                             │    │
│  │     "content_angle": "neutral"                                       │    │
│  │   },                                                                 │    │
│  │   "content_urgency": {                                               │    │
│  │     "urgency": "normal",                                             │    │
│  │     "optimal_post_window": "anytime_today"                          │    │
│  │   },                                                                 │    │
│  │   "next_phase": 1.7                                                  │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 6: PHASE 1.7 - EXTERNAL DATA COLLECTION (NEW)
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1.7: EXTERNAL DATA COLLECTION                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Fetch external data for content generation                      │
│  DURATION: 60-180 seconds                                                   │
│  SKILLS: WEB-SEARCH, WEB-READER                                             │
│  CONDITION: Always required for V8.0                                        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 1.7.1: CALCULATE SEARCH QUERIES (NOT PRE-DEFINED!)                    │
│  ─────────────────────────────────────────────────────────────               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function generateSearchQueries(campaign, gapAnalysis, marketData) { │    │
│  │                                                                      │    │
│  │   const queries = [];                                               │    │
│  │   const currentYear = new Date().getFullYear();                     │    │
│  │                                                                      │    │
│  │   // QUERY 1: Project/Topic Context                                 │    │
│  │   queries.push({                                                    │    │
│  │     purpose: "project_context",                                     │    │
│  │     query: `${campaign.name} ${campaign.category} ${currentYear}`,  │    │
│  │     priority: "high"                                                │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   // QUERY 2: Gap Angle Exploitation                                │    │
│  │   if (gapAnalysis.selected_gap === "controversy") {                 │    │
│  │     queries.push({                                                  │    │
│  │       purpose: "controversy_hooks",                                 │    │
│  │       query: `${campaign.topic} legal disputes regulation ${currentYear}`, │    │
│  │       priority: "high"                                              │    │
│  │     });                                                             │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // QUERY 3: Industry Trends                                       │    │
│  │   queries.push({                                                    │    │
│  │     purpose: "industry_trends",                                     │    │
│  │     query: `${campaign.industry} trends developments ${currentYear}`, │    │
│  │     priority: "medium"                                              │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   // QUERY 4: Competitor Content (if gap identified)                │    │
│  │   if (gapAnalysis.missing_angles.length > 0) {                      │    │
│  │     queries.push({                                                  │    │
│  │       purpose: "competitor_gaps",                                   │    │
│  │       query: `${gapAnalysis.missing_angles[0]} ${campaign.topic}`,  │    │
│  │       priority: "medium"                                            │    │
│  │     });                                                             │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // QUERY 5: Token/Price Context (if applicable)                   │    │
│  │   if (campaign.has_token) {                                         │    │
│  │     queries.push({                                                  │    │
│  │       purpose: "token_context",                                     │    │
│  │       query: `${campaign.token_symbol} token news analysis ${currentYear}`, │    │
│  │       priority: "medium"                                            │    │
│  │     });                                                             │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // QUERY 6: Trend Jacking (if market opportunity)                 │    │
│  │   if (marketData.market_emotion.trend_jacking_opportunity) {        │    │
│  │     queries.push({                                                  │    │
│  │       purpose: "trend_jacking",                                     │    │
│  │       query: `crypto market ${marketData.BTC.change_24h > 0 ? 'bull' : 'bear'} ${currentYear}`, │    │
│  │       priority: "high",                                             │    │
│  │       recency_days: 1                                               │    │
│  │     });                                                             │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return queries;                                                   │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.7.2: EXECUTE WEB SEARCHES                                           │
│  ───────────────────────────────                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function executeWebSearches(queries) {                        │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │   const searchResults = {};                                         │    │
│  │                                                                      │    │
│  │   for (const queryObj of queries) {                                 │    │
│  │     const results = await zai.functions.invoke('web_search', {      │    │
│  │       query: queryObj.query,                                        │    │
│  │       num: 5,                                                       │    │
│  │       recency_days: queryObj.recency_days || 7                      │    │
│  │     });                                                             │    │
│  │                                                                      │    │
│  │     searchResults[queryObj.purpose] = results;                      │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return searchResults;                                             │    │
│  │ }                                                                   │    │
│  │                                                                      │    │
│  │ // Example Output Structure:                                        │    │
│  │ // searchResults = {                                                │    │
│  │ //   "project_context": [                                           │    │
│  │ //     { url, name, snippet, host_name, rank, date },              │    │
│  │ //     ...                                                          │    │
│  │ //   ],                                                             │    │
│  │ //   "controversy_hooks": [...],                                    │    │
│  │ //   "industry_trends": [...]                                       │    │
│  │ // }                                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.7.3: DEEP CONTENT EXTRACTION (WEB-READER)                           │
│  ───────────────────────────────────────────────────                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function deepContentExtraction(searchResults) {               │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │   const extractedContent = {};                                      │    │
│  │                                                                      │    │
│  │   for (const [purpose, results] of Object.entries(searchResults)) { │    │
│  │                                                                      │    │
│  │     // Only extract from top 2 results per query                    │    │
│  │     const topResults = results.slice(0, 2);                         │    │
│  │                                                                      │    │
│  │     for (const result of topResults) {                              │    │
│  │       try {                                                         │    │
│  │         const content = await zai.functions.invoke('web_reader', {  │    │
│  │           url: result.url                                           │    │
│  │         });                                                         │    │
│  │                                                                      │    │
│  │         if (!extractedContent[purpose]) {                           │    │
│  │           extractedContent[purpose] = [];                           │    │
│  │         }                                                           │    │
│  │                                                                      │    │
│  │         extractedContent[purpose].push({                            │    │
│  │           url: result.url,                                          │    │
│  │           title: content.title,                                     │    │
│  │           content: content.content,                                 │    │
│  │           publishTime: content.publishTime,                         │    │
│  │           snippet: result.snippet                                   │    │
│  │         });                                                         │    │
│  │       } catch (error) {                                             │    │
│  │         console.warn(`Failed to read ${result.url}: ${error}`);     │    │
│  │       }                                                             │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return extractedContent;                                          │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 1.7.4: EXTRACT KEY FACTS                                              │
│  ────────────────────────────                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function extractKeyFacts(extractedContent, campaign) {              │    │
│  │                                                                      │    │
│  │   const facts = [];                                                 │    │
│  │   const quotes = [];                                                │    │
│  │   const statistics = [];                                            │    │
│  │                                                                      │    │
│  │   for (const [purpose, contents] of Object.entries(extractedContent)) { │    │
│  │     for (const item of contents) {                                  │    │
│  │                                                                      │    │
│  │       // Extract sentences with numbers (statistics)                │    │
│  │       const statMatches = item.content.match(                       │    │
│  │         /[^.]*\d+(?:\.\d+)?%?[^.]*\./g                              │    │
│  │       );                                                            │    │
│  │       if (statMatches) {                                            │    │
│  │         statistics.push(...statMatches.map(s => ({                  │    │
│  │           content: s.trim(),                                        │    │
│  │           source: item.url,                                         │    │
│  │           purpose: purpose                                          │    │
│  │         })));                                                       │    │
│  │       }                                                             │    │
│  │                                                                      │    │
│  │       // Extract quoted statements                                  │    │
│  │       const quoteMatches = item.content.match(                      │    │
│  │         /"([^"]+)"/g                                                │    │
│  │       );                                                            │    │
│  │       if (quoteMatches) {                                           │    │
│  │         quotes.push(...quoteMatches.map(q => ({                     │    │
│  │           content: q,                                               │    │
│  │           source: item.url,                                         │    │
│  │           purpose: purpose                                          │    │
│  │         })));                                                       │    │
│  │       }                                                             │    │
│  │                                                                      │    │
│  │       // Extract key sentences (first 3 of each paragraph)         │    │
│  │       const paragraphs = item.content.split('\n\n');                │    │
│  │       for (const para of paragraphs.slice(0, 3)) {                  │    │
│  │         const sentences = para.split('. ').slice(0, 2);             │    │
│  │         for (const sentence of sentences) {                         │    │
│  │           if (sentence.length > 50 && sentence.length < 200) {      │    │
│  │             facts.push({                                            │    │
│  │               content: sentence.trim() + '.',                       │    │
│  │               source: item.url,                                     │    │
│  │               purpose: purpose                                      │    │
│  │             });                                                     │    │
│  │           }                                                         │    │
│  │         }                                                           │    │
│  │       }                                                             │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   // Deduplicate and rank facts                                    │    │
│  │   const uniqueFacts = deduplicateByContent(facts);                  │    │
│  │   const rankedFacts = rankByRelevance(uniqueFacts, campaign.topic); │    │
│  │                                                                      │    │
│  │   return {                                                          │    │
│  │     facts: rankedFacts.slice(0, 20),                                │    │
│  │     quotes: quotes.slice(0, 5),                                     │    │
│  │     statistics: statistics.slice(0, 10)                             │    │
│  │   };                                                                │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "search_queries_generated": 5,                                     │    │
│  │   "search_results": { /* raw search results */ },                    │    │
│  │   "extracted_content": { /* deep extraction results */ },            │    │
│  │   "key_facts": {                                                     │    │
│  │     "facts": [                                                       │    │
│  │       {                                                              │    │
│  │         "content": "Traditional courts take months to resolve...",  │    │
│  │         "source": "https://...",                                     │    │
│  │         "purpose": "controversy_hooks"                               │    │
│  │       },                                                             │    │
│  │       // ... more facts                                              │    │
│  │     ],                                                               │    │
│  │     "quotes": [...],                                                 │    │
│  │     "statistics": [...]"                                             │    │
│  │   },                                                                 │    │
│  │   "data_freshness": "real-time",                                     │    │
│  │   "sources_count": 15,                                               │    │
│  │   "next_phase": 2                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                    SECTION 7: PHASE 2 - KNOWLEDGE BASE EXTRACTION
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: KNOWLEDGE BASE EXTRACTION                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OBJECTIVE: Combine all data into unified knowledge base                    │
│  DURATION: 30-60 seconds                                                    │
│  SKILLS: LLM (for summarization)                                            │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                              │
│  STEP 2.1: COMBINE DATA SOURCES                                             │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ knowledge_base = {                                                  │    │
│  │                                                                      │    │
│  │   // From Rally API (Phase 1)                                      │    │
│  │   official_facts: campaign.knowledge_base.facts,                    │    │
│  │   official_terminology: campaign.knowledge_base.terminology,        │    │
│  │   value_propositions: campaign.knowledge_base.value_props,          │    │
│  │   required_mentions: campaign.requirements.mentions,                │    │
│  │   required_hashtags: campaign.requirements.hashtags,                │    │
│  │   required_links: campaign.requirements.links,                      │    │
│  │                                                                      │    │
│  │   // From Leaderboard Analysis (Phase 1.5)                          │    │
│  │   competitor_patterns: leaderboard_analysis.patterns,                │    │
│  │   gap_opportunities: leaderboard_analysis.gaps,                      │    │
│  │   benchmark_scores: leaderboard_analysis.benchmarks,                 │    │
│  │                                                                      │    │
│  │   // From Market Context (Phase 1.6)                                │    │
│  │   market_emotion: market_data.emotion,                              │    │
│  │   market_conditions: market_data.conditions,                         │    │
│  │   token_data: market_data.token,                                    │    │
│  │                                                                      │    │
│  │   // From External Data (Phase 1.7)                                 │    │
│  │   external_facts: external_data.key_facts.facts,                    │    │
│  │   external_quotes: external_data.key_facts.quotes,                  │    │
│  │   external_statistics: external_data.key_facts.statistics,          │    │
│  │   trending_topics: external_data.trending_topics,                   │    │
│  │   news_hooks: external_data.news_hooks                              │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 2.2: LLM SUMMARIZATION (Optional but Recommended)                     │
│  ────────────────────────────────────────────────────                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ async function summarizeKnowledgeBase(knowledgeBase) {              │    │
│  │   const zai = await ZAI.create();                                   │    │
│  │                                                                      │    │
│  │   const completion = await zai.chat.completions.create({            │    │
│  │     messages: [{                                                    │    │
│  │       role: 'user',                                                 │    │
│  │       content: `Summarize and organize this knowledge base for      │    │
│  │                  Twitter content generation:                         │    │
│  │                                                                      │    │
│  │                  ${JSON.stringify(knowledgeBase, null, 2)}          │    │
│  │                                                                      │    │
│  │                  Output:                                            │    │
│  │                  1. Top 5 most newsworthy facts                     │    │
│  │                  2. Top 5 controversy angles                        │    │
│  │                  3. Top 5 unique value propositions                 │    │
│  │                  4. Recommended hook direction                      │    │
│  │                  5. Key terminology to use                          │    │
│  │                  6. Things to AVOID (based on gaps filled)`         │    │
│  │     }],                                                             │    │
│  │     thinking: { type: 'disabled' }                                  │    │
│  │   });                                                               │    │
│  │                                                                      │    │
│  │   return completion.choices[0]?.message?.content;                   │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  STEP 2.3: VALIDATE COMPLETENESS                                            │
│  ──────────────────────────────                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ function validateKnowledgeBase(knowledgeBase) {                     │    │
│  │   const validation = {                                              │    │
│  │     has_official_facts: knowledgeBase.official_facts?.length > 0,   │    │
│  │     has_external_facts: knowledgeBase.external_facts?.length >= 5,  │    │
│  │     has_gap_analysis: knowledgeBase.gap_opportunities !== null,     │    │
│  │     has_market_context: knowledgeBase.market_emotion !== null,      │    │
│  │     has_benchmarks: knowledgeBase.benchmark_scores !== null         │    │
│  │   };                                                                │    │
│  │                                                                      │    │
│  │   const allValid = Object.values(validation).every(v => v);         │    │
│  │                                                                      │    │
│  │   if (!allValid) {                                                  │    │
│  │     console.warn('Knowledge base incomplete:', validation);         │    │
│  │     // Attempt to fill gaps                                        │    │
│  │   }                                                                 │    │
│  │                                                                      │    │
│  │   return { validation, allValid };                                  │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  OUTPUT:                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ {                                                                    │    │
│  │   "knowledge_base": {                                                │    │
│  │     "official_facts": [...],                                         │    │
│  │     "external_facts": [...],                                         │    │
│  │     "gap_opportunities": {...},                                      │    │
│  │     "market_emotion": {...},                                         │    │
│  │     "benchmark_scores": {...},                                       │    │
│  │     "summarized": { /* LLM summary */ }                              │    │
│  │   },                                                                 │    │
│  │   "validation": {                                                    │    │
│  │     "has_official_facts": true,                                      │    │
│  │     "has_external_facts": true,                                      │    │
│  │     "has_gap_analysis": true,                                        │    │
│  │     "has_market_context": true,                                      │    │
│  │     "has_benchmarks": true,                                          │    │
│  │     "allValid": true                                                 │    │
│  │   },                                                                 │    │
│  │   "next_phase": 3                                                    │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

