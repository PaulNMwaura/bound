"use client";

import Image from "next/image";
import Logo from "@/app/assets/BoundLogo.png";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { HomeMenu } from "@/app/components/HomeMenu";

export const Header = ({id, isLister, setFilters, userFirstname}) => {
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
        <div className="container py-2 bg-white rounded-b-xl">
          <div className="flex justify-between items-center">
            {/* <div>
              <p className="hidden md:block">Hello {userFirstname}!</p>
              <div className="block md:hidden">
                <Image src={Logo} alt="Website Logo" height={50} width={50} />
              </div>
            </div> */}
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
                <select name="state" value={formData.state} onChange={handleChange} className="border border-gray-300 p-2rounded w-full">
                  <option value="">Select state</option>
                    {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
                      <option key={state} value={state}>{state}</option>
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
                <button type="submit" className="btn btn-primary">
                  Search
                </button>  
              </form>
            </div>
            <div className="flex">
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn">Sign out</button>
              <button onClick={toggleHomeMenu}>
                <IoMenu size={24}/>
              </button>
            </div>
          </div>
        </div>
        <HomeMenu isOpen={isOpen} onClose={toggleHomeMenu} />
        {/* <SearchMenu setFilters={setFilters} isOpen={isSidebarOpen} onClose={toggleSidebar} /> */}
      </header>
      // <>
      //   <header className="sticky top-0 backdrop-blur-sm z-[1]">
      //     <div className="container pt-6 max-w-full">
      //       <div className="flex justify-between items-center gap-4">
      //         <div>
      //           <Image src={Logo} alt="Website Logo" height={50} width={50} />
      //         </div>
      //         <form
      //           onSubmit={handleSubmit}
      //           className="hidden md:flex flex-row justify-between gap-6"
      //         >
      //           <input
      //             type="text"
      //             name="city"
      //             placeholder="Enter City"
      //             value={formData.city}
      //             onChange={handleChange}
      //             className="w-full p-2 border border-gray-300 rounded placeholder:text-sm"
      //           />
      //           <select name="state" value={formData.state} onChange={handleChange} className="border border-black p-2 rounded w-2/3">
      //             <option value="">Select State</option>
      //               {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((state) => (
      //                 <option key={state} value={state}>{state}</option>
      //             ))}
      //           </select>
      //           <input
      //             type="text"
      //             name="service"
      //             placeholder="Enter Service (e.g., Barber)"
      //             value={formData.service}
      //             onChange={handleChange}
      //             className="w-full p-2 border border-gray-300 rounded placeholder:text-sm"
      //           />
      //           <button type="submit" className="btn btn-primary">
      //             Search
      //           </button>
      //         </form>
      //         <div className="flex justify-center items-center">
      //           <div className="flex items-center">
      //             <button onClick={() => signOut({ callbackUrl: "/" })} className="btn">Sign out</button>
      //             {isLister && (
      //               <div className="hidden md:block md:text-xs border border-black rounded-lg p-2">
      //                 <button onClick={() => router.replace(`/dashboard/${id}`)}>
      //                   My Dashboard
      //                 </button>
      //               </div>
      //             )}
      //           </div>
      //           {/* Mobile Menu Icon */}
      //           <div className="flex items-center md:hidden">
      //             {/* <button
      //               onClick={() => signOut({ callbackUrl: "/" })}
      //               className="btn"
      //             >
      //               Sign Out
      //             </button> */}
      //             <button
      //               onClick={toggleSidebar}
      //               className="h-6 w-6 cursor-pointer"
      //             >
      //               <IoMenu />
      //             </button>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </header>

      //   {/* Sidebar Modal */}
      //   <SearchMenu setFilters={setFilters} isOpen={isSidebarOpen} onClose={toggleSidebar} />
      // </>
    );
};
