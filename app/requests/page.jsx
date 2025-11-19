"use client"
import { redirect, useSearchParams } from "next/navigation";
import { useState, useEffect} from "react";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Requests() {
    const { data: session, status } = useSession();
    const [currentUrl, setCurrentUrl] = useState("")
    const searchParams = useSearchParams();
    const formOpen = searchParams.get("request") || false;

    useEffect(() => {
        setCurrentUrl(window.location.href)
    }, [])

    if (!session || status != "authenticated") <div>Loading</div>;

    return(
        <section className="min-h-screen max-h-fit bg-white text-black">
            <div>
                Test
            </div>
            {formOpen && (
                <ServiceRequestForm session={session}/>
            )}
        </section>
    );
}