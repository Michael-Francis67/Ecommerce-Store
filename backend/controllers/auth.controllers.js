import {redis} from "../lib/redis.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

const generateTokens = (userId) => {
    // This function should generate access and refresh tokens for the user.
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    // Set the refresh token in a cookie
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return {accessToken, refreshToken};
};

const storeRefreshToken = async (userId, refreshToken) => {
    // This function should store the refresh token in the database or cache.
    await redis.set(`refresh_Token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // Store for 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
    // This function should set the access and refresh tokens in cookies.
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie or XSS attacks
        secure: true,
        sameSite: "None", // Helps prevent CSRF attacks
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie or XSS attacks
        secure: true,
        sameSite: "None", // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        const user = await User.create({
            email,
            password,
            name,
        });

        // authenticate the user
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        // Set the refresh token in a cookie
        setCookies(res, accessToken, refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            domain: "https://ecommerce-store-14.onrender.com",
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (user && (await user.comparePassword(password))) {
            // User authenticated successfully
            const {accessToken, refreshToken} = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);

            // Set the access and refresh tokens in cookies
            setCookies(res, accessToken, refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 15 * 60 * 1000,
                path: "/",
                domain: "https://ecommerce-store-14.onrender.com",
            });

            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } else {
            res.status(400).json({message: "Invalid email or password"});
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({message: "No refresh token provided"});
        }
        // Verify the refresh token
        // If the token is valid, remove it from Redis or database
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_Token:${decoded.userId}`); // Remove the refresh token from Redis
        res.clearCookie("accessToken"); // Clear the access token cookie
        res.clearCookie("refreshToken"); // Clear the refresh token cookie
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({message: "No refresh token provided"});
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;

        // Check if the refresh token exists in Redis or database
        const storedRefreshToken = await redis.get(`refresh_Token:${userId}`);
        if (storedRefreshToken !== refreshToken) {
            return res.status(403).json({message: "Invalid refresh token"});
        }

        // Generate new access and refresh tokens
        const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m", // 15 minutes
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie or XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict", // Helps prevent CSRF attacks
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.status(200).json({message: "Tokens refreshed successfully"});
    } catch (error) {
        console.error("Error during token refresh:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profile} = req.body;
        const userId = req.user._id;

        const uploadedProfile = await cloudinary.uploader.upload(profile, {folder: "profile"});
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadedProfile.secure_url}, {new: true});

        res.status(200).json({message: "Profile updated successfully", user: updatedUser});
    } catch (error) {
        console.error("Error during update profile:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

// TODO: get profile function
export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error("Error during get profile:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

// This file contains the authentication controller functions for handling user signup, login, and logout.
// Each function currently sends a simple response indicating the route has been called.
