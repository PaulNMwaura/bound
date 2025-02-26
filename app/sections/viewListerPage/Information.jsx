"use client";

import Calendar from "@/app/components/Calendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const handleAppointmentRequest = async (id, firstname, lastname, selectedDate, selectedTime, selectedServices, {setSuccess, setError}) => {
  // if(!id || !firstname || !lastname || !selectedDate || !selectedTime || !selectedServices) {
  //   setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment");
  //   return;
  // }
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
      alert(`Error: ${data.message}`);
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

export const Information = ({id}) => {
  const [thisLister, setLister] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  const curr_user = session?.user?.id;
  const [selectedServices, setSelectedServices] = useState([]);
  const firstname = session?.user?.firstname;
  const lastname = session?.user?.lastname;

  // console.log("id: ", id);
  // console.log(curr_user);

  const availableTimes = generateTimeSlots();
  let date = selectedDate 

  useEffect(() => {
    // Fetch lister data when component mounts
    const fetchLister = async () => {
      try {
        const response = await fetch(`/api/findListers/${id}`);
        if (!response.ok) {
          throw new Error('Lister not found');
        }
        const data = await response.json();
        // console.log("data: ", data.lister);
        setLister(data.lister);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLister();
  }, [id]);

  const handleServiceSelection = (e) => {
    setSelectedServices((prev) =>
      prev.includes(e)
        ? prev.filter((s) => s !== e) // Remove if already selected
        : [...prev, e] // Add if not selected
    )
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!thisLister) {
    return <div>No lister found</div>;
  }

    return (
      <section>
        <div className="container max-w-[90%] bg-[#F3F3F3] rounded-xl pb-20">
          <div className="lg:flex lg:flex-row lg:justify-between gap-2">
            <div className="lg:w-[35%] flex flex-col">

              {/* Services offered by lister section and the selection made by the user */}
              <div className="flex justify-between items-center gap-6">
                <div className="w-full">
                  <div className="section-title text-xs text-start pb-3 pt-5 md:text-md">
                    {thisLister.firstname}'s Services
                  </div>
                  {thisLister.services.map((service, index) => (
                    <div key={index} className="text-xs md:text-md pb-6">
                      <div className="flex justify-between">
                        <button onClick={() => handleServiceSelection(service.name)}>
                          {service.name}
                        </button>
                        {service.price && (
                          <ul className="font-semibold">${service.price}</ul>
                        )}
                      </div>
                      {/* question mark because they may not exists */}
                      {service.subcategories?.map((subService, jndex) => (
                        <div key={jndex} className="ml-3 flex flex-row justify-between font-light">
                          <button onClick={() => handleServiceSelection(subService.name)}>
                            {subService.name}
                          </button>
                          <ul className="font-semibold">${subService.price}</ul>
                        </div>
                      ))}
                      </div>
                    ))}
                </div>

                {/* Service Selection (Might have to turn this to a component!!) */}
                <div className="w-full text-center">
                  <p className="text-xs font-semibold">Selected Service/s</p>
                  <div className="w-full h-fit bg-black text-white text-xs py-5 px-1 rounded-lg">
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
              <div className="flex justify-between items-center gap-6">
                <div className="pt-5 flex flex-col w-full gap-3">
                    <h1 className="section-title text-start text-xs md:text-lg">{thisLister.firstname}'s Availability</h1>
                    <div className="mt-5 scale-[1.2] md:mt-0 md:scale-[1]">
                        <Calendar setSelectedDate={setSelectedDate} unavailableDays={thisLister.unavailableDays}/>
                    </div>
                </div>
                <div className="w-full text-center">
                  <p className="text-xs font-semibold">Selected date</p>
                  <div className="w-full h-fit bg-black text-white text-xs py-5 px-1 rounded-lg">
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

              {/* <div className="pt-3 flex flex-row gap-2 place-content-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-red-600 overflow-y-clip overflow-x-clip">
                    <div className="w-8 h-12 rounded bg-purple-600 rotate-45 my-[15%] mx-[32%]"></div>
                    </div>
                    <a> = Unavailable</a>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-orange-500 "></div>
                    <a> = Available</a>
                </div>
              </div> */}
            </div>
                              
            {/* Time Selection Section */}
            <div className="mt-4 flex justify-between items-center gap-6">
              <div className="w-full py-3 bg-white/40 shadow-lg rounded-lg">
                {/* <h2 className="text-md font-semibold mb-3 text-center">Select a Time Slot</h2> */}
                <div className="w-32 h-52 overflow-y-scroll mx-auto p-3">
                  <div className="flex flex-col gap-2">
                    {availableTimes.map((time, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 rounded-md ${
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
              <div className="w-full text-center">
                <p className="text-xs font-semibold">Selected Time</p>
                <div className="w-full h-fit bg-black text-white text-xs py-5 px-1 rounded-lg">
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
          <div className="mt-10 flex justify-center text-xs md:text-lg">
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
    );
};