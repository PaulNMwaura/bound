import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
  try {
    // Extract email and username from the request body
    const { email, username } = await req.json();
    
    // Connect to MongoDB
    await connectMongoDB();

    // Check if either the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] }).select("_id email username");
    
    // If a user is found, return the user details (either email or username is already taken)
    return NextResponse.json({ user: existingUser });
  } catch (error) {
    console.log("Couldn't match email or usernames properly");
    return NextResponse.json({ error: "An error occurred while checking user data" }, { status: 500 });
  }
}
