# Prompt untuk Chat AI Baru - Rally Score Analyzer

Copy paste prompt ini di awal chat baru:

---

## Prompt Utama

```
Saya sedang mengerjakan project Rally Score Analyzer. Project ini adalah aplikasi Next.js untuk menganalisis dan memprediksi skor konten dari platform Rally.fun.

REPOSITORY: https://github.com/tuyulmillenium104-cmd/bimsalabim/tree/rally-analyzer

### Tentang Project:
- Analisis konten untuk campaign Rally.fun
- Prediksi skor Atemporal (Quality) dan Temporal (Engagement)
- Akurasi 98% untuk Atemporal Score

### Formula Rally yang Sudah Ditemukan (PALING PENTING):

**Atemporal Score menggunakan LOOKUP TABLE:**

| Engagement | Technical | Atemporal |
|------------|-----------|-----------|
| 5 | 5 | 2.70 |
| 4 | 5 | 2.43 |
| 4 | 4 | 2.16 |
| 3 | 5 | 2.16 |
| 3 | 4 | 1.89 |
| 3 | 3 | 1.62 |

**PENTING:** Reply Quality TIDAK mempengaruhi Atemporal Score!

**Temporal Score Formula:**
```
Temporal = 0.5 + (likes × 0.0045) + (replies × 0.009) + (retweets × 0.016) + (impressions × 0.00009) + (followers × 0.000009)
Cap: 4.2
```

### File Penting yang Harus Dibaca:
1. `src/app/page.tsx` - UI utama
2. `src/app/api/analyze-content/route.ts` - API analisis konten
3. `src/app/api/rally-comparison/route.ts` - Verifikasi formula
4. `README.md` - Dokumentasi lengkap

### Cara Memulai:
1. Clone repository dari branch `rally-analyzer`
2. Baca README.md untuk memahami project
3. Lihat file-file penting di atas
4. Jangan mengubah formula Atemporal yang sudah 98% akurat

### Yang Masih Perlu Diperbaiki:
- Temporal Score (hanya ~34% match karena time decay)
- Reward Calculation (masih estimasi sederhana)

Tolong bantu saya dengan: [TULIS PERTANYAAN/PERMINTAAN ANDA DI SINI]
```

---

## Prompt Singkat (untuk quick reference)

```
Project: Rally Score Analyzer
Repo: https://github.com/tuyulmillenium104-cmd/bimsalabim/tree/rally-analyzer

Atemporal Formula (98% accurate):
- Lookup table berdasarkan Engagement + Technical
- Reply Quality TIDAK pengaruhi Atemporal
- Lihat tabel di README.md

Key Files:
- src/app/page.tsx (UI)
- src/app/api/analyze-content/route.ts (API)
- README.md (docs)

Baca file-file tersebut lalu bantu saya: [PERTANYAAN]
```

---

## Link Repository

- **Branch**: `rally-analyzer`
- **URL**: https://github.com/tuyulmillenium104-cmd/bimsalabim/tree/rally-analyzer

---

## Catatan Penting untuk AI

1. **JANGAN mengubah formula Atemporal** - sudah 98% akurat
2. **Temporal Score** masih bisa ditingkatkan (faktor time decay, account reputation)
3. **Reward Calculation** masih estimasi - perlu data distribusi real dari Rally
4. **UI sudah ada** - gunakan shadcn/ui components yang sudah tersedia
5. **LLM Analyzer** ada di mini-services/llm-analyzer/ (jika perlu)

---

## Cara Clone Project

```bash
git clone -b rally-analyzer https://github.com/tuyulmillenium104-cmd/bimsalabim.git
cd bimsalabim
bun install
bun run db:push
bun run dev
```
