"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { cartItems } = useCart();
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side: Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Mini E-Shop
        </Link>

        {/* Right side: Products, Orders, Cart */}
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-800 hover:text-blue-600 transition font-medium"
          >
            Products
          </Link>

          <Link
            href="/orders"
            className="text-gray-800 hover:text-blue-600 transition font-medium"
          >
            Orders
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-800 hover:text-blue-600 transition" />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
