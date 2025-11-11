// lib/db.js
import mongoose from 'mongoose';

let isConnected = false;

export default function connectDB() {
  if (isConnected) return;

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      isConnected = true;
      console.log('MongoDB connected');
    })
    .catch(err => console.error('DB connection error:', err));
}

// Call it in your API routes or root layout