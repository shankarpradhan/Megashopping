"use client";

import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome to MegaShop</h2>
        <p className="text-center text-gray-600">Choose an option to continue</p>
        
        <div className="space-y-4">
          <button
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
          
          <button
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
