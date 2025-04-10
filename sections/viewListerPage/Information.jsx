"use client";

import Calendar from "@/components/Calendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Selections } from "./Selections";
import { set } from "mongoose";

const handleAppointmentRequest = async (id, firstname, lastname, selectedDate, selectedTime, selectedServices, {setSuccess, setError}) => {
  try {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listerId: id,
        firstname: firstname,
        lastname: lastname,
        date: selectedDate,
        time: selectedTime,
        services: selectedServices
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setSuccess(`${firstname}, your appointment for ${new Date(selectedDate).toLocaleString("default", { month: "long", day: "numeric", year: "numeric" })} at ${selectedTime} has been requested. Keep an eye on your inbox for updates.`)
    } else {
      alert(`${data.message}. Make sure you've made service, date, and time selections before requesting.`);
      // setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment");
    }
  } catch (error) {
    console.error(error);
    setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment");
    alert("Something went wrong.");
  }
};


const generateTimeSlots = (offset) => {
  const times = [];
  let hour = 9; // Start time: 9 AM
  if(!offset) offset = 2; // Offset is the increment scale (by how many hours);

  for (let i = 0; i < 12; i++) {
    const ampm = hour >= 12 && hour < 24 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 24-hour format to 12-hour format

    times.push(`${formattedHour}:00 ${ampm}`);
    hour += offset;
  }
  return times;
};

export const Information = ({id, thisLister}) => {
  // const [thisLister, setLister] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showInstructionsButton, setShowInstructionsButton] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  const curr_user = session?.user?.id;
  const [selectedServices, setSelectedServices] = useState([]);
  const firstname = session?.user?.firstname;
  const lastname = session?.user?.lastname;


  const availableTimes = generateTimeSlots();
  let date = selectedDate 

  const handleInstructions = () => {
    setShowInstructions(!showInstructions);
    setShowInstructionsButton(!showInstructionsButton);
  }

  const handleServiceSelection = (e) => {
    setSelectedServices((prev) =>
      prev.includes(e)
        ? prev.filter((s) => s !== e) // Remove if already selected
        : [...prev, e] // Add if not selected
    )
  }

  if (!thisLister) {
    return <div>No lister found</div>;
  }

    return (
      <div className="flex md:flex-col lg:gap-2 lg:flex-row items-center justify-center text-black">
        <section className="w-full">
          <div className="bg-[#F3F3F3] md:rounded-xl py-10 px-6">

            {showInstructionsButton && (
              <div>
                <button onClick={handleInstructions}>Instructions</button>
                <p className="text-xs text-black/50">Click to read</p>
              </div>
            )}

            {showInstructions && (
              <div className="flex flex-col justify-between bg-white text-black p-3 rounded-md transition transform duration-1000">
                <div>
                  <h1 className="font-semibold">Regarding Services:</h1>
                  {thisLister.instructions ? (
                    <p className="pl-3">{thisLister.instructions}</p>
                  ):(
                    <p className="pl-3">This lister has left no special instructions. Less work for you :)</p>
                  )}
                  <h1 className="font-semibold">How to setup your appointment:</h1>
                  <div className="bg-[#F3F3F3] p-2 rounded-md">
                    <ul>
                      <li>
                        1. From the services displayed, click on the service/s you would like.
                      </li>
                      <li>
                        2. Select any of the available dates on the calendar that work for you.
                      </li>
                      <li>
                        3. Select a time that works for you from the time wheel.
                      </li>
                    </ul>
                    <p className="mt-4 font-medium">After you have made all your desired selections, click "Request An Appointment". The lister will review the request and update you on its confirmation status</p>
                  </div>
                </div>
                <div className="flex justify-end">
                <button className="btn" onClick={handleInstructions}>
                  close
                </button>
                </div>
              </div>
            )}
             
            <div className="md:flex md:flex-row md:justify-between gap-5">
              <div className="lg:w-[35%] flex flex-col">

                {/* Services offered by lister section and the selection made by the user */}
                <div className="flex flex-col gap-6">
                  <div className="w-full">
                    <div className="section-title text-sm text-start pb-3 pt-5 md:text-xl xl:text-2xl">
                      {thisLister.firstname}'s Services
                    </div>
                    {thisLister.services.map((service, index) => (
                      <div key={index} className="text-sm md:text-md xl:text-lg pb-6">
                        <div className="flex justify-between min-w-[120px]">
                          <button className="cursor-pointer" onClick={() => handleServiceSelection(service.name)}>
                            {service.name}
                          </button>
                          {service.price && (
                            <ul className="font-semibold">${service.price}</ul>
                          )}
                        </div>
                        {/* question mark because they may not exists */}
                        {service.subcategories?.map((subService, jndex) => (
                          <div key={jndex} className="mt-1 ml-3 flex flex-row justify-between font-light">
                            <button className="cursor-pointer" onClick={() => handleServiceSelection(subService.name)}>
                              {subService.name}
                            </button>
                            <ul className="font-semibold">${subService.price}</ul>
                          </div>
                        ))}
                        </div>
                      ))}
                  </div>

                  {/* Service Selected (Might have to turn this to a component!!) */}
                  <div className="block md:hidden w-full text-center">
                    <p className="text-xs font-semibold">Selected Service/s</p>
                    <div className="w-full h-fit outline-1 text-black text-xs py-5 px-1 mt-1 rounded-lg">
                      {selectedServices.length > 0 ? selectedServices.map((service, index) => (
                        <div key={index} className="font-normal">
                          {service}
                        </div>
                      )):(
                        <p> No services selected currently</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability section */}
              <div className="lg:flex-col lg:justify-center pb-6">
                <div className="flex flex-col justify-between items-center gap-6">
                  <div className="pt-5 flex flex-col w-full gap-3">
                      <h1 className="section-title text-start text-sm md:text-lg xl:text-2xl">{thisLister.firstname}'s Availability</h1>
                      <div className="mt-5 md:min-w-[250px]">
                        {/* Maybe make this an expandable feature, so it isnt so small */}
                          <Calendar setSelectedDate={setSelectedDate} unavailableDays={thisLister.unavailableDays}/>
                      </div>
                  </div>

                  {/* Availability Selected */}
                  <div className="block md:hidden w-full text-center">
                    <p className="text-xs font-semibold">Selected date</p>
                    <div className="w-full h-fit outline-1 text-black text-xs py-5 px-1 mt-1 rounded-lg">
                      {selectedDate ? (
                        <div className="font-normal">
                          {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </div>
                      ):(
                        <p> No date selected currently</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
                                
              {/* Time selection section */}
              <div className="mt-4 flex flex-col justify-center items-center gap-6">
                <div className="w-full py-3 bg-white/40 shadow-lg rounded-lg">
                  {/* <h2 className="text-md font-semibold mb-3 text-center">Select a Time Slot</h2> */}
                  <div className="w-32 h-52 overflow-y-scroll mx-auto p-2">
                    <div className="flex flex-col gap-2">
                      {availableTimes.map((time, index) => (
                        <button
                          key={index}
                          className={`px-2 py-2 rounded-md ${
                            selectedTime === time ? "bg-blue-500 text-white" : "bg-none"
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time selected */}
                <div className="block md:hidden w-full text-center">
                  <p className="text-xs font-semibold">Selected Time</p>
                  <div className="w-full h-fit outline-1 text-black text-xs py-5 px-1 mt-1 rounded-lg">
                    {selectedTime ? (
                      <div className="font-normal">
                        {selectedTime}
                      </div>
                    ):(
                      <p> No time selected currently</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex md:hidden mt-10 justify-center text-xs md:text-lg">
              <button onClick={() => handleAppointmentRequest(id, firstname, lastname, selectedDate, selectedTime, selectedServices, {setSuccess, setError})} className="btn btn-primary">Request An Appointment</button>
            </div>
          </div>
          {/* {error && (
            <div className="absolute w-screen h-screen top-0 left-0 z-10 flex items-center justify-center bg-black/40">
              <div className="w-[20%] bg-white p-6 z-20 text-center rounded-xl shadow-sm">
                <p>{error}</p>
                <button onClick={() => setError(null)} className="mt-6 btn btn-primary">Ok</button>
              </div>
            </div>
          )} */}
        </section>
        <Selections selectedServices={selectedServices} selectedDate={selectedDate} selectedTime={selectedTime} handleAppointmentRequest={handleAppointmentRequest} id={id} firstname={firstname} lastname={lastname}/>
      </div>
    );
};