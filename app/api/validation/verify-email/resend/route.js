// /app/api/resend-verification/route.ts
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { sendVerificationEmail } from '@/lib/postmark';
import { addMinutes } from 'date-fns';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req) {
  const { email } = await req.json();
  await connectMongoDB();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.verified) {
    return NextResponse.json({ message: 'Already verified' });
  }

  const now = new Date();
  if (user.emailVerificationTokenExpiry && user.emailVerificationTokenExpiry > now) {
    return NextResponse.json({
      error: 'Please wait before requesting a new email.',
    }, { status: 429 });
  }

  const token = nanoid();
  const expiry = addMinutes(now, 5); // Allow one resend every 5 minutes

  user.emailVerificationToken = token;
  user.emailVerificationTokenExpiry = expiry;
  await user.save();

  try {
    const url = `${process.env.NEXTAUTH_URL}/api/validation/verify-email?token=${token}`;

    await postmarkClient.sendEmailWithTemplate({
      From: process.env.POSTMARK_SENDER_EMAIL,
      To: email,
      TemplateId: parseInt(process.env.POSTMARK_EMAIL_VERIFICATION_TEMPLATE_ID),
      TemplateModel: {
        product_name: 'etchedintara.com',
        firstname,
        verificationUrl: url,
        // action_url: url,
        company_name: "etchedintara (EIT)",
        businessName: "EIT",
      },
    });
    console.log("Verification email resent successfully");
    } catch (error) {
        console.error("Email failed:", error);
    }

  return NextResponse.json({ message: 'Verification email resent' });
}
