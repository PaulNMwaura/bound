"use client";
import { IoMenu } from "react-icons/io5";
import Logo from "@/app/assets/BoundLogo.png";
import Image from "next/image";
import { useState } from "react";
import { SearchMenu } from "@/app/components/SearchMenu";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <section>
        <div className="container lg:max-w-[90%]">
          {/*On sm width, we flex by column and justify between. On md we flex row and center items */}
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="pt-2 flex justify-between">
              <div>
                <Image src={Logo} alt="Logo place holder" width={60} height={60}/>
              </div>
              <div onClick={toggleSidebar} className="flex items-center">
                <IoMenu className="w-8 h-8 md:hidden" />
              </div>
            </div>
            {/* <div className="mt-1 search-bar mx-auto md:min-w-[400px] lg:min-w-[500px]">
              <input className="w-full outline-none bg-left pl-1 text-xs md:text-lg" placeholder="Search for any service"/>
              <button className="search-btn">Search</button>
            </div> */}
            <div className="hidden md:flex md:text-xs border border-black rounded-lg p-2">
              <button onClick={() => router.replace("/profile")}>My Profile</button>
            </div>
          </div>
        </div>
      </section>
    <SearchMenu isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
};