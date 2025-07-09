import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Replace with your backend server URL

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Use the appropriate base URL for development or production
    withCredentials: true, // Include credentials for CORS requests
});

export default axiosInstance;
