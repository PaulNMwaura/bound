"use client";
import { useState, useEffect } from "react";

export const Hero = ({listerId}) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
        const response = await fetch(`/api/appointments/${listerId}`);
        const data = await response.json();
        console.log("data: ",data);
        setAppointments(Array.isArray(data.appointment) ? data.appointment : [data.appointment]);
        };

        fetchAppointments();
    }, [listerId]);

    // console.log(appointments);

    const handleAction = async (appointmentId, status) => {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        });

        if (response.ok) {
        setAppointments((prev) =>
            prev.map((appointment) =>
            appointment._id === appointmentId ? { ...appointment, status } : appointment
            )
        );
        }
    };

    return (
        <div className="container max-w-fit">
        <h1 className="section-title">Overview</h1>
        <ul className="flex flex-col md:flex-row md:gap-24">
            {appointments.length > 0 && appointments?.map((appointment) => (
            <li key={appointment._id} className="px-4 py-4 shadow-md rounded-md">
                <p>FIRSTNAME LASTNAME</p>
                <p>Requesting SERVICE on: {new Date(appointment.date).toDateString()}</p>
                <p>Request: {appointment.status}</p>
                {appointment.status === "pending" && (
                <div className="flex justify-between">
                    <button onClick={() => handleAction(appointment._id, "accepted")} className="btn btn-primary text-xs bg-green-500">Accept</button>
                    <button onClick={() => handleAction(appointment._id, "declined")} className="btn btn-primary text-xs bg-red-500">Decline</button>
                </div>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
};