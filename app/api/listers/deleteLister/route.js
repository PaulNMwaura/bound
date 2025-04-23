import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import Photo from "@/models/photo"; 
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
    const { listerId } = body;

    await connectMongoDB();

    // Step 1: Get the lister
    const lister = await Lister.findById(listerId);
    if (!lister) {
      return NextResponse.json({ message: "Lister not found." }, { status: 404 });
    }

    // Step 2: Delete banner photo from Cloudinary (if it exists)
    if (lister.bannerPicture) {
      const bannerPublicId = extractCloudinaryPublicId(lister.bannerPicture);
      if (bannerPublicId) {
        await cloudinary.v2.uploader.destroy(bannerPublicId);
      }
    }

    // Step 3: Find and delete all photos associated with this lister
    const photos = await Photo.find({ listerId });
    for (const photo of photos) {
      const photoPublicId = extractCloudinaryPublicId(photo.photo);
      if (photoPublicId) {
        await cloudinary.v2.uploader.destroy(photoPublicId);
      }
      await photo.deleteOne(); // remove photo document from MongoDB
    }

    // Step 4: Delete the lister
    await lister.deleteOne();

    return NextResponse.json({ message: "Lister and all associated data deleted successfully." }, { status: 200 });

  } catch (error) {
    console.error("Error deleting lister:", error);
    return NextResponse.json({ message: "An error occurred while deleting the lister." }, { status: 500 });
  }
}

// Helper function to extract the Cloudinary public_id from a URL
function extractCloudinaryPublicId(url) {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const [publicId] = filename.split(".");
  return `${publicId}`;
}
