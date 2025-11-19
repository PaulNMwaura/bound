import { Hero } from "@/sections/browsePage/Hero";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "./api/auth/auth.config";

export default async function Browse () {
    const session = await getServerSession(authOptions);
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Hero session={session} />
            </Suspense>
        </>
    );
};