import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchUserOrders } from "../api/orderAPI"; // ✅ Adjust path if needed

const MyOrders = () => {
    const { user } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrders = async () => {
            if (!user?._id) return;
            setLoading(true);
            const result = await fetchUserOrders(user._id);
            if (result.success) {
                setOrders(result.orders);
            }
            setLoading(false);
        };

        getOrders();
    }, [user?._id]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🧾 My Orders</h2>

            {loading ? (
                <p className="text-gray-500">Loading orders...</p>
            ) : orders.length ? (
                <ul className="space-y-6">
                    {orders.map((order) => (
                        <li key={order._id} className="border p-4 rounded-md shadow-md bg-white">
                            <div className="font-semibold text-lg">🆔 Order ID: {order._id}</div>
                            <div className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
                            <div className="mt-2 text-sm">💳 Payment ID: {order.paymentId}</div>
                            <div className="mt-2 text-sm">📦 Status: <span className="font-medium">{order.status}</span></div>
                            <div className="mt-2 text-sm">💰 Total: ₹{order.totalAmount}</div>

                            <div className="mt-4">
                                <div className="font-medium mb-1">🛍️ Products:</div>
                                <ul className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex items-center gap-4">
                                            {item.productId?.productImage?.[0] && (
                                                <img
                                                    src={item.productId.productImage[0]}
                                                    alt={item.productId.productName}
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            )}
                                            <div>
                                                <div className="font-semibold">
                                                    {item.productId?.productName || "Unknown Product"}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">You have not placed any orders yet.</p>
            )}
        </div>
    );
};

export default MyOrders;
