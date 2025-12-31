document.addEventListener('DOMContentLoaded', () => {
    // 1. Shrinking Header
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // 2. Language Switcher
    const setLang = (lang) => {
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.getElementById('content-ar').style.display = lang === 'ar' ? 'block' : 'none';
        document.getElementById('content-en').style.display = lang === 'en' ? 'block' : 'none';
        document.getElementById('lang-btn-ar').style.display = lang === 'ar' ? 'none' : 'block';
        document.getElementById('lang-btn-en').style.display = lang === 'en' ? 'none' : 'block';
        
        // Update Static Header
        document.getElementById('header-title').innerText = lang === 'ar' ? "إبرة الظهر (الابيدورال)" : "Epidural Analgesia";
        document.getElementById('header-tagline').innerText = lang === 'ar' ? "دليل شامل، آمن، ومطمئن لتخفيف آلام الولادة" : "A comprehensive guide to safe and effective pain relief";
        
        initInteractiveElements();
    };

    document.getElementById('lang-btn-ar').onclick = () => setLang('ar');
    document.getElementById('lang-btn-en').onclick = () => setLang('en');

    // 3. Interactive Logic (Cards and Tabs)
    function initInteractiveElements() {
        // Tab switching
        document.querySelectorAll('.contra-tab').forEach(btn => {
            btn.onclick = function() {
                const parent = this.closest('.contraindications-container');
                parent.querySelectorAll('.contra-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                parent.querySelectorAll('.contra-cards').forEach(c => c.classList.remove('active'));
                document.getElementById(this.dataset.target).classList.add('active');
            }
        });

        // Next/Prev Card logic
        document.querySelectorAll('.contra-cards').forEach(group => {
            const cards = group.querySelectorAll('.contra-card');
            const nextBtn = group.querySelector('.next-btn');
            const prevBtn = group.querySelector('.prev-btn');
            const counter = group.querySelector('.current-card');
            let idx = 0;

            if(!nextBtn) return;

            const updateCards = () => {
                cards.forEach((c, i) => c.style.display = i === idx ? 'block' : 'none');
                if(counter) counter.innerText = idx + 1;
                if(prevBtn) prevBtn.disabled = idx === 0;
                if(nextBtn) nextBtn.disabled = idx === cards.length - 1;
            };

            nextBtn.onclick = () => { if(idx < cards.length - 1) { idx++; updateCards(); }};
            prevBtn.onclick = () => { if(idx > 0) { idx--; updateCards(); }};
            updateCards();
        });
    }

    setLang('ar'); // Default start
});
