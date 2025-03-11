"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/app/auth/utils/auth";

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    } else if (adminOnly && getUserRole() !== "admin") {
      router.push("/dashboard");
    }
  }, [router, adminOnly]);

  return <>{children}</>;
};

export default ProtectedRoute;
