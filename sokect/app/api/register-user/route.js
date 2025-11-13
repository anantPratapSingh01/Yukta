import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'all fields are required' }, { status: 400 });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return NextResponse.json({ error: 'user already exists. Try another email.' }, { status: 400 });
    }

    const user = await User.create({ email, name });

    if (!user) {
      return NextResponse.json({ error: 'User not saved' }, { status: 400 });
    }

    return NextResponse.json({ message: "User saved successfully", user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
