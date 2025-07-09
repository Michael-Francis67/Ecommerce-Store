import express from "express";
import {login, logout, signup, refreshToken, getProfile, updateProfile} from "../controllers/auth.controllers.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Sample route for user registration
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken); // Assuming you have a refreshToken controller
router.get("/profile", protectRoute, getProfile); // Assuming you have a getProfile controller
router.post("/profile", protectRoute, updateProfile);

export default router;
