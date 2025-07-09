import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import {getShippingAddress, updateShippingAddress} from "../controllers/shippingAddress.controller.js";

const router = express.Router();

router.get("/", protectRoute, getShippingAddress);
router.put("/", protectRoute, updateShippingAddress);

export default router;
