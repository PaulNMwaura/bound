import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb"; // MongoDB connection utility
import Lister from "@/models/lister"; // Import your Mongoose model for Lister
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route.js";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Parse the request body
    const body = await req.json();

    // Ensure required fields are present
    if (!body.firstname || !body.lastname || !body.city || !body.state || !body.description || !body.unavailableDays) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate the unavailableDays array (must be an array of numbers)
    if (!Array.isArray(body.unavailableDays) || !body.unavailableDays.every((day) => typeof day === "number")) {
      return NextResponse.json({ error: "Unavailable days must be an array of numbers." }, { status: 400 });
    }

    // Create a new Lister document
    const newLister = new Lister({
      userId: session.user.id,
      picture: body.picture || "", // Optional picture field
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      city: body.city,
      state: body.state,
      description: body.description,
      services: body.services || [], // Optional services field (empty array if not provided)
      unavailableDays: body.unavailableDays, // Unavailable days array
    });

    // Save the Lister document to the database
    await newLister.save();

    // Return success response
    return NextResponse.json(
      { message: "Lister registered successfully", lister: newLister },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering lister:", error);

    // Return error response if something goes wrong
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}