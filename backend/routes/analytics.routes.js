import express from "express";
import {adminRoute, protectRoute} from "../middlewares/auth.middleware.js";
import {getAnalyticsData, getDailySalesData, getTotalOrders} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData(); // Assume this function fetches analytics data from the database

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

        const dailySalesData = await getDailySalesData(startDate, endDate); // Assume this function fetches daily sales data

        res.json({
            analyticsData,
            dailySalesData,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.get("/orders", protectRoute, adminRoute, getTotalOrders);

export default router;
