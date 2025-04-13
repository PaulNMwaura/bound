"use client";

import { useState, useEffect } from "react";
  
export default function Calendar({ isLister, editingEnabled, setSelectedDate, unavailableDays, onAvailabilityChange}) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendar, setCalendar] = useState({
      daysInMonth: [], // Initial empty array
      startDay: 0, // Default starting day
  });

  const isUnavailable = (day) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return unavailableDays.includes(dateStr);
  };

  const handleDateSelection = (day) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const fullDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (fullDate < today && year === today.getFullYear() && month === today.getMonth()) {
      return; // Prevent selection of past dates in the current month
    }
  
    if (isLister && editingEnabled) {
      // Toggle date in unavailableDays
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const dayString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      
      const updated = unavailableDays.includes(dayString)
        ? unavailableDays.filter((d) => d !== dayString)
        : [...unavailableDays, dayString];
  
      onAvailabilityChange(updated);
    } else {
      setSelectedDay(day);
      const selectedDate = fullDate.toISOString();
      setSelectedDate(selectedDate); // Pass ISO format to parent
    }
  };
  

  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
  
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
  
    setCalendar({
      daysInMonth: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay,
    });
  }, [viewDate]);

  return (
    <div className="max-w-md mx-auto p-2 md:p-4 bg-[#E4EBF3]/90 rounded-lg shadow">
      {/* Header: Days of the week */}
      <div className="block md:hidden text-sm">
        <div className="grid grid-cols-7 font-bold text-gray-700 gap-3 px-1">
          <div className="w-8 text-center">S</div>
          <div className="w-8 text-center">M</div>
          <div className="w-8 text-center">T</div>
          <div className="w-8 text-center">W</div>
          <div className="w-8 text-center">T</div>
          <div className="w-8 text-center">F</div>
          <div className="w-8 text-center">S</div>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="grid grid-cols-7 font-bold text-gray-700">
          <div className="w-12 text-center">Sun</div>
          <div className="w-12 text-center">Mon</div>
          <div className="w-12 text-center">Tue</div>
          <div className="w-12 text-center">Wed</div>
          <div className="w-12 text-center">Thu</div>
          <div className="w-12 text-center">Fri</div>
          <div className="w-12 text-center">Sat</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <button
          className="text-sm px-2 py-1 bg-orange-400 rounded disabled:opacity-50"
          onClick={() => setViewDate(new Date())}
          disabled={viewDate.getMonth() === new Date().getMonth()}
        >
          Current
        </button>
        <div className="font-semibold text-gray-700">
          {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
        </div>
        <button
          className="text-sm px-2 py-1 bg-orange-400 rounded disabled:opacity-50"
          onClick={() => {
            const nextMonth = new Date();
            nextMonth.setMonth(new Date().getMonth() + 1);
            setViewDate(nextMonth);
          }}
          disabled={viewDate.getMonth() !== new Date().getMonth()}
        >
          Next
        </button>
      </div>

      {/* Calendar Days */}
      <div className="block md:hidden text-sm">
        <div className="grid grid-cols-7 gap-1 text-center mt-2 cursor-pointer">
          {/* Empty boxes for days before the 1st */}
          {Array.from({ length: calendar.startDay }).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}

          {/* Days of the month */}
          {calendar.daysInMonth.map((day) => {
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();
            const fullDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize

            const isPast = fullDate < today && month === today.getMonth() && year === today.getFullYear();
            const baseClass = "py-2 rounded";
            let className = "";
            let onClick = () => handleDateSelection(day);

            if (isPast) {
              className = `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
              onClick = () => {};
            } else if (isUnavailable(day)) {
              className = `${baseClass} bg-purple-500 text-white hover:bg-red-600`;
            } else if (selectedDay === day) {
              className = `${baseClass} bg-blue-500 text-white`;
            } else {
              className = `${baseClass} bg-white text-black hover:bg-orange-500`;
            }

            return (
              <div key={day} className={className} onClick={onClick} aria-disabled={isPast}>
                {day}
              </div>
            );
          })}

        </div>
      </div>
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-1 text-center mt-2 cursor-pointer">
          {/* Empty boxes for days before the 1st */}
          {Array.from({ length: calendar.startDay }).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}

          {/* Days of the month */}
          {calendar.daysInMonth.map((day) => {
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();
            const fullDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize

            const isPast = fullDate < today && month === today.getMonth() && year === today.getFullYear();
            const baseClass = "py-2 rounded";
            let className = "";
            let onClick = () => handleDateSelection(day);

            if (isPast) {
              className = `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
              onClick = () => {};
            } else if (isUnavailable(day)) {
              className = `${baseClass} bg-purple-500 text-white hover:bg-red-600`;
            } else if (selectedDay === day) {
              className = `${baseClass} bg-blue-500 text-white`;
            } else {
              className = `${baseClass} bg-white text-black hover:bg-orange-500`;
            }

            return (
              <div key={day} className={className} onClick={onClick} aria-disabled={isPast}>
                {day}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}