class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentTime = 25 * 60; // 25 minutes in seconds
        this.focusTime = 25;
        this.breakTime = 5;
        this.isBreak = false;
        this.sessions = 0;
        this.interval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadStats();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.timerLabelEl = document.getElementById('timer-label');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.focusTimeSelect = document.getElementById('focus-time');
        this.breakTimeSelect = document.getElementById('break-time');
        this.sessionsCountEl = document.getElementById('sessions-count');
        this.tomatoEl = document.querySelector('.tomato');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.focusTimeSelect.addEventListener('change', (e) => {
            this.focusTime = parseInt(e.target.value);
            if (!this.isBreak && !this.isRunning) {
                this.currentTime = this.focusTime * 60;
                this.updateDisplay();
            }
        });
        
        this.breakTimeSelect.addEventListener('change', (e) => {
            this.breakTime = parseInt(e.target.value);
            if (this.isBreak && !this.isRunning) {
                this.currentTime = this.breakTime * 60;
                this.updateDisplay();
            }
        });
    }
    
    start() {
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        this.interval = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            
            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
        
        this.startBtn.textContent = '⏳ Running...';
        this.tomatoEl.style.animation = 'bounce 1s infinite';
    }
    
    pause() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.interval);
        this.startBtn.textContent = '▶️ Resume';
        this.tomatoEl.style.animation = 'bounce 2s infinite';
    }
    
    reset() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.interval);
        
        if (this.isBreak) {
            this.currentTime = this.breakTime * 60;
        } else {
            this.currentTime = this.focusTime * 60;
        }
        
        this.updateDisplay();
        this.startBtn.textContent = '▶️ Start';
        this.tomatoEl.style.animation = 'bounce 2s infinite';
    }
    
    completeSession() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.interval);
        
        if (!this.isBreak) {
            // Focus session completed
            this.sessions++;
            this.saveStats();
            this.updateStats();
            this.isBreak = true;
            this.currentTime = this.breakTime * 60;
            this.timerLabelEl.textContent = 'Break Time';
            this.tomatoEl.textContent = '☕';
            this.showNotification('Focus session completed! Time for a break! ☕');
        } else {
            // Break completed
            this.isBreak = false;
            this.currentTime = this.focusTime * 60;
            this.timerLabelEl.textContent = 'Focus Time';
            this.tomatoEl.textContent = '🍅';
            this.showNotification('Break is over! Ready to focus! 🍅');
        }
        
        this.updateDisplay();
        this.startBtn.textContent = '▶️ Start';
        this.tomatoEl.style.animation = 'bounce 2s infinite';
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        
        this.minutesEl.textContent = minutes.toString().padStart(2, '0');
        this.secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    showNotification(message) {
        // Create a cute notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff9a9e, #fecfef);
            color: #333;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: 500;
            text-align: center;
            border: 2px solid #ffb3ba;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    loadStats() {
        const today = new Date().toDateString();
        const savedStats = localStorage.getItem('pomodoroStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            if (stats.date === today) {
                this.sessions = stats.sessions;
            }
        }
        this.updateStats();
    }
    
    saveStats() {
        const today = new Date().toDateString();
        const stats = {
            date: today,
            sessions: this.sessions
        };
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }
    
    updateStats() {
        this.sessionsCountEl.textContent = this.sessions.toString();
    }
}

// Initialize the timer when popup opens
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

// Add some cute easter eggs
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tomato')) {
        const emojis = ['🍅', '🥰', '😊', '💪', '⭐', '🎉'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        e.target.textContent = randomEmoji;
        setTimeout(() => {
            if (!document.querySelector('.timer-container').dataset.isBreak) {
                e.target.textContent = '🍅';
            } else {
                e.target.textContent = '☕';
            }
        }, 1000);
    }
});