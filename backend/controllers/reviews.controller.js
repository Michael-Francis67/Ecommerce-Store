import Product from "../models/product.models.js";

export const createReview = async (req, res) => {
    try {
        const {rating, comment} = req.body;
        const {productId} = req.params;
        const user = req.user;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        const review = product.reviews.push({
            user: user._id,
            rating,
            comment,
        });

        await product.save();
        res.status(201).json({message: "Review created successfully", product, user});
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getReviews = async (req, res) => {
    try {
        const {productId} = req.params;

        const product = await Product.findById(productId).populate("reviews", "user rating comment");

        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        const user = req.user;

        res.status(200).json({reviews: product.reviews, product, user});
    } catch (error) {
        console.log("Error fetching reviews:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
