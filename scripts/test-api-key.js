#!/usr/bin/env node
/**
 * API Key Tester - Test your API keys quickly
 * 
 * Usage:
 *   node scripts/test-api-key.js <provider> <api_key>
 * 
 * Examples:
 *   node scripts/test-api-key.js groq gsk_xxx
 *   node scripts/test-api-key.js gemini AIzaSyxxx
 *   node scripts/test-api-key.js together xxx
 *   node scripts/test-api-key.js openrouter sk-or-xxx
 *   node scripts/test-api-key.js deepseek sk-xxx
 */

const https = require('https');

const PROVIDERS = {
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
    format: 'openai'
  },
  gemini: {
    name: 'Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    format: 'gemini'
  },
  together: {
    name: 'Together AI',
    url: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
    format: 'openai'
  },
  openrouter: {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    format: 'openai'
  },
  deepseek: {
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    format: 'openai'
  }
};

async function testApiKey(provider, apiKey) {
  const config = PROVIDERS[provider];
  
  if (!config) {
    console.log(`❌ Unknown provider: ${provider}`);
    console.log(`   Available: ${Object.keys(PROVIDERS).join(', ')}`);
    return false;
  }
  
  console.log(`\n🔍 Testing ${config.name} API Key...`);
  console.log(`   Provider: ${provider}`);
  console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
  
  return new Promise((resolve) => {
    let body;
    let url = config.url;
    let headers = { 'Content-Type': 'application/json' };
    
    if (config.format === 'openai') {
      body = JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: 'Say "OK" only' }],
        max_tokens: 10
      });
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (config.format === 'gemini') {
      url = `${config.url}?key=${apiKey}`;
      body = JSON.stringify({
        contents: [{ parts: [{ text: 'Say "OK" only' }] }]
      });
    }
    
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`\n✅ SUCCESS! ${config.name} API Key is VALID`);
          console.log(`\n📝 To use this key:`);
          console.log(`   1. Open scripts/rally-workflow-v9.4.0.js`);
          console.log(`   2. Find the "${provider}" section in CONFIG.providers`);
          console.log(`   3. Set enabled: true`);
          console.log(`   4. Set apiKey: '${apiKey}'`);
          console.log(`   5. Run: node scripts/rally-workflow-v9.4.0.js "campaign_name"`);
          resolve(true);
        } else {
          const errorData = JSON.parse(data);
          console.log(`\n❌ FAILED (${res.statusCode})`);
          console.log(`   Error: ${errorData.error?.message || JSON.stringify(errorData)}`);
          
          if (res.statusCode === 403) {
            console.log(`\n💡 Tips:`);
            if (provider === 'groq') {
              console.log(`   - Go to https://console.groq.com/keys`);
              console.log(`   - Make sure your account is verified`);
              console.log(`   - Create a new API key`);
            } else if (provider === 'gemini') {
              console.log(`   - Gemini may be blocked in your region`);
              console.log(`   - Try using a VPN`);
            }
          }
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`\n❌ Connection failed: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      console.log(`\n❌ Request timeout`);
      resolve(false);
    });
    
    req.write(body);
    req.end();
  });
}

// Main
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('\n📖 API Key Tester\n');
  console.log('Usage: node scripts/test-api-key.js <provider> <api_key>\n');
  console.log('Providers:');
  Object.entries(PROVIDERS).forEach(([key, val]) => {
    console.log(`  ${key.padEnd(12)} - ${val.name}`);
  });
  console.log('\nExamples:');
  console.log('  node scripts/test-api-key.js groq gsk_xxxxx');
  console.log('  node scripts/test-api-key.js gemini AIzaSyxxxxx');
  process.exit(0);
}

testApiKey(args[0], args[1]);
