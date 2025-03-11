import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const fetchProducts = async () => {
    try {
        const res = await fetch(`${API_URL}/api/products`);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
};


export const fetchUser = async (token: string) => {
    try {
        const res = await axios.get(`${API_URL}/users/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};
