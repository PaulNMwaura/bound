import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { listerId, firstname, lastname, date, time, services } = await req.json();
    if (!listerId || !firstname || !lastname || !date || !time || !services) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Find the lister
    const lister = await Lister.findOne({_id: listerId});
    if (!lister) {
      return NextResponse.json({ message: "Lister not found" }, { status: 404 });
    }


    // Create a new appointment object
    const newAppointment = {
      listerId, 
      firstname,
      lastname,
      time,
      date,
      services,
      status: "pending"
    };
    // Add the appointment to the lister's appointments array
    lister.appointments.push(newAppointment);
    // Save the updated lister document
    await lister.save();

    return NextResponse.json({ message: "Appointment request sent", appointment: newAppointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}