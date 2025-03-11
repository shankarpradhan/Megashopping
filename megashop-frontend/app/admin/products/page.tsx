"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    price: 0,
    image: "",
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle product save (add or edit)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const product = editProduct || newProduct;

      if (!product.name || !product.price) {
        alert("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      let imageUrl = product.image;

      // Upload Image if a new one is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure authorization if needed
          },
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          console.error("Image upload failed:", uploadData);
          throw new Error("Image upload failed");
        }
        imageUrl = uploadData.imageUrl;
      }

      const method = editProduct ? "PUT" : "POST";
      const url = editProduct
        ? `${API_URL}/api/products/${editProduct._id}`
        : `${API_URL}/api/products`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure authorization if needed
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      console.log("Response Data:", data);

      if (!res.ok) {
        console.error("Error response data:", data);
        throw new Error(data.message || "Failed to save product");
      }

      console.log("Product saved successfully:", data);

      setNewProduct({ name: "", price: 0, image: "" });
      setEditProduct(null);
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      console.error("Error while saving the product:", error);
      alert("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure authorization if needed
        }
      });
      
      const data = await res.json();
  
      // Check if the response is successful
      if (!data.success) {
        console.error("Failed to delete product:", data.message || "No message provided");
        throw new Error("Failed to delete product");
      }
  
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error("Error while deleting the product:", error);
    }
  };

  return (
    <div className="p-6 mx-auto  bg-gray-900">
      
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Manage Products</h1>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 p-2 rounded-md"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </div>

      {/* Product List */}
      <h2 className="text-2xl font-bold text-white mb-4">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-lg">
            {product.image && (
              <div className="relative w-full h-48 rounded-md overflow-hidden">
                <Image
                  src={`${API_URL}${product.image}`}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600">₹{product.price}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setEditProduct(product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id!)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              className="w-full border p-2 rounded-md mb-3"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 rounded-md mb-3"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
            />
            <input
              type="file"
              accept="image/*"
              className="w-full border p-2 rounded-md mb-3"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Update Product
              </button>
              <button
                onClick={() => setEditProduct(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
