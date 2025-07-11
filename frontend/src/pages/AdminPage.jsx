import {BarChart, PlusCircle, ShoppingBasket, ClipboardList} from "lucide-react";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";

import CreateProductForm from "../components/CreateProductForm.jsx";
import ProductsList from "../components/ProductsList.jsx";
import AnalyticsTab from "../components/AnalyticsTab.jsx";
import ProductsTab from "../components/ProductsTab.jsx";
import {useProductStore} from "../stores/useProductStore.js";

const tabs = [
    {id: "create", label: "Create Product", icon: PlusCircle},
    {id: "products", label: "Products", icon: ShoppingBasket},
    {id: "orders", label: "Orders", icon: ClipboardList},
    {id: "analytics", label: "Analytics", icon: BarChart},
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
    const {fetchAllProducts} = useProductStore();

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 py-16">
                <motion.h1
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    className="text-4xl font-bold text-emerald-400 mb-8 text-center"
                >
                    Admin Dashboard
                </motion.h1>

                <div className="flex justify-center mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 mx-2 text-white rounded-md transition-colors duration-200 ${
                                activeTab === tab.id
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            <tab.icon className="h-5 w-5 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "create" && <CreateProductForm />}
                {activeTab === "products" && <ProductsList />}
                {activeTab === "analytics" && <AnalyticsTab />}
                {activeTab === "orders" && <ProductsTab />}
            </div>
        </div>
    );
};

export default AdminPage;
