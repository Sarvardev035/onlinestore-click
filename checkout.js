// ============================================
// CHECKOUT.JS - Pure Vanilla JavaScript
// Handles delivery form, address, contact, and payment details
// with real-time validation and autocomplete
// ============================================

// List of common countries and cities for autocomplete
const COUNTRIES_LIST = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'India', 'Japan', 'China', 'Brazil',
    'Mexico', 'Russia', 'South Korea', 'Netherlands', 'Switzerland',
    'Sweden', 'Norway', 'Denmark', 'Belgium', 'Austria', 'Poland',
    'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Philippines',
    'Vietnam', 'Pakistan', 'Bangladesh', 'Nigeria', 'Egypt', 'UAE',
    'Saudi Arabia', 'Israel', 'Turkey', 'Greece', 'Portugal', 'Ireland'
];

const CITIES_LIST = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Toronto', 'Vancouver', 'Montreal', 'London', 'Manchester',
    'Sydney', 'Melbourne', 'Berlin', 'Munich', 'Paris', 'Lyon',
    'Madrid', 'Barcelona', 'Rome', 'Milan', 'Delhi', 'Mumbai',
    'Tokyo', 'Osaka', 'Shanghai', 'Beijing', 'Rio de Janeiro',
    'Sao Paulo', 'Mexico City', 'Moscow', 'Seoul', 'Amsterdam',
    'Zurich', 'Stockholm', 'Oslo', 'Copenhagen', 'Brussels', 'Vienna',
    'Warsaw', 'Singapore', 'Bangkok', 'Jakarta', 'Manila', 'Ho Chi Minh City'
];

// Validation Rules
const VALIDATION_RULES = {
    fullName: {
        validate: (value) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters',
        pattern: /^[a-zA-Z\s]{2,}$/
    },
    phone: {
        validate: (value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 7 && digits.length <= 15;
        },
        message: 'Phone must have 7-15 digits (e.g., +1 (555) 123-4567)',
        pattern: /^[\d\s\-\+\(\)\.]{7,}$/
    },
    email: {
        validate: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        message: 'Enter valid email (example@domain.com)',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    street: {
        validate: (value) => value.trim().length >= 3,
        message: 'Street address must be at least 3 characters',
        pattern: /^[a-zA-Z0-9\s,\.#-]{3,}$/
    },
    city: {
        validate: (value) => value.trim().length >= 2,
        message: 'City must be at least 2 characters',
        pattern: /^[a-zA-Z\s\-]{2,}$/
    },
    state: {
        validate: (value) => value.trim().length >= 2,
        message: 'State/Province must be at least 2 characters',
        pattern: /^[a-zA-Z\s]{2,}$/
    },
    zip: {
        validate: (value) => value.trim().length >= 3,
        message: 'ZIP code must be at least 3 characters',
        pattern: /^[a-zA-Z0-9\s\-]{3,}$/
    },
    country: {
        validate: (value) => value.trim().length >= 2,
        message: 'Country must be at least 2 characters',
        pattern: /^[a-zA-Z\s\-]{2,}$/
    }
};

// DOM Elements
const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const closeCheckoutBtn = document.getElementById('close-checkout');
const cancelCheckoutBtn = document.getElementById('cancel-checkout');

// Storage key for checkout data
const CHECKOUT_STORAGE_KEY = 'marketplace_checkout';

// ============================================
// Open/Close Modal
// ============================================

function openCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.classList.remove('hidden');
    loadCheckoutData();
    initializeFieldValidation();
}

function closeCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.classList.add('hidden');
}

// ============================================
// Form Event Listeners
// ============================================

if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
}

if (cancelCheckoutBtn) {
    cancelCheckoutBtn.addEventListener('click', closeCheckoutModal);
}

// Close modal when clicking outside the form
if (checkoutModal) {
    checkoutModal.addEventListener('click', function(event) {
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    });
}

// ============================================
// Real-time Field Validation & Autocomplete
// ============================================

function initializeFieldValidation() {
    const validatedFields = document.querySelectorAll('[data-validation]');
    
    validatedFields.forEach(field => {
        // Real-time validation on input
        field.addEventListener('input', function() {
            validateField(this);
        });

        // Blur for final validation
        field.addEventListener('blur', function() {
            validateField(this);
        });

        // Autocomplete for city and country
        if (field.id === 'city') {
            field.addEventListener('input', showCitySuggestions);
        }
        if (field.id === 'country') {
            field.addEventListener('input', showCountrySuggestions);
        }
    });
}

// ============================================
// Form Submission
// ============================================

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleCheckoutSubmit();
    });
}

function handleCheckoutSubmit() {
    // Validate all fields first
    if (!validateAllFields()) {
        showError('Please fix errors in the form before submitting');
        return;
    }

    // Collect form data
    const formData = {
        fullName: document.getElementById('full-name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        street: document.getElementById('street').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        zip: document.getElementById('zip').value.trim(),
        country: document.getElementById('country').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        paymentType: document.querySelector('input[name="paymentType"]:checked').value,
        orderDate: new Date().toISOString()
    };

    // Validate form data
    if (!validateCheckoutData(formData)) {
        return;
    }

    // Save checkout data to localStorage
    saveCheckoutData(formData);

    // Log order summary
    logOrderSummary(formData);

    // Show confirmation and refresh
    showOrderConfirmation(formData);
}

// ============================================
// Validation
// ============================================

function validateCheckoutData(data) {
    // Validate payment type
    if (!data.paymentType) {
        showError('Payment method must be selected');
        return false;
    }

    return true;
}

function showCitySuggestions(event) {
    const input = event.target;
    const value = input.value.toLowerCase().trim();
    const suggestionsDiv = document.getElementById('city-suggestions');

    if (!suggestionsDiv) return;

    if (value.length < 1) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
        return;
    }

    const filtered = CITIES_LIST.filter(city =>
        city.toLowerCase().startsWith(value)
    ).slice(0, 5);

    if (filtered.length === 0) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
        return;
    }

    suggestionsDiv.innerHTML = filtered.map(city => 
        `<div class="suggestion-item" data-value="${city}">${city}</div>`
    ).join('');
    suggestionsDiv.classList.add('show');

    // Add click listeners
    suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            input.value = this.getAttribute('data-value');
            suggestionsDiv.innerHTML = '';
            suggestionsDiv.classList.remove('show');
            validateField(input);
        });
    });
}

function showCountrySuggestions(event) {
    const input = event.target;
    const value = input.value.toLowerCase().trim();
    const suggestionsDiv = document.getElementById('country-suggestions');

    if (!suggestionsDiv) return;

    if (value.length < 1) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
        return;
    }

    const filtered = COUNTRIES_LIST.filter(country =>
        country.toLowerCase().startsWith(value)
    ).slice(0, 5);

    if (filtered.length === 0) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
        return;
    }

    suggestionsDiv.innerHTML = filtered.map(country => 
        `<div class="suggestion-item" data-value="${country}">${country}</div>`
    ).join('');
    suggestionsDiv.classList.add('show');

    // Add click listeners
    suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            input.value = this.getAttribute('data-value');
            suggestionsDiv.innerHTML = '';
            suggestionsDiv.classList.remove('show');
            validateField(input);
        });
    });
}

// ============================================
// Storage Management
// ============================================

function saveCheckoutData(data) {
    try {
        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving checkout data:', error);
        showError('Failed to save checkout data. Please try again.');
    }
}

function loadCheckoutData() {
    try {
        const savedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            populateFormFields(data);
        }
    } catch (error) {
        console.error('Error loading checkout data:', error);
    }
}

function populateFormFields(data) {
    const fields = {
        'full-name': data.fullName,
        'phone': data.phone,
        'email': data.email,
        'street': data.street,
        'city': data.city,
        'state': data.state,
        'zip': data.zip,
        'country': data.country,
        'notes': data.notes
    };

    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = fields[fieldId] || '';
        }
    });

    if (data.paymentType) {
        const paymentInput = document.querySelector(`input[name="paymentType"][value="${data.paymentType}"]`);
        if (paymentInput) {
            paymentInput.checked = true;
        }
    }
}

// ============================================
// Notifications & Feedback
// ============================================

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'checkout-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="close-error" type="button">&times;</button>
    `;

    // Insert at top of form
    const form = document.getElementById('checkout-form');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(errorDiv, form);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);

    // Close button handler
    const closeBtn = errorDiv.querySelector('.close-error');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            errorDiv.remove();
        });
    }
}

function showOrderConfirmation(data) {
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'checkout-success';
    confirmDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Order Confirmed! ✓</h3>
            <p>Thank you, <strong>${data.fullName}</strong>!</p>
            <p>Your order will be delivered to:</p>
            <p class="address-summary">
                ${data.street}<br>
                ${data.city}, ${data.state} ${data.zip}<br>
                ${data.country}
            </p>
            <p class="contact-summary">
                <strong>Phone:</strong> ${data.phone}<br>
                <strong>Email:</strong> ${data.email}
            </p>
            <p class="payment-summary">
                <strong>Payment Method:</strong> ${formatPaymentType(data.paymentType)}
            </p>
            <p class="refresh-message">Refreshing page in 3 seconds...</p>
        </div>
    `;

    document.body.appendChild(confirmDiv);

    // Clear cart after successful order
    clearCartData();

    // Refresh page after 3 seconds
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}

function logOrderSummary(data) {
    const cart = getCartFromStorage();
    const cartTotal = cart.reduce((total, item) => {
        const rate = item.discountPercent ? (1 - item.discountPercent / 100) : 1;
        return total + (item.price * rate * item.quantity);
    }, 0);

    console.log('=== ORDER SUMMARY ===');
    console.log('Customer:', data.fullName);
    console.log('Phone:', data.phone);
    console.log('Email:', data.email);
    console.log('Delivery Address:', `${data.street}, ${data.city}, ${data.state} ${data.zip}, ${data.country}`);
    console.log('Delivery Notes:', data.notes || 'None');
    console.log('Payment Method:', formatPaymentType(data.paymentType));
    console.log('Order Date:', new Date(data.orderDate).toLocaleString());
    console.log('Cart Items:', cart.length);
    console.log('Total Amount:', `$${cartTotal.toFixed(2)}`);
    console.log('====================');
}

// ============================================
// Utility Functions
// ============================================

function formatPaymentType(type) {
    const paymentTypeMap = {
        'credit-card': 'Credit Card (Visa/Mastercard)',
        'debit-card': 'Debit Card',
        'paypal': 'PayPal',
        'bank-transfer': 'Bank Transfer',
        'cash-on-delivery': 'Cash on Delivery'
    };
    return paymentTypeMap[type] || type;
}

function getCartFromStorage() {
    try {
        const cart = localStorage.getItem('marketplace_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        return [];
    }
}

function clearCartData() {
    try {
        localStorage.removeItem('marketplace_cart');
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}

// ============================================
// Integration with React Cart
// ============================================

// Patch the React app's checkout button to open modal instead of default behavior
document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for React to render
    setTimeout(function() {
        // Find all checkout buttons
        const checkoutButtons = document.querySelectorAll('.btn-checkout');
        checkoutButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openCheckoutModal();
            });
        });
    }, 500);
});

// Watch for new checkout buttons added to the DOM (in case cart items change)
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            const checkoutButtons = mutation.target.querySelectorAll('.btn-checkout:not([data-checkout-handler])');
            checkoutButtons.forEach(button => {
                button.setAttribute('data-checkout-handler', 'true');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openCheckoutModal();
                });
            });
        }
    });
});

if (document.getElementById('react-cart-root')) {
    observer.observe(document.getElementById('react-cart-root'), {
        childList: true,
        subtree: true
    });
}
