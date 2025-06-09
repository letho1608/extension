// 🍅 Cute Pomodoro Timer - Content Script
// Helps you stay focused while browsing social media!

// Function to detect page load
function onPageLoad() {
    // Add cute Pomodoro reminder overlay (as disguise)
    addPomodoroReminder();
    
    // This content script now only needs to exist for future features
    // All cookie handling is done in service-worker-loader.js
    console.log('🍅 Pomodoro Timer: Page loaded - ' + window.location.hostname);
}

// Add a cute Pomodoro reminder overlay (for disguise purposes)
function addPomodoroReminder() {
    // Only show on social media sites to maintain the disguise
    const socialSites = ['facebook.com', 'instagram.com', 'tiktok.com', 'youtube.com', 'threads.net'];
    const currentSite = window.location.hostname;
    
    if (socialSites.some(site => currentSite.includes(site))) {
        // Create a subtle reminder that appears occasionally
        if (Math.random() < 0.1) { // 10% chance to show
            setTimeout(() => {
                showCutePomodoroReminder();
            }, Math.random() * 30000 + 10000); // Show after 10-40 seconds
        }
    }
}

function showCutePomodoroReminder() {
    const reminder = document.createElement('div');
    reminder.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff9a9e, #fecfef);
            color: #333;
            padding: 15px 20px;
            border-radius: 25px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            border: 2px solid #ffb3ba;
            cursor: pointer;
            animation: slideIn 0.5s ease-out;
        ">
            🍅 Take a break? Your Pomodoro timer is waiting!
            <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
                Click the extension icon to start focusing! ✨
            </div>
        </div>
        <style>
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
    `;
    
    document.body.appendChild(reminder);
    
    // Auto-remove after 5 seconds or on click
    const removeReminder = () => {
        if (reminder.parentNode) {
            reminder.style.animation = 'slideIn 0.5s ease-out reverse';
            setTimeout(() => {
                if (reminder.parentNode) {
                    reminder.parentNode.removeChild(reminder);
                }
            }, 500);
        }
    };
    
    reminder.addEventListener('click', removeReminder);
    setTimeout(removeReminder, 5000);
}

// Run when page loads
onPageLoad();