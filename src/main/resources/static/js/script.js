// ==================================================
// DEBUG VERSION - COOKIE CONSENT FUNCTIONALITY
// ==================================================

// Add debug logging to track initialization
console.log('🔧 Script.js loading started');

// Ensure functions are defined before being called
let cookieConsentInitialized = false;

function showCookieBanner() {
    console.log('🍪 showCookieBanner called');
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
        banner.classList.add('show');
        console.log('✅ Cookie banner shown successfully');
    } else {
        console.error('❌ Cookie banner element not found with ID: cookieConsentBanner');
        // Try alternative selector
        const altBanner = document.querySelector('.cookie-consent-banner');
        if (altBanner) {
            altBanner.classList.add('show');
            console.log('✅ Cookie banner found with class selector and shown');
        }
    }
}

function hideCookieBanner() {
    console.log('🍪 hideCookieBanner called');
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
        banner.classList.remove('show');
        console.log('✅ Cookie banner hidden successfully');
    }
}

function showCookieSettings() {
    console.log('🍪 showCookieSettings called');
    const overlay = document.getElementById('cookieSettingsOverlay');
    if (overlay) {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        loadCookiePreferences();
        console.log('✅ Cookie settings shown successfully');
    } else {
        console.error('❌ Cookie settings overlay not found with ID: cookieSettingsOverlay');
    }
}

function closeCookieSettings() {
    console.log('🍪 closeCookieSettings called');
    const overlay = document.getElementById('cookieSettingsOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        console.log('✅ Cookie settings closed successfully');
    }
}

function acceptAllCookies() {
    console.log('🍪 acceptAllCookies called');
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
        console.log('✅ All cookies accepted successfully');
    } catch (error) {
        console.error('❌ Error accepting cookies:', error);
    }
}

function declineCookies() {
    console.log('🍪 declineCookies called');
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
        console.log('✅ Cookies declined successfully');
    } catch (error) {
        console.error('❌ Error declining cookies:', error);
    }
}

function saveCookieSettings() {
    console.log('🍪 saveCookieSettings called');
    try {
        // Get checkbox states
        const preferences = document.getElementById('preferenceCookies')?.checked || false;
        const analytics = document.getElementById('analyticsCookies')?.checked || false;
        const marketing = document.getElementById('marketingCookies')?.checked || false;

        console.log('🍪 Cookie preferences:', { preferences, analytics, marketing });

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
        console.log('✅ Cookie settings saved successfully');
    } catch (error) {
        console.error('❌ Error saving cookie settings:', error);
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

        console.log('✅ Cookie preferences loaded:', { preferences, analytics, marketing });
    } catch (error) {
        console.error('❌ Error loading cookie preferences:', error);
    }
}

// Utility functions for cookie management
function setCookiePreference(type, value) {
    try {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `cookie_${type}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
        console.log(`✅ Cookie preference set: ${type} = ${value}`);
    } catch (error) {
        console.error(`❌ Error setting cookie preference ${type}:`, error);
    }
}

function setCookieConsentStatus(status) {
    try {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `cookie_consent=${status}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
        console.log(`✅ Cookie consent status set: ${status}`);
    } catch (error) {
        console.error('❌ Error setting cookie consent status:', error);
    }
}

function getCookieValue(name) {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    } catch (error) {
        console.error(`❌ Error getting cookie value ${name}:`, error);
        return null;
    }
}

function hasGivenConsent() {
    try {
        const consent = getCookieValue('cookie_consent');
        const hasConsent = consent !== null;
        console.log('🍪 Has given consent:', hasConsent, 'Value:', consent);
        return hasConsent;
    } catch (error) {
        console.error('❌ Error checking consent:', error);
        return false;
    }
}

function getCookiePreference(type) {
    try {
        return getCookieValue(`cookie_${type}`) === 'true';
    } catch (error) {
        console.error(`❌ Error getting cookie preference ${type}:`, error);
        return false;
    }
}

// Initialize optional services based on cookie preferences
function initializeOptionalServices() {
    try {
        console.log('🔧 Initializing optional services...');
        if (getCookiePreference('analytics')) {
            initializeAnalytics();
        }

        if (getCookiePreference('marketing')) {
            initializeMarketing();
        }

        if (getCookiePreference('preference')) {
            initializePreferences();
        }
        console.log('✅ Optional services initialized');
    } catch (error) {
        console.error('❌ Error initializing optional services:', error);
    }
}

// Placeholder functions for service initialization
function initializeAnalytics() {
    console.log('📊 Analytics cookies enabled - initializing analytics');
}

function initializeMarketing() {
    console.log('📢 Marketing cookies enabled - initializing marketing tools');
}

function initializePreferences() {
    console.log('⚙️ Preference cookies enabled - initializing personalization');
}

// Cookie consent initialization - IMPROVED WITH DEBUG
function initializeCookieConsent() {
    try {
        console.log('🔧 Initializing cookie consent...');
        console.log('🔧 Document ready state:', document.readyState);
        console.log('🔧 Current URL:', window.location.href);
        
        // Check if elements exist
        const banner = document.getElementById('cookieConsentBanner');
        const overlay = document.getElementById('cookieSettingsOverlay');
        
        console.log('🔧 Banner element found:', !!banner);
        console.log('🔧 Overlay element found:', !!overlay);
        
        // Debug: List all elements with cookie-related IDs
        const allCookieElements = document.querySelectorAll('[id*="cookie"], [class*="cookie"]');
        console.log('🔧 Found cookie-related elements:', allCookieElements.length);
        allCookieElements.forEach(el => {
            console.log('  - Element:', el.tagName, 'ID:', el.id, 'Classes:', el.className);
        });

        if (!banner) {
            console.error('❌ Cookie consent banner element not found in DOM');
            console.log('🔧 Available elements with IDs:', 
                Array.from(document.querySelectorAll('[id]')).map(el => el.id));
            return;
        }
        
        if (!overlay) {
            console.error('❌ Cookie settings overlay element not found in DOM');
            return;
        }

        console.log('✅ Cookie consent elements found');

        const hasConsent = hasGivenConsent();
        console.log('🍪 Current consent status:', hasConsent);

        if (!hasConsent) {
            console.log('🍪 No consent given, showing banner after delay');
            setTimeout(() => {
                console.log('🍪 Attempting to show banner now...');
                showCookieBanner();
            }, 1500);
        } else {
            console.log('🍪 Consent already given, initializing services');
            initializeOptionalServices();
        }

        // Set up event listeners for the cookie settings modal
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
        console.log('✅ Cookie consent initialization completed');
    } catch (error) {
        console.error('❌ Error initializing cookie consent:', error);
        console.error('❌ Stack trace:', error.stack);
    }
}

// Make functions available globally IMMEDIATELY
console.log('🔧 Setting up global functions...');
window.showCookieBanner = showCookieBanner;
window.hideCookieBanner = hideCookieBanner;
window.showCookieSettings = showCookieSettings;
window.closeCookieSettings = closeCookieSettings;
window.acceptAllCookies = acceptAllCookies;
window.declineCookies = declineCookies;
window.saveCookieSettings = saveCookieSettings;
console.log('✅ Global functions set up');

// Make functions available globally for potential external use
window.cookieConsent = {
    show: showCookieBanner,
    hide: hideCookieBanner,
    showSettings: showCookieSettings,
    initialized: () => cookieConsentInitialized
};

// ENSURE EARLY INITIALIZATION - Multiple approaches
console.log('🔧 Setting up initialization triggers...');

// 1. If DOM is already loaded
if (document.readyState === 'loading') {
    console.log('🔧 DOM still loading, adding DOMContentLoaded listener');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔧 DOMContentLoaded triggered');
        initializeCookieConsent();
    });
} else {
    console.log('🔧 DOM already loaded, initializing immediately');
    initializeCookieConsent();
}

// 2. Also try on window load as backup
window.addEventListener('load', function() {
    console.log('🔧 Window load triggered');
    if (!cookieConsentInitialized) {
        console.log('🔧 Backup initialization on window load');
        initializeCookieConsent();
    }
});

// Add a manual trigger for debugging
window.debugCookieConsent = function() {
    console.log('🔧 Manual debug trigger');
    console.log('🔧 Initialized:', cookieConsentInitialized);
    initializeCookieConsent();
};

// Test function availability
console.log('🔧 Testing function availability:');
console.log('  - acceptAllCookies:', typeof window.acceptAllCookies);
console.log('  - declineCookies:', typeof window.declineCookies);
console.log('  - showCookieSettings:', typeof window.showCookieSettings);

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Main DOMContentLoaded handler triggered');
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
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

    // Add animation classes to elements when they come into view
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

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-card, .card, .timeline-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Contact Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            clearFormErrors();

            // Validate form
            if (validateContactForm()) {
                // Add loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                this.classList.add('loading');

                // Get form data
                const formData = new FormData(this);
                const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message')
                };

                // Send form data to backend
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

    // Form validation functions
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

    // Send contact form data to backend
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

            const result = await response.json();
            return result;
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

        // Add styles
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

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Make showNotification globally available
    window.showNotification = showNotification;

    // Navbar background on scroll
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

    // Final cookie consent check - run this last
    if (!cookieConsentInitialized) {
        console.log('🔧 Final cookie consent initialization check in DOMContentLoaded');
        setTimeout(() => {
            initializeCookieConsent();
        }, 100);
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
        // Fallback for older browsers
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

// Error handling for global errors
window.addEventListener('error', function(e) {
    console.error('❌ Global error:', e.error);
});

console.log('✅ Script.js fully loaded and initialized');