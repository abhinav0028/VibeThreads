import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(" Received amount:", amount);
    console.log(" Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
    console.log(" Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);

    res.status(200).json(order);
  } catch (error) {
    console.error(" Razorpay order creation failed:", error);
    res.status(500).json({ message: 'Razorpay order failed', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature === razorpaySignature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};

