"use client";

import LogoBlack from "@/assets/Logo-black.png";
import LogoWhite from "@/assets/Logo-white.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { FaRegWindowClose, FaInstagram, FaFacebook, FaLinkedinIn, FaSignOutAlt  } from "react-icons/fa";
import { IoShieldCheckmarkSharp, IoAlbums, IoPerson, IoSearch, IoHomeOutline, IoSettingsOutline, IoAppsSharp, IoKeySharp  } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

export const HomeMenu = ({ isOpen, onClose, isLister, username, sessionStatus }) => {
    return (
        <>
            {/* Sidebar Modal */}
            <div
                className={`fixed top-0 right-0 h-full w-[50%] md:w-[30%] flex flex-col bg-white text-black dark:bg-black dark:text-white shadow-lg z-50 transition-transform duration-300 rounded-l-lg ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-4 flex mt-8 justify-end items-center border-b">
                    {/* <Image src={LogoBlack.src} alt="Logo"  width={15} height={15} className="dark:hidden"/>
                    <Image src={LogoWhite.src} alt="Logo"  width={15} height={15} className="hidden dark:block"/> */}
                    <button onClick={onClose} className="h-6 w-6 cursor-pointer">
                        <FaRegWindowClose />
                    </button>
                </div>
                <div className="tracking-tight">
                    <ul>
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                            <IoSearch />
                            <a href="/">
                                Browse
                            </a>
                        </div>
                        {/* <li>
                            <a href="/messages" className="hover:underline">
                                Messages
                            </a>
                        </li> */}
                        {isLister ? (
                            <div>
                                <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                                    <IoPerson />
                                    <a href={`/profile/${username}`}>
                                        Profile
                                    </a>
                                </div>
                                <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                                    <IoAppsSharp />
                                    <a href={`/dashboard/${username}`}>
                                        Dashboard
                                    </a>
                                </div>                              
                            </div>
                        ):(
                            <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                                <IoAlbums />
                                <a href="/applyLister">
                                    Become a lister
                                </a>
                            </div>
                        )}
                        
                        <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                            <IoSettingsOutline />
                            <a href="/settings">
                                Settings
                            </a>
                        </div>
                        {sessionStatus == "unauthenticated" && (
                            <div>
                                <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                                    <IoKeySharp />
                                    <a href="/login">
                                        Login
                                    </a>
                                </div>
                                <div className="py-3 pl-4 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#ffffff]">
                                    <IoShieldCheckmarkSharp />
                                    <a href="/register">
                                        Sign Up
                                    </a>
                                </div> 
                            </div>
                        )}
                    </ul>
                </div>
                {sessionStatus == "authenticated" && (
                    <div className="pl-4 flex flex-row items-center mt-auto mb-6 hover:bg-gradient-to-r from-red-500 to-[#ffffff]">
                        <FaSignOutAlt size={25}/>
                        <button onClick={() => signOut({callbackUrl:"/"})} className="btn text-md lg:text-lg cursor-pointer">signout</button>
                    </div>
                )}
            </div>

            {/* Background Overlay */}
            {isOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black/50 z-40"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
};