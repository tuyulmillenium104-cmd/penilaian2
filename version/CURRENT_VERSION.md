# Rally Score Analyzer - Version Log

## Version 1.0 - BASELINE (Current)
**Date**: 2025-01-27
**Status**: ✅ STABLE - Use as baseline for future improvements

### Accuracy Results

#### Gate Scores Accuracy (Max 2.0 each)
| Component | Accuracy | Status |
|-----------|----------|--------|
| Originality | 97.0% | ✅ |
| Alignment | 100.0% | ✅ |
| Accuracy | 100.0% | ✅ |
| Compliance | 100.0% | ✅ |
| **Overall Gate** | **99.2%** | ✅ |

#### Quality Scores Accuracy (Max 5.0 each)
| Component | Accuracy | Status |
|-----------|----------|--------|
| Engagement | 89.2% | ✅ |
| Technical | 89.6% | ✅ |
| Reply | 78.4% | 🟡 |
| **Overall Quality** | **85.7%** | ✅ |

#### Atemporal Score
| Metric | Value |
|--------|-------|
| Accuracy | ~93% |
| Average Deviation | 0.12 |

### Discovered Rally Formula

```
ATEMPORAL = QUALITY_AVERAGE × 0.42

Where:
- QUALITY_AVERAGE = (Engagement + Technical + Reply) / 3
- Each quality criterion is scored 0-5
- Rally gives 4.0-5.0 for valid content (generous scoring)
```

### Gate Scoring Logic (Version 1.0)

#### Originality (97% accuracy)
- Base score: 2.0 for human-like content
- AI patterns detection reduces score
- Personal voice adds bonus

#### Alignment (100% accuracy)
- Check for Rally/@RallyOnChain mention → 2.0 (max)
- Check for campaign keywords + @mention → 2.0
- Check for campaign keywords only → 1.8
- Check for @mention only → 1.5

#### Accuracy (100% accuracy)
- Base score: 2.0 (max) for valid content
- Only reduces to 0 if suspicious patterns detected
- Rally is very generous here

#### Compliance (100% accuracy)
- Check required mentions, hashtags, links
- Check minimum word count
- Check for prohibited content

### Quality Scoring Logic (Version 1.0)

#### Engagement Potential (89.2% accuracy)
- Base score: 3.8 (Rally-aligned)
- +0.5 per question (max 1.5)
- +0.7 for call-to-action
- +0.3 for emotional hooks
- +0.4 for data/numbers
- +0.3 for @mentions
- +0.3 for optimal length (30-150 words)

#### Technical Quality (89.6% accuracy)
- Base score: 4.0 (Rally-aligned)
- +0.2 for proper capitalization
- +0.2 for proper punctuation
- +0.3 for good sentence structure
- +0.2 for good formatting (line breaks)
- -0.5 for excessive caps
- -0.3 for excessive exclamations

#### Reply Quality (78.4% accuracy)
- Base score: 3.8 (Rally-aligned)
- +1.0 for discussion prompts
- +0.5 for debatable topics
- +0.5 for educational content
- +0.4 for personal touch
- -0.8 for spam-like elements

### Test Data Used
5 real Rally submissions tested:
1. @0xKren - Rally: 1.68, My: 1.76 (95.0% match)
2. @miftahudinsd9 - Rally: 1.86, My: 1.74 (93.3% match)
3. @chedaeth - Rally: 2.10, My: 1.76 (84.0% match)
4. @YehoshuaZion - Rally: 1.86, My: 1.81 (97.1% match)
5. @Web3_Core_ - Rally: 1.86, My: 1.88 (99.1% match)

### Files Modified
- `/src/app/api/analyze-content/route.ts` - Main analysis API

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-27 | Baseline - Discovered Rally formula, aligned Gate scoring |

---

## Future Improvements (Do NOT change baseline without versioning)

1. Reply Quality accuracy (78.4% → target 90%+)
2. Better detection of exceptional content (chedaeth case)
3. Temporal score prediction
4. Real-time engagement estimation
