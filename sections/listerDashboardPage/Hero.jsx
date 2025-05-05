"use client";
import { IoCalendar } from "react-icons/io5";
import { IoMdClock } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export const Hero = ({appointments, listerId, session}) => {
    const [specialNote, setSpecialNote] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const router = useRouter();

    const openDeclineModal = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

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
            <h1 className="section-title text-center text-xl py-5">Manage Appointments</h1>
            <div className="h-[315px] overflow-y-scroll">                    
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
                                    {appointment.services.map((service) => (
                                        <p key={appointment._id}>
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
                                {/* <p>Request: {appointment.status} (ONLY SHOWING THIS FOR TESTING PURPOSES)</p> */}
                                <div className="flex justify-between">
                                    {/* handleAction paramaters is not correct */}
                                    <button onClick={() => handleAction(appointment._id, appointment.date, appointment.time, "accepted", appointment.firstname, appointment.lastname, appointment.email)} className="btn btn-primary text-xs bg-green-500">Accept</button>
                                    <button onClick={() => openDeclineModal(appointment)} className="btn btn-primary text-xs bg-red-500">Decline</button>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
                    <div className="bg-white rounded-md p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Add a note for declining</h2>
                        <textarea
                        className="w-full h-24 p-2 border border-gray-300 rounded-md"
                        placeholder="Optional special note..."
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
                            <button onClick={() => handleAction(selectedAppointment._id, selectedAppointment.date, selectedAppointment.time, "declined", selectedAppointment.firstname, selectedAppointment.lastname, selectedAppointment.email, specialNote)} className="bg-red-500 text-white px-4 py-2 rounded-md">Confirm Decline</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};