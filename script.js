document.addEventListener('DOMContentLoaded', () => {
    window.onscroll = () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };

    const setLang = (lang) => {
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.getElementById('content-ar').style.display = lang === 'ar' ? 'block' : 'none';
        document.getElementById('content-en').style.display = lang === 'en' ? 'block' : 'none';
        document.getElementById('lang-btn-ar').style.display = lang === 'ar' ? 'none' : 'block';
        document.getElementById('lang-btn-en').style.display = lang === 'en' ? 'none' : 'block';
        
        document.getElementById('header-title').innerText = lang === 'ar' ? "إبرة الظهر (الابيدورال)" : "Epidural Analgesia";
        document.getElementById('header-tagline').innerText = lang === 'ar' ? "دليل شامل، آمن، ومطمئن لتخفيف آلام الولادة" : "Comprehensive guide to safe pain relief";
        
        initInteractions();
    };

    document.getElementById('lang-btn-ar').onclick = () => setLang('ar');
    document.getElementById('lang-btn-en').onclick = () => setLang('en');

    function initInteractions() {
        document.querySelectorAll('.contra-tab').forEach(btn => {
            btn.onclick = function() {
                const parent = this.closest('.contraindications-container');
                parent.querySelectorAll('.contra-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                parent.querySelectorAll('.contra-cards').forEach(c => c.classList.remove('active'));
                document.getElementById(this.dataset.target).classList.add('active');
            }
        });

        document.querySelectorAll('.contra-cards').forEach(group => {
            const cards = group.querySelectorAll('.contra-card');
            const next = group.querySelector('.next-btn');
            const prev = group.querySelector('.prev-btn');
            const count = group.querySelector('.current-card');
            let idx = 0;
            const update = () => {
                cards.forEach((c, i) => c.style.display = i === idx ? 'block' : 'none');
                if(count) count.textContent = idx + 1;
                if(next) next.disabled = idx === cards.length - 1;
                if(prev) prev.disabled = idx === 0;
            };
            if(next) next.onclick = () => { idx++; update(); };
            if(prev) prev.onclick = () => { idx--; update(); };
            update();
        });
    }
    setLang('ar');
});
