"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import TimeSelection from "@/components/TimeSelection";
import Calendar from "@/components/Calendar";

export const Information = ({id, isLister, thisLister, editingEnabled, toggleEditing, session, sessionStatus}) => {
  const [selectedService, setSelectedService] = useState({name: "", price: ""});
  const [openForm, setOpen] = useState(false);
  const [dateSelected, setDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [specialNote, setNote] = useState(null);
  const router = useRouter();
  const callbackUrl = window.location.href;

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

  const handleAppointmentRequest = async (e, listerId, firstname, lastname, email, selectedDate, selectedTime, selectedServices, listerEmail, listerName, listerUsername, specialNote) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listerId,
          listerEmail,
          listerName,
          listerUsername,
          firstname,
          lastname,
          email,
          date: selectedDate,
          time: selectedTime,
          services: selectedServices,
          specialNote,
        }),
      });

      const data = await response.json();
      // setAlertOpen(true);
      if (response.ok) {
        // setError("Your appointment has been requested.")
        alert("Your appointment has been requested.")
      } else {
        // setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment.", response.error);
        alert("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment.", response.error);
      }
      setOpen(false);
    } catch (error) {
      // setAlertOpen(true);
      console.error(error);
      // setError("Something went wrong. Please try again.");
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="text-sm text-black pb-4">
      <div className="flex flex-col items-center p-2">
        <strong className="p-2">Services</strong>
        <div className="w-fit bg-[#d6ffe7] rounded-md ">
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
                  <div className="flex justify-between items-center gap-2"> 
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
          className="fixed inset-0 backdrop-blur-md bg-black/2 flex items-center justify-center z-10 p-2"
          onClick={() => setOpen(false)}
        >
          <form 
            className="bg-white shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-sm h-fit flex flex-col gap-2 items- text-black pb-7" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center p-3 gap-2 bg-black text-white rounded-t-sm">
            <h1>Book <span className="bg-gradient-to-r from-[#d6ffe7] to-[#ff7700] text-transparent bg-clip-text">{selectedService.name.toLowerCase()}</span> with {thisLister.firstname}</h1>
              <button type="button" onClick={() => setOpen(false)} className="px-1 border border-white rounded-lg">x</button>
            </div> 
            <div className="p-2 flex flex-col gap-2">
              <a className="font-bold">
                Cost: <span className="font-normal">${selectedService.price}</span>
              </a>
              {thisLister.instructions && (
                <div className="flex flex-col">
                  <label className="w-full border-b border-black/30 font-bold">Note from {thisLister.firstname}</label>
                  <a className="mt-1 text-xs max-w-[600px]">"{thisLister.instructions}"</a>
                </div>
              )}
            </div>
            <div className="p-2">
              <Calendar isLister={thisLister} editingEnabled={false} setSelectedDate={setDate} unavailableDays={[]} onAvailabilityChange={null}/>
            </div>
            { dateSelected && (
              <div className="w-full max-w-full overflow-hidden">
                <TimeSelection
                  dateSelected={dateSelected}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  listerId={thisLister._id}
                  availability={thisLister.availability}
                  timeSlotInterval={thisLister.timeSlotInterval}
                />
              </div>
            )}

            <div className="p-2">
              <a className="font-bold">Anything you would like John to know?</a>
              <textarea name="specialNote" className="w-full border border-black p-2 text-xs rounded-sm" placeholder="Leave a message here" onChange={(e) => setNote(e.target.value)}/>
            </div>     
            
            <div className="flex justify-center p-2">
              {/* MAYBE BEFORE REQUESTING THE APPOINTMENT THERE SHOULD BE A CONFIRMATION BOX */}
              <button type="button" className="btn btn-primary w-full" onClick={(e) => {sessionStatus=="authenticated" ? handleAppointmentRequest(e,
                thisLister._id, 
                session.user.firstname,
                session.user.lastname,
                session.user.email,
                dateSelected,
                selectedTime,
                selectedService.name,
                thisLister.email,
                thisLister.firstname,
                thisLister.username,
                specialNote,
              ):(
                router.push(`/login?callbackUrl=${callbackUrl}`)
              ) }}
              >
                {sessionStatus=="authenticated" ? "Request Appointment":"Login to request appointment"}
              </button>
            </div>
            
          </form>
        </div>
      )}
    </section>
  );
};