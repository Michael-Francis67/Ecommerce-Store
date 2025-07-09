import React, {useState, useEffect} from "react";
import {useOrdersStore} from "../stores/useOrdersStore";
import LoadingSpinner from "./loadingSpinner";

const ProductsTab = () => {
    const {orders, loading, fetchOrders} = useOrdersStore();

    useEffect(() => {
        const fetchData = async () => {
            await fetchOrders();
        };

        fetchData();
    }, [fetchOrders]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox border-white" />
                            </label>
                        </th>
                        <th className="text-white">Product</th>
                        <th className="text-white">Address</th>
                        <th className="text-white">Status</th>
                        <th className="text-white">Total Amount</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {orders?.map((order) => (
                        <tr key={order._id}>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox border-white" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                            <img
                                                src={order.products.map((product) => product.product.image)[0]}
                                                alt={order.products.map((product) => product.product.name)[0]}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-emerald-400">
                                            {order.products.map((product) => product.product.name)[0]}
                                        </div>
                                        <div className="text-sm opacity-50">{order._id}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {order.shippingAddress?.address ? order.shippingAddress.address : "Address not found"}
                                <br />
                                <div className="flex flex-col gap-1 justify-center">
                                    <span className="badge badge-ghost badge-sm bg-emerald-400 text-emerald-700">
                                        {order.shippingAddress?.name
                                            ? order.shippingAddress?.name
                                            : order.user?.name
                                            ? order.user?.name
                                            : "Name not found"}
                                    </span>
                                    <span>
                                        {order.shippingAddress?.phoneNumber
                                            ? "0" + order.shippingAddress.phoneNumber
                                            : "Phone number not found"}
                                    </span>
                                </div>
                            </td>
                            <td>{order.status}</td>
                            <th>
                                <button className="btn btn-ghost btn-xs">${order.totalAmount}</button>
                            </th>
                            <td>
                                <button
                                    className="btn btn-ghost btn-xs"
                                    onClick={() => {
                                        window.location.href = `/order/${order._id}`;
                                    }}
                                >
                                    details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                {/* foot */}
                <tfoot>
                    <tr>
                        <th className="text-emerald-400"></th>
                        <th className="text-emerald-400">Product</th>
                        <th className="text-emerald-400">Address</th>
                        <th className="text-emerald-400">Status</th>
                        <th className="text-emerald-400">Total Amount</th>
                        <th className="text-emerald-400">Action</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ProductsTab;
