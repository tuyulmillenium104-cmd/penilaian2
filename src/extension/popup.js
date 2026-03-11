// Quiz Helper v12.1 - Popup Script
// URL Pattern Targeting

let targetPatterns = [];

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadPatterns();
  setupEvents();
});

function loadSettings() {
  chrome.storage.local.get(['captureKey', 'serverUrl'], (r) => {
    document.getElementById('captureKey').value = r.captureKey || '1';
    document.getElementById('keyDisplay').textContent = r.captureKey || '1';
    
    if (r.serverUrl) {
      document.getElementById('serverUrl').textContent = r.serverUrl;
    } else {
      chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
        if (response && response.serverUrl) {
          document.getElementById('serverUrl').textContent = response.serverUrl;
        }
      });
    }
  });
}

function loadPatterns() {
  chrome.runtime.sendMessage({ action: 'getPatterns' }, (response) => {
    if (response && response.targetPatterns) {
      targetPatterns = response.targetPatterns;
      renderPatterns();
      updateStatusDot(response.isEnabled);
    }
  });
}

function renderPatterns() {
  const list = document.getElementById('patternList');
  const stopBtn = document.getElementById('stopBtn');
  
  if (targetPatterns.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="icon">🎯</div>
        <p>No patterns added.<br>Add a URL pattern above.</p>
      </div>
    `;
    stopBtn.style.display = 'none';
    return;
  }
  
  list.innerHTML = targetPatterns.map(pattern => `
    <div class="pattern-item">
      <span class="icon">🌐</span>
      <span class="pattern-text">${escapeHtml(pattern)}</span>
      <button class="remove-btn" data-pattern="${escapeHtml(pattern)}">×</button>
    </div>
  `).join('');
  
  stopBtn.style.display = 'block';
  
  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => removePattern(btn.dataset.pattern);
  });
}

function addPattern(pattern) {
  pattern = pattern.toLowerCase().trim();
  if (!pattern) return;
  
  try {
    if (pattern.includes('://')) {
      const url = new URL(pattern);
      pattern = url.hostname;
    }
  } catch {}
  
  if (targetPatterns.includes(pattern)) {
    renderPatterns();
    return;
  }
  
  chrome.runtime.sendMessage({ action: 'addTargetPattern', pattern }, (response) => {
    if (response && response.success) {
      targetPatterns = response.targetPatterns;
      renderPatterns();
      updateStatusDot(true);
    }
  });
}

function removePattern(pattern) {
  chrome.runtime.sendMessage({ action: 'removeTargetPattern', pattern }, (response) => {
    if (response && response.success) {
      targetPatterns = response.targetPatterns;
      renderPatterns();
      updateStatusDot(targetPatterns.length > 0);
    }
  });
}

function stopAllMonitoring() {
  chrome.runtime.sendMessage({ action: 'clearAllPatterns' }, (response) => {
    if (response && response.success) {
      targetPatterns = [];
      renderPatterns();
      updateStatusDot(false);
    }
  });
}

function updateStatusDot(isActive) {
  const dot = document.getElementById('status-dot');
  if (dot) dot.classList.toggle('active', isActive);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function setupEvents() {
  document.getElementById('addBtn').onclick = () => {
    const input = document.getElementById('patternInput');
    addPattern(input.value);
    input.value = '';
  };
  
  document.getElementById('patternInput').onkeydown = (e) => {
    if (e.key === 'Enter') {
      const input = document.getElementById('patternInput');
      addPattern(input.value);
      input.value = '';
    }
  };
  
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.onclick = () => addPattern(btn.dataset.pattern);
  });
  
  document.getElementById('stopBtn').onclick = stopAllMonitoring;
  
  document.getElementById('captureKey').onchange = (e) => {
    const key = e.target.value || '1';
    chrome.storage.local.set({ captureKey: key });
    document.getElementById('keyDisplay').textContent = key;
  };
  
  document.getElementById('captureKey').oninput = (e) => {
    document.getElementById('keyDisplay').textContent = e.target.value || '1';
  };
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.targetPatterns) {
    targetPatterns = changes.targetPatterns.newValue || [];
    renderPatterns();
    updateStatusDot(targetPatterns.length > 0);
  }
});
