"use client";
import { useState, useEffect } from "react";

export default function Appointments ({listerId}) {
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
        <div>
        <h1>Lister Dashboard</h1>
        <ul>
            {appointments.length > 0 && appointments?.map((appointment) => (
            <li key={appointment._id}>
                <p>User ID: {appointment.userId}</p>
                <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                <p>Status: {appointment.status}</p>
                {appointment.status === "pending" && (
                <>
                    <button onClick={() => handleAction(appointment._id, "accepted")}>Accept</button>
                    <button onClick={() => handleAction(appointment._id, "declined")}>Decline</button>
                </>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
};