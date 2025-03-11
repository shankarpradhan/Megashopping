"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/lib/CartContext"; // Ensure correct import path
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null); // Track loading per product
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({}); // Quantity state per product

  const { addToCart } = useCart(); // Use Cart Context
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        const formattedProducts = data.products.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle quantity change per product
  const handleQuantityChange = (productId: string, value: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: value > 0 ? value : 1, // Prevent negative values
    }));
  };

  const handleAddToCart = (product: Product) => {
    setLoadingId(product.id);
    const quantity = selectedQuantities[product.id] || 1; // Default to 1 if undefined
    addToCart(product, quantity);
    setTimeout(() => setLoadingId(null), 1000);
  };

  return (
    <>
  
      <div className="w-full min-h-screen bg-gray-900 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Explore Our Products
          </h2>

          {/* Product List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 p-5 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="relative w-full h-56 rounded-md overflow-hidden bg-gray-700">
                  <Image
                    src={`${API_URL}${product.image}`}
                    alt={product.name}
                    fill // ✅ Equivalent to layout="fill"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" // ✅ Add sizes for responsiveness
                    className="opacity-90 hover:opacity-100 transition-opacity object-cover"
                  />
                </div>
                
                )}

                {/* Product Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <p className="text-yellow-400 text-xl font-semibold mt-2">
                    ₹{product.price}
                  </p>
                </div>

                {/* Quantity Input */}
                <input
                  type="number"
                  min="1"
                  value={selectedQuantities[product.id] || 1} // Ensure unique quantity per product
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 rounded-md text-white bg-gray-700 text-center"
                />

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full mt-4 text-white font-semibold py-2 rounded-lg transition
                    ${loadingId === product.id ? "bg-gray-500 cursor-wait" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                >
                  {loadingId === product.id ? "Adding..." : "Add to Cart 🛒"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
