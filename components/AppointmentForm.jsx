import React, { useState } from "react";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";
import { redirect } from "next/navigation";

const formatTimeTo12Hour = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

export function AppointmentForm({ lister, formData, onChange, onClose, onSubmit, session }) {
  
  if(!session)
    redirect(`/profile/${lister.username}`);
  
  const today = new Date().toISOString().split("T")[0];
  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState(null);
  const handleAppointmentRequest = async (e, listerId, firstname, lastname, email, selectedDate, selectedTime, selectedServices, listerEmail, listerName, listerUsername, specialNote) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listerId,
          listerEmail,
          listerName,
          listerUsername,
          firstname,
          lastname,
          email,
          date: selectedDate,
          time: formatTimeTo12Hour(selectedTime),
          services: selectedServices,
          specialNote
        }),
      });

      const data = await response.json();
      setAlertOpen(true);
      if (response.ok) {
      } else {
        setError("Something went wrong. Make sure you have selected a date, time, and service/s before requesting an appointment.");
      }
    } catch (error) {
      setAlertOpen(true);
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/2 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <form
        className="bg-white shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-sm w-fit h-fit flex flex-col gap-2 items-center py-7 px-10 text-black"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => handleAppointmentRequest(
          e,
          lister._id, 
          session.user.firstname,
          session.user.lastname,
          session.user.email,
          formData.date,
          formData.time,
          formData.services,
          lister.email,
          lister.firstname,
          lister.username,
          formData.notes,
        )}
      >
        <strong>
          Fill this form in to request your appointment with {lister.firstname}
        </strong>

        {/* Services */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">What service/s are you looking for</label>
          <select
            name="services"
            multiple
            className="border border-black/25 p-2 w-[300px] text-xs h-fit"
            value={formData.services}
            onChange={onChange}
            required
          >
            {lister.services.map((service, index) => (
              <option key={index} value={service.name} className="p-1">
                {service.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-gray-500">
            Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac) to select multiple.
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Select Date</label>
          <input
            type="date"
            name="date"
            min={today}
            className="border border-black/25 p-2 w-[300px] text-xs"
            value={formData.date}
            onChange={onChange}
            required
          />
        </div>

        {/* Time */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Select Time</label>
          <input
            disabled={!formData.date}
            type="time"
            name="time"
            className="border border-black/25 p-2 w-[300px] text-xs"
            value={formData.time}
            onChange={onChange}
            required
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Any special notes?</label>
          <textarea
            name="notes"
            maxLength="50"
            className="border border-black/25 p-2 w-[300px] h-[60px] text-xs"
            value={formData.notes || ""}
            onChange={onChange}
          />
        </div>

        {/* Actions */}
        <div className="mt-auto pt-1 w-full flex justify-between">
          <button type="button" className="text-black font-medium" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            Request
          </button>
        </div>
      </form>
      {alertOpen == true && error == null && (
        <ConfirmationAlert message={"You're appointment has been requested. Check your inbox to confirm, and keep an eye on it for any changes or updates."} openAlert={setAlertOpen} />
      )}
      {error != null && (
        <ConfirmationAlert message={error} openAlert={setAlertOpen}/>
      )}
    </div>
  );
}
