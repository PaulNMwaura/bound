"use client";
import { FaSignOutAlt, FaRegWindowClose, FaInstagram, FaFacebook, FaLinkedinIn  } from "react-icons/fa";
import React from "react";
import { signOut } from "next-auth/react";

export const ViewPageSidebar = ({isLister, id, isOpen, onClose }) => {
    return (
        <>
            {/* Sidebar Modal */}
            <div
                className={`fixed top-0 right-0 h-full w-[50%] flex flex-col bg-white text-black dark:bg-black dark:text-white shadow-lg z-50 transition-transform duration-300 rounded-lg ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-4 flex mt-8 justify-between items-center border-b">
                    <h2 className="text-lg font-bold">Logo</h2>
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
                            {isLister && (
                                <a href={`/dashboard/${id}`} className="hover:underline">
                                    My Dashboard
                                </a>
                            )}
                        </li>
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