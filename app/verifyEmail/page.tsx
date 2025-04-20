import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { Hero } from "@/sections/verifyEmailPage/Hero";

export default async function CheckEmailPage() {
  const session = await getServerSession();

  if (session) {
      await connectMongoDB();
      const user = await User.findOne({ email: session.user.email });

      // If verified, redirect to login
      if (user?.verified) {
        return redirect('/login');
      }
  }
  // Show the client-side component with email passed in
  return (
    <div>
        <Hero />
    </div>
);
}
