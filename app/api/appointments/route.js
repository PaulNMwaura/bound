import { NextResponse } from "next/server";
import { connectMongoDB }from "@/app/lib/mongodb";
import Appointment from "@/app/models/appointment";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { userId, listerId, date } = await req.json();

    if (!userId || !listerId || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newAppointment = new Appointment({ userId, listerId, date });
    await newAppointment.save();

    return NextResponse.json({ message: "Appointment request sent", appointment: newAppointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
