"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";


export default function Calendar({ appointments, listerId }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-based index
  const [calendar, setCalendar] = useState({ daysInMonth: [], startDay: 0 });
  const [acceptedAppointments, setAcceptedAppointments] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const router = useRouter();
  const today = new Date();

  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();

    setCalendar({ daysInMonth: Array.from({ length: daysInMonth }, (_, i) => i + 1), startDay });

    // Group accepted appointments by day
    const groupedAppointments = {};
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      if (
        appointment.status === "accepted" &&
        appointmentDate.getFullYear() === currentYear &&
        appointmentDate.getMonth() === currentMonth
      ) {
        const day = appointmentDate.getDate();
        if (!groupedAppointments[day]) {
          groupedAppointments[day] = [];
        }
        groupedAppointments[day].push(appointment);
      }
    });

    setAcceptedAppointments(groupedAppointments);
  }, [appointments, currentMonth, currentYear]);

  const handleAction = async (appointmentId, date, time, email, status) => {
    const response = await fetch(`/api/appointments/${listerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({appointmentId, date, time, email, status }),
    });

    if (!response.ok) {
      console.log("Error updated appointment.\n");
    } else {
      // refreshes the current page.
      location.reload();
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    setSelectedDay(null); // Reset selection on month change
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
    setSelectedDay(null); // Reset selection on month change
  };

  return (
    <section className="mt-4 px-3 flex flex-col md:flex-row gap-6 justify-center items-start">
      <div className="w-full md:w-3/4 max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        {/* Month & Year Header with Navigation */}
        <div className="flex justify-between items-center text-xl font-semibold text-gray-700 mb-4">
          <button onClick={handlePrevMonth} className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">
            <BiSolidLeftArrow />
          </button>
          <span>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
          <button onClick={handleNextMonth} className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">
            <BiSolidRightArrow />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-gray-600 font-medium text-sm border-b pb-2">
          <div className="text-center">Sun</div>
          <div className="text-center">Mon</div>
          <div className="text-center">Tue</div>
          <div className="text-center">Wed</div>
          <div className="text-center">Thu</div>
          <div className="text-center">Fri</div>
          <div className="text-center">Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mt-2">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: calendar.startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 md:h-20"></div>
          ))}

          {/* Days of the month */}
          {calendar.daysInMonth.map((day) => {
            const isPastDay = new Date(currentYear, currentMonth, day) < today;

            return (
              <div key={day} className="relative">
                <div
                  className={`relative h-12 md:h-16 lg:h-20 border rounded-lg flex items-start p-2 text-xs md:text-sm cursor-pointer
                    ${isPastDay ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300"}
                    ${acceptedAppointments[day] ? "border-blue-400" : ""}
                    ${selectedDay === day ? "bg-blue-300" : ""}`}
                  onClick={() => !isPastDay && setSelectedDay(day)}
                >
                  <span className="font-medium">{day}</span>

                  {/* Indicator for accepted appointments */}
                  {acceptedAppointments[day] && (
                    <div className="absolute bottom-1 left-2 right-2 bg-blue-500 text-white text-xs text-center md:py-1 rounded-md">
                      {acceptedAppointments[day].length}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Details Section */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow-lg p-3">
        <h2 className="text-md font-semibold mb-4">Appointments</h2>
        {selectedDay && acceptedAppointments[selectedDay] ? (
          acceptedAppointments[selectedDay].map((appointment, index) => {
            const apptDate = new Date(appointment.date);
            const isPastAppointment = apptDate < today;

            return (
              <div key={index} className="mb-4 p-3 border rounded-md bg-gray-50">
                <p className="font-bold">{appointment.firstname} {appointment.lastname}</p>
                <p>Time: {appointment.time}</p>
                <div className="flex gap-1">
                  <p>Requesting: </p>
                  {appointment.services.map((service) => (
                    <p key={appointment._id}>
                        {service}
                    </p>
                  ))}
                </div>
                {!isPastAppointment ? (
                  <button
                    className="mt-1 text-red-600 text-sm hover:underline"
                    onClick={() => handleAction(appointment._id, appointment.date, appointment.time, appointment.email, "canceled")}
                  >
                    Cancel Appointment
                  </button>
                ) : (
                  <p className="text-gray-500 text-xs">Past appointment</p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Click a marked date to view its upcoming appointments.</p>
        )}
      </div>
    </section>
  );
}