import cloudinary from "../lib/cloudinary.js";
import {redis} from "../lib/redis.js";
import Product from "../models/product.models.js";

export const getAllProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find({});

        // Return the products in the response
        res.status(200).json({products, message: "Products fetched successfully"});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        // Fetch featured products from the database
        let featuredProducts = await redis.get("featuredProducts");

        if (featuredProducts) {
            // If not found in Redis, fetch from the database
            return res.json(JSON.parse(featuredProducts));
        }

        // If not found in Redis, fetch from the database
        // .lean() is used to return plain JavaScript objects instead of Mongoose documents
        // This can improve performance when you don't need Mongoose's document methods
        featuredProducts = await Product.find({isFeatured: true}).lean();

        if (!featuredProducts || featuredProducts.length === 0) {
            return res.status(404).json({message: "No featured products found"});
        }

        // Store the featured products in Redis for future requests
        await redis.set("featured_products", JSON.stringify(featuredProducts)); // Set expiration time to 1 hour

        // Return the featured products in the response
        res.status(200).json({featuredProducts, message: "Featured products fetched successfully"});
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const createProduct = async (req, res) => {
    try {
        // Create a new product using the request body
        const {name, description, price, image, category} = req.body;

        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});
        }

        // Create a new product instance
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse ? cloudinaryResponse.secure_url : "", // Use the secure URL from Cloudinary
            category,
        });

        // Return the created product in the response
        res.status(201).json({product});
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        // Delete the product image from Cloudinary if it exists
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; // Extract the public ID from the image URL
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`); // Delete the image from Cloudinary
                // Delete the product from the database
                console.log("Deleting product:", product._id);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
                return res.status(401).json({message: "Failed to delete product image", error: error.message});
            }
        }

        // Delete the product from the database
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Product deleted successfully"});
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size: 3}, // Randomly select 3 products
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.error("Error fetching recommended products:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const {category} = req.params;

        // Fetch products by category from the database
        const products = await Product.find({category});

        if (!products || products.length === 0) {
            return res.status(404).json({message: "No products found in this category"});
        }

        // Return the products in the response
        res.status(200).json({products, message: "Products fetched successfully"});
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const {id} = req.params;

        // Find the product by ID
        const product = await Product.findById(id);
        if (product) {
            // Toggle the isFeatured status
            product.isFeatured ? (product.isFeatured = false) : (product.isFeatured = true);
            // Save the updated product
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            return res.status(200).json({product: updatedProduct});
        } else {
            return res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.error("Error toggling featured product:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

async function updateFeaturedProductsCache() {
    try {
        // The lean() method is used to return plain JavaScript objects instead of Mongoose documents
        // This can improve performance when you don't need Mongoose's document methods
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts)); // Set expiration time to 1 hour
    } catch (error) {
        console.error("Error updating featured products cache:", error);
    }
}
