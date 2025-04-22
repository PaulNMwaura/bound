import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { nanoid } from 'nanoid';
import { addHours } from 'date-fns';
import postmarkClient from "@/lib/postmark";

export async function POST(req) {
    try {
        await connectMongoDB();
        const {username, firstname, lastname, phone, email, password, profilePicture} = await req.json();

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return NextResponse.json({ message: "Username or email already exists." }, { status: 400 });
        }

        const token = nanoid(); // or crypto.randomUUID()
        const expiry = addHours(new Date(), 2); // valid for 2 hours

        const hashedPass = await bcrypt.hash(password, 10);
        
        await User.create({
            username, 
            firstname, 
            lastname, 
            phone, 
            email, 
            password: hashedPass, 
            profilePicture, 
            verified: false,
            emailVerificationToken: token,
            emailVerificationTokenExpiry: expiry,
        })

        try {
            const url = `${process.env.NEXTAUTH_URL}/api/validation/verify-email?token=${token}`;

            await postmarkClient.sendEmailWithTemplate({
              From: process.env.POSTMARK_SENDER_EMAIL,
              To: email,
              TemplateId: parseInt(process.env.POSTMARK_EMAIL_VERIFICATION_TEMPLATE_ID),
              TemplateModel: {
                product_name: 'etchedintara.com',
                firstname,
                verificationUrl: url,
                // action_url: url,
                company_name: "etchedintara (EIT)",
                businessName: "EIT",
              },
            });
            console.log("Verification email sent successfully");
        } catch (error) {
            console.error("Email failed:", error);
        }

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