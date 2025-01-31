"use client";
import { useState, useEffect } from "react";
import { appointments } from "@/app/appointmentTempData";
import { IoCalendar } from "react-icons/io5";
import { IoMdClock } from "react-icons/io";

export const Hero = ({listerId}) => {
    // const [appointments, setAppointments] = useState([]);

    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //     const response = await fetch(`/api/appointments/${listerId}`);
    //     const data = await response.json();
    //     console.log("data: ",data);
    //     setAppointments(Array.isArray(data.appointment) ? data.appointment : [data.appointment]);
    //     };

    //     fetchAppointments();
    // }, [listerId]);

    // console.log(appointments);

    // const handleAction = async (appointmentId, status) => {
    //     const response = await fetch(`/api/appointments/${appointmentId}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ status }),
    //     });

    //     if (response.ok) {
    //     setAppointments((prev) =>
    //         prev.map((appointment) =>
    //         appointment._id === appointmentId ? { ...appointment, status } : appointment
    //         )
    //     );
    //     }
    // };

    return (
        // <div>
        //     <h1 className="section-title py-5">Manage Appointments</h1>
        //     <ul className="flex flex-col md:flex-row md:gap-24 justify-center">
        //         {appointments.length > 0 && appointments?.map((appointment) => (
        //         <li key={appointment._id} className="px-4 py-4 shadow-md rounded-md">
        //             <p>FIRSTNAME LASTNAME</p>
        //             <p>Requesting SERVICE on: {new Date(appointment.date).toDateString()}</p>
        //             <p>Request: {appointment.status}</p>
        //             {appointment.status === "pending" && (
        //             <div className="flex justify-between">
        //                 <button onClick={() => handleAction(appointment._id, "accepted")} className="btn btn-primary text-xs bg-green-500">Accept</button>
        //                 <button onClick={() => handleAction(appointment._id, "declined")} className="btn btn-primary text-xs bg-red-500">Decline</button>
        //             </div>
        //             )}
        //         </li>
        //         ))}
        //     </ul>
        // </div>
        <div className="mt-4">
            <h1 className="section-title py-5">Manage Appointments</h1>
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
                                    <button onClick={() => handleAction(appointment.listerId, "accepted")} className="btn btn-primary text-xs bg-green-500">Accept</button>
                                    <button onClick={() => handleAction(appointment.listerId, "declined")} className="btn btn-primary text-xs bg-red-500">Decline</button>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};