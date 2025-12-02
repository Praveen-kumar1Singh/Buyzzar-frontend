import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import loadRazorpayScript from '../common/loadRazorpay';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
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
      console.log("🛒 Cart Response:", responseData);
      if (responseData.success) {
        setData(responseData.data || []);
      } else {
        toast.error("Failed to fetch cart items.");
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      toast.error("Something went wrong while fetching cart.");
    }
  };

  const updateCartQuantity = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify({ _id: id, quantity: qty }),
      });

      const responseData = await response.json();
      if (responseData.success) fetchData();
    } catch (err) {
      console.error('updateCartQuantity error', err);
      toast.error('Could not update cart');
    }
  };

  const deleteCartProduct = async (id) => {
    try {
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
    } catch (err) {
      console.error('deleteCartProduct error', err);
      toast.error('Could not delete item');
    }
  };

  const totalQty = data.reduce((prev, curr) => prev + (curr.quantity || 0), 0);
  const subtotal = data.reduce((prev, curr) => prev + ((curr.quantity || 0) * (curr?.productId?.sellingPrice || 0)), 0);
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

      // compute amount
      const amountInPaise = Math.round(finalTotal * 100);
      console.log('finalTotal (₹):', finalTotal, 'amountInPaise:', amountInPaise);

      if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
        toast.error('Invalid total amount. Please review your cart.');
        setButtonLoading(false);
        return;
      }

      // create order
      const createResp = await fetch(`${API_BASE_URL}/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise, currency: "INR" })
      });

      const text = await createResp.text();
      let createResult;
      try { createResult = text ? JSON.parse(text) : null; } catch (e) { createResult = text; }

      if (!createResp.ok) {
        console.error("create-order failed", createResp.status, createResult);
        toast.error(`Payment initiation failed (${createResp.status}): ${typeof createResult === 'string' ? createResult : (createResult?.message || JSON.stringify(createResult))}`);
        setButtonLoading(false);
        return;
      }

      console.log('create-order success:', createResult);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_ReifSue04z1Ma0",
        amount: createResult.order.amount,
        currency: createResult.order.currency,
        name: "Apna Attire",
        description: "Order Payment",
        order_id: createResult.order.id,
        handler: async (paymentResponse) => {
          console.log("🧾 Payment Response:", paymentResponse);
          try {
            // verify payment
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...paymentResponse, orderId: createResult.order.id }),
            });

            const verifyText = await verifyRes.text();
            let verifyResult;
            try { verifyResult = verifyText ? JSON.parse(verifyText) : null; } catch (e) { verifyResult = verifyText; }

            if (!verifyRes.ok) {
              console.error('verify payment failed', verifyRes.status, verifyResult);
              toast.error(`Payment verification failed (${verifyRes.status}): ${typeof verifyResult === 'string' ? verifyResult : (verifyResult?.message || JSON.stringify(verifyResult))}`);
              return;
            }

            if (verifyResult && verifyResult.success) {
              toast.success("Payment Successful!");

              // save final order
              const saveResp = await fetch(`${API_BASE_URL}/api/orders/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user._id,
                  userEmail: user.email,
                  userName: user.name,
                  items: data,
                  totalAmount: finalTotal,
                  paymentId: paymentResponse.razorpay_payment_id,
                }),
              });

              const saveText = await saveResp.text();
              let saveResult;
              try { saveResult = saveText ? JSON.parse(saveText) : null; } catch (e) { saveResult = saveText; }

              if (!saveResp.ok) {
                console.error('save order failed', saveResp.status, saveResult);
                toast.error(`Order saving failed (${saveResp.status}): ${typeof saveResult === 'string' ? saveResult : (saveResult?.message || JSON.stringify(saveResult))}`);
                return;
              }

              toast.success("Order placed & confirmation email sent!");

              // clear cart
              try {
                await fetch(SummaryApi.clearCart.url, {
                  method: SummaryApi.clearCart.method,
                  credentials: 'include',
                  headers: { "Content-Type": "application/json" },
                });
              } catch (err) {
                console.warn('clear cart failed', err);
              }

              context.fetchUserAddToCart();
              window.location.href = "/order-success";
            } else {
              console.error('verifyResult indicates failure', verifyResult);
              toast.error('Payment Verification Failed. Try again.');
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

      // keep button disabled while modal is open; it will be re-enabled in handler's finally
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
                  <img src={product.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt={product.productId?.productName} />
                </div>
                <div className='px-4 py-2 relative'>
                  <div className='absolute right-0 text-red-600 p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product._id)}>
                    <MdDelete />
                  </div>
                  <h2 className='text-lg lg:text-xl line-clamp-1'>{product.productId?.productName}</h2>
                  <p className='capitalize text-slate-500'>{product.productId?.category}</p>
                  <div className='flex items-center justify-between'>
                    <p className='text-red-600 font-medium'>{displayINRCurrency(product.productId?.sellingPrice || 0)}</p>
                    <p className='text-slate-600 font-semibold'>{displayINRCurrency((product.productId?.sellingPrice || 0) * (product.quantity || 0))}</p>
                  </div>
                  <div className='flex items-center gap-3 mt-1'>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 rounded' onClick={() => updateCartQuantity(product._id, Math.max(1, (product.quantity || 1) - 1))}>-</button>
                    <span>{product.quantity || 1}</span>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 rounded' onClick={() => updateCartQuantity(product._id, (product.quantity || 1) + 1)}>+</button>
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
