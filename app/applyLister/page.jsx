"use client";
import { Header } from "@/sections/applyListerPage/Header";
import { Hero } from "@/sections/applyListerPage/Hero";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";

async function checkIfLister(id) {
    const res = await fetch(`/api/listers/findByUserId?id=${id}`);
    
    if (res.status === 404) {
        return false; // not a lister
    }

    const data = await res.json();
    return data.lister ? data.lister : false; // if lister is found, return the lister data
}

export default function RegisterLister() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLister, setIsLister] = useState(null); // State to store lister check result

    useEffect(() => {
        // Only check if session is loaded
        if (session?.user?.id) {
            const checkListerStatus = async () => {
                const result = await checkIfLister(session.user.id);
                setIsLister(result); // Update state with result
            };

            checkListerStatus();
        }
    }, [session]); 

    useEffect(() => {
        // Redirect if user is already a lister
        if (isLister !== null) {
            if (isLister) {
                router.replace(`/profile/${isLister.username}`);
            }
        }
    }, [isLister, router]); // Run this when isLister changes

    if (status === "loading" || isLister != false && isLister != null)
        return <div className="heads-up">Loading...</div>;
    if (status == "unauthenticated") redirect("/login");

    return (
        <div className="flex flex-col items-center bg-white pb-20">
            <Header />
            <Hero session={session} status={status} />
        </div>
    );
}
