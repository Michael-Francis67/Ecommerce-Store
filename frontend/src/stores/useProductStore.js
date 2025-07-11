import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({products}),
    createProduct: async ({name, description, price, image, category}) => {
        set({loading: true});
        try {
            const response = await axios.post("/api/products", {
                name,
                description,
                price,
                image,
                category,
            });
            set((prevState) => ({
                products: [...prevState.products, response.data],
                loading: false,
            }));
            toast.success(response.data.message || "Product created successfully");
        } catch (error) {
            set({error: error.message, loading: false});
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    deleteProduct: async (productId) => {
        set({loading: true});
        try {
            const response = await axios.delete(`/api/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }));
            toast.success(response.data.message || "Product deleted successfully");
        } catch (error) {
            set({error: error.message, loading: false});
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({loading: true});
        try {
            const response = await axios.get(`/api/products/category/${category}`);
            set({products: response.data.products, loading: false});
        } catch (error) {
            set({error: "Error fetching products", loading: false});
            toast.error(error.response.data.error || "An error occurred");
        }
    },

    fetchAllProducts: async () => {
        set({loading: true});
        try {
            const response = await axios.get("/api/products");
            set({products: response.data.products, loading: false});
        } catch (error) {
            set({error: "Error fetching products", loading: false});
            toast.error(error.response.data.error || "An error occurred");
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({loading: true});
        try {
            const response = await axios.patch(`/api/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.map((product) =>
                    product._id === productId ? {...product, isFeatured: !product.isFeatured} : product
                ),
                loading: false,
            }));
        } catch (error) {
            set({error: "Error fetching products", loading: false});
            toast.error(error.response.data.error || "An error occurred");
        }
    },

    fetchFeaturedProducts: async () => {
        set({loading: true});
        try {
            const response = await axios.get("/api/products/featured");
            set({products: response.data.featuredProducts, loading: false});
        } catch (error) {
            set({error: "Error fetching featured products", loading: false});
            console.log("Error fetching featured products:", error);
        }
    },
}));
