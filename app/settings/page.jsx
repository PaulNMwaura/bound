"use client";

import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { Sidenav } from "@/sections/settingsPage/Sidenav";
import { Hero } from "@/sections/settingsPage/Hero";
import { useRouter } from "next/navigation";

async function checkIfLister(id) {
    const res = await fetch(`/api/listers/findByUserId?id=${id}`);
    
    if (res.status === 404) {
        return false; // not a lister
    }

    const data = await res.json();
    return data.lister ? data.lister : false; // if lister is found, return the lister data
}

export default function Settings () {
    const {data: session, status} = useSession();
    const [lister, setLister] = useState(null);
    const [isLister, setIsLister] = useState(false);
    const router = useRouter();


    useEffect(() => {
        // Only check if session is loaded
        if (session) {
            const checkUserStatus = async () => {
                const isUser = await fetch(`/api/user/${session.user.id}`);
                if(!isUser)
                    router.redirect("/");
            };

            const checkListerStatus = async () => {
                const res = await checkIfLister(session.user.id);
                setLister(res);
            };

            checkListerStatus();
        }
    }, [session]); 

    useEffect(() => {
        if (lister) setIsLister(true);
    }, [lister]);

    if (!session || status == "loading" || lister == null) return <div className="heads-up">Loading...</div>;

    return (
        <>
          <div className="hidden md:block fixed top-0 left-0 h-screen w-[300px] bg-red-500 z-50 shadow-lg">
            <Sidenav session={session} isLister={isLister} />
          </div>
      
          <div className="w-full md:pl-[300px] min-h-screen flex justify-center mt-5">
            <Hero session={session} isLister={isLister} thisLister={lister} />
          </div>
        </>
    );
      
      
}