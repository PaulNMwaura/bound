// app/api/chat/history/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { connectMongoDB } from '@/lib/mongodb';
import Message from '@/models/message';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get('otherUserId');
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const skip = parseInt(searchParams.get('skip') || '0', 10);

  if (!otherUserId) {
    return NextResponse.json({ message: 'Missing otherUserId' }, { status: 400 });
  }

  await connectMongoDB();

  const messages = await Message.find({
    $or: [
      { senderId: session.user.id, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: session.user.id },
    ],
  })
    .sort({ timestamp: -1 }) // Newest messages first
    .skip(skip)
    .limit(limit);

  // Send in chronological order (oldest → newest)
  return NextResponse.json({ messages: messages.reverse() }, { status: 200 });
}
