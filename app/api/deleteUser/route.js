import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import cloudinary from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const {publicId, userId} = body; 

        // Step 1: Delete the user's profile picture from Cloudinary (if it's not the default image)
        if (publicId && publicId !== "default-avatar_pc0ltx") {
            await cloudinary.uploader.destroy(publicId);
        }

        // Step 2: Delete the user from the database
        await connectMongoDB();
        await User.findOneAndDelete({_id: userId});

        return NextResponse.json({ message: "User account deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "An error occurred while deleting the user." }, { status: 500 });
    }
}
