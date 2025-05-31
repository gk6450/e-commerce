"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../components/Loader";

export default function ThankYouPage() {
  const router = useRouter();
  const params = useParams();             // { orderNumber: "..." }
  const searchParams = useSearchParams(); // to get status
  const orderNumber = params.orderNumber;
  const status = searchParams.get("status");

  // Raw order data (without images)
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Enriched items that include image_url
  const [itemsWithImages, setItemsWithImages] = useState([]);

  useEffect(() => {
    if (!orderNumber) {
      router.replace("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        // 1️⃣ Fetch the order (contains title, price, variant, quantity, but no image_url)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderNumber}`
        );
        const data = res.data;
        setOrderDetails(data);

        // 2️⃣ Enrich each item by fetching its product.image_url
        const enriched = await Promise.all(
          data.items.map(async (item) => {
            try {
              const prodRes = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${item.product_id}`
              );
              return {
                ...item,
                image_url: prodRes.data.image_url || "",
              };
            } catch {
              return { ...item, image_url: "" };
            }
          })
        );
        setItemsWithImages(enriched);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Loading order details..." />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }
  if (!orderDetails) {
    return <p className="text-center mt-8 text-gray-600">Order not found.</p>;
  }

  // Compute total paid
  const totalPaid = itemsWithImages.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      {/* ─── Header ─────────────────────────────────────────────────────────────── */}
      <h1 className="text-2xl font-semibold mb-4">Thank You for Your Order!</h1>
      <p className="mb-6 text-gray-700">
        Your order number is{" "}
        <span className="font-medium text-blue-600">{orderDetails.order_number}</span>.
      </p>

      {/* ─── Order Summary ───────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="bg-gray-50 rounded-lg divide-y divide-gray-200 overflow-hidden">
          {itemsWithImages.map((item, idx) => (
            <div key={idx} className="flex items-center p-4">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-16 h-16 object-contain rounded border"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatVariant(item.variant)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* Total Paid */}
          <div className="flex justify-between items-center p-4">
            <span className="font-medium text-lg">Total Paid:</span>
            <span className="font-semibold text-lg">₹{totalPaid.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ─── Shipping Details ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
          <p>
            <strong>Name:</strong> {orderDetails.full_name}
          </p>
          <p>
            <strong>Email:</strong> {orderDetails.email}
          </p>
          <p>
            <strong>Phone:</strong> {orderDetails.phone}
          </p>
          <p>
            <strong>Address:</strong> {orderDetails.address}, {orderDetails.city},{" "}
            {orderDetails.state} {orderDetails.zip}
          </p>
        </div>
      </div>

      {/* ─── Final Message ────────────────────────────────────────────────────────── */}
      <div>
        {status === "approved" ? (
          <p className="text-green-600 font-semibold">
            Your transaction was successful! A confirmation email has been sent.
          </p>
        ) : status === "declined" ? (
          <p className="text-red-600 font-semibold">
            Your transaction was declined. You can retry or contact support.
          </p>
        ) : (
          <p className="text-yellow-600 font-semibold">
            There was an error processing your payment. Please contact support.
          </p>
        )}
      </div>
    </div>
  );
}

// Utility: Capitalize a key and render as “Key: Value”
function formatVariant(variantObj) {
  if (!variantObj || typeof variantObj !== "object") return "";
  return Object.entries(variantObj)
    .map(([k, v]) => `${capitalize(k)}: ${v}`)
    .join(" | ");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
