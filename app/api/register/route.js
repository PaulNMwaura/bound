import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const {firstname, lastname, phone, email, password, profilePicture} = await req.json();

        const hashedPass = await bcrypt.hash(password, 10);
        
        await connectMongoDB();
        await User.create({firstname, lastname, phone, email, password: hashedPass, profilePicture})

        return NextResponse.json({message: "User Registered."}, { status: 201 });
    } catch (error) {
        return NextResponse.json({message: "Error occured while registering the user."}, { status: 500});
    }
}