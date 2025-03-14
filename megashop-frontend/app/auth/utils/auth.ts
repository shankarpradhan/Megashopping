// auth.ts
import { jwtDecode } from "jwt-decode"; // Install jwt-decode if not already

// Login function
export const login = async (email: string, password: string) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",  // Allow cookies if needed
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Login failed");
        }

        const data = await res.json();
        
        // ✅ Store token in localStorage after login
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);  // Ensure role is set in localStorage
        }

        return data; // Return the data containing the token and user role
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem("token"); // ✅ Remove token on logout
    localStorage.removeItem("role");  // Remove role on logout
    window.location.href = "/auth/login"; // ✅ Redirect to login page
};



interface DecodedToken {
    exp: number;
    role?: string;
}

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        const isExpired = decoded.exp * 1000 < Date.now(); // Check if token is expired
        return !isExpired;
    } catch (error) {
        console.error("Error decoding token:", error);
        return false;
    }
};

export const getUserRole = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        return decoded.role || "user"; // Default role is "user"
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};


// import { jwtDecode } from "jwt-decode"; // Install jwt-decode if not already

// // Login function
// export const login = async (email: string, password: string) => {
//     try {
//         const res = await fetch("http://localhost:5000/api/users/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//             credentials: "include",  // Allow cookies if needed
//         });

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message || "Login failed");
//         }

//         const data = await res.json();
        
//         // ✅ Store token in localStorage after login
//         if (data.token) {
//             localStorage.setItem("token", data.token);
//             localStorage.setItem("role", data.role);  // Ensure role is set in localStorage
//         }

//         return data; // Return the data containing the token and user role
//     } catch (error) {
//         console.error("Login Error:", error);
//         throw error;
//     }
// };

// // Logout function
// export const logout = () => {
//     localStorage.removeItem("token"); // ✅ Remove token on logout
//     localStorage.removeItem("role");  // Remove role on logout
//     window.location.href = "/auth/login"; // ✅ Redirect to login page
// };



// // Function to check if user is authenticated
// export const isAuthenticated = (): boolean => {
//     const token = localStorage.getItem("token");
//     if (!token) return false;

//     try {
//         const decoded: any = jwtDecode(token);
//         const isExpired = decoded.exp * 1000 < Date.now(); // Check if token is expired
//         return !isExpired;
//     } catch (error) {
//         console.error("Error decoding token:", error);
//         return false;
//     }
// };

// // Function to get user role
// export const getUserRole = (): string | null => {
//     const token = localStorage.getItem("token");
//     if (!token) return null;

//     try {
//         const decoded: any = jwtDecode(token);
//         return decoded.role || "user"; // Default role is "user"
//     } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//     }
// };
