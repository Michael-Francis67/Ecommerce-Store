import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Coupon code is required"],
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: [true, "Discount amount is required"],
    min: 0, // Discount cannot be negative
    max: 100, // Discount cannot exceed 100%
  },
  expirationDate: {
    type: Date,
    required: [true, "Expiration date is required"],
  },
  isActive: {
    type: Boolean,
    default: true, // Default value for isActive
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
    unique: true, // Each user can have only one active coupon
  }
}, {
  timestamps: true
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;