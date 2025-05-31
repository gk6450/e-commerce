"use client";

import React from "react";

export default function ProductCard({ product, onChooseOptions }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* Image Container: subtle gray behind the image */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details (still on white) */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.title}
        </h3>
        <p className="text-green-600 font-bold text-xl mt-2">
          ₹{parseFloat(product.price).toFixed(2)}
        </p>
      </div>

      {/* Choose Options Button */}
      <button
        onClick={() => onChooseOptions(product)}
        className="mt-auto bg-blue-600 text-white py-2 px-4 mx-4 mb-4 rounded-md text-sm font-medium text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        Choose Options
      </button>
    </div>
  );
}
