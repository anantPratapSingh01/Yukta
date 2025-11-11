// app/api/send-code/route.js
import { NextResponse } from 'next/server';
import VerificationCode from '@/models/VerificationCode';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';

// Connect DB (agar tune global connect kiya hai toh skip kar)
import '@/lib/db'; // <-- Tere MongoDB connection file ka path

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = randomInt(100000, 999999).toString();

    // Save in DB (auto-expire in 60s)
    await VerificationCode.create({ email, code });

    // Setup Nodemailer (use your Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,    // e.g., your@gmail.com
        pass: process.env.EMAIL_PASS     // App Password (not regular password!)
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}\n\nThis code expires in 60 seconds.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}