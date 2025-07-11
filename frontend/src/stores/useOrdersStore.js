import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

export const useOrdersStore = create((set, get) => ({
    loading: false,
    name: "",
    email: "",
    transactions: [],
    orders: [],
    profilePic: "",
    uploading: false,
    fetchUser: async () => {
        set({loading: true});
        try {
            const res = await axios.get(`/api/auth/profile`);
            set({name: res.data.name});
            set({email: res.data.email});
            set({profilePic: res.data.profilePic});
        } catch (err) {
            console.error("Error fetching user:", err);
        } finally {
            set({loading: false});
        }
    },

    fetchTransactions: async () => {
        set({loading: true});
        try {
            const res = await axios.get("/api/payments/transactions");
            set({transactions: res.data});
        } catch (err) {
            console.error("Error fetching user:", err);
        } finally {
            set({loading: false});
        }
    },

    uploadProfilePic: async (file) => {
        set({loading: true});
        set({profilePic: ""});
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const res = await axios.post(`/api/auth/profile`, {profile: reader.result});
                set({
                    profilePic: await res.data.profilePic,
                });
                set({profilePic: URL.createObjectURL(file)});
                toast.success("Profile picture updated successfully");
            } catch (err) {
                console.error("Error updating profile:", err);
            } finally {
                set({loading: false});
            }
        };
        reader.readAsDataURL(file);
    },

    fetchOrdersById: async (id) => {
        set({loading: true});
        try {
            const res = await axios.get(`/api/payments/transactions/${id}`);
            console.log(res.data);
            set({transactions: res.data});
        } catch (err) {
            console.error("Error fetching user:", err);
            toast.error(err.response.data.message || "An error occurred");
        } finally {
            set({loading: false});
        }
    },

    getOrdersByItsId: async (id) => {
        set({loading: true});
        try {
            const res = await axios.get(`/api/payments/order/${id}`);
            set({orders: res.data});
        } catch (err) {
            console.error("Error fetching user:", err);
            toast.error(err.response.data.message || "An error occurred");
        } finally {
            set({loading: false});
        }
    },

    fetchOrders: async () => {
        set({loading: true});
        try {
            const res = await axios.get("/api/analytics/orders");
            set({orders: res.data.totalOrders});
        } catch (err) {
            console.error("Error fetching user:", err);
            toast.error(err.message || "An error occurred");
        } finally {
            set({loading: false});
        }
    },
}));
