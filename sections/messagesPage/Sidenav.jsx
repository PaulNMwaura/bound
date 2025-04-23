"use client";

import { IoSearch, IoHomeOutline } from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

export const Sidenav = ({session, thisLister}) => {
    return (
        <section className="bg-black text-white tracking-tight border-r-2 border-[#525252]/20">
            <div className="h-screen flex flex-col">
                <div className="pl-4 h-[100px] flex items-center justify-start gap-2">
                    <Image src={session.user.profilePicture} alt="Profile picture" width={32} height={32} className="object-cover rounded-full"/>
                    <a>{session?.user?.username}</a>
                </div>
                <div className="py-4 bg-[#525252] text-md lg:text-lg">
                    <ul className="flex flex-col">
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                            <IoHomeOutline />
                            <li>
                                <a href="/">home</a>
                            </li>
                        </div>
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                            <IoSearch />
                            <li>
                                <button onClick={() => redirect("/browse")}>browse</button>
                            </li>
                        </div>
                        {thisLister && (
                            <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                                <CgProfile />
                                <li>
                                    <button onClick={() => redirect(`/profile/${session.user.username}`)}>profile</button>
                                </li>
                            </div>
                        )}
                    </ul>
                </div>
                <div className="py-5 bg-[#1c1c1c] text-md lg:text-lg">
                    <ul className="flex flex-col">
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                            <MdOutlineManageAccounts size={24} />
                            <li>
                                <a href="/settings">settings</a>
                            </li>
                        </div>  
                    </ul>
                </div>
                <div className="pl-4 flex flex-row items-center mt-auto mb-6 hover:bg-gradient-to-r from-red-500 to-[#ffffff]">
                    <FaSignOutAlt size={25}/>
                    <button onClick={() => signOut({callbackUrl:"/"})} className="btn text-md lg:text-lg cursor-pointer">signout</button>
                </div>
            </div>
        </section>
    );
};