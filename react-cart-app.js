// React Cart Application - Standalone Version
// Uses React CDN (no bundler needed)

const { useState, useEffect } = React;

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const itemTotal = (item.price * item.quantity).toFixed(2);

  return React.createElement('div', { className: 'cart-item' },
    React.createElement('img', { src: item.image, alt: item.title, className: 'cart-item-image' }),
    React.createElement('div', { className: 'cart-item-details' },
      React.createElement('h4', { className: 'cart-item-title' }, item.title),
      React.createElement('p', { className: 'cart-item-price' }, `$${item.price.toFixed(2)} each`)
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
        onChange: (e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10)),
        className: 'qty-input' 
      }),
      React.createElement('button', { 
        className: 'qty-btn', 
        onClick: handleIncrement,
        title: 'Increase quantity' 
      }, '+')
    ),
    React.createElement('div', { className: 'cart-item-total' },
      React.createElement('p', null, `$${itemTotal}`)
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

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return React.createElement('div', { className: 'cart-app' },
    React.createElement('div', { className: 'cart-header' },
      React.createElement('h3', null,
        'Items in Cart: ',
        React.createElement('span', { className: 'cart-badge' }, getTotalQuantity())
      )
    ),
    
    cart.length === 0 ? React.createElement('div', { className: 'empty-cart' },
      React.createElement('p', null, 'Your cart is empty'),
      React.createElement('p', { className: 'empty-cart-hint' }, 'Add items from the Products section to get started!')
    ) : React.createElement(React.Fragment, null,
      React.createElement(CartList, {
        items: cart,
        onRemove: removeFromCart,
        onUpdateQuantity: updateQuantity
      }),

      React.createElement('div', { className: 'cart-summary' },
        React.createElement('div', { className: 'summary-row' },
          React.createElement('span', null, 'Subtotal:'),
          React.createElement('span', null, `$${getTotalPrice().toFixed(2)}`)
        ),
        React.createElement('div', { className: 'summary-row' },
          React.createElement('span', null, 'Items:'),
          React.createElement('span', null, getTotalQuantity())
        ),
        React.createElement('div', { className: 'summary-row total' },
          React.createElement('span', null, 'Total:'),
          React.createElement('span', null, `$${getTotalPrice().toFixed(2)}`)
        )
      ),

      React.createElement('div', { className: 'cart-actions' },
        React.createElement('button', { className: 'btn btn-checkout' },
          'Proceed to Checkout'
        ),
        React.createElement('button', { className: 'btn btn-clear', onClick: clearCart },
          'Clear Cart'
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
