import { useMemo, useEffect, useState } from "react";

export default function TimeSelection({ dateSelected, selectedTime, onSelectTime, listerId, availability, timeSlotInterval }) {
  const [bookedTimes, setBookedTimes] = useState([]);

  // Fetch booked times for the selected date
  useEffect(() => {
    if (!dateSelected || !listerId) return;

    const fetchBookedTimes = async () => {
      try {
        const res = await fetch(`/api/appointments?listerId=${listerId}&date=${dateSelected}`);
        const data = await res.json();
        setBookedTimes(data.bookedTimes || []);
      } catch (err) {
        console.error("Error fetching booked times:", err);
        setBookedTimes([]);
      }
    };

    fetchBookedTimes();
  }, [dateSelected, listerId]);

  const times = useMemo(() => {
    if (!dateSelected || !availability) return [];

    const result = [];
    const now = new Date();
    const selectedDate = new Date(dateSelected);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Determine the day of the week
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const dayRanges = availability[dayName] || [];

    // Loop through each availability range
    const intervalMinutes = Number(timeSlotInterval) || 30;
    dayRanges.forEach(range => {
      const [startHour, startMin] = range.start.split(":").map(Number);
      const [endHour, endMin] = range.end.split(":").map(Number);

      let slot = new Date(selectedDate);
      slot.setHours(startHour, startMin, 0, 0);

      const endSlot = new Date(selectedDate);
      endSlot.setHours(endHour, endMin, 0, 0);

      while (slot.getTime() + intervalMinutes * 60000 <= endSlot.getTime()) {
        const timeString = slot.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Skip past times if today
        if (selectedDate.getTime() === today.getTime() && slot <= now) {
          slot.setMinutes(slot.getMinutes() + timeSlotInterval);
          continue;
        }

        // Skip booked times
        if (!bookedTimes.includes(timeString)) {
          result.push(timeString);
        }

        slot.setMinutes(slot.getMinutes() + timeSlotInterval); // 30-min interval
      }
    });

    return result;
  }, [dateSelected, availability, bookedTimes]);

  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="font-bold tracking-wider mb-2 text-center">Available Times to Book</p>

      {times.length === 0 ? (
        <p className="text-sm text-gray-500">No available times</p>
      ) : (
        <div className="w-[400px] max-w-fit overflow-x-auto">
          <div className="flex w-max gap-3 pb-2 snap-x snap-mandatory">
            {times.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => onSelectTime(time)}
                className={`snap-start shrink-0 whitespace-nowrap px-4 py-2 rounded-md border text-sm transition-all duration-200
                  ${
                    selectedTime === time
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black border-gray-300 hover:bg-orange-500"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}