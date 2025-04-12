"use client";

import { useState, useEffect } from "react";
  
export default function Calendar({ isLister, editingEnabled, setSelectedDate, unavailableDays, onAvailabilityChange}) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendar, setCalendar] = useState({
      daysInMonth: [], // Initial empty array
      startDay: 0, // Default starting day
  });
  const handleDateSelection = (day) => {
    if (isLister && editingEnabled) {
      // Toggle date in unavailableDays
      const updated = unavailableDays.includes(day)
        ? unavailableDays.filter((d) => d !== day)
        : [...unavailableDays, day];

      onAvailabilityChange(updated);
    } else {
      setSelectedDay(day);
      const now = new Date();
      const selectedDate = new Date(now.getFullYear(), now.getMonth(), day).toISOString(); // .split("T")[0]; // Format: YYYY-MM-DD
      
      setSelectedDate(selectedDate); // Pass selected date to parent component
    }
  };

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed: January is 0

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the starting day of the current month (0 = Sunday, 1 = Monday, etc.)
    const startDay = new Date(year, month, 1).getDay();

    setCalendar({
      daysInMonth: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay,
    });
    }, []);

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
      
      {/* Calendar Days */}
      <div className="block md:hidden text-sm">
        <div className="grid grid-cols-7 gap-1 text-center mt-2 cursor-pointer">
          {/* Empty boxes for days before the 1st */}
          {Array.from({ length: calendar.startDay }).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}

          {/* Days of the month */}
          {calendar.daysInMonth.map((day) => {
            const now = new Date();
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const date = new Date(now.getFullYear(), now.getMonth(), day);
            const isPast = date < currentDate;

            const baseClass = "py-2 rounded";
            let className = "";
            let onClick = () => handleDateSelection(day);

            if (isPast) {
              className = `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
              onClick = () => {}; // Disable click
            } else if (unavailableDays.includes(day)) {
              className = `${baseClass} bg-purple-500 text-white hover:bg-red-600`;
            } else if (selectedDay === day) {
              className = `${baseClass} bg-blue-500 text-white`;
            } else {
              className = `${baseClass} bg-white text-black hover:bg-orange-500`;
            }

            return (
              <div key={day} className={className} onClick={onClick}>
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
            const now = new Date();
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const date = new Date(now.getFullYear(), now.getMonth(), day);
            const isPast = date < currentDate;

            const baseClass = "py-2 rounded";
            let className = "";
            let onClick = () => handleDateSelection(day);

            if (isPast) {
              className = `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
              onClick = () => {}; // Disable click
            } else if (unavailableDays.includes(day)) {
              className = `${baseClass} bg-purple-500 text-white hover:bg-red-600`;
            } else if (selectedDay === day) {
              className = `${baseClass} bg-blue-500 text-white`;
            } else {
              className = `${baseClass} bg-white text-black hover:bg-orange-500`;
            }

            return (
              <div key={day} className={className} onClick={onClick}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}