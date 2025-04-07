import { connectMongoDB }from "@/app/lib/mongodb";
import Lister from "@/app/models/lister";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;
    await connectMongoDB();

    const lister = await Lister.findOne({ _id: id });
    // console.log("lister: ", lister);
    return NextResponse.json({ lister }, {status: 200});     
};