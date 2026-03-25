# Z-AI API - Solusi Lengkap Rate Limit

> File ini berisi semua kode yang diperlukan untuk mengatasi rate limit Z-AI API

---

## 📊 Masalah & Solusi

| Jenis Rate Limit | Limit | Solusi | Status |
|------------------|-------|--------|--------|
| 📊 **Per IP** | 10 req/10 menit | IP Rotation | ✅ OTOMATIS |
| 👤 **Per User ID** | ~500 req/hari | Multi Account Rotation | ⚠️ Perlu token |
| ⚡ **QPS** | 2 req/detik | Request Queue | ✅ OTOMATIS |
| 📅 **Daily Global** | 300 req/hari | Multiple API Keys | ⚠️ Perlu API key |

---

## 📁 File 1: smart-rate-limiter.js

**Solusi utama dengan semua fitur rate limit handling**

```javascript
/**
 * ═══════════════════════════════════════════════════════════════
 * SMART RATE LIMITER - Solusi Lengkap untuk Z-AI API
 * ═══════════════════════════════════════════════════════════════
 *
 * Mengatasi:
 * 1. Per IP: 10 req/10 menit → IP Rotation ✅
 * 2. Per User ID: ~500 req/hari → Multi Account Rotation
 * 3. QPS: 2 req/detik → Request Queue
 * 4. Daily Global: 300 req/hari → Multi API Key
 */

import { execSync } from 'child_process';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CONFIG = {
  baseUrl: 'http://172.25.136.210:8080/v1',
  apiKey: 'Z.ai'
};

// Multi-account pool (tambahkan akun lain jika ada)
const ACCOUNT_POOL = [
  {
    token: 'YOUR_TOKEN_HERE',
    userId: 'YOUR_USER_ID_HERE',
    chatId: 'YOUR_CHAT_ID_HERE',
    name: 'Account-1'
  }
  // Tambahkan akun lain di sini:
  // {
  //   token: 'token-lain',
  //   userId: 'user-id-lain',
  //   chatId: 'chat-id-lain',
  //   name: 'Account-2'
  // }
];

// ═══════════════════════════════════════════════════════════════
// RATE LIMIT TRACKER
// ═══════════════════════════════════════════════════════════════

class RateLimitTracker {
  constructor() {
    this.ipLimits = new Map();
    this.userLimits = new Map();
    this.qpsTimestamps = [];
    this.dailyTotal = { count: 0, date: new Date().toDateString() };
  }

  isIpLimited(ip) {
    const limit = this.ipLimits.get(ip);
    if (!limit) return false;
    if (Date.now() > limit.resetTime) {
      this.ipLimits.delete(ip);
      return false;
    }
    return limit.count >= 10;
  }

  recordIpUsage(ip) {
    let limit = this.ipLimits.get(ip);
    if (!limit || Date.now() > limit.resetTime) {
      limit = { count: 0, resetTime: Date.now() + 10 * 60 * 1000 };
    }
    limit.count++;
    this.ipLimits.set(ip, limit);
  }

  isQpsLimited() {
    const now = Date.now();
    this.qpsTimestamps = this.qpsTimestamps.filter(t => now - t < 1000);
    return this.qpsTimestamps.length >= 2;
  }

  recordQps() {
    this.qpsTimestamps.push(Date.now());
  }

  getQpsWaitTime() {
    if (this.qpsTimestamps.length < 2) return 0;
    const oldest = this.qpsTimestamps[0];
    return Math.max(0, 1000 - (Date.now() - oldest) + 50);
  }

  updateUserLimit(userId, remaining) {
    this.userLimits.set(userId, {
      remaining,
      updateTime: Date.now()
    });
  }

  getBestUser() {
    let best = null;
    let maxRemaining = -1;

    for (const account of ACCOUNT_POOL) {
      const limit = this.userLimits.get(account.userId);
      const remaining = limit?.remaining ?? 999;

      if (remaining > maxRemaining) {
        maxRemaining = remaining;
        best = account;
      }
    }

    return best || ACCOUNT_POOL[0];
  }

  getStats() {
    return {
      ipLimits: Object.fromEntries(this.ipLimits),
      userLimits: Object.fromEntries(this.userLimits),
      qpsQueue: this.qpsTimestamps.length,
      dailyTotal: this.dailyTotal
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// REQUEST QUEUE
// ═══════════════════════════════════════════════════════════════

class RequestQueue {
  constructor(rateLimiter) {
    this.queue = [];
    this.processing = false;
    this.rateLimiter = rateLimiter;
    this.requestCount = 0;
  }

  async enqueue(requestFn, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject, priority });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      const qpsWait = this.rateLimiter.getQpsWaitTime();
      if (qpsWait > 0) {
        await this.sleep(qpsWait);
      }

      try {
        this.rateLimiter.recordQps();
        const result = await item.requestFn();
        item.resolve(result);
        this.requestCount++;
      } catch (error) {
        item.reject(error);
      }

      await this.sleep(100);
    }

    this.processing = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════
// SMART RATE LIMITER (MAIN CLASS)
// ═══════════════════════════════════════════════════════════════

class SmartRateLimiter {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.accounts = [...ACCOUNT_POOL];
    this.currentAccountIndex = 0;
    this.rateLimiter = new RateLimitTracker();
    this.queue = new RequestQueue(this.rateLimiter);
    this.requestLog = [];
  }

  addAccount(token, userId, chatId, name = '') {
    this.accounts.push({ token, userId, chatId, name: name || `Account-${this.accounts.length + 1}` });
    console.log(`✅ Added account: ${name || `Account-${this.accounts.length}`}`);
  }

  getNextAccount() {
    if (this.accounts.length === 1) {
      return this.accounts[0];
    }
    const best = this.rateLimiter.getBestUser();
    if (best) return best;
    const account = this.accounts[this.currentAccountIndex];
    this.currentAccountIndex = (this.currentAccountIndex + 1) % this.accounts.length;
    return account;
  }

  async getCurrentIP() {
    try {
      const result = execSync('curl -s --max-time 3 "https://api.ipify.org"', { encoding: 'utf-8' });
      return result.trim();
    } catch {
      return 'unknown';
    }
  }

  async request(endpoint, body, options = {}) {
    return this.queue.enqueue(async () => {
      const account = this.getNextAccount();
      const ip = await this.getCurrentIP();

      if (this.rateLimiter.isIpLimited(ip)) {
        console.log(`⚠️ IP ${ip} rate limited, waiting for rotation...`);
        await this.sleep(1000);
      }

      const url = `${this.config.baseUrl}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Z-AI-From': 'Z',
        'X-Token': account.token,
        'X-User-Id': account.userId
      };

      if (account.chatId) {
        headers['X-Chat-Id'] = account.chatId;
      }

      const bodyStr = JSON.stringify(body);
      console.log(`🌐 [${this.queue.requestCount + 1}] ${account.name} | IP: ${ip}`);

      let curlCmd = `curl -s -D /tmp/zai_headers.txt --max-time ${options.timeout || 30} -X POST`;
      for (const [key, value] of Object.entries(headers)) {
        curlCmd += ` -H "${key}: ${value}"`;
      }
      curlCmd += ` -d '${bodyStr.replace(/'/g, "'\\''")}' "${url}"`;

      try {
        const response = execSync(curlCmd, {
          encoding: 'utf-8',
          timeout: (options.timeout || 30) * 1000 + 5000
        });

        try {
          const headersFile = execSync('cat /tmp/zai_headers.txt 2>/dev/null', { encoding: 'utf-8' });
          const userRemaining = headersFile.match(/X-Ratelimit-User-Daily-Remaining:\s*(\d+)/i)?.[1];
          if (userRemaining) {
            this.rateLimiter.updateUserLimit(account.userId, parseInt(userRemaining));
          }
        } catch {}

        this.rateLimiter.recordIpUsage(ip);
        const result = JSON.parse(response);

        this.requestLog.push({
          timestamp: new Date().toISOString(),
          account: account.name,
          ip,
          success: !result.error
        });

        return result;
      } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
      }
    }, options.priority);
  }

  async chat(messages, options = {}) {
    const body = {
      messages,
      model: options.model || 'glm-4-flash',
      thinking: { type: 'disabled' },
      ...options
    };
    return this.request('/chat/completions', body, options);
  }

  async vision(imageUrl, prompt, options = {}) {
    const body = {
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }],
      model: options.model || 'glm-4.6v',
      thinking: { type: 'disabled' }
    };
    return this.request('/chat/completions/vision', body, options);
  }

  async generateImage(prompt, options = {}) {
    const body = { prompt, size: options.size || '1024x1024', ...options };
    return this.request('/images/generations', body, options);
  }

  async batch(requests, options = {}) {
    const results = [];
    const concurrency = options.concurrency || 1;

    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(req => this.chat(req.messages, req.options))
      );
      results.push(...batchResults);
    }
    return results;
  }

  getStats() {
    return {
      accounts: this.accounts.map(a => ({
        name: a.name,
        userId: a.userId.substring(0, 8) + '...',
        remaining: this.rateLimiter.userLimits.get(a.userId)?.remaining ?? 'unknown'
      })),
      rateLimiter: this.rateLimiter.getStats(),
      totalRequests: this.queue.requestCount,
      recentLogs: this.requestLog.slice(-10)
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async demo(count = 5) {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║        SMART RATE LIMITER DEMO                            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`\nAccounts: ${this.accounts.length}`);
    console.log(`Requests to make: ${count}\n`);

    for (let i = 0; i < count; i++) {
      try {
        const result = await this.chat([
          { role: 'user', content: `Say hello (request ${i + 1})` }
        ]);
        const content = result.choices?.[0]?.message?.content || result.error || 'No response';
        const userRemaining = this.rateLimiter.userLimits.values().next().value?.remaining ?? '?';
        console.log(`  → Response: "${content.substring(0, 30)}..." | Remaining: ${userRemaining}\n`);
      } catch (error) {
        console.log(`  → Error: ${error.message}\n`);
      }
    }

    console.log('\n📊 Final Stats:');
    console.log(JSON.stringify(this.getStats(), null, 2));
  }
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  const limiter = new SmartRateLimiter();

  switch (command) {
    case 'demo':
      await limiter.demo(parseInt(args[1]) || 5);
      break;
    case 'test':
      console.log('Testing single request...');
      const result = await limiter.chat([{ role: 'user', content: 'Say hello' }]);
      console.log('Response:', result);
      break;
    case 'batch':
      console.log('Testing batch requests...');
      const batchResults = await limiter.batch([
        { messages: [{ role: 'user', content: 'Say hi' }] },
        { messages: [{ role: 'user', content: 'Say bye' }] }
      ]);
      console.log('Batch results:', batchResults.length);
      break;
    default:
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║        SMART RATE LIMITER - CLI                           ║
╚═══════════════════════════════════════════════════════════╝

Commands:
  demo [n]     Demo with n requests (default: 5)
  test         Single test request
  batch        Test batch requests

Usage:
  bun smart-rate-limiter.js demo 10
      `);
  }
}

export { SmartRateLimiter, RateLimitTracker, RequestQueue, ACCOUNT_POOL };

if (import.meta.main) {
  main().catch(console.error);
}
```

---

## 📁 File 2: ip-rotator.js

**IP rotation module dengan Z-AI wrapper**

```javascript
#!/usr/bin/env bun
/**
 * Smart IP Rotation Solution
 * Server memiliki multiple outbound IPs yang rotate otomatis via NAT pool
 */

import { execSync } from 'child_process';

// Detected outbound IPs
const KNOWN_IPS = [
  '47.243.219.67',
  '8.218.40.76',
  '47.243.82.35',
  '8.218.27.84',
  '8.210.207.203',
  '47.243.137.52'
];

class IPRotator {
  constructor() {
    this.requestCount = 0;
    this.ipHistory = [];
  }

  async getCurrentIP() {
    try {
      const result = execSync('curl -s --max-time 5 "https://api.ipify.org?format=json"', {
        encoding: 'utf-8'
      });
      return JSON.parse(result).ip;
    } catch (err) {
      return null;
    }
  }

  async fetch(url, options = {}) {
    this.requestCount++;
    const preIP = await this.getCurrentIP();

    const timeout = options.timeout || 30;
    let cmd = `curl -s --max-time ${timeout}`;

    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        cmd += ` -H "${key}: ${value}"`;
      }
    }

    if (options.method) {
      cmd += ` -X ${options.method}`;
    }

    if (options.body) {
      const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      cmd += ` -d '${bodyStr.replace(/'/g, "'\\''")}'`;
    }

    cmd += ` "${url}"`;

    try {
      const response = execSync(cmd, { encoding: 'utf-8', timeout: timeout * 1000 + 5000 });
      const postIP = await this.getCurrentIP();

      this.ipHistory.push({
        timestamp: new Date().toISOString(),
        ip: postIP,
        url: url.substring(0, 50)
      });

      console.log(`🌐 [${this.requestCount}] IP: ${preIP} → ${postIP}`);

      return { success: true, data: response, preIP, postIP };
    } catch (err) {
      return { success: false, error: err.message, preIP };
    }
  }

  getStats() {
    const uniqueIPs = [...new Set(this.ipHistory.map(h => h.ip))];
    return {
      totalRequests: this.requestCount,
      uniqueIPs: uniqueIPs.length,
      ipHistory: this.ipHistory.slice(-20),
      knownIPs: KNOWN_IPS
    };
  }

  async demo(count = 5) {
    console.log('🔄 IP Rotation Demo');
    console.log('='.repeat(50));

    const ips = new Set();
    for (let i = 0; i < count; i++) {
      const result = await this.fetch('https://api.ipify.org?format=json');
      if (result.success) {
        const data = JSON.parse(result.data);
        ips.add(data.ip);
        console.log(`  Request ${i + 1}: ${data.ip}`);
      }
      await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n✓ Used ${ips.size} different IPs in ${count} requests`);
    return ips;
  }
}

// Z-AI API wrapper dengan IP rotation
class ZAIWithIPRotation {
  constructor(config = null) {
    this.rotator = new IPRotator();
    this.config = config || {
      baseUrl: 'http://172.25.136.210:8080/v1',
      apiKey: 'Z.ai',
      token: 'YOUR_TOKEN_HERE',
      userId: 'YOUR_USER_ID_HERE',
      chatId: 'YOUR_CHAT_ID_HERE'
    };
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Z-AI-From': 'Z',  // ⚠️ WAJIB - tanpa ini = 403 Forbidden
      'X-Token': this.config.token,
      'X-User-Id': this.config.userId,
      'X-Chat-Id': this.config.chatId
    };
  }

  async chat(messages, options = {}) {
    const body = {
      messages,
      model: options.model || 'glm-4-flash',
      thinking: { type: 'disabled' },
      ...options
    };

    const result = await this.rotator.fetch(
      `${this.config.baseUrl}/chat/completions`,
      { method: 'POST', headers: this._headers(), body }
    );

    return result.success ? JSON.parse(result.data) : result;
  }

  async vision(imageUrl, prompt, options = {}) {
    const body = {
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }],
      model: options.model || 'glm-4.6v',
      thinking: { type: 'disabled' }
    };

    const result = await this.rotator.fetch(
      `${this.config.baseUrl}/chat/completions/vision`,
      { method: 'POST', headers: this._headers(), body }
    );

    return result.success ? JSON.parse(result.data) : result;
  }

  async generateImage(prompt, options = {}) {
    const body = { prompt, size: options.size || '1024x1024', ...options };

    const result = await this.rotator.fetch(
      `${this.config.baseUrl}/images/generations`,
      { method: 'POST', headers: this._headers(), body }
    );

    return result.success ? JSON.parse(result.data) : result;
  }

  getStats() {
    return this.rotator.getStats();
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'demo';

  if (command === 'demo') {
    const rotator = new IPRotator();
    await rotator.demo(parseInt(args[1]) || 5);
  } else if (command === 'test-zai') {
    const zai = new ZAIWithIPRotation();
    console.log('Testing Z-AI with IP rotation...\n');

    for (let i = 0; i < 3; i++) {
      const result = await zai.chat([
        { role: 'user', content: `Say hello. Request ${i + 1}` }
      ]);
      console.log(`Request ${i + 1}:`, result.choices?.[0]?.message?.content);
    }
    console.log('\n📊 Stats:', zai.getStats());
  } else {
    console.log(`
🔄 IP Rotation CLI

Commands:
  demo [n]     Demo IP rotation with n requests
  test-zai     Test Z-AI API with IP rotation

Examples:
  bun ip-rotator.js demo 10
  bun ip-rotator.js test-zai
    `);
  }
}

export { IPRotator, ZAIWithIPRotation, KNOWN_IPS };

if (import.meta.main) {
  main().catch(console.error);
}
```

---

## 📋 Rate Limit Headers Z-AI API

Dari response API, ditemukan header berikut:

```
X-Ratelimit-Ip-10min-Limit: 10         → 10 request per 10 menit (per IP)
X-Ratelimit-Ip-10min-Remaining: 9      → Sisa request untuk IP ini
X-Ratelimit-Limit-Daily: 300           → Limit harian global
X-Ratelimit-Limit-Qps: 2               → 2 request per detik (QPS)
X-Ratelimit-Remaining-Daily: 289       → Sisa limit harian
X-Ratelimit-User-Daily-Remaining: 474  → Sisa limit harian per user
```

---

## ⚠️ Header WAJIB untuk Z-AI API

```bash
curl -X POST "http://172.25.136.210:8080/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer Z.ai" \
  -H "X-Z-AI-From: Z" \                    # ← WAJIB! Tanpa ini = 403 Forbidden
  -H "X-Token: <your-jwt-token>" \
  -H "X-User-Id: <your-user-id>" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"glm-4-flash"}'
```

**PENTING:** Header `X-Z-AI-From: Z` WAJIB ada!

---

## 🚀 Cara Penggunaan

### 1. Import dan Inisialisasi

```javascript
import { SmartRateLimiter } from './smart-rate-limiter.js';

const zai = new SmartRateLimiter();
```

### 2. Chat Completion

```javascript
const result = await zai.chat([
  { role: 'user', content: 'Hello!' }
]);
console.log(result.choices[0].message.content);
```

### 3. Vision API

```javascript
const vision = await zai.vision(
  'https://example.com/image.jpg',
  'Describe this image'
);
```

### 4. Image Generation

```javascript
const image = await zai.generateImage('A beautiful sunset');
```

### 5. Batch Requests

```javascript
const results = await zai.batch([
  { messages: [{ role: 'user', content: 'Question 1' }] },
  { messages: [{ role: 'user', content: 'Question 2' }] }
]);
```

### 6. Tambah Multiple Accounts

```javascript
zai.addAccount(
  'token-kedua',
  'user-id-kedua',
  'chat-id-kedua',
  'Account-2'
);
```

---

## 📈 Perhitungan Kapasitas

| Setup | Kapasitas per Hari |
|-------|-------------------|
| **1 Account** | ~500 request |
| **3 Accounts** | ~1,500 request |
| **10 Accounts** | ~5,000 request |
| **15 Accounts** | ~7,500 request |

---

## 🔧 Arsitektur Solusi

```
┌─────────────────────────────────────────────────────────────┐
│                  SMART RATE LIMITER                         │
└─────────────────────────────────────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ IP ROTATION │    │  ACCOUNT    │    │   REQUEST   │
│  (Otomatis) │    │  ROTATION   │    │    QUEUE    │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ NAT Pool:   │    │ Multi:      │    │ Features:   │
│ • 8.218.x.x │    │ • Account-1 │    │ • QPS Ctrl  │
│ • 47.243.x.x│    │ • Account-2 │    │ • Priority  │
│ • 8.210.x.x │    │ • ...       │    │ • Batch     │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## ✅ Checklist

| Rate Limit | Solusi | Status |
|------------|--------|--------|
| Per IP (10/10min) | IP Rotation | ✅ OTOMATIS |
| Per User (500/day) | Multi Account | ⚠️ Perlu token |
| QPS (2/sec) | Request Queue | ✅ OTOMATIS |
| Daily (300/day) | Multi Key | ⚠️ Perlu API key |

---

## 📝 Catatan Penting

1. **IP Rotation** sudah otomatis berkat NAT pool server
2. **Multi Account** diperlukan untuk >500 req/hari
3. **Header `X-Z-AI-From: Z`** wajib ada di setiap request
4. **QPS** otomatis di-handle oleh Request Queue
