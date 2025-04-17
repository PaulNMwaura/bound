"use client";
// import Logo from "@/app/assets/BoundLogo.png";
import Image from "next/image";
import {ViewPageSidebar} from "@/components/ViewPageSidebar";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { signOut, useSession } from "next-auth/react";
import { IoMenu } from "react-icons/io5";

export const Header = ({ id, thisLister}) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [error, setError] = useState(null);
  const { data: session } = useSession(); 

  if (!thisLister) return <div>No lister found</div>;

  const isLister = session?.user?.id === thisLister.userId;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <section>
        <div className="container text-black md:w-[90%] md:bg-white md:rounded-b-xl">
            <div className="py-1 flex justify-end items-center">
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-row items-center">
                  <a href="/" className="btn">Home</a>
                  <a href="/browse" className="btn">Browse</a>
                  {isLister && (
                    <button onClick={() => router.replace(`/dashboard/${thisLister.username}`)} className="btn cursor-pointer">My Dashboard</button>
                  )}
                </div>
                <button onClick={() => signOut({callbackUrl:"/"})} className="btn cursor-pointer">Sign out</button>
                <div className="block lg:hidden">
                  <IoMenu onClick={toggleSidebar} size={25}/>
                </div>
              </div>
            </div>
          </div>
      </section>
      <ViewPageSidebar isLister={isLister} username={thisLister.username} isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
};