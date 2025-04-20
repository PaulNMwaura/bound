import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reportedUser : {type: String, required: true},
  reportedUserId: { type: String, required: true },
  reporterId: { type: String, required: true },
  reason: { type: String, required: true },
  explanation: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
