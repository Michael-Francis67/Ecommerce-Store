import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Use the appropriate base URL for development or production
    withCredentials: true, // Include credentials for CORS requests
});

export default axiosInstance;
