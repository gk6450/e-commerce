"use client";

import { useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";

export default function OrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setOrders([]);
    setError("");

    try {
      // 1) Fetch all orders
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      const allOrders = res.data;

      // 2) Filter by phone
      const filtered = allOrders.filter((order) => order.phone === phone.trim());
      if (filtered.length === 0) {
        setError("No orders found for this phone number.");
      } else {
        setOrders(filtered);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching orders.");
    }

    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-0.5 text-xs font-medium rounded";
    switch (status) {
      case "approved":
        return (
          <span className={`${base} bg-green-100 text-green-800`}>
            Approved
          </span>
        );
      case "declined":
        return (
          <span className={`${base} bg-red-100 text-red-800`}>
            Declined
          </span>
        );
      case "error":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800`}>
            Error
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  const formatVariant = (variant) => {
    if (!variant || typeof variant !== "object") return "";
    return Object.entries(variant)
      .map(([key, val]) => `${capitalize(key)}: ${val}`)
      .join(" | ");
  };

  const calculateSubtotal = (items) => {
    return items.reduce(
      (sum, itm) => sum + parseFloat(itm.price) * itm.quantity,
      0
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* ─── Page Heading ────────────────────────────────────────────────────────── */}
      <h1 className="text-3xl font-semibold text-center mb-8">Check Your Orders</h1>

      {/* ─── Phone Input / Button ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="tel"
          placeholder="Enter your phone number"
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={fetchOrders}
          disabled={!phone.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          View Orders
        </button>
      </div>

      {/* ─── Loading / Error Message ──────────────────────────────────────────────── */}
      {loading && 
        <div className="flex items-center justify-center h-64"> 
          <Loader text="Loading orders..." />
        </div>
        }
      {error && <p className="text-center text-red-500 mb-6">{error}</p>}

      {/* ─── Orders List ─────────────────────────────────────────────────────────── */}
      <div className="space-y-8">
        {orders.map((order) => {
          const subTotal = calculateSubtotal(order.items);
          return (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                <span className="text-lg font-medium">
                  Order #: {order.order_number}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
                {getStatusBadge(order.status)}
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center px-6 py-4">
                    <div className="flex-grow">
                      <h3 className="font-medium text-base">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatVariant(item.variant)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-base">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Subtotal Row */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold">₹{subTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Utility: Capitalize a given string (e.g. “size” → “Size”)
function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
