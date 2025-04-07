"use client";

import { IoSearch, IoHomeOutline, IoSettingsOutline  } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export const Sidenav = ({session}) => {
    return (
        <section className="text-white/90 tracking-tight">
            <div className="h-screen flex flex-col">
                <div className="pl-4 h-[100px] bg-[#740A90] flex items-center justify-start gap-2">
                    {/* <Image src={Logo} width={24} height={24} /> */}
                    <div className="w-8 h-8 rounded-md shadow-sm bg-yellow-400 flex justify-center items-center font-bold text-lg">
                        {session?.user?.firstname[0]}
                    </div>
                    <a>{session?.user?.firstname} {session?.user?.lastname}</a>
                </div>
                <div className="py-4 bg-[#A63EC1] text-md lg:text-lg">
                    <ul className="flex flex-col">
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1] hover:rounded-lg">
                            <IoHomeOutline />
                            <li>
                                <a href="/">home</a>
                            </li>
                        </div>
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1] hover:rounded-lg">
                            <IoSearch />
                            <li>
                                <button onClick={() => redirect("/browse")}>browse</button>
                            </li>
                        </div>
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1] hover:rounded-lg">
                            <AiOutlineMessage />
                            <li>
                                <a href="#">messages</a>
                            </li>
                        </div>
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1] hover:rounded-lg">
                            <IoSettingsOutline />
                            <li>
                                <a href="#">view profile</a>
                            </li>
                        </div>
                    </ul>
                </div>
                <div className="py-5 bg-[#881ba3] text-md lg:text-lg">
                    <ul className=" flex flex-col">
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1] hover:rounded-lg">
                            <MdOutlineManageAccounts size={24} />
                            <li>
                                <a>profile settings</a>
                            </li>
                        </div>  
                    </ul>
                </div>
                <div className="pl-4 flex flex-row items-center mt-auto mb-6 hover:bg-gradient-to-r from-red-500 to-[#A63EC1] hover:rounded-lg">
                    <FaSignOutAlt size={25}/>
                    <button onClick={() => signOut()}className="btn text-md lg:text-lg">signout</button>
                </div>
            </div>
        </section>
    );
};