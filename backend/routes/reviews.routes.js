import express from "express";
import {createReview, getReviews} from "../controllers/reviews.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:productId", protectRoute, createReview);
router.get("/:productId", protectRoute, getReviews);

export default router;
