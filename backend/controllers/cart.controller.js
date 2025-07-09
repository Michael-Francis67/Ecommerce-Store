import Product from "../models/product.models.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({_id: {$in: req.user.cartItems}});
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
            return {...product.toJSON(), quantity: item.quantity};
        });

        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart products:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user; // Assuming user ID is stored in req.user

        const existingItem = user.cartItems.find((item) => item._id === productId);

        if (existingItem) {
            // If the item already exists in the cart, increment the quantity
            existingItem.quantity += 1;
        } else {
            // If the item does not exist, add it to the cart with quantity 1
            user.cartItems.push(productId);
        }

        // Save the updated user document
        await user.save();
        res.status(200).json(user.cartItems);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const {productId} = req.params;
        const user = req.user; // Assuming user ID is stored in req.user

        if (!productId) {
            user.cartItems = [];
        } else {
            // Remove the specific product from the cart
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }
        // Save the updated user document
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.error("Error removing all items from cart:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const {id: productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;

        // Assuming user ID is stored in req.user
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if (existingItem) {
            if (quantity === 0) {
                // If quantity is 0 or less, remove the item from the cart
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.status(200).json(user.cartItems);
            } else {
                // Update the quantity of the existing item
                existingItem.quantity = quantity;
                await user.save();
                return res.status(200).json(user.cartItems);
            }
        } else {
            return res.status(404).json({message: "Item not found in cart"});
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};
