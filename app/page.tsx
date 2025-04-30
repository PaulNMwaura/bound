import { Hero } from "@/sections/browsePage/Hero";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";

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