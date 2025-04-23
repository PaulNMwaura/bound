import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Lister from "@/models/lister";

export async function POST(req) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { bannerPicture, username, firstname, lastname, profilePicture, listerId, city, state, description, services, instructions } = body;

    const updateData = {};

    if (bannerPicture) updateData.bannerPicture = bannerPicture;
    if (username) updateData.username = username;
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (description) updateData.description = description;
    if (services) updateData.services = services;
    if (instructions) updateData.instructions = instructions;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    const updatedLister = await Lister.findByIdAndUpdate(listerId, { $set: updateData }, { new: true }).select('_id bannerPicture city state instructions');

    if (!updatedLister) {
      return NextResponse.json({ message: "Lister not found." }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Lister updated successfully.", lister: updatedLister }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Error occurred while attempting to update user." },
      { status: 500 }
    );
  }
}
