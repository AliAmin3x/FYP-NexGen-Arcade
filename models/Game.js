import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },
  imageUrl:    { type: String, required: true },
  type:        { type: String, enum: ['recommended', 'featured', 'free'], default: 'recommended' },
  status:      { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  uid:         { type: String }, // developer's user id
}, { timestamps: true });

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
