import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  await connectMongoDB();

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  user.verified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save();

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}login`);
}
