import { NextResponse } from 'next/server';
import * as Ably from 'ably';
import { connectMongoDB } from '@/lib/mongodb';
import Message from '@/models/message';

const ably = new Ably.Rest(process.env.ABLY_API_KEY);

export async function POST(req) {

  const { senderId, senderUsername, senderProfilePicture, receiverId, receiverUsername, receiverProfilePicture, content } = await req.json();

  await connectMongoDB();

  const newMessage = await Message.create({
    senderId,
    senderUsername,
    senderProfilePicture,
    receiverId,
    receiverUsername,
    receiverProfilePicture,
    content,
  });

  const channelName = [senderId, receiverId].sort().join('-');
  const channel = ably.channels.get(channelName);

  channel.publish('message', {
    _id: newMessage._id,
    senderId: newMessage.senderId,
    senderUsername: newMessage.senderUsername,
    receiverId: newMessage.receiverId,
    receiverUsername: newMessage.receiverUsername,
    content: newMessage.content,
    createdAt: newMessage.createdAt,
  });

  return NextResponse.json({ success: true });
}
