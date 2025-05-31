/**
 * JLS Transporte e Guincho - Main JavaScript File
 * Handles loading animations, ScrollReveal, form enhancements, and user interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingSpinner();
    initScrollReveal();
    initNavigation();
    initFormEnhancements();
    initSmoothScrolling();
    initMobileOptimizations();
    initAccessibilityFeatures();
    
    console.log('JLS Transporte e Guincho - Website initialized successfully');
});

/**
 * Loading Spinner Management
 */
function initLoadingSpinner() {
    const loadingOverlay = document.getElementById('loading-spinner');
    
    if (!loadingOverlay) return;
    
    // Hide loading spinner after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 300);
        }, 500); // Show spinner for at least 500ms for better UX
    });
    
    // Show loading spinner for navigation
    document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't show spinner for external links or anchor links
            if (this.getAttribute('href').startsWith('#') || 
                this.getAttribute('target') === '_blank' ||
                this.getAttribute('href').startsWith('tel:') ||
                this.getAttribute('href').startsWith('mailto:') ||
                this.getAttribute('href').startsWith('https://wa.me')) {
                return;
            }
            
            loadingOverlay.classList.remove('hidden', 'fade-out');
        });
    });
}

/**
 * ScrollReveal Animations
 */
function initScrollReveal() {
    // Check if ScrollReveal is available
    if (typeof ScrollReveal === 'undefined') {
        console.warn('ScrollReveal not loaded, skipping animations');
        return;
    }
    
    // Initialize ScrollReveal with default options
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '50px',
        duration: 800,
        delay: 100,
        easing: 'ease-out',
        reset: false,
        mobile: true,
        scale: 1
    });
    
    // Animate elements with data-sr-id attributes
    sr.reveal('[data-sr-id]', {
        interval: 100
    });
    
    // Custom animations for specific elements
    sr.reveal('.hero-content', {
        origin: 'left',
        distance: '100px',
        duration: 1000
    });
    
    sr.reveal('.hero-image', {
        origin: 'right',
        distance: '100px',
        duration: 1000,
        delay: 200
    });
    
    sr.reveal('.card', {
        interval: 150,
        scale: 0.95
    });
    
    sr.reveal('.service-card', {
        interval: 200,
        origin: 'bottom',
        distance: '30px'
    });
    
    // Animate feature items with stagger
    sr.reveal('.feature-item', {
        interval: 100,
        distance: '20px'
    });
    
    // Special animation for emergency CTA
    sr.reveal('.bg-primary, .bg-danger', {
        origin: 'top',
        distance: '30px',
        duration: 600
    });
}

/**
 * Navigation Enhancements
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Add scroll effect to navbar
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            // Add background on scroll
            if (scrollTop > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    // Close mobile menu when clicking on links
    if (navbarCollapse) {
        navbarCollapse.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link') && navbarToggler) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    }
    
    // Update active nav item based on current page
    updateActiveNavItem();
}

/**
 * Update active navigation item
 */
function updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        
        if (href === currentPath || 
            (currentPath === '/' && href === '/') ||
            (currentPath.includes(href) && href !== '/')) {
            link.classList.add('active');
        }
    });
}

/**
 * Form Enhancements
 */
function initFormEnhancements() {
    // Enhanced contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        enhanceContactForm(contactForm);
    }
    
    // Phone number formatting for all phone inputs
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        formatPhoneInput(input);
    });
    
    // Email validation enhancement
    document.querySelectorAll('input[type="email"]').forEach(input => {
        enhanceEmailInput(input);
    });
    
    // Form validation feedback
    document.querySelectorAll('form').forEach(form => {
        addFormValidation(form);
    });
}

/**
 * Enhance contact form with additional features
 */
function enhanceContactForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    // Form submission handling
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showAlert('Por favor, corrija os erros no formulário antes de enviar.', 'danger');
            return;
        }
        
        // Show loading state
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            submitBtn.disabled = true;
            
            // Reset button state after timeout (in case form doesn't redirect)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 10000);
        }
    });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um email válido.';
        }
    }
    
    // Phone validation (Brazilian format)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um telefone válido. Ex: (11) 99999-9999';
        }
    }
    
    // Apply validation classes and feedback
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    // Show/hide error message
    let feedback = field.parentNode.querySelector('.invalid-feedback');
    if (!isValid) {
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        feedback.textContent = errorMessage;
    } else if (feedback) {
        feedback.remove();
    }
    
    return isValid;
}

/**
 * Format phone input with Brazilian mask
 */
function formatPhoneInput(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            e.target.value = value;
        }
    });
    
    input.addEventListener('keydown', function(e) {
        // Allow backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

/**
 * Enhance email input
 */
function enhanceEmailInput(input) {
    input.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value) {
            // Auto-correct common email typos
            const corrections = {
                'gmail.con': 'gmail.com',
                'hotmail.con': 'hotmail.com',
                'yahoo.con': 'yahoo.com',
                'outlook.con': 'outlook.com'
            };
            
            let correctedValue = value;
            Object.keys(corrections).forEach(typo => {
                if (value.includes(typo)) {
                    correctedValue = value.replace(typo, corrections[typo]);
                }
            });
            
            if (correctedValue !== value) {
                this.value = correctedValue;
                showAlert('Email corrigido automaticamente.', 'info');
            }
        }
    });
}

/**
 * Add form validation
 */
function addFormValidation(form) {
    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });
}

/**
 * Smooth Scrolling
 */
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top functionality
    createBackToTopButton();
}

/**
 * Create back to top button
 */
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'btn btn-primary back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        z-index: 1000;
        opacity: 0.8;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.alignItems = 'center';
            backToTopBtn.style.justifyContent = 'center';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Mobile Optimizations
 */
function initMobileOptimizations() {
    // Prevent zoom on input focus for iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                if (this.style.fontSize !== '16px') {
                    this.style.fontSize = '16px';
                }
            });
        });
    }
    
    // Touch optimizations
    document.querySelectorAll('.card, .btn').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Mobile menu improvements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarCollapse.contains(e.target) && 
                !navbarToggler.contains(e.target) && 
                navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
}

/**
 * Accessibility Features
 */
function initAccessibilityFeatures() {
    // Skip to content link
    createSkipToContentLink();
    
    // Keyboard navigation enhancements
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals and mobile menu
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modal = bootstrap.Modal.getInstance(openModal);
                if (modal) modal.hide();
            }
            
            const mobileMenu = document.querySelector('.navbar-collapse.show');
            if (mobileMenu) {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }
        }
    });
    
    // Focus management for cards
    document.querySelectorAll('.card').forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = this.querySelector('a, button');
                if (link) {
                    e.preventDefault();
                    link.click();
                }
            }
        });
    });
    
    // High contrast mode detection
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Reduced motion detection
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
        
        // Disable ScrollReveal if user prefers reduced motion
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().destroy();
        }
    }
}

/**
 * Create skip to content link for accessibility
 */
function createSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-to-content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--bs-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
}

/**
 * Show alert messages
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.container');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert alert at the top of the container
    alertContainer.insertBefore(alert, alertContainer.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

/**
 * Utility Functions
 */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }
        }, 0);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to a logging service
});

// Service Worker registration (optional, for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add PWA features
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        formatPhoneInput,
        debounce,
        throttle,
        isInViewport
    };
}
