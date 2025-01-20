"use client";
import Image from "next/image";
import Logo from "@/app/assets/BoundLogo.png";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { SearchMenu } from "@/app/components/SearchMenu";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export const Header = () => {
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [location, setLocation] = useState("");
    const [service, setService] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state

    const router = useRouter();

    const handleSubmit = (e:any) => {
        e.preventDefault();
        setLocation(`${city}, ${state}`);
        console.log(location);
        console.log(service);
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
                        <div className="hidden md:flex flex-row h-8 gap-2 items-center">
                            <div className="search-bar">
                                <input
                                    type="email"
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="City"
                                    className="w-full outline-none bg-white pl-4 text-sm"
                                />
                            </div>
                            <div className="search-bar">
                                <input
                                    type="email"
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="State - (TX)"
                                    className="w-full outline-none bg-white pl-4 text-sm"
                                />
                            </div>
                            <form className="hidden md:block text-center">
                                <label className="default mb-2 text-sm font-medium text-black">
                                    Select a service
                                </label>
                                <select
                                    id="small"
                                    onChange={(e) => setService(e.target.value)}
                                    className="block w-full px-1 py-1 mb-6 text-sm border text-gray-400 border-orange-500 rounded-full focus:ring-blue-500"
                                >
                                    <option className="text-black/50" defaultValue={"What are you looking for?"}>
                                        What are you looking for?
                                    </option>
                                    <option value="barber">Barber</option>
                                    <option value="hairstyler">Hairstyler</option>
                                    <option value="nail-artist">Nail Artist</option>
                                    <option value="makeup-artist">Makeup Artist</option>
                                    <option value="tattoo-artist">Tattoo Artist</option>
                                </select>
                            </form>
                            <div className="hidden md:flex">
                                <button onClick={handleSubmit} className="search-btn">
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="hidden md:block md:text-xs border border-black rounded-lg p-2">
                                <button onClick={() => router.replace("/profile")}>My Profile</button>
                            </div>
                            {/* Mobile Menu Icon */}
                            <div className="flex items-center md:hidden">
                                <button onClick={() => signOut()}className="btn">Sign Out</button>
                                <button onClick={toggleSidebar} className="h-6 w-6 cursor-pointer">
                                    <IoMenu />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar Modal */}
            <SearchMenu isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </>
    );
};
