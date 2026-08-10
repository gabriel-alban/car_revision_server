import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema({
    revision_title: {
        type: String,
        required: [true, "Revision title is required"],
    },
    revision_description: {
        type: String,
    },
    current_km_number: {
        type: Number,
        required: [true, "Current number of km"],
    },
    next_km_number: {
        type: Number,
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now,
    },
    sendAlert: {
        type: Boolean,
        default: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    },
});

export const Revision = mongoose.model('Revision', revisionSchema);