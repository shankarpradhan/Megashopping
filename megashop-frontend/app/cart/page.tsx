"use client";

import { useCart } from "@/app/lib/CartContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import CheckoutButton from "../components/RazorpayCheckout";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, fetchCart } = useCart();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<{ orderId: string; amount: number; currency: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCartAndOrder = async () => {
      try {
        const userToken = localStorage.getItem("token"); // ⚠️ Prefer HttpOnly cookies in production
        console.log("🌍 API URL:", API_URL);
        console.log(userToken);
        if (!userToken) {
          setError("User not authenticated. Please log in.");
          setIsLoading(false);
          return;
        }
        setToken(userToken);

        await fetchCart(); // Load cart data
        setIsLoading(false);

        // ✅ Create order only if cart has items
        if (cart.length > 0) {
          console.log(API_URL, "*******************");
          const response = await fetch(`${API_URL}/api/payment/order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ amount: getTotalPrice(), currency: "INR" }),
          });
          
          const rawText = await response.text();
          console.log("📝 API Raw Response:", rawText);
          
          // Check if response is valid JSON
          try {
            const data = JSON.parse(rawText);
            console.log("✅ Parsed JSON:", data);
            if(data.success && data.order) {
                setOrderDetails(data.order);
                // alert("order successfully created")
            } else {
                console.error("❌ Unexpected API response format", data);
                alert(`Something went wrong: ${JSON.stringify(data)}`);
            }
          } catch (error) {
            console.error("❌ JSON Parsing Error:", error);
            setError(`Invalid API Response: ${rawText.substring(0, 100)}`);
          }
        }
      } catch (err) {
        console.error("Error fetching cart or creating order:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    initializeCartAndOrder();
  }, []);

  const formattedCart = cart.map((product) => ({
    ...product,
    id: product.productId || product.id,
  }));

  const getTotalPrice = () => {
    return formattedCart.reduce((total, product) => total + product.price * (product.quantity ?? 1), 0);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white pt-10">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">🛒 Your Cart</h2>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading your cart...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : formattedCart.length === 0 ? (
          <p className="text-center text-gray-400">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {formattedCart.map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-[60px] h-[60px] overflow-hidden rounded-md">
                      <Image
                        src={`${API_URL}${product.image}`}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-yellow-400">₹{product.price}</p>
                      <p className="text-yellow-400">Q. {product.quantity}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded-lg"
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg text-center">
              <h2 className="text-xl font-bold">Total Price: ₹{getTotalPrice()}</h2>
            </div>

            {/* ✅ Only show checkout button when order is successfully created */}
            {orderDetails ? (
              <CheckoutButton
                orderId={orderDetails.orderId}
                amount={getTotalPrice()*100}
                currency={orderDetails.currency}
              />
            ) : (
              <p className="text-center text-gray-400 mt-4">⚠️ Payment unavailable. Try again later.</p>
            )}

            <button
              onClick={clearCart}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            >
              Clear Cart 🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}


