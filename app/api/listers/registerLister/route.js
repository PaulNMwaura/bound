import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Parse the request body
    const body = await req.json();

    // Ensure required fields are present
    if ( !body.userId || !body.firstname || !body.lastname || !body.city || !body.state || !body.description || !body.availability ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    // Create a new Lister document
    const newLister = new Lister({
      userId: body.userId,
      username: body.username,
      profilePicture: body.profilePicture,
      bannerPicture: body.bannerPicture || "", // Optional picture field
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      language: body.language,
      city: body.city,
      state: body.state,
      description: body.description,
      services: body.services || [], // Optional services field (empty array if not provided)
      instructions: body.instructions || "", // Optional instructions field
      availability: body.availability,
    });

    // Save the Lister document to the database
    await newLister.save();

    // Return success response
    return NextResponse.json({ lister: newLister },{ status: 200 });
  } catch (error) {
    console.error("Error registering lister:", error);

    // Return error response if something goes wrong
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}