// import ApplyLister  from "@/app/components/RegisterListerForm";
"use client";

import { useState } from "react";
import UnavailableDaysCalendar from "@/app/components/SelectionCalendar"; 
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/app/sections/applyListerPage/Header";
import { Hero } from "@/app/sections/applyListerPage/Hero";


export default function RegisterLister() {
    return (
        <div className="h-fit bg-[#D9D9D9] pb-20">
            <Header />
            <Hero />
        </div>
    );
};