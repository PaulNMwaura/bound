import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import Lister from "@/app/models/lister";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = await params;
    console.log("id: ", id);
    const lister = await Lister.findOne({ userId: id }).select("appointments");
    
    if (!lister) {
      return NextResponse.json({ message: "No lister found" }, { status: 404 });
    }
    if (!lister.appointments) {
      return NextResponse.json({ message: "No appointments found" }, { status: 404 });
    }
    return NextResponse.json(lister.appointments);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
