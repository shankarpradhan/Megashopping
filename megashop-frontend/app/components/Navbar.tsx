"use client";
import {useAuth} from "@/app/auth/utils/AuthContext"; // Import the custom hook
import { useCart } from "@/app/lib/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { cart } = useCart();
  const { isLoggedIn, userRole, logout } = useAuth(); // Get login state and methods from context
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Logout via context
    router.push("/auth/login"); // Redirect to login page
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white py-4 px-6 flex justify-between items-center z-50 shadow-lg">
      <Link href="/" className="text-2xl font-bold">🛍️ MegaShop</Link>

      <div className="flex items-center space-x-4">
        <Link href="/cart" className="relative">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            Cart 🛒
          </button>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>

        {/* Show Admin Dashboard Link if Admin */}
        {isLoggedIn && userRole === "admin" && (
          <Link href="/admin/dashboard">
            <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg">
              Admin Dashboard 🛠️
            </button>
          </Link>
        )}

        {/* Show Logout if logged in, otherwise show Login */}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
            Logout 🚪
          </button>
        ) : (
          <Link href="/auth/login">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
              Login 🔑
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
