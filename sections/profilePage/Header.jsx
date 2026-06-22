"use client";

import { redirect, useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { signOut, useSession } from "next-auth/react";
import { IoMenu } from "react-icons/io5";
import { HomeMenu } from "@/components/HomeMenu";

export const Header = ({ id, thisLister, sessionStatus}) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isALister, setLister] = useState(false); /*  in other pages, "isLister is checking string a true or false based
                                                      on whether the current user is also the lister of the current profile being viewed.
                                                      For the homeMenu on this page howerver, we just want to check if the current user
                                                      is a lister or not. We don't care if they are the lister for the profile in view.
                                                      I tried to clarify this by renaming the variable to  "isALister" rather than "isLister". 
                                                  */
  const [username, setListerUsername] = useState(null);

  const [error, setError] = useState(null);
  const { data: session } = useSession(); 

  if (!thisLister) return <div>No lister found</div>;

  const userId = session?.user?.id || "";

  useEffect(() => {
    if (!userId) return;
      const checkIfIsLister = async () => {
        try {
          const response = await fetch(`/api/listers/findByUserId?id=${userId}`);
            if (!response.ok) {
              console.log(response.status);
              throw new Error('Lister not found');
            }
            const data = await response.json();
            setListerUsername(data.lister.username);
            setLister(true);
        } catch (error) {
            return;
        }
      };
    checkIfIsLister();
  }, [userId]);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <section>
        <div className="container text-black md:w-[90%] md:bg-white md:rounded-b-xl">
            <div className="py-1 flex justify-between md:justify-end items-center">
              <a className="block md:hidden font-bold">{thisLister.city}, {thisLister.state}</a>
              <div className="flex items-center">
                <div className="hidden lg:flex flex-row items-center">
                  <a href="/home" className="btn">Home</a>
                  <a href="/" className="btn">Browse</a>
                  {sessionStatus == "authenticated" ? (
                    <div>
                      {/* <a href="/messages" className="btn">Messages</a> */}
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
      {isSidebarOpen && (
        <HomeMenu isOpen={isSidebarOpen} onClose={toggleSidebar} isLister={isALister} username={username} sessionStatus={sessionStatus}/>
      )}
    </>
  );
};