import mongoose from "mongoose";

const ListerSchema = new mongoose.Schema ({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bannerPicture: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    username: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    language: {type: String, required: true},
    city: { type: String, required: true },
    state: { type: String, required: true }, 
    services: [
        {
            type: {type: String, required: true},
            subcategories: [
                { name: {type: String}, price: {type: String}, description: {type:String} },
            ],
        },
    ],
    instructions: {type: String, required: false},
    rating: {type: Number},
    description: {type: String, required: true},
    unavailableDays: [String],
});

export default mongoose.models.Lister || mongoose.model("Lister", ListerSchema);
