"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// const handleAppointmentRequest = async (id, firstname, lastname, email, selectedDate, selectedTime, selectedServices, listerEmail, listerName, listerUsername) => {
//   try {
//     const response = await fetch("/api/appointments", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         listerId: id,
//         listerEmail,
//         listerName,
//         listerUsername,
//         firstname: firstname,
//         lastname: lastname,
//         email: email,
//         date: selectedDate,
//         time: selectedTime,
//         services: selectedServices,
//         // specialNote: specialNote
//       }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       alert(`${firstname}, your appointment for ${new Date(selectedDate).toLocaleString("default", { month: "long", day: "numeric", year: "numeric" })} at ${selectedTime} has been requested. Keep an eye on your inbox for updates.`)
//     } else {
//       alert(`${data.message}. Make sure you've made service, date, and time selections before requesting.`);
//       // setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment");
//     }
//   } catch (error) {
//     console.error(error);
//     // setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment");
//     alert("Something went wrong.");
//   }
// };

export const Information = ({id, isLister, thisLister, editingEnabled, toggleEditing, sessionStatus}) => {
  const [selectedTab, setTab] = useState("All");
  const router = useRouter();

  const handleTabChange = (string) => {
    setTab(string);

    /* 1. Change URL params */
    if (string != "All")
      router.push(`?tab=${string}`);
    else
      router.push("?", { scroll: false });

    /* 2. Display catalog based on URL Params */
  };

  return (
    <section className="container text-sm sm:text-[16px] text-black rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-1">
        <strong className="p-2">Services: </strong>
          {thisLister.services.map((service, index) => (
            <button key={index} className={`${selectedTab == service.name ? "bg-black/5":""} w-fit h-fit p-2 rounded-t-md cursor-pointer hover:bg-blue-500 hover:text-white`} onClick={() => handleTabChange(service.name)}>
              {service.name}
            </button>
          ))}
        <button className={`${selectedTab == "All" ? "bg-black/5":""} h-fit p-2 rounded-t-md cursor-pointer hover:bg-blue-500 hover:text-white`} onClick={() => handleTabChange("All")}>
          All
        </button>
      </div>
    </section>
  );
};