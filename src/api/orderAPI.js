const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://buyzzar-backend.vercel.app";

// 💳 Create Razorpay order
export const placeOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/razorpay/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return { success: false, message: error.message };
  }
};

// 🔁 Sync order to Qikink
export const syncOrderToQikink = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qikink-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to sync order to Qikink");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error syncing order to Qikink:", error);
    return { success: false, message: error.message };
  }
};

// 📦 Save final order after Razorpay success
export const placeFinalOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to save order");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error saving final order:", error);
    return { success: false, message: error.message };
  }
};

// 🧾 Fetch all orders (admin)
export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders`);

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return { success: false, message: error.message };
  }
};

// 👤 Fetch orders for a specific user
export const fetchUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user orders");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    return { success: false, message: error.message };
  }
};
