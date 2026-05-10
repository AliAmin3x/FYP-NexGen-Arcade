import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  uid:         { type: String, required: true },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
