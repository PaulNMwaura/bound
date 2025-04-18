import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectMongoDB();
        const {username, firstname, lastname, phone, email, password, profilePicture} = await req.json();

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return NextResponse.json({ message: "Username or email already exists." }, { status: 400 });
        }
        
        const hashedPass = await bcrypt.hash(password, 10);
        
        console.log(username, firstname, lastname, phone, email, profilePicture);
        await User.create({username, firstname, lastname, phone, email, password: hashedPass, profilePicture})

        return NextResponse.json({message: "User Registered."}, { status: 201 });
    } catch (error) {
        console.log("Error during registration:", error);

        // If it's a specific MongoDB error (duplicate key), handle it
        if (error.code === 11000) {
            return NextResponse.json({ message: "Username or email already exists." }, { status: 400 });
        }

        // General error handling
        return NextResponse.json({ message: "Error occurred while registering the user." }, { status: 500 });
    }
}