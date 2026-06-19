import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Photo from "@/models/photo";
import { limiter } from '@/lib/limiter';


export async function POST(req) {
  const res = await limiter(req);
  
  if(!res.ok) return res;
  try {
    const body = await req.json();
    const { listerId, photo, service } = body;
    console.log(listerId);
    console.log(photo);
    console.log(service);
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
