import { connectMongoDB } from "@/lib/mongodb";
import Photo from "@/models/photo";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { listerId } = await params;
    await connectMongoDB();

    const photos = await Photo.find({ listerId })
      .sort({ createdAt: 1 }); // earliest to latest

    return NextResponse.json({ photos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ message: "Failed to fetch photos." }, { status: 500 });
  }
}
