// src/components/CartSideBar.jsx
import React, { useState, useEffect } from "react";
import "./CartSideBar.css";
import { Link } from "react-router-dom";

// ===== CUSTOM HOOK FOR CART STATE =====
export function useCartState() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("my-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist to localStorage on cart change
  useEffect(() => {
    localStorage.setItem("my-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => {
        const sameName = item.name === product.name;
        const sameSize = item.selectedSize === product.selectedSize;
        const samePieces = item.selectedPieces === product.selectedPieces;
        return sameName && sameSize && samePieces;
      });

      if (existingItemIndex !== -1) {
        const existingItem = prevCart[existingItemIndex];
        const unitPrice = product.price / product.quantity;
        const updatedQuantity = existingItem.quantity + product.quantity;

        const updatedItem = {
          ...existingItem,
          quantity: updatedQuantity,
          price: unitPrice * updatedQuantity,
        };

        return prevCart.map((item, i) =>
          i === existingItemIndex ? updatedItem : item
        );
      }

      return [...prevCart, { ...product }];
    });
  };

  const handleQuantityChange = (index, delta) => {
    setCart((prevCart) => {
      const item = prevCart[index];
      if (!item) return prevCart;

      const newQuantity = Number(item.quantity) + Number(delta);

      if (newQuantity <= 0) {
        return prevCart.filter((_, i) => i !== index);
      }

      const unitPrice = item.price / item.quantity;

      return prevCart.map((it, i) =>
        i === index
          ? { ...it, quantity: newQuantity, price: unitPrice * newQuantity }
          : it
      );
    });
  };

  const setItemQuantity = (index, newQty) => {
    setCart((prevCart) => {
      const item = prevCart[index];
      if (!item) return prevCart;

      const qty = Number(newQty);

      if (!Number.isFinite(qty)) return prevCart;

      if (qty <= 0) {
        return prevCart.filter((_, i) => i !== index);
      }

      const unitPrice = item.price / item.quantity;

      return prevCart.map((it, i) =>
        i === index ? { ...it, quantity: qty, price: unitPrice * qty } : it
      );
    });
  };

  const handleRemove = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const computeSubtotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("my-cart");
  };

  return {
    cart,
    addToCart,
    handleQuantityChange,
    setItemQuantity,
    handleRemove,
    computeSubtotal,
    clearCart,
  };
}

// ===== CART SIDEBAR COMPONENT =====
// Now driven entirely by props from the parent's useCartState() instance
// (instead of calling useCartState() again internally). This keeps a single
// source of truth for the cart, which matters now that the sidebar stays
// mounted at all times (needed for the slide-in/out animation) rather than
// being mounted/unmounted on open/close.
const CartSidebar = ({
  isOpen,
  onClose,
  cart = [],
  onQtyChange,
  onQtySet,
  onRemove,
  computeSubtotal,
}) => {
  return (
    <>
      {/* Dim backdrop, click to close */}
      <div
        className={`cart-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-sidebar-header">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-items-container">
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <ul className="cart-items">
              {cart.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.name} width="60" />

                  <div>
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-meta">Type/Size: {item.selectedSize}</p>

                    {/* Show Box Quantity only if available */}
                    {item.selectedPieces !== undefined ? (
                      <p className="cart-item-meta">Box Quantity: {item.selectedPieces}</p>
                    ) : (
                      item.note && <p className="cart-item-note">{item.note}</p>
                    )}

                    {/* Quantity controls */}
                    <div className="qty-controls">
                      <span>Qty:</span>

                      <button
                        className="qty-btn"
                        onClick={() => onQtyChange(index, -1)}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onQtySet(index, e.target.value)}
                        className="qty-input"
                      />

                      <button
                        className="qty-btn"
                        onClick={() => onQtyChange(index, +1)}
                      >
                        +
                      </button>
                    </div>

                    <button className="remove-btn" onClick={() => onRemove(index)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-total">
          {/* keep hidden if you want */}
          <p style={{ display: "none" }}>
            Subtotal: ₱{computeSubtotal ? computeSubtotal().toFixed(2) : "0.00"}
          </p>

          <Link to={cart.length === 0 ? "#" : "/order"}>
            <button
              className="checkout-btn"
              disabled={cart.length === 0}
              style={{
                opacity: cart.length === 0 ? 0.5 : 1,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Set Order
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;