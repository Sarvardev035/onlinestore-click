import React, { useState, useEffect } from 'react';
import CartList from './CartList';
import './App.css';

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

  return (
    <div className="cart-app">
      <div className="cart-header">
        <h3>Items in Cart: <span className="cart-badge">{getTotalQuantity()}</span></h3>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p className="empty-cart-hint">Add items from the Products section to get started!</p>
        </div>
      ) : (
        <>
          <CartList
            items={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Items:</span>
              <span>{getTotalQuantity()}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            <button className="btn btn-checkout">
              Proceed to Checkout
            </button>
            <button className="btn btn-clear" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
