document.addEventListener('DOMContentLoaded', () => {
    const appState = {
        lang: localStorage.getItem('epidural_lang') || 'ar',
        isLoading: false
    };

    const dom = {
        container: document.getElementById('content-container'),
        arBtn: document.getElementById('floating-arabic-btn'),
        enBtn: document.getElementById('floating-english-btn'),
        loader: document.getElementById('loading-indicator')
    };

    // --- Core Functions ---

    async function loadContent(lang) {
        appState.isLoading = true;
        updateUI(lang);
        dom.loader.classList.add('active');
        
        try {
            const response = await fetch(`${lang}.html`);
            if (!response.ok) throw new Error('Network error');
            const html = await response.text();
            
            dom.container.innerHTML = html;
            
            // Wait for DOM update then initialize
            requestAnimationFrame(() => {
                initInteractiveFeatures();
                dom.loader.classList.remove('active');
                appState.isLoading = false;
            });

        } catch (error) {
            console.error(error);
            dom.container.innerHTML = `<div class="error-container active">Error loading content / خطأ في التحميل</div>`;
        }
    }

    function updateUI(lang) {
        document.documentElement.lang = lang;
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Toggle Buttons
        if (lang === 'ar') {
            dom.arBtn.style.display = 'none';
            dom.enBtn.style.display = 'flex';
            document.title = "إبرة الظهر لتسكين آلام الولادة";
        } else {
            dom.arBtn.style.display = 'flex';
            dom.enBtn.style.display = 'none';
            document.title = "Epidural Analgesia for Labour Pain";
        }
        
        localStorage.setItem('epidural_lang', lang);
        appState.lang = lang;
    }

    function switchLanguage(newLang) {
        if (appState.isLoading || appState.lang === newLang) return;
        loadContent(newLang);
    }

    // --- Interactive Features (Re-run on every load) ---

    function initInteractiveFeatures() {
        initTabs();
        initCardNavigation();
        initCheckboxes();
    }

    function initTabs() {
        const tabs = document.querySelectorAll('.contra-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add to clicked
                e.target.classList.add('active');

                // Hide all sections
                document.querySelectorAll('.contra-cards').forEach(c => c.classList.remove('active'));
                
                // Show target section
                const targetId = e.target.dataset.tab;
                const targetSection = document.getElementById(targetId);
                if(targetSection) {
                    targetSection.classList.add('active');
                    resetCardView(targetSection);
                }
            });
        });
    }

    function initCardNavigation() {
        document.querySelectorAll('.contra-cards').forEach(container => {
            const cards = container.querySelectorAll('.contra-card');
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');
            const counter = container.querySelector('.current-card');
            const total = container.querySelector('.total-cards');

            if (!cards.length) return;

            let currentIndex = 0;
            if(total) total.textContent = cards.length;

            // Helper to update view
            const updateView = () => {
                cards.forEach((card, index) => {
                    card.style.display = index === currentIndex ? 'block' : 'none';
                });
                
                if(counter) counter.textContent = currentIndex + 1;
                
                if(prevBtn) prevBtn.disabled = currentIndex === 0;
                if(nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;
            };

            // Event Listeners
            if(prevBtn) {
                prevBtn.onclick = () => {
                    if(currentIndex > 0) {
                        currentIndex--;
                        updateView();
                    }
                };
            }

            if(nextBtn) {
                nextBtn.onclick = () => {
                    if(currentIndex < cards.length - 1) {
                        currentIndex++;
                        updateView();
                    }
                };
            }

            // Initial run
            updateView();
        });
    }

    function resetCardView(container) {
        const cards = container.querySelectorAll('.contra-card');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const counter = container.querySelector('.current-card');

        cards.forEach((card, i) => card.style.display = i === 0 ? 'block' : 'none');
        if(counter) counter.textContent = '1';
        if(prevBtn) prevBtn.disabled = true;
        if(nextBtn) nextBtn.disabled = cards.length <= 1;
    }

    function initCheckboxes() {
        document.querySelectorAll('.check-option').forEach(opt => {
            opt.addEventListener('click', function() {
                const parent = this.closest('.check-options');
                parent.querySelectorAll('.check-option').forEach(o => {
                    o.classList.remove('selected-yes', 'selected-no');
                });
                
                const val = this.dataset.value;
                this.classList.add(val === 'yes' ? 'selected-yes' : 'selected-no');
            });
        });
    }

    // --- Initialization ---
    
    dom.arBtn.addEventListener('click', () => switchLanguage('ar'));
    dom.enBtn.addEventListener('click', () => switchLanguage('en'));

    // Start App
    loadContent(appState.lang);
});
