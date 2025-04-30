"use client";
import LogoBlack from "@/assets/Logo-black.png";
import LogoWhite from "@/assets/Logo-white.png";
import React from "react";
import Image from "next/image";
import { FaSignOutAlt, FaRegWindowClose, FaInstagram, FaFacebook, FaLinkedinIn  } from "react-icons/fa";
import { signOut } from "next-auth/react";

export const ViewPageSidebar = ({isLister, username, isOpen, onClose, sessionStatus }) => {
    return (
        <>
            {/* Sidebar Modal */}
            <div
                className={`fixed top-0 right-0 h-full w-[50%] flex flex-col bg-white text-black dark:bg-black dark:text-white shadow-lg z-50 transition-transform duration-300 rounded-l-lg ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-4 flex mt-8 justify-between items-center border-b">
                    <Image src={LogoBlack.src} alt="Logo"  width={15} height={15} className="dark:hidden"/>
                    <Image src={LogoWhite.src} alt="Logo"  width={15} height={15} className="hidden dark:block"/>
                    <button onClick={onClose} className="h-6 w-6 cursor-pointer">
                        <FaRegWindowClose />
                    </button>
                </div>
                <div className="h-full flex flex-col p-4 tracking-tight">
                    <ul className="space-y-4">
                        <li>
                            <a href="/home" className="hover:underline">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/browse" className="hover:underline">
                                Browse
                            </a>
                        </li>
                        <li>
                            <a href="/messages" className="hover:underline">
                                Messages
                            </a>
                        </li>
                        <li>
                            <a href="/settings" className="hover:underline">
                                Settings
                            </a>
                        </li>
                        {isLister && (
                            <li>
                                <a href={`/dashboard/${username}`} className="hover:underline">
                                    Dashboard
                                </a>
                            </li>
                        )}
                        {sessionStatus == "unauthenticated" && (
                            <ul className="space-y-4">
                                <li>
                                    <a href={"/login"} className="hover:underline">
                                        Login
                                    </a>
                                </li>
                                <li>
                                    <a href={"/register"} className="hover:underline">
                                        Sign Up
                                    </a>
                                </li>
                            </ul>
                        )}
                    </ul>
                    <div onClick={() => signOut()} className="mt-auto flex flex-row gap-2 cursor-pointer">
                        <FaSignOutAlt size={24} />
                        <a>Signout</a>
                    </div>
                </div>
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