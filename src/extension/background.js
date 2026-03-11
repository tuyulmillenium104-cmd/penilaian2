// Quiz Helper v12.1 - Background Service Worker
// URL Pattern Targeting

let serverUrl = 'https://preview-chat-84d4aa8f-057c-4565-9419-e645d326aa40.space.z.ai';

const defaultSettings = {
  isEnabled: false,
  captureKey: '1',
  areas: { A: null, B: null, C: null, D: null, OK: null },
  position: { x: 20, y: 20 },
  serverUrl: serverUrl,
  targetPatterns: [],
  widgetWidth: 300
};

let state = {
  targetPatterns: [],
  isEnabled: false
};

// Load settings on startup
chrome.storage.local.get(['targetPatterns', 'isEnabled', 'serverUrl'], (r) => {
  if (r.targetPatterns) state.targetPatterns = r.targetPatterns;
  if (r.isEnabled !== undefined) state.isEnabled = r.isEnabled;
  if (r.serverUrl) serverUrl = r.serverUrl;
  console.log('[BG v12.1] Loaded:', state);
});

// Message handler
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log('[BG v12.1]', req.action);
  
  if (req.action === 'updateServerUrl') {
    serverUrl = req.serverUrl;
    chrome.storage.local.set({ serverUrl });
    sendResponse({ success: true });
    return true;
  }
  
  if (req.action === 'getSettings') {
    sendResponse({ serverUrl, ...defaultSettings, targetPatterns: state.targetPatterns, isEnabled: state.isEnabled });
    return true;
  }
  
  if (req.action === 'addTargetPattern') {
    const pattern = req.pattern.toLowerCase().trim();
    if (pattern && !state.targetPatterns.includes(pattern)) {
      state.targetPatterns.push(pattern);
      state.isEnabled = true;
      chrome.storage.local.set({ targetPatterns: state.targetPatterns, isEnabled: true });
      notifyMatchingTabs();
    }
    sendResponse({ success: true, targetPatterns: state.targetPatterns });
    return true;
  }
  
  if (req.action === 'removeTargetPattern') {
    const pattern = req.pattern.toLowerCase().trim();
    state.targetPatterns = state.targetPatterns.filter(p => p !== pattern);
    if (state.targetPatterns.length === 0) state.isEnabled = false;
    chrome.storage.local.set({ targetPatterns: state.targetPatterns, isEnabled: state.targetPatterns.length > 0 });
    notifyAllTabs({ action: 'patternsChanged', targetPatterns: state.targetPatterns, isEnabled: state.isEnabled });
    sendResponse({ success: true, targetPatterns: state.targetPatterns });
    return true;
  }
  
  if (req.action === 'clearAllPatterns') {
    state.targetPatterns = [];
    state.isEnabled = false;
    chrome.storage.local.set({ targetPatterns: [], isEnabled: false });
    notifyAllTabs({ action: 'patternsChanged', targetPatterns: [], isEnabled: false });
    sendResponse({ success: true });
    return true;
  }
  
  if (req.action === 'getPatterns') {
    sendResponse({ targetPatterns: state.targetPatterns, isEnabled: state.isEnabled });
    return true;
  }
  
  if (req.action === 'checkUrlMatch') {
    const url = req.url || '';
    const matched = matchesAnyPattern(url, state.targetPatterns);
    sendResponse({ isMatch: matched, isEnabled: state.isEnabled && matched, targetPatterns: state.targetPatterns });
    return true;
  }
  
  if (req.action === 'getAllTabs') {
    chrome.tabs.query({}, (tabs) => {
      const tabList = tabs.map(tab => ({
        id: tab.id,
        windowId: tab.windowId,
        title: tab.title || 'Untitled',
        url: tab.url || '',
        favIconUrl: tab.favIconUrl || '',
        active: tab.active,
        matched: matchesAnyPattern(tab.url || '', state.targetPatterns)
      }));
      sendResponse({ tabs: tabList, targetPatterns: state.targetPatterns });
    });
    return true;
  }
  
  if (req.action === 'captureTab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 80 }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, image: dataUrl });
      }
    });
    return true;
  }
  
  return true;
});

function matchesAnyPattern(url, patterns) {
  if (!url || !patterns || patterns.length === 0) return false;
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return patterns.some(pattern => hostname.includes(pattern) || url.toLowerCase().includes(pattern));
  } catch { return false; }
}

function notifyAllTabs(message) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message).catch(() => {}));
  });
}

function notifyMatchingTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      const matched = matchesAnyPattern(tab.url || '', state.targetPatterns);
      chrome.tabs.sendMessage(tab.id, { action: 'patternsChanged', isMatch: matched, targetPatterns: state.targetPatterns, isEnabled: state.isEnabled && matched }).catch(() => {});
    });
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const matched = matchesAnyPattern(tab.url, state.targetPatterns);
    if (matched) {
      chrome.tabs.sendMessage(tabId, { action: 'urlMatched', isMatch: true, isEnabled: state.isEnabled, targetPatterns: state.targetPatterns }).catch(() => {});
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Quiz Helper v12.1] Installed!');
  chrome.storage.local.set(defaultSettings);
});
