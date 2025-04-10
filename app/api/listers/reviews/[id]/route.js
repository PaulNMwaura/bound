import { connectMongoDB } from "@/lib/mongodb";
import Review from "@/models/review";
import { NextResponse } from "next/server";

// "_" is significant here 
export async function GET(_, { params }) {
    const {id} = await params;
    try {
        await connectMongoDB();
        const reviews = await Review.find({ listerId: id }).sort({ createdAt: -1 });
        return NextResponse.json({ reviews });
    } catch (err) {
        return NextResponse.json({ message: "Failed to fetch reviews." }, { status: 500 });
    }
}
