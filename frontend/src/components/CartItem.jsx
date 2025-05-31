"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [inputValue, setInputValue] = useState(item.quantity.toString());

  const handleQtyChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) setInputValue(val);
  };

  const commitQtyChange = () => {
    const parsed = parseInt(inputValue, 10);
    const valid = !isNaN(parsed) && parsed > 0 ? parsed : 1;
    setInputValue(valid.toString());
    updateQuantity(item.product_id, item.variant, valid);
  };

  const handleDecrement = () => {
    const newQty = Math.max(1, item.quantity - 1);
    setInputValue(newQty.toString());
    updateQuantity(item.product_id, item.variant, newQty);
  };

  const handleIncrement = () => {
    const newQty = item.quantity + 1;
    setInputValue(newQty.toString());
    updateQuantity(item.product_id, item.variant, newQty);
  };
  console.log("image url", item);

  return (
    <div className="flex items-start justify-between py-4 border-t border-gray-200">
      <div className="flex gap-4">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-20 h-20 object-contain rounded border"
        />
        <div>
          <h3 className="font-medium text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600">
            {Object.entries(item.variant)
              .map(([k, v]) => `${capitalize(k)}: ${v}`)
              .join(" | ")}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Price: ₹{item.price.toFixed(2)}
          </p>
          <div className="flex items-center mt-2">
            <label className="text-sm mr-2">Qty:</label>
            <div className="flex items-center border rounded w-fit">
              <button
                onClick={handleDecrement}
                className="px-2 py-1 text-gray-700 hover:text-black"
              >
                <Minus size={14} />
              </button>
              <input
                type="text"
                className="w-10 text-center outline-none text-sm"
                value={inputValue}
                onChange={handleQtyChange}
                onBlur={commitQtyChange}
              />
              <button
                onClick={handleIncrement}
                className="px-2 py-1 text-gray-700 hover:text-black"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <p className="font-semibold text-lg">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => removeFromCart(item.product_id, item.variant)}
          className="text-red-500 text-sm mt-2 hover:underline flex items-center gap-1"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
