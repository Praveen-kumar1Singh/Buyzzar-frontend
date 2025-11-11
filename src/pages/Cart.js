import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import loadRazorpayScript from '../common/loadRazorpay';


const user = JSON.parse(localStorage.getItem("user")) || {};

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await fetchData(); // wait for data to be fetched
      setLoading(false);
    };
  
    loadCart();
  }, []);
  

  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: 'include',
        headers: { "content-type": 'application/json' },
      });
  
      const responseData = await response.json();
      console.log("🛒 Cart Response:", responseData); // 👈 Add this
      if (responseData.success) {
        setData(responseData.data);
      } else {
        toast.error("Failed to fetch cart items.");
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      toast.error("Something went wrong while fetching cart.");
    }
  };
  

  const updateCartQuantity = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ _id: id, quantity: qty }),
    });

    const responseData = await response.json();
    if (responseData.success) fetchData();
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ _id: id }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0);
  const subtotal = data.reduce((prev, curr) => prev + (curr.quantity * curr?.productId?.sellingPrice), 0);
  const gst = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const finalTotal = subtotal + gst + shipping;

  const handlePayment = async () => {
    try {
      const res = await loadRazorpayScript();

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      if (!data.length) {
        toast("Your cart is empty. Add products before proceeding.");
        return;
      }
      setButtonLoading(true);

      const response = await fetch("http://localhost:8080/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(finalTotal * 100), currency: "INR" })
      });

      const result = await response.json();
      if (!result.success) {
        toast("Payment initiation failed!");
        setButtonLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_Bdf5Hz7lmEPIaQ",
        amount: result.order.amount,
        currency: result.order.currency,
        name: "Apna Attire",
        description: "Order Payment",
        order_id: result.order.id,
        handler: async (paymentResponse) => {
           console.log("🧾 Payment Response:", paymentResponse);  // <-- Here!
          try {
            const verifyRes = await fetch("http://localhost:8080/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...paymentResponse }),
            });

            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              toast.success("Payment Successful!");

              await fetch("http://localhost:8080/api/orders/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user._id,
                  userEmail: user.email,       // 👈 Important
                  userName: user.name,         // 👈 Optional but good
                  items: data,
                  totalAmount: finalTotal,
                  paymentId: paymentResponse.razorpay_payment_id,
                }),
              });

              toast.success("Order placed & confirmation email sent!");

              await fetch(SummaryApi.clearCart.url, {
                method: SummaryApi.clearCart.method,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
              });

              context.fetchUserAddToCart();
              window.location.href = "/order-success";
            } else {
              toast.error("Payment Verification Failed. Try again.");
            }
          } catch (err) {
            console.error("❌ Error in payment handler:", err);
            toast.error("Something went wrong after payment.");
          } finally {
            setButtonLoading(false);
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Payment process failed. Please try again.");
      setButtonLoading(false);
    }
  };

  return (
    <div className='container mx-auto'>
      <div className='text-center text-lg my-3'>
        {data.length === 0 && !loading && <p className='bg-white py-5'>No Data</p>}
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
        <div className='w-full max-w-3xl'>
          {loading
            ? loadingCart.map((_, index) => <div key={index} className='w-full bg-slate-200 h-32 my-2 animate-pulse rounded'></div>)
            : data.map(product => (
              <div key={product._id} className='w-full bg-white h-32 my-2 border rounded grid grid-cols-[128px,1fr]'>
                <div className='w-32 h-32'>
                  <img src={product.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                </div>
                <div className='px-4 py-2 relative'>
                  <div className='absolute right-0 text-red-600 p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product._id)}>
                    <MdDelete />
                  </div>
                  <h2 className='text-lg lg:text-xl line-clamp-1'>{product.productId?.productName}</h2>
                  <p className='capitalize text-slate-500'>{product.productId.category}</p>
                  <div className='flex items-center justify-between'>
                    <p className='text-red-600 font-medium'>{displayINRCurrency(product.productId.sellingPrice)}</p>
                    <p className='text-slate-600 font-semibold'>{displayINRCurrency(product.productId.sellingPrice * product.quantity)}</p>
                  </div>
                  <div className='flex items-center gap-3 mt-1'>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 rounded' onClick={() => updateCartQuantity(product._id, product.quantity - 1)}>-</button>
                    <span>{product.quantity}</span>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 rounded' onClick={() => updateCartQuantity(product._id, product.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className='w-full max-w-sm'>
          <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
          <p>Subtotal: {displayINRCurrency(subtotal)}</p>
          <p>GST (18%): {displayINRCurrency(gst)}</p>
          <p>Shipping: {displayINRCurrency(shipping)}</p>
          <p><strong>Total: {displayINRCurrency(finalTotal)}</strong></p>
          <button
            className='bg-blue-600 p-2 text-white w-full mt-2 disabled:opacity-50'
            onClick={handlePayment}
            disabled={buttonLoading}
          >
            {buttonLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;