import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await connectMongoDB();
    
    // getting "_id" because the { id } is the lister id NOT user id.
    const lister = await Lister.findOne({ _id: id }).select("appointments");
    
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

export async function PUT(request,{ params }) {
  const { id } = await params;
  const { appointmentId, date, time, status } = await request.json();
  console.log("Lister: ", id);
  console.log("Appt: ", appointmentId);
  try {
    await connectMongoDB();
    if (status == "accepted") {
      await Lister.findOneAndUpdate({_id: id, "appointments._id": appointmentId}, { $set:{"appointments.$.status": status}}, {new: true});
    }
    if (status == "declined" || status == "canceled") {
      await Lister.findOneAndUpdate({_id: id}, {$pull: {appointments: {_id: appointmentId, date: date, time: time}}}, {new: true});
    }

    return NextResponse.json({message: "Appointment updated."}, {status: 200});
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, {params}) {
  // we need to get the correct variable to find the appointment that needs to be deleted.
}