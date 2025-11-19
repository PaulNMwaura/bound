"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const Information = ({id, isLister, thisLister, editingEnabled, toggleEditing, sessionStatus}) => {
  const [selectedTab, setTab] = useState("All");
  const [showPriceIndex, setShowPriceIndex] = useState(null);
  const router = useRouter();

  const togglePrice = (i) => {
    setShowPriceIndex(showPriceIndex === i ? null : i);
  };

  const handleTabChange = (string) => {
    setTab(string);
    if (string != "All")
      router.push(`?tab=${string}`);
    else
      router.push("?", { scroll: false });
  };
  
  useEffect(() => {
    if (selectedTab === "All") {
      setShowPriceIndex(null);
    }
  }, [selectedTab]);

  return (
    <section className="container text-sm sm:text-[16px] text-black rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-1">
        <strong className="p-2">Services: </strong>
          {thisLister.services.map((service, index) => (
            <div key={index} className="relative group">
              <div
                className={`
                  absolute -top-8 left-1/2 -translate-x-1/2 w-full text-center
                  bg-black text-white text-xs px-2 py-1 rounded
                  transition-opacity duration-200 pointer-events-none
                  ${showPriceIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}
                `}
              >
                ${service.price}
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
              <button
                className={`
                  ${selectedTab == service.name ? "bg-black/5" : ""}
                  w-fit h-fit p-2 rounded-t-md cursor-pointer
                  hover:bg-blue-500 hover:text-white
                `}
                onClick={() => {
                  togglePrice(index);
                  handleTabChange(service.name);
                }}
              >
                {service.name}
              </button>
            </div>
          ))}
        <button className={`${selectedTab == "All" ? "bg-black/5":""} h-fit p-2 rounded-t-md cursor-pointer hover:bg-blue-500 hover:text-white`} onClick={() => handleTabChange("All")}>
          All
        </button>
      </div>
    </section>
  );
};