"use client";

import Image from "next/image";
import LogoBlack from "@/assets/Logo-black.png";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { HomeMenu } from "@/components/HomeMenu";

export const Header = ({username, isLister, setFilters, session, sessionStatus}) => {
    const [isOpen, setMenuOpen] = useState(false);

    const toggleHomeMenu = () => setMenuOpen(!isOpen);
    
    const router = useRouter();

    const [formData, setFormData] = useState({ city: "", state: "", service: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFilters(formData); // Update filters in parent component
    };
    
    return (
      <header>
        <div className="container py-2 bg-white text-black rounded-b-xl">
          <div className="flex justify-between items-center">
            <div onClick={() => redirect("/home")}>
              <Image src={LogoBlack.src} alt="Logo"  width={20} height={20} />
            </div>
            <div className="hidden md:flex max-w-3/4 lg:max-w-full text-xs lg:text-lg">
              <form onSubmit={handleSubmit} className="flex flex-row justify-between gap-1">
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded placeholder:text-sm"
                />
                <select name="state" value={formData.state} onChange={handleChange} className="border border-gray-300 p-2 rounded w-full text-sm">
                  <option value="" className="text-sm">Select state</option>
                    {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                      <option key={state} value={state} className="text-sm">{state}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="service"
                  placeholder="Enter service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded placeholder:text-sm"
                />
                <button type="submit" className="btn btn-primary text-sm">
                  Find
                </button>  
              </form>
            </div>
            <div className="flex items-center">
              {isLister ? (
                <div className="hidden lg:flex">
                  <button onClick={() => router.replace(`/messages`)} className="btn cursor-pointer">Profile</button>
                  <button onClick={() => router.replace(`/dashboard/${username}`)} className="btn cursor-pointer">Dashboard</button>
                </div>
              ):(
                <div className="hidden lg:block">
                  <button onClick={() => router.replace(`/home`)} className="btn cursor-pointer">Home</button>
                </div>
              )}
              {session ? (
                <div className="hidden lg:flex">
                  <div className="hidden lg:block">
                    <button onClick={() => router.replace(`/messages`)} className="btn cursor-pointer">Messages</button>
                  </div>
                  <div className="hidden lg:block">
                    <button onClick={() => router.replace(`/settings`)} className="btn cursor-pointer">Settings</button>
                  </div>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="btn cursor-pointer">Sign out</button>
                </div>
              ):(
                <div className="hidden lg:flex">
                  <button onClick={() => redirect("/login")} className="btn cursor-pointer">Login</button>
                  <button onClick={() => redirect("/register")} className="btn btn-primary cursor-pointer">Sign Up</button>
                </div>
              )}
              <button onClick={toggleHomeMenu} className="block lg:hidden cursor-pointer">
                <IoMenu size={24}/>
              </button>
            </div>
          </div>
        </div>
        <HomeMenu isOpen={isOpen} onClose={toggleHomeMenu} isLister={isLister} username={username} sessionStatus={sessionStatus}/>
        {/* <SearchMenu setFilters={setFilters} isOpen={isSidebarOpen} onClose={toggleSidebar} /> */}
      </header>
    );
};