import express from "express";
import {adminRoute, protectRoute} from "../middlewares/auth.middleware.js";
import {
    checkoutSuccess,
    createCheckoutSession,
    transactions,
    getSpecificTransactions,
    getOrdersByItsId,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Importing the payment controller
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.get("/transactions", protectRoute, transactions);
router.get("/transactions/:orderId", protectRoute, getSpecificTransactions);
router.get("/order/:orderId", protectRoute, adminRoute, getOrdersByItsId);

export default router;
