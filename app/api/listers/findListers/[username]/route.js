import { connectMongoDB }from "@/lib/mongodb";
import Lister from "@/models/lister";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { username } = await params;
    await connectMongoDB();

    const lister = await Lister.findOne({ username: username });
    return NextResponse.json({ lister }, {status: 200});     
};