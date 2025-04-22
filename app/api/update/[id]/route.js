import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req, { params }) {
  const { id } = await params;
  try {
    await connectMongoDB();

    const body = await req.json();
    const { username, firstname, lastname, password, profilePicture } = body;

    const updateData = {};

    if (username) updateData.username = username;
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (profilePicture) updateData.profilePicture = profilePicture;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('_id username firstname lastname profilePicture');

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    
    return NextResponse.json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Error occurred while attempting to update user." },
      { status: 500 }
    );
  }
}
