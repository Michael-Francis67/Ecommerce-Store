import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

export const useReviewStore = create((set, get) => ({
    loading: false,
    reviews: [],
    product: {},
    rating: 0,
    review: "",
    error: null,
    user: {},
    createReview: async (productId, rating, review) => {
        set({loading: true});
        try {
            const res = await axios.post(`/reviews/${productId}`, {rating, comment: review});
            console.log(res.data);
            set({reviews: res.data, product: res.data.product});
            set({user: res.data.user});
            toast.success("Review created successfully");
        } catch (err) {
            console.error("Error creating review:", err);
            toast.error(err.response.data.message || "An error occurred");
        } finally {
            set({loading: false});
        }
    },
    fetchReviews: async (productId) => {
        set({loading: true});
        try {
            const res = await axios.get(`/reviews/${productId}`);
            console.log(res.data);
            set({reviews: res.data.product.reviews});
            set({product: res.data.product});
            set({user: res.data.user});
        } catch (err) {
            console.error("Error fetching reviews:", err);
            // toast.error(err.response.data.message || "An error occurred");
        } finally {
            set({loading: false});
        }
    },
}));

export default useReviewStore;
