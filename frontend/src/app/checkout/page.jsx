"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  isEmailValid,
  isPhoneValid,
  isCardNumberValid,
  isExpiryValid,
  isCVVValid,
} from "../../utils/validation";
import { useCart } from "../../context/CartContext";
import { Minus, Plus } from "lucide-react";
import Loader from "../../components/Loader";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  // Two possible ways to arrive here:
  // 1) Buy Now → productId, variant, quantity in query
  // 2) Cart → items query as JSON array
  const productId = searchParams.get("productId");
  const variantStr = searchParams.get("variant");
  const quantityStr = searchParams.get("quantity");
  const itemsStr = searchParams.get("items"); // JSON array from cart

  // We'll keep checkout items in local state so that quantity can be updated
  const [checkoutItems, setCheckoutItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch product(s) and build items array on mount
  useEffect(() => {
    async function fetchSingleProduct() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
        );
        const product = res.data;
        const variant = JSON.parse(variantStr);
        const quantity = parseInt(quantityStr, 10);

        setCheckoutItems([
          {
            product_id: product.id,
            title: product.title,
            price: parseFloat(product.price),
            variant,
            quantity,
            image_url: product.image_url,
          },
        ]);
      } catch (err) {
        console.error(err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    async function useCartItems() {
      try {
        const cartArray = JSON.parse(decodeURIComponent(itemsStr));
        const detailed = await Promise.all(
          cartArray.map(async (ci) => {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/products/${ci.product_id}`
            );
            const product = res.data;
            return {
              product_id: ci.product_id,
              title: product.title,
              price: parseFloat(product.price),
              variant: ci.variant,
              quantity: ci.quantity,
              image_url: product.image_url,
            };
          })
        );
        setCheckoutItems(detailed);
      } catch (err) {
        console.error(err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    if (itemsStr) {
      useCartItems();
    } else if (productId && variantStr && quantityStr) {
      fetchSingleProduct();
    } else {
      router.replace("/");
    }
  }, [productId, variantStr, quantityStr, itemsStr, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Loading checkout..." />
      </div>
    );
  }
  if (!checkoutItems || checkoutItems.length === 0) {
    return <p className="text-center mt-8 text-gray-500">No items to checkout.</p>;
  }

  // Update quantity in local state
  const updateItemQuantity = (index, newQty) => {
    setCheckoutItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Compute subtotal + total dynamically
  const subtotal = checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal; // no tax/shipping for simplicity

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setApiError("");

    const orderItems = checkoutItems.map((i) => ({
      product_id: i.product_id,
      variant: i.variant,
      quantity: i.quantity,
    }));

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      card_number: formData.card_number,
      expiry: formData.expiry,
      cvv: formData.cvv,
      items: orderItems,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/checkout`,
        payload
      );
      const { order_number, status } = res.data;
      if (itemsStr) clearCart(); // clear cart if coming from cart
      router.push(`/thank-you/${order_number}?status=${status}`);
    } catch (err) {
      console.error(err);
      setApiError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {/* ─── Order Summary ────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
          {checkoutItems.map((item, idx) => (
            <div key={idx} className="flex items-center p-4">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-20 h-20 object-contain rounded border"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {Object.entries(item.variant)
                    .map(([k, v]) => `${capitalize(k)}: ${v}`)
                    .join(" | ")}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Price: ₹{item.price.toFixed(2)}
                </p>

                {/* Quantity Stepper */}
                <div className="flex items-center mt-3">
                  <label className="text-sm mr-2">Qty:</label>
                  <div className="flex items-center border rounded w-fit">
                    <button
                      onClick={() => {
                        const newQty = Math.max(1, item.quantity - 1);
                        updateItemQuantity(idx, newQty);
                      }}
                      className="px-2 py-1 text-gray-700 hover:text-black"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="text"
                      className="w-10 text-center outline-none text-sm"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          // Update locally as number or blank
                          const parsed = parseInt(val, 10);
                          updateItemQuantity(idx, !isNaN(parsed) && parsed >= 1 ? parsed : 1);
                        }
                      }}
                    />
                    <button
                      onClick={() => updateItemQuantity(idx, item.quantity + 1)}
                      className="px-2 py-1 text-gray-700 hover:text-black"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* Subtotal & Total Row */}
          <div className="flex justify-between items-center p-4">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <span className="font-medium text-lg">Total</span>
            <span className="font-semibold text-lg">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ─── Shipping & Payment Form ─────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className="text-xl font-semibold mb-4">Shipping & Payment</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="border rounded p-2 w-full"
              {...register("full_name", { required: "Full name is required" })}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="border rounded p-2 w-full"
              {...register("email", {
                required: "Email is required",
                validate: (val) => isEmailValid(val) || "Enter a valid email",
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              className="border rounded p-2 w-full"
              {...register("phone", {
                required: "Phone is required",
                validate: (val) =>
                  isPhoneValid(val) || "Enter a 10-digit phone number",
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Address</label>
            <input
              type="text"
              className="border rounded p-2 w-full"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">City</label>
              <input
                type="text"
                className="border rounded p-2 w-full"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">State</label>
              <input
                type="text"
                className="border rounded p-2 w-full"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Zip Code</label>
              <input
                type="text"
                className="border rounded p-2 w-full"
                {...register("zip", { required: "Zip code is required" })}
              />
              {errors.zip && (
                <p className="text-red-500 text-sm">{errors.zip.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Payment Info ───────────────────────────────────────────────────────── */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Payment Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Card Number</label>
            <input
              type="text"
              maxLength={16}
              className="border rounded p-2 w-full"
              {...register("card_number", {
                required: "Card number is required",
                validate: (val) =>
                  isCardNumberValid(val) || "Enter a valid 16-digit card number",
              })}
            />
            {errors.card_number && (
              <p className="text-red-500 text-sm">{errors.card_number.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                maxLength={5}
                placeholder="MM/YY"
                className="border rounded p-2 w-full"
                {...register("expiry", {
                  required: "Expiry date is required",
                  validate: (val) =>
                    isExpiryValid(val) || "Enter a valid future expiry date",
                })}
              />
              {errors.expiry && (
                <p className="text-red-500 text-sm">{errors.expiry.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">CVV</label>
              <input
                type="text"
                maxLength={3}
                className="border rounded p-2 w-full"
                {...register("cvv", {
                  required: "CVV is required",
                  validate: (val) =>
                    isCVVValid(val) || "Enter a valid 3-digit CVV",
                })}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm">{errors.cvv.message}</p>
              )}
            </div>
          </div>
        </div>

        {apiError && <p className="text-red-500 mt-4">{apiError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white font-semibold py-3 mt-6 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

// Utility to capitalize variant keys
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
