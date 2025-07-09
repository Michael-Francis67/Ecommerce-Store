import {useOrdersStore} from "../stores/useOrdersStore";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import LoadingSpinner from "../components/loadingSpinner";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";

const FullOrderPage = () => {
    const {orderId} = useParams();
    const {fetchOrdersById, loading, transactions} = useOrdersStore();

    let id = orderId;
    useEffect(() => {
        fetchOrdersById(id);
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div
            className="p-6 max-w-4xl mx-auto"
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.2}}
        >
            <h2 className="text-6xl font-bold text-emerald-400 text-center mb-6">Order Details</h2>
            <p className="text-gray-300 text-center text-sm mb-4">Order ID: {orderId}</p>
            {transactions.map((transaction) => (
                <p
                    key={transaction.id}
                    className={`text-gray-300 text-center text-sm mb-4 ${
                        transaction.status === "Delivered"
                            ? "text-green-500"
                            : transaction.status === "Shipped"
                            ? "text-yellow-500"
                            : "text-red-400"
                    }`}
                >
                    Status: {transaction.status}
                </p>
            ))}

            <div className="space-y-4">
                {transactions.map((transaction) =>
                    transaction.products.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-800 rounded-2xl overflow-hidden shadow-md"
                        >
                            {/* Image Section */}
                            <div className="w-64 h-32 flex items-center gap-2">
                                <img
                                    src={product.product.image}
                                    alt={product.product.name}
                                    className="object-cover w-full h-full"
                                />
                                <h3 className="text-lg font-semibold whitespace-nowrap">{product.product.name}</h3>
                            </div>

                            <div className="w-1/3 p-4 text-gray-100 flex flex-col gap-2 items-center justify-center">
                                <p className="mt-1 text-sm text-gray-300">Price: ₦{product.product.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-400">Quantity: {product.quantity}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Subtotal: ₦{(product.product.price * product.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                <div className="flex items-center justify-center mt-4">
                    <div className="w-1/3 p-4 text-gray-100 flex flex-col gap-2 items-center justify-center">
                        <span className="text-lg text-emerald-400">
                            Total: {transactions.map((transaction) => transaction.totalAmount.toFixed(2))}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-center flex-col">
                    <Link to={"/"}>
                        <button className="w-64 bg-emerald-700 hover:bg-emerald-600 text-emerald-300 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center mt-4 cursor-pointer">
                            <ArrowLeft className="mr-2" size={18} />
                            Return to Shop
                        </button>
                    </Link>

                    <Link to={"/orders"}>
                        <button className="w-64 bg-emerald-700 hover:bg-emerald-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center mt-4 cursor-pointer">
                            <ArrowLeft className="mr-2" size={18} />
                            Return to Transactions
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default FullOrderPage;
