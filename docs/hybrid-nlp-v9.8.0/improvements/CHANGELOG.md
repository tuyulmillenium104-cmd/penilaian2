# Changelog: Hybrid NLP System v9.8.1

## Release Date: 2026-03-23

## 🆕 New Features

### 1. Multi-Content Generator
- **Generate 5 konten sekaligus** dengan variasi angle, emosi, dan struktur berbeda
- **Batch judging** untuk semua konten yang dihasilkan
- **Ranking system** untuk memilih konten terbaik
- **Selection** konten dengan skor tertinggi atau semua yang PASS

### 2. Model Optimization
- Menggunakan **GLM-4-Plus** sebagai model default (sebelumnya: 'default')
- **Mode Think** diaktifkan untuk semua proses judging
- **Web Search** diaktifkan untuk fact-checking

### 3. Scoring System Enhancement
- Total max score: **136 poin**
- Pass threshold: **118 poin**
- Weighted scoring untuk ranking yang lebih akurat

## 📊 Content Variations

| Content # | Angle | Emotions | Structure |
|-----------|-------|----------|-----------|
| 1 | Personal Story | Curiosity → Surprise | Hero's Journey |
| 2 | Data Driven | Fear → Hope | Problem-Solution |
| 3 | Contrarian | Anger → Trust | Before-After |
| 4 | Insider | Sadness → Anticipation | Mystery Reveal |
| 5 | Case Study | Surprise → Joy | Case Study |

## 🔧 Configuration Changes

### Before (v9.8.0):
```javascript
model: 'default'
enableThinking: false
```

### After (v9.8.1):
```javascript
model: 'glm-4-plus'
enableThinking: true
enableSearch: true
```

## 📁 Files Changed

| File | Status |
|------|--------|
| `improvements/v9.8.1-multi-content-generator.js` | NEW |
| `improvements/CHANGELOG.md` | NEW |

## ⚠️ Requirements

- Requires `glm-4-plus` model access
- Minimum RAM: 8GB (untuk batch processing)

## 🐛 Bug Fixes

- Fixed: Model tidak menggunakan versi terbaik
- Fixed: Tidak ada fitur generate multiple contents
- Fixed: Tidak ada ranking system

## 📈 Performance

- 5 konten dalam ~5 menit (sequential)
- Judging 5 konten dalam ~10 menit (sequential)
- Total workflow: ~15 menit untuk 5 konten dengan ranking

---

## Next Steps (v9.8.2)

- [ ] Parallel generation untuk speed improvement
- [ ] Caching untuk competitor analysis
- [ ] Auto-retry dengan different angle jika fail
