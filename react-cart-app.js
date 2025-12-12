// React Cart Application - Standalone Version
// Uses React CDN (no bundler needed)
// Features: 20% Discount Timer, Live Price Updates

const { useState, useEffect } = React;

function DiscountTimer({ addedTime, itemId, onExpire }) {
  const DURATION = 20 * 60; // 20 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!addedTime) return 0;
    const elapsed = Math.floor((Date.now() - Date.parse(addedTime)) / 1000);
    return Math.max(0, DURATION - elapsed);
  });
  const expiredCalledRef = React.useRef(false);

  useEffect(() => {
    const tick = () => {
      setTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [addedTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpiring = timeLeft < 300 && timeLeft > 0; // Less than 5 minutes

  // Call onExpire once when timeLeft reaches zero
  useEffect(() => {
    if (timeLeft === 0 && onExpire && !expiredCalledRef.current) {
      expiredCalledRef.current = true;
      try {
        onExpire(itemId);
      } catch (e) {
        console.error('onExpire callback error', e);
      }
    }
  }, [timeLeft, onExpire, itemId]);

  return React.createElement('div', { 
    className: `discount-timer ${isExpiring ? 'expiring' : ''}` 
  },
    React.createElement('span', { className: 'timer-text' }, 
      timeLeft > 0 ? `${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : 'Expired'
    )
  );
}

function CartItem({ item, onRemove, onUpdateQuantity, onExpire }) {
  const discountRate = item.discountPercent ? (item.discountPercent / 100) : 0;
  const discountedPrice = +(item.price * (1 - discountRate));
  const savings = (item.price - discountedPrice).toFixed(2);
  const itemTotal = (discountedPrice * item.quantity).toFixed(2);
  const originalTotal = (item.price * item.quantity).toFixed(2);

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return React.createElement('div', { className: 'cart-item' },
    React.createElement('img', { src: item.image, alt: item.title, className: 'cart-item-image' }),
    React.createElement('div', { className: 'cart-item-details' },
      React.createElement('h4', { className: 'cart-item-title' }, item.title),
      React.createElement('div', { className: 'price-row' },
        React.createElement('div', { className: 'price-section original-section' },
          React.createElement('span', { className: 'price-label' }, 'Original:'),
          React.createElement('span', { className: 'original-price' }, `$${item.price.toFixed(2)}`)
        ),
        discountRate > 0 && React.createElement('div', { className: 'price-section discount-section' },
          React.createElement('span', { className: 'price-label discount-label' }, 'Sale:'),
          React.createElement('span', { className: 'discounted-price' }, `$${discountedPrice.toFixed(2)}`)
        )
      ),
      discountRate > 0 && React.createElement('div', { className: 'savings-info' },
        React.createElement('span', { className: 'discount-percent' }, `${item.discountPercent}% OFF`),
        React.createElement('span', { className: 'savings-amount' }, `Save $${savings}`)
      ),
      React.createElement(DiscountTimer, { addedTime: item.addedAt, itemId: item.id, onExpire: onExpire })
    ),
    React.createElement('div', { className: 'cart-item-controls' },
      React.createElement('button', { 
        className: 'qty-btn', 
        onClick: handleDecrement, 
        disabled: item.quantity <= 1,
        title: 'Decrease quantity' 
      }, '−'),
      React.createElement('input', { 
        type: 'number', 
        min: '1', 
        max: '999', 
        value: item.quantity, 
        onChange: (e) => {
          const val = parseInt(e.target.value, 10);
          if (val > 0) onUpdateQuantity(item.id, val);
        },
        className: 'qty-input' 
      }),
      React.createElement('button', { 
        className: 'qty-btn', 
        onClick: handleIncrement,
        title: 'Increase quantity' 
      }, '+')
    ),
    React.createElement('div', { className: 'cart-item-total' },
      React.createElement('div', { className: 'total-section' },
        React.createElement('span', { className: 'total-label' }, 'Total:'),
        React.createElement('span', { className: 'discounted-total' }, `$${itemTotal}`)
      ),
      discountRate > 0 ? React.createElement('span', { className: 'original-total' }, `Was $${originalTotal}`) : null
    ),
    React.createElement('button', { 
      className: 'btn-remove', 
      onClick: () => onRemove(item.id),
      title: 'Remove from cart' 
    }, '✕')
  );
}

function CartList({ items, onRemove, onUpdateQuantity, onExpire }) {
  return React.createElement('div', { className: 'cart-list' },
    items.map(item => 
      React.createElement(CartItem, {
        key: item.id,
        item: item,
        onRemove: onRemove,
        onUpdateQuantity: onUpdateQuantity,
        onExpire: onExpire
      })
    )
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const CART_STORAGE_KEY = 'marketplace_cart';

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Listen for cart updates from vanilla JS products.js
  useEffect(() => {
    const handleCartUpdate = (event) => {
      setCart(event.detail);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  const saveCartToStorage = (updatedCart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      const updatedCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      saveCartToStorage(updatedCart);
    }
  };

  // When a discount expires for an item, remove its discountPercent
  const expireDiscount = (productId) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const copy = { ...item };
        delete copy.discountPercent;
        return copy;
      }
      return item;
    });
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    saveCartToStorage([]);
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate totals using per-item discountPercent when present
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const rate = item.discountPercent ? (1 - item.discountPercent / 100) : 1;
      const discountedPrice = item.price * rate;
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  // Calculate original total before discounts
  const getOriginalTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalSavings = () => {
    return getOriginalTotal() - getTotalPrice();
  };

  return React.createElement('div', { className: 'cart-app' },
    React.createElement('div', { className: 'cart-header' },
      React.createElement('h3', null,
        '🛒 Shopping Cart ',
        React.createElement('span', { className: 'cart-badge' }, getTotalQuantity())
      )
    ),
    
    cart.length === 0 ? React.createElement('div', { className: 'empty-cart' },
      React.createElement('p', null, '🛒 Your cart is empty'),
      React.createElement('p', { className: 'empty-cart-hint' }, 'Add items from the Products section to get limited-time discounts (2–10%)!')
    ) : React.createElement(React.Fragment, null,
      React.createElement(CartList, {
        items: cart,
        onRemove: removeFromCart,
        onUpdateQuantity: updateQuantity,
        onExpire: expireDiscount
      }),

      React.createElement('div', { className: 'cart-summary' },
        React.createElement('div', { className: 'summary-row' },
          React.createElement('span', null, 'Original Total:'),
          React.createElement('span', { className: 'original-amount' }, `$${getOriginalTotal().toFixed(2)}`)
        ),
          React.createElement('div', { className: 'summary-row discount-row' },
            React.createElement('span', null, '⚡ Discounts:'),
            React.createElement('span', { className: 'discount-amount' }, `-$${getTotalSavings().toFixed(2)}`)
          ),
        React.createElement('div', { className: 'summary-row total' },
          React.createElement('span', null, 'Final Total:'),
          React.createElement('span', null, `$${getTotalPrice().toFixed(2)}`)
        ),
          React.createElement('p', { className: 'discount-message' }, '✨ Limited-time discounts (2–10%) per item for 20 minutes')
      ),

      React.createElement('div', { className: 'cart-actions' },
        React.createElement('button', { className: 'btn btn-checkout' },
          '✓ Proceed to Checkout'
        ),
        React.createElement('button', { className: 'btn btn-clear', onClick: clearCart },
          '🗑️ Clear Cart'
        )
      )
    )
  );
}

// Mount React app
const container = document.getElementById('react-cart-root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(App));
}
