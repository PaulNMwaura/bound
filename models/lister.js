import mongoose from "mongoose";

const ListerSchema = new mongoose.Schema ({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bannerPicture: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    city: { type: String, required: true },
    state: { type: String, required: true }, 
    services: [
        {
            name: {type: String, required: true},
            price: {type: String},
            subcategories: [
                { name: {type: String}, price: {type: String}},
                { name: {type: String}, price: {type: String}},
            ],
        },
    ],
    rating: {type: Number},
    description: {type: String, required: true},
    unavailableDays: [String],
    appointments: [
        {
            firstname: {type: String, required: true},
            lastname: {type: String, required: true},
            services: [{ type: String, required: true }],
            email: { type: String, required: true },
            firstname: { type: String, required: true },
            lastname: { type: String, required: true },
            date: {type: String, required: true},
            time: {type: String, required: true},
            listerId: { type: mongoose.Schema.Types.ObjectId, required: true },
            status: {type: String , default: "pending"},
            status: {type: String , required: false},
        },
    ],
});

export default mongoose.models.Lister || mongoose.model("Lister", ListerSchema);
