"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export function useCart() {
  return useContext(CartContext);
}

// Provider component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // On mount, load from localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem("miniEshopCart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Persist cart changes to localStorage
  useEffect(() => {
    localStorage.setItem("miniEshopCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add an item to cart (if same product+variant exists, increase quantity)
  function addToCart(newItem) {
    setCartItems(prev => {
      const idx = prev.findIndex(
        i =>
          i.product_id === newItem.product_id &&
          JSON.stringify(i.variant) === JSON.stringify(newItem.variant)
      );
      if (idx > -1) {
        // merge quantities
        const updated = [...prev];
        updated[idx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  }

  // Remove an item (by index or matching product+variant)
  function removeFromCart(product_id, variant) {
    setCartItems(prev =>
      prev.filter(
        i =>
          !(
            i.product_id === product_id &&
            JSON.stringify(i.variant) === JSON.stringify(variant)
          )
      )
    );
  }

  // Update quantity for a specific item
  function updateQuantity(product_id, variant, quantity) {
    if (quantity < 1) return;
    setCartItems(prev => {
      return prev.map(i => {
        if (
          i.product_id === product_id &&
          JSON.stringify(i.variant) === JSON.stringify(variant)
        ) {
          return { ...i, quantity };
        }
        return i;
      });
    });
  }

  // Clear entire cart
  function clearCart() {
    setCartItems([]);
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
