// "use client";

import { useState, useEffect, useRef } from "react";

interface CalendarState {
  daysInMonth: number[];
  startDay: number;
}

interface Appointment {
  firstname: string;
  lastname: string;
  time: string;
  date: string;
  status: string;
}

interface CalendarProps {
  appointments: Appointment[];
  onCancel: (date: string) => void;
}

export default function Calendar({ appointments, onCancel }: CalendarProps) {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [calendar, setCalendar] = useState<CalendarState>({
    daysInMonth: [],
    startDay: 0,
  });
  const [acceptedAppointments, setAcceptedAppointments] = useState<Record<number, Appointment[]>>({});
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();

    setCalendar({
      daysInMonth: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay,
    });

    const groupedAppointments: Record<number, Appointment[]> = {};
    appointments.map((appointment) => {
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

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent, day: number) => {
    setHoveredDay(day);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;

    if (tooltipRef.current) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;

      // Ensure tooltip stays within the viewport
      if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 1;
      }
      if (top + tooltipHeight > window.innerHeight) {
        top = rect.top + window.scrollY - tooltipHeight - 1;
      }
    }

    setTooltipPosition({ left, top });
  };

  return (
    <section className="mt-4 px-3">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Month & Year Header with Navigation */}
        <div className="flex justify-between items-center text-xl font-semibold text-gray-700 mb-4">
          <button onClick={handlePrevMonth} className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 rotate-180">➟</button>
          <span>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
          <button onClick={handleNextMonth} className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">➟</button>
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
          {Array.from({ length: calendar.startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 md:h-20"></div>
          ))}

          {calendar.daysInMonth.map((day) => (
            <div key={day} className="relative">
              <div
                className={`relative h-14 md:h-20 border rounded-lg flex items-start p-2 text-sm cursor-pointer ${
                  acceptedAppointments[day] ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"
                }`}
                onMouseEnter={(event) => handleMouseEnter(event, day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <span className="text-gray-700 font-medium">{day}</span>

                {acceptedAppointments[day] && (
                  <div className="absolute bottom-2 left-2 right-2 bg-blue-500 text-white text-sm text-center md:py-1 rounded md:rounded-md">
                    {acceptedAppointments[day].length}
                  </div>
                )}
              </div>

              {hoveredDay === day && acceptedAppointments[day] && (
                <div
                  ref={tooltipRef}
                  className="fixed z-10 bg-white shadow-lg p-3 rounded-md w-52 text-lg text-gray-700 border"
                  style={{ left: `${tooltipPosition.left}px`, top: `${tooltipPosition.top}px md:${tooltipPosition.top - 5}px` }}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {acceptedAppointments[day].map((appt, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <p className="font-bold">{appt.firstname} {appt.lastname}</p>
                      <p>Time: {appt.time}</p>
                      <button className="mt-1 text-red-600 text-xs hover:underline" onClick={() => onCancel(appt.date)}>
                        Cancel Appointment
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
