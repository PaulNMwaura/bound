"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar.jsx";
import TimeSelection from "@/components/TimeSelection.jsx";
import { redirect, useRouter } from "next/navigation";

const formatTimeTo12Hour = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

export const Form = ({ thisLister }) => {
    const [selectedService, setSelectedService] = useState({
        category: "",
        name: "",
        price: "",
        description: "",
    });
    const [dateSelected, setDateSelected] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [clientFirstname, setClientFirstname] = useState("");
    const [clientLastname, setClientLastname] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [specialNote, setSpecialNote] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleAppointmentRequest = async (e, listerId, firstname, lastname, email, selectedDate, selectedTime, selectedServices, listerEmail, listerName, listerUsername, specialNote) => {
        e.preventDefault();

        if (!selectedTime) {
            setError("Please select a time.");
            return;
        }

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
            services: [selectedServices.name],
            specialNote,
            }),
        });

        const data = await response.json();
        setAlertOpen(true);
        if (response.ok) {
            router.push(`/dashboard/${thisLister.username}`)
        } else {
            setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment.", response.error);
        }
        } catch (error) {
            setAlertOpen(true);
            console.error(error);
            setError("Something went wrong. Please try again.");
        }
    };


    return (
        <form 
            className="flex flex-col items-center py-5 gap-6"         
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handleAppointmentRequest(
                e,
                thisLister._id, 
                clientFirstname,
                clientLastname,
                clientEmail,
                dateSelected,
                selectedTime,
                selectedService,
                thisLister.email,
                thisLister.firstname,
                thisLister.username,
                specialNote,
            )}
        > 
            {/* CLIENT INFORMATION */}
            <section className="bg-white shadow-md dark:bg-[#878a88]/40 dark:shadow-none w-3/4 rounded-lg flex flex-col p-4">
                <h2 className="text-xl font-bold mb-6">Client Information</h2>
                <div className="mt-2">
                    <div className="flex flex-col md:flex-row gap-6">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={clientFirstname}
                            onChange={(e) => setClientFirstname(e.target.value)}
                            className="w-full border border-zinc-300 rounded-2xl p-2 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={clientLastname}
                            onChange={(e) => setClientLastname(e.target.value)}
                            className="w-full border border-zinc-300 rounded-2xl p-2 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
                <div className="mt-2">
                    <div className="flex flex-col md:flex-row gap-6">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full border border-zinc-300 rounded-2xl p-2 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="tel"
                            placeholder="Phone number"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full border border-zinc-300 rounded-2xl p-2 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
            </section>
            {/* SERVICE SELECTION */}
            <section className="bg-white shadow-md dark:bg-[#878a88]/40 dark:shadow-none w-3/4 rounded-lg flex flex-col p-4">
                <h2 className="text-xl font-bold mb-6">Service</h2>
                <div className="flex flex-col gap-6">
                    {thisLister.services?.map((category, categoryIndex) => (
                    <div key={categoryIndex}>

                        {/* CATEGORY TITLE */}
                        <div className="mb-3">
                        <h3 className="text-lg font-semibold">
                            {category.type}
                        </h3>
                        </div>

                        {/* SUBCATEGORY CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {category.subcategories?.map((service, serviceIndex) => {
                            const isSelected =
                            selectedService.name === service.name;

                            return (
                            <button
                                type="button"
                                key={serviceIndex}
                                onClick={() =>
                                setSelectedService({
                                    category: category.type,
                                    name: service.name,
                                    price: service.price,
                                    description: service.description,
                                })
                                }
                                className={`
                                text-left rounded-xl border p-2 transition-all text-white
                                ${
                                    isSelected
                                    ? "bg-blue-500 border-blue-500"
                                    : "bg-black hover:bg-blue-500"
                                }
                                `}
                            >
                                <div className="flex justify-between items-start gap-4">

                                <div>
                                    <h4 className="font-semibold text-lg">
                                    {service.name}
                                    </h4>

                                    {service.description && (
                                    <p className="text-sm text-zinc-500 mt-2">
                                        {service.description}
                                    </p>
                                    )}
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold">
                                    ${service.price}
                                    </p>
                                </div>
                                </div>
                            </button>
                            );
                        })}
                        </div>
                    </div>
                    ))}
                </div>
            </section>
            
            {/* DATE + TIME */}
            <section className="bg-white shadow-md dark:bg-[#878a88]/40 dark:shadow-none w-3/4 rounded-lg flex flex-col p-4">

                <h2 className="text-2xl font-bold mb-6">
                    Schedule
                </h2>

                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
                    
                    {/* CALENDAR */}
                    <div>
                    <h3 className="font-semibold text-lg mb-4">
                        Select Date
                    </h3>

                    <Calendar
                        isLister={false}
                        editingEnabled={false}
                        setSelectedDate={setDateSelected}
                        unavailableDays={[]}
                        onAvailabilityChange={null}
                    />
                    </div>

                    {/* TIME */}
                    <div>
                    <h3 className="font-semibold text-lg mb-4">
                        Select Time
                    </h3>

                    {dateSelected ? (
                        <TimeSelection
                            dateSelected={dateSelected}
                            selectedTime={selectedTime}
                            onSelectTime={setSelectedTime}
                            listerId={thisLister._id}
                            availability={thisLister.availability}
                            timeSlotInterval={
                                thisLister.timeSlotInterval
                            }
                        />
                    ) : (
                        <div className="h-fit min-h-[300px] border border-dashed border-zinc-300 rounded-3xl flex items-center justify-center text-zinc-400">
                        Select a date to view available times
                        </div>
                    )}
                    </div>
                </div>
            </section>

            {/* NOTES */}
            <section className="bg-white shadow-md dark:bg-[#878a88]/40 dark:shadow-none w-3/4 rounded-lg flex flex-col p-4">

                <h2 className="text-2xl font-bold mb-6">
                    Notes
                </h2>

                <textarea
                    placeholder="Add notes for this appointment..."
                    value={specialNote}
                    onChange={(e) =>
                    setSpecialNote(e.target.value)
                    }
                    className="w-full min-h-[160px] border border-dashed border-black dark:border-white rounded-2xl p-4 outline-none resize-none focus:ring-1 focus:ring-blue-500"
                />
            </section>
            {alertOpen && (
                <section className="bg-white shadow-md dark:bg-[#878a88]/40 dark:shadow-none w-3/4 rounded-lg flex flex-col p-4">
                    {error && (
                        <a className="p-2 rounded-md bg-red-500 text-white">{error}</a>
                    )}
                    {success && (
                        <a className="p-2 rounded-md bg-green-500 text-white">{success}</a>
                    )}
                </section>
            )}
            <button type="submit" className="w-3/4 btn btn-primary-alt">Create appointment</button>
        </form>
    );
};