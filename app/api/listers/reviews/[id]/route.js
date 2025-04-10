import { connectMongoDB } from "@/lib/mongodb";
import Review from "@/models/review";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await connectMongoDB();

    const reviews = await Review.find({ listerId: id }).sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: averageRating.toFixed(0),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}
