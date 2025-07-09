import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1, // Quantity must be at least 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0, // Price cannot be negative
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0, // Total amount cannot be negative
        },
        status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Cancelled"], // Valid order statuses
            default: "Pending", // Default status is pending
        },
        stripeSessionId: {
            type: String,
            unique: true, // Stripe session ID is required for payment tracking
        },
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShippingAddress",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
