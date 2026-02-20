"use client";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function ListerAvailabilityEditor({ availability, setFormData }) {

  const handleTimeChange = (day, index, field, value) => {
    setFormData((prev) => {
      const updatedDay = prev.availability[day].map((range, i) =>
        i === index ? { ...range, [field]: value } : range
      );

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: updatedDay,
        },
      };
    });
  };

  const addRange = (day) => {
    setFormData((prev) => {
      if (prev.availability[day].length > 5) return prev;
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: [
            ...prev.availability[day],
            { start: "09:00", end: "17:00" },
          ],
        },
      };
    });
  };

  const removeRange = (day, index) => {
    setFormData((prev) => {
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: prev.availability[day].filter((_, i) => i !== index),
        },
      };
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-center mb-4">
        Weekly Availability
      </h3>

      <div className="space-y-4">
        {WEEKDAYS.map((day) => (
          <div key={day} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <strong className="capitalize">{day}</strong>
              <button
                type="button"
                onClick={() => addRange(day)}
                className="text-sm text-blue-600"
              >
                + Add Time Range
              </button>
            </div>

            {availability[day].length === 0 && (
              <p className="text-xs text-gray-500">Unavailable</p>
            )}

            {availability[day].map((range, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="time"
                  value={range.start}
                  onChange={(e) =>
                    handleTimeChange(day, index, "start", e.target.value)
                  }
                  className="border p-1"
                />

                <span>-</span>

                <input
                  type="time"
                  value={range.end}
                  onChange={(e) =>
                    handleTimeChange(day, index, "end", e.target.value)
                  }
                  className="border p-1"
                />

                <button
                  type="button"
                  onClick={() => removeRange(day, index)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}