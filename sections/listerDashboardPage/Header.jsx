"use client";
import { IoMenu } from "react-icons/io5";
import Logo from "@/assets/logo-holder.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { HomeMenu } from "@/components/HomeMenu";

export const Header = ({session, profilePicture}) => {
    const [isOpen, setMenuOpen] = useState(false);

    const toggleHomeMenu = () => setMenuOpen(!isOpen);

    return (
        <section>
            <div className="py-4 px-10 text-sm md:text-xl md:px-28 flex justify-between items-center">
                <div>
                    Hello {session?.user?.firstname}!
                </div>
                <div className="flex flex-row items-center">
                    <div>
                        <button onClick={() => signOut({callbackUrl:"/"})} className="btn cursor-pointer">Sign out</button>
                    </div>
                    <div className="hidden md:block">
                        <Image src={profilePicture || Logo} alt="Profile Picture" width={40} height={40} className="object-cover rounded-full" style={{ aspectRatio: 1 }}/>
                    </div>
                    <div className="block md:hidden">
                        <IoMenu onClick={toggleHomeMenu}/>
                    </div>
                </div>
            </div>
            
            {/* <HomeMenu isOpen={isOpen} onClose={toggleHomeMenu} />  Create a sidebar that is similar to the dashboard sidenav*/}
        </section>
    );
};