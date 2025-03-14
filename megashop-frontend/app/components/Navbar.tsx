"use client";
import { useState } from "react";
import { useAuth } from "@/app/auth/utils/AuthContext"; // Import the custom hook
import { useCart } from "@/app/lib/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { cart } = useCart();
  const { isLoggedIn, userRole, logout } = useAuth(); // Get login state and methods from context
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out..."); 
    logout(); // Logout via context
    router.replace("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white py-4 px-6 flex justify-between items-center z-50 shadow-lg">
      <Link href="/" className="text-2xl font-bold">🛍️ MegaShop</Link>
      
      {/* Hamburger Menu */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none">
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop & Mobile Menu */}
      <div className={`md:flex md:items-center md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent flex-col md:flex-row transition-all duration-300 ease-in-out ${menuOpen ? "flex" : "hidden"}`}>
        <Link href="/users" className="relative block md:inline-block px-4 py-2 hover:bg-gray-800 rounded-md">Products</Link>
        <Link href="/orders" className="relative block md:inline-block px-4 py-2 hover:bg-gray-800 rounded-md">Orders</Link>
        <Link href="/cart" className="relative block md:inline-block px-4 py-2 hover:bg-gray-800 rounded-md">
          Cart 🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>

        {isLoggedIn && userRole === "admin" && (
          <Link href="/admin/dashboard" className="block md:inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md">
            Admin Dashboard 🛠️
          </Link>
        )}

        {isLoggedIn ? (
          <button onClick={handleLogout} className="block md:inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">Logout 🚪</button>
        ) : (
          <Link href="/auth/login" className="block md:inline-block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">Login 🔑</Link>
        )}
      </div>
    </nav>
  );
}
