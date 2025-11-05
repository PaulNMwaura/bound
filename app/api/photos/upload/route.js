import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Photo from "@/models/photo";

export async function POST(req) {
  try {
    const body = await req.json();
    const { listerId, photo, service } = body;

    if (!listerId || !photo || !service) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    await connectMongoDB();
    await Photo.create({ listerId, photo, service });

    return NextResponse.json({ message: "Image uploaded successfully." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error uploading image." }, { status: 500 });
  }
}
