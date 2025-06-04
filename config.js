// Cấu hình Bot Telegram
const BOT_CONFIG = {
    // Token của bot Telegram
    token: '8167195306:AAFsD7PUJ936fzNE-BwhdMNxQCRTxT2WPB0',
    
    // URL của CloudFlare Worker để làm proxy
    baseURL: 'https://withered-rain-74d2.letho20031608.workers.dev',
    
    options: {
        timeout: 30000,
        retry: true
    }
};

export default BOT_CONFIG;