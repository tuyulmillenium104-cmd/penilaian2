# RALLY WORKFLOW - EXECUTION PROMPT FOR NEW CHAT

## 🚀 PROMPT UNTUK CHAT BARU (AI AKAN RUN SCRIPT):

```
Jalankan Rally Content Workflow untuk membuat konten.

HOOK: "Code Runs, Disputes Don't. Enter Internet Court"

LANGKAH EKSEKUSI:

1. Clone repository:
   cd /home/z/my-project && git clone https://github.com/tuyulmillenium104-cmd/penilaian2.git rally-workflow 2>/dev/null || echo "Repo exists"

2. Pull latest changes:
   cd /home/z/my-project/rally-workflow && git pull origin master

3. Install dependencies:
   cd /home/z/my-project/rally-workflow && npm install

4. Run workflow dengan hook:
   node scripts/rally-ai-workflow.js "Code Runs, Disputes Don't. Enter Internet Court"

5. Tampilkan output lengkap termasuk SCORE CARD.

JIKA ERROR:
- Jika rate limit, tunggu 5 detik lalu retry
- Jika file tidak ada, baca dari GitHub dan buat manual

EKSEKUSI SEKARANG.
```

---

## 🔧 VERSI ALTERNATIF (JIKA REPO SUDAH ADA):

```
Jalankan Rally Workflow:

HOOK: "Code Runs, Disputes Don't. Enter Internet Court"

EKSEKUSI:
cd /home/z/my-project
node scripts/rally-ai-workflow.js "Code Runs, Disputes Don't. Enter Internet Court"

Tampilkan hasil lengkap dengan SCORE CARD.
```

---

## 📋 VERSI DENGAN CAMPAIGN ADDRESS (FULL WORKFLOW):

```
Jalankan Rally Workflow V8.7.6 dengan campaign address.

Campaign Address: (ambil dari https://app.rally.fun/campaigns aktif)

LANGKAH:
1. git clone https://github.com/tuyulmillenium104-cmd/penilaian2.git /home/z/my-project/rally-workflow
2. cd /home/z/my-project/rally-workflow && npm install
3. node scripts/rally-workflow-v8.7.6.js <CAMPAIGN_ADDRESS>

Tampilkan output lengkap.
```

---

## ⚠️ PENTING UNTUK AI:

AI harus menggunakan **Bash tool** untuk mengeksekusi command. Prompt di atas sudah menginstruksikan AI untuk menggunakan command line.

---

## 📁 FILE INI:

https://github.com/tuyulmillenium104-cmd/penilaian2/blob/master/docs/EXECUTION-PROMPT.md
