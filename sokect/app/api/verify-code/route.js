// app/api/verify-code/route.js
import { NextResponse } from 'next/server';
import VerificationCode from '@/models/VerificationCode';
import User from '@/models/User'; // 👈 Make sure this model exists
import '@/lib/db';

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    // Step 1: Verify the code
    const record = await VerificationCode.findOne({ email, code });
    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Step 2: Delete the used code
    await VerificationCode.deleteOne({ _id: record._id });

    // Step 3: Fetch user data (name + email)
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Return user data securely
    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}