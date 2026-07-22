import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    brand: {
        required: true,
        type: String,
    },
    model: {
        required: true,
        type: String,
    },
    km_range: {
        required: true,
        type: Number
    }
});

export const Car = mongoose.model('Car', carSchema);