import express from "express";
import { 
  getAllProducts, 
  getFeaturedProducts, 
  createProduct, 
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
// Import the product controller to handle product-related requests

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts); // Assuming you have a getFeaturedProducts controller
router.get('/category/:category', getProductsByCategory); // Assuming you have a getProductsByCategory controller
router.get('/recommendations', getRecommendedProducts); // Assuming you have a getRecommendedProducts controller
router.post('/', protectRoute, adminRoute, createProduct)// Add a route to create a new product if needed
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct); // Assuming you have a toggleFeaturedProduct controller
router.delete('/:id', protectRoute, adminRoute, deleteProduct); // Assuming you have a deleteProduct controller

export default router;