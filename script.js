// Global variables
let currentLanguage = 'ar';

// Language switching functionality
const floatingArabicBtn = document.getElementById('floating-arabic-btn');
const floatingEnglishBtn = document.getElementById('floating-english-btn');
const body = document.body;

// Set up language switching
function setupLanguageSwitching() {
    // Load saved language preference
    loadLanguagePreference();
    
    // Arabic button click
    floatingArabicBtn.addEventListener('click', function() {
        switchToArabic();
    });
    
    // English button click
    floatingEnglishBtn.addEventListener('click', function() {
        switchToEnglish();
    });
}

// Switch to Arabic
function switchToArabic() {
    currentLanguage = 'ar';
    floatingArabicBtn.style.display = 'none';
    floatingEnglishBtn.style.display = 'flex';
    body.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
    document.title = "إبرة الظهر (إبرة التخدير فوق الجافية) لتسكين آلام الولادة | Epidural Analgesia for Labour Pain";
    
    // Load Arabic content
    loadContent('ar');
    
    // Save preference
    saveLanguagePreference('arabic');
}

// Switch to English
function switchToEnglish() {
    currentLanguage = 'en';
    floatingEnglishBtn.style.display = 'none';
    floatingArabicBtn.style.display = 'flex';
    body.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    document.title = "Epidural Analgesia for Labour Pain | إبرة الظهر (إبرة التخدير فوق الجافية) لتسكين آلام الولادة";
    
    // Load English content
    loadContent('en');
    
    // Save preference
    saveLanguagePreference('english');
}

// Load content from HTML file
function loadContent(language) {
    const contentFile = language === 'ar' ? 'ar.html' : 'en.html';
    const container = document.getElementById('content-container');
    
    fetch(contentFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            
            // Re-initialize everything after content is loaded
            setTimeout(() => {
                // Initialize contraindications navigation
                initializeContraTabs();
                initializeAllCardNavigations();
                setupCheckOptions();
                
                // Set up smooth scrolling
                setupSmoothScrolling();
                
                // Ensure card counters are correct
                updateCardCounters();
            }, 100);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            container.innerHTML = `<div class="container" style="text-align: center; padding: 2rem;">
                <h2>Error loading content</h2>
                <p>Please check your internet connection and try again.</p>
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

// Initialize all contraindications tabs
function initializeContraTabs() {
    const tabs = document.querySelectorAll('.contra-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding cards container
            const cardsContainers = document.querySelectorAll('.contra-cards');
            cardsContainers.forEach(container => {
                container.classList.remove('active');
                
                // Check if this container matches the tab
                if ((currentLanguage === 'ar' && container.id === tabId + '-cards') ||
                    (currentLanguage === 'en' && container.id === tabId + '-cards-en')) {
                    container.classList.add('active');
                    resetCards(container);
                }
            });
        });
    });
}

// Initialize card navigation for a specific container
function initializeCardNavigation(container) {
    if (!container) return;
    
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
                // Hide current card
                cards[currentCardIndex].style.display = 'none';
                currentCardIndex++;
                
                // Show next card
                cards[currentCardIndex].style.display = 'block';
                
                // Update navigation
                updateNavigation();
                updateDots(dots, currentCardIndex);
            }
        });
    }
    
    // Previous button functionality
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentCardIndex > 0) {
                // Hide current card
                cards[currentCardIndex].style.display = 'none';
                currentCardIndex--;
                
                // Show previous card
                cards[currentCardIndex].style.display = 'block';
                
                // Update navigation
                updateNavigation();
                updateDots(dots, currentCardIndex);
            }
        });
    }
    
    // Dot click functionality
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            // Hide current card
            cards[currentCardIndex].style.display = 'none';
            currentCardIndex = index;
            
            // Show selected card
            cards[currentCardIndex].style.display = 'block';
            
            // Update navigation
            updateNavigation();
            updateDots(dots, currentCardIndex);
        });
    });
    
    // Update navigation state
    function updateNavigation() {
        if (currentCardSpan) {
            currentCardSpan.textContent = currentCardIndex + 1;
        }
        
        // Update button states
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

// Initialize all card navigations
function initializeAllCardNavigations() {
    const containers = document.querySelectorAll('.contra-cards');
    containers.forEach(container => {
        initializeCardNavigation(container);
    });
}

// Reset cards to first card
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
        currentCardSpan.textContent = currentCardIndex + 1;
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
}

// Set up check option selections
function setupCheckOptions() {
    document.querySelectorAll('.check-option').forEach(option => {
        option.addEventListener('click', function() {
            const parentOptions = this.parentElement;
            const allOptions = parentOptions.querySelectorAll('.check-option');
            
            // Remove selected class from all options
            allOptions.forEach(opt => {
                opt.classList.remove('selected-yes', 'selected-no');
            });
            
            // Add selected class to clicked option
            const value = this.getAttribute('data-value');
            if (value === 'yes') {
                this.classList.add('selected-yes');
            } else {
                this.classList.add('selected-no');
            }
        });
    });
}

// Update all card counters
function updateCardCounters() {
    document.querySelectorAll('.contra-cards').forEach(container => {
        const cards = container.querySelectorAll('.contra-card');
        const totalCardsSpan = container.querySelector('.total-cards');
        
        if (totalCardsSpan && cards.length > 0) {
            totalCardsSpan.textContent = cards.length;
        }
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupLanguageSwitching();
});