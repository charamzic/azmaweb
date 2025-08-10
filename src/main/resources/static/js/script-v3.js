let cookieConsentInitialized = false;

function showCookieBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
        banner.classList.add('show');
    } else {
        const altBanner = document.querySelector('.cookie-consent-banner');
        if (altBanner) {
            altBanner.classList.add('show');
        }
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
        banner.classList.remove('show');
    }
}

function showCookieSettings() {
    const overlay = document.getElementById('cookieSettingsOverlay');
    if (overlay) {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        loadCookiePreferences();
    }
}

function closeCookieSettings() {
    const overlay = document.getElementById('cookieSettingsOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function acceptAllCookies() {
    try {
        // Set all cookie preferences to true
        setCookiePreference('essential', true);
        setCookiePreference('preference', true);
        setCookiePreference('analytics', true);
        setCookiePreference('marketing', true);

        // Set consent flag
        setCookieConsentStatus('accepted');

        hideCookieBanner();
        initializeOptionalServices();

        if (window.showNotification) {
            showNotification('All cookies accepted', 'success');
        }
    } catch (error) {
        console.error('Error accepting cookies:', error);
    }
}

function declineCookies() {
    try {
        // Set only essential cookies to true, others to false
        setCookiePreference('essential', true);
        setCookiePreference('preference', false);
        setCookiePreference('analytics', false);
        setCookiePreference('marketing', false);

        // Set consent flag
        setCookieConsentStatus('declined');

        hideCookieBanner();

        if (window.showNotification) {
            showNotification('Optional cookies declined', 'info');
        }
    } catch (error) {
        console.error('Error declining cookies:', error);
    }
}

function saveCookieSettings() {
    try {
        // Get checkbox states
        const preferences = document.getElementById('preferenceCookies')?.checked || false;
        const analytics = document.getElementById('analyticsCookies')?.checked || false;
        const marketing = document.getElementById('marketingCookies')?.checked || false;

        // Save preferences
        setCookiePreference('essential', true); // Always true
        setCookiePreference('preference', preferences);
        setCookiePreference('analytics', analytics);
        setCookiePreference('marketing', marketing);

        // Set consent flag
        setCookieConsentStatus('customized');

        closeCookieSettings();
        hideCookieBanner();
        initializeOptionalServices();

        if (window.showNotification) {
            showNotification('Cookie preferences saved', 'success');
        }
    } catch (error) {
        console.error('Error saving cookie settings:', error);
    }
}

// Load current cookie preferences into the settings modal
function loadCookiePreferences() {
    try {
        const preferences = getCookieValue('cookie_preference') === 'true';
        const analytics = getCookieValue('cookie_analytics') === 'true';
        const marketing = getCookieValue('cookie_marketing') === 'true';

        const preferencesCheckbox = document.getElementById('preferenceCookies');
        const analyticsCheckbox = document.getElementById('analyticsCookies');
        const marketingCheckbox = document.getElementById('marketingCookies');

        if (preferencesCheckbox) preferencesCheckbox.checked = preferences;
        if (analyticsCheckbox) analyticsCheckbox.checked = analytics;
        if (marketingCheckbox) marketingCheckbox.checked = marketing;

    } catch (error) {
        console.error('Error loading cookie preferences:', error);
    }
}

// Utility functions for cookie management
function setCookiePreference(type, value) {
    try {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        // Check if we're in a secure context (HTTPS) for Secure flag
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? '; Secure' : '';

        const cookieString = `cookie_${type}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;
        document.cookie = cookieString;

        // Verify the cookie was actually set
        const verification = getCookieValue(`cookie_${type}`);

        if (verification !== value.toString()) {
            console.warn(`Cookie ${type} may not have been set correctly. Expected: ${value}, Got: ${verification}`);
        }
    } catch (error) {
        console.error(`Error setting cookie preference ${type}:`, error);
    }
}

function setCookieConsentStatus(status) {
    try {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        // Check if we're in a secure context (HTTPS) for Secure flag
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? '; Secure' : '';

        const cookieString = `cookie_consent=${status}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;
        document.cookie = cookieString;

        // Verify the cookie was actually set
        const verification = getCookieValue('cookie_consent');

        if (verification !== status) {
            console.warn(`Cookie consent may not have been set correctly. Expected: ${status}, Got: ${verification}`);
        }
    } catch (error) {
        console.error('Error setting cookie consent status:', error);
    }
}

function getCookieValue(name) {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    } catch (error) {
        console.error(`Error getting cookie value ${name}:`, error);
        return null;
    }
}

function hasGivenConsent() {
    try {
        const consent = getCookieValue('cookie_consent');
        const hasConsent = consent !== null;

        return hasConsent;
    } catch (error) {
        console.error('Error checking consent:', error);
        return false;
    }
}

function getCookiePreference(type) {
    try {
        return getCookieValue(`cookie_${type}`) === 'true';
    } catch (error) {
        console.error(`Error getting cookie preference ${type}:`, error);
        return false;
    }
}

// Initialize optional services based on cookie preferences
function initializeOptionalServices() {
    try {
        if (getCookiePreference('analytics')) {
            initializeAnalytics();
        }
        if (getCookiePreference('marketing')) {
            initializeMarketing();
        }
        if (getCookiePreference('preference')) {
            initializePreferences();
        }
    } catch (error) {
        console.error('Error initializing optional services:', error);
    }
}

// Service initialization placeholders
function initializeAnalytics() {
    // Initialize analytics services here
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('Analytics cookies enabled - would initialize analytics');
    }
}

function initializeMarketing() {
    // Initialize marketing tools here
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('Marketing cookies enabled - would initialize marketing tools');
    }
}

function initializePreferences() {
    // Initialize personalization features here
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('Preference cookies enabled - would initialize personalization');
    }
}

// Cookie consent initialization
function initializeCookieConsent() {
    try {
        const banner = document.getElementById('cookieConsentBanner');
        const overlay = document.getElementById('cookieSettingsOverlay');

        if (!banner || !overlay) {
            console.error('Cookie consent elements not found in DOM');
            return;
        }

        const hasConsent = hasGivenConsent();

        if (!hasConsent) {
            setTimeout(() => {
                showCookieBanner();
            }, 1500);
        } else {
            initializeOptionalServices();
        }

        // Event listeners for the cookie settings modal
        if (overlay) {
            // Close modal when clicking outside
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeCookieSettings();
                }
            });
        }

        // Handle ESC key for closing modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const settingsOverlay = document.getElementById('cookieSettingsOverlay');
                if (settingsOverlay && settingsOverlay.classList.contains('show')) {
                    closeCookieSettings();
                }
            }
        });

        cookieConsentInitialized = true;
    } catch (error) {
        console.error('Error initializing cookie consent:', error);
    }
}

// Make functions globally available
window.showCookieBanner = showCookieBanner;
window.hideCookieBanner = hideCookieBanner;
window.showCookieSettings = showCookieSettings;
window.closeCookieSettings = closeCookieSettings;
window.acceptAllCookies = acceptAllCookies;
window.declineCookies = declineCookies;
window.saveCookieSettings = saveCookieSettings;

// Cookie consent API
window.cookieConsent = {
    show: showCookieBanner,
    hide: hideCookieBanner,
    showSettings: showCookieSettings,
    initialized: () => cookieConsentInitialized,
    // Add debugging functions for development
    debug: {
        getCookies: () => document.cookie,
        hasConsent: hasGivenConsent,
        getPreference: getCookiePreference,
        clearAll: () => {
            ['cookie_consent', 'cookie_essential', 'cookie_preference', 'cookie_analytics', 'cookie_marketing']
                .forEach(name => {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });
            location.reload();
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieConsent);
} else {
    initializeCookieConsent();
}

// Backup initialization
window.addEventListener('load', function() {
    if (!cookieConsentInitialized) {
        initializeCookieConsent();
    }
});

// Mobile Navigation and other features
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.skill-card, .card, .timeline-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearFormErrors();

            if (validateContactForm()) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                this.classList.add('loading');

                const formData = new FormData(this);
                const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message')
                };

                sendContactForm(contactData)
                    .then(response => {
                        this.reset();
                        showNotification('Message sent successfully!', 'success');
                    })
                    .catch(error => {
                        console.error('Form submission error:', error);
                        showNotification('Failed to send message. Please try again.', 'error');
                    })
                    .finally(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        this.classList.remove('loading');
                    });
            }
        });
    }

    // Form validation and utilities
    function validateContactForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        if (!name.value.trim()) {
            showFormError('name', 'Name is required');
            isValid = false;
        }

        if (!email.value.trim()) {
            showFormError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showFormError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!subject.value.trim()) {
            showFormError('subject', 'Subject is required');
            isValid = false;
        }

        if (!message.value.trim()) {
            showFormError('message', 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showFormError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    function showFormError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');

        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-input, .form-textarea');

        errorElements.forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });

        inputElements.forEach(el => {
            el.classList.remove('error');
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function sendContactForm(contactData) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Contact form submission failed:', error);
            throw error;
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    window.showNotification = showNotification;

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(26, 32, 44, 0.98)';
            } else {
                navbar.style.backgroundColor = 'rgba(26, 32, 44, 0.95)';
            }
        });
    }
});

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((resolve, reject) => {
            document.execCommand('copy') ? resolve() : reject();
            textArea.remove();
        });
    }
}

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});