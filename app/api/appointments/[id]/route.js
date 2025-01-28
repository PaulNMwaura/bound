import { NextResponse } from "next/server";
import { connectMongoDB }from "@/app/lib/mongodb";
import Appointment from "@/app/models/appointment";

export async function GET(req, { params }) {
// console.log("attempting to fetch.");
  try {
    await connectMongoDB();
    const { id } = await params;
    // const { status } = await req.json();
    let status = "Testing";
    // console.log("searching: ", id);

    const updatedAppointment = await Appointment.find({listerId: id});
    if (!updatedAppointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Appointment updated", appointment: updatedAppointment });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
