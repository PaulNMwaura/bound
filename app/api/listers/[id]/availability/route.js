import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {
    const { id } = await params;
    try {
        const { unavailableDays } = await req.json();
        await connectMongoDB();
        
        if (!Array.isArray(unavailableDays)) {
            return NextResponse.json({ error: "unavailableDays must be an array" }, { status: 400 }); 
        }

        const updatedLister = await Lister.findByIdAndUpdate(id, { unavailableDays }, { new: true });
    
        if (!updatedLister) {
            return NextResponse.json({ error: "Lister not found" }, { status: 400 }); 
        }

        return NextResponse.json({ message: "Availability updated" }, { status: 200 });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Server error while updating availability" }, { status: 500 });
    }
}
