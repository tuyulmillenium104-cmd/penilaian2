# Rally Score Analyzer

A tool for analyzing and predicting Rally.fun content scores with 98% accuracy for atemporal scores.

## Features

- **Content Analysis**: Analyze tweet/content quality for Rally campaigns
- **Score Prediction**: Predict atemporal and temporal scores
- **Grade Assignment**: Assign grades (S+, S, A+, A, B+, B, C+, C, F)
- **Reward Estimation**: Estimate potential rewards based on rank

## Accuracy

| Component | Accuracy |
|-----------|----------|
| Atemporal Score | **98%** |
| Temporal Score | ~34% (complex time-decay factors) |
| Overall | **98.2%** |

## Rally's Scoring Formula (Discovered)

### Atemporal Score (Quality)

Rally uses a **lookup table** based on Engagement Potential + Technical Quality:

| Engagement | Technical | Atemporal |
|------------|-----------|-----------|
| 5 | 5 | 2.70 |
| 4 | 5 | 2.43 |
| 4 | 4 | 2.16 |
| 3 | 5 | 2.16 |
| 3 | 4 | 1.89 |
| 3 | 3 | 1.62 |

**Note**: Reply Quality does NOT affect Atemporal Score directly!

### Temporal Score (Engagement)

```
Temporal = 0.5 + (likes × 0.0045) + (replies × 0.009) + (retweets × 0.016) + (impressions × 0.00009) + (followers × 0.000009)
Cap: 4.2
```

### Total Score

```
Total = Atemporal + Temporal
Max: 6.9 (2.7 + 4.2)
```

## Grade Thresholds

| Grade | Min Score | Percentile |
|-------|-----------|------------|
| S+ | 2.80 | Top 1% |
| S | 2.60 | Top 5% |
| A+ | 2.40 | Top 10% |
| A | 2.20 | Top 25% |
| B+ | 2.00 | Above Avg |
| B | 1.70 | Average |
| C+ | 1.30 | Below Avg |
| C | 1.00 | Poor |
| F | 0 | Fail |

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma with SQLite
- **AI**: LLM-powered content analysis

## Installation

```bash
bun install
bun run db:push
bun run dev
```

## API Endpoints

- `POST /api/analyze-content` - Analyze content
- `GET /api/rally-campaigns` - Fetch Rally campaigns
- `GET /api/rally-leaderboard` - Fetch campaign leaderboard
- `GET /api/rally-comparison` - Verify formula accuracy

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze-content/    # Content analysis API
│   │   ├── rally-campaigns/    # Campaign fetching
│   │   ├── rally-comparison/   # Formula verification
│   │   └── rally-leaderboard/  # Leaderboard data
│   └── page.tsx                # Main UI
├── components/ui/              # shadcn/ui components
└── lib/                        # Utilities
```

## License

MIT
