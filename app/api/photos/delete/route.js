import { connectMongoDB } from "@/lib/mongodb";
import Photo from "@/models/photo";
import cloudinary from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  });
  
async function deleteFromCloudinary(url){
    const parts = url.split("/");
    const publicIdWithExt = parts[parts.length - 1]; // e.g., "photo123.jpg"
    const publicId = publicIdWithExt.split(".")[0];  // remove ".jpg"
    return await cloudinary.uploader.destroy(publicId);
};

export async function POST(req, res) {
    const body = await req.json();
    const { listerId, photoUrl } = body;

    if (!listerId || !photoUrl) {
        return NextResponse.json({ error: "Missing listerId or photoUrl." }, { status: 400 });
    }

    try {
        await connectMongoDB();

        // Delete the post from the database
        await Photo.deleteOne({ listerId, photo: photoUrl });

        // Delete image from Cloudinary
        await deleteFromCloudinary(photoUrl);

        return NextResponse.json({ message: "Post deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
