"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect users to the authentication page
    router.push("/auth");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-semibold">Redirecting...</h2>
    </div>
  );
}
