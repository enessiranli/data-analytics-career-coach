// Data Analyst Roadmap 2026 - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    initApp();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check for daily reminder
    checkDailyReminder();
});

function initApp() {
    // Load or initialize state
    window.appState = loadState() || {
        currentDay: 1,
        streak: 0,
        completedDays: new Set(),
        lastCompletedDate: null,
        notifications: false,
        curriculum: generateEnhancedCurriculum()
    };
    
    // Update UI with initial state
    updateProgressUI();
    showDay(appState.currentDay);
    renderRoadmap();
    setupNotificationToggle();
}

function setupEventListeners() {
    // Complete task button
    document.getElementById('completeTaskBtn').addEventListener('click', completeDay);
    
    // Roadmap navigation buttons
    document.querySelectorAll('.roadmap-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const week = this.getAttribute('data-week');
            showWeekContent(week);
            setActiveRoadmapButton(this);
        });
    });
    
    // Notification toggle
    document.getElementById('notificationToggle').addEventListener('change', function() {
        appState.notifications = this.checked;
        saveState();
        
        if (this.checked) {
            requestNotificationPermission();
            showNotification('Bildirimler aktif! Her gün saat 20:00\'de görevleriniz hatırlatılacak.');
        }
    });
    
    // Day cards click events (delegated)
    document.querySelectorAll('.week-grid').forEach(grid => {
        grid.addEventListener('click', function(e) {
            const dayCard = e.target.closest('.day-card');
            if (dayCard && dayCard.dataset.day) {
                const dayNumber = parseInt(dayCard.dataset.day);
                showDay(dayNumber);
                document.getElementById('currentDayContainer').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function generateEnhancedCurriculum() {
    // Enhanced curriculum with LinkedIn influencers
    const curriculum = [];
    const influencers = {
        sql: [
            { name: 'Alex The Analyst', url: 'https://www.youtube.com/@AlexTheAnalyst' },
            { name: 'Luke Barousse', url: 'https://www.youtube.com/@LukeBarousse' },
            { name: 'SQLBI', url: 'https://www.youtube.com/@SQLBI' },
            { name: 'Stephanie Glen', url: 'https://www.youtube.com/@statisticsfun' }
        ],
        powerbi: [
            { name: 'Guy in a Cube', url: 'https://www.youtube.com/@GuyinaCube' },
            { name: 'Curbal', url: 'https://www.youtube.com/@Curbal' },
            { name: 'How to Power BI', url: 'https://www.youtube.com/@HowtoPowerBI' }
        ],
        python: [
            { name: 'Keith Galli', url: 'https://www.youtube.com/@KeithGalli' },
            { name: 'Corey Schafer', url: 'https://www.youtube.com/@CoreyMSchafer' },
            { name: 'Data School', url: 'https://www.youtube.com/@DataSchool' },
            { name: 'Ken Jee', url: 'https://www.youtube.com/@KenJee' }
        ],
        project: [
            { name: 'Data with Danny', url: 'https://www.youtube.com/@DataWithDanny' },
            { name: 'Seattle Data Guy', url: 'https://www.youtube.com/@SeattleDataGuy' }
        ]
    };
    
    // Week 1-6: SQL & ETL
    for (let day = 1; day <= 42; day++) {
        curriculum.push(createDayData(day, 'SQL & ETL', influencers.sql));
    }
    
    // Week 7-12: Power BI & DAX
    for (let day = 43; day <= 84; day++) {
        curriculum.push(createDayData(day, 'Power BI & DAX', influencers.powerbi));
    }
    
    // Week 13-18: Python & Automation
    for (let day = 85; day <= 126; day++) {
        curriculum.push(createDayData(day, 'Python & Automation', influencers.python));
    }
    
    // Week 19-24: End-to-End Project
    for (let day = 127; day <= 168; day++) {
        curriculum.push(createDayData(day, 'End-to-End Project', influencers.project));
    }
    
    return curriculum;
}

function createDayData(dayNumber, category, influencers) {
    const weekNumber = Math.ceil(dayNumber / 7);
    const dayInWeek = dayNumber % 7 || 7;
    
    // Select random influencer for this day
    const influencer = influencers[Math.floor(Math.random() * influencers.length)];
    
    // Day-specific content
    let title, theory, task;
    
    if (category === 'SQL & ETL') {
        const topics = [
            'Window Functions', 'CTE (Common Table Expressions)', 'Stored Procedures',
            'Azure Synapse Pipelines', 'Indexing Strategies', 'Query Optimization',
            'Data Modeling', 'ETL Best Practices', 'Data Quality Checks'
        ];
        title = topics[(dayNumber - 1) % topics.length];
        theory = getSQLTheory(title);
        task = getSQLTask(title);
    }
    // ... similar for other categories
    
    return {
        day: dayNumber,
        title: title,
        theory: theory + `<br><br><strong>Önerilen Kaynak:</strong> <a href="${influencer.url}" target="_blank">${influencer.name}</a>`,
        task: task,
        videos: getRecommendedVideos(title, category),
        category: category,
        week: weekNumber,
        dayInWeek: dayInWeek
    };
}

function showDay(dayNumber) {
    const day = appState.curriculum[dayNumber - 1];
    if (!day) return;
    
    // Update UI
    document.getElementById('dayTitle').textContent = `🎯 Gün ${dayNumber}: ${day.title}`;
    document.getElementById('weekIndicator').textContent = `${day.week}. Hafta: ${getWeekTheme(day.week)}`;
    document.getElementById('theoryContent').innerHTML = day.theory;
    document.getElementById('taskContent').innerHTML = day.task;
    document.getElementById('currentWeek').textContent = `${day.week}/24`;
    
    // Update videos section
    updateVideosSection(day.videos);
    
    // Update complete button
    const completeBtn = document.getElementById('completeTaskBtn');
    if (appState.completedDays.has(dayNumber)) {
        completeBtn.disabled = true;
        completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Tamamlandı!';
    } else {
        completeBtn.disabled = false;
        completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Görevi Tamamla';
    }
    
    // Update current day
    appState.currentDay = dayNumber;
    saveState();
}

function completeDay() {
    const dayNumber = appState.currentDay;
    
    if (appState.completedDays.has(dayNumber)) {
        showNotification('Bu günü zaten tamamladınız!', 'info');
        return;
    }
    
    // Add to completed days
    appState.completedDays.add(dayNumber);
    
    // Update streak
    updateStreak();
    
    // Save state
    saveState();
    
    // Update UI
    updateProgressUI();
    
    // Disable button
    const completeBtn = document.getElementById('completeTaskBtn');
    completeBtn.disabled = true;
    completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Tamamlandı!';
    
    // Highlight in roadmap
    highlightCompletedDay(dayNumber);
    
    // Show celebration
    showCelebration(dayNumber);
    
    // Schedule next day reminder if notifications are enabled
    if (appState.notifications) {
        scheduleNextDayReminder();
    }
}

function updateStreak() {
    const today = new Date().toDateString();
    
    if (appState.lastCompletedDate === today) {
        return; // Already counted today
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (appState.lastCompletedDate === yesterday.toDateString() || appState.lastCompletedDate === null) {
        appState.streak++;
    } else {
        appState.streak = 1; // Streak broken
    }
    
    appState.lastCompletedDate = today;
}

function updateProgressUI() {
    document.getElementById('streakCount').textContent = appState.streak;
    document.getElementById('completedDays').textContent = `${appState.completedDays.size}/168`;
}

function renderRoadmap() {
    // Clear existing content
    ['week1List', 'week2List', 'week3List', 'week4List'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });
    
    // Render all days
    appState.curriculum.forEach(day => {
        const weekListId = getWeekListId(day.week);
        const weekList = document.getElementById(weekListId);
        
        if (weekList) {
            const dayCard = createDayCard(day);
            weekList.appendChild(dayCard);
        }
    });
    
    // Highlight completed days
    appState.completedDays.forEach(day => {
        highlightCompletedDay(day);
    });
}

function createDayCard(day) {
    const card = document.createElement('div');
    card.className = 'day-card';
    card.dataset.day = day.day;
    card.id = `day-${day.day}`;
    
    const isCompleted = appState.completedDays.has(day.day);
    if (isCompleted) {
        card.classList.add('completed');
    }
    
    card.innerHTML = `
        <h4>Gün ${day.day}: ${day.title}</h4>
        <p>${day.category} • Hafta ${day.week}</p>
        <div class="day-meta">
            <span>${isCompleted ? '✅ Tamamlandı' : '⏳ Bekliyor'}</span>
            <span>Gün ${day.dayInWeek}/7</span>
        </div>
    `;
    
    return card;
}

function highlightCompletedDay(dayNumber) {
    const dayCard = document.getElementById(`day-${dayNumber}`);
    if (dayCard) {
        dayCard.classList.add('completed');
    }
}

function showWeekContent(week) {
    // Hide all content
    document.querySelectorAll('.roadmap-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected content
    const contentId = getWeekContentId(week);
    document.getElementById(contentId).classList.add('active');
}

function setActiveRoadmapButton(activeButton) {
    document.querySelectorAll('.roadmap-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Local Storage Functions
function saveState() {
    const stateToSave = {
        currentDay: appState.currentDay,
        streak: appState.streak,
        completedDays: Array.from(appState.completedDays),
        lastCompletedDate: appState.lastCompletedDate,
        notifications: appState.notifications,
        // Don't save curriculum as it's generated
    };
    
    localStorage.setItem('dataAnalystRoadmap', JSON.stringify(stateToSave));
}

function loadState() {
    const saved = localStorage.getItem('dataAnalystRoadmap');
    return saved ? JSON.parse(saved) : null;
}

// Notification Functions
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ade80' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function checkDailyReminder() {
    if (appState.notifications) {
        const now = new Date();
        if (now.getHours() === 20 && now.getMinutes() === 0) {
            showNotification('🎯 Bugünün görevi sizi bekliyor! Hemen başlayın.');
        }
    }
}

function scheduleNextDayReminder() {
    // Schedule notification for next day at 20:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    
    const timeUntilTomorrow = tomorrow.getTime() - Date.now();
    
    setTimeout(() => {
        if (appState.notifications) {
            showNotification('🎯 Yeni günün görevi hazır! Hemen başlayın.');
        }
    }, timeUntilTomorrow);
}

// Helper Functions
function getWeekTheme(weekNumber) {
    if (weekNumber <= 6) return 'SQL & ETL Foundation';
    if (weekNumber <= 12) return 'Power BI & DAX Mastery';
    if (weekNumber <= 18) return 'Python & Automation';
    return 'End-to-End Azure Project';
}

function getWeekContentId(week) {
    const map = { '1': 'week1-6', '7': 'week7-12', '13': 'week13-18', '19': 'week19-24' };
    return map[week] || 'week1-6';
}

function getWeekListId(week) {
    if (week <= 6) return 'week1List';
    if (week <= 12) return 'week2List';
    if (week <= 18) return 'week3List';
    return 'week4List';
}

function showCelebration(dayNumber) {
    const messages = [
        `Harika! Gün ${dayNumber} tamamlandı. 🎉`,
        "Bir adım daha Senior Data Analyst'e yaklaştınız!",
        "Kod mantığını anlamak için mükemmel bir ilerleme.",
        "Pes etmemek için söz verdiniz ve tutuyorsunuz!",
        "Her tamamlanan gün portfolyonuzu güçlendiriyor."
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMessage);
}

// UI Helper Functions
function setupNotificationToggle() {
    const toggle = document.getElementById('notificationToggle');
    if (toggle) {
        toggle.checked = appState.notifications || false;
    }
}

function updateVideosSection(videos) {
    const videoGrid = document.querySelector('.video-grid');
    if (videoGrid && videos) {
        videoGrid.innerHTML = videos.map(video => `
            <a href="${video.url}" target="_blank" class="video-card">
                <div class="video-thumbnail" style="background-color: ${video.color || '#FF0000'}">
                    <i class="fab fa-youtube"></i>
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p>${video.creator}</p>
                    <span class="video-duration">${video.duration}</span>
                </div>
            </a>
        `).join('');
    }
}

// Social Sharing Functions
function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link kopyalandı! LinkedIn postunda kullanabilirsiniz.', 'info');
    });
}

// Modal Functions
function showFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function submitFeedback() {
    const feedback = document.getElementById('feedbackText').value;
    if (feedback.trim()) {
        // In a real app, you would send this to a server
        showNotification('Geri bildiriminiz için teşekkürler!', 'success');
        document.getElementById('feedbackText').value = '';
        closeModal('feedbackModal');
    }
}

function subscribeNewsletter() {
    showNotification('Bülten aboneliği yakında aktif olacak!', 'info');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .notification.success { background: #4ade80; }
    .notification.info { background: #3b82f6; }
    .notification.warning { background: #f59e0b; }
    
    .pulse {
        animation: pulse 0.5s ease;
    }
`;
document.head.appendChild(style);

// Initialize service worker for notifications (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
}
