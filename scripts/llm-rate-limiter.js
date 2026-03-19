/**
 * LLM RATE LIMITER - SOLUTION FOR API RATE LIMITING
 * 
 * Features:
 * - Token Bucket Algorithm untuk rate limiting
 * - Exponential Backoff untuk retry
 * - Request Queue untuk mengatur urutan
 * - Concurrent request limiting
 * - Automatic delay between calls
 * - Request prioritization
 * 
 * Usage:
 * const limiter = new LLMRateLimiter({
 *   maxRequestsPerMinute: 20,
 *   maxConcurrent: 3,
 *   minDelayMs: 1000
 * });
 * 
 * const result = await limiter.execute(() => llm.call(prompt));
 */

// ============================================================================
// RATE LIMITER CLASS
// ============================================================================

class LLMRateLimiter {
  constructor(options = {}) {
    // Configuration
    this.maxRequestsPerMinute = options.maxRequestsPerMinute || 20;
    this.maxRequestsPerSecond = options.maxRequestsPerSecond || 3;
    this.maxConcurrent = options.maxConcurrent || 3;
    this.minDelayMs = options.minDelayMs || 1000; // Minimum delay between calls
    this.maxRetries = options.maxRetries || 3;
    this.baseRetryDelayMs = options.baseRetryDelayMs || 2000;
    
    // Token Bucket for rate limiting
    this.tokens = this.maxRequestsPerMinute;
    this.maxTokens = this.maxRequestsPerMinute;
    this.refillRate = this.maxRequestsPerMinute / 60000; // tokens per ms
    this.lastRefill = Date.now();
    
    // Request queue
    this.queue = [];
    this.activeRequests = 0;
    this.lastRequestTime = 0;
    
    // Statistics
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      retriedRequests: 0,
      queueWaits: 0,
      totalWaitTime: 0,
      rateLimitHits: 0
    };
    
    // Token refill is done lazily, no interval needed
    
    console.log('[RateLimiter] Initialized with config:', {
      maxRequestsPerMinute: this.maxRequestsPerMinute,
      maxConcurrent: this.maxConcurrent,
      minDelayMs: this.minDelayMs,
      maxRetries: this.maxRetries
    });
  }
  
  // =========================================================================
  // TOKEN BUCKET ALGORITHM
  // =========================================================================
  
  // Lazy token refill - called before each request
  
  refillTokens() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
    
    // Process queue if we have tokens and capacity (called manually)
    // this.processQueue();
  }
  
  canMakeRequest() {
    this.refillTokens(); // Refill before checking
    return this.tokens >= 1 && this.activeRequests < this.maxConcurrent;
  }
  
  consumeToken() {
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
  
  // =========================================================================
  // QUEUE MANAGEMENT
  // =========================================================================
  
  async processQueue() {
    if (this.queue.length === 0) return;
    
    // Sort by priority (higher priority first)
    this.queue.sort((a, b) => b.priority - a.priority);
    
    while (this.queue.length > 0 && this.canMakeRequest()) {
      const item = this.queue.shift();
      if (item && !item.cancelled) {
        this.executeRequest(item);
      }
    }
  }
  
  enqueue(fn, options = {}) {
    return new Promise((resolve, reject) => {
      const item = {
        fn,
        resolve,
        reject,
        priority: options.priority || 1,
        retries: 0,
        queuedAt: Date.now(),
        cancelled: false
      };
      
      this.queue.push(item);
      this.stats.queueWaits++;
      
      // Try to process immediately if possible
      this.processQueue();
    });
  }
  
  async executeRequest(item) {
    this.activeRequests++;
    const startTime = Date.now();
    
    // Ensure minimum delay between requests
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < this.minDelayMs) {
      const waitTime = this.minDelayMs - timeSinceLastRequest;
      await this.sleep(waitTime);
    }
    
    this.lastRequestTime = Date.now();
    this.stats.totalRequests++;
    
    try {
      // Refill and consume token
      this.refillTokens();
      if (!this.consumeToken()) {
        // Should not happen due to pre-check, but handle gracefully
        this.stats.rateLimitHits++;
        this.queue.unshift(item); // Put back at front
        this.activeRequests--;
        return;
      }
      
      // Execute the request
      const result = await item.fn();
      
      this.stats.successfulRequests++;
      const waitTime = Date.now() - item.queuedAt;
      this.stats.totalWaitTime += waitTime;
      
      item.resolve(result);
      
    } catch (error) {
      await this.handleError(item, error);
    } finally {
      this.activeRequests--;
      // Process next in queue
      this.processQueue();
    }
  }
  
  async handleError(item, error) {
    const isRateLimitError = this.isRateLimitError(error);
    
    if (isRateLimitError && item.retries < this.maxRetries) {
      // Rate limit error - retry with exponential backoff
      item.retries++;
      this.stats.retriedRequests++;
      this.stats.rateLimitHits++;
      
      const delay = this.calculateBackoffDelay(item.retries);
      console.log(`[RateLimiter] Rate limit hit, retrying in ${delay}ms (attempt ${item.retries}/${this.maxRetries})`);
      
      await this.sleep(delay);
      
      // Re-queue with higher priority
      item.priority = Math.min(10, item.priority + 1);
      this.queue.unshift(item);
      
    } else if (item.retries < this.maxRetries && this.isRetryableError(error)) {
      // Other retryable error
      item.retries++;
      this.stats.retriedRequests++;
      
      const delay = this.calculateBackoffDelay(item.retries);
      console.log(`[RateLimiter] Retryable error, retrying in ${delay}ms (attempt ${item.retries}/${this.maxRetries})`);
      
      await this.sleep(delay);
      this.queue.unshift(item);
      
    } else {
      // Non-retryable or max retries reached
      this.stats.failedRequests++;
      item.reject(error);
    }
  }
  
  isRateLimitError(error) {
    const msg = error.message?.toLowerCase() || '';
    return (
      msg.includes('429') ||
      msg.includes('rate limit') ||
      msg.includes('too many requests') ||
      msg.includes('速率限制') ||
      msg.includes('请控制请求频率')
    );
  }
  
  isRetryableError(error) {
    const msg = error.message?.toLowerCase() || '';
    return (
      msg.includes('timeout') ||
      msg.includes('network') ||
      msg.includes('503') ||
      msg.includes('502') ||
      msg.includes('500') ||
      msg.includes('connection')
    );
  }
  
  calculateBackoffDelay(retryCount) {
    // Exponential backoff with jitter
    const baseDelay = this.baseRetryDelayMs;
    const exponentialDelay = baseDelay * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 1000; // Add up to 1s of jitter
    return Math.min(exponentialDelay + jitter, 30000); // Max 30s
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // =========================================================================
  // PUBLIC API
  // =========================================================================
  
  /**
   * Execute a function with rate limiting
   * @param {Function} fn - Async function to execute
   * @param {Object} options - Options (priority, skipQueue)
   * @returns {Promise} - Result of the function
   */
  async execute(fn, options = {}) {
    if (options.skipQueue && this.canMakeRequest()) {
      this.consumeToken();
      return fn();
    }
    
    return this.enqueue(fn, options);
  }
  
  /**
   * Execute multiple functions in batch with rate limiting
   * @param {Array<Function>} fns - Array of async functions
   * @param {Object} options - Batch options
   * @returns {Promise<Array>} - Results in order
   */
  async executeBatch(fns, options = {}) {
    const concurrency = options.concurrency || this.maxConcurrent;
    const results = new Array(fns.length);
    
    // Process in chunks
    for (let i = 0; i < fns.length; i += concurrency) {
      const chunk = fns.slice(i, i + concurrency);
      const chunkResults = await Promise.all(
        chunk.map((fn, idx) => this.execute(fn, { priority: options.priority || 1 }))
      );
      results.splice(i, chunk.length, ...chunkResults);
      
      // Delay between chunks
      if (i + concurrency < fns.length) {
        await this.sleep(this.minDelayMs * 2);
      }
    }
    
    return results;
  }
  
  /**
   * Get current rate limiter status
   */
  getStatus() {
    return {
      tokens: Math.floor(this.tokens),
      maxTokens: this.maxTokens,
      queueLength: this.queue.length,
      activeRequests: this.activeRequests,
      stats: { ...this.stats },
      utilizationPercent: Math.round((1 - this.tokens / this.maxTokens) * 100)
    };
  }
  
  /**
   * Clear the queue (cancel pending requests)
   */
  clearQueue() {
    const cancelled = this.queue.length;
    this.queue.forEach(item => {
      item.cancelled = true;
      item.reject(new Error('Request cancelled'));
    });
    this.queue = [];
    console.log(`[RateLimiter] Cancelled ${cancelled} pending requests`);
    return cancelled;
  }
  
  /**
   * Wait until queue is empty
   */
  async drain(timeout = 60000) {
    const start = Date.now();
    while (this.queue.length > 0 || this.activeRequests > 0) {
      if (Date.now() - start > timeout) {
        throw new Error('Drain timeout exceeded');
      }
      await this.sleep(100);
    }
  }
}

// ============================================================================
// SMART LLM CALLER WITH CACHING
// ============================================================================

class SmartLLMCaller {
  constructor(rateLimiter, options = {}) {
    this.rateLimiter = rateLimiter;
    this.cache = new Map();
    this.cacheEnabled = options.cacheEnabled !== false;
    this.cacheTTL = options.cacheTTL || 300000; // 5 minutes
    this.zai = null;
  }
  
  async init() {
    if (!this.zai) {
      const ZAI = require('z-ai-web-dev-sdk').default;
      this.zai = await ZAI.create();
    }
    return this.zai;
  }
  
  getCacheKey(systemPrompt, userPrompt, options) {
    // Create a hash-like key from prompts
    const content = `${systemPrompt}|${userPrompt}|${options.temperature}|${options.maxTokens}`;
    return content.slice(0, 200); // Use first 200 chars as key
  }
  
  getCached(key) {
    if (!this.cacheEnabled) return null;
    
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log('[SmartLLM] Cache hit');
      return cached.result;
    }
    return null;
  }
  
  setCache(key, result) {
    if (!this.cacheEnabled) return;
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }
  
  async call(systemPrompt, userPrompt, options = {}) {
    // Check cache first
    const cacheKey = this.getCacheKey(systemPrompt, userPrompt, options);
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    
    // Execute with rate limiting
    const result = await this.rateLimiter.execute(async () => {
      await this.init();
      
      const completion = await this.zai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature || 0.8,
        max_tokens: options.maxTokens || 2000
      });
      
      return {
        success: true,
        content: completion.choices[0]?.message?.content || '',
        raw: completion
      };
    }, { priority: options.priority || 1 });
    
    // Cache successful results
    if (result.success) {
      this.setCache(cacheKey, result);
    }
    
    return result;
  }
  
  async callBatch(calls, options = {}) {
    const fns = calls.map(call => async () => {
      return this.call(call.systemPrompt, call.userPrompt, call.options);
    });
    
    return this.rateLimiter.executeBatch(fns, options);
  }
  
  clearCache() {
    this.cache.clear();
    console.log('[SmartLLM] Cache cleared');
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let globalRateLimiter = null;
let globalSmartCaller = null;

function getRateLimiter(options = {}) {
  if (!globalRateLimiter) {
    globalRateLimiter = new LLMRateLimiter(options);
  }
  return globalRateLimiter;
}

function getSmartCaller(options = {}) {
  if (!globalSmartCaller) {
    globalSmartCaller = new SmartLLMCaller(getRateLimiter(), options);
  }
  return globalSmartCaller;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  LLMRateLimiter,
  SmartLLMCaller,
  getRateLimiter,
  getSmartCaller
};
