import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import Appointment from "@/models/appointment";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { listerId, firstname, lastname, email, date, time, services, specialNote } = await req.json();
    if (!listerId || !firstname || !lastname || !email || !date || !time || !services) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // // Find the lister
    // const lister = await Lister.findOne({_id: listerId});
    // if (!lister) {
    //   return NextResponse.json({ message: "Lister not found" }, { status: 404 });
    // }


    // Create a new appointment object
    const newAppointment = {
      listerId, 
      firstname,
      lastname,
      email,
      time,
      date,
      services,
      specialNote,
      status: "pending"
    };
    // Add the appointment to the lister's appointments array
    await Appointment.create(newAppointment);
    // // Save the updated lister document
    // await Appointment.save();

    return NextResponse.json({ message: "Appointment request sent", appointment: newAppointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}