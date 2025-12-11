import React from 'react';
import CartItem from './CartItem';
import './CartList.css';

function CartList({ items, onRemove, onUpdateQuantity }) {
  return (
    <div className="cart-list">
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={onRemove}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}

export default CartList;
