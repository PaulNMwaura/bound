"use client";
import React, { useState } from "react";
import { UserMessages } from "@/sections/messagesPage/UserMessages";
import { OpenMessage } from "@/sections/messagesPage/OpenMessage";
import { Sidenav } from "@/sections/listerDashboardPage/Sidenav"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation";

export default function Messages({params}) {
    const {data: session} = useSession();
    const {id} = React.use(params);
    const [senderId, setSenderId] = useState(null); 

    if(!session)
        return <div>loading...</div>

    return (
        <div className="flex flex-row">
            <div className="fixed hidden h-screen md:block md:min-w-44 lg:min-w-60 border-r-4">
                <Sidenav session={session} id={id}/>
            </div>
            <div className="md:ml-44 lg:ml-60 flex flex-row justify-between w-full p-8 gap-2 ">
                <UserMessages reciverId={id} setSenderId={setSenderId} />
                <OpenMessage reciverId={id} senderId={senderId} />
            </div>
        </div>
    )
}