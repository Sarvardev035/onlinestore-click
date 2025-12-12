// React Cart Application - Standalone Version
// Uses React CDN (no bundler needed)
// Features: 20% Discount Timer, Live Price Updates

const { useState, useEffect } = React;

function DiscountTimer({ addedTime }) {
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [addedTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpiring = timeLeft < 300; // Less than 5 minutes

  return React.createElement('div', { 
    className: `discount-timer ${isExpiring ? 'expiring' : ''}` 
  },
    React.createElement('span', { className: 'discount-badge' }, '⚡ 20% OFF'),
    React.createElement('span', { className: 'timer-text' }, 
      `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    )
  );
}

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const discountRate = 0.20; // 20% discount
  const discountedPrice = item.price * (1 - discountRate);
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
      React.createElement('div', { className: 'cart-item-pricing' },
        React.createElement('span', { className: 'original-price' }, `$${item.price.toFixed(2)}`),
        React.createElement('span', { className: 'discounted-price' }, `$${discountedPrice.toFixed(2)}`),
        React.createElement('span', { className: 'savings' }, `Save $${savings}`)
      ),
      React.createElement(DiscountTimer, { addedTime: item.addedAt })
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
      React.createElement('p', { className: 'discounted-total' }, `$${itemTotal}`),
      React.createElement('p', { className: 'original-total' }, `Was $${originalTotal}`)
    ),
    React.createElement('button', { 
      className: 'btn-remove', 
      onClick: () => onRemove(item.id),
      title: 'Remove from cart' 
    }, '✕')
  );
}

function CartList({ items, onRemove, onUpdateQuantity }) {
  return React.createElement('div', { className: 'cart-list' },
    items.map(item => 
      React.createElement(CartItem, {
        key: item.id,
        item: item,
        onRemove: onRemove,
        onUpdateQuantity: onUpdateQuantity
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

  const clearCart = () => {
    setCart([]);
    saveCartToStorage([]);
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate discounted total price (20% off)
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = item.price * 0.8; // 20% discount
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  // Calculate original total before discount
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
      React.createElement('p', { className: 'empty-cart-hint' }, 'Add items from the Products section to see amazing 20% limited-time discounts!')
    ) : React.createElement(React.Fragment, null,
      React.createElement(CartList, {
        items: cart,
        onRemove: removeFromCart,
        onUpdateQuantity: updateQuantity
      }),

      React.createElement('div', { className: 'cart-summary' },
        React.createElement('div', { className: 'summary-row' },
          React.createElement('span', null, 'Original Total:'),
          React.createElement('span', { className: 'original-amount' }, `$${getOriginalTotal().toFixed(2)}`)
        ),
        React.createElement('div', { className: 'summary-row discount-row' },
          React.createElement('span', null, '⚡ Discount (20%):'),
          React.createElement('span', { className: 'discount-amount' }, `-$${getTotalSavings().toFixed(2)}`)
        ),
        React.createElement('div', { className: 'summary-row total' },
          React.createElement('span', null, 'Final Total:'),
          React.createElement('span', null, `$${getTotalPrice().toFixed(2)}`)
        ),
        React.createElement('p', { className: 'discount-message' }, '✨ Limited Time: 20% Off All Items for 20 Minutes!')
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
