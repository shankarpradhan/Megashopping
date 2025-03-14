"use client";
import { useEffect } from "react";
import { getUserRole } from "@/app/auth/utils/auth";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const userRole = getUserRole();

        if (!userRole) {
            router.push("/auth/login"); // Redirect to login if no role found
        } else if (userRole === "admin") {
            router.push("/admin"); // ✅ Auto-redirect admins to Admin Panel
        } else {
            router.push("/users"); // ✅ Auto-redirect normal users to View Products
        }
    }, [router]); // ✅ Added `router` to the dependency array

    return null; // Prevent rendering the dashboard since we are redirecting
};

export default Dashboard;

// "use client";
// import { useEffect, useState } from "react";
// import { getUserRole } from "@/app/auth/utils/auth";
// import { useRouter } from "next/navigation";

// const Dashboard = () => {
//     const router = useRouter();
//     const [role, setRole] = useState<string | null>(null);

//     useEffect(() => {
//         const userRole = getUserRole();
//         setRole(userRole);

//         if (!userRole) {
//             router.push("/auth/login"); // Redirect to login if no role found
//         } else if (userRole === "admin") {
//             router.push("/admin"); // ✅ Auto-redirect admins to Admin Panel
//         } else {
//             router.push("/users"); // ✅ Auto-redirect normal users to View Products
//         }
//     }, []);

//     return null; // Prevent rendering the dashboard since we are redirecting
// };

// export default Dashboard;
