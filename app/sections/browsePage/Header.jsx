"use client";
import Image from "next/image";
import Logo from "@/app/assets/BoundLogo.png";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { SearchMenu } from "@/app/components/SearchMenu";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export const Header = ({setFilters}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state

    const router = useRouter();

    const [formData, setFormData] = useState({ city: "", state: "", service: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                className="hidden md:flex flex-row justify-between gap-3"
              >
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="Enter State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="service"
                  placeholder="Enter Service (e.g., Barber)"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>
              <div className="flex justify-center items-center">
                <div className="hidden md:block md:text-xs border border-black rounded-lg p-2">
                  <button onClick={() => router.replace("/profile")}>
                    My Profile
                  </button>
                </div>
                {/* Mobile Menu Icon */}
                <div className="flex items-center md:hidden">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn"
                  >
                    Sign Out
                  </button>
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
