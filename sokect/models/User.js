import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date,
}, { timestamps: true });

const User = models.User || model('User', userSchema);
export default User;