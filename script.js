document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initialize Lucide Icons ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. Dynamic Copyright Year ---
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const words = [
        'Python Scripts.',
        'Automation Utilities.',
        'Responsive Web Sites.',
        'C/C++ Algorithms.',
        'Security Tools.'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById('typed-text');
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newWordDelay = 2000; // Delay between words

    function type() {
        if (!typedTextSpan) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? erasingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = newWordDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500; // pause before typing next word
        }

        setTimeout(type, delay);
    }
    
    // Start the typing animation
    setTimeout(type, 1000);


    // --- 4. Theme Toggler (Dark/Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }


    // --- 5. Mobile Navigation Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            
            // Toggle menu/close icon
            if (menuIcon) {
                if (isOpen) {
                    menuIcon.setAttribute('data-lucide', 'x');
                } else {
                    menuIcon.setAttribute('data-lucide', 'menu');
                }
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }

    // Close menu when a navigation link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                if (menuIcon) {
                    menuIcon.setAttribute('data-lucide', 'menu');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            }
        });
    });


    // --- 6. Active Nav Link on Scroll (Scroll Spy) & Scroll to Top Button ---
    const sections = document.querySelectorAll('section');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update nav links active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Show/Hide Scroll-to-Top Button
        if (scrollTopBtn) {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });


    // --- 7. Journey Tabs (Experience vs Education) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const timelineContents = document.querySelectorAll('.timeline-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            timelineContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and target content
            btn.classList.add('active');
            const targetContent = document.getElementById(`timeline-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });


    // --- 8. Scroll triggered animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills section, animate skill bars
                if (entry.target.id === 'skills') {
                    skillBars.forEach(bar => {
                        const percent = bar.getAttribute('data-percent');
                        bar.style.width = percent;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        sectionObserver.observe(el);
    });

    // Fallback: If intersection observer is not supported, load skill bars instantly
    if (!('IntersectionObserver' in window)) {
        skillBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-percent');
        });
        revealElements.forEach(el => el.classList.add('active'));
    }


    // --- 9. Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Toggle active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show item
                    card.style.display = 'flex';
                    // Animation trigger
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match CSS transitions
                }
            });
        });
    });


    // --- 10. Contact Form Validation & Simulated Submission ---
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success-msg');
    const resetFormBtn = document.getElementById('form-reset-btn');
    const submitBtn = document.getElementById('form-submit-btn');
    const submitLoader = document.getElementById('submit-loader');
    const submitIcon = document.getElementById('submit-icon');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;

            // Simple Field Validations
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            // Helper to toggle error
            const toggleError = (input, isValid) => {
                const parent = input.parentElement;
                if (!isValid) {
                    parent.classList.add('error');
                    isFormValid = false;
                } else {
                    parent.classList.remove('error');
                }
            };

            // Name check
            toggleError(nameInput, nameInput.value.trim() !== '');

            // Email check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            toggleError(emailInput, emailRegex.test(emailInput.value.trim()));

            // Subject check
            toggleError(subjectInput, subjectInput.value.trim() !== '');

            // Message check
            toggleError(messageInput, messageInput.value.trim() !== '');

            // Submit Simulation if Valid
            if (isFormValid) {
                // Show loader, disable button
                submitBtn.disabled = true;
                if (submitIcon) submitIcon.style.display = 'none';
                if (submitLoader) submitLoader.style.display = 'inline-block';

                // Simulate Network latency (1.5 seconds)
                setTimeout(() => {
                    // Hide form container, show success
                    contactForm.style.display = 'none';
                    if (successMsg) successMsg.style.display = 'flex';
                    
                    // Reset loaders
                    submitBtn.disabled = false;
                    if (submitIcon) submitIcon.style.display = 'inline-block';
                    if (submitLoader) submitLoader.style.display = 'none';
                    
                    // Reset actual form fields
                    contactForm.reset();
                    document.querySelectorAll('.form-group').forEach(grp => {
                        grp.classList.remove('error');
                    });
                }, 1500);
            }
        });
    }

    // Reset Form Success View
    if (resetFormBtn && contactForm && successMsg) {
        resetFormBtn.addEventListener('click', () => {
            successMsg.style.display = 'none';
            contactForm.style.display = 'flex';
        });
    }
});
