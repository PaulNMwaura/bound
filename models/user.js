import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  firstname: { type: String, required: true},
  lastname: { type: String, required: true},
  phone: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);