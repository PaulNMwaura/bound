import { connectMongoDB }from "@/app/lib/mongodb";
import Lister from "@/app/models/lister";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectMongoDB();
        // Extract search parameters from the request URL
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city") || "";
        const state = searchParams.get("state") || "";
        const service = searchParams.get("service") || "";

        // Build MongoDB query dynamically
        let query = {};
        if (city) query["city"] = { $regex: city, $options: "i" };
        if (state) query["state"] = { $regex: state, $options: "i" };
        if (service) query["services.name"] = { $regex: service, $options: "i" };

        // Fetch matching listers
        const listers = await Lister.find(query);
        return NextResponse.json({ listers });        
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });       
    }
};