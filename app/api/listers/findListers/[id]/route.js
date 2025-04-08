import { connectMongoDB }from "@/lib/mongodb";
import Lister from "@/models/lister";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;
    await connectMongoDB();

    const lister = await Lister.findOne({ _id: id });
    return NextResponse.json({ lister }, {status: 200});     
};