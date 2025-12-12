// ============================================
// NAVIGATION.JS - Modern Navigation Features
// Handles: Nav links, Account registration, Help tooltip
// ============================================

let allProducts = []; // Store all products for filtering
let currentFilter = 'all'; // Track current filter

// ============================================
// Initialize Navigation
// ============================================

function initializeNavigation() {
    setupNavigationLinks();
    setupAccountButton();
    setupHelpTooltip();
    setupSearchFunctionality();
}

// ============================================
// Navigation Links - Product Filtering
// ============================================

function setupNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active state from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active state to clicked link
            link.classList.add('active');
            
            // Get filter type
            const filterText = link.textContent.toLowerCase();
            
            if (filterText.includes('home')) {
                currentFilter = 'all';
                displayProducts(allProducts);
            } else if (filterText.includes('hot deals')) {
                currentFilter = 'hot-deals';
                filterAndDisplayHotDeals();
            } else if (filterText.includes('best sellers')) {
                currentFilter = 'best-sellers';
                filterAndDisplayBestSellers();
            } else if (filterText.includes('free shipping')) {
                currentFilter = 'free-shipping';
                filterAndDisplayFreeShipping();
            }
            
            // Show filtered products with animation
            const container = document.getElementById('products-container');
            container.style.opacity = '0.5';
            setTimeout(() => {
                container.style.opacity = '1';
            }, 300);
        });
    });
}

// Filter: Hot Deals (show products with discounts)
function filterAndDisplayHotDeals() {
    const hotDealProducts = allProducts.filter((product, index) => {
        // Show products at indices: 1, 3, 5, 7, 9 (every other)
        return index % 2 === 1;
    });
    
    if (hotDealProducts.length > 0) {
        displayFilteredProducts(hotDealProducts, '🔥 Hot Deals - Up to 40% Off');
    } else {
        document.getElementById('products-container').innerHTML = '<div class="loading">No hot deals available</div>';
    }
}

// Filter: Best Sellers (show top rated products)
function filterAndDisplayBestSellers() {
    const bestSellers = allProducts
        .map(product => ({
            ...product,
            rating: product.rating?.rate || 0
        }))
        .filter(product => product.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating);
    
    if (bestSellers.length > 0) {
        displayFilteredProducts(bestSellers, '⭐ Best Sellers - Highest Rated');
    } else {
        document.getElementById('products-container').innerHTML = '<div class="loading">No best sellers available</div>';
    }
}

// Filter: Free Shipping (alternate products with free shipping badge)
function filterAndDisplayFreeShipping() {
    const freeShippingProducts = allProducts.filter((product, index) => {
        // Show products at indices: 0, 2, 4, 6, 8 (every other starting from 0)
        return index % 2 === 0;
    });
    
    if (freeShippingProducts.length > 0) {
        displayFilteredProducts(freeShippingProducts, '🚚 Free Shipping - No minimum order');
    } else {
        document.getElementById('products-container').innerHTML = '<div class="loading">No free shipping products available</div>';
    }
}

// Display filtered products with category header
function displayFilteredProducts(products, categoryTitle) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    // Add category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    categoryHeader.innerHTML = `<h3>${categoryTitle}</h3>`;
    container.appendChild(categoryHeader);
    
    // Add products
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// ============================================
// Account Registration Modal
// ============================================

function setupAccountButton() {
    const accountBtn = document.querySelector('[title="User Account"]');
    
    if (accountBtn) {
        accountBtn.addEventListener('click', openAccountModal);
    }
}

function openAccountModal() {
    // Check if modal already exists
    let modal = document.getElementById('account-modal');
    
    if (!modal) {
        modal = createAccountModal();
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
}

function createAccountModal() {
    const modal = document.createElement('div');
    modal.id = 'account-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content account-modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-user-plus"></i> Create Account</h2>
                <button class="close-btn">&times;</button>
            </div>
            
            <form class="account-form">
                <div class="form-group">
                    <label for="acc-name"><i class="fas fa-user"></i> Full Name</label>
                    <input type="text" id="acc-name" placeholder="John Doe" required>
                    <span class="field-tip">Enter your full name (minimum 3 characters)</span>
                </div>
                
                <div class="form-group">
                    <label for="acc-email"><i class="fas fa-envelope"></i> Gmail Address</label>
                    <input type="email" id="acc-email" placeholder="your.email@gmail.com" required>
                    <span class="field-tip">We'll use this to send order updates and promotions</span>
                </div>
                
                <div class="form-group">
                    <label for="acc-phone"><i class="fas fa-phone"></i> Phone Number</label>
                    <input type="tel" id="acc-phone" placeholder="+1 (555) 123-4567">
                    <span class="field-tip">Optional: For delivery purposes</span>
                </div>
                
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" checked>
                        <span>Subscribe to promotions and exclusive deals</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" checked>
                        <span>Agree to terms and conditions</span>
                    </label>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                    <i class="fas fa-check-circle"></i> Create Account
                </button>
            </form>
        </div>
    `;
    
    // Close button handler
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Form submission
    const form = modal.querySelector('.account-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('acc-name').value;
        const email = document.getElementById('acc-email').value;
        const phone = document.getElementById('acc-phone').value;
        
        // Validate
        if (!name || name.length < 3) {
            alert('Please enter a valid name (minimum 3 characters)');
            return;
        }
        
        if (!email.includes('@gmail.com')) {
            alert('Please use a Gmail address');
            return;
        }
        
        // Save to localStorage
        const accountData = {
            name: name,
            email: email,
            phone: phone,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('marketplace_account', JSON.stringify(accountData));
        
        // Show success message
        showAccountSuccess(email);
        
        // Close modal after 2 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 2000);
    });
    
    return modal;
}

function showAccountSuccess(email) {
    const form = document.querySelector('.account-form');
    form.innerHTML = `
        <div class="success-message">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Account Created Successfully!</h3>
            <p>Welcome! We've sent a confirmation email to:</p>
            <p style="color: #ff6b35; font-weight: 600; word-break: break-all;">${email}</p>
            <p style="font-size: 0.85rem; color: #999; margin-top: 1rem;">
                You can now track your orders and enjoy exclusive deals
            </p>
        </div>
    `;
}

// ============================================
// Help Tooltip - Product & Sale Information
// ============================================

function setupHelpTooltip() {
    const helpBtn = document.querySelector('[title="Help"]');
    
    if (helpBtn) {
        helpBtn.addEventListener('mouseenter', showHelpTooltip);
        helpBtn.addEventListener('mouseleave', hideHelpTooltip);
        helpBtn.addEventListener('click', openHelpModal);
    }
}

function showHelpTooltip() {
    let tooltip = document.getElementById('help-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'help-tooltip';
        tooltip.className = 'help-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <div class="tooltip-item">
                <i class="fas fa-tags"></i>
                <span><strong>50+ Products</strong> on sale today</span>
            </div>
            <div class="tooltip-item">
                <i class="fas fa-percentage"></i>
                <span><strong>Up to 40%</strong> discount on selected items</span>
            </div>
            <div class="tooltip-item">
                <i class="fas fa-shipping-fast"></i>
                <span><strong>Free shipping</strong> on orders over $50</span>
            </div>
            <div class="tooltip-item">
                <i class="fas fa-star"></i>
                <span><strong>4.5★ Average</strong> rating from 10K+ reviews</span>
            </div>
            <div class="tooltip-footer">
                Click for more info
            </div>
        </div>
    `;
    
    tooltip.style.display = 'block';
    tooltip.style.opacity = '0';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
}

function hideHelpTooltip() {
    const tooltip = document.getElementById('help-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 300);
    }
}

function openHelpModal() {
    let modal = document.getElementById('help-modal');
    
    if (!modal) {
        modal = createHelpModal();
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    hideHelpTooltip();
}

function createHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'help-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content help-modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> About Our Store</h2>
                <button class="close-btn">&times;</button>
            </div>
            
            <div class="help-content">
                <div class="help-section">
                    <h3><i class="fas fa-fire"></i> Current Sales & Offers</h3>
                    <ul class="help-list">
                        <li><strong>🔥 Hot Deals Section:</strong> Rotating daily deals with up to 40% discount</li>
                        <li><strong>⭐ Best Sellers:</strong> Most popular products with 4+ star ratings</li>
                        <li><strong>🚚 Free Shipping:</strong> Free delivery on select items with no minimum</li>
                        <li><strong>💳 20% Discount Timer:</strong> Each item gets 2-10% off for 20 minutes after adding to cart</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h3><i class="fas fa-boxes"></i> Product Information</h3>
                    <ul class="help-list">
                        <li><strong>Categories:</strong> Electronics, Clothing, Home & Garden, More</li>
                        <li><strong>Quality Assurance:</strong> All products verified and authentic</li>
                        <li><strong>Stock Availability:</strong> Real-time inventory from trusted suppliers</li>
                        <li><strong>Ratings:</strong> Customer reviews with verified purchases</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h3><i class="fas fa-headset"></i> Customer Support</h3>
                    <ul class="help-list">
                        <li><strong>Live Chat:</strong> Available 24/7 for quick assistance</li>
                        <li><strong>Email Support:</strong> support@onlinestoreclick.com</li>
                        <li><strong>Return Policy:</strong> 30-day return guarantee on all items</li>
                        <li><strong>Secure Payment:</strong> 100% secure checkout with SSL encryption</li>
                    </ul>
                </div>
                
                <div class="help-section" style="background: rgba(255, 107, 53, 0.1); border-left: 4px solid #ff6b35;">
                    <h3><i class="fas fa-bell"></i> Special Promotion</h3>
                    <p>🎉 Sign up for an account to unlock:</p>
                    <ul class="help-list">
                        <li>✨ Exclusive member-only deals</li>
                        <li>🎁 Birthday special discounts</li>
                        <li>⭐ VIP early access to flash sales</li>
                        <li>📦 Faster checkout with saved addresses</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    return modal;
}

// ============================================
// Search Functionality
// ============================================

function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        currentFilter = 'all';
        displayProducts(allProducts);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link').classList.add('active');
        return;
    }
    
    const results = allProducts.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        displayFilteredProducts(results, `🔍 Search Results for "${query}" (${results.length} found)`);
    } else {
        document.getElementById('products-container').innerHTML = `
            <div class="loading" style="grid-column: 1/-1;">
                <p>No products found for "${query}"</p>
                <p style="font-size: 0.9rem; color: #999;">Try searching with different keywords</p>
            </div>
        `;
    }
}

// ============================================
// Store all products for filtering
// ============================================

function storeAllProducts(products) {
    allProducts = products;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeNavigation);
