// Quiz Helper v12.1 - URL Pattern Targeting + Resizable Widget
(function() {
  'use strict';
  
  if (document.getElementById('qh-root')) return;
  
  console.log('[Quiz Helper v12.1] Loading...');
  
  const CONFIG = {
    version: '12.1.0',
    serverUrl: 'https://preview-chat-84d4aa8f-057c-4565-9419-e645d326aa40.space.z.ai',
    minWidgetWidth: 280
  };
  
  const state = {
    isTargetTab: false,
    isEnabled: false,
    isDragging: false,
    isResizing: false,
    isProcessing: false,
    position: { x: 20, y: 20 },
    widgetWidth: 300,
    captureKey: '1',
    areas: { A: null, B: null, C: null, D: null, OK: null },
    lastResult: null,
    stats: { detected: 0, solved: 0 },
    results: { cache: null, pattern: null, math: null, textAi: null, vision: null }
  };
  
  function log(...args) {
    console.log(`[Quiz Helper v${CONFIG.version}]`, ...args);
  }
  
  // ==================== UI ====================
  function createUI() {
    const root = document.createElement('div');
    root.id = 'qh-root';
    root.style.cssText = 'display:none;position:fixed;top:0;left:0;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:12px;';
    
    root.innerHTML = `
      <div id="qh-widget" style="position:fixed;width:300px;min-width:280px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);overflow:hidden;">
        <div id="qh-header" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(90deg,#0f0f1a 0%,#1a1a2e 100%);border-bottom:1px solid rgba(255,255,255,0.1);cursor:grab;user-select:none;">
          <span style="font-size:16px;">⚡</span>
          <span style="color:#fff;font-weight:600;font-size:12px;">Quiz Helper <span style="color:#10b981;font-size:10px;">v12.1</span></span>
          <div id="qh-dot" style="margin-left:auto;width:8px;height:8px;border-radius:50%;background:#6b7280;"></div>
          <button id="qh-min" style="width:22px;height:22px;border:none;border-radius:6px;background:rgba(255,255,255,0.08);color:#9ca3af;cursor:pointer;font-size:14px;">−</button>
          <button id="qh-close" style="width:22px;height:22px;border:none;border-radius:6px;background:rgba(255,255,255,0.08);color:#9ca3af;cursor:pointer;font-size:14px;">×</button>
        </div>
        
        <div id="qh-body" style="padding:12px;">
          <div id="qh-main" style="text-align:center;padding:16px 12px;background:linear-gradient(135deg,rgba(16,185,129,0.15) 0%,rgba(5,150,105,0.1) 100%);border-radius:12px;border:1px solid rgba(16,185,129,0.3);margin-bottom:12px;">
            <div id="qh-letter" style="font-size:56px;font-weight:800;color:#4b5563;line-height:1;margin-bottom:4px;">?</div>
            <div id="qh-answer-text" style="font-size:16px;color:#fff;font-weight:600;"></div>
            <div id="qh-confidence" style="font-size:13px;color:#6b7280;margin-top:8px;"></div>
          </div>
          
          <div id="qh-results" style="background:rgba(0,0,0,0.25);border-radius:10px;padding:10px;margin-bottom:12px;">
            <div style="text-align:center;font-size:10px;color:#6b7280;margin-bottom:10px;">━━━ RESULTS ━━━</div>
            <div id="qh-results-list">
              <div class="qh-row" data-type="cache" style="display:flex;align-items:center;padding:6px 8px;gap:8px;border-radius:6px;margin-bottom:4px;background:rgba(255,255,255,0.03);">
                <span style="font-size:14px;width:20px;text-align:center;">⚡</span>
                <span style="color:#9ca3af;font-size:11px;width:55px;">Cache</span>
                <span class="qh-res-answer" style="flex:1;color:#6b7280;font-size:11px;">-</span>
                <span class="qh-res-time" style="color:#4b5563;font-size:10px;width:40px;text-align:right;">-</span>
              </div>
              <div class="qh-row" data-type="pattern" style="display:flex;align-items:center;padding:6px 8px;gap:8px;border-radius:6px;margin-bottom:4px;background:rgba(255,255,255,0.03);">
                <span style="font-size:14px;width:20px;text-align:center;">🔍</span>
                <span style="color:#9ca3af;font-size:11px;width:55px;">Pattern</span>
                <span class="qh-res-answer" style="flex:1;color:#6b7280;font-size:11px;">-</span>
                <span class="qh-res-time" style="color:#4b5563;font-size:10px;width:40px;text-align:right;">-</span>
              </div>
              <div class="qh-row" data-type="math" style="display:flex;align-items:center;padding:6px 8px;gap:8px;border-radius:6px;margin-bottom:4px;background:rgba(255,255,255,0.03);">
                <span style="font-size:14px;width:20px;text-align:center;">🧮</span>
                <span style="color:#9ca3af;font-size:11px;width:55px;">Math</span>
                <span class="qh-res-answer" style="flex:1;color:#6b7280;font-size:11px;">-</span>
                <span class="qh-res-time" style="color:#4b5563;font-size:10px;width:40px;text-align:right;">-</span>
              </div>
              <div class="qh-row" data-type="textai" style="display:flex;align-items:center;padding:6px 8px;gap:8px;border-radius:6px;margin-bottom:4px;background:rgba(255,255,255,0.03);">
                <span style="font-size:14px;width:20px;text-align:center;">🤖</span>
                <span style="color:#9ca3af;font-size:11px;width:55px;">Text AI</span>
                <span class="qh-res-answer" style="flex:1;color:#6b7280;font-size:11px;">-</span>
                <span class="qh-res-time" style="color:#4b5563;font-size:10px;width:40px;text-align:right;">-</span>
              </div>
              <div class="qh-row" data-type="vision" style="display:flex;align-items:center;padding:6px 8px;gap:8px;border-radius:6px;background:rgba(255,255,255,0.03);">
                <span style="font-size:14px;width:20px;text-align:center;">👁️</span>
                <span style="color:#9ca3af;font-size:11px;width:55px;">Vision</span>
                <span class="qh-res-answer" style="flex:1;color:#6b7280;font-size:11px;">📷 Manual</span>
                <span class="qh-res-time" style="color:#4b5563;font-size:10px;width:40px;text-align:right;">-</span>
              </div>
            </div>
          </div>
          
          <div id="qh-status" style="text-align:center;padding:8px;font-size:11px;color:#9ca3af;background:rgba(0,0,0,0.2);border-radius:8px;margin-bottom:12px;">🔴 Not monitoring</div>
          
          <div style="margin-bottom:12px;">
            <div style="display:flex;gap:6px;margin-bottom:6px;">
              <button class="qh-abtn" data-area="A" style="flex:1;padding:8px 6px;border:none;border-radius:8px;background:rgba(255,255,255,0.08);color:#9ca3af;font-size:11px;font-weight:600;cursor:pointer;">A</button>
              <button class="qh-abtn" data-area="B" style="flex:1;padding:8px 6px;border:none;border-radius:8px;background:rgba(255,255,255,0.08);color:#9ca3af;font-size:11px;font-weight:600;cursor:pointer;">B</button>
              <button class="qh-abtn" data-area="C" style="flex:1;padding:8px 6px;border:none;border-radius:8px;background:rgba(255,255,255,0.08);color:#9ca3af;font-size:11px;font-weight:600;cursor:pointer;">C</button>
              <button class="qh-abtn" data-area="D" style="flex:1;padding:8px 6px;border:none;border-radius:8px;background:rgba(255,255,255,0.08);color:#9ca3af;font-size:11px;font-weight:600;cursor:pointer;">D</button>
              <button class="qh-abtn" data-area="OK" style="padding:8px 10px;border:none;border-radius:8px;background:rgba(245,158,11,0.2);color:#f59e0b;font-size:11px;font-weight:600;cursor:pointer;">OK</button>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="qh-capture" style="flex:1;padding:8px;border:none;border-radius:8px;background:rgba(59,130,246,0.25);color:#60a5fa;font-size:11px;font-weight:600;cursor:pointer;">📷 Capture</button>
              <button id="qh-reset" style="flex:1;padding:8px;border:none;border-radius:8px;background:rgba(239,68,68,0.2);color:#f87171;font-size:11px;font-weight:600;cursor:pointer;">↺ Reset</button>
            </div>
          </div>
          
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px;">
            <span style="color:#6b7280;font-size:11px;">Key:</span>
            <input id="qh-key" type="text" value="${state.captureKey}" maxlength="1" style="width:28px;height:24px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(0,0,0,0.3);color:#fff;text-align:center;font-size:12px;font-weight:600;">
          </div>
          
          <div id="qh-stats" style="display:flex;justify-content:space-around;padding:8px;font-size:11px;color:#6b7280;background:rgba(0,0,0,0.2);border-radius:8px;">
            <span>🎯<span id="qh-s-det">0</span></span>
            <span>✅<span id="qh-s-sol">0</span></span>
          </div>
        </div>
        
        <div id="qh-resize" style="position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:nwse-resize;display:flex;align-items:center;justify-content:center;">
          <div style="width:6px;height:6px;border-right:2px solid rgba(255,255,255,0.3);border-bottom:2px solid rgba(255,255,255,0.3);"></div>
        </div>
      </div>
      
      <div id="qh-mini" style="display:none;position:fixed;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:8px 14px;border-radius:24px;align-items:center;gap:8px;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);">
        <span style="font-size:16px;">⚡</span>
        <span id="qh-mini-letter" style="font-size:20px;font-weight:800;color:#4b5563;">?</span>
        <span id="qh-mini-text" style="font-size:11px;color:#9ca3af;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
      </div>
      
      <div id="qh-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);z-index:2147483646;cursor:crosshair;">
        <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:#fff;padding:14px 22px;border-radius:10px;font-size:13px;">Drag to select area</div>
      </div>
    `;
    
    document.body.appendChild(root);
    return root;
  }
  
  // ==================== AREA SELECTION ====================
  let currentArea = null;
  let selBox = null;
  let startX, startY;
  
  function startAreaSelection(area) {
    currentArea = area;
    const overlay = document.getElementById('qh-overlay');
    if (overlay) overlay.style.display = 'block';
    
    const onDown = (e) => {
      if (e.target.closest('#qh-widget')) return;
      startX = e.clientX;
      startY = e.clientY;
      selBox = document.createElement('div');
      selBox.style.cssText = `left:${startX}px;top:${startY}px;position:fixed;background:rgba(74,222,128,0.3);border:2px solid #4ade80;z-index:999999;pointer-events:none;`;
      document.body.appendChild(selBox);
    };
    
    const onMove = (e) => {
      if (!selBox) return;
      const x = Math.min(startX, e.clientX);
      const y = Math.min(startY, e.clientY);
      const w = Math.abs(e.clientX - startX);
      const h = Math.abs(e.clientY - startY);
      selBox.style.left = x + 'px';
      selBox.style.top = y + 'px';
      selBox.style.width = w + 'px';
      selBox.style.height = h + 'px';
    };
    
    const onUp = (e) => {
      if (!selBox) return;
      const x = Math.min(startX, e.clientX);
      const y = Math.min(startY, e.clientY);
      const w = Math.abs(e.clientX - startX);
      const h = Math.abs(e.clientY - startY);
      
      if (w >= 20 && h >= 20) {
        state.areas[currentArea] = { x, y, w, h };
        chrome.storage.local.set({ areas: state.areas });
        updateAreaBtns();
        showNotif(`✅ Area ${currentArea} saved`, 'success');
      }
      
      selBox.remove();
      selBox = null;
      currentArea = null;
      if (overlay) overlay.style.display = 'none';
      
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
  
  function updateAreaBtns() {
    document.querySelectorAll('.qh-abtn[data-area]').forEach(btn => {
      const area = btn.dataset.area;
      if (state.areas[area]) {
        btn.style.background = area === 'OK' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)';
        btn.style.color = area === 'OK' ? '#f59e0b' : '#10b981';
        btn.textContent = area + ' ✓';
      } else {
        btn.style.background = area === 'OK' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)';
        btn.style.color = area === 'OK' ? '#f59e0b' : '#9ca3af';
        btn.textContent = area;
      }
    });
  }
  
  // ==================== CAPTURE ====================
  async function capture() {
    if (!state.isEnabled) return;
    
    state.isProcessing = true;
    updateStatus('📸 Capturing...');
    
    try {
      const res = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'captureTab' }, resolve);
      });
      
      if (!res?.success) {
        updateStatus('❌ Capture failed');
        state.isProcessing = false;
        return;
      }
      
      updateStatus('👁️ Vision AI...');
      
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > 1280) { h = (h * 1280) / w; w = 1280; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        
        try {
          const resp = await fetch(`${CONFIG.serverUrl}/api/quiz-solve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'vision', image: compressed, language: 'id' })
          });
          const data = await resp.json();
          
          if (data.success && data.answer) {
            state.results.vision = { answer: data.answer, text: data.answerText, time: data.time, success: true };
            updateResultRow('vision', state.results.vision);
            
            state.lastResult = { letter: data.answer, text: data.answerText, confidence: data.confidence };
            updateMainAnswer();
            updateStatus(`✅ Vision: ${data.time}ms`);
            state.stats.solved++;
            updateStats();
            
            // Auto-click if area set
            if (data.answer !== '?' && state.areas[data.answer]) {
              setTimeout(() => autoClick(data.answer), 200);
            }
          } else {
            updateStatus('❌ No answer');
          }
        } catch (e) {
          updateStatus('❌ Error');
        }
        
        state.isProcessing = false;
      };
      img.src = res.image;
      
    } catch (e) {
      updateStatus('❌ Error');
      state.isProcessing = false;
    }
  }
  
  function autoClick(letter) {
    const area = state.areas[letter];
    if (!area) return;
    
    const x = area.x + area.w / 2;
    const y = area.y + area.h / 2;
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    
    ['mousedown', 'mouseup', 'click'].forEach(type => {
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y }));
    });
    
    updateStatus('✅ Clicked!');
    
    if (state.areas.OK) {
      setTimeout(() => {
        const okEl = document.elementFromPoint(state.areas.OK.x + state.areas.OK.w / 2, state.areas.OK.y + state.areas.OK.h / 2);
        if (okEl) okEl.click();
      }, 100);
    }
  }
  
  // ==================== UPDATE UI ====================
  function updateStatus(text) {
    const el = document.getElementById('qh-status');
    if (el) el.textContent = text;
  }
  
  function updateStats() {
    const det = document.getElementById('qh-s-det');
    const sol = document.getElementById('qh-s-sol');
    if (det) det.textContent = state.stats.detected;
    if (sol) sol.textContent = state.stats.solved;
  }
  
  function updateResultRow(type, result) {
    const row = document.querySelector(`.qh-row[data-type="${type}"]`);
    if (!row) return;
    
    const answerEl = row.querySelector('.qh-res-answer');
    const timeEl = row.querySelector('.qh-res-time');
    
    if (!result || !result.success) {
      if (answerEl) {
        answerEl.textContent = type === 'vision' ? '📷 Manual' : '-';
        answerEl.style.color = '#6b7280';
      }
      if (timeEl) timeEl.textContent = '-';
      return;
    }
    
    if (answerEl) {
      answerEl.textContent = `${result.answer}. ${result.text || ''}`;
      answerEl.style.color = '#10b981';
    }
    if (timeEl && result.time) {
      timeEl.textContent = result.time < 1000 ? `${result.time}ms` : `${(result.time/1000).toFixed(1)}s`;
    }
  }
  
  function updateMainAnswer() {
    const result = state.lastResult;
    if (!result) return;
    
    const letter = document.getElementById('qh-letter');
    const answerText = document.getElementById('qh-answer-text');
    const confidence = document.getElementById('qh-confidence');
    const miniLetter = document.getElementById('qh-mini-letter');
    const miniText = document.getElementById('qh-mini-text');
    
    if (letter) {
      letter.textContent = result.letter;
      letter.style.color = '#10b981';
    }
    if (answerText) answerText.textContent = result.text || '';
    if (confidence && result.confidence) {
      const pct = Math.round(result.confidence * 100);
      confidence.textContent = `${pct >= 80 ? '🟢' : '🟡'} ${pct}%`;
    }
    if (miniLetter) {
      miniLetter.textContent = result.letter;
      miniLetter.style.color = '#10b981';
    }
    if (miniText) miniText.textContent = result.text || '';
  }
  
  function updateTargetStatus() {
    const root = document.getElementById('qh-root');
    const dot = document.getElementById('qh-dot');
    const status = document.getElementById('qh-status');
    
    if (root) root.style.display = state.isTargetTab ? 'block' : 'none';
    if (dot) dot.style.background = state.isTargetTab && state.isEnabled ? '#10b981' : '#6b7280';
    if (status) status.textContent = state.isTargetTab && state.isEnabled ? '🟢 Monitoring...' : '🔴 Not monitoring';
  }
  
  function showNotif(msg, type = 'info') {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:20px;right:20px;z-index:999999;padding:10px 16px;border-radius:8px;font-size:13px;background:${type === 'success' ? '#22c55e' : '#3b82f6'};color:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2000);
  }
  
  // ==================== MESSAGES ====================
  function setupMessages() {
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req.action === 'patternsChanged' || req.action === 'urlMatched') {
        checkUrlMatch();
      }
      if (req.action === 'enabledChanged') {
        state.isEnabled = req.isEnabled;
        updateTargetStatus();
      }
      return true;
    });
  }
  
  function checkUrlMatch() {
    chrome.runtime.sendMessage({ action: 'checkUrlMatch', url: window.location.href }, (response) => {
      if (response) {
        state.isTargetTab = response.isMatch;
        state.isEnabled = response.isEnabled;
        updateTargetStatus();
      }
    });
  }
  
  // ==================== INIT ====================
  async function init() {
    const settings = await new Promise(r => {
      chrome.storage.local.get(['areas', 'captureKey', 'position', 'widgetWidth'], r);
    });
    
    if (settings.areas) state.areas = { ...state.areas, ...settings.areas };
    if (settings.captureKey) state.captureKey = settings.captureKey;
    if (settings.position) state.position = settings.position;
    if (settings.widgetWidth) state.widgetWidth = settings.widgetWidth;
    
    createUI();
    
    const widget = document.getElementById('qh-widget');
    widget.style.left = state.position.x + 'px';
    widget.style.top = state.position.y + 'px';
    widget.style.width = state.widgetWidth + 'px';
    
    document.getElementById('qh-key').value = state.captureKey;
    updateAreaBtns();
    setupMessages();
    checkUrlMatch();
    setupEvents();
    
    log('Ready!');
  }
  
  function setupEvents() {
    document.getElementById('qh-close').onclick = () => {
      document.getElementById('qh-root').style.display = 'none';
    };
    
    document.getElementById('qh-min').onclick = () => {
      document.getElementById('qh-widget').style.display = 'none';
      document.getElementById('qh-mini').style.display = 'flex';
    };
    
    document.getElementById('qh-mini').ondblclick = () => {
      document.getElementById('qh-widget').style.display = 'block';
      document.getElementById('qh-mini').style.display = 'none';
    };
    
    document.querySelectorAll('.qh-abtn[data-area]').forEach(btn => {
      btn.onclick = () => startAreaSelection(btn.dataset.area);
    });
    
    document.getElementById('qh-capture').onclick = capture;
    
    document.getElementById('qh-reset').onclick = () => {
      state.areas = { A: null, B: null, C: null, D: null, OK: null };
      chrome.storage.local.set({ areas: state.areas });
      updateAreaBtns();
      showNotif('↺ Reset', 'info');
    };
    
    document.getElementById('qh-key').onchange = (e) => {
      state.captureKey = e.target.value || '1';
      chrome.storage.local.set({ captureKey: state.captureKey });
    };
    
    document.addEventListener('keydown', (e) => {
      if (e.key === state.captureKey && !e.ctrlKey && !e.altKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        capture();
      }
    });
    
    // Drag
    let dragOff = { x: 0, y: 0 };
    document.getElementById('qh-header').onmousedown = (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;
      state.isDragging = true;
      dragOff.x = e.clientX - state.position.x;
      dragOff.y = e.clientY - state.position.y;
    };
    
    document.addEventListener('mousemove', (e) => {
      if (state.isDragging) {
        state.position.x = Math.max(0, e.clientX - dragOff.x);
        state.position.y = Math.max(0, e.clientY - dragOff.y);
        document.getElementById('qh-widget').style.left = state.position.x + 'px';
        document.getElementById('qh-widget').style.top = state.position.y + 'px';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (state.isDragging) {
        state.isDragging = false;
        chrome.storage.local.set({ position: state.position });
      }
    });
    
    // Resize
    const resizeHandle = document.getElementById('qh-resize');
    let resizeStart = { x: 0, width: 0 };
    
    resizeHandle.onmousedown = (e) => {
      e.preventDefault();
      state.isResizing = true;
      resizeStart.x = e.clientX;
      resizeStart.width = state.widgetWidth;
    };
    
    document.addEventListener('mousemove', (e) => {
      if (state.isResizing) {
        const newWidth = Math.max(CONFIG.minWidgetWidth, resizeStart.width + (e.clientX - resizeStart.x));
        state.widgetWidth = newWidth;
        document.getElementById('qh-widget').style.width = newWidth + 'px';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (state.isResizing) {
        state.isResizing = false;
        chrome.storage.local.set({ widgetWidth: state.widgetWidth });
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
