import mongoose from 'mongoose';

const affiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  description: { type: String, required: true },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'suspended'], 
    default: 'active' 
  },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Affiliate = mongoose.model('Affiliate', affiliateSchema);
export default Affiliate;
