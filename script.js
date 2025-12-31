// Global state management
const AppState = {
    currentLanguage: 'ar',
    isLoading: false,
    activeContainers: new Set()
};

// DOM elements cache
const DOM = {
    floatingArabicBtn: null,
    floatingEnglishBtn: null,
    contentContainer: null,
    loadingIndicator: null,
    errorContainer: null,
    body: document.body
};

// Initialize application
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    // Cache DOM elements
    DOM.floatingArabicBtn = document.getElementById('floating-arabic-btn');
    DOM.floatingEnglishBtn = document.getElementById('floating-english-btn');
    DOM.contentContainer = document.getElementById('content-container');
    DOM.loadingIndicator = document.getElementById('loading-indicator');
    DOM.errorContainer = document.getElementById('error-container');

    setupLanguageSwitching();
    loadLanguagePreference();
    
    // Load initial content
    loadContent(AppState.currentLanguage);
}

// Language switching functionality
function setupLanguageSwitching() {
    DOM.floatingArabicBtn?.addEventListener('click', () => switchLanguage('ar'));
    DOM.floatingEnglishBtn?.addEventListener('click', () => switchLanguage('en'));
}

function switchLanguage(lang) {
    if (AppState.currentLanguage === lang) return;
    
    AppState.currentLanguage = lang;
    updateLanguageUI(lang);
    loadContent(lang);
    saveLanguagePreference(lang);
}

function updateLanguageUI(language) {
    const isArabic = language === 'ar';
    
    // Update buttons visibility
    DOM.floatingArabicBtn.style.display = isArabic ? 'none' : 'flex';
    DOM.floatingEnglishBtn.style.display = isArabic ? 'flex' : 'none';
    
    // Update document direction
    DOM.body.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', isArabic ? 'ar' : 'en');
    
    // Update title
    document.title = isArabic 
        ? 'إبرة الظهر لتسكين آلام الولادة | Epidural Analgesia for Labour Pain'
        : 'Epidural Analgesia for Labour Pain | إبرة الظهر لتسكين آلام الولادة';
}

// Content loading with proper error handling
async function loadContent(language) {
    const contentFile = language === 'ar' ? 'ar.html' : 'en.html';
    
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(contentFile);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        if (!html.trim()) {
            throw new Error('Empty content received');
        }
        
        DOM.contentContainer.innerHTML = html;
        
        // Initialize interactive components
        setTimeout(() => {
            initializeInteractiveComponents();
            showLoading(false);
        }, 50);
        
    } catch (error) {
        console.error('Error loading content:', error);
        showLoading(false);
        showError(language === 'ar' 
            ? 'حدث خطأ أثناء تحميل المحتوى. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
            : 'Error loading content. Please check your connection and try again.'
        );
    }
}

function showLoading(show) {
    AppState.isLoading = show;
    DOM.loadingIndicator.classList.toggle('active', show);
}

function showError(message) {
    DOM.errorContainer.innerHTML = `
        <h3><i class="fas fa-exclamation-triangle"></i> ${AppState.currentLanguage === 'ar' ? 'خطأ' : 'Error'}</h3>
        <p>${message}</p>
        <button onclick="loadContent(AppState.currentLanguage)" class="nav-btn" style="margin-top: 1rem;">
            <i class="fas fa-redo"></i> ${AppState.currentLanguage === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </button>
    `;
    DOM.errorContainer.classList.add('active');
}

function hideError() {
    DOM.errorContainer.classList.remove('active');
}

// Initialize all interactive components
function initializeInteractiveComponents() {
    initializeContraTabs();
    initializeAllCardNavigations();
    setupCheckOptions();
    setupKeyboardNavigation();
    setupSmoothScrolling();
}

// Contraindications tabs with improved logic
function initializeContraTabs() {
    const tabs = document.querySelectorAll('.contra-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all card containers
            const allContainers = document.querySelectorAll('.contra-cards');
            allContainers.forEach(container => {
                container.classList.remove('active');
            });
            
            // Show target container
            const targetContainer = document.getElementById(tabType);
            if (targetContainer) {
                targetContainer.classList.add('active');
                resetCards(targetContainer);
            }
        });
    });
}

// Card navigation system
function initializeAllCardNavigations() {
    const activeContainers = document.querySelectorAll('.contra-cards.active');
    activeContainers.forEach(container => {
        initializeCardNavigation(container);
    });
}

function initializeCardNavigation(container) {
    const cards = Array.from(container.querySelectorAll('.contra-card'));
    const prevBtn = container.querySelector('.nav-btn.prev-btn');
    const nextBtn = container.querySelector('.nav-btn.next-btn');
    const currentCardSpan = container.querySelector('.current-card');
    const totalCardsSpan = container.querySelector('.total-cards');
    const dots = Array.from(container.querySelectorAll('.card-dot'));
    
    if (cards.length === 0) return;
    
    // Initialize state
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Set total count
    if (totalCardsSpan) totalCardsSpan.textContent = totalCards;
    
    // Show first card only
    cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Update dots
    updateDots(dots, currentIndex);
    
    // Navigation functions
    const showCard = (index) => {
        cards[currentIndex].style.display = 'none';
        cards[index].style.display = 'block';
        currentIndex = index;
        updateNavigation();
        updateDots(dots, currentIndex);
    };
    
    const updateNavigation = () => {
        if (currentCardSpan) currentCardSpan.textContent = currentIndex + 1;
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === totalCards - 1;
    };
    
    const updateDots = (dotsArray, activeIndex) => {
        dotsArray.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    };
    
    // Event listeners
    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) showCard(currentIndex - 1);
    });
    
    nextBtn?.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) showCard(currentIndex + 1);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showCard(index));
    });
    
    // Initial state
    updateNavigation();
}

// Reset cards to first position
function resetCards(container) {
    const cards = container.querySelectorAll('.contra-card');
    const prevBtn = container.querySelector('.nav-btn.prev-btn');
    const nextBtn = container.querySelector('.nav-btn.next-btn');
    const currentCardSpan = container.querySelector('.current-card');
    const dots = container.querySelectorAll('.card-dot');
    
    cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
    });
    
    if (currentCardSpan) currentCardSpan.textContent = '1';
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = cards.length <= 1;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === 0);
    });
    
    // Reset selections
    container.querySelectorAll('.check-option').forEach(option => {
        option.classList.remove('selected-yes', 'selected-no');
    });
}

// Check options functionality
function setupCheckOptions() {
    document.querySelectorAll('.check-option').forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.parentElement;
            const allOptions = parent.querySelectorAll('.check-option');
            
            // Remove all selected classes
            allOptions.forEach(opt => {
                opt.classList.remove('selected-yes', 'selected-no');
            });
            
            // Add appropriate class
            const value = this.getAttribute('data-value');
            this.classList.add(value === 'yes' ? 'selected-yes' : 'selected-no');
            
            // Add visual feedback
            this.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(0.95)' },
                { transform: 'scale(1)' }
            ], { duration: 200 });
        });
    });
}

// Keyboard navigation support
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const activeContainer = document.querySelector('.contra-cards.active');
        if (!activeContainer) return;
        
        const prevBtn = activeContainer.querySelector('.nav-btn.prev-btn');
        const nextBtn = activeContainer.querySelector('.nav-btn.next-btn');
        
        switch(e.key) {
            case 'ArrowLeft':
                if (AppState.currentLanguage === 'ar' ? !nextBtn?.disabled : !prevBtn?.disabled) {
                    AppState.currentLanguage === 'ar' ? nextBtn?.click() : prevBtn?.click();
                }
                break;
            case 'ArrowRight':
                if (AppState.currentLanguage === 'ar' ? !prevBtn?.disabled : !nextBtn?.disabled) {
                    AppState.currentLanguage === 'ar' ? prevBtn?.click() : nextBtn?.click();
                }
                break;
            case 'Tab':
                // Let default tab behavior work
                break;
        }
    });
    
    // Add focus indicators to cards
    document.querySelectorAll('.contra-card').forEach(card => {
        card.setAttribute('tabindex', '0');
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Language preference persistence
function saveLanguagePreference(lang) {
    try {
        localStorage.setItem('epidural-language-preference', lang);
    } catch (e) {
        console.warn('Could not save language preference:', e);
    }
}

function loadLanguagePreference() {
    try {
        const saved = localStorage.getItem('epidural-language-preference');
        if (saved === 'en') {
            AppState.currentLanguage = 'en';
            updateLanguageUI('en');
        }
    } catch (e) {
        console.warn('Could not load language preference:', e);
    }
}
