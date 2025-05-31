"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/CartItem";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {cartItems.map((item, idx) => (
        <CartItem key={idx} item={item} />
      ))}

      <div className="mt-6 border-t pt-4 text-right">
        {/* Total on top-right */}
        <p className="text-xl font-semibold mb-4">Total: ₹{total.toFixed(2)}</p>

        {/* Buttons row */}
        <div className="flex justify-end gap-4">
          <button
            onClick={clearCart}
            className="flex items-center justify-center gap-2 w-40 text-red-600 border border-red-600 py-2 rounded hover:bg-red-50 transition text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>

          <Link
            href={`/checkout?items=${encodeURIComponent(JSON.stringify(cartItems))}`}
            className="w-40 text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>

    </div>
  );
}
