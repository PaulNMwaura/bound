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
    if ( !body.userId || !body.firstname || !body.lastname || !body.city || !body.state || !body.description || !body.unavailableDays) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate the unavailableDays array (must be an array of numbers)
    if (!Array.isArray(body.unavailableDays) || !body.unavailableDays.every((day) => typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day))) {
      console.log("Unavailble days rejected");
      return NextResponse.json({ error: "Unavailable days must be an array of strings in 'YYYY-MM-DD' format." },{ status: 400 });
    }

    // Create a new Lister document
    const newLister = new Lister({
      userId: body.userId,
      profilePicture: body.profilePicture,
      bannerPicture: body.bannerPicture || "", // Optional picture field
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      city: body.city,
      state: body.state,
      description: body.description,
      services: body.services || [], // Optional services field (empty array if not provided)
      unavailableDays: body.unavailableDays.map(String), // Unavailable days array
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