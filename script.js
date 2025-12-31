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
            
            // Re-initialize contraindications after content is loaded
            setTimeout(() => {
                initializeContraindications();
                setupSmoothScrolling();
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

// Interactive Contraindications Cards System
function initializeContraindications() {
    const contraindicationsSection = document.getElementById('contraindications') || 
                                    document.getElementById('contraindications-en');
    
    if (!contraindicationsSection) return;
    
    const tabs = contraindicationsSection.querySelectorAll('.contra-tab');
    const cardsContainers = contraindicationsSection.querySelectorAll('.contra-cards');
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            const targetId = currentLanguage === 'ar' ? `${tabType}-cards` : `${tabType}-cards-en`;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show target cards container
            cardsContainers.forEach(container => {
                container.classList.remove('active');
                if (container.id === targetId) {
                    container.classList.add('active');
                    // Reset to first card when switching tabs
                    resetCards(container);
                }
            });
        });
    });
    
    // Initialize card navigation for each container
    cardsContainers.forEach(container => {
        initializeCardNavigation(container);
    });
}

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
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentCardIndex < totalCards - 1) {
                // Hide current card
                cards[currentCardIndex].style.display = 'none';
                currentCardIndex++;
                
                // Show next card with animation
                cards[currentCardIndex].style.display = 'block';
                cards[currentCardIndex].classList.add('fade-in');
                
                // Update navigation
                updateNavigation();
                updateDots(dots, currentCardIndex);
            }
        });
    }
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentCardIndex > 0) {
                // Hide current card
                cards[currentCardIndex].style.display = 'none';
                currentCardIndex--;
                
                // Show previous card with animation
                cards[currentCardIndex].style.display = 'block';
                cards[currentCardIndex].classList.add('fade-in');
                
                // Update navigation
                updateNavigation();
                updateDots(dots, currentCardIndex);
            }
        });
    }
    
    // Dot click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            // Hide current card
            cards[currentCardIndex].style.display = 'none';
            currentCardIndex = index;
            
            // Show selected card with animation
            cards[currentCardIndex].style.display = 'block';
            cards[currentCardIndex].classList.add('fade-in');
            
            // Update navigation
            updateNavigation();
            updateDots(dots, currentCardIndex);
        });
    });
    
    // Check option selection
    container.querySelectorAll('.check-option').forEach(option => {
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
    
    function updateNavigation() {
        if (currentCardSpan) {
            currentCardSpan.textContent = currentCardIndex + 1;
        }
        
        if (prevBtn) {
            prevBtn.disabled = currentCardIndex === 0;
            if (prevBtn.disabled) {
                prevBtn.setAttribute('disabled', true);
            } else {
                prevBtn.removeAttribute('disabled');
            }
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentCardIndex === totalCards - 1;
            if (nextBtn.disabled) {
                nextBtn.setAttribute('disabled', true);
            } else {
                nextBtn.removeAttribute('disabled');
            }
        }
    }
    
    function updateDots(dotsArray, activeIndex) {
        dotsArray.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Initialize navigation state
    updateNavigation();
}

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
        if (index === 0) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
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
