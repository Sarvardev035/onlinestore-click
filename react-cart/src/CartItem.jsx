import React from 'react';
import './CartItem.css';

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} className="cart-item-image" />
      
      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.title}</h4>
        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item-controls">
        <button
          className="qty-btn"
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
          title="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          max="999"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="qty-input"
        />
        <button
          className="qty-btn"
          onClick={handleIncrement}
          title="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="cart-item-total">
        <p>${itemTotal}</p>
      </div>

      <button
        className="btn-remove"
        onClick={() => onRemove(item.id)}
        title="Remove from cart"
      >
        ✕
      </button>
    </div>
  );
}

export default CartItem;
