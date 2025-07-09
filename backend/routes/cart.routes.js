import express from "express";
import {addToCart, removeAllFromCart, getCartProducts, updateQuantity} from "../controllers/cart.controller.js"; // Import the addToCart controller
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart); // Add a route to add an item to the cart
router.delete("/:productId", protectRoute, removeAllFromCart); // Add a route to remove all items from the cart
router.put("/:id", protectRoute, updateQuantity); // Add a route to remove all items from the cart

export default router;
