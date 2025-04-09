import { useState, useEffect } from "react";

export default function UnavailableDaysCalendar({ unavailableDays, onUnavailableDaysChange }) {
  const [calendar, setCalendar] = useState({
    daysInMonth: [],
    startDay: 0,
  });

  // Effect to initialize the calendar with the current month
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

  // Handle clicking on a day to toggle its availability
  const handleDayClick = (day) => {
    let updatedUnavailableDays;
    if (unavailableDays.includes(day)) {
      updatedUnavailableDays = unavailableDays.filter((d) => d !== day); // Remove the day
    } else {
      updatedUnavailableDays = [...unavailableDays, day]; // Add the day
    }
    onUnavailableDaysChange(updatedUnavailableDays); // Update the parent component's state
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-[#E4EBF3]/90 rounded-lg shadow">
      {/* Header: Days of the week */}
      <div className="grid grid-cols-7 font-bold text-gray-700">
        <div className="w-12 text-center">Sun</div>
        <div className="w-12 text-center">Mon</div>
        <div className="w-12 text-center">Tue</div>
        <div className="w-12 text-center">Wed</div>
        <div className="w-12 text-center">Thu</div>
        <div className="w-12 text-center">Fri</div>
        <div className="w-12 text-center">Sat</div>
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 text-center mt-2 cursor-pointer">
        {/* Empty boxes for days before the 1st */}
        {Array.from({ length: calendar.startDay }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}

        {/* Days of the month */}
        {calendar.daysInMonth.map((day) => (
          <div
            key={day}
            className={`py-2 rounded ${unavailableDays.includes(day) ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-300 text-black hover:bg-orange-500"} `}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}