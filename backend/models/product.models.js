import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0, // Price cannot be negative
        },
        image: {
            type: String,
            required: [true, "image is required"],
        },
        category: {
            type: String,
            required: true,
        },
        isFeatured: {
            type: Boolean,
            default: false, // Default value for isFeatured
        },
        reviews: [
            {
                comment: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
