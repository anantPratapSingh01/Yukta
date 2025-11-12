// models/VerificationCode.js
import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  },
}, { timestamps: true });

const VerificationCode = mongoose.models.VerificationCode ||
  mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCode;
