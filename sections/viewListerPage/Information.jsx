"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TimeSelection from "@/components/TimeSelection";
import Calendar from "@/components/Calendar";

export const Information = ({id, isLister, thisLister, editingEnabled, toggleEditing, sessionStatus}) => {
  const [selectedService, setSelectedService] = useState({name: "", price: ""});
  const [openForm, setOpen] = useState(false);
  const [dateSelected, setDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const router = useRouter();

  const handleTabChange = (string) => {
    setTab(string);
    if (string != "All")
      router.push(`?tab=${string}`);
    else
      router.push("?", { scroll: false });
  };

  const handleApplicationFormOpen = (object) => {
    setOpen(true);
    setSelectedService(object);
  };

  return (
    <section className="container text-sm sm:text-[16px] text-black pb-4">
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
                      <button type="button" className="btn btn-primary text-xs" onClick={() => handleApplicationFormOpen(service)}>
                        Book
                      </button>
                    </div>
                    </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {openForm && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/2 flex items-center justify-center z-10"
          onClick={() => setOpen(false)}
        >
          <form 
            className="bg-white shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-sm min-w-[400px] h-fit flex flex-col gap-2 items- text-black pb-7" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center p-3 gap-2 bg-black text-white rounded-t-sm">
            <h1>Book <span className="bg-gradient-to-r from-[#d6ffe7] to-[#ff7700] text-transparent bg-clip-text">{selectedService.name.toLowerCase()}</span> with {thisLister.firstname}</h1>
              <button type="button" onClick={() => setOpen(false)} className="px-1 border border-white rounded-lg">x</button>
            </div> 
            <div className="p-2 flex flex-col gap-2">
              {thisLister.instructions && (
                <div className="flex flex-col">
                  <label className="w-full border-b border-black/30">Note from {thisLister.firstname}</label>
                  <a className="mt-1 text-xs max-w-[600px]">"{thisLister.instructions}"</a>
                </div>
              )}
              <a>
                Cost: <span>${selectedService.price}</span>
              </a>
              <a>Duration: </a>
            </div>
            <div className="p-2">
              <Calendar isLister={thisLister} editingEnabled={false} setSelectedDate={setDate} unavailableDays={[]} onAvailabilityChange={null}/>
            </div>
            { dateSelected && (
              <div className="p-2">
                <TimeSelection
                  dateSelected={dateSelected}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  listerId={thisLister._id}
                  availability={thisLister.availability}
                />
              </div>
            )}     
            
            <div className="flex justify-center p-2">
              <button className="btn btn-primary w-full">
                Request Appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};