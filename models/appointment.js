import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listerId: { type: mongoose.Schema.Types.ObjectId, ref: "Lister", required: true },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  date: { type: Date, required: true }, // date is the day that the user has requested for the appointment
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);