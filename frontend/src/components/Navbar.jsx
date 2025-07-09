import {Link} from "react-router-dom";
import {ShoppingCart, UserPlus, LogIn, LogOut, Lock} from "lucide-react";
import {useUserStore} from "../stores/userUserStore";
import {useCartStore} from "../stores/useCartStore";
import {useOrdersStore} from "../stores/useOrdersStore";
import logo from "../logo.png";

const Navbar = () => {
    const {user, logout} = useUserStore();
    const {cart} = useCartStore();
    const isAdmin = user && user?.role === "admin";
    const {profilePic} = useOrdersStore();

    return (
        <header
            className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md z-40 shadow-lg 
    transition-all duration-300 ease-in-out border-b border-emerald-800"
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-wrap items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex">
                        E-Commerce
                    </Link>

                    <nav className="flex flex-wrap items-center gap-4">
                        <Link
                            to={"/"}
                            className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                        >
                            Home
                        </Link>
                        {user && (
                            <Link
                                to={"/cart"}
                                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                            >
                                <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
                                <span className="hidden sm:inline">Cart</span>
                                <span
                                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                text-xs transition-all duration-300 ease-in-out
                group-hover:bg-emerald-400"
                                >
                                    {cart.length}
                                </span>
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                to={"/secret-dashboard"}
                                className="bg-emerald-700 text-white hover:text-emerald-600 transition duration-300 ease-in-out
              px-3 py-3 rounded-md font-medium items-center"
                            >
                                <Lock className="inline-block mr-1" size={18} />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={logout}
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4
              rounded-md transition duration-300 ease-in-out flex items-center"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:inline ml-2">Log Out</span>
                                </button>

                                <div>
                                    {/* change popover-1 and --anchor-1 names. Use unique names for each dropdown */}
                                    {/* For TSX uncomment the commented types below */}
                                    <button
                                        className="btn"
                                        popoverTarget="popover-1"
                                        style={{anchorName: "--anchor-1"} /* as React.CSSProperties */}
                                    >
                                        <img
                                            src={user ? user.profilePic : logo}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full mr-2 object-cover cursor-pointer"
                                            loading="lazy"
                                        />
                                    </button>

                                    <ul
                                        className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                                        popover="auto"
                                        id="popover-1"
                                        style={{positionAnchor: "--anchor-1"} /* as React.CSSProperties */}
                                    >
                                        <li>
                                            <Link to={"/profile"} className="text-emerald-500">
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/orders"} className="text-emerald-500">
                                                Orders
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4
                rounded-md flex items-center transition duration-300 ease-in-out"
                                >
                                    <UserPlus className="mr-2" size={18} />
                                    <span className="hidden sm:inline ml-2">Sign Up</span>
                                </Link>
                                <Link
                                    to={"/login"}
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4
                rounded-md flex items-center transition duration-300 ease-in-out"
                                >
                                    <LogIn className="mr-2" size={18} />
                                    <span className="hidden sm:inline ml-2">Log In</span>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
