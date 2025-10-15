"use client";
import Image from "next/image";
import {ViewPageSidebar} from "@/components/ViewPageSidebar";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { signOut, useSession } from "next-auth/react";
import { IoMenu } from "react-icons/io5";

export const Header = ({ id, thisLister, sessionStatus}) => {
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
            <div className="py-1 flex justify-between md:justify-end items-center">
              <a className="block md:hidden font-light section-title">@{thisLister.username}</a>
              <div className="flex items-center">
                <div className="hidden lg:flex flex-row items-center">
                  <a href="/home" className="btn">Home</a>
                  <a href="/" className="btn">Browse</a>
                  {sessionStatus == "authenticated" ? (
                    <div>
                      <a href="/messages" className="btn">Messages</a>
                      <a href="/settings" className="btn">Settings</a>
                      {isLister && (
                        <button onClick={() => router.replace(`/dashboard/${thisLister.username}`)} className="btn cursor-pointer">Dashboard</button>
                      )}
                      <button onClick={() => signOut({callbackUrl:"/"})} className="btn cursor-pointer">Sign out</button>
                    </div>
                  ):(
                    <div>
                      <button onClick={() => redirect("/login")} className="btn cursor-pointer">Login</button>
                      <button onClick={() => redirect("/register")} className="btn btn-primary cursor-pointer">Sign Up</button>
                    </div>
                  )}
                </div>
                <div className="block lg:hidden">
                  <IoMenu onClick={toggleSidebar} size={25}/>
                </div>
              </div>
            </div>
          </div>
      </section>
      <ViewPageSidebar isLister={isLister} username={thisLister.username} isOpen={isSidebarOpen} onClose={toggleSidebar} sessionStatus={sessionStatus} />
    </>
  );
};