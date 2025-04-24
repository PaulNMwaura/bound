"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SearchMenu } from "@/components/SearchMenu";
import { useState } from "react";


export const Information = ({setFilters}) => {
    const { data: session } = useSession();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    if(!session) redirect("/");

    return (
        <section className="container md:hidden pt-4">
            <div className="flex flex-col gap-1 justify-center items-center bg-[#D9D9D9] py-2 rounded-md text-sm">
                <div>
                    <p>Looking for something specific, {session?.user?.firstname}?</p>
                </div>
                <div>
                    <button onClick={toggleSidebar} className="btn btn-primary">Apply a filter</button>
                </div>
            </div>
            <SearchMenu setFilters={setFilters} isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </section>
    );
};