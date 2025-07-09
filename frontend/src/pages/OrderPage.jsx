import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useOrdersStore} from "../stores/useOrdersStore";
import LoadingSpinner from "../components/loadingSpinner";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";

const OrderPage = () => {
    const {orderId} = useParams();
    const {orders, loading, getOrdersByItsId} = useOrdersStore();

    useEffect(() => {
        const fetchOrder = async () => await getOrdersByItsId(orderId);
        fetchOrder();
    }, [getOrdersByItsId, orderId]);

    console.log(orders);

    if (loading) return <LoadingSpinner />;
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            className="flex flex-col items-center justify-center min-h-screen bg-gray-900"
        >
            <h2 className="text-6xl font-bold text-emerald-400 text-center mb-6">Order Details</h2>
            <p className="text-emerald-400 text-center text-sm mb-4">Order ID: {orderId}</p>
            <p className="text-center text-sm mb-4 text-emerald-400">Total Amount: ${orders.totalAmount}</p>{" "}
            <p
                className={`text-gray-300 text-center text-sm mb-4 ${
                    orders.status === "Delivered"
                        ? "text-green-500"
                        : orders.status === "Shipped"
                        ? "text-yellow-500"
                        : "text-red-400"
                }`}
            >
                Status: {orders?.status ? orders?.status : "Pending"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-[100vw] pl-4 pr-4 mb-4">
                {orders.products?.map((product, index) => (
                    <div className="card bg-gray-800 w-[32vw] shadow-sm" key={index}>
                        <figure>
                            <img
                                src={product.product.image}
                                alt={product.product.name}
                                className="w-full h-48 object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-emerald-400">
                                {product.product.name}
                                <div className="badge badge-secondary">${product.product.price}</div>
                            </h2>
                            <p>Quantity: {product.quantity}</p>
                            <p>Description: {product.product.description}</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Edit Status</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-4 flex-col">
                <Link to="/">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer mb-4">
                        Back to Home Page
                    </button>
                </Link>
            </div>
        </motion.div>
    );
};

export default OrderPage;
