"use client";
import ButtonCustomerPortal from "@/components/ButtonCustomerPortal";
import Pricing from "@/components/Pricing";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Payment() {
    const { data: session, status } = useSession();

    if (!session && status == "unauthenticated" ) 
        redirect("/login");
    else if(status == "loading")
        return <div className="heads-up">Loading...</div>;

    return (
        <>
            <header className="mt-10 container flex flex-col items-center">
                <div>
                    <p className="text-lg md:text-3xl font-bold">
                        WHAT IS A LISTER?
                    </p>
                    {/* <p className="text-end font-medium">
                        ... who is a lister?
                    </p> */}
                </div>
                <div className="w-full aspect-video/2">
                    Video here
                </div>
            </header>
                {/* <ButtonCustomerPortal /> */}

            <main className="bg-base-200 min-h-screen">
                <Pricing session={session}/>
            </main>
        </>
    );
}