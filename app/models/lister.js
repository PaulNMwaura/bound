import mongoose from "mongoose";

const ListerSchema = new mongoose.Schema ({
    picture: {type: String},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    location: {type: String, required: true},
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
});

export default mongoose.models.Lister || mongoose.model("Lister", ListerSchema);

