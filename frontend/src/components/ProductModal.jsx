"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function ProductModal({ product, onClose }) {
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const { addToCart } = useCart();
  const router = useRouter();

  // Initialize default variants
  useEffect(() => {
    if (product.variants && typeof product.variants === "object") {
      const defaultVar = {};
      Object.keys(product.variants).forEach((key) => {
        defaultVar[key] = product.variants[key][0];
      });
      setSelectedVariant(defaultVar);
    }
  }, [product]);

  const handleVariantChange = (key, value) => {
    setSelectedVariant((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      variant: selectedVariant,
      quantity,
      image_url: product.image_url // 👈 Add this
    });
    onClose(); // close modal
  };


  const handleBuyNow = () => {
    // send single product directly to checkout
    const vStr = encodeURIComponent(JSON.stringify(selectedVariant));
    router.push(
      `/checkout?productId=${product.id}&variant=${vStr}&quantity=${quantity}`
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-200/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Choose Options</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex justify-center">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-auto max-w-sm object-contain"
            />
          </div>
          <div className="md:w-1/2 flex flex-col">
            <h3 className="text-2xl font-semibold mb-2">{product.title}</h3>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-green-600 mb-4">
              ₹{parseFloat(product.price).toFixed(2)}
            </p>

            {/* Variant selectors */}
            {product.variants &&
              Object.keys(product.variants).map((key) => (
                <div key={key} className="mb-3">
                  <label className="block text-gray-800 font-medium mb-1 capitalize">
                    {key}
                  </label>
                  <select
                    className="border rounded p-2 w-full"
                    value={selectedVariant[key] || ""}
                    onChange={(e) => handleVariantChange(key, e.target.value)}
                  >
                    {product.variants[key].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-1">Quantity</label>
              <div className="flex items-center border rounded w-fit">
                <button
                  onClick={() => {
                    const newQty = Math.max(1, quantity - 1);
                    setQuantity(newQty);
                    setQuantityInput(newQty.toString());
                  }}
                  className="px-3 py-1 text-lg font-bold text-gray-700 hover:text-black"
                >
                  −
                </button>
                <input
                  type="text"
                  className="w-12 text-center outline-none"
                  value={quantityInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for smooth editing
                    if (/^\d*$/.test(val)) {
                      setQuantityInput(val);
                    }
                  }}
                  onBlur={() => {
                    const parsed = parseInt(quantityInput, 10);
                    const valid = !isNaN(parsed) && parsed >= 1 ? parsed : 1;
                    setQuantity(valid);
                    setQuantityInput(valid.toString());
                  }}
                />
                <button
                  onClick={() => {
                    const newQty = quantity + 1;
                    setQuantity(newQty);
                    setQuantityInput(newQty.toString());
                  }}
                  className="px-3 py-1 text-lg font-bold text-gray-700 hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
