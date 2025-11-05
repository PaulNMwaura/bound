import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  listerId: { type: mongoose.Schema.Types.ObjectId, ref: "Lister", required: true },
  service: { type: String, required: true },
  photo: { type: String, required: true },
},{timestamps:true});

export default mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);
