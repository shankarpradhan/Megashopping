"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  name: string;
  price: number;
  image?: string; // Optional since some products may not have an image
  quantity: number;
}

export default function OrdersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      const userToken = localStorage.getItem("token");

      if (!userToken) {
        console.error("⚠️ No token found in localStorage");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/payment/getorders`, {
          method: "POST", // ✅ Keep as POST since backend expects it
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        console.log(res);
        const data = await res.json();

        if (data.success) {
          console.log("✅ Orders Fetched:", data.products);
          setProducts(data.products); // ✅ Correct property name
        } else {
          console.error("⚠️ Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [API_URL]);

  return (
    <div className="w-full min-h-screen bg-gray-900 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Check Out Your Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* orders?.filter(order => order !== null).map((order, index) */}
          {products.length > 0 ? (
            products?.filter(product => product!==null).map((product, index) => (
              <div
                key={index}
                className="bg-gray-800 p-5 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                {product.image && (
                  <div className="relative w-full h-56 rounded-md overflow-hidden bg-gray-700">
                    <Image
                      src={`${API_URL}${product.image}`} // Ensure proper path
                      alt={product.name || "Product Image"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="opacity-90 hover:opacity-100 transition-opacity object-cover"
                    />
                  </div>
                )}

                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <p className="text-yellow-400 text-xl font-semibold mt-2">
                    Price: {product.price} 
                  </p>
                  <p className="text-yellow-400 text-xl font-semibold mt-2">
                    Quantity: {product.quantity} 
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
