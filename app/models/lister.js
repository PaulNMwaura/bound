import mongoose from "mongoose";

const ListerSchema = new mongoose.Schema ({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    picture: {type: String},
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
    unavailableDays: {type: [Number], default: []},
    appointments: [
        {
            firstname: {type: String},
            lastname: {type: String},
            time: {type: String},
            service: {type: String},
            date: {type: String},
            status: {type: String , default: "pending"},
        },
    ],
});

export default mongoose.models.Lister || mongoose.model("Lister", ListerSchema);

