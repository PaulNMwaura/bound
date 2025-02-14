"use client";

import Calendar from "@/app/components/Calendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const handleAppointmentRequest = async ({curr_userId}) => {
  try {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: curr_userId,
        listerId: id,
        date: new Date(), // Replace with actual date selection
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Appointment request sent!");
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error(error);
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
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  const curr_user = session?.user?.id;
  console.log(curr_user);

  const availableTimes = generateTimeSlots();

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!thisLister) {
    return <div>No lister found</div>;
  }

    return (
      <section>
        <div className="container bg-[#98F5F9]/30 rounded-xl pb-20">
          <div className="lg:flex lg:flex-row lg:justify-between gap-2">
            {/* Services offered by lister section */}
            <div className="lg:w-[35%]">
                <div className="section-title text-sm text-start pb-3 pt-5 md:text-2xl">Services Offered</div>
                {thisLister.services.map((service, index) => (
                    <div key={index} className="text-sm md:text-lg">
                    <div className="section-description flex justify-between">
                        <button onClick={() => selectedServices.push(service.name)}>{service.name}</button>
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
                        <button onClick={() => selectedServices.push(service.name)}>{subService.name}</button>
                        <ul className="font-semibold">${subService.price}</ul>
                        </div>
                    ))}
                    </div>
                ))}
            </div>
            {/*Selected Services Section */}
            {selectedServices.map((service, index) => (
              <div>
                {service}
              </div>
            ))}

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
                  <button onClick={() => handleAppointmentRequest(curr_user)}className="btn btn-primary">Request An Appointment</button>
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
      </section>
    );
};