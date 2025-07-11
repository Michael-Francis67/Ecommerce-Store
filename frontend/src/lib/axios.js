import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL
    ? import.meta.env.VITE_BASE_URL
    : "https://ecommerce-store-13.onrender.com";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Use the appropriate base URL for development or production
    withCredentials: true, // Include credentials for CORS requests
});

export default axiosInstance;
