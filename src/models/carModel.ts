import mongoose from "mongoose";
import { ICar } from "../types/car.js";

const carSchema = new mongoose.Schema<ICar>({
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
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export const Car = mongoose.model('Car', carSchema);