"use client"; 
import { useEffect, useState } from "react";

const RazorpayCheckout = ({ orderId, amount, currency }: { orderId: string; amount: number; currency: string }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpay = () => {
      if (document.getElementById("razorpay-script")) return; // ✅ Prevent multiple loads
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        
        body: JSON.stringify({ amount, currency }),
      });
      const data = await res.json();
      
      if (!data.success || !data.order) {
        alert("Failed to create order. Please try again.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "MegaShop",
        description: "Purchase",
        order_id: data.order.id,
        handler: async function (response: any) {
        console.log("🔹 Razorpay Payment Response:", response);
      
          // Send this data to your backend for verification
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({...response,amount}),
          });
      
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("✅ Payment successful!");
            window.location.href = "/cart";
          } else {
            alert("❌ Payment verification failed.");
            window.location.href = "/users";
          }
        },
        prefill: { name: "Shankar Pradhan", email: "shankarpradhan845@gmail.com", contact: "6370108950" },
        theme: { color: "#3399cc" },
      };
      
      // Open Razorpay Payment UI
      

      if (razorpayLoaded) {
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      } else {
        alert("Razorpay SDK failed to load. Please refresh.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return <button onClick={handlePayment} className="bg-blue-600 text-white p-2 rounded">Pay Now</button>;
};

export default RazorpayCheckout;
