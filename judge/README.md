# JUDGE WORKFLOW

## Deskripsi
Workflow ini bertugas untuk MENILAI konten dengan objektif dan blind judging.

## Prinsip Utama
1. **BLIND JUDGING** - Tidak tahu siapa pembuat konten
2. **OBJEKTIF** - Berdasarkan rubrik dan bukti
3. **TRANSPARAN** - Setiap skor ada reasoning dan evidence
4. **STRICT** - Standar tinggi, tidak kompromi

## Input
- Campaign Data (Knowledge Base, Rules, Style, Required URL)
- Konten Kandidat (tanpa info pembuat)
- Competitor Hooks (untuk cek originality)

## Output
- Hasil penilaian dengan skor, breakdown, dan evidence
- Pass/Fail dengan alasan
- Saran perbaikan jika fail

## Struktur Penilaian

### Judge 1: Gate Utama (G1-G4)
| Gate | Kriteria | Max | Pass |
|------|----------|-----|------|
| G1 | Content Alignment | 5 | - |
| G2 | Information Accuracy | 5 | - |
| G3 | Campaign Compliance | 5 | - |
| G4 | Originality | 5 | - |
| **Total** | | **20** | **16** |

### Judge 2: Gate Tambahan (G5-G6)
| Gate | Kriteria | Max | Pass |
|------|----------|-----|------|
| G5 | Engagement Potential | 8 | - |
| G6 | Technical Quality | 8 | - |
| **Total** | | **16** | **14** |

### Judge 3: Penilaian Internal
| Kriteria | Max |
|----------|-----|
| Hook Score | 10 |
| Emotion Score | 10 |
| CT Score | 10 |
| Uniqueness Score | 10 |
| Readability Score | 10 |
| Viral Potential | 10 |
| **Total** | **60** |
| **Pass** | **54** |

## Alur
1. Baca campaign data dari file
2. Baca konten kandidat dari file (blind)
3. Judge 1: Nilai Gate Utama
4. Judge 2: Nilai Gate Tambahan (jika pass)
5. Judge 3: Nilai Penilaian Internal (jika pass)
6. Output hasil akhir

## Fact-Checking
Untuk Information Accuracy, judge dapat melakukan web search untuk memvalidasi:
- Angka/statistik
- Klaim faktual
- Data eksternal

## Evidence Format
Setiap skor harus disertai evidence:
```json
{
  "score": 4,
  "maxScore": 5,
  "evidence": [
    "✅ Alasan skor tinggi",
    "❌ Alasan pengurangan"
  ],
  "reasoning": "Penjelasan singkat",
  "sources": ["url1", "url2"]
}
```
