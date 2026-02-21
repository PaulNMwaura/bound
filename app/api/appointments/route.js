import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import Appointment from "@/models/appointment";
import postmarkClient from "@/lib/postmark";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { listerId, listerEmail, listerName, listerUsername, firstname, lastname, email, date, time, services, specialNote } = await req.json();
    if (!listerId || !listerEmail || !listerName || !listerUsername || !firstname || !lastname || !email || !date || !time || services.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if an appointment already exists with the same listerId, email, date, and time
    const existingAppointment = await Appointment.findOne({ listerId, email, date, time });

    if (existingAppointment) {
      return NextResponse.json(
        { message: "You've already requested an appointment at this date and time." },
        { status: 409 } // Conflict
      );
    }

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
    await Appointment.create(newAppointment);

    try {
      await postmarkClient.sendEmailWithTemplate({
        From: process.env.POSTMARK_SENDER_EMAIL,
        To: listerEmail,
        TemplateId: parseInt(process.env.POSTMARK_APPOINTMENT_REQUEST_TEMPLATE_ID),
        TemplateModel: {
          product_name: 'procklist.com',
          listerName,
          firstname,
          email,
          date,
          time,
          specialNote,
          dashboardLink: `https://www.procklist.com/profile/${listerUsername}`,
          company_name: "procklist",
          businessName: "procklist",
        },
      });
    } catch (error) {
      throw new Error("Email failed:", error);
    }

    return NextResponse.json({ message: "Appointment request sent", appointment: newAppointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();

    const url = new URL(req.url);
    const listerId = url.searchParams.get("listerId");
    const date = url.searchParams.get("date"); // 'YYYY-MM-DD'

    if (!listerId || !date) {
      return NextResponse.json({ error: "Missing listerId or date" }, { status: 400 });
    }

    // Find all appointments for that lister on that date
    const appointments = await Appointment.find({
      listerId,
      date,
      status: { $in: ["pending", "confirmed"] }, // optionally ignore cancelled
    }).select("time");

    // Return just the booked times
    const bookedTimes = appointments.map((appt) => appt.time);

    return NextResponse.json({ bookedTimes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}