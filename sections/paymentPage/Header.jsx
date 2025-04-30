"use client";
import Image from "next/image";
import LogoWhite from "@/assets/Logo-white.png";
import LogoBlack from "@/assets/Logo-black.png";
import {ViewPageSidebar} from "@/components/ViewPageSidebar";
import { useRouter } from "next/navigation";
import { useState} from "react";
import { signOut, useSession } from "next-auth/react";
import { IoMenu } from "react-icons/io5";



export const Header = ({ }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [error, setError] = useState(null);
  const { data: session, status } = useSession(); 


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <section>
        <div className="px-4">
            <div className="py-1 flex justify-between items-center">
                <div>
                    <Image src={LogoWhite} alt="Logo" width={20} height={20} className="hidden dark:block"/>
                    <Image src={LogoBlack} alt="Logo" width={20} height={20} className="block dark:hidden"/>
                </div>
                <div className="flex items-center">
                    <div className="hidden lg:flex flex-row items-center">
                        <a href="/home" className="btn cursor-pointer">Home</a>
                        <a href="/" className="btn cursor-pointer">Browse</a>
                        <button className="btn cursor-pointer" onClick={() => signOut()}>Sign Out</button>
                    </div>
                    <div className="block lg:hidden">
                        <IoMenu onClick={toggleSidebar} size={25}/>
                    </div>
                </div>
            </div>
          </div>
      </section>
      <ViewPageSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} sessionStatus={status} />
    </>
  );
};