"use client";

import { FaArrowRight } from "react-icons/fa";
import Logo from "@/app/assets/BoundLogo.png";
import Image from "next/image";
import { IoMenu } from "react-icons/io5";
import { HomeMenu } from "@/app/components/HomeMenu";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Header() {
    const {data: session} = useSession();
  
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const router = useRouter();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
        <header className="sticky top-0 backdrop-blur-sm z-[1]">
          <div className="flex justify-center items-center py-2 bg-black text-white text-sm gap-3 cursor-pointer">
            <p className="text-white/60 hidden md:block">Browse our network and freelancing profesionals</p>
            <div className="flex gap-1 items-center">
              <p onClick={() => router.push("/browse")}> Get started for free</p>
              <FaArrowRight className="h-3 w-3 mt-[2px]" />
            </div>
          </div>
          <div className="py-2">
            <div className="container max-w-full"> {/*Container then max width allows for less margin*/}
              <div className="flex items-center justify-between">
                  <Image src={Logo} alt="Site Logo" height={45} width={45} />
                  <div className="flex ">
                    {!session && (
                      <button onClick={() => redirect("/login")} className="btn">Sign in</button>
                    )}

                    <div className="md:hidden flex items-center">
                      <button onClick={toggleSidebar}>
                        <IoMenu size={30} />
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </header>
      <HomeMenu isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </>
    );
};