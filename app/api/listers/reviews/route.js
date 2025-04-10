import { connectMongoDB } from "@/lib/mongodb";
import Review from "@/models/review";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { listerId, reviewerName, review, rating } = await req.json();

    if (!listerId || !reviewerName || !review || rating == null) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectMongoDB();

    const res = await Review.create({
      listerId,
      reviewerName,
      review,
      rating,
    });

    return NextResponse.json({ message: "Review submitted", res}, { status: 201 });
  } catch (err) {
    console.error("Review submit error:", err);
    return NextResponse.json({ message: "Error submitting review" }, { status: 500 });
  }
}
