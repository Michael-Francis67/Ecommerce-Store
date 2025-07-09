import {motion} from "framer-motion";
import TransactionItem from "../components/TransactionItem";
import {useOrdersStore} from "../stores/useOrdersStore";
import {useEffect} from "react";
import LoadingSpinner from "../components/loadingSpinner";

const TransactionsPage = () => {
    const {transactions, fetchTransactions, loading} = useOrdersStore();

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div
            className="rounded-lg overflow-hidden max-w-4xl mx-auto"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
        >
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">Transactions</h1>
                <p className="text-center text-xl text-gray-300 mb-12">
                    Discover the latest trends in eco-friendly fashion
                </p>

                <table className=" min-w-full divide-y divide-gray-700  bg-gray-800">
                    <thead className="bg-gray-700">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Product
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Price
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Order ID
                            </th>

                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Date
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {transactions.map((transaction) => (
                            <TransactionItem transaction={transaction} key={transaction._id} />
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TransactionsPage;
