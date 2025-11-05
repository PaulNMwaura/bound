"use client";
import { IoCalendar } from "react-icons/io5";
import { IoMdClock } from "react-icons/io";

export const Hero = ({appointments, listerId, session}) => {

    const handleAction = async (appointmentId, date, time, status, firstname, lastname, email, specialNote) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        const response = await fetch(`/api/appointments/${listerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, date, formattedDate, time, status, firstname, lastname, email, specialNote }),
        });

        if (!response.ok) {
            console.log("Error updating appointment.\n");
        } else {
            // refreshes the current page.
            window.location.reload();
        }
    };

    return (
        <div className="container max-w-full mt-4 pb-20">
            <h1 className="text-center font-bold text-xl py-5">Manage Appointments</h1>
            <div className="h-[500px] overflow-y-scroll">                    
                <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                    {appointments
                    .filter(appointment => appointment.status === "pending")
                    .map((appointment, index) => (
                        <div key={index}>
                            <li className="px-4 py-4 shadow-md rounded-md">
                                <div>
                                    <strong>Client</strong>
                                    <p>Name: {appointment.firstname} {appointment.lastname}</p>
                                    <p>Email: {appointment.email}</p>
                                </div>
                                <div className="py-1">
                                    <strong>Requesting</strong>
                                    {appointment.services.map((service, jndex) => (
                                        <p key={jndex}>
                                            {service}
                                        </p>
                                    ))}
                                </div>
                                {appointment.specialNote && (
                                    <div className="pt-1 flex flex-col">
                                        <strong className="text-center">Note from {appointment.firstname}</strong>
                                        <p className="text-start">{appointment.specialNote}</p>
                                    </div>
                                )}
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
                                <div className="flex justify-between">
                                    <button onClick={() => handleAction(appointment._id, appointment.date, appointment.time, "declined", appointment.firstname, appointment.lastname, appointment.email)} className="btn btn-primary text-xs">Decline</button>
                                    <button onClick={() => handleAction(appointment._id, appointment.date, appointment.time, "accepted", appointment.firstname, appointment.lastname, appointment.email)} className="btn btn-primary text-xs">Accept</button>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};