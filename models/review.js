import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    listerId: { type: mongoose.Schema.Types.ObjectId, ref: "Lister", required: true },
    reviewerName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);