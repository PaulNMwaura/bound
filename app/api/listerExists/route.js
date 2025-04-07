import { connectMongoDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Lister from "@/app/models/lister";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        const lister = await Lister.findOne({ email }).select("_id");

        console.log("Lister found: ");

        return NextResponse.json({ lister });
    } catch (error) {
        console.log("Error checking lister:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
