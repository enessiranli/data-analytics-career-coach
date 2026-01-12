// Kariyer koçluğu uygulaması - Bekir için özel
document.addEventListener('DOMContentLoaded', function() {
    // Uygulama durumu
    const state = {
        currentDay: 1,
        streak: 0,
        completedDays: new Set(),
        lastCompletedDate: null,
        curriculum: generateCurriculum()
    };

    // DOM Elementleri
    const streakCountEl = document.getElementById('streakCount');
    const completedDaysEl = document.getElementById('completedDays');
    const currentWeekEl = document.getElementById('currentWeek');
    const weekIndicatorEl = document.getElementById('weekIndicator');
    const dayTitleEl = document.getElementById('dayTitle');
    const theoryContentEl = document.getElementById('theoryContent');
    const taskContentEl = document.getElementById('taskContent');
    const completeTaskBtn = document.getElementById('completeTaskBtn');
    const currentDayContainer = document.getElementById('currentDayContainer');
    
    // Hafta listeleri
    const week1List = document.getElementById('week1List');
    const week2List = document.getElementById('week2List');
    const week3List = document.getElementById('week3List');
    const week4List = document.getElementById('week4List');
    
    // Hafta butonları
    const curriculumBtns = document.querySelectorAll('.curriculum-btn');
    const weekContents = document.querySelectorAll('.week-content');

    // Sayfa yüklendiğinde durumu geri yükle
    loadState();
    
    // İlk günü göster
    showDay(state.currentDay);
    
    // Hafta listelerini oluştur
    renderWeekLists();
    
    // Tamamlama butonu event listener
    completeTaskBtn.addEventListener('click', completeDay);
    
    // Hafta butonları event listener
    curriculumBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const week = this.getAttribute('data-week');
            showWeek(week);
        });
    });

    // Günü tamamlama fonksiyonu
    function completeDay() {
        if (state.completedDays.has(state.currentDay)) {
            alert('Bu günü zaten tamamladınız!');
            return;
        }
        
        state.completedDays.add(state.currentDay);
        updateStreak();
        saveState();
        
        // Butonu devre dışı bırak
        completeTaskBtn.disabled = true;
        completeTaskBtn.innerHTML = '<i class="fas fa-check-circle"></i> Tamamlandı!';
        
        // Tamamlanan günü vurgula
        highlightCompletedDay(state.currentDay);
        
        // Motivasyon mesajı göster
        showMotivationMessage();
        
        // Ertesi günü planla (otomatik geçiş yapmıyoruz, kullanıcı manuel geçsin)
        // state.currentDay++;
        // if (state.currentDay <= 168) {
        //     setTimeout(() => {
        //         showDay(state.currentDay);
        //         completeTaskBtn.disabled = false;
        //         completeTaskBtn.innerHTML = '<i class="fas fa-check-circle"></i> Görevi Tamamla';
        //     }, 2000);
        // }
    }

    // Streak güncelleme
    function updateStreak() {
        const today = new Date().toDateString();
        
        // Eğer bugün tamamlandıysa veya daha önce bugün tamamlanmışsa
        if (state.lastCompletedDate === today) {
            return; // Zaten bugün sayılmış
        }
        
        // Eğer dün tamamlanmışsa streak'i artır
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (state.lastCompletedDate === yesterday.toDateString() || state.lastCompletedDate === null) {
            state.streak++;
        } else {
            // Streak kırıldı, 1'den başlat
            state.streak = 1;
        }
        
        state.lastCompletedDate = today;
        streakCountEl.textContent = state.streak;
        completedDaysEl.textContent = `${state.completedDays.size}/168`;
    }

    // Belirli bir günü gösterme
    function showDay(dayNumber) {
        const day = state.curriculum[dayNumber - 1];
        if (!day) return;
        
        dayTitleEl.textContent = `Gün ${dayNumber}: ${day.title}`;
        
        // Hafta bilgisini güncelle
        const weekNumber = Math.ceil(dayNumber / 7);
        currentWeekEl.textContent = `${weekNumber}/24`;
        weekIndicatorEl.textContent = `${weekNumber}. Hafta: ${getWeekTheme(weekNumber)}`;
        
        theoryContentEl.innerHTML = day.theory;
        taskContentEl.innerHTML = day.task;
        
        // Günün tamamlanıp tamamlanmadığını kontrol et
        if (state.completedDays.has(dayNumber)) {
            completeTaskBtn.disabled = true;
            completeTaskBtn.innerHTML = '<i class="fas fa-check-circle"></i> Tamamlandı!';
        } else {
            completeTaskBtn.disabled = false;
            completeTaskBtn.innerHTML = '<i class="fas fa-check-circle"></i> Görevi Tamamla';
        }
        
        // Mevcut günü güncelle
        state.currentDay = dayNumber;
        saveState();
    }

    // Hafta listelerini render etme
    function renderWeekLists() {
        // 1-6. hafta (1-42. günler)
        for (let i = 1; i <= 42; i++) {
            const day = state.curriculum[i-1];
            const li = createDayListItem(i, day.title);
            week1List.appendChild(li);
            
            // Tıklanabilir yap
            li.addEventListener('click', () => {
                showDay(i);
                currentDayContainer.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // 7-12. hafta (43-84. günler)
        for (let i = 43; i <= 84; i++) {
            const day = state.curriculum[i-1];
            const li = createDayListItem(i, day.title);
            week2List.appendChild(li);
            
            li.addEventListener('click', () => {
                showDay(i);
                currentDayContainer.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // 13-18. hafta (85-126. günler)
        for (let i = 85; i <= 126; i++) {
            const day = state.curriculum[i-1];
            const li = createDayListItem(i, day.title);
            week3List.appendChild(li);
            
            li.addEventListener('click', () => {
                showDay(i);
                currentDayContainer.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // 19-24. hafta (127-168. günler)
        for (let i = 127; i <= 168; i++) {
            const day = state.curriculum[i-1];
            const li = createDayListItem(i, day.title);
            week4List.appendChild(li);
            
            li.addEventListener('click', () => {
                showDay(i);
                currentDayContainer.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Tamamlanan günleri vurgula
        state.completedDays.forEach(day => {
            highlightCompletedDay(day);
        });
    }

    // Gün listesi öğesi oluşturma
    function createDayListItem(dayNumber, title) {
        const li = document.createElement('li');
        li.className = 'day-item';
        li.id = `day-${dayNumber}`;
        li.innerHTML = `<strong>Gün ${dayNumber}:</strong> ${title}`;
        return li;
    }

    // Tamamlanan günü vurgulama
    function highlightCompletedDay(dayNumber) {
        const dayItem = document.getElementById(`day-${dayNumber}`);
        if (dayItem) {
            dayItem.classList.add('completed');
        }
    }

    // Hafta gösterimi
    function showWeek(week) {
        // Butonları güncelle
        curriculumBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-week') === week) {
                btn.classList.add('active');
            }
        });
        
        // İçerikleri güncelle
        weekContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === getWeekContentId(week)) {
                content.classList.add('active');
            }
        });
    }

    // Hafta içerik ID'si alma
    function getWeekContentId(week) {
        switch(week) {
            case '1': return 'week1-6';
            case '7': return 'week7-12';
            case '13': return 'week13-18';
            case '19': return 'week19-24';
            default: return 'week1-6';
        }
    }

    // Hafta temasını alma
    function getWeekTheme(weekNumber) {
        if (weekNumber <= 6) return 'SQL & ETL';
        if (weekNumber <= 12) return 'Power BI & DAX';
        if (weekNumber <= 18) return 'Python & Otomasyon';
        return 'End-to-End Proje';
    }

    // Motivasyon mesajı gösterme
    function showMotivationMessage() {
        const messages = [
            "Harika iş çıkardın! Python'da pes etmeyeceğine söz vermiştin, şimdi bu sözü tutma zamanı.",
            "Kodun mantığını anlamak için adım adım ilerliyorsun. Bu seni diğerlerinden ayıracak.",
            "Her tamamlanan gün, Senior Data Analyst olma yolunda bir adım daha atıyorsun.",
            "ETL ve Stored Procedure uzmanı olma hedefine yaklaşıyorsun. Sakın pes etme!",
            "Bugün öğrendiklerin yarının projelerinin temelini oluşturacak. Devam et!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Geçici bir bildirim göster
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(to right, #4ade80, #22c55e);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 400px;
            animation: slideIn 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-trophy" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Tebrikler!</strong>
                    <p style="margin: 5px 0 0 0;">${randomMessage}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 5 saniye sonra kaldır
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }

    // Durumu kaydetme (LocalStorage)
    function saveState() {
        const stateToSave = {
            currentDay: state.currentDay,
            streak: state.streak,
            completedDays: Array.from(state.completedDays),
            lastCompletedDate: state.lastCompletedDate
        };
        
        localStorage.setItem('dataAnalyticsCoach', JSON.stringify(stateToSave));
    }

    // Durumu yükleme (LocalStorage)
    function loadState() {
        const savedState = localStorage.getItem('dataAnalyticsCoach');
        
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            state.currentDay = parsedState.currentDay || 1;
            state.streak = parsedState.streak || 0;
            state.completedDays = new Set(parsedState.completedDays || []);
            state.lastCompletedDate = parsedState.lastCompletedDate || null;
            
            streakCountEl.textContent = state.streak;
            completedDaysEl.textContent = `${state.completedDays.size}/168`;
        }
    }

    // Müfredat verisi oluşturma
    function generateCurriculum() {
        const curriculum = [];
        
        // 1-6. Hafta: SQL & ETL
        for (let i = 1; i <= 42; i++) {
            let dayData;
            
            if (i <= 7) {
                // 1. Hafta: Window Functions
                dayData = {
                    title: "SQL Window Functions",
                    theory: "Window Functions, SQL'de satır grupları üzerinde hesaplama yaparken her satırı ayrı ayrı işleme olanağı sağlar. OVER() clause ile birlikte kullanılır.",
                    task: `<p><strong>Pratik Ödev:</strong> Azure Synapse'de veya herhangi bir SQL ortamında aşağıdaki işlemleri yapın:</p>
                    <ol>
                        <li>ROW_NUMBER() kullanarak bir müşteri tablosundaki kayıtları sıralayın</li>
                        <li>RANK() ve DENSE_RANK() fonksiyonlarının farkını gösteren bir örnek oluşturun</li>
                        <li>LEAD() ve LAG() fonksiyonları ile bir zaman serisindeki önceki ve sonraki değerleri getirin</li>
                        <li>SUM() OVER(PARTITION BY ...) ile kategoriler bazında toplam hesaplayın</li>
                    </ol>`
                };
            } else if (i <= 14) {
                // 2. Hafta: CTE
                dayData = {
                    title: "Common Table Expressions (CTE)",
                    theory: "CTE'ler, karmaşık sorguları daha okunabilir parçalara ayırmak için kullanılır. WITH anahtar kelimesi ile tanımlanır ve geçici bir sonuç kümesi oluşturur.",
                    task: `<p><strong>Pratik Ödev:</strong> Aşağıdaki senaryo için CTE kullanın:</p>
                    <ol>
                        <li>İç içe 3 CTE oluşturarak veri hazırlığı yapın</li>
                        <li>Recursive CTE kullanarak hiyerarşik bir yapı oluşturun</li>
                        <li>CTE'ler ile bir raporlama sorgusu hazırlayın</li>
                        <li>Aynı sorguyu subquery ile yazıp CTE ile karşılaştırın</li>
                    </ol>`
                };
            } else if (i <= 21) {
                // 3. Hafta: Stored Procedures
                dayData = {
                    title: "Stored Procedures",
                    theory: "Stored Procedures, veritabanında saklanan önceden derlenmiş SQL kod bloklarıdır. Performans avantajı sağlar ve kod tekrarını önler.",
                    task: `<p><strong>Pratik Ödev:</strong> Azure Synapse'de Stored Procedure geliştirin:</p>
                    <ol>
                        <li>Parametre alan bir stored procedure yazın</li>
                        <li>TRY-CATCH blokları ile hata yönetimi ekleyin</li>
                        <li>Tablodan veri okuyup işleyen bir SP oluşturun</li>
                        <li>Transaction yönetimi içeren bir SP yazın</li>
                    </ol>`
                };
            } else if (i <= 28) {
                // 4. Hafta: Synapse Pipelines
                dayData = {
                    title: "Azure Synapse Pipelines",
                    theory: "Azure Synapse Pipelines, veri entegrasyonu ve ETL/ELT işlemleri için kullanılan görsel bir araçtır. Veri akışları oluşturmanıza ve zamanlamanıza olanak tanır.",
                    task: `<p><strong>Pratik Ödev:</strong> Azure Synapse'de Pipeline oluşturun:</p>
                    <ol>
                        <li>Blob Storage'dan veri okuyan basit bir pipeline oluşturun</li>
                        <li>Veri dönüşümü (transform) adımı ekleyin</li>
                        <li>Farklı kaynaklardan veri alıp birleştiren pipeline yapın</li>
                        <li>Pipeline'ı tetikleyecek bir schedule olu
