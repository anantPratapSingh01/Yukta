// app/api/send-code/route.js
import { NextResponse } from 'next/server';
import VerificationCode from '@/models/VerificationCode';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import '@/lib/db'; // MongoDB connection

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = randomInt(100000, 999999).toString();

    // Save in DB (auto-expire in 60s)
    await VerificationCode.findOneAndUpdate(
  { email },
  { code, createdAt: new Date() }, // reset timer by updating timestamp
  { upsert: true, new: true }
);

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Beautiful HTML Email Template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Yukta Verification Code',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email – Yukta</title>
</head>
<body style="margin: 0; padding: 0; background: #f9fafb; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 48px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
    <!-- Brand Header -->
    <tr>
      <td align="center" style="padding: 32px 24px 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
        <div style="font-size: 28px; font-weight: 800; background: linear-gradient(90deg, #0ea5e9, #0284c7); -webkit-background-clip: text; background-clip: text; color: transparent; letter-spacing: -0.5px;">
          Yukta
        </div>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 32px 32px 24px;">
        <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 12px;">Verify Your Identity</h2>
        <p style="font-size: 16px; color: #475569; margin: 0 0 28px;">
          Enter the verification code below to securely access your account.  
          <strong>This code expires in 60 seconds.</strong>
        </p>

        <!-- Verification Code Display -->
        <div style="text-align: center; margin: 28px 0;">
          <div style="display: inline-block; background: #f1f9ff; border: 1px dashed #93c5fd; border-radius: 12px; padding: 18px 32px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0c4a6e; font-family: monospace;">
            ${code}
          </div>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          🔒 Your security is our priority. Never share this code with anyone.
        </p>
        <p style="font-size: 14px; color: #64748b; margin: 8px 0 0;">
          If you didn’t request this, please disregard this email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding: 20px; background: #f8fafc; color: #94a3b8; font-size: 13px; border-top: 1px solid #edf2f7;">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} Yukta. All rights reserved.
        </p>
        <p style="margin: 6px 0 0; font-size: 12px; color: #a1aec7;">
          Seamless. Secure. Trusted.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email sending error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}