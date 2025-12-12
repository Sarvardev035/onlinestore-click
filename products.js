// ============================================
// PRODUCTS.JS - Vanilla JavaScript
// Fetches and displays products from API
// ============================================

const PRODUCTS_API = 'https://fakestoreapi.com/products';
const PRODUCTS_CONTAINER = document.getElementById('products-container');
const CART_STORAGE_KEY = 'marketplace_cart';

// ============================================
// Fetch Products from API
// ============================================

async function fetchProducts() {
    try {
        PRODUCTS_CONTAINER.innerHTML = '<div class="loading">Loading products...</div>';
        const response = await fetch(PRODUCTS_API);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        PRODUCTS_CONTAINER.innerHTML = `
            <div class="error">
                <strong>Error loading products:</strong> ${error.message}
                <p>Please refresh the page to try again.</p>
            </div>
        `;
    }
}

// ============================================
// Display Products in DOM
// ============================================

function displayProducts(products) {
    PRODUCTS_CONTAINER.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        PRODUCTS_CONTAINER.appendChild(productCard);
    });
}

// ============================================
// Create Product Card Element
// ============================================

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found'">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price-container">
            <div class="product-price-label">Price:</div>
            <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
        <button class="btn btn-add-to-cart" data-product-id="${product.id}" data-product-title="${product.title}" data-product-price="${product.price}" data-product-image="${product.image}">
            Add to Cart
        </button>
    `;
    
    // Add click event to button
    const button = card.querySelector('.btn-add-to-cart');
    button.addEventListener('click', () => addToCart(product));
    
    return card;
}

// ============================================
// Cart Management
// ============================================

function addToCart(product) {
    // Get existing cart from localStorage
    let cart = getCartFromStorage();
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
            addedAt: new Date().toISOString() // Add timestamp for discount timer
        });
    }
    
    // Save cart to localStorage
    saveCartToStorage(cart);
    
    // Trigger custom event so React cart component updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    
    // Visual feedback
    showAddedNotification(product.title);
}

function getCartFromStorage() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        return [];
    }
}

function saveCartToStorage(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

// ============================================
// UI Feedback
// ============================================

function showAddedNotification(productTitle) {
    // Create and show a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 600;
    `;
    notification.textContent = `✓ Added to cart!`;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============================================
// CSS Animations
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
