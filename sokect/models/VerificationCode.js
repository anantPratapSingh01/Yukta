// models/VerificationCode.js
import { Schema, model } from 'mongoose';

const verificationCodeSchema = new Schema({
  email: { type: String, required: true, lowercase: true },
  code: { type: String, required: true },
  createdAt: { type: Date, expires: '60s', default: Date.now } // Auto-delete after 60s
});

export default model('VerificationCode', verificationCodeSchema);