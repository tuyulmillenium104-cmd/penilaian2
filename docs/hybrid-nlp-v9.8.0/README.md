# Rally.fun Hybrid NLP Service v9.8.0-COMPLETE

**Full AI-Powered NLP Service for Content Quality Analysis**

## Features

### Core Features (v9.8.0)
| # | Feature | Library | Type |
|---|---------|---------|------|
| 1 | Sentiment Analysis | VADER + TextBlob | AI |
| 2 | Readability Metrics | textstat | Algorithm |
| 3 | Named Entity Recognition | spaCy | AI (Deep Learning) |
| 4 | Semantic Similarity | sentence-transformers | AI (BERT) |
| 5 | Emotion Detection | Custom + Rare Combos | AI |
| 6 | Content Depth Analysis | Custom | Algorithm |
| 7 | Anti-Template Detection | Custom | Algorithm |

### Enhanced Features (Complete Edition)
| # | Feature | Description |
|---|---------|-------------|
| 8 | G4 Originality Detection | Casual hook, parenthetical aside, contractions |
| 9 | Forbidden Punctuation Check | Em dash, smart quotes detection |
| 10 | Gate Multiplier Formula | M_gate = 1 + 0.5 × (g_star - 1) |
| 11 | X-Factor Differentiators | Specific numbers, time specificity, honesty |
| 12 | Pre-Submission Validation | Complete checklist before submission |
| 13 | Mindset Framework | Target, Effort, Accept, Learn |
| 14 | Control Matrix | What you CAN vs CANNOT control |
| 15 | Multi-Token Handler | 11 tokens for rate limit fallback |

### Multi-Content Features
| # | Feature | Description |
|---|---------|-------------|
| 16 | Multi-Content Generator | Generate 5 konten sekaligus |
| 17 | Batch Judging | Quick Judge + Full Judge |
| 18 | Ranking System | Auto select best content |
| 19 | Campaign Search | Search by name (not just address) |

## Installation

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

## Usage

### Start Python NLP Service (Optional)
```bash
# Start the service
python nlp_service.py

# Or with environment variable to skip LanguageTool
SKIP_GRAMMAR_TOOL=1 python nlp_service.py
```

### Run Rally Workflow
```bash
# List all campaigns
node rally-workflow-v9.8.0-hybrid.js list

# By campaign name (partial match)
node rally-workflow-v9.8.0-hybrid.js "Internet Court"

# By campaign address
node rally-workflow-v9.8.0-hybrid.js 0xAF5a5B459F4371c1781E3B8456214CDD063EeBA7
```

## API Endpoints

### GET /health
Health check with library status

### POST /api/content/analyze
Full content analysis with all 15 features

```json
{
  "content": "Your text here",
  "competitor_contents": ["competitor 1", "competitor 2"],
  "topic": "optional topic for relevance"
}
```

### POST /api/grammar/check
AI-powered grammar check with T5

```json
{
  "content": "Your text here"
}
```

### POST /api/compare
Compare two texts for similarity

```json
{
  "text1": "First text",
  "text2": "Second text"
}
```

### POST /api/uniqueness/analyze
Combined uniqueness analysis

## G4 Originality Detection

Detects elements that ADD to originality:
- **Casual Hook Opening**: ngl, tbh, honestly, fun story (+0.15)
- **Parenthetical Aside**: (embarrassing to admit), (just saying) (+0.15)
- **Contractions (3+)**: don't, can't, it's, they're (+0.20)
- **Personal Angle**: I, my, me, specific experience (+0.20)
- **Conversational Ending**: tbh, worth checking (+0.15)

Detects elements that SUBTRACT from originality:
- **Em Dashes**: — – ― (-0.30 penalty)
- **Smart Quotes**: "" '' (-0.20 penalty)
- **AI Phrases**: delve, leverage, realm (-0.20 penalty)

## X-Factor Differentiators

- **Specific Numbers**: "down 47%" not "down a lot"
- **Time Specificity**: "25 minutes" not "a while"
- **Embarrassing Honesty**: "embarrassing to admit..."
- **Insider Detail**: "went from 68% to sweating bullets"
- **Unexpected Angle**: Surprise twist, contrary view

## Version History

| Version | Changes |
|---------|---------|
| 9.8.0 | Complete edition with all features |
| 9.8.0-enhanced | Added HappyTransformer T5 AI Grammar + 8 new features |
| 9.8.0-hybrid | Initial hybrid JS+Python release |

## Requirements

- Node.js 18+
- Python 3.9+ (optional, for enhanced NLP)
- 4GB RAM minimum (8GB recommended for T5 model)
- Internet connection (first run downloads models)

## Based On

Rally Ultimate Master Guide V3
