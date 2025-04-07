"use client";

import { FaRegWindowClose } from "react-icons/fa";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";


export const SearchMenu= ({setFilters, isOpen, onClose }) => {
    const [error, setError] = useState("");
    
    const router = useRouter();

    const [formData, setFormData] = useState({ city: "", state: "", service: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFilters(formData); // Update filters in parent component
        router.replace(`/browse?city=${formData.city}&state=${formData.state}&service=${formData.service}`);
        onClose();
    };

    return (
        <>
            {/* Sidebar Modal */}
            <div
                className={`fixed top-0 right-0 h-full w-[100%] bg-white shadow-lg z-50 transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold">Specify Your Search</h2>
                    <button onClick={onClose} className="h-6 w-6 cursor-pointer">
                        <FaRegWindowClose />
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="label font-semibold">Service</label>
                                <input name="service" onChange={handleChange} type="text" className="pl-2 w-full border rounded placeholder:text-xs" placeholder="What type of service would you like?"/>
                            </div>
                            <div>
                                <label className="label font-semibold">City</label>
                                <input name="city" onChange={handleChange} type="text" className="pl-2 w-full border rounded placeholder:text-xs" placeholder="Which city should we base your search?"/>
                            </div>
                            <div>
                                <label className="label font-semibold">State</label>
                                <input name="state" onChange={handleChange} type="text" className="pl-2 w-full border rounded placeholder:text-xs" placeholder="Which state should we base your search?"/>
                            </div>
                            {error && (
                                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-between">
                                <button onClick={() => signOut()} className="w-32 btn">Sign out</button>
                                <div className="w-full flex justify-end">
                                    <button type="reset" className="btn" onClick={() => {
                                        setFormData({ city: "", state: "", service: "" });
                                        setFilters({ city: "", state: "", service: "" });
                                    }}>Clear All</button>
                                    <button type="submit" className="btn btn-primary w-32">Apply Filter</button>
                                </div>
                            </div>
                        </div>
                    </form>
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
