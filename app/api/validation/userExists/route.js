import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    try {
        const { email } = await req.json();
        
        await connectMongoDB();
        const user = await User.findOne({email}).select("_id");
        
        return NextResponse.json({ user });
    } catch (error) {
        console.log(error);
    }
}