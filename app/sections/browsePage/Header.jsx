"use client";
import Image from "next/image";
import Logo from "@/app/assets/BoundLogo.png";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { SearchMenu } from "@/app/components/SearchMenu";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export const Header = ({id, isLister, setFilters}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state

    const router = useRouter();

    const [formData, setFormData] = useState({ city: "", state: "", service: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.state == "Search All")
          formData.state = "";
        setFilters(formData); // Update filters in parent component
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    return (
      <>
        <header className="sticky top-0 backdrop-blur-sm z-[1]">
          <div className="container pt-6 max-w-full">
            <div className="flex justify-between items-center gap-4">
              <div>
                <Image src={Logo} alt="Website Logo" height={50} width={50} />
              </div>
              <form
                onSubmit={handleSubmit}
                className="hidden md:flex flex-row justify-between gap-6"
              >
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded placeholder:text-sm"
                />
                <select name="state" value={formData.state} onChange={handleChange} className="border border-black p-2 rounded w-2/3">
                  <option value="">Select State</option>
                    {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                      <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="service"
                  placeholder="Enter Service (e.g., Barber)"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded placeholder:text-sm"
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>
              <div className="flex justify-center items-center">
                <div className="flex items-center">
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="btn">Sign out</button>
                  {isLister && (
                    <div className="hidden md:block md:text-xs border border-black rounded-lg p-2">
                      <button onClick={() => router.replace(`/dashboard/${id}`)}>
                        My Dashboard
                      </button>
                    </div>
                  )}
                </div>
                {/* Mobile Menu Icon */}
                <div className="flex items-center md:hidden">
                  {/* <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn"
                  >
                    Sign Out
                  </button> */}
                  <button
                    onClick={toggleSidebar}
                    className="h-6 w-6 cursor-pointer"
                  >
                    <IoMenu />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar Modal */}
        <SearchMenu setFilters={setFilters} isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </>
    );
};
