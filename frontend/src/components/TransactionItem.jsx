const TransactionItem = ({transaction}) => {
    const handleClick = async (id) => {
        window.location.href = `/transactions/${id}`;
    };

    return (
        <>
            <tr key={transaction._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            {transaction.products
                            .slice(0, 1)
                            .map(
                                (product) => (
                                    console.log(product),
                                    (
                                        <img
                                            className="h-10 w-10 object-cover rounded-full z-50"
                                            key={product.product._id}
                                            src={product.product.image}
                                            alt={product.product.name}
                                        />
                                    )
                                )
                            )}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-white">{transaction.products[0].product.name}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">${transaction.totalAmount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{transaction._id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{new Date(transaction.createdAt).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleClick(transaction._id);
                            }}
                            className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-500 cursor-pointer transition duration-300 ease-in-out"
                        >
                            Details
                        </button>
                    </div>
                </td>
            </tr>
        </>
    );
};

export default TransactionItem;
