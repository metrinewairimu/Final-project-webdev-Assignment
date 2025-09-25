// Contact page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForm();
    initializeFormAnimations();
}

// Contact form functionality with validation
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add real-time validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const formMessage = document.getElementById('formMessage');
    
    // Validate all fields
    const isValid = validateForm(form);
    
    if (isValid) {
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (in real implementation, this would send to server)
        setTimeout(() => {
            showFormMessage('Asante sana! Thank you for your message! Our Kenya travel experts will get back to you within 24 hours with personalized safari recommendations.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    } else {
        showFormMessage('Please correct the errors below and try again.', 'error');
    }
}

// Validate entire form
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const fieldType = field.type || field.tagName.toLowerCase();
    const value = field.value.trim();
    const errorElement = document.getElementById(field.name + 'Error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    // Email validation
    else if (fieldType === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
    }
    // Name validation
    else if (field.name === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long.';
    }
    // Message validation
    else if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Please tell us more about your Kenya travel plans (at least 10 characters).';
    }
    
    // Show/hide error message
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            field.style.borderColor = 'var(--error-500)';
        } else {
            errorElement.textContent = '';
            field.style.borderColor = 'var(--success-500)';
        }
    }
    
    return isValid;
}

// Clear field error styling
function clearFieldError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement && field.value.trim()) {
        field.style.borderColor = '';
    }
}

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form message
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
}

// Initialize form animations
function initializeFormAnimations() {
    // Animate form fields on focus
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            input.addEventListener('focus', () => {
                label.style.color = 'var(--primary-700)';
                label.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.color = '';
                    label.style.transform = '';
                }
            });
        }
    });
    
    // Animate contact info items
    animateContactInfo();
}

// Animate contact info items
function animateContactInfo() {
    const infoItems = document.querySelectorAll('.info-item');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });
    
    infoItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Handle character count for textarea
function addCharacterCount() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const charCountElement = document.createElement('div');
        charCountElement.className = 'char-count';
        charCountElement.style.textAlign = 'right';
        charCountElement.style.fontSize = '0.875rem';
        charCountElement.style.color = 'var(--neutral-500)';
        charCountElement.style.marginTop = 'var(--space-1)';
        
        messageField.parentNode.appendChild(charCountElement);
        
        messageField.addEventListener('input', function() {
            const count = this.value.length;
            charCountElement.textContent = `${count} characters`;
            
            if (count > 500) {
                charCountElement.style.color = 'var(--warning-500)';
            } else if (count > 1000) {
                charCountElement.style.color = 'var(--error-500)';
            } else {
                charCountElement.style.color = 'var(--neutral-500)';
            }
        });
    }
}

// Initialize character count
addCharacterCount();

// Auto-resize textarea
function initializeAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Initialize auto-resize
initializeAutoResize();

// Form field focus management
function initializeFocusManagement() {
    const formFields = document.querySelectorAll('input, select, textarea');
    
    formFields.forEach((field, index) => {
        field.addEventListener('keydown', function(e) {
            // Move to next field on Tab
            if (e.key === 'Tab' && !e.shiftKey && index < formFields.length - 1) {
                e.preventDefault();
                formFields[index + 1].focus();
            }
            // Move to previous field on Shift+Tab
            else if (e.key === 'Tab' && e.shiftKey && index > 0) {
                e.preventDefault();
                formFields[index - 1].focus();
            }
        });
    });
}

// Initialize focus management
initializeFocusManagement();

// Add form progress indicator
function addProgressIndicator() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const requiredFields = form.querySelectorAll('[required]');
    const progressBar = document.createElement('div');
    const progressFill = document.createElement('div');
    
    progressBar.className = 'form-progress';
    progressFill.className = 'form-progress-fill';
    
    progressBar.style.cssText = `
        width: 100%;
        height: 4px;
        background: var(--neutral-200);
        border-radius: 2px;
        margin-bottom: var(--space-4);
        overflow: hidden;
    `;
    
    progressFill.style.cssText = `
        height: 100%;
        background: var(--primary-700);
        width: 0%;
        transition: width 0.3s ease;
    `;
    
    progressBar.appendChild(progressFill);
    form.insertBefore(progressBar, form.firstChild);
    
    function updateProgress() {
        let filledFields = 0;
        requiredFields.forEach(field => {
            if (field.value.trim()) {
                filledFields++;
            }
        });
        
        const progress = (filledFields / requiredFields.length) * 100;
        progressFill.style.width = progress + '%';
    }
    
    requiredFields.forEach(field => {
        field.addEventListener('input', updateProgress);
    });
}

// Add progress indicator
addProgressIndicator();

// Export functions for global access
window.contactPage = {
    validateForm,
    validateField,
    showFormMessage
};