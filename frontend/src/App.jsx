import {Routes, Route, Navigate} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Navbar from "./components/Navbar.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";
import {Toaster} from "react-hot-toast";
import {useUserStore} from "./stores/userUserStore.js";
import {useEffect} from "react";
import LoadingSpinner from "./components/loadingSpinner.jsx";
import {useCartStore} from "./stores/useCartStore.js";
import ProfilePage from "./pages/ProfilePage.jsx";
import FullOrderPage from "./pages/FullOrderPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import {useOrdersStore} from "./stores/useOrdersStore.js";
import ReviewPage from "./pages/Review.page.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    const {checkAuth, user, checkingAuth} = useUserStore();
    const {getCartItems} = useCartStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!user) return;

        getCartItems();
    }, [getCartItems, user]);

    if (checkingAuth) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(16,_185,_129,_0.3)_0%,_rgba(10,_80,_60,_0.2)_45%,_rgba(0,_0,_0,_0.1)_100%)]" />
                </div>
            </div>

            <div className="relative z-50 pt-20">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/orders" element={user ? <TransactionsPage /> : <Navigate to="/login" />} />
                    <Route
                        path="/secret-dashboard"
                        element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />}
                    />
                    <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
                    <Route
                        path="/purchase-success"
                        element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
                    />
                    <Route path="/cancel" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />} />
                    <Route
                        path="/transactions/:orderId"
                        element={user ? <FullOrderPage /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/products/:productId/reviews"
                        element={user ? <ReviewPage /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/order/:orderId"
                        element={user?.role === "admin" ? <OrderPage /> : <Navigate to="/" />}
                    />
                </Routes>
                <Footer />
            </div>
            <Toaster />
        </div>
    );
}

export default App;
