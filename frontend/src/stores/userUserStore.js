import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({name, email, password, confirmPassword}) => {
        set({loading: true});

        if (password !== confirmPassword) {
            set({loading: false});
            return toast.error("Passwords do not match");
        }

        try {
            const response = await axios.post("/auth/signup", {
                name,
                email,
                password,
            });
            set({user: response.data.user, loading: false});
            toast.success(response.data.message || "User created successfully");
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    login: async (email, password) => {
        set({loading: true});

        try {
            const response = await axios.post("/auth/login", {
                email,
                password,
            });
            set({user: response.data.user, loading: false});
            toast.success(response.data.message || "Login successful");
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    checkAuth: async () => {
        set({checkingAuth: true});
        try {
            const response = await axios.get("/auth/profile");
            set({user: response.data, checkingAuth: false});
        } catch (error) {
            set({checkingAuth: false, user: null});
        }
    },

    logout: async () => {
        try {
            const response = await axios.post("/auth/logout");
            set({user: null});
            toast.success(response.data.message || "Logged out successfully");
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth) return;

        set({checkingAuth: true});
        try {
            const response = await axios.post("/auth/refresh-token");
            set({checkingAuth: false});
            return response.data;
        } catch (error) {
            set({user: null, checkingAuth: false});
            throw error;
        }
    },
}));

// TODO: Implement the axios interceptors for refreshing access token;

let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If a refresh is already in progress, wait for it to complete
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                // Start a new refresh process
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;

                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle as needed
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                refreshPromise = null;
            }
        }
        return Promise.reject(error);
    }
);
