"use client";
import React from "react";
import Link from "next/link";
import LogoBlack from "@/assets/Logo-black.png";
import LogoWhite from "@/assets/Logo-white.png";
import Image from "next/image";
import { FaRegWindowClose, FaInstagram, FaFacebook, FaLinkedinIn  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

export const HomeMenu = ({ isOpen, onClose, isLister, username }) => {
    return (
        <>
            {/* Sidebar Modal */}
            <div
                className={`fixed top-0 right-0 h-full w-[50%] md:w-[30%] flex flex-col bg-white text-black dark:bg-black dark:text-white shadow-lg z-50 transition-transform duration-300 rounded-l-lg ${
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
                <div className="p-4 tracking-tight">
                    <ul className="space-y-4">
                        <li>
                            <a href="/browse" className="hover:underline">
                                Find A Lister
                            </a>
                        </li>
                        <li>
                            <a href="/messages" className="hover:underline">
                                Messages
                            </a>
                        </li>
                        {isLister && (
                            <div className="space-y-4">
                                <li>
                                    <a href={`/profile/${username}`} className="hover:underline">
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a href={`/dashboard/${username}`} className="hover:underline">
                                        Dashboard
                                    </a>
                                </li>                              
                            </div>
                        )}
                        <li>
                            <a href="/settings" className="hover:underline">
                                Settings
                            </a>
                        </li>
                        {/* <li>
                            <a href="/" className="hover:underline">
                                About
                            </a>
                        </li> */}
                        {/* <li>
                            <a>
                                Connect With Us
                            </a>
                            <div className="pt-4 flex flex-row gap-5">
                                <Link href={"https://www.instagram.com/"}>
                                    <FaInstagram size={20} />
                                </Link>
                                <Link href={"https://www.facebook.com/"}>
                                    <FaFacebook size={20}/>
                                </Link>
                                <Link href={"https://www.x.com/"}>
                                    <FaXTwitter size={20}/>
                                </Link>
                                <Link href={"https://www.linkedIn.com/"}>
                                    <FaLinkedinIn size={20}/>
                                </Link>
                                <Link href={"#"}>
                                    <IoMail size={20}/>
                                </Link>
                            </div>
                        </li> */}
                    </ul>
                </div>
                {/* <div className="pl-0 flex flex-row items-center gap-4 mt-auto mb-4">
                    <button onClick={toggleLoginModal} className="btn">
                        Sign in
                    </button>
                    <button onClick={toggleJoinModal} className="btn btn-primary">
                        Join
                    </button>
                </div> */}
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