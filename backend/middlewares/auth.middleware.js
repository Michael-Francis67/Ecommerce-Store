import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        // Check if the token is provided

        if (!token) {
            return res.status(400).json({message: "Unauthorized - No access token provided"});
        }

        try {
            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded.userId).select("-password"); // Exclude password and version from the user object

            // Check if the user exists
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            req.user = user; // Attach the user to the request object
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw error; // If the token is expired, throw an error to be caught below
            }
        }
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(404).json({message: "Unauthorized - Access token expired"});
        }
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const adminRoute = (req, res, next) => {
    // Check if the user has admin role
    if (req.user && req.user.role === "admin") {
        return next(); // Proceed to the next middleware or route handler
    } else {
        // If the user is not an admin, return a 403 Forbidden response
        return res.status(403).json({message: "Forbidden - Admin access required"});
    }
};
