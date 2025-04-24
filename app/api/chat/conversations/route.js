import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Message from '@/models/message';
import mongoose from 'mongoose';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const currentUserId = searchParams.get('id');

  if (!currentUserId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  await connectMongoDB();

  const conversations = await Message.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { senderId: new mongoose.Types.ObjectId(currentUserId) },
              { receiverId: new mongoose.Types.ObjectId(currentUserId) }
            ]
          },
          {
            deletedBy: { $ne: new mongoose.Types.ObjectId(currentUserId) }
          }
        ]
      }
    },
    {
      $addFields: {
        userPair: {
          $cond: {
            if: { $gt: ['$senderId', '$receiverId'] },
            then: { $concat: [{ $toString: '$receiverId' }, '_', { $toString: '$senderId' }] },
            else: { $concat: [{ $toString: '$senderId' }, '_', { $toString: '$receiverId' }] }
          }
        }
      }
    },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$userPair',
        mostRecentMessage: { $first: '$$ROOT' }
      }
    },
    { $replaceWith: '$mostRecentMessage' },
    {
      $addFields: {
        conversationPartnerId: {
          $cond: {
            if: { $eq: ['$senderId', new mongoose.Types.ObjectId(currentUserId)] },
            then: '$receiverId',
            else: '$senderId'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'conversationPartnerId',
        foreignField: '_id',
        as: 'partner'
      }
    },
    { $unwind: '$partner' },
    {
      $project: {
        _id: 1,
        content: 1,
        timestamp: 1,
        conversationPartnerId: 1,
        partnerId: '$conversationPartnerId',
        date: '$timestamp',
        partnerUsername: '$partner.username',
        partnerProfilePicture: '$partner.profilePicture',
      }
    }
  ]);

  return NextResponse.json({ conversations });
}
