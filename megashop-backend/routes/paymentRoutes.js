import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import Cart from "../models/Cart.js";
import mongoose from "mongoose";

import { verifyToken } from "../middlewares/authMiddleware.js";
import Order from "../models/Order.js"; // Import Order Model
// import products from "razorpay/dist/types/products.js";

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🏷️ Create an Order (Protected Route)
router.post("/order", verifyToken, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // ✅ Validate input
    if (!amount || !currency || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount and currency are required" });
    }

    const options = {
      amount: amount * 100, // ✅ Convert to paise
      currency,
      receipt: `order_rcptid_${Date.now()}`, // Use timestamp for unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Error creating order", error });
  }
});

// 🏷️ Verify Payment & Save Order to Database
router.post("/verify", verifyToken, async (req, res) => {
  try {
    console.log("🔹 Payment verification request received:", req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    // Ensure userId is properly extracted
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user.id;  // Corrected userId extraction
    console.log("✅ User ID:", userId);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    console.log("✅ Payment verified! Checking for existing orders...");

    // Check if an order with the same Razorpay order ID already exists
    const existingOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (existingOrder) {
      console.log("🔄 Order with this Razorpay ID already exists:", existingOrder);
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        order: existingOrder,
      });
    }

    // Fetch user's cart data
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty or not found" });
    }

    console.log("🛒 Cart found, creating a new order...");

    // Create a new order with cart products
    const newOrder = new Order({
      userId,  // Corrected reference
      products: cart.products,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amountPaid: amount,
      status: "Paid",
    });

    await newOrder.save();
    console.log("✅ New order saved in DB:", newOrder);

    // Clear the cart after successful order placement
    await Cart.findOneAndDelete({ userId });

    // Fetch all previous orders of the user
    const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Payment verified & new order saved successfully",
      order: newOrder,
      previousOrders: userOrders,
    });

  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
  }
});


router.post("/getorders", verifyToken, async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id); // Debugging

    const orders = await Order.find({ userId: req.user.id });

    if (!orders || orders.length === 0) {
      console.log("No orders found for user:", req.userId);
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    const products = orders.flatMap(order => order.products); // Extract products
    
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export default router;