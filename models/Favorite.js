import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  uid:    { type: String, required: true },
  gameId: { type: String, required: true },
  name:   { type: String, required: true },
  price:  { type: Number },
  image:  { type: String },
}, { timestamps: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
