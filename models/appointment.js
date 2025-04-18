import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  services: [{ type: String, required: true }],
  email: { type: String, required: true },
  date: {type: String, required: true},
  time: {type: String, required: true},
  listerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: {type: String , default: "pending"},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);