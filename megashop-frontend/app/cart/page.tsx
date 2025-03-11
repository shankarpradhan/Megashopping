"use client";

import { useCart } from "@/app/lib/CartContext";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, fetchCart } = useCart(); // ✅ Import fetchCart
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Cart when the component mounts
  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setIsLoading(false);
    };

    loadCart();
  }, []);

  // ✅ Transform the cart data to ensure 'id' exists
  const formattedCart = cart.map((product) => ({
    ...product,
    id: product.productId || product.id,  // Ensure 'id' is assigned correctly
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
                    onClick={() => {
                      console.log("Removing product:", product);
                      console.log("Product ID:", product.id);
                      removeFromCart(product.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded-lg"
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            >
              Clear Cart 🗑️
            </button>

            <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg text-center">
              <h2 className="text-xl font-bold">Total Price: ₹{getTotalPrice()}</h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
