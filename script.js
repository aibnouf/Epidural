// Global variables
let currentLanguage = 'ar';

// DOM elements
const floatingArabicBtn = document.getElementById('floating-arabic-btn');
const floatingEnglishBtn = document.getElementById('floating-english-btn');
const body = document.body;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Apply theme colors immediately
    applyThemeColors();
    
    // Set up language switching
    setupLanguageSwitching();
});

// Apply theme colors to elements
function applyThemeColors() {
    // This ensures colors are applied even if there's a delay
    document.documentElement.style.setProperty('--primary', '#4a6fa5');
    document.documentElement.style.setProperty('--secondary', '#c6d8e8');
    document.documentElement.style.setProperty('--accent', '#ff9a8d');
    document.documentElement.style.setProperty('--light', '#f8f9fa');
    document.documentElement.style.setProperty('--dark', '#2c3e50');
    document.documentElement.style.setProperty('--success', '#66bb6a');
    document.documentElement.style.setProperty('--warning', '#ffa726');
    document.documentElement.style.setProperty('--danger', '#ef5350');
}

// Language switching functionality
function setupLanguageSwitching() {
    // Load saved language preference
    loadLanguagePreference();
    
    // Set up button event listeners
    if (floatingArabicBtn) {
        floatingArabicBtn.addEventListener('click', switchToArabic);
    }
    
    if (floatingEnglishBtn) {
        floatingEnglishBtn.addEventListener('click', switchToEnglish);
    }
}

// Switch to Arabic
function switchToArabic() {
    currentLanguage = 'ar';
    updateLanguageUI('ar');
    loadContent('ar');
    saveLanguagePreference('arabic');
}

// Switch to English
function switchToEnglish() {
    currentLanguage = 'en';
    updateLanguageUI('en');
    loadContent('en');
    saveLanguagePreference('english');
}

// Update UI for language switch
function updateLanguageUI(language) {
    if (language === 'ar') {
        floatingArabicBtn.style.display = 'none';
        floatingEnglishBtn.style.display = 'flex';
        body.setAttribute('dir', 'rtl');
        body.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('lang', 'ar');
        document.title = "إبرة الظهر (إبرة التخدير فوق الجافية) لتسكين آلام الولادة | Epidural Analgesia for Labour Pain";
    } else {
        floatingEnglishBtn.style.display = 'none';
        floatingArabicBtn.style.display = 'flex';
        body.setAttribute('dir', 'ltr');
        body.setAttribute('lang', 'en');
        document.documentElement.setAttribute('lang', 'en');
        document.title = "Epidural Analgesia for Labour Pain | إبرة الظهر (إبرة التخدير فوق الجافية) لتسكين آلام الولادة";
    }
}

// Load content from HTML file
function loadContent(language) {
    const contentFile = language === 'ar' ? 'ar.html' : 'en.html';
    const container = document.getElementById('content-container');
    
    fetch(contentFile)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            
            // Re-apply theme colors
            applyThemeColors();
            
            // Initialize all interactive elements
            setTimeout(() => {
                initializeContraTabs();
                initializeAllCardNavigations();
                setupCheckOptions();
                setupSmoothScrolling();
            }, 100);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            container.innerHTML = `<div class="container" style="text-align: center; padding: 2rem;">
                <h2 style="color: var(--danger)">Error loading content</h2>
                <p style="color: var(--dark)">Please check your internet connection and try again.</p>
            </div>`;
        });
}

// Save language preference to localStorage
function saveLanguagePreference(language) {
    localStorage.setItem('epidural-language-preference', language);
}

// Load language preference from localStorage
function loadLanguagePreference() {
    const savedLanguage = localStorage.getItem('epidural-language-preference');
    if (savedLanguage === 'english') {
        switchToEnglish();
    } else {
        // Arabic is default
        floatingArabicBtn.style.display = 'none';
        floatingEnglishBtn.style.display = 'flex';
    }
}

// Initialize contraindications tabs
function initializeContraTabs() {
    const tabs = document.querySelectorAll('.contra-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding cards
            const cardsContainers = document.querySelectorAll('.contra-cards');
            cardsContainers.forEach(container => {
                container.classList.remove('active');
                
                // Determine the correct container ID based on language
                let targetId;
                if (currentLanguage === 'ar') {
                    targetId = tabType === 'absolute' ? 'absolute-cards' : 'relative-cards';
                } else {
                    targetId = tabType === 'absolute-en' ? 'absolute-cards-en' : 'relative-cards-en';
                }
                
                if (container.id === targetId) {
                    container.classList.add('active');
                    resetCards(container);
                }
            });
        });
    });
}

// Initialize all card navigation systems
function initializeAllCardNavigations() {
    const containers = document.querySelectorAll('.contra-cards');
    containers.forEach(container => {
        if (container.classList.contains('active')) {
            initializeCardNavigation(container);
        }
    });
}

// Initialize card navigation for a specific container
function initializeCardNavigation(container) {
    const cards = container.querySelectorAll('.contra-card');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const currentCardSpan = container.querySelector('.current-card');
    const totalCardsSpan = container.querySelector('.total-cards');
    const dots = container.querySelectorAll('.card-dot');
    
    let currentCardIndex = 0;
    const totalCards = cards.length;
    
    // Set total cards count
    if (totalCardsSpan) {
        totalCardsSpan.textContent = totalCards;
    }
    
    // Show first card, hide others
    cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Update dots
    updateDots(dots, currentCardIndex);
    
    // Next button functionality
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentCardIndex < totalCards - 1) {
                cards[currentCardIndex].style.display = 'none';
                currentCardIndex++;
                cards[currentCardIndex].style.display = 'block';
                updateNavigation();
                updateDots(dots, currentCardIndex);
            }
        });
    }
    
    // Previous button functionality
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentCardIndex > 0) {
                cards[currentCardIndex].style.display = 'none';
                currentCardIndex--;
                cards[currentCardIndex].style.display = 'block';
                updateNavigation();
                updateDots(dots, currentCardIndex);
            }
        });
    }
    
    // Dot click functionality
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            cards[currentCardIndex].style.display = 'none';
            currentCardIndex = index;
            cards[currentCardIndex].style.display = 'block';
            updateNavigation();
            updateDots(dots, currentCardIndex);
        });
    });
    
    // Update navigation state
    function updateNavigation() {
        if (currentCardSpan) {
            currentCardSpan.textContent = currentCardIndex + 1;
        }
        
        if (prevBtn) {
            prevBtn.disabled = currentCardIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentCardIndex === totalCards - 1;
        }
    }
    
    // Update dots state
    function updateDots(dotsArray, activeIndex) {
        dotsArray.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    // Initialize navigation
    updateNavigation();
}

// Reset cards to first position
function resetCards(container) {
    const cards = container.querySelectorAll('.contra-card');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const currentCardSpan = container.querySelector('.current-card');
    const dots = container.querySelectorAll('.card-dot');
    
    // Show first card, hide others
    cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Reset to first card
    const currentCardIndex = 0;
    if (currentCardSpan) {
        currentCardSpan.textContent = 1;
    }
    
    // Reset dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === 0);
    });
    
    // Reset navigation buttons
    if (prevBtn) {
        prevBtn.disabled = true;
    }
    if (nextBtn) {
        nextBtn.disabled = cards.length <= 1;
    }
    
    // Reset check options
    container.querySelectorAll('.check-option').forEach(option => {
        option.classList.remove('selected-yes', 'selected-no');
    });
}

// Set up check option selections
function setupCheckOptions() {
    document.querySelectorAll('.check-option').forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.parentElement;
            const allOptions = parent.querySelectorAll('.check-option');
            
            // Remove selected classes
            allOptions.forEach(opt => {
                opt.classList.remove('selected-yes', 'selected-no');
            });
            
            // Add appropriate class
            const value = this.getAttribute('data-value');
            this.classList.add(value === 'yes' ? 'selected-yes' : 'selected-no');
        });
    });
}

// Set up smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}
