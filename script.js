document.addEventListener('DOMContentLoaded', () => {
    
    // 1. BANNER SHRINKING
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. LANGUAGE SWITCHING
    const setLanguage = (lang) => {
        const arContent = document.getElementById('content-ar');
        const enContent = document.getElementById('content-en');
        const arBtn = document.getElementById('lang-btn-ar');
        const enBtn = document.getElementById('lang-btn-en');
        const hTitle = document.getElementById('header-title');
        const hTag = document.getElementById('header-tagline');

        if(lang === 'ar') {
            document.body.dir = 'rtl';
            arContent.style.display = 'block';
            enContent.style.display = 'none';
            arBtn.style.display = 'none';
            enBtn.style.display = 'block';
            hTitle.innerText = "إبرة الظهر (الابيدورال)";
            hTag.innerText = "دليل شامل، آمن، ومطمئن لتخفيف آلام الولادة";
        } else {
            document.body.dir = 'ltr';
            arContent.style.display = 'none';
            enContent.style.display = 'block';
            arBtn.style.display = 'block';
            enBtn.style.display = 'none';
            hTitle.innerText = "Epidural Analgesia";
            hTag.innerText = "Safe, effective, and reassuring pain relief";
        }
        
        // RE-INITIALIZE INTERACTIVE PARTS FOR NEW LANGUAGE
        initInteractions();
    };

    document.getElementById('lang-btn-ar').onclick = () => setLanguage('ar');
    document.getElementById('lang-btn-en').onclick = () => setLanguage('en');

    // 3. TABS, CARDS & YES/NO LOGIC
    function initInteractions() {
        // Tab switching
        document.querySelectorAll('.contra-tab').forEach(tab => {
            tab.onclick = function() {
                const parent = this.closest('.contraindications-container');
                parent.querySelectorAll('.contra-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = this.getAttribute('data-target');
                parent.querySelectorAll('.contra-cards').forEach(c => c.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
            };
        });

        // Yes/No Selection
        document.querySelectorAll('.check-option').forEach(opt => {
            opt.onclick = function() {
                const parent = this.parentElement;
                parent.querySelectorAll('.check-option').forEach(o => {
                    o.classList.remove('selected-yes', 'selected-no');
                });
                const val = this.getAttribute('data-value');
                this.classList.add(val === 'yes' ? 'selected-yes' : 'selected-no');
            };
        });

        // Navigation (Next/Prev)
        document.querySelectorAll('.contra-cards').forEach(cardGroup => {
            const cards = cardGroup.querySelectorAll('.contra-card');
            const nextBtn = cardGroup.querySelector('.next-btn');
            const prevBtn = cardGroup.querySelector('.prev-btn');
            const counter = cardGroup.querySelector('.current-card');
            let currentIndex = 0;

            if(!nextBtn) return; // Skip if relative tab (no nav)

            const update = () => {
                cards.forEach((c, i) => c.style.display = i === currentIndex ? 'block' : 'none');
                if(counter) counter.innerText = currentIndex + 1;
                if(prevBtn) prevBtn.disabled = currentIndex === 0;
                if(nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;
            };

            nextBtn.onclick = () => { if(currentIndex < cards.length - 1) { currentIndex++; update(); }};
            prevBtn.onclick = () => { if(currentIndex > 0) { currentIndex--; update(); }};
            update();
        });
    }

    // Default start
    setLanguage('ar');
});
