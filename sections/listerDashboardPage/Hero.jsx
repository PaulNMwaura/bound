"use client";
import { IoCalendar } from "react-icons/io5";
import { IoMdClock } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export const Hero = ({appointments, listerId, session}) => {
    const [updatedAppointments, setUpdatedAppointments] = useState(appointments);

    const router = useRouter();
    const handleAction = async (appointmentId, date, time, status, firstname, lastname, email) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        const response = await fetch(`/api/appointments/${listerId}`, {
        cache: "no-store",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({appointmentId, date, formattedDate, time, status, firstname, lastname, email }),
        });

        if (!response.ok) {
            console.log("Error updating appointment.\n");
        } else {
            // refreshes the current page.
            window.location.reload();
        }
    };

    return (
        <div className="container max-w-full mt-4">
            <h1 className="section-title text-center text-xl py-5">Manage Appointments</h1>
            <div className="h-[300px] overflow-y-scroll">                    
                <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                    {appointments
                    .filter(appointment => appointment.status === "pending")
                    .map((appointment, index) => (
                        <div key={index}>
                            <li key={appointment.index} className="px-4 py-4 shadow-md rounded-md">
                                <p>{appointment.firstname} {appointment.lastname}</p>
                                <p>Requesting {appointment.service}</p> 
                                <div className="py-4 flex flex-row justify-center gap-4 text-sm">
                                    <div className="flex flex-row items-center gap-2">
                                        <IoCalendar />
                                        <p>{new Date(appointment.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p> 
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <IoMdClock />
                                        <p>{appointment.time}</p>
                                    </div>
                                </div>
                                {/* <p>Request: {appointment.status} (ONLY SHOWING THIS FOR TESTING PURPOSES)</p> */}
                                <div className="flex justify-between">
                                    {/* handleAction paramaters is not correct */}
                                    <button onClick={() => handleAction(appointment._id, appointment.date, appointment.time, "accepted", appointment.firstname, appointment.lastname, appointment.email)} className="btn btn-primary text-xs bg-green-500">Accept</button>
                                    <button onClick={() => handleAction(appointment._id, appointment.date, appointment.time, "declined", appointment.firstname, appointment.lastname, appointment.email)} className="btn btn-primary text-xs bg-red-500">Decline</button>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};