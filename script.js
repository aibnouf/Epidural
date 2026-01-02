document.addEventListener('DOMContentLoaded', () => {
    // EmailJS Configuration - YOUR ACTUAL CREDENTIALS
    const EMAILJS_CONFIG = {
        SERVICE_ID: 'service_ghdaxm8',        // Your service ID
        TEMPLATE_ID: 'template_1hr79vx',      // Your template ID
        PUBLIC_KEY: 'sT3YiCaF-9Ji-HoOm'       // Your public key
    };

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    // Current language variable
    let currentLang = 'ar';

    // Feedback form text for different languages
    const FEEDBACK_TEXTS = {
        ar: {
            title: "إرسال سؤال أو شكر",
            subtitle: "سأرد عليك في أقرب وقت ممكن عبر البريد الإلكتروني",
            nameLabel: "الاسم (اختياري)",
            namePlaceholder: "اسمك",
            emailLabel: "البريد الإلكتروني (مطلوب للرد)",
            emailPlaceholder: "example@email.com",
            typeLabel: "نوع الرسالة",
            typePlaceholder: "اختر نوع الرسالة",
            typeOptions: [
                { value: "question", text: "سؤال" },
                { value: "thanks", text: "شكر وتقدير" },
                { value: "feedback", text: "ملاحظة أو اقتراح" },
                { value: "other", text: "أخرى" }
            ],
            messageLabel: "الرسالة",
            messagePlaceholder: "اكتب رسالتك هنا...",
            submitBtn: "إرسال الرسالة",
            btnText: "سؤال؟",
            success: "تم إرسال رسالتك بنجاح! سأرد عليك قريباً.",
            error: "حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.",
            sending: "جاري الإرسال...",
            required: "هذا الحقل مطلوب"
        },
        en: {
            title: "Send a Question or Thanks",
            subtitle: "I'll reply to you as soon as possible via email",
            nameLabel: "Name (optional)",
            namePlaceholder: "Your name",
            emailLabel: "Email (required for reply)",
            emailPlaceholder: "example@email.com",
            typeLabel: "Message Type",
            typePlaceholder: "Choose message type",
            typeOptions: [
                { value: "question", text: "Question" },
                { value: "thanks", text: "Thank You" },
                { value: "feedback", text: "Feedback or Suggestion" },
                { value: "other", text: "Other" }
            ],
            messageLabel: "Message",
            messagePlaceholder: "Write your message here...",
            submitBtn: "Send Message",
            btnText: "Question?",
            success: "Your message has been sent successfully! I'll reply soon.",
            error: "Error sending message. Please try again.",
            sending: "Sending...",
            required: "This field is required"
        }
    };

    // Header scroll effect
    const header = document.getElementById('main-header');
    window.onscroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Language switching function
    const setLang = (lang) => {
        currentLang = lang; // Store current language
        
        // Set direction and display appropriate content
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Show/hide language content
        document.getElementById('content-ar').style.display = lang === 'ar' ? 'block' : 'none';
        document.getElementById('content-en').style.display = lang === 'en' ? 'block' : 'none';
        
        // Toggle language buttons
        document.getElementById('lang-btn-ar').style.display = lang === 'ar' ? 'none' : 'block';
        document.getElementById('lang-btn-en').style.display = lang === 'en' ? 'none' : 'block';
        
        // Update header text
        document.getElementById('header-title').innerText = lang === 'ar' 
            ? "إبرة الظهر (الابيدورال)" 
            : "Epidural Analgesia";
        
        document.getElementById('header-tagline').innerText = lang === 'ar'
            ? "دليل شامل، آمن، ومطمئن لتخفيف آلام الولادة"
            : "Comprehensive guide to safe pain relief during labour";
        
        // Update feedback form text
        updateFeedbackFormText(lang);
        
        // Save language preference
        localStorage.setItem('preferredLang', lang);
        
        // Initialize interactions for the current language
        initInteractions();
    };

    // Language button event listeners
    document.getElementById('lang-btn-ar').onclick = () => setLang('ar');
    document.getElementById('lang-btn-en').onclick = () => setLang('en');

    // Initialize interactions
    function initInteractions() {
        // Contraindications tabs
        document.querySelectorAll('.contra-tab').forEach(btn => {
            btn.onclick = function() {
                const parent = this.closest('.contraindications-container');
                
                // Remove active class from all tabs
                parent.querySelectorAll('.contra-tab').forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all card groups
                parent.querySelectorAll('.contra-cards').forEach(c => c.classList.remove('active'));
                
                // Show the target card group
                document.getElementById(this.dataset.target).classList.add('active');
                
                // Reset card navigation for the active group
                resetCardNavigation(this.dataset.target);
            }
        });

        // Initialize card navigation for each card group
        document.querySelectorAll('.contra-cards').forEach(group => {
            setupCardNavigation(group.id);
        });
    }

    // Setup card navigation for a specific group
    function setupCardNavigation(groupId) {
        const group = document.getElementById(groupId);
        if (!group) return;
        
        const cards = group.querySelectorAll('.contra-card');
        const nextBtn = group.querySelector('.next-btn');
        const prevBtn = group.querySelector('.prev-btn');
        const countSpan = group.querySelector('.current-card');
        const totalSpan = group.querySelector('.total-cards');
        
        if (totalSpan && cards.length > 0) {
            totalSpan.textContent = cards.length;
        }
        
        let currentIndex = 0;
        
        const updateCardDisplay = () => {
            cards.forEach((card, index) => {
                card.style.display = index === currentIndex ? 'block' : 'none';
            });
            
            if (countSpan) {
                countSpan.textContent = currentIndex + 1;
            }
            
            if (nextBtn) {
                nextBtn.disabled = currentIndex === cards.length - 1;
            }
            
            if (prevBtn) {
                prevBtn.disabled = currentIndex === 0;
            }
        };
        
        if (nextBtn) {
            nextBtn.onclick = () => {
                if (currentIndex < cards.length - 1) {
                    currentIndex++;
                    updateCardDisplay();
                }
            };
        }
        
        if (prevBtn) {
            prevBtn.onclick = () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCardDisplay();
                }
            };
        }
        
        updateCardDisplay();
    }

    // Reset card navigation when switching tabs
    function resetCardNavigation(groupId) {
        setupCardNavigation(groupId);
    }

    // Update feedback form text based on language
    function updateFeedbackFormText(lang) {
        const texts = FEEDBACK_TEXTS[lang];
        
        // Update form text
        document.getElementById('feedback-title').textContent = texts.title;
        document.getElementById('feedback-subtitle').textContent = texts.subtitle;
        document.getElementById('name-label').textContent = texts.nameLabel;
        document.getElementById('user-name').placeholder = texts.namePlaceholder;
        document.getElementById('email-label').textContent = texts.emailLabel;
        document.getElementById('user-email').placeholder = texts.emailPlaceholder;
        document.getElementById('type-label').textContent = texts.typeLabel;
        
        // Update select options
        const select = document.getElementById('message-type');
        select.innerHTML = `<option value="" disabled selected>${texts.typePlaceholder}</option>`;
        texts.typeOptions.forEach(option => {
            select.innerHTML += `<option value="${option.value}">${option.text}</option>`;
        });
        
        document.getElementById('message-label').textContent = texts.messageLabel;
        document.getElementById('message').placeholder = texts.messagePlaceholder;
        document.getElementById('submit-btn').innerHTML = `<i class="fas fa-paper-plane"></i> ${texts.submitBtn}`;
        document.getElementById('feedback-btn-text').textContent = texts.btnText;
    }

    // Setup feedback form functionality
    function setupFeedbackForm() {
        const modal = document.getElementById('feedback-modal');
        const openBtn = document.getElementById('feedback-btn');
        const closeBtn = document.querySelector('.close-modal');
        const form = document.getElementById('feedback-form');
        const statusDiv = document.getElementById('form-status');
        
        // Open modal
        openBtn.onclick = () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };
        
        // Close modal
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Clear form and status
            form.reset();
            statusDiv.style.display = 'none';
        };
        
        // Close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                // Clear form and status
                form.reset();
                statusDiv.style.display = 'none';
            }
        };
        
        // Form submission
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show sending state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${FEEDBACK_TEXTS[currentLang].sending}`;
            
            // Hide previous status
            statusDiv.style.display = 'none';
            
            try {
                // Prepare form data
                const formData = {
                    to_name: "Dr. Ibnouf",
                    to_email: "epidural@ibnouf.me",
                    from_name: form.user_name.value || 'Anonymous',
                    from_email: form.user_email.value,
                    message_type: form.message_type.value,
                    message: form.message.value,
                    page_language: currentLang,
                    timestamp: new Date().toLocaleString(),
                    page_url: window.location.href
                };
                
                console.log('Sending email with data:', formData);
                console.log('Using config:', EMAILJS_CONFIG);
                
                // Send email using EmailJS
                const response = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    formData
                );
                
                console.log('EmailJS response:', response);
                
                // Show success message
                statusDiv.className = 'success-message';
                statusDiv.textContent = FEEDBACK_TEXTS[currentLang].success;
                statusDiv.style.display = 'block';
                
                // Reset form
                form.reset();
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    statusDiv.style.display = 'none';
                }, 3000);
                
            } catch (error) {
                console.error('Email sending failed:', error);
                
                // Show error message
                statusDiv.className = 'error-message';
                statusDiv.textContent = `${FEEDBACK_TEXTS[currentLang].error} (${error.text || error.message})`;
                statusDiv.style.display = 'block';
                
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        };
    }

    // Initialize everything
    function initializeApp() {
        // Initialize feedback form
        setupFeedbackForm();
        
        // Set up language with saved preference
        const savedLang = localStorage.getItem('preferredLang') || 'ar';
        setLang(savedLang);
    }

    // Start the application
    initializeApp();
});
