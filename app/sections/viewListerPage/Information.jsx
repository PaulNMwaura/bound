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

const generateTimeSlots = () => {
  const times = [];
  let hour = 9; // Start time: 9 AM

  for (let i = 0; i < 12; i++) {
    const ampm = hour >= 12 && hour < 24 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 24-hour format to 12-hour format

    times.push(`${formattedHour}:00 ${ampm}`);
    hour += 2; // Increment by 2 hours
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
        <div className="container bg-[#98F5F9]/30 rounded-xl pb-20">
          <div className="lg:flex lg:flex-row lg:justify-between gap-2">
            <div className="lg:w-[35%] flex flex-col">
              {/* Services offered by lister section */}
              <div>
                  <div className="section-title text-sm text-start pb-3 pt-5 md:text-2xl">Services Offered</div>
                  {thisLister.services.map((service, index) => (
                      <div key={index} className="text-sm md:text-lg">
                      <div className="section-description flex justify-between">
                          <button onClick={() => handleServiceSelection(service.name)}>
                            {service.name}
                          </button>
                          {service.price && (
                          <ul className="font-semibold">${service.price}</ul>
                          )}
                      </div>
                      {/* question mark because they may not exists */}
                      {service.subcategories?.map((subService, jndex) => (
                          <div
                          key={jndex}
                          className="pl-8 flex flex-row justify-between font-light"
                          >
                            <button onClick={() => handleServiceSelection(subService.name)}>
                              {subService.name}
                            </button>
                            <ul className="font-semibold">${subService.price}</ul>
                          </div>
                      ))}
                      </div>
                  ))}
              </div>
              <div className="my-auto px-2 py-4 bg-[#F89760]/50 rounded-md shadow">
              {/* If an appointment was requested without error */}
              {success && error == null ? (
                <div>
                  <p>{success}</p>
                </div>
              ):(
                <div>
                  {selectedDate === null && selectedServices.length === 0  && selectedTime === null ? (
                    <p>
                      To request an appointment, make selections first. <br />
                      (Select a time, date, and service/s needed) <br />
                    </p>
                  ):(
                    <div>
                      <div className="font-bold">
                        Services Selected:
                        {/*Selected Services Section */}
                        {selectedServices.map((service, index) => (
                          <div key={index} className="ml-6 font-normal">
                            {service}
                          </div>
                        ))}
                      </div>
                      <div className="font-bold">
                        Time Selected:
                        <p className="ml-6 font-normal">{selectedTime}</p>
                      </div>
                      <div className="font-bold">
                        Date Selected: <br />
                        {selectedDate && (
                          <p className="ml-6 font-normal">{new Date(selectedDate).toLocaleString("default", { month: "long", day: "numeric", year: "numeric" })}</p>
                        )}
                      </div>
                      {selectedDate != null && selectedTime != null && selectedServices.length > 0 ? (
                        <p className="p-2 text-sm font-semibold text-black bg-[#cefdff] rounded-md shadow">
                          If everything looks good, click "Request Appointment".
                        </p>
                      ):(<div></div>)}
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>

            {/* Availability section */}
            <div className="lg:flex-col lg:justify-center">
              <div className="pt-5 flex flex-col items-center">
                  <h1 className="section-title text-2xl md:text-3xl">{thisLister.firstname}'s Availability</h1>
                  <h2 className="text-md font-semibold text-center">Select a date</h2>
                  <div className="pt-6">
                      <Calendar setSelectedDate={setSelectedDate} unavailableDays={thisLister.unavailableDays}/>
                  </div>
              </div>

              <div className="pt-3 flex flex-row gap-2 place-content-center">
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
              </div>
              <div className="pt-5 flex justify-center md:gap-20 text-xs md:text-lg">
                  <button onClick={() => handleAppointmentRequest(id, firstname, lastname, selectedDate, selectedTime, selectedServices, {setSuccess, setError})}className="btn btn-primary">Request An Appointment</button>
                  <button className="btn">contact</button>
              </div>
            </div>
                              
            {/* Time Selection Section */}
            <div className="pt-4 md:pt-0 mx-auto my-auto">
              <h2 className="text-md font-semibold mb-3 text-center">Select a Time Slot</h2>
              <div className="w-52 h-96 p-4 overflow-y-scroll my-auto mx-auto">
                <div className="flex flex-col gap-2">
                  {availableTimes.map((time, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-md border ${
                        selectedTime === time ? "bg-blue-500 text-white" : "bg-white"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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