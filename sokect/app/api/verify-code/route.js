// app/api/verify-code/route.js
import { NextResponse } from 'next/server';
import VerificationCode from '@/models/VerificationCode';
import '@/lib/db';

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    const record = await VerificationCode.findOne({ email, code });

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // ✅ Code valid hai → delete it & allow login
    await VerificationCode.deleteOne({ _id: record._id });

    // Store email in session or create a temp token (for simplicity, we just allow redirect)
    // In real app: create JWT or session

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}