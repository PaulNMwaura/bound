"use client";
// import ButtonCustomerPortal from "@/components/ButtonCustomerPortal";
import { Header } from "@/sections/paymentPage/Header";
import { Footer } from "@/sections/paymentPage/Footer";
import { Hero } from "@/sections/paymentPage/Hero";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function checkIfLister(id) {
    const res = await fetch(`/api/listers/findByUserId?id=${id}`);
    
    if (res.status === 404) {
        return false; // not a lister
    }

    const data = await res.json();
    return data.lister ? data.lister : false; // if lister is found, return the lister data
}

export default function Payment() {
    const { data: session, status } = useSession();
    const [isLister, setIsLister] = useState(null);
    const router = useRouter();

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

    if (!session && status == "unauthenticated" ) 
        redirect("/login");
    else if(status == "loading")
        return <div className="heads-up">Loading...</div>;
    else if (session?.user?.hasAccess === true)
        redirect("/applyLister");

    return (
        <>
            <Header />
            <Hero session={session}/>
            <Footer />
        </>
    );
}