import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, default: uuidv4 },
  firstname: { type: String, required: true},
  lastname: { type: String, required: true},
  phone: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  photoURL: { type: String},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);