"use client";
import { useEffect, useState } from "react";
import { getUserRole } from "@/app/auth/utils/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminPage = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const role = getUserRole();
        if (role !== "admin") {
            router.push("/auth/login"); // Redirect non-admin users
        } else {
            setIsAdmin(true);
        }
    }, []);

    if (!isAdmin) return null; // Prevent rendering for non-admins

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('/admin-dashboard-bg.webp')" }}></div>

            {/* Dashboard Container */}
            <div className="relative z-10 bg-white py-24 px-20 rounded-lg shadow-lg text-center max-w-lg w-full mx-auto lg:mr-20 min-h-[400px] flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="mt-3 text-gray-600">Manage users, products, and orders here.</p>

              <div className="mt-6 space-y-6 flex flex-col">
                <button 
                  onClick={() => router.push("/admin/products")} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-4 rounded-lg transition"
                >
                  Manage Products
                </button>

                <button 
                  onClick={() => router.push("/admin/users")} 
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-4 rounded-lg transition"
                >
                  Manage Users
                </button>
              </div>
            </div>

        </div>
    );
};

export default AdminPage;
