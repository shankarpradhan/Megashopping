import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Object, required: true }],
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  },
  { timestamps: true }
);


// const orderSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     razorpayOrderId: { type: String, required: true },
//     razorpayPaymentId: { type: String, required: true },
//     amountPaid: { type: Number, required: true },
//     status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
//   },
//   { timestamps: true }
// );

const Order = mongoose.model("Order", orderSchema);
export default Order;
