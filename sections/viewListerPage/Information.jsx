"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiThreedotjs } from "react-icons/si";

export const Information = ({id, isLister, thisLister, editingEnabled, toggleEditing, sessionStatus}) => {
  const [selectedTab, setTab] = useState("All");
  const [showPriceIndex, setShowPriceIndex] = useState(null);
  const router = useRouter();

  console.log(thisLister);

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
      <div className="flex flex-col items-center">
        <strong className="p-2">Services</strong>
        <div className="w-150 bg-[#d6ffe7] rounded-md ">
          {thisLister.services.map((service, index) => (
            <div key={index} className="relative group p-3">
              <div className="flex justify-between border-b border-black/35"> 
                <strong>
                  {service.type}
                </strong>
                <div className="">
                  ({service.subcategories.length})
                </div>
              </div>
              {service.subcategories.map((service, jndex) => (
                <div key={jndex} className="py-2 hover:scale-[1.01] cursor-default duration-100">
                  <div className="flex justify-between"> 
                    <div className="w-full">
                      <div className="tracking-wide">
                        {service.name} - ${service.price}
                      </div>
                      {service.description && (
                        <div className="text-black/65 text-sm">
                          {service.description}
                        </div>
                      )}
                    </div>
                    <div>
                      <button className="btn btn-primary">
                        Book
                      </button>
                    </div>
                    </div>
                </div>
              ))}
              {/* <button
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
              </button> */}
            </div>
          ))}
        {/* <button className={`${selectedTab == "All" ? "bg-black/5":""} h-fit p-2 rounded-t-md cursor-pointer hover:bg-blue-500 hover:text-white`} onClick={() => handleTabChange("All")}>
          All
        </button> */}
        </div>
      </div>
    </section>
  );
};