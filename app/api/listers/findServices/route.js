import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";

export async function GET() {
  try {
    await connectMongoDB();

    const services = await Lister.aggregate([
      { $unwind: "$services" },
      {
        $group: {
          _id: "$services.name",
          count: { $sum: 1 }, // count occurrences
        }
      },
      { $sort: { _id: 1 } } // alphabetical
    ]);

    const formatted = services.map(s => ({
      name: s._id,
      count: s.count,
    }));

    return NextResponse.json({ services: formatted });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
