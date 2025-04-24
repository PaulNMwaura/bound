import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import Message from "@/models/message";
import mongoose from "mongoose";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, conversationPartnerId } = await req.json();
    if (!userId || !conversationPartnerId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await connectMongoDB();

    const currentUserId = new mongoose.Types.ObjectId(userId);
    const partnerId = new mongoose.Types.ObjectId(conversationPartnerId);

    // Mark messages as "deleted" for the current user
    const res = await Message.updateMany(
      {
        $or: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId }
        ]
      },
      {
        $addToSet: { deletedBy: currentUserId } // Add user to `deletedBy` array (no duplicates)
      }
    );

    if(res.ok) {
        // Then, delete messages that have been deleted by BOTH users
        const messagesToDelete = await Message.find({
            $or: [
              { senderId: currentUserId, receiverId: partnerId },
              { senderId: partnerId, receiverId: currentUserId }
            ],
            "deletedBy.1": { $exists: true } // Check if there are more than one element in `deletedBy` array
          });
          
          // Step 3: If the `deletedBy` array has more than one element, delete the messages
          if (messagesToDelete.length > 0) {
            await Message.deleteMany({
              $or: [
                { senderId: currentUserId, receiverId: partnerId },
                { senderId: partnerId, receiverId: currentUserId }
              ]
            });
          }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete conversation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
