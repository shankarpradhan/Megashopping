"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define Product Interface
interface Product {
    id: string;
    productId?: string; 
    name: string;
    price: number;
    image: string;
    quantity?: number;
}

// Define Cart Context Type
interface CartContextType {
    cart: Product[];
    setCart: React.Dispatch<React.SetStateAction<Product[]>>;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Product[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // ✅ Define fetchCart inside the component but don't call it directly
    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No auth token found, skipping cart fetch.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/cart`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 403) {
                console.error("Forbidden: Invalid or missing token.");
                return;
            }

            const data = await res.json();

            if (res.ok && data.success && data.cart?.products) {
                setCart(data.cart.products);
            } else {
                setCart([]);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart([]);
        }
    };

    // ✅ Call fetchCart ONLY inside useEffect
    useEffect(() => {
        fetchCart();
    }, []);

    // Add Product to Cart
    const addToCart = async (product: Product, quantity: number = 1) => {
        try {
            const res = await fetch(`${API_URL}/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity,
                }),
            });

            if (res.ok) {
                setCart((prevCart) => {
                    const existingProduct = prevCart.find((item) => item.id === product.id);
                    if (existingProduct) {
                        return prevCart.map((item) =>
                            item.id === product.id ? { ...item, quantity: (item.quantity || 1) + quantity } : item
                        );
                    } else {
                        return [...prevCart, { ...product, quantity }];
                    }
                });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Remove Product from Cart
    const removeFromCart = async (productId?: string) => {
        if (!productId) {
            console.error("Invalid productId:", productId);
            return;
        }
        setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
        try {
            const res = await fetch(`${API_URL}/api/cart/remove/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            if (res.ok) {
                setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
                fetchCart();
            } else {
                console.error("Failed to remove item from cart");
            }
        } catch (error) {
            console.error("Error removing item:", error);
            
        }
    };
    

    // Clear Entire Cart
    const clearCart = async () => {
        try {
            const res = await fetch(`${API_URL}/api/cart/clear`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                setCart([]);
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook to Use Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
