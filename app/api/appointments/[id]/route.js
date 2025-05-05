import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import postmarkClient from "@/lib/postmark";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await connectMongoDB();
    
    // getting "_id" because the { id } is the lister id NOT user id.
    const appointment = await Appointment.findOne({ _id: id }).select("appointments");

    if (!appointment) {
      return NextResponse.json({ message: "No appointments found" }, { status: 404 });
    }
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const {
    appointmentId,
    date,
    formattedDate,
    time,
    status,
    firstname,
    lastname,
    email,
    specialNote
  } = await request.json();

  try {
    await connectMongoDB();

    // Update the appointment status in the Appointment model
    if (status === "accepted") {
      await Appointment.findByIdAndUpdate(
        appointmentId,
        { $set: { status} }, // Add specialNote or other fields if needed
        { new: true }
      );
    }

    if (status === "declined" || status === "canceled") {
      await Appointment.findByIdAndDelete(appointmentId);
    }

    // Send email notification
    try {
      await postmarkClient.sendEmailWithTemplate({
        From: process.env.POSTMARK_SENDER_EMAIL,
        To: email,
        TemplateId: process.env.POSTMARK_TEMPLATE_ID,
        TemplateModel: {
          product_name: "etchedintara.com",
          company_name: "etchedintara (EIT)",
          firstname,
          date: formattedDate,
          time,
          status,
          statusAccepted: status === "accepted",
          statusDeclinedOrCanceled: status === "declined" || status === "canceled",
          businessName: "EIT",
        },
      });
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }

    return NextResponse.json({ message: "Appointment updated." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}