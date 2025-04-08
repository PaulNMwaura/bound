import { Hero } from "@/sections/browsePage/Hero";
import { Suspense } from "react";

export default async function Browse () {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Hero />
            </Suspense>
        </>
    );
};