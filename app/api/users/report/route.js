import { connectMongoDB } from "@/lib/mongodb";
import Report from "@/models/report";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { reportedUser, reportedUserId, reporterId, reason, explanation } = await req.json();

    if (!reportedUser || !reportedUserId || !reporterId || !reason) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectMongoDB();

    // Check for recent report from this reporter to this user within last 24 hours
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const cutoff = new Date(Date.now() - ONE_DAY);

    const recentReport = await Report.findOne({
      reportedUserId,
      reporterId,
      timestamp: { $gte: cutoff },
    });

    if (recentReport) {
      return NextResponse.json(
        { message: "You already recently reported this user. Please wait before reporting again." },
        { status: 401 }
      );
    }

    // Create new report
    await Report.create({
      reportedUser,
      reportedUserId,
      reporterId,
      reason,
      explanation,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: "Report submitted successfully." });
  } catch (err) {
    console.error("Report error:", err);
    return NextResponse.json({ message: "Failed to submit report" }, { status: 500 });
  }
}
