import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        
        if (!id) {
            // If no id is provided, return a 400 Bad Request response
            return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
        }

        // Connect to MongoDB
        await connectMongoDB();

        // Query the database
        const lister = await Lister.findOne({ userId: id });

        if (!lister) {
            // If no result is found, return a 404 Not Found response
            return NextResponse.json({ error: "Lister not found" }, { status: 404 });
        }
        
        return NextResponse.json({ lister }, { status: 200 });
    } catch (error) {
        // Log the error and return a 500 response with the error message
        console.error("Error fetching lister: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};