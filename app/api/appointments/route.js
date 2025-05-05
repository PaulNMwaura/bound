import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import Appointment from "@/models/appointment";
import postmarkClient from "@/lib/postmark";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { listerId, listerEmail, listerName, listerUsername, firstname, lastname, email, date, time, services, specialNote } = await req.json();
    if (!listerId || !listerEmail || !listerName || !listerUsername || !firstname || !lastname || !email || !date || !time || !services) {
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
          product_name: 'etchedintara.com',
          listerName,
          firstname,
          email,
          date,
          time,
          specialNote,
          dashboardLink: `https://www.etchedintara.com/profile/${listerUsername}`,
          company_name: "etchedintara (EIT)",
          businessName: "EIT",
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