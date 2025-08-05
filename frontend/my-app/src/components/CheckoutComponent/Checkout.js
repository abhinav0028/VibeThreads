import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

function Checkout() {
  const { cartItems, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const requiredFields = ['fullName', 'street', 'city', 'state', 'postalCode'];
    for (let field of requiredFields) {
      if (!address[field] || address[field].trim() === '') {
        alert(`Please fill in the ${field}`);
        return false;
      }
    }
    return true;
  };

  const getDiscountedTotal = () => {
    const total = getTotal();
    return discount > 0 ? Math.round(total - (total * discount) / 100) : total;
  };

  const applyCoupon = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/coupons/apply', {
        code: couponCode
      });
      
      setDiscount(res.data.discountPercent);
      setCouponError('');
      alert(`Coupon Applied: ${res.data.discountPercent}% off`);
    } catch (err) {
      setDiscount(0);
      setCouponError(err.response?.data?.message || 'Invalid Coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    if (paymentMethod === 'Cash on Delivery') {
      placeCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  const placeCODOrder = async () => {
    try {
      const orderData = {
        products: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          size: item.size,
        })),
        address,
        paymentMethod: 'Cash on Delivery',
        totalAmount: getDiscountedTotal(),
        appliedCoupon: couponCode || null,
      };

      await axios.post('http://localhost:8080/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert('Order placed successfully!');
      navigate('/order');
    } catch (err) {
      console.error(' COD order failed:', err);
      alert('Failed to place order');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    try {
      const orderRes = await axios.post('http://localhost:8080/api/payment/create-order', {
        amount: getDiscountedTotal()
      });

      const options = {
        key:process.env.REACT_APP_RAZORPAY_KEY, // Replace with real Razorpay key
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Vibe Thread",
        description: "Order Payment",
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            await axios.post('http://localhost:8080/api/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amount: getDiscountedTotal(),
              address,
              appliedCoupon: couponCode || null,
              products: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                size: item.size,
              })),
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            alert('Payment successful and order placed!');
            navigate('/order');
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment failed');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email || "",
        },
        notes: {
          address: `${address.street}, ${address.city}, ${address.state}`,
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(" Razorpay order creation failed:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-section">
        <h3>Shipping Address</h3>
        {Object.entries(address).map(([key, value]) => (
          <input
            key={key}
            name={key}
            value={value}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            required
            autoComplete="off"
          />
        ))}
      </div>

      <div className="checkout-section">
        <h3>Apply Coupon</h3>
        <div className="coupon-box">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <button onClick={applyCoupon}>Apply</button>
        </div>
        {couponError && <p className="error">{couponError}</p>}
        {discount > 0 && <p className="success">Coupon applied: {discount}% off</p>}
      </div>

      <div className="checkout-section">
        <h3>Payment Method</h3>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option>Cash on Delivery</option>
          <option>Online Payment</option>
        </select>
      </div>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item, i) => (
            <li key={i}>{item.name} ({item.size}) x {item.quantity} - ₹{item.price * item.quantity}</li>
          ))}
        </ul>
        <h4>Total: ₹{getTotal()}</h4>
        {discount > 0 && (
          <h4>Discounted Total: ₹{getDiscountedTotal()}</h4>
        )}
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>
        {paymentMethod === "Cash on Delivery" ? "Place Order" : "Pay Now"}
      </button>
    </div>
  );
}

export default Checkout;
