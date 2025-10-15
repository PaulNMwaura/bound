import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import Review from "@/models/review";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectMongoDB();
        // Extract search parameters from the request URL
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city") || "";
        const state = searchParams.get("state") || "";
        const service = searchParams.get("service") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        // Calculate the skip value for pagination
        const skip = (page - 1) * limit;

        // Build MongoDB query dynamically
        let query = {};
        if (city) query["city"] = { $regex: city, $options: "i" };
        if (state) query["state"] = { $regex: state, $options: "i" };
        if (service) query["services.name"] = { $regex: service, $options: "i" };

        // Fetch matching listers with pagination
        const listers = await Lister.find(query).skip(skip).limit(limit);

        // Get the total count of listers matching the query (for pagination)
        const totalCount = await Lister.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // For each lister, calculate average rating
        // const listersWithRatings = await Promise.all(
        //     listers.map(async (lister) => {
        //         const reviews = await Review.find({ listerId: lister._id });
        //         const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
        //         return {
        //             ...lister.toObject(),
        //             rating: parseFloat(averageRating.toFixed(0)),
        //         };
        //     })
        // );
        return NextResponse.json({ listers, totalPages, totalCount });
        return NextResponse.json({ listers: listersWithRatings, totalPages, totalCount });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
};

