"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Loader from "../components/Loader";

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Loading products..." />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }
  if (products.length === 0) {
    return <p className="text-center mt-8 text-gray-600">No products available.</p>;
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onChooseOptions={() => setModalProduct(prod)}
          />
        ))}
      </div>

      {/* Modal for selecting variants/quantity */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
    </div>
  );
}
