import { useState, useEffect } from "react";

export default function UnavailableDaysCalendar({ unavailableDays, onUnavailableDaysChange }) {
  const [calendar, setCalendar] = useState({
    daysInMonth: [],
    startDay: 0,
    year: null,
    month: null,
  });

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    setCalendar({
      daysInMonth: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay,
      year,
      month,
    });
  }, []);

  const formatDate = (day) => {
    const { year, month } = calendar;
    const paddedMonth = String(month + 1).padStart(2, "0"); // add 1 because it's 0-indexed
    const paddedDay = String(day).padStart(2, "0");
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  const handleDayClick = (day) => {
    const dateStr = formatDate(day);
    let updatedUnavailableDays;
    if (unavailableDays.includes(dateStr)) {
      updatedUnavailableDays = unavailableDays.filter((d) => d !== dateStr);
    } else {
      updatedUnavailableDays = [...unavailableDays, dateStr];
    }
    onUnavailableDaysChange(updatedUnavailableDays);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-[#E4EBF3]/90 rounded-lg shadow">
      <div className="grid grid-cols-7 font-bold text-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="w-12 text-center">{dayName}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mt-2 cursor-pointer">
        {Array.from({ length: calendar.startDay }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}

        {calendar.daysInMonth.map((day) => {
          const dateStr = formatDate(day);
          const isUnavailable = unavailableDays.includes(dateStr);
          return (
            <div
              key={day}
              className={`py-2 rounded ${isUnavailable ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-300 text-black hover:bg-orange-500"}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
