import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  uid:         { type: String, required: true },
  game:        { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
