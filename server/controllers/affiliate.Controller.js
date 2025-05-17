import Affiliate from '../models/Affiliate.model.js';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount, currency, notes } = req.body;

    if (!amount || !currency || !notes) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const options = {
      amount: amount * 100, // Convert rupees to paise
      currency,
      receipt: `affiliate_${Date.now()}`,
      notes,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Verify Payment and Save Affiliate
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment details' });
    }

    // 1️⃣ Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    // 2️⃣ Get the actual payment details
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    // 3️⃣ Check if payment is really successful
    if (paymentDetails.status !== 'captured') {
      return res.status(400).json({
        success: false,
        error: `Payment not successful. Current status: ${paymentDetails.status}`,
      });
    }

    // 4️⃣ Save affiliate details
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes || {};

    const affiliate = new Affiliate({
      name: notes.name || '',
      email: notes.email || '',
      phone: notes.phone || '',
      description: notes.description || '',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: order.amount / 100,
      status: 'active'
    });

    await affiliate.save();

    res.status(200).json({ success: true, message: 'Payment verified and affiliate saved' });
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export default {
  createOrder,
  verifyPayment
};
