import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            {/* 🎉 Animated Success Icon */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-green-500 text-white p-6 rounded-full shadow-lg"
            >
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                </svg>
            </motion.div>

            {/* 🎊 Animated Text */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="text-3xl font-semibold text-gray-800 mt-6"
            >
                Order Placed Successfully!
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                className="text-gray-600 mt-2 text-lg"
            >
                Thank you for shopping with us.
            </motion.p>

            {/* 🎈 Animated Buttons */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
                className="mt-6 flex gap-4"
            >
                <Link to="/my-orders" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg hover:bg-blue-600 transition">
                    View Orders
                </Link>
                <Link to="/" className="bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg hover:bg-gray-800 transition">
                    Continue Shopping
                </Link>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
