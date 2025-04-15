import { NextResponse } from 'next/server';
import * as Ably from 'ably';
import { connectMongoDB } from '@/lib/mongodb';
import Message from '@/models/message';

const ably = new Ably.Rest(process.env.ABLY_API_KEY);

export async function POST(req) {
  const { senderId, receiverId, content } = await req.json();

  await connectMongoDB();

  const newMessage = await Message.create({
    senderId,
    receiverId,
    content,
  });

  const channelName = [senderId, receiverId].sort().join('-');
  const channel = ably.channels.get(channelName);

  channel.publish('message', {
    _id: newMessage._id,
    senderId,
    receiverId,
    content,
    createdAt: newMessage.createdAt,
  });

  return NextResponse.json({ success: true });
}
