import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, default: uuidv4 },
  username: { type: String, required: true, unique: true},
  firstname: { type: String, required: true},
  lastname: { type: String, required: true},
  phone: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);